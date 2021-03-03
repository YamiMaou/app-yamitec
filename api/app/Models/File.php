<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = "files";

    protected $fillable = [
        'title',
        'name',
        'path',
        'provider_id',
        'contributors_id',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id', 'id');
    }

    public function contributors()
    {
        return $this->belongsTo(Contributors::class);
    }

}
