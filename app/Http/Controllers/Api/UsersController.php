<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
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
            $user = \App\User::find(Auth::id());
            $success = [ 
                'success' => true,
                'token' => $user->createToken('Yamitec',['view-posts', 'view-profile'])->accessToken,
                'data' => [
                    'user' => $user,
                    'contributor' => $user->contributor
                ]
            ];
            return response()->json($success, $this->successStatus);
        } else {
            return response()->json(['success' => false, 'message' => 'Acesso não autorizado'], 201);
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
