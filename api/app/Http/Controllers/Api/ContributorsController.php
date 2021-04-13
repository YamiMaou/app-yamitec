<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Contributor;
use App\Models\Post;
use App\User;
use GuzzleHttp\Psr7\Request;

use Illuminate\Http\Request as Req;

class ContributorsController extends ControllersExtends
{   
    public function __construct()
    {
        parent::__construct(Contributor::class, 'home');
        parent::setRelations(['manager', 'client']);
        parent::setValidate([
            "name" => "required|max:50",
            "cpf" => "required|unique:contributors|max:11",
            'file' => 'required|mimes:jpg,png,pdf,xlx,csv|max:2048',
        ]);
    }
    
    public function show(Req $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['user', 'file', 'addresses', 'contacts', 'audits']);
    }

    public function update(Req $request, $id)
    {
        //$validate = $request;
        if(!isset($request->cpf)){
            //print_r($validate->all());
            //$validate["user_id"] = $request->user()->id;
            return parent::update($request, $id);
        }
        $files = new \App\Http\Controllers\FilesController();
        $files = $files->multUpload($request, 'contributor', $id);
        $data = $files->request;
        $contributors = [
            //"user_id" => $request->user()->id,
            "cpf" => $request->cpf,
            "name" => $request->name,
            "birthdate"=> $request->birthdate,
            "function"=>$request->function,
            "active" => $request->active,
            "anexo" => $data['file'] == "[object Object]" ? $data['anexo'] : $data['file'],
        ];
        $request['name'] = $data['name'] ?? null;
        //$request['anexo'] = $data['anexo'] ?? null;

        $address = [
            "uf" => $request->uf,
            "city" => $request->city,
            "additional" => $request->additional ?? "",
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
        parent::withAndChange([
            \App\Models\Contributor::class => $contributors,
            \App\Models\Address::class => $address,
            \App\Models\Contact::class => $contact,
        ],
        ["permiss" => true, "key" => "contributors_id"]);

        return parent::update($request, $id);
    }   

    public function store(Req $request){
        $validate = $request;
        $files = new \App\Http\Controllers\FilesController();
        $files = $files->multUpload($request, 'contributor');
        $data = $files->request;
        //var_dump($request);
        $contributors = [
            "cpf" => $request->cpf,
            "name" => $data['name'],
            "birthdate"=> $request->birthdate,
            "function"=>$request->function,
            "active" => $request->active,
            "anexo" =>  $data['file'],
            'user_id' => $request->user()->id,
            'username' => $request->user()->email,
        ];
        $request['name'] = $data['name'] ?? null;
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
        parent::withAndChange([
            \App\Models\Contributor::class => $contributors,
            \App\Models\Address::class => $address,
            \App\Models\Contact::class => $contact,
        ],
        ["permiss" => true, "key" => "contributors_id"]);
        return parent::store($validate);
    }
    
    public function Download(Req $request)
    {
        ob_end_clean();
        $files = new \App\Http\Controllers\FilesController();
        return $files->download($request);
    }
}
