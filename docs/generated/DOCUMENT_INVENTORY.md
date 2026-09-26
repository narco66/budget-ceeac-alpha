# Inventaire documentaire — BUDGET-CEEAC / GESBUDEP

**Phase :** 0 — Audit documentaire  
**Date :** 26 septembre 2026  
**Périmètre analysé :** `docs/` (récursif) et racine du dépôt  
**Statut du dépôt au moment de l’audit :** aucun code applicatif hors maquette Figma. Pas de `backend/`, `frontend/`, `infra/`, base PostgreSQL, ni dépôt Git initialisé à la racine.

## 1. Méthode

1. Recensement de tous les fichiers sous `docs/`.
2. Lecture structurée du cahier des charges le plus récent (v5.0, 26/09/2026).
3. Lecture des circuits EB, ENG, LIQ, ORD, PAI consolidés dans ce cahier.
4. Extraction texte des PDF institutionnels (référentiel organisationnel, Budget exercice 2026, certificat d’engagement modèle).
5. Inventaire de la maquette `FIGMA-BUDGET-CEEAC-V7` (routes, design tokens, données simulées).
6. Contrôle de l’environnement local : PHP 8.3.10, Composer 2.7.7, Node 22.12.0. PostgreSQL absent du PATH et de `C:\laragon\bin`.

Les extraits de travail des PDF sont conservés dans `docs/generated/_extracts/`. Ils ne remplacent pas les PDF sources.

## 2. Hiérarchie des sources retenue

| Rang | Source | Rôle |
| --- | --- | --- |
| 1 | `docs/Cahier_des_Charges_Fonctionnel_Detaille_BUDGET_CEEAC_GESBUDEP_v5_0_2026-09-26.md` | Vérité fonctionnelle la plus récente. Baseline proposée pour validation, datée du jour de l’audit. |
| 2 | Procédures et descriptions de modules à la racine de `docs/` | Détail métier, subordonné au cahier v5.0 en cas de divergence. |
| 3 | `docs/Referentiel_organisationnel_Commission_CEEAC_2026.pdf` | Organisation cible (document de travail, juin 2026, codes applicatifs à valider). |
| 4 | `docs/BUDGET_EXERCICE_2026_Final.pdf` | Budget officiel de l’exercice 2026 (recettes, dépenses, nomenclature, PAP). |
| 5 | `docs/FIGMA-BUDGET-CEEAC-V7/` | Vérité visuelle. Aucune version V6 n’est présente ; V7 est la maquette la plus récente. |
| 6 | Prompts Figma et cahier v3.0 | Historique de conception. Ils ne priment pas sur le cahier v5.0. |

## 3. Documents maîtres

| Document | Taille | Rôle | Décision |
| --- | --- | --- | --- |
| Cahier des charges v5.0 (26/09/2026) | 110 Ko | Baseline fonctionnelle GESBUDEP, 21 domaines M01–M21, chaînes de dépense, SoD, recette | **Source métier prioritaire** |
| Cahier des charges v3.0 | 89 Ko | Version antérieure, aussi copiée dans les imports Figma | Conservé comme historique. Ne pas implémenter une règle v3 contredite par la v5. |
| Référentiel organisationnel Commission CEEAC 2026 (PDF, 13 p.) | 386 Ko | Organigramme consolidé, codes, règles ORG-001 à ORG-010 | **Source organisationnelle**. Statut : document de travail à valider. |
| Budget exercice 2026 final (PDF, 42 p.) | 900 Ko | Recettes et dépenses 2026, nomenclature, ventilation CEEAC / PTF, piliers PAP | **Source budgétaire**. Pages 1–20 exploitables en texte ; pages 21–42 peu ou pas extractibles (mise en page complexe). |
| Certificat d’engagement ENG-2026-000045 (PDF, 1 p. extraite) | 387 Ko | Modèle d’état officiel (logo, référence, imputation, signataires) | **Modèle PDF**. Sa nomenclature pédagogique (chapitre 2.2.1.2) ne remplace pas les codes du Budget 2026. |
| `docs/logo-ceeac.png` | 1,0 Mo | Emblème circulaire CEEAC-ECCAS, fond noir | Fichier haute résolution. Fond noir inadapté tel quel aux fonds clairs. |
| `FIGMA-BUDGET-CEEAC-V7/src/imports/LOGO-CEEAC-CERTO_.jpg` | 60 Ko | Même emblème, fond blanc, déjà branché sur la sidebar de la maquette | **Logo retenu pour l’interface et les PDF** tant qu’un SVG officiel sur fond transparent n’est pas fourni. |

## 4. Procédures et descriptions de modules

Présentes à la racine de `docs/` et dupliquées dans `FIGMA-BUDGET-CEEAC-V7/src/imports/`.

