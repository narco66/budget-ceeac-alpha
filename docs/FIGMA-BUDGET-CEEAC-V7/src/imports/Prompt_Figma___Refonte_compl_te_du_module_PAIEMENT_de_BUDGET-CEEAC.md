# PROMPT FIGMA — REFONTE COMPLÈTE DU MODULE PAIEMENT DE BUDGET-CEEAC

## 1. CONTEXTE GÉNÉRAL

Tu travailles sur la maquette Figma existante de **BUDGET-CEEAC**, application intégrée de planification, budgétisation, exécution de la dépense, contrôle financier, suivi-évaluation, gestion documentaire, reporting et gestion comptable de la Commission de la CEEAC.

Je joins à ce prompt le fichier contenant la :

# « DESCRIPTION DÉTAILLÉE DU MODULE PAIEMENT DE BUDGET-CEEAC »

Ce document devient la **référence fonctionnelle principale pour la refonte du module PAIEMENT**.

Ta mission est de réaliser une **refonte complète, profonde, cohérente et professionnelle du module Paiement dans la maquette Figma existante**.

Il ne s’agit pas seulement de moderniser les interfaces existantes.

Tu dois réexaminer complètement :

- l’architecture du module ;
- les parcours utilisateurs ;
- les rôles ;
- les statuts ;
- les contrôles comptables ;
- la prise en charge des dossiers ;
- la préparation des règlements ;
- les validations ;
- les paiements par virement, chèque ou caisse ;
- les paiements partiels ;
- les paiements groupés ;
- la gestion des bénéficiaires ;
- les coordonnées bancaires ;
- les comptes de paiement de la CEEAC ;
- les preuves de paiement ;
- les erreurs bancaires ;
- les rejets ;
- les suspensions ;
- les rapprochements ;
- les documents ;
- la GED ;
- les notifications ;
- Mes tâches ;
- le journal d’audit ;
- le Reporting ;
- la clôture financière de la dépense.

Le résultat attendu doit être un module **fonctionnellement exhaustif, financièrement rigoureux, sécurisé, auditable, ergonomique et directement exploitable par les développeurs**.

---

# 2. POSITION DU MODULE PAIEMENT DANS LA CHAÎNE DE DÉPENSE

Le Paiement constitue la dernière étape opérationnelle de la chaîne :

**Expression de Besoin**

↓

**Engagement**

↓

**Liquidation**

↓

**Ordonnancement**

↓

**Paiement**

Le parcours cible est :

**Ordre de Paiement signé**

↓

**Transmission automatique à l’Agence Comptable**

↓

**Création automatique du dossier Paiement**

↓

**Prise en charge par le Comptable**

↓

**Contrôle et préparation**

↓

**Validation Chef Comptable**

↓

**Validation / signature Agent Comptable**

↓

**Exécution du règlement**

↓

**Enregistrement de la preuve**

↓

**Rapprochement bancaire ou de caisse**

↓

**Clôture financière du dossier**

La maquette doit permettre de comprendre ce parcours en quelques secondes.

---

# 3. SOURCES DE VÉRITÉ

Utiliser les sources selon l’ordre suivant :

1. **Description détaillée du module PAIEMENT jointe au présent prompt** ;
2. cahier des charges actuel de BUDGET-CEEAC ;
3. description détaillée du module ORDONNANCEMENT ;
4. description détaillée du module LIQUIDATION ;
5. description détaillée du module ENGAGEMENT ;
6. description détaillée du module EXPRESSION DE BESOIN ;
7. procédures de la chaîne de dépense ;
8. référentiel budgétaire ;
9. référentiel organisationnel ;
10. référentiel des tiers ;
11. référentiel des comptes bancaires et de caisse ;
12. référentiel des marchés ;
13. GED ;
14. maquette Figma existante.

En cas de contradiction, la nouvelle description détaillée du module Paiement prévaut pour les règles propres à ce module.

---

# 4. AUDIT OBLIGATOIRE AVANT TOUTE MODIFICATION

Avant de reconstruire les écrans, réalise un audit exhaustif du module Paiement existant.

Classe les éléments en quatre catégories :

## 4.1. Conforme

À conserver.

## 4.2. Partiellement conforme

À enrichir, corriger ou réorganiser.

## 4.3. Obsolète

À remplacer ou supprimer.

## 4.4. Manquant

À créer.

Construire une logique :

**Exigence fonctionnelle → Existant Figma → Écart → Action → Écran / composant**

Ne commence pas par redessiner. Comprends d’abord ce qui existe et ce qui doit évoluer.

---

# 5. RÈGLE DE NON-RÉGRESSION

La refonte ne doit pas :

