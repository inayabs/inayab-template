<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('reset-request', [AuthController::class, 'reset_request']);
    Route::post('change-password', [AuthController::class, 'change_password']);
    Route::post('verify-code',[AuthController::class,'verify_code']);

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('update-2fa', [AuthController::class, 'update_2fa']);
    });
    // Route::post('register', [AuthController::class, 'register']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class,'index']);
    Route::group(['prefix'=>'user'], function(){
        Route::get('/', [UserController::class, 'user']);
        Route::get('/{id}',[UserController::class, 'get']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class,'update']);
        Route::put('/profile/update-info', [UserController::class, 'updateInfo']);
        Route::put('/profile/update-pass', [UserController::class, 'updatePass']);
    });
});

