<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'method',
        'amount',
        'commission_rate',
        'commission_amount',
        'worker_payout',
        'status',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
