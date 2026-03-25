<?php

namespace App\Observers;

use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;

class SubscriptionObserver
{
    /**
     * Clear the tailor's cache whenever a subscription changes.
     */
    protected function clearCache(Subscription $subscription)
    {
        if ($subscription->user_id) {
            Cache::tags(['tailor_' . $subscription->user_id])->flush();
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
