<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(){

    }

    public function store(StoreUserRequest $request){

        $data = $request->validated();
        //hash password
        $data["password"] = Hash::make($data["password"]);

        $user = User::create($data);

        if($user){
            return response()->json([
                "message"=> "register successfull",
                "user"=> $user,
                ], 201);
        }
        return response()->json([
            "message"=> "register failed",
            "user"=> null
            ],0);
    }

    public function login(LoginUserRequest $request) {

        $user = null;

        $user = User::where("email", $request->email)->first();

        if(!$user){
            $user = User::where("username", $request->username)->first();
        }

        if(!$user || !Hash::check($request->password, $user->password)){
            return response()->json([
                "message"=> "credentials no valid",
                ],401);
        }

        //token
        $token = $user->createToken("TOKEN-KEY")->plainTextToken;

        return response()->json([
            "message"=> "login successfull",
            "user"=> $user,
            "token"=> $token
        ],200);


    }
}
