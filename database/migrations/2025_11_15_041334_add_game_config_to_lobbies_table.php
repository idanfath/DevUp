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
        Schema::table('lobbies', function (Blueprint $table) {
            $table->string('language')->nullable(); // programming language
            $table->string('difficulty')->nullable(); // easy, medium, hard
            $table->integer('round_count')->default(3); // best of N rounds
            $table->string('game_type')->nullable(); // debug or problem-solving
            $table->integer('current_round')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lobbies', function (Blueprint $table) {
            $table->dropColumn(['language', 'difficulty', 'round_count', 'game_type', 'current_round']);
        });
    }
};
