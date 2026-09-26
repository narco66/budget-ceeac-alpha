# DESCRIPTION DÉTAILLÉE DU MODULE  
# IMPORT, EXPORT ET INTEROPÉRABILITÉ  
## Application BUDGET-CEEAC

---

# 1. Présentation générale

Le module **Import, Export et Interopérabilité** constitue la couche d’échange de données de **BUDGET-CEEAC**.

Il a pour finalité de permettre à l’application :

- d’importer des données provenant de sources externes ;
- d’exporter les données présentes dans BUDGET-CEEAC ;
- d’échanger automatiquement des données avec d’autres systèmes d’information ;
- de garantir l’intégrité, la traçabilité et la qualité des données échangées ;
- d’éviter les doubles saisies ;
- d’assurer la continuité numérique entre les systèmes métiers de la Commission de la CEEAC ;
- de faciliter la consolidation, le reporting et l’exploitation analytique des données.

Le module doit constituer une **passerelle sécurisée et contrôlée** entre BUDGET-CEEAC et son environnement numérique interne ou externe.

Il ne doit en aucun cas devenir un mécanisme permettant de contourner :

- les contrôles métier ;
- les workflows ;
- les validations ;
- les habilitations ;
- les règles de sécurité ;
- la piste d’audit.

---

# 2. Positionnement dans BUDGET-CEEAC

Le module est transversal.

Il peut interagir avec notamment :

- Référentiels ;
- Budget ;
- PAP ;
- Planification stratégique ;
- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement ;
- Suivi-Évaluation ;
- Reporting ;
- GED ;
- Tiers et fournisseurs ;
- Comptabilité ;
- Trésorerie ;
- Audit ;
- Administration.

Il doit également permettre les échanges avec des systèmes externes tels que :

- SIRH ;
- application de Paie ;
- système comptable ;
- banques ;
- systèmes des partenaires financiers ;
- Power BI ou plateformes décisionnelles ;
- outils bureautiques ;
- services d’identité ;
- plateformes de messagerie ;
- archives électroniques ;
- systèmes institutionnels futurs.

---

# 3. Principe fondamental

Le principe directeur est :

> **Toute donnée importée, exportée ou échangée doit rester identifiable, contrôlable, traçable, réconciliable et conforme aux règles métier de BUDGET-CEEAC.**

Aucun flux d’intégration ne doit créer une base parallèle.

Les données importées doivent alimenter les référentiels et objets métier officiels de BUDGET-CEEAC.

Les données exportées doivent provenir de la source institutionnelle officielle.

---

# 4. Objectifs fonctionnels

Le module doit permettre de :

1. importer des données structurées ;
2. exporter les données selon plusieurs formats ;
3. gérer des modèles d’import réutilisables ;
4. valider les données avant intégration ;
5. détecter les doublons ;
6. contrôler la cohérence référentielle ;
7. permettre la simulation d’un import ;
8. produire un rapport d’erreurs ;
9. permettre des corrections avant validation définitive ;
10. historiser les imports ;
11. gérer les versions ;
12. tracer l’origine des données ;
13. exposer des API ;
14. consommer des API externes ;
15. synchroniser des référentiels ;
16. échanger des événements métier ;
17. contrôler les habilitations ;
18. surveiller les échanges ;
19. gérer les incidents d’intégration ;
20. réconcilier les données échangées.

---

# 5. Périmètre des imports

Le module doit permettre l’import contrôlé de données telles que :

- Budget initial ;
- Budget révisé ;
- lignes budgétaires ;
- chapitres ;
- articles ;
- paragraphes ;
- nomenclatures ;
- sources de financement ;
- partenaires techniques et financiers ;
- PAP ;
- éléments de planification ;
- indicateurs ;
- valeurs de référence ;
- cibles ;
- calendriers ;
- structures organisationnelles ;
- agents ;
- tiers ;
- fournisseurs ;
- bénéficiaires ;
- contrats ;
- marchés ;
- conventions ;
- relevés bancaires ;
- mouvements financiers ;
- données de suivi ;
- historiques autorisés.

Le périmètre exact doit être paramétrable.

---

# 6. Import du Budget

Le module doit permettre l’import d’un Budget à partir d’un fichier structuré.

L’import doit respecter le principe :

> **Un exercice budgétaire = un Budget unique.**

Le système doit contrôler :

