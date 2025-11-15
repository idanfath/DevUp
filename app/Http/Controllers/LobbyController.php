<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class LobbyController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check for ongoing game
        $ongoingGame = \App\Models\History::where('user_id', $user->id)
            ->whereNull('end_time')
            ->with('roundHistories')
            ->first();

        // Get recent completed games
        $recentGames = \App\Models\History::where('user_id', $user->id)
            ->whereNotNull('end_time')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'total_score' => $history->total_score,
                    'language' => $history->language,
                    'difficulty' => $history->difficulty,
                    'gametype' => $history->gametype,
                    'round' => $history->round,
                    'created_at' => $history->created_at->toISOString(),
                    'duration' => $history->end_time ? (int) ceil($history->start_time->diffInMinutes($history->end_time)) : null,
                ];
            });

        // Calculate most used language
        $mostUsedLanguage = \App\Models\History::where('user_id', $user->id)
            ->whereNotNull('end_time')
            ->selectRaw('language, COUNT(*) as count')
            ->groupBy('language')
            ->orderByDesc('count')
            ->value('language');

        return Inertia::render('lobby', [
            'ongoingGame' => $ongoingGame ? [
                'id' => $ongoingGame->id,
                'language' => $ongoingGame->language,
                'difficulty' => $ongoingGame->difficulty,
                'gametype' => $ongoingGame->gametype,
                'round' => $ongoingGame->round,
                'total_score' => $ongoingGame->total_score,
                'current_round' => session('current_round', 1),
                'created_at' => $ongoingGame->created_at->toISOString(),
            ] : null,
            'recentGames' => $recentGames,
            'mostUsedLanguage' => $mostUsedLanguage,
        ]);
    }
}
