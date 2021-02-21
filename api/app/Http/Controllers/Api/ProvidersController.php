<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProvidersController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(Provider::class, 'home');
    }

    public function activate(Request $request)
    {
        try {
            $model = new Provider();

            $active = $request['active'];
            $id = $request['id'];

            $this->validate($request,[
                'active'=>'required|digits_between:0,1',
               ]);

            $provider = $model::find($id)->first();

            if ($provider):
                $model::where("id", $id)->update(['active' => $active]);
            endif;

            if ($active == '0'):
                return response()->json(["message" => "Desativado com sucesso!"]);
            else:
                return response()->json(["message" => "reativado com sucesso!"]);
            endif;
        } catch(\Exception $error) {
            return response()->json(["message" => "Erro: Não foi possível efeturar a operação", "error" => $error->getMessage(), 500]);
        }
    }

    // TESTE
    public function getManagerNameOfProvider()
    {
        $manager = Provider::find(201)->managers;

        return ['manager_name' => $manager[0]->name];
    }
}