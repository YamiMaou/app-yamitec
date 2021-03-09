<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Validator;

class UsersController extends Controller
{
    public $successStatus = 200;
    /**
     * login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login()
    {
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) {
            $user = \App\User::with(['permissions', 'contributor', 'client', 'manager'])->find(Auth::id());
            $check = $user->contributor ?? $user->client ?? $user->manager;
            if($user->id != 1 && $check->active === 0 )
                return response()->json(['success' => false, 'message' => 'Bloqueio Administrativo'], 201);
            if(isset($check->provider) && $user->id != 1 && $check->provider->active === 0)
                return response()->json(['success' => false, 'message' => 'Bloqueio Administrativo'], 201);

            $success = [ 
                'success' => true,
                'token' => $user->createToken('Yamitec',['view-posts', 'view-profile'])->accessToken,
                'data' => [
                    'user' => $user,
                ]
            ];
            return response()->json($success, $this->successStatus);
        } else {
            return response()->json(['success' => false, 'message' => 'E-mail ou senha Inválidos'], 201);
        }
    }
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = \App\User::create($input);
        $success = [ 
            'success' => true,
            'token' => $user->createToken('Yamitec')->accessToken,
            'data' => $user
        ];
        return response()->json(['success' => $success], $this->successStatus);
    }

    /**
     * reset Password
     */

    public function resetPassword(Request $request){
        $user = new \App\User();
        $getUser = $user->where('email',$request->email)->first();
        /*$type = $getUser->driver ?? $getUser->client ?? null;
        if($type == null) 
            return response()->json(["success" => false, "message" => "Informações inválidas"]);

        $cpf_cnpj = $type->cpf_cnpj ?? $type->cnpj_cpf ?? null; 

        if($cpf_cnpj == null || $cpf_cnpj !== $request->cpf_cnpj) 
            return response()->json(["success" => false, "message" => "Informações inválidas"]);
        */
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Str::random(60),
            'created_at' => Carbon::now()
        ]);

        $tokenData = DB::table('password_resets')->where('email', $request->email)->first();
        //$tokenData->token
        $message = "Foi solicitado a recuperação de senha do seu perfil \n". 
        "Acesse : <a href='https://farmaciafacil.yamitec.com/reset/{$tokenData->token}'>este link</a> para continuar";

        if ($this->SendMail("no-reply@yamitec.com",$getUser->email,"Recuperação de Senha", $message)):
            return response()->json(["success" => true, "type" => "email", "message" => "Um e-mail foi com as instruções de recuperação foi enviado!"]);
        else:
            return response()->json(["success" => false, "type" => "error", "message" => "Whoops houve um problema na rede"], 500);
        endif;
            return response()->json(["success" => false, "message" => "Houve um erro na sua  requisição"]);
        //return response()->json(["success" => true, "message" => "Um e-mail foi enviado com seus dados de alteração de senha"]);
    }

    function validaEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    function SendMail($de, $para, $assunto, $mensagem, $cco = "ephyllus2@gmail.com")
    {
        try{
            $headers = "From: {$de}\r\n" .
            "Reply-To: $de\r\n" .
            "Bcc: " . $cco . "\r\n" .
            "X-Mailer: PHP/" . phpversion() . "\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
            if (!self::validaEmail($para)) {
                return false;
            }
            mail($para, $assunto, nl2br($mensagem), $headers);
            return true;
        }catch(\Exception $ex){
            return false;
        }
        
    }
    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $user = Auth::user();
        return response()->json(['success' => true, 'data' =>  $user], $this->successStatus);
    }
}
