<?php

namespace App\Http\Controllers;

use App\Models\User;
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
