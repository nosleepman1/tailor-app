<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Measurement extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'neck',
        'chest',
        'shoulder',
        'arm_length',
        'belly',
        'boubou_length',
        'pant_length',
        'hips',
        'thigh',
        'biceps',
    ];

    protected function casts(): array
    {
        return [
            'neck' => 'float',
            'chest' => 'float',
            'shoulder' => 'float',
            'arm_length' => 'float',
            'belly' => 'float',
            'boubou_length' => 'float',
            'pant_length' => 'float',
            'hips' => 'float',
            'thigh' => 'float',
            'biceps' => 'float',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}
