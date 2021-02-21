<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contract;
use App\Extensions\ControllersExtends;

class ContractController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Contract::class, 'home');
    }
}