# PROMPT FIGMA — REFONTE COMPLÈTE DU MODULE LIQUIDATION DE BUDGET-CEEAC

## 1. CONTEXTE GÉNÉRAL

Tu travailles sur la maquette Figma existante de **BUDGET-CEEAC**, application intégrée de planification, budgétisation, exécution de la dépense, suivi-évaluation, gestion documentaire, contrôle et reporting de la Commission de la CEEAC.

Je joins à ce prompt le fichier contenant la :

# « DESCRIPTION DÉTAILLÉE DU MODULE LIQUIDATION DE BUDGET-CEEAC »

Ce document devient la **référence fonctionnelle principale du module LIQUIDATION**.

Ta mission consiste à réaliser une **refonte complète du module LIQUIDATION dans la maquette Figma existante**.

Il ne s’agit pas d’un simple rafraîchissement graphique.

Tu dois réexaminer entièrement :

- l’architecture du module ;
- les parcours utilisateurs ;
- les écrans ;
- les formulaires ;
- les données affichées ;
- les contrôles métier ;
- les workflows ;
- les rôles ;
- les documents ;
- les interactions avec l’Engagement ;
- la certification du service fait ;
- les factures ;
- les calculs de liquidation ;
- les retenues ;
- les marchés ;
- le PAP ;
- le contrôle financier ;
- les notifications ;
- la GED ;
- l’historique ;
- l’audit ;
- la transition automatique vers l’Ordonnancement.

Le résultat attendu doit être un module **fonctionnellement complet, professionnel, cohérent, moderne et directement exploitable par l’équipe de développement**.

---

# 2. ORDRE DE PRIORITÉ DES SOURCES

Pour cette refonte, utiliser les sources dans l’ordre suivant :

1. **Description détaillée du module LIQUIDATION jointe au présent prompt** ;
2. cahier des charges fonctionnel actuel de BUDGET-CEEAC ;
3. description du module ENGAGEMENT ;
4. description du module EXPRESSION DE BESOIN ;
5. description du module ORDONNANCEMENT ;
6. procédures de la chaîne de dépense ;
7. référentiels budgétaires ;
8. référentiel organisationnel de la CEEAC ;
9. référentiel PAP ;
10. référentiel des tiers/fournisseurs ;
11. référentiel des marchés ;
12. maquette Figma existante.

En cas de contradiction, la nouvelle description détaillée du module LIQUIDATION prévaut pour les règles propres à ce module.

---

# 3. AUDIT COMPLET DE L’EXISTANT AVANT TOUTE MODIFICATION

Avant de modifier la maquette, réalise un audit exhaustif du module LIQUIDATION existant.

Identifier quatre catégories.

## 3.1. Éléments conformes

Lister les écrans, composants, interactions et informations déjà compatibles avec la nouvelle description.

Ces éléments doivent être conservés et éventuellement améliorés.

## 3.2. Éléments partiellement conformes

Identifier ce qui doit être :

- complété ;
- corrigé ;
- enrichi ;
- déplacé ;
- simplifié ;
- réorganisé ;
- modernisé.

## 3.3. Éléments obsolètes

Identifier ce qui doit être supprimé ou remplacé.

## 3.4. Éléments manquants

Identifier tout ce qui apparaît dans la description fonctionnelle mais n’existe pas dans Figma.

Construire une logique de contrôle :

**Exigence fonctionnelle → Existant Figma → Écart → Action à mener → Écran concerné**

Aucune exigence importante ne doit rester uniquement décrite dans le document sans traduction graphique.

---

# 4. PRINCIPE FONDAMENTAL DU MODULE LIQUIDATION

La Liquidation doit être conçue comme la troisième étape de la chaîne de dépense :

**Expression de Besoin**

↓

**Engagement**

↓

**Liquidation**

↓

**Ordonnancement**

↓

**Paiement**

Le workflow principal est :

**Engagement visé**

↓

**Liquidation créée automatiquement**

↓

**Constatation du service fait**

↓

**Certification du service fait**

↓

**Contrôle des pièces et de la facture**

↓

**Détermination du montant exact de la dette**

↓

**Transmission au Contrôleur Financier**

↓

**Visa**

↓

**Ordonnancement créé automatiquement**

La maquette doit matérialiser clairement cette continuité.

---

# 5. AUCUNE RESSAISIE INUTILE

La Liquidation doit hériter automatiquement des données déjà validées dans :

- l’Expression de Besoin ;
- l’Engagement.

La maquette doit clairement différencier :

### Données héritées

et

