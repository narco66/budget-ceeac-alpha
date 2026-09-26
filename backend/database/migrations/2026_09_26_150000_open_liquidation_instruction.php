<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('liquidations', function (Blueprint $table) {
            $table->dropUnique(['commitment_id']);
            $table->index('commitment_id');
            $table->foreignUuid('workflow_instance_id')->nullable()->constrained('workflow_instances');
            $table->unsignedInteger('rank')->default(1);
            $table->decimal('gross_amount_xaf', 20, 0)->default(0);
            $table->decimal('tax_xaf', 20, 0)->default(0);
            $table->decimal('withholding_xaf', 20, 0)->default(0);
            $table->decimal('penalty_xaf', 20, 0)->default(0);
            $table->decimal('advance_xaf', 20, 0)->default(0);
            $table->string('invoice_number')->nullable();
            $table->date('invoice_on')->nullable();
            $table->string('supplier_label')->nullable();
            $table->date('service_done_on')->nullable();
            $table->text('deduction_reason')->nullable();
            $table->text('certification_note')->nullable();
        });

        Schema::create('liquidation_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('liquidation_id')->constrained('liquidations')->cascadeOnDelete();
            $table->string('kind');
            $table->string('label');
            $table->boolean('is_present')->default(false);
            $table->timestamps();
        });

        Schema::create('payment_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('liquidation_id')->unique()->constrained('liquidations');
            $table->foreignUuid('commitment_id')->constrained('commitments');
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('reference')->unique();
            $table->string('status');
            $table->decimal('amount_xaf', 20, 0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
        Schema::dropIfExists('liquidation_documents');

        Schema::table('liquidations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('workflow_instance_id');
            $table->dropColumn([
                'rank',
                'gross_amount_xaf',
                'tax_xaf',
                'withholding_xaf',
                'penalty_xaf',
                'advance_xaf',
                'invoice_number',
                'invoice_on',
                'supplier_label',
                'service_done_on',
                'deduction_reason',
                'certification_note',
            ]);
            $table->dropIndex(['commitment_id']);
            $table->unique('commitment_id');
        });
    }
};
