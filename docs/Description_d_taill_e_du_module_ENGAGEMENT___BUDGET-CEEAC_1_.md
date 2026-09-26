# DESCRIPTION DÉTAILLÉE DU MODULE ENGAGEMENT  
## Application BUDGET-CEEAC

## 1. OBJET DU MODULE

Le module **ENGAGEMENT** constitue la deuxième grande étape de la chaîne d’exécution de la dépense dans BUDGET-CEEAC.

Il intervient après l’approbation définitive d’une **Expression de Besoin (EB)** et a pour finalité de transformer une intention de dépense autorisée en une **obligation budgétaire formalisée**, contrôlée, traçable et réservant les crédits nécessaires à la couverture de la dépense.

L’Engagement ne doit pas être considéré comme une nouvelle saisie indépendante. Il constitue la continuité directe et contrôlée de l’Expression de Besoin approuvée.

Le système doit donc reprendre automatiquement les informations déjà validées en amont, éviter toute ressaisie inutile et préserver l’intégrité de la chaîne de dépense.

---

# 2. POSITION DANS LA CHAÎNE DE DÉPENSE

Le processus général est :

**Expression de Besoin approuvée**  
↓  
**Génération automatique de l’Engagement**  
↓  
**Instruction par le Service/Direction du Budget**  
↓  
**Validation budgétaire**  
↓  
**Transmission au Contrôleur Financier**  
↓  
**Contrôle et visa**  
↓  
**Transformation automatique en Liquidation**

La création d’un Engagement ne doit donc pas dépendre d’une nouvelle initiative manuelle lorsqu’une EB vient d’être définitivement approuvée.

---

# 3. OBJECTIFS DU MODULE

Le module Engagement doit permettre de :

1. matérialiser juridiquement et budgétairement la décision d’effectuer la dépense ;
2. réserver les crédits nécessaires ;
3. garantir la disponibilité budgétaire avant la poursuite de la dépense ;
4. contrôler la conformité de l’opération par rapport à l’EB approuvée ;
5. vérifier les imputations budgétaires ;
6. contrôler les pièces justificatives ;
7. assurer la séparation des fonctions entre initiateur, Budget et Contrôle financier ;
8. produire les documents officiels liés à l’engagement ;
9. assurer une traçabilité complète des opérations ;
10. transmettre automatiquement l’opération vers la Liquidation après validation et visa.

---

# 4. PRINCIPES FONCTIONNELS FONDAMENTAUX

## 4.1. Héritage automatique depuis l’Expression de Besoin

L’Engagement doit être automatiquement créé à partir de l’EB approuvée.

Il doit reprendre automatiquement les informations validées dans l’EB, notamment :

- référence de l’EB ;
- exercice budgétaire ;
- service initiateur ;
- structure ;
- demandeur ;
- objet du besoin ;
- justification ;
- classification PAP/Hors PAP ;
- ligne budgétaire principale ;
- imputations budgétaires ;
- informations programmatiques PAP ;
- détail des tâches ou rubriques ;
- montant global ;
- bénéficiaire ou fournisseur lorsque disponible ;
- pièces justificatives ;
- observations utiles ;
- historique des validations antérieures.

Toute ressaisie d’une information déjà validée doit être évitée.

---

# 5. IDENTIFICATION DE L’ENGAGEMENT

Chaque Engagement doit disposer d’une référence unique générée automatiquement.

Exemple :

**ENG-2026-000457**

La référence peut être construite à partir :

- du type de document ;
- de l’exercice budgétaire ;
- d’un numéro séquentiel.

Le lien entre l’Engagement et son EB source doit être permanent et non modifiable.

La fiche Engagement doit afficher clairement :

**Engagement n° ENG-2026-000457**  
**Issu de l’EB n° EB-2026-000392**

---

# 6. CRÉATION AUTOMATIQUE

Lorsque l’Expression de Besoin atteint son niveau final d’approbation, BUDGET-CEEAC doit automatiquement :

1. clôturer l’étape EB ;
2. générer le document officiel de l’EB ;
3. archiver ce document dans la GED ;
4. créer l’Engagement correspondant ;
5. reprendre automatiquement les données nécessaires ;
6. positionner l’Engagement dans la file de traitement du Service du Budget ;
7. générer les notifications ;
8. enregistrer l’événement dans le journal d’audit.

La création automatique doit être transactionnelle.

Il ne doit jamais exister une EB marquée « transformée en Engagement » sans Engagement réellement créé.

---

# 7. ACTEURS PRINCIPAUX

