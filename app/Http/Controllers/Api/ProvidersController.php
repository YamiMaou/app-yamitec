<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Post;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProvidersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Provider::class, 'home');
    }
}