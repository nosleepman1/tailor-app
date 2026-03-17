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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->float('price')->nullable();
            $table->integer('manche')->nullable();
            $table->string('phone')->nullable();
            $table->integer('epaule')->nullable();
            $table->integer('poitrine')->nullable();
            $table->integer('taille')->nullable();
            $table->integer('hanche')->nullable();
            $table->integer('cou')->nullable();
            $table->integer('pantalon')->nullable();
            $table->integer('fesse')->nullable();
            $table->integer('cuisse')->nullable();
            $table->integer('biceps')->nullable();
            $table->integer('bras')->nullable();
            $table->string('model_image')->nullable();
            $table->string('tissus_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
