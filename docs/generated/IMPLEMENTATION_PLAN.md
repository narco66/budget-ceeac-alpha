# Plan d’implémentation — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Baseline :** cahier des charges v5.0  
**Principe :** une phase n’est pas close tant que le code, les migrations, l’API, le frontend branché, les permissions, les tests et la documentation de la phase ne sont pas au rendez-vous. Les écrans Figma ne comptent pas comme une implémentation.

## 1. Ordre et dépendances

```text
Phase 0 Audit documentaire
    → Phase 1 Architecture
        → Phase 2 Socle backend (auth, RBAC, SoD, audit, API)
            → Phase 3 Socle frontend (design system fidèle à Figma V7)
                → Phase 4 Référentiels (organisation, exercices, nomenclature, workflow)
                    → Phase 5 Budget et PAP (chargement contrôlé du Budget 2026)
                        → Phase 6 EB
                            → Phase 7 ENG
                                → Phase 8 LIQ
                                    → Phase 9 ORD
                                        → Phase 10 PAI
                                            → Phase 11 Transversal (GED, notifications, marchés, S&E, risques, arriérés)
                                                → Phase 12 Tableaux de bord
                                                    → Phase 13 PDF officiels
                                                        → Phase 14 Tests globaux
                                                            → Phase 15 Optimisation
                                                                → Phase 16 Documentation finale et audit
```

La GED minimale, la numérotation, l’audit et le moteur de workflow sont des dépendances de la phase 6 : ils sont donc amorcés dès les phases 2 et 4, puis complétés en phase 11.

## 2. Phases

### Phase 0 — Audit documentaire

- **Statut visé :** DONE après les cinq livrables de `docs/generated/`.
- **Critère :** inventaire, écarts, traçabilité, questions ouvertes, plan.

### Phase 1 — Architecture

Livrables : `ARCHITECTURE.md`, `DATABASE.md`, `DOMAIN_MODEL.md`, `WORKFLOWS.md`, `SECURITY.md`, `DECISIONS.md`.

- Monolithe modulaire Laravel, API `/api/v1`, frontend React séparé.
- Montants en `numeric(20,0)` XAF.
- Workflow piloté par les données.
- PostgreSQL uniquement pour la persistance métier.

### Phase 2 — Socle backend

- Projet `backend/` Laravel (version la plus récente compatible avec PHP 8.3.10 ; cible cahier Laravel 13 si le framework et la version de PHP le permettent).
- Authentification par jeton (Sanctum), verrouillage, historique de connexion, révocation.
- Utilisateurs, rôles, permissions, périmètres structure/exercice.
- Matrice SoD.
- Journal d’audit append-only.
- Réponses JSON normalisées.
- Santé `/api/v1/health`.
- Tests Feature d’authentification et d’interdiction.

**Migrations initiales :** `users`, `roles`, `permissions`, `role_user`, `permission_role`, `organization_units` (amorcée), `audit_events`, `login_histories`, `sod_rules`, `system_parameters`.

### Phase 3 — Socle frontend

- `frontend/` Vite, React, TypeScript strict, Tailwind, React Router, TanStack Query, React Hook Form, Zod.
- Tokens navy / vert CEEAC / or repris de Figma V7.
- Logo `LOGO-CEEAC-CERTO_.jpg`.
- Welcome, connexion, layout sidebar/topbar, états vide/erreur/chargement/interdit.
- Aucune donnée métier en dur hors libellés d’interface.

### Phase 4 — Référentiels

- Import de l’organigramme v1.0 proposée.
- Exercice 2026, périodes, devise XAF.
- Nomenclature (titre, chapitre, article, paragraphe) préparée pour recevoir le Budget 2026.
- Définitions de workflow EB, ENG, LIQ, ORD, PAI.
- Séquences de numérotation.
- Paramètre de seuil d’ordonnancement : 5 000 000 XAF, versionné.

### Phase 5 — Budget

