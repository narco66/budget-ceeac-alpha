<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Domain\Expenditure\CommitmentFromNeed;
use App\Models\BudgetLine;
use App\Models\Commitment;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\NeedRequest;
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

class NeedRequestApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_readiness_blocks_opening_while_the_budget_is_not_executable(): void
    {
        Sanctum::actingAs($this->userWith('administrateur'));

        $this->getJson('/api/v1/need-requests/readiness')
            ->assertOk()
            ->assertJsonPath('data.can_open', false);

        $this->getJson('/api/v1/need-requests')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_sublines_must_match_quantity_times_price(): void
    {
        [$line, $unit] = $this->openLine('fonctionnement', 'service', '100000');
        Sanctum::actingAs($this->userWith('moyens_generaux'));

        $this->postJson('/api/v1/need-requests', $this->payload($line, $unit, [
            'amount_xaf' => '1',
        ]))->assertStatus(422)->assertJsonPath('code', 'NEED_RULE');
    }

    public function test_hors_pap_circuit_creates_one_commitment(): void
    {
        [$line, $unit] = $this->openLine('fonctionnement', 'service', '100000');
        $smg = $this->userWith('moyens_generaux');
        Sanctum::actingAs($smg);

        $created = $this->postJson('/api/v1/need-requests', $this->payload($line, $unit))
            ->assertCreated()
            ->assertJsonPath('data.circuit_code', 'EB-HORS-PAP')
            ->assertJsonPath('data.amount_xaf', '10000')
            ->assertJsonPath('data.program_chain', null)
            ->assertJsonPath('data.banner.expected_role', 'moyens_generaux');

        $id = $created->json('data.id');
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'submit'])->assertOk();

        Sanctum::actingAs($this->userWith('drhmg'));
        $this->getJson('/api/v1/tasks')->assertOk()->assertJsonPath('data.0.assignee_role_code', 'drhmg');
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'return'])
            ->assertStatus(422);
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', [
            'action' => 'return',
            'reason' => 'Pièce à préciser',
        ])->assertOk()->assertJsonPath('data.status', 'returned');

        Sanctum::actingAs($smg);
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'submit'])->assertOk();
        Sanctum::actingAs($this->userWith('drhmg'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('president'));
        $signed = $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->assertJsonPath('data.status', 'validated')
            ->assertJsonPath('data.commitment.status', 'in_instruction')
            ->assertJsonPath('data.commitment.reference', 'ENG-2026-000001')
            ->assertJsonPath('data.official_documents.0.kind', 'eb_fiche')
            ->assertJsonCount(1, 'data.official_documents');

        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])
            ->assertStatus(422);

        $documentId = $signed->json('data.official_documents.0.document_id');
        $file = $this->get('/api/v1/documents/'.$documentId.'/file')->assertOk();
        $this->assertStringStartsWith('%PDF', $file->getContent());
        $this->assertSame(
            hash('sha256', $file->getContent()),
            $signed->json('data.official_documents.0.sha256'),
        );

        $need = NeedRequest::query()->findOrFail($id);
        $generator = app(CommitmentFromNeed::class);
        $again = $generator->generate($need);
        $this->assertSame($signed->json('data.commitment.id'), $again->id);
        $this->assertSame(1, Commitment::query()->count());

        Sanctum::actingAs($smg);
        $revised = $this->postJson('/api/v1/need-requests/'.$id.'/revise')->assertCreated();
        $this->assertSame(2, $revised->json('data.version_number'));
        $this->assertSame('draft', $revised->json('data.status'));
        $this->assertSame('replaced', NeedRequest::query()->findOrFail($id)->status);
        $this->assertSame(1, Commitment::query()->count());
    }

    public function test_pap_technical_circuit_ends_with_the_commissioner(): void
    {
        [$line, $unit] = $this->openLine('investissement', 'departement_technique', '100000');
        $id = $this->openPap($line, $unit);

        Sanctum::actingAs($this->userWith('directeur'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])->assertStatus(422);

        Sanctum::actingAs($this->userWith('commissaire'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->assertJsonPath('data.circuit_code', 'EB-PAP-TECHNIQUE')
            ->assertJsonPath('data.program_chain', null)
            ->assertJsonPath('data.status', 'validated');
    }

    public function test_pap_support_circuit_ends_with_the_secretary_general(): void
    {
        [$line, $unit] = $this->openLine('investissement', 'departement_appui', '100000');
        $id = $this->openPap($line, $unit);

        Sanctum::actingAs($this->userWith('directeur'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertOk();

        Sanctum::actingAs($this->userWith('commissaire'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])->assertStatus(422);

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'validate'])
            ->assertOk()
            ->assertJsonPath('data.circuit_code', 'EB-PAP-APPUI');
    }

    public function test_equipment_line_and_over_available_amount_are_rejected(): void
    {
        [$line, $unit] = $this->openLine('equipement', 'service', '1000');
        Sanctum::actingAs($this->userWith('moyens_generaux'));
        $this->postJson('/api/v1/need-requests', $this->payload($line, $unit))
            ->assertStatus(422)
            ->assertJsonPath('code', 'NEED_RULE');

        [$wide, $unit] = $this->openLine('fonctionnement', 'service', '5000', 'FONC-2', 'EXE-2', 'SMG-2');
        $created = $this->postJson('/api/v1/need-requests', $this->payload($wide, $unit, [
            'quantity' => '2',
            'unit_price_xaf' => '4000',
        ]))->assertCreated();

        $this->postJson('/api/v1/need-requests/'.$created->json('data.id').'/transitions', ['action' => 'submit'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'NEED_RULE');
    }

    /**
     * @param  array<string, string>  $overrides
     * @return array<string, mixed>
     */
    private function payload(BudgetLine $line, OrganizationUnit $unit, array $overrides = []): array
    {
        $lineItem = [
            'designation' => 'Ramettes',
            'quantity' => $overrides['quantity'] ?? '2',
            'unit' => 'rame',
            'unit_price_xaf' => $overrides['unit_price_xaf'] ?? '5000',
        ];
        if (isset($overrides['amount_xaf'])) {
            $lineItem['amount_xaf'] = $overrides['amount_xaf'];
        }

        return [
            'budget_line_id' => $line->id,
            'organization_unit_id' => $unit->id,
            'object' => 'Fournitures de bureau',
            'justification' => 'Besoin du service pour le trimestre.',
            'need_on' => '2026-03-15',
            'lines' => [$lineItem],
            'documents' => [[
                'kind' => 'justification',
                'label' => 'Note de besoin',
                'is_present' => true,
            ]],
        ];
    }

    private function openPap(BudgetLine $line, OrganizationUnit $unit): string
    {
        Sanctum::actingAs($this->userWith('initiateur'));
        $created = $this->postJson('/api/v1/need-requests', $this->payload($line, $unit))->assertCreated();
        $id = $created->json('data.id');
        $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'submit'])->assertOk();

        return $id;
    }

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit}
     */
    private function openLine(
        string $segment,
        string $unitType,
        string $amount,
        string $lineCode = 'L1',
        string $versionCode = 'EXE',
        string $unitCode = 'UNIT-1',
    ): array {
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
            'code' => $unitCode,
            'name' => $unitCode,
            'unit_type' => $unitType,
            'level' => 2,
            'is_active' => true,
        ]);

        $budgets = app(BudgetVersionService::class);
        $budget = $budgets->createDraft($year, $versionCode, 'Exécutoire de test');
        $line = $budgets->addLine($budget, [
            'nature' => 'expenditure',
            'segment' => $segment,
            'funding_source' => 'ceeac',
            'code' => $lineCode,
            'label' => $lineCode,
            'amount_xaf' => $amount,
        ]);
        $line->update(['organization_unit_id' => $unit->id]);
        $budgets->publish($budget->fresh());
        $budgets->markExecutable($budget->fresh());

        return [$line->fresh(), $unit];
    }

    private function userWith(string $role): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', $role)->firstOrFail());

        return $user;
    }
}
