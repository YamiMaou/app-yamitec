<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountManager extends Model
{
    protected $table = "account_managers";

    protected $fillable = [
        'cpf',
        'cnpj',
        'name',
        'bill_type',
        'amount',
        'status',
        'note',
        'launch_date'
    ];

    public function audits()
    {
        return $this->hasOne(Audit::class,'accountmanager_id','id')->with(['user'])->latest();
    }
}
