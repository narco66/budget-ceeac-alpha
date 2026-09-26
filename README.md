# BUDGET-CEEAC / GESBUDEP

Système intégré de planification, programmation, budgétisation et exécution de la dépense de la Commission de la CEEAC.

La vérité métier est le cahier des charges v5.0 du 26 septembre 2026 (`docs/`). La vérité visuelle est la maquette `docs/FIGMA-BUDGET-CEEAC-V7/`. L’API Laravel est le moteur. PostgreSQL est la base cible.

## État actuel

| Phase | État |
| --- | --- |
| 0 Audit documentaire | Fait — `docs/generated/` |
| 1 Architecture | Fait — mêmes documents |
| 2 Socle d’identité (API) | Fait et testé. PostgreSQL n’est pas encore installé sur ce poste : les tests s’exécutent sur SQLite en mémoire. |
| 3 Frontend de production | Fait. Connexion réelle, menu, états vide et interdit. La maquette Figma n’est pas l’application. |
| 4 Référentiels | Fait pour l’exercice 2026, les circuits, les séquences et le seuil de 5 000 000 XAF. Aucun compte du Budget 2026 n’est chargé. |
| 5 Budget | Moteur en place : versions, journal de soldes, mouvements, import refusé si les totaux de contrôle divergent. Le Budget 2026 n’est pas promu. |
| 6 Expression de besoin | Circuits hors PAP, PAP technique et PAP appui. Sous-lignes contrôlées. Un seul engagement à la validation. Aucun dossier ouvert tant que l’exercice n’est pas exécutoire. |
| 7 Engagement | Instruction budget, réservation au visa du directeur, engagement ferme au visa du contrôleur financier, partiels et dégagement. La liquidation créée n’est pas encore instruite. L’écran local est vide. |
| 8 Liquidation | Décompte, service fait, facture et cumul plafonné par l’engagement net. Le visa ouvre une coquille d’ordonnancement, sans l’instruire. L’écran local est vide. |
| 9 Ordonnancement | Seuil copié sur l’acte, signature du Secrétaire général ou du Président, transmission à l’Agence comptable. La prise en charge ouvre le paiement. L’écran local est vide. |
| 10 Paiement | Virement, chèque ou caisse après prise en charge. Preuve exigée à l’exécution. Un rejet ne compte pas comme payé. L’écran local est vide. |
| 11 Transversal | Tiers, contrats, GED, notifications et observations. Aucun seuil de marché, aucun indicateur GAR/RBM et aucune trésorerie ne sont inventés. Les écrans locaux sont vides. |
| 12 Tableaux de bord | Indicateurs calculés sur les écritures du périmètre. Sans crédit exécutoire, le taux n’est pas calculé. Le Budget 2026 n’est pas recopié. |
| 13 PDF | Fiche EB, bon, certificat, attestation, état de liquidation, ordre de paiement et avis de paiement, scellés une fois dans la GED. |
| 14 Tests globaux | Suite PHPUnit, tests Vitest, et Playwright sur les refus de connexion et les écrans vides. La concurrence parallèle attend PostgreSQL. |
| 15 Optimisation | Index de lecture, listes groupées, en-têtes de sécurité, lien clavier vers le contenu, file pour les notifications. |

Le détail est dans `docs/generated/IMPLEMENTATION_STATUS.md`.

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

Sans PostgreSQL, les tests restent exécutables :

```bash
php artisan test
```

Avec PostgreSQL installé, créer la base `gesbudep`, aligner `DB_*` sur `.env.example`, puis :

```bash
php artisan migrate
php artisan db:seed
php artisan serve
php artisan queue:work
```

`queue:work` délivre les notifications nées des tâches ouvertes. Les échecs restent dans `failed_jobs`. Les actes financiers et leurs PDF ne passent pas par cette file.

Santé : `GET http://localhost:8000/api/v1/health`  
Connexion : `POST http://localhost:8000/api/v1/auth/login` avec `email` et `password`.

## Frontend

```bash
cd frontend
npm install
npm run dev
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
- `docs/generated/WORKFLOWS.md`
- `docs/generated/SECURITY.md`
- `docs/generated/DECISIONS.md`
