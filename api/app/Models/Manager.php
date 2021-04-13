<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manager extends Model
{
    
    protected $table = "managers";

    protected $fillable = [
        'active',
        'cpf',
        'name',
        'function',
        'user_id',
        'audit_id'
    ];

    public function providers()
    {
        return $this->belongsToMany(
            Provider::class,
            'manager_providers',
            'manager_id',
            'provider_id'
        )->with('address', 'contact');
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
        return $this->hasOne(Audit::class,'manager_id','id')->with(['user'])->latest();
    }
    // veficar análoga acima
    public function audit()
    {
        return $this->belongsTo(Audit::class)->latest();
    }

    public function client(){
        return $this->hasOne(\App\Models\Client::class,'cpf', 'cpf');
    }

    public function contributor() {
        return $this->hasOne(\App\Models\Contributor::class,'cpf', 'cpf');
    }
}
