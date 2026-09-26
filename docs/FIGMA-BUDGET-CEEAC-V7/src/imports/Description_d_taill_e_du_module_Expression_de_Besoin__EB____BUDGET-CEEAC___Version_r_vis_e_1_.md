# DESCRIPTION DÉTAILLÉE DU MODULE EXPRESSION DE BESOIN (EB)

## Application BUDGET-CEEAC

**Commission de la Communauté Économique des États de l’Afrique Centrale – CEEAC**

---

# 1. OBJET DU MODULE

Le module **Expression de Besoin (EB)** constitue le point d’entrée opérationnel de la chaîne de la dépense dans l’application **BUDGET-CEEAC**.

Il permet aux structures de la Commission de formaliser, justifier, chiffrer, imputer et soumettre leurs besoins en :

- biens ;
- services ;
- travaux ;
- équipements ;
- prestations intellectuelles ;
- études ;
- missions ;
- formations ;
- fournitures ;
- investissements ;
- autres dépenses autorisées par le Budget.

L’Expression de Besoin doit répondre aux questions essentielles suivantes :

- Qui exprime le besoin ?
- Quel est le besoin ?
- Pourquoi ce besoin doit-il être satisfait ?
- À quelle ligne budgétaire est-il rattaché ?
- Relève-t-il du PAP ou du fonctionnement Hors PAP ?
- Quelle activité ou quelle action budgétaire finance-t-il ?
- Quelles tâches concrètes doivent être réalisées ?
- Quel est son coût ?
- Les crédits nécessaires sont-ils disponibles ?
- Quelles pièces justifient la dépense ?
- Quels résultats sont attendus ?

Le module EB prépare ainsi la première étape du cycle :

**Expression de Besoin → Engagement → Liquidation → Ordonnancement → Paiement.**

---

# 2. OBJECTIFS DU MODULE

Le module doit permettre :

- la formalisation normalisée des besoins ;
- l’identification automatique de la structure initiatrice ;
- le rattachement obligatoire au Budget de l’exercice ;
- l’identification automatique PAP/Hors PAP ;
- l’exploitation des informations disponibles dans le Budget/PAP ;
- le complément des informations programmatiques absentes au moyen d’un référentiel dédié ;
- la décomposition d’une activité en tâches et sous-lignes ;
- l’imputation budgétaire ;
- le contrôle de disponibilité des crédits ;
- la justification du besoin ;
- la gestion des pièces justificatives ;
- la validation suivant le workflow institutionnel ;
- la traçabilité des décisions ;
- la génération automatique des documents officiels ;
- l’archivage dans la GED ;
- la transformation automatique de l’EB approuvée en Engagement.

---

# 3. POSITIONNEMENT DANS LA CHAÎNE DE DÉPENSE

Le processus général est :

**Budget adopté**

↓  

**Programmation / PAP**

↓  

**Expression de Besoin**

↓  

**Validation administrative**

↓  

**Approbation de l’Ordonnateur**

↓  

**Engagement**

↓  

**Liquidation**

↓  

**Ordonnancement**

↓  

**Paiement**

L’EB ne constitue pas encore une dépense exécutée.

Elle représente la formalisation officielle du besoin et permet de vérifier :

- sa pertinence ;
- sa conformité au Budget ;
- sa disponibilité financière ;
- sa justification ;
- son rattachement programmatique ;
- son autorisation institutionnelle.

---

# 4. PRINCIPES DE GESTION

## 4.1 Un besoin = une Expression de Besoin

Une EB correspond à un besoin cohérent et identifiable.

Elle peut contenir plusieurs :

- tâches ;
- articles ;
- prestations ;
- rubriques ;
- postes de dépenses ;

à condition qu’ils concourent au même besoin ou à la même activité.

---

## 4.2 Budget annuel unique

Le PAP n’est pas considéré comme un Budget distinct.

Le **Budget annuel de la CEEAC reste le référentiel financier unique de l’exercice**.

Le PAP correspond à la composante programmée, notamment d’investissement, du Budget.

L’utilisateur ne doit donc pas saisir manuellement :

- « PAP » ;
- « Hors PAP » ;

si cette information peut être déduite de la ligne budgétaire ou de son référentiel associé.

---

# 5. SÉLECTION DE LA LIGNE BUDGÉTAIRE

La saisie d’une EB commence obligatoirement par la sélection d’une **ligne budgétaire de référence**.

