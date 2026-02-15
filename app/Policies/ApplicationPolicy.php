<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function view(User $user, Application $application): bool
    {
        return $user->id === $application->user_id || 
               $user->id === $application->job->user_id;
    }

    public function updateStatus(User $user, Application $application): bool
    {
        return $user->isEmployer() && $user->id === $application->job->user_id;
    }
}
