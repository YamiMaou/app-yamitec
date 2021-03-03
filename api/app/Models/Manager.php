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

    public function address()
    {
        return $this->hasOne(Address::class, 'manager_id', 'id');
    }

    public function contact()
    {
        return $this->hasOne(Contact::class, 'contact_id', 'id');
    }
}
