<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderFiles extends Model
{
    protected $table = "provider_files";

    protected $fillable = [
        'title',
        'path',
        'name',
        'provider_id',
        'user_id'
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