- casser le lien avec l’Ordonnancement ;
- supprimer des données ou documents utiles ;
- perdre les historiques ;
- créer des doublons ;
- modifier les montants validés en amont ;
- casser la GED ;
- casser Mes tâches ;
- casser les notifications ;
- casser le Reporting ;
- casser la recherche globale ;
- casser les droits existants conformes.

Avant toute suppression d’un écran ou composant, vérifier sa fonction et ses dépendances.

---

# 6. PRINCIPE FONDAMENTAL : CRÉATION AUTOMATIQUE

Dans le processus nominal, aucun utilisateur ne doit cliquer sur :

**« Créer un Paiement »**

Après signature définitive de l’Ordre de Paiement :

**OP signé**

→ **Paiement créé automatiquement**

→ **Transmission à l’Agence Comptable**

→ **Notification**

→ **Apparition dans Mes tâches**

Cette continuité doit être matérialisée dans la maquette.

---

# 7. AUCUNE RESSAISIE INUTILE

Le Paiement doit hériter automatiquement des données précédemment validées :

- EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- OP ;
- exercice ;
- bénéficiaire ;
- structure ;
- objet ;
- PAP/Hors PAP ;
- montant engagé ;
- montant liquidé ;
- retenues ;
- net ordonnancé ;
- facture ;
- marché ;
- contrat ;
- coordonnées bancaires connues ;
- pièces ;
- signatures ;
- données PAP.

Les données héritées doivent être clairement identifiées comme telles.

---

# 8. IDENTIFICATION DU DOSSIER

Afficher clairement :

**PAY-2026-000154**

Puis la chaîne :

**ORD-2026-000184**

**LIQ-2026-000167**

**ENG-2026-000142**

**EB-2026-000119**

Permettre une navigation rapide vers les dossiers précédents.

---

# 9. TABLEAU DE BORD PAIEMENT

Créer ou refondre complètement le tableau de bord.

Prévoir notamment :

### Dossiers

- Tous ;
- Nouveaux ;
- À prendre en charge ;
- En préparation ;
- À compléter ;
- À contrôler ;
- À valider ;
- À signer ;
- Autorisés au paiement ;
- En cours de règlement ;
- Payés ;
- Payés partiellement ;
- Suspendus ;
- Retournés ;
- Rejetés ;
- En échec ;
- À rapprocher ;
- Rapprochés ;
- Clôturés.

---

# 10. KPI FINANCIERS

Prévoir des cartes interactives telles que :

**Montant total ordonnancé**

**Montant total payé**

**Reste à payer**

**Paiements du jour**

**Paiements du mois**

**Montant en attente de validation**

**Montant à rapprocher**

**Paiements PAP**

**Paiements Hors PAP**

**Paiements en anomalie**

Un clic sur une carte doit filtrer la liste correspondante.

---

# 11. ANALYSES VISUELLES

Prévoir des graphiques réellement utiles :

- paiements par mois ;
- paiements par structure ;
- paiements par bénéficiaire ;
- paiements par mode ;
- paiements par compte bancaire ;
- PAP/Hors PAP ;
- paiements par statut ;
- délais moyens ;
- rapprochements.

Éviter les visualisations décoratives sans valeur opérationnelle.

---

# 12. LISTE DES PAIEMENTS

Créer un tableau professionnel avec notamment :

- référence PAY ;
- OP ;
- Liquidation ;
- Engagement ;
- EB ;
- date ;
- bénéficiaire ;
- objet ;
- structure ;
- PAP/Hors PAP ;
- net ordonnancé ;
- payé ;
- solde ;
- mode ;
- banque/caisse ;
- statut ;
- acteur attendu ;
- dernière action ;
- ancienneté.

---

# 13. FILTRES

Prévoir :

- exercice ;
- période ;
- structure ;
- bénéficiaire ;
- mode ;
- compte bancaire ;
- statut ;
- montant ;
- PAP/Hors PAP ;
- marché ;
- acteur attendu ;
- référence bancaire.

Prévoir aussi :

- recherche globale ;
- tri ;
- export ;
- pagination ;
- vues enregistrées.

---

# 14. PAGE DÉTAIL DU PAIEMENT

Créer une fiche complète.

En-tête :

**PAY-2026-000154**

Objet de la dépense

Puis :

- statut ;
- bénéficiaire ;
- montant ;
- mode ;
- acteur attendu.

---

# 15. BANDEAU WORKFLOW

Créer un composant cohérent avec EB, Engagement, Liquidation et Ordonnancement.

Exemple :

**ÉTAPE ACTUELLE**

Préparation du règlement

**DERNIÈRE ACTION**

Dossier pris en charge par le Comptable