- exercice ;
- codes budgétaires ;
- unicité des lignes ;
- montants ;
- structures ;
- sources de financement ;
- nature économique ;
- rattachement PAP éventuel ;
- cohérence des totaux.

L’import ne doit pas créer un Budget parallèle.

Il doit alimenter le Budget officiel de l’exercice concerné.

---

# 7. Import du PAP

Le PAP étant une composante du Budget, son import doit être intégré au même référentiel.

Les données programmatiques peuvent comporter :

- Pilier ;
- Axe stratégique ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateurs ;
- cibles ;
- responsables ;
- calendrier ;
- coûts ;
- lignes budgétaires ;
- sources de financement ;
- partenaires.

Le système doit empêcher la création de lignes PAP non reliées au Budget lorsque le modèle institutionnel exige ce rattachement.

---

# 8. Modèles d’import

Le module doit permettre de définir des **gabarits d’import**.

Chaque modèle doit pouvoir préciser :

- nom ;
- type de données ;
- module destination ;
- format ;
- feuilles concernées ;
- colonnes attendues ;
- champs obligatoires ;
- types ;
- règles de transformation ;
- valeurs par défaut ;
- clés de correspondance ;
- contrôles ;
- version ;
- statut actif.

Exemple :

**IMPORT-BUDGET-2026-V1**

---

# 9. Formats d’import

Le module doit au minimum supporter :

- XLSX ;
- CSV ;
- JSON ;
- XML.

Selon les besoins, il pourra également supporter :

- fichiers texte structurés ;
- API REST ;
- flux SFTP ;
- fichiers bancaires ;
- formats spécifiques aux partenaires.

Les formats doivent être explicitement autorisés.

---

# 10. Assistant d’import

L’import doit être réalisé via un assistant structuré.

Exemple :

### Étape 1 — Sélection du type d’import

### Étape 2 — Sélection du fichier

### Étape 3 — Identification de la structure

### Étape 4 — Mapping des colonnes

### Étape 5 — Contrôles

### Étape 6 — Aperçu

### Étape 7 — Simulation

### Étape 8 — Validation

### Étape 9 — Import

### Étape 10 — Rapport

---

# 11. Mapping des données

Le module doit permettre d’associer une colonne source à un champ BUDGET-CEEAC.

Exemple :

| Source | BUDGET-CEEAC |
|---|---|
| CODE_LIGNE | ligne_budgetaire.code |
| LIBELLE | ligne_budgetaire.libelle |
| DOTATION | dotation_initiale |
| SOURCE | source_financement.code |

Le mapping peut être :

- automatique ;
- proposé ;
- manuel ;
- enregistré comme modèle.

---

# 12. Détection automatique de structure

Lorsqu’un fichier est chargé, le système peut détecter :

- en-têtes ;
- types de données ;
- colonnes vides ;
- doublons ;
- formats de dates ;
- séparateurs ;
- devises ;
- codes ;
- valeurs incohérentes.

Il peut proposer automatiquement un mapping.

---

# 13. Contrôles avant import

Avant validation, le système doit effectuer des contrôles.

Exemples :

- champ obligatoire absent ;
- code inconnu ;
- structure inexistante ;
- ligne dupliquée ;
- exercice fermé ;
- montant invalide ;
- valeur négative non autorisée ;
- date incohérente ;
- source de financement inconnue ;
- référence PAP incorrecte ;
- total incohérent ;
- ligne budgétaire inexistante.

---

# 14. Contrôles de doublons

Le moteur doit distinguer :

- nouveau ;
- existant identique ;
- existant différent ;
- conflit ;
- doublon probable.

Le traitement doit dépendre du type d’objet.

Le système ne doit jamais écraser silencieusement une donnée existante.

---

# 15. Simulation d’import

Avant l’intégration définitive, une simulation doit être possible.

Le système affiche :

- nombre de lignes ;
- lignes valides ;
- avertissements ;
- erreurs ;
- doublons ;
- créations prévues ;
- mises à jour prévues ;
- éléments ignorés.

Aucune donnée n’est modifiée pendant cette phase.

---

# 16. Rapport de simulation

Le rapport doit pouvoir afficher :

| Ligne | Statut | Champ | Problème | Action |
|---|---|---|---|---|

Exemple :

| 45 | ERREUR | Code ligne | Code inexistant | Corriger |

Le rapport doit pouvoir être exporté.

---

# 17. Import atomique

Pour certains imports critiques, le principe recommandé est :

