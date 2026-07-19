<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Models\WorkerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * POST /api/bookings/{id}/review
     * Customer leaves a review on a completed booking they made. One review
     * per booking (enforced by the unique booking_id column too).
     * Recalculates the worker's average_rating + total_reviews atomically.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $booking = Booking::with('review')->findOrFail($id);

        if ($booking->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the customer on this booking can review it.'], 403);
        }

        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'You can only review a completed booking.'], 422);
        }

        if ($booking->review) {
            return response()->json(['message' => 'You already reviewed this booking.'], 422);
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
        ]);

        $review = DB::transaction(function () use ($booking, $data) {
            $review = Review::create([
                'booking_id' => $booking->id,
                'customer_id' => $booking->customer_id,
                'worker_id' => $booking->worker_id,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
                'tags' => $data['tags'] ?? [],
            ]);

            $profile = WorkerProfile::where('user_id', $booking->worker_id)->lockForUpdate()->first();

            if ($profile) {
                $newTotal = $profile->total_reviews + 1;
                $newAverage = (($profile->average_rating * $profile->total_reviews) + $data['rating']) / $newTotal;

                $profile->update([
                    'total_reviews' => $newTotal,
                    'average_rating' => round($newAverage, 2),
                ]);
            }

            return $review;
        });

        return response()->json($review, 201);
    }
}
