<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commitments', function (Blueprint $table) {
            $table->dropUnique(['need_request_id']);
            $table->index('need_request_id');
            $table->foreignUuid('workflow_instance_id')->nullable()->constrained('workflow_instances');
        });

        Schema::create('liquidations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('commitment_id')->unique()->constrained('commitments');
            $table->foreignUuid('need_request_id')->constrained('need_requests');
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('reference')->unique();
            $table->string('status');
            $table->decimal('amount_xaf', 20, 0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('liquidations');

        Schema::table('commitments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('workflow_instance_id');
            $table->dropIndex(['need_request_id']);
            $table->unique('need_request_id');
        });
    }
};
