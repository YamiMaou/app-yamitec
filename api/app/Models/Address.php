<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = "addresses";

    protected $fillable = [
        'zipcode',
        'street',
        'additional',
        'city',
        'uf',
        'contributors_id',
        'providers_id'
    ];

    public function contributors()
    {
        return $this->belongsTo(Contributors::class);
    }
}