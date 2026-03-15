<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "email"=> "string|exists:users,email",
            "password"=> "string|required",
        ];
    }

    public function messages(): array
    {
        return [
            "email.string"=> "L'email doit être une chaîne de caractères",
            "email.exists"=> "L'email n'existe pas",
            "password.string"=> "Le mot de passe doit être une chaîne de caractères",
            "password.required"=> "Le mot de passe est requis",
        ];
    }
}
