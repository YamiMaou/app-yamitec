<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Client;
use App\Extensions\ControllersExtends;

class ClienController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Client::class, 'home');
    }

    // TESTE
    public function getAll()
    {
        $clients = Client::all();
        return ['client_list' => $clients];
    }
}