La recherche doit pouvoir se faire par :

- code ;
- libellé ;
- structure ;
- activité ;
- mot-clé.

Après sélection, le système récupère automatiquement les informations réellement disponibles dans le Budget importé.

Exemples :

- exercice ;
- code budgétaire ;
- libellé officiel ;
- montant voté ;
- structure ;
- classification ;
- chapitre ;
- article ;
- paragraphe ;
- nature de la dépense ;
- montant disponible ;
- classification PAP/Hors PAP lorsqu’elle est connue.

---

# 6. CAS D’UNE EXPRESSION DE BESOIN PAP

## 6.1 Principe général

Lorsqu’une ligne budgétaire relève du **PAP**, le système doit afficher les informations programmatiques nécessaires à la compréhension et au suivi du besoin.

Cependant, le Budget 2026 de la CEEAC ne comporte pas nécessairement toutes ces informations de manière exhaustive.

Le système doit donc distinguer deux catégories de données :

### A. Données effectivement disponibles dans le Budget/PAP

Ces données sont récupérées automatiquement telles qu’elles existent dans les documents officiels.

Elles peuvent notamment comprendre :

- code de la ligne ;
- libellé ;
- structure ;
- activité ;
- montant budgétisé ;
- classification PAP ;
- autres informations présentes dans le Budget.

Ces données sont :

> **héritées automatiquement et non modifiables depuis l’EB.**

---

## 6.2 Données programmatiques complémentaires

Lorsque certaines informations utiles ne sont pas présentes dans le Budget/PAP, elles sont récupérées depuis un :

# Référentiel d’enrichissement PAP

Ce référentiel est rattaché à la ligne budgétaire officielle.

Il peut contenir :

- pilier ;
- axe stratégique ;
- objectif général ;
- objectif spécifique ;
- produit ;
- sous-produit ;
- activité ;
- sous-activité ;
- tâches ;
- résultats attendus ;
- indicateurs ;
- unité de mesure ;
- valeur de référence ;
- cible ;
- source de vérification ;
- unité responsable ;
- structures associées ;
- bénéficiaires ;
- localisation ;
- période de réalisation ;
- date de début ;
- date de fin ;
- livrables attendus ;
- risques ;
- observations.

Ces informations ne modifient pas le Budget officiel.

Elles constituent des **métadonnées de gestion programmatiques** nécessaires à BUDGET-CEEAC.

---

# 7. ARCHITECTURE DU RÉFÉRENTIEL D’ENRICHISSEMENT PAP

Le système doit gérer la relation :

**Budget officiel**

→ **Ligne budgétaire**

→ **Fiche d’enrichissement PAP**

→ **Activité**

→ **Tâches**

→ **Indicateurs**

→ **Résultats attendus**

→ **Expression de Besoin**

---

## 7.1 Exemple

### Budget officiel

**Code : 203232**

**Libellé : Mise en place d’un système de suivi et de coordination régionale des projets énergétiques**

**Budget : 50 000 000 FCFA**

Le Budget peut ne pas donner les détails suivants.

Le référentiel peut alors compléter :

### Pilier

Intégration régionale et infrastructures.

### Axe

Développement et coordination des infrastructures énergétiques.

### Produit

Système régional de coordination énergétique renforcé.

### Activité

Mise en place du système de suivi régional.

### Tâches

1. Analyse des besoins ;
2. Conception fonctionnelle ;
3. Développement du système ;
4. Acquisition d’équipements ;
5. Formation ;
6. Déploiement.

### Indicateur

Pourcentage de projets énergétiques suivis électroniquement.

### Résultat attendu

Un système régional de suivi opérationnel est disponible.

---

# 8. GOUVERNANCE DES DONNÉES D’ENRICHISSEMENT

Les données programmatiques complémentaires ne doivent pas être considérées comme officielles automatiquement.

Elles doivent disposer d’un statut :

- Brouillon ;
- À compléter ;
- À valider ;
- Validée ;
- Révisée ;
- Archivée.

Une EB ne doit utiliser automatiquement comme référence que les informations :

> **validées dans le Référentiel d’enrichissement PAP.**

---

# 9. GESTION DES INFORMATIONS MANQUANTES

Lorsqu’une ligne PAP ne dispose pas encore de toutes les informations nécessaires, le système affiche une alerte :

> **Informations programmatiques incomplètes.**

