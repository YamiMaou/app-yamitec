<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $table = "providers";

    protected $fillable = [
        'type',
        'cnpj',
        'company_name',
        'fantasy_name',
        'address',
        'contact',
        'active'
    ];

    public function providerFiles()
    {
        return $this->hasMany(ProviderFiles::class);
    }
}
