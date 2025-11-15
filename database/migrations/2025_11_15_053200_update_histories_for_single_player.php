<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clear existing data since we're changing the structure significantly
        DB::table('histories')->truncate();

        Schema::table('histories', function (Blueprint $table) {
            // Drop multiplayer columns
            $table->dropForeign(['host']);
            $table->dropForeign(['guest']);
            $table->dropForeign(['winner_id']);
            $table->dropColumn(['host', 'guest', 'winner_id', 'host_score', 'guest_score']);

            // Add single player columns
            $table->foreignId('user_id')->after('id')->constrained('users')->onDelete('cascade');
            $table->integer('total_score')->default(0)->after('end_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('histories', function (Blueprint $table) {
            // Restore multiplayer columns
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'total_score']);

            $table->foreignId('host')->after('id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guest')->after('host')->constrained('users')->onDelete('cascade');
            $table->integer('host_score')->default(0)->after('end_time');
            $table->integer('guest_score')->default(0)->after('host_score');
            $table->foreignId('winner_id')->nullable()->after('guest_score')->constrained('users')->onDelete('set null');
        });
    }
};
