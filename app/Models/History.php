<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    protected $guarded = [
        'id',
    ];

    public function host()
    {
        return $this->belongsTo(User::class);
    }

    public function guest()
    {
        return $this->belongsTo(User::class);
    }

    public function roundHistories()
    {
        return $this->hasMany(RoundHistory::class);
    }
}
