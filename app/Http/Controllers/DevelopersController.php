<?php

namespace App\Http\Controllers;

use App\Extensions\ControllersExtends;
use Illuminate\Http\Request;

class DevelopersController extends ControllersExtends
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    private $model = \App\Post::class;
    private $template = "developers";
    public function __construct()
    {
        $this->middleware('auth');
        parent::__construct($this->model, $this->template);
        /*parent::setValidate([
            "name" => "required",
            "rg" => "required|unique:employees",
            "cpf" => "required|unique:employees",
            "email" => "required",
            "phone" => "required",
            "account_number" => "required",
            "cargo" => "required",
            "zipcode" => "required",
            "number" => "required",
        ]);*/
    }
}