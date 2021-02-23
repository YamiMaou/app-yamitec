<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = "address";

    protected $fillable = [
        'zipcode',
        'street',
        'additional',
        'city',
        'uf',
        'contributors_id'
    ];

    public function contributors()
    {
        return $this->belongsTo(Contributors::class);
    }
}