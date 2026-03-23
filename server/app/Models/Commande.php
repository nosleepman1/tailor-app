<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $guarded = [];

    public function tailor()
    {
        return $this->belongsTo(User::class, 'tailor_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
}
