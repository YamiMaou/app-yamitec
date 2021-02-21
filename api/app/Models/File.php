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
        'manager_id'
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function contributor()
    {
        return $this->belongsTo(Contributors::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }
}
