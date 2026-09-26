# Journal des décisions — BUDGET-CEEAC / GESBUDEP

## ADR-001 — Séparation Laravel / React

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Où vit l’interface ? |
| Options | Blade ; Inertia ; SPA React séparée |
| Décision | SPA React dans `frontend/`, API Laravel dans `backend/`. La maquette Figma reste dans `docs/` comme référence visuelle. |
| Motif | Cahier v5.0 et instruction d’architecture : aucune logique métier critique dans le frontend, pas de mélange Blade pour les fonctions principales. |
| Impact | CORS, authentification par jeton, deux builds. |

## ADR-002 — PostgreSQL comme seule base métier

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quelle base pour le développement si seul MySQL est installé avec Laragon ? |
| Options | MySQL par commodité ; SQLite ; PostgreSQL obligatoire |
| Décision | PostgreSQL. Pas de schéma métier MySQL. |
| Motif | Cahier v5.0. Un double schéma divergrait. |
| Impact | Installation locale de PostgreSQL requise avant `migrate`. |

## ADR-003 — Montants en entiers XAF

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment stocker les montants ? |
| Options | `float`/`double` ; `numeric` à 2 décimales ; entier XAF |
| Décision | `numeric(20,0)` côté PostgreSQL, entier non négatif sauf contre-passation explicitement signée. Pas de flottant binaire. |
| Motif | Le franc CFA n’a pas de subdivision dans les pièces CEEAC. Le cahier interdit les flottants. |
| Impact | Value object `Money`, sommes contrôlées en domaine, affichage groupé côté UI. |

## ADR-004 — Clés techniques et références métier distinctes

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Faut-il exposer l’identifiant SQL comme numéro d’acte ? |
| Options | ID auto-incrémenté visible ; UUID seul ; UUID + référence séquentielle |
| Décision | UUID comme clé primaire publique. Référence métier atomique (`EB-2026-000001`) produite par `number_sequences` verrouillée. |
| Motif | Cahier §37. |
| Impact | Contrainte unique `(exercise, domain, sequence)`. |

## ADR-005 — Moteur de workflow en données

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Où coder les circuits ? |
| Options | `if` dispersés dans les contrôleurs ; machine à états codée en dur par module ; définitions en base |
| Décision | Définitions versionnées en base (`workflow_definitions`, étapes, transitions, acteurs). Le code vérifie les gardes métier (montants, SoD, période) que la définition ne peut pas contourner. |
| Motif | Cahier §15 et §19. Un administrateur ne doit pas pouvoir sauter une garde financière en changeant un statut. |
| Impact | Les gardes de cumul restent dans le domaine, pas dans un simple champ « statut suivant ». |

## ADR-006 — Réservation de crédit

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quand le disponible diminue-t-il ? |
| Options | À la soumission EB ; à la validation Directeur Budget ; au visa CF |
| Décision | Réservation au visa budgétaire du Directeur Budget. Consommation ferme (engagement exécutoire) au visa du Contrôleur Financier. Libération si refus définitif de visa ou expiration du délai paramétré. Voir Q7. |
| Motif | Le disponible doit être protégé pendant l’instruction sans constater un engagement non visé. |
| Impact | Table `credit_reservations`, verrou `lockForUpdate` sur la ligne. |

## ADR-007 — Liquidation ouverte automatiquement en coquille

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Le visa ENG crée-t-il une dette ? |
| Options | LIQ déjà liquidée ; création manuelle ; dossier LIQ généré non certifié |
| Décision | Création idempotente d’une LIQ au statut `Générée`, sans montant dû tant que le service fait n’est pas certifié. |
| Motif | Q8. Évite une dette fictive et respecte la génération automatique. |
| Impact | Le cumul LIQ ne compte que les liquidations visées. |

## ADR-008 — Seuil d’ordonnateur

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Qui signe l’ordre de paiement ? |
| Options | Choix manuel ; règle fixe en code ; paramètre versionné |
| Décision | Paramètre versionné, valeur initiale 5 000 000 XAF inclus pour le SG, strictement au-dessus pour le Président. La valeur est copiée sur l’acte. |
| Motif | Cahier §11.2. |
| Impact | Test obligatoire aux bornes. |

