<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\JobController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public job listings
Route::get('/jobs/approved', [JobController::class, 'approved']);
Route::get('/categories', [CategoryController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Jobs
    Route::apiResource('jobs', JobController::class);

    // Applications
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    // Categories (admin only for create/delete)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::patch('/jobs/{job}/approve', [AdminController::class, 'approveJob']);
        Route::patch('/jobs/{job}/reject', [AdminController::class, 'rejectJob']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    });
});
