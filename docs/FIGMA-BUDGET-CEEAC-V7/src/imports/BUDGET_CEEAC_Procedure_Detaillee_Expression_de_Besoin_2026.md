# BUDGET-CEEAC

## Procédure détaillée de l’Expression de Besoin (EB)

**Commission de la CEEAC**  
**Document de référence fonctionnelle**  
**Version : 1.0**  
**Date : 7 septembre 2026**

---

## Sommaire

- 1. Objet de la procédure
- 2. Principes fondamentaux
- 3. Principe de classification du besoin
- 4. Principe de distinction entre classification et imputation
- 5. Déclenchement de la procédure
- 6. Étape 1 - Identification préalable de la ligne budgétaire
- 7. Étape 2 - Analyse automatique de la ligne sélectionnée
- 8. Étape 3 - Comportement spécifique pour une ligne PAP
- 9. Contrôle de cohérence PAP
- 10. Étape 4 - Identification du demandeur
- 11. Étape 5 - Description du besoin
- 12. Étape 6 - Niveau de priorité
- 13. Étape 7 - Informations financières
- 14. Étape 8 - Imputation budgétaire
- 15. Contrôle de disponibilité budgétaire
- 16. Étape 9 - Fournisseur ou bénéficiaire éventuel
- 17. Étape 10 - Pièces justificatives
- 18. Étape 11 - Contrôles avant enregistrement
- 19. Enregistrement en brouillon
- 20. Soumission de l’Expression de Besoin
- 21. Workflow EB Hors PAP
- 22. Workflow EB PAP
- 23. Actions disponibles pour un valideur
- 24. Modification après retour
- 25. Modification substantielle
- 26. Approbation par l’Ordonnateur
- 27. Transformation automatique EB vers Engagement
- 28. Numérotation
- 29. Statuts fonctionnels
- 30. Bandeau intelligent de suivi
- 31. Mes tâches
- 32. Notifications
- 33. Journal d’audit
- 34. Fiche officielle de l’Expression de Besoin
- 35. Tableau de bord des Expressions de Besoin
- 36. Recherche et filtres
- 37. Principales règles métier
- 38. Workflow fonctionnel consolidé
- 39. Résultat attendu

---

## 1. Objet de la procédure

La procédure Expression de Besoin (EB) constitue le point d’entrée de la chaîne d’exécution de la dépense dans BUDGET-CEEAC.

Elle permet à une structure habilitée de la Commission de la CEEAC d’exprimer, de justifier, de chiffrer, d’imputer et de faire approuver un besoin nécessitant l’utilisation de crédits budgétaires.

L’Expression de Besoin doit permettre de répondre notamment aux questions suivantes :

- Quel est le besoin à satisfaire ?
- Quelle structure exprime le besoin ?
- Dans quel objectif institutionnel s’inscrit-il ?
- S’agit-il d’un besoin relevant du PAP ou d’une dépense Hors PAP ?
- Quelle est la ligne budgétaire principale correspondant au besoin ?
- Quelles lignes budgétaires financeront effectivement la dépense ?
- Quels crédits sont disponibles ?
- Quel est le montant prévisionnel du besoin ?
- Quelle est sa justification ?
- Quelles pièces justificatives accompagnent la demande ?
- Quel circuit de validation doit être automatiquement appliqué ?

L’EB validée constitue l’acte initial permettant d’engager la dépense. Elle ne doit cependant produire aucun engagement budgétaire définitif avant son approbation selon le workflow applicable.

## 2. Principes fondamentaux

### 2.1. Un Budget unique par exercice

BUDGET-CEEAC considère qu’il existe un seul Budget pour un exercice budgétaire donné.

Le Programme Annuel de Performance (PAP) n’est pas un budget indépendant. Il constitue une composante du Budget.

Par conséquent :

- aucune référence séparée « Budget » et « PAP » ne doit être demandée à l’utilisateur pendant la saisie d’une EB ;
- le Budget applicable est déterminé automatiquement à partir de l’exercice budgétaire actif ;
- les lignes relevant du PAP apparaissent dans le même référentiel que les autres lignes budgétaires ;
- la nature PAP/Hors PAP est déterminée automatiquement à partir de la ligne budgétaire sélectionnée.

## 3. Principe de classification du besoin

Toute Expression de Besoin doit obligatoirement être rattachée à une ligne budgétaire principale. Cette ligne constitue la ligne de classification du besoin.

Elle détermine automatiquement :

