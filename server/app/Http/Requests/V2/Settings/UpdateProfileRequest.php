<?php

namespace App\Http\Requests\V2\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|nullable|email|unique:users,email,' . $this->user()->id,
            'phone' => 'sometimes|nullable|string|max:30|unique:users,phone,' . $this->user()->id,
            'city' => 'sometimes|nullable|string|max:100',
            'expo_push_token' => 'sometimes|nullable|string',
        ];
    }
}
