<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;

class EventController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Event::class);

        $user = $request->user();
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 20);
        $isTailor = $user->hasRole('tailor');

        $cacheKey = $isTailor ? "events_tailor_page_{$page}_{$perPage}" : "events_admin_page_{$page}_{$perPage}";
        $tags = $isTailor ? ['tailor_' . $user->id, 'events'] : ['events'];

        $events = Cache::tags($tags)->remember($cacheKey, 3600, function () use ($request, $perPage, $isTailor, $user) {
            return Event::with(['commandes' => function($q) use ($isTailor, $user) {
                if ($isTailor) {
                    $q->where('tailor_id', $user->id)->with('client');
                } else {
                    $q->with('client', 'tailor');
                }
            }])->orderBy('date', 'asc')->paginate($perPage);
        });

        return response()->json($events);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Event::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:general,korite,tabaski,gammu,magal,mariage,bapteme,anniversaire,autre',
            'date' => 'nullable|date',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        Gate::authorize('view', $event);
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        Gate::authorize('update', $event);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:general,korite,tabaski,gammu,magal,mariage,bapteme,anniversaire,autre',
            'date' => 'nullable|date',
            'description' => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);
        $event->delete();
        return response()->json(null, 204);
    }
}
