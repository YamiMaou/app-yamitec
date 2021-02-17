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
        'role',
        'address',
        'contact',
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

    public function files()
    {
        return $this->hasMany(Files::class);
    }
}
