<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Audit;
use App\Extensions\ControllersExtends;

class AuditsController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Audit::class, 'home');
    }
}