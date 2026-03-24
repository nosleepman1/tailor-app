<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            // Add composite index for status + created_at (common in dashboard queries)
            $table->index(['status', 'created_at']);
            
            // Add index for due_date if not already present
            $table->index('due_date');
            
            // Add composite index for tailor_id + status (frequent in tailor‑scoped queries)
            $table->index(['tailor_id', 'status']);
            
            // Add index for client_id if not already present (foreign key may already have one)
            if (!Schema::hasIndex('commandes', 'commandes_client_id_index')) {
                $table->index('client_id');
            }
            
            // Add index for event_id if not already present
            if (!Schema::hasIndex('commandes', 'commandes_event_id_index')) {
                $table->index('event_id');
            }
        });
        
        Schema::table('clients', function (Blueprint $table) {
            // Add index for tailor_id if not already present (foreign key may already have one)
            if (!Schema::hasIndex('clients', 'clients_tailor_id_index')) {
                $table->index('tailor_id');
            }
            
            // Add index for created_at (used in recent_clients)
            $table->index('created_at');
        });
        
        Schema::table('events', function (Blueprint $table) {
            // Add index for date (used in upcoming events)
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropIndex(['status', 'created_at']);
            $table->dropIndex(['tailor_id', 'status']);
            $table->dropIndex('due_date');
            
            if (Schema::hasIndex('commandes', 'commandes_client_id_index')) {
                $table->dropIndex('commandes_client_id_index');
            }
            
            if (Schema::hasIndex('commandes', 'commandes_event_id_index')) {
                $table->dropIndex('commandes_event_id_index');
            }
        });
        
        Schema::table('clients', function (Blueprint $table) {
            $table->dropIndex('created_at');
            
            if (Schema::hasIndex('clients', 'clients_tailor_id_index')) {
                $table->dropIndex('clients_tailor_id_index');
            }
        });
        
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('date');
        });
    }
};