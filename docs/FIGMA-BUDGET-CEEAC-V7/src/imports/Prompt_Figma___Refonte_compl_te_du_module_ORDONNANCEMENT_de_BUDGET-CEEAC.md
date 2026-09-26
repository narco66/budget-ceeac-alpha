# PROMPT FIGMA — REFONTE COMPLÈTE DU MODULE ORDONNANCEMENT DE BUDGET-CEEAC

## 1. CONTEXTE GÉNÉRAL

Tu travailles sur la maquette Figma existante de **BUDGET-CEEAC**, application intégrée de planification, budgétisation, exécution budgétaire, contrôle financier, suivi-évaluation, gestion documentaire et reporting de la Commission de la CEEAC.

Je joins à ce prompt le fichier contenant la :

# « DESCRIPTION DÉTAILLÉE DU MODULE ORDONNANCEMENT DE BUDGET-CEEAC »

Ce document constitue désormais la **référence fonctionnelle principale pour la refonte du module ORDONNANCEMENT**.

Ta mission consiste à effectuer une **refonte complète, profonde, fonctionnelle et UX/UI du module ORDONNANCEMENT** dans la maquette Figma existante.

Il ne s’agit pas simplement :

- de changer les couleurs ;
- de moderniser quelques cartes ;
- de déplacer des boutons ;
- ou de redessiner les écrans existants.

Tu dois réexaminer complètement :

- l’architecture du module ;
- les écrans ;
- les parcours utilisateurs ;
- les rôles ;
- les contrôles ;
- les règles de détermination de l’Ordonnateur ;
- les seuils de délégation ;
- la signature ;
- l’Ordre de Paiement ;
- les retours ;
- les rejets ;
- les documents ;
- la GED ;
- les notifications ;
- l’historique ;
- l’audit ;
- la transmission à l’Agence Comptable ;
- la création automatique du Paiement ;
- le reporting ;
- les états exceptionnels.

Le résultat attendu doit être un module **complet, professionnel, auditable, sécurisé et directement exploitable par les développeurs**.

---

# 2. POSITION DE L’ORDONNANCEMENT DANS LA CHAÎNE DE DÉPENSE

Le module fait partie de la chaîne :

**Expression de Besoin**

↓

**Engagement**

↓

**Liquidation**

↓

**Ordonnancement**

↓

**Paiement**

Le parcours cible de l’Ordonnancement est :

**Liquidation visée**

↓

**Ordonnancement créé automatiquement**

↓

**Contrôles préalables**

↓

**Détermination automatique de l’Ordonnateur compétent**

↓

**Présentation de l’Ordre de Paiement**

↓

**Décision / Signature**

↓

**Génération des documents officiels**

↓

**Archivage GED**

↓

**Transmission automatique à l’Agence Comptable**

↓

**Création automatique du dossier de Paiement**

La maquette doit rendre cette continuité immédiatement compréhensible.

---

# 3. SOURCES DE VÉRITÉ

Utiliser les sources dans l’ordre de priorité suivant :

1. **Description détaillée du module ORDONNANCEMENT jointe au présent prompt** ;
2. cahier des charges actuel de BUDGET-CEEAC ;
3. description détaillée du module LIQUIDATION ;
4. description détaillée du module ENGAGEMENT ;
5. description détaillée du module EXPRESSION DE BESOIN ;
6. description détaillée du module PAIEMENT ;
7. procédures de la chaîne de dépense ;
8. référentiel budgétaire ;
9. référentiel organisationnel ;
10. référentiel PAP ;
11. référentiel des tiers ;
12. référentiel des marchés ;
13. référentiel des délégations ;
14. maquette Figma existante.

En cas de contradiction, la nouvelle description du module ORDONNANCEMENT prévaut pour les règles propres à ce module.

---

# 4. AUDIT OBLIGATOIRE AVANT REFONTE

Avant toute modification, réalise un audit exhaustif du module ORDONNANCEMENT existant dans Figma.

Classe les éléments en quatre catégories :

## Conforme

À conserver.

## Partiellement conforme

À corriger ou enrichir.

## Obsolète

