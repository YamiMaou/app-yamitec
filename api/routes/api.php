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
Route::post('/contributors/downloads', 'Api\ContributorsController@download');
Route::group(["middleware" => ['auth:api', 'scope:view-profile']], function(){
    // POSTS
    Route::resource('/posts', 'Api\PostsController');
    // COLABORATORS
    Route::resource('/contributors', 'Api\ContributorsController');
    
    // PROVIDERS
    Route::resource('/providers', 'Api\ProvidersController')->middleware(['auth:api', 'scope:view-posts']);
    // CONTRACT
    Route::resource('/contracts', 'Api\ContractController')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_FILES
    Route::resource('/provider/files', 'Api\ProviderFilesController')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_MANAGER
    Route::put('/providers/manager/{provider}/{manager}', 'Api\ProvidersController@addManageToProvider')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_ALL-AFFILIATES
    Route::get('/providers/affiliates/{provider_id}', 'Api\ProvidersController@allAffiliates')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_GET-PROVIDER
    Route::get('/providers/get/{provider_id}', 'Api\ProvidersController@getProvider')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_GET-MATRIX-BY-AFFILIATE-ID
    Route::get('/providers/affiliate/matrix/{affiliate_id}', 'Api\ProvidersController@getMatrizByAffiliateId')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_IS-MATRIX
    Route::get('/providers/show/matrix/{provider_id}', 'Api\ProvidersController@showMatrix')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_GET-FULL
    Route::get('/providers/show/matrix/full/{provider_id}', 'Api\ProvidersController@getFullProvider')->middleware(['auth:api', 'scope:view-posts']);
    // CLIENTS
    Route::resource('/clients', 'Api\ClientsController')->middleware(['auth:api', 'scope:view-posts']);
    // MANAGERS
    Route::resource('/managers', 'Api\ManagersController')->middleware(['auth:api', 'scope:view-posts']);
    // AUDIT
    Route::resource('/audits', 'Api\AuditsController');
});