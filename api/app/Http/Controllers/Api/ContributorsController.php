<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Contributors;
use App\Models\Post;
use App\User;
use GuzzleHttp\Psr7\Request;

use Illuminate\Http\Request as Req;

class ContributorsController extends ControllersExtends
{   
    public function __construct()
    {
        parent::__construct(Contributors::class, 'home');
        parent::setValidate([
            //"active" => "required",
            "name" => "required|max:50",
            "cpf" => "required|unique:contributors|max:11",
            'anexo' => 'required|mimes:jpg,png,pdf,xlx,csv|max:2048',
        ]);
    }
    public function show(Req $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['user']);
    }
}
