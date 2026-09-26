<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique(['payment_order_id']);
            $table->index('payment_order_id');
            $table->foreignUuid('workflow_instance_id')->nullable()->constrained('workflow_instances');
            $table->unsignedInteger('rank')->default(1);
            $table->string('mode')->nullable();
            $table->string('instrument_reference')->nullable();
            $table->date('value_on')->nullable();
            $table->string('beneficiary_label')->nullable();
        });

        Schema::create('payment_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('kind');
            $table->string('label');
            $table->boolean('is_present')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_documents');

        Schema::table('payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('workflow_instance_id');
            $table->dropColumn(['rank', 'mode', 'instrument_reference', 'value_on', 'beneficiary_label']);
            $table->dropIndex(['payment_order_id']);
            $table->unique('payment_order_id');
        });
    }
};
