<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    private const COMMISSION_RATE = 5.00; // percent, platform's cut

    /**
     * POST /api/bookings/{id}/payment
     * Customer records a dummy payment (cash or EasyPaisa) for their own
     * completed booking. One payment per booking (unique booking_id).
     * Computes 5% platform commission and the worker's payout, then marks
     * the payment (and effectively the booking) as paid.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $booking = Booking::with('payment')->findOrFail($id);

        if ($booking->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Only the customer on this booking can pay for it.'], 403);
        }

        if ($booking->status !== 'completed') {
            return response()->json(['message' => 'You can only pay for a completed booking.'], 422);
        }

        if ($booking->payment) {
            return response()->json(['message' => 'This booking has already been paid.'], 422);
        }

        $data = $request->validate([
            'method' => ['required', 'in:easypaisa,cash'],
            'amount' => ['nullable', 'integer', 'min:0'],
        ]);

        $amount = $data['amount'] ?? $booking->final_cost ?? $booking->estimated_cost;

        if (! $amount) {
            return response()->json(['message' => 'No amount specified for this booking.'], 422);
        }

        $payment = DB::transaction(function () use ($booking, $data, $amount) {
            $commissionAmount = (int) round($amount * (self::COMMISSION_RATE / 100));
            $workerPayout = $amount - $commissionAmount;

            $payment = Payment::create([
                'booking_id' => $booking->id,
                'method' => $data['method'],
                'amount' => $amount,
                'commission_rate' => self::COMMISSION_RATE,
                'commission_amount' => $commissionAmount,
                'worker_payout' => $workerPayout,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            if (! $booking->final_cost) {
                $booking->update(['final_cost' => $amount]);
            }

            return $payment;
        });

        Notification::notify(
            $booking->worker_id,
            'payment',
            $booking->id,
            'Payment received',
            "You were paid Rs {$payment->worker_payout} for the {$booking->category} job."
        );

        return response()->json($payment, 201);
    }

    /**
     * GET /api/bookings/{id}/payment
     * Either party on the booking can view the payment record.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $booking = Booking::with('payment')->findOrFail($id);
        $userId = $request->user()->id;

        if ($booking->customer_id !== $userId && $booking->worker_id !== $userId) {
            return response()->json(['message' => 'Not your booking.'], 403);
        }

        if (! $booking->payment) {
            return response()->json(['message' => 'No payment recorded yet.'], 404);
        }

        return response()->json($booking->payment);
    }
}