> **Tout ou rien.**

Si une erreur bloquante survient, le système doit pouvoir annuler l’ensemble de l’opération.

Pour des imports volumineux ou indépendants, une stratégie par lots peut être prévue.

---

# 18. Idempotence

Un même fichier importé plusieurs fois ne doit pas créer involontairement plusieurs occurrences identiques.

Le système doit pouvoir utiliser :

- identifiant métier ;
- hash du fichier ;
- référence d’import ;
- clé externe ;
- version ;
- date ;
- combinaison de champs uniques.

---

# 19. Import asynchrone

Les imports volumineux doivent être exécutés en arrière-plan par des jobs.

Le système doit afficher :

- file d’attente ;
- progression ;
- pourcentage ;
- état ;
- durée ;
- erreurs ;
- résultat.

Statuts possibles :

- En attente ;
- En cours ;
- Terminé ;
- Terminé avec avertissements ;
- Échec ;
- Annulé.

---

# 20. Historique des imports

Chaque import doit enregistrer :

- référence ;
- type ;
- fichier ;
- utilisateur ;
- date ;
- heure ;
- taille ;
- nombre de lignes ;
- résultat ;
- erreurs ;
- données créées ;
- données mises à jour ;
- durée ;
- version du modèle.

---

# 21. Traçabilité des données importées

Pour chaque donnée importée, il doit être possible de savoir :

- quel import l’a créée ;
- quand ;
- par qui ;
- depuis quel fichier ;
- depuis quelle source ;
- quelle valeur originale était présente.

La provenance doit être conservée.

---

# 22. Gestion des corrections

Le système doit permettre de corriger les erreurs d’import :

### Option 1
Correction du fichier source puis nouvel import.

### Option 2
Correction dans une zone de prévalidation.

### Option 3
Correction métier après import, selon habilitation.

Toutes les corrections sensibles doivent être tracées.

---

# 23. Export

Le module doit permettre d’exporter les données de BUDGET-CEEAC.

Formats principaux :

- XLSX ;
- CSV ;
- PDF ;
- JSON ;
- XML.

Les exports doivent respecter les permissions de l’utilisateur.

---

# 24. Types d’exports

Le système doit pouvoir proposer :

### Export de listes
Exemple : Engagements.

### Export filtré
Exemple : Paiements 2026 / Département X.

### Export détaillé
Dossier complet.

### Export agrégé
Synthèse.

### Export technique
JSON/XML.

### Export analytique
Pour BI.

---

# 25. Export des tableaux

Tout tableau fonctionnel important doit pouvoir proposer selon habilitation :

- Excel ;
- CSV ;
- PDF ;
- impression.

Les filtres actifs doivent être appliqués à l’export.

---

# 26. Export volumineux

Lorsque l’export est important :

1. demande enregistrée ;
2. job en arrière-plan ;
3. génération ;
4. notification ;
5. téléchargement sécurisé.

---

# 27. Sécurisation des exports

Le système doit empêcher l’export de données auxquelles l’utilisateur n’a pas accès.

Les contrôles doivent porter sur :

- rôle ;
- structure ;
- périmètre ;
- confidentialité ;
- type de données ;
- module ;
- période.

---

# 28. Journalisation des exports

Chaque export sensible doit pouvoir enregistrer :

- utilisateur ;
- date ;
- type ;
- données concernées ;
- critères ;
- format ;
- volume ;
- adresse IP lorsque pertinent ;
- résultat.

---

# 29. Interopérabilité

L’interopérabilité doit permettre à BUDGET-CEEAC de communiquer automatiquement avec d’autres systèmes.

Elle repose sur :

- API ;
- webhooks ;
- fichiers ;
- messages ;
- services ;
- événements.

---

# 30. API BUDGET-CEEAC

BUDGET-CEEAC doit exposer une API sécurisée.

Exemples de ressources :

- `/api/exercices`
- `/api/budgets`
- `/api/lignes-budgetaires`
- `/api/pap`
- `/api/eb`
- `/api/engagements`
- `/api/liquidations`
- `/api/ordonnancements`
- `/api/paiements`
- `/api/indicateurs`
- `/api/tiers`

---

# 31. API REST

L’API peut adopter une architecture REST/JSON.

Elle doit permettre selon les droits :

- lecture ;
- création ;
- mise à jour ;
- action métier ;
- consultation de statut.

