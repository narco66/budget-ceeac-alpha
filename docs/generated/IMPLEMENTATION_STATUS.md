# État d’implémentation — BUDGET-CEEAC / GESBUDEP

**Dernière mise à jour :** 26 septembre 2026

## Phase 1 — Architecture

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE |
| Fonctions implémentées | Architecture, modèle de domaine, workflows de référence, sécurité, schéma cible, journal des décisions ADR-001 à ADR-012. |
| Fichiers créés | `docs/generated/ARCHITECTURE.md`, `DATABASE.md`, `DOMAIN_MODEL.md`, `WORKFLOWS.md`, `SECURITY.md`, `DECISIONS.md` |
| Migrations | Décrites, pas encore toutes créées |
| Tests | Non applicable à cette phase documentaire |
| Travaux restants | Réalisation dans les phases 2 et suivantes |

## Phase 2 — Socle d’identité API

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le périmètre identité. PostgreSQL d’exploitation : BLOCKED (non installé). |
| Fonctions implémentées | Laravel 13. API `/api/v1` : santé, connexion, déconnexion, révocation des jetons, mot de passe oublié et renouvelé, verrouillage après 5 échecs, rôles et permissions, matrice de séparation des fonctions à l’affectation, consultation de l’organigramme de travail juin 2026, journal d’audit append-only en lecture seule, erreurs JSON normalisées. |
| Fichiers créés | `backend/` (socle), `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md` |
| Migrations | `users` (UUID), jetons Sanctum, rôles, permissions, règles SoD, historique de connexion, `audit_events`, versions et unités d’organisation |
| Tests | `php artisan test` : 17 tests, 17 réussites (SQLite mémoire) |
| Résultats | Les refus d’habilitation, le verrouillage, le conflit ordonnateur/comptable et l’immuabilité du journal sont couverts. |
| Problèmes | Pas d’exécution PostgreSQL. MFA TOTP non branché (colonnes et indicateur `requires_mfa` seulement, question Q10). |
| Décisions | ADR-004, ADR-011, ADR-012 |
| Travaux restants | Installer PostgreSQL et rejouer les migrations. Le frontend et les référentiels hors comptes sont traités dans les phases 3 et 4. |

## Phase 0 — Audit documentaire

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE |
| Fonctions implémentées | Inventaire, écarts, traçabilité initiale, questions ouvertes, plan. Aucun écran ni code métier (conformément à la consigne de démarrage). |
| Fichiers créés | `docs/generated/DOCUMENT_INVENTORY.md`, `GAP_ANALYSIS.md`, `TRACEABILITY_MATRIX.md`, `OPEN_QUESTIONS.md`, `IMPLEMENTATION_PLAN.md`, `IMPLEMENTATION_STATUS.md`, extraits `docs/generated/_extracts/` |
| Fichiers modifiés | Aucun document source |
| Migrations | Aucune |
| Tests | Non applicable |
| Résultats | Cahier v5.0 identifié comme baseline. Figma V7 identifiée comme vérité visuelle. Logo UI : JPEG à fond blanc. Budget 2026 et organigramme identifiés. Application métier absente. PostgreSQL absent du poste. |
| Problèmes | PostgreSQL non installé. Budget 2026 non tabulaire. Codes organisationnels encore « à valider ». |
| Décisions | Voir `OPEN_QUESTIONS.md` (décisions provisoires) et, dès la phase 1, `DECISIONS.md`. |
| Travaux restants | Phases 1 à 16 |

## Phase 3 — Socle frontend

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE |
| Fonctions implémentées | Application React (Vite, TypeScript strict, Tailwind, React Router, TanStack Query, React Hook Form, Zod). Connexion réelle à l’API, jeton de session, menu et barre haute repris de la maquette V7, états vide, erreur, chargement et interdit. Déconnexion qui retire le profil en cache. Aucun compte de démonstration, aucun montant simulé. |
| Fichiers créés | `frontend/` |
| Migrations | Aucune |
| Tests | `npm test` : 4 réussites. `tsc -b` réussi. Parcours navigateur : connexion, organisation (105 structures, singulier « 1 structure »), utilisateurs, journal, module non ouvert, déconnexion, refus de `/app` sans session. |
| Problèmes | PostgreSQL toujours absent. |
| Décisions | ADR-009, ADR-010 |
| Travaux restants | Les modules de la chaîne de dépense restent des écrans d’attente. |

