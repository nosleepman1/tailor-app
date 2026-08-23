<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Sync\PushSyncRequest;
use App\Services\SyncService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SyncController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SyncService $syncService
    ) {}

    /**
     * Pull delta changes from server since last sync timestamp.
     */
    public function pull(Request $request): JsonResponse
    {
        $lastSyncedAt = $request->query('last_synced_at');

        $deltas = $this->syncService->pullDeltas($request->user(), $lastSyncedAt);

        return $this->successResponse($deltas, 'Synchronisation descendante réussie.');
    }

    /**
     * Push offline changes from Expo mobile device to server.
     */
    public function push(PushSyncRequest $request): JsonResponse
    {
        $result = $this->syncService->pushChanges(
            $request->user(),
            $request->validated('changes')
        );

        return $this->successResponse($result, 'Synchronisation montante réussie.');
    }
}
