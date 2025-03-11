<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Ensure only authorized users can access
    }

    public function rules()
    {
        $id = $this->route('id'); // Get user ID from route

        return [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => [
                'required', 'email',
                $id ? Rule::unique('users', 'email')->ignore($id) : Rule::unique('users', 'email'),
            ],
            'password'   => $id ? 'nullable|string|min:8' : 'required|string|min:8', // Required only for store
            'role'       => 'required|string|exists:roles,name',
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'This email is already taken.',
            'role.exists'  => 'The selected role does not exist.',
        ];
    }
}
