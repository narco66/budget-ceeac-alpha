<?php

namespace Tests\Feature;

use App\Domain\Budget\BudgetVersionService;
use App\Models\BudgetLine;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\Liquidation;
use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Models\Role;
use App\Models\SystemParameter;
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrdonnancementApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_the_inclusive_threshold_stays_on_the_act_and_accounting_takes_it_over(): void
    {
        $orderId = $this->paymentOrderFor('5000000');

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->getJson('/api/v1/payment-orders/'.$orderId)
            ->assertOk()
            ->assertJsonPath('data.authorizer_role_code', 'secretaire_general')
            ->assertJsonPath('data.threshold_amount_xaf', '5000000')
            ->assertJsonPath('data.threshold_version', 1)
            ->assertJsonPath('data.beneficiary_label', 'Atelier central')
            ->assertJsonPath('data.official_documents', []);

        Sanctum::actingAs($this->userWith('president'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'ORDONNANCEMENT_RULE');

        $current = SystemParameter::query()->where('code', 'ord.authorizer_threshold_xaf')->where('version', 1)->firstOrFail();
        $current->update(['status' => 'superseded']);
        SystemParameter::query()->create([
            'code' => 'ord.authorizer_threshold_xaf',
            'version' => 2,
            'amount_xaf' => '100',
            'status' => 'active',
            'effective_on' => '2026-01-01',
            'fiscal_year_id' => $current->fiscal_year_id,
            'note' => 'Seuil abaissé après constitution de l’acte.',
        ]);

        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertStatus(422);

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $signed = $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->assertJsonPath('data.status', 'transmitted')
            ->assertJsonPath('data.authorizer_role_code', 'secretaire_general')
            ->assertJsonPath('data.threshold_version', 1)
            ->assertJsonPath('data.payments.0.status', 'generated');
        $this->assertStringStartsWith('PAI-2026-', (string) $signed->json('data.payments.0.reference'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])->assertStatus(422);

        Sanctum::actingAs($this->userWith('comptable'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'take'])
            ->assertOk()
            ->assertJsonPath('data.status', 'taken_in_charge')
            ->assertJsonPath('data.payments.0.status', 'in_preparation');
        $this->assertSame(1, Payment::query()->count());
    }

    public function test_one_xaf_above_the_threshold_goes_to_the_president(): void
    {
        $orderId = $this->paymentOrderFor('5000001');

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'ORDONNANCEMENT_RULE');

        Sanctum::actingAs($this->userWith('president'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->assertJsonPath('data.status', 'transmitted')
            ->assertJsonPath('data.authorizer_role_code', 'president')
            ->assertJsonPath('data.official_documents.0.kind', 'ord_ordre');
    }

    public function test_a_reduced_amount_changes_the_authorizer_and_a_partial_cannot_exceed_the_liquidation(): void
    {
        $orderId = $this->paymentOrderFor('5000001');
        $liquidationId = PaymentOrder::query()->findOrFail($orderId)->liquidation_id;

        Sanctum::actingAs($this->userWith('president'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/amount', ['amount_xaf' => '5000000'])
            ->assertOk()
            ->assertJsonPath('data.authorizer_role_code', 'secretaire_general')
            ->assertJsonPath('data.amount_xaf', '5000000')
            ->assertJsonPath('data.remainder_xaf', '1')
            ->assertJsonPath('data.beneficiary_label', 'Atelier central');

        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertStatus(422);

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->assertJsonPath('data.status', 'transmitted');

        $partial = $this->postJson('/api/v1/liquidations/'.$liquidationId.'/payment-orders', [
            'amount_xaf' => '1',
            'idempotency_key' => 'reliquat',
        ])->assertCreated();
        $replay = $this->postJson('/api/v1/liquidations/'.$liquidationId.'/payment-orders', [
            'amount_xaf' => '1',
            'idempotency_key' => 'reliquat',
        ])->assertCreated();
        $this->assertSame($partial->json('data.id'), $replay->json('data.id'));
        $this->assertSame('secretaire_general', $partial->json('data.authorizer_role_code'));

        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/payment-orders', [
            'amount_xaf' => '1',
            'idempotency_key' => 'trop',
        ])->assertStatus(422)->assertJsonPath('code', 'ORDONNANCEMENT_RULE');
    }

    public function test_accounting_rejection_blocks_the_payment_shell(): void
    {
        $orderId = $this->paymentOrderFor('1000');

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', [
            'action' => 'return',
            'reason' => 'Pièce à préciser',
        ])->assertOk()->assertJsonPath('data.status', 'returned');
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'validate'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'ORDONNANCEMENT_RULE');
    }

    public function test_a_signed_order_rejected_by_accounting_blocks_payment(): void
    {
        $orderId = $this->paymentOrderFor('1000');

        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])->assertOk();

        Sanctum::actingAs($this->userWith('comptable'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', [
            'action' => 'reject',
            'reason' => 'Bénéficiaire à confirmer',
        ])->assertOk()
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.payments.0.status', 'blocked');
    }

    private function paymentOrderFor(string $amount): string
    {
        [$line, $unit] = $this->openLine('20000000');
        $commitmentId = $this->visedCommitment($line, $unit, 'Besoin '.$amount, '1', $amount);
        $liquidationId = Liquidation::query()->where('commitment_id', $commitmentId)->firstOrFail()->id;

        Sanctum::actingAs($this->userWith('initiateur'));
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/statement', [
            'gross_amount_xaf' => $amount,
            'tax_xaf' => '0',
            'withholding_xaf' => '0',
            'penalty_xaf' => '0',
            'advance_xaf' => '0',
            'invoice_number' => 'FAC-'.$amount,
            'invoice_on' => '2026-03-20',
            'supplier_label' => 'Atelier central',
            'documents' => [[
                'kind' => 'invoice',
                'label' => 'Facture',
                'is_present' => true,
            ]],
        ])->assertOk();
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
        $this->postJson('/api/v1/liquidations/'.$liquidationId.'/transitions', ['action' => 'visa'])->assertOk();

        return (string) PaymentOrder::query()->where('liquidation_id', $liquidationId)->value('id');
    }

    private function visedCommitment(BudgetLine $line, OrganizationUnit $unit, string $object, string $quantity, string $price): string
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
        $needId = $id;
        $commitmentId = (string) $this->postJson('/api/v1/need-requests/'.$needId.'/transitions', ['action' => 'sign'])
            ->assertOk()
            ->json('data.commitment.id');

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

    /**
     * @return array{0: BudgetLine, 1: OrganizationUnit}
     */
    private function openLine(string $amount): array
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $year->update(['status' => 'execution']);
        FiscalPeriod::query()->where('fiscal_year_id', $year->id)->where('position', 3)->update(['status' => 'open']);

        $organization = OrganizationVersion::query()->firstOrCreate(
            ['code' => 'ORG-ORD'],
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
        $version = $budgets->createDraft($year, 'ORD-'.uniqid(), 'Exécutoire');
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
