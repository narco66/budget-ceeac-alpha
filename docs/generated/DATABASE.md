# Base de données — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Moteur :** PostgreSQL reste la cible. Les migrations existent. Sur ce poste, les tests tournent sur SQLite en mémoire et l’API locale peut tourner sur un fichier SQLite. Cette base n’est pas l’exploitation. Le schéma réel et les écarts sont dans `FINAL_AUDIT.md`.

## 1. Conventions

- Clé primaire UUID (`uuid`), générée par l’application.
- Horodatage `created_at`, `updated_at` en `timestamptz`.
- Acteur : `created_by`, `updated_by` lorsque l’écriture est humaine.
- Suppression : `status` ou `deleted_at` selon le cas. Les actes financiers visés n’ont pas de soft delete qui les ferait disparaître des cumuls ; ils ont un statut `annule` et une contre-écriture.
- Montants : `numeric(20,0)` en XAF.
- Index sur toutes les clés étrangères, sur `(fiscal_year_id, reference)`, et sur les colonnes de filtre des listes (statut, structure, exercice).
- Contraintes `CHECK` sur les statuts connus et sur les montants négatifs interdits hors colonnes explicitement signées (`signed_amount` des contre-passations).

## 2. Identité et contrôle d’accès

| Table | Rôle | Contraintes notables |
| --- | --- | --- |
| `users` | Comptes | email unique, `locked_until`, `password_changed_at` |
| `roles` | Fonctions applicatives | code unique |
| `permissions` | Droits atomiques | code unique |
| `permission_role` | Rattachement | PK composite |
| `role_user` | Affectation datée | `starts_at`, `ends_at`, structure, exercice nullable |
| `sod_rules` | Incompatibilités | paire unique de rôles ou de fonctions |
| `delegations` | Délégation / intérim | dates, délégant, délégataire, périmètre, justificatif |
| `login_histories` | Connexions | append-only côté API |
| `personal_access_tokens` | Jetons Sanctum | révocation par suppression de jeton, journalisée |

## 3. Organisation et calendrier

| Table | Rôle |
| --- | --- |
| `organization_versions` | Version d’organigramme, statut `proposed` / `active` |
| `organization_units` | Structures, `parent_id`, code unique par version, niveau, dates d’effet |
| `positions` | Postes indépendants des personnes |
| `position_assignments` | Titulaire, début, fin |
| `fiscal_years` | Exercice, statut de préparation et d’exécution |
| `fiscal_periods` | Périodes ouvertes ou closes |
| `currencies` | XAF par défaut |

Garde applicative : refus d’un cycle de parenté. Index partiel sur les unités actives.

## 4. Planification et nomenclature

| Table | Rôle |
| --- | --- |
| `program_nodes` | Chaîne GAR/RBM, `node_type`, `parent_id`, version |
| `indicators` | Cible, unité, périodicité, rattachement au nœud |
| `nomenclature_items` | Titre, chapitre, article, paragraphe, code, libellé, parent |

## 5. Budget

| Table | Rôle |
| --- | --- |
| `budget_versions` | Brouillon, arbitrée, publiée, exécutoire. Publiée immuable |
| `budget_lines` | Ligne exécutoire, segment, nomenclature, structure, nœud PAP nullable, montants initial et colonnes de source CEEAC/PTF |
| `budget_movements` | Virement et autres mouvements, justification, statut |
| `budget_movement_lines` | Origine / destination, montant |
| `credit_reservations` | Réservation, échéance, lien ENG |
| `budget_events` | Journal des faits dont les soldes sont reconstituables |

Les soldes affichés sont calculés depuis `budget_events` (ou une vue). Ils ne sont pas une seconde saisie.

Vue prévue `v_budget_line_balances` : initial, mouvements, révisé, réservé, engagé, liquidé, ordonnancé, payé, disponible.

## 6. Chaîne de dépense

| Table | Rôle |
| --- | --- |
| `need_requests` | EB, type, statut, montant, ligne, structure, version |
| `need_request_lines` | Sous-lignes, quantité, unité, prix, montant |
| `commitments` | ENG, lien EB, montant net, statut |
| `commitment_lines` | Ventilation |
| `liquidations` | LIQ, lien ENG, brut, retenues, net |
| `liquidation_lines` | Détail et quantités |
| `payment_orders` | ORD, seuil appliqué, ordonnateur résolu, lien LIQ |
| `payments` | PAI, mode, références bancaires, date de valeur, statut |
| `idempotency_keys` | Clé unique par opération et agrégat, réponse stockée |
| `number_sequences` | Compteur par domaine et exercice, verrouillé à l’usage |

Contraintes d’unicité : référence métier ; `(supplier_id, fiscal_year_id, invoice_number)` lorsque la facture est renseignée ; idempotency key.

## 7. Tiers, marchés, documents, workflow

| Table | Rôle |
| --- | --- |
| `parties` | Fournisseurs, consultants, bénéficiaires |
| `party_bank_accounts` | Historisé, `supersedes_id`, statut |
| `contracts` | Marchés, bons, montants, échéances |
| `contract_amendments` | Avenants |
| `documents` | Métadonnées, module, exercice, confidentialité |
| `document_versions` | Binaire, hash SHA-256, auteur |
| `document_links` | Lien polymorphe vers un dossier |
| `workflow_definitions` | Circuit versionné |
| `workflow_steps` | Étape, fonction attendue, SLA |
| `workflow_transitions` | Action, étape source, étape cible |
| `workflow_instances` | Dossier en cours |
| `workflow_events` | Trace de transition |
| `tasks` | Corbeille « Mes tâches » |
| `notifications` | In-app, dédoublonnage par empreinte d’événement |
| `audit_events` | Append-only |
| `system_parameters` | Seuils et durées, valeur datée |

## 8. Intégrité des cumuls

Les plafonds EB/ENG/LIQ/ORD/PAI sont vérifiés dans la transaction après verrou, puis la contrainte métier est rejouée. Une contrainte SQL d’exclusion totale sur « somme des fils ≤ père » n’est pas exprimable simplement en `CHECK` de ligne : elle est portée par le service et couverte par des tests de concurrence. Les clés étrangères `ON DELETE RESTRICT` empêchent l’orphelinage.

## 9. Index prioritaires

- `budget_lines (fiscal_year_id, segment, organization_unit_id)`
- `need_requests (fiscal_year_id, status, organization_unit_id)`
- `tasks (assignee_id, status, created_at desc)`
- `audit_events (subject_type, subject_id, created_at)`
- `payments (payment_order_id, status)`
- Unique `number_sequences (domain, fiscal_year_id)`

## 10. Import initial

Le Budget 2026 et l’organigramme entrent par des tables de staging (`stg_budget_lines`, `stg_organization_units`) avec rapport d’erreurs. La promotion vers les tables définitives est une transaction explicite, refusée si les totaux de contrôle ne concordent pas (question Q4).