Les opérations critiques ne doivent pas être exposées sans contrôle métier.

---

# 32. Documentation des API

Chaque API doit être documentée avec :

- endpoint ;
- méthode ;
- authentification ;
- paramètres ;
- payload ;
- codes réponse ;
- erreurs ;
- exemples ;
- permissions ;
- limites.

Une documentation OpenAPI doit être prévue.

---

# 33. Authentification API

Les échanges doivent être sécurisés.

Les mécanismes peuvent inclure :

- OAuth 2.0 ;
- OpenID Connect ;
- tokens ;
- certificats ;
- API keys pour certains usages strictement encadrés.

Les secrets ne doivent jamais être stockés en clair.

---

# 34. Webhooks

Le système doit pouvoir notifier un système externe lorsqu’un événement survient.

Exemples :

- Budget validé ;
- Engagement visé ;
- Paiement exécuté ;
- indicateur validé ;
- nouvel exercice ;
- nouveau fournisseur.

---

# 35. Événements métier

L’architecture peut prévoir des événements tels que :

- `BudgetApproved`
- `EBApproved`
- `EngagementValidated`
- `LiquidationValidated`
- `OrdonnancementSigned`
- `PaymentExecuted`
- `IndicatorValidated`

Ces événements doivent pouvoir alimenter d’autres composants sans couplage excessif.

---

# 36. Intégration avec la comptabilité

BUDGET-CEEAC doit pouvoir échanger avec le système comptable.

Exemples de données :

- paiements ;
- tiers ;
- comptes ;
- écritures ;
- taxes ;
- retenues ;
- références ;
- analytique ;
- pièces.

L’objectif est d’éviter les doubles saisies.

---

# 37. Intégration avec la Paie

Lorsque nécessaire, BUDGET-CEEAC peut recevoir ou transmettre :

- éléments de masse salariale ;
- imputations ;
- paiements ;
- charges ;
- états ;
- références comptables.

Le détail doit être défini dans une interface dédiée entre BUDGET-CEEAC et le système de Paie.

---

# 38. Intégration avec le SIRH

Les données organisationnelles ou RH peuvent inclure :

- agents ;
- matricules ;
- fonctions ;
- structures ;
- directions ;
- services ;
- responsables ;
- affectations.

Le SIRH doit idéalement rester la source maître des données RH.

---

# 39. Intégration bancaire

Le module doit pouvoir préparer une intégration bancaire pour :

- ordres de virement ;
- transmission de lots ;
- récupération des statuts ;
- confirmation de paiement ;
- rejets ;
- relevés ;
- rapprochement bancaire.

Ces échanges doivent être particulièrement sécurisés.

---

# 40. Import de relevés bancaires

Le système doit permettre l’import de relevés bancaires structurés.

Les données peuvent contenir :

- compte ;
- date ;
- référence ;
- libellé ;
- débit ;
- crédit ;
- devise ;
- solde.

Ces données alimentent le rapprochement bancaire.

---

# 41. Synchronisation des tiers

Le référentiel des :

- fournisseurs ;
- consultants ;
- bénéficiaires ;
- prestataires ;
- partenaires

peut être synchronisé avec d’autres systèmes.

Le système doit définir une source maître.

---

# 42. Master Data Management

Pour chaque référentiel partagé, une autorité de référence doit être déterminée.

Exemple :

| Donnée | Source maître |
|---|---|
| Agents | SIRH |
| Structures | Référentiel organisationnel |
| Budget | BUDGET-CEEAC |
| Paiements | Agence Comptable / BUDGET-CEEAC |
| Fournisseurs | Référentiel tiers |

Le principe doit être :

> **Une donnée institutionnelle = une source maître identifiée.**

---

# 43. Gestion des identifiants externes

Chaque objet synchronisé peut conserver :

- ID interne ;
- système source ;
- ID externe ;
- date de synchronisation ;
- statut ;
- version.

Cela permet de réconcilier les systèmes.

---

# 44. Synchronisation

Une synchronisation peut être :

- temps réel ;
- quasi temps réel ;
- planifiée ;
- manuelle ;
- événementielle.

Le mode doit être configurable selon l’intégration.

---

# 45. Sens des échanges

Chaque interface doit définir :

- entrant ;
- sortant ;
- bidirectionnel.

La synchronisation bidirectionnelle doit être utilisée avec prudence afin d’éviter les conflits.

---

# 46. Gestion des conflits