Le module doit pouvoir prendre en charge notamment les acteurs suivants :

### Service ou Direction du Budget

Selon l’organisation retenue :

- Expert Budget ;
- Agent Budget ;
- Chef de Service Budget ;
- Directeur du Budget.

Ces acteurs assurent l’instruction budgétaire et administrative de l’Engagement.

### Contrôleur Financier

Le Contrôleur Financier intervient après validation interne du Budget.

Il assure notamment :

- le contrôle de régularité ;
- le contrôle de conformité ;
- le contrôle de disponibilité des crédits ;
- le contrôle de l’imputation ;
- le contrôle des pièces ;
- le visa ;
- le retour ;
- le rejet, lorsque la réglementation le prévoit.

### Consultation

Certains profils peuvent disposer d’un accès en lecture seule :

- Ordonnateur ;
- Secrétaire Général ;
- Auditeurs ;
- Contrôle interne ;
- Agence comptable ;
- responsables hiérarchiques ;
- administrateurs autorisés.

---

# 8. TABLEAU DE BORD ENGAGEMENT

Le module doit disposer d’un tableau de bord propre.

Il doit permettre à l’utilisateur d’obtenir immédiatement une vision sur :

- les dossiers reçus ;
- les dossiers à traiter ;
- les engagements en préparation ;
- les engagements à valider ;
- les engagements transmis au Contrôleur Financier ;
- les dossiers retournés ;
- les dossiers rejetés ;
- les engagements visés ;
- les engagements transformés en Liquidation ;
- les montants engagés ;
- les engagements par structure ;
- les engagements PAP/Hors PAP ;
- les engagements par ligne budgétaire ;
- les engagements par période.

Les cartes KPI doivent être interactives.

Un clic sur une carte doit filtrer la liste correspondante.

---

# 9. LISTE DES ENGAGEMENTS

La page principale du module doit afficher un tableau professionnel contenant notamment :

| Information | Description |
|---|---|
| Référence | Numéro de l’Engagement |
| EB source | Référence de l’Expression de Besoin |
| Date | Date de création |
| Objet | Objet de la dépense |
| Structure | Service/Direction initiatrice |
| Type | PAP ou Hors PAP |
| Ligne budgétaire | Imputation principale |
| Bénéficiaire | Créancier/Fournisseur |
| Montant | Montant engagé |
| Statut | État du dossier |
| Étape | Niveau actuel |
| Acteur attendu | Prochain intervenant |
| Dernière action | Dernière opération réalisée |

La liste doit permettre recherche, filtres, tri, pagination et export.

---

# 10. STATUTS DU DOSSIER

Le système peut notamment utiliser les statuts suivants :

- Généré ;
- En préparation ;
- À compléter ;
- En instruction Budget ;
- À valider ;
- Validé Budget ;
- Transmis au Contrôle Financier ;
- En contrôle ;
- Retourné ;
- Rejeté ;
- Visé ;
- Transformé en Liquidation ;
- Annulé.

Les statuts doivent être clairement distingués des étapes de workflow.

---

# 11. PAGE DE DÉTAIL DE L’ENGAGEMENT

La page détail doit centraliser toutes les informations.

Elle peut être organisée en onglets :

### Synthèse

Identification générale de l’opération.

### Expression de Besoin

Informations issues de l’EB source.

### Budget et imputation

Situation budgétaire détaillée.

### Détail de l’engagement

Prestations, fournitures, tâches ou rubriques.

### PAP

Informations programmatiques lorsqu’il s’agit d’un besoin d’investissement.

### Bénéficiaire

Fournisseur, prestataire, consultant ou autre créancier.

### Pièces justificatives

Documents hérités et nouveaux documents.

### Workflow

Chaîne de traitement.

### Historique

Toutes les actions réalisées.

### Documents générés

Documents officiels PDF.

### Commentaires

Échanges et observations.

---

# 12. BANDEAU DE SUIVI

Chaque dossier doit comporter un bandeau transversal indiquant immédiatement :

**ÉTAPE ACTUELLE**  
Instruction de l’Engagement

**DERNIÈRE ACTION**  
Engagement contrôlé par l’Expert Budget

**ACTEUR ATTENDU**  
Directeur du Budget

**PROCHAINE ÉTAPE**  
Validation budgétaire

Ce composant doit être harmonisé avec les autres modules de BUDGET-CEEAC.

---

# 13. DONNÉES BUDGÉTAIRES

L’écran doit présenter une vision budgétaire complète.

Pour chaque imputation, afficher :

