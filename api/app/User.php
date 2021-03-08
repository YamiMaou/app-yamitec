<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'profile_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token',
        'password'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function permissions(){
        return $this->hasMany(\App\Models\Permission::class, 'id', 'profile_id');
    }

    public function contributor(){
        return $this->hasOne(\App\Models\Contributors::class,'user_id', 'id');
    }

    public function provider(){
        return $this->hasOne(\App\Models\Provider::class,'user_id', 'id');
    }

    public function client(){
        return $this->hasOne(\App\Models\Client::class,'user_id', 'id');
    }

    public function manager(){
        return $this->hasOne(\App\Models\Manager::class,'user_id', 'id');
    }
}