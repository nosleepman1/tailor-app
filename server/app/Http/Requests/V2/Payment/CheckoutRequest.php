<?php

namespace App\Http\Requests\V2\Payment;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan' => 'required|in:basic,premium',
            'cancel_url' => 'nullable|url',
            'return_url' => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'plan.required' => 'Le choix du forfait (basic ou premium) est obligatoire.',
            'plan.in' => 'Le forfait sélectionné n\'est pas valide.',
        ];
    }
}