À remplacer ou supprimer.

## Manquant

À créer.

Pour chaque exigence du document joint, établir une logique :

**Exigence → Existant Figma → Écart → Action → Écran / composant**

Ne commence pas directement par dessiner.

Comprends d’abord le fonctionnement actuel et ses dépendances avec les autres modules.

---

# 5. RÈGLE DE NON-RÉGRESSION

La refonte ne doit pas casser les éléments existants qui fonctionnent correctement.

Avant de supprimer un composant :

1. déterminer sa fonction ;
2. vérifier ses dépendances ;
3. vérifier s’il est utilisé ailleurs ;
4. déterminer s’il doit être conservé, adapté ou remplacé.

La réforme du module ORDONNANCEMENT doit améliorer BUDGET-CEEAC sans dégrader :

- Liquidation ;
- Paiement ;
- GED ;
- Workflow ;
- Notifications ;
- Reporting ;
- Mes tâches ;
- Audit ;
- Référentiels.

---

# 6. PRINCIPE FONDAMENTAL : CRÉATION AUTOMATIQUE

Dans le processus nominal, aucun utilisateur ne doit cliquer sur :

**« Créer un Ordonnancement »**

L’Ordonnancement doit être automatiquement généré dès que la Liquidation atteint son état final autorisant la poursuite.

Représenter clairement :

**Liquidation visée**

→ **Ordonnancement créé automatiquement**

→ **Dossier affecté à l’Ordonnateur compétent**

→ **Notification**

→ **Mes tâches**

---

# 7. AUCUNE RESSAISIE INUTILE

La nouvelle interface doit reprendre automatiquement les données validées en amont :

- EB ;
- Engagement ;
- Liquidation ;
- exercice ;
- structure ;
- bénéficiaire ;
- objet ;
- PAP/Hors PAP ;
- ligne budgétaire ;
- imputations ;
- montant engagé ;
- montant liquidé ;
- retenues ;
- net à payer ;
- facture ;
- marché ;
- contrat ;
- service fait ;
- certification ;
- visa du Contrôleur Financier ;
- pièces ;
- données PAP ;
- historique.

Ces données doivent être visibles mais verrouillées lorsqu’elles ont déjà été définitivement validées.

---

# 8. IDENTIFICATION DE L’ORDONNANCEMENT

Afficher clairement :

**ORD-2026-000184**

ou

**OP-2026-000184**

Puis les références de la chaîne :

**LIQ-2026-000167**

**ENG-2026-000142**

**EB-2026-000119**

Permettre de naviguer facilement vers les dossiers sources en lecture seule.

---

# 9. TABLEAU DE BORD ORDONNANCEMENT

Créer ou refondre complètement le tableau de bord.

Prévoir notamment :

### Dossiers

- Tous ;
- À traiter ;
- À vérifier ;
- À signer ;
- En attente Ordonnateur ;
- Retournés ;
- Rejetés ;
- Signés ;
- Transmis à l’Agence Comptable ;
- Transformés en Paiement ;
- En anomalie.

### Montants

- montant total ordonnancé ;
- montant du mois ;
- PAP ;
- Hors PAP ;
- montant en attente de signature ;
- montant transmis à l’Agence Comptable.

---

# 10. KPI

Créer des cartes interactives.

Exemples :

### À signer

12 dossiers  
38 450 000 FCFA

### Signés aujourd’hui

7 dossiers  
21 800 000 FCFA

### Transmis à l’Agence Comptable

43 dossiers  
126 500 000 FCFA

### Taux d’ordonnancement

Montant ordonnancé / Montant liquidé

Chaque carte doit permettre un filtrage immédiat.

---

# 11. LISTE DES ORDONNANCEMENTS

Créer un tableau professionnel avec notamment :

- référence ORD ;
- OP ;
- Liquidation ;
- Engagement ;
- EB ;
- date ;
- objet ;
- bénéficiaire ;
- structure ;
- PAP/Hors PAP ;
- montant liquidé ;
- retenues ;
- net à payer ;
- Ordonnateur ;
- statut ;
- acteur attendu ;
- date de signature ;
- transmission Agence Comptable.

