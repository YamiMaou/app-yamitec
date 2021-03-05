<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $table = "contracts";

    protected $fillable = [
        'rate',
        'accession_date',
        'end_date',
        'provider_id',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