## Phase 4 — Référentiels

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le périmètre hors comptes budgétaires. |
| Fonctions implémentées | Exercice 2026 en préparation, 12 périodes non ouvertes, devise XAF, nomenclature vide prête à recevoir le Budget 2026, circuits EB (hors PAP, PAP technique, PAP appui), ENG, LIQ, ORD et PAI, séquences de références, seuil d’ordonnancement versionné à 5 000 000 XAF. Résolution de l’ordonnateur et allocation de numéro couvertes par des tests. Écran Exercice et circuits branché sur l’API. Le badge d’exercice lit l’exercice courant. |
| Fichiers créés | Migration `2026_09_26_110000_create_referential_tables`, modèles, `ReferentialSeeder`, `ReferentialController`, services `AuthorizerResolver` et `NumberSequenceAllocator`, page `ExercicePage`. |
| Migrations | `currencies`, `fiscal_years`, `fiscal_periods`, `nomenclature_versions`, `nomenclature_items`, `workflow_definitions`, `workflow_steps`, `workflow_transitions`, `number_sequences`, `system_parameters` |
| Tests | `php artisan test` : 25 réussites. Le seuil inclusif 5 000 000 / 5 000 001 et la conservation de la version remplacée sont couverts. La concurrence des séquences n’est pas concluante hors PostgreSQL (ADR-012). |
| Résultats | Aucun compte de nomenclature chargé. Prochaine référence EB : `EB-2026-000001`. |
| Problèmes | PostgreSQL non installé. Étape de préparation administrative de l’ORD sans fonction nommée. |
| Décisions | ADR-003, ADR-008, ADR-013 |
| Travaux restants | Phase 5, import du budget uniquement lorsque les totaux de contrôle sont tenus. |

## Phase 5 — Budget

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le moteur. L’annexe 2026 n’est pas promue. |
| Fonctions implémentées | Versions brouillon, publiée et exécutoire. Lignes par segment fonctionnement, investissement et équipement, sources CEEAC et PTF. Publication qui fige le montant initial et écrit le journal. Mouvements virement, transfert, annulation, ouverture, gel et dégel, avec plafond. Soldes reconstruits depuis les événements. Le gel réduit le disponible sans changer le révisé. Import en staging : le mode officiel 2026 est rejeté si les totaux divergent, et un lot accepté n’est promu qu’en brouillon. |
| Fichiers créés | Migration `2026_09_26_120000_create_budget_tables`, domaine `app/Domain/Budget`, `BudgetController`, page `BudgetPage`. |
| Migrations | `budget_versions`, `budget_lines`, `budget_events`, `budget_movements`, `budget_movement_lines`, `budget_import_batches`, `stg_budget_lines` |
| Tests | `php artisan test` : 33 réussites. Couverture : immuabilité, plafond d’annulation, absence de double comptage du PAP, gel, rejet d’un import déséquilibré, base locale sans ligne officielle. |
| Résultats | L’écran Gestion du budget affiche l’absence de version et les totaux de contrôle comme barrière, pas comme crédits ouverts. |
| Problèmes | Le détail ligne à ligne du PDF 2026 reste inutilisable (Q4, Q5). PostgreSQL toujours absent. |
| Décisions | ADR-003, ADR-006, ADR-013, ADR-014 |
| Travaux restants | Promouvoir l’annexe seulement avec un fichier tabulaire contrôlé. Puis la phase 6, expressions de besoin. |

