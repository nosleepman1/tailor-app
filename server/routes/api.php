<?php

use App\Http\Controllers\api\v1\ClientController;
use App\Http\Controllers\api\v1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource("v1/users", UserController::class);
Route::post("v1/login", [UserController::class, "login"])->name("login");


Route::apiResource("v1/clients", ClientController::class)->middleware("auth:sanctum");
