<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * POST /api/register
     * Matches frontend authService.register({ full_name, email, password, role?, worker_profile? }).
     * Role is optional for backward compatibility with the /role-selection fallback
     * flow, but the dedicated Customer/Worker signup forms pass it directly so the
     * account is fully set up (and, for workers, their service profile too) in one
     * request — no separate "select your role" detour after signup.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['customer', 'worker'])],
            'worker_profile' => ['nullable', 'array'],
            'worker_profile.category' => ['required_with:worker_profile', 'string', 'max:255'],
            'worker_profile.bio' => ['nullable', 'string', 'max:2000'],
            'worker_profile.skills' => ['nullable', 'array'],
            'worker_profile.skills.*' => ['string', 'max:60'],
            'worker_profile.experience_years' => ['nullable', 'integer', 'min:0', 'max:60'],
            'worker_profile.hourly_rate' => ['nullable', 'integer', 'min:0'],
            'worker_profile.service_area' => ['nullable', 'string', 'max:255'],
            'worker_profile.city' => ['nullable', 'string', 'max:255'],
        ]);

        if (User::where('email', $data['email'])->exists()) {
            return response()->json(['message' => 'Email already registered.'], 422);
        }

        $user = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? null,
            'city' => $data['worker_profile']['city'] ?? null,
        ]);

        if (($data['role'] ?? null) === 'worker' && ! empty($data['worker_profile'])) {
            WorkerProfile::create([
                'user_id' => $user->id,
                'category' => $data['worker_profile']['category'],
                'bio' => $data['worker_profile']['bio'] ?? null,
                'skills' => $data['worker_profile']['skills'] ?? [],
                'experience_years' => $data['worker_profile']['experience_years'] ?? null,
                'hourly_rate' => $data['worker_profile']['hourly_rate'] ?? null,
                'service_area' => $data['worker_profile']['service_area'] ?? null,
                'is_available' => true,
            ]);
        }

        $token = $user->createToken('fixkar')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * POST /api/login
     * Matches frontend authService.login({ email, password }).
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            // Flat { message } shape (not Laravel's default validation-error wrapper)
            // so the frontend's err.response.data.message reads the real reason.
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $token = $user->createToken('fixkar')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * GET /api/me
     * Matches frontend authService.me().
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * POST /api/select-role
     * Matches frontend authService.selectRole(role).
     */
    public function selectRole(Request $request): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['customer', 'worker'])],
        ]);

        $user = $request->user();
        $user->role = $data['role'];
        $user->save();

        return response()->json($user);
    }

    /**
     * POST /api/logout
     * Matches frontend authService.logout().
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['ok' => true]);
    }
}
