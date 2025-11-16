<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\Lobby;
use App\Models\RoundHistory;
use App\Models\User;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BattleController extends Controller
{
    protected GroqService $groq;

    public function __construct(GroqService $groq)
    {
        $this->groq = $groq;
    }

    /**
     * Show game configuration page
     */
    public function configure($lobbyId)
    {
        $lobby = Lobby::with(['host', 'guest'])->findOrFail($lobbyId);
        $user = auth()->user();

        // Only host can configure
        if ($lobby->host_id !== $user->id) {
            return redirect()->route('lobby')->with('error', 'Hanya host yang bisa mengkonfigurasi game.');
        }

        if ($lobby->status !== 'waiting' || ! $lobby->guest_id) {
            return redirect()->route('lobby')->with('error', 'Tidak bisa mengkonfigurasi game saat ini.');
        }

        return Inertia::render('battle/configure', [
            'lobby' => $this->formatLobbyData($lobby),
            'languages' => $this->getAvailableLanguages(),
            'difficulties' => ['easy', 'medium', 'hard'],
            'gameTypes' => [
                ['value' => 'debug', 'label' => 'Debug Challenge', 'description' => 'Fix broken code'],
                ['value' => 'problem-solving', 'label' => 'Problem Solving', 'description' => 'Write code from scratch'],
            ],
        ]);
    }

    /**
     * Save game configuration and start game
     */
    public function start(Request $request, $lobbyId)
    {
        $request->validate([
            'language' => 'required|string',
            'difficulty' => 'required|in:easy,medium,hard',
            'round_count' => 'required|integer|min:1|max:7',
            'game_type' => 'required|in:debug,problem-solving',
        ]);

        $lobby = Lobby::with(['host', 'guest'])->findOrFail($lobbyId);
        $user = auth()->user();

        if ($lobby->host_id !== $user->id) {
            return back()->with('error', 'Hanya host yang bisa memulai game.');
        }

        // Update lobby configuration
        $lobby->update([
            'language' => $request->language,
            'difficulty' => $request->difficulty,
            'round_count' => $request->round_count,
            'game_type' => $request->game_type,
            'status' => 'started',
            'current_round' => 1,
        ]);

        // Create history record
        $history = History::create([
            'host' => $lobby->host_id,
            'guest' => $lobby->guest_id,
            'language' => $request->language,
            'difficulty' => $request->difficulty,
            'start_time' => now(),
            'host_score' => 0,
            'guest_score' => 0,
            'gametype' => $request->game_type,
            'round' => $request->round_count,
        ]);

        // Generate first round challenge
        $this->generateRoundChallenge($lobby, $history, 1);

        return redirect()->route('battle.play', $lobby->id);
    }

    /**
     * Show battle arena
     */
    public function play($lobbyId)
    {
        $lobby = Lobby::with(['host', 'guest'])->findOrFail($lobbyId);
        $user = auth()->user();

        if ($lobby->host_id !== $user->id && $lobby->guest_id !== $user->id) {
            return redirect()->route('lobby')->with('error', 'Kamu bukan bagian dari battle ini.');
        }

        if ($lobby->status !== 'started') {
            return redirect()->route('lobby')->with('error', 'Battle belum dimulai.');
        }

        $history = History::where('host', $lobby->host_id)
            ->where('guest', $lobby->guest_id)
            ->whereNull('end_time')
            ->first();

        if (! $history) {
            return redirect()->route('lobby')->with('error', 'Tidak ada battle aktif.');
        }

        $currentRound = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $lobby->current_round)
            ->first();

        $isHost = $lobby->host_id === $user->id;

        return Inertia::render('battle/arena', [
            'lobby' => $this->formatLobbyData($lobby),
            'history' => $this->formatHistoryData($history),
            'currentRound' => $currentRound ? $this->formatRoundData($currentRound, $isHost) : null,
            'isHost' => $isHost,
        ]);
    }

    /**
     * Get battle state (for polling)
     */
    public function getState($lobbyId)
    {
        $lobby = Lobby::with(['host', 'guest'])->findOrFail($lobbyId);
        $user = auth()->user();

        if ($lobby->host_id !== $user->id && $lobby->guest_id !== $user->id) {
            return response()->json(['error' => 'Tidak diizinkan'], 403);
        }

        $history = History::where('host', $lobby->host_id)
            ->where('guest', $lobby->guest_id)
            ->whereNull('end_time')
            ->first();

        if (! $history) {
            return response()->json(['error' => 'Tidak ada battle aktif'], 404);
        }

        $currentRound = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $lobby->current_round)
            ->first();

        $isHost = $lobby->host_id === $user->id;

        return response()->json([
            'lobby' => $this->formatLobbyData($lobby),
            'history' => $this->formatHistoryData($history),
            'currentRound' => $currentRound ? $this->formatRoundData($currentRound, $isHost) : null,
            'isHost' => $isHost,
        ]);
    }

    /**
     * Submit code for current round
     */
    public function submitCode(Request $request, $lobbyId)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $lobby = Lobby::findOrFail($lobbyId);
        $user = auth()->user();
        $isHost = $lobby->host_id === $user->id;

        if (! $isHost && $lobby->guest_id !== $user->id) {
            return response()->json(['error' => 'Tidak diizinkan'], 403);
        }

        $history = History::where('host', $lobby->host_id)
            ->where('guest', $lobby->guest_id)
            ->whereNull('end_time')
            ->first();

        if (! $history) {
            return response()->json(['error' => 'Tidak ada battle aktif'], 404);
        }

        $round = RoundHistory::where('history_id', $history->id)
            ->where('round_number', $lobby->current_round)
            ->first();

        if (! $round) {
            return response()->json(['error' => 'Ronde tidak valid'], 404);
        }

        // Check if already submitted
        if ($isHost && $round->host_submitted_at) {
            return response()->json(['error' => 'Sudah disubmit'], 400);
        }
        if (! $isHost && $round->guest_submitted_at) {
            return response()->json(['error' => 'Sudah disubmit'], 400);
        }

        // Calculate submission time
        $submissionTime = now()->diffInSeconds($round->created_at);

        // Hardcoded scoring prompts
        $scoringPrompts = [
            'debug' => 'You are an AI code evaluator for a competitive coding platform. Evaluate the submitted code that was supposed to fix bugs in the original buggy code. Consider: 1) Did they fix all the bugs correctly? (50 points) 2) Is the code clean and readable? (30 points) 3) Did they add any improvements or optimizations? (20 points). Be fair but strict in your evaluation.',
            'problem-solving' => 'You are an AI code evaluator for a competitive coding platform. Evaluate the submitted solution to the coding problem. Consider: 1) Does the solution correctly solve the problem and handle edge cases? (50 points) 2) Is the code well-structured, readable, and follows best practices? (30 points) 3) Is the algorithm efficient in terms of time and space complexity? (20 points). Provide constructive feedback.',
        ];

        $scoringPrompt = $scoringPrompts[$lobby->game_type] ?? 'Evaluate the code based on correctness, quality, and efficiency.';

        // Evaluate code with AI
        $evaluation = $this->groq->evaluateCode(
            $round->question,
            $request->code,
            $lobby->language,
            $lobby->game_type,
            $scoringPrompt,
            $submissionTime
        );

        // Update round history
        if ($isHost) {
            $round->update([
                'host_code' => $request->code,
                'host_submitted_at' => now(),
                'host_score_increase' => $evaluation['score'],
                'host_explanation' => json_encode($evaluation),
            ]);

            // Update total score
            $history->increment('host_score', $evaluation['score']);
        } else {
            $round->update([
                'guest_code' => $request->code,
                'guest_submitted_at' => now(),
                'guest_score_increase' => $evaluation['score'],
                'guest_explanation' => json_encode($evaluation),
            ]);

            // Update total score
            $history->increment('guest_score', $evaluation['score']);
        }

        // Check if both players have submitted
        $round->refresh();
        if ($round->host_submitted_at && $round->guest_submitted_at) {
            // Both submitted, check if game should continue
            if ($lobby->current_round < $lobby->round_count) {
                // Generate next round after a delay
                $lobby->increment('current_round');
                $this->generateRoundChallenge($lobby, $history, $lobby->current_round);
            } else {
                // Game over
                $this->endGame($lobby, $history);
            }
        }

        return response()->json([
            'success' => true,
            'evaluation' => $evaluation,
            'roundComplete' => $round->host_submitted_at && $round->guest_submitted_at,
        ]);
    }

    /**
     * Generate challenge for a round
     */
    protected function generateRoundChallenge(Lobby $lobby, History $history, int $roundNumber)
    {
        // Hardcoded challenge prompts
        $challengePrompts = [
            'debug' => 'You are an expert programming instructor creating debug challenges for competitive coding. Create a code snippet with 2-3 deliberate bugs that students need to fix. The bugs should be realistic mistakes that beginners and intermediate programmers commonly make. Include syntax errors, logic errors, or edge case issues. Make the challenge educational and appropriate for the specified difficulty level.',
            'problem-solving' => 'You are an expert programming instructor creating problem-solving challenges for competitive coding. Create an algorithmic problem that requires writing code from scratch. The problem should test data structures, algorithms, and problem-solving skills. Include clear examples, constraints, and expected output format. Make it appropriate for the specified difficulty level and programming language.',
        ];

        $challengePrompt = $challengePrompts[$lobby->game_type] ?? 'Generate a coding challenge appropriate for the specified difficulty level.';

        // Generate challenge using AI
        $challenge = $this->groq->generateChallenge(
            $lobby->language,
            $lobby->difficulty,
            $lobby->game_type,
            $challengePrompt
        );

        // Create round history
        RoundHistory::create([
            'history_id' => $history->id,
            'round_number' => $roundNumber,
            'question' => json_encode($challenge),
            'type' => $lobby->game_type,
            'initial_code' => $challenge['buggy_code'] ?? $challenge['starter_code'] ?? '',
            'host_score_increase' => 0,
            'guest_score_increase' => 0,
            'host_explanation' => '',
            'guest_explanation' => '',
        ]);
    }

    /**
     * End the game and determine winner
     */
    protected function endGame(Lobby $lobby, History $history)
    {
        $history->update([
            'end_time' => now(),
        ]);

        // Determine winner
        $winnerId = null;
        if ($history->host_score > $history->guest_score) {
            $winnerId = $history->host;
        } elseif ($history->guest_score > $history->host_score) {
            $winnerId = $history->guest;
        }

        $history->update(['winner_id' => $winnerId]);

        // Update user statistics
        $host = User::find($history->host);
        $guest = User::find($history->guest);

        $host->increment('total_matches');
        $guest->increment('total_matches');

        if ($winnerId === $history->host) {
            $host->increment('wins');
            $host->increment('current_streak');
            $host->increment('experience', 100);

            $guest->update(['current_streak' => 0]);
            $guest->increment('experience', 50);
        } elseif ($winnerId === $history->guest) {
            $guest->increment('wins');
            $guest->increment('current_streak');
            $guest->increment('experience', 100);

            $host->update(['current_streak' => 0]);
            $host->increment('experience', 50);
        } else {
            // Draw
            $host->increment('experience', 75);
            $guest->increment('experience', 75);
        }

        // Update lobby status
        $lobby->update(['status' => 'finished']);
    }

    /**
     * Show game results
     */
    public function results($lobbyId)
    {
        $lobby = Lobby::with(['host', 'guest'])->findOrFail($lobbyId);
        $user = auth()->user();

        if ($lobby->host_id !== $user->id && $lobby->guest_id !== $user->id) {
            return redirect()->route('lobby')->with('error', 'Kamu bukan bagian dari battle ini.');
        }

        $history = History::with(['roundHistories', 'host', 'guest'])
            ->where('host', $lobby->host_id)
            ->where('guest', $lobby->guest_id)
            ->whereNotNull('end_time')
            ->latest()
            ->first();

        if (! $history) {
            return redirect()->route('lobby')->with('error', 'Tidak ada battle yang selesai.');
        }

        $winner = $history->winner_id ? User::find($history->winner_id) : null;

        return Inertia::render('battle/results', [
            'lobby' => $this->formatLobbyData($lobby),
            'history' => $this->formatHistoryData($history),
            'rounds' => $history->roundHistories->map(fn ($r) => $this->formatRoundData($r, true, true)),
            'winner' => $winner ? [
                'id' => $winner->id,
                'username' => $winner->username,
                'nickname' => $winner->nickname,
                'profile_path' => $winner->profile_path,
            ] : null,
        ]);
    }

    // Helper methods for formatting data
    protected function formatLobbyData(Lobby $lobby): array
    {
        return [
            'id' => $lobby->id,
            'invite_code' => $lobby->invite_code,
            'status' => $lobby->status,
            'language' => $lobby->language,
            'difficulty' => $lobby->difficulty,
            'round_count' => $lobby->round_count,
            'game_type' => $lobby->game_type,
            'current_round' => $lobby->current_round,
            'host' => [
                'id' => $lobby->host->id,
                'username' => $lobby->host->username,
                'nickname' => $lobby->host->nickname,
                'profile_path' => $lobby->host->profile_path,
                'experience' => $lobby->host->experience,
                'wins' => $lobby->host->wins,
            ],
            'guest' => $lobby->guest ? [
                'id' => $lobby->guest->id,
                'username' => $lobby->guest->username,
                'nickname' => $lobby->guest->nickname,
                'profile_path' => $lobby->guest->profile_path,
                'experience' => $lobby->guest->experience,
                'wins' => $lobby->guest->wins,
            ] : null,
        ];
    }

    protected function formatHistoryData(History $history): array
    {
        return [
            'id' => $history->id,
            'host_score' => $history->host_score,
            'guest_score' => $history->guest_score,
            'start_time' => $history->start_time->toISOString(),
            'end_time' => $history->end_time?->toISOString(),
        ];
    }

    protected function formatRoundData(RoundHistory $round, bool $isHost, bool $showBothCodes = false): array
    {
        $question = json_decode($round->question, true);

        return [
            'id' => $round->id,
            'round_number' => $round->round_number,
            'question' => $question,
            'type' => $round->type,
            'initial_code' => $round->initial_code,
            'host_score' => $round->host_score_increase,
            'guest_score' => $round->guest_score_increase,
            'host_submitted' => ! is_null($round->host_submitted_at),
            'guest_submitted' => ! is_null($round->guest_submitted_at),
            'my_code' => $showBothCodes ? null : ($isHost ? $round->host_code : $round->guest_code),
            'my_evaluation' => $showBothCodes ? null : json_decode($isHost ? $round->host_explanation : $round->guest_explanation, true),
            'host_code' => $showBothCodes ? $round->host_code : null,
            'guest_code' => $showBothCodes ? $round->guest_code : null,
            'host_evaluation' => $showBothCodes ? json_decode($round->host_explanation, true) : null,
            'guest_evaluation' => $showBothCodes ? json_decode($round->guest_explanation, true) : null,
        ];
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
