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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('method', ['easypaisa', 'cash'])->default('cash');
            $table->unsignedInteger('amount'); // total amount paid by customer
            $table->decimal('commission_rate', 4, 2)->default(5.00); // percent
            $table->unsignedInteger('commission_amount'); // platform's cut
            $table->unsignedInteger('worker_payout'); // amount - commission
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
