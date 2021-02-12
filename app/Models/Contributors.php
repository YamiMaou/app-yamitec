<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contributors extends Model
{
    //
    protected $fillable = [
        'active',
        'username',
        'name',
        'function',
        'address',
        'social'
    ];

}