- la nature du besoin ;
- son rattachement PAP ou Hors PAP ;
- le workflow applicable ;
- les règles de gestion correspondantes.

### 3.1. EB Hors PAP

Elle concerne principalement les dépenses de fonctionnement ou les dépenses n’étant pas rattachées à une activité du Programme Annuel de Performance.

Exemples :

- fournitures administratives ;
- abonnements ;
- entretien courant ;
- prestations générales ;
- déplacements non directement rattachés à une activité PAP ;
- dépenses courantes de fonctionnement.

### 3.2. EB PAP

Elle concerne une dépense liée à la mise en œuvre du Programme Annuel de Performance.

Elle doit être automatiquement rattachée à la chaîne de performance correspondante : Pilier > Axe > Produit > Sous-produit > Activité > Tâche, selon le niveau de détail défini dans le PAP.

## 4. Principe de distinction entre classification et imputation

### 4.1. Ligne de classification du besoin

Une EB possède une seule ligne budgétaire principale permettant d’identifier la nature du besoin, de déterminer son rattachement PAP/Hors PAP, de sélectionner le workflow et d’appliquer les règles de gestion correspondantes.

### 4.2. Lignes d’imputation

Le financement réel d’une Expression de Besoin peut, lorsque la réglementation et la structure budgétaire le permettent, être réparti sur une ou plusieurs lignes budgétaires.

Règle : 1 EB = 1 ligne principale de classification, mais éventuellement 1 EB = N lignes d’imputation budgétaire.

La somme des imputations doit obligatoirement être égale au montant total de l’Expression de Besoin.

## 5. Déclenchement de la procédure

La procédure commence lorsqu’un utilisateur habilité sélectionne : Chaîne de dépense > Expressions de Besoin > Nouvelle Expression de Besoin.

Le système identifie immédiatement :

- l’utilisateur connecté ;
- sa structure organisationnelle ;
- son service ;
- sa direction ;
- son département éventuel ;
- son profil ;
- son rôle ;
- l’exercice budgétaire actif ;
- le Budget actif ;
- ses habilitations ;
- les lignes budgétaires accessibles.

## 6. Étape 1 - Identification préalable de la ligne budgétaire

La première information métier demandée dans le formulaire doit être : « Ligne budgétaire du besoin ».

Cette sélection intervient avant la saisie détaillée de l’Expression de Besoin.

L’utilisateur ne choisit pas manuellement entre PAP et Hors PAP : le système détermine automatiquement cette qualification.

## 7. Étape 2 - Analyse automatique de la ligne sélectionnée

Après sélection de la ligne budgétaire, BUDGET-CEEAC interroge automatiquement le référentiel budgétaire et récupère notamment :

- exercice budgétaire ;
- chapitre ;
- article ;
- paragraphe ;
- code de la ligne ;
- libellé ;
- dotation initiale ;
- dotation révisée ;
- engagements en cours ;
- montants engagés ;
- liquidations ;
- paiements ;
- disponible budgétaire ;
- éventuelles réservations de crédits ;
- structure gestionnaire ;
- source de financement ;
- partenaire financier éventuel ;
- nature économique ;
- rattachement PAP éventuel.

Le système détermine ensuite automatiquement : PAP = OUI ou PAP = NON.

## 8. Étape 3 - Comportement spécifique pour une ligne PAP

Lorsque la ligne sélectionnée appartient au PAP, BUDGET-CEEAC affiche automatiquement les informations programmatiques associées. L’utilisateur ne recherche ni ne ressaisit manuellement les références du PAP.

Le système affiche notamment, selon le référentiel disponible :

- Pilier ;
- Axe stratégique ;
- objectif stratégique ;
- Produit ;
- Sous-produit ;
- résultat attendu ;
- Activité ;
- Tâche ;
- indicateurs associés ;
- unité de mesure ;
- cible annuelle ;
- responsable ;
- calendrier de réalisation ;
- localisation éventuelle ;
- coût programmé ;
- coût consommé ;
- montant disponible ;
- source de financement ;
- PTF éventuel.

Ces informations apparaissent avant le passage à l’étape suivante du formulaire afin de permettre à l’utilisateur de vérifier la cohérence du besoin avec l’activité programmée.

## 9. Contrôle de cohérence PAP

Pour une EB PAP, BUDGET-CEEAC vérifie automatiquement :

