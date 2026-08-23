<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (TailleurPro V2)
|--------------------------------------------------------------------------
|
| Modular, clean, and secure routing architecture.
|
*/

Route::prefix('v2')->group(function () {
    // 1. Authentication (Login, Register, Logout, Me)
    require __DIR__ . '/api/v2/auth.php';

    // 2. User Settings & Preferences
    require __DIR__ . '/api/v2/users.php';

    // 3. Clients Management & Measurements
    require __DIR__ . '/api/v2/clients.php';

    // 4. Commandes & Production Cycle
    require __DIR__ . '/api/v2/commandes.php';

    // 5. Events & Calendars
    require __DIR__ . '/api/v2/events.php';

    // 6. Workshop & Admin Dashboard
    require __DIR__ . '/api/v2/dashboard.php';

    // 7. PayDunya Payments & Subscriptions
    require __DIR__ . '/api/v2/payments.php';

    // 8. Super Admin Operations
    require __DIR__ . '/api/v2/admin.php';

    // 9. Offline-First Mobile Synchronization (Expo)
    require __DIR__ . '/api/v2/sync.php';
});
