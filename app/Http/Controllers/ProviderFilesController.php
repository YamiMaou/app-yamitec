<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;
use App\Models\ProviderFiles;

class ProviderFilesController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(ProviderFiles::class, 'home');
    }
}