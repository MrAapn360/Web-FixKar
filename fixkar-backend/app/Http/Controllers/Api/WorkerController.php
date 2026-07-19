<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    /**
     * GET /api/workers?category=&city=&search=
     * Matches frontend workerService.list({ category, city, search }).
     * Returns a flat array of worker objects (user fields + profile fields merged),
     * matching the shape of src/api/mockData.js MOCK_WORKERS.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->where('role', 'worker')
            ->whereHas('workerProfile')
            ->with('workerProfile');

        if ($category = $request->query('category')) {
            $query->whereHas('workerProfile', fn ($q) => $q->where('category', $category));
        }

        if ($city = $request->query('city')) {
            $query->where('city', $city);
        }

        if ($search = $request->query('search')) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like, $search) {
                $q->where('full_name', 'like', $like)
                    ->orWhereHas('workerProfile', function ($wp) use ($like, $search) {
                        $wp->where('category', 'like', $like)
                            ->orWhereJsonContains('skills', $search);
                    });
            });
        }

        $workers = $query->get()->map(fn (User $u) => $this->flatten($u));

        return response()->json($workers);
    }

    /**
     * GET /api/workers/{id}
     * Matches frontend workerService.get(id).
     */
    public function show(int $id): JsonResponse
    {
        $user = User::where('role', 'worker')
            ->whereHas('workerProfile')
            ->with('workerProfile')
            ->findOrFail($id);

        return response()->json($this->flatten($user));
    }

    /**
     * GET /api/workers/{id}/reviews
     * Matches frontend workerService.reviews(id). Returns the same tag/comment
     * shape as src/api/mockData.js MOCK_REVIEWS.
     */
    public function reviews(int $id): JsonResponse
    {
        $reviews = \App\Models\Review::where('worker_id', $id)
            ->with('customer:id,full_name')
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'worker_id' => $r->worker_id,
                'customer_name' => $r->customer?->full_name ?? 'Customer',
                'rating' => $r->rating,
                'comment' => $r->comment,
                'tags' => $r->tags ?? [],
                'created_at' => $r->created_at->toDateString(),
            ]);

        return response()->json($reviews);
    }

    /**
     * Flatten a User + WorkerProfile into the single object shape the
     * frontend already expects from its mock data.
     */
    private function flatten(User $u): array
    {
        $p = $u->workerProfile;

        return [
            'id' => $u->id,
            'full_name' => $u->full_name,
            'city' => $u->city,
            'photo_path' => $u->photo_path,
            'category' => $p->category,
            'bio' => $p->bio,
            'skills' => $p->skills ?? [],
            'experience_years' => $p->experience_years,
            'hourly_rate' => $p->hourly_rate,
            'service_area' => $p->service_area,
            'is_available' => (bool) $p->is_available,
            'is_verified' => (bool) $p->is_verified,
            'average_rating' => (float) $p->average_rating,
            'total_reviews' => $p->total_reviews,
            'total_jobs_done' => $p->total_jobs_done,
        ];
    }
}
