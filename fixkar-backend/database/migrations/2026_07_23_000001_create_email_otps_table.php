<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Stores short-lived one-time codes for email verification. Keyed by
     * email (not user_id) so a code can be issued/checked even in the brief
     * window right after registration. One row per email — a new code
     * overwrites the previous one instead of accumulating rows.
     */
    public function up(): void
    {
        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('code', 6);
            $table->timestamp('expires_at');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
};
