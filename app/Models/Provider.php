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
        'address',
        'contact',
        'social_media',
        'manager_id',
        'filial_id',
        'user_id'

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
        return $this->hasMany(Provider::class, 'filial_id');
    }

    public function filials()
    {
        return $this->belongsTo(Provider::class, 'filial_id');
    }

    public function files()
    {
        return $this->hasMany(Files::class);
    }

}