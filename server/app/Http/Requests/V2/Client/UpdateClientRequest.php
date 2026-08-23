<?php

namespace App\Http\Requests\V2\Client;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'photo' => 'nullable|string',
            'notes' => 'nullable|string',
            'measurements' => 'nullable|array',
            'measurements.neck' => 'nullable|numeric|min:0',
            'measurements.chest' => 'nullable|numeric|min:0',
            'measurements.shoulder' => 'nullable|numeric|min:0',
            'measurements.arm_length' => 'nullable|numeric|min:0',
            'measurements.belly' => 'nullable|numeric|min:0',
            'measurements.boubou_length' => 'nullable|numeric|min:0',
            'measurements.pant_length' => 'nullable|numeric|min:0',
            'measurements.hips' => 'nullable|numeric|min:0',
            'measurements.thigh' => 'nullable|numeric|min:0',
            'measurements.biceps' => 'nullable|numeric|min:0',
        ];
    }
}
