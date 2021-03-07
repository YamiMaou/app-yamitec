<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccountManagersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(\App\Models\AccountManager::class, 'home');
    }
}
