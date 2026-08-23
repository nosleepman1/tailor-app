<?php

namespace App\Http\Requests\V2\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login' => 'required|string', // phone or email
            'password_or_pin' => 'required|string',
            'expo_push_token' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'login.required' => 'Le numéro de téléphone ou l\'adresse email est obligatoire.',
            'password_or_pin.required' => 'Le code PIN ou le mot de passe est obligatoire.',
        ];
    }
}
