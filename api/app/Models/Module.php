<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $table = "modules";

    protected $fillable = [
        'name',
        'key',
    ];

    public function audits()
    {
        return $this->belongsToMany(
            Audit::class,
            'audit_modules',
            'module_id',
            'audit_id'
        );
    }
}