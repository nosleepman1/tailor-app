<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Commande;
use Illuminate\Support\Facades\Gate;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Commande::class);

        $query = Commande::with(['client', 'event']);
        if ($request->user()->hasRole('tailor')) {
            $query->where('tailor_id', $request->user()->id);
        }
        
        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Commande::class);

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'new_client' => 'nullable|array',
            'new_client.full_name' => 'required_with:new_client|string|max:255',
            'new_client.phone' => 'nullable|string|max:255',
            'new_client.measurements' => 'nullable|array',
            'event_id' => 'nullable|exists:events,id',
            'fabric_description' => 'nullable|string',
            'model_photo' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,ready,delivered,cancelled',
            'price' => 'nullable|numeric',
            'deposit_paid' => 'nullable|numeric',
            'due_date' => 'nullable|date',
            'due_date_remaining' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['client_id']) && empty($validated['new_client'])) {
            return response()->json(['message' => 'Le client est requis.'], 422);
        }

        $clientId = $validated['client_id'] ?? null;

        if (!$clientId && !empty($validated['new_client'])) {
            $client = \App\Models\Client::create([
                'tailor_id' => $request->user()->id,
                'full_name' => $validated['new_client']['full_name'],
                'phone' => $validated['new_client']['phone'] ?? null,
            ]);
            
            if (!empty($validated['new_client']['measurements'])) {
                $client->measurement()->create($validated['new_client']['measurements']);
            }
            
            $clientId = $client->id;
        }

        $commandeData = collect($validated)->except(['new_client', 'images'])->toArray();
        $commandeData['client_id'] = $clientId;
        $commandeData['tailor_id'] = $request->user()->id;

        $uploadedImages = [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            if (isset($files['model'])) {
                $uploadedImages['model'] = $files['model']->store('commandes', 'public');
            }
            if (isset($files['fabric'])) {
                $uploadedImages['fabric'] = $files['fabric']->store('commandes', 'public');
            }
        }
        
        if (!empty($uploadedImages)) {
            $commandeData['images'] = $uploadedImages;
        }

        $commande = Commande::create($commandeData);

        if ($commande->deposit_paid > 0) {
            \App\Models\Revenue::create([
                'user_id' => $request->user()->id,
                'commande_id' => $commande->id,
                'client_id' => $clientId,
                'amount' => $commande->deposit_paid,
                'payment_date' => now(),
                'type' => 'advance',
                'status' => 'completed',
            ]);
        }

        return response()->json($commande->load(['client', 'event']), 201);
    }

    public function show(Commande $commande)
    {
        Gate::authorize('view', $commande);
        return response()->json($commande->load(['client', 'event']));
    }

    public function update(Request $request, Commande $commande)
    {
        Gate::authorize('update', $commande);

        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'event_id' => 'nullable|exists:events,id',
            'fabric_description' => 'nullable|string',
            'model_photo' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,ready,delivered,cancelled',
            'price' => 'nullable|numeric',
            'deposit_paid' => 'nullable|numeric',
            'due_date' => 'nullable|date',
            'due_date_remaining' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $oldDeposit = collect($commande)->get('deposit_paid');
        $updateData = $validated;
        
        $uploadedImages = $commande->images ?? [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            if (isset($files['model'])) {
                $uploadedImages['model'] = $files['model']->store('commandes', 'public');
            }
            if (isset($files['fabric'])) {
                $uploadedImages['fabric'] = $files['fabric']->store('commandes', 'public');
            }
        }
        
        if (!empty($uploadedImages)) {
            $updateData['images'] = $uploadedImages;
        }

        $commande->update($updateData);

        if (array_key_exists('deposit_paid', $validated) && $validated['deposit_paid'] > $oldDeposit) {
            \App\Models\Revenue::create([
                'user_id' => $request->user()->id,
                'commande_id' => $commande->id,
                'client_id' => $commande->client_id,
                'amount' => $validated['deposit_paid'] - $oldDeposit,
                'payment_date' => now(),
                'type' => $commande->price && $validated['deposit_paid'] >= $commande->price ? 'final' : 'advance',
                'status' => 'completed',
            ]);
        }

        return response()->json($commande->load(['client', 'event']));
    }

    public function destroy(Commande $commande)
    {
        Gate::authorize('delete', $commande);
        $commande->delete();
        return response()->json(null, 204);
    }
}
