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
        Schema::create('histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host')->constrained('users')->onDelete('cascade');
            $table->foreignId('guest')->constrained('users')->onDelete('cascade');
            $table->string('language');
            $table->string('difficulty');
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('host_score')->default(0);
            $table->integer('guest_score')->default(0);
            $table->string('gametype');
            $table->integer('round');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histories');
    }
};