- Versions : préparation, adopté, exécutoire.
- Lignes : fonctionnement / investissement (PAP) / équipement.
- Mouvements (virement, transfert, annulation, ouverture, gel) avec workflow.
- Soldes dérivés des événements, budget initial immuable après publication.
- Import en staging + rapport d’erreurs. Totaux de contrôle documentés dans Q4.
- Tests : plafond, immuabilité, pas de double comptage PAP.

### Phase 6 — Expression de besoin

- CRUD brouillon, sous-lignes, pièces, circuits Hors PAP et PAP.
- Contrôles serveur listés au cahier §8.5.
- Bannière de workflow et tâches.
- Transition finale idempotente vers ENG.
- Tests du circuit et du total des sous-lignes avant de passer à la phase 7.

### Phase 7 — Engagement

Fait : héritage, instruction, réservation au visa du directeur, engagement ferme au visa du contrôleur financier, partiel idempotent, dégagement. Le test de concurrence est séquentiel. La liquidation n’est pas instruite.

### Phase 8 — Liquidation

Fait : service fait, retenues justifiées, facture unique par libellé de fournisseur et exercice, cumul plafonné par l’engagement net, coquille d’ordonnancement au visa. L’ordonnancement n’est pas instruit.

### Phase 9 — Ordonnancement

Fait : seuil copié sur l’acte, signature du Secrétaire général ou du Président, transmission automatique, prise en charge ou rejet. Le paiement n’est pas instruit. Le regroupement de liquidations reste désactivé.

### Phase 10 — Paiement

Fait : préparation, contrôle du chef comptable, autorisation et exécution de l’agent comptable, virement, chèque et caisse, partiel, rejet sans double compte, preuve obligatoire. Le rapprochement bancaire n’est pas ouvert.

### Phase 11 — Transversal

Fait pour les tiers, les contrats, la GED, les notifications et les observations de contrôle. La table des seuils de marchés reste vide. Le suivi-évaluation, le Gantt, la trésorerie et le rapprochement bancaire restent fermés : leurs sources ne sont pas chargées. Le reporting est la phase 12.

### Phase 12 — Tableaux de bord

Fait : indicateurs calculés sur les écritures du périmètre (Commission ou structures affectées), taux entier seulement si le révisé est positif, alertes de crédit épuisé, dossiers en attente. Les exports de rapports et les PDF restent ouverts. L’avancement physique reste absent.

### Phase 13 — PDF

Fiche EB, bon et certificat d’engagement, état de liquidation, ordre de paiement, avis de paiement. Logo, référence, hash, archivage GED.

### Phase 14 — Tests globaux

`php artisan test`, tests frontend, Playwright sur le parcours nominal et les refus. Concurrence.

### Phase 15 — Optimisation

Index, N+1, en-têtes de sécurité, accessibilité clavier, files d’attente.

### Phase 16 — Documentation finale

Mise à jour de tous les documents `docs/generated/`, `FINAL_AUDIT.md`, README opérable.

## 3. Risques

| Risque | Parade |
| --- | --- |
| Volume du cahier traité comme une maquette | Critère de fonctionnalité : UI + API + règle + audit + test |
| Import PDF budgétaire erroné | Staging, totaux de contrôle, aucune écriture silencieuse |
| PostgreSQL manquant | Pas de repli MySQL pour le métier |
| SoD contournable par l’API | Policy sur chaque transition, tests d’appel direct |
| Double soumission | Clé d’idempotence + contrainte unique |
| Surengagement concurrent | Transaction + `lockForUpdate` sur la ligne de crédit |

## 4. Critères de validation d’une phase

```text
code terminé
migrations réversibles autant que possible
API authentifiée et autorisée
frontend connecté lorsqu’un écran est dans le périmètre de la phase
tests de la phase verts
documentation de phase mise à jour
aucun TODO bloquant sur le périmètre annoncé
```

## 5. Hors périmètre assumé tant qu’une décision institutionnelle manque

- Comptabilité générale complète (SYSCOHADA intégral comme livre comptable).
- Signature électronique qualifiée.
- Recouvrement complet des contributions (au-delà du référentiel de prévision).
- Seuils de marchés non fournis.
- Bascule de la maquette Figma en application de production.
