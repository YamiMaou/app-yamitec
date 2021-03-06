<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bonus extends Model
{
    protected $table = "bonuses";

    protected $fillable = [
        'indication_qtty',
        'discount_percent'
    ];
}