Prévoir :

- recherche ;
- filtres ;
- tri ;
- pagination ;
- export ;
- vues enregistrées.

---

# 12. FILTRES

Prévoir au minimum :

- exercice ;
- période ;
- structure ;
- bénéficiaire ;
- Ordonnateur ;
- PAP/Hors PAP ;
- statut ;
- montant ;
- ligne budgétaire ;
- marché ;
- signé/non signé ;
- transmis/non transmis.

---

# 13. PAGE DÉTAIL DE L’ORDONNANCEMENT

Créer une fiche dossier structurée.

En tête :

**ORD-2026-000184**

Objet de la dépense

Puis :

- statut ;
- bénéficiaire ;
- montant ;
- PAP/Hors PAP ;
- Ordonnateur compétent.

---

# 14. BANDEAU WORKFLOW

Créer un composant homogène avec EB, Engagement et Liquidation.

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

# 15. ORGANISATION DE LA PAGE

Prévoir des onglets :

### Synthèse

### Liquidation source

### Budget & imputations

### Bénéficiaire

### Factures

### Retenues

### PAP

### Marché / Contrat

### Pièces justificatives

### Contrôles

### Workflow

### Historique

### Documents générés

### Transmission comptable

---

# 16. CARTE FINANCIÈRE PRINCIPALE

Afficher clairement :

**Engagé**

10 000 000 FCFA

**Liquidé brut**

9 500 000 FCFA

**Retenues**

750 000 FCFA

**NET À ORDONNANCER**

8 750 000 FCFA

Le net à ordonnancer doit être la donnée financière la plus visible de la page.

---

# 17. CONTRÔLES AUTOMATIQUES AVANT SIGNATURE

Créer une zone :

# CONTRÔLES AVANT ORDONNANCEMENT

Exemple :

✓ Liquidation visée

✓ Service fait certifié

✓ Engagement valide

✓ Bénéficiaire actif

✓ Coordonnées bancaires disponibles

✓ Facture conforme

✓ Imputation valide

✓ Retenues calculées

✓ Exercice ouvert

✓ Ordonnateur identifié

✓ Pièces obligatoires présentes

✓ Absence de doublon OP

Toute anomalie bloquante doit empêcher la signature.

---

# 18. DÉTERMINATION AUTOMATIQUE DE L’ORDONNATEUR

Créer un moteur visuel permettant de comprendre pourquoi tel Ordonnateur est choisi.

Dans la configuration actuellement retenue :

### Montant ≤ 5 000 000 FCFA

**Secrétaire Général**

Ordonnateur délégué.

### Montant > 5 000 000 FCFA

**Président de la Commission**

Ordonnateur principal.

Afficher clairement :

**Ordonnateur déterminé**

Secrétaire Général

**Motif**

Montant ≤ seuil de délégation

---

# 19. PARAMÉTRAGE DU SEUIL

Le montant de **5 000 000 FCFA** ne doit jamais être présenté comme une valeur codée définitivement.

Prévoir une interface de paramétrage :

**Seuil Ordonnateur délégué**

Valeur actuelle :

5 000 000 FCFA

Avec :

- date d’effet ;
- date de fin éventuelle ;
- référence juridique ;
- statut ;
- historique.

---

# 20. RÉFÉRENTIEL DES DÉLÉGATIONS

Créer les écrans nécessaires pour gérer :

- délégant ;
- délégataire ;
- fonction ;
- seuil ;
- nature des dépenses ;
- date début ;
- date fin ;
- document de délégation ;
- statut.

Prévoir :

**Active**

**Expirée**

**Suspendue**

**À venir**

---

# 21. GESTION DE LA SUPPLÉANCE

Prévoir :

- titulaire ;
- suppléant ;
- motif ;
- date début ;
- date fin ;
- acte justificatif.

Le système doit pouvoir afficher :

**Signataire actuel**

Nom du suppléant

**Pour**

Titulaire empêché

---

# 22. VUE DÉCISIONNELLE POUR L’ORDONNATEUR

Créer une vue très synthétique permettant de décider rapidement.