**ACTEUR ATTENDU**

Chef Comptable

**PROCHAINE ÉTAPE**

Validation puis signature Agent Comptable

---

# 16. ORGANISATION PAR ONGLETS

Prévoir au minimum :

### Synthèse

### Ordonnancement source

### Bénéficiaire

### Coordonnées de paiement

### Montants

### Mode de paiement

### Pièces justificatives

### Contrôles comptables

### PAP

### Marché / Contrat

### Workflow

### Historique

### Documents générés

### Rapprochement

### Commentaires

---

# 17. CARTE FINANCIÈRE PRINCIPALE

Afficher clairement :

**Montant ordonnancé**

8 750 000 FCFA

**Déjà payé**

0 FCFA

**Paiement en cours**

8 750 000 FCFA

**Reste après paiement**

0 FCFA

Pour les paiements partiels, actualiser automatiquement.

---

# 18. ESPACE « MES DOSSIERS À TRAITER »

Créer une page ou un composant spécifique pour l’Agence Comptable.

Afficher :

- référence ;
- bénéficiaire ;
- montant ;
- mode ;
- action attendue ;
- ancienneté ;
- priorité ;
- statut.

Le traitement doit être accessible directement depuis cette liste.

---

# 19. PRISE EN CHARGE

Lorsqu’un dossier arrive :

**Nouveau dossier reçu**

Action :

# PRENDRE EN CHARGE

Après clic, enregistrer :

- utilisateur ;
- rôle ;
- date ;
- heure.

Le dossier devient :

**Pris en charge**

---

# 20. ESPACE DU COMPTABLE

Créer une interface dédiée permettant de :

- contrôler le dossier ;
- vérifier l’OP ;
- vérifier le bénéficiaire ;
- vérifier les coordonnées bancaires ;
- choisir ou confirmer le mode de règlement ;
- saisir les références nécessaires ;
- joindre les documents ;
- enregistrer ;
- transmettre.

L’interface doit être orientée productivité.

---

# 21. ESPACE DU CHEF COMPTABLE

Créer une vue synthétique permettant de :

- contrôler ;
- valider ;
- retourner ;
- demander correction ;
- transmettre à l’Agent Comptable.

Présenter les anomalies en priorité.

---

# 22. ESPACE DE L’AGENT COMPTABLE

Créer une véritable page décisionnelle.

Afficher :

### Bénéficiaire

### Montant

### Mode

### Compte débité

### OP

### Pièces

### Contrôles

### Anomalies

### Historique

Actions :

**Valider / Signer**

**Suspendre**

**Retourner**

**Rejeter**

---

# 23. CONTRÔLES COMPTABLES AUTOMATIQUES

Créer une zone :

# CONTRÔLES AVANT PAIEMENT

Exemple :

✓ OP signé

✓ Liquidation valide

✓ Bénéficiaire actif

✓ Coordonnées de paiement vérifiées

✓ Montant cohérent

✓ Paiement non déjà exécuté

✓ Pièces complètes

✓ Compte de paiement actif

✓ Mode autorisé

✓ Exercice ouvert

⚠ Coordonnées bancaires modifiées récemment

Toute anomalie bloquante doit empêcher la validation.

---

# 24. BÉNÉFICIAIRE

Créer une fiche claire :

- raison sociale ;
- type ;
- NIF ;
- RCCM ;
- adresse ;
- contacts ;
- banque ;
- compte ;
- titulaire ;
- statut ;
- conformité.

Afficher :

**Voir fiche complète**

---

# 25. VÉRIFICATION DES COORDONNÉES BANCAIRES

Créer un composant indiquant :

**Coordonnées vérifiées**

- vérifiées par ;
- date ;
- document justificatif ;
- dernière modification.

États :

✓ Vérifiées

⚠ À confirmer

⛔ Incomplètes

---

# 26. DÉTECTION DES CHANGEMENTS SENSIBLES

Si le compte a changé récemment, afficher :

# ALERTE — COORDONNÉES BANCAIRES MODIFIÉES

Avec :

- ancien compte masqué ;
- nouveau compte ;
- date ;
- utilisateur ;
- justification ;
- statut de vérification.

---

# 27. MODES DE PAIEMENT

Créer trois parcours au minimum :

### Virement bancaire

### Chèque

### Caisse Agence Comptable

Le mode sélectionné doit modifier dynamiquement le formulaire.

---

# 28. VIREMENT BANCAIRE

Créer un formulaire spécifique contenant :

- compte CEEAC débité ;
- banque bénéficiaire ;
- compte bénéficiaire ;
- titulaire ;
- montant ;
- objet ;
- date d’exécution ;
- date valeur ;
- référence virement ;
- statut.

