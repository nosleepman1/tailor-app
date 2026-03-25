<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Client;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Client::class);

        $user = $request->user();
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 20);

        $query = Client::query();

        if ($user->hasRole('tailor')) {
            $query->where('tailor_id', $user->id);
            
            $cacheKey = "clients_page_{$page}_{$perPage}";
            
            $result = Cache::tags(['tailor_' . $user->id])->remember($cacheKey, 1800, function () use ($query, $perPage) {
                return $query->withCount(['commandes as active_orders_count' => function($q) {
                        $q->whereIn('status', ['pending', 'in_progress', 'ready']);
                    }])->latest()->paginate($perPage);
            });
            return response()->json($result);
        }

        return response()->json(
                $query->withCount(['commandes as active_orders_count' => function($q) {
                    $q->whereIn('status', ['pending', 'in_progress', 'ready']);
                }
            ])->latest()->paginate($perPage));
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
