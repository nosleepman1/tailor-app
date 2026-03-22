<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    protected $fillable = [
        'firstname', 'lastname', 'phone', 'price', 'is_paid', 'livre', 'manche',
        'epaule', 'poitrine', 'taille', 'hanche', 'cou',
        'pantalon', 'fesse', 'cuisse', 'biceps', 'bras',
        'model_image', 'tissus_image',
    ];

    protected function casts(): array
    {
        return [
            'is_paid' => 'boolean',
            'livre' => 'boolean',
        ];
    }
}
