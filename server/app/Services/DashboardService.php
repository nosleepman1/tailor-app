<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Commande;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function getTailorStats(User $tailor): array
    {
        $tailorId = $tailor->id;

        $fetcher = function () use ($tailorId) {
            $now = now();
            $startOfWeek = $now->copy()->startOfWeek();
            $endOfWeek = $now->copy()->endOfWeek();
            $next14Days = $now->copy()->addDays(14);

            // 1. Single consolidated query for primary aggregates
            $metrics = Commande::where('tailor_id', $tailorId)
                ->selectRaw("
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status IN ('pending', 'in_progress', 'ready') THEN 1 ELSE 0 END) as active_orders,
                    SUM(CASE WHEN status IN ('pending', 'in_progress', 'ready') AND due_date BETWEEN ? AND ? THEN 1 ELSE 0 END) as orders_due_this_week,
                    SUM(CASE WHEN status = 'delivered' THEN COALESCE(price, 0) ELSE 0 END) as total_revenue,
                    SUM(CASE WHEN status = 'delivered' AND strftime('%m', updated_at) = ? AND strftime('%Y', updated_at) = ? THEN COALESCE(price, 0) ELSE 0 END) as revenue_month,
                    SUM(CASE WHEN status = 'delivered' AND strftime('%Y', updated_at) = ? THEN COALESCE(price, 0) ELSE 0 END) as revenue_year,
                    SUM(CASE WHEN status != 'cancelled' AND COALESCE(price, 0) > COALESCE(deposit_paid, 0) THEN (COALESCE(price, 0) - COALESCE(deposit_paid, 0)) ELSE 0 END) as total_debt
                ", [
                    $startOfWeek->toDateString(),
                    $endOfWeek->toDateString(),
                    $now->format('m'),
                    $now->format('Y'),
                    $now->format('Y'),
                ])
                ->first();

            // Total clients count
            $totalClients = Client::where('tailor_id', $tailorId)->count();

            // 2. Debtors summary
            $debtors = Commande::where('commandes.tailor_id', $tailorId)
                ->where('commandes.status', '!=', 'cancelled')
                ->whereRaw('COALESCE(price, 0) > COALESCE(deposit_paid, 0)')
                ->join('clients', 'commandes.client_id', '=', 'clients.id')
                ->selectRaw('
                    clients.id as client_id,
                    clients.full_name,
                    clients.phone,
                    SUM(COALESCE(commandes.price, 0) - COALESCE(commandes.deposit_paid, 0)) as amount_owed,
                    MAX(commandes.due_date_remaining) as next_due
                ')
                ->groupBy('clients.id', 'clients.full_name', 'clients.phone')
                ->get();

            // 3. Upcoming deadlines (next 14 days)
            $upcomingDeadlines = Commande::where('tailor_id', $tailorId)
                ->whereIn('status', ['pending', 'in_progress', 'ready'])
                ->whereNotNull('due_date')
                ->whereBetween('due_date', [$now->toDateString(), $next14Days->toDateString()])
                ->with('client:id,full_name,phone')
                ->orderBy('due_date', 'asc')
                ->take(5)
                ->get();

            // 4. Revenue by event
            $revenueByEvent = Commande::where('commandes.tailor_id', $tailorId)
                ->where('commandes.status', 'delivered')
                ->leftJoin('events', 'commandes.event_id', '=', 'events.id')
                ->selectRaw("COALESCE(events.name, 'Général') as event_name, SUM(COALESCE(commandes.price, 0)) as total_revenue")
                ->groupBy('events.name')
                ->get();

            return [
                'total_clients' => $totalClients,
                'active_orders' => (int) ($metrics->active_orders ?? 0),
                'orders_due_this_week' => (int) ($metrics->orders_due_this_week ?? 0),
                'total_revenue' => (float) ($metrics->total_revenue ?? 0),
                'revenue_month' => (float) ($metrics->revenue_month ?? 0),
                'revenue_year' => (float) ($metrics->revenue_year ?? 0),
                'total_debt' => (float) ($metrics->total_debt ?? 0),
                'debtors' => $debtors,
                'upcoming_deadlines' => $upcomingDeadlines,
                'revenue_by_event' => $revenueByEvent,
            ];
        };

        try {
            return Cache::tags(["tailor_{$tailorId}"])->remember('dashboard_stats', 3600, $fetcher);
        } catch (\Throwable $e) {
            return $fetcher();
        }
    }

    public function getAdminStats(): array
    {
        return [
            'total_tailors' => User::role('tailor')->count(),
            'total_clients' => Client::count(),
            'total_orders' => Commande::count(),
            'revenue_total' => (float) Commande::where('status', 'delivered')->sum('price'),
            'active_tailors' => User::role('tailor')
                ->withCount('commandes')
                ->orderByDesc('commandes_count')
                ->take(10)
                ->get(['id', 'name', 'email', 'phone', 'city', 'active', 'is_subscribed']),
        ];
    }
}