- que l’activité existe ;
- qu’elle appartient au PAP de l’exercice ;
- qu’elle est active ;
- que la ligne budgétaire est liée à cette activité ;
- que les crédits sont disponibles ;
- que le plafond programmé n’est pas dépassé ;
- que l’activité n’est pas clôturée ;
- que la structure initiatrice est autorisée à utiliser cette ligne.

En cas d’anomalie bloquante, la poursuite de la saisie est interdite et le système affiche un message explicite.

## 10. Étape 4 - Identification du demandeur

Les informations connues du système sont préremplies automatiquement :

- nom et prénom de l’initiateur ;
- matricule ;
- fonction ;
- service ;
- direction ;
- département ;
- structure initiatrice ;
- responsable hiérarchique ;
- date de création ;
- exercice budgétaire.

Ces informations ne sont modifiables que par les utilisateurs disposant des habilitations nécessaires.

## 11. Étape 5 - Description du besoin

### 11.1. Intitulé du besoin

Libellé court, précis et explicite.

### 11.2. Objet

Description synthétique de l’acquisition, de la prestation, du service ou de l’activité à financer.

### 11.3. Description détaillée

La description doit présenter :

- le besoin ;
- le contexte ;
- les quantités ;
- les caractéristiques principales ;
- les bénéficiaires ;
- le lieu ;
- la période ;
- les contraintes éventuelles.

### 11.4. Justification

L’utilisateur indique :

- pourquoi la dépense est nécessaire ;
- les objectifs recherchés ;
- les conséquences d’une non-réalisation ;
- la contribution du besoin au fonctionnement ou aux objectifs de la Commission.

## 12. Étape 6 - Niveau de priorité

L’initiateur indique le niveau de priorité :

- Normale ;
- Importante ;
- Urgente ;
- Critique.

Les demandes urgentes ou critiques comportent obligatoirement une justification. Le caractère urgent ne permet jamais de contourner les contrôles budgétaires ou le workflow d’approbation.

## 13. Étape 7 - Informations financières

L’utilisateur renseigne notamment :

- montant prévisionnel ;
- devise ;
- quantité ;
- prix unitaire estimatif, lorsque pertinent ;
- montant total estimatif ;
- taxes éventuelles ;
- autres coûts éventuels.

Le système recalcule automatiquement les montants.

La devise principale est celle définie dans le référentiel financier de la Commission, généralement le XAF, tout en permettant les opérations autorisées en devises.

## 14. Étape 8 - Imputation budgétaire

Après détermination de la ligne principale du besoin, le système prépare automatiquement l’imputation initiale.

### 14.1. Cas simple

Lorsque le besoin est financé intégralement par la ligne sélectionnée : Montant EB = Montant imputé sur la ligne principale. Aucune ventilation supplémentaire n’est nécessaire.

### 14.2. Cas d’imputation multiple

Lorsque le besoin peut être légalement réparti entre plusieurs lignes, l’utilisateur habilité peut ajouter des lignes d’imputation.

Pour chaque ligne, le système gère :

- ligne budgétaire ;
- libellé ;
- source de financement ;
- montant imputé ;
- disponible avant imputation ;
- disponible après imputation ;
- pourcentage de financement.

Contrôle bloquant : la somme des montants imputés doit être strictement égale au montant total de l’EB.

## 15. Contrôle de disponibilité budgétaire

Pour chaque ligne d’imputation, le système calcule : Crédit disponible = crédits ouverts + mouvements autorisés - engagements - réservations.

Une EB ne peut normalement pas être soumise si le montant imputé dépasse le crédit disponible.

Le système affiche clairement :

- crédit disponible ;
- montant demandé ;
- solde prévisionnel.

Les dépassements éventuels suivent une procédure spécifique de régularisation ou de modification budgétaire et ne sont jamais silencieusement autorisés.

## 16. Étape 9 - Fournisseur ou bénéficiaire éventuel

Lorsque l’information est connue au moment de l’Expression de Besoin, le système peut permettre d’indiquer :

- entreprise ;
- fournisseur ;
- prestataire ;
- consultant ;
- bénéficiaire potentiel.

L’EB ne doit pas imposer la désignation prématurée d’un fournisseur lorsqu’une procédure de mise en concurrence est nécessaire.

Le référentiel Entreprise doit être utilisé lorsqu’une entité est sélectionnée.

## 17. Étape 10 - Pièces justificatives

L’Expression de Besoin peut recevoir plusieurs pièces jointes, notamment :

- note technique ;
- devis ;
- facture pro forma ;
- termes de référence ;
- spécifications techniques ;
- planning ;
- décision ;
- autorisation ;
- correspondance ;
- note de service ;
- étude ;
- document de programmation ;
- autres justificatifs.

