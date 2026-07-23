<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailOtp extends Model
{
    protected $fillable = [
        'email',
        'code',
        'expires_at',
        'attempts',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Generates a fresh 6-digit code for the given email, valid for 10
     * minutes, and (re)writes the single row for that email — resending
     * always issues a brand new code rather than reusing an old one.
     */
    public static function issueFor(string $email): self
    {
        $code = (string) random_int(100000, 999999);

        return self::updateOrCreate(
            ['email' => $email],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
            ],
        );
    }
}
