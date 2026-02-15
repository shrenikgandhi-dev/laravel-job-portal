<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'salary' => $this->salary,
            'is_approved' => $this->is_approved,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'employer' => new UserResource($this->whenLoaded('user')),
            'applications' => ApplicationResource::collection($this->whenLoaded('applications')),
            'applications_count' => $this->when(
                $this->relationLoaded('applications'),
                $this->applications->count()
            ),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
