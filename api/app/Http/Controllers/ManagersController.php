<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manager;

class ManagersController extends Controller
{
    public function __construct()
    {
        parent::__construct(Manager::class, 'home');
    }

    public function getAll()
    {
        $managers = Manager::all();
        return ['manager_list' => 'teste'];
    }
}
