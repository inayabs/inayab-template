<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetMail;
use App\Mail\TwoFactorCodeMail;
use App\Models\PasswordResetToken;
use App\Models\TwoFactorCode;
use App\Models\User;
use Carbon\Carbon;
use ErrorException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();
            $credentials = $request->only('email', 'password');
            $twoFactorCode = $request->input('twoFactorCode');

            if (!$user) {
                throw new ErrorException("Account does not exist.");
            }
            if (!Auth::attempt($credentials)) {
                throw new ErrorException("Invalid credentials.");
            }
            // ✅ Check if user has 2FA enabled
            if ($user->two_factor) {
                // 🚀 Step 1: If the request contains a 2FA code, verify it
                if ($twoFactorCode) {
                    TwoFactorCode::where('user_id',$user->id)
                        ->delete();
                } else {
                    // ❌ Delete old codes for this user
                    TwoFactorCode::where('user_id', $user->id)->delete();

                    // 🔑 Generate new 6-character uppercase alphanumeric code
                    $code = strtoupper(\Str::random(6));

                    // 🕒 Store the code with a 3-minute expiration
                    $newCode = new TwoFactorCode;
                    $newCode->user_id = $user->id;
                    $newCode->code = $code;
                    $newCode->expires_at = Carbon::now()->addMinutes(3);
                    $newCode->save();

                    // TODO: Implement actual email sending logic
                    Mail::to($user->email)->send(new TwoFactorCodeMail($user,$code));

                    return response()->json([
                        'status' => true,
                        'two_factor_validation' => true, // ✅ Indicate 2FA is required
                        'message' => 'Two-factor authentication required. Check your email.',
                        'code' => $newCode->code
                    ]);
                }
            }

            // 🔑 Generate auth token after 2FA check
            $token = $user->createToken('authToken')->plainTextToken;
            
            return response()->json([
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'token' => $token,
                'is_authenticated' => true,
                'status' => true,
                'message' => 'Successfully logged in',
                'image' => $user->image,
                'two_factor' => $user->two_factor == 1 ?? false, // ✅ 2FA not required anymore
            ])->withCookie(cookie('authToken', $token, 60));

        } catch (Exception $e) {

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function verify_code(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'code' => 'required|string|size:6',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                throw new ErrorException("Account does not exist.");
            }

            $twoFactorCode = TwoFactorCode::where('user_id', $user->id)
                ->where('code', strtoupper($request->code)) // Ensure case-insensitive check
                ->first();

            if (!$twoFactorCode) {
                throw new ErrorException("Invalid code.");
            }

            // check if code expired
            if ($twoFactorCode->expires_at < Carbon::now()){
                throw new ErrorException('Code has expired');
            }

            // 🔥 Delete the code after use
            // $twoFactorCode->delete();

            // 🔑 Generate auth token
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'status'=> true,
                'message' => 'Code is valid.'
            ]);

        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
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

            Mail::to($email)->send(new PasswordResetMail($emailExists, $token_link));

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

    public function update_2fa(Request $request)
    {
        $user = User::where('id', Auth::user()->id)->first();
        $user->two_factor = $request->two_factor;
        $user->update();

        return response()->json([
            'message' => $request->two_factor ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
            'two_factor' => $user->two_factor,
        ]);
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
