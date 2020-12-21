<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/oauth/redirect', 'OAuthController@redirect');
Route::get('/oauth/callback', 'OAuthController@callback');
Route::get('/oauth/refresh', 'OAuthController@refresh');

Auth::routes();
Route::get('/welcome', function () {
    return view('welcome');
});
Route::resource('/', 'HomeController');
