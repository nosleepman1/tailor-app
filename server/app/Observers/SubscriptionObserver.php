<?php

namespace App\Observers;

use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;

class SubscriptionObserver
{
    protected function clearCache(Subscription $subscription): void
    {
        if ($subscription->user_id) {
            try {
                Cache::tags(["tailor_{$subscription->user_id}"])->flush();
            } catch (\Throwable $e) {
                // Ignore if tags not supported
            }
        }
    }

    public function created(Subscription $subscription): void
    {
        $this->clearCache($subscription);
    }

    public function updated(Subscription $subscription): void
    {
        $this->clearCache($subscription);
    }

    public function deleted(Subscription $subscription): void
    {
        $this->clearCache($subscription);
    }

    public function restored(Subscription $subscription): void
    {
        $this->clearCache($subscription);
    }

    public function forceDeleted(Subscription $subscription): void
    {
        $this->clearCache($subscription);
    }
}
