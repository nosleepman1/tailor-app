<?php

namespace App\Http\Requests\V2\Sync;

use Illuminate\Foundation\Http\FormRequest;

class PushSyncRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'changes' => 'required|array',
            'changes.clients' => 'nullable|array',
            'changes.clients.created' => 'nullable|array',
            'changes.clients.updated' => 'nullable|array',
            'changes.commandes' => 'nullable|array',
            'changes.commandes.created' => 'nullable|array',
            'changes.commandes.updated' => 'nullable|array',
        ];
    }
}
