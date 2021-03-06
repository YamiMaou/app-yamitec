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
Route::post('reset', 'Api\UsersController@resetPassword');
Route::put('resetpwd', 'Api\AccountController@resetPassword');
Route::get('teste', function(Request $request){
    echo $request->provider_id;
});
// POSTS
/*Route::get('/posts', 'Api\PostsController@index')
    ->middleware(['auth:api', 'scope:view-posts']);
Route::put('/posts/{id}', 'Api\PostsController@update')
    ->middleware(['auth:api', 'scope:update-posts']);*/
    Route::get('reportxls', function (){
        //echo "ok";
        $data = "<table border='1'>";
        \App\Models\Audit::get(['id', 'user_id', 'justification', 'from', 'to'])->map(function($item) use($data) {
            $data .= "<td>{$item->id}</td>";
            $data .= "<td>{$item->justification}</td>";
            $data .= "<td>".($item->contributors_id ? "COLABORADORES": ($item->providers_id ? "FORNECEDORES" : ($item->managers_id ? "RESPONSÁVEL" : "NADA"))) ."</td>";
            //return array_values($item->toArray());
        });
        echo $data." ";
        return \App\Library\ExportClass::getXls($data);
    });
    Route::get('report', function (Request $request){
        //echo "ok";
       try{
        $model = \App\Models\Audit::with(['user']);
        if(isset($request->from) && $request->from != ""){
            if(!isset($request->to) && $request->to == "")
                $request->merge([
                    'to'=> $request->from
                ]);
            $model->whereBetween('created_at', [$request->from." 00:00:00", $request->to." 23:59:59"]);
        }
        if(isset($request->name) && $request->name != ""){
            $user = \App\User::where('name', 'like',"%{$request->name}%")->get();
            $model =$model->whereIn('user_id', $user->pluck('id'));
        }
        if(isset($request->email) && $request->email != ""){
            $user = \App\User::where('email', 'like',"%{$request->email}%")->get();
            $model =$model->whereIn('user_id', $user->pluck('id'));
        }
        
        $model = $model->get()->map(function($item) {
            return [
                'id' => $item->id,
                'date' => date('d/m/Y h:i:s',strtotime($item->created_at)),
                'name' => iconv("UTF-8", "ISO-8859-1//TRANSLIT",$item->user->name),
                'user' => $item->user->email,
                'justification' => iconv("UTF-8", "ISO-8859-1//TRANSLIT",$item->justification),
                'from' => implode(', ', array_map(
                    function ($v, $k) use($item){ 
                        $from = json_decode($item->from,true);
                        //echo $from[$k] ?? "Nothins";
                        if(!is_array($v) && !is_object($v)){
                            //echo $from[$k]?? "Nothins";
                            return sprintf("%s = \"%s\"", $k,iconv("UTF-8", "ISO-8859-1//TRANSLIT",$v)); 
                        }
                        
                    },
                    json_decode($item->from,true),
                    array_keys(json_decode($item->from,true))
                )),
                'to' => implode(', ', array_map(
                    function ($v, $k) use($item){ 
                        $from = json_decode($item->to,true);
                        //echo $from[$k] ?? "Nothins";
                        if(!is_array($v) && !is_object($v)){
                            //echo $from[$k]?? "Nothins";
                            return sprintf("%s = \"%s\"", $k, iconv("UTF-8", "ISO-8859-1//TRANSLIT",$v)); 
                        }
                        
                    },
                    json_decode($item->to,true),
                    array_keys(json_decode($item->to,true))
                ))
            ];//array_values($item->toArray());
        });
        //dd($model->get());
        //return response()->json($model);
        echo " ";
        return \App\Library\ExportClass::getCsv(['ID','Data','Nome','Usuario', 'Justificativa','De', 'Para'], $model);
    }catch(\Exception $ex){
        echo $ex->getMessage();
    }
    });
