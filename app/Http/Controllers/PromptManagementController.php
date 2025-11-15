<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromptManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $prompts = Prompt::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/prompt/index', [
            'prompts' => $prompts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/prompt/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'challenge_prompt' => 'required|string',
            'scoring_prompt' => 'required|string',
        ]);

        Prompt::create($validated);

        return redirect()->route('promptManagement.index')->with('success', 'Prompt created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $prompt = Prompt::findOrFail($id);

        return Inertia::render('admin/prompt/edit', [
            'prompt' => $prompt,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $prompt = Prompt::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'challenge_prompt' => 'required|string',
            'scoring_prompt' => 'required|string',
        ]);

        $prompt->update($validated);

        return redirect()->route('promptManagement.index')->with('success', 'Prompt updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $prompt = Prompt::findOrFail($id);
        $prompt->delete();

        return redirect()->route('promptManagement.index')->with('success', 'Prompt deleted successfully.');
    }
}
