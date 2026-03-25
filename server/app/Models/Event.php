<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $guarded = [];

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'event_id');
    }
}
