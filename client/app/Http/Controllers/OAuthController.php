<?php

namespace App\Http\Controllers;

use \App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class OAuthController extends Controller
{
    public function redirect()
    {
        $queries = http_build_query([
            'client_id' => config('services.oauth_server.client_id'),
            'redirect_uri' => config('services.oauth_server.redirect'),
            'response_type' => 'code',
            'scope' => ['view-user', 'view-posts']
        ]);

        return redirect(config('services.oauth_server.uri') . '/oauth/authorize?' . $queries);
    }

    public function callback_old(Request $request)
    {
        $response = Http::post(config('services.oauth_server.uri') . '/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => config('services.oauth_server.client_id'),
            'client_secret' => config('services.oauth_server.client_secret'),
            'redirect_uri' => config('services.oauth_server.redirect'),
            'code' => $request->code
        ]);

        $response = $response->json();

        $request->user()->token()->delete();

        $request->user()->token()->create([
            'access_token' => $response['access_token'],
            'expires_in' => $response['expires_in'],
            'refresh_token' => $response['refresh_token']
        ]);

        return redirect('/home');
    }

    //
    public function callback(Request $request)
    {
        try {
            $response = Http::post(config('services.oauth_server.uri') . '/oauth/token', [
                'grant_type' => 'authorization_code',
                'client_id' => config('services.oauth_server.client_id'),
                'client_secret' => config('services.oauth_server.client_secret'),
                'redirect_uri' => config('services.oauth_server.redirect'),
                'code' => $request->code
            ]);

            $response = $response->json();

            $user = Http::withHeaders([
                'Authorization' => "Bearer " . $response['access_token'],
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->get(config('services.oauth_server.uri') . '/api/user');

            $user = $user->json();
            $modelData = User::where(['email' => $user['email']]);
            $login = $modelData->first();

            if ($modelData->count() == 0) {
                $save = User::create([
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'password' => $user['password']
                ]);
                $login = User::find($save->id);
            }
            Auth::login($login, true);

            if (Auth::check()) {
                $request->user()->token()->delete();
                $request->user()->token()->create([
                    'access_token' => $response['access_token'],
                    'expires_in' => $response['expires_in'],
                    'refresh_token' => $response['refresh_token']
                ]);
                return redirect('/');
            };
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function refresh(Request $request)
    {
        $response = Http::post(config('services.oauth_server.uri') . '/oauth/token', [
            'grant_type' => 'refresh_token',
            'refresh_token' => $request->user()->token->refresh_token,
            'client_id' => config('services.oauth_server.client_id'),
            'client_secret' => config('services.oauth_server.client_secret'),
            'redirect_uri' => config('services.oauth_server.redirect'),
            'scope' => 'view-posts'
        ]);

        if ($response->status() !== 200) {
            $request->user()->token()->delete();

            return redirect('/home')
                ->withStatus('Authorization failed from OAuth server.');
        }

        $response = $response->json();
        $request->user()->token()->update([
            'access_token' => $response['access_token'],
            'expires_in' => $response['expires_in'],
            'refresh_token' => $response['refresh_token']
        ]);

        return redirect('/home');
    }
}
