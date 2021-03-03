<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProvidersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Provider::class, 'home');
    }

    public function store(Request $request){
        $validate = $request;
        
        $files = new \App\Http\Controllers\FilesController();
        $files = $files->multUpload($request, 'providers');
        $data = $files->request;
        //var_dump($data);
        //return response()->json(['success' => true],200);
        $providers = [
            "cnpj" => $request->cnpj,
            "company_name" => $request->company_name,
            "fantasy_name" => $request->fantasy_name,
            "function"=>$request->function,
            "active" => $request->active,
            "matriz" => $request->matriz,
            "type" => $request->type,
            "anexo" =>  $data['anexo'],
            "logo" =>  $data['logo'],
            'provider_id' => $request->provider_id,
            'user_id' => $request->user()->id,
            'username' => $request->user()->email,
        ];
        //$request['name'] = $data['name'] ?? null;
        $request['anexo'] = $data['file'] ?? null;

        $address = [
            "uf" => $request->uf,
            "city" => $request->city,
            "additional" => $request->additional,
            "street" => $request->street,
            "zipcode" => $request->zipcode,
        ];

        $contact = [
            "phone1" => $request->phone1,
            "phone2" => $request->phone2,
            "email" => $request->email,
            "linkedin" => $request->linkedin,
            "facebook" => $request->facebook,
            "instagram" => $request->instagram,
        ];

        $contract = [
            "accession_date" => $request->accession_date,
            "end_date" => $request->end_date,
            "rate" => $request->rate,
            "contributors_id" =>  5,
            "file_id" => 1
        ];
        parent::withAndChange([
            \App\Models\Provider::class => $providers ,
            \App\Models\Address::class => $address,
            \App\Models\Contact::class => $contact,
            \App\Models\Contract::class => $contract,
        ],
        ["permiss" => true, "key" => "providers_id"]);
        return parent::store($validate);
    }

    public function activate(Request $request)
    {
        try {
            $model = new Provider();

            $active = $request['active'];
            $id = $request['id'];

            $this->validate($request,[
                'active'=>'required|digits_between:0,1',
               ]);

            $provider = $model::find($id)->first();

            if ($provider):
                $model::where("id", $id)->update(['active' => $active]);
            endif;

            if ($active == '0'):
                return response()->json(["message" => "Desativado com sucesso!"]);
            else:
                return response()->json(["message" => "reativado com sucesso!"]);
            endif;
        } catch(\Exception $error) {
            return response()->json(["message" => "Erro: Não foi possível efeturar a operação", "error" => $error->getMessage(), 500]);
        }
    }

    // TESTE
    public function getManagerNameOfProvider()
    {
        $manager = Provider::find(201)->managers;

        return ['manager_name' => $manager[0]->name];
    }
}