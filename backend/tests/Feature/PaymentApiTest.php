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
use App\Models\User;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SodRuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(SodRuleSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_execution_needs_proof_and_partials_stay_within_the_order(): void
    {
        $orderId = $this->signedOrder('10000');
        $paymentId = (string) Payment::query()->where('payment_order_id', $orderId)->value('id');

        Sanctum::actingAs($this->userWith('comptable'));
        $this->postJson('/api/v1/payments/'.$paymentId.'/statement', $this->instrument('virement', 'VIR-1'))
            ->assertStatus(422)
            ->assertJsonPath('code', 'PAYMENT_RULE');

        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'take'])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/statement', ['mode' => 'carte', 'instrument_reference' => 'X', 'value_on' => '2026-03-20'])
            ->assertStatus(422);
        $this->postJson('/api/v1/payments/'.$paymentId.'/statement', $this->instrument('virement', 'VIR-1'))
            ->assertOk()
            ->assertJsonPath('data.mode', 'virement')
            ->assertJsonPath('data.beneficiary_label', 'Atelier central')
            ->assertJsonPath('data.official_documents', []);

        $this->postJson('/api/v1/payments/'.$paymentId.'/amount', ['amount_xaf' => '4000'])
            ->assertOk()
            ->assertJsonPath('data.amount_xaf', '4000')
            ->assertJsonPath('data.remainder_xaf', '6000');

        $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('virement', 'VIR-1'),
            'amount_xaf' => '1000',
            'idempotency_key' => 'doublon',
        ])->assertStatus(422)->assertJsonPath('code', 'PAYMENT_RULE');

        $partial = $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('caisse', 'CAI-1'),
            'amount_xaf' => '6000',
            'idempotency_key' => 'reliquat',
        ])->assertCreated()->assertJsonPath('data.mode', 'caisse');
        $replay = $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('caisse', 'CAI-1'),
            'amount_xaf' => '6000',
            'idempotency_key' => 'reliquat',
        ])->assertCreated();
        $this->assertSame($partial->json('data.id'), $replay->json('data.id'));

        $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('caisse', 'CAI-2'),
            'amount_xaf' => '1',
            'idempotency_key' => 'trop',
        ])->assertStatus(422);

        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('chef_comptable'));
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('agent_comptable'));
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'approve'])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'execute'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'PAYMENT_RULE');
        $this->postJson('/api/v1/payments/'.$paymentId.'/proof', [
            'documents' => [[
                'kind' => 'proof',
                'label' => 'Avis de débit',
                'is_present' => true,
            ]],
        ])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'execute'])
            ->assertOk()
            ->assertJsonPath('data.status', 'executed')
            ->assertJsonPath('data.paid_xaf', '4000')
            ->assertJsonPath('data.remainder_xaf', '0')
            ->assertJsonPath('data.official_documents.0.kind', 'pai_avis');
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'execute'])->assertStatus(422);
    }

    public function test_a_rejected_execution_frees_the_balance_but_keeps_the_instrument_reference(): void
    {
        $orderId = $this->signedOrder('1000');
        $paymentId = (string) Payment::query()->where('payment_order_id', $orderId)->value('id');

        Sanctum::actingAs($this->userWith('comptable'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'take'])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/statement', $this->instrument('cheque', 'CHQ-1'))
            ->assertOk()
            ->assertJsonPath('data.mode', 'cheque');
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('chef_comptable'));
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('agent_comptable'));
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', ['action' => 'approve'])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/proof', [
            'documents' => [[
                'kind' => 'proof',
                'label' => 'Souche',
                'is_present' => true,
            ]],
        ])->assertOk();
        $this->postJson('/api/v1/payments/'.$paymentId.'/transitions', [
            'action' => 'reject',
            'reason' => 'Chèque annulé',
        ])->assertOk()->assertJsonPath('data.status', 'rejected')->assertJsonPath('data.paid_xaf', '0');

        Sanctum::actingAs($this->userWith('comptable'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('cheque', 'CHQ-1'),
            'amount_xaf' => '1000',
            'idempotency_key' => 'meme-cheque',
        ])->assertStatus(422)->assertJsonPath('code', 'PAYMENT_RULE');

        $reissue = $this->postJson('/api/v1/payment-orders/'.$orderId.'/payments', [
            ...$this->instrument('virement', 'VIR-9'),
            'amount_xaf' => '1000',
            'idempotency_key' => 'reemission',
        ])->assertCreated();
        $reissueId = (string) $reissue->json('data.id');
        $this->postJson('/api/v1/payments/'.$reissueId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('chef_comptable'));
        $this->postJson('/api/v1/payments/'.$reissueId.'/transitions', ['action' => 'validate'])->assertOk();
        Sanctum::actingAs($this->userWith('agent_comptable'));
        $this->postJson('/api/v1/payments/'.$reissueId.'/transitions', ['action' => 'approve'])->assertOk();
        $this->postJson('/api/v1/payments/'.$reissueId.'/proof', [
            'documents' => [[
                'kind' => 'proof',
                'label' => 'Avis de débit',
                'is_present' => true,
            ]],
        ])->assertOk();
        $this->postJson('/api/v1/payments/'.$reissueId.'/transitions', ['action' => 'execute'])
            ->assertOk()
            ->assertJsonPath('data.status', 'executed')
            ->assertJsonPath('data.paid_xaf', '1000');
    }

    /**
     * @return array<string, string>
     */
    private function instrument(string $mode, string $reference): array
    {
        return [
            'mode' => $mode,
            'instrument_reference' => $reference,
            'value_on' => '2026-03-20',
        ];
    }

    private function signedOrder(string $amount): string
    {
        $orderId = $this->paymentOrderFor($amount);
        Sanctum::actingAs($this->userWith('secretaire_general'));
        $this->postJson('/api/v1/payment-orders/'.$orderId.'/transitions', ['action' => 'sign'])->assertOk();

        return $orderId;
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
        $commitmentId = (string) $this->postJson('/api/v1/need-requests/'.$id.'/transitions', ['action' => 'sign'])
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
            ['code' => 'ORG-PAI'],
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
        $version = $budgets->createDraft($year, 'PAI-'.uniqid(), 'Exécutoire');
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
