<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\RoundHistory;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Total statistics
        $totalUsers = User::where('role', 'user')->count();
        $totalGames = History::whereNotNull('end_time')->count();
        $totalRounds = RoundHistory::count();
        $activeGames = History::whereNull('end_time')->count();

        // Recent activity - last 7 days
        $recentGames = History::whereNotNull('end_time')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $newUsers = User::where('role', 'user')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        // Game type distribution
        $gameTypeDistribution = History::whereNotNull('end_time')
            ->select('gametype', DB::raw('count(*) as count'))
            ->groupBy('gametype')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->gametype => $item->count];
            });

        // Difficulty distribution
        $difficultyDistribution = History::whereNotNull('end_time')
            ->select('difficulty', DB::raw('count(*) as count'))
            ->groupBy('difficulty')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->difficulty => $item->count];
            });

        // Language popularity
        $languagePopularity = History::whereNotNull('end_time')
            ->select('language', DB::raw('count(*) as count'))
            ->groupBy('language')
            ->orderBy('count', 'desc')
            ->take(10)
            ->get();

        // Average scores by difficulty
        $avgScoresByDifficulty = History::whereNotNull('end_time')
            ->select('difficulty', DB::raw('AVG(total_score) as avg_score'))
            ->groupBy('difficulty')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->difficulty => round($item->avg_score, 1)];
            });

        // Recent completed games
        $recentCompletedGames = History::with('user:id,username,nickname')
            ->whereNotNull('end_time')
            ->orderBy('end_time', 'desc')
            ->take(10)
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'user' => [
                        'username' => $history->user->nickname ?? $history->user->username,
                    ],
                    'language' => $history->language,
                    'difficulty' => $history->difficulty,
                    'gametype' => $history->gametype,
                    'total_score' => $history->total_score,
                    'round' => $history->round,
                    'duration' => (int) ceil($history->start_time->diffInMinutes($history->end_time)),
                    'completed_at' => $history->end_time->toISOString(),
                ];
            });

        // Top performers
        $topPerformers = User::where('role', 'user')
            ->orderBy('wins', 'desc')
            ->orderBy('total_matches', 'desc')
            ->take(10)
            ->get(['id', 'username', 'nickname', 'total_matches', 'wins'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->nickname ?? $user->username,
                    'total_matches' => $user->total_matches,
                    'wins' => $user->wins,
                    'win_rate' => $user->total_matches > 0
                        ? round(($user->wins / $user->total_matches) * 100, 1)
                        : 0,
                ];
            });

        // Games over time (last 30 days)
        $gamesOverTime = History::whereNotNull('end_time')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalGames' => $totalGames,
                'totalRounds' => $totalRounds,
                'activeGames' => $activeGames,
                'recentGames' => $recentGames,
                'newUsers' => $newUsers,
            ],
            'gameTypeDistribution' => $gameTypeDistribution,
            'difficultyDistribution' => $difficultyDistribution,
            'languagePopularity' => $languagePopularity,
            'avgScoresByDifficulty' => $avgScoresByDifficulty,
            'recentCompletedGames' => $recentCompletedGames,
            'topPerformers' => $topPerformers,
            'gamesOverTime' => $gamesOverTime,
        ]);
    }
}