Les documents sont conservés dans la GED de BUDGET-CEEAC.

Chaque document est :

- identifié ;
- horodaté ;
- rattaché à l’EB ;
- historisé ;
- accessible selon les habilitations.

## 18. Étape 11 - Contrôles avant enregistrement

Avant enregistrement, le système vérifie notamment :

- présence de la ligne principale ;
- exercice actif ;
- existence du Budget ;
- classification PAP/Hors PAP ;
- cohérence du rattachement PAP ;
- description du besoin ;
- montant ;
- imputations ;
- disponibilité des crédits ;
- pièces obligatoires ;
- structure initiatrice ;
- habilitation de l’utilisateur ;
- règles de séparation des fonctions.

## 19. Enregistrement en brouillon

L’utilisateur peut enregistrer l’EB avec le statut BROUILLON.

Un brouillon :

- reste modifiable ;
- n’est pas transmis dans le workflow ;
- ne réserve pas définitivement les crédits ;
- apparaît dans « Mes brouillons » ;
- peut être repris ultérieurement ;
- conserve les pièces jointes ;
- conserve les imputations déjà saisies.

## 20. Soumission de l’Expression de Besoin

Lorsque tous les contrôles sont satisfaits, l’utilisateur sélectionne « Soumettre l’Expression de Besoin ».

Une boîte de confirmation présente au minimum :

- numéro EB ;
- objet ;
- montant ;
- ligne principale ;
- nature PAP/Hors PAP ;
- structure ;
- prochain acteur.

Après confirmation :

- l’EB change de statut ;
- elle devient non modifiable par l’initiateur sauf retour ;
- le workflow approprié est lancé ;
- une tâche est créée pour le prochain acteur ;
- une notification est envoyée ;
- l’opération est inscrite dans le journal d’audit.

## 21. Workflow EB Hors PAP

Pour les dépenses Hors PAP relevant notamment du fonctionnement, le circuit de référence est :

```text
Initiateur / Service compétent
    |
    v
Service des Moyens Généraux
    |
    v
Direction chargée des Ressources Humaines et Moyens Généraux
    |
    v
Secrétaire Général
    |
    v
Président de la Commission - Ordonnateur principal
    |
    v
Approbation définitive de l’EB
    |
    v
Génération automatique de l’Engagement
```

Selon les habilitations retenues, l’EB peut être initiée directement par un Expert ou le Chef de Service des Moyens Généraux.

## 22. Workflow EB PAP

Pour une dépense directement rattachée au PAP, le circuit de référence est :

```text
Expert / Chef de Service initiateur
    |
    v
Directeur
    |
    v
Commissaire du Département (département technique) OU Secrétaire Général (structure d’appui)
    |
    v
Président de la Commission - Ordonnateur principal
    |
    v
Approbation définitive
    |
    v
Génération automatique de l’Engagement
```

Le système détermine automatiquement le circuit selon l’organigramme et le rattachement de la structure initiatrice.

## 23. Actions disponibles pour un valideur

**Valider**

Accepter l’EB et la transmettre automatiquement au niveau suivant.

**Valider avec observation**

Valider en laissant une observation non bloquante.

**Retourner pour correction**

Renvoyer le dossier à l’acteur approprié. Le motif est obligatoire.

**Rejeter**

Mettre fin au traitement de l’EB. Le motif est obligatoire.

**Demander des informations complémentaires**

Suspendre temporairement le traitement dans l’attente d’une réponse ou d’une pièce.

## 24. Modification après retour

Une EB retournée redevient modifiable par l’acteur désigné.

Le système conserve :

- la version précédente ;
- les commentaires ;
- les modifications ;
- les auteurs ;
- les dates ;
- les pièces remplacées ou ajoutées.

Après correction, l’EB est resoumise.

Selon la nature de la modification, BUDGET-CEEAC détermine si le workflow reprend au niveau ayant demandé la correction ou depuis un niveau antérieur lorsque la modification affecte substantiellement le montant, l’imputation, la ligne budgétaire, le rattachement PAP ou l’objet de la demande.

## 25. Modification substantielle

Sont notamment considérées comme modifications substantielles :

- changement de ligne principale ;
- passage PAP vers Hors PAP ;
- passage Hors PAP vers PAP ;
- modification importante du montant ;
- changement de structure bénéficiaire ;
- changement d’activité PAP ;
- modification des sources de financement ;
- ajout ou suppression d’une ligne d’imputation ;
- changement substantiel de l’objet.

