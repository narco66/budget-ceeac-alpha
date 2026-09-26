<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ConcurrencyGapTest extends TestCase
{
    use RefreshDatabase;

    public function test_parallel_credit_lock_is_conclusive_only_on_postgresql(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            $this->markTestSkipped(
                'Le verrou lockForUpdate n’est pas concluant sur '.DB::getDriverName().'. ADR-012 : rejouer la concurrence sur PostgreSQL.',
            );
        }

        $this->assertSame('pgsql', DB::getDriverName());
    }
}
