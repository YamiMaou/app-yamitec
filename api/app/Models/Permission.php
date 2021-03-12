<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = "permissions";

    protected $fillable = [
        'module',
        'profile_id',
        'create',
        'read',
        'update',
        'delete',
    ];

    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}