Une modification substantielle provoque une réévaluation automatique du workflow.

## 26. Approbation par l’Ordonnateur

Lorsque toutes les validations hiérarchiques sont terminées, l’EB est transmise automatiquement à l’Ordonnateur compétent.

Dans la procédure générale retenue, l’approbation finale de l’Expression de Besoin relève du Président de la Commission de la CEEAC - Ordonnateur principal.

L’Ordonnateur peut :

- approuver ;
- retourner ;
- rejeter.

L’approbation constitue la validation définitive du besoin.

## 27. Transformation automatique EB vers Engagement

Aucune nouvelle soumission manuelle ne doit être demandée après l’approbation définitive de l’EB.

```text
EB approuvée définitivement
    |
    v
Transformation automatique
    |
    v
Création de l’Engagement
    |
    v
Transmission automatique au Service Budget
```

L’Engagement généré reprend automatiquement :

- référence EB ;
- exercice ;
- structure ;
- objet ;
- bénéficiaire éventuel ;
- montant ;
- ligne principale ;
- imputations ;
- informations PAP ;
- source de financement ;
- pièces justificatives ;
- historique.

L’Engagement est alors placé dans la file de traitement de l’Expert Budget.

## 28. Numérotation

Chaque Expression de Besoin reçoit un numéro unique, par exemple : EB/CEEAC/2026/000001.

La numérotation est :

- automatique ;
- unique ;
- séquentielle ;
- non réutilisable ;
- liée à l’exercice budgétaire.

## 29. Statuts fonctionnels

Les principaux statuts sont :

- Brouillon ;
- À compléter ;
- Soumise ;
- En validation ;
- Retournée ;
- En attente d’information ;
- Rejetée ;
- Approuvée ;
- Transformée en Engagement ;
- Annulée ;
- Clôturée.

Un statut technique plus détaillé peut préciser le niveau courant du workflow.

## 30. Bandeau intelligent de suivi

Chaque page EB affiche un bandeau indiquant clairement :

- statut ;
- dernière action ;
- acteur ayant effectué l’action ;
- date et heure ;
- étape actuelle ;
- prochain acteur attendu ;
- délai éventuel ;
- observations ;
- niveau d’avancement.

Exemple : Dernière action : Validation du Directeur - 07/09/2026 à 14:32 | Étape actuelle : Validation N+1 | Acteur attendu : Commissaire du Département | Statut : En attente de validation.

## 31. Mes tâches

Lorsqu’une EB nécessite une action d’un utilisateur, elle apparaît automatiquement dans Tableau de bord > Mes tâches.

La liste est triée par date décroissante, les dossiers les plus récents apparaissant en premier.

Chaque tâche permet l’accès direct au dossier concerné.

## 32. Notifications

Les notifications sont générées notamment lors :

- de la création ;
- de la soumission ;
- d’une validation ;
- d’un retour ;
- d’un rejet ;
- d’une demande d’information ;
- d’une approbation ;
- de la transformation en Engagement.

Les notifications identifient :

- référence de l’EB ;
- objet ;
- montant ;
- action réalisée ;
- acteur ;
- action attendue ;
- lien vers le dossier.

## 33. Journal d’audit

Toute action doit être journalisée.

Le journal conserve notamment :

- utilisateur ;
- rôle ;
- action ;
- date ;
- heure ;
- adresse IP lorsque pertinente ;
- ancien état ;
- nouvel état ;
- ancienne valeur ;
- nouvelle valeur ;
- commentaire ;
- documents concernés.

Le journal n’est pas modifiable par un utilisateur métier.

## 34. Fiche officielle de l’Expression de Besoin

Après approbation définitive, BUDGET-CEEAC génère automatiquement une Fiche d’Expression de Besoin officielle au format PDF.

Cette version est :

- numérotée ;
- datée ;
- figée ;
- horodatée ;
- archivée dans la GED ;
- reliée à l’Engagement généré.

Elle comporte notamment :

- Identification : numéro EB, exercice, date, structure, initiateur ;
- Besoin : objet, description, justification, priorité ;
- Budget : ligne principale, imputations, montant, crédit disponible ;
- PAP, le cas échéant : Pilier, Axe, Produit, Sous-produit, Activité, Tâche, indicateurs ;
- Workflow : initiateur, validations, observations, approbation de l’Ordonnateur, dates et heures.

