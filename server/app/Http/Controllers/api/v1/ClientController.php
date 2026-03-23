<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function __construct()
    {
        // $this->authorizeResource(Client::class, 'client');
    }

    public function index()
    {
        $clients = Client::orderBy('created_at', 'desc')->get();

        return ClientResource::collection($clients);
    }

    public function store(StoreClientRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('model_image')) {
            $data['model_image'] = $request->file('model_image')->store('clients', 'public');
        }
        if ($request->hasFile('tissus_image')) {
            $data['tissus_image'] = $request->file('tissus_image')->store('clients', 'public');
        }

        $client = Client::create($data);

        return new ClientResource($client);
    }

    public function show(Client $client)
    {
        return new ClientResource($client);
    }

    public function update(StoreClientRequest $request, Client $client)
    {
        $data = $request->validated();
        if ($request->hasFile('model_image')) {
            $data['model_image'] = $request->file('model_image')->store('clients', 'public');
        }
        if ($request->hasFile('tissus_image')) {
            $data['tissus_image'] = $request->file('tissus_image')->store('clients', 'public');
        }

        $client->update($data);

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully',
        ], 200);
    }

    public function updateStatus(Request $request, Client $client)
    {
        $validated = $request->validate([
            'is_paid' => 'sometimes|boolean',
            'livre' => 'sometimes|boolean',
        ]);
        $client->update($validated);

        return new ClientResource($client);
    }
}