## ADR-009 — Logo d’interface

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quel fichier logo utiliser ? |
| Options | PNG fond noir ; JPEG fond blanc de la maquette ; redessin |
| Décision | JPEG `LOGO-CEEAC-CERTO_.jpg`, sans redessin. |
| Motif | Même emblème, fond compatible avec les écrans clairs. |
| Impact | Copie vers `frontend/src/assets/` au moment du socle frontend. |

## ADR-010 — Maquette non promue en production

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Faut-il brancher un backend sur `docs/FIGMA-BUDGET-CEEAC-V7` ? |
| Options | Réutiliser la maquette ; réécrire le frontend en copiant le design system |
| Décision | Réécrire `frontend/` en reprenant tokens, navigation et composition. La maquette n’est pas modifiée pour devenir l’application. |
| Motif | Données simulées, pas de routeur ni de contrat API, routes dupliquées. |
| Impact | Effort UI réel à partir de la phase 3, fidélité visuelle exigée. |

## ADR-012 — Tests du socle sur SQLite, exploitation sur PostgreSQL

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment tester le socle alors que PostgreSQL n’est pas installé sur le poste Laragon ? |
| Options | Bloquer tout test ; basculer le métier sur MySQL ; SQLite en mémoire pour le socle portable, PostgreSQL dès qu’il est disponible |
| Décision | `phpunit.xml` utilise SQLite en mémoire. `.env.example` cible PostgreSQL. Les tests de concurrence financière et les fonctions propres à PostgreSQL ne seront pas déclarés concluants tant qu’ils n’ont pas été rejoués sur PostgreSQL. |
| Motif | Le schéma du socle (UUID, clés étrangères, JSON) est portable. Le poste n’a ni `psql` ni Docker. |
| Impact | Aucune donnée budgétaire n’est chargée dans SQLite hors tests. L’import du Budget 2026 attend PostgreSQL. |

## ADR-011 — Audit append-only

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment empêcher l’effacement du journal ? |
| Options | Soft delete ; table ordinaire ; append-only sans route de mutation |
| Décision | Table `audit_events` sans mise à jour ni suppression exposée. Aucune policy fonctionnelle d’écriture directe. Insertion uniquement par le service d’audit. |
| Motif | Cahier §43 et §54. |
| Impact | Les corrections passent par de nouveaux événements. |

## ADR-013 — Référentiels d’exécution sans charger le Budget 2026

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Que semer avant l’import budgétaire ? |
| Options | Inventer la nomenclature du PDF ; attendre ; poser le calendrier, les circuits, les séquences et le seuil, et laisser la nomenclature vide |
| Décision | Exercice 2026 en préparation, douze périodes `not_opened`, devise XAF à 0 décimale, séquences EB/ENG/LIQ/ORD/PAI à zéro, seuil d’ordonnancement version 1 à 5 000 000 XAF (inférieur ou égal : Secrétaire général ; strictement supérieur : Président). Version de nomenclature sans aucun compte. Délais SLA laissés vides. L’étape « préparation administrative » de l’ordonnancement n’a pas de fonction nommée dans le cahier : `pending_assignment`. La préparation de liquidation est portée par le rôle `initiateur`, qui représente le service compétent du dossier. |
| Motif | Question ouverte Q4 : ne pas charger de lignes tant que les totaux de contrôle ne sont pas atteints. Ne pas inventer de rôle ni de délai. |
| Impact | L’écran Exercice lit ces données par l’API. Le badge d’exercice n’est plus un libellé fixe. |

## ADR-014 — Soldes budgétaires et barrière d’import 2026

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment ouvrir le budget sans figer un mapping PDF incertain ? |
| Options | Charger les enveloppes comme crédits ouverts ; parser le PDF ; refuser toute promotion tant que les totaux divergent |
| Décision | Le journal `budget_events` est la source des soldes. Le montant initial est immuable dès la publication. Le gel diminue le disponible et ne réécrit pas le révisé. L’investissement est un segment du total, il n’est pas additionné une seconde fois. Les totaux de l’annexe 2026 sont une barrière d’import, pas des crédits. Aucun lot officiel n’est promu tant qu’un fichier tabulaire n’a pas été contrôlé. |
| Motif | Domaine §3, ADR-006, questions Q4 et Q5. |
| Impact | L’écran budget reste vide de crédits. Un import de test dont les enveloppes égalent les totaux peut devenir un brouillon, jamais une version exécutoire automatique. |

