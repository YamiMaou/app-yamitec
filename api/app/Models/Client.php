<?php

namespace App\Models;

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
        'user_id'
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

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function contact()
    {
        return $this->hasOne(Address::class);
    }

}