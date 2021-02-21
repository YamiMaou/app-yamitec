<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClientProvider extends Model
{
    protected $table = "client_providers";

    protected $fillable = [
        'client_id',
        'provider_id',
    ];
}
