<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = "contacts";

    protected $fillable = [
        'phone1',
        'phone2',
        'email',
        'linkedin',
        'facebook',
        'instagram',
        'site',
        'contributors_id',
        'manager_id',
        'client_id',
        'provider_id',
    ];

    public function contributors()
    {
        return $this->belongsTo(Contributors::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class, 'manager_id', 'id');
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
