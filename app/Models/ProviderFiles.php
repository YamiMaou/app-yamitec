<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderFiles extends Model
{
    protected $table = "provider_files";

    protected $fillable = [
        'path',
        'name',
        'provider_id',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
