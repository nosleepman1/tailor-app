<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Client;
use App\Models\Commande;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $stats = [
                'total_tailors' => User::whereHas('roles', fn($q) => $q->where('name', 'tailor'))->count(),
                'total_clients' => Client::count(),
                'total_orders' => Commande::count(),
                'revenue_total' => Commande::where('status', 'delivered')->sum('price'),
                'active_tailors' => User::whereHas('roles', fn($q) => $q->where('name', 'tailor'))->withCount('commandes')->orderByDesc('commandes_count')->take(5)->get(),
            ];
            return response()->json(['role' => 'admin', 'stats' => $stats]);
        }

        // Tailor View
        $activeOrdersQuery = Commande::where('tailor_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress', 'ready']);

        // Cache the dashboard stats for 24 hours (will be invalidated by Observers)
        $stats = Cache::tags(['tailor_' . $user->id])->remember('dashboard_stats', 86400, function () use ($user, $activeOrdersQuery) {
            return [
                'total_clients' => Client::where('tailor_id', $user->id)->count(),
                'active_orders' => $activeOrdersQuery->count(),
                'orders_due_this_week' => (clone $activeOrdersQuery)
                    ->whereNotNull('due_date')
                    ->whereBetween('due_date', [now()->startOfWeek(), now()->endOfWeek()])
                    ->count(),
                'total_revenue' => Commande::where('tailor_id', $user->id)
                    ->where('status', 'delivered')
                    ->sum('price'),
                'revenue_month' => Commande::where('tailor_id', $user->id)
                    ->where('status', 'delivered')
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at', now()->year)
                    ->sum('price'),
                'revenue_year' => Commande::where('tailor_id', $user->id)
                    ->where('status', 'delivered')
                    ->whereYear('updated_at', now()->year)
                    ->sum('price'),
                'total_debt' => Commande::where('tailor_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereRaw('price > deposit_paid')
                    ->sum(\Illuminate\Support\Facades\DB::raw('price - deposit_paid')),
                'debtors' => Commande::with('client')
                    ->where('tailor_id', $user->id)
                    ->where('status', '!=', 'cancelled')
                    ->whereRaw('price > deposit_paid')
                    ->selectRaw('client_id, SUM(price - deposit_paid) as amount_owed, MAX(due_date_remaining) as next_due')
                    ->groupBy('client_id')
                    ->get()
                    ->map(fn($c) => [
                        'client' => $c->client,
                        'amount_owed' => $c->amount_owed,
                        'next_due' => $c->next_due,
                    ]),
                'revenue_by_event' => Commande::with('event')
                    ->where('tailor_id', $user->id)
                    ->where('status', 'delivered')
                    ->selectRaw('event_id, SUM(price) as total')
                    ->groupBy('event_id')
                    ->get()
                    ->map(fn($c) => [
                        'event' => $c->event ? $c->event->name : 'Général',
                        'total_revenue' => $c->total
                    ]),
                'upcoming_deadlines' => Commande::with('client')
                    ->where('tailor_id', $user->id)
                    ->whereIn('status', ['pending', 'in_progress', 'ready'])
                    ->whereNotNull('due_date')
                    ->whereBetween('due_date', [now(), now()->addDays(14)])
                    ->orderBy('due_date', 'asc')
                    ->take(5)
                    ->get(),
            ];
        });

        return response()->json(['role' => 'tailor', 'stats' => $stats]);
    }
}
