# Architecture — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Statut :** cible de la phase 1. Le constat du 26 septembre 2026 est dans `FINAL_AUDIT.md`. Les notifications passent par la file. Les PDF officiels restent dans la transaction de l’acte (ADR-024), ils ne sont pas différés.

## 1. Vue d’ensemble

```text
Navigateur
    → frontend/  React + TypeScript + Vite + Tailwind
        → HTTPS  /api/v1
            → backend/  Laravel
                → PostgreSQL  (vérité des données)
                → files d’attente (notifications, PDF, imports, rapports)
                → stockage GED (disque hors racine web, chemin configurable)
```

| Couche | Responsabilité |
| --- | --- |
| React | Présentation, fidélité Figma V7, validation d’ergonomie |
| API Laravel | Contrat, authentification, autorisation, validation, orchestration |
| Domaine | Règles de cumul, workflows, idempotence, numérotation |
| PostgreSQL | Contraintes, clés étrangères, unicité, verrous transactionnels |

Aucune règle de plafond, de seuil ou de séparation des fonctions ne réside seulement dans React.

## 2. Dépôt

```text
/
├── backend/          API Laravel
├── frontend/         SPA React
├── docs/             sources et docs/generated
├── infra/            Docker Compose PostgreSQL, notes d’exploitation
├── scripts/          import contrôlé, vérifications
├── tests/            E2E Playwright (lorsque le parcours existe)
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

## 3. Backend

Organisation par module métier sous `app/Domain` et `app/Modules`, sans contrôleurs obèses.

```text
HTTP Controller
    → Form Request (forme et types)
    → Policy (habilitation, périmètre, SoD)
    → Action / Application Service
        → Domain Rule (plafonds, filiation, période)
        → WorkflowEngine (transition autorisée)
        → Eloquent / requête verrouillée
        → AuditLogger
        → événement de domaine (notification, PDF) après commit
```

Règles d’implémentation :

- Toute écriture financière est dans `DB::transaction`.
- Les lignes de crédit concernées sont verrouillées par `lockForUpdate` avant calcul du disponible.
- Les actions critiques exigent une clé d’idempotence. La contrainte unique `(actor, key)` ou `(aggregate, operation)` rejette le doublon et renvoie le résultat déjà produit.
- Les jobs ne recalculent pas un disponible pour autoriser une dépense. Ils génèrent des documents, des notifications et des rapports.
- Les erreurs API ont la forme `{ success, message, code, errors }` sans trace de pile en production.
- OpenAPI sera généré à partir des routes versionnées.

Modules prévus : Identity, Organization, Planning, Budget, Expenditure (EB, ENG, LIQ, ORD, PAI), ThirdParties, Procurement, Documents, Workflow, Notifications, Control, Reporting, Closing.

## 4. Frontend

```text
src/
├── app/          routeur, providers
├── components/   design system
├── features/     un dossier par module
├── layouts/
├── api/          client HTTP, types de contrat
├── auth/
├── i18n/         français initial
└── assets/       logo CEEAC
```

- TanStack Query pour le cache serveur.
- React Hook Form + Zod pour les formulaires.
- Le refus API 403 s’affiche comme un état « accès interdit », pas comme une page blanche.
- Les montants sont formatés en XAF à partir d’entiers reçus en chaîne JSON (éviter la perte de précision au-delà de `Number.MAX_SAFE_INTEGER` ; les montants CEEAC 2026 tiennent dans la plage sûre, mais le contrat reste une chaîne décimale).

Design tokens repris de la maquette : navy `#0B1C3E`, vert `#1A6B3A`, or `#D4A017`, fond `#F0F4FA`, texte `#1E2A42`.

## 5. Sécurité applicative (résumé)

Détail dans `SECURITY.md`. Points structurants : Sanctum, policies, SoD à l’attribution et à la transition, rate limiting sur l’authentification, fichiers contrôlés par MIME réel et taille, secrets dans `.env`, journal de sécurité, en-têtes HTTP, CORS restreint à l’origine du frontend.

## 6. Observabilité

- Journal applicatif, métier et sécurité séparés par canal Laravel.
- `GET /api/v1/health` : application et base.
- Échecs de jobs visibles pour l’exploitation.
- Corrélation de requête (`X-Request-Id`).

## 7. Environnements

`local`, `development`, `test`, `staging`, `production`. Fichiers `.env` distincts. Jamais de copie de secrets de production. Les jeux de tests financiers fictifs ne sont chargés que si `APP_ENV=testing`.

## 8. Ce que cette architecture ne prétend pas

Elle ne constitue pas, à elle seule, une certification IPSAS, SYSCOHADA ou COSO. Les règles implémentées seront listées dans la documentation de conformité au fur et à mesure. La comptabilité générale complète n’est pas dans le noyau P0.
