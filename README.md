# BUDGET-CEEAC / GESBUDEP

Système intégré de planification, programmation, budgétisation et exécution de la dépense de la Commission de la CEEAC.

La vérité métier est le cahier des charges v5.0 du 26 septembre 2026 (`docs/`). La vérité visuelle est la maquette `docs/FIGMA-BUDGET-CEEAC-V7/`. L’API Laravel est le moteur. PostgreSQL est la base cible.

## État actuel

La chaîne de dépense est opérable dans l’API et couverte par les tests. Le dossier numérique retrouve un acte par sa référence et affiche la filiation jusqu’au paiement. L’exercice local est en préparation et aucune ligne du Budget 2026 n’est chargée : les écrans connectés affichent zéro écriture. PostgreSQL n’est pas installé sur ce poste.

Le constat, y compris ce qui reste fermé, est dans `docs/generated/FINAL_AUDIT.md`. Le journal des phases est dans `docs/generated/IMPLEMENTATION_STATUS.md`.

## Prérequis

- PHP 8.3+
- Composer
- PostgreSQL pour l’exploitation (pas encore utilisé par la suite de tests)
- Node.js 22+ pour le frontend

## Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Renseigner dans `.env` un compte technique local, mot de passe d’au moins 12 caractères :

```text
GESBUDEP_ADMIN_EMAIL=admin@ceeac.local
GESBUDEP_ADMIN_PASSWORD=un-mot-de-passe-local
```

Les tests n’ont pas besoin de PostgreSQL. Ils utilisent SQLite en mémoire :

```bash
php artisan test
```

Tant que PostgreSQL n’est pas installé, l’API locale peut démarrer sur un fichier SQLite. Ce n’est pas la base d’exploitation, et MySQL ne la remplace pas. Dans `.env` :

```text
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Créer le fichier s’il n’existe pas, puis :

```bash
php artisan migrate
php artisan db:seed
php artisan serve --host=127.0.0.1 --port=8000
php artisan queue:work
```

Ne pas lancer `migrate:fresh` lorsque cette base contient déjà des données utiles.

Avec PostgreSQL installé, créer la base `budget_ceeac_alpha_db`, aligner `DB_*` sur `.env.example`, puis exécuter les mêmes commandes `migrate`, `db:seed`, `serve` et `queue:work`. Sur cette machine, PostgreSQL 18 écoute sur le port 5433.

`queue:work` délivre les notifications nées des tâches ouvertes. Les échecs restent dans `failed_jobs`. Les actes financiers et leurs PDF ne passent pas par cette file.

Santé : `GET http://localhost:8000/api/v1/health`  
Connexion : `POST http://localhost:8000/api/v1/auth/login` avec `email` et `password`.

## Frontend

```bash
cd frontend
npm install
npx vite --host=127.0.0.1 --port=5173
```

L’interface est servie sur `http://127.0.0.1:5173` et appelle l’API via le préfixe `/api`.

Les tests unitaires et le parcours navigateur, API et Vite déjà lancés :

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

Le parcours connecté lit `GESBUDEP_ADMIN_EMAIL` et `GESBUDEP_ADMIN_PASSWORD` dans `backend/.env`. Ces valeurs ne sont pas écrites dans les tests.

## Documents de pilotage

- `docs/generated/DOCUMENT_INVENTORY.md`
- `docs/generated/GAP_ANALYSIS.md`
- `docs/generated/TRACEABILITY_MATRIX.md`
- `docs/generated/OPEN_QUESTIONS.md`
- `docs/generated/IMPLEMENTATION_PLAN.md`
- `docs/generated/ARCHITECTURE.md`
- `docs/generated/DATABASE.md`
- `docs/generated/DOMAIN_MODEL.md`
- `docs/generated/WORKFLOWS.md`
- `docs/generated/SECURITY.md`
- `docs/generated/DECISIONS.md`
- `docs/generated/FINAL_AUDIT.md`
