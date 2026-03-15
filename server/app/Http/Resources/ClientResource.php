<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "name"=> $this->firstname." ".$this->lastname,
            "email"=> $this->email,
            "phone"=> $this->phone,
            "username"=> $this->username,
            "taille"=> $this->taille,
            "poitrine"=> $this->poitrine,
            "epaule"=> $this->epaule,
            "hanche"=> $this->hanche,
            "cou"=> $this->cou,
            "pantalon"=> $this->pantalon,
            "fesse"=> $this->fesse,
            "cuisse"=> $this->cuisse,
            "biceps"=> $this->biceps,
            "bras"=> $this->bras,
            "image"=> $this->image,
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
        ];
    }
}