## Phase 6 — Expression de besoin

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le circuit et la transition vers l’engagement. La fiche PDF reste à la phase documents. |
| Fonctions implémentées | Brouillon rattaché à une ligne exécutoire et à une période ouverte. Circuit hors PAP (moyens généraux, DRHMG, Secrétaire général, Président), PAP technique (initiateur, directeur, commissaire) et PAP appui (initiateur, directeur, Secrétaire général). Le classement n’est pas saisi librement. Sous-lignes : quantité × prix entier = montant, total = montant de l’activité. Pièce de justification obligatoire à la soumission. Le montant de l’expression est comparé au disponible de la ligne. Retour motivé. Bannière d’étape et corbeille de tâches. Validation finale : un seul engagement, ouvert en instruction, même si la génération est rejouée. Nouvelle version après validation, l’ancienne reste figée. |
| Fichiers créés | Migration `2026_09_26_130000_create_need_request_tables`, domaine `app/Domain/Expenditure`, `NeedRequestController`, pages Expressions de besoin et Mes tâches. |
| Migrations | `need_requests`, `need_request_lines`, `need_request_documents`, `commitments`, `workflow_instances`, `workflow_events`, `tasks`, `idempotency_keys` |
| Tests | `php artisan test` : 39 réussites. Circuit hors PAP avec retour, les deux circuits PAP, rejet équipement, dépassement du disponible, idempotence de l’engagement. |
| Résultats | L’écran indique que l’ouverture est impossible : exercice non exécutoire, aucune ligne exécutoire, compte technique sans fonction d’initiation. La corbeille est vide. |
| Problèmes | Chaîne GAR/RBM non importée : elle est affichée comme absente, pas ressaisie. PDF non généré. |
| Décisions | ADR-006, ADR-014, ADR-015 |
| Travaux restants | Aucun sur le circuit EB. La réservation est traitée en phase 7. |

## Phase 7 — Engagement

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour l’instruction, la réservation, le visa ferme, le partiel et le dégagement. Le certificat PDF reste à la phase documents. |
| Fonctions implémentées | L’engagement hérite de l’expression validée et entre en instruction. L’expert peut réduire le montant et ouvrir un engagement partiel dans le reliquat, de façon idempotente. Le directeur du budget réserve le crédit sous verrou de ligne. Le contrôleur financier transforme cette réservation en engagement ferme et crée une liquidation au statut généré, sans la compter comme une dette. Un second visa est refusé. Un refus libère la réservation. Le dégagement, motivé, restitue une partie de l’engagé net. |
| Fichiers créés | Migration `2026_09_26_140000_extend_commitments_for_engagement`, `EngagementService`, `EngagementWorkflow`, `CommitmentController`, page Engagements. |
| Migrations | `commitments.workflow_instance_id`, unicité de l’expression assouplie pour les partiels, table `liquidations` |
| Tests | `php artisan test` : 42 réussites. Couverture : visa unique, réservation qui laisse le reliquat, second dossier refusé, partiel idempotent, refus qui libère, dégagement plafonné. Le verrou est séquentiel : il ne prouve pas à lui seul le comportement de PostgreSQL. |
| Résultats | L’écran Engagements, une fois le droit rechargé, affiche une liste vide. Aucun montant n’est simulé. L’exercice local reste en préparation, donc aucun dossier réel ne peut naître. |
| Problèmes | PDF non généré. Liquidation non instruite. PostgreSQL absent. |
| Décisions | ADR-006, ADR-007, ADR-012, ADR-016 |
| Travaux restants | Aucun sur l’engagement. L’instruction de liquidation est la phase 8. |

## Phase 8 — Liquidation

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le décompte, le service fait, le visa et la coquille d’ordonnancement. L’instruction de l’ordonnancement et les PDF restent ouverts. |
| Fonctions implémentées | La coquille née du visa d’engagement entre en préparation. L’initiateur arrête le brut, les taxes, retenues, pénalités et avances, avec un motif dès qu’un abattement existe. Le net ne peut pas être négatif. Le cumul des liquidations non refusées ne dépasse pas l’engagement net. La facture est unique par numéro, libellé de fournisseur et exercice. Le certificateur atteste le service fait. Le contrôleur financier vise une seule fois : la liquidation devient une dette et une coquille d’ordonnancement est créée, sans circuit. Un refus libère la facture et ne crée pas d’ordre. Un dégagement ne peut pas entamer une liquidation déjà visée. |
| Fichiers créés | Migration `2026_09_26_150000_open_liquidation_instruction`, `LiquidationService`, `LiquidationWorkflow`, `LiquidationController`, page Liquidations. |
| Migrations | Plusieurs liquidations par engagement, pièces, décompte, table `payment_orders` |
| Tests | `php artisan test` : 45 réussites. Couverture : partiel et facture en double, visa unique après dégagement, refus sans ordonnancement. |
| Résultats | L’écran Liquidations est vide : aucun engagement visé n’existe dans la base de travail. Aucun montant n’est simulé. |
| Problèmes | Pas de référentiel des tiers : le fournisseur est un libellé, pas une fiche. Le rapprochement commande-réception-facture et les PDF ne sont pas ouverts. PostgreSQL absent. |
| Décisions | ADR-007, ADR-016, ADR-017 |
| Travaux restants | Aucun sur la liquidation. L’instruction de l’ordonnancement est la phase 9. |

