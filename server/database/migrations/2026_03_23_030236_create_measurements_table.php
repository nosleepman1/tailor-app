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
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->float('neck')->nullable(); // cou
            $table->float('chest')->nullable(); // poitrine
            $table->float('shoulder')->nullable(); // epaule
            $table->float('arm_length')->nullable(); // longueurbras
            $table->float('belly')->nullable(); // ventre
            $table->float('boubou_length')->nullable(); // longueur boubou
            $table->float('pant_length')->nullable(); // longueur pantalon
            $table->float('hips')->nullable(); // fesse
            $table->float('thigh')->nullable(); // cuisse
            $table->float('biceps')->nullable(); // biceps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measurements');
    }
};
