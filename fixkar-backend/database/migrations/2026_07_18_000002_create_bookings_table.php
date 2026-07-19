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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('worker_id')->constrained('users')->cascadeOnDelete();
            $table->string('category');
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->enum('status', [
                'pending',   // customer created, waiting for worker
                'accepted',  // worker accepted
                'rejected',  // worker rejected
                'started',   // work in progress
                'completed', // work done
                'cancelled', // customer or worker cancelled
            ])->default('pending');
            $table->unsignedInteger('estimated_cost')->nullable();
            $table->unsignedInteger('final_cost')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
