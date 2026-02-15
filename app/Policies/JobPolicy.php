<?php

namespace App\Policies;

use App\Models\Job;
use App\Models\User;

class JobPolicy
{
    public function update(User $user, Job $job): bool
    {
        return $user->isEmployer() && $user->id === $job->user_id;
    }

    public function delete(User $user, Job $job): bool
    {
        return $user->isAdmin() || 
               ($user->isEmployer() && $user->id === $job->user_id);
    }
}
