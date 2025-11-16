<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\RoundHistory;
use App\Models\User;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    protected GroqService $groq;

    public function __construct(GroqService $groq)
    {
        $this->groq = $groq;
    }

    /**
     * Show game configuration page
     */
    public function configure()
    {
        $user = auth()->user();

        // Check if user has an ongoing game
        $ongoingGame = History::where('user_id', $user->id)
            ->whereNull('end_time')
            ->first();

        if ($ongoingGame) {
            return redirect()->route('game.play')->with('info', 'Kamu punya game yang sedang berjalan. Selesaikan atau hentikan terlebih dahulu!');
        }

        return Inertia::render('game/configure', [
            'languages' => $this->getAvailableLanguages(),
            'difficulties' => ['easy', 'medium', 'hard'],
            'gameTypes' => [
                ['value' => 'debug', 'label' => 'Debug Challenge', 'description' => 'Fix broken code'],
                ['value' => 'problem-solving', 'label' => 'Problem Solving', 'description' => 'Write code from scratch'],
            ],
        ]);
    }

    /**
     * Start new game
     */
    public function start(Request $request)
    {
        $request->validate([
            'language' => 'required|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'round_count' => 'required|integer|min:1|max:7',
            'game_type' => 'required|in:debug,problem-solving',
        ]);

        $user = auth()->user();

        // Check if user has an ongoing game
        $ongoingGame = History::where('user_id', $user->id)
            ->whereNull('end_time')
            ->first();

        if ($ongoingGame) {
            return redirect()->route('game.play')->with('info', 'Kamu punya game yang sedang berjalan. Selesaikan terlebih dahulu!');
        }

        // Create history record
        $history = History::create([
            'user_id' => $user->id,
            'language' => $request->language,
            'difficulty' => $request->difficulty,
            'start_time' => now(),
            'total_score' => 0,
            'gametype' => $request->game_type,
            'round' => $request->round_count,
        ]);

        // Generate first round challenge
        $this->generateRoundChallenge($history, 1, $request->language, $request->difficulty, $request->game_type);

        // Store game config in session
        session([
            'active_game_id' => $history->id,
            'current_round' => 1,
            'round_count' => $request->round_count,
            'language' => $request->language,
            'difficulty' => $request->difficulty,
            'game_type' => $request->game_type,
        ]);

        return redirect()->route('game.play');
    }

    /**
     * Show game arena
     */
    public function play()
    {
        $historyId = session('active_game_id');
        if (! $historyId) {
            return redirect()->route('game.configure')->with('error', 'Tidak ada game aktif.');
        }

        $history = History::with('roundHistories')->findOrFail($historyId);
        $currentRoundNum = session('current_round', 1);

        if ($history->user_id !== auth()->id()) {
            return redirect()->route('game.configure')->with('error', 'Tidak diizinkan.');
        }

        $currentRound = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $currentRoundNum)
            ->first();

        if (! $currentRound) {
            return redirect()->route('game.configure')->with('error', 'Ronde tidak ditemukan.');
        }

        return Inertia::render('game/arena', [
            'history' => $this->formatHistoryData($history),
            'currentRound' => $this->formatRoundData($currentRound),
            'roundCount' => session('round_count'),
            'language' => session('language'),
            'difficulty' => session('difficulty'),
            'gameType' => session('game_type'),
        ]);
    }

    /**
     * Get game state (for polling)
     */
    public function getState()
    {
        $historyId = session('active_game_id');
        if (! $historyId) {
            return response()->json(['error' => 'Tidak ada game aktif'], 404);
        }

        $history = History::with('roundHistories')->findOrFail($historyId);
        $currentRoundNum = session('current_round', 1);

        if ($history->user_id !== auth()->id()) {
            return response()->json(['error' => 'Tidak diizinkan'], 403);
        }

        $currentRound = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $currentRoundNum)
            ->first();

        return response()->json([
            'history' => $this->formatHistoryData($history),
            'currentRound' => $currentRound ? $this->formatRoundData($currentRound) : null,
        ]);
    }

    /**
     * Submit code for current round
     */
    public function submitCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $historyId = session('active_game_id');
        if (! $historyId) {
            return response()->json(['error' => 'Tidak ada game aktif'], 404);
        }

        $history = History::findOrFail($historyId);
        $currentRoundNum = session('current_round', 1);

        if ($history->user_id !== auth()->id()) {
            return response()->json(['error' => 'Tidak diizinkan'], 403);
        }

        $round = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $currentRoundNum)
            ->first();

        if (! $round) {
            return response()->json(['error' => 'Ronde tidak valid'], 404);
        }

        // Check if already submitted
        if ($round->submitted_at) {
            return response()->json(['error' => 'Sudah disubmit'], 400);
        }

        // Get scoring prompt
        $gameType = session('game_type');

        // Hardcoded scoring prompts
        $scoringPrompts = [
            'debug' => 'You are an AI code evaluator for a competitive coding platform. Evaluate the submitted code that was supposed to fix bugs in the original buggy code. Consider: 1) Did they fix all the bugs correctly? (50 points) 2) Is the code clean and readable? (30 points) 3) Did they add any improvements or optimizations? (20 points). Be fair but strict in your evaluation.',
            'problem-solving' => 'You are an AI code evaluator for a competitive coding platform. Evaluate the submitted solution to the coding problem. Consider: 1) Does the solution correctly solve the problem and handle edge cases? (50 points) 2) Is the code well-structured, readable, and follows best practices? (30 points) 3) Is the algorithm efficient in terms of time and space complexity? (20 points). Provide constructive feedback.',
        ];

        $scoringPrompt = $scoringPrompts[$gameType] ?? 'Evaluate the code based on correctness, quality, and efficiency.';

        // Evaluate code with AI
        $evaluation = $this->groq->evaluateCode(
            $round->question,
            $request->code,
            session('language'),
            $gameType,
            $scoringPrompt
        );

        // Update round history
        $round->update([
            'user_code' => $request->code,
            'submitted_at' => now(),
            'score' => $evaluation['score'],
            'evaluation' => json_encode($evaluation),
        ]);

        // Update total score
        $history->increment('total_score', $evaluation['score']);

        // Check if game should continue
        $roundCount = session('round_count');
        if ($currentRoundNum < $roundCount) {
            // Generate next round
            $nextRound = $currentRoundNum + 1;
            $this->generateRoundChallenge(
                $history,
                $nextRound,
                session('language'),
                session('difficulty'),
                $gameType
            );
            session(['current_round' => $nextRound]);

            return response()->json([
                'success' => true,
                'evaluation' => $evaluation,
                'nextRound' => $nextRound,
                'gameComplete' => false,
            ]);
        } else {
            // Game over
            $this->endGame($history);

            return response()->json([
                'success' => true,
                'evaluation' => $evaluation,
                'gameComplete' => true,
            ]);
        }
    }

    /**
     * Generate challenge for a round
     */
    protected function generateRoundChallenge(History $history, int $roundNumber, string $language, string $difficulty, string $gameType)
    {
        // Hardcoded challenge prompts
        $challengePrompts = [
            'debug' => 'You are an expert programming instructor creating debug challenges for competitive coding. Create a code snippet with 2-3 deliberate bugs that students need to fix. The bugs should be realistic mistakes that beginners and intermediate programmers commonly make. Include syntax errors, logic errors, or edge case issues. Make the challenge educational and appropriate for the specified difficulty level.',
            'problem-solving' => 'You are an expert programming instructor creating problem-solving challenges for competitive coding. Create an algorithmic problem that requires writing code from scratch. The problem should test data structures, algorithms, and problem-solving skills. Include clear examples, constraints, and expected output format. Make it appropriate for the specified difficulty level and programming language.',
        ];

        $challengePrompt = $challengePrompts[$gameType] ?? 'Generate a coding challenge appropriate for the specified difficulty level.';

        // Fetch recent problems for variety (last 10 problems with same game type and difficulty)
        $recentProblems = RoundHistory::whereHas('history', function ($query) use ($difficulty) {
            $query->where('difficulty', $difficulty);
        })
            ->where('type', $gameType)
            ->whereNotNull('problem_summary')
            ->latest()
            ->take(10)
            ->pluck('problem_summary')
            ->toArray();

        // Generate challenge using AI with recent problems context
        $challenge = $this->groq->generateChallenge(
            $language,
            $difficulty,
            $gameType,
            $challengePrompt,
            $recentProblems
        );

        // Create round history
        RoundHistory::create([
            'history_id' => $history->id,
            'round_number' => $roundNumber,
            'question' => json_encode($challenge),
            'problem_summary' => $challenge['problem_summary'] ?? null,
            'type' => $gameType,
            'initial_code' => $challenge['buggy_code'] ?? $challenge['starter_code'] ?? '',
            'score' => 0,
        ]);
    }

    /**
     * End the game (completed successfully)
     */
    protected function endGame(History $history)
    {
        $history->update([
            'end_time' => now(),
        ]);

        // Update user statistics
        $user = User::find($history->user_id);
        $user->increment('total_matches');

        // Increment wins if high performance
        if ($history->total_score >= 600) {
            $user->increment('wins');
        }

        // Clear session
        session()->forget(['active_game_id', 'current_round', 'round_count', 'language', 'difficulty', 'game_type']);
    }

    /**
     * Manually terminate current game
     */
    public function terminate()
    {
        $historyId = session('active_game_id');
        if (! $historyId) {
            return redirect()->route('lobby')->with('error', 'Tidak ada game aktif.');
        }

        $history = History::findOrFail($historyId);

        if ($history->user_id !== auth()->id()) {
            return redirect()->route('lobby')->with('error', 'Tidak diizinkan.');
        }

        // End game without updating stats
        $history->update(['end_time' => now()]);
        session()->forget(['active_game_id', 'current_round', 'round_count', 'language', 'difficulty', 'game_type']);

        return redirect()->route('lobby')->with('info', 'Game dihentikan.');
    }

    /**
     * Show game history
     */
    public function history()
    {
        $user = auth()->user();

        $games = History::where('user_id', $user->id)
            ->whereNotNull('end_time')
            ->with('roundHistories')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('game/history', [
            'games' => $games->map(function ($history) {
                return [
                    'id' => $history->id,
                    'total_score' => $history->total_score,
                    'language' => $history->language,
                    'difficulty' => $history->difficulty,
                    'gametype' => $history->gametype,
                    'round' => $history->round,
                    'start_time' => $history->start_time->toISOString(),
                    'end_time' => $history->end_time->toISOString(),
                    'duration' => (int) ceil($history->start_time->diffInMinutes($history->end_time)),
                    'avg_score' => round($history->total_score / $history->round, 1),
                ];
            }),
            'pagination' => [
                'current_page' => $games->currentPage(),
                'last_page' => $games->lastPage(),
                'per_page' => $games->perPage(),
                'total' => $games->total(),
            ],
        ]);
    }

    /**
     * Show game results
     */
    public function results($id = null)
    {
        // If ID provided, get that specific game, otherwise get most recent
        if ($id) {
            $history = History::with('roundHistories')
                ->where('id', $id)
                ->when(auth()->user()->role === 'user', function ($query) {
                    // Regular users can only view their own games
                    $query->where('user_id', auth()->id());
                })
                ->whereNotNull('end_time')
                ->first();
        } else {
            $history = History::with('roundHistories')
                ->where('user_id', auth()->id())
                ->whereNotNull('end_time')
                ->latest()
                ->first();
        }

        if (! $history) {
            $redirectRoute = auth()->user()->role === 'admin' ? 'dashboard' : 'lobby';
            $errorMessage = $id ? 'Game tidak ditemukan atau kamu tidak punya izin untuk melihatnya.' : 'Tidak ada game yang selesai.';
            return redirect()->route($redirectRoute)->with('error', $errorMessage);
        }

        return Inertia::render('game/results', [
            'history' => $this->formatHistoryData($history),
            'rounds' => $history->roundHistories->map(fn ($r) => $this->formatRoundData($r, true)),
            'totalPossibleScore' => $history->round * 100, // Max score per round
            'performance' => $this->calculatePerformance($history),
        ]);
    }

    /**
     * Calculate performance rating
     */
    protected function calculatePerformance(History $history): array
    {
        $avgScore = $history->total_score / $history->round;
        $percentage = ($history->total_score / ($history->round * 100)) * 100;

        if ($percentage >= 85) {
            return ['rating' => 'Excellent', 'color' => 'green', 'message' => 'Outstanding performance!'];
        } elseif ($percentage >= 70) {
            return ['rating' => 'Great', 'color' => 'blue', 'message' => 'Great job!'];
        } elseif ($percentage >= 50) {
            return ['rating' => 'Good', 'color' => 'yellow', 'message' => 'Good effort!'];
        } else {
            return ['rating' => 'Keep Practicing', 'color' => 'orange', 'message' => 'Keep improving!'];
        }
    }

    // Helper methods for formatting data
    protected function formatHistoryData(History $history): array
    {
        return [
            'id' => $history->id,
            'user_id' => $history->user_id,
            'total_score' => $history->total_score,
            'language' => $history->language,
            'difficulty' => $history->difficulty,
            'gametype' => $history->gametype,
            'round' => $history->round,
            'start_time' => $history->start_time->toISOString(),
            'end_time' => $history->end_time?->toISOString(),
        ];
    }

    protected function formatRoundData(RoundHistory $round, bool $showDetails = false): array
    {
        $question = json_decode($round->question, true);

        // Unescape code properly (convert literal \n to actual newlines)
        $initialCode = $round->initial_code;
        if ($initialCode && strpos($initialCode, '\\n') !== false) {
            $initialCode = stripcslashes($initialCode);
        }

        $data = [
            'id' => $round->id,
            'round_number' => $round->round_number,
            'question' => $question,
            'type' => $round->type,
            'initial_code' => $initialCode,
            'score' => $round->score,
            'submitted' => ! is_null($round->submitted_at),
        ];

        if ($showDetails) {
            $userCode = $round->user_code;
            if ($userCode && strpos($userCode, '\\n') !== false) {
                $userCode = stripcslashes($userCode);
            }
            $data['user_code'] = $userCode;
            $data['evaluation'] = json_decode($round->evaluation, true);
            $data['submitted_at'] = $round->submitted_at?->toISOString();
        }

        return $data;
    }

    protected function getAvailableLanguages(): array
    {
        return [
            ['value' => 'python', 'label' => 'Python'],
            ['value' => 'javascript', 'label' => 'JavaScript'],
            ['value' => 'typescript', 'label' => 'TypeScript'],
            ['value' => 'java', 'label' => 'Java'],
            ['value' => 'cpp', 'label' => 'C++'],
            ['value' => 'csharp', 'label' => 'C#'],
            ['value' => 'go', 'label' => 'Go'],
            ['value' => 'rust', 'label' => 'Rust'],
            ['value' => 'php', 'label' => 'PHP'],
            ['value' => 'ruby', 'label' => 'Ruby'],
        ];
    }
}
