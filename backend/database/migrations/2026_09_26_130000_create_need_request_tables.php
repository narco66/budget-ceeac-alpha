<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_instances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_definition_id')->constrained('workflow_definitions');
            $table->string('subject_type');
            $table->uuid('subject_id');
            $table->foreignUuid('current_step_id')->constrained('workflow_steps');
            $table->string('status');
            $table->timestamps();
            $table->index(['subject_type', 'subject_id']);
        });

        Schema::create('workflow_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_instance_id')->constrained('workflow_instances')->cascadeOnDelete();
            $table->foreignUuid('actor_id')->nullable()->constrained('users');
            $table->string('actor_role_code')->nullable();
            $table->string('action');
            $table->foreignUuid('from_step_id')->nullable()->constrained('workflow_steps');
            $table->foreignUuid('to_step_id')->nullable()->constrained('workflow_steps');
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('need_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->foreignUuid('budget_line_id')->constrained('budget_lines');
            $table->foreignUuid('organization_unit_id')->constrained('organization_units');
            $table->uuid('parent_id')->nullable();
            $table->string('reference')->unique();
            $table->unsignedInteger('version_number')->default(1);
            $table->string('circuit_code');
            $table->string('object');
            $table->text('justification');
            $table->decimal('amount_xaf', 20, 0);
            $table->date('need_on');
            $table->string('status');
            $table->foreignUuid('workflow_instance_id')->nullable()->constrained('workflow_instances');
            $table->timestamps();
            $table->index(['fiscal_year_id', 'status', 'organization_unit_id']);
        });

        Schema::table('need_requests', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('need_requests')->nullOnDelete();
        });

        Schema::create('need_request_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('need_request_id')->constrained('need_requests')->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('designation');
            $table->unsignedInteger('quantity');
            $table->string('unit');
            $table->decimal('unit_price_xaf', 20, 0);
            $table->decimal('amount_xaf', 20, 0);
            $table->timestamps();
        });

        Schema::create('need_request_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('need_request_id')->constrained('need_requests')->cascadeOnDelete();
            $table->string('kind');
            $table->string('label');
            $table->boolean('is_present')->default(false);
            $table->timestamps();
        });

        Schema::create('commitments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('need_request_id')->unique()->constrained('need_requests');
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->foreignUuid('budget_line_id')->constrained('budget_lines');
            $table->foreignUuid('organization_unit_id')->constrained('organization_units');
            $table->string('reference')->unique();
            $table->string('status');
            $table->string('circuit_code');
            $table->string('object');
            $table->decimal('amount_xaf', 20, 0);
            $table->timestamps();
        });

        Schema::create('idempotency_keys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->string('aggregate_type');
            $table->uuid('aggregate_id');
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('need_request_id')->constrained('need_requests')->cascadeOnDelete();
            $table->foreignUuid('workflow_instance_id')->constrained('workflow_instances');
            $table->string('assignee_role_code');
            $table->string('title');
            $table->string('status');
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['assignee_role_code', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('idempotency_keys');
        Schema::dropIfExists('commitments');
        Schema::dropIfExists('need_request_documents');
        Schema::dropIfExists('need_request_lines');
        Schema::dropIfExists('need_requests');
        Schema::dropIfExists('workflow_events');
        Schema::dropIfExists('workflow_instances');
    }
};
