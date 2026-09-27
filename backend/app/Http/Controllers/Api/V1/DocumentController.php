<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Documents\DocumentService;
use App\Http\Controllers\Controller;
use App\Models\Commitment;
use App\Models\GedDocument;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\OfficialDocument;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

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

    public function file(Request $request, GedDocument $document): Response
    {
        if ($document->deleted_at !== null) {
            return ApiResponse::error('Document retiré.', 'NOT_FOUND', [], 404);
        }

        $official = OfficialDocument::query()->where('ged_document_id', $document->id)->first();
        $permission = $official === null ? 'documents.view' : match ($official->subject_type) {
            NeedRequest::class => 'need_requests.view',
            Commitment::class => 'commitments.view',
            Liquidation::class => 'liquidations.view',
            PaymentOrder::class => 'payment_orders.view',
            Payment::class => 'payments.view',
            default => 'documents.view',
        };

        if (! $request->user()->hasPermission($permission)) {
            throw new AuthorizationException('Action non autorisée.');
        }

        $path = $document->versions()->orderByDesc('version_number')->value('storage_path');
        if ($path === null || ! Storage::disk('local')->exists($path)) {
            return ApiResponse::error('Fichier absent.', 'NOT_FOUND', [], 404);
        }

        return response(Storage::disk('local')->get($path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$document->id.'.pdf"',
        ]);
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
