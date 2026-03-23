<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'firstname' => 'sometimes|string|min:2',
            'lastname' => 'sometimes|string|min:2',
            'username' => ['sometimes', 'string', Rule::unique('users', 'username')->ignore($userId)],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:admin,client',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
