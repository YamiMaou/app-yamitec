<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manager extends Model
{
    
    protected $table = "managers";

    protected $fillable = [
        'active',
        'cpf',
        'name',
        'role',
        'address',
        'contact',
        'drugstore_group',
        'drugstore',
        'address',
        'email',
        'type',
        'condition',
        'user'
    ];
}
