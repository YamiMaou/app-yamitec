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
        'providertype_id',
        'audit_id'
    ];
    public function audits()
    {
        return $this->hasOne(Audit::class,'provider_id','id')->with(['user'])->latest();
    }

    public function burnFrom()
    {
        return $this->hasMany(Audit::class,'provider_id','id')->with(['user'])->get()->first();
    }

    public function providerFiles()
    {
        return $this->hasMany(ProviderFiles::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class)->with(['contributors']);
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

    public function matrizData()
    {
        return $this->hasOne(Provider::class, 'id', 'matriz_id');
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

    public function addresses()
    {
        return $this->hasOne(Address::class);
    }

    public function address(){
        return $this->hasOne(Address::class);
    }

    public function contact()
    {
        return $this->hasOne(Contact::class);
    }

    public function contacts()
    {
        return $this->hasOne(Contact::class);
    }

    public function providertype()
    {
        return $this->belongsTo(Providertype::class);
    }
    // verificar análoga acima
    public function audit()
    {
        return $this->belongsTo(Audit::class)->latest();
    }

    public function contributors()
    {
        return $this->belongsToMany(
            Contributor::class,
            'contributor_providers',
            'provider_id',
            'contributor_id'
        );
    }

    public function account_managers(){
        return $this->hasMany(AccountManager::class,'cpf_cnpj','cnpj');
    }

    public function account_managers_detached(){
        return $this->hasMany(AccountManager::class,'cpf_cnpj','cnpj')->where('detached',1);
    }
    public function account_managers_nodetached(){
        return $this->hasMany(AccountManager::class,'cpf_cnpj','cnpj')->where('detached',0);
    }

}