<?php

namespace App\Extensions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Interfaces\ControllersInterface;
use Illuminate\Database\Eloquent\Model;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

abstract class ControllersExtends extends Controller implements ControllersInterface
{
    private $model = null;
    private $template = null;
    private $with = [];
    private $validate = [];

    public function __construct($model = null, $template = null)
    {
        $this->model = $model;
        $this->template = $template;
    }

    public function index()
    {
        if ($this->model === null || $this->template === null) {
            return response()->json(["message" => "parametros incorretos", "error" => "é necessário informar o Model e o Diretório de template do módulo para continuar."], 500);
        }

        $data = $this->model::all();
        return view("{$this->template}.index", ["data" => $data]);
    }

    public function create()
    {
        return view("{$this->template}.create");
    }

    public function edit($id)
    {
        $data = $this->model::where("id", $id)->first();
        return view("{$this->template}.edit", ["data" => $data]);
    }

    public function show(Request $request, $id, $with = [])
    {
        $data = $this->model::where("id", $id)->first();
        if (count($with) > 0) {
            $data = $this->model::with($with)->where("id", $id)->first();
        }
        return view("{$this->template}.details", ["data" => $data]);
    }

    public function store(Request $request)
    {
        if (count($this->validate) > 0) {
            $request->validate($this->validate);
        }

        try {
            $data = $request->all();
            unset($data["_token"]);
            unset($data["_method"]);
            if (count($this->with) > 0) {
                $i = 0;
                $primary = null;
                foreach ($this->with["data"] as $model => $fields) {
                    if ($i == 0) {
                        $primary = $this->model::create($fields);
                        $i++;
                        continue;
                    }
                    $i++;
                    $fields[$this->with["changes"]->key] = $primary->id;
                    $model::create($fields);
                }
            } else {
                $this->model::create($data);
            }
            return response()->json(["type" => "store", "message" => "Cadastrado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao Cadastrar. ", "error" => $error->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
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
            /*var_dump($this->validate);
            exit;*/
            $request->validate($this->validate);
        }

        try {
            $data = $request->all();
            unset($data["_token"]);
            unset($data["_method"]);
            if (count($this->with) > 0) {
                $i = 0;
                foreach ($this->with["data"] as $model => $fields) {
                    $model::where($i == 0 ? 'id' : $this->with["changes"]->key, $id)->update($fields);
                    $i++;
                }
            } else {
                $this->model::where('id', $id)->update($data);
            }
            return response()->json(["type" => "update", "message" => "Atualizado com Sucesso!"]);
        } catch (Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao Atualizar.", "error" => $error->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $this->model::destroy($id);
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
}