## ADR-015 — Expression de besoin avant crédits ouverts

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment ouvrir le circuit EB alors que le Budget 2026 n’est pas exécutoire et que la chaîne GAR/RBM n’est pas chargée ? |
| Options | Autoriser des brouillons hors ligne ; inventer la chaîne programmatique ; bloquer l’ouverture et n’hériter que ce qui existe |
| Décision | Une expression de besoin exige une ligne exécutoire, un exercice au statut `execution` et une période ouverte. Le circuit est déduit du segment et du type de département déjà porté par l’organigramme. La chaîne GAR/RBM absente reste vide et n’est pas ressaisie. L’engagement créé à la validation ouvre l’instruction sans réserver le crédit. La fiche PDF n’est pas fabriquée. |
| Motif | Cahier §8.2 à §8.8. La réservation appartient au visa du directeur du budget. |
| Impact | L’écran de production explique pourquoi aucun dossier ne peut être ouvert. Les tests du circuit utilisent une ligne exécutoire fictive, isolée de la base de travail. |

## ADR-016 — Réservation et engagement ferme

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quand le crédit devient-il réservé, puis engagé, et la liquidation automatique est-elle déjà une dette ? |
| Options | Réserver dès la validation de l’expression ; réserver au visa du directeur et engager au visa du contrôleur ; compter la coquille de liquidation dans le liquidé |
| Décision | La réservation est écrite au visa du directeur du budget. Le visa du contrôleur financier libère cette réservation et écrit le même montant en engagement ferme, afin de ne pas le compter deux fois. Le refus ou le retour depuis le visa libère la réservation. La liquidation créée à ce moment reste au statut généré : elle n’est pas une dette. Le disponible de l’expression de besoin n’additionne plus les dossiers seulement soumis : le plafond dur est le verrou de réservation. Plusieurs engagements partiels sont admis dans le reliquat de l’expression. |
| Motif | Cahier §9 et ADR-006. Deux expressions peuvent être validées sur la même ligne ; une seule réservation passe si le disponible ne couvre pas les deux. |
| Impact | Le solde disponible retranche gel, réservé et engagé. Le dégagement restitue l’engagé net, avec motif, sans réécrire le visa. |

## ADR-017 — Liquidation visée et ordonnancement en coquille

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quand la liquidation devient-elle une dette, et comment contrôler la facture sans référentiel des tiers ? |
| Options | Compter la coquille dès le visa d’engagement ; attendre le visa de liquidation ; inventer une fiche fournisseur |
| Décision | Seules les liquidations visées comptent dans le liquidé. Le décompte (brut, taxes, retenues, pénalités, avances) est arrêté en préparation, avec motif dès qu’un abattement existe. Le net ne peut pas être négatif. Le service fait est obligatoire : aucun régime d’avance n’est inventé. L’unicité de facture porte sur le numéro, le libellé du fournisseur et l’exercice, jusqu’à l’existence des tiers. Le visa crée une seule coquille d’ordonnancement au statut généré. Elle n’est pas instruite. La séparation des fonctions sur ce circuit compare les fonctions déjà exercées par le même utilisateur : le circuit lui-même enchaîne l’initiateur et le contrôleur financier. |
| Motif | Cahier §10. Le référentiel des fournisseurs n’est pas encore chargé. Un contrôle par fonctions, indépendant des personnes, rendrait le visa impossible. |
| Impact | Un dégagement ne peut pas réduire l’engagement en dessous du déjà liquidé visé. L’écran n’affiche aucun montant tant qu’aucun engagement n’est visé. |

