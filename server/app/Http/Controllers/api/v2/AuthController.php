<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Auth\LoginRequest;
use App\Http\Requests\V2\Auth\RegisterTailorRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Authenticate user with Phone/Email and PIN/Password.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->loginWithPhoneOrEmail(
            $request->validated('login'),
            $request->validated('password_or_pin'),
            $request->validated('expo_push_token')
        );

        return $this->successResponse($result, 'Connexion réussie.');
    }

    /**
     * Self-registration for tailors.
     */
    public function register(RegisterTailorRequest $request): JsonResponse
    {
        $result = $this->authService->registerTailor($request->validated());

        return $this->createdResponse($result, 'Compte tailleur créé avec succès.');
    }

    /**
     * Get current authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles', 'subscriptions']);

        return $this->successResponse([
            'user' => $user,
            'role' => $user->roles->pluck('name')->first() ?? $user->role,
        ], 'Profil récupéré avec succès.');
    }

    /**
     * Logout user.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Déconnexion réussie.');
    }
}