## Phase 9 — Ordonnancement

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour le seuil, la signature, la transmission et la prise en charge. Le circuit de paiement et les PDF restent ouverts. Le regroupement de liquidations reste désactivé (Q9). |
| Fonctions implémentées | La coquille née du visa de liquidation est présentée à l’ordonnateur. Le seuil applicable est copié sur l’acte : Secrétaire général jusqu’à 5 000 000 XAF inclus, Président au-delà. Un seuil publié ensuite ne réécrit pas un acte déjà constitué. Réduire le montant recalcule l’ordonnateur. Le cumul ne dépasse pas la liquidation visée. La signature transmet automatiquement à l’Agence comptable et ouvre une coquille de paiement. La prise en charge la rend prête. Un rejet la bloque. La préparation administrative n’a pas de fonction nommée : le contrôle initial est automatique, et un retour s’y arrête. |
| Fichiers créés | Migration `2026_09_26_160000_open_payment_order_instruction`, `OrdonnancementService`, `OrdonnancementWorkflow`, `PaymentOrderController`, page Ordonnancements. |
| Migrations | Plusieurs ordonnancements par liquidation, seuil copié sur l’acte, table `payments` |
| Tests | `php artisan test` : 50 réussites. Couverture : 5 000 000 et 5 000 001 XAF, seuil historique, partiel, rejet comptable. |
| Résultats | L’écran Ordonnancements est vide : aucune liquidation visée dans la base de travail. Aucun montant n’est simulé. |
| Problèmes | Pas de compte bénéficiaire : le référentiel des tiers n’est pas chargé. PDF non généré. PostgreSQL absent. |
| Décisions | ADR-008, ADR-013, ADR-018 |
| Travaux restants | Aucun sur l’ordonnancement. L’instruction du paiement est la phase 10. |

## Phase 10 — Paiement

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour la préparation, le contrôle, l’autorisation, l’exécution et le rejet. Le rapprochement bancaire et les PDF restent ouverts. |
| Fonctions implémentées | La prise en charge ouvre la préparation. Le comptable choisit le virement, le chèque ou la caisse, avec une référence d’instrument et une date de valeur. Le chef comptable contrôle. L’agent comptable autorise, puis exécute seulement si la preuve est présente. Le cumul des paiements non rejetés ne dépasse pas l’ordre pris en charge. Un rejet d’exécution ne compte pas comme payé et conserve la référence d’instrument. Une réémission utilise une nouvelle référence. Le bénéficiaire est le libellé figé de l’ordonnancement. |
| Fichiers créés | Migration `2026_09_26_170000_open_payment_instruction`, `PaymentService`, `PaymentWorkflow`, `PaymentController`, page Paiements. |
| Migrations | Plusieurs paiements par ordre, mode, référence d’instrument, pièces de preuve |
| Tests | `php artisan test` : 52 réussites. Couverture : preuve obligatoire, partiel, rejet sans double compte, référence d’instrument conservée. |
| Résultats | L’écran Paiements est vide : aucun ordre pris en charge dans la base de travail. Aucun montant n’est simulé. |
| Problèmes | Pas de compte bancaire ni de position de trésorerie : ces référentiels ne sont pas chargés. Aucun plafond de caisse ou de chèque n’est inventé. PDF non généré. PostgreSQL absent. |
| Décisions | ADR-019 |
| Travaux restants | Phase 11 : modules transversaux (GED, notifications, marchés, tiers, suivi-évaluation). |

