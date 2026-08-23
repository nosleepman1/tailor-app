<?php

namespace App\Http\Requests\V2\Commande;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'nullable|exists:clients,id',
            'new_client' => 'nullable|array',
            'new_client.full_name' => 'required_with:new_client|string|max:255',
            'new_client.phone' => 'nullable|string|max:30',
            'new_client.email' => 'nullable|email|max:255',
            'new_client.measurements' => 'nullable|array',
            'event_id' => 'nullable|exists:events,id',
            'fabric_description' => 'nullable|string',
            'model_photo' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,ready,delivered,cancelled',
            'price' => 'nullable|numeric|min:0',
            'deposit_paid' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'due_date_remaining' => 'nullable|date',
            'notes' => 'nullable|string',
            'images.model' => 'nullable|file|image|max:10240',
            'images.fabric' => 'nullable|file|image|max:10240',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (empty($this->client_id) && empty($this->input('new_client.full_name'))) {
                $validator->errors()->add('client_id', 'Un client existant (client_id) ou un nouveau client (new_client.full_name) est requis.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'client_id.exists' => 'Le client sélectionné n\'existe pas.',
            'event_id.exists' => 'L\'événement sélectionné n\'existe pas.',
            'price.numeric' => 'Le prix doit être un nombre valide.',
            'deposit_paid.numeric' => 'L\'acompte doit être un nombre valide.',
        ];
    }
}
