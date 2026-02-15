<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = Job::with(['category', 'user']);

        // Job seekers only see approved jobs
        if ($request->user()->isSeeker()) {
            $query->approved();
        }

        // Employers only see their own jobs
        if ($request->user()->isEmployer()) {
            $query->where('user_id', $request->user()->id);
        }

        $jobs = $query->latest()->get();

        return JobResource::collection($jobs);
    }

    public function store(StoreJobRequest $request)
    {
        $job = $request->user()->jobs()->create($request->validated());

        return new JobResource($job->load(['category', 'user']));
    }

    public function show(Job $job)
    {
        return new JobResource($job->load(['category', 'user', 'applications.user']));
    }

    public function update(UpdateJobRequest $request, Job $job)
    {
        $this->authorize('update', $job);

        $job->update($request->validated());

        return new JobResource($job->load(['category', 'user']));
    }

    public function destroy(Job $job)
    {
        $this->authorize('delete', $job);

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    public function approved()
    {
        $jobs = Job::with(['category', 'user'])
            ->approved()
            ->latest()
            ->get();

        return JobResource::collection($jobs);
    }
}
