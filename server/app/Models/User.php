<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\WebPush\HasPushSubscriptions;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasPushSubscriptions;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'firstname',
        'lastname',
        'email',
        'phone',
        'username',
        'password',
        'pin',
        'role',
        'profile_photo',
        'expo_push_token',
        'city',
        'active',
        'is_subscribed',
        'theme',
        'email_notifications',
        'in_app_notifications',
        'marketing_emails',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'pin',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
            'is_subscribed' => 'boolean',
            'email_notifications' => 'boolean',
            'in_app_notifications' => 'boolean',
            'marketing_emails' => 'boolean',
        ];
    }

    /**
     * Set the PIN (hashing it automatically if not already hashed).
     */
    public function setPinAttribute($value): void
    {
        if (!empty($value)) {
            // Only hash if not already a bcrypt / argon hash
            $this->attributes['pin'] = str_starts_with($value, '$2y$') || str_starts_with($value, '$argon')
                ? $value
                : Hash::make($value);
        }
    }

    /**
     * Verify if the provided PIN matches.
     */
    public function verifyPin(string $pin): bool
    {
        if (empty($this->pin)) {
            return false;
        }

        // Support hashed PIN and plain PIN fallback for backward compatibility
        if (str_starts_with($this->pin, '$2y$') || str_starts_with($this->pin, '$argon')) {
            return Hash::check($pin, $this->pin);
        }

        return hash_equals((string) $this->pin, (string) $pin);
    }

    /**
     * User's Clients (tailor scope).
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'tailor_id');
    }

    /**
     * User's Commandes (tailor scope).
     */
    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class, 'tailor_id');
    }

    /**
     * User's Revenues (tailor scope).
     */
    public function revenues(): HasMany
    {
        return $this->hasMany(Revenue::class, 'user_id');
    }

    /**
     * User's Subscriptions.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the active subscription.
     */
    public function activeSubscription()
    {
        return $this->subscriptions()->where('status', 'active')->where('expires_at', '>', now())->latest()->first();
    }
}
