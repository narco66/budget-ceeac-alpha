<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('legal_name');
            $table->string('name_key');
            $table->string('party_type');
            $table->string('country')->nullable();
            $table->string('tax_identifier')->nullable();
            $table->string('status');
            $table->text('status_reason')->nullable();
            $table->timestamps();
            $table->unique('name_key');
        });

        Schema::create('party_bank_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('party_id')->constrained('parties');
            $table->uuid('supersedes_id')->nullable();
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('status');
            $table->foreignUuid('created_by')->constrained('users');
            $table->foreignUuid('activated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        Schema::table('party_bank_accounts', function (Blueprint $table) {
            $table->foreign('supersedes_id')->references('id')->on('party_bank_accounts')->nullOnDelete();
        });

        Schema::create('procurement_thresholds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('procedure_code');
            $table->decimal('amount_xaf', 20, 0);
            $table->date('effective_on');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('party_id')->constrained('parties');
            $table->foreignUuid('fiscal_year_id')->constrained('fiscal_years');
            $table->string('reference')->unique();
            $table->string('contract_type');
            $table->string('object');
            $table->decimal('amount_xaf', 20, 0);
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('contract_amendments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('contract_id')->constrained('contracts');
            $table->string('direction');
            $table->decimal('amount_xaf', 20, 0);
            $table->text('reason');
            $table->timestamps();
        });

        Schema::create('ged_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('category');
            $table->string('mime');
            $table->unsignedBigInteger('byte_size');
            $table->string('sha256', 64);
            $table->string('confidentiality');
            $table->string('status');
            $table->foreignUuid('author_id')->constrained('users');
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('ged_document_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ged_document_id')->constrained('ged_documents');
            $table->unsignedInteger('version_number');
            $table->string('sha256', 64);
            $table->unsignedBigInteger('byte_size');
            $table->string('storage_path');
            $table->foreignUuid('author_id')->constrained('users');
            $table->timestamps();
            $table->unique(['ged_document_id', 'version_number']);
        });

        Schema::create('inbox_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('task_id')->constrained('tasks');
            $table->string('title');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'task_id']);
        });

        Schema::create('control_findings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('observation');
            $table->string('status');
            $table->foreignUuid('opened_by')->constrained('users');
            $table->foreignUuid('closed_by')->nullable()->constrained('users');
            $table->text('close_reason')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('control_findings');
        Schema::dropIfExists('inbox_notifications');
        Schema::dropIfExists('ged_document_versions');
        Schema::dropIfExists('ged_documents');
        Schema::dropIfExists('contract_amendments');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('procurement_thresholds');
        Schema::dropIfExists('party_bank_accounts');
        Schema::dropIfExists('parties');
    }
};
