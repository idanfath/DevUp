<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoundHistory extends Model
{
    protected $guarded = [
        'id',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'round_start_time' => 'datetime',
    ];

    public function history()
    {
        return $this->belongsTo(History::class);
    }
}
