<?php

namespace App\Extensions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Interfaces\ControllersInterface;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\Controller;
use App\Http\Controllers\FilesController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Input;
//
use App\Models\Audit;

use function GuzzleHttp\json_encode;

abstract class ControllersExtends extends Controller implements ControllersInterface
{
    private $model = null;
    private $template = null;
    private $isApi = true;
    private $with = [];
    private $validate = [];

    public function __construct($model = null, $template = null, $isApi = true)
    {
        $this->model = new $model;
        $this->template = $template;
        $this->isApi = $isApi;
    }

    public function index(Request $request)
    {
        $params = $request->all();
        unset($params['queryType']);
        unset($params['withId']);
        unset($params['page']);
        unset($params['pageSize']);
        if ($this->model === null || $this->template === null) {
            return response()->json([
                "message" => "parametros incorretos", 
                "error" => "é necessário informar o Model e o Diretório de template do módulo para continuar."], 500);
        }
        $data = $this->model->paginate($request->pageSize)->withQueryString();
        if(count($params) > 0){
            $createdAt = $params['created_at'] ?? '';
            unset($params['created_at']);
            $data = $this->model->where(function($query) use($createdAt){
                if(strlen($createdAt) > 8){
                    $query->where('created_at','like', $createdAt.'%');
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
            })->paginate($request->pageSize);
            //echo $data->toSql();
        }

        
        return $this->isApi ? $data : view("{$this->template}.index", ["data" => $data]);
    }

    public function create()
    {
        return view("{$this->template}.create");
    }

    public function edit($id)
    {
        $data = $this->model->where("id", $id)->first();
        return $this->isApi ? $data : view("{$this->template}.edit", ["data" => $data]);
    }

    public function show(Request $request, $id, $with = [])
    {
        $data = $this->model->where("id", $id)->first();
        if (count($with) > 0) {
            $data = $this->model->with($with)->where("id", $id)->first();
        }
        return $this->isApi ? $data : view("{$this->template}.details", ["data" => $data]);
    }

    public function store(Request $request)
    {
        /*echo "<pre>";
        var_dump($request->all());
        exit;*/

        if (count($this->validate) > 0) {
            $request->validate($this->validate);
        }

        try {
            $modelName = str_replace('Controller','',(new \ReflectionClass($this))->getShortName());
            $files = new FilesController();
            $files = $files->multUpload($request, $modelName);
            $data = $files->request;
            $data['user_id'] = $request->user()->id;
            $data['username'] = $request->user()->email;
            
            unset($data["_token"]);
            unset($data["_method"]);
            if (count($this->with) > 0) {
                $i = 0;
                $primary = null;
                foreach ($this->with["data"] as $model => $fields) {
                    if ($i == 0) {
                        $primary = $this->model->create($fields);
                        $i++;
                        continue;
                    }
                    $i++;
                    $fields[$this->with["changes"]->key] = $primary->id;
                    $model->create($fields);
                }
            } else {
                $obj = $this->model->create($data);
                //FilesController::upload($request, $this->model, $obj->id);
            }
            return response()->json(["success"=> true, "type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }
    }

    public function update(Request $request, $id)
    {
        $modelName = str_replace('Controller','',(new \ReflectionClass($this))->getShortName());
        if (count($this->validate) > 0) {
            foreach ($this->validate as $k => $val) {
                $regras = "";
                foreach (explode("|", $val) as $rule) {
                    if (strpos($rule, "unique") === 0) {
                        $regras = "{$rule},id,{$id}";
                    } else {
                        $regras = "{$rule}";
                    }
                }
                $this->validate[$k] = $regras;
            }
            $request->validate($this->validate);
        }
        try {
            $files = new FilesController();
            $files = $files->multUpload($request, $modelName, $id);
            $data = $files->request;
            $data['user_id'] = $request->user()->id;
            $this->saveLog($id, $request);
            
            unset($data["_token"]);
            unset($data["_method"]);
            unset($data["justification"]);
            
            if (count($this->with) > 0) {
                $i = 0;
                foreach ($this->with["data"] as $model => $fields) {
                    $model->where($i == 0 ? 'id' : $this->with["changes"]->key, $id)->update($fields);
                    $i++;
                }
            } else {
                $this->model->where('id', $id)->update($data);
            }
           
            return response()->json(["success"=> true,"type" => "update", "message" => "Atualizado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["success"=> false,"type" => "error", "message" => "Problema ao Atualizar.", "error" => $error->getMessage(), "trace" => $error->getTraceAsString()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $this->saveLog($id, $request);
        try {
            $this->model->destroy($id);
            $break = isset($_COOKIE['url']) ? $_COOKIE['url'] : "/home";
            $break = str_replace(['https', 'http', '://'], '', $break);
            $break = explode("/", $break);
            return response()->json(["type" => "delete", "message" => "Deletado com Sucesso!", "url" => "/".$break[1]]);
        } catch (Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao Deletar. "], 500);
        }
    }

    public function withAndChange($modules = [], $changes = ["permiss" => false, "key" => ""])
    {
        $this->with = ["data" => $modules, "changes" => (object) $changes];
    }
    public function setValidate(array $validate)
    {
        $this->validate = $validate;
        return $this;
    }

    public function saveLog($id, $request){
        $data =  $request->all();
        $olderData = $this->model->where('id', $id )->first();
        $to = json_encode($olderData);
        $from = json_encode($olderData);
        $audit = new Audit();
        $audit->create([
            'user_id' => $request->user()->id,
            'justification'=> $data['justification'],
            'from' => $from,
            'to' => $to
        ]); 
    }
}
