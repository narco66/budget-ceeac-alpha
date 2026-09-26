<?php

namespace Tests\Unit;

use App\Domain\Identity\SegregationOfDuties;
use App\Models\AuditEvent;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use LogicException;
use Tests\TestCase;

class AuditAndSodTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_event_cannot_be_updated_or_deleted(): void
    {
        $event = AuditEvent::query()->create(['action' => 'auth.login']);

        $this->expectException(LogicException::class);
        $event->action = 'auth.tamper';
        $event->save();
    }

    public function test_dossier_segregation_detects_incompatible_roles(): void
    {
        $this->seed(SodRuleSeeder::class);
        $conflicts = app(SegregationOfDuties::class)->dossierConflicts([
            'initiateur',
            'controleur_financier',
        ]);

        $this->assertNotEmpty($conflicts);
        $this->assertSame([], app(SegregationOfDuties::class)->dossierConflicts(['expert_budget']));
    }

    public function test_user_permission_respects_active_assignment(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $user = User::factory()->create();
        $role = Role::query()->where('code', 'audit_interne')->firstOrFail();
        $user->roles()->attach($role->id, [
            'starts_at' => now()->subDay(),
            'ends_at' => now()->subHour(),
        ]);

        $this->assertFalse($user->hasPermission('audit.view'));
    }
}
