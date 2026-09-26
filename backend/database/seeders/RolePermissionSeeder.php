<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'users.view' => 'Consulter les utilisateurs',
            'users.manage' => 'Administrer les utilisateurs et les rôles',
            'audit.view' => 'Consulter le journal d’audit',
            'organization.view' => 'Consulter le référentiel organisationnel',
            'referentials.view' => 'Consulter l’exercice, les circuits et les paramètres',
            'budget.view' => 'Consulter les versions et les soldes budgétaires',
            'budget.manage' => 'Préparer, publier et mouvoir le budget',
            'need_requests.view' => 'Consulter les expressions de besoin',
            'need_requests.manage' => 'Constituer et instruire une expression de besoin',
            'commitments.view' => 'Consulter les engagements',
            'commitments.manage' => 'Instruire, réserver et viser un engagement',
            'liquidations.view' => 'Consulter les liquidations',
            'liquidations.manage' => 'Préparer, certifier et viser une liquidation',
            'payment_orders.view' => 'Consulter les ordonnancements',
            'payment_orders.manage' => 'Signer, transmettre et prendre en charge un ordonnancement',
            'payments.view' => 'Consulter les paiements',
            'payments.manage' => 'Préparer, contrôler et exécuter un paiement',
            'parties.view' => 'Consulter les tiers',
            'parties.manage' => 'Enregistrer un tiers et activer un compte bancaire',
            'contracts.view' => 'Consulter les marchés et contrats',
            'contracts.manage' => 'Ouvrir un contrat et un avenant',
            'documents.view' => 'Consulter la GED',
            'documents.manage' => 'Verser, versionner et sceller un document',
            'findings.view' => 'Consulter les observations de contrôle',
            'findings.manage' => 'Ouvrir et clore une observation',
        ];

        foreach ($permissions as $code => $name) {
            Permission::query()->updateOrCreate(['code' => $code], ['name' => $name]);
        }

        $all = array_keys($permissions);

        $roles = [
            'administrateur' => ['Administrateur technique', true, $all],
            'audit_interne' => ['Audit interne', true, ['users.view', 'audit.view', 'organization.view', 'budget.view', 'need_requests.view', 'commitments.view', 'liquidations.view', 'payment_orders.view', 'payments.view', 'parties.view', 'contracts.view', 'documents.view', 'findings.view']],
            'controle_interne' => ['Contrôle interne', true, ['audit.view', 'organization.view', 'budget.view', 'need_requests.view', 'parties.view', 'contracts.view', 'documents.view', 'findings.view', 'findings.manage']],
            'president' => ['Président, ordonnateur principal', true, ['organization.view', 'budget.view', 'need_requests.view', 'need_requests.manage', 'payment_orders.view', 'payment_orders.manage']],
            'secretaire_general' => ['Secrétaire général', true, ['organization.view', 'budget.view', 'need_requests.view', 'need_requests.manage', 'payment_orders.view', 'payment_orders.manage']],
            'commissaire' => ['Commissaire', true, ['organization.view', 'need_requests.view', 'need_requests.manage']],
            'directeur' => ['Directeur', false, ['organization.view', 'need_requests.view', 'need_requests.manage']],
            'drhmg' => ['Directeur des ressources humaines et des moyens généraux', false, ['organization.view', 'need_requests.view', 'need_requests.manage']],
            'moyens_generaux' => ['Service des moyens généraux', false, ['organization.view', 'need_requests.view', 'need_requests.manage']],
            'directeur_budget' => ['Directeur du budget', true, ['organization.view', 'budget.view', 'budget.manage', 'need_requests.view', 'commitments.view', 'commitments.manage']],
            'chef_service_budget' => ['Chef de service budget', false, ['organization.view', 'budget.view', 'need_requests.view', 'commitments.view', 'commitments.manage']],
            'expert_budget' => ['Expert budget', false, ['organization.view', 'budget.view', 'need_requests.view', 'commitments.view', 'commitments.manage']],
            'controleur_financier' => ['Contrôleur financier', true, ['organization.view', 'budget.view', 'need_requests.view', 'commitments.view', 'commitments.manage', 'liquidations.view', 'liquidations.manage']],
            'certificateur_service_fait' => ['Certificateur du service fait', false, ['organization.view', 'liquidations.view', 'liquidations.manage']],
            'comptable' => ['Comptable', true, ['organization.view', 'payment_orders.view', 'payment_orders.manage', 'payments.view', 'payments.manage']],
            'chef_comptable' => ['Chef comptable', true, ['organization.view', 'payments.view', 'payments.manage', 'parties.view', 'parties.manage']],
            'agent_comptable' => ['Agent comptable', true, ['organization.view', 'payments.view', 'payments.manage']],
            'initiateur' => ['Initiateur', false, ['organization.view', 'need_requests.view', 'need_requests.manage', 'liquidations.view', 'liquidations.manage']],
        ];

        foreach ($roles as $code => [$name, $requiresMfa, $granted]) {
            $role = Role::query()->updateOrCreate(
                ['code' => $code],
                ['name' => $name, 'requires_mfa' => $requiresMfa, 'description' => $name],
            );

            $granted = array_values(array_unique([...$granted, 'referentials.view']));

            $role->permissions()->sync(
                Permission::query()->whereIn('code', $granted)->pluck('id'),
            );
        }
    }
}
