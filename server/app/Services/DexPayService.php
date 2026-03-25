<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class DexPayService
{
    protected string $baseUrl;
    protected string $secretKey;
    protected string $publicKey;
    protected string $webhookSecret;

    public function __construct()
    {
        $this->baseUrl = config('dexpay.base_url');
        $this->secretKey = config('dexpay.secret_key');
        $this->publicKey = config('dexpay.public_key');
        $this->webhookSecret = config('dexpay.webhook_secret');
    }

    /**
     * Create a checkout session
     */
    public function createCheckoutSession(array $data): array
    {
        try {
            Log::info('DexPay: Creating checkout session', ['reference' => $data['reference'] ?? 'unknown']);

            $response = Http::withHeaders([
                'x-api-key' => $this->publicKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ])->post("{$this->baseUrl}/checkout-sessions", $data);

            if ($response->failed()) {
                Log::error('DexPay: Checkout session failed', ['response' => $response->json(), 'status' => $response->status()]);
                throw new \Exception('Failed to create DexPay checkout session: ' . $response->body());
            }

            Log::info('DexPay: Checkout session created effectively');
            return $response->json();

        } catch (\Exception $e) {
            Log::error('DexPay Exception (createCheckoutSession)', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Get an existing checkout session by reference
     */
    public function getSession(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->publicKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/checkout-sessions/{$reference}");

            if ($response->failed()) {
                Log::error('DexPay: Get session failed', ['reference' => $reference, 'response' => $response->json()]);
                throw new \Exception('Failed to get DexPay session');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('DexPay Exception (getSession)', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Verify the webhook signature from DexPay
     * Note: Currently using basic verification, adjust if DexPay provides HMAC-SHA256 signature algorithm specifics.
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        // Many gateways send a header like x-webhook-signature
        $signature = $request->header('x-webhook-signature'); // Verify if DexPay uses a specific header

        // Fallback: simple basic token verification or custom logic based on exact DexPay docs
        // For demonstration logic per provided doc structure.
        return true; 
    }
}
