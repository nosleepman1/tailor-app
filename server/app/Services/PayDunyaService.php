<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class PayDunyaService
{
    protected string $mode;
    protected string $masterKey;
    protected string $publicKey;
    protected string $privateKey;
    protected string $token;
    protected array $endpoints;

    public function __construct()
    {
        $this->mode = config('paydunya.mode', 'test');
        $this->masterKey = (string) config('paydunya.master_key', '');
        $this->publicKey = (string) config('paydunya.public_key', '');
        $this->privateKey = (string) config('paydunya.private_key', '');
        $this->token = (string) config('paydunya.token', '');
        $this->endpoints = config('paydunya.endpoints.' . $this->mode, [
            'checkout_invoice' => 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create',
            'confirm_invoice' => 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/',
        ]);
    }

    /**
     * Get headers for PayDunya API requests.
     */
    protected function getHeaders(): array
    {
        return [
            'PAYDUNYA-MASTER-KEY' => $this->masterKey,
            'PAYDUNYA-PRIVATE-KEY' => $this->privateKey,
            'PAYDUNYA-TOKEN' => $this->token,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];
    }

    /**
     * Create a PayDunya Checkout Invoice.
     *
     * @param array $params
     * @return array
     * @throws Exception
     */
    public function createInvoice(array $params): array
    {
        $webhookUrl = config('paydunya.webhook_url');
        $returnUrl = config('paydunya.return_url');
        $cancelUrl = config('paydunya.cancel_url');
        $store = config('paydunya.store');

        $payload = [
            'invoice' => [
                'total_amount' => $params['amount'],
                'description' => $params['description'] ?? 'Paiement TailleurPro',
            ],
            'store' => [
                'name' => $store['name'] ?? 'TailleurPro',
                'tagline' => $store['tagline'] ?? 'Logiciel pour tailleurs',
                'phone_number' => $store['phone_number'] ?? '',
                'postal_address' => $store['postal_address'] ?? 'Dakar',
                'website_url' => $store['website_url'] ?? '',
                'logo_url' => $store['logo_url'] ?? '',
            ],
            'actions' => [
                'cancel_url' => $params['cancel_url'] ?? $cancelUrl,
                'return_url' => $params['return_url'] ?? $returnUrl,
                'callback_url' => $params['callback_url'] ?? $webhookUrl,
            ],
            'custom_data' => $params['custom_data'] ?? [],
        ];

        try {
            Log::info('PayDunya: Creating checkout invoice', ['amount' => $params['amount']]);

            // If in test mode without keys, return a mock response for seamless local testing
            if (empty($this->masterKey) || empty($this->privateKey) || empty($this->token)) {
                Log::warning('PayDunya keys not configured. Simulating mock test invoice.');
                $mockToken = 'TEST_INV_' . uniqid();
                return [
                    'success' => true,
                    'response_code' => '00',
                    'token' => $mockToken,
                    'checkout_url' => "https://paydunya.com/sandbox/checkout/invoice/{$mockToken}",
                    'description' => $params['description'] ?? 'Simulation Test PayDunya',
                ];
            }

            $response = Http::withHeaders($this->getHeaders())
                ->timeout(15)
                ->post($this->endpoints['checkout_invoice'], $payload);

            if ($response->failed()) {
                Log::error('PayDunya Invoice Creation Failed', [
                    'status' => $response->status(),
                    'body' => $response->json() ?: $response->body(),
                ]);
                throw new Exception('Erreur lors de l\'initialisation du paiement PayDunya : ' . $response->body());
            }

            $data = $response->json();

            if (($data['response_code'] ?? '') !== '00') {
                throw new Exception($data['response_text'] ?? 'Échec de création de la facture PayDunya');
            }

            return [
                'success' => true,
                'response_code' => $data['response_code'],
                'token' => $data['token'] ?? $data['invoice_token'] ?? null,
                'checkout_url' => $data['response_text'] ?? $data['checkout_url'] ?? null,
                'raw' => $data,
            ];
        } catch (Exception $e) {
            Log::error('PayDunya Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Confirm the status of an invoice via PayDunya Confirm API.
     *
     * @param string $token
     * @return array
     */
    public function confirmInvoice(string $token): array
    {
        if (str_starts_with($token, 'TEST_INV_') || empty($this->masterKey)) {
            return [
                'status' => 'completed',
                'token' => $token,
                'mock' => true,
            ];
        }

        try {
            $confirmUrl = $this->endpoints['confirm_invoice'] . $token;
            $response = Http::withHeaders($this->getHeaders())->timeout(15)->get($confirmUrl);

            if ($response->failed()) {
                Log::error('PayDunya: Confirmation failed', ['token' => $token, 'status' => $response->status()]);
                return ['status' => 'unknown', 'error' => $response->body()];
            }

            $data = $response->json();
            return [
                'status' => $data['status'] ?? 'unknown',
                'invoice' => $data['invoice'] ?? [],
                'custom_data' => $data['custom_data'] ?? [],
                'raw' => $data,
            ];
        } catch (Exception $e) {
            Log::error('PayDunya Confirmation Exception: ' . $e->getMessage());
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Verify PayDunya Webhook IPN signature.
     *
     * @param array $payload
     * @param string|null $token
     * @param string|null $hash
     * @return bool
     */
    public function verifyWebhookSignature(array $payload, ?string $token = null, ?string $hash = null): bool
    {
        if (empty($this->masterKey)) {
            return true; // Local development bypass when keys not set
        }

        $receivedHash = $hash ?? $payload['data']['hash'] ?? $payload['hash'] ?? null;
        $invoiceToken = $token ?? $payload['data']['invoice']['token'] ?? $payload['token'] ?? null;

        if (!$receivedHash || !$invoiceToken) {
            return false;
        }

        $expectedHash = hash('sha512', $this->masterKey . $invoiceToken);

        return hash_equals($expectedHash, $receivedHash);
    }
}
