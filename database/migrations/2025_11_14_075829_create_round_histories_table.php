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
        Schema::create('round_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('history_id')->constrained('histories')->onDelete('cascade');
            $table->integer('round_number');
            $table->string('question');
            $table->string('type'); // tipe soal
            $table->string('host_score_increase');
            $table->string('guest_score_increase');
            $table->string('host_explanation');
            $table->string('guest_explanation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('round_histories');
    }
};
