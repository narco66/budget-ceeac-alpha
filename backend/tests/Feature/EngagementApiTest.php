<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\BudgetVersion;
use App\Models\Commitment;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\Liquidation;
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

class EngagementApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_budget_director_reserves_and_financial_controller_firms_once(): void
    {
        [$line, $unit] = $this->openLine('100000');
        $commitmentId = $this->signNeed($line, $unit, 'Fournitures de bureau', '2', '5000');
        $this->instructUntilDirector($commitmentId);

        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])
            ->assertOk()
            ->assertJsonPath('data.status', 'reserved')
            ->assertJsonPath('data.reserved_xaf', '10000')
            ->assertJsonPath('data.committed_xaf', '0')
            ->assertJsonPath('data.object', 'Fournitures de bureau');

        Sanctum::actingAs($this->userWith('controleur_financier'));
        $vised = $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'visa'])
            ->assertOk()
            ->assertJsonPath('data.status', 'vised')
            ->assertJsonPath('data.reserved_xaf', '0')
            ->assertJsonPath('data.committed_xaf', '10000')
            ->assertJsonPath('data.liquidations.0.status', 'in_preparation')
            ->assertJsonPath('data.official_pdf', null);

        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'visa'])
            ->assertStatus(422);
        $this->assertSame(1, Liquidation::query()->count());
        $this->assertStringStartsWith('LIQ-2026-', (string) $vised->json('data.liquidations.0.reference'));

        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/releases', [
            'amount_xaf' => '3000',
            'reason' => 'Besoin réduit après visa',
        ])->assertOk()->assertJsonPath('data.committed_xaf', '7000');

        $this->postJson('/api/v1/commitments/'.$commitmentId.'/releases', [
            'amount_xaf' => '8000',
            'reason' => 'Trop élevé',
        ])->assertStatus(422)->assertJsonPath('code', 'ENGAGEMENT_RULE');
    }

    public function test_only_one_reservation_fits_when_the_line_cannot_cover_both(): void
    {
        [$line, $unit, $version] = $this->openLine('100');
        $first = $this->signNeed($line, $unit, 'Premier besoin', '2', '30');
        $second = $this->signNeed($line, $unit, 'Second besoin', '2', '30');
        $this->instructUntilDirector($first);
        $this->instructUntilDirector($second);

        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$first.'/transitions', ['action' => 'validate'])->assertOk();
        $this->postJson('/api/v1/commitments/'.$second.'/transitions', ['action' => 'validate'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'ENGAGEMENT_RULE');

        Sanctum::actingAs($this->userWith('administrateur'));
        $shown = $this->getJson('/api/v1/budget-versions/'.$version->id)->assertOk();
        $balance = collect($shown->json('data.lines'))->firstWhere('code', 'L1');
        $this->assertSame('40', $balance['balance']['available_xaf']);
        $this->assertSame('60', $balance['balance']['reserved_xaf']);
        $this->assertSame(1, Commitment::query()->where('status', 'reserved')->count());
    }

    public function test_partial_commitments_stay_within_the_need_and_a_refusal_releases_the_reserve(): void
    {
        [$line, $unit] = $this->openLine('100000');
        $commitmentId = $this->signNeed($line, $unit, 'Besoin divisible', '2', '5000');

        Sanctum::actingAs($this->userWith('expert_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/amount', ['amount_xaf' => '4000'])
            ->assertOk()
            ->assertJsonPath('data.amount_xaf', '4000')
            ->assertJsonPath('data.eb_remainder_xaf', '6000')
            ->assertJsonPath('data.object', 'Besoin divisible');

        $partial = $this->postJson('/api/v1/need-requests/'.Commitment::query()->findOrFail($commitmentId)->need_request_id.'/commitments', [
            'amount_xaf' => '6000',
            'idempotency_key' => 'partiel-1',
        ])->assertCreated();
        $replay = $this->postJson('/api/v1/need-requests/'.Commitment::query()->findOrFail($commitmentId)->need_request_id.'/commitments', [
            'amount_xaf' => '6000',
            'idempotency_key' => 'partiel-1',
        ])->assertCreated();
        $this->assertSame($partial->json('data.id'), $replay->json('data.id'));
        $this->assertSame(2, Commitment::query()->count());

        $this->postJson('/api/v1/need-requests/'.Commitment::query()->findOrFail($commitmentId)->need_request_id.'/commitments', [
            'amount_xaf' => '1',
            'idempotency_key' => 'partiel-2',
        ])->assertStatus(422);

        $refusedNeed = $this->signNeed($line, $unit, 'Besoin refusé', '1', '1000');
        $this->instructUntilDirector($refusedNeed);
        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$refusedNeed.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('controleur_financier'));
        $this->postJson('/api/v1/commitments/'.$refusedNeed.'/transitions', [
            'action' => 'reject',
            'reason' => 'Pièce insuffisante',
        ])->assertOk()->assertJsonPath('data.status', 'visa_refused')->assertJsonPath('data.reserved_xaf', '0');
        $this->assertSame(0, Commitment::query()->findOrFail($refusedNeed)->liquidations()->count());
    }

    private function instructUntilDirector(string $commitmentId): void
    {
        Sanctum::actingAs($this->userWith('expert_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('chef_service_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])->assertOk();
    }

    private function signNeed(BudgetLine $line, OrganizationUnit $unit, string $object, string $quantity, string $price): string
    {
        Sanctum::actingAs($this->userWith('moyens_generaux'));
        $created = $this->postJson('/api/v1/need-requests', [
            'budget_line_id' => $line->id,
            'organization_unit_id' => $unit->id,
            'object' => $object,
            'justification' => 'Besoin justifié pour le test.',
            'need_on' => '2026-03-15',
            'lines' => [[
                'designation' => 'Détail',
                'quantity' => $quantity,
                'unit' => 'unité',
                'unit_price_xaf' => $price,
            ]],
            'documents' => [[
                'kind' => 'justification',
                'label' => 'Note',
                'is_present' => true,
            ]],
        ])->assertCreated();
        $id = $created->json('data.id');
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'submit'])->assertOk();
        Sanctum::actingAs($this->userWith('drhmg'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('president'));

        return (string) $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->json('data.commitment.id');
    }

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit, 2: BudgetVersion}
     */
    private function openLine(string $amount): array
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $year->update(['status' => 'execution']);
        FiscalPeriod::query()->where('fiscal_year_id', $year->id)->where('position', 3)->update(['status' => 'open']);

        $organization = OrganizationVersion::query()->firstOrCreate(
            ['code' => 'ORG-ENG'],
            ['label' => 'Test', 'status' => 'proposed'],
        );
        $unit = OrganizationUnit::query()->create([
            'organization_version_id' => $organization->id,
            'code' => 'SMG-'.uniqid(),
            'name' => 'Moyens généraux',
            'unit_type' => 'service',
            'level' => 4,
            'is_active' => true,
        ]);

        $budgets = app(BudgetVersionService::class);
        $version = $budgets->createDraft($year, 'ENG-'.uniqid(), 'Exécutoire');
        $line = $budgets->addLine($version, [
            'nature' => 'expenditure',
            'segment' => 'fonctionnement',
            'funding_source' => 'ceeac',
            'code' => 'L1',
            'label' => 'Fonctionnement',
            'amount_xaf' => $amount,
        ]);
        $line->update(['organization_unit_id' => $unit->id]);
        $budgets->publish($version->fresh());
        $budgets->markExecutable($version->fresh());

        return [$line->fresh(), $unit, $version->fresh()];
    }

    private function userWith(string $role): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', $role)->firstOrFail());

        return $user;
    }
}
