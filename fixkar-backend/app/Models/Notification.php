<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'body',
        'type',
        'related_id',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Small helper so controllers can fire a notification in one line:
     * Notification::notify($userId, 'booking', $booking->id, 'Title', 'Body text');
     * Silently skips if $userId is null (e.g. the other party already deleted
     * their account) — notifications are best-effort, never blocking.
     */
    public static function notify(?int $userId, string $type, ?int $relatedId, string $title, string $body): ?self
    {
        if (! $userId) {
            return null;
        }

        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'related_id' => $relatedId,
            'title' => $title,
            'body' => $body,
            'is_read' => false,
        ]);
    }
}
