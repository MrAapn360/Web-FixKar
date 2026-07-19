<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * PUT /api/profile
     * Updates the base user fields (full_name, city, phone). Any authenticated
     * user, customer or worker.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $user->update($data);

        return response()->json($user);
    }

    /**
     * POST /api/profile/photo
     * Uploads (or replaces) the user's profile photo via Laravel Storage.
     * Old photo is deleted from disk if one existed.
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:4096'], // 4MB max
        ]);

        $user = $request->user();

        if ($user->photo_path) {
            Storage::disk('public')->delete($user->photo_path);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->update(['photo_path' => $path]);

        return response()->json([
            'photo_path' => $path,
            'photo_url' => Storage::disk('public')->url($path),
        ]);
    }

    /**
     * PUT /api/profile/worker
     * Updates worker-specific fields on the authenticated worker's
     * WorkerProfile. Creates the profile if it doesn't exist yet (first-time
     * setup at /worker/profile-setup).
     */
    public function updateWorkerProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'worker') {
            return response()->json(['message' => 'Only workers have a worker profile.'], 403);
        }

        $data = $request->validate([
            'category' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:60'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:60'],
            'hourly_rate' => ['nullable', 'integer', 'min:0'],
            'service_area' => ['nullable', 'string', 'max:255'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        $profile = WorkerProfile::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json($profile);
    }

    /**
     * DELETE /api/profile
     * Deletes the authenticated user's account. Per the roadmap: removes
     * only the user row (and their worker_profile, via FK cascade) — their
     * bookings, reviews, and payments stay in the database (customer_id /
     * worker_id on those rows become null instead of being deleted).
     */
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->photo_path) {
            Storage::disk('public')->delete($user->photo_path);
        }

        // Revoke all API tokens before deleting, for a clean logout everywhere.
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['ok' => true]);
    }
}