### Données propres à la Liquidation.

Les données héritées doivent être visibles mais protégées lorsqu’elles ne doivent plus être modifiées.

---

# 6. DONNÉES HÉRITÉES DE L’ENGAGEMENT

Afficher automatiquement notamment :

- référence EB ;
- référence Engagement ;
- exercice ;
- service initiateur ;
- structure ;
- objet ;
- nature PAP/Hors PAP ;
- bénéficiaire ;
- fournisseur ;
- lignes budgétaires ;
- imputations ;
- montant engagé ;
- détails des prestations ;
- marché ;
- contrat ;
- bon de commande ;
- TDR ;
- pièces justificatives ;
- données PAP ;
- visa du Contrôleur Financier ;
- historique.

---

# 7. CRÉATION AUTOMATIQUE DE LA LIQUIDATION

Lorsque l’Engagement est définitivement visé, représenter graphiquement :

**ENGAGEMENT VISÉ**

↓

**Création automatique de la Liquidation**

↓

**Notification du service initiateur**

↓

**Liquidation disponible dans Mes tâches**

Éviter tout bouton manuel « Créer une Liquidation » dans le processus nominal.

---

# 8. TABLEAU DE BORD LIQUIDATION

Créer ou refondre entièrement le tableau de bord.

Prévoir notamment les cartes :

- Toutes les Liquidations ;
- À traiter ;
- En attente de service fait ;
- À certifier ;
- À compléter ;
- En attente de pièces ;
- Au Contrôle Financier ;
- Retournées ;
- Rejetées ;
- Visées ;
- Partiellement liquidées ;
- Totalement liquidées ;
- Transformées en Ordonnancement.

---

# 9. KPI FINANCIERS

Ajouter des KPI tels que :

**Montant engagé**

**Montant liquidé**

**Reste à liquider**

**Taux de liquidation**

**Liquidations du mois**

**Liquidations PAP**

**Liquidations Hors PAP**

**Montant en attente de certification**

**Montant en attente de visa**

Les cartes doivent être interactives.

---

# 10. ANALYSES VISUELLES

Prévoir des graphiques réellement utiles :

- liquidations par période ;
- par structure ;
- par bénéficiaire ;
- par activité PAP ;
- par statut ;
- par ligne budgétaire ;
- taux de liquidation ;
- délais moyens de traitement.

Éviter les graphiques décoratifs.

---

# 11. LISTE DES LIQUIDATIONS

Refondre complètement la page de liste.

Colonnes recommandées :

- Référence LIQ ;
- Engagement ;
- EB ;
- Date ;
- Objet ;
- Structure ;
- Fournisseur ;
- PAP/Hors PAP ;
- Montant engagé ;
- Montant de cette liquidation ;
- Cumul liquidé ;
- Reste à liquider ;
- Statut ;
- Étape ;
- Acteur attendu ;
- Dernière action ;
- Ancienneté.

---

# 12. FILTRES

Prévoir :

- recherche plein texte ;
- exercice ;
- structure ;
- bénéficiaire ;
- PAP/Hors PAP ;
- statut ;
- montant ;
- période ;
- ligne budgétaire ;
- marché ;
- acteur attendu ;
- étape.

Prévoir également :

- filtres enregistrés ;
- tri ;
- export ;
- pagination.

---

# 13. PAGE DÉTAIL DE LA LIQUIDATION

Créer une fiche dossier complète.

En-tête recommandé :

**LIQ-2026-000245**

Objet de l’opération

Puis :

- statut ;
- montant ;
- PAP/Hors PAP ;
- bénéficiaire ;
- priorité éventuelle.

---

# 14. BANDEAU WORKFLOW

Créer un bandeau transversal identique dans son principe à EB et Engagement.

Exemple :

**ÉTAPE ACTUELLE**

Certification du service fait

**DERNIÈRE ACTION**

Réception enregistrée par le service initiateur

**ACTEUR ATTENDU**

Chef de Service / Certificateur habilité

**PROCHAINE ÉTAPE**

Certification puis transmission au Contrôleur Financier

---

# 15. ORGANISATION PAR ONGLETS

Prévoir au minimum :

### Synthèse

### Engagement source

### Service fait

### Factures

### Détail de la Liquidation

### Budget et imputations

### PAP

### Marché / Contrat

### Bénéficiaire

### Pièces justificatives

### Contrôles

### Workflow

### Historique

### Documents générés

### Commentaires

---

# 16. CARTE FINANCIÈRE PRINCIPALE

Créer une carte très lisible :

