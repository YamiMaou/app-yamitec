<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Bonus;

class BonusesController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Bonus::class, 'home');
        parent::setValidate([
            "indication_qtty" => "unique|bonuses",
        ]);
    }
}