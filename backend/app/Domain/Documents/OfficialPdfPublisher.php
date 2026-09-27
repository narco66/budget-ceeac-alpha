<?php

namespace App\Domain\Documents;

use App\Models\OfficialDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OfficialPdfPublisher
{
    public function __construct(
        private readonly DocumentService $documents,
        private readonly OfficialPdfRenderer $renderer,
    ) {}

    public function publish(User $user, Model $subject, string $kind, string $title): OfficialDocument
    {
        return DB::transaction(function () use ($user, $subject, $kind, $title): OfficialDocument {
            $existing = OfficialDocument::query()
                ->where('subject_type', $subject::class)
                ->where('subject_id', $subject->getKey())
                ->where('kind', $kind)
                ->lockForUpdate()
                ->first();

            if ($existing !== null) {
                return $existing;
            }

            $document = $this->documents->beginOfficial($user, $title, $kind);
            $bytes = $this->renderer->render($kind, $subject, $document->id);
            $this->documents->finishOfficial($document, $user, $bytes);

            return OfficialDocument::query()->create([
                'subject_type' => $subject::class,
                'subject_id' => $subject->getKey(),
                'kind' => $kind,
                'ged_document_id' => $document->id,
            ]);
        });
    }
}