## Phase 11 — Transversal

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour les tiers, les contrats, la GED, les notifications et les observations. Seuils de marchés, GAR/RBM, trésorerie et rapprochement restent absents. |
| Fonctions implémentées | Fiche tiers unique, doublon de raison sociale refusé, compte bancaire en attente que seule une autre personne peut activer. Contrat rattaché à un tiers actif, avenant qui recalcule le montant révisé, sans dépense liée. Table de seuils de procédure vide et signalée. Document versé avec empreinte SHA-256 ; un document scellé ne se remplace ni ne se retire. Une tâche ouverte notifie les titulaires de la fonction, une fois. Une observation se clôt avec un motif. |
| Fichiers créés | Migration `2026_09_26_180000_create_transversal_tables`, services tiers, contrats, documents, contrôle et notifications, pages Tiers, Marchés, GED, Contrôle, Clôture, Gantt et Suivi-évaluation. |
| Migrations | `parties`, `party_bank_accounts`, `procurement_thresholds`, `contracts`, `contract_amendments`, `ged_documents`, `ged_document_versions`, `inbox_notifications`, `control_findings`. Séquence `CTR`. |
| Tests | `php artisan test` : 57 réussites. Couverture : doublon de tiers, activation par un second utilisateur, avenant, document scellé, notification unique, clôture d’observation. |
| Résultats | Les écrans locaux sont vides. Aucun fournisseur, aucun barème et aucun indicateur ne sont inventés. |
| Problèmes | La facture reste identifiée par le libellé, pas par la fiche tiers. Le suivi-évaluation et le Gantt n’ont pas de chaîne GAR/RBM. Aucun solde de trésorerie. PostgreSQL absent. |
| Décisions | ADR-020 |
| Travaux restants | Phase 12 : tableaux de bord sur les écritures réelles. |

## Phase 12 — Tableaux de bord

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour les indicateurs de la chaîne et le périmètre. Exports de rapports, PDF et avancement physique restent ouverts. |
| Fonctions implémentées | Un même calcul sert l’accueil et le tableau exécutif. Le périmètre est la Commission pour les fonctions transversales, les structures affectées pour les autres, et vide si aucune structure n’est portée. Révisé, réservé, engagé, liquidé visé, ordonnancé, payé et disponible viennent des écritures. Le taux est le quotient entier payé × 100 ÷ révisé, absent si le révisé est nul. Une alerte n’existe que pour un crédit exécutoire dont le disponible est nul. |
| Fichiers créés | `DashboardService`, `DashboardController`, pages Accueil et Tableau exécutif. |
| Migrations | Aucune. |
| Tests | `php artisan test` : 59 réussites. Couverture : exercice vide sans taux, ligne brouillon ignorée, ligne exécutoire visible seulement dans son périmètre. |
| Résultats | L’écran local affiche zéro écriture et refuse de calculer un taux. Le total du Budget 2026 n’est pas recopié. |
| Problèmes | Pas de seuil de proximité paramétré. Pas de chaîne GAR/RBM. PostgreSQL absent. |
| Décisions | ADR-021 |
| Travaux restants | Phase 13 : pièces PDF. |

## Phase 13 — PDF officiels

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour les pièces de la chaîne de dépense. États de clôture, QR et procès-verbal restent ouverts. |
| Fonctions implémentées | Fiche EB à la validation. Bon et certificat d’engagement au visa ferme. Attestation de service fait à la certification. État de liquidation au visa. Ordre de paiement à la signature. Avis de paiement à l’exécution. Chaque fichier est produit une fois, scellé dans la GED, et téléchargeable. L’empreinte SHA-256 est celle des octets archivés. |
| Fichiers créés | Migration `2026_09_26_190000_create_official_documents`, `OfficialPdfPublisher`, `OfficialPdfRenderer`, vue `pdf/act`. |
| Migrations | `official_documents` |
| Tests | `php artisan test` : 59 réussites. Les parcours EB, ENG, LIQ, ORD et PAI vérifient le type de pièce. La fiche EB téléchargée commence par `%PDF` et son empreinte correspond au fichier. |
| Résultats | L’écran local n’affiche aucune pièce : aucun acte n’est validé. Aucun montant n’est simulé dans un PDF. |
| Problèmes | Pas de QR. Pas de procès-verbal, faute de règle d’exigibilité. PostgreSQL absent. |
| Décisions | ADR-022 |
| Travaux restants | Phase 14 : tests globaux. |