| Fichier | Sujet |
| --- | --- |
| `BUDGET_CEEAC_Procedure_Detaillee_Expression_de_Besoin_2026.md` | Procédure EB 2026 |
| `Description_d_taill_e_du_module_Expression_de_Besoin__EB____BUDGET-CEEAC___Version_r_vis_e_1_.md` | Module EB révisé |
| `BUDGET-CEEAC___Description_d_taill_e_du_module_2___Pr_paration_et_programmation_budg_taire.md` | Préparation et programmation |
| `Description_d_taill_e_du_module_Planification_Strat_gique___BUDGET-CEEAC.md` | Planification stratégique |
| `Description_d_taill_e_du_module_ENGAGEMENT___BUDGET-CEEAC_1_.md` | Engagement |
| `Description_d_taill_e_du_module_LIQUIDATION___BUDGET-CEEAC.md` et `..._LIQUIDATION_de_BUDGET-CEEAC.md` | Deux rédactions Liquidation |
| `Description_d_taill_e_du_module_ORDONNANCEMENT___BUDGET-CEEAC.md` et `..._ORDONNANCEMENT_de_BUDGET-CEEAC.md` | Deux rédactions Ordonnancement |
| `Description_d_taill_e_du_module_PAIEMENT___BUDGET-CEEAC.md` et `..._PAIEMENT_de_BUDGET-CEEAC.md` | Deux rédactions Paiement |
| `Description_d_taill_e_du_module_SUIVI-_VALUATION___BUDGET-CEEAC.md` et `..._de_BUDGET-CEEAC.md` | Deux rédactions Suivi-évaluation |
| `Description_d_taill_e_du_module_Import__Export_et_Interop_rabilit____BUDGET-CEEAC.md` | Import, export, interopérabilité |
| `BUDGET-CEEAC_Module_17_Cloture_Budgetaire.md` | Clôture budgétaire |

Règle d’arbitrage : le cahier v5.0 intègre et complète ces procédures. En cas de conflit entre deux descriptions du même module, la formulation la plus récente compatible avec le cahier v5.0 l’emporte. Les doublons sont signalés dans `OPEN_QUESTIONS.md` lorsqu’ils ne sont pas déjà tranchés par le cahier.

## 5. Prompts Figma

Douze prompts de refonte sont à la racine de `docs/` (planification, utilisateurs, import/export, Gantt, mise à niveau, tableau exécutif, ENG, LIQ, ORD, PAI, suivi-évaluation). Ce sont des instructions de maquettage, pas des règles métier autonomes.

## 6. Maquette Figma V7

Application React 19 + Vite 8 + Tailwind 4, données simulées (`src/data/mock.ts`, `src/data/audit-mock.ts`). Authentification locale en mémoire, sans API.

Écrans présents dans `src/pages/` :

Welcome, Dashboard, Mes tâches, Tableau de bord exécutif, Référentiels, Planification, Préparation budgétaire, Budget, PAP, EB (liste, formulaire, détail), Engagement, Liquidation, Ordonnancement, Paiement, Tiers, Marchés, Recettes, Projets, Gantt, Suivi-évaluation, Reporting, Clôture, GED, Dossier, Interopérabilité, Contrôle interne, Audit, Journal, Administration, Workflows.

Design system extrait de `src/index.css` :

- Navy institutionnel : `#0B1C3E` (`navy-900`) à `#EDF2FB`
- Vert CEEAC : `#1A6B3A` (`ceeac-700`)
- Or : `#D4A017` (`gold-500`)
- Fond applicatif : `#F0F4FA`
- Texte : `#1E2A42`
- Statuts : brouillon, soumis, en validation, approuvé, retourné, rejeté, clos, critique

Navigation (sidebar) : Accueil, Pilotage exécutif, Référentiels, Planification et budget, Chaîne de dépense, Projets et performance, Documents, Interopérabilité, Contrôle et audit, Administration.

Composants PDF de maquette : `CertificatEngagement`, `FicheEB`, `FicheLiquidation`, `OrdonnancementDoc`, `QuittancePaiement`, `RapportSuivi`, `PDFShell`.

Limites constatées de la maquette :

- aucune persistance, aucun contrôle serveur, aucun workflow réel ;
- routes dupliquées dans `App.tsx` (`tiers`, `marches`, `recettes`, `projets`) ;
- page `MarchesContrats.tsx` présente mais non branchée dans le routeur ( `Marches.tsx` est utilisée) ;
- pas de React Router, TanStack Query, React Hook Form ni Zod.

Décision d’audit du code existant : **CONSERVER** la maquette comme référence visuelle dans `docs/`. **REMPLACER** pour l’application de production : un frontend `frontend/` neuf reprendra les tokens, le logo et la structure d’écrans, branché sur l’API Laravel. Ne pas promouvoir la maquette en application métier.

## 7. Budget officiel 2026 — faits extraits

Montants en XAF, colonne « Prévisions 2026 » de l’annexe :

| Agrégat | Montant 2026 (XAF) |
| --- | --- |
| Total des recettes | 40 305 795 803 |
| Recettes internes (contributions des États) | 26 275 514 803 |
| Recettes externes (dons) | 14 030 281 000 |
| Total des dépenses | 40 305 795 803 |
| Dépenses de fonctionnement | 13 677 514 803 |
| Dépenses d’investissement (dont PAP / programmes PTF) | 25 887 281 000 |
| Dépenses d’équipement | 741 000 000 |

