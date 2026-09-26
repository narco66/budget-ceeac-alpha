<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            SodRuleSeeder::class,
            OrganizationSeeder::class,
            ReferentialSeeder::class,
            OfficialBudget2026Seeder::class,
        ]);

        $email = env('GESBUDEP_ADMIN_EMAIL');
        $password = env('GESBUDEP_ADMIN_PASSWORD');

        if (! is_string($email) || $email === '' || ! is_string($password) || strlen($password) < 12) {
            return;
        }

        $admin = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrateur technique',
                'password' => $password,
                'is_active' => true,
                'email_verified_at' => now(),
                'password_changed_at' => now(),
            ],
        );

        $role = Role::query()->where('code', 'administrateur')->first();

        if ($role !== null) {
            $admin->roles()->syncWithoutDetaching([$role->id => ['starts_at' => now()]]);
        }
    }
}
