<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Http\Resources\UserResource;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return $next($request);
        });
    }

    public function jobs()
    {
        $jobs = Job::with(['category', 'user'])->latest()->get();
        return JobResource::collection($jobs);
    }

    public function approveJob(Job $job)
    {
        $job->update(['is_approved' => true]);

        return new JobResource($job->load(['category', 'user']));
    }

    public function rejectJob(Job $job)
    {
        $job->update(['is_approved' => false]);

        return new JobResource($job->load(['category', 'user']));
    }

    public function users()
    {
        $users = User::latest()->get();
        return UserResource::collection($users);
    }

    public function deleteUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Cannot delete admin user',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
