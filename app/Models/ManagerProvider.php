<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManagerProvider extends Model
{
    protected $table = "manager_providers";

    protected $fillable = [
        'manager_id',
        'provider_id',
    ];
}
