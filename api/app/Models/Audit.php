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
        'user_id', 
        'justification', 
        'from', 
        'to'
    ];
    //
    public function user()
    {
        return $this->hasOne(\App\User::class,'id', 'user_id')->latest();
    }
}
