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
        Schema::table('clients', function (Blueprint $table) {
            if (! Schema::hasColumn('clients', 'manche')) {
                $table->integer('manche')->nullable()->after('price');
            }
            if (! Schema::hasColumn('clients', 'model_image')) {
                $table->string('model_image')->nullable()->after('bras');
            }
            if (! Schema::hasColumn('clients', 'tissus_image')) {
                $table->string('tissus_image')->nullable()->after('model_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['manche', 'model_image', 'tissus_image']);
        });
    }
};
