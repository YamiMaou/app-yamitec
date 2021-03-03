<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = ['contributors_id','user_id', 'justification', 'from', 'to'];
    //
}
