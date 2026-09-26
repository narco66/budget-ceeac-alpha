# DESCRIPTION DÉTAILLÉE DU MODULE ORDONNANCEMENT  
## Application BUDGET-CEEAC

## 1. OBJET DU MODULE

Le module **ORDONNANCEMENT** constitue la quatrième grande étape de la chaîne d’exécution de la dépense dans BUDGET-CEEAC.

Il intervient après la validation définitive et le visa de la **Liquidation**.

Son rôle est de transformer une dette :

- constatée ;
- liquidée ;
- certifiée ;
- contrôlée ;
- reconnue comme exigible ;

en un **ordre formel de paiement adressé à l’Agence Comptable**.

L’Ordonnancement matérialise donc la décision de l’Ordonnateur de faire procéder au règlement de la dépense.

Il ne s’agit pas d’une nouvelle opération de saisie budgétaire.

Le module doit principalement permettre de :

- reprendre les données validées en amont ;
- vérifier que la Liquidation est régulière ;
- déterminer automatiquement l’autorité compétente pour ordonnancer ;
- produire l’Ordre de Paiement ;
- recueillir la validation ou la signature de l’Ordonnateur ;
- assurer la traçabilité ;
- transmettre automatiquement le dossier à l’Agence Comptable ;
- déclencher automatiquement l’étape Paiement.

---

# 2. POSITION DANS LA CHAÎNE DE DÉPENSE

La chaîne complète est :

**Expression de Besoin**

↓

**Engagement**

↓

**Liquidation**

↓

**Ordonnancement**

↓

**Paiement**

Le processus d’Ordonnancement doit être représenté comme suit :

**Liquidation visée**

↓

**Création automatique de l’Ordonnancement**

↓

**Contrôles préalables**

↓

**Détermination automatique de l’Ordonnateur compétent**

↓

**Présentation de l’Ordre de Paiement**

↓

**Validation / Signature**

↓

**Génération du document officiel**

↓

**Archivage GED**

↓

**Transmission automatique à l’Agence Comptable**

↓

**Création automatique du dossier de Paiement**

---

# 3. OBJECTIFS DU MODULE

Le module doit permettre de :

1. transformer automatiquement une Liquidation validée en dossier d’Ordonnancement ;
2. vérifier l’intégrité de la chaîne de dépense ;
3. déterminer l’autorité compétente ;
4. présenter à l’Ordonnateur un dossier synthétique et complet ;
5. permettre la validation, le retour ou le rejet ;
6. générer automatiquement l’Ordre de Paiement ;
7. sécuriser la signature ;
8. assurer la traçabilité des décisions ;
9. verrouiller les données financières déjà validées ;
10. transmettre automatiquement le dossier à l’Agence Comptable ;
11. générer automatiquement l’étape Paiement ;
12. intégrer tous les documents dans la GED ;
13. alimenter les tableaux de bord et le Reporting.

---

# 4. PRINCIPE FONDAMENTAL : PAS DE RESSAISIE

L’Ordonnancement doit être généré automatiquement à partir de la Liquidation définitivement visée.

Le système doit reprendre automatiquement :

- Expression de Besoin source ;
- Engagement source ;
- Liquidation source ;
- exercice budgétaire ;
- structure initiatrice ;
- objet ;
- bénéficiaire ;
- fournisseur ;
- ligne budgétaire ;
- imputations ;
- montant engagé ;
- montant liquidé ;
- retenues ;
- montant net à payer ;
- informations fiscales ;
- marché ou contrat ;
- données PAP ;
- certificat de service fait ;
- pièces justificatives ;
- visa du Contrôleur Financier ;
- historique des validations.

Aucune donnée financière déjà validée ne doit être ressaisie manuellement.

---

# 5. IDENTIFICATION DE L’ORDONNANCEMENT

Chaque Ordonnancement doit disposer d’une référence unique générée automatiquement.

Exemple :

**ORD-2026-000184**

ou, selon la nomenclature documentaire retenue :

**OP-2026-000184**

La fiche doit afficher clairement les relations :

**Ordonnancement : ORD-2026-000184**

**Liquidation : LIQ-2026-000167**

**Engagement : ENG-2026-000142**

**Expression de Besoin : EB-2026-000119**

---

# 6. CRÉATION AUTOMATIQUE

Après visa de la Liquidation, le système doit automatiquement :

