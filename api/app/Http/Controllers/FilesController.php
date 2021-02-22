<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\File;

use Illuminate\Support\Facades\Storage as Storage;

class FilesController extends Controller
{
    private $file;
    private $pathClass;
    private $publicStorege;

    public function __construct()
    {
        $this->file = new File();
        $this->pathClass = "App\Models\\";
        $this->publicStorege = "uploads/";
    }

    public function get($id)
    {
        $file = $this->file::find($id)->first();
        return ['file' => $file];
    }

    public function getAll()
    {
        $fileList = $this->file->all();
        return ['file_list' => $fileList];
    }

    /** model e id do model */
    static public function upload(Request $request, $model, $id)
    {
        $function = new \ReflectionClass($model);
        $modelName = $function->getShortName();

        try {
            $request->validate([
                'file' => 'required|mimes:jpg,png,pdf,xlx,csv|max:2048',
            ]);
            
            $fileName = time().'.'.$request->file->extension();  
    
            $path = $request->file("file")->storeAs("uploads", $fileName);
        
            $foreign  = strtolower($modelName).'_id';
            $model = $this->pathClass.$model;

            if ($model::find($id)->first()):
                $request[$foreign] = $id;
                $request['path'] = $path;
                $request['name'] = $fileName;

                $this->file->create($request->all());
            endif;
    
            return response()->json(["type" => "store", "message" => "Cadastrado com sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao cadastrar. ", "error" => $error->getMessage()], 500);
        }
    }

    public function multUpload(Request $request, $model, $id = 0)
    {
        try {
            $lrequest = [];
            foreach ($request->all() as $k => $v) {
                $lrequest[$k] = $v;
                if ($request->hasFile($k)) {
                    $fileName = time() . '.' . $request->file($k)->extension();

                    $path = $request->file($k)->storeAs("uploads", $fileName);

                    $foreign  = isset($model) ?? strtolower($model) . '_id';
                    $model = $this->pathClass . $model;
                        $request[$foreign] = $id;
                        $request['path'] = $path;
                        $request['name'] = $fileName;
                        $create = $this->file->create($request->all());
                        $lrequest[$k] = $create->id;
                        unset($request[$foreign]);
                        unset($request['path']);
                        unset($request['name']);
                    continue;
                }
            }

            return (Object) ["type" => "upload", "message" => "Arquivos Armazenados com sucesso!", "request" => $lrequest ];
        } catch (\Exception $error) {
            return (Object) ["type" => "error", "request" => [], "message" => "Problema ao armazenar arquivos. ", "error" => $error->getMessage()];
        }
    }

    public function download(Request $request)
    {
       return Storage::download($this->publicStorege.$request['file_name']);
    }

    public function delete(Request $request, $id)
    {
        try {
            
            if ($this->file::find($id)->first()):
                if (Storage::delete($this->publicStorege.$request['file_name'])):
                    $this->file->destroy($id);
                endif;
            endif;

            return response()->json(["type" => "delete", "message" => "Removido com sucesso!"]);
        } catch(\Exception $error) {
            return response()->json(["type" => "error", "message" => "Problema ao remover. ", "error" => $error->getMessage()], 500);
        }
    }
}
