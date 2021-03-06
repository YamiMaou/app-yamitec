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
        'client_id',
        'provider_id',
        'manager_id',
    ];

    public function contributors()
    {
        return $this->belongsTo(Contributors::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}