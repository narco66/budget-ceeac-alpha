<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\FiscalYear;
use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_an_empty_exercise_does_not_invent_an_execution_rate(): void
    {
        Sanctum::actingAs($this->userWith('administrateur'));

        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.scope.mode', 'institution')
            ->assertJsonPath('data.budget.has_executable', false)
            ->assertJsonPath('data.budget.revised_xaf', '0')
            ->assertJsonPath('data.budget.paid_xaf', '0')
            ->assertJsonPath('data.budget.execution_percent', null)
            ->assertJsonPath('data.physical', null)
            ->assertJsonPath('data.segments', [])
            ->assertJsonPath('data.alerts', [])
            ->assertJsonPath('data.pipeline.need_requests', 0);
    }

    public function test_figures_follow_the_executable_lines_of_the_user_scope(): void
    {
        [$line, $unit, $other] = $this->executableLine('8000');
        $amount = '8000';

        Sanctum::actingAs($this->userWith('administrateur'));
        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.budget.has_executable', true)
            ->assertJsonPath('data.budget.revised_xaf', '8000')
            ->assertJsonPath('data.budget.available_xaf', '8000')
            ->assertJsonPath('data.budget.execution_percent', '0')
            ->assertJsonPath('data.segments.0.code', 'fonctionnement')
            ->assertJsonPath('data.segments.0.label', 'Hors PAP')
            ->assertJsonPath('data.structures.0.name', $unit->name);

        Sanctum::actingAs($this->userWith('directeur', $other->id));
        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.scope.mode', 'structures')
            ->assertJsonPath('data.budget.has_executable', false)
            ->assertJsonPath('data.budget.revised_xaf', '0')
            ->assertJsonPath('data.budget.execution_percent', null);

        Sanctum::actingAs($this->userWith('directeur', $unit->id));
        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.budget.revised_xaf', '8000')
            ->assertJsonPath('data.budget.execution_percent', '0');

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.scope.mode', 'none')
            ->assertJsonPath('data.budget.revised_xaf', '0');

        $this->assertSame($amount, (string) $line->initial_amount_xaf);
    }

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit, 2: OrganizationUnit}
     */
    private function executableLine(string $amount): array
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $version = OrganizationVersion::query()->firstOrCreate(
            ['code' => 'ORG-TEST'],
            ['label' => 'Test', 'status' => 'proposed'],
        );
        $unit = OrganizationUnit::query()->create([
            'organization_version_id' => $version->id,
            'code' => 'DIR-A',
            'name' => 'Direction A',
            'unit_type' => 'departement_technique',
            'level' => 2,
            'is_active' => true,
        ]);
        $other = OrganizationUnit::query()->create([
            'organization_version_id' => $version->id,
            'code' => 'DIR-B',
            'name' => 'Direction B',
            'unit_type' => 'departement_technique',
            'level' => 2,
            'is_active' => true,
        ]);

        $budgets = app(BudgetVersionService::class);
        $draft = $budgets->createDraft($year, 'BR-1', 'Brouillon ignoré');
        $budgets->addLine($draft, [
            'nature' => 'expenditure',
            'segment' => 'fonctionnement',
            'funding_source' => 'ceeac',
            'code' => 'IGNORED',
            'label' => 'Hors exécution',
            'amount_xaf' => '99999',
        ]);

        $budget = $budgets->createDraft($year, 'EXE-D', 'Exécutoire de test');
        $line = $budgets->addLine($budget, [
            'nature' => 'expenditure',
            'segment' => 'fonctionnement',
            'funding_source' => 'ceeac',
            'code' => 'L-DIR',
            'label' => 'Fonctionnement test',
            'amount_xaf' => $amount,
        ]);
        $line->update(['organization_unit_id' => $unit->id]);
        $budgets->publish($budget->fresh());
        $budgets->markExecutable($budget->fresh());

        return [$line->fresh(), $unit, $other];
    }

    private function userWith(string $role, ?string $unitId = null): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(
            Role::query()->where('code', $role)->firstOrFail(),
            ['organization_unit_id' => $unitId],
        );

        return $user;
    }
}