**Montant engagé**

20 000 000 FCFA

**Déjà liquidé**

8 000 000 FCFA

**Liquidation actuelle**

6 000 000 FCFA

**Cumul après opération**

14 000 000 FCFA

**Reste à liquider**

6 000 000 FCFA

---

# 17. CONTRÔLE DU PLAFOND DE LIQUIDATION

Le système doit clairement matérialiser la règle :

**Cumul des liquidations ≤ montant engagé**

Créer un composant indiquant :

- engagé ;
- déjà liquidé ;
- nouvelle liquidation ;
- cumul ;
- solde restant.

Exemple d’anomalie :

**Montant engagé : 15 000 000 FCFA**

**Déjà liquidé : 12 000 000 FCFA**

**Nouvelle Liquidation : 4 000 000 FCFA**

**Dépassement : 1 000 000 FCFA**

Afficher :

**Liquidation impossible — le montant dépasse le solde de l’Engagement.**

---

# 18. SERVICE FAIT

Le service fait doit constituer une section centrale.

Créer un écran ou formulaire dédié permettant de déclarer :

- prestation réalisée ;
- fourniture livrée ;
- travaux exécutés ;
- mission accomplie ;
- réception provisoire ;
- réception définitive.

---

# 19. FORMULAIRE DE CONSTAT DU SERVICE FAIT

Prévoir notamment :

### Informations générales

- référence Engagement ;
- fournisseur ;
- contrat ;
- marché ;
- bon de commande.

### Exécution

- date de début ;
- date de fin ;
- date de livraison ;
- lieu ;
- observations.

### Quantités

- prévue ;
- livrée ;
- acceptée ;
- rejetée.

### Conformité

- Conforme ;
- Partiellement conforme ;
- Non conforme.

---

# 20. CERTIFICATION DU SERVICE FAIT

Créer une action forte :

# CERTIFIER LE SERVICE FAIT

Cette action doit ouvrir une interface de confirmation affichant :

- nature de la prestation ;
- fournisseur ;
- montant concerné ;
- date ;
- documents ;
- réserves éventuelles ;
- déclaration du certificateur.

Afficher ensuite :

**Certifié par**

Nom

Fonction

Date

Heure

---

# 21. CERTIFICATION AVEC RÉSERVES

Créer un parcours spécifique.

Lorsque l’utilisateur sélectionne :

**Certifier avec réserves**

Afficher obligatoirement :

- type de réserve ;
- description ;
- impact financier ;
- montant à retenir ;
- délai de correction ;
- responsable ;
- pièces justificatives.

---

# 22. REFUS DE CERTIFICATION

Prévoir l’action :

**Refuser la certification**

Exiger :

- motif ;
- commentaire ;
- éléments non conformes ;
- pièces éventuelles.

La différence entre :

**retour**

et

**refus**

doit être compréhensible.

---

# 23. LIQUIDATION DE FOURNITURES

Créer une interface de rapprochement :

| Article | Commandé | Livré | Accepté | Facturé | Écart |
|---|---:|---:|---:|---:|---:|

Le système doit mettre en évidence automatiquement les écarts.

---

# 24. LIQUIDATION DE PRESTATIONS

Pour les prestations :

- livrable attendu ;
- livrable reçu ;
- validation technique ;
- pourcentage d’exécution ;
- date de réception ;
- montant correspondant ;
- réserves.

---

# 25. LIQUIDATION DE TRAVAUX

Créer des composants adaptés permettant notamment :

- situation de travaux ;
- attachement ;
- décompte ;
- avancement physique ;
- avancement financier ;
- pénalités ;
- retenue de garantie ;
- montant net liquidable.

---

# 26. LIQUIDATION TOTALE

Créer un état indiquant :

**Montant engagé : 10 000 000 FCFA**

**Montant liquidé : 10 000 000 FCFA**

**Reste à liquider : 0 FCFA**

Badge :

**TOTALLEMENT LIQUIDÉ**

---

# 27. LIQUIDATION PARTIELLE

Créer un état permettant plusieurs Liquidations rattachées au même Engagement.

Exemple :

**ENG-2026-000198**

Montant : 20 000 000 FCFA

Liquidations :

- LIQ-001 : 8 000 000
- LIQ-002 : 7 000 000
- Reste : 5 000 000

Créer une vue parent/enfants.

---

# 28. LIQUIDATION PAR SOUS-LIGNES

Puisque l’EB et l’Engagement peuvent comporter plusieurs rubriques, conserver cette granularité.

Créer :

