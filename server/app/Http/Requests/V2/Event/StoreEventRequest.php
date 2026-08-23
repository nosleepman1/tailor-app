<?php

namespace App\Http\Requests\V2\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type' => 'required|in:general,korite,tabaski,gammu,magal,mariage,bapteme,anniversaire,autre',
            'date' => 'nullable|date',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l\'événement est obligatoire.',
            'type.required' => 'Le type d\'événement est obligatoire.',
            'type.in' => 'Le type d\'événement n\'est pas valide.',
        ];
    }
}
