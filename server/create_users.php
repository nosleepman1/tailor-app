<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

$password = Hash::make('passer123');

// 1. Admin
$admin = User::firstOrCreate(
    ['email' => 'abdallahdiouf.dev@gmail.com'],
    [
        'name' => 'Admin Abdallah',
        'phone' => '771234567',
        'password' => $password,
        'role' => 'admin'
    ]
);
$admin->assignRole('admin');

// 2. Tailor: Makhtoum
$makhtoum = User::firstOrCreate(
    ['phone' => '773757077'],
    [
        'name' => 'Makhtoum',
        'email' => 'makhtoum@tailor.app',
        'password' => $password,
        'role' => 'tailor',
        'is_subscribed' => true
    ]
);
$makhtoum->assignRole('tailor');
Subscription::firstOrCreate(
    ['user_id' => $makhtoum->id, 'status' => 'active'],
    [
        'plan' => 'basic',
        'amount' => 2500,
        'dexpay_reference' => 'MANUAL_SEED_1',
        'starts_at' => Carbon::now(),
        'expires_at' => Carbon::now()->addMonths(1)
    ]
);

// 3. Tailor: ProCOuture
$procouture = User::firstOrCreate(
    ['phone' => '774731493'],
    [
        'name' => 'ProCOuture',
        'email' => 'procouture@tailor.app',
        'password' => $password,
        'role' => 'tailor',
        'is_subscribed' => true
    ]
);
$procouture->assignRole('tailor');
Subscription::firstOrCreate(
    ['user_id' => $procouture->id, 'status' => 'active'],
    [
        'plan' => 'premium',
        'amount' => 5000,
        'dexpay_reference' => 'MANUAL_SEED_2',
        'starts_at' => Carbon::now(),
        'expires_at' => Carbon::now()->addMonths(1)
    ]
);

echo "Les 3 utilisateurs ont été créés avec succès !";
