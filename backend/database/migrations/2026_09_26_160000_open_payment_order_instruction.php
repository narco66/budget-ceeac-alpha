<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_orders', function (Blueprint $table) {
            $table->dropUnique(['liquidation_id']);
            $table->index('liquidation_id');
            $table->foreignUuid('workflow_instance_id')->nullable()->constrained('workflow_instances');
            $table->unsignedInteger('rank')->default(1);
            $table->string('beneficiary_label')->nullable();
            $table->string('authorizer_role_code')->nullable();
            $table->decimal('threshold_amount_xaf', 20, 0)->nullable();
            $table->unsignedInteger('threshold_version')->nullable();
            $table->date('signed_on')->nullable();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('payment_order_id')->unique()->constrained('payment_orders');
            $table->foreignUuid('liquidation_id')->constrained('liquidations');
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
        Schema::dropIfExists('payments');

        Schema::table('payment_orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('workflow_instance_id');
            $table->dropColumn([
                'rank',
                'beneficiary_label',
                'authorizer_role_code',
                'threshold_amount_xaf',
                'threshold_version',
                'signed_on',
            ]);
            $table->dropIndex(['liquidation_id']);
            $table->unique('liquidation_id');
        });
    }
};
