<?php

namespace Tests\Feature;

use App\Domain\Budget\OfficialBudgetControls;
use App\Domain\Money\IntegerAmount;
use App\Exceptions\BudgetRuleException;
use App\Models\BudgetLine;
use App\Models\BudgetVersion;
use App\Models\FiscalYear;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BudgetApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_guest_cannot_read_the_budget(): void
    {
        $this->getJson('/api/v1/budget-versions')->assertUnauthorized();
    }

    public function test_user_without_permission_is_forbidden(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/budget-control-totals')->assertForbidden();
    }

    public function test_control_totals_are_checkpoints_and_the_official_budget_is_not_loaded(): void
    {
        $this->actAsAdministrator();

        $this->getJson('/api/v1/budget-control-totals')
            ->assertOk()
            ->assertJsonPath('data.official_import_promoted', false)
            ->assertJsonPath('data.amounts_xaf.expenditure', OfficialBudgetControls::TOTAL_EXPENDITURE)
            ->assertJsonPath('data.role', 'control_checkpoint');

        $this->assertSame(0, BudgetLine::query()->count());
    }

    public function test_official_import_is_rejected_when_the_control_total_does_not_match(): void
    {
        $this->actAsAdministrator();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();

        $lines = $this->officialEnvelope();
        $lines[3]['amount_xaf'] = '741000001';

        $this->postJson('/api/v1/budget-imports', [
            'fiscal_year_id' => $year->id,
            'mode' => 'official_2026',
            'lines' => $lines,
        ])->assertCreated()
            ->assertJsonPath('data.status', 'rejected');

        $this->assertSame(0, BudgetLine::query()->count());
        $this->assertSame(0, BudgetVersion::query()->count());
    }

    public function test_matching_official_import_can_be_promoted_as_draft_only(): void
    {
        $this->actAsAdministrator();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();

        $batch = $this->postJson('/api/v1/budget-imports', [
            'fiscal_year_id' => $year->id,
            'mode' => 'official_2026',
            'lines' => $this->officialEnvelope(),
        ])->assertCreated()->assertJsonPath('data.status', 'accepted');

        $this->postJson('/api/v1/budget-imports/'.$batch->json('data.id').'/promote')
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft');

        $this->assertSame(4, BudgetLine::query()->count());
        $this->assertSame(0, BudgetVersion::query()->where('status', 'published')->count());
    }

    public function test_published_initial_is_immutable_and_a_decrease_cannot_exceed_it(): void
    {
        $this->actAsAdministrator();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();

        $version = $this->postJson('/api/v1/budget-versions', [
            'fiscal_year_id' => $year->id,
            'code' => 'TEST-IMM',
            'label' => 'Version de test',
        ])->assertCreated()->json('data.id');

        $line = $this->postJson('/api/v1/budget-versions/'.$version.'/lines', [
            'nature' => 'expenditure',
            'segment' => 'fonctionnement',
            'funding_source' => 'ceeac',
            'code' => 'L1',
            'label' => 'Ligne de test',
            'amount_xaf' => '1000',
        ])->assertCreated()->json('data.id');

        $this->postJson('/api/v1/budget-versions/'.$version.'/publish')->assertOk();

        $this->postJson('/api/v1/budget-versions/'.$version.'/lines', [
            'nature' => 'expenditure',
            'segment' => 'equipement',
            'funding_source' => 'ceeac',
            'code' => 'L2',
            'label' => 'Trop tard',
            'amount_xaf' => '1',
        ])->assertStatus(422)->assertJsonPath('code', 'BUDGET_RULE');

        $model = BudgetLine::query()->findOrFail($line);
        $model->initial_amount_xaf = '5';
        $this->expectException(BudgetRuleException::class);
        $model->save();
    }

    public function test_movement_ceiling_and_pap_is_not_added_twice(): void
    {
        $this->actAsAdministrator();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();

        $versionId = $this->postJson('/api/v1/budget-versions', [
            'fiscal_year_id' => $year->id,
            'code' => 'TEST-PAP',
            'label' => 'Segments',
        ])->json('data.id');

        $ids = [];
        foreach ([
            ['FONC', 'fonctionnement', '100'],
            ['PAP', 'investissement', '200'],
            ['EQ', 'equipement', '50'],
        ] as [$code, $segment, $amount]) {
            $ids[$code] = $this->postJson('/api/v1/budget-versions/'.$versionId.'/lines', [
                'nature' => 'expenditure',
                'segment' => $segment,
                'funding_source' => 'ceeac',
                'code' => $code,
                'label' => $code,
                'amount_xaf' => $amount,
            ])->json('data.id');
        }

        $this->postJson('/api/v1/budget-versions/'.$versionId.'/publish')->assertOk();

        $shown = $this->getJson('/api/v1/budget-versions/'.$versionId)->assertOk();
        $this->assertSame('350', $shown->json('data.expenditure_total_xaf'));
        $this->assertSame('200', $shown->json('data.investissement_xaf'));
        $this->assertNotSame(
            '0',
            IntegerAmount::subtract(
                IntegerAmount::add('350', '200'),
                $shown->json('data.expenditure_total_xaf'),
            ),
        );

        $tooMuch = $this->postJson('/api/v1/budget-movements', [
            'budget_version_id' => $versionId,
            'movement_type' => 'annulation',
            'reason' => 'Test de plafond',
            'lines' => [[
                'budget_line_id' => $ids['FONC'],
                'direction' => 'decrease',
                'amount_xaf' => '101',
            ]],
        ])->assertCreated();

        $this->postJson('/api/v1/budget-movements/'.$tooMuch->json('data.id').'/validate')
            ->assertStatus(422)
            ->assertJsonPath('code', 'BUDGET_RULE');

        $within = $this->postJson('/api/v1/budget-movements', [
            'budget_version_id' => $versionId,
            'movement_type' => 'annulation',
            'reason' => 'Annulation partielle',
            'lines' => [[
                'budget_line_id' => $ids['FONC'],
                'direction' => 'decrease',
                'amount_xaf' => '40',
            ]],
        ])->assertCreated();

        $this->postJson('/api/v1/budget-movements/'.$within->json('data.id').'/validate')->assertOk();

        $after = $this->getJson('/api/v1/budget-versions/'.$versionId)->json('data');
        $fonctionnement = collect($after['lines'])->firstWhere('code', 'FONC');
        $this->assertSame('100', $fonctionnement['balance']['initial_xaf']);
        $this->assertSame('60', $fonctionnement['balance']['revised_xaf']);
        $this->assertSame('310', $after['expenditure_total_xaf']);
    }

    public function test_freeze_reduces_availability_without_rewriting_the_revised_amount(): void
    {
        $this->actAsAdministrator();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $versionId = $this->postJson('/api/v1/budget-versions', [
            'fiscal_year_id' => $year->id,
            'code' => 'TEST-GEL',
            'label' => 'Gel',
        ])->json('data.id');
        $lineId = $this->postJson('/api/v1/budget-versions/'.$versionId.'/lines', [
            'nature' => 'expenditure',
            'segment' => 'equipement',
            'funding_source' => 'ceeac',
            'code' => 'GEL',
            'label' => 'Équipement',
            'amount_xaf' => '1000',
        ])->json('data.id');
        $this->postJson('/api/v1/budget-versions/'.$versionId.'/publish')->assertOk();

        $movement = $this->postJson('/api/v1/budget-movements', [
            'budget_version_id' => $versionId,
            'movement_type' => 'gel',
            'reason' => 'Gel de test',
            'lines' => [[
                'budget_line_id' => $lineId,
                'direction' => 'freeze',
                'amount_xaf' => '100',
            ]],
        ])->assertCreated();
        $this->postJson('/api/v1/budget-movements/'.$movement->json('data.id').'/validate')->assertOk();

        $line = collect($this->getJson('/api/v1/budget-versions/'.$versionId)->json('data.lines'))->first();
        $this->assertSame('1000', $line['balance']['revised_xaf']);
        $this->assertSame('100', $line['balance']['frozen_xaf']);
        $this->assertSame('900', $line['balance']['available_xaf']);
    }

    /**
     * @return list<array<string, string>>
     */
    private function officialEnvelope(): array
    {
        return [
            $this->envelope('FONC', 'fonctionnement', 'ceeac', OfficialBudgetControls::FONCTIONNEMENT),
            $this->envelope('PAP-CEEAC', 'investissement', 'ceeac', OfficialBudgetControls::INVESTISSEMENT_CEEAC),
            $this->envelope('PAP-PTF', 'investissement', 'ptf', OfficialBudgetControls::INVESTISSEMENT_PTF),
            $this->envelope('EQ', 'equipement', 'ceeac', OfficialBudgetControls::EQUIPEMENT),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function envelope(string $code, string $segment, string $source, string $amount): array
    {
        return [
            'nature' => 'expenditure',
            'segment' => $segment,
            'funding_source' => $source,
            'code' => $code,
            'label' => $code,
            'amount_xaf' => $amount,
        ];
    }

    private function actAsAdministrator(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::query()->where('code', 'administrateur')->firstOrFail());
        Sanctum::actingAs($admin);
    }
}