## Phase 14 — Tests globaux

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour la suite séquentielle, les tests d’interface unitaires et le parcours Playwright honnête. La concurrence parallèle reste BLOCKED sans PostgreSQL. |
| Fonctions implémentées | Aucune règle métier nouvelle. Les refus d’email et d’identifiants, la déconnexion, et l’absence du total 40 305 795 803 XAF sur les écrans de la chaîne sont rejoués dans un navigateur. Le circuit nominal reste prouvé par PHPUnit, parce que l’exercice local n’est pas exécutoire. |
| Fichiers créés | `frontend/e2e/parcours.spec.ts`, `frontend/playwright.config.ts`, `backend/tests/Feature/ConcurrencyGapTest.php` |
| Migrations | Aucune. |
| Tests | `php artisan test` : 59 réussites, 1 test ignoré, 605 assertions. `npm test` : 4 réussites. `npm run test:e2e` : 2 réussites. |
| Résultats | Un email mal formé est refusé avant l’API. Un mot de passe inconnu reste sur l’accueil. La session locale parcourt l’accueil, le tableau exécutif, la chaîne de dépense et la GED sans afficher le total de l’annexe. La déconnexion ramène à l’accueil. |
| Problèmes | Le test de verrou parallèle est ignoré sur SQLite. Il ne sera concluant qu’une fois rejoué sur PostgreSQL. |
| Décisions | ADR-023 |
| Travaux restants | Phase 15 : optimisation. |

## Phase 15 — Optimisation

| Rubrique | Contenu |
| --- | --- |
| Statut | DONE pour les index, les lectures groupées, les en-têtes, le clavier et la file de notification. Les PDF restent dans la transaction de l’acte. |
| Fonctions implémentées | Index sur les statuts de la chaîne, le périmètre, l’exercice courant, les événements budgétaires d’un acte et les documents retirés. Les listes préchargent les pièces officielles, la dernière trace et les cumuls. Chaque réponse porte les en-têtes de sécurité et un identifiant de corrélation. Le navigateur n’accepte l’API que depuis les origines du frontend. Le premier Tab atteint un lien vers le contenu. Une tâche ouverte dépose une notification dans la file, reprise trois fois. |
| Fichiers créés | Migration `2026_09_26_200000_add_chain_query_indexes`, `SecurityHeaders`, `DeliverTaskNotification`, `ChainListPreloader`, `WorkflowCursor`. |
| Migrations | Index de lecture. Aucune colonne nouvelle. |
| Tests | `php artisan test` : 59 réussites, 1 test ignoré, 615 assertions. Playwright : refus, lien d’évitement, parcours des écrans vides. |
| Résultats | Le circuit financier n’est pas déplacé dans la file. Une notification en échec reste visible dans `failed_jobs`. |
| Problèmes | La file locale est `database`. Sans `php artisan queue:work`, l’inbox n’est pas remplie. Le serveur PHP de ce poste ajoute encore `X-Powered-By` : `expose_php` ne se coupe pas depuis l’application. PostgreSQL reste absent. |
| Décisions | ADR-024 |
| Travaux restants | Phase 16 : documentation finale. |

## Phases suivantes

| Phase | Statut |
| --- | --- |
| 1 Architecture | DONE |
| 2 Socle backend — identité | DONE (PostgreSQL d’exploitation BLOCKED) |
| 3 Socle frontend | DONE |
| 4 Référentiels | DONE pour le calendrier, les circuits, les séquences et le seuil. Comptes budgétaires non chargés (Q4). |
| 5 Budget | DONE pour le moteur, les mouvements et la barrière d’import. Lignes officielles non promues (Q4). |
| 6 EB | DONE pour le circuit, les sous-lignes et l’engagement idempotent. PDF reporté. |
| 7 ENG | DONE pour la réservation, le visa ferme, le partiel et le dégagement. PDF et instruction de liquidation reportés. |
| 8 LIQ | DONE pour le service fait, les retenues, la facture et le cumul. Ordonnancement non instruit. PDF reporté. |
| 9 ORD | DONE pour le seuil, la signature, la transmission et la prise en charge. Paiement non instruit. PDF reporté. |
| 10 PAI | DONE pour les trois modes, la preuve, le partiel et le rejet. Rapprochement et PDF reportés. |
| 11 Modules transversaux | DONE pour les tiers, les contrats, la GED, les notifications et les observations. S&E, Gantt, trésorerie et seuils de marchés non chargés. |
| 12 Tableaux de bord | DONE pour les indicateurs calculés et le périmètre. PDF, exports et avancement physique reportés. |
| 13 PDF | DONE pour les pièces de la chaîne, scellées dans la GED. QR, procès-verbal et états de clôture reportés. |
| 14 Tests globaux | DONE pour PHPUnit, Vitest et Playwright. Concurrence parallèle BLOCKED sans PostgreSQL. |
| 15 Optimisation | DONE pour les index, les lectures groupées, les en-têtes, le clavier et la file de notification. |
| 16 Documentation finale | TODO |
