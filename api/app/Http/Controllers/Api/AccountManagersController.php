<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccountManagersController extends ControllersExtends
{
    private $model;
    public function __construct()
    {
        $this->model = new \App\Models\AccountManager();
        parent::__construct(\App\Models\AccountManager::class, 'home');
    }

    public function index(Request $request)
    {
        $params = $request->all();
        unset($params['queryType']);
        unset($params['withId']);
        unset($params['page']);
        unset($params['pageSize']);
        $data = $this->model->with(['client', 'provider'])->paginate($request->pageSize)->withQueryString();
        if(count($params) > 0){
            $launch_from = $params['launch_date'] ?? '';
            $launch_to = $params['launch_date_to'] ?? '';
            unset($params['created_at']);
            unset($params['launch_date_to']);
            unset($params['launch_date']);
            $data = $this->model->where(function($query) use($launch_from, $launch_to){
                if(strlen($launch_from) > 8){
                    $query->where('launch_date','>=', $launch_from);
                }
                if(strlen($launch_to) > 8){
                    $query->where('launch_date','<=', $launch_to);
                }
            })->where(function($query) use($params, $request){
                foreach($params as $k=>$v){
                    if($request->queryType == "like"){
                        $query->where($k,'like', '%'.$v.'%');
                        if($k == $request->withId){
                            $query->orWhere('id','like', '%'.$v.'%');
                        }
                    }else{
                        $query->where($k,'=', $v);
                    }
                }
            })->paginate(10);
            //echo $data->toSql();
        }
        return $data;
    }

    public function show(Request $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['audits']);
    }
}
