<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Commande;
use App\Models\Client;
use App\Models\Event;
use App\Models\Subscription;
use App\Observers\ClientObserver;
use App\Observers\CommandeObserver;
use App\Observers\EventObserver;
use App\Observers\SubscriptionObserver;

// observers


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Commande::observe(CommandeObserver::class);
        Client::observe(ClientObserver::class);
        Event::observe(EventObserver::class);
        Subscription::observe(SubscriptionObserver::class);
    }
}
