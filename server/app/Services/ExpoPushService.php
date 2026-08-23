<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExpoPushService
{
    protected string $expoApiUrl;

    public function __construct()
    {
        $this->expoApiUrl = env('EXPO_PUSH_URL', 'https://exp.host/--/api/v2/push/send');
    }

    /**
     * Send push notification to a user's Expo mobile device.
     *
     * @param User $user
     * @param string $title
     * @param string $body
     * @param array $data
     * @return bool
     */
    public function sendToUser(User $user, string $title, string $body, array $data = []): bool
    {
        $token = $user->expo_push_token;

        if (empty($token) || !str_starts_with($token, 'ExponentPushToken[')) {
            Log::info("ExpoPushService: User #{$user->id} does not have a valid Expo push token.");
            return false;
        }

        return $this->sendPush([
            'to' => $token,
            'title' => $title,
            'body' => $body,
            'data' => $data,
            'sound' => 'default',
            'priority' => 'high',
        ]);
    }

    /**
     * Send raw payload to Expo Push API.
     */
    protected function sendPush(array $payload): bool
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->timeout(10)->post($this->expoApiUrl, $payload);

            if ($response->failed()) {
                Log::error('Expo Push Notification Failed: ' . $response->body());
                return false;
            }

            Log::info('Expo Push Notification sent successfully', ['to' => $payload['to'] ?? 'unknown']);
            return true;
        } catch (\Throwable $e) {
            Log::error('Expo Push Exception: ' . $e->getMessage());
            return false;
        }
    }
}