Lorsqu’une même donnée a été modifiée dans deux systèmes :

le système doit appliquer une stratégie.

Exemples :

- système maître prioritaire ;
- version la plus récente ;
- intervention manuelle ;
- rejet ;
- fusion contrôlée.

La stratégie doit être explicite.

---

# 47. Réconciliation

Le module doit permettre de comparer :

- données envoyées ;
- données reçues ;
- données acceptées ;
- données rejetées ;
- données divergentes.

---

# 48. Console d’intégration

Créer une console de supervision comprenant :

- intégrations actives ;
- flux ;
- dernier échange ;
- prochain échange ;
- succès ;
- erreurs ;
- volume ;
- latence ;
- disponibilité.

---

# 49. Tableau de bord d’interopérabilité

KPI possibles :

- nombre d’imports ;
- taux de succès ;
- erreurs ;
- données importées ;
- exports ;
- appels API ;
- synchronisations ;
- incidents ;
- temps moyen de traitement ;
- flux en échec.

---

# 50. Journal des échanges

Chaque échange doit enregistrer :

- système source ;
- système cible ;
- date ;
- heure ;
- interface ;
- opération ;
- référence ;
- résultat ;
- statut ;
- durée ;
- volume ;
- erreur éventuelle.

---

# 51. Gestion des erreurs

Les erreurs doivent être classifiées :

- technique ;
- authentification ;
- autorisation ;
- format ;
- validation ;
- métier ;
- référentiel ;
- timeout ;
- disponibilité ;
- doublon.

---

# 52. Retry

Les flux automatiques doivent pouvoir être rejoués lorsque cela est techniquement sûr.

Prévoir :

- compteur ;
- délai ;
- backoff ;
- nombre maximum ;
- statut final.

---

# 53. Dead Letter Queue

Pour les échanges asynchrones, les messages impossibles à traiter peuvent être placés dans une file d’erreur.

Ils doivent rester consultables et rejouables par un administrateur habilité.

---

# 54. Idempotence des API

Les actions sensibles doivent intégrer des mécanismes d’idempotence.

Exemple :

un même ordre reçu deux fois ne doit pas créer deux Paiements.

---

# 55. Versioning des API

Les interfaces doivent pouvoir évoluer.

Exemple :

`/api/v1/...`

Les évolutions incompatibles doivent utiliser une nouvelle version.

---

# 56. Limitation des appels

Le système doit permettre de définir des limites :

- appels/minute ;
- appels/jour ;
- volume ;
- taille payload.

Cela protège les ressources.

---

# 57. Timeouts

Chaque intégration doit définir :

- timeout connexion ;
- timeout lecture ;
- timeout global.

Un service externe indisponible ne doit pas bloquer toute l’application.

---

# 58. Circuit Breaker

Pour les intégrations critiques, un mécanisme de type circuit breaker peut être utilisé afin d’éviter des appels répétés vers un service défaillant.

---

# 59. Outbox transactionnelle

Les événements générés lors d’opérations sensibles doivent idéalement être enregistrés dans une **outbox transactionnelle**.

Exemple :

Validation Engagement  
→ transaction métier validée  
→ événement enregistré  
→ envoi asynchrone

Cela évite qu’une transaction métier réussisse alors que la notification externe est perdue.

---

# 60. Intégrité des données

Les flux doivent garantir :

- unicité ;
- cohérence ;
- contraintes référentielles ;
- contrôles de type ;
- validation métier ;
- contrôle des montants ;
- contrôle des statuts.

---

# 61. Chiffrement

Les échanges doivent être protégés :

- chiffrement en transit ;
- chiffrement des données sensibles ;
- gestion sécurisée des certificats ;
- rotation des secrets.

---

# 62. Données sensibles

Les exports et API peuvent contenir des données sensibles telles que :

- coordonnées bancaires ;
- informations personnelles ;
- données financières ;
- pièces justificatives.

Le système doit permettre :

- masquage ;
- restriction ;
- chiffrement ;
- journalisation ;
- limitation.

---

# 63. Signature des échanges

Certains flux critiques peuvent utiliser :

- signature numérique ;
- hash ;
- checksum ;
- certificat.

Cela permet de garantir l’intégrité.

---

# 64. Contrôle antivirus

Les fichiers importés doivent pouvoir être analysés avant traitement.

Les fichiers suspects doivent être rejetés ou mis en quarantaine.

