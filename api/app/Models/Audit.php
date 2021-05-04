<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = [
        'provider_id',
        'client_id',
        'manager_id',
        'contributor_id',
        'accountmanager_id',
        'bonus_id',
        'user_id', 
        'justification', 
        'from', 
        'to'
    ];
    

    public function user()
    {
        return $this->hasOne(\App\User::class,'id', 'user_id')->with(['contributor']);
    }

    public function provider()
    {
        return $this->hasOne(Provider::class)->latest();
    }

    public function client()
    {
        return $this->hasOne(Client::class)->latest();
    }

    public function manager()
    {
        return $this->hasOne(Manager::class)->latest();
    }

    public function contributor()
    {
        return $this->hasOne(Contributor::class)->latest();
    }
}
