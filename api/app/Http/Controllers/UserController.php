<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
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
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10); // Default to 10 per page
        $search = $request->input('filter', ''); // Search filter (optional)
        $sortBy = $request->input('sort_by', 'first_name'); // Default sorting field
        $sortOrder = $request->input('sort_order', 'asc'); // Default sort order (asc or desc)

        // Validate sorting order
        $sortOrder = strtolower($sortOrder) === 'desc' ? 'desc' : 'asc';

        $query = User::query();

        if (!empty($search)) {
            $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($limit);

        return UserResource::collection($users)->additional([
            'total' => $users->total(),
            'last_page' => $users->lastPage(),
        ]);
    }
    

    public function store(UserRequest $request){
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

    public function update(UserRequest $request,$id){
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
    
    public function destroy($id)
    {
        // Find the user by ID
        $user = User::find($id);

        // Check if user exists
        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        try {
            // Delete the user
            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