## ADR-018 — Seuil d’ordonnateur copié sur l’acte

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quand figer le seuil, et que faire de la préparation administrative sans fonction nommée ? |
| Options | Recalculer l’ordonnateur à la signature ; figer le seuil dès la constitution de l’acte ; inventer un rôle de contrôle |
| Décision | Le seuil actif est copié sur l’ordonnancement au moment où il est présenté à la signature, avec sa version. Une version publiée ensuite ne change pas cet acte. Un montant réduit avant signature fait recalculer l’ordonnateur. Le Secrétaire général signe jusqu’à 5 000 000 XAF inclus, le Président au-delà. La préparation administrative reste sans fonction : le contrôle initial est automatique. Un retour motivé s’arrête à cette étape. Le regroupement de plusieurs liquidations reste désactivé. Le bénéficiaire est le libellé hérité de la liquidation, sans compte bancaire. La signature ouvre une coquille de paiement et transmet l’ordre ; la prise en charge comptable rend cette coquille prête, le rejet la bloque. Le circuit de paiement n’est pas instruit. |
| Motif | Cahier §11.2 et §11.4, ADR-008, ADR-013, question Q9. |
| Impact | Les tests de 5 000 000 et 5 000 001 XAF portent sur l’acte, pas sur un seuil recalculé après coup. L’écran local reste vide tant qu’aucune liquidation n’est visée. |

## ADR-019 — Paiement sans trésorerie chargée

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Comment exécuter un paiement sans fiche bancaire ni solde de trésorerie ? |
| Options | Inventer des comptes et un solde ; bloquer tout paiement ; exécuter dans la limite de l’ordre, avec une référence d’instrument et une preuve |
| Décision | Le décaissement n’est possible qu’après prise en charge. Le mode est virement, chèque ou caisse. La référence d’instrument est unique, y compris après un rejet : le rejet ne compte pas dans le payé et la référence rejetée ne se réutilise pas. La preuve est exigée avant l’exécution. Le bénéficiaire est le libellé figé sur l’ordonnancement. Aucun compte bancaire ni plafond de caisse n’est inventé, faute de paramètre. Le rapprochement bancaire n’est pas ouvert. |
| Motif | Cahier §12. Le référentiel des tiers et la trésorerie ne sont pas chargés. |
| Impact | L’écran n’affiche aucun montant tant qu’aucun ordre n’est pris en charge. Le cumul contrôlé est celui de l’ordonnancement, pas un solde de caisse. |

## ADR-020 — Transversal sans données inventées

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Que livrer du transversal tant que les seuils de marchés, la chaîne GAR/RBM et la trésorerie ne sont pas fournis ? |
| Options | Inventer un barème, des indicateurs et des soldes ; n’ouvrir que les registres dont la règle est déjà écrite |
| Décision | Les tiers sont uniques par raison sociale. Un compte bancaire naît en attente et ne peut être activé par son déclarant. Un contrat se rattache à un tiers actif ; l’avenant recalcule le montant révisé ; aucune dépense n’y est encore rattachée. La table des seuils de procédure existe et reste vide : l’écran le signale. La GED conserve l’empreinte SHA-256 ; un document scellé est immuable et ne se supprime pas. Une notification naît de l’ouverture d’une tâche, une fois par personne et par tâche. Une observation se clôt avec un motif. Le suivi-évaluation, le Gantt, la trésorerie de prévision et le rapprochement bancaire restent fermés. La facture continue de s’identifier par le libellé du fournisseur. |
| Motif | Cahier §§14 à 19 et question Q14. Aucun barème ni programme n’a été communiqué. |
| Impact | Les écrans correspondants sont vides. Le reporting reste la phase 12. |

## ADR-021 — Tableau de bord calculé, sans dotation recopiée

| Élément | Valeur |
| --- | --- |
| Date | 2026-09-26 |
| Question | Quels chiffres montrer tant que le Budget 2026 n’est pas exécutoire ? |
| Options | Afficher les totaux de contrôle de l’annexe ; afficher zéro en dur ; calculer sur les écritures et taire le taux si le révisé est nul |
| Décision | Les indicateurs sont la somme des écritures du périmètre. Les fonctions transversales voient la Commission. Les autres voient leur structure et les unités qui en dépendent, ou rien si aucune structure n’est affectée. Le taux d’exécution est le quotient entier du payé sur le révisé. Il est absent lorsque le révisé est nul. Une alerte de crédit n’est émise que si une ligne exécutoire a un disponible nul. Aucun seuil de proximité n’est inventé. L’avancement physique reste absent. |
| Motif | Cahier §20.2. Les totaux de l’annexe 2026 sont une barrière d’import, pas des crédits ouverts. |
| Impact | L’écran local annonce l’absence de crédit exécutoire. Un brouillon budgétaire n’entre pas dans le total. |