Il doit indiquer les éléments manquants.

Exemple :

- Pilier : renseigné ;
- Axe : renseigné ;
- Produit : non renseigné ;
- Tâches : non renseignées ;
- Indicateurs : non renseignés ;
- Période : renseignée.

---

# 10. COMPLÉTION PROGRESSIVE DES LIGNES PAP

Le système doit permettre d’enrichir progressivement le référentiel.

Deux modes sont possibles.

## Mode 1 – Enrichissement préalable

Les structures compétentes renseignent les informations avant toute Expression de Besoin.

---

## Mode 2 – Enrichissement au premier usage

Lorsqu’une ligne est utilisée pour la première fois, l’utilisateur peut proposer des informations complémentaires.

Exemple :

> Ajouter les tâches de cette activité.

Les propositions ne deviennent pas immédiatement officielles.

Elles passent par un workflow de validation.

Une fois validées, elles deviennent réutilisables dans toutes les EB suivantes.

---

# 11. PRINCIPE DE NON-RESSAISIE

Une information programmative validée ne doit pas être ressaisie dans chaque Expression de Besoin.

Le système doit appliquer :

> **Saisir une fois – valider une fois – réutiliser partout.**

Une EB sélectionnant la même activité doit récupérer automatiquement :

- axe ;
- produit ;
- sous-produit ;
- activité ;
- tâches ;
- indicateurs ;
- résultats ;
- responsables ;
- période.

---

# 12. CAS D’UNE EXPRESSION DE BESOIN HORS PAP

Pour une ligne Hors PAP, le système récupère les informations financières et administratives disponibles.

Le besoin peut concerner notamment :

- fonctionnement courant ;
- fournitures ;
- abonnements ;
- entretien ;
- maintenance ;
- missions ;
- prestations ;
- consommables ;
- services généraux.

Le système n’impose pas les informations programmatiques propres au PAP.

Il peut toutefois utiliser des données complémentaires de gestion lorsque cela est pertinent :

- responsable ;
- centre de coût ;
- période ;
- destination ;
- justification.

---

# 13. DÉCOMPOSITION DU BESOIN EN SOUS-LIGNES

Une ligne budgétaire peut représenter une activité globale.

L’EB doit permettre de la décomposer en plusieurs rubriques.

Exemple :

### Activité

Développement et déploiement de BUDGET-CEEAC.

### Sous-lignes

| Désignation | Quantité | Unité | PU | Montant |
|---|---:|---|---:|---:|
| Analyse fonctionnelle | 1 | forfait | 2 000 000 | 2 000 000 |
| Développement backend | 1 | forfait | 4 000 000 | 4 000 000 |
| Développement frontend | 1 | forfait | 3 500 000 | 3 500 000 |
| Tests | 1 | forfait | 2 000 000 | 2 000 000 |
| Déploiement | 1 | forfait | 1 500 000 | 1 500 000 |
| Formation | 1 | forfait | 2 000 000 | 2 000 000 |

**Total EB : 15 000 000 FCFA**

---

# 14. RELATION ACTIVITÉ – TÂCHE – SOUS-LIGNE

Il faut distinguer :

### Activité

Élément de programmation budgétaire.

### Tâche

Composante opérationnelle de l’activité.

### Sous-ligne EB

Élément de chiffrage du besoin.

Une tâche peut correspondre :

- à une sous-ligne ;
- à plusieurs sous-lignes.

Exemple :

**Tâche : Formation**

peut être détaillée en :

- location de salle ;
- supports ;
- formateur ;
- restauration ;
- logistique.

---

# 15. STRUCTURE D’UNE SOUS-LIGNE

Chaque sous-ligne peut comporter :

- tâche associée ;
- désignation ;
- description ;
- quantité ;
- unité ;
- prix unitaire ;
- montant ;
- bénéficiaire ;
- lieu ;
- période ;
- observation.

Le calcul est automatique :

**Montant = Quantité × Prix unitaire**

---

# 16. IMPUTATION BUDGÉTAIRE

## 16.1 Ligne principale

La ligne sélectionnée en début d’EB sert de référence pour :

- classification du besoin ;
- activité ;
- contexte PAP ;
- contrôle budgétaire.

---

## 16.2 Imputation sur plusieurs lignes

Si la procédure budgétaire l’autorise, une EB peut répartir son coût sur plusieurs lignes.

Exemple :

