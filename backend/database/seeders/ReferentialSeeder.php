<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\NomenclatureItem;
use App\Models\NomenclatureVersion;
use App\Models\NumberSequence;
use App\Models\SystemParameter;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Database\Seeder;

class ReferentialSeeder extends Seeder
{
    public function run(): void
    {
        $currency = Currency::query()->updateOrCreate(
            ['code' => 'XAF'],
            [
                'name' => 'Franc CFA (BEAC)',
                'minor_units' => 0,
                'is_default' => true,
            ],
        );

        $year = FiscalYear::query()->updateOrCreate(
            ['year' => 2026],
            [
                'label' => 'Exercice 2026',
                'status' => 'preparation',
                'currency_id' => $currency->id,
                'starts_on' => '2026-01-01',
                'ends_on' => '2026-12-31',
                'is_current' => true,
                'note' => 'Préparation. L’exercice n’est pas exécutoire tant que le budget n’est pas publié.',
            ],
        );

        $this->seedPeriods($year);
        $this->seedNomenclature($year);
        $this->seedSequences($year);
        $this->seedThreshold($year);
        $this->seedWorkflows();
    }

    private function seedPeriods(FiscalYear $year): void
    {
        $months = [
            1 => 'Janvier', 2 => 'Février', 3 => 'Mars', 4 => 'Avril',
            5 => 'Mai', 6 => 'Juin', 7 => 'Juillet', 8 => 'Août',
            9 => 'Septembre', 10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre',
        ];

        foreach ($months as $position => $label) {
            $start = sprintf('2026-%02d-01', $position);
            $end = date('Y-m-t', strtotime($start));

            FiscalPeriod::query()->updateOrCreate(
                ['fiscal_year_id' => $year->id, 'position' => $position],
                [
                    'code' => sprintf('2026-%02d', $position),
                    'label' => $label,
                    'starts_on' => $start,
                    'ends_on' => $end,
                    'status' => 'not_opened',
                ],
            );
        }
    }

    private function seedNomenclature(FiscalYear $year): void
    {
        NomenclatureVersion::query()
            ->where('fiscal_year_id', $year->id)
            ->where('code', 'NOM-PREP-2026')
            ->whereDoesntHave('items')
            ->delete();

        $version = NomenclatureVersion::query()->updateOrCreate(
            ['fiscal_year_id' => $year->id, 'code' => 'NOM-NATURE-2026'],
            [
                'label' => 'Nomenclature budgétaire par nature économique 2026',
                'status' => 'prepared',
                'note' => 'Annexe par nature économique. Les comptes sont classés ; ils ne portent pas les crédits de l’exercice.',
            ],
        );

        $path = database_path('data/nomenclature-nature-2026.json');
        /** @var list<array{level: string, code: string, label: string, parent: string|null}> $items */
        $items = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        $ids = [];

        foreach ($items as $item) {
            $model = NomenclatureItem::query()->updateOrCreate(
                ['nomenclature_version_id' => $version->id, 'code' => $item['code']],
                [
                    'parent_id' => $item['parent'] !== null ? ($ids[$item['parent']] ?? null) : null,
                    'level' => $item['level'],
                    'label' => $item['label'],
                    'is_active' => true,
                ],
            );
            $ids[$item['code']] = $model->id;
        }
    }

    private function seedSequences(FiscalYear $year): void
    {
        foreach (['EB', 'ENG', 'LIQ', 'ORD', 'PAI', 'MOV', 'CTR'] as $domain) {
            NumberSequence::query()->firstOrCreate(
                ['fiscal_year_id' => $year->id, 'domain' => $domain],
                ['last_value' => 0],
            );
        }
    }

    private function seedThreshold(FiscalYear $year): void
    {
        SystemParameter::query()->firstOrCreate(
            ['code' => 'ord.authorizer_threshold_xaf', 'version' => 1],
            [
                'amount_xaf' => '5000000',
                'status' => 'active',
                'effective_on' => '2026-01-01',
                'fiscal_year_id' => $year->id,
                'note' => 'Montant inférieur ou égal : Secrétaire général. Montant strictement supérieur : Président. La valeur est copiée sur l’acte au moment de la signature.',
            ],
        );
    }

