<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isSeeker();
    }

    public function rules(): array
    {
        return [
            'resume' => 'required|file|mimes:pdf|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'resume.mimes' => 'Resume must be a PDF file',
            'resume.max' => 'Resume must not be larger than 2MB',
        ];
    }
}
