<?php

namespace App\Http\Controllers;

use App\Models\PasswordResetToken;
use App\Models\User;
use Carbon\Carbon;
use ErrorException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request){
        try {
            $user = User::where('email', $request->email)->first();
            $credentials = $request->only('email', 'password');
            if (!$user) {
                throw new ErrorException("Account does not exist.");
            }
            if (!Auth::attempt($credentials)) {
                throw new ErrorException("Invalid credentials.");
            }
            

            $token = $user->createToken('authToken')->plainTextToken;

            $response = [
                'id'    => $user->id,
                // 'name'  => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'token' => $token,
                'is_authenticated' => true,
                'status' => true,
                'message' => 'Successfully logged in',
                'image'=> $user->image,
                // 'roles' => $user->getRoleNames(),
                // 'subscriptions' => $subscriptions
            ];

            return response()->json($response)->withCookie(cookie('authToken', $token, 60));
        } catch (Exception $e) {
            Log::error('Login failed', ['error' => $e->getMessage()]);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function reset_request(Request $request ){
        try{
            // check if email is existing
            $email = $request->email;

            $emailExists = User::where('email', $email)->first();

            if(!$emailExists){
                throw new ErrorException('Email does not exist.');
            }

            $token_link = $this->generate_reset_token($email);
            
            return response()->json([
                'status'=>true,
                'message'=>'Reset password request success, please check your email.',
                'token_link' => $token_link
            ]);
        }catch(Exception $e){
            return response()->json([
                'status'=> false,
                'message'=> $e->getMessage()
            ],400);
        }
    }

    function generate_reset_token($email) {
        try{
            $token = \Str::random(64);
        
            $expiresAt = Carbon::now()->addMinutes(3);
            // delete previous token form this email
            PasswordResetToken::where('email',$email)->delete();

            $new_token = new PasswordResetToken;
            $new_token->email = $email;
            $new_token->token = $token;
            $new_token->expires_at = $expiresAt;
            $new_token->save();

            $token_link = env('NEXT_APP_URL') . '/auth/change-password/' . $token;

            return $token_link;
        }catch(Exception $e){
            throw new ErrorException($e->getMessage());
        }
    }

    public function change_password(Request $request){
        try{
            $token = $request->token;
    
            $checkToken = $this->token_validation($token);

            // change password
            $email = $checkToken->email;
            $user = User::where('email',$email)->first();
            $user->password = Hash::make($request->new_password);

            if($user->update()){
                $checkToken->delete();

                return response()->json([
                    'status' => true,
                    'message' => 'Password updated successfully!'
                ]);
            }
        }catch(ErrorException $e){
            return response()->json([
                'status'=> false,
                'message' => $e->getMessage()
            ],400);
        }

    }
    
    function token_validation($token){
        $checkToken = PasswordResetToken::where('token',$token)->first();

        if(!$checkToken){
            throw new ErrorException('Token not found.');
        }

        if($checkToken->expires_at < Carbon::now()){
            throw new ErrorException('Token has expired.');
        }

        return $checkToken;
    }
    // public function register(Request $request){
    //     try{
    //         $user = new User();
    //         $user->name = $request->name;
    //         $user->username = $request->username;
    //         $user->email = $request->email;
    //         $user->password = Hash::make($request->password);
    //         $user->save();
    //         $user->assignRole('user');
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'User created successfully'
    //         ], 201);
    //     }catch(Exception $e){
    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ], 400);
        
    //     }
    // }

  
}
