<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Contact;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ClientsController extends ControllersExtends
{
    public function __construct()
    {
         parent::__construct(Client::class, 'home');
         parent::setRelations(['manager', 'contributor']);
         parent::setValidate([
            "name" => "required|max:50",
            "cpf" => "required|unique:clients|max:11",
        ]);
    }

    // TESTE
    public function getAll()
    {
        $clients = Client::all();
        return ['client_list' => $clients];
    }

    public function show(Request $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['user', 'addresses', 'contacts', 'audits']);
    }

    public function store(Request $request)
    {
        $client = \App\Models\Client::where('cpf', $request->cpf)->first();
        $user = \App\User::where('email', $request->email)->first();
        if ($user):
            if ($user->email == $request->email)
                return response()->json(["success"=> false, "type" => "store", "message" => "E-mail já cadastrado!"]);
        endif;
        if ($client):
            if ($client->cpf == $request->cpf)
                return response()->json(["success"=> false, "type" => "store", "message" => "CPF já cadastrado!"]);
        endif;
        try {
            $data_user = [
                'name' => $request->name,
                'email' => $request->email,
                'profile_id' => 1, 
                'password' => Hash::make($request->cpf),
            ];
    
            $user = User::create($data_user);
    
            $data_client = [
                'name' => $request->name,
                'cpf' => $request->cpf,
                'birth_date' => $request->birth_date,
                'active' => $request->active,
                'note' => $request->note,
                'user_id' => $user->id,
            ];
    
            $client = Client::create($data_client);
    
            $data_address = [
                'zipcode' => $request->zipcode,
                'street' => $request->street,
                'city' => $request->city,
                'additional' => $request->additional,
                'uf' => $request->uf,
                'client_id' => $client->id,
            ];
            
            Address::create($data_address);
    
            $data_address = [
                'phone1' => $request->phone1,
                'phone2' => $request->phone2,
                'email' => $request->email,
                'linkedin' => $request->linkedin,
                'facebook' => $request->facebook,
                'instagram' => $request->instagram,
                'client_id' => $client->id,
            ];
    
            Contact::create($data_address);

            parent::saveLog($client->id, $request, 'client');
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
        $user = User::where('email', $resquest->email)->first();
        $is = \App\Models\Client::findOrFail($id);

        if((Client::where('cpf', $resquest->cpf)->count() > 0) && ($is->cpf != $resquest->cpf)){
            return response()->json(["success" => false, "message" => "O CPF informado já está cadastrado."]);
        }

        if($is && $user && $user->id != $is->user_id){
            return response()->json(["success" => false, "message" => "O E-mail informado já está cadastrado."]);
        }
        try {
            $client = Client::findOrFail($id);

            $user = User::findOrFail($client->user_id);

            $data_user = [
                'name' => $resquest->name,
                'email' => $resquest->email,
                //'password' => Hash::make($resquest->cpf),
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
                'additional' => $resquest->additional,
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
            parent::saveLog($id, $resquest, 'client');
            return response()->json(["success"=> true, "type" => "update", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }

    }
}

