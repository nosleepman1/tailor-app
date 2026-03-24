<?php

return [
    'sandbox' => env('DEXPAY_SANDBOX', true),
    'base_url' => env('DEXPAY_BASE_URL', 'https://api.dexpay.africa/api/v1'),
    'public_key' => env('DEXPAY_SANDBOX', true) 
                        ? env('DEXPAY_PUBLIC_KEY_SANDBOX') 
                        : env('DEXPAY_PUBLIC_KEY_LIVE'),
    'secret_key' => env('DEXPAY_SANDBOX', true) 
                        ? env('DEXPAY_SECRET_KEY_SANDBOX') 
                        : env('DEXPAY_SECRET_KEY_LIVE'),
    'webhook_secret' => env('DEXPAY_WEBHOOK_SECRET'),
];
