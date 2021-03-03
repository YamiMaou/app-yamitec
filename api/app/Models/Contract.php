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
        'contributor_id',
        'file_id',
        'providers_id',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function file()
    {
        return $this->belongsTo(File::class);
    }
}
