<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;

class PostsController extends ControllersExtends
{
    private $model = Post::class;
    private $template = "posts";
    public function __construct()
    {
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
