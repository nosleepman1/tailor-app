<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckExpiringSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-expiring-subscriptions';
    protected $description = 'Check for subscriptions expiring in 3 days and notify users';

    public function handle()
    {
        $targetDate = now()->addDays(3)->toDateString();

        $subscriptions = \App\Models\Subscription::with('user')
            ->where('status', 'active')
            ->whereDate('expires_at', $targetDate)
            ->get();

        $count = 0;

        foreach ($subscriptions as $subscription) {
            if ($subscription->user) {
                
                $subscription->user->notify(new \App\Notifications\MultiChannelNotification(
                    'Abonnement expirant bientôt',
                    'Votre abonnement expire dans 3 jours. Pensez à le renouveler pour éviter toute interruption.',
                    'general',
                    url('/settings') // the frontend settings url could be better defined, assuming basic routing on frontend
                ));
                $count++;
            }
        }

        $this->info("Notified {$count} users about expiring subscriptions.");
    }
}