| Rubrique | Engagé | Déjà liquidé | Cette liquidation | Reste |
|---|---:|---:|---:|---:|

Le contrôle doit être effectué ligne par ligne.

---

# 29. FACTURES

Créer un espace professionnel de gestion des factures.

Afficher :

- numéro facture ;
- fournisseur ;
- date ;
- montant HT ;
- taxes ;
- TTC ;
- devise ;
- échéance ;
- contrat ;
- statut ;
- fichier.

Prévoir :

**Ajouter une facture**

**Prévisualiser**

**Vérifier**

**Associer**

---

# 30. DÉTECTION DES DOUBLONS

La maquette doit matérialiser la détection d’un doublon potentiel.

Exemple :

**Doublon potentiel détecté**

Une facture portant le même numéro a déjà été enregistrée pour ce fournisseur.

Afficher :

- facture existante ;
- référence ;
- date ;
- montant ;
- lien vers le dossier.

---

# 31. CALCUL DU MONTANT BRUT ET NET

Créer un composant de calcul financier lisible.

Exemple :

**Montant brut**

10 000 000 FCFA

**Retenue à la source**

– 500 000 FCFA

**Pénalité**

– 100 000 FCFA

**Récupération d’avance**

– 1 000 000 FCFA

**Retenue de garantie**

– 500 000 FCFA

---

**NET À LIQUIDER**

7 900 000 FCFA

---

# 32. TAXES ET RETENUES

Créer une section permettant d’ajouter :

- TVA ;
- retenue fiscale ;
- retenue à la source ;
- garantie ;
- pénalité ;
- acompte ;
- avance récupérée ;
- autre retenue.

Chaque ligne doit afficher :

- type ;
- base ;
- taux ;
- montant ;
- règle de calcul.

---

# 33. PÉNALITÉS

Prévoir un composant permettant :

- date prévue ;
- date réelle ;
- nombre de jours de retard ;
- taux ;
- base ;
- plafond ;
- montant calculé.

---

# 34. RETENUE DE GARANTIE

Afficher notamment :

- taux ;
- montant ;
- date de début ;
- durée ;
- date prévue de libération ;
- statut.

---

# 35. AVANCES ET ACOMPTES

Créer un espace affichant :

- montant de l’avance ;
- montant récupéré ;
- récupération sur cette liquidation ;
- solde restant.

---

# 36. PIÈCES JUSTIFICATIVES

Distinguer trois catégories :

### Héritées de l’Engagement

### Ajoutées à la Liquidation

### Générées automatiquement

Exemples :

- facture ;
- bon de livraison ;
- PV de réception ;
- certificat de service fait ;
- attestation de conformité ;
- rapport ;
- décompte ;
- attachement ;
- marché ;
- contrat.

---

# 37. CHECKLIST DOCUMENTAIRE

Créer une checklist dynamique.

Exemple :

✓ Engagement visé

✓ Facture

✓ Bon de livraison

✓ PV de réception

⚠ Certificat de service fait à générer

⛔ Attestation obligatoire manquante

---

# 38. GESTION DOCUMENTAIRE

Chaque document doit afficher :

- nom ;
- type ;
- version ;
- auteur ;
- date ;
- statut ;
- source ;
- aperçu ;
- téléchargement.

Afficher également :

**Archivé dans la GED**

---

# 39. BÉNÉFICIAIRE

Créer une fiche synthétique :

- raison sociale ;
- NIF ;
- RCCM ;
- compte bancaire ;
- banque ;
- contact ;
- statut ;
- conformité.

Les données doivent être héritées du référentiel Tiers.

---

# 40. MARCHÉ / CONTRAT

Lorsque la dépense est liée à un marché, afficher :

- numéro ;
- objet ;
- titulaire ;
- lot ;
- montant initial ;
- avenants ;
- montant actuel ;
- montant déjà exécuté ;
- solde contractuel ;
- date de fin ;
- statut.

---

# 41. CONTRÔLE DU MARCHÉ

Créer des indicateurs :

✓ Marché actif

✓ Montant disponible

✓ Délai valide

⚠ Marché proche de l’échéance

⛔ Dépassement contractuel

---

# 42. PAP ET SUIVI DE L’EXÉCUTION PHYSIQUE

Pour une Liquidation PAP, afficher automatiquement :

- pilier ;
- axe ;
- objectif ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateur ;
- cible ;
- réalisation ;
- résultat attendu ;
- avancement physique ;
- montant engagé ;
- montant liquidé ;
- taux financier.

---

