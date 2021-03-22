<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContributorProvider extends Model
{
    protected $table = "contributor_providers";

    protected $fillable = [
        'contributor_id',
        'provider_id',
    ];
}
