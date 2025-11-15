<?php

use App\Http\Controllers\LobbyController;
use App\Http\Controllers\PromptManagementController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::middleware(['role:admin'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
        Route::resource('user-management', UserManagementController::class)->names('userManagement')->except(['show']);
        Route::resource('prompt-management', PromptManagementController::class)->names('promptManagement')->except(['show']);
    });
    Route::middleware(['role:user'])->group(function () {
        Route::get('lobby', [LobbyController::class, 'index'])->name('lobby');
        Route::post('lobby/create', [LobbyController::class, 'create'])->name('lobby.create');
        Route::post('lobby/join', [LobbyController::class, 'join'])->name('lobby.join');
        Route::post('lobby/leave', [LobbyController::class, 'leave'])->name('lobby.leave');
        Route::post('lobby/start', [LobbyController::class, 'start'])->name('lobby.start');
    });
});

require __DIR__.'/settings.php';
