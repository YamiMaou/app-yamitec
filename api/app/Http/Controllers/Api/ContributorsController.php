<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Contributors;
use App\Models\Post;

class ContributorsController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Contributors::class, 'home');
        parent::setValidate([
            "active" => "required",
            "name" => "required|max:50",
            "cpf" => "required|unique:contributors|max:11",
            'anexo' => 'required|mimes:jpg,png,pdf,xlx,csv|max:2048',
        ]);
    }
}
