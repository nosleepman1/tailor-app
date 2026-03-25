<?php

namespace App\Observers;

use App\Models\Event;
use Illuminate\Support\Facades\Cache;

class EventObserver
{
    /**
     * Clear the events cache globally.
     */
    protected function clearCache(Event $event)
    {
        Cache::tags(['events'])->flush();
    }

    public function created(Event $event): void
    {
        $this->clearCache($event);
    }

    public function updated(Event $event): void
    {
        $this->clearCache($event);
    }

    public function deleted(Event $event): void
    {
        $this->clearCache($event);
    }

    public function restored(Event $event): void
    {
        $this->clearCache($event);
    }

    public function forceDeleted(Event $event): void
    {
        $this->clearCache($event);
    }
}
