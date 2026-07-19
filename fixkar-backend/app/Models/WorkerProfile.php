<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'bio',
        'skills',
        'experience_years',
        'hourly_rate',
        'service_area',
        'is_available',
        'is_verified',
        'average_rating',
        'total_reviews',
        'total_jobs_done',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'is_available' => 'boolean',
            'is_verified' => 'boolean',
            'average_rating' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
