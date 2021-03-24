<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BonusController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(\App\Models\Bonus::class, 'home');
    }

    public function store(Request $request){
        $request->merge([
            'discount_percent' => str_replace(',','.',$request->discount_percent),
        ]);
        return parent::store($request);
    }
}
