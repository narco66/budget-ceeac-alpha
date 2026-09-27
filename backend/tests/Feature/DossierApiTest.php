<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\Commitment;
use App\Models\Contract;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use App\Models\Party;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DossierApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_search_finds_the_chain_and_hides_another_structure(): void
    {
        [$line, $unit, $other] = $this->openLine();
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $need = NeedRequest::query()->create([
            'fiscal_year_id' => $year->id,
            'budget_line_id' => $line->id,
            'organization_unit_id' => $unit->id,
            'reference' => 'EB-2026-000099',
            'version_number' => 1,
            'circuit_code' => 'EB-HORS-PAP',
            'object' => 'Fournitures de bureau',
            'justification' => 'Trimestre.',
            'amount_xaf' => '10000',
            'need_on' => '2026-03-15',
            'status' => 'validated',
        ]);
        $commitment = Commitment::query()->create([
            'need_request_id' => $need->id,
            'fiscal_year_id' => $year->id,
            'budget_line_id' => $line->id,
            'organization_unit_id' => $unit->id,
            'reference' => 'ENG-2026-000099',
            'status' => 'committed',
            'circuit_code' => 'ENG',
            'object' => 'Fournitures de bureau',
            'amount_xaf' => '10000',
        ]);
        Liquidation::query()->create([
            'commitment_id' => $commitment->id,
            'need_request_id' => $need->id,
            'fiscal_year_id' => $year->id,
            'reference' => 'LIQ-2026-000099',
            'status' => 'vised',
            'rank' => 1,
            'gross_amount_xaf' => '10000',
            'tax_xaf' => '0',
            'withholding_xaf' => '0',
            'penalty_xaf' => '0',
            'advance_xaf' => '0',
            'amount_xaf' => '10000',
            'invoice_number' => 'FAC-99',
            'supplier_label' => 'Atelier test',
        ]);
        $party = Party::query()->create([
            'legal_name' => 'Atelier test',
            'name_key' => 'atelier test',
            'party_type' => 'supplier',
            'status' => 'active',
        ]);
        Contract::query()->create([
            'party_id' => $party->id,
            'fiscal_year_id' => $year->id,
            'reference' => 'CTR-2026-000099',
            'contract_type' => 'contrat',
            'object' => 'Maintenance',
            'amount_xaf' => '20000',
            'status' => 'active',
        ]);

        Sanctum::actingAs($this->userWith('administrateur'));
        $this->getJson('/api/v1/dossiers?q=F')->assertStatus(422);

        $found = $this->getJson('/api/v1/dossiers?q=FAC-99')->assertOk();
        $this->assertSame('EB-2026-000099', $found->json('data.0.reference'));
        $this->assertSame('need_request', $found->json('data.0.kind'));

        $contract = $this->getJson('/api/v1/dossiers?q=CTR-2026-000099')->assertOk();
        $this->assertSame('contract', $contract->json('data.0.kind'));
        $this->assertNull($contract->json('data.0.linked_need'));

        $dossier = $this->getJson('/api/v1/dossiers/ENG-2026-000099')->assertOk();
        $dossier->assertJsonPath('data.reference', 'EB-2026-000099')
            ->assertJsonPath('data.commitments.0.liquidations.0.invoice_number', 'FAC-99')
            ->assertJsonPath('data.monitoring', null)
            ->assertJsonPath('data.findings', [])
            ->assertJsonPath('data.need_request.budget_line.code', 'L-SMG');

        $this->getJson('/api/v1/dossiers/INCONNU')->assertNotFound();

        Sanctum::actingAs($this->userWith('directeur', $other->id));
        $this->getJson('/api/v1/dossiers?q=FAC-99')->assertOk()->assertJsonPath('data', []);
        $this->getJson('/api/v1/dossiers/EB-2026-000099')->assertNotFound();
    }

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit, 2: OrganizationUnit}
     */
    private function openLine(): array
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $year->update(['status' => 'execution']);
        FiscalPeriod::query()
            ->where('fiscal_year_id', $year->id)
            ->where('position', 3)
            ->update(['status' => 'open']);

        $version = OrganizationVersion::query()->firstOrCreate(
            ['code' => 'ORG-TEST'],
            ['label' => 'Test', 'status' => 'proposed'],
        );
        $unit = OrganizationUnit::query()->create([
            'organization_version_id' => $version->id,
            'code' => 'SMG-TEST',
            'name' => 'SMG test',
            'unit_type' => 'service',
            'level' => 2,
            'is_active' => true,
        ]);
        $other = OrganizationUnit::query()->create([
            'organization_version_id' => $version->id,
            'code' => 'AUTRE',
            'name' => 'Autre direction',
            'unit_type' => 'departement_technique',
            'level' => 2,
            'is_active' => true,
        ]);

        $budgets = app(BudgetVersionService::class);
        $budget = $budgets->createDraft($year, 'EXE-T', 'Exécutoire de test');
        $line = $budgets->addLine($budget, [
            'nature' => 'expenditure',
            'segment' => 'fonctionnement',
            'funding_source' => 'ceeac',
            'code' => 'L-SMG',
            'label' => 'Fonctionnement test',
            'amount_xaf' => '100000',
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
