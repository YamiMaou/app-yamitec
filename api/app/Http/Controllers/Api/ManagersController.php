<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Models\Manager;
use Illuminate\Support\Facades\Hash;
use \App\User;

class ManagersController extends Controller
{
    public function __construct()
    {
       // parent::__construct(Manager::class, 'home');
    }

    public function store(Request $resquest)
    {
        try {
            $data_user = [
                'name' => $resquest->name,
                'email' => $resquest->email,
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
        try {
            $client = Client::findOrFail($id);

            $user = User::findOrFail($client->user_id);

            $data_user = [
                'name' => $resquest->name,
                'email' => $resquest->email,
                'password' => Hash::make($resquest->cpf),
            ];
    
            $user->update($data_user);

            $data_client = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'birth_date' => $resquest->birth_date,
                'active' => $resquest->active,
                'note' => $resquest->note,
                'user_id' => $user->id,
            ];

            $client->update($data_client);

            $data_address = [
                'zipcode' => $resquest->zipcode,
                'street' => $resquest->street,
                'city' => $resquest->city,
                'uf' => $resquest->uf,
                'client_id' => $client->id,
            ];
    
            $address = Address::where('client_id', $client->id);
            
            $address->update($data_address);
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone2' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'client_id' => $client->id,
            ];

            $contact = Contact::where('client_id', $client->id);
    
            $contact->update($data_contact);

            return response()->json(["success"=> true, "type" => "store", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }
}
