<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Mail\ResetPassword;
use Illuminate\Support\Facades\Mail;

class AccountController extends Controller
{
    public function checkEmail(Request $request)
    {
        $user = User::where('email', '=', $request->email)->first();
        
        if (!$user) {
            return redirect()->back()->withErrors(['email' => "Esse usuario não existe"]);
        }

        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Str::random(60),
            'created_at' => Carbon::now()
        ]);

        $tokenData = DB::table('password_resets')->where('email', $request->email)->first();

        if ($this->sendResetEmail($user->email, $tokenData->token)):
            return response()->json(["success" => true, "type" => "email", "message" => "E-mail recuperado com Sucesso!"]);

        else:
            return response()->json(["success" => false, "type" => "error", "message" => "Whoops houve um problema na rede"], 500);
        endif;
    }

    private function sendResetEmail($email, $token)
    { 
        $user = User::where('email', $email)->first();

        $link = url("/") . '/password/recovery/'.$token;
        
        try {
            $email = new ResetPassword($user, $link);
            Mail::send($email);
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|confirmed',
            'token' => 'required'
        ]);
        if ($validator->fails()):
            return response()->json(["success" => false, "type" => "error", "message" => "Erro de autenticação"], 302);
        endif;

        $password = $request->password;
        $tokenData = DB::table('password_resets')->where('token', $request->token)->first();
            
        if (!$tokenData):
            return response()->json(["success" => false, "type" => "error", "message" => "Token Inválido"], 302);
        endif;

        $user = User::where('email', $tokenData->email)->first();

        if (!$user):
            return response()->json(["success" => false, "type" => "error", "message" => "Erro de autenticação"], 302);
        endif;

        $user->password = Hash::make($password);
        $user->update();

        DB::table('password_resets')->where('email', $user->email)->delete();

        if ($user->password):
            //return redirect()->route("https://www.mitway.com/login");
            return response()->json(["success" => true, "type" => "reset", "message" => "Alterado com suceso"], 200);
        else:
            return response()->json(["success" => false, "type" => "error", "message" => "Erro de senha"], 302);
        endif;
    }
}
