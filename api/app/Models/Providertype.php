<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Providertype extends Model
{
    protected $table = "providertypes";

    protected $fillable = [
        'key',
        'name',
    ];

    public function providers()
    {
        return $this->hasMany(Provider::class);
    }
    
}