    private function seedWorkflows(): void
    {
        $this->circuit('EB-HORS-PAP', 'Expression de besoin hors PAP', 'eb', 'hors_pap', [
            ['brouillon', 'Brouillon', 'role', 'moyens_generaux'],
            ['validation_drhmg', 'Validation DRHMG', 'role', 'drhmg'],
            ['validation_sg', 'Validation du Secrétaire général', 'role', 'secretaire_general'],
            ['approbation', 'Approbation du Président', 'role', 'president'],
            ['cloture', 'Clôture et création de l’engagement', 'system', null],
        ], [
            ['brouillon', 'submit', 'validation_drhmg', false, null],
            ['validation_drhmg', 'validate', 'validation_sg', false, null],
            ['validation_drhmg', 'return', 'brouillon', true, null],
            ['validation_drhmg', 'reject', null, true, null],
            ['validation_sg', 'validate', 'approbation', false, null],
            ['validation_sg', 'return', 'validation_drhmg', true, null],
            ['validation_sg', 'reject', null, true, null],
            ['approbation', 'sign', 'cloture', false, null],
            ['approbation', 'return', 'validation_sg', true, null],
            ['approbation', 'reject', null, true, null],
        ]);

        $this->circuit('EB-PAP-TECHNIQUE', 'Expression de besoin PAP — département technique', 'eb', 'pap_technique', [
            ['brouillon', 'Brouillon', 'role', 'initiateur'],
            ['validation_directeur', 'Validation du directeur', 'role', 'directeur'],
            ['approbation', 'Approbation du commissaire', 'role', 'commissaire'],
            ['cloture', 'Clôture et création de l’engagement', 'system', null],
        ], [
            ['brouillon', 'submit', 'validation_directeur', false, null],
            ['validation_directeur', 'validate', 'approbation', false, null],
            ['validation_directeur', 'return', 'brouillon', true, null],
            ['validation_directeur', 'reject', null, true, null],
            ['approbation', 'sign', 'cloture', false, null],
            ['approbation', 'return', 'validation_directeur', true, null],
            ['approbation', 'reject', null, true, null],
        ]);

        $this->circuit('EB-PAP-APPUI', 'Expression de besoin PAP — département d’appui', 'eb', 'pap_appui', [
            ['brouillon', 'Brouillon', 'role', 'initiateur'],
            ['validation_directeur', 'Validation du directeur', 'role', 'directeur'],
            ['validation_sg', 'Validation du Secrétaire général', 'role', 'secretaire_general'],
            ['cloture', 'Clôture et création de l’engagement', 'system', null],
        ], [
            ['brouillon', 'submit', 'validation_directeur', false, null],
            ['validation_directeur', 'validate', 'validation_sg', false, null],
            ['validation_directeur', 'return', 'brouillon', true, null],
            ['validation_directeur', 'reject', null, true, null],
            ['validation_sg', 'validate', 'cloture', false, null],
            ['validation_sg', 'return', 'validation_directeur', true, null],
            ['validation_sg', 'reject', null, true, null],
        ]);

        $this->circuit('ENG', 'Engagement', 'eng', null, [
            ['genere', 'Généré depuis l’expression de besoin', 'system', null],
            ['instruction', 'Instruction de l’expert budget', 'role', 'expert_budget'],
            ['validation_n1', 'Validation du chef de service budget', 'role', 'chef_service_budget'],
            ['validation_budget', 'Validation du directeur du budget', 'role', 'directeur_budget'],
            ['visa', 'Visa du contrôleur financier', 'role', 'controleur_financier'],
            ['cloture', 'Engagement ferme et coquille de liquidation', 'system', null],
        ], [
            ['genere', 'open', 'instruction', false, null],
            ['instruction', 'validate', 'validation_n1', false, null],
            ['instruction', 'return', 'genere', true, null],
            ['validation_n1', 'validate', 'validation_budget', false, null],
            ['validation_n1', 'return', 'instruction', true, null],
            ['validation_budget', 'validate', 'visa', false, 'reserve_credit'],
            ['validation_budget', 'return', 'validation_n1', true, null],
            ['visa', 'visa', 'cloture', false, 'firm_commitment_and_liq_shell'],
            ['visa', 'return', 'validation_budget', true, 'release_reservation'],
            ['visa', 'reject', null, true, 'release_reservation'],
        ]);

        $this->circuit('LIQ', 'Liquidation', 'liq', null, [
            ['generee', 'Générée', 'system', null],
            ['preparation', 'Préparation du service compétent', 'role', 'initiateur'],
            ['service_fait', 'Certification du service fait', 'role', 'certificateur_service_fait'],
            ['visa', 'Visa du contrôleur financier', 'role', 'controleur_financier'],
            ['cloture', 'Clôture et création de l’ordonnancement', 'system', null],
        ], [
            ['generee', 'open', 'preparation', false, null],
            ['preparation', 'validate', 'service_fait', false, null],
            ['preparation', 'return', 'generee', true, null],
            ['service_fait', 'certify', 'visa', false, null],
            ['service_fait', 'return', 'preparation', true, null],
            ['visa', 'visa', 'cloture', false, 'create_ord'],
            ['visa', 'return', 'service_fait', true, null],
            ['visa', 'reject', null, true, null],
        ]);

        $this->circuit('ORD', 'Ordonnancement', 'ord', null, [
            ['genere', 'Généré depuis la liquidation', 'system', null],
            ['controle', 'Contrôle de préparation administrative', 'pending_assignment', null],
            ['signature', 'Signature de l’ordonnateur selon le seuil', 'threshold', null],
            ['transmission', 'Transmission à l’Agence comptable', 'system', null],
            ['prise_en_charge', 'Prise en charge par l’Agence comptable', 'role', 'comptable'],
        ], [
            ['genere', 'open', 'controle', false, null],
            ['controle', 'validate', 'signature', false, null],
            ['controle', 'return', 'genere', true, null],
            ['signature', 'sign', 'transmission', false, null],
            ['signature', 'return', 'controle', true, null],
            ['transmission', 'transmit', 'prise_en_charge', false, null],
            ['prise_en_charge', 'take', null, false, null],
            ['prise_en_charge', 'reject', null, true, null],
        ]);

        $this->circuit('MOV', 'Mouvement budgétaire', 'mov', null, [
            ['brouillon', 'Brouillon', 'role', 'expert_budget'],
            ['validation', 'Validation du directeur du budget', 'role', 'directeur_budget'],
            ['applique', 'Application au révisé', 'system', null],
        ], [
            ['brouillon', 'submit', 'validation', false, null],
            ['validation', 'validate', 'applique', false, 'apply_to_ledger'],
            ['validation', 'return', 'brouillon', true, null],
            ['validation', 'reject', null, true, null],
        ]);

        $this->circuit('PAI', 'Paiement', 'pai', null, [
            ['prise_en_charge', 'Pris en charge', 'role', 'comptable'],
            ['preparation', 'Préparation du comptable', 'role', 'comptable'],
            ['controle', 'Contrôle du chef comptable', 'role', 'chef_comptable'],
            ['autorisation', 'Autorisation de l’agent comptable', 'role', 'agent_comptable'],
            ['execution', 'Exécution : virement, chèque ou caisse', 'role', 'agent_comptable'],
            ['resultat', 'Résultat d’exécution', 'system', null],
        ], [
            ['prise_en_charge', 'open', 'preparation', false, null],
            ['preparation', 'validate', 'controle', false, null],
            ['preparation', 'return', 'prise_en_charge', true, null],
            ['controle', 'validate', 'autorisation', false, null],
            ['controle', 'return', 'preparation', true, null],
            ['autorisation', 'approve', 'execution', false, null],
            ['autorisation', 'return', 'controle', true, null],
            ['execution', 'execute', 'resultat', false, null],
            ['execution', 'reject', null, true, null],
        ]);
    }

