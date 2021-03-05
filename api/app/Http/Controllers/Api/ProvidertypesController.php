<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;
use App\Models\Providertype;

class ProvidertypesController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Providertype::class, 'home');
    }
}