| Ligne | Montant |
|---|---:|
| Ligne A | 6 000 000 |
| Ligne B | 4 000 000 |

Total :

**10 000 000 FCFA**

Le système exige :

> Total des imputations = Total de l’EB.

---

# 17. CONTRÔLE DU CRÉDIT

Pour chaque ligne, le système doit afficher :

- Budget initial ;
- ajustements ;
- Budget actualisé ;
- engagements ;
- liquidations ;
- paiements ;
- réservations ;
- disponible.

Exemple :

> Crédit disponible : 30 000 000 FCFA  
> Montant EB : 8 000 000 FCFA  
> Solde prévisionnel : 22 000 000 FCFA

---

# 18. FORMULAIRE EB

Le formulaire doit fonctionner sous forme d’assistant.

## Étape 1 – Ligne budgétaire

Recherche et sélection.

---

## Étape 2 – Contexte budgétaire

Affichage automatique :

- code ;
- libellé ;
- Budget ;
- disponible ;
- PAP/Hors PAP.

---

## Étape 3 – Contexte programmatique

Pour le PAP :

- informations disponibles dans le Budget ;
- informations issues du référentiel d’enrichissement ;
- état de complétude.

---

## Étape 4 – Description du besoin

- objet ;
- contexte ;
- justification ;
- urgence ;
- priorité ;
- résultats attendus.

---

## Étape 5 – Tâches et détails

L’utilisateur choisit éventuellement parmi les tâches du référentiel puis crée ses sous-lignes.

---

## Étape 6 – Imputation

Contrôle et répartition des montants.

---

## Étape 7 – Pièces jointes

Ajout des justificatifs.

---

## Étape 8 – Récapitulatif

Présentation de l’ensemble du dossier.

---

## Étape 9 – Soumission

Validation de la saisie et démarrage du workflow.

---

# 19. STRUCTURE INITIATRICE

Le système récupère automatiquement :

- département ;
- direction ;
- service ;
- utilisateur ;
- fonction.

Ces informations proviennent du référentiel organisationnel.

---

# 20. WORKFLOW PAP

Le workflow cible peut être :

**Expert / Chef de Service**

↓  

Création EB

↓  

**Directeur**

Validation N

↓  

**Commissaire**

pour un département technique

ou

**Secrétaire Général**

pour une structure d’appui

↓  

**Ordonnateur**

Approbation finale

↓  

**Engagement automatique**

---

# 21. WORKFLOW HORS PAP

Pour les besoins de fonctionnement :

**Expert / Chef de Service compétent**

↓  

**Directeur**

↓  

**Secrétaire Général**

↓  

**Ordonnateur**

↓  

**Engagement automatique**

Le moteur de workflow reste paramétrable.

---

# 22. ACTIONS DISPONIBLES

Selon les droits :

- Enregistrer ;
- Modifier ;
- Soumettre ;
- Valider ;
- Retourner ;
- Rejeter ;
- Approuver ;
- Annuler ;
- Dupliquer ;
- Consulter ;
- Télécharger ;
- Imprimer ;
- Commenter.

---

# 23. RETOUR POUR CORRECTION

Un retour doit obligatoirement préciser :

- motif ;
- observations ;
- acteur ;
- date ;
- champs éventuellement concernés.

L’ancienne version reste conservée.

---

# 24. REJET

Le rejet doit conserver :

- motif ;
- décisionnaire ;
- fonction ;
- date ;
- heure ;
- étape.

Une EB rejetée n’est pas transformée en Engagement.

---

# 25. NUMÉROTATION

Exemple :

**EB/2026/DSI/000127**

ou :

**CEEAC/EB/2026/000127**

La référence doit être unique.

---

# 26. STATUTS

- Brouillon ;
- À compléter ;
- Soumise ;
- En validation ;
- Retournée ;
- À corriger ;
- Validée ;
- En approbation ;
- Approuvée ;
- Rejetée ;
- Annulée ;
- Transformée en Engagement.

---

# 27. PIÈCES JUSTIFICATIVES

Peuvent notamment être joints :

- TDR ;
- devis ;
- facture pro forma ;
- spécifications techniques ;
- cahier des charges ;
- planning ;
- étude ;
- note justificative ;
- autorisation ;
- décision.

Les pièces obligatoires peuvent varier selon :

- montant ;
- nature ;
- procédure ;
- type de besoin.

---

# 28. INTÉGRATION GED

