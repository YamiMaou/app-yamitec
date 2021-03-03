<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;
use App\Models\Provider;

class ProvidersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Provider::class, 'home');
    }

    public function getAll()
    {
        $provider = Provider::all();
        return ['manager_list' => $provider];
    }   
}