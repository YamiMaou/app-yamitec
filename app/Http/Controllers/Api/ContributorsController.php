<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Extensions\ControllersExtends;
use App\Models\Contributors;
use Illuminate\Http\Request;

class ContributorsController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Contributors::class, 'home');
        parent::setValidate([
            "active" => "required",
            "name" => "required|max:50",
            "cpf" => "required|unique:contributors|max:11"
        ]);
    }
}
