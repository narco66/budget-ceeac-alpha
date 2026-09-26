<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use App\Models\Party;
use App\Models\ProcurementThreshold;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TransversalApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_parties_reject_duplicates_and_the_declarant_cannot_activate_an_account(): void
    {
        $this->assertSame(0, Party::query()->count());
        $this->assertSame(0, ProcurementThreshold::query()->count());

        $author = $this->userWith('chef_comptable');
        $controller = $this->userWith('chef_comptable');

        Sanctum::actingAs($author);
        $created = $this->postJson('/api/v1/parties', [
            'legal_name' => 'Atelier  Central',
            'party_type' => 'supplier',
            'country' => 'CM',
        ])->assertCreated();
        $partyId = $created->json('data.id');

        $this->postJson('/api/v1/parties', [
            'legal_name' => 'atelier central',
            'party_type' => 'supplier',
        ])->assertStatus(422)->assertJsonPath('code', 'PARTY_RULE');

        $this->postJson('/api/v1/parties/'.$partyId.'/status', [
            'status' => 'suspended',
        ])->assertStatus(422)->assertJsonPath('code', 'PARTY_RULE');

        $account = $this->postJson('/api/v1/parties/'.$partyId.'/bank-accounts', [
            'bank_name' => 'BEAC',
            'account_number' => '10001',
        ])->assertCreated();
        $accountId = $account->json('data.id');
        $this->assertSame('pending', $account->json('data.status'));

        $this->postJson('/api/v1/party-bank-accounts/'.$accountId.'/activate')
            ->assertStatus(422)
            ->assertJsonPath('code', 'PARTY_RULE');

        Sanctum::actingAs($controller);
        $this->postJson('/api/v1/party-bank-accounts/'.$accountId.'/activate')
            ->assertOk()
            ->assertJsonPath('data.status', 'active');

        Sanctum::actingAs($author);
        $second = $this->postJson('/api/v1/parties/'.$partyId.'/bank-accounts', [
            'bank_name' => 'BEAC',
            'account_number' => '10002',
        ])->assertCreated();

        Sanctum::actingAs($controller);
        $this->postJson('/api/v1/party-bank-accounts/'.$second->json('data.id').'/activate')
            ->assertOk()
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.supersedes_id', $accountId);

        $this->getJson('/api/v1/procurement-thresholds')
            ->assertForbidden();
    }

    public function test_contract_revision_and_empty_thresholds(): void
    {
        $admin = $this->userWith('administrateur');
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/procurement-thresholds')
            ->assertOk()
            ->assertJsonPath('data', [])
            ->assertJsonPath('message', 'Aucun seuil de procédure n’est configuré.');

        $partyId = $this->postJson('/api/v1/parties', [
            'legal_name' => 'Cabinet fluvial',
            'party_type' => 'consultant',
        ])->json('data.id');

        $yearId = FiscalYear::query()->where('year', 2026)->value('id');
        $contract = $this->postJson('/api/v1/contracts', [
            'party_id' => $partyId,
            'fiscal_year_id' => $yearId,
            'contract_type' => 'contrat',
            'object' => 'Assistance technique',
            'amount_xaf' => '1000',
        ])->assertCreated();

        $this->assertSame('CTR-2026-000001', $contract->json('data.reference'));
        $this->assertNull($contract->json('data.linked_spend'));

        $id = $contract->json('data.id');
        $this->postJson('/api/v1/contracts/'.$id.'/amendments', [
            'direction' => 'increase',
            'amount_xaf' => '250',
            'reason' => 'Extension de mission.',
        ])->assertOk()->assertJsonPath('data.revised_xaf', '1250');

        $this->postJson('/api/v1/contracts/'.$id.'/amendments', [
            'direction' => 'decrease',
            'amount_xaf' => '2000',
            'reason' => 'Trop fort.',
        ])->assertStatus(422)->assertJsonPath('code', 'CONTRACT_RULE');
    }

    public function test_a_sealed_document_cannot_be_replaced_or_removed(): void
    {
        Storage::fake('local');
        Sanctum::actingAs($this->userWith('administrateur'));

        $created = $this->post('/api/v1/documents', [
            'title' => 'Note de besoin',
            'category' => 'justification',
            'file' => UploadedFile::fake()->createWithContent('note.pdf', 'piece-ceeac'),
        ], ['Accept' => 'application/json'])->assertCreated();

        $this->assertSame(hash('sha256', 'piece-ceeac'), $created->json('data.sha256'));
        $this->assertNull($created->json('data.official_pdf'));
        $id = $created->json('data.id');

        $this->post('/api/v1/documents/'.$id.'/versions', [
            'file' => UploadedFile::fake()->createWithContent('note-v2.pdf', 'piece-revisee'),
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.sha256', hash('sha256', 'piece-revisee'));

        $this->postJson('/api/v1/documents/'.$id.'/seal')->assertOk()->assertJsonPath('data.status', 'sealed');

        $this->post('/api/v1/documents/'.$id.'/versions', [
            'file' => UploadedFile::fake()->createWithContent('note-v3.pdf', 'interdit'),
        ], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'DOCUMENT_RULE');

        $this->deleteJson('/api/v1/documents/'.$id)
            ->assertStatus(422)
            ->assertJsonPath('code', 'DOCUMENT_RULE');
    }

    public function test_an_open_task_notifies_the_assignee_once(): void
    {
        [$line, $unit] = $this->openLine();
        $starter = $this->userWith('moyens_generaux');
        $assignee = $this->userWith('drhmg');

        Sanctum::actingAs($starter);
        $created = $this->postJson('/api/v1/need-requests', [
            'budget_line_id' => $line->id,
            'organization_unit_id' => $unit->id,
            'object' => 'Fournitures',
            'justification' => 'Besoin du trimestre.',
            'need_on' => '2026-03-15',
            'lines' => [[
                'designation' => 'Ramettes',
                'quantity' => '2',
                'unit' => 'rame',
                'unit_price_xaf' => '5000',
            ]],
            'documents' => [[
                'kind' => 'justification',
                'label' => 'Note',
                'is_present' => true,
            ]],
        ])->assertCreated();

        $this->postJson('/api/v1/need-requests/'.$created->json('data.id').'/transitions', [
            'action' => 'submit',
        ])->assertOk();

        $this->getJson('/api/v1/notifications')->assertOk()->assertJsonPath('data', []);

        Sanctum::actingAs($assignee);
        $inbox = $this->getJson('/api/v1/notifications')->assertOk();
        $this->assertCount(1, $inbox->json('data'));
        $noticeId = $inbox->json('data.0.id');

        $this->postJson('/api/v1/notifications/'.$noticeId.'/read')->assertOk();
        $this->assertNotNull($this->getJson('/api/v1/notifications')->json('data.0.read_at'));
    }

    public function test_a_finding_closes_only_with_a_reason(): void
    {
        Sanctum::actingAs($this->userWith('controle_interne'));
        $created = $this->postJson('/api/v1/findings', [
            'title' => 'Pièce manquante',
            'observation' => 'Le dossier ne contient pas le service fait.',
        ])->assertCreated();

        $id = $created->json('data.id');
        $this->postJson('/api/v1/findings/'.$id.'/close', [])
            ->assertStatus(422)
            ->assertJsonPath('code', 'VALIDATION_ERROR');

        $this->postJson('/api/v1/findings/'.$id.'/close', [
            'reason' => 'La pièce a été versée.',
        ])->assertOk()->assertJsonPath('data.status', 'closed');
    }

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit}
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

        return [$line->fresh(), $unit];
    }

    private function userWith(string $role): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', $role)->firstOrFail());

        return $user;
    }
}