---

# 29. CHÈQUE

Créer un parcours avec :

- banque ;
- compte ;
- numéro chèque ;
- bénéficiaire ;
- montant ;
- date émission ;
- date remise ;
- bénéficiaire ayant reçu ;
- preuve de remise.

---

# 30. CAISSE

Créer un formulaire avec :

- caisse ;
- caissier ;
- bénéficiaire ;
- montant ;
- motif ;
- pièce d’identité ;
- reçu ;
- date ;
- signature.

---

# 31. RÉFÉRENTIEL DES COMPTES DE PAIEMENT

Créer les écrans permettant de visualiser :

- banque ;
- compte ;
- devise ;
- type ;
- statut ;
- périmètre ;
- solde si disponible ;
- dernière synchronisation.

Les comptes doivent être sélectionnés depuis ce référentiel.

---

# 32. CONTRÔLE DU COMPTE CEEAC

Afficher :

✓ Compte actif

✓ Devise correcte

✓ Mode autorisé

✓ Signataire habilité

⚠ Solde à vérifier

ou

⛔ Solde insuffisant

si cette information est disponible.

---

# 33. PAIEMENT TOTAL

Créer un état :

**Net ordonnancé**

8 750 000 FCFA

**Paiement**

8 750 000 FCFA

**Reste**

0 FCFA

Badge :

**PAIEMENT TOTAL**

---

# 34. PAIEMENT PARTIEL

Prévoir :

**Net ordonnancé**

10 000 000 FCFA

**Déjà payé**

6 000 000 FCFA

**Nouveau paiement**

2 500 000 FCFA

**Reste**

1 500 000 FCFA

Le dossier reste ouvert.

---

# 35. PAIEMENTS MULTIPLES

Créer une vue :

| Versement | Date | Mode | Montant | Référence | Statut |
|---|---|---|---:|---|---|

Afficher :

**Total payé**

**Solde**

---

# 36. RÈGLE DE PLAFONNEMENT

Le système doit matérialiser :

**Cumul paiements ≤ Montant ordonnancé**

En cas de dépassement :

# PAIEMENT IMPOSSIBLE

**Dépassement détecté : XXX FCFA**

---

# 37. PAIEMENTS GROUPÉS

Créer un parcours de lot de paiements.

Exemple :

**LOT PAY-2026-018**

12 paiements

32 450 000 FCFA

Banque : XYZ

Statut : En préparation

Permettre :

- voir chaque paiement ;
- sélectionner ;
- exclure un dossier ;
- valider le lot ;
- suivre le retour banque.

---

# 38. CONTRÔLE ANTI-DOUBLON

Créer des alertes sur :

- même OP ;
- même bénéficiaire ;
- même montant ;
- même référence bancaire ;
- même facture ;
- même chèque.

Afficher :

**Doublon potentiel détecté**

avec lien vers le paiement existant.

---

# 39. VALIDATION DU PAIEMENT

Représenter le workflow :

**Comptable**

↓

**Chef Comptable**

↓

**Agent Comptable**

↓

**Exécution**

Le workflow doit rester paramétrable.

---

# 40. ACTIONS DU COMPTABLE

Selon le statut :

**Prendre en charge**

**Compléter**

**Ajouter pièce**

**Préparer règlement**

**Enregistrer**

**Soumettre**

---

# 41. ACTIONS DU CHEF COMPTABLE

Prévoir :

**Contrôler**

**Valider**

**Retourner**

**Demander correction**

**Transmettre**

---

# 42. ACTIONS DE L’AGENT COMPTABLE

Prévoir :

**Autoriser**

**Signer**

**Suspendre**

**Retourner**

**Rejeter**

Ne pas disperser les actions.

---

# 43. SUPPRESSION DES VERROUS ARTIFICIELS

La maquette ne doit pas laisser penser qu’un utilisateur habilité est bloqué uniquement parce qu’il a déjà agi auparavant.

Les restrictions doivent reposer sur :

- rôle ;
- séparation des fonctions ;
- statut ;
- règle métier ;
- délégation.

---

# 44. ÉTAT « AUTORISÉ AU PAIEMENT »

Créer un état spécifique avant exécution.

Afficher :

# PAIEMENT AUTORISÉ

Avec :

- Agent Comptable ;
- date ;
- montant ;
- mode ;
- compte source.

Cet état est distinct de :

**Paiement exécuté**

---

# 45. EXÉCUTION DU PAIEMENT

Créer une interface permettant d’enregistrer :

- date d’exécution ;
- référence ;
- montant ;
- compte ;
- banque ;
- opérateur ;
- preuve ;
- statut.

