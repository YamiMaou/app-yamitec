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

    public function providers()
    {
        return $this->belongsToMany(
            Provider::class,
            'contributor_providers',
            'contributor_id',
            'provider_id'
        );
    }

    public function manager(){
        return $this->hasOne(\App\Models\Manager::class,'cpf', 'cpf');
    }

    public function client(){
        return $this->hasOne(\App\Models\Client::class,'cpf', 'cpf');
    }

    // ALTERADO AQUI, INCLUSÃO DE MÉTODO by MARKUS 11/05
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function functions()
    {
        return $this->hasOne(Profile::class, 'id', 'function');
    }

}
