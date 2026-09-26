<?php

namespace App\Domain\Documents;

use App\Models\Commitment;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Models\Role;
use App\Models\User;
use App\Models\WorkflowEvent;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Model;

class OfficialPdfRenderer
{
    public function render(string $kind, Model $subject, string $verificationId): string
    {
        $logoPath = resource_path('pdf/logo-ceeac.jpg');
        $logo = is_file($logoPath)
            ? 'data:image/jpeg;base64,'.base64_encode((string) file_get_contents($logoPath))
            : null;

        $sheet = $this->sheet($kind, $subject);

        return Pdf::loadView('pdf.act', [
            'title' => $sheet['title'],
            'reference' => $sheet['reference'],
            'rows' => $sheet['rows'],
            'lines' => $sheet['lines'],
            'pieces' => $sheet['pieces'],
            'decisions' => $this->decisions($subject),
            'verificationId' => $verificationId,
            'logo' => $logo,
        ])->setPaper('a4')->output();
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function sheet(string $kind, Model $subject): array
    {
        return match ($kind) {
            'eb_fiche' => $this->need($subject),
            'eng_bon' => $this->commitment($subject, 'Bon d’engagement'),
            'eng_certificat' => $this->commitment($subject, 'Certificat d’engagement budgétaire'),
            'liq_attestation' => $this->attestation($subject),
            'liq_etat' => $this->liquidation($subject),
            'ord_ordre' => $this->order($subject),
            'pai_avis' => $this->payment($subject),
            default => [
                'title' => $kind,
                'reference' => '',
                'rows' => [],
                'lines' => [],
                'pieces' => [],
            ],
        };
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function need(Model $subject): array
    {
        /** @var NeedRequest $subject */
        $subject->loadMissing(['lines', 'documents', 'organizationUnit', 'fiscalYear']);
        $line = $subject->budgetLine()->first();

        return [
            'title' => 'Fiche d’expression de besoin',
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Objet', 'value' => (string) $subject->object],
                ['label' => 'Structure', 'value' => (string) ($subject->organizationUnit?->name ?? '')],
                ['label' => 'Ligne', 'value' => trim((string) ($line?->code.' '.$line?->label))],
                ['label' => 'Montant', 'value' => $this->xaf($subject->amount_xaf)],
                ['label' => 'Chaîne de programme', 'value' => 'Non importée'],
            ],
            'lines' => $subject->lines->map(fn ($row): string => $row->designation.' — '.$row->quantity.' '.$row->unit.' — '.$this->xaf($row->amount_xaf))->all(),
            'pieces' => $subject->documents->where('is_present', true)->map(fn ($row): string => $row->kind.' — '.$row->label)->values()->all(),
        ];
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function commitment(Model $subject, string $title): array
    {
        /** @var Commitment $subject */
        $subject->loadMissing(['fiscalYear', 'budgetLine', 'needRequest']);

        return [
            'title' => $title,
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Expression de besoin', 'value' => (string) ($subject->needRequest?->reference ?? '')],
                ['label' => 'Objet', 'value' => (string) $subject->object],
                ['label' => 'Ligne', 'value' => trim((string) (($subject->budgetLine?->code ?? '').' '.($subject->budgetLine?->label ?? '')))],
                ['label' => 'Montant engagé', 'value' => $this->xaf($subject->amount_xaf)],
            ],
            'lines' => [],
            'pieces' => [],
        ];
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function attestation(Model $subject): array
    {
        /** @var Liquidation $subject */
        $subject->loadMissing(['commitment', 'fiscalYear']);

        return [
            'title' => 'Attestation de service fait',
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Engagement', 'value' => (string) ($subject->commitment?->reference ?? '')],
                ['label' => 'Fournisseur', 'value' => (string) $subject->supplier_label],
                ['label' => 'Service fait le', 'value' => (string) ($subject->service_done_on?->toDateString() ?? '')],
                ['label' => 'Commentaire', 'value' => (string) $subject->certification_note],
                ['label' => 'Montant net', 'value' => $this->xaf($subject->amount_xaf)],
            ],
            'lines' => [],
            'pieces' => [],
        ];
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function liquidation(Model $subject): array
    {
        /** @var Liquidation $subject */
        $subject->loadMissing(['commitment', 'fiscalYear', 'documents']);

        return [
            'title' => 'État de liquidation',
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Engagement', 'value' => (string) ($subject->commitment?->reference ?? '')],
                ['label' => 'Fournisseur', 'value' => (string) $subject->supplier_label],
                ['label' => 'Facture', 'value' => trim((string) $subject->invoice_number.' '.($subject->invoice_on?->toDateString() ?? ''))],
                ['label' => 'Brut', 'value' => $this->xaf($subject->gross_amount_xaf)],
                ['label' => 'Taxes', 'value' => $this->xaf($subject->tax_xaf)],
                ['label' => 'Retenues', 'value' => $this->xaf($subject->withholding_xaf)],
                ['label' => 'Pénalités', 'value' => $this->xaf($subject->penalty_xaf)],
                ['label' => 'Avances', 'value' => $this->xaf($subject->advance_xaf)],
                ['label' => 'Net', 'value' => $this->xaf($subject->amount_xaf)],
            ],
            'lines' => [],
            'pieces' => $subject->documents->where('is_present', true)->map(fn ($row): string => $row->kind.' — '.$row->label)->values()->all(),
        ];
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function order(Model $subject): array
    {
        /** @var PaymentOrder $subject */
        $subject->loadMissing(['liquidation', 'fiscalYear']);

        return [
            'title' => 'Ordre de paiement',
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Liquidation', 'value' => (string) ($subject->liquidation?->reference ?? '')],
                ['label' => 'Bénéficiaire', 'value' => (string) $subject->beneficiary_label],
                ['label' => 'Montant', 'value' => $this->xaf($subject->amount_xaf)],
                ['label' => 'Ordonnateur', 'value' => (string) $subject->authorizer_role_code],
                ['label' => 'Seuil copié', 'value' => $this->xaf($subject->threshold_amount_xaf).' (version '.(string) $subject->threshold_version.')'],
                ['label' => 'Signé le', 'value' => (string) ($subject->signed_on?->toDateString() ?? '')],
            ],
            'lines' => [],
            'pieces' => [],
        ];
    }

    /**
     * @return array{title: string, reference: string, rows: list<array{label: string, value: string}>, lines: list<string>, pieces: list<string>}
     */
    private function payment(Model $subject): array
    {
        /** @var Payment $subject */
        $subject->loadMissing(['paymentOrder', 'fiscalYear']);

        return [
            'title' => 'Avis de paiement',
            'reference' => (string) $subject->reference,
            'rows' => [
                ['label' => 'Exercice', 'value' => (string) ($subject->fiscalYear?->year ?? '')],
                ['label' => 'Ordre de paiement', 'value' => (string) ($subject->paymentOrder?->reference ?? '')],
                ['label' => 'Bénéficiaire', 'value' => (string) $subject->beneficiary_label],
                ['label' => 'Mode', 'value' => (string) $subject->mode],
                ['label' => 'Instrument', 'value' => (string) $subject->instrument_reference],
                ['label' => 'Date de valeur', 'value' => (string) ($subject->value_on?->toDateString() ?? '')],
                ['label' => 'Montant payé', 'value' => $this->xaf($subject->amount_xaf)],
            ],
            'lines' => [],
            'pieces' => [],
        ];
    }

    /**
     * @return list<string>
     */
    private function decisions(Model $subject): array
    {
        $instanceId = $subject->getAttribute('workflow_instance_id');
        if ($instanceId === null) {
            return [];
        }

        $events = WorkflowEvent::query()
            ->where('workflow_instance_id', $instanceId)
            ->orderBy('created_at')
            ->get();
        $names = User::query()->whereIn('id', $events->pluck('actor_id')->filter())->pluck('name', 'id');
        $roles = Role::query()->whereIn('code', $events->pluck('actor_role_code')->filter())->pluck('name', 'code');

        return $events->map(function (WorkflowEvent $event) use ($names, $roles): string {
            $who = $event->actor_id === null ? 'Système' : (string) ($names[$event->actor_id] ?? '');
            $role = (string) ($roles[$event->actor_role_code] ?? $event->actor_role_code ?? '');

            return trim($event->created_at?->format('Y-m-d H:i').' — '.$event->action.' — '.$role.' — '.$who.' '.($event->reason ?? ''));
        })->all();
    }

    private function xaf(mixed $amount): string
    {
        $digits = preg_replace('/\D/', '', (string) $amount) ?? '';
        $digits = ltrim($digits, '0');
        if ($digits === '') {
            $digits = '0';
        }

        return preg_replace('/\B(?=(\d{3})+(?!\d))/', ' ', $digits).' XAF';
    }
}
