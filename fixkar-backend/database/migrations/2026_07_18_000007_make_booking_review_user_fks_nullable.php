<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Deleting a user's account should only remove that user + their
     * worker_profile (per the roadmap) — bookings, reviews, and payments
     * must survive so the other party's history stays intact. This changes
     * bookings.customer_id / bookings.worker_id / reviews.customer_id /
     * reviews.worker_id from cascadeOnDelete to nullable + nullOnDelete.
     *
     * payments and worker_profiles are untouched: payments cascade from
     * bookings.booking_id (fine, the booking itself survives), and
     * worker_profiles is meant to be deleted with the user.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['worker_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable()->change();
            $table->unsignedBigInteger('worker_id')->nullable()->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('worker_id')->references('id')->on('users')->nullOnDelete();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['worker_id']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable()->change();
            $table->unsignedBigInteger('worker_id')->nullable()->change();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('worker_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['worker_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable(false)->change();
            $table->unsignedBigInteger('worker_id')->nullable(false)->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('worker_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['worker_id']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id')->nullable(false)->change();
            $table->unsignedBigInteger('worker_id')->nullable(false)->change();
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('worker_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
