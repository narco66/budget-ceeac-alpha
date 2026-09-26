<?php

namespace App\Http\Requests\Identity;

use Illuminate\Foundation\Http\FormRequest;

class AssignRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role_code' => ['required', 'string', 'exists:roles,code'],
            'organization_unit_id' => ['nullable', 'uuid', 'exists:organization_units,id'],
        ];
    }
}