# 43. COMPARAISON PHYSIQUE / FINANCIÈRE

Créer une visualisation claire.

Exemple :

**Avancement physique**

40 %

**Exécution financière**

75 %

Afficher éventuellement :

**Écart significatif à analyser**

La maquette doit permettre à l’utilisateur de comprendre ce déséquilibre.

---

# 44. CONTRÔLES AUTOMATIQUES

Créer une zone :

# CONTRÔLES DE CONFORMITÉ

Exemple :

✓ Engagement visé

✓ Engagement actif

✓ Solde suffisant

✓ Service fait certifié

✓ Facture non dupliquée

✓ Bénéficiaire conforme

✓ Contrat valide

✓ Pièces obligatoires présentes

✓ Calcul financier cohérent

⚠ Écart physique/financier élevé

---

# 45. ESPACE DU SERVICE INITIATEUR

Créer une interface dédiée permettant :

- constater le service fait ;
- enregistrer réception ;
- renseigner quantités ;
- ajouter documents ;
- déclarer anomalies ;
- préparer certification.

---

# 46. ESPACE DU CERTIFICATEUR

Le certificateur doit obtenir une vue synthétique :

- objet ;
- fournisseur ;
- quantité ;
- montant ;
- documents ;
- observations ;
- anomalies.

Actions :

**Certifier**

**Certifier avec réserves**

**Retourner**

**Refuser**

---

# 47. TRANSMISSION AUTOMATIQUE AU CONTRÔLE FINANCIER

Après certification complète :

**Service fait certifié**

↓

**Transmission automatique**

↓

**Contrôleur Financier**

Éviter toute étape manuelle inutile lorsque la procédure prévoit la transmission automatique.

---

# 48. ESPACE DU CONTRÔLEUR FINANCIER

Créer une interface spécialement optimisée.

Il doit pouvoir voir rapidement :

- Engagement ;
- Liquidation ;
- montant ;
- service fait ;
- facture ;
- retenues ;
- bénéficiaire ;
- marché ;
- pièces ;
- budget ;
- historique ;
- contrôles automatiques.

---

# 49. ACTIONS DU CONTRÔLEUR FINANCIER

Prévoir :

### Viser

### Retourner

### Rejeter

### Demander un complément

### Ajouter une observation

Le motif doit être obligatoire pour :

- retour ;
- rejet ;
- complément.

---

# 50. VISA

Créer une fiche de visa comprenant :

- numéro ;
- date ;
- auteur ;
- montant brut ;
- retenues ;
- montant net liquidé ;
- observations.

Après visa, afficher :

**LIQUIDATION VISÉE**

---

# 51. VERROUILLAGE APRÈS VISA

Après le visa :

- les données financières doivent être verrouillées ;
- les documents officiels sont générés ;
- la GED est mise à jour ;
- l’Ordonnancement est créé automatiquement.

La maquette doit clairement matérialiser cet état verrouillé.

---

# 52. RETOUR POUR CORRECTION

Créer une expérience dédiée.

Afficher :

**Liquidation retournée**

Auteur

Date

Motif

Éléments concernés

Action attendue

Les onglets concernés doivent porter un badge d’alerte.

---

# 53. REJET

Créer une présentation distincte :

**LIQUIDATION REJETÉE**

Avec :

- autorité ;
- date ;
- motif ;
- conséquence ;
- éventuelle action de clôture ou reprise.

---

# 54. NON-CONFORMITÉ DU SERVICE

Créer un parcours spécifique lorsque la prestation n’est pas conforme.

Afficher :

- anomalie ;
- gravité ;
- impact financier ;
- fournisseur ;
- actions correctives ;
- échéance ;
- pièces de preuve.

Actions possibles :

**Suspendre la liquidation**

**Retour fournisseur**

**Demander correction**

---

# 55. FICHE D’ANOMALIE

Prévoir un composant ou document comprenant :

- type d’anomalie ;
- description ;
- date ;
- responsable ;
- documents ;
- action corrective ;
- échéance ;
- statut.

---

# 56. AVOIRS

Créer un parcours permettant d’associer :

**Facture initiale**

↓

**Avoir**

↓

**Nouveau montant**

Conserver les liens entre documents.

---

# 57. ANNULATION DE LIQUIDATION

Prévoir une procédure exceptionnelle :

- demander annulation ;
- motif ;
- pièce ;
- autorité ;
- impact ;
- décision ;
- journalisation.

---

# 58. RÉOUVERTURE

Créer un état spécifique :

**Liquidation rouverte exceptionnellement**

