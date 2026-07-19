<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\WorkerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * POST /api/bookings
     * Customer creates a booking request for a worker.
     * Matches frontend bookingService.create(data).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'customer') {
            return response()->json(['message' => 'Only customers can create bookings.'], 403);
        }

        $data = $request->validate([
            'worker_id' => ['required', 'exists:users,id'],
            'category' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'estimated_cost' => ['nullable', 'integer', 'min:0'],
        ]);

        $worker = \App\Models\User::where('id', $data['worker_id'])->where('role', 'worker')->first();
        if (! $worker) {
            return response()->json(['message' => 'Worker not found.'], 404);
        }

        $booking = Booking::create([
            'customer_id' => $user->id,
            'worker_id' => $data['worker_id'],
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'estimated_cost' => $data['estimated_cost'] ?? null,
            'status' => 'pending',
        ]);

        Notification::notify(
            $data['worker_id'],
            'booking',
            $booking->id,
            'New booking request',
            "{$user->full_name} requested a {$booking->category} job."
        );

        return response()->json($this->present($booking), 201);
    }

    /**
     * GET /api/bookings
     * Returns the authenticated user's bookings, as customer or as worker.
     * Matches frontend bookingService.list().
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::where('customer_id', $user->id)
            ->orWhere('worker_id', $user->id)
            ->with(['customer:id,full_name,phone', 'worker:id,full_name,phone', 'review', 'payment'])
            ->latest()
            ->get()
            ->map(fn (Booking $b) => $this->present($b));

        return response()->json($bookings);
    }

    /**
     * GET /api/bookings/{id}
     * Only the customer or worker on the booking can view it.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $booking = Booking::with(['customer:id,full_name,phone', 'worker:id,full_name,phone', 'review', 'payment'])
            ->findOrFail($id);

        $this->authorizeParty($request, $booking);

        return response()->json($this->present($booking));
    }

    /**
     * POST /api/bookings/{id}/accept — worker only, from pending.
     */
    public function accept(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $this->authorizeWorker($request, $booking);
        $this->requireStatus($booking, 'pending');

        $booking->update(['status' => 'accepted', 'accepted_at' => now()]);
        $booking->load(['customer', 'worker']);

        Notification::notify(
            $booking->customer_id,
            'booking',
            $booking->id,
            'Booking accepted',
            "{$booking->worker?->full_name} accepted your {$booking->category} request."
        );

        return response()->json($this->present($booking));
    }

    /**
     * POST /api/bookings/{id}/reject — worker only, from pending.
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $this->authorizeWorker($request, $booking);
        $this->requireStatus($booking, 'pending');

        $booking->update(['status' => 'rejected']);
        $booking->load(['customer', 'worker']);

        Notification::notify(
            $booking->customer_id,
            'booking',
            $booking->id,
            'Booking declined',
            "{$booking->worker?->full_name} declined your {$booking->category} request."
        );

        return response()->json($this->present($booking));
    }

    /**
     * POST /api/bookings/{id}/start — worker only, from accepted.
     */
    public function start(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $this->authorizeWorker($request, $booking);
        $this->requireStatus($booking, 'accepted');

        $booking->update(['status' => 'started', 'started_at' => now()]);
        $booking->load(['customer', 'worker']);

        Notification::notify(
            $booking->customer_id,
            'booking',
            $booking->id,
            'Work started',
            "{$booking->worker?->full_name} started your {$booking->category} job."
        );

        return response()->json($this->present($booking));
    }

    /**
     * POST /api/bookings/{id}/complete — worker only, from started.
     * Bumps the worker's total_jobs_done inside a transaction.
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $this->authorizeWorker($request, $booking);
        $this->requireStatus($booking, 'started');

        $data = $request->validate([
            'final_cost' => ['nullable', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($booking, $data) {
            $booking->update([
                'status' => 'completed',
                'completed_at' => now(),
                'final_cost' => $data['final_cost'] ?? $booking->estimated_cost,
            ]);

            WorkerProfile::where('user_id', $booking->worker_id)->increment('total_jobs_done');
        });

        $booking->load(['customer', 'worker']);

        Notification::notify(
            $booking->customer_id,
            'booking',
            $booking->id,
            'Job completed',
            "{$booking->worker?->full_name} marked your {$booking->category} job as complete."
        );

        return response()->json($this->present($booking));
    }

    /**
     * POST /api/bookings/{id}/cancel — customer only, from pending or accepted.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $booking = Booking::findOrFail($id);
        $this->authorizeCustomer($request, $booking);

        if (! in_array($booking->status, ['pending', 'accepted'], true)) {
            return response()->json(['message' => 'This booking can no longer be cancelled.'], 422);
        }

        $booking->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        $booking->load(['customer', 'worker']);

        Notification::notify(
            $booking->worker_id,
            'booking',
            $booking->id,
            'Booking cancelled',
            "{$booking->customer?->full_name} cancelled the {$booking->category} request."
        );

        return response()->json($this->present($booking));
    }

    // ---- Helpers ----

    private function authorizeParty(Request $request, Booking $booking): void
    {
        $userId = $request->user()->id;
        if ($booking->customer_id !== $userId && $booking->worker_id !== $userId) {
            abort(403, 'Not your booking.');
        }
    }

    private function authorizeWorker(Request $request, Booking $booking): void
    {
        if ($booking->worker_id !== $request->user()->id) {
            abort(403, 'Only the assigned worker can do this.');
        }
    }

    private function authorizeCustomer(Request $request, Booking $booking): void
    {
        if ($booking->customer_id !== $request->user()->id) {
            abort(403, 'Only the customer who booked this can do this.');
        }
    }

    private function requireStatus(Booking $booking, string $expected): void
    {
        if ($booking->status !== $expected) {
            abort(422, "Booking must be '{$expected}' for this action (currently '{$booking->status}').");
        }
    }

    /**
     * Flatten a booking with embedded customer_name / worker_name so the
     * frontend doesn't need extra lookups.
     */
    private function present(Booking $b): array
    {
        if (! $b->relationLoaded('review')) {
            $b->load('review');
        }
        if (! $b->relationLoaded('payment')) {
            $b->load('payment');
        }

        return [
            'id' => $b->id,
            'customer_id' => $b->customer_id,
            'worker_id' => $b->worker_id,
            'customer_name' => $b->customer?->full_name,
            'worker_name' => $b->worker?->full_name,
            'category' => $b->category,
            'description' => $b->description,
            'address' => $b->address,
            'city' => $b->city,
            'scheduled_at' => $b->scheduled_at,
            'status' => $b->status,
            'estimated_cost' => $b->estimated_cost,
            'final_cost' => $b->final_cost,
            'accepted_at' => $b->accepted_at,
            'started_at' => $b->started_at,
            'completed_at' => $b->completed_at,
            'cancelled_at' => $b->cancelled_at,
            'created_at' => $b->created_at,
            'is_reviewed' => $b->review !== null,
            'is_paid' => $b->payment !== null,
        ];
    }
}
