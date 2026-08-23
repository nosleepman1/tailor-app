<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Settings\UpdatePasswordRequest;
use App\Http\Requests\V2\Settings\UpdateProfileRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService
    ) {}

    public function getProfile(Request $request): JsonResponse
    {
        return $this->successResponse($request->user()->load('roles'), 'Profil utilisateur récupéré.');
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return $this->successResponse($user->fresh(['roles']), 'Profil mis à jour avec succès.');
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $this->authService->updatePassword(
            $request->user(),
            $request->validated('current_password'),
            $request->validated('password')
        );

        return $this->successResponse(null, 'Mot de passe mis à jour avec succès.');
    }

    public function getPreferences(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->successResponse([
            'theme' => $user->theme ?? 'system',
            'email_notifications' => (bool) $user->email_notifications,
            'in_app_notifications' => (bool) $user->in_app_notifications,
            'marketing_emails' => (bool) $user->marketing_emails,
        ], 'Préférences récupérées.');
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme' => 'sometimes|string|in:light,dark,system',
            'email_notifications' => 'sometimes|boolean',
            'in_app_notifications' => 'sometimes|boolean',
            'marketing_emails' => 'sometimes|boolean',
        ]);

        $request->user()->update($validated);

        return $this->successResponse($request->user()->fresh(), 'Préférences enregistrées avec succès.');
    }

    public function updatePushToken(Request $request): JsonResponse
    {
        $request->validate([
            'expo_push_token' => 'required|string',
        ]);

        $request->user()->update([
            'expo_push_token' => $request->input('expo_push_token'),
        ]);

        return $this->successResponse(null, 'Token de notification push enregistré.');
    }
}