Afficher :

- autorisation ;
- motif ;
- date ;
- acteur.

L’historique antérieur ne doit jamais être écrasé.

---

# 59. HISTORIQUE MÉTIER

Créer une timeline.

Exemple :

**15/09/2026 — 10:15**

Liquidation générée automatiquement

**15/09/2026 — 14:20**

Facture ajoutée

**16/09/2026 — 09:00**

Service fait constaté

**16/09/2026 — 11:45**

Service fait certifié

**16/09/2026 — 11:46**

Transmis automatiquement au Contrôleur Financier

**17/09/2026 — 10:30**

Visa accordé

**17/09/2026 — 10:31**

Ordonnancement généré automatiquement

---

# 60. JOURNAL D’AUDIT

Créer une vue spécifique réservée aux profils habilités.

Afficher :

- date ;
- heure ;
- utilisateur ;
- rôle ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- document ;
- événement système.

Différencier clairement :

**Timeline métier**

et

**Audit technique**

---

# 61. DOCUMENTS GÉNÉRÉS

Créer une zone regroupant notamment :

- Fiche de Liquidation ;
- Certificat de service fait ;
- fiche de contrôle ;
- bordereau ;
- fiche de retenues ;
- visa ;
- fiche d’anomalie ;
- rapprochement.

---

# 62. MAQUETTE DU PDF « FICHE DE LIQUIDATION »

Créer une véritable maquette du PDF officiel.

Inclure :

- logo CEEAC ;
- référence Liquidation ;
- référence Engagement ;
- EB ;
- exercice ;
- structure ;
- fournisseur ;
- objet ;
- facture ;
- ligne budgétaire ;
- imputation ;
- montant engagé ;
- déjà liquidé ;
- montant brut ;
- retenues ;
- net liquidé ;
- certification ;
- visa ;
- QR Code ou identifiant de vérification.

---

# 63. CERTIFICAT DE SERVICE FAIT PDF

Créer une maquette du certificat comprenant :

- référence ;
- bénéficiaire ;
- prestation ;
- période ;
- montant ;
- conformité ;
- réserves ;
- certificateur ;
- date ;
- signature.

---

# 64. GED

Tous les documents :

- importés ;
- hérités ;
- générés

doivent être représentés comme automatiquement intégrés dans la GED.

Classification :

**Exercice → Chaîne de dépense → Liquidation → Référence**

---

# 65. MES TÂCHES

Créer les cartes de tâche.

Exemple :

**LIQ-2026-000245**

Acquisition de matériels réseau

**7 800 000 FCFA**

Action attendue :

**Certifier le service fait**

Reçu :

**Aujourd’hui à 08:35**

---

# 66. NOTIFICATIONS

Prévoir :

- Liquidation créée ;
- service fait attendu ;
- certification requise ;
- pièce manquante ;
- dossier retourné ;
- correction effectuée ;
- dossier envoyé au CF ;
- visa accordé ;
- rejet ;
- Ordonnancement créé.

Permettre un accès direct au dossier.

---

# 67. DÉLAIS

Afficher :

**Temps dans l’étape**

Exemple :

**En certification depuis 1 j 4 h**

États :

- Normal ;
- Proche échéance ;
- Retard ;
- Critique.

---

# 68. ESCALADE

Prévoir visuellement :

- rappel ;
- alerte ;
- escalade hiérarchique.

---

# 69. REPORTING

Créer ou adapter les vues de reporting :

- montant engagé ;
- montant liquidé ;
- reste ;
- taux ;
- délai ;
- structure ;
- bénéficiaire ;
- activité ;
- PAP/Hors PAP ;
- marché ;
- anomalies ;
- retours ;
- rejets.

---

# 70. KPI

Prévoir notamment :

### Taux de liquidation

**Montant liquidé / Montant engagé × 100**

### Reste à liquider

**Montant engagé – Liquidations cumulées**

### Délai moyen de liquidation

**Date du visa – Date de création**

### Taux de retour

**Liquidations retournées / Liquidations transmises**

---

# 71. RECHERCHE GLOBALE

Une Liquidation doit être retrouvable par :

- référence LIQ ;
- Engagement ;
- EB ;
- facture ;
- fournisseur ;
- marché ;
- ligne ;
- montant ;
- structure.

---

# 72. EXPORTS

Prévoir :

- PDF ;
- Excel ;
- CSV.

---

# 73. DROITS ET RÔLES

Adapter l’interface à :

