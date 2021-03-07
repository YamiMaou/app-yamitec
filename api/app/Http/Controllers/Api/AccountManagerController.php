<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\AccountManager;

class AccountManagerController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(AccountManager::class, 'home');
    }
}