<?php

namespace App\Http\Controllers;

use App\Models\Lobby;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LobbyController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check if user is already in a lobby
        $currentLobby = Lobby::where('host_id', $user->id)
            ->orWhere('guest_id', $user->id)
            ->with(['host', 'guest'])
            ->first();

        return Inertia::render('lobby', [
            'currentLobby' => $currentLobby ? [
                'id' => $currentLobby->id,
                'invite_code' => $currentLobby->invite_code,
                'host_id' => $currentLobby->host_id,
                'guest_id' => $currentLobby->guest_id,
                'status' => $currentLobby->status,
                'host' => [
                    'id' => $currentLobby->host->id,
                    'username' => $currentLobby->host->username,
                    'nickname' => $currentLobby->host->nickname,
                    'profile_path' => $currentLobby->host->profile_path,
                    'experience' => $currentLobby->host->experience,
                    'wins' => $currentLobby->host->wins,
                ],
                'guest' => $currentLobby->guest ? [
                    'id' => $currentLobby->guest->id,
                    'username' => $currentLobby->guest->username,
                    'nickname' => $currentLobby->guest->nickname,
                    'profile_path' => $currentLobby->guest->profile_path,
                    'experience' => $currentLobby->guest->experience,
                    'wins' => $currentLobby->guest->wins,
                ] : null,
                'created_at' => $currentLobby->created_at->toISOString(),
            ] : null,
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        // Check if user is already in a lobby
        $existingLobby = Lobby::where('host_id', $user->id)
            ->orWhere('guest_id', $user->id)
            ->first();

        if ($existingLobby) {
            return back()->with('error', 'You are already in a lobby. Please leave your current lobby first.');
        }

        // Generate unique invite code
        do {
            $inviteCode = strtoupper(Str::random(6));
        } while (Lobby::where('invite_code', $inviteCode)->exists());

        Lobby::create([
            'invite_code' => $inviteCode,
            'host_id' => $user->id,
            'status' => 'waiting',
        ]);

        return back()->with('success', 'Lobby created! Share your invite code with your opponent.');
    }

    public function join(Request $request)
    {
        $request->validate([
            'invite_code' => 'required|string|size:6',
        ]);

        $user = auth()->user();

        // Check if user is already in a lobby
        $existingLobby = Lobby::where('host_id', $user->id)
            ->orWhere('guest_id', $user->id)
            ->first();

        if ($existingLobby) {
            return back()->with('error', 'You are already in a lobby. Please leave your current lobby first.');
        }

        // Find lobby by invite code
        $lobby = Lobby::where('invite_code', strtoupper($request->invite_code))
            ->where('status', 'waiting')
            ->whereNull('guest_id')
            ->first();

        if (!$lobby) {
            return back()->with('error', 'Invalid invite code or lobby is no longer available.');
        }

        // Prevent joining own lobby
        if ($lobby->host_id === $user->id) {
            return back()->with('error', 'You cannot join your own lobby.');
        }

        $lobby->update([
            'guest_id' => $user->id,
        ]);

        return back()->with('success', 'Successfully joined the lobby!');
    }

    public function leave()
    {
        $user = auth()->user();

        $lobby = Lobby::where('host_id', $user->id)
            ->orWhere('guest_id', $user->id)
            ->first();

        if (!$lobby) {
            return back()->with('error', 'You are not in any lobby.');
        }

        // If user is host, delete the entire lobby
        if ($lobby->host_id === $user->id) {
            $lobby->delete();
            return back()->with('success', 'Lobby closed.');
        }

        // If user is guest, just remove them
        $lobby->update(['guest_id' => null]);
        return back()->with('success', 'Left the lobby.');
    }

    public function start()
    {
        $user = auth()->user();

        $lobby = Lobby::where('host_id', $user->id)
            ->whereNotNull('guest_id')
            ->where('status', 'waiting')
            ->first();

        if (!$lobby) {
            return back()->with('error', 'Cannot start the game. Make sure you are the host and a guest has joined.');
        }

        $lobby->update(['status' => 'started']);

        // TODO: Redirect to game page once implemented
        return back()->with('success', 'Game started! Redirecting to battle arena...');
    }
}