Chaque pièce est automatiquement intégrée à la GED.

Classement :

**Exercice → Budget → Dépenses → Expression de Besoin → Référence EB**

La GED conserve :

- fichier ;
- type ;
- version ;
- auteur ;
- date ;
- référence EB ;
- empreinte ;
- niveau de confidentialité.

---

# 29. DOCUMENT OFFICIEL EB

Après approbation, le système génère le PDF officiel contenant :

- identité CEEAC ;
- référence ;
- structure ;
- objet ;
- justification ;
- PAP/Hors PAP ;
- ligne budgétaire ;
- activité ;
- tâches ;
- informations programmatiques disponibles ;
- sous-lignes ;
- imputations ;
- montant ;
- disponibilité ;
- pièces ;
- validations ;
- QR Code ;
- date de génération.

---

# 30. DISTINCTION DANS LE PDF

Le document doit pouvoir distinguer clairement :

### Données budgétaires officielles

issues du Budget adopté.

### Données programmatiques complémentaires

issues du référentiel validé.

Cette distinction évite toute confusion entre :

- contenu du Budget ;
- informations de gestion ajoutées dans le système.

---

# 31. TRANSFORMATION AUTOMATIQUE EN ENGAGEMENT

Après approbation :

1. EB figée ;
2. PDF généré ;
3. archivage GED ;
4. Engagement créé ;
5. pièces transférées ;
6. imputations transférées ;
7. sous-lignes transférées ;
8. informations PAP transférées ;
9. acteurs notifiés.

---

# 32. DONNÉES TRANSMISES À L’ENGAGEMENT

- référence EB ;
- ligne budgétaire ;
- activité ;
- tâches ;
- objet ;
- montant ;
- sous-lignes ;
- imputations ;
- justification ;
- documents ;
- informations PAP ;
- historique des validations.

---

# 33. BANDEAU DE SUIVI

Chaque dossier affiche :

- statut ;
- dernière action ;
- acteur ;
- date ;
- prochaine étape ;
- acteur attendu ;
- délai.

---

# 34. TIMELINE

Exemple :

Création

→ Soumission

→ Validation Directeur

→ Validation N+1

→ Approbation

→ Engagement généré

---

# 35. NOTIFICATIONS

Notifications lors de :

- création ;
- soumission ;
- retour ;
- validation ;
- rejet ;
- approbation ;
- transformation ;
- retard.

---

# 36. TABLEAU DE BORD

KPI :

- EB totales ;
- PAP ;
- Hors PAP ;
- montant PAP ;
- montant Hors PAP ;
- brouillons ;
- à valider ;
- retournées ;
- rejetées ;
- approuvées ;
- en retard.

---

# 37. FILTRES

Par :

- exercice ;
- référence ;
- structure ;
- activité ;
- ligne ;
- PAP/Hors PAP ;
- statut ;
- montant ;
- utilisateur ;
- période.

---

# 38. CONTRÔLES FONCTIONNELS

Le système vérifie notamment :

- exercice ouvert ;
- ligne valide ;
- crédit disponible ;
- total EB ;
- total imputations ;
- cohérence PAP ;
- pièces obligatoires ;
- habilitations ;
- workflow applicable.

---

# 39. CONTRÔLE DE COMPLÉTUDE PAP

Pour une ligne PAP, le système calcule un niveau de complétude.

Exemple :

> **Complétude programmatique : 70 %**

- activité : oui ;
- tâche : oui ;
- résultat : oui ;
- indicateur : non ;
- cible : non ;
- période : oui.

---

# 40. POLITIQUE DE BLOCAGE

Toutes les données programmatiques ne doivent pas nécessairement être bloquantes.

Le système doit distinguer :

### Données obligatoires pour l’EB

Exemple :

- ligne ;
- activité ;
- objet ;
- montant ;
- justification.

### Données recommandées

Exemple :

- indicateurs ;
- cible ;
- bénéficiaires.

### Données obligatoires pour suivi-évaluation

Elles peuvent devenir obligatoires avant le démarrage effectif du suivi de l’activité.

---

# 41. JOURNAL D’AUDIT

Toutes les actions sont journalisées :

- création ;
- modification ;
- ajout de tâche ;
- imputation ;
- pièce jointe ;
- soumission ;
- validation ;
- rejet ;
- enrichissement PAP ;
- validation du référentiel.

---

# 42. DROITS

