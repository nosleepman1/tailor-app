<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Client;
use Illuminate\Support\Facades\Gate;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Client::class);

        $query = Client::query();
        if ($request->user()->hasRole('tailor')) {
            $query->where('tailor_id', $request->user()->id);
        }

        return response()->json(
                $query->withCount(['commandes as active_orders_count' => function($q) {
                    $q->whereIn('status', ['pending', 'in_progress', 'ready']);
                }
            ])->latest()->paginate($request->input('per_page', 20)));
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Client::class);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'photo' => 'nullable|string',
            'measurements' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $validated['tailor_id'] = $request->user()->id;
        $measurements = $validated['measurements'] ?? null;
        unset($validated['measurements']);

        $client = Client::create($validated);

        if ($measurements) {
            $client->measurement()->create($measurements);
        }

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        Gate::authorize('view', $client);
        return response()->json($client->load('commandes.event'));
    }

    public function update(Request $request, Client $client)
    {
        Gate::authorize('update', $client);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'photo' => 'nullable|string',
            'measurements' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $measurements = $validated['measurements'] ?? null;
        unset($validated['measurements']);

        $client->update($validated);

        if ($measurements) {
            $client->measurement()->updateOrCreate(['client_id' => $client->id], $measurements);
        }

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        Gate::authorize('delete', $client);
        $client->delete();
        return response()->json(null, 204);
    }
}