| Donnée | Valeur |
|---|---:|
| Budget initial | XXX FCFA |
| Mouvements budgétaires | XXX FCFA |
| Budget révisé | XXX FCFA |
| Engagements antérieurs | XXX FCFA |
| Liquidations | XXX FCFA |
| Ordonnancements | XXX FCFA |
| Paiements | XXX FCFA |
| Disponible avant engagement | XXX FCFA |
| Montant du présent engagement | XXX FCFA |
| Disponible après engagement | XXX FCFA |

La réservation des crédits intervient au niveau de l’Engagement.

---

# 14. CONTRÔLE DE DISPONIBILITÉ DES CRÉDITS

Le système doit effectuer automatiquement le contrôle de disponibilité.

Le principe est :

**Disponible avant engagement ≥ montant à engager**

Lorsque cette condition n’est pas satisfaite, le système doit signaler clairement l’insuffisance.

Exemple :

**Crédit disponible : 2 750 000 FCFA**  
**Montant demandé : 3 500 000 FCFA**  
**Insuffisance : 750 000 FCFA**

La validation normale de l’Engagement doit être bloquée, sauf procédure exceptionnelle explicitement autorisée par les règles de gestion.

---

# 15. RÉSERVATION DES CRÉDITS

Au moment approprié du workflow, l’Engagement doit provoquer une réservation budgétaire.

Cette réservation doit :

- réduire le disponible ;
- être traçable ;
- être liée à l’Engagement ;
- être annulable uniquement par une procédure autorisée ;
- être rétablie automatiquement en cas d’annulation définitive de l’Engagement.

Toute modification du montant après réservation doit entraîner une actualisation contrôlée de cette réservation.

---

# 16. IMPUTATION MULTI-LIGNES

Le module doit supporter les engagements financés par plusieurs imputations.

Pour chaque imputation :

- code ;
- libellé ;
- chapitre ;
- article ;
- paragraphe ;
- activité ;
- source de financement ;
- montant ;
- disponible ;
- reste après engagement.

Le système doit contrôler :

**Total des imputations = montant total de l’Engagement**

Aucune validation ne doit être possible en cas de déséquilibre.

---

# 17. ENGAGEMENT PAP

Lorsqu’un Engagement provient d’une EB PAP, les informations programmatiques doivent rester disponibles.

L’utilisateur doit pouvoir consulter :

- pilier ;
- axe ;
- objectif ;
- programme ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- résultats attendus ;
- indicateurs ;
- unité responsable ;
- calendrier ;
- enveloppe programmée ;
- consommations ;
- disponible.

L’Engagement doit permettre de relier l’exécution financière à l’activité physique correspondante.

---

# 18. ENGAGEMENT HORS PAP

Pour un Engagement Hors PAP, le système doit privilégier les informations relevant du fonctionnement courant.

La fiche doit notamment afficher :

- nature de la dépense ;
- ligne budgétaire ;
- structure bénéficiaire ;
- objet ;
- justification ;
- montant ;
- disponible ;
- bénéficiaire ;
- pièces justificatives.

---

# 19. DÉTAIL DES PRESTATIONS OU FOURNITURES

Le détail établi au niveau de l’EB doit être repris.

Exemple :

| Désignation | Quantité | Unité | Prix unitaire | Montant |
|---|---:|---|---:|---:|
| Ordinateur portable | 5 | Unité | 750 000 | 3 750 000 |
| Sacoche | 5 | Unité | 35 000 | 175 000 |
| Souris | 5 | Unité | 15 000 | 75 000 |

**Total : 4 000 000 FCFA**

Les modifications après approbation de l’EB doivent être strictement contrôlées.

---

# 20. GESTION DU BÉNÉFICIAIRE

Le module doit pouvoir associer l’Engagement à un bénéficiaire ou créancier.

Celui-ci peut être :

- entreprise ;
- fournisseur ;
- prestataire ;
- consultant ;
- organisation ;
- personne physique autorisée ;
- autre bénéficiaire institutionnel.

Le bénéficiaire doit provenir du référentiel **ENTREPRISE / TIERS / CRÉANCIERS** de BUDGET-CEEAC.

La fiche peut afficher :

- raison sociale ;
- RCCM ;
- NIF ;
- adresse ;
- contacts ;
- coordonnées bancaires ;
- statut administratif ;
- conformité ;
- documents légaux.

---

# 21. DOCUMENTS ET PIÈCES JUSTIFICATIVES

Le module doit reprendre automatiquement les pièces de l’EB.

