<?php

namespace Tests\Feature;

use App\Models\AuditEvent;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\OrganizationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class IdentityApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
    }

    public function test_health_reports_database_up(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.database', 'up');
    }

    public function test_login_returns_token_and_writes_audit(): void
    {
        $user = User::factory()->create([
            'email' => 'agent@ceeac.local',
            'password' => 'MotDePasse12',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'agent@ceeac.local',
            'password' => 'MotDePasse12',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'agent@ceeac.local');

        $this->assertNotEmpty($response->json('data.token'));
        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $user->id,
            'action' => 'auth.login',
        ]);
    }

    public function test_failed_attempts_lock_the_account(): void
    {
        User::factory()->create([
            'email' => 'agent@ceeac.local',
            'password' => 'MotDePasse12',
        ]);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'agent@ceeac.local',
                'password' => 'mauvais-mot',
            ])->assertStatus(422);
        }

        $this->postJson('/api/v1/auth/login', [
            'email' => 'agent@ceeac.local',
            'password' => 'MotDePasse12',
        ])->assertStatus(423)->assertJsonPath('code', 'ACCOUNT_LOCKED');
    }

    public function test_guest_cannot_read_profile(): void
    {
        $this->getJson('/api/v1/auth/me')
            ->assertUnauthorized()
            ->assertJsonPath('code', 'UNAUTHENTICATED');
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = User::factory()->create(['password' => 'MotDePasse12']);
        $token = $user->createToken('api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();
    }

    public function test_password_reset_replaces_the_password(): void
    {
        $user = User::factory()->create([
            'email' => 'agent@ceeac.local',
            'password' => 'AncienMot12Passe',
        ]);
        $token = Password::broker()->createToken($user);

        $this->postJson('/api/v1/auth/password/reset', [
            'email' => 'agent@ceeac.local',
            'token' => $token,
            'password' => 'NouveauMot12Passe',
            'password_confirmation' => 'NouveauMot12Passe',
        ])->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('NouveauMot12Passe', $user->password));
    }

    public function test_forgot_password_does_not_reveal_whether_the_account_exists(): void
    {
        Notification::fake();
        User::factory()->create(['email' => 'agent@ceeac.local']);

        $this->postJson('/api/v1/auth/password/forgot', ['email' => 'agent@ceeac.local'])
            ->assertOk()
            ->assertJsonPath('success', true);
        $this->postJson('/api/v1/auth/password/forgot', ['email' => 'inconnu@ceeac.local'])
            ->assertOk();

        Notification::assertSentTo(
            User::query()->where('email', 'agent@ceeac.local')->firstOrFail(),
            ResetPassword::class,
        );
    }

    public function test_user_without_permission_cannot_list_users(): void
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', 'initiateur')->firstOrFail());
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/users')
            ->assertForbidden()
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_administrator_can_list_users(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::query()->where('code', 'administrateur')->firstOrFail());
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/users')
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_incompatible_roles_cannot_be_assigned_together(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::query()->where('code', 'administrateur')->firstOrFail());
        $target = User::factory()->create();
        $target->roles()->attach(Role::query()->where('code', 'controleur_financier')->firstOrFail());
        Sanctum::actingAs($admin);

        $this->postJson('/api/v1/users/'.$target->id.'/roles', [
            'role_code' => 'agent_comptable',
        ])->assertStatus(422)->assertJsonPath('code', 'SOD_CONFLICT');
    }

    public function test_audit_journal_is_readable_by_audit_and_not_writable_over_http(): void
    {
        $auditor = User::factory()->create();
        $auditor->roles()->attach(Role::query()->where('code', 'audit_interne')->firstOrFail());
        AuditEvent::query()->create([
            'actor_id' => $auditor->id,
            'action' => 'auth.login',
        ]);
        Sanctum::actingAs($auditor);

        $this->getJson('/api/v1/audit-events')->assertOk()->assertJsonPath('data.0.action', 'auth.login');
        $this->putJson('/api/v1/audit-events')->assertStatus(405);
        $this->deleteJson('/api/v1/audit-events')->assertStatus(405);
    }

    public function test_organization_reference_exposes_the_general_means_service(): void
    {
        $this->seed(OrganizationSeeder::class);
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', 'initiateur')->firstOrFail());
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/organization-units?search=DSG-DRHMG-SMG')
            ->assertOk()
            ->assertJsonPath('data.0.code', 'DSG-DRHMG-SMG');
    }
}
