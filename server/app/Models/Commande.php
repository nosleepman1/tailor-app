<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'tailor_id',
        'client_id',
        'event_id',
        'fabric_description',
        'model_photo',
        'images',
        'status',
        'price',
        'deposit_paid',
        'due_date',
        'due_date_remaining',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'price' => 'decimal:2',
            'deposit_paid' => 'decimal:2',
            'due_date' => 'date',
            'due_date_remaining' => 'date',
        ];
    }

    public function tailor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tailor_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function revenues(): HasMany
    {
        return $this->hasMany(Revenue::class, 'commande_id');
    }
}
