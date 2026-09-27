# Questions ouvertes — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Règle :** une ambiguïté non tranchée par le cahier v5.0, les procédures ou les référentiels est consignée ici. Le développement des parties déjà tranchées continue. Aucune de ces questions n’autorise à inventer une règle silencieuse.

**Suite au 26 septembre 2026 :** les décisions provisoires Q2, Q4, Q8, Q9, Q12, Q14 et Q15 ont été tenues dans le code (organigramme proposé, budget non chargé, coquille de liquidation, ordonnancement non groupé, compte technique local, seuils de marchés vides, logo JPEG). Elles ne sont pas closes : la validation institutionnelle manque toujours. Q7 n’a pas reçu de durée. Q10 n’a pas de second facteur. Q11 bloque l’exploitation. Le constat complet est dans `FINAL_AUDIT.md`.

## Q1 — Validation institutionnelle du cahier v5.0

- **Constat :** le cahier se déclare « baseline fonctionnelle enrichie proposée pour validation ».
- **Impact :** les circuits décrits sont implémentables comme référence de travail.
- **Décision provisoire :** implémenter le cahier v5.0 tel quel.
- **Validation attendue :** adoption formelle par l’autorité métier CEEAC, ou liste d’écarts.

## Q2 — Codes organisationnels non encore consacrés

- **Constat :** le référentiel de juin 2026 indique que les codes (`DPRES`, `DSG-DRHMG-SMG`, etc.) sont applicatifs et doivent être validés.
- **Impact :** les workflows s’appuient sur ces codes.
- **Décision provisoire :** charger la version 1.0 « document de travail » avec un statut `proposed`, dates d’effet, et journaliser toute correction ultérieure comme nouvelle version. Ne pas réintroduire le Secrétariat Administratif.
- **Validation attendue :** acte ou confirmation des codes et rattachements.

## Q3 — Nomenclature du certificat modèle vs Budget 2026

- **Constat :** le PDF `01_Certificat_Engagement_ENG-2026-000045.pdf` présente une imputation de type « Chapitre 2.2.1 / Ligne 2.2.1.2 — Matériel informatique », alors que le Budget 2026 utilise des codes du type `60111`, `66101`, titres 1 à 3, piliers `201`.
- **Impact :** un import naïf du modèle de certificat créerait une nomenclature parallèle.
- **Décision provisoire :** la nomenclature exécutoire est celle du Budget 2026. Le certificat fixe la composition visuelle (logo, blocs, signataires, QR), pas le plan de comptes.
- **Validation attendue :** confirmer qu’aucun autre plan de nomenclature réglementaire ne doit coexister.

## Q4 — Unité des montants PAP dans l’annexe

- **Constat :** les totaux d’investissement sont en XAF (milliards). Certaines lignes de piliers extraites (`201 PILIER 1` à `1 750 000`) peuvent être exprimées en milliers, ou correspondre à une autre colonne. L’extraction PDF mélange les colonnes.
- **Impact :** un chargement automatique non contrôlé fausserait les crédits.
- **Décision provisoire :** ne pas charger les lignes PAP en production tant qu’un mapping tabulaire n’a pas été contrôlé ligne à ligne, avec rapport d’écarts et total de contrôle égal à 25 887 281 000 XAF pour l’investissement 2026 (et 40 305 795 803 XAF pour le total des dépenses).
- **Validation attendue :** fichier source tabulaire (Excel/CSV) ou confirmation de l’unité et du rattachement structurel de chaque ligne.

## Q5 — Pages 21 à 42 du Budget 2026

- **Constat :** l’extraction texte de ces pages est presque vide.
- **Impact :** des annexes (peut-être programmatiques ou graphiques) ne sont pas encore indexées.
- **Décision provisoire :** les traiter par relecture visuelle lors de l’import, sans inventer leur contenu.
- **Validation attendue :** export tabulaire officiel ou OCR contrôlé.

## Q6 — Doubles rédactions de modules

- **Constat :** deux fichiers distincts existent pour Liquidation, Ordonnancement, Paiement et Suivi-évaluation.
- **Impact :** risque de réintroduire un circuit abandonné.
- **Décision provisoire :** le cahier v5.0 tranche. Les fichiers modulaires servent de détail lorsqu’ils ne contredisent pas le cahier.
- **Validation attendue :** indiquer, si une procédure signée postérieure au 26/09/2026 existe, laquelle fait foi.

## Q7 — Réservation de crédit pendant l’instruction de l’ENG

