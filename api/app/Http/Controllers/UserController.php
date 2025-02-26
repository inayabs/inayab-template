<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use ErrorException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Contracts\Role;

class UserController extends Controller
{
    //
    public function index(){
        $users = User::all();

        $userResource = UserResource::collection($users);

        return $userResource;
    }

    public function store(Request $request){
        try{
            DB::beginTransaction();
            
            $new_user = User::create($request->all());

            if($new_user){
                // get role
                $new_user->assignRole($request->role);
            }

            DB::commit();

            $userResource = new UserResource($new_user);

            return response()->json([
                'status'=> true,
                'message'=> 'User successfully created.',
                'data' => $userResource
            ],201);

        }catch(Exception $e){
            DB::rollBack();

            return response()->json([
                'status'=> false,
                'message'=> 'Failed to create user. '. $e->getMessage(),
            ],400);
        }
    }

    public function update(Request $request,$id){
        // update user
        try{
            DB::beginTransaction();

            $user = User::where('id',$id)->first();
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);

            if($user->update()){
                $user->syncRoles($request->role);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message'=> 'User updated successfully.',
            ]);
        }catch(Exception $e){
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message'=> 'Updating failed: '. $e->getMessage()
            ],400);
        }
    }
    // account management
    public function user(Request $request){
        $user = User::where('id', Auth::user()->id)->first();
        // return response()->json($request->user());
        return $user;
    }

    public function get($id){
        $user = User::where('id', $id)->first();
        $userResource = new UserResource($user);

        return $userResource;
    }

    public function updateInfo(Request $request){
        $user = User::where('id', Auth::user()->id)->first();

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;

        $user->update();
        
        return response()->json([
            'status' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    public function updatePass(Request $request){
        $user = User::where('id', Auth::user()->id)->first();

        if(Hash::check($request->current_password, $user->password)){
            if($request->new_password === $request->confirm_password){
                $user->password = Hash::make($request->new_password);
                $user->update();

                return response()->json([
                    'status' => true,
                    'message' => 'Password updated successfully'
                ]);
            }else{
                return response()->json([
                    'status' => false,
                    'message' => 'New password and confirm password does not match'
                ],400);
            }
        }else{
            return response()->json([
                'status' => false,
                'message' => 'Incorrect current password'
            ],400);
        }
    }

    
}