---

# 65. Taille maximale

Le module doit permettre de définir des limites de taille selon :

- type de fichier ;
- module ;
- rôle ;
- interface.

---

# 66. Gestion des encodages

Le système doit supporter les encodages configurés et éviter les erreurs liées notamment à :

- caractères accentués ;
- symboles monétaires ;
- séparateurs ;
- formats régionaux.

---

# 67. Localisation et formats

Les imports doivent gérer :

- dates ;
- décimales ;
- milliers ;
- devises ;
- formats régionaux.

Exemple :

`1 250 000,50`

et :

`1,250,000.50`

doivent être interprétés selon un modèle explicite.

---

# 68. Devises

Pour les flux multi-devises, conserver :

- devise ;
- montant ;
- taux ;
- date du taux ;
- source du taux ;
- équivalent XAF.

---

# 69. Import avec validation humaine

Certains imports doivent suivre un workflow :

**Téléchargé  
→ Analysé  
→ Contrôlé  
→ À corriger  
→ Validé  
→ Importé**

---

# 70. Séparation des fonctions

Le module doit permettre de distinguer :

- préparateur ;
- contrôleur ;
- validateur ;
- administrateur.

Un utilisateur ne doit pas nécessairement pouvoir importer immédiatement ce qu’il vient de préparer.

---

# 71. Habilitations

Les droits doivent pouvoir porter sur :

- type d’import ;
- type d’export ;
- module ;
- structure ;
- exercice ;
- format ;
- volume ;
- API ;
- intégration.

---

# 72. Workflows d’approbation

Les imports sensibles peuvent être soumis à validation.

Exemple :

Import Budget  
→ Administrateur Budget  
→ Directeur Budget  
→ Validation.

Le workflow doit être paramétrable.

---

# 73. Notifications

Le module doit notifier notamment :

- import prêt ;
- import terminé ;
- import avec erreurs ;
- import rejeté ;
- export disponible ;
- export échoué ;
- API indisponible ;
- synchronisation échouée ;
- rapprochement incomplet.

---

# 74. Centre de notifications techniques

Les administrateurs doivent disposer d’un espace spécifique pour les alertes d’intégration.

---

# 75. GED

Les fichiers importés et rapports critiques doivent pouvoir être archivés dans la GED.

Exemples :

- fichier original ;
- rapport de validation ;
- rapport d’erreurs ;
- preuve de traitement ;
- fichier exporté officiel.

---

# 76. Versionnement

Le module doit conserver la version des :

- modèles ;
- mappings ;
- interfaces ;
- schémas ;
- fichiers ;
- APIs.

---

# 77. Audit

Toute opération sensible doit être auditée.

Exemples :

- import ;
- validation ;
- annulation ;
- export ;
- appel API ;
- relecture ;
- modification de mapping ;
- modification d’intégration ;
- régénération d’un fichier.

---

# 78. Recherche et filtres

La page des échanges doit permettre de filtrer par :

- type ;
- module ;
- utilisateur ;
- date ;
- statut ;
- source ;
- cible ;
- format ;
- référence ;
- exercice.

---

# 79. Interfaces utilisateur

Le module peut comporter les écrans suivants :

### IEX-01 — Tableau de bord

### IEX-02 — Nouvel import

### IEX-03 — Historique des imports

### IEX-04 — Détail d’un import

### IEX-05 — Mapping des colonnes

### IEX-06 — Validation

### IEX-07 — Rapport d’erreurs

### IEX-08 — Export

### IEX-09 — Historique des exports

### IEX-10 — API

### IEX-11 — Intégrations

### IEX-12 — Synchronisations

### IEX-13 — Supervision

### IEX-14 — Journal des échanges

### IEX-15 — Modèles

### IEX-16 — Paramétrage

---

# 80. Dashboard Import/Export

Le tableau de bord doit présenter :

- imports du jour ;
- imports réussis ;
- imports en erreur ;
- fichiers en attente ;
- exports ;
- intégrations actives ;
- flux en erreur ;
- derniers échanges ;
- volume traité.

---

# 81. UX de l’import

L’interface doit être particulièrement pédagogique.

L’utilisateur doit voir :

- fichier ;
- type ;
- progression ;
- erreurs ;
- avertissements ;
- données valides ;
- résultat.

Les erreurs doivent être compréhensibles.

Éviter les messages techniques du type :

`SQLSTATE 23505`

Préférer :