- service initiateur ;
- expert ;
- chef de service ;
- certificateur ;
- Contrôleur Financier ;
- audit ;
- consultation ;
- administrateur.

Les boutons doivent dépendre du rôle et du statut.

---

# 74. SÉPARATION DES FONCTIONS

La maquette doit matérialiser la séparation entre :

- constatation ;
- certification ;
- contrôle ;
- visa.

Ne pas proposer une interface laissant penser qu’un seul utilisateur accomplit automatiquement toutes les opérations.

---

# 75. ACTIONS CONTEXTUELLES

Les actions doivent être regroupées intelligemment.

Exemple :

### En attente de service fait

**Constater**

### À certifier

**Certifier**

**Retourner**

### Au Contrôle Financier

**Viser**

**Retourner**

**Rejeter**

---

# 76. DESIGN

La qualité graphique doit être au même niveau ou supérieure à la refonte des modules :

- Expression de Besoin ;
- Engagement.

Le design doit être :

- institutionnel ;
- moderne ;
- premium ;
- sobre ;
- professionnel ;
- dense mais lisible ;
- rassurant ;
- orienté productivité.

---

# 77. DESIGN SYSTEM

Créer ou réutiliser :

- workflow banner ;
- cards financières ;
- checklist ;
- cards document ;
- table factures ;
- table service fait ;
- table retenues ;
- timeline ;
- badges ;
- alerts ;
- panels de décision ;
- components PAP ;
- cards bénéficiaire/marché.

---

# 78. ÉTATS DES COMPOSANTS

Prévoir :

- default ;
- hover ;
- focus ;
- selected ;
- disabled ;
- read-only ;
- loading ;
- success ;
- warning ;
- error.

---

# 79. RESPONSIVE DESIGN

Créer :

### Desktop

Interface de travail principale.

### Laptop

Optimisée pour usage courant.

### Tablette

Consultation et validation.

### Mobile

Prioritairement :

- notifications ;
- Mes tâches ;
- consultation ;
- décision simple ;
- suivi.

---

# 80. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA :

- contraste ;
- tailles ;
- labels ;
- navigation clavier ;
- focus ;
- statut non uniquement basé sur la couleur.

---

# 81. ÉTATS EXCEPTIONNELS À MAQUETTER

Créer les états :

- facture doublon ;
- dépassement de l’Engagement ;
- service non fait ;
- service non conforme ;
- pièce manquante ;
- fournisseur bloqué ;
- marché expiré ;
- contrat dépassé ;
- incohérence fiscale ;
- exercice clôturé ;
- droits insuffisants ;
- erreur système ;
- workflow indisponible.

---

# 82. PROTOTYPE INTERACTIF

Créer un prototype couvrant au minimum :

### Scénario 1

Engagement visé → Liquidation automatique.

### Scénario 2

Constat du service fait.

### Scénario 3

Certification.

### Scénario 4

Certification avec réserves.

### Scénario 5

Facture ajoutée.

### Scénario 6

Facture doublon détectée.

### Scénario 7

Liquidation partielle.

### Scénario 8

Tentative de dépassement.

### Scénario 9

Retenues et pénalités.

### Scénario 10

Transmission automatique au CF.

### Scénario 11

Retour pour correction.

### Scénario 12

Correction et retransmission.

### Scénario 13

Visa.

### Scénario 14

Ordonnancement automatique.

### Scénario 15

Non-conformité de prestation.

### Scénario 16

Annulation exceptionnelle.

---

# 83. COHÉRENCE AVEC LES AUTRES MODULES

Auditer les impacts sur :

- EB ;
- Engagement ;
- Ordonnancement ;
- Paiement ;
- Budget ;
- PAP ;
- Suivi-Évaluation ;
- Marchés ;
- Entreprises/Tiers ;
- GED ;
- Notifications ;
- Mes tâches ;
- Reporting ;
- Audit ;
- Workflow.

La Liquidation ne doit jamais devenir un module isolé.

---

# 84. ARCHITECTURE FIGMA RECOMMANDÉE

Organiser les frames :

**LIQ / 00 — Audit**

**LIQ / 01 — Components**

**LIQ / 02 — Dashboard**

**LIQ / 03 — List**

**LIQ / 04 — Detail**

**LIQ / 05 — Service Rendered**

**LIQ / 06 — Certification**

**LIQ / 07 — Invoice**

**LIQ / 08 — Financial Calculation**

**LIQ / 09 — Retentions & Penalties**

**LIQ / 10 — Budget**

**LIQ / 11 — PAP**

**LIQ / 12 — Procurement**

