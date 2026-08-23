<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PayDunya Mode (test / live)
    |--------------------------------------------------------------------------
    */
    'mode' => env('PAYDUNYA_MODE', 'test'),

    /*
    |--------------------------------------------------------------------------
    | API Keys & Tokens
    |--------------------------------------------------------------------------
    */
    'master_key' => env('PAYDUNYA_MASTER_KEY', ''),
    'public_key' => env('PAYDUNYA_PUBLIC_KEY', ''),
    'private_key' => env('PAYDUNYA_PRIVATE_KEY', ''),
    'token' => env('PAYDUNYA_TOKEN', ''),

    /*
    |--------------------------------------------------------------------------
    | Base URLs
    |--------------------------------------------------------------------------
    */
    'endpoints' => [
        'test' => [
            'checkout_invoice' => 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create',
            'confirm_invoice' => 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/',
            'direct_pay' => 'https://app.paydunya.com/sandbox-api/v1/softpay/create',
        ],
        'live' => [
            'checkout_invoice' => 'https://app.paydunya.com/api/v1/checkout-invoice/create',
            'confirm_invoice' => 'https://app.paydunya.com/api/v1/checkout-invoice/confirm/',
            'direct_pay' => 'https://app.paydunya.com/api/v1/softpay/create',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | URLs de Redirection & Webhook (Support Ngrok / URL Externe)
    |--------------------------------------------------------------------------
    */
    'webhook_url' => env('PAYDUNYA_WEBHOOK_URL', env('APP_URL', 'http://localhost:8000') . '/api/v2/payments/webhook'),
    'return_url' => env('PAYDUNYA_RETURN_URL', env('APP_FRONTEND_URL', 'http://localhost:5173') . '/subscription/success'),
    'cancel_url' => env('PAYDUNYA_CANCEL_URL', env('APP_FRONTEND_URL', 'http://localhost:5173') . '/subscription/cancel'),

    /*
    |--------------------------------------------------------------------------
    | Informations Boutique / Service
    |--------------------------------------------------------------------------
    */
    'store' => [
        'name' => env('PAYDUNYA_STORE_NAME', 'TailleurPro Sénégal'),
        'tagline' => 'Solution SaaS de Gestion pour Tailleurs et Couturiers',
        'phone_number' => env('PAYDUNYA_STORE_PHONE', '+221770000000'),
        'postal_address' => 'Dakar, Sénégal',
        'website_url' => env('APP_FRONTEND_URL', 'https://tailleurpro.com'),
        'logo_url' => env('PAYDUNYA_STORE_LOGO', 'https://tailleurpro.com/logo.png'),
    ],
];
