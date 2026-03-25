<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

$data = [
    'reference' => 'TEST_' . time(),
    'item_name' => 'Abonnement Premium',
    'amount' => 2500,
    'currency' => 'XOF',
    'countryISO' => 'SN',
    'webhook_url' => 'https://example.com/webhook',
    'success_url' => 'http://localhost:8000/success',
    'failure_url' => 'http://localhost:8000/failure',
    'customer' => [
        'phone' => '+221771234567',
        'email' => 'test@tailleurapp.com',
        'name' => 'Jean Dupont'
    ]
];

$response = Http::withHeaders([
    'x-api-key' => config('dexpay.public_key'),
    'Content-Type' => 'application/json',
    'Accept' => 'application/json'
])->post(config('dexpay.base_url') . '/checkout-sessions', $data);

echo "Status: " . $response->status() . "\n";
echo "Response: " . $response->body() . "\n";

// Test alternate URLs (return_url / cancel_url) if it fails
if ($response->status() === 422) {
    echo "\nTrying with return_url and cancel_url instead...\n";
    unset($data['success_url'], $data['failure_url']);
    $data['return_url'] = 'https://example.com/success';
    $data['cancel_url'] = 'https://example.com/cancel';
    
    $response = Http::withHeaders([
        'x-api-key' => config('dexpay.public_key'),
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
    ])->post(config('dexpay.base_url') . '/checkout-sessions', $data);

    echo "Status: " . $response->status() . "\n";
    echo "Response: " . $response->body() . "\n";
}