Action :

# MARQUER COMME EXÉCUTÉ

uniquement si le système n’est pas directement intégré à la banque.

---

# 46. INTÉGRATION BANCAIRE

Si une API bancaire existe, prévoir un état :

**Envoyé à la banque**

puis :

**Accepté**

**En traitement**

**Exécuté**

ou

**Rejeté**

La maquette doit pouvoir supporter ces états sans refonte future.

---

# 47. PREUVE DE PAIEMENT

Créer une zone dédiée regroupant :

- avis de débit ;
- preuve de virement ;
- chèque ;
- reçu ;
- bordereau ;
- accusé bénéficiaire ;
- relevé.

Afficher :

**Preuve disponible**

ou

**Preuve en attente**

---

# 48. PAIEMENT EXÉCUTÉ

Créer un écran de succès :

# PAIEMENT EXÉCUTÉ

**Bénéficiaire**

Société ABC

**Montant**

8 750 000 FCFA

**Mode**

Virement

**Référence bancaire**

TRX-XXXXXX

**Date**

18/09/2026

---

# 49. DISTINCTION DES STATUTS DE PAIEMENT

La maquette doit clairement distinguer :

### Validé

### Autorisé

### Transmis à la banque

### Exécuté

### Confirmé

### Rapproché

### Clôturé

Ne jamais réduire tout le cycle à un simple statut « payé ».

---

# 50. ÉCHEC DE PAIEMENT

Créer un écran spécifique :

# PAIEMENT ÉCHOUÉ

Exemples de motifs :

- compte fermé ;
- coordonnées invalides ;
- solde insuffisant ;
- banque indisponible ;
- bénéficiaire inconnu.

Afficher :

**Corriger**

**Relancer**

sans générer un nouveau paiement.

---

# 51. SUSPENSION

Créer un état :

# PAIEMENT SUSPENDU

Avec :

- motif ;
- autorité ;
- date ;
- éléments bloquants ;
- action requise.

---

# 52. RETOUR

Créer un parcours permettant de retourner vers :

- Comptable ;
- Chef Comptable ;
- Ordonnancement ;
- autre étape autorisée.

Exiger :

- motif ;
- commentaire ;
- destinataire.

---

# 53. REJET

Créer un état clairement distinct :

# PAIEMENT REJETÉ

Avec :

- motif ;
- autorité ;
- date ;
- conséquence.

---

# 54. RÉVOCATION AVANT EXÉCUTION

Créer un parcours :

**Annuler / Révoquer le paiement préparé**

avec :

- motif ;
- demandeur ;
- approbateur ;
- pièce ;
- statut.

---

# 55. CORRECTION APRÈS EXÉCUTION

Un paiement exécuté ne doit pas être modifiable directement.

Prévoir des parcours spécifiques :

- contre-passation ;
- remboursement ;
- régularisation ;
- annulation comptable.

Conserver l’historique complet.

---

# 56. RAPPROCHEMENT BANCAIRE

Créer un espace dédié.

Afficher :

**Paiement système**

**Montant banque**

**Date valeur**

**Référence**

**Écart**

États :

- Non rapproché ;
- Rapproché automatiquement ;
- Rapproché manuellement ;
- Écart détecté.

---

# 57. RAPPROCHEMENT MANUEL

Créer une interface permettant :

- rechercher ligne bancaire ;
- associer ;
- saisir justification ;
- valider.

---

# 58. IMPORT DE RELEVÉS

Prévoir :

**Importer relevé**

ou

**Synchroniser banque**

Puis visualiser :

- transactions reconnues ;
- transactions non reconnues ;
- correspondances proposées ;
- anomalies.

---

# 59. ÉCART DE RAPPROCHEMENT

Créer un écran montrant :

**Montant BUDGET-CEEAC**

5 000 000 FCFA

**Montant banque**

4 950 000 FCFA

**Écart**

50 000 FCFA

Actions :

**Justifier**

**Corriger association**

**Signaler anomalie**

---

# 60. RAPPROCHEMENT DE CAISSE

Créer également un espace pour :

- paiement caisse ;
- reçu ;
- montant ;
- caisse ;
- date ;
- bénéficiaire ;
- signature.

---

# 61. GED

Tous les documents doivent apparaître comme automatiquement archivés.

Classement :

**Exercice**

→ **Chaîne de dépense**

→ **Paiement**

→ **Référence PAY**

---

# 62. DOCUMENTS DU MODULE

Prévoir notamment :

### Fiche de Paiement

### Ordre de virement

### Bordereau de paiement

### Avis de paiement

### Reçu de caisse

### Copie de chèque

### Fiche de contrôle comptable

### Fiche de rapprochement

