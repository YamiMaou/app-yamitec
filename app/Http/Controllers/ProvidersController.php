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
        $provider = Provider::find(201)->first();
        return ['manager_list' => $provider];
    }
}