Exemples :

- `eb.create`
- `eb.view`
- `eb.update`
- `eb.submit`
- `eb.validate`
- `eb.approve`
- `eb.reject`
- `eb.cancel`
- `eb.export`

Pour le référentiel :

- `pap.enrich`
- `pap.validate`
- `pap.update_reference`

---

# 43. MODÈLE DE DONNÉES INDICATIF

## `expressions_besoin`

- id
- reference
- exercice_id
- ligne_budgetaire_id
- demandeur_id
- structure_id
- objet
- justification
- montant_total
- statut

## `expression_besoin_details`

- id
- expression_besoin_id
- task_id
- designation
- quantite
- unite
- prix_unitaire
- montant

## `pap_enrichissements`

- id
- exercice_id
- ligne_budgetaire_id
- pilier_id
- axe_id
- objectif_id
- produit_id
- sous_produit_id
- activite_id
- resultats_attendus
- responsable_id
- date_debut
- date_fin
- statut

## `pap_tasks`

- id
- pap_enrichissement_id
- libelle
- description
- ordre

## `pap_indicateurs`

- id
- pap_enrichissement_id
- libelle
- unite
- valeur_reference
- cible
- source_verification

---

# 44. INTÉGRATIONS

Le module EB communique avec :

- Budget ;
- PAP ;
- référentiel d’enrichissement ;
- référentiel organisationnel ;
- nomenclature budgétaire ;
- GED ;
- workflow ;
- notifications ;
- Engagement ;
- Suivi-évaluation ;
- Reporting ;
- Marchés ;
- audit.

---

# 45. ERGONOMIE

L’interface doit clairement distinguer :

### Informations officielles du Budget

affichées en lecture seule.

### Informations complémentaires du référentiel

affichées avec leur statut de validation.

### Informations propres à l’EB

modifiables par l’initiateur.

---

# 46. PRINCIPE VISUEL RECOMMANDÉ

Un panneau peut présenter :

## Budget officiel

Code : 203232  
Libellé : …  
Crédit : 50 000 000 FCFA

## Programmation complétée

Activité : …  
Tâches : 6  
Indicateurs : 2  
Statut : Validé

## Expression de Besoin

Montant demandé : 8 500 000 FCFA  
Disponible après EB : 41 500 000 FCFA

---

# 47. TRAÇABILITÉ DE LA SOURCE

Chaque donnée affichée peut être associée à une origine :

- **BUDGET** ;
- **PAP** ;
- **RÉFÉRENTIEL COMPLÉMENTAIRE** ;
- **EB**.

Cette information est essentielle pour garantir la fiabilité du système.

---

# 48. PRINCIPE DIRECTEUR

La règle fondamentale est :

> **Le système ne doit ni inventer ni altérer les informations du Budget officiel. Il doit compléter les données manquantes au moyen de référentiels de gestion validés, rattachés aux lignes budgétaires officielles.**

---

# 49. SYNTHÈSE DU PROCESSUS

**1. Sélection ligne budgétaire**

↓

**2. Lecture données Budget**

↓

**3. Détection PAP/Hors PAP**

↓

**4. Lecture Référentiel d’enrichissement**

↓

**5. Vérification de complétude**

↓

**6. Description du besoin**

↓

**7. Sélection/ajout des tâches**

↓

**8. Détail des sous-lignes**

↓

**9. Imputation**

↓

**10. Contrôle crédits**

↓

**11. Pièces justificatives**

↓

**12. Soumission**

↓

**13. Workflow**

↓

**14. Approbation**

↓

**15. PDF officiel**

↓

**16. GED**

↓

**17. Engagement automatique**

---

# 50. RÉSULTAT ATTENDU

Avec cette architecture, BUDGET-CEEAC peut exploiter un Budget 2026 actuellement moins détaillé sans devoir le modifier artificiellement.

Le système conserve :

- la **fidélité au Budget officiel** ;
- la **richesse fonctionnelle nécessaire à l’application** ;
- la **traçabilité de l’origine des données** ;
- la **possibilité d’enrichir progressivement le PAP** ;
- la **réutilisation automatique des informations validées** ;
- la **cohérence entre Budget, EB, chaîne de dépense et suivi-évaluation**.

L’Expression de Besoin devient ainsi le point où convergent :

**Budget officiel + programmation enrichie + besoin réel + imputation + justification + contrôle + workflow.**