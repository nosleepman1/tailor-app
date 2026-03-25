<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$reference = 'TEST_' . uniqid();
$url = 'https://nonconverging-murmurously-madeline.ngrok-free.dev';

$data = [
    "reference" => $reference,
    "item_name" => "Abonnement basic - Tailleur App",
    "amount" => 2500,
    "currency" => "XOF",
    "countryISO" => "SN",
    "success_url" => 'http://localhost:5173/subscription/success?ref=' . $reference,
    "failure_url" => 'http://localhost:5173/subscription/failure?ref=' . $reference,
    "webhook_url" => $url . '/api/v2/webhooks/dexpay',
    "customer" => [
        "phone" => "773757077",
        "email" => "abdallahdiouf.dev@gmail.com",
        "name" => "Abdallah Diouf"
    ]
];

$response = Illuminate\Support\Facades\Http::withHeaders([
    "x-api-key" => config('dexpay.secret_key'),
    "Content-Type" => "application/json"
])->post(config('dexpay.base_url') . '/checkout-sessions', $data);

echo "Secret Key Test:\n";
echo "Status: " . $response->status() . "\n";
echo "Body: " . $response->body() . "\n\n";

$response2 = Illuminate\Support\Facades\Http::withHeaders([
    "x-api-key" => config('dexpay.public_key'),
    "Content-Type" => "application/json"
])->post(config('dexpay.base_url') . '/checkout-sessions', $data);

echo "Public Key Test:\n";
echo "Status: " . $response2->status() . "\n";
echo "Body: " . $response2->body() . "\n\n";

