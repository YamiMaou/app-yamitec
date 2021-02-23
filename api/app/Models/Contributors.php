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

    public function addresses()
    {
        return $this->hasOne(Address::class,'contributors_id');
    }

    public function contacts()
    {
        return $this->hasOne(Contact::class,'contributors_id');
    }
    public function user()
    {
        return $this->hasOne(\App\User::class, 'id','user_id');
    }  

    public function file()
    {
        return $this->hasOne(\App\Models\File::class, 'id','anexo');
    }  

}
