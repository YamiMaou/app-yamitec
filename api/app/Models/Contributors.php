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

    public function address()
    {
        return $this->hasMany(Address::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

}
