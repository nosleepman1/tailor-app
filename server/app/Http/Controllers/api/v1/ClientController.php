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
        $this->authorizeResource(Client::class);
    }


    public function index()
    {
        return ClientResource::collection(Client::paginate(10));
    }

    public function store(StoreClientRequest $request)
    {
        $data = $request->validated();
        if($request->hasFile("image")){
            $data["image"] = $request->file("image")->store("clients", "public");
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
        $client->update($request->validated());

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            "message"=> "Client deleted successfully"
        ], 200);
    }
}
