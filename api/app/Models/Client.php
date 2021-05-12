<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = "clients";

    protected $fillable = [
        'name',
        'cpf',
        'birth_date',
        'active',
        'note',
        'user_id',
        'audit_id'
    ];

    public function providers()
    {
        return $this->belongsToMany(
            Provider::class,
            'client_providers',
            'client_id',
            'provider_id'
        );
    }

    public function addresses()
    {
        return $this->hasOne(Address::class);
    }

    public function contacts()
    {
        return $this->hasOne(Contact::class);
    }

    public function user()
    {
        return $this->hasOne(\App\User::class,'id', 'user_id');
    }

    public function audits()
    {
        return $this->hasOne(Audit::class,'client_id','id')->with(['user'])->latest();
    }
    // verificar análoga acima
    public function audit()
    {
        return $this->belongsTo(Audit::class)->latest();
    }
    public function manager(){
        return $this->hasOne(\App\Models\Manager::class,'cpf', 'cpf');
    }

    public function contributor() {
        return $this->hasOne(\App\Models\Contributor::class,'cpf', 'cpf');
    }

    public function account_managers(){
        return $this->hasMany(AccountManager::class,'cpf_cnpj','cpf');
    }

}