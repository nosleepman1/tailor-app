<?php

namespace App\Observers;

use App\Models\Client;
use Illuminate\Support\Facades\Cache;

class ClientObserver
{
    protected function clearCache(Client $client): void
    {
        if ($client->tailor_id) {
            try {
                Cache::tags(["tailor_{$client->tailor_id}"])->flush();
            } catch (\Throwable $e) {
                // If cache tags not supported, ignore
            }
        }
    }

    public function created(Client $client): void
    {
        $this->clearCache($client);
    }

    public function updated(Client $client): void
    {
        $this->clearCache($client);
    }

    public function deleted(Client $client): void
    {
        $this->clearCache($client);
    }

    public function restored(Client $client): void
    {
        $this->clearCache($client);
    }

    public function forceDeleted(Client $client): void
    {
        $this->clearCache($client);
    }
}
