<?php

namespace Database\Seeders;

use App\Models\OrganizationUnit;
use App\Models\OrganizationVersion;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        $version = OrganizationVersion::query()->updateOrCreate(
            ['code' => 'ORG-CEEAC-2026-06'],
            [
                'label' => 'Référentiel organisationnel consolidé — juin 2026',
                'status' => 'proposed',
                'effective_on' => '2026-06-01',
                'note' => 'Référentiel de juin 2026, relu sur le PDF consolidé. Les codes restent applicatifs et à valider. Le Secrétariat général remplace le secrétariat administratif.',
            ],
        );

        $rows = [
            ['CEEAC', 'Communauté Économique des États de l’Afrique Centrale', null, 'communaute', 0],
            ['COM-CEEAC', 'Commission de la CEEAC', 'CEEAC', 'commission', 1],
            ['DPRES', 'Présidence de la Commission', 'COM-CEEAC', 'departement_institutionnel', 2],
            ['DPRES-CAB', 'Cabinet du Président', 'DPRES', 'cabinet', 3],
            ['DPRES-CAB-DIRCAB', 'Direction du Cabinet', 'DPRES-CAB', 'direction', 4],
            ['DPRES-CAB-CONS', 'Conseillers du Président', 'DPRES-CAB', 'service', 4],
            ['DPRES-CAB-SCOUR', 'Service Courrier', 'DPRES-CAB', 'service', 4],
            ['DPRES-CAB-BCJ', 'Bureau du Conseiller Juridique', 'DPRES-CAB', 'bureau', 4],
            ['DPRES-BCJ-SCADS', 'Service Conventions, Accords et Documents solennels', 'DPRES-CAB-BCJ', 'service', 5],
            ['DPRES-BCJ-SARC', 'Service Affaires réglementaires et contentieuses', 'DPRES-CAB-BCJ', 'service', 5],
            ['DPRES-ACC', 'Agence Comptable Centrale', 'DPRES', 'structure_rattachee', 3],
            ['DPRES-ACC-SCPT', 'Service Comptabilité', 'DPRES-ACC', 'service', 4],
            ['DPRES-ACC-SCPP', 'Service Comptabilité des projets et programmes', 'DPRES-ACC', 'service', 4],
            ['DPRES-ACC-SRT', 'Service Recouvrement et Trésorerie', 'DPRES-ACC', 'service', 4],
            ['DPRES-AI', 'Audit Interne', 'DPRES', 'structure_rattachee', 3],
            ['DPRES-AI-SAI', 'Service Audit Interne', 'DPRES-AI', 'service', 4],
            ['DPRES-AI-SAPP', 'Service Audit des projets et programmes', 'DPRES-AI', 'service', 4],
            ['DPRES-CFC', 'Contrôle Financier Central', 'DPRES', 'structure_rattachee', 3],
            ['DPRES-CFC-SCF', 'Service Contrôle Financier', 'DPRES-CFC', 'service', 4],
            ['DPRES-CFC-SCFPP', 'Service Contrôle financier des programmes et projets', 'DPRES-CFC', 'service', 4],
            ['DPRES-BL', 'Bureaux de Liaison', 'DPRES', 'structure_rattachee', 3],
            ['DVPRES', 'Vice-Présidence', 'COM-CEEAC', 'departement_institutionnel', 2],
            ['DVPRES-CAB', 'Cabinet du Vice-Président', 'DVPRES', 'cabinet', 3],
            ['DVPRES-CAB-CHCAB', 'Chef de Cabinet', 'DVPRES-CAB', 'bureau', 4],
            ['DVPRES-CAB-CE', 'Chargés d’études', 'DVPRES-CAB', 'service', 4],
            ['DSG', 'Secrétariat Général', 'COM-CEEAC', 'departement_appui', 2],
            ['DSG-DCRPP', 'Direction Communication, Relations publiques et Protocole', 'DSG', 'direction', 3],
            ['DSG-DCRPP-SCRP', 'Service Communication et Relations publiques', 'DSG-DCRPP', 'service', 4],
            ['DSG-DCRPP-CDA', 'Centre de Documentation et des Archives', 'DSG-DCRPP', 'service', 4],
            ['DSG-DCRPP-SPC', 'Service Protocole et Cérémonial', 'DSG-DCRPP', 'service', 4],
            ['DSG-DCRPP-STI', 'Service Traduction et Interprétariat', 'DSG-DCRPP', 'service', 4],
            ['DSG-DCMR', 'Direction Coopération et Mobilisation des ressources', 'DSG', 'direction', 3],
            ['DSG-DCMR-SCOOP', 'Service Coopération', 'DSG-DCMR', 'service', 4],
            ['DSG-DCMR-SMR', 'Service Mobilisation des ressources', 'DSG-DCMR', 'service', 4],
            ['DSG-DPPB', 'Direction Planification, Programmes et Budget', 'DSG', 'direction', 3],
            ['DSG-DPPB-SPSE', 'Service Planification et Suivi-évaluation', 'DSG-DPPB', 'service', 4],
            ['DSG-DPPB-SPP', 'Service Programmes et Projets', 'DSG-DPPB', 'service', 4],
            ['DSG-DPPB-SB', 'Service Budget', 'DSG-DPPB', 'service', 4],
            ['DSG-DRHMG', 'Direction Ressources humaines et Moyens généraux', 'DSG', 'direction', 3],
            ['DSG-DRHMG-SARH', 'Service Administration des ressources humaines', 'DSG-DRHMG', 'service', 4],
            ['DSG-DRHMG-SDRH', 'Service Développement des ressources humaines', 'DSG-DRHMG', 'service', 4],
            ['DSG-DRHMG-SMG', 'Service Moyens généraux', 'DSG-DRHMG', 'service', 4],
            ['DSG-DSI', 'Direction des Systèmes d’information', 'DSG', 'direction', 3],
            ['DSG-DSI-SED', 'Service Études et Développement', 'DSG-DSI', 'service', 4],
            ['DSG-DSI-SEM', 'Service Exploitation et Maintenance', 'DSG-DSI', 'service', 4],
            ['DAPPS', 'Département Affaires politiques, Paix et Sécurité', 'COM-CEEAC', 'departement_technique', 2],
            ['DAPPS-DAP', 'Direction des Affaires politiques', 'DAPPS', 'direction', 3],
            ['DAPPS-DAP-SEGDH', 'Service Élections, Gouvernance démocratique et Droits humains', 'DAPPS-DAP', 'service', 4],
            ['DAPPS-DAP-SMDP', 'Service Médiation et Diplomatie préventive', 'DAPPS-DAP', 'service', 4],
            ['DAPPS-DMARAC', 'Direction MARAC et Sécurité', 'DAPPS', 'direction', 3],
            ['DAPPS-DMARAC-SOBD', 'Service Observation et Banque de données', 'DAPPS-DMARAC', 'service', 4],
            ['DAPPS-DMARAC-SEA', 'Service Évaluation et Analyses', 'DAPPS-DMARAC', 'service', 4],
            ['DAPPS-DMARAC-SSEC', 'Service Sécurité', 'DAPPS-DMARAC', 'service', 4],
            ['DAPPS-EMR', 'État-Major Régional', 'DAPPS', 'structure_rattachee', 3],
            ['DAPPS-EMR-CMIL', 'Composante militaire', 'DAPPS-EMR', 'composante', 4],
            ['DAPPS-EMR-CPG', 'Composante Police/Gendarmerie', 'DAPPS-EMR', 'composante', 4],
            ['DAPPS-EMR-CCIV', 'Composante civile', 'DAPPS-EMR', 'composante', 4],
            ['DAPPS-EMR-CAS', 'Composante Appui et Soutien', 'DAPPS-EMR', 'composante', 4],
            ['DMCAEMF', 'Département Marché commun, Affaires économiques, monétaires et financières', 'COM-CEEAC', 'departement_technique', 2],
            ['DMCAEMF-DAEM', 'Direction des Affaires économiques et monétaires', 'DMCAEMF', 'direction', 3],
            ['DMCAEMF-DAEM-SPEMF', 'Service Politiques économiques, monétaires et fiscales', 'DMCAEMF-DAEM', 'service', 4],
            ['DMCAEMF-DAEM-SIPSP', 'Service Industrie et Promotion du secteur privé', 'DMCAEMF-DAEM', 'service', 4],
            ['DMCAEMF-DPES', 'Direction des Prévisions économiques et des Statistiques', 'DMCAEMF', 'direction', 3],
            ['DMCAEMF-DPES-SAPE', 'Service Analyses et Prévisions économiques', 'DMCAEMF-DPES', 'service', 4],
            ['DMCAEMF-DPES-SGBD', 'Service Gestion des bases de données', 'DMCAEMF-DPES', 'service', 4],
            ['DMCAEMF-DMC', 'Direction du Marché commun', 'DMCAEMF', 'direction', 3],
            ['DMCAEMF-DMC-SADFE', 'Service Affaires douanières et Facilitation des échanges', 'DMCAEMF-DMC', 'service', 4],
            ['DMCAEMF-DMC-SPCCPI', 'Service Politique commerciale, Concurrence et Promotion des investissements', 'DMCAEMF-DMC', 'service', 4],
            ['DMCAEMF-DMC-SLCD', 'Service Libre circulation et Droits d’établissement', 'DMCAEMF-DMC', 'service', 4],
            ['DENRADR', 'Département Environnement, Ressources naturelles, Agriculture et Développement rural', 'COM-CEEAC', 'departement_technique', 2],
            ['DENRADR-DERN', 'Direction Environnement et Ressources naturelles', 'DENRADR', 'direction', 3],
            ['DENRADR-DERN-SGRN', 'Service Gestion des ressources naturelles', 'DENRADR-DERN', 'service', 4],
            ['DENRADR-DERN-SEB', 'Service Environnement et Biodiversité', 'DENRADR-DERN', 'service', 4],
            ['DENRADR-DERN-SGRC', 'Service Gestion des risques et catastrophes', 'DENRADR-DERN', 'service', 4],
            ['DENRADR-DADR', 'Direction Agriculture et Développement rural', 'DENRADR', 'direction', 3],
            ['DENRADR-DADR-SAAN', 'Service Agriculture, Alimentation et Nutrition', 'DENRADR-DADR', 'service', 4],
            ['DENRADR-DADR-SEP', 'Service Élevage et Pêche', 'DENRADR-DADR', 'service', 4],
            ['DENRADR-DADR-SDR', 'Service Développement rural', 'DENRADR-DADR', 'service', 4],
            ['DENRADR-CRCGRE', 'Centre régional de coordination et de gestion des ressources en eau', 'DENRADR', 'centre', 3],
            ['DENRADR-CRCGRE-SGSIE', 'Service Gestion du système d’information sur l’eau', 'DENRADR-CRCGRE', 'service', 4],
            ['DENRADR-CRCGRE-SPRD', 'Service Politiques, Recherche et Développement', 'DENRADR-CRCGRE', 'service', 4],
            ['DATI', 'Département Aménagement du territoire et Infrastructures', 'COM-CEEAC', 'departement_technique', 2],
            ['DATI-DATT', 'Direction Aménagement du territoire et Transports', 'DATI', 'direction', 3],
            ['DATI-DATT-SAT', 'Service Aménagement du territoire', 'DATI-DATT', 'service', 4],
            ['DATI-DATT-STRFF', 'Service Transport routier, ferroviaire et fluvial', 'DATI-DATT', 'service', 4],
            ['DATI-DATT-STAM', 'Service Transport aérien et maritime', 'DATI-DATT', 'service', 4],
            ['DATI-DPTEN', 'Direction Postes, Télécommunications et Économie numérique', 'DATI', 'direction', 3],
            ['DATI-DPTEN-SPT', 'Service Postes et Télécommunications', 'DATI-DPTEN', 'service', 4],
            ['DATI-DPTEN-SEN', 'Service Économie numérique', 'DATI-DPTEN', 'service', 4],
            ['DATI-DENER', 'Direction de l’Énergie', 'DATI', 'direction', 3],
            ['DATI-DENER-SRS', 'Service Réglementation et Statistiques', 'DATI-DENER', 'service', 4],
            ['DATI-DENER-SENR', 'Service Énergies nouvelles et renouvelables', 'DATI-DENER', 'service', 4],
            ['DPGDHS', 'Département Promotion du genre, Développement humain et social', 'COM-CEEAC', 'departement_technique', 2],
            ['DPGDHS-DGPF', 'Direction Genre et Promotion de la femme', 'DPGDHS', 'direction', 3],
            ['DPGDHS-DGPF-SGRC', 'Service Genre et Renforcement des capacités', 'DPGDHS-DGPF', 'service', 4],
            ['DPGDHS-DGPF-SPF', 'Service Promotion de la femme', 'DPGDHS-DGPF', 'service', 4],
            ['DPGDHS-DSAS', 'Direction Santé et Affaires sociales', 'DPGDHS', 'direction', 3],
            ['DPGDHS-DSAS-SS', 'Service Santé', 'DPGDHS-DSAS', 'service', 4],
            ['DPGDHS-DSAS-SAS', 'Service Affaires sociales', 'DPGDHS-DSAS', 'service', 4],
            ['DPGDHS-DJSE', 'Direction Jeunesse, Sports et Emploi', 'DPGDHS', 'direction', 3],
            ['DPGDHS-DJSE-SJS', 'Service Jeunesse et Sports', 'DPGDHS-DJSE', 'service', 4],
            ['DPGDHS-DJSE-SE', 'Service Emploi', 'DPGDHS-DJSE', 'service', 4],
            ['DPGDHS-DECDT', 'Direction Éducation, Culture et Développement technologique', 'DPGDHS', 'direction', 3],
            ['DPGDHS-DECDT-SEDT', 'Service Éducation et Développement technologique', 'DPGDHS-DECDT', 'service', 4],
            ['DPGDHS-DECDT-SC', 'Service Culture', 'DPGDHS-DECDT', 'service', 4],
        ];

        $ids = [];

        foreach ($rows as [$code, $name, $parent, $type, $level]) {
            $unit = OrganizationUnit::query()->updateOrCreate(
                ['organization_version_id' => $version->id, 'code' => $code],
                [
                    'parent_id' => $parent ? $ids[$parent] : null,
                    'name' => $name,
                    'unit_type' => $type,
                    'level' => $level,
                    'is_active' => true,
                ],
            );
            $ids[$code] = $unit->id;
        }
    }
}