Présenter :

### Dossier

Référence – objet – structure

### Bénéficiaire

Raison sociale – conformité

### Situation financière

Engagé – Liquidé – Retenues – Net

### Contrôles

Checklist

### Documents clés

- Facture ;
- Service fait ;
- Liquidation ;
- Visa CF ;
- contrat/marché.

Puis les actions :

**Signer**

**Retourner**

**Rejeter**

**Voir le dossier complet**

---

# 23. SIGNATURE DE L’ORDRE DE PAIEMENT

Créer une fenêtre ou page de signature comprenant :

**Référence OP**

**Bénéficiaire**

**Montant net**

**Montant en lettres**

**Objet**

**Imputation**

**Liquidation**

**Ordonnateur**

Puis une déclaration :

**Je confirme l’ordonnancement de cette dépense et autorise sa transmission à l’Agence Comptable.**

Action principale :

# SIGNER L’ORDRE DE PAIEMENT

---

# 24. SIGNATURE SÉCURISÉE

Prévoir graphiquement les mécanismes possibles :

- confirmation forte ;
- mot de passe ;
- MFA ;
- signature électronique ;
- certificat ;
- OTP ;
- signature institutionnelle.

Le niveau exact dépendra de l’infrastructure technique.

---

# 25. ÉTAT APRÈS SIGNATURE

Après signature, afficher :

# ORDRE DE PAIEMENT SIGNÉ

Avec :

- signataire ;
- fonction ;
- date ;
- heure ;
- référence de signature ;
- version ;
- empreinte documentaire.

Les champs validés doivent être verrouillés.

---

# 26. MONTANT EN LETTRES

Afficher automatiquement :

**4 750 000 FCFA**

puis :

**Quatre millions sept cent cinquante mille francs CFA**

Cette information doit être générée automatiquement.

---

# 27. RETOUR POUR CORRECTION

Créer un parcours spécifique.

L’Ordonnateur doit pouvoir choisir :

**Retourner le dossier**

Puis renseigner :

- motif ;
- commentaire ;
- étape destinataire ;
- élément concerné.

Exemples :

- Liquidation ;
- coordonnées bancaires ;
- montant ;
- retenue ;
- pièce.

Le système doit renvoyer le dossier vers le bon acteur.

---

# 28. REJET

Le rejet doit être clairement différencié du retour.

Créer un état :

# ORDONNANCEMENT REJETÉ

Afficher :

- autorité ;
- date ;
- motif ;
- conséquence ;
- dossier source concerné.

---

# 29. COORDONNÉES DU BÉNÉFICIAIRE

Créer une fiche lisible :

- raison sociale ;
- identifiant fiscal ;
- banque ;
- compte ;
- IBAN/RIB si applicable ;
- titulaire du compte ;
- conformité ;
- dernière validation.

Afficher les alertes :

✓ Vérifié

⚠ À revalider

⛔ Incomplet

---

# 30. MODIFICATION DES COORDONNÉES BANCAIRES

Toute modification tardive doit déclencher :

- avertissement ;
- nouvelle vérification ;
- traçabilité ;
- éventuellement nouvelle approbation.

Ne jamais modifier silencieusement les coordonnées d’un bénéficiaire après Liquidation.

---

# 31. FACTURES

Afficher :

- numéro ;
- date ;
- fournisseur ;
- brut ;
- taxes ;
- retenues ;
- net ;
- fichier ;
- état.

Permettre une prévisualisation immédiate.

---

# 32. RETENUES

Créer un tableau :

| Type | Base | Taux | Montant |
|---|---:|---:|---:|

Puis :

**Total retenues**

**Net à payer**

Le calcul doit être immédiatement vérifiable.

---

# 33. IMPUTATIONS

Afficher :

| Ligne | Libellé | Montant |
|---|---|---:|

Pour les dossiers multi-imputations, conserver le détail.

Ne permettre aucune divergence non autorisée avec la Liquidation.

---

# 34. PAP

Pour les dossiers PAP, afficher :

- pilier ;
- axe ;
- objectif ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateur ;
- avancement physique ;
- engagé ;
- liquidé ;
- ordonnancé ;
- payé.

---

# 35. VUE DE PROGRESSION FINANCIÈRE

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

Elle doit être réutilisable dans le Reporting et le Suivi-Évaluation.

---

# 36. MARCHÉ / CONTRAT

Afficher :

- référence ;
- objet ;
- titulaire ;
- lot ;
- montant ;
- avenants ;
- exécuté ;
- liquidé ;
- ordonnancé ;
- solde ;
- échéance.

---

# 37. PIÈCES JUSTIFICATIVES

Distinguer :

### Héritées

### Générées

### Ajoutées

Exemples :

- EB ;
- Engagement ;
- Liquidation ;
- facture ;
- certificat de service fait ;
- visa ;
- marché ;
- contrat ;
- justificatifs fiscaux.

---

# 38. CHECKLIST DOCUMENTAIRE

Exemple :

✓ EB approuvée

✓ Engagement visé

✓ Liquidation visée

✓ Facture

✓ Certificat de service fait

✓ Visa CF

✓ Coordonnées bancaires

La signature doit être bloquée lorsqu’un document obligatoire manque.

---

# 39. ORDRE DE PAIEMENT

Créer la maquette officielle du document :

# ORDRE DE PAIEMENT

Le document doit contenir au minimum :

- logo CEEAC ;
- exercice ;
- numéro OP ;
- EB ;
- Engagement ;
- Liquidation ;
- bénéficiaire ;
- coordonnées bancaires ;
- objet ;
- montant brut ;
- retenues ;
- net ;
- montant en lettres ;
- imputation ;
- référence contrat/marché ;
- Ordonnateur ;
- signature ;
- date ;
- QR Code ou identifiant de vérification.

---

# 40. AUTRES DOCUMENTS

Prévoir également :

- Fiche d’Ordonnancement ;
- Bordereau de transmission ;
- Avis de retour ;
- Avis de rejet ;
- Document d’annulation ;
- Fiche de contrôle ;
- état récapitulatif.

---

# 41. GÉNÉRATION PDF

Après signature :

- générer le PDF ;
- figer le contenu ;
- ajouter horodatage ;
- ajouter version ;
- ajouter signature ;
- ajouter empreinte ;
- archiver.

Afficher :

**PDF officiel généré**

---

# 42. GED

Tous les documents doivent être automatiquement intégrés à la GED.

Classement recommandé :

**Exercice**

→ **Chaîne de dépense**

→ **Ordonnancement**

→ **Référence ORD**

Afficher :

**Archivé dans la GED**

---

# 43. TRANSMISSION AUTOMATIQUE À L’AGENCE COMPTABLE

Après signature de l’OP :

**OP SIGNÉ**

↓

**Transmission automatique**

↓

**Agence Comptable**

↓

**Paiement créé**

Il ne doit pas exister un bouton manuel du type :

**« Envoyer au Paiement »**

dans le processus nominal.

---

# 44. SUIVI DE LA TRANSMISSION

Créer un composant affichant :

**Envoyé**

17/09/2026 à 14:22

**Destinataire**

Agence Comptable

**Réception**

17/09/2026 à 14:24

**Pris en charge par**

Comptable X

---

# 45. ERREUR DE TRANSMISSION

Créer un état spécifique :

# OP SIGNÉ — TRANSMISSION EN ERREUR

Afficher :

- OP toujours valide ;
- cause ;
- dernière tentative ;
- nombre de tentatives ;
- statut.

Permettre :

**Relancer la transmission**

pour les profils techniques autorisés.

Ne jamais permettre la création d’un deuxième OP.

---

# 46. CRÉATION AUTOMATIQUE DU PAIEMENT

Après signature, matérialiser :

**Ordonnancement signé**

↓

**Création du dossier de Paiement**

↓

**Affectation Agence Comptable**

↓

**Notification**

---

# 47. DONNÉES TRANSMISES AU PAIEMENT

Afficher dans la documentation UX que sont transmises :

- EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- OP ;
- bénéficiaire ;
- banque ;
- montant brut ;
- retenues ;
- net ;
- imputations ;
- factures ;
- marché ;
- pièces ;
- signatures.

