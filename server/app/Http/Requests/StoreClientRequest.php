<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'firstname' => 'nullable|string|min:3', // Frontend uses full_name, making this optional temporarily if they don't send it or handle it in controller
            'lastname' => 'nullable|string|min:3',
            'full_name' => 'nullable|string|min:3', // Add full_name from frontend
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
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
            'model_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'tissus_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ];
    }

    public function messages(): array
    {
        return [
            'firstname.required' => 'Le prénom est requis',
            'lastname.required' => 'Le nom est requis',
            'firstname.min' => 'Le prénom doit comporter au moins 3 caractères',
            'lastname.min' => 'Le nom doit comporter au moins 3 caractères',
            'phone.max' => 'Le numéro de téléphone ne doit pas dépasser 15 caractères',
            'epaule.integer' => "L'épaule doit être un entier",
            'poitrine.integer' => 'La poitrine doit être un entier',
            'taille.integer' => 'La taille doit être un entier',
            'hanche.integer' => 'La hanche doit être un entier',
            'cou.integer' => 'Le cou doit être un entier',
            'pantalon.integer' => 'Le pantalon doit être un entier',
            'fesse.integer' => 'La fesse doit être un entier',
            'cuisse.integer' => 'La cuisse doit être un entier',
            'biceps.integer' => 'Le biceps doit être un entier',
            'bras.integer' => 'Le bras doit être un entier',
            'image.image' => 'Le fichier doit être une image',
            'image.mimes' => "L'image doit être au format jpeg, png, jpg, gif ou svg",
            'image.max' => "L'image ne doit pas dépasser 4 Mo",
        ];
    }
}
