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
        Schema::create('worker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('category');
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->unsignedSmallInteger('experience_years')->default(0);
            $table->unsignedInteger('hourly_rate')->default(0);
            $table->string('service_area')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('total_jobs_done')->default(0);
            $table->timestamps();

            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worker_profiles');
    }
};
