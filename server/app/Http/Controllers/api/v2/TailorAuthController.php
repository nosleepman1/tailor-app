<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TailorAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users',
            'phone' => 'nullable|string|unique:users',
            'password' => 'required|string|min:6',
            'city' => 'nullable|string',
        ]);

        if (empty($validated['email']) && empty($validated['phone'])) {
            return response()->json(['message' => 'Email or phone string is required'], 422);
        }

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'tailor';

        $user = User::create($validated);
        $user->assignRole('tailor');

        return response()->json([
            'token' => $user->createToken('tailor_auth')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // phone or email
            'password_or_pin' => 'required|string'
        ]);

        $user = User::where('email', $request->login)
                    ->orWhere('phone', $request->login)
                    ->first();

        if (!$user) {
            throw ValidationException::withMessages(['login' => 'Invalid credentials']);
        }

        // Check PIN or Password
        $isValidPin = $user->pin && $request->password_or_pin === $user->pin;
        $isValidPassword = Hash::check($request->password_or_pin, $user->password);

        if (!$isValidPin && !$isValidPassword) {
            throw ValidationException::withMessages(['login' => 'Invalid credentials']);
        }

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
