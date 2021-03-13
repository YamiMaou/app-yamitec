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

    public function update(Request $request, $id)
    {
        try {

            $permission = Permission::findOrFail($id);
            $profile_id = $permission->get()->first();

            if ($profile_id->profile_id == $request->profile_id):
               //self::update($request, $id);
               $permission->update($request->all());
               return response()->json(["success"=> true, "message" => "Atualizado com sucesso!"]);
            else:
                Permission::create($request->all());
               return response()->json(["success"=> true, "message" => "Criado com sucesso!"]);

            endif;

        } catch(\Exception $error) {
            return response()->json(["success"=> false,"type" => "error", "message" => "Problema ao Atualizar.", "error" => $error->getMessage(), "trace" => $error->getTraceAsString()], 500);
        }
    }
}