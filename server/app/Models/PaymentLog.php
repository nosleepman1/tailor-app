<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'user_id',
        'dexpay_reference',
        'event_type',
        'payload',
        'status',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    /**
     * Get the subscription associated with this payment log.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Get the user associated with this payment log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
