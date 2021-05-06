<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Extensions\ControllersExtends;
use App\Models\Permission;
use Symfony\Component\HttpKernel\Profiler\Profiler;

class PermissionsController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Permission::class, 'home');
    }

    public function index(Request $request){

        return response()->json([
            'permissions' => \App\Models\Permission::all(),
            'profiles' => \App\Models\Profile::all(),
            'modules' => \App\Models\Module::all()
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            //return response()->json($request->create === "true");
                //return response()->json($permission);
                $model = Permission::where('profile_id',$request->profile_id )
                    ->where('module_id', $request->module_id)->first();
                    //return response()->json($model);
                if($model != null){
                    $actual = [];
                    $actual['profile_id'] = $request->profile_id;
                    $actual['module_id'] = $request->module_id;
                    $actual['create'] = ($request->create === "true" || $request->create === "1")  ? 1 : 0;
                    $actual['read'] = ($request->read === "true"|| $request->read === "1") ? 1 : 0;
                    $actual['update'] = ($request->update === "true"|| $request->update === "1") ? 1 : 0;
                    $actual['delete'] = ($request->delete === "true"|| $request->delete === "1") ? 1 : 0;
                    //return response()->json($model);
                    Permission::where('id',$model->id)->update($actual);
                    return response()->json(["success"=> true, "message" => "{$model->id} Atualizado com sucesso!"]);
                }
                
                $actual = $model ?? new Permission();
                $actual->profile_id = $request->profile_id;
                $actual->module_id = $request->module_id;
                $actual->create = $request->create == true ? 1 : 0;
                $actual->read = $request->read == true ? 1 : 0;
                $actual->update = $request->update == true ? 1 : 0;
                $actual->delete = $request->delete == true ? 1 : 0;
                $actual->save();
            return response()->json(["success"=> true, "message" => "Atualizado com sucesso!"]);
            
            /*$permission = Permission::findOrFail($id);
            //$profile_id = $permission->get()->first();

            if ($permission->profile_id == $request->profile_id):
               //self::update($request, $id);
               $permission->update($request->all());
               return response()->json(["success"=> true, "message" => "Atualizado com sucesso!"]);
            else:
                Permission::create($request->all());
               return response()->json(["success"=> true, "message" => "Criado com sucesso!"]);

            endif;*/

        } catch(\Exception $error) {
            return response()->json(["success"=> false,"type" => "error", "message" => "Problema ao Atualizar.", "error" => $error->getMessage(), "trace" => $error->getTraceAsString()], 500);
        }
    }
}