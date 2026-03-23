<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    public function getTailors(Request $request)
    {
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }
        return response()->json(User::role('tailor')->get());
    }
    public function registerTailor(Request $request)
    {
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users',
            'city' => 'nullable|string',
        ]);

        $pin = $request->input('pin', str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT));
        
        $user = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'pin' => $pin,
            'password' => Hash::make(Str::random(10)), // random password since they use PIN
            'city' => $validated['city'] ?? null,
            'role' => 'tailor',
        ]);
        
        $user->assignRole('tailor');

        // SIMULATE WHATSAPP MESSAGE
        \Log::info("WHATSAPP TO +221773757077: New tailor account created for {$user->name}. Phone: {$user->phone}, PIN: {$pin}");

        return response()->json([
            'message' => 'Tailor successfully created',
            'user' => $user,
            'pin' => $pin // sending back as requested for admin view
        ], 201);
    }
}