Il doit également permettre d’ajouter les documents propres à l’Engagement.

Exemples :

- devis ;
- pro forma ;
- bon de commande ;
- contrat ;
- marché ;
- TDR ;
- rapport d’analyse ;
- décision ;
- autorisation ;
- certificat ;
- documents du fournisseur ;
- documents issus du processus de passation des marchés.

Chaque document doit être automatiquement intégré à la GED.

---

# 22. CONTRÔLE DES PIÈCES

Le système doit permettre de définir des pièces obligatoires en fonction :

- du type de dépense ;
- du montant ;
- du mode de passation ;
- du bénéficiaire ;
- du type PAP/Hors PAP.

Le système doit afficher une checklist :

**Pièces obligatoires**

✓ Expression de Besoin approuvée  
✓ Devis  
✓ TDR  
✓ Bon de commande  
⚠ Document fiscal à compléter

La transmission ne doit pas être autorisée lorsqu’une pièce juridiquement obligatoire manque.

---

# 23. ARTICULATION AVEC LES MARCHÉS

Lorsqu’un Engagement est lié à un marché public ou à une procédure d’achat, BUDGET-CEEAC doit établir la relation avec le module Gestion des Marchés.

L’Engagement peut alors reprendre automatiquement :

- numéro de marché ;
- type de procédure ;
- objet ;
- titulaire ;
- montant contractuel ;
- lot ;
- date de notification ;
- durée ;
- documents contractuels.

L’engagement ne doit pas permettre de dépasser le montant contractuel disponible.

---

# 24. PROCESSUS D’INSTRUCTION PAR LE BUDGET

L’instruction budgétaire comprend notamment :

### Réception

L’Engagement apparaît automatiquement dans la file des dossiers à traiter.

### Vérification

L’Expert ou Agent Budget examine :

- conformité avec l’EB ;
- disponibilité budgétaire ;
- imputation ;
- montant ;
- pièces ;
- bénéficiaire ;
- cohérence PAP/Hors PAP.

### Complément

Lorsque certaines informations doivent être complétées sans remettre en cause l’EB, l’agent habilité peut compléter les données propres à l’Engagement.

### Transmission hiérarchique

L’Engagement est transmis au niveau supérieur du Budget.

### Validation

Le Directeur du Budget ou l’autorité habilitée valide l’Engagement.

### Transmission automatique

Après validation, le système transmet automatiquement le dossier au Contrôleur Financier.

---

# 25. CONTRÔLE FINANCIER

Le Contrôleur Financier dispose d’un espace propre.

Il doit pouvoir examiner :

- EB source ;
- Engagement ;
- budget ;
- imputations ;
- disponible ;
- pièces justificatives ;
- bénéficiaire ;
- marché éventuel ;
- circuit de validation ;
- historique.

Il peut exercer plusieurs actions.

### Viser

Le dossier est conforme.

### Retourner

Des corrections ou compléments sont nécessaires.

### Rejeter

L’opération ne peut pas être poursuivie.

### Demander des informations complémentaires

Lorsque la réglementation le permet.

Toute décision doit être motivée et horodatée.

---

# 26. VISA DU CONTRÔLEUR FINANCIER

Le visa constitue un événement majeur.

Il doit comporter :

- référence du visa ;
- date ;
- auteur ;
- fonction ;
- montant visé ;
- observations éventuelles.

Après visa :

1. l’Engagement est verrouillé ;
2. le PDF officiel est généré ;
3. le document est versé dans la GED ;
4. le journal d’audit est complété ;
5. les notifications sont générées ;
6. la Liquidation est créée automatiquement.

---

# 27. RETOUR POUR CORRECTION

Lorsqu’un dossier est retourné, le système doit afficher clairement :

- auteur du retour ;
- date ;
- motif ;
- observations ;
- sections concernées ;
- actions attendues.

Exemple :

**Retour du Contrôleur Financier**

Motif :  
« Imputation incorrecte sur la ligne 625100. Veuillez vérifier la ligne budgétaire relative aux prestations informatiques. »

La correction doit être tracée.

---

# 28. REJET

Le rejet doit être distinct du retour.

Un retour signifie que le dossier peut être corrigé.

Un rejet correspond à une décision plus forte mettant fin ou suspendant le processus selon la procédure.

Le rejet doit obligatoirement contenir :

- motif ;
- auteur ;
- date ;
- référence ;
- observations ;
- conséquences sur la réservation des crédits.

La réservation budgétaire doit être libérée si l’Engagement est définitivement abandonné.

---

# 29. MODIFICATION D’UN ENGAGEMENT

Les règles de modification doivent dépendre du statut.

### Avant validation

Les champs propres à l’Engagement peuvent être modifiés par les utilisateurs habilités.

### Après validation Budget

Les modifications deviennent limitées.

### Après visa du Contrôleur Financier

L’Engagement doit être verrouillé.

Toute modification ultérieure doit passer par une procédure de :

- correction formalisée ;
- annulation ;
- engagement complémentaire ;
- engagement modificatif ;
- régularisation.

---

# 30. ENGAGEMENT COMPLÉMENTAIRE

Le système doit pouvoir gérer les compléments lorsqu’une dépense initialement engagée doit être augmentée.

L’Engagement complémentaire doit :

- référencer l’Engagement initial ;
- préciser le motif ;
- indiquer le montant initial ;
- indiquer le complément ;
- calculer le nouveau total ;
- contrôler les crédits ;
- suivre un workflow de validation.

---

# 31. ANNULATION D’UN ENGAGEMENT

Une procédure d’annulation doit être prévue.

Elle doit préciser :

- motif ;
- auteur de la demande ;
- approbateur ;
- date ;
- montant annulé ;
- impact budgétaire.

Après validation de l’annulation, le système doit rétablir les crédits concernés.

---

# 32. ENGAGEMENT PARTIEL

Le système doit également pouvoir gérer une situation où l’Engagement ne porte que sur une partie du montant initialement autorisé.

Exemple :

**EB approuvée : 10 000 000 FCFA**

**Premier Engagement : 6 000 000 FCFA**

**Solde disponible sur EB : 4 000 000 FCFA**

Cette fonctionnalité doit être autorisée uniquement lorsque la nature du besoin et la procédure le permettent.

---

# 33. CONTRÔLES AUTOMATIQUES

Le système doit effectuer notamment les contrôles suivants :

- EB approuvée ;
- exercice ouvert ;
- budget actif ;
- ligne budgétaire valide ;
- crédit disponible ;
- équilibre des imputations ;
- bénéficiaire valide ;
- pièces obligatoires présentes ;
- montant supérieur à zéro ;
- absence de doublon ;
- conformité du workflow ;
- absence de dépassement du marché ;
- cohérence avec le PAP ;
- conformité des dates.

---

# 34. DOCUMENT OFFICIEL D’ENGAGEMENT

Après validation ou visa selon la procédure, le système doit produire automatiquement un document officiel PDF.

Ce document peut être dénommé :

**FICHE D’ENGAGEMENT BUDGÉTAIRE**

Il doit reprendre notamment :

- logo CEEAC ;
- exercice ;
- référence Engagement ;
- référence EB ;
- structure ;
- bénéficiaire ;
- objet ;
- imputations ;
- montants ;
- détail ;
- situation des crédits ;
- validations ;
- visa du Contrôleur Financier ;
- dates ;
- QR Code ou identifiant de vérification ;
- informations d’authentification numérique.

---

# 35. GESTION ÉLECTRONIQUE DES DOCUMENTS

Tous les documents du module doivent être automatiquement archivés dans la GED.

Cela comprend :

- documents hérités de l’EB ;
- documents importés ;
- documents générés ;
- engagements signés ;
- visas ;
- observations formelles ;
- pièces contractuelles.

Les documents doivent être classés selon :

**Exercice → Chaîne de dépense → Engagement → Référence dossier**

---

# 36. NOTIFICATIONS

Le système doit produire des notifications aux événements significatifs.

Exemples :

- Engagement créé ;
- dossier affecté ;
- dossier en attente de validation ;
- Engagement retourné ;
- correction effectuée ;
- Engagement validé ;
- dossier transmis au Contrôleur Financier ;
- visa accordé ;
- dossier rejeté ;
- Liquidation créée.

Les notifications doivent permettre d’ouvrir directement le dossier concerné.

---

# 37. MES TÂCHES

Chaque acteur doit disposer dans « Mes tâches » des dossiers nécessitant son intervention.

Exemple :

**ENG-2026-000457**

Objet : Acquisition de matériels informatiques  
Montant : 4 000 000 FCFA  
Action attendue : Vérification budgétaire  
Reçu le : 15/09/2026  
Priorité : Normale

L’utilisateur doit pouvoir ouvrir le dossier directement.

---

# 38. JOURNAL D’AUDIT

Toutes les actions doivent être journalisées.

Le journal doit notamment contenir :

- utilisateur ;
- rôle ;
- date ;
- heure ;
- adresse ou contexte technique lorsque nécessaire ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- commentaire ;
- document concerné.

Les journaux d’audit ne doivent pas pouvoir être modifiés par les utilisateurs ordinaires.

---

# 39. HISTORIQUE DU WORKFLOW

Le dossier doit présenter une timeline complète.

Exemple :

**15/09/2026 – 08:42**  
Engagement généré automatiquement

**15/09/2026 – 09:15**  
Dossier pris en charge par Expert Budget

**15/09/2026 – 10:10**  
Contrôle budgétaire effectué

**15/09/2026 – 11:25**  
Validé par Directeur du Budget

**15/09/2026 – 11:26**  
Transmis automatiquement au Contrôleur Financier

**16/09/2026 – 09:31**  
Visa accordé

**16/09/2026 – 09:32**  
Liquidation créée automatiquement

---

# 40. TRANSITION VERS LA LIQUIDATION

La transition doit être entièrement automatisée.

Après le visa du Contrôleur Financier :

**Engagement visé**  
↓  
**Génération du document officiel**  
↓  
**Archivage GED**  
↓  
**Création automatique de la Liquidation**  
↓  
**Transmission au prochain acteur**  
↓  
**Notification**

Aucun bouton manuel « Créer une Liquidation » ne doit être nécessaire dans le processus normal.

---

# 41. DONNÉES TRANSMISES À LA LIQUIDATION

La Liquidation doit notamment hériter :

- référence EB ;
- référence Engagement ;
- exercice ;
- structure ;
- objet ;
- bénéficiaire ;
- lignes budgétaires ;
- imputations ;
- détail des prestations ;
- montant engagé ;
- références contractuelles ;
- documents ;
- informations PAP ;
- historique essentiel.

---

# 42. SÉPARATION DES FONCTIONS

Le module doit respecter le principe de séparation des fonctions.

L’utilisateur qui initie une opération ne doit pas nécessairement être celui qui la valide.

Les rôles de :

- préparation ;
- validation ;
- contrôle financier ;
- liquidation ;
- ordonnancement ;
- paiement

doivent être distincts selon les habilitations.

Le système doit empêcher les conflits de rôles interdits.

---

# 43. RECHERCHE GLOBALE

L’Engagement doit être indexé dans la recherche globale de BUDGET-CEEAC.

Une recherche par :

- référence ;
- objet ;
- bénéficiaire ;
- EB ;
- montant ;
- ligne budgétaire ;
- structure

doit permettre de retrouver rapidement un dossier.

---

# 44. REPORTING

Le module Engagement doit alimenter automatiquement le Reporting.

Indicateurs importants :

- nombre d’Engagements ;
- montant total engagé ;
- engagements PAP ;
- engagements Hors PAP ;
- taux d’engagement ;
- engagements par structure ;
- engagements par ligne ;
- engagements par fournisseur ;
- délais moyens de traitement ;
- taux de retour ;
- taux de rejet ;
- engagements en attente ;
- engagements visés ;
- consommation des crédits.

---

# 45. KPI BUDGÉTAIRES

Quelques KPI essentiels :

**Taux d’engagement**

Montant engagé / Budget révisé × 100

**Disponible à l’engagement**

Budget révisé – Engagements nets

**Délai moyen d’engagement**

Date du visa – Date de création de l’Engagement

**Taux de rejet**

Engagements rejetés / Engagements soumis × 100

---

# 46. INTÉGRATION AU SUIVI-ÉVALUATION

Pour les dépenses PAP, les informations d’Engagement doivent pouvoir être exploitées dans le module Suivi-Évaluation.

Le système doit pouvoir comparer :

- programmation ;
- engagement financier ;
- réalisation physique ;
- liquidation ;
- paiement.

Cela permet d’identifier les activités financièrement engagées mais non encore exécutées physiquement.

---

# 47. INTÉGRATION AVEC LA GED

Le module doit interagir nativement avec la GED.

Chaque document entrant ou généré doit être indexé avec :

- référence ;
- type de document ;
- exercice ;
- module ;
- structure ;
- bénéficiaire ;
- date ;
- auteur ;
- statut.

---

# 48. INTÉGRATION AUX NOTIFICATIONS

Le module doit utiliser le moteur transversal de notifications de BUDGET-CEEAC.

Canaux envisageables :

- notification interne ;
- courrier électronique ;
- éventuellement SMS ou messagerie selon configuration.

Les règles de notification doivent être paramétrables.

---

# 49. GESTION DES DÉLAIS

Le système doit pouvoir calculer le temps passé à chaque étape.

Exemple :

**Expert Budget : 1 jour**

**Chef de Service : 4 heures**

**Directeur Budget : 6 heures**

**Contrôle Financier : 2 jours**

Cela permet de détecter les goulots d’étranglement.

---

# 50. ESCALADES

Lorsque le délai prévu est dépassé, le système peut générer :

**Rappel**

puis :

**Alerte**

puis éventuellement :

**Escalade hiérarchique**

Les délais doivent être paramétrables par workflow.

---

# 51. INTERFACE UTILISATEUR

Le design doit être cohérent avec le nouveau module Expression de Besoin.

La page doit notamment comporter :

- breadcrumb ;
- titre ;
- référence ;
- statut ;
- bandeau workflow ;
- cartes budgétaires ;
- onglets ;
- zone d’actions ;
- timeline ;
- documents ;
- commentaires.

L’interface doit rester claire malgré la quantité importante d’informations.

---

# 52. CARTE DE SITUATION BUDGÉTAIRE

Un composant visuel doit être utilisé dans l’ensemble du module.

Exemple :

**Budget révisé**  
125 000 000 FCFA

**Déjà engagé**  
70 000 000 FCFA

**Présent engagement**  
10 000 000 FCFA

**Disponible après opération**  
45 000 000 FCFA

Ce composant doit également pouvoir être réutilisé dans les autres modules financiers.

---

# 53. ACTIONS CONTEXTUELLES

Les boutons disponibles doivent dépendre du statut et du profil.

Exemples :

**En préparation**

Enregistrer  
Compléter  
Ajouter une pièce

**Expert Budget**

Contrôler  
Annoter  
Transmettre  
Retourner

**Directeur Budget**

Valider  
Retourner  
Rejeter

**Contrôleur Financier**

Viser  
Retourner  
Rejeter

Aucune action interdite ne doit être affichée comme active.

---

# 54. COMMENTAIRES INTERNES

Un espace de commentaires peut permettre aux acteurs autorisés de communiquer sur le dossier.

Chaque commentaire doit comporter :

- auteur ;
- fonction ;
- date ;
- heure ;
- message ;
- éventuellement pièce jointe.

Les commentaires ne doivent pas remplacer les décisions formelles du workflow.

---

# 55. EXPORTS

Le module doit permettre l’export des listes et analyses dans différents formats selon les besoins :

- PDF ;
- Excel ;
- CSV.

Les exports doivent respecter les filtres appliqués.

---

# 56. API ET INTEROPÉRABILITÉ

Le module doit être conçu pour exposer des données structurées à travers des API sécurisées.

Cela pourra permettre les échanges avec :

- systèmes comptables ;
- systèmes bancaires ;
- outils de reporting ;
- Power BI ;
- ERP ;
- systèmes régionaux ;
- plateformes d’audit.

---

# 57. EXIGENCES DE SÉCURITÉ

Le module doit respecter notamment :

- authentification ;
- autorisation RBAC ;
- séparation des fonctions ;
- journalisation ;
- intégrité des données ;
- chiffrement ;
- contrôle des téléchargements ;
- protection contre les modifications non autorisées ;
- historique des versions.

Les opérations sensibles doivent pouvoir nécessiter une authentification renforcée.

---

# 58. EXIGENCES D’AUDITABILITÉ

Un auditeur autorisé doit pouvoir reconstituer tout le cycle de l’Engagement :

**EB source → création Engagement → contrôles → modifications → validations → visa → documents → réservation des crédits → création de la Liquidation**

Aucune étape majeure ne doit être invisible.

---

# 59. ÉTATS EXCEPTIONNELS

Le système doit prévoir les cas suivants :

- crédit insuffisant ;
- budget clôturé ;
- ligne budgétaire suspendue ;
- bénéficiaire bloqué ;
- pièce expirée ;
- marché arrivé à échéance ;
- EB annulée ;
- engagement doublon ;
- incohérence d’imputation ;
- workflow indisponible ;
- erreur de génération documentaire.

Chaque anomalie doit être expliquée de façon compréhensible à l’utilisateur.

---

# 60. PRINCIPAUX ÉCRANS DU MODULE

Le module Engagement doit au minimum comporter :

1. tableau de bord Engagement ;
2. liste des Engagements ;
3. détail d’un Engagement ;
4. écran d’instruction Budget ;
5. écran de vérification des crédits ;
6. écran des imputations ;
7. écran des pièces justificatives ;
8. écran de validation ;
9. espace Contrôleur Financier ;
10. page de retour/correction ;
11. historique ;
12. timeline ;
13. documents générés ;
14. Engagements complémentaires ;
15. Engagements annulés ;
16. reporting Engagement.

