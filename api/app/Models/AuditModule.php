<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditModule extends Model
{
    protected $table = "audit_modules";

    protected $fillable = [
        'audit_id',
        'module_id',
    ];
}
