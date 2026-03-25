<?php

namespace App\Observers;

use App\Models\Client;
use Illuminate\Support\Facades\Cache;

class ClientObserver
{
    /**
     * Clear the tailor's cache whenever a client is modified.
     */
    protected function clearCache(Client $client)
    {
        if ($client->tailor_id) {
            Cache::tags(['tailor_' . $client->tailor_id])->flush();
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