> « Le code budgétaire 60201 existe déjà pour cet exercice. »

---

# 82. UX du mapping

Le mapping doit pouvoir être réalisé visuellement.

Exemple :

`Colonne fichier`

→

`Champ BUDGET-CEEAC`

Avec statut :

- reconnu ;
- à vérifier ;
- obligatoire ;
- ignoré.

---

# 83. UX du rapport d’erreurs

Le rapport doit proposer :

- ligne ;
- colonne ;
- valeur ;
- erreur ;
- niveau ;
- correction possible.

Filtre :

- erreurs ;
- avertissements ;
- informations.

---

# 84. Export analytique et BI

Le module doit permettre de mettre à disposition des données pour les outils décisionnels.

Exemples :

- Power BI ;
- data warehouse ;
- tableaux de bord institutionnels ;
- outils statistiques.

Les données peuvent être exposées via :

- API ;
- vues SQL dédiées ;
- exports ;
- flux programmés.

---

# 85. Vues de données

Des vues de reporting peuvent être prévues afin d’éviter que les outils BI interrogent directement les tables transactionnelles.

Exemples :

- `vw_budget_execution`
- `vw_pap_performance`
- `vw_payment_status`
- `vw_indicator_performance`

---

# 86. Data Warehouse

À terme, l’architecture peut prévoir un entrepôt de données séparé pour :

- historique ;
- reporting ;
- analyse multidimensionnelle ;
- séries temporelles ;
- performance.

BUDGET-CEEAC reste la source transactionnelle.

---

# 87. Exports programmés

Un administrateur habilité doit pouvoir planifier :

- type ;
- fréquence ;
- format ;
- destinataire ;
- période ;
- filtres.

Exemple :

**Rapport mensuel d’exécution budgétaire — chaque 1er du mois.**

---

# 88. Archivage des exports

Les exports institutionnels officiels peuvent être archivés dans la GED avec :

- version ;
- auteur ;
- date ;
- filtre ;
- période ;
- hash ;
- statut.

---

# 89. États fonctionnels

Un import peut connaître les statuts :

- Brouillon ;
- Fichier chargé ;
- Analyse ;
- Erreurs ;
- À corriger ;
- Prêt ;
- En validation ;
- Validé ;
- Import en cours ;
- Importé ;
- Échec ;
- Annulé.

---

# 90. Règles de gestion essentielles

### RG-IEX-001
Tout import doit être identifié.

### RG-IEX-002
Aucune donnée critique ne doit être importée sans contrôle.

### RG-IEX-003
Un import ne doit jamais contourner les règles métier.

### RG-IEX-004
Le système doit détecter les doublons.

### RG-IEX-005
Tout import critique doit être traçable.

### RG-IEX-006
Un fichier source doit pouvoir être conservé.

### RG-IEX-007
Les erreurs doivent être explicites.

### RG-IEX-008
Un import doit pouvoir être simulé avant validation.

### RG-IEX-009
Les opérations critiques doivent être idempotentes.

### RG-IEX-010
Aucune donnée existante ne doit être écrasée silencieusement.

### RG-IEX-011
Tout export doit respecter les droits d’accès.

### RG-IEX-012
Les exports sensibles doivent être auditables.

### RG-IEX-013
Les intégrations doivent utiliser des interfaces documentées.

### RG-IEX-014
Les flux doivent être sécurisés.

### RG-IEX-015
Les secrets ne doivent pas être stockés en clair.

### RG-IEX-016
Les systèmes maîtres doivent être identifiés.

### RG-IEX-017
Les synchronisations doivent être réconciliables.

### RG-IEX-018
Les erreurs d’intégration doivent être historisées.

### RG-IEX-019
Les appels automatiques doivent supporter un mécanisme de retry lorsque cela est sûr.

### RG-IEX-020
Les intégrations critiques doivent être monitorées.

### RG-IEX-021
Les transformations doivent être versionnées.

### RG-IEX-022
Les données sensibles doivent être protégées.

### RG-IEX-023
Les données importées doivent conserver leur provenance.

### RG-IEX-024
Les formats et schémas doivent être versionnés.

### RG-IEX-025
Les APIs doivent appliquer les habilitations BUDGET-CEEAC.

### RG-IEX-026
Les écritures transactionnelles ne doivent pas dépendre directement de la disponibilité d’un système externe.

### RG-IEX-027
Les événements critiques doivent pouvoir être publiés de manière fiable.

