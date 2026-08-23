<?php

namespace App\Http\Requests\V2\Commande;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'sometimes|exists:clients,id',
            'event_id' => 'nullable|exists:events,id',
            'fabric_description' => 'nullable|string',
            'model_photo' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,ready,delivered,cancelled',
            'price' => 'nullable|numeric|min:0',
            'deposit_paid' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'due_date_remaining' => 'nullable|date',
            'notes' => 'nullable|string',
            'images.model' => 'nullable|file|image|max:10240',
            'images.fabric' => 'nullable|file|image|max:10240',
        ];
    }
}
