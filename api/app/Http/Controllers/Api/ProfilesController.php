<?php

namespace App\Http\Controllers\Api;

use App\Extensions\ControllersExtends;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfilesController extends ControllersExtends
{
    public function __construct()
    {
        parent::__construct(\App\Models\Profile::class, 'home');
    }

    public function destroy(Request $request, $id)
    {
        $user = \App\User::where('profile_id', $id)->get();
        //return response()->json($user);
        if($user->count() > 0){
            return response()->json(['success' => false, "message" => "Há {$user->count()} usuário(s) associado(s)   a este perfil."]);
        }
        //return response()->json(['success' => true, "message" => "Excluído com sucesso"]);
        return parent::destroy($request, $id);
    }
}
