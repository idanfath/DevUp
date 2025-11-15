<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoundHistory extends Model
{
    protected $guarded = [
        'id',
    ];

    public function history()
    {
        return $this->belongsTo(History::class);
    }
}
