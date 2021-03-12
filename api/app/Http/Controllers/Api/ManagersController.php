<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;
use \App\User;

class ManagersController extends ControllersExtends
{
    public function __construct()
    {
       parent::__construct(Manager::class, 'home');
    }

    public function show(Request $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['user', 'providers','addresses', 'contacts', 'audits']);
    }
    public function store(Request $resquest)
    {
        try {
            $data_user = [
                'name' => $resquest->name,
                'email' => $resquest->email,
                'profile_id' => 1, 
                'password' => Hash::make($resquest->cpf),
            ];
    
            $user = User::create($data_user);
    
            $data_manager = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'function' => $resquest->function,
                'active' => $resquest->active,
                'user_id' => $user->id,
            ];
    
            $manager = Manager::create($data_manager);

            $data_address = [
                'zipcode' => $resquest->zipcode,
                'street' => $resquest->street,
                'additional' => $resquest->additional,
                'city' => $resquest->city,
                'uf' => $resquest->uf,
                'city' => $resquest->city,
                'manager_id' => $manager->id,
            ];
    
            Address::create($data_address);
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone2' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'manager_id' => $manager->id,
            ];
    
            Contact::create($data_contact);

            return response()->json(["success"=> true, "type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }

    }

    public function update(Request $resquest, $id)
    {
        if(!isset($resquest->cpf)){
            return parent::update($resquest, $id);
        }
        try {
            $manager = Manager::findOrFail($id);

            $user = User::findOrFail($manager->user_id);

            $data_user = [
                'name' => $resquest->name,
                //'email' => $resquest->email,
                //'password' => Hash::make($resquest->cpf),
            ];
    
            $user->update($data_user);

            $data_manager = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'function' => $resquest->function,
                'active' => $resquest->active,
                'user_id' => $user->id,
            ];
    
            $manager->update($data_manager);
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone2' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'manager_id' => $manager->id,
            ];

            $contact = Contact::where('client_id', $manager->id);
    
            $contact->update($data_contact);
            parent::saveLog($id, $resquest, 'manager');
            return response()->json(["success"=> true, "type" => "store", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }

    }
}