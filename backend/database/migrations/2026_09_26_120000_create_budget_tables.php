<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('code');
            $table->string('label');
            $table->string('status');
            $table->timestamp('published_at')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->unique(['fiscal_year_id', 'code']);
        });

        Schema::create('budget_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_version_id')->constrained('budget_versions')->cascadeOnDelete();
            $table->string('nature');
            $table->string('segment');
            $table->string('funding_source');
            $table->string('code');
            $table->string('label');
            $table->decimal('initial_amount_xaf', 20, 0);
            $table->foreignUuid('nomenclature_item_id')->nullable()->constrained('nomenclature_items');
            $table->foreignUuid('organization_unit_id')->nullable()->constrained('organization_units');
            $table->timestamps();
            $table->unique(['budget_version_id', 'code']);
            $table->index(['budget_version_id', 'segment', 'nature']);
        });

        Schema::create('budget_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_line_id')->constrained('budget_lines');
            $table->string('event_type');
            $table->decimal('amount_xaf', 20, 0);
            $table->string('source_type')->nullable();
            $table->uuid('source_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['budget_line_id', 'event_type']);
        });

        Schema::create('budget_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_version_id')->constrained('budget_versions');
            $table->string('reference')->unique();
            $table->string('movement_type');
            $table->string('status');
            $table->text('reason');
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('budget_movement_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_movement_id')->constrained('budget_movements')->cascadeOnDelete();
            $table->foreignUuid('budget_line_id')->constrained('budget_lines');
            $table->string('direction');
            $table->decimal('amount_xaf', 20, 0);
            $table->timestamps();
        });

        Schema::create('budget_import_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('mode');
            $table->string('status');
            $table->json('report');
            $table->foreignUuid('budget_version_id')->nullable()->constrained('budget_versions');
            $table->timestamps();
        });

        Schema::create('stg_budget_lines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('budget_import_batch_id')->constrained('budget_import_batches')->cascadeOnDelete();
            $table->unsignedInteger('row_number');
            $table->string('nature')->nullable();
            $table->string('segment')->nullable();
            $table->string('funding_source')->nullable();
            $table->string('code')->nullable();
            $table->string('label')->nullable();
            $table->string('amount_xaf')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stg_budget_lines');
        Schema::dropIfExists('budget_import_batches');
        Schema::dropIfExists('budget_movement_lines');
        Schema::dropIfExists('budget_movements');
        Schema::dropIfExists('budget_events');
        Schema::dropIfExists('budget_lines');
        Schema::dropIfExists('budget_versions');
    }
};
