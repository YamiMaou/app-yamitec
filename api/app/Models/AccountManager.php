<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountManager extends Model
{
    protected $table = "account_managers";

    protected $fillable = [
        'cpf_cnpj',
        'name',
        'bill_type',
        'amount',
        'status',
        'note',
        'launch_date',
        'detached'
    ];

    public function audits()
    {
        return $this->hasOne(Audit::class,'accountmanager_id','id')->with(['user'])->latest();
    }

    public function client(){
        return $this->hasOne(Client::class,'cpf','cpf_cnpj');
    }

    public function provider(){
        return $this->hasOne(Provider::class,'cnpj','cpf_cnpj');
    }

    public function manager(){
        return $this->hasOne(Manager::class,'cpf','cpf_cnpj');
    }

    public function contributor(){
        return $this->hasOne(Contributor::class,'cpf','cpf_cnpj');
    }
}