1. clôturer l’étape Liquidation ;
2. générer les documents définitifs de Liquidation ;
3. archiver les documents dans la GED ;
4. créer l’Ordonnancement ;
5. reprendre les informations nécessaires ;
6. déterminer l’Ordonnateur compétent ;
7. affecter le dossier à sa file de traitement ;
8. générer les notifications ;
9. journaliser la transition.

Cette opération doit être transactionnelle.

Il ne doit jamais exister une Liquidation déclarée transformée sans Ordonnancement effectivement créé.

---

# 7. AUTORITÉ D’ORDONNANCEMENT

BUDGET-CEEAC doit déterminer automatiquement l’Ordonnateur compétent en fonction des règles de délégation en vigueur.

Dans la configuration fonctionnelle actuellement retenue :

### Montant inférieur ou égal à 5 000 000 FCFA

**Secrétaire Général**

agissant en qualité d’**Ordonnateur délégué**.

### Montant supérieur à 5 000 000 FCFA

**Président de la Commission**

agissant en qualité d’**Ordonnateur principal**.

Cette règle doit être **paramétrable** afin de permettre une évolution future des seuils ou délégations sans modification du code métier.

---

# 8. MOTEUR DE DÉTERMINATION DE L’ORDONNATEUR

Le système doit prendre en compte notamment :

- montant net ordonnancé ;
- exercice ;
- type de dépense ;
- délégation active ;
- éventuelles exceptions réglementaires ;
- suppléances ;
- période de validité de la délégation.

Le résultat doit apparaître clairement :

**Ordonnateur compétent**

Secrétaire Général

**Fondement**

Délégation d’ordonnancement – Montant ≤ 5 000 000 FCFA

---

# 9. GESTION DES DÉLÉGATIONS

Créer un référentiel des délégations permettant de définir :

- délégant ;
- délégataire ;
- fonction ;
- seuil ;
- type de dépenses ;
- période de validité ;
- date de début ;
- date de fin ;
- document justificatif ;
- statut.

Le moteur doit utiliser uniquement les délégations actives.

---

# 10. TABLEAU DE BORD ORDONNANCEMENT

Le module doit disposer d’un tableau de bord spécifique.

Prévoir notamment :

### Dossiers

- Tous les Ordonnancements ;
- À traiter ;
- À vérifier ;
- À signer ;
- Retournés ;
- Rejetés ;
- Signés ;
- Transmis à l’Agence Comptable ;
- Transformés en Paiement.

### Montants

- montant total ordonnancé ;
- montant ordonnancé du mois ;
- PAP ;
- Hors PAP ;
- ordonnancements SG ;
- ordonnancements Président ;
- montant en attente de signature.

---

# 11. CARTES KPI

Les cartes doivent être interactives.

Exemples :

**À signer**

12 dossiers

**Montant**

38 450 000 FCFA

---

**Signés aujourd’hui**

7 dossiers

**Montant**

21 800 000 FCFA

---

**Transmis à l’Agence Comptable**

43 dossiers

**Montant**

126 500 000 FCFA

---

# 12. LISTE DES ORDONNANCEMENTS

La page doit afficher notamment :

| Champ | Description |
|---|---|
| Référence | Numéro ORD/OP |
| Liquidation | Référence LIQ |
| Engagement | Référence ENG |
| EB | Référence EB |
| Date | Date de création |
| Objet | Objet de la dépense |
| Bénéficiaire | Créancier |
| Structure | Unité initiatrice |
| PAP/Hors PAP | Classification |
| Montant brut | Montant liquidé |
| Retenues | Total retenues |
| Net à payer | Montant à ordonnancer |
| Ordonnateur | Autorité compétente |
| Statut | État |
| Acteur attendu | Prochain intervenant |

---

# 13. FILTRES

Prévoir :

- exercice ;
- référence ;
- bénéficiaire ;
- structure ;
- PAP/Hors PAP ;
- Ordonnateur ;
- statut ;
- période ;
- ligne budgétaire ;
- montant ;
- marché ;
- date de signature.

---

# 14. STATUTS DU MODULE

Prévoir notamment :

- Généré ;
- En préparation ;
- À vérifier ;
- À signer ;
- En attente Ordonnateur ;
- Retourné ;
- Rejeté ;
- Signé ;
- Transmis à l’Agence Comptable ;
- Pris en charge par l’Agence Comptable ;
- Transformé en Paiement ;
- Annulé.

---

# 15. PAGE DÉTAIL DE L’ORDONNANCEMENT

La fiche doit permettre à l’Ordonnateur de comprendre le dossier sans parcourir toute la chaîne précédente.

Organisation recommandée :

### Synthèse

### Liquidation source

### Situation budgétaire

### Bénéficiaire

### Factures

### Retenues et net à payer

### PAP

### Marché / Contrat

### Pièces justificatives

### Contrôles

### Workflow

### Historique

### Documents générés

### Commentaires

---

# 16. BANDEAU DE SUIVI

Exemple :

**ÉTAPE ACTUELLE**

Signature de l’Ordre de Paiement

**DERNIÈRE ACTION**

Liquidation visée par le Contrôleur Financier

**ACTEUR ATTENDU**

Secrétaire Général – Ordonnateur délégué

**PROCHAINE ÉTAPE**

Transmission automatique à l’Agence Comptable

---

# 17. CARTE FINANCIÈRE DE SYNTHÈSE

Afficher clairement :

**Montant engagé**

10 000 000 FCFA

**Montant liquidé brut**

9 500 000 FCFA

**Retenues**

750 000 FCFA

**NET À ORDONNANCER**

8 750 000 FCFA

Cette information doit être particulièrement visible.

---

# 18. CONTRÔLES AVANT ORDONNANCEMENT

Le système doit vérifier automatiquement :

✓ Liquidation visée

✓ Service fait certifié

✓ Bénéficiaire valide

✓ Facture valide

✓ Montant liquidé cohérent

✓ Retenues calculées

✓ Imputation valide

✓ Exercice ouvert

✓ Ordonnateur déterminé

✓ Pièces obligatoires présentes

✓ Absence d’Ordre de Paiement déjà généré pour la même Liquidation

---

# 19. CHECKLIST DE CONFORMITÉ

Créer une zone de contrôle :

# CONTRÔLES AVANT SIGNATURE

Exemple :

✓ Engagement régulièrement visé

✓ Liquidation régulièrement visée

✓ Service fait certifié

✓ Pièces justificatives complètes

✓ Montant net déterminé

✓ Bénéficiaire identifié

✓ Coordonnées bancaires disponibles

✓ Imputation conforme

✓ Ordonnateur compétent identifié

---

# 20. VUE SYNTHÉTIQUE POUR L’ORDONNATEUR

L’Ordonnateur ne doit pas être obligé de parcourir de nombreux onglets pour prendre sa décision.

Créer un écran de décision synthétique affichant :

- objet ;
- structure ;
- bénéficiaire ;
- montant ;
- budget ;
- Liquidation ;
- certification ;
- visa ;
- marché éventuel ;
- anomalies ;
- pièces importantes.

Puis les actions :

**Signer**

**Retourner**

**Rejeter**

**Voir le dossier complet**

---

# 21. SIGNATURE DE L’ORDRE DE PAIEMENT

La signature doit être une action formelle.

La fenêtre de signature doit rappeler :

**Référence**

**Bénéficiaire**

**Objet**

**Net à payer**

**Imputation**

**Liquidation**

**Ordonnateur**

Puis :

**Je confirme l’ordonnancement de cette dépense.**

---

# 22. SIGNATURE ÉLECTRONIQUE

Le système doit être conçu pour permettre :

- signature électronique interne ;
- signature qualifiée si déployée ;
- validation avec authentification renforcée ;
- horodatage ;
- certificat numérique ;
- empreinte documentaire.

Le niveau exact dépendra de l’infrastructure retenue.

---

# 23. DONNÉES DE SIGNATURE

Enregistrer notamment :

- signataire ;
- fonction ;
- date ;
- heure ;
- référence de signature ;
- adresse ou contexte technique si nécessaire ;
- empreinte du document ;
- version signée.

---

# 24. RETOUR DU DOSSIER

L’Ordonnateur doit pouvoir retourner le dossier lorsqu’une correction est possible.

Exiger :

- motif ;
- commentaire ;
- étape destinataire ;
- éléments concernés.

Exemple :

**Retour vers : Liquidation**

Motif :

« Montant de la retenue contractuelle à vérifier. »

Le système doit orienter le dossier vers le bon acteur.

---

# 25. REJET

Le rejet doit être distinct du retour.

Exiger :

- motif ;
- référence ;
- commentaire ;
- conséquences.

Un rejet doit déclencher les règles nécessaires sur les étapes antérieures.

---

# 26. BÉNÉFICIAIRE

La fiche doit afficher :

- raison sociale ;
- type ;
- identifiant fiscal ;
- adresse ;
- coordonnées ;
- banque ;
- IBAN/RIB ou référence bancaire adaptée ;
- statut ;
- conformité.

Les informations doivent provenir du référentiel des tiers.

---

# 27. CONTRÔLE DES COORDONNÉES BANCAIRES

Avant transmission au Paiement, le système doit vérifier :

- compte renseigné ;
- compte actif ;
- banque renseignée ;
- bénéficiaire correspondant ;
- éventuelle validation préalable.

Toute modification tardive doit être tracée.

---

# 28. FACTURES

Afficher notamment :

- numéro facture ;
- date ;
- montant brut ;
- taxes ;
- retenues ;
- net ;
- document associé ;
- statut.

Une facture déjà totalement ordonnancée ne doit pas être réutilisée.

---

# 29. RETENUES

Afficher une synthèse :

| Retenue | Base | Taux | Montant |
|---|---:|---:|---:|
| Retenue fiscale | 5 000 000 | 5 % | 250 000 |
| Garantie | 5 000 000 | 5 % | 250 000 |

**Total retenues : 500 000 FCFA**

**Net à payer : 4 500 000 FCFA**

---

# 30. IMPUTATIONS

Afficher les imputations utilisées.

| Ligne | Libellé | Montant liquidé | Montant ordonnancé |
|---|---|---:|---:|

Les montants ordonnancés doivent rester cohérents avec la Liquidation.

---

# 31. ORDONNANCEMENT MULTI-IMPUTATIONS

Si une Liquidation comporte plusieurs imputations, l’Ordonnancement doit les conserver.

Le système doit contrôler :

**Total des imputations = montant brut ou montant de référence défini**

selon la règle comptable utilisée.

---

# 32. LIQUIDATIONS PARTIELLES

Le module doit conserver la relation avec les Liquidations partielles.

Exemple :

**Engagement : 20 000 000 FCFA**

**LIQ 1 : 8 000 000**

→ ORD 1

**LIQ 2 : 7 000 000**

→ ORD 2

Le système doit afficher l’historique cumulé.

---

# 33. ORDONNANCEMENT PARTIEL

Lorsque la réglementation l’autorise, un montant inférieur à la Liquidation peut exceptionnellement être ordonnancé.

Cette situation doit :

- être explicitement autorisée ;
- être motivée ;
- laisser apparaître un solde ;
- suivre un workflow spécifique.

Le processus nominal doit rester :

**Liquidation visée → Ordonnancement correspondant**

---

# 34. PAP

Pour un dossier PAP, afficher :

- pilier ;
- axe ;
- objectif ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateurs ;
- réalisation physique ;
- engagement ;
- liquidation ;
- ordonnancement ;
- taux d’exécution.

---

# 35. COMPARAISON DES ÉTAPES FINANCIÈRES

Créer une visualisation :

**Budget**

100 %

↓

**Engagé**

72 %

↓

**Liquidé**

55 %

↓

**Ordonnancé**

48 %

↓

**Payé**

35 %

Cette représentation doit alimenter les tableaux de bord du PAP.

---

# 36. MARCHÉ / CONTRAT

Afficher :

- référence ;
- titulaire ;
- montant ;
- avenants ;
- exécuté ;
- liquidé ;
- ordonnancé ;
- solde ;
- échéance.

---

# 37. PIÈCES JUSTIFICATIVES

Le module doit hériter automatiquement de toutes les pièces utiles.

Exemples :

- EB approuvée ;
- Engagement visé ;
- facture ;
- bon de livraison ;
- PV ;
- certificat de service fait ;
- contrat ;
- marché ;
- fiche de Liquidation ;
- visa du Contrôleur Financier ;
- justificatifs fiscaux.

---

# 38. CHECKLIST DOCUMENTAIRE

Exemple :

✓ EB approuvée

✓ Engagement visé

✓ Facture

✓ Service fait

✓ Liquidation visée

✓ Pièce contractuelle

✓ Coordonnées bancaires

Le système doit bloquer la signature si une pièce juridiquement obligatoire manque.

---

# 39. DOCUMENT PRINCIPAL : ORDRE DE PAIEMENT

Le système doit générer automatiquement l’**Ordre de Paiement (OP)**.

Le document doit comprendre notamment :

- logo CEEAC ;
- exercice ;
- numéro OP ;
- référence EB ;
- référence Engagement ;
- référence Liquidation ;
- bénéficiaire ;
- adresse ;
- banque ;
- compte ;
- objet ;
- montant brut ;
- retenues ;
- net à payer ;
- montant en lettres ;
- imputation ;
- références contractuelles ;
- Ordonnateur ;
- signature ;
- date ;
- QR Code ou identifiant de vérification.

---

# 40. MONTANT EN LETTRES

Le système doit convertir automatiquement le net à payer en lettres.

Exemple :

**4 750 000 FCFA**

devient :

**Quatre millions sept cent cinquante mille francs CFA**

Cette donnée doit être générée automatiquement.

---

# 41. AUTRES DOCUMENTS

Prévoir notamment :

- fiche d’Ordonnancement ;
- Ordre de Paiement ;
- bordereau de transmission ;
- fiche de contrôle ;
- avis de retour ;
- fiche de rejet ;
- document d’annulation ;
- état récapitulatif.

---

# 42. GÉNÉRATION PDF

Après signature, le PDF officiel doit être figé.

Il doit comporter :

- numéro de version ;
- horodatage ;
- empreinte ;
- signature ;
- identité du signataire.

---

# 43. GED

Tous les documents générés ou importés doivent être automatiquement archivés.

Classement recommandé :

**Exercice**

→ **Chaîne de dépense**

→ **Ordonnancement**

→ **Référence ORD**

---

# 44. TRANSMISSION AUTOMATIQUE À L’AGENCE COMPTABLE

Après signature définitive de l’OP :

**ORDRE DE PAIEMENT SIGNÉ**

↓

**Transmission automatique**

↓

**Agence Comptable**

Aucun bouton manuel supplémentaire ne doit être nécessaire dans le processus normal.

---

# 45. CRÉATION AUTOMATIQUE DU PAIEMENT

La signature de l’Ordonnancement doit déclencher :

1. verrouillage de l’Ordonnancement ;
2. génération du PDF ;
3. archivage GED ;
4. création du dossier Paiement ;
5. reprise des données ;
6. transmission à l’Agence Comptable ;
7. notification des agents concernés.

---

# 46. DONNÉES TRANSMISES AU PAIEMENT

Le module Paiement doit recevoir notamment :

- EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- OP ;
- bénéficiaire ;
- coordonnées bancaires ;
- montant brut ;
- retenues ;
- net à payer ;
- imputation ;
- facture ;
- marché ;
- pièces ;
- signatures ;
- historique essentiel.

---

# 47. AGENCE COMPTABLE

Le dossier doit apparaître automatiquement dans la file de travail des acteurs autorisés de l’Agence Comptable.

Selon l’organisation fonctionnelle :

- Comptable ;
- Chef Comptable ;
- Agent Comptable.

L’Ordonnateur doit pouvoir voir :

**Transmis à l’Agence Comptable**

sans pouvoir modifier le dossier signé.

---

# 48. ACCUSÉ DE TRANSMISSION

Le système doit enregistrer :

- date d’envoi ;
- heure ;
- dossier ;
- destinataire ;
- statut.

Puis, si possible :

- date de réception ;
- acteur ayant pris en charge ;
- date de prise en charge.

---

# 49. MES TÂCHES

Le module doit alimenter automatiquement « Mes tâches ».

Exemple :

**ORD-2026-000184**

Objet : Acquisition de matériels informatiques

**4 750 000 FCFA**

Action attendue :

**Signer l’Ordre de Paiement**

Échéance :

**Aujourd’hui**

---

# 50. NOTIFICATIONS

Prévoir notamment :

- Ordonnancement généré ;
- dossier à vérifier ;
- signature requise ;
- dossier retourné ;
- rejet ;
- OP signé ;
- dossier transmis à l’Agence Comptable ;
- Paiement créé ;
- dossier pris en charge.

---

# 51. HISTORIQUE

Créer une timeline complète.

Exemple :

**17/09/2026 – 10:30**

Liquidation visée

**17/09/2026 – 10:31**

Ordonnancement généré automatiquement

**17/09/2026 – 10:32**

Ordonnateur déterminé : Secrétaire Général

**17/09/2026 – 14:20**

Ordre de Paiement signé

**17/09/2026 – 14:21**

PDF officiel généré

**17/09/2026 – 14:22**

Transmis automatiquement à l’Agence Comptable

**17/09/2026 – 14:22**

Dossier Paiement créé

---

# 52. JOURNAL D’AUDIT

Toutes les actions doivent être journalisées.

Conserver :

- utilisateur ;
- rôle ;
- date ;
- heure ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- signature ;
- événement système ;
- document.

---

# 53. CONTRÔLE DE DUPLICATION

Le système doit empêcher :

- deux OP actifs pour la même Liquidation complète ;
- duplication accidentelle d’Ordonnancement ;
- double transmission ;
- double création du Paiement.

---

# 54. ANNULATION

Un Ordonnancement signé ne doit pas être supprimé.

Toute annulation doit suivre une procédure formelle.

Elle doit comporter :

- motif ;
- demandeur ;
- autorité ;
- date ;
- document justificatif ;
- impact sur le Paiement ;
- impact comptable éventuel.

---

# 55. RÉVOCATION AVANT PAIEMENT

Si l’OP doit être retiré avant exécution du paiement, le système doit gérer une procédure spécifique de :

**Révocation / Annulation d’Ordre de Paiement**

avec traçabilité complète.

---

# 56. MODIFICATION

Avant signature, certaines informations administratives peuvent éventuellement être corrigées selon les droits.

Les données financières issues de la Liquidation doivent rester verrouillées.

Après signature :

**Aucune modification directe.**

---

# 57. RÉÉMISSION

Si un document doit être réémis après annulation ou erreur formelle, le système doit :

- conserver l’ancienne version ;
- attribuer une nouvelle référence ou version selon règle ;
- conserver le motif ;
- maintenir l’historique complet.

---

# 58. SÉPARATION DES FONCTIONS

Le système doit respecter la distinction entre :

- service initiateur ;
- Budget ;
- Contrôleur Financier ;
- Ordonnateur ;
- Agence Comptable.

L’Ordonnateur ne doit pas exercer les fonctions de paiement dans le même workflow lorsque les règles de séparation des fonctions l’interdisent.

---

# 59. HABILITATIONS

Les droits doivent être calculés selon :

- rôle ;
- fonction ;
- montant ;
- délégation ;
- statut ;
- exercice ;
- structure ;
- étape.

---

# 60. SUPPLÉANCE

Le système doit pouvoir gérer l’absence d’un Ordonnateur.

Prévoir :

- titulaire ;
- suppléant ;
- période ;
- fondement juridique ;
- date de début ;
- date de fin.

Le système doit automatiquement identifier le signataire habilité.

---

# 61. CONTRÔLE DU SEUIL

Avant présentation du dossier, contrôler automatiquement :

**Montant net à ordonnancer**

puis déterminer :

### ≤ 5 000 000 FCFA

Secrétaire Général

### > 5 000 000 FCFA

Président de la Commission

Afficher une alerte en cas d’incohérence entre montant et signataire.

---

# 62. RÈGLE DE PARAMÉTRAGE

Le seuil de 5 000 000 FCFA ne doit pas être codé en dur.

Créer un paramètre :

**Seuil Ordonnateur délégué**

Valeur actuelle :

**5 000 000 FCFA**

Avec :

- date d’effet ;
- texte de référence ;
- statut ;
- historique.

---

# 63. REPORTING

Le module doit alimenter le Reporting avec :

- montant ordonnancé ;
- nombre d’OP ;
- PAP/Hors PAP ;
- structure ;
- bénéficiaire ;
- ligne budgétaire ;
- Ordonnateur ;
- période ;
- délai ;
- retours ;
- rejets ;
- OP en attente ;
- OP transmis.

---

# 64. KPI

### Taux d’ordonnancement

**Montant ordonnancé / Montant liquidé × 100**

### Délai moyen d’ordonnancement

**Date signature OP – Date visa Liquidation**

### Montant en attente

Somme des dossiers non signés.

### Taux de retour

**Dossiers retournés / dossiers soumis à l’Ordonnateur × 100**

---

# 65. SUIVI BUDGÉTAIRE

Afficher notamment :

**Budget révisé**

↓

**Engagé**

↓

**Liquidé**

↓

**Ordonnancé**

↓

**Payé**

Ces données doivent alimenter les tableaux de bord de l’exercice.

---

# 66. SUIVI PAP

Pour chaque activité PAP, permettre de visualiser :

- budget ;
- engagement ;
- liquidation ;
- ordonnancement ;
- paiement ;
- réalisation physique ;
- écarts.

---

# 67. DÉLAIS DE TRAITEMENT

Mesurer :

- temps entre Liquidation et Ordonnancement ;
- temps en attente de signature ;
- temps avant transmission à l’Agence Comptable.

---

# 68. ALERTES

Exemples :

**Ordre de Paiement en attente de signature depuis 48 heures**

**Délégation expirée**

**Coordonnées bancaires incomplètes**

**Pièce obligatoire manquante**

**Ordonnateur non disponible**

---

# 69. ESCALADES

Prévoir :

- rappel ;
- alerte ;
- escalade vers autorité compétente.

---

# 70. RECHERCHE GLOBALE

L’Ordonnancement doit être retrouvé par :

- référence ORD ;
- numéro OP ;
- Liquidation ;
- Engagement ;
- EB ;
- bénéficiaire ;
- montant ;
- structure ;
- facture ;
- marché.

---

# 71. EXPORTS

Prévoir :

- PDF ;
- Excel ;
- CSV.

---

# 72. INTEROPÉRABILITÉ

Le module doit pouvoir exposer des données aux :

- systèmes comptables ;
- outils BI ;
- ERP ;
- systèmes d’audit ;
- plateformes financières.

---

# 73. SÉCURITÉ

Prévoir notamment :

- RBAC ;
- journalisation ;
- séparation des fonctions ;
- authentification renforcée ;
- contrôle d’intégrité ;
- horodatage ;
- protection des signatures ;
- protection des PDF signés.

---

# 74. INTÉGRITÉ DOCUMENTAIRE

Le système doit pouvoir calculer une empreinte des documents officiels.

Toute altération après signature doit pouvoir être détectée.

---

# 75. ÉTATS EXCEPTIONNELS

Prévoir :

- Liquidation non visée ;
- montant incohérent ;
- délégation expirée ;
- Ordonnateur indisponible ;
- bénéficiaire bloqué ;
- compte bancaire manquant ;
- exercice clôturé ;
- pièce manquante ;
- doublon OP ;
- erreur de génération PDF ;
- erreur de transmission à l’Agence Comptable.

---

# 76. GESTION D’UNE ERREUR DE TRANSMISSION

Si l’Ordonnancement est signé mais que la transmission technique vers l’Agence Comptable échoue :

- ne pas annuler l’OP ;
- conserver le statut signé ;
- afficher « Transmission en erreur » ;
- permettre une reprise technique idempotente ;
- journaliser chaque tentative.

---

# 77. TRANSACTIONNALITÉ

La transition :

**Ordonnancement signé → Paiement créé**

doit être sécurisée.

Elle doit empêcher :

- perte de dossier ;
- création multiple ;
- statut incohérent.

---

# 78. OUTBOX / MÉCANISME FIABLE DE TRANSITION

Pour l’implémentation technique, prévoir un mécanisme transactionnel fiable permettant de garantir que les événements :

- signature ;
- génération documentaire ;
- archivage GED ;
- création Paiement ;
- notification ;

soient traités sans duplication.

---

# 79. INTERFACE UTILISATEUR

Le design doit rester cohérent avec :

- Expression de Besoin ;
- Engagement ;
- Liquidation.

Prévoir :

- breadcrumb ;
- titre ;
- référence ;
- badges ;
- carte financière ;
- workflow banner ;
- onglets ;
- timeline ;
- documents ;
- zone de décision.

---

# 80. ACTIONS CONTEXTUELLES

### Dossier à signer

**Signer**

**Retourner**

**Rejeter**

### Dossier signé

**Voir OP**

**Télécharger**

**Voir transmission**

Aucune action de modification ne doit être proposée après signature.

---

# 81. DESIGN UX

Le module doit être particulièrement optimisé pour les décideurs.

L’Ordonnateur doit pouvoir prendre une décision rapide sans perdre l’accès au détail.

Privilégier une UX en deux niveaux :

### Niveau 1 — Décision

Synthèse exécutive.

### Niveau 2 — Justification

Accès au dossier complet.

---

# 82. PAGE DE DÉCISION

Présenter idéalement :

### Dossier

Référence – Objet – Structure

### Bénéficiaire

Nom – compte – conformité

### Montants

Engagé – Liquidé – Retenues – Net

### Contrôles

Tous les contrôles clés

### Documents essentiels

Facture – Service fait – Visa CF

### Décision

Signer / Retourner / Rejeter

---

# 83. RESPONSIVE

### Desktop

Usage principal.

### Tablette

Particulièrement importante pour l’Ordonnateur.

Permettre :

- consultation ;
- ouverture PDF ;
- décision ;
- signature si la sécurité le permet.

### Mobile

Prévoir :

