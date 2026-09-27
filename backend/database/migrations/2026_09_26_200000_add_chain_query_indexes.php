<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('budget_lines', function (Blueprint $table) {
            $table->index(['nature', 'organization_unit_id']);
        });
        Schema::table('budget_events', function (Blueprint $table) {
            $table->index(['source_type', 'source_id']);
        });
        Schema::table('fiscal_years', function (Blueprint $table) {
            $table->index('is_current');
        });
        Schema::table('need_requests', function (Blueprint $table) {
            $table->index(['organization_unit_id', 'status']);
        });
        Schema::table('commitments', function (Blueprint $table) {
            $table->index(['organization_unit_id', 'status']);
        });
        Schema::table('liquidations', function (Blueprint $table) {
            $table->index('status');
        });
        Schema::table('payment_orders', function (Blueprint $table) {
            $table->index('status');
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->index('status');
        });
        Schema::table('tasks', function (Blueprint $table) {
            $table->index('status');
        });
        Schema::table('ged_documents', function (Blueprint $table) {
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::table('ged_documents', function (Blueprint $table) {
            $table->dropIndex(['deleted_at']);
        });
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('payment_orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('liquidations', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('commitments', function (Blueprint $table) {
            $table->dropIndex(['organization_unit_id', 'status']);
        });
        Schema::table('need_requests', function (Blueprint $table) {
            $table->dropIndex(['organization_unit_id', 'status']);
        });
        Schema::table('fiscal_years', function (Blueprint $table) {
            $table->dropIndex(['is_current']);
        });
        Schema::table('budget_events', function (Blueprint $table) {
            $table->dropIndex(['source_type', 'source_id']);
        });
        Schema::table('budget_lines', function (Blueprint $table) {
            $table->dropIndex(['nature', 'organization_unit_id']);
        });
    }
};
