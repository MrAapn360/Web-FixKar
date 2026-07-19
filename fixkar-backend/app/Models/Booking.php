<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    protected $fillable = [
        'customer_id',
        'worker_id',
        'category',
        'description',
        'address',
        'city',
        'scheduled_at',
        'status',
        'estimated_cost',
        'final_cost',
        'accepted_at',
        'started_at',
        'completed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'accepted_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}
