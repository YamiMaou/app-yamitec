<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = "profiles";

    protected $fillable = [
        'name',
    ];

    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
