<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Extensions\ControllersExtends;
use App\Models\Address;
use App\Models\Contact;
use Illuminate\Support\Facades\Hash;
use \App\User;

class ClientsController extends Controller
{
    public function __construct()
    {
       // parent::__construct(Client::class, 'home');
    }

    // TESTE
    public function getAll()
    {
        $clients = Client::all();
        return ['client_list' => $clients];
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
    
            $data_client = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'birth_date' => $resquest->birth_date,
                'active' => $resquest->active,
                'note' => $resquest->note,
                'user_id' => $user->id,
            ];
    
            $client = Client::create($data_client);
    
            $data_address = [
                'zipcode' => $resquest->zipcode,
                'street' => $resquest->street,
                'city' => $resquest->city,
                'uf' => $resquest->uf,
                'client_id' => $client->id,
            ];
            
            Address::create($data_address);
    
            $data_address = [
                'phone1' => $resquest->phone1,
                'phone' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'client_id' => $client->id,
            ];
    
            Contact::create($data_address);

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
    
            $user = $user->update($data_user);

            $data_client = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'birth_date' => $resquest->birth_date,
                'active' => $resquest->active,
                'note' => $resquest->note,
                'user_id' => $user->id,
            ];

            $client = $client->update($data_client);

            $data_address = [
                'zipcode' => $resquest->zipcode,
                'street' => $resquest->street,
                'city' => $resquest->city,
                'uf' => $resquest->uf,
                'client_id' => $client->id,
            ];
    
            $address = Address::findOrFail($client->client_id);
            
            $address->update($data_address);
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone1' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'client_id' => $client->id,
            ];

            $contact = Contact::findOrFail($client->client_id);
    
            $contact->update($data_contact);

            return response()->json(["success"=> true, "type" => "store", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }

    }
}

