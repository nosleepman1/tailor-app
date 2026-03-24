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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['general', 'korite', 'tabaski', 'gammu', 'magal', 'mariage', 'bapteme', 'anniversaire', 'autre'])->default('general');
            $table->date('date')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();

            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