### Avis de rejet

### Avis de suspension

---

# 63. MAQUETTE DU PDF FICHE DE PAIEMENT

Créer une maquette officielle comprenant :

- logo CEEAC ;
- référence PAY ;
- OP ;
- bénéficiaire ;
- banque ;
- compte ;
- objet ;
- montant ;
- mode ;
- date ;
- référence transaction ;
- validations ;
- Agent Comptable ;
- QR Code ou identifiant de vérification.

---

# 64. AVIS DE PAIEMENT AU BÉNÉFICIAIRE

Créer une maquette d’avis contenant :

**Bénéficiaire**

**Facture**

**Montant**

**Date**

**Référence**

**Mode**

Prévoir un statut :

**Avis envoyé**

---

# 65. NOTIFICATIONS

Prévoir :

- paiement créé ;
- dossier reçu ;
- prise en charge attendue ;
- validation requise ;
- paiement autorisé ;
- paiement exécuté ;
- paiement rejeté ;
- paiement suspendu ;
- paiement en échec ;
- rapprochement requis ;
- rapprochement effectué ;
- dossier clôturé.

---

# 66. MES TÂCHES

Créer des cartes.

Exemple :

**PAY-2026-000154**

Société ABC

8 750 000 FCFA

Action attendue :

**Préparer le virement**

Reçu :

Aujourd’hui à 08:35

---

# 67. HISTORIQUE

Créer une timeline complète.

Exemple :

**17/09/2026 – 14:22**

Paiement créé automatiquement

**17/09/2026 – 14:24**

Reçu par l’Agence Comptable

**17/09/2026 – 15:10**

Pris en charge

**18/09/2026 – 09:40**

Préparation terminée

**18/09/2026 – 11:00**

Validé Chef Comptable

**18/09/2026 – 14:10**

Autorisé Agent Comptable

**18/09/2026 – 14:30**

Virement exécuté

**19/09/2026 – 09:00**

Rapproché

**19/09/2026 – 09:05**

Dossier clôturé

---

# 68. JOURNAL D’AUDIT

Créer une vue distincte montrant :

- date ;
- heure ;
- utilisateur ;
- rôle ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- document ;
- référence transaction ;
- événement technique.

---

# 69. PAP

Pour les dossiers PAP, afficher automatiquement :

- pilier ;
- axe ;
- objectif ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateur ;
- réalisation physique ;
- engagé ;
- liquidé ;
- ordonnancé ;
- payé.

---

# 70. CHAÎNE FINANCIÈRE PAP

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

42 %

Afficher les montants et taux.

---

# 71. MARCHÉ / CONTRAT

Afficher :

- marché ;
- titulaire ;
- montant ;
- exécuté ;
- liquidé ;
- ordonnancé ;
- payé ;
- solde ;
- échéance.

---

# 72. REPORTING

Créer ou adapter les écrans de reporting permettant notamment :

- paiement par période ;
- paiement par structure ;
- paiement par bénéficiaire ;
- paiement par mode ;
- paiement par banque ;
- PAP/Hors PAP ;
- délais ;
- taux de paiement ;
- paiements échoués ;
- rapprochements ;
- suspensions ;
- rejets.

---

# 73. KPI PAIEMENT

Créer notamment :

### Taux de paiement

Montant payé / Montant ordonnancé

### Délai moyen de paiement

Date paiement – Date signature OP

### Taux de rapprochement

Paiements rapprochés / Paiements exécutés

### Taux d’échec bancaire

Paiements échoués / Paiements envoyés

---

# 74. ALERTES

Prévoir :

- dossier non pris en charge ;
- paiement validé mais non exécuté ;
- compte bancaire modifié ;
- paiement en échec ;
- rapprochement en retard ;
- bénéficiaire bloqué ;
- compte CEEAC indisponible ;
- doublon potentiel.

---

# 75. ÉTATS EXCEPTIONNELS À MAQUETTER

Créer les états :

- OP invalide ;
- bénéficiaire bloqué ;
- coordonnées incomplètes ;
- compte CEEAC indisponible ;
- solde insuffisant ;
- paiement doublon ;
- banque indisponible ;
- virement rejeté ;
- chèque annulé ;
- erreur API bancaire ;
- rapprochement impossible ;
- exercice clôturé ;
- droits insuffisants.

---

# 76. REPRISE APRÈS ERREUR

Créer une expérience permettant :

**Relancer**

sans :

- recréer le paiement ;
- recréer l’OP ;
- dupliquer la transaction.

Afficher les tentatives précédentes.

---

# 77. CLÔTURE DU DOSSIER

Le système doit afficher un état :

# DOSSIER CLÔTURÉ

