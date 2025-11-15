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
            $table->text('question')->change();
            $table->text('host_code')->nullable(); // host's submitted code
            $table->text('guest_code')->nullable(); // guest's submitted code
            $table->text('host_explanation')->nullable()->change();
            $table->text('guest_explanation')->nullable()->change();
            $table->timestamp('host_submitted_at')->nullable();
            $table->timestamp('guest_submitted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('round_histories', function (Blueprint $table) {
            $table->dropColumn(['host_code', 'guest_code', 'host_submitted_at', 'guest_submitted_at', 'initial_code']);
        });
    }
};
