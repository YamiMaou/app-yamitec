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
        'anexo',
        'logo',
        'contact_clone',
        'contract_clone',
        'providertype_id'
    ];
    public function audits()
    {
        return $this->hasOne(Audit::class,'provider_id','id')->with(['user'])->latest();
    }

    public function providerFiles()
    {
        return $this->hasMany(ProviderFiles::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
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
        return $this->hasMany(Provider::class, 'matriz_id', 'id')->with(['contact', 'address']);
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
        return $this->hasMany(File::class);
    }

    public function file_logo()
    {
        return $this->hasOne(File::class,'id', 'logo')->latest();
    }
    public function file_anexo()
    {
        return $this->hasOne(File::class,'id', 'anexo')->latest();
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function contact()
    {
        return $this->hasOne(Contact::class);
    }

    public function providertype()
    {
        return $this->belongsTo(Providertype::class);
    }

}