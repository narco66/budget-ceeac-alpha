<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('official_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject_type');
            $table->uuid('subject_id');
            $table->string('kind');
            $table->foreignUuid('ged_document_id')->constrained('ged_documents');
            $table->timestamps();
            $table->unique(['subject_type', 'subject_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('official_documents');
    }
};
