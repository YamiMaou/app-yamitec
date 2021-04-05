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
    private $storeId = 0;

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
            })->paginate(10);
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
        if (count($this->validate) > 0) {
            $request->validate($this->validate);
        }
        $modelName = strtolower(str_replace('Model','',(new \ReflectionClass($this->model))->getShortName()));
                
        //var_dump( $request->all());
           // exit;
        try {
            if (count($this->with) > 0) {
                $files = new FilesController();
                $files = $files->multUpload($request, $modelName);
                $data = $files->request;
                $data['user_id'] = $request->user()->id;
                $data['username'] = $request->user()->email;
                unset($data["file"]);
                unset($data["_token"]);
                unset($data["_method"]);
                $i = 0;
                $primary = null;
                foreach ($this->with["data"] as $model => $fields) {
                    if ($i == 0) {
                        $primary = $this->model->create($fields);
                        $this->storeId = $primary;
                        $i++;
                        continue;
                    }
                    $i++;
                    $fields[$this->with["changes"]->key] = $primary->id;
                    //var_dump($fields);
                    $model::create($fields);
                }
            } else {
                $data = $request->all();
                $data['user_id'] = $request->user()->id;
                $data['username'] = $request->user()->email;
                unset($data["file"]);
                unset($data["_token"]);
                unset($data["_method"]);
                $this->storeId = $this->model->create($data);
                //FilesController::upload($request, $this->model, $obj->id);
            }

            $this->saveLog($this->storeId->id, $request, $modelName);
            return response()->json(["success"=> true, "type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["success"=> false, "type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 201);
        }
    }

    public function update(Request $request, $id)
    {
        $modelName = strtolower(str_replace('Model','',(new \ReflectionClass($this->model))->getShortName()));
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
            foreach($data as $k=>$d){
                if($d == "null")
                    $data[$k] = null;
            }
            //$data['user_id'] = $request->user()->id;
            unset($data["_token"]);
            unset($data["_method"]);
            unset($data["audits"]);
            unset($data["justification"]);
            unset($data["created_at"]);
            unset($data["updated_at"]);
            
            if (count($this->with) > 0) {
                $i = 0;
                foreach ($this->with["data"] as $model => $fields) {
                    foreach($fields as $k => $field){
                        if($field == null)
                            unset($fields[$k]);
                    }
                // echo ($i == 0 ? 'id' : $this->with["changes"]->key) . $id;
                   $model::where(($i == 0 ? 'id' : $this->with["changes"]->key), $id)->update($fields);
                    $i++;
                }
            } else {
                $this->model->where('id', $id)->update($data);
            }
            $this->saveLog($id, $request, $modelName);
            return response()->json(["success"=> true,"type" => "update", "message" => "Atualizado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["success"=> false,"type" => "error", "message" => "Problema ao Atualizar.", "error" => $error->getMessage(), "trace" => $error->getTraceAsString()], 200);
        }
    }

    public function destroy(Request $request, $id)
    {
        $modelName = strtolower(str_replace('Model','',(new \ReflectionClass($this->model))->getShortName()));
        $this->saveLog($id, $request, $modelName);
        try {
            $this->model->destroy($id);
            return response()->json(["type" => "delete", "message" => "Deletado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao Deletar. ", "trace" => $error->getMessage()], 200);
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

    public function saveLog($id, $request, $modelName = ""){
        $data =  $request->all();
        $just = $data['justification'] ?? ' ';
        unset($data['_method']);
        unset($data['justification']);
        $older = $this->model->where('id', $id )->first();
        $older = $older !== null ? $older->toArray() : [];
        $od = [];
        foreach($older as $key=>$value){
            if(isset($data[$key])){
                $od[$key] = $value;
            }
        }
        
        $to = json_encode($data);
        $from = json_encode($od);
        $audit = new Audit();
        $audit->create([
            'user_id' => $request->user()->id,
            $modelName.'_id' => $id,
            'justification'=> $just,
            'from' => $from,
            'to' => $to
        ]); 
    }
}
