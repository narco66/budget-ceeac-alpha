<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Documents\DocumentService;
use App\Http\Controllers\Controller;
use App\Models\GedDocument;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function __construct(private readonly DocumentService $documents) {}

    public function index(): JsonResponse
    {
        $rows = GedDocument::query()
            ->whereNull('deleted_at')
            ->orderByDesc('created_at')
            ->get();

        return ApiResponse::success(
            $rows->map(fn (GedDocument $document): array => $this->payload($document))->values(),
            'Documents.',
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:80'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $document = $this->documents->store(
            $request->user(),
            $data['title'],
            $data['category'],
            $data['file'],
        );

        return ApiResponse::success($this->payload($document), 'Document versé.', 201);
    }

    public function replace(Request $request, GedDocument $document): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $document = $this->documents->replace($document, $request->user(), $data['file']);

        return ApiResponse::success($this->payload($document), 'Nouvelle version.');
    }

    public function seal(GedDocument $document): JsonResponse
    {
        $document = $this->documents->seal($document);

        return ApiResponse::success($this->payload($document), 'Document scellé.');
    }

    public function destroy(GedDocument $document): JsonResponse
    {
        $this->documents->discard($document);

        return ApiResponse::success(null, 'Document retiré.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(GedDocument $document): array
    {
        return [
            'id' => $document->id,
            'title' => $document->title,
            'category' => $document->category,
            'mime' => $document->mime,
            'byte_size' => $document->byte_size,
            'sha256' => $document->sha256,
            'confidentiality' => $document->confidentiality,
            'status' => $document->status,
            'official_pdf' => null,
        ];
    }
}