- **Constat :** le cahier prévoit une réservation temporaire à délai paramétrable, puis une confirmation au visa du Directeur Budget / Contrôleur Financier. Le moment exact où le disponible est diminué (soumission, validation directeur, ou visa CF) est décrit mais le délai d’expiration n’a pas de valeur chiffrée.
- **Décision provisoire :** réserver au moment de la validation du Directeur Budget ; libérer si visa refusé définitivement ou si le délai paramétré expire. Valeur initiale du délai : paramètre `credit_reservation_ttl_days`, défaut documenté en configuration, modifiable sans redéploiement de code.
- **Validation attendue :** durée institutionnelle de la réservation.

## Q8 — Génération automatique de la LIQ « ou » ouverture de dossier

- **Constat :** après visa CF de l’ENG, le cahier dit « génération automatique de la Liquidation ou ouverture du dossier de liquidation selon la configuration ».
- **Décision provisoire :** créer le dossier LIQ en statut `Générée` (coquille héritée, non visée), sans constater la dette tant que le service fait n’est pas certifié. Cela évite une liquidation fictive tout en respectant l’idempotence.
- **Validation attendue :** confirmer que la coquille automatique est souhaitée plutôt qu’une création manuelle.

## Q9 — Regroupement de liquidations dans un seul ordonnancement

- **Constat :** le cahier l’autorise « si les procédures l’autorisent », sans critère d’homogénéité chiffré.
- **Décision provisoire :** un ORD pour une LIQ en P0. Le regroupement sera un paramètre désactivé par défaut.
- **Validation attendue :** règles d’homogénéité (même tiers, même ligne, même exercice).

## Q10 — Infrastructure de signature et de MFA

- **Constat :** le cahier distingue validation applicative, signature interne et signature qualifiée « si l’infrastructure le permet ». Aucun fournisseur MFA/signature n’est désigné.
- **Décision provisoire :** validation applicative forte (identité, rôle, horodatage, hash du snapshot) en P0. MFA TOTP activable par profil sensible. Signature qualifiée reportée en P2.
- **Validation attendue :** choix du second facteur et, plus tard, du prestataire de signature.

## Q11 — PostgreSQL absent du poste de développement

- **Constat :** Laragon dispose de MySQL, pas de PostgreSQL. Le cahier impose PostgreSQL.
- **Décision provisoire :** les migrations et la configuration ciblent `pgsql`. L’exécution réelle attend l’installation de PostgreSQL. Les tests automatisés pourront utiliser une base de test PostgreSQL dès qu’elle sera disponible. Ne pas basculer le métier sur MySQL.
- **Action locale :** installer PostgreSQL 16+ (idéalement 18) et créer la base `gesbudep`.

## Q12 — Comptes utilisateurs initiaux

- **Constat :** le référentiel décrit des fonctions, pas une liste nominative exploitable. Le certificat modèle cite des identités de démonstration.
- **Décision provisoire :** seeders de fonctions et de rôles, plus un compte technique d’administration locale dont le mot de passe vient de `.env`. Aucun annuaire nominatif inventé.
- **Validation attendue :** liste des titulaires, structures et habilitations pour le démarrage.

## Q13 — Recettes

- **Constat :** le Budget 2026 détaille les contributions et les dons, mais le cahier classe le module recettes en extension recommandée.
- **Décision provisoire :** importer les prévisions de recettes comme référentiel budgétaire (pour le cadrage), sans ouvrir un cycle de recouvrement complet en P0.
- **Validation attendue :** procédure de suivi des contributions si elle doit entrer dans le périmètre de mise en production.

## Q14 — Seuils de marchés publics

- **Constat :** le cahier demande le contrôle des seuils de procédure d’achat « sans préjuger des règles juridiques qui seront paramétrées ». Aucun barème chiffré autre que le seuil d’ordonnateur n’est fourni.
- **Décision provisoire :** table de seuils vide mais administrable. Aucun seuil de marché inventé. Alerte informative si aucun seuil n’est configuré pour la nature de dépense.
- **Validation attendue :** barème CEEAC des procédures d’achat.

## Q15 — Logo vectoriel

- **Constat :** `docs/logo-ceeac.png` est net mais sur fond noir. `LOGO-CEEAC-CERTO_.jpg` est le même emblème sur fond blanc, déjà utilisé par la maquette.
- **Décision provisoire :** utiliser le JPEG à fond blanc pour l’UI, l’en-tête et les PDF.
- **Validation attendue :** fichier SVG ou PNG transparent officiel si la charte le possède.
