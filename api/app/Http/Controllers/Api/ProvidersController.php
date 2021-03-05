<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Contact;
use App\Models\Contract;
use App\Models\Manager;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProvidersController extends Controller
{
    public function __construct()
    {
        //parent::__construct(Provider::class, 'home');
    }

    public function store(Request $request)
    {
        try {

            $provider = DB::table('providers')->where('cnpj', $request->cnpj)->first();
            if ($provider):
                if ($provider->cnpj == $request->cnpj)
                    return response()->json(["CPF já cadastrado!"]);
            endif;

            // type = 1 para matriz e 0 para filial
            $provider_data = [
                "type" => $request->type,
                "active" => $request->active,
                "cnpj" => $request->cnpj,
                "company_name" => $request->company_name,
                "fantasy_name" => $request->fantasy_name,
                "matriz_id" => $request->matriz_id,
                "addr_clone" => $request->addr_clone ? true : false,
                "contact_clone" => $request->contact_clone ? true : false,
                "contract_clone" => $request->contract_clone ? true : false,
                "providertype_id" => $request->providertype_id
            ];

            $provider = Provider::create($provider_data);

            if ($request->addr_clone == null):
                $address_data = [
                    "uf" => $request->uf,
                    "city" => $request->city,
                    "additional" => $request->additional,
                    "street" => $request->street,
                    "zipcode" => $request->zipcode,
                    "provider_id" => $provider->id,
                ];

                Address::create($address_data);
            endif;

            // caso addr_clone == true, cadastra dados vazios ou default onde necessário
            if ($request->addr_clone == true):
                $address_data = [
                    "uf" => 'foo',
                    "city" => 'foo',
                    "street" => 'foo',
                    "zipcode" => 'foo',
                ];

                Address::create($address_data);
            endif;

            if ($request->contact_clone == null):
                $contact_data = [
                    "phone1" => $request->phone1,
                    "phone2" => $request->phone2,
                    "email" => $request->email,
                    "linkedin" => $request->linkedin,
                    "facebook" => $request->facebook,
                    "instagram" => $request->instagram,
                    "provider_id" => $provider->id,
                ];
    
                Contact::create($contact_data);
            endif;

            // caso contact_clone == true, cadastra dados vazios ou default onde necessário
            if ($request->contact_clone == true):
                $contact_data = [
                    "phone1" => 'foo',
                    "email" => 'foo',
                ];
    
                Contact::create($contact_data);
            endif;

            if ($request->contract_clone == null):
                $contract_data = [
                    "rate" => $request->rate,
                    "accession_date" => $request->accession_date,
                    "end_date" => $request->end_date,
                    "provider_id" => $provider->id,
                ];
    
                Contract::create($contract_data);
            endif;

            // caso contract_clone == true, cadastra dados vazios ou default onde necessário
            if ($request->contract_clone == true):
                $contract_data = [
                    "rate" => 10,
                    "accession_date" => date('NOW')
                ];
    
                Contract::create($contract_data);
            endif;

            return response()->json(["success"=> true, "type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }

    }

    public function update(Request $request, $id)
    {
        try {
            $provider = Provider::findOrFail($id);

            $provider_data = [
                "type" => $request->type,
                "active" => $request->active,
                "cnpj" => $request->cnpj,
                "company_name" => $request->company_name,
                "fantasy_name" => $request->fantasy_name,
                "matriz_id" => $request->matriz_id
            ];

            $provider->update($provider_data);

            if ($provider->addr_clone == false):
                $address = Address::where('provider_id', $provider->id);
            endif;

            $address_data = [
                "uf" => $request->uf,
                "city" => $request->city,
                "additional" => $request->additional,
                "street" => $request->street,
                "zipcode" => $request->zipcode,
                "provider_id" => $provider->id,
            ];

            if ($provider->addr_clone == false):
                $address->update($address_data);
            endif;

            if ($provider->contact_clone == false):
                $contact = Contact::where('provider_id', $provider->id);
            endif;

            $contact_data = [
                "phone1" => $request->phone1,
                "phone2" => $request->phone2,
                "email" => $request->email,
                "linkedin" => $request->linkedin,
                "facebook" => $request->facebook,
                "instagram" => $request->instagram,
                "provider_id" => $provider->id,
            ];

            if ($provider->contact_clone == false):
                $contact->update($contact_data);
            endif;

            if ($provider->contarct_clone == false):
                $contract = Contract::where('provider_id', $provider->id);
            endif;
            
            $contract_data = [
                "rate" => $request->rate,
                "accession_date" => $request->accession_date,
                "end_date" => $request->end_date,
                "provider_id" => $provider->id,
            ];
            
            if ($provider->contarct_clone == false):
                $contract->update($contract_data);
            endif;

            return response()->json(["success"=> true, "type" => "store", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }
    }

    // vincula um responsável à um provider
    public function addManageToProvider($provider_id, $manager_id)
    {
        try {
            $provider = Provider::findOrFail($provider_id);
            $manager = Manager::findOrFail($manager_id);
    
            if ($provider->managers->find($manager_id)):
              return response()->json(["success"=> false, "type" => "vinculate", "message" => "Responsável já é vinculado!"]);
            endif;

            $provider->managers()->attach($manager);

            return response()->json(["success"=> true, "type" => "vinculate", "message" => "Responsável vinculado com sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao vincular responsável. ", "error" => $error->getMessage()], 201);
        }
    }

    // busca todos os afiliados
    public function allAffiliates($provider_id)
    {
        $provider = Provider::findOrFail($provider_id);
        $affiliates = ['affiliates' => $provider->where('matriz_id', $provider_id)->get()];

        return response()->json($affiliates);
    }

    // get provider by id
    public function getProvider($provider_id)
    {
        $provider = Provider::findOrFail($provider_id);
        $matriz = ['provider' => $provider->where('id', $provider_id)->get()];

        return response()->json($matriz);
    }

    // busca matriz pelo id do afiliado
    public function getMatrizByAffiliateId($affiliate_id)
    {
        $provider = Provider::findOrFail($affiliate_id);
        $matriz = ['matriz' => $provider->matriz()->get()];

        return response()->json($matriz);
    }

    // mostra a provider caso seja matriz ou retorna vazio Matriz = 1
    public function showMatrix($provider_id)
    {
        try {
            $provider = Provider::findOrFail($provider_id);

            if ($provider->type == 1):
                return response()->json(['matrix' => $provider]);
            else:
                return response()->json([]);
            endif;
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Matriz não encontrada. ", "error" => $error->getMessage()], 201);
        }
    }

    // não sei o que faz esse método, acho que era pra afiliar mas ficou obsoleto uai
    public function affiliate(Request $request)
    {
        try {
            $provider = Provider::findOrFail($request->id);

            $provider_data = [
                "type" => $request->type,
                "active" => $request->active,
                "cnpj" => $request->cnpj,
                "company_name" => $request->company_name,
                "fantasy_name" => $request->fantasy_name,
                "matriz_id" => $provider->id
            ];

            $provider = Provider::create($provider_data);

            return response()->json(["success"=> true, "type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }

    }

    // mostra a provider com todos os dados e caso tenha clonado os dados da matriz, sera mostrado os dado clonados, não permitido alterar
    public function getFullProvider($provider_id)
    {
        try {
            $provider = Provider::findOrFail($provider_id);

            if ($provider->addr_clone == true):
                $addr = Address::where('provider_id', $provider->matriz_id)->get();
            else:
                $addr = Address::where('provider_id', $provider->id)->get();
            endif;

            if ($provider->contact_clone == true):
                $contact = Contact::where('provider_id', $provider->matriz_id)->get();
            else:
                $contact = Contact::where('provider_id', $provider->id)->get();
            endif;

            if ($provider->contract_clone == true):
                $contract = Contract::where('provider_id', $provider->matriz_id)->get();
            else:
                $contract = Contract::where('provider_id', $provider->id)->get();
            endif;

            return response()->json(['provider' => $provider, 'addr' => $addr, 'contact' => $contact, 'contract' => $contract]);
        } catch(\Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao obter provider. ", "error" => $error->getMessage()], 201);
        }
    }
}