seulement lorsque :

✓ paiement exécuté

✓ preuve disponible

✓ rapprochement effectué

✓ solde nul ou justifié

✓ documents archivés

✓ aucune anomalie bloquante

---

# 78. PAGE DE SYNTHÈSE DE LA CHAÎNE DE DÉPENSE

Depuis le Paiement, permettre de consulter :

**EB**

→ **Engagement**

→ **Liquidation**

→ **Ordonnancement**

→ **Paiement**

Créer une timeline globale avec :

- références ;
- dates ;
- montants ;
- statuts ;
- acteurs.

---

# 79. DROITS ET HABILITATIONS

Adapter l’interface selon :

- Comptable ;
- Chef Comptable ;
- Agent Comptable ;
- auditeur ;
- contrôle ;
- consultation ;
- administrateur.

Ne jamais afficher comme active une action non autorisée.

---

# 80. SÉPARATION DES FONCTIONS

La maquette doit clairement distinguer :

**Ordonnateur**

et

**Agence Comptable**

Puis, à l’intérieur de l’Agence Comptable :

**Comptable**

→ **Chef Comptable**

→ **Agent Comptable**

Les responsabilités ne doivent pas être fusionnées visuellement.

---

# 81. DONNÉES SENSIBLES

Protéger particulièrement :

- comptes bancaires ;
- pièces d’identité ;
- références bancaires ;
- signatures ;
- données fiscales.

Prévoir des masquages partiels selon les profils.

---

# 82. UX DU MODULE

L’utilisateur doit pouvoir répondre immédiatement :

**Quel dossier dois-je payer ?**

**Quel bénéficiaire ?**

**Quel montant ?**

**Sur quel OP ?**

**Quel mode ?**

**Quel compte utiliser ?**

**Le dossier est-il conforme ?**

**Qui doit agir maintenant ?**

**Le règlement a-t-il réellement été exécuté ?**

**Le paiement a-t-il été rapproché ?**

---

# 83. DESIGN UX/UI

La qualité graphique doit être cohérente avec les modules :

- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement.

Le module Paiement doit cependant avoir une identité visuelle plus orientée :

- comptabilité ;
- trésorerie ;
- contrôle ;
- exécution ;
- confirmation.

Le design doit être :

- institutionnel ;
- premium ;
- sobre ;
- lisible ;
- sécurisé ;
- orienté productivité.

---

# 84. DESIGN SYSTEM

Créer ou réutiliser :

- Workflow Banner ;
- Payment Summary Card ;
- Beneficiary Card ;
- Bank Account Card ;
- Payment Method Selector ;
- Compliance Checklist ;
- Validation Panel ;
- Bank Status Card ;
- Reconciliation Card ;
- Document Card ;
- Timeline ;
- Alert Panel ;
- Payment Status Badge.

Utiliser :

- Auto Layout ;
- Components ;
- Variants ;
- Variables ;
- tokens.

---

# 85. RESPONSIVE

Prévoir :

### Desktop

Usage principal.

### Laptop

### Tablette

Pour :

- contrôle ;
- validation ;
- consultation.

### Mobile

Pour :

- notifications ;
- Mes tâches ;
- consultation synthétique ;
- suivi.

Éviter de permettre des opérations sensibles sur mobile si l’expérience de sécurité n’est pas adéquate.

---

# 86. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA.

---

# 87. PROTOTYPE INTERACTIF

Créer un prototype couvrant au minimum :

### Scénario 1

OP signé → Paiement automatique.

### Scénario 2

Prise en charge par Comptable.

### Scénario 3

Préparation virement.

### Scénario 4

Validation Chef Comptable.

### Scénario 5

Signature Agent Comptable.

### Scénario 6

Exécution virement.

### Scénario 7

Paiement par chèque.

### Scénario 8

Paiement caisse.

### Scénario 9

Paiement partiel.

### Scénario 10

Lot de paiements.

### Scénario 11

Coordonnées bancaires modifiées.

### Scénario 12

Paiement suspendu.

### Scénario 13

Virement rejeté.

### Scénario 14

Relance sans duplication.

### Scénario 15

Rapprochement automatique.

### Scénario 16

Rapprochement manuel.

### Scénario 17

Écart de rapprochement.

### Scénario 18

Clôture.

---

# 88. COHÉRENCE AVEC LES AUTRES MODULES

Auditer les impacts sur :

- Ordonnancement ;
- Liquidation ;
- Budget ;
- PAP ;
- Marchés ;
- Tiers ;
- GED ;
- Notifications ;
- Mes tâches ;
- Audit ;
- Reporting ;
- Référentiels ;
- Recherche globale.

---

# 89. ARCHITECTURE FIGMA RECOMMANDÉE

Organiser les frames :

**PAY / 00 — Audit**

**PAY / 01 — Components**

**PAY / 02 — Dashboard**

**PAY / 03 — List**

**PAY / 04 — Detail**

**PAY / 05 — Intake**

**PAY / 06 — Accountant Workspace**

**PAY / 07 — Chief Accountant**

**PAY / 08 — Accounting Officer**

**PAY / 09 — Beneficiary**

**PAY / 10 — Bank Accounts**

**PAY / 11 — Payment Methods**

**PAY / 12 — Bank Transfer**

**PAY / 13 — Cheque**

**PAY / 14 — Cash**

**PAY / 15 — Batch Payments**

**PAY / 16 — Compliance**

**PAY / 17 — Validation**

**PAY / 18 — Execution**

**PAY / 19 — Failure & Retry**

**PAY / 20 — Suspension & Rejection**

**PAY / 21 — Reconciliation**

**PAY / 22 — Documents**

**PAY / 23 — PAP**

**PAY / 24 — Procurement**

**PAY / 25 — History**

**PAY / 26 — Audit**

**PAY / 27 — Reporting**

**PAY / 28 — Responsive**

**PAY / 29 — Prototype**

---

# 90. MATRICE DE CONFORMITÉ FINALE

À la fin, produire une matrice :

| Exigence | Écran | Composant | Interaction | Statut |
|---|---|---|---|---|
| Paiement auto après OP | Workflow | Transition | Automatique | Conforme |
| Prise en charge | Intake | Task Card | Action | Conforme |
| Virement | Payment Method | Transfer Form | Action | Conforme |
| Validation Agent Comptable | Decision | Validation Panel | Action | Conforme |
| Rapprochement | Reconciliation | Matching Table | Action | Conforme |
| GED | Documents | Document Card | Automatique | Conforme |

Aucune exigence importante ne doit rester sans traduction.

---

# 91. LIVRABLES ATTENDUS

La refonte doit produire :

### A. Audit de l’existant

### B. Liste des écarts

### C. Nouvelle architecture UX

### D. Dashboard Paiement

### E. Liste des Paiements

### F. Fiche Paiement

### G. Espace Comptable

### H. Espace Chef Comptable

### I. Espace Agent Comptable

### J. Parcours Virement

### K. Parcours Chèque

### L. Parcours Caisse

### M. Paiements partiels

### N. Paiements groupés

### O. Gestion des erreurs

### P. Rapprochement

### Q. GED

### R. Documents PDF

### S. Notifications

### T. Mes tâches

### U. Historique

### V. Audit

### W. Reporting

### X. Responsive

### Y. Prototype

### Z. Matrice de conformité

---

# 92. INSTRUCTION FINALE

Ne te contente pas de redessiner le module Paiement existant.

Effectue une **véritable réforme fonctionnelle, comptable, ergonomique et graphique**.

Le parcours cible doit être clairement matérialisé :

**ORDRE DE PAIEMENT SIGNÉ**

→ **PAIEMENT CRÉÉ AUTOMATIQUEMENT**

→ **TRANSMISSION À L’AGENCE COMPTABLE**

→ **PRISE EN CHARGE PAR LE COMPTABLE**

→ **CONTRÔLE ET PRÉPARATION**

→ **VALIDATION CHEF COMPTABLE**

→ **VALIDATION / SIGNATURE AGENT COMPTABLE**

→ **EXÉCUTION DU RÈGLEMENT**

→ **PREUVE DE PAIEMENT**

→ **RAPPROCHEMENT**

→ **ARCHIVAGE GED**

→ **CLÔTURE FINANCIÈRE**

La nouvelle maquette doit devenir la référence de la phase comptable de BUDGET-CEEAC.

Elle doit être :

**fonctionnellement exhaustive**,  
**comptablement rigoureuse**,  
**sécurisée**,  
**anti-fraude**,  
**traçable**,  
**auditable**,  
**ergonomiquement fluide**,  
**graphiquement professionnelle**,  
**parfaitement cohérente avec les autres modules**,  
et **directement exploitable pour le développement React.js / Laravel**.

Avant de terminer, relis intégralement le fichier joint contenant la **Description détaillée du module PAIEMENT** et vérifie exigence par exigence que chacune est matérialisée dans :

- un écran ;
- un composant ;
- un formulaire ;
- une interaction ;
- un contrôle ;
- un workflow ;
- un document ;
- une notification ;
- un état ;
- une règle d’interface.

Tant qu’une exigence importante n’a pas de traduction précise dans la nouvelle maquette, considère la refonte comme incomplète.