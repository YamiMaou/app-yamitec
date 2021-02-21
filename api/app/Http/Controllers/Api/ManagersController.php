<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Manager;
use App\Extensions\ControllersExtends;

class ManagersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Manager::class, 'home');
    }

    // TESTE
    public function getAll()
    {
        $managers = Manager::all();
        return ['manager_list' => $managers];
    }
}