Nomenclature observable (inspirée du plan comptable, pas de la nomenclature simplifiée du certificat modèle) :

- Recettes : `7210` contributions par État membre (72101 Angola … 72111 Tchad), `741` / `7411` dons (BAD, UE, Banque mondiale, ONU, FAO, etc.).
- Dépenses : Titre 1 charges financières (`67`, `671`), Titre 2 personnel (`66`, `661` à `666`), Titre 3 biens et services (`60`, `61`), transferts de fonctionnement, investissement PAP structuré en piliers et axes (`201` Pilier 1, `2011` Axe 1…), équipement.

Le PAP est un segment du budget unique (investissement / programmes), ventilé CEEAC-EM et PTF. Il ne constitue pas une seconde comptabilité.

## 8. Référentiel organisationnel — faits extraits

Architecture de premier niveau (codes applicatifs proposés, à valider) :

| Code | Structure |
| --- | --- |
| CEEAC | Communauté |
| COM-CEEAC | Commission |
| DPRES | Présidence |
| DVPRES | Vice-Présidence |
| DSG | Secrétariat Général (remplace le Secrétariat Administratif) |
| DAPPS | Affaires politiques, Paix et Sécurité |
| DMCAEMF | Marché commun, Affaires économiques, monétaires et financières |
| DENRADR | Environnement, Ressources naturelles, Agriculture et Développement rural |
| DATI | Aménagement du territoire et Infrastructures |
| DPGDHS | Promotion du genre, Développement humain et social |

Structures critiques pour la chaîne de dépense :

- `DSG-DRHMG` Direction Ressources humaines et Moyens généraux, dont `DSG-DRHMG-SMG` Service des Moyens Généraux (initiateur EB Hors PAP).
- `DSG-DPPB` Direction Planification, Programmes et Budget, dont `DSG-DPPB-SB` Service Budget.
- `DPRES-CFC` Contrôle Financier Central.
- `DPRES-ACC` Agence Comptable Centrale (`SCPT`, `SCPP`, `SRT`).
- `DPRES-AI` Audit Interne.
- `DPRES-CAB-BCJ` Bureau du Conseiller Juridique, rattaché au Cabinet du Président.

Le Secrétariat Administratif ne doit pas être réintroduit.

## 9. Règles de chaîne déjà tranchées par le cahier v5.0

Ces règles ne sont pas des questions ouvertes.

**EB Hors PAP :** Service des Moyens Généraux → DRHMG → Secrétaire Général → Ordonnateur principal (Président) lorsque l’étape de signature est prévue → génération idempotente de l’ENG.

**EB PAP département technique :** initiateur → Directeur → Commissaire.

**EB PAP département d’appui :** initiateur → Directeur → Secrétaire Général.

**ENG :** génération depuis EB validée → Expert Budget → Chef de Service Budget → Directeur Budget (réservation de crédit) → visa Contrôleur Financier → ouverture idempotente de la LIQ.

**LIQ :** service fait → visa Contrôleur Financier → génération idempotente de l’ORD. Cumul LIQ ≤ ENG net.

**ORD :** SG si montant ≤ 5 000 000 XAF ; Président si montant > 5 000 000 XAF. Seuil paramétrable et versionné, valeur figée sur l’acte. Après signature : transmission à l’Agence Comptable. Cumul ORD ≤ LIQ validées.

**PAI :** prise en charge ACC → Comptable / Chef Comptable → Agent Comptable → exécution (virement, chèque, caisse). Cumul PAI ≤ ORD pris en charge.

**Contrôles cumulatifs transactionnels :** ENG ≤ disponible ; LIQ ≤ ENG net ; ORD ≤ LIQ ; PAI ≤ ORD pris en charge.

**Monnaie :** XAF. Montants en entiers (centimes non utilisés ; le franc CFA n’a pas de subdivision opérationnelle dans ces documents). Interdiction des flottants binaires.

**Numérotation :** références métier distinctes des clés techniques, modèle observé `ENG-2026-000045`.

## 10. Audit du code et de la base

| Élément | Constat | Décision |
| --- | --- | --- |
| Application Laravel | Absente | À créer dans `backend/` |
| Application React de production | Absente | À créer dans `frontend/` |
| Maquette Figma V7 | Présente, statique | Conserver comme référence visuelle |
| PostgreSQL | Non installé sur ce poste Laragon (MySQL/Redis présents, pas PostgreSQL) | Prérequis d’environnement. Les migrations cibleront PostgreSQL. |
| Git à la racine | Non détecté comme dépôt applicatif | À initialiser seulement sur demande explicite |
| Données budgétaires en base | Aucunes | L’import du Budget 2026 sera un chargement contrôlé, pas une invention de lignes |

## 11. Fichiers hors vérité métier

Les copies sous `FIGMA-BUDGET-CEEAC-V7/src/imports/` reproduisent les mêmes Markdown et PDF. Elles ne constituent pas une seconde source. Toute évolution documentaire se fait sur les fichiers de `docs/` à la racine, pas dans les imports de la maquette.
