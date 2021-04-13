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
        $data = $this->model->with(['client', 'contributor'])->paginate($request->pageSize ?? 10)->withQueryString();
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
            })->with(['client', 'contributor'])->paginate($request->pageSize ?? 10)->withQueryString();
            //echo $data->toSql();
        }
        return $data;
    }

    public function show(Request $request, $id, $with=[])
    {
       return  parent::show($request, $id, ['user', 'providers','addresses', 'contacts', 'audits']);
    }
    public function store(Request $request)
    {
        if($request->providers == ""){
            //return response()->json(["success" => false, "message" => "Ao menos um Fornecedor deve ser vínculado"]);
        }
        if(User::where('email', $request->email)->count() > 0){
            return response()->json(["success" => false, "message" => "O E-mail informado já está cadastrado."]);
        }
        if(Manager::where('cpf', str_replace([".","-","_"],"",$request->cpf))->count() > 0){
            return response()->json(["success" => false, "message" => "O CPF informado já está cadastrado."]);
        }
        
        try {
            $data_user = [
                'name' => $request->name,
                'email' => $request->email,
                'profile_id' => 1, 
                'password' => Hash::make($request->cpf),
            ];
    
            $user = User::create($data_user);
    
            $data_manager = [
                'name' => $request->name,
                'cpf' => $request->cpf,
                'function' => $request->function,
                'active' => $request->active,
                'user_id' => $user->id,
            ];
    
            $manager = Manager::create($data_manager);
            if(!$manager){
                $user->delete();
                return response()->json(["success" => "false", "message" => "Problema ao cadastrar Responsável"]);
            }
            $data_contact = [
                'phone1' => $request->phone1,
                'phone2' => $request->phone2,
                'email' => $request->email,
                'linkedin' => $request->linkedin,
                'facebook' => $request->facebook,
                'instagram' => $request->instagram,
                'manager_id' => $manager->id,
            ];
    
            $contact = Contact::create($data_contact);
            if(!$contact){
                $user->delete();
                $manager->delete();
                return response()->json(["success" => "false", "message" => "Problema ao cadastrar Contato"]);
            }else{
                if($request->providers != "")
                $manager->providers()->attach(explode(',',$request->providers));
                parent::saveLog($manager->id, $request, 'manager');
            }
            return response()->json(["success"=> true, "type" => "show", "message" => "Cadastrado com Sucesso!"]);
        } catch(\Exception  $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }

    }

    public function update(Request $request, $id)
    {
        if(!isset($request->cpf)){
            return parent::update($request, $id);
        }
        try {
            $manager = Manager::findOrFail($id);

            $user = User::findOrFail($manager->user_id);

            $data_user = [
                'name' => $request->name,
                //'email' => $request->email,
                //'password' => Hash::make($request->cpf),
            ];
    
            $user->update($data_user);

            $data_manager = [
                'name' => $request->name,
                'cpf' => $request->cpf,
                'function' => $request->function,
                'active' => $request->active,
                'user_id' => $user->id,
            ];
    
            $manager->update($data_manager);
    
            $data_contact = [
                'phone1' => $request->phone1,
                'phone2' => $request->phone2,
                'email' => $request->email,
                'linkedin' => $request->linkedin,
                'facebook' => $request->facebook,
                'instagram' => $request->instagram,
                'manager_id' => $manager->id,
            ];

            $contact = Contact::where('manager_id', $manager->id);
    
            $contact->update($data_contact);
            parent::saveLog($id, $request, 'manager');
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