<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Client;
use App\Models\Commande;
use App\Models\User;

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
        $stats = [
            'total_clients' => Client::where('tailor_id', $user->id)->count(),
            'active_orders' => Commande::where('tailor_id', $user->id)
                ->whereIn('status', ['pending', 'in_progress', 'ready'])
                ->count(),
            'revenue_month' => Commande::where('tailor_id', $user->id)
                ->where('status', 'delivered')
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->sum('price'),
            'upcoming_deadlines' => Commande::with('client')
                ->where('tailor_id', $user->id)
                ->whereIn('status', ['pending', 'in_progress', 'ready'])
                ->whereNotNull('due_date')
                ->whereBetween('due_date', [now(), now()->addDays(14)])
                ->orderBy('due_date', 'asc')
                ->take(5)
                ->get(),
        ];
        return response()->json(['role' => 'tailor', 'stats' => $stats]);
    }
}
