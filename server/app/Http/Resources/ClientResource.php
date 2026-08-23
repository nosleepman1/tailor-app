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
            'id' => $this->id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'phone' => $this->phone,
            'price' => $this->price,
            'is_paid' => (bool) $this->is_paid,
            'livre' => (bool) $this->livre,
            'manche' => $this->manche,
            'epaule' => $this->epaule,
            'poitrine' => $this->poitrine,
            'taille' => $this->taille,
            'hanche' => $this->hanche,
            'cou' => $this->cou,
            'pantalon' => $this->pantalon,
            'fesse' => $this->fesse,
            'cuisse' => $this->cuisse,
            'biceps' => $this->biceps,
            'bras' => $this->bras,
            'model_image' => $this->model_image,
            'tissus_image' => $this->tissus_image,
            'mesures' => [
                'epaule' => $this->epaule,
                'taille' => $this->taille,
                'poitrine' => $this->poitrine,
                'hanche' => $this->hanche,
                'manche' => $this->manche,
                'cou' => $this->cou,
                'cuisse' => $this->cuisse,
                'bras' => $this->bras,
                'pantalon' => $this->pantalon,
                'biceps' => $this->biceps,
                'fesse' => $this->fesse,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
