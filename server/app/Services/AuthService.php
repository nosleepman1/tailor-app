<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    /**
     * Authenticate user with phone or email, using password or 4-digit PIN.
     *
     * @param string $login
     * @param string $passwordOrPin
     * @param string|null $expoPushToken
     * @return array
     * @throws ValidationException
     */
    public function loginWithPhoneOrEmail(string $login, string $passwordOrPin, ?string $expoPushToken = null): array
    {
        $user = $this->userRepository->findByEmailOrPhone($login);

        if (!$user) {
            throw ValidationException::withMessages([
                'login' => ['Identifiants incorrects. Veuillez vérifier votre numéro ou mot de passe.'],
            ]);
        }

        if (!$user->active) {
            throw ValidationException::withMessages([
                'login' => ['Ce compte a été désactivé. Veuillez contacter le support.'],
            ]);
        }

        $isValidPin = $user->verifyPin($passwordOrPin);
        $isValidPassword = !empty($user->password) && Hash::check($passwordOrPin, $user->password);

        if (!$isValidPin && !$isValidPassword) {
            throw ValidationException::withMessages([
                'login' => ['Identifiants incorrects. Veuillez vérifier votre numéro ou mot de passe.'],
            ]);
        }

        // Update push token if provided
        if (!empty($expoPushToken) && $user->expo_push_token !== $expoPushToken) {
            $user->update(['expo_push_token' => $expoPushToken]);
        }

        $tokenName = $user->hasRole('admin') ? 'admin_token' : 'tailor_token';
        $token = $user->createToken($tokenName)->plainTextToken;

        return [
            'token' => $token,
            'user' => $user->load('roles'),
            'role' => $user->roles->pluck('name')->first() ?? $user->role,
        ];
    }

    /**
     * Self-registration for tailors.
     */
    public function registerTailor(array $data): array
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'pin' => $data['pin'] ?? null,
            'city' => $data['city'] ?? null,
            'role' => 'tailor',
            'active' => true,
            'is_subscribed' => false,
            'expo_push_token' => $data['expo_push_token'] ?? null,
        ]);

        $user->assignRole('tailor');

        $token = $user->createToken('tailor_token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user->load('roles'),
            'role' => 'tailor',
        ];
    }

    /**
     * Admin creating a tailor with automatic 4-digit PIN.
     */
    public function adminRegisterTailor(array $data): array
    {
        $rawPin = $data['pin'] ?? str_pad((string) mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);

        $user = $this->userRepository->create([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'city' => $data['city'] ?? null,
            'pin' => $rawPin, // setPinAttribute will hash it automatically
            'password' => Str::random(16),
            'role' => 'tailor',
            'active' => true,
            'is_subscribed' => $data['is_subscribed'] ?? false,
        ]);

        $user->assignRole('tailor');

        return [
            'user' => $user->load('roles'),
            'generated_pin' => $rawPin, // Returned once so admin can give it to the tailor
        ];
    }

    /**
     * Logout user by revoking current token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    /**
     * Update user password safely.
     */
    public function updatePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update(['password' => $newPassword]);
    }
}
