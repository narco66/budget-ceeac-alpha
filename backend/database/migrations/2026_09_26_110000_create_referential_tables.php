<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('name');
            $table->unsignedTinyInteger('minor_units')->default(0);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('fiscal_years', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedSmallInteger('year')->unique();
            $table->string('label');
            $table->string('status');
            $table->foreignUuid('currency_id')->constrained('currencies');
            $table->date('starts_on');
            $table->date('ends_on');
            $table->boolean('is_current')->default(false);
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('fiscal_periods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years')->cascadeOnDelete();
            $table->unsignedTinyInteger('position');
            $table->string('code');
            $table->string('label');
            $table->date('starts_on');
            $table->date('ends_on');
            $table->string('status');
            $table->timestamps();
            $table->unique(['fiscal_year_id', 'position']);
            $table->unique(['fiscal_year_id', 'code']);
        });

        Schema::create('nomenclature_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('code');
            $table->string('label');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['fiscal_year_id', 'code']);
        });

        Schema::create('nomenclature_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('nomenclature_version_id')->constrained('nomenclature_versions')->cascadeOnDelete();
            $table->uuid('parent_id')->nullable();
            $table->string('level');
            $table->string('code');
            $table->string('label');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['nomenclature_version_id', 'code']);
        });

        Schema::table('nomenclature_items', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('nomenclature_items')->nullOnDelete();
        });

        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->unsignedInteger('version');
            $table->string('label');
            $table->string('domain');
            $table->string('variant')->nullable();
            $table->string('status');
            $table->date('effective_on');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['code', 'version']);
        });

        Schema::create('workflow_steps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_definition_id')->constrained('workflow_definitions')->cascadeOnDelete();
            $table->string('code');
            $table->string('label');
            $table->unsignedSmallInteger('position');
            $table->string('actor_kind');
            $table->string('actor_role_code')->nullable();
            $table->unsignedInteger('sla_hours')->nullable();
            $table->timestamps();
            $table->unique(['workflow_definition_id', 'code']);
            $table->unique(['workflow_definition_id', 'position']);
        });

        Schema::create('workflow_transitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workflow_definition_id')->constrained('workflow_definitions')->cascadeOnDelete();
            $table->foreignUuid('from_step_id')->constrained('workflow_steps');
            $table->foreignUuid('to_step_id')->nullable()->constrained('workflow_steps');
            $table->string('action');
            $table->boolean('requires_reason')->default(false);
            $table->string('effect')->nullable();
            $table->timestamps();
            $table->unique(['workflow_definition_id', 'from_step_id', 'action']);
        });

        Schema::create('number_sequences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('domain');
            $table->unsignedBigInteger('last_value')->default(0);
            $table->timestamps();
            $table->unique(['domain', 'fiscal_year_id']);
        });

        Schema::create('system_parameters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->unsignedInteger('version');
            $table->decimal('amount_xaf', 20, 0)->nullable();
            $table->text('text_value')->nullable();
            $table->string('status');
            $table->date('effective_on');
            $table->foreignUuid('fiscal_year_id')->nullable()->constrained('fiscal_years');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['code', 'version']);
            $table->index(['code', 'status', 'effective_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_parameters');
        Schema::dropIfExists('number_sequences');
        Schema::dropIfExists('workflow_transitions');
        Schema::dropIfExists('workflow_steps');
        Schema::dropIfExists('workflow_definitions');
        Schema::dropIfExists('nomenclature_items');
        Schema::dropIfExists('nomenclature_versions');
        Schema::dropIfExists('fiscal_periods');
        Schema::dropIfExists('fiscal_years');
        Schema::dropIfExists('currencies');
    }
};
