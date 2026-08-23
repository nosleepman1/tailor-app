<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'tailor_id',
        'full_name',
        'firstname',
        'lastname',
        'phone',
        'email',
        'address',
        'photo',
        'measurements',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'measurements' => 'array',
        ];
    }

    public function tailor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tailor_id');
    }

    public function commandes(): HasMany
    {
        return $this->hasMany(Commande::class, 'client_id');
    }

    public function measurement(): HasOne
    {
        return $this->hasOne(Measurement::class, 'client_id');
    }

    public function revenues(): HasMany
    {
        return $this->hasMany(Revenue::class, 'client_id');
    }
}
