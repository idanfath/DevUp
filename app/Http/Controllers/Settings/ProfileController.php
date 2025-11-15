<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle profile picture removal
        if ($request->boolean('remove_profile_picture')) {
            if ($user->profile_path) {
                // Delete old profile picture
                Storage::disk('public')->delete($user->profile_path);
                $user->profile_path = null;
            }
        }
        // Handle new profile picture upload
        elseif ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_path) {
                Storage::disk('public')->delete($user->profile_path);
            }

            // Store new profile picture
            $path = $request->file('profile_picture')->store('profile-pictures', 'public');
            $user->profile_path = $path;
        }

        // Remove fields that are handled separately
        unset($validated['profile_picture'], $validated['remove_profile_picture']);

        // Update other fields
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $user = $request->user();

        // Delete profile picture if exists
        if ($user->profile_path) {
            Storage::disk('public')->delete($user->profile_path);
        }

        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
