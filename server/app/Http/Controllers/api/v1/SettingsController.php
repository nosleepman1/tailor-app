<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Notifications\MultiChannelNotification;

class SettingsController extends Controller
{
    public function getProfile(Request $request)
    {
        return response()->json([
            'data' => $request->user()
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
            // add avatar, etc later if needed
        ]);

        $request->user()->update($validated);

        $request->user()->notify(new MultiChannelNotification(
            'Profil mis à jour',
            'Vos informations de profil ont été mises à jour avec succès.',
            'general',
            url('/settings')
        ));

        return response()->json(['message' => 'Profile updated', 'data' => $request->user()]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|min:8|confirmed',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password'])
        ]);

        $request->user()->notify(new MultiChannelNotification(
            'Mot de passe modifié',
            'Votre mot de passe a été modifié avec succès. Si vous n\'êtes pas à l\'origine de cette action, veuillez nous contacter immédiatement.',
            'security',
            url('/settings')
        ));

        return response()->json(['message' => 'Password updated']);
    }

    public function getAppearance(Request $request)
    {
        return response()->json([
            'data' => [
                'theme' => $request->user()->theme ?? 'system',
            ]
        ]);
    }

    public function updateAppearance(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|string',
        ]);

        $request->user()->update($validated);

        return response()->json(['message' => 'Appearance updated']);
    }

    public function getPreferences(Request $request)
    {
        return response()->json([
            'data' => [
                'email_notifications' => (bool)$request->user()->email_notifications,
                'in_app_notifications' => (bool)$request->user()->in_app_notifications,
                'marketing_emails' => (bool)$request->user()->marketing_emails,
            ]
        ]);
    }

    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'email_notifications' => 'required|boolean',
            'in_app_notifications' => 'required|boolean',
            'marketing_emails' => 'required|boolean',
        ]);

        $request->user()->update($validated);

        return response()->json(['message' => 'Preferences updated']);
    }
}
