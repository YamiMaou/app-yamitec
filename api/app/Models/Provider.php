<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $table = "providers";

    protected $fillable = [
        'type',
        'active',
        'cnpj',
        'company_name',
        'fantasy_name',
        'matriz_id',
        'addr_clone',
        'contact_clone',
        'contract_clone'
    ];

    public function providerFiles()
    {
        return $this->hasMany(ProviderFiles::class);
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    public function managers()
    {
        return $this->belongsToMany(
            Manager::class,
            'manager_providers',
            'provider_id',
            'manager_id'
        );
    }

    public function clients()
    {
        return $this->belongsToMany(
            Client::class,
            'client_providers',
            'provider_id',
            'client_id'
        );
    }

    public function matriz()
    {
        return $this->belongsTo(Provider::class);
    }

    public function filials()
    {
        return $this->hasMany(Provider::class, 'matriz_id', 'id');
    }

    public function allfilials()
    {
        return $this->filials()->with('Allfilials');
    }

    public function root()
    {
        return $this->matriz ? $this->matriz->root() : $this;
    }

    public function files()
    {
        return $this->hasMany(Files::class);
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function contact()
    {
        return $this->hasOne(Address::class);
    }

}