- consultation synthétique ;
- notification ;
- suivi ;
- éventuellement approbation sécurisée.

---

# 84. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA.

---

# 85. PRINCIPAUX ÉCRANS

Le module doit comporter au minimum :

1. tableau de bord ;
2. liste des Ordonnancements ;
3. détail ;
4. page de décision ;
5. contrôle préalable ;
6. ordre de paiement ;
7. signature ;
8. retour ;
9. rejet ;
10. délégations ;
11. historique ;
12. documents ;
13. transmission Agence Comptable ;
14. reporting.

---

# 86. DOCUMENTS PDF

Prévoir notamment :

### Ordre de Paiement

### Fiche d’Ordonnancement

### Bordereau de transmission

### Avis de retour

### Décision de rejet

### Document d’annulation

---

# 87. CRITÈRES DE RECETTE

## Scénario nominal ≤ 5 000 000 FCFA

Liquidation visée  
→ Ordonnancement automatique  
→ SG déterminé automatiquement  
→ signature  
→ OP PDF  
→ GED  
→ Agence Comptable  
→ Paiement automatique.

## Scénario nominal > 5 000 000 FCFA

Liquidation visée  
→ Ordonnancement automatique  
→ Président déterminé automatiquement  
→ signature  
→ transmission.

## Retour

Ordonnateur retourne  
→ correction au niveau adéquat  
→ retransmission.

## Rejet

Ordonnateur rejette  
→ dossier clôturé ou repris selon procédure.

## Erreur technique

Signature effectuée  
→ transmission échoue  
→ dossier reste signé  
→ reprise automatique sans doublon.

---

# 88. RÈGLE DE NON-RÉGRESSION

La réforme du module ne doit jamais :

- casser les liens avec la Liquidation ;
- modifier les montants validés sans procédure ;
- supprimer les pièces antérieures ;
- perdre l’historique ;
- autoriser un mauvais Ordonnateur ;
- créer deux OP pour la même opération ;
- nécessiter une création manuelle du Paiement dans le processus normal.

---

# 89. UNE SEULE SOURCE DE VÉRITÉ

Les données doivent provenir des référentiels correspondants :

- Budget → référentiel budgétaire ;
- PAP → référentiel programmatique ;
- Bénéficiaire → référentiel tiers ;
- Organisation → référentiel organisationnel ;
- Délégations → référentiel des délégations ;
- Documents → GED.

---

# 90. RÉSUMÉ DU WORKFLOW CIBLE

**LIQUIDATION VISÉE**

↓

**ORDONNANCEMENT CRÉÉ AUTOMATIQUEMENT**

↓

**CONTRÔLES AUTOMATIQUES**

↓

**DÉTERMINATION DE L’ORDONNATEUR**

↓

**≤ 5 000 000 FCFA**

**SECRÉTAIRE GÉNÉRAL**

ou

**> 5 000 000 FCFA**

**PRÉSIDENT DE LA COMMISSION**

↓

**SIGNATURE DE L’ORDRE DE PAIEMENT**

↓

**PDF OFFICIEL**

↓

**ARCHIVAGE GED**

↓

**TRANSMISSION AUTOMATIQUE À L’AGENCE COMPTABLE**

↓

**PAIEMENT CRÉÉ AUTOMATIQUEMENT**

↓

**TRAITEMENT PAR L’AGENCE COMPTABLE**

---

# 91. VISION CIBLE

Le module ORDONNANCEMENT de BUDGET-CEEAC ne doit pas être un simple écran permettant d’apposer une signature.

Il doit devenir le **point de décision formelle entre la dette liquidée et son exécution comptable**.

Il doit garantir simultanément :

- que la dépense a été régulièrement engagée ;
- que la dette a été valablement liquidée ;
- que le service fait a été certifié ;
- que les contrôles nécessaires ont été effectués ;
- que le montant est exact ;
- que le bénéficiaire est correctement identifié ;
- que l’autorité compétente signe ;
- que l’Ordre de Paiement est authentique ;
- que la transmission à l’Agence Comptable est fiable ;
- que le Paiement est automatiquement créé ;
- que toute l’opération est traçable et auditable.

Le module doit ainsi constituer un véritable dispositif numérique de :

**décision**,  
**contrôle**,  
**signature**,  
**traçabilité**,  
**gestion documentaire**,  
**séparation des fonctions**,  
**sécurisation de la chaîne de dépense**,  
et **transmission automatique vers le Paiement**.