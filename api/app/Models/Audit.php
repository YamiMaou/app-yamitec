<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = [
        'providers_id',
        'clients_id',
        'managers_id',
        'contributors_id',
        'user_id', 
        'justification', 
        'from', 
        'to'
    ];
    //
}