---

# 48. ESPACE AGENCE COMPTABLE

Même si le Paiement constitue un autre module, prévoir dans l’Ordonnancement un état :

**Transmis à l’Agence Comptable**

et permettre de voir :

**Voir le dossier Paiement**

en lecture transversale.

---

# 49. MES TÂCHES

Créer des cartes adaptées.

Exemple :

**ORD-2026-000184**

Acquisition de matériels informatiques

**4 750 000 FCFA**

Action attendue :

**Signer l’Ordre de Paiement**

Acteur :

**Secrétaire Général**

---

# 50. NOTIFICATIONS

Prévoir notamment :

- Ordonnancement créé ;
- signature requise ;
- dossier retourné ;
- rejet ;
- OP signé ;
- PDF généré ;
- transmission à l’Agence Comptable ;
- Paiement créé ;
- transmission en erreur.

---

# 51. HISTORIQUE

Créer une timeline complète.

Exemple :

**17/09/2026 – 10:30**

Liquidation visée

**17/09/2026 – 10:31**

Ordonnancement créé automatiquement

**17/09/2026 – 10:32**

Ordonnateur déterminé

**17/09/2026 – 14:20**

OP signé

**17/09/2026 – 14:21**

PDF généré

**17/09/2026 – 14:22**

Transmis à l’Agence Comptable

**17/09/2026 – 14:22**

Paiement créé

---

# 52. JOURNAL D’AUDIT

Créer une vue distincte.

Afficher :

- date ;
- heure ;
- utilisateur ;
- rôle ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- signature ;
- événement système ;
- document ;
- adresse technique éventuelle.

---

# 53. DUPLICATION

Créer des états empêchant :

- double Ordonnancement ;
- double OP ;
- double transmission ;
- double création de Paiement.

Afficher une erreur explicite.

---

# 54. ANNULATION

Un OP signé ne doit jamais pouvoir être supprimé simplement.

Créer une procédure :

# ANNULATION / RÉVOCATION D’ORDRE DE PAIEMENT

Avec :

- motif ;
- initiateur ;
- autorité ;
- référence ;
- impact ;
- pièce justificative ;
- statut du Paiement.

---

# 55. RÉÉMISSION

Prévoir le cas où un document doit être réémis.

Afficher :

**Version 1 — annulée**

**Version 2 — active**

La version précédente doit rester consultable.

---

# 56. HABILITATIONS

Adapter l’interface selon :

- Ordonnateur principal ;
- Ordonnateur délégué ;
- suppléant ;
- secrétariat habilité ;
- audit ;
- contrôle ;
- consultation ;
- administrateur.

Ne jamais afficher une action interdite.

---

# 57. SÉPARATION DES FONCTIONS

La maquette doit bien distinguer :

- initiateur ;
- Budget ;
- Contrôle Financier ;
- Ordonnateur ;
- Agence Comptable.

Ne pas fusionner les responsabilités.

---

# 58. REPORTING

Créer les vues permettant de suivre :

- nombre d’OP ;
- montant ordonnancé ;
- PAP/Hors PAP ;
- structure ;
- bénéficiaire ;
- Ordonnateur ;
- période ;
- délais ;
- retours ;
- rejets ;
- en attente ;
- transmis.

---

# 59. KPI

Créer notamment :

### Taux d’ordonnancement

Montant ordonnancé / Montant liquidé

### Délai moyen

Date signature OP – Date visa LIQ

### Montant en attente de signature

### Taux de retour

### Taux de rejet

---

# 60. ALERTES

Prévoir :

- OP en attente depuis X heures ;
- délégation expirée ;
- suppléance inactive ;
- coordonnées bancaires manquantes ;
- pièce obligatoire absente ;
- transmission en erreur ;
- exercice clôturé ;
- bénéficiaire suspendu.

---

# 61. ÉTATS EXCEPTIONNELS

Maquetter au minimum :

