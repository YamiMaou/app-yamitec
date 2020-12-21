<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'Api\UsersController@login');
Route::post('register', 'Api\UsersController@register');

Route::middleware(['auth:api', 'scope:view-user'])->get('/users', function (Request $request) {
    return $request->user();
});

Route::get('/posts', 'Api\PostsController@index')
    ->middleware(['auth:api', 'scope:view-posts']);

Route::get('/profile', 'Api\UsersController@show')
    ->middleware(['auth:api', 'scope:view-profile']);
