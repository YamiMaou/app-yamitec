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
        'contact',
        'anexo',
        'birthdate'
    ];

    public function user()
    {
        return $this->hasOne(\App\User::class, 'id','user_id');
    }  

}