- Liquidation non valide ;
- mauvais Ordonnateur ;
- seuil incohérent ;
- délégation expirée ;
- Ordonnateur indisponible ;
- bénéficiaire bloqué ;
- compte bancaire incomplet ;
- doublon OP ;
- erreur PDF ;
- erreur GED ;
- erreur de transmission ;
- exercice clôturé ;
- droits insuffisants.

---

# 62. DESIGN UX/UI

Le design doit être cohérent avec la refonte des modules :

- EB ;
- Engagement ;
- Liquidation.

Le module ORDONNANCEMENT doit être encore plus orienté **prise de décision**.

Le design doit être :

- institutionnel ;
- moderne ;
- premium ;
- sobre ;
- rassurant ;
- extrêmement lisible ;
- orienté décideur ;
- sans surcharge.

---

# 63. HIÉRARCHIE DE L’INFORMATION

Sur l’écran de décision, les informations doivent être classées ainsi :

1. Montant à ordonnancer ;
2. Bénéficiaire ;
3. Objet ;
4. Conformité ;
5. Ordonnateur compétent ;
6. Documents essentiels ;
7. Risques / anomalies ;
8. Historique ;
9. Données techniques secondaires.

---

# 64. DESIGN SYSTEM

Créer ou améliorer les composants :

- Workflow Banner ;
- Financial Summary Card ;
- Decision Panel ;
- Ordonnateur Card ;
- Delegation Card ;
- Compliance Checklist ;
- Beneficiary Card ;
- OP Document Card ;
- Transmission Card ;
- Timeline ;
- Status Badge ;
- Signature Panel ;
- Alert Panel.

Utiliser :

- Auto Layout ;
- Components ;
- Variants ;
- Variables ;
- tokens.

---

# 65. RESPONSIVE

Prévoir :

### Desktop

Interface principale.

### Laptop

### Tablette

Très importante pour les décideurs.

Adapter spécialement la page de signature.

### Mobile

Prévoir :

- notification ;
- consultation ;
- suivi ;
- validation si le mécanisme de sécurité l’autorise.

---

# 66. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA :

- contrastes ;
- navigation clavier ;
- labels ;
- focus ;
- taille des zones interactives ;
- statut non exprimé uniquement par couleur.

---

# 67. PROTOTYPE INTERACTIF

Créer un prototype couvrant au minimum :

### Scénario 1

Liquidation visée → Ordonnancement automatique.

### Scénario 2

Montant ≤ seuil → SG déterminé.

### Scénario 3

Montant > seuil → Président déterminé.

### Scénario 4

Consultation synthétique.

### Scénario 5

Signature OP.

### Scénario 6

Retour.

### Scénario 7

Rejet.

### Scénario 8

Suppléance.

### Scénario 9

Délégation expirée.

### Scénario 10

Génération PDF.

### Scénario 11

Archivage GED.

### Scénario 12

Transmission Agence Comptable.

### Scénario 13

Création automatique Paiement.

### Scénario 14

Erreur de transmission.

### Scénario 15

Tentative de duplication.

---

# 68. COHÉRENCE AVEC LES AUTRES MODULES

Auditer les impacts sur :

- Liquidation ;
- Paiement ;
- Budget ;
- PAP ;
- Marchés ;
- Tiers ;
- GED ;
- Notifications ;
- Mes tâches ;
- Workflow ;
- Audit ;
- Reporting ;
- référentiels.

---

# 69. ARCHITECTURE FIGMA RECOMMANDÉE

Organiser les frames :

**ORD / 00 — Audit**

**ORD / 01 — Components**

**ORD / 02 — Dashboard**

**ORD / 03 — List**

**ORD / 04 — Detail**

**ORD / 05 — Decision**

**ORD / 06 — Financial Summary**

**ORD / 07 — Ordonnateur**

**ORD / 08 — Delegation**

**ORD / 09 — Beneficiary**

**ORD / 10 — PAP**

**ORD / 11 — Procurement**

**ORD / 12 — Documents**

**ORD / 13 — Compliance**

**ORD / 14 — Signature**

**ORD / 15 — Return & Rejection**

**ORD / 16 — Payment Order**

**ORD / 17 — Transmission**

**ORD / 18 — Exceptions**