    /**
     * @param  list<array{0: string, 1: string, 2: string, 3: string|null}>  $steps
     * @param  list<array{0: string, 1: string, 2: string|null, 3: bool, 4: string|null}>  $transitions
     */
    private function circuit(string $code, string $label, string $domain, ?string $variant, array $steps, array $transitions): void
    {
        $definition = WorkflowDefinition::query()->updateOrCreate(
            ['code' => $code, 'version' => 1],
            [
                'label' => $label,
                'domain' => $domain,
                'variant' => $variant,
                'status' => 'active',
                'effective_on' => '2026-01-01',
                'note' => 'Circuit du cahier v5.0. Les gardes de montant restent dans le domaine, elles ne sont pas désactivables ici.',
            ],
        );

        $stepIds = [];

        foreach ($steps as $index => [$stepCode, $stepLabel, $actorKind, $roleCode]) {
            $step = WorkflowStep::query()->updateOrCreate(
                ['workflow_definition_id' => $definition->id, 'code' => $stepCode],
                [
                    'label' => $stepLabel,
                    'position' => $index + 1,
                    'actor_kind' => $actorKind,
                    'actor_role_code' => $roleCode,
                    'sla_hours' => null,
                ],
            );
            $stepIds[$stepCode] = $step->id;
        }

        foreach ($transitions as [$from, $action, $to, $requiresReason, $effect]) {
            WorkflowTransition::query()->updateOrCreate(
                [
                    'workflow_definition_id' => $definition->id,
                    'from_step_id' => $stepIds[$from],
                    'action' => $action,
                ],
                [
                    'to_step_id' => $to === null ? null : $stepIds[$to],
                    'requires_reason' => $requiresReason,
                    'effect' => $effect,
                ],
            );
        }
    }
}
