<?php

namespace Tests\Feature;

use App\Domain\Referentials\AuthorizerResolver;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Models\FiscalYear;
use App\Models\NomenclatureItem;
use App\Models\Role;
use App\Models\SystemParameter;
use App\Models\User;
use App\Models\WorkflowDefinition;
use Database\Seeders\ReferentialSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReferentialApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(ReferentialSeeder::class);
    }

    public function test_guest_cannot_read_referentials(): void
    {
        $this->getJson('/api/v1/fiscal-years')
            ->assertUnauthorized()
            ->assertJsonPath('code', 'UNAUTHENTICATED');
    }

    public function test_user_without_permission_is_forbidden(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/fiscal-years')
            ->assertForbidden()
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_fiscal_year_2026_is_in_preparation_with_closed_periods(): void
    {
        $this->actAsAdministrator();

        $this->getJson('/api/v1/fiscal-years')
            ->assertOk()
            ->assertJsonPath('data.0.year', 2026)
            ->assertJsonPath('data.0.status', 'preparation')
            ->assertJsonPath('data.0.currency.code', 'XAF');

        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();

        $this->getJson('/api/v1/fiscal-years/'.$year->id)
            ->assertOk()
            ->assertJsonCount(12, 'data.periods')
            ->assertJsonPath('data.periods.0.status', 'not_opened');
    }

    public function test_nomenclature_shell_contains_no_accounts(): void
    {
        $this->actAsAdministrator();

        $this->getJson('/api/v1/nomenclature-versions')
            ->assertOk()
            ->assertJsonPath('data.0.code', 'NOM-PREP-2026')
            ->assertJsonPath('data.0.items_count', 0);

        $this->assertSame(0, NomenclatureItem::query()->count());
    }

    public function test_threshold_and_sequences_are_exposed_as_integers(): void
    {
        $this->actAsAdministrator();

        $this->getJson('/api/v1/system-parameters')
            ->assertOk()
            ->assertJsonPath('data.0.code', 'ord.authorizer_threshold_xaf')
            ->assertJsonPath('data.0.amount_xaf', '5000000')
            ->assertJsonPath('data.0.version', 1);

        $sequences = $this->getJson('/api/v1/number-sequences')->assertOk()->json('data');
        $eb = collect($sequences)->firstWhere('domain', 'EB');
        $contracts = collect($sequences)->firstWhere('domain', 'CTR');
        $this->assertSame(0, $eb['last_value']);
        $this->assertSame('EB-2026-000001', $eb['next_reference']);
        $this->assertSame(0, $contracts['last_value']);
        $this->assertSame('CTR-2026-000001', $contracts['next_reference']);
    }

    public function test_engagement_workflow_reserves_credit_then_firms_it(): void
    {
        $this->actAsAdministrator();

        $definition = WorkflowDefinition::query()->where('code', 'ENG')->firstOrFail();

        $response = $this->getJson('/api/v1/workflows/'.$definition->id)->assertOk();
        $effects = collect($response->json('data.transitions'))->pluck('effect')->filter()->values()->all();

        $this->assertContains('reserve_credit', $effects);
        $this->assertContains('firm_commitment_and_liq_shell', $effects);
        $this->assertContains('release_reservation', $effects);
    }

    public function test_authorizer_follows_the_inclusive_threshold_and_keeps_history(): void
    {
        $resolver = new AuthorizerResolver;

        $this->assertSame('secretaire_general', $resolver->roleCodeForAmount('5000000'));
        $this->assertSame('secretaire_general', $resolver->roleCodeForAmount('4999999'));
        $this->assertSame('president', $resolver->roleCodeForAmount('5000001'));

        $current = SystemParameter::query()->where('code', 'ord.authorizer_threshold_xaf')->where('version', 1)->firstOrFail();
        $current->update(['status' => 'superseded']);

        SystemParameter::query()->create([
            'code' => 'ord.authorizer_threshold_xaf',
            'version' => 2,
            'amount_xaf' => '10000000',
            'status' => 'active',
            'effective_on' => '2026-06-01',
            'fiscal_year_id' => $current->fiscal_year_id,
            'note' => 'Version de test.',
        ]);

        $this->assertSame('secretaire_general', $resolver->roleCodeForAmount('6000000', '2026-06-01'));
        $this->assertSame('president', $resolver->roleCodeForAmount('10000001', '2026-06-01'));
        $this->assertDatabaseHas('system_parameters', [
            'code' => 'ord.authorizer_threshold_xaf',
            'version' => 1,
            'status' => 'superseded',
        ]);
    }

    public function test_sequence_allocation_is_incremental(): void
    {
        $year = FiscalYear::query()->where('year', 2026)->firstOrFail();
        $allocator = new NumberSequenceAllocator;

        $this->assertSame('EB-2026-000001', $allocator->next('EB', $year));
        $this->assertSame('EB-2026-000002', $allocator->next('EB', $year));
        $this->assertDatabaseHas('number_sequences', [
            'domain' => 'EB',
            'fiscal_year_id' => $year->id,
            'last_value' => 2,
        ]);
    }

    private function actAsAdministrator(): void
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::query()->where('code', 'administrateur')->firstOrFail());
        Sanctum::actingAs($admin);
    }
}
