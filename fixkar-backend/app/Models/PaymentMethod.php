<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethod extends Model
{
    protected $fillable = [
        'user_id',
        'easypaisa_number',
        'account_title',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
