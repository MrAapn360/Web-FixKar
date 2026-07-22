<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'password',
        'role',
        'city',
        'phone',
        'photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Always include the computed photo_url alongside photo_path whenever a
     * User is serialized (e.g. /me, /workers, booking payloads) — not just
     * from the upload endpoint, so the frontend never has to build storage
     * URLs itself.
     *
     * @var list<string>
     */
    protected $appends = [
        'photo_url',
    ];

    /**
     * Full public URL for the user's profile photo, or null if none is set.
     */
    protected function photoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->photo_path
                ? Storage::disk('public')->url($this->photo_path)
                : null,
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * A worker user has one worker profile (extra fields for the worker role).
     */
    public function workerProfile(): HasOne
    {
        return $this->hasOne(WorkerProfile::class);
    }

    /**
     * Bookings this user made as a customer.
     */
    public function bookingsAsCustomer(): HasMany
    {
        return $this->hasMany(Booking::class, 'customer_id');
    }

    /**
     * Bookings this user received as a worker.
     */
    public function bookingsAsWorker(): HasMany
    {
        return $this->hasMany(Booking::class, 'worker_id');
    }

    /**
     * Reviews this user wrote (as a customer).
     */
    public function reviewsWritten(): HasMany
    {
        return $this->hasMany(Review::class, 'customer_id');
    }

    /**
     * Notifications for this user (FixKar's own table, not Laravel's built-in notifications).
     */
    public function appNotifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Saved payment method (EasyPaisa number etc.) for this user.
     */
    public function paymentMethod(): HasOne
    {
        return $this->hasOne(PaymentMethod::class);
    }
}
