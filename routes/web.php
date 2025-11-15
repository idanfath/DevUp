<?php

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
    });
    Route::middleware(['role:user'])->group(function () {
        Route::get('lobby', function () {
            return Inertia::render('lobby');
        })->name('lobby');
    });
});

require __DIR__.'/settings.php';
