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
        Schema::table('round_histories', function (Blueprint $table) {
            $table->timestamp('round_start_time')->nullable()->after('round_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('round_histories', function (Blueprint $table) {
            $table->dropColumn('round_start_time');
        });
    }
};
