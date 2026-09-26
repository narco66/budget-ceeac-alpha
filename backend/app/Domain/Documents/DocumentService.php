<?php

namespace App\Domain\Documents;

use App\Exceptions\DocumentRuleException;
use App\Models\GedDocument;
use App\Models\GedDocumentVersion;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public function store(User $author, string $title, string $category, UploadedFile $file): GedDocument
    {
        $contents = $file->getContent();
        $hash = hash('sha256', $contents);
        $document = GedDocument::query()->create([
            'title' => $title,
            'category' => $category,
            'mime' => $file->getMimeType() ?: 'application/octet-stream',
            'byte_size' => strlen($contents),
            'sha256' => $hash,
            'confidentiality' => 'internal',
            'status' => 'draft',
            'author_id' => $author->id,
        ]);
        $this->writeVersion($document, $author, $contents, $hash, 1);

        return $document->refresh();
    }

    public function replace(GedDocument $document, User $author, UploadedFile $file): GedDocument
    {
        $this->assertMutable($document);
        $contents = $file->getContent();
        $hash = hash('sha256', $contents);
        $next = ((int) $document->versions()->max('version_number')) + 1;
        $this->writeVersion($document, $author, $contents, $hash, $next);
        $document->update([
            'mime' => $file->getMimeType() ?: 'application/octet-stream',
            'byte_size' => strlen($contents),
            'sha256' => $hash,
        ]);

        return $document->refresh();
    }

    public function beginOfficial(User $author, string $title, string $category): GedDocument
    {
        return GedDocument::query()->create([
            'title' => $title,
            'category' => $category,
            'mime' => 'application/pdf',
            'byte_size' => 0,
            'sha256' => str_repeat('0', 64),
            'confidentiality' => 'internal',
            'status' => 'draft',
            'author_id' => $author->id,
        ]);
    }

    public function finishOfficial(GedDocument $document, User $author, string $contents): GedDocument
    {
        $hash = hash('sha256', $contents);
        $this->writeVersion($document, $author, $contents, $hash, 1);
        $document->update([
            'byte_size' => strlen($contents),
            'sha256' => $hash,
            'status' => 'sealed',
        ]);

        return $document->refresh();
    }

    public function seal(GedDocument $document): GedDocument
    {
        $this->assertMutable($document);
        $document->update(['status' => 'sealed']);

        return $document->refresh();
    }

    public function discard(GedDocument $document): GedDocument
    {
        $this->assertMutable($document);
        $document->update(['deleted_at' => now()]);

        return $document->refresh();
    }

    private function assertMutable(GedDocument $document): void
    {
        if ($document->deleted_at !== null) {
            throw new DocumentRuleException('Le document est déjà retiré.');
        }
        if ($document->status === 'sealed') {
            throw new DocumentRuleException('Un document scellé ne peut être ni remplacé ni retiré.');
        }
    }

    private function writeVersion(GedDocument $document, User $author, string $contents, string $hash, int $number): void
    {
        $path = 'ged/'.$document->id.'/v'.$number;
        Storage::disk('local')->put($path, $contents);
        GedDocumentVersion::query()->create([
            'ged_document_id' => $document->id,
            'version_number' => $number,
            'sha256' => $hash,
            'byte_size' => strlen($contents),
            'storage_path' => $path,
            'author_id' => $author->id,
        ]);
    }
}
