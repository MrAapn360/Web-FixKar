<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WorkerController;
use Illuminate\Support\Facades\Route;

// ---- Auth (public) ----
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---- Workers (public browse) ----
Route::get('/workers', [WorkerController::class, 'index']);
Route::get('/workers/{id}', [WorkerController::class, 'show']);
Route::get('/workers/{id}/reviews', [WorkerController::class, 'reviews']);

// ---- Authenticated ----
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/select-role', [AuthController::class, 'selectRole']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::post('/bookings/{id}/accept', [BookingController::class, 'accept']);
    Route::post('/bookings/{id}/reject', [BookingController::class, 'reject']);
    Route::post('/bookings/{id}/start', [BookingController::class, 'start']);
    Route::post('/bookings/{id}/complete', [BookingController::class, 'complete']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{id}/review', [ReviewController::class, 'store']);
    Route::post('/bookings/{id}/payment', [PaymentController::class, 'store']);
    Route::get('/bookings/{id}/payment', [PaymentController::class, 'show']);

    Route::get('/payment-method', [PaymentMethodController::class, 'show']);
    Route::put('/payment-method', [PaymentMethodController::class, 'update']);

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
    Route::put('/profile/worker', [ProfileController::class, 'updateWorkerProfile']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});
