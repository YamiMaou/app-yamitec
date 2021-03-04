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
        'user_id'
    ];

    public function providers()
    {
        return $this->belongsToMany(
            Provider::class,
            'manager_providers',
            'manager_id',
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
        return $this->hasOne(\App\Models\Audit::class,'managers_id')->latest();
    } 
}