## 35. Tableau de bord des Expressions de Besoin

Le tableau de bord présente des indicateurs calculés sur les données réelles :

- Total EB ;
- Brouillons ;
- En validation ;
- Retournées ;
- Rejetées ;
- Approuvées ;
- PAP ;
- Hors PAP ;
- Montant total demandé ;
- Montant approuvé ;
- Montant rejeté ;
- taux d’approbation ;
- délai moyen de traitement.

Les cartes sont interactives et permettent d’afficher les dossiers correspondants.

## 36. Recherche et filtres

La liste des EB peut être filtrée par :

- exercice ;
- numéro ;
- période ;
- initiateur ;
- structure ;
- direction ;
- département ;
- statut ;
- PAP/Hors PAP ;
- ligne budgétaire ;
- activité PAP ;
- source de financement ;
- montant ;
- priorité ;
- étape du workflow.

## 37. Principales règles métier

| Code | Règle |
|---|---|
| RG-EB-001 | Une EB appartient à un seul exercice budgétaire. |
| RG-EB-002 | Le Budget est déterminé automatiquement à partir de l’exercice. |
| RG-EB-003 | Le PAP est une composante du Budget et non un budget séparé. |
| RG-EB-004 | Aucune référence PAP séparée ne doit être saisie manuellement. |
| RG-EB-005 | Une EB possède une ligne budgétaire principale unique. |
| RG-EB-006 | La ligne principale détermine automatiquement la classification PAP/Hors PAP. |
| RG-EB-007 | Une EB peut comporter plusieurs lignes d’imputation lorsque la réglementation l’autorise. |
| RG-EB-008 | La somme des imputations doit être strictement égale au montant de l’EB. |
| RG-EB-009 | Les informations PAP sont récupérées automatiquement depuis la ligne budgétaire. |
| RG-EB-010 | Une EB ne peut pas être soumise sans crédits disponibles, sauf procédure exceptionnelle explicitement autorisée. |
| RG-EB-011 | Toute modification substantielle entraîne une réévaluation du workflow. |
| RG-EB-012 | Toute action doit être historisée. |
| RG-EB-013 | Les pièces validées sont conservées dans la GED. |
| RG-EB-014 | L’approbation définitive déclenche automatiquement la création de l’Engagement. |
| RG-EB-015 | Aucune double saisie des données validées de l’EB ne doit être nécessaire au niveau Engagement. |

## 38. Workflow fonctionnel consolidé

### 38.1. Cas PAP

```text
Création EB
    |
    v
Sélection ligne budgétaire
    |
    v
Détection automatique PAP
    |
    v
Chargement automatique Pilier / Axe / Produit / Sous-produit / Activité / Tâche
    |
    v
Saisie du besoin
    |
    v
Imputation + contrôle crédits
    |
    v
Soumission
    |
    v
Expert / Chef de Service
    |
    v
Directeur
    |
    v
Commissaire ou Secrétaire Général
    |
    v
Président / Ordonnateur
    |
    v
Approbation définitive
    |
    v
Génération PDF EB
    |
    v
Transformation automatique
    |
    v
Engagement
    |
    v
Expert Budget
```

### 38.2. Cas Hors PAP

```text
Création EB
    |
    v
Sélection ligne budgétaire
    |
    v
Détection automatique Hors PAP
    |
    v
Saisie du besoin
    |
    v
Imputation + contrôle crédits
    |
    v
Service des Moyens Généraux
    |
    v
Direction RH / Moyens Généraux
    |
    v
Secrétaire Général
    |
    v
Président / Ordonnateur
    |
    v
Approbation définitive
    |
    v
Génération PDF EB
    |
    v
Transformation automatique
    |
    v
Engagement
    |
    v
Expert Budget
```

## 39. Résultat attendu

À l’issue de la procédure Expression de Besoin, BUDGET-CEEAC dispose d’un dossier :

- complet ;
- budgétairement imputé ;
- correctement classifié PAP/Hors PAP ;
- relié au Budget unique de l’exercice ;
- relié au PAP lorsque nécessaire ;
- vérifié par rapport aux crédits disponibles ;
- accompagné des pièces justificatives ;
- validé selon le circuit institutionnel ;
- approuvé par l’Ordonnateur ;
- totalement traçable ;
- archivé ;
- transformé automatiquement en Engagement.

La procédure garantit ainsi la séquence de gestion : besoin justifié > programmation > disponibilité des crédits > imputation correcte > validation > autorisation > engagement > traçabilité.
