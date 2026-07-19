<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * GET /api/payment-method
     * Returns the authenticated user's saved payout method, or an empty
     * shape if they haven't set one up yet.
     */
    public function show(Request $request): JsonResponse
    {
        $method = PaymentMethod::where('user_id', $request->user()->id)->first();

        return response()->json($method ?? [
            'easypaisa_number' => null,
            'account_title' => null,
        ]);
    }

    /**
     * PUT /api/payment-method
     * Create or update the authenticated user's saved payout method.
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'easypaisa_number' => ['nullable', 'string', 'max:20'],
            'account_title' => ['nullable', 'string', 'max:255'],
        ]);

        $method = PaymentMethod::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($method);
    }
}