**ORD / 19 — History**

**ORD / 20 — Audit**

**ORD / 21 — Reporting**

**ORD / 22 — Responsive**

**ORD / 23 — Prototype**

---

# 70. MATRICE DE CONFORMITÉ FINALE

Produire une matrice :

| Exigence | Écran Figma | Composant | Interaction | Statut |
|---|---|---|---|---|
| Ordonnancement auto | Workflow | Transition | Automatique | Conforme |
| Seuil ordonnateur | Décision | Ordonnateur Card | Automatique | Conforme |
| Signature | Décision | Signature Panel | Action | Conforme |
| GED | Documents | Document Card | Automatique | Conforme |
| Paiement auto | Transmission | Workflow | Automatique | Conforme |

Aucune exigence importante ne doit rester sans traduction.

---

# 71. LIVRABLES ATTENDUS

À la fin, produire dans la maquette :

### A. Audit de l’existant

### B. Liste des écarts

### C. Nouvelle architecture du module

### D. Nouveau Dashboard

### E. Nouvelle liste

### F. Nouvelle fiche détail

### G. Page décision Ordonnateur

### H. Gestion des seuils

### I. Gestion des délégations

### J. Gestion des suppléances

### K. Signature

### L. Retour et rejet

### M. Ordre de Paiement

### N. Documents PDF

### O. GED

### P. Transmission Agence Comptable

### Q. Paiement automatique

### R. Historique et audit

### S. Reporting

### T. États exceptionnels

### U. Responsive

### V. Prototype interactif

### W. Matrice de conformité

---

# 72. PRINCIPE UX FINAL

L’Ordonnateur doit pouvoir répondre immédiatement aux questions suivantes :

**Quel dossier dois-je décider ?**

**Quel est le bénéficiaire ?**

**Quel est le montant net à payer ?**

**La dépense a-t-elle été correctement liquidée ?**

**Le Contrôleur Financier a-t-il visé ?**

**Les documents sont-ils complets ?**

**Suis-je l’Ordonnateur compétent ?**

**Existe-t-il une anomalie ?**

**Que se passera-t-il lorsque je signe ?**

Si ces réponses ne sont pas visibles rapidement, l’écran doit être repensé.

---

# 73. INSTRUCTION FINALE

Ne te contente pas de moderniser les écrans existants.

Effectue une **véritable réforme fonctionnelle, graphique, décisionnelle et ergonomique du module ORDONNANCEMENT**.

Le parcours cible doit matérialiser clairement :

**LIQUIDATION VISÉE**

→ **ORDONNANCEMENT CRÉÉ AUTOMATIQUEMENT**

→ **CONTRÔLES AUTOMATIQUES**

→ **DÉTERMINATION DE L’ORDONNATEUR COMPÉTENT**

→ **PRÉSENTATION SYNTHÉTIQUE DU DOSSIER**

→ **SIGNATURE DE L’ORDRE DE PAIEMENT**

→ **GÉNÉRATION DU PDF OFFICIEL**

→ **ARCHIVAGE GED**

→ **TRANSMISSION AUTOMATIQUE À L’AGENCE COMPTABLE**

→ **CRÉATION AUTOMATIQUE DU PAIEMENT**

La nouvelle maquette doit être :

**fonctionnellement exhaustive**,  
**budgétairement cohérente**,  
**juridiquement et procéduralement rigoureuse**,  
**sécurisée**,  
**traçable**,  
**auditable**,  
**ergonomiquement exceptionnelle**,  
**graphiquement professionnelle**,  
et **directement exploitable par l’équipe React.js / Laravel de BUDGET-CEEAC**.

Avant de terminer, relis intégralement le fichier joint contenant la **Description détaillée du module ORDONNANCEMENT** et vérifie exigence par exigence que chacune est matérialisée dans :

- un écran ;
- un composant ;
- un workflow ;
- un contrôle ;
- une interaction ;
- un document ;
- un état ;
- une notification ;
- ou une règle d’interface.

Tant qu’une exigence importante n’a pas de traduction précise dans la maquette, considère la refonte comme incomplète.