<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = $request->user()
            ->applications()
            ->with(['job.category', 'job.user'])
            ->latest()
            ->get();

        return ApplicationResource::collection($applications);
    }

    public function store(StoreApplicationRequest $request, Job $job)
    {
        // Check if already applied
        if ($job->applications()->where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'message' => 'You have already applied to this job',
            ], 422);
        }

        // Handle resume upload
        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = $job->applications()->create([
            'user_id' => $request->user()->id,
            'resume_path' => $resumePath,
            'status' => 'pending',
        ]);

        return new ApplicationResource($application->load(['job', 'user']));
    }

    public function show(Application $application)
    {
        $this->authorize('view', $application);

        return new ApplicationResource($application->load(['job', 'user']));
    }

    public function updateStatus(Request $request, Application $application)
    {
        $this->authorize('updateStatus', $application);

        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        $application->update([
            'status' => $request->status,
        ]);

        return new ApplicationResource($application->load(['job', 'user']));
    }
}
