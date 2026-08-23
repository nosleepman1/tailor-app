<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class MultiChannelNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $title;
    public $message;
    public $type;
    public $url;

    public function __construct($title, $message, $type = 'general', $url = null)
    {
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
        $this->url = $url;
    }

    public function via($notifiable)
    {
        $channels = ['database'];

        // Only send marketing if allowed
        if ($this->type === 'marketing' && !$notifiable->marketing_emails) {
            return $channels;
        }

        if ($notifiable->email_notifications) {
            $channels[] = 'mail';
        }

        // Add webpush if supported/subscribed
        if ($notifiable->pushSubscriptions()->count() > 0) {
            $channels[] = WebPushChannel::class;
        }

        return $channels;
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject($this->title)
                    ->line($this->message)
                    ->action('Ouvrir l\'application', $this->url ?? url('/'));
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title($this->title)
            ->body($this->message)
            ->action('Ouvrir', 'open_app')
            ->data(['url' => $this->url ?? url('/')]);
    }

    public function toArray($notifiable)
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url,
            'type' => $this->type,
        ];
    }
}
