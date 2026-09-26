<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('label');
            $table->string('status');
            $table->date('effective_on')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('organization_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_version_id')->constrained('organization_versions')->cascadeOnDelete();
            $table->foreignUuid('parent_id')->nullable()->constrained('organization_units')->nullOnDelete();
            $table->string('code');
            $table->string('name');
            $table->string('unit_type')->nullable();
            $table->unsignedTinyInteger('level')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['organization_version_id', 'code']);
            $table->index(['organization_version_id', 'parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_units');
        Schema::dropIfExists('organization_versions');
    }
};
