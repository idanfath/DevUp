<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\LobbyController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::middleware(['role:admin'])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('user-management', UserManagementController::class)->names('userManagement')->except(['show']);
        // Admin can view any game results
        Route::get('game/results/{id}', [GameController::class, 'results'])->name('admin.game.results');
    });
    Route::middleware(['role:user'])->group(function () {
        Route::get('lobby', [LobbyController::class, 'index'])->name('lobby');
        Route::get('game/configure', [GameController::class, 'configure'])->name('game.configure');
        Route::post('game/start', [GameController::class, 'start'])->name('game.start');
        Route::get('game/play', [GameController::class, 'play'])->name('game.play');
        Route::get('game/state', [GameController::class, 'getState'])->name('game.state');
        Route::post('game/submit', [GameController::class, 'submitCode'])->name('game.submit');
        Route::get('game/results/{id?}', [GameController::class, 'results'])->name('game.results');
        Route::get('game/history', [GameController::class, 'history'])->name('game.history');
        Route::post('game/terminate', [GameController::class, 'terminate'])->name('game.terminate');
    });
});

require __DIR__.'/settings.php';