**LIQ / 13 — Documents**

**LIQ / 14 — Financial Control**

**LIQ / 15 — Return & Rejection**

**LIQ / 16 — Exceptions**

**LIQ / 17 — History**

**LIQ / 18 — PDF**

**LIQ / 19 — Reporting**

**LIQ / 20 — Responsive**

**LIQ / 21 — Prototype**

---

# 85. MATRICE DE CONFORMITÉ FINALE

À la fin, produire une matrice de conformité.

Exemple :

| Exigence | Écran | Composant | Interaction | Statut |
|---|---|---|---|---|
| Création automatique | Workflow | Transition | Système | Conforme |
| Service fait | Certification | Service Card | Action | Conforme |
| Plafond ENG | Finance | Budget Card | Temps réel | Conforme |
| Visa CF | CF | Visa Panel | Décision | Conforme |
| Ordonnancement auto | Workflow | Transition | Système | Conforme |

Aucune exigence essentielle du document joint ne doit rester sans correspondance.

---

# 86. NON-RÉGRESSION

La refonte ne doit pas :

- casser les données de l’Engagement ;
- perdre les liens avec l’EB ;
- supprimer les pièces ;
- écraser les historiques ;
- permettre des dépassements ;
- permettre une Liquidation sans Engagement valide ;
- rompre la GED ;
- casser les workflows ;
- créer une étape manuelle lorsqu’elle doit être automatique.

---

# 87. RÉSULTAT ATTENDU POUR LES DÉVELOPPEURS

La maquette finale doit être suffisamment précise pour permettre à une équipe React.js/Laravel de comprendre :

- les pages ;
- les composants ;
- les données ;
- les formulaires ;
- les contrôles ;
- les calculs ;
- les états ;
- les workflows ;
- les rôles ;
- les documents ;
- les notifications ;
- les transitions ;
- les erreurs ;
- les cas particuliers.

---

# 88. PRINCIPE UX FONDAMENTAL

À tout moment, l’utilisateur doit pouvoir répondre en quelques secondes à ces questions :

**Quelle dépense suis-je en train de liquider ?**

**Quel Engagement la couvre ?**

**La prestation a-t-elle réellement été exécutée ?**

**Quel montant peut réellement être liquidé ?**

**Quels documents le prouvent ?**

**Quel est le montant brut ?**

**Quelles retenues sont appliquées ?**

**Quel est le net liquidé ?**

**Qui doit agir maintenant ?**

**Quelle est la prochaine étape ?**

Si l’interface ne permet pas de répondre rapidement à ces questions, elle doit être repensée.

---

# 89. INSTRUCTION FINALE

Ne te contente pas de redessiner les interfaces existantes.

Effectue une véritable réforme fonctionnelle, graphique et ergonomique du module LIQUIDATION.

Le parcours final doit matérialiser sans ambiguïté :

**ENGAGEMENT VISÉ**

→ **LIQUIDATION CRÉÉE AUTOMATIQUEMENT**

→ **CONSTAT DU SERVICE FAIT**

→ **CERTIFICATION**

→ **FACTURE ET PIÈCES JUSTIFICATIVES**

→ **CALCUL DU MONTANT BRUT, DES RETENUES ET DU NET**

→ **CONTRÔLES DE CONFORMITÉ**

→ **TRANSMISSION AUTOMATIQUE AU CONTRÔLEUR FINANCIER**

→ **VISA**

→ **DOCUMENTS OFFICIELS**

→ **ARCHIVAGE GED**

→ **ORDONNANCEMENT GÉNÉRÉ AUTOMATIQUEMENT**

La nouvelle maquette doit devenir une référence de qualité pour toute la chaîne de dépense de BUDGET-CEEAC.

Elle doit être :

**fonctionnellement exhaustive**,  
**financièrement rigoureuse**,  
**auditable**,  
**traçable**,  
**sécurisée**,  
**ergonomiquement fluide**,  
**graphiquement exceptionnelle**,  
**cohérente avec les standards d’une application moderne de gestion des finances publiques**,  
et **directement exploitable pour le développement**.

Avant de terminer, relis intégralement le fichier joint contenant la **Description détaillée du module LIQUIDATION** et vérifie exigence par exigence que chacune est matérialisée dans :

- un écran ;
- un composant ;
- un état ;
- une interaction ;
- un calcul ;
- un contrôle ;
- un workflow ;
- ou un document.

Tant qu’une exigence importante n’a pas de traduction précise dans la nouvelle maquette, la refonte doit être considérée comme incomplète.