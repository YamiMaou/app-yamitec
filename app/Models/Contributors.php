<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contributors extends Model
{
    //
    protected $fillable = [
        'user_id',
        "cpf",
        'active',
        'username',
        'name',
        'function',
        'address',
        'social'
    ];

}
