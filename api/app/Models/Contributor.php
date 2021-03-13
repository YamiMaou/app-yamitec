<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contributor extends Model
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
        'birthdate',
        'justify',
        'audit_id'
    ];

    public function addresses()
    {
        return $this->hasOne(Address::class,'contributor_id');
    }

    public function contacts()
    {
        return $this->hasOne(Contact::class,'contributor_id');
    }
    public function user()
    {
        return $this->hasOne(\App\User::class, 'id','user_id');
    }  

    public function file()
    {
        return $this->hasOne(\App\Models\File::class, 'id','anexo')->latest();
    }  

    public function audits()
    {
        return $this->hasOne(Audit::class,'contributor_id','id')->with(['user'])->latest();
    }
    // verificar análoga acima
    public function audit()
    {
        return $this->belongsTo(Audit::class)->latest();
    }

}
