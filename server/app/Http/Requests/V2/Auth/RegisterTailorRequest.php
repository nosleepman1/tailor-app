<?php

namespace App\Http\Requests\V2\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterTailorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30|unique:users,phone',
            'email' => 'nullable|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'pin' => 'nullable|string|digits:4',
            'city' => 'nullable|string|max:100',
            'expo_push_token' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom complet ou nom d\'atelier est obligatoire.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé par un autre compte.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit comporter au moins 6 caractères.',
            'pin.digits' => 'Le code PIN doit comporter exactement 4 chiffres.',
        ];
    }
}