### RG-IEX-028
Les fichiers officiels importés ou exportés doivent pouvoir être archivés.

### RG-IEX-029
Toute correction postérieure à un import doit être traçable.

### RG-IEX-030
Aucune suppression physique d’un journal d’intégration sensible ne doit être autorisée par un utilisateur métier.

---

# 91. Cycle fonctionnel d’un import

Le cycle cible est :

**Sélection du type d’import**  
↓  
**Chargement du fichier**  
↓  
**Analyse de structure**  
↓  
**Mapping**  
↓  
**Validation technique**  
↓  
**Validation métier**  
↓  
**Détection des erreurs et doublons**  
↓  
**Simulation**  
↓  
**Prévisualisation**  
↓  
**Validation utilisateur**  
↓  
**Import transactionnel**  
↓  
**Réconciliation**  
↓  
**Rapport**  
↓  
**Archivage**  
↓  
**Audit**

---

# 92. Cycle fonctionnel d’une intégration

**Événement métier**  
↓  
**Création du message**  
↓  
**Outbox**  
↓  
**Traitement asynchrone**  
↓  
**Appel du système externe**  
↓  
**Réponse**  
↓  
**Validation**  
↓  
**Journalisation**  
↓  
**Réconciliation**

En cas d’échec :

**Retry**  
↓  
**Nouvel échec**  
↓  
**File d’erreurs**  
↓  
**Alerte administrateur**  
↓  
**Correction**  
↓  
**Rejeu**

---

# 93. Exigences techniques

Le module doit être compatible avec l’architecture cible :

- Laravel ;
- PostgreSQL ;
- files de messages/jobs ;
- stockage objet ou documentaire ;
- API REST ;
- OpenAPI ;
- événements ;
- outbox transactionnelle ;
- logs centralisés ;
- supervision.

Les opérations lourdes ne doivent pas bloquer les requêtes utilisateur.

---

# 94. Performance

Le système doit être capable de traiter des imports volumineux sans surcharge excessive.

Prévoir :

- traitement par lots ;
- streaming ;
- files d’attente ;
- pagination ;
- limitation mémoire ;
- reprise sur incident.

---

# 95. Observabilité

Le module doit produire des métriques telles que :

- volume importé ;
- volume exporté ;
- temps de traitement ;
- taux d’erreur ;
- taux de retry ;
- disponibilité API ;
- latence ;
- erreurs par système.

---

# 96. Sécurité

La conception doit respecter :

- principe du moindre privilège ;
- séparation des fonctions ;
- contrôle d’accès ;
- authentification forte selon criticité ;
- chiffrement ;
- audit ;
- protection des secrets ;
- validation des entrées ;
- limitation des flux ;
- surveillance.

---

# 97. Continuité d’activité

Le module doit être conçu afin que l’indisponibilité temporaire d’un système externe ne bloque pas toute BUDGET-CEEAC.

Les échanges asynchrones doivent pouvoir reprendre après rétablissement.

---

# 98. Résultat attendu

Le module **Import, Export et Interopérabilité** doit transformer BUDGET-CEEAC en une plateforme capable de communiquer de manière fiable avec son environnement numérique tout en préservant :

- la qualité des données ;
- l’intégrité budgétaire ;
- la cohérence du PAP ;
- la sécurité ;
- la traçabilité ;
- les responsabilités ;
- les workflows ;
- l’unicité des référentiels.

Il doit permettre de passer d’une logique de fichiers bureautiques isolés à une architecture intégrée :

**Sources externes  
↕  
Import / API / Événements  
↕  
BUDGET-CEEAC  
↕  
Export / API / Reporting  
↕  
Systèmes institutionnels et partenaires**

Le module doit en particulier garantir quatre principes :

### Unicité
Les échanges ne doivent pas générer de bases ou référentiels parallèles.

### Fiabilité
Les données sont contrôlées, validées et réconciliables.

### Sécurité
Les données et flux sont protégés selon leur sensibilité.

### Traçabilité
Toute donnée échangée peut être reliée à sa source, son traitement, son auteur et son résultat.

Le module **Import, Export et Interopérabilité** constitue ainsi la **couche d’ouverture et d’intégration du système BUDGET-CEEAC**, indispensable à son évolution vers un véritable système institutionnel intégré de planification, budgétisation, exécution, suivi-évaluation et pilotage de la performance.