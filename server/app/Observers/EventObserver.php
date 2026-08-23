<?php

namespace App\Observers;

use App\Models\Event;
use Illuminate\Support\Facades\Cache;

class EventObserver
{
    protected function clearCache(Event $event): void
    {
        try {
            Cache::tags(['events'])->flush();
        } catch (\Throwable $e) {
            // Ignore if tags not supported
        }
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
