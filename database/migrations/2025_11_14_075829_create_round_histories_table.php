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
            $table->text('initial_code')->nullable();
            $table->text('user_code')->nullable();
            $table->integer('score')->default(0);
            $table->text('evaluation')->nullable();
            $table->timestamp('submitted_at')->nullable();
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