---

# 61. DOCUMENTS PDF À PRÉVOIR

Le référentiel documentaire peut inclure notamment :

**Fiche d’Engagement budgétaire**

**Certificat de disponibilité des crédits**

**Fiche de contrôle budgétaire**

**Visa du Contrôleur Financier**

**Bordereau de transmission**

**Fiche d’annulation**

**Engagement modificatif ou complémentaire**

Les documents réellement applicables doivent dépendre du référentiel réglementaire retenu par la CEEAC.

---

# 62. RÈGLES DE NON-RÉGRESSION

La réforme du module Engagement ne doit pas :

- casser les liens avec l’EB ;
- dupliquer les informations ;
- créer une deuxième base de données budgétaire ;
- permettre une modification non contrôlée de l’EB ;
- rompre les workflows existants conformes ;
- perdre les pièces jointes ;
- supprimer les historiques ;
- créer des transitions manuelles là où une transition automatique est prévue.

---

# 63. PRINCIPE « UNE SEULE SOURCE DE VÉRITÉ »

Les informations budgétaires doivent provenir du référentiel budgétaire central.

Les informations organisationnelles doivent provenir du référentiel organisationnel.

Les informations du bénéficiaire doivent provenir du référentiel des tiers.

Les informations PAP doivent provenir du référentiel programmatique.

L’Engagement consomme ces informations mais ne doit pas créer de référentiels parallèles.

---

# 64. ERGONOMIE ATTENDUE

L’utilisateur doit être capable de répondre immédiatement à cinq questions :

**Quel dossier suis-je en train de traiter ?**

**Quelle dépense est engagée ?**

**Sur quels crédits ?**

**Quel est le disponible ?**

**Quelle action dois-je effectuer maintenant ?**

La conception des écrans doit être construite autour de ces questions.

---

# 65. CRITÈRES DE RECETTE PRINCIPAUX

Le module pourra être considéré conforme lorsque les scénarios suivants fonctionnent intégralement :

### Scénario nominal

EB approuvée → Engagement automatique → instruction Budget → validation → Contrôle Financier → visa → Liquidation automatique.

### Crédit insuffisant

Le système détecte et empêche la validation.

### Retour

Le Contrôleur Financier retourne l’Engagement → correction → nouvelle transmission.

### Rejet

Le dossier est rejeté → réservation des crédits annulée selon règles.

### Multi-imputation

Une dépense est ventilée sur plusieurs lignes et les totaux sont contrôlés.

### PAP

Les données programmatiques sont conservées et consultables.

### Documents

Les pièces de l’EB sont héritées et les documents générés automatiquement sont versés dans la GED.

---

# 66. RÉSUMÉ DU WORKFLOW CIBLE

Le workflow cible du module peut être représenté ainsi :

**EB APPROUVÉE**

↓

**ENGAGEMENT GÉNÉRÉ AUTOMATIQUEMENT**

↓

**EXPERT / AGENT BUDGET**
Vérification du dossier

↓

**CHEF DE SERVICE BUDGET**
Contrôle / validation intermédiaire selon paramétrage

↓

**DIRECTEUR DU BUDGET**
Validation budgétaire

↓

**TRANSMISSION AUTOMATIQUE**

↓

**CONTRÔLEUR FINANCIER**

→ Retour pour correction  
→ Rejet  
→ Visa

↓

**VISA**

↓

**GÉNÉRATION DES DOCUMENTS**

↓

**ARCHIVAGE GED**

↓

**LIQUIDATION GÉNÉRÉE AUTOMATIQUEMENT**

---

# 67. VISION CIBLE

Le module Engagement de BUDGET-CEEAC doit devenir un véritable mécanisme de contrôle budgétaire numérique.

Il ne doit pas être un simple formulaire de saisie.

Il doit simultanément assurer :

**la réservation des crédits**,  
**la conformité de la dépense**,  
**la continuité documentaire**,  
**le contrôle financier**,  
**la traçabilité**,  
**la séparation des fonctions**,  
**le suivi des délais**,  
**l’intégration à la GED**,  
**l’intégration au PAP**,  
**et l’enchaînement automatique avec la Liquidation**.

L’objectif final est de disposer d’un processus d’Engagement entièrement numérique, contrôlé, auditable, sécurisé et parfaitement intégré à l’ensemble du cycle budgétaire de BUDGET-CEEAC.