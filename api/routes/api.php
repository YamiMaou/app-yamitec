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
Route::get('/', function(){
    echo json_encode(['message' => 'wellcome to Yamitec API', 'version' => '0.1', 'build' => '0.1.43' ]);
});
// AUTH
Route::post('login', 'Api\UsersController@login');
Route::post('register', 'Api\UsersController@register');
/*Route::group(['middleware' => ['auth:api', 'scope:update-posts']], function(){
    
});*/
// USER
Route::middleware(['auth:api', 'scope:view-user'])->get('/users', function (Request $request) {
    return $request->user();
});
Route::get('/profile', 'Api\UsersController@details')
    ->middleware(['auth:api', 'scope:view-profile']);

// POSTS
/*Route::get('/posts', 'Api\PostsController@index')
    ->middleware(['auth:api', 'scope:view-posts']);
Route::put('/posts/{id}', 'Api\PostsController@update')
    ->middleware(['auth:api', 'scope:update-posts']);*/
Route::group(["middleware" => ['auth:api', 'scope:view-profile']], function(){
    // POSTS
    Route::resource('/posts', 'Api\PostsController');
    // COLABORATORS
    Route::resource('/contributors', 'Api\ContributorsController');
    // PROVIDERS
    Route::resource('/providers', 'Api\ProvidersController@')->middleware(['auth:api', 'scope:view-posts']);
    // CONTRACT
    Route::resource('/contracts', 'Api\ContractController')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_FILES
    Route::resource('/provider/files', 'Api\ProviderFilesController')->middleware(['auth:api', 'scope:view-posts']);

});
/** teste */
Route::post('/providers/active', 'Api\ProvidersController@activate')
    ->middleware(['auth:api', 'scope:view-posts']);
/** teste */
Route::get('/providers/getname', 'Api\ProvidersController@getManagerNameOfProvider')
    ->middleware(['auth:api', 'scope:view-posts']);
/** teste */
Route::get('/managers/get', 'Api\ManagersController@getAll')
    ->middleware(['auth:api', 'scope:view-posts']);
