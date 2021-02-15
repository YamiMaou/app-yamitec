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
        return $this->hasMany(Provider::class);
    }
}