Route::post('/contributors/downloads', 'Api\ContributorsController@download');
Route::group(["middleware" => ['auth:api', 'scope:view-profile']], function(){
    // POSTS
    Route::resource('/posts', 'Api\PostsController');
    // COLABORATORS
    Route::resource('/contributors', 'Api\ContributorsController');
    // COLABORATORS
    Route::resource('/bonus', 'Api\BonusController');
    // COLABORATORS
    Route::resource('/accountmanager', 'Api\AccountManagersController');
    // PROVIDERS
    Route::resource('/providers', 'Api\ProvidersController')->middleware(['auth:api', 'scope:view-posts']);
    // CONTRACT
    Route::resource('/contracts', 'Api\ContractController')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_FILES
    Route::resource('/provider/files', 'Api\ProviderFilesController')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_MANAGER
    Route::put('/providers/manager/{provider}/{manager}', 'Api\ProvidersController@addManageToProvider')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_MANAGER-DESVINCULATE
    Route::post('/providers/manager/remove', 'Api\ProvidersController@removeManageToProvider')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_ALL-AFFILIATES
    Route::get('/providers/affiliates/{provider_id}', 'Api\ProvidersController@allAffiliates')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_GET-PROVIDER
    Route::get('/providers/get/{provider_id}', 'Api\ProvidersController@getProvider')->middleware(['auth:api', 'scope:view-posts']);
    // PROVIDER_SHOW
    Route::get('/providers/show/{provider_id}', 'Api\ProvidersController@show')->middleware(['auth:api', 'scope:view-posts']);
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
    // MANAGERS-GET-PROVIDERS           
    //Route::get('managers/', 'Api\ManagersController@getManagersByProvider')->middleware(['auth:api', 'scope:view-posts']);
    // AUDIT
    Route::resource('/audits', 'Api\AuditsController');
    // PROVIDETYPES
    Route::resource('/providertypes', 'Api\ProvidertypesController')->middleware(['auth:api', 'scope:view-posts']);
    // ACCOUNT_MANAGER
    Route::resource('/account-managers', 'Api\AccountManagersController')->middleware(['auth:api', 'scope:view-posts']);
    // BONUS
    Route::resource('/bonuses', 'Api\BonusesController')->middleware(['auth:api', 'scope:view-posts']);
    // PERMISSIONS
    Route::resource('/permissions', 'Api\PermissionsController')->middleware(['auth:api', 'scope:view-posts']);

    // PERFIS
    Route::resource('/function', 'Api\ProfilesController')->middleware(['auth:api', 'scope:view-posts']);
    
    // Rank
    Route::get('ranking', function(Request $request){
        $return = \App\Models\AccountManager::with(['client', 'manager', 'provider', 'contributor'])
        ->get()->map(function($item) {
            $type = "other";
            if($item->client != null)
                $type = "client";
            if($item->manager != null)
                $type = "manager";
            if($item->contributor != null)
                $type = "contributor";
            if($item->provider != null)
                $type = "provider";
            return [
                'id' => $item->id,
                'amount' => $item->bill_type == 2 ? -$item->amount : $item->amount,
                'type' => $type,
                'bill_type' => $item->bill_type,
            ];
        });
        
        $client = array_filter($return->toArray(), function($v, $k) {
            return $v['type'] =="cliente";
        }, ARRAY_FILTER_USE_BOTH);
        $provider = array_filter($return->toArray(), function($v, $k) {
            return $v['type'] == "provider";
        }, ARRAY_FILTER_USE_BOTH);
        $manager = array_filter($return->toArray(), function($v, $k) {
            return $v['type'] == "manager";
        }, ARRAY_FILTER_USE_BOTH);
        $contributor = array_filter($return->toArray(), function($v, $k) {
            return $v['type'] == "contributor";
        }, ARRAY_FILTER_USE_BOTH);
        $others = array_filter($return->toArray(), function($v, $k) {
            return $v['type'] == "other";
        }, ARRAY_FILTER_USE_BOTH);
        return response()->json([
            'client' => array_sum(array_column($client, 'amount')),
            'provider' => array_sum(array_column($provider, 'amount')),
            'manager' => array_sum(array_column($manager, 'amount')),
            'contributor' => array_sum(array_column($contributor, 'amount')),
            'other' => array_sum(array_column($others, 'amount')),
        ]);
    });
});

Route::group(["prefix" => "reports"/*,"middleware" => ['auth:api', 'scope:view-profile']*/], function(){
// REPORT RANKING PROVIDER
Route::get('/provider-ranking-data','Api\ReportController@providerRank');

// REPORT RANKING Client
Route::get('/client-ranking-data', 'Api\ReportController@clientRank');
// REPORT TESTE
Route::get('sales', 'Api\ReportController@reportSales');
Route::get('providers', 'Api\ReportController@reportProviders');
Route::get('client-ranking', 'Api\ReportController@reportClientRank');
Route::get('provider-ranking', 'Api\ReportController@reportProviderRank');
Route::get('audit-report', 'Api\AuditReportController@reportAudit');
});