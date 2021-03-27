<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Models\Manager;
use App\Models\Provider;
use Illuminate\Support\Facades\Hash;
use \App\User;

class ManagersController extends ControllersExtends
{
    private $model;
    public function __construct()
    {
        $this->model = new \App\Models\Manager();
       parent::__construct(Manager::class, 'home');
    }
    public function index(Request $request)
    {
        if(isset($request->provider_id)){
            $provider = Provider::findOrFail($request->provider_id);
            $managers = $provider->managers()->where('managers.id' ,'>' ,0)->pluck('managers.id');
            $request->merge([
                'provider_id' => $managers
            ]);
        }
        
        $params = $request->all();
        unset($params['queryType']);
        unset($params['withId']);
        unset($params['page']);
        unset($params['pageSize']);
        $data = $this->model->paginate($request->pageSize)->withQueryString();
        if(count($params) > 0){
            $launch_from = $params['launch_date'] ?? '';
            $launch_to = $params['launch_date_to'] ?? '';
            $manager_ids =  $params['provider_id'] ?? '';
            unset($params['created_at']);
            unset($params['launch_date_to']);
            unset($params['launch_date']);
            unset($params['provider_id']);
            $data = $this->model->where(function($query) use($launch_from, $launch_to){
                if(strlen($launch_from) > 8){
                    $query->where('launch_date','>=', $launch_from);
                }
                if(strlen($launch_to) > 8){
                    $query->where('launch_date','<=', $launch_to);
                }
            })->where(function($query) use($params, $request, $manager_ids){
                if($manager_ids != ''){
                    $query->whereIn('id', $manager_ids);
                }
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
       return  parent::show($request, $id, ['user', 'providers','addresses', 'contacts', 'audits']);
    }
    public function store(Request $resquest)
    {
        try {
            $data_user = [
                'name' => $resquest->name,
                'email' => $resquest->email,
                'profile_id' => 1, 
                'password' => Hash::make($resquest->cpf),
            ];
    
            $user = User::create($data_user);
    
            $data_manager = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'function' => $resquest->function,
                'active' => $resquest->active,
                'user_id' => $user->id,
            ];
    
            $manager = Manager::create($data_manager);
            if(explode(',',$resquest->providers) !== null)
                $manager->providers()->attach(explode(',',$resquest->providers));

            /*$data_address = [
                'zipcode' => $resquest->zipcode,
                'street' => $resquest->street,
                'additional' => $resquest->additional,
                'city' => $resquest->city,
                'uf' => $resquest->uf,
                'city' => $resquest->city,
                'manager_id' => $manager->id,
            ];
    
            Address::create($data_address);*/
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone2' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'manager_id' => $manager->id,
            ];
    
            Contact::create($data_contact);

            parent::saveLog($manager->id, $resquest, 'manager');

            return response()->json(["success"=> true, "type" => "show", "message" => "Cadastrado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }

    }

    public function update(Request $resquest, $id)
    {
        if(!isset($resquest->cpf)){
            return parent::update($resquest, $id);
        }
        try {
            $manager = Manager::findOrFail($id);

            $user = User::findOrFail($manager->user_id);

            $data_user = [
                'name' => $resquest->name,
                //'email' => $resquest->email,
                //'password' => Hash::make($resquest->cpf),
            ];
    
            $user->update($data_user);

            $data_manager = [
                'name' => $resquest->name,
                'cpf' => $resquest->cpf,
                'function' => $resquest->function,
                'active' => $resquest->active,
                'user_id' => $user->id,
            ];
    
            $manager->update($data_manager);
    
            $data_contact = [
                'phone1' => $resquest->phone1,
                'phone2' => $resquest->phone2,
                'email' => $resquest->email,
                'linkedin' => $resquest->linkedin,
                'facebook' => $resquest->facebook,
                'instagram' => $resquest->instagram,
                'manager_id' => $manager->id,
            ];

            $contact = Contact::where('manager_id', $manager->id);
    
            $contact->update($data_contact);
            parent::saveLog($id, $resquest, 'manager');
            return response()->json(["success"=> true, "type" => "update", "message" => "Atualizado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Atualizar. ", "error" => $error->getMessage()], 201);
        }

    }

    public function getManagersByProvider(Request $request)
    {
       try {
            $provider = Provider::findOrFail($request->provider_id);

            $managers = $provider->managers()->get();

            return response()->json(["managers"=> $managers]);
       } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Pesquisar. ", "error" => $error->getMessage()], 201);
        }
    }
}