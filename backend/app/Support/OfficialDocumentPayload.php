<?php

namespace App\Support;

use App\Models\OfficialDocument;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection as SupportCollection;

class OfficialDocumentPayload
{
    /**
     * @param  SupportCollection<int, Model>  $subjects
     */
    public static function preload(SupportCollection $subjects): void
    {
        if ($subjects->isEmpty()) {
            return;
        }

        $type = $subjects->first()::class;
        $grouped = OfficialDocument::query()
            ->where('subject_type', $type)
            ->whereIn('subject_id', $subjects->modelKeys())
            ->with('document')
            ->orderBy('kind')
            ->get()
            ->groupBy('subject_id');

        foreach ($subjects as $subject) {
            $subject->setRelation(
                'preloadedOfficialDocuments',
                $grouped->get($subject->getKey(), new Collection),
            );
        }
    }

    /**
     * @return list<array{kind: string, document_id: string, sha256: string, title: string}>
     */
    public static function for(Model $subject): array
    {
        $rows = $subject->relationLoaded('preloadedOfficialDocuments')
            ? $subject->getRelation('preloadedOfficialDocuments')
            : OfficialDocument::query()
                ->where('subject_type', $subject::class)
                ->where('subject_id', $subject->getKey())
                ->with('document')
                ->orderBy('kind')
                ->get();

        return $rows
            ->map(fn (OfficialDocument $row): array => [
                'kind' => $row->kind,
                'document_id' => $row->ged_document_id,
                'sha256' => (string) $row->document?->sha256,
                'title' => (string) $row->document?->title,
            ])
            ->values()
            ->all();
    }
}
