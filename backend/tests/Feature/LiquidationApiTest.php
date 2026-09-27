<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\Liquidation;
use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use App\Models\PaymentOrder;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LiquidationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_partial_liquidations_stay_within_the_commitment_and_invoices_are_unique(): void
    {
        [$line, $unit] = $this->openLine('100000');
        $commitmentId = $this->visedCommitment($line, $unit, 'Besoin liquidable', '2', '5000');
        $first = Liquidation::query()->where('commitment_id', $commitmentId)->firstOrFail();

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/liquidations/'.$first->id.'/statement', $this->statement('6000', '1000', 'FAC-1'))
            ->assertOk()
            ->assertJsonPath('data.amount_xaf', '5000')
            ->assertJsonPath('data.withholding_xaf', '1000')
            ->assertJsonPath('data.remainder_xaf', '5000')
            ->assertJsonPath('data.commitment.object', 'Besoin liquidable')
            ->assertJsonPath('data.official_documents', []);

        $this->postJson('/api/v1/liquidations/'.$first->id.'/statement', $this->statement('1000', '2000', 'FAC-1'))
            ->assertStatus(422)
            ->assertJsonPath('code', 'LIQUIDATION_RULE');

        $this->postJson('/api/v1/commitments/'.$commitmentId.'/liquidations', [
            ...$this->statement('1000', '0', 'FAC-1'),
            'idempotency_key' => 'liq-dup',
        ])->assertStatus(422)->assertJsonPath('code', 'LIQUIDATION_RULE');

        $partial = $this->postJson('/api/v1/commitments/'.$commitmentId.'/liquidations', [
            ...$this->statement('5000', '0', 'FAC-2'),
            'idempotency_key' => 'liq-1',
        ])->assertCreated();
        $replay = $this->postJson('/api/v1/commitments/'.$commitmentId.'/liquidations', [
            ...$this->statement('5000', '0', 'FAC-2'),
            'idempotency_key' => 'liq-1',
        ])->assertCreated();
        $this->assertSame($partial->json('data.id'), $replay->json('data.id'));
        $this->assertSame(2, Liquidation::query()->count());

        $this->postJson('/api/v1/commitments/'.$commitmentId.'/liquidations', [
            ...$this->statement('1', '0', 'FAC-3'),
            'idempotency_key' => 'liq-2',
        ])->assertStatus(422)->assertJsonPath('code', 'LIQUIDATION_RULE');
    }

    public function test_financial_controller_vises_once_and_a_release_cannot_eat_a_vised_liquidation(): void
    {
        [$line, $unit] = $this->openLine('100000');
        $commitmentId = $this->visedCommitment($line, $unit, 'Besoin à viser', '2', '5000');
        $liquidationId = Liquidation::query()->where('commitment_id', $commitmentId)->firstOrFail()->id;

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/statement', $this->statement('8000', '0', 'FAC-8'))->assertOk();

        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/releases', [
            'amount_xaf' => '3000',
            'reason' => 'Dégagement avant liquidation',
        ])->assertOk();

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'validate'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'LIQUIDATION_RULE');

        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/statement', $this->statement('7000', '0', 'FAC-8'))->assertOk();
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'validate'])->assertOk();

        Sanctum::actingAs($this->userWith('certificateur_service_fait'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'certify'])
            ->assertStatus(422);
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/certification', [
            'service_done_on' => '2026-03-18',
            'certification_note' => 'Prestation réceptionnée conforme.',
            'documents' => [[
                'kind' => 'service_fait',
                'label' => 'Attestation',
                'is_present' => true,
            ]],
        ])->assertOk();
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'certify'])->assertOk();

        Sanctum::actingAs($this->userWith('controleur_financier'));
        $vised = $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'visa'])
            ->assertOk()
            ->assertJsonPath('data.status', 'vised')
            ->assertJsonPath('data.liquidated_xaf', '7000')
            ->assertJsonPath('data.payment_orders.0.status', 'to_sign_sg')
            ->assertJsonPath('data.official_documents.0.kind', 'liq_attestation')
            ->assertJsonPath('data.official_documents.1.kind', 'liq_etat');
        $this->assertStringStartsWith('ORD-2026-', (string) $vised->json('data.payment_orders.0.reference'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'visa'])->assertStatus(422);
        $this->assertSame(1, PaymentOrder::query()->count());

        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/releases', [
            'amount_xaf' => '1',
            'reason' => 'Tentative après liquidation',
        ])->assertStatus(422)->assertJsonPath('code', 'ENGAGEMENT_RULE');
    }

    public function test_a_refused_visa_frees_the_invoice_and_creates_no_payment_order(): void
    {
        [$line, $unit] = $this->openLine('100000');
        $commitmentId = $this->visedCommitment($line, $unit, 'Besoin refusé', '1', '1000');
        $liquidationId = Liquidation::query()->where('commitment_id', $commitmentId)->firstOrFail()->id;

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/statement', $this->statement('1000', '0', 'FAC-R'))->assertOk();
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('certificateur_service_fait'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/certification', [
            'service_done_on' => '2026-03-18',
            'certification_note' => 'Service constaté.',
            'documents' => [[
                'kind' => 'service_fait',
                'label' => 'Attestation',
                'is_present' => true,
            ]],
        ])->assertOk();
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'certify'])->assertOk();
        Sanctum::actingAs($this->userWith('controleur_financier'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', [
            'action' => 'reject',
            'reason' => 'Facture illisible',
        ])->assertOk()->assertJsonPath('data.status', 'visa_refused')->assertJsonPath('data.payment_orders', []);
        $this->assertSame(0, PaymentOrder::query()->count());

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/liquidations', [
            ...$this->statement('1000', '0', 'FAC-R'),
            'idempotency_key' => 'apres-refus',
        ])->assertCreated()->assertJsonPath('data.invoice_number', 'FAC-R');
    }

    /**
     * @return array<string, mixed>
     */
    private function statement(string $gross, string $withholding, string $invoice): array
    {
        return [
            'gross_amount_xaf' => $gross,
            'tax_xaf' => '0',
            'withholding_xaf' => $withholding,
            'penalty_xaf' => '0',
            'advance_xaf' => '0',
            'deduction_reason' => $withholding === '0' ? null : 'Retenue de garantie',
            'invoice_number' => $invoice,
            'invoice_on' => '2026-03-20',
            'supplier_label' => 'Atelier central',
            'documents' => [[
                'kind' => 'invoice',
                'label' => 'Facture',
                'is_present' => true,
            ]],
        ];
    }

    private function visedCommitment(BudgetLine $line, OrganizationUnit $unit, string $object, string $quantity, string $price): string
    {
        $commitmentId = $this->signNeed($line, $unit, $object, $quantity, $price);
        Sanctum::actingAs($this->userWith('expert_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('chef_service_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('directeur_budget'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('controleur_financier'));
        $this->postJson('/api/v1/commitments/'.$commitmentId.'/transitions', ['action' => 'visa'])->assertOk();

        return $commitmentId;
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
     * @return array{0: BudgetLine, 1: OrganizationUnit}
     */
    private function openLine(string $amount): array
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $year->update(['status' => 'execution']);
        FiscalPeriod::query()->where('fiscal_year_id', $year->id)->where('position', 3)->update(['status' => 'open']);

        $organization = OrganizationVersion::query()->firstOrCreate(
            ['code' => 'ORG-LIQ'],
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
        $version = $budgets->createDraft($year, 'LIQ-'.uniqid(), 'Exécutoire');
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

        return [$line->fresh(), $unit];
    }

    private function userWith(string $role): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::query()->where('code', $role)->firstOrFail());

        return $user;
    }
}
