# DESCRIPTION DÉTAILLÉE DU MODULE ENGAGEMENT  
## Application BUDGET-CEEAC

## 1. Présentation générale

Le module **ENGAGEMENT** constitue la deuxième étape majeure de la chaîne d’exécution de la dépense dans l’application **BUDGET-CEEAC**.

Il intervient immédiatement après l’approbation définitive d’une **Expression de Besoin (EB)** et assure la transformation du besoin administratif préalablement validé en une **obligation financière formelle de la Commission de la CEEAC**.

L’engagement matérialise la décision de réserver tout ou partie des crédits budgétaires nécessaires à la prise en charge d’une dépense donnée.

Il constitue ainsi une étape déterminante de sécurisation de la dépense, puisqu’il permet de vérifier, avant toute liquidation :

- la disponibilité effective des crédits ;
- la conformité de l’imputation budgétaire ;
- la régularité administrative du dossier ;
- la présence des pièces justificatives requises ;
- la conformité du bénéficiaire ou fournisseur ;
- la cohérence entre le besoin exprimé et la dépense engagée ;
- le respect des règles budgétaires ;
- le respect des circuits de validation ;
- la traçabilité des responsabilités ;
- et l’intervention du Contrôle Financier.

Le module ENGAGEMENT doit être totalement intégré aux autres composantes de BUDGET-CEEAC.

Il ne constitue pas un module isolé mais une étape du **dossier unique de dépense**, lequel conserve le même identifiant fonctionnel tout au long du processus :

**Expression de Besoin → Engagement → Liquidation → Ordonnancement → Paiement.**

---

# 2. Principe fondamental

Dans BUDGET-CEEAC, un Engagement ne doit normalement pas être créé manuellement à partir de zéro.

Il est **généré automatiquement à partir d’une Expression de Besoin définitivement approuvée**.

Les informations déjà disponibles dans l’Expression de Besoin doivent être reprises automatiquement afin d’éviter :

- les doubles saisies ;
- les divergences de données ;
- les erreurs d’imputation ;
- les substitutions de lignes budgétaires injustifiées ;
- les incohérences entre EB et Engagement ;
- les manipulations du montant initialement autorisé.

Le principe est donc :

> **Une Expression de Besoin approuvée produit automatiquement un dossier d’Engagement.**

L’utilisateur chargé du traitement de l’Engagement complète uniquement les informations spécifiques à cette nouvelle phase.

---

# 3. Position de l’Engagement dans la chaîne de dépense

Le processus général est le suivant :

### Étape 1 — Expression de Besoin

Le service initiateur exprime son besoin.

L’Expression de Besoin est soumise aux validations correspondant à son type :

- PAP ;
- Hors PAP.

Après toutes les validations administratives et l’approbation de l’Ordonnateur, l’Expression de Besoin devient éligible à l’engagement.

### Étape 2 — Génération automatique de l’Engagement

Après approbation finale de l’EB :

- le système verrouille la version approuvée de l’EB ;
- génère automatiquement l’Engagement ;
- reprend toutes les données pertinentes ;
- réserve ou prépare la réservation des crédits ;
- attribue un numéro d’Engagement ;
- transmet automatiquement le dossier au service compétent de la Direction du Budget.

### Étape 3 — Traitement budgétaire

Le dossier est contrôlé par les agents habilités de la Direction du Budget.

### Étape 4 — Validation budgétaire

Après validation interne de la Direction du Budget, l’Engagement est transmis au **Contrôleur Financier**.

### Étape 5 — Visa du Contrôleur Financier

Le Contrôleur Financier peut :

- viser ;
- retourner pour correction ;
- formuler des observations ;
- ajourner ;
- ou rejeter le dossier.

### Étape 6 — Transformation automatique

Après visa définitif du Contrôleur Financier :

> **l’Engagement est automatiquement transformé en dossier de Liquidation.**

Aucune nouvelle soumission manuelle ne doit être nécessaire entre l’Engagement validé et la Liquidation.

---

# 4. Objectifs fonctionnels du module

Le module ENGAGEMENT doit permettre de :

1. transformer automatiquement une EB approuvée en Engagement ;
2. contrôler la disponibilité des crédits ;
3. réserver les crédits nécessaires ;
4. vérifier la conformité de l’imputation ;
5. conserver les références PAP lorsqu’elles existent ;
6. vérifier la cohérence entre besoin, bénéficiaire, montant et ligne budgétaire ;
7. permettre une imputation sur une ou plusieurs lignes budgétaires ;
8. appliquer les règles relatives au Budget unique de l’exercice ;
9. organiser le workflow du service Budget ;
10. permettre le visa du Contrôleur Financier ;
11. conserver les observations formulées pendant le traitement ;
12. gérer les retours et corrections ;
13. empêcher les dépassements de crédits ;
14. produire automatiquement les documents officiels ;
15. constituer la piste d’audit ;
16. préparer automatiquement la Liquidation après visa.

---

# 5. Principe du Budget unique

BUDGET-CEEAC repose sur le principe suivant :

> **Il existe un seul Budget pour un exercice budgétaire donné.**

Le PAP n’est donc pas traité comme un budget distinct.

Il constitue une composante du Budget.

Les lignes budgétaires sont uniques dans le référentiel de l’exercice.

Par conséquent, dans le module ENGAGEMENT :

- l’utilisateur ne doit pas sélectionner manuellement un Budget ;
- il ne doit pas saisir une référence distincte de PAP ;
- la ligne budgétaire détermine automatiquement sa nature ;
- la relation avec le PAP est retrouvée automatiquement lorsque la ligne relève du PAP ;
- toutes les données programmatiques associées sont héritées du référentiel budgétaire.

---

# 6. Classification automatique PAP / Hors PAP

Lors de la création automatique de l’Engagement, le système analyse les lignes budgétaires héritées de l’Expression de Besoin.

Il détermine automatiquement si la dépense est :

### Dépense Hors PAP

Elle concerne principalement les crédits de fonctionnement ou les crédits ne relevant pas d’une activité du PAP.

Dans ce cas, le système affiche essentiellement :

- ligne budgétaire ;
- chapitre ;
- article ;
- paragraphe ;
- nature économique ;
- source de financement ;
- crédit initial ;
- crédit actuel ;
- montant disponible ;
- montant engagé.

### Dépense PAP

Lorsqu’une ligne appartient au PAP, le système récupère automatiquement les éléments programmatiques correspondants, notamment :

- Pilier ;
- Axe stratégique ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateur éventuel ;
- unité responsable ;
- source de financement ;
- montant inscrit au PAP ;
- montant déjà engagé ;
- solde disponible.

Ces informations sont affichées en lecture seule.

---

# 7. Imputation budgétaire

Le module ENGAGEMENT doit gérer les imputations héritées de l’Expression de Besoin.

## 7.1 Imputation simple

Une dépense peut être imputée entièrement sur une seule ligne budgétaire.

Exemple :

- montant Engagement : 5 000 000 XAF ;
- ligne budgétaire A : 5 000 000 XAF.

## 7.2 Imputation multiple

Une dépense peut être répartie sur plusieurs lignes budgétaires lorsque les règles budgétaires le permettent.

Exemple :

- montant Engagement : 12 000 000 XAF ;
- ligne A : 7 000 000 XAF ;
- ligne B : 3 000 000 XAF ;
- ligne C : 2 000 000 XAF.

Le système doit vérifier automatiquement :

> somme des imputations = montant total de l’Engagement.

Aucun dossier ne peut être validé si cette égalité n’est pas respectée.

---

# 8. Contrôle des crédits

Le système doit effectuer un contrôle de crédit pour chaque imputation.

Pour chaque ligne budgétaire, il doit afficher :

- dotation initiale ;
- modifications budgétaires ;
- dotation actuelle ;
- engagements antérieurs ;
- liquidations ;
- paiements ;
- montant disponible ;
- montant proposé pour l’Engagement ;
- solde prévisionnel après Engagement.

Formule indicative :

**Disponible = Crédit actuel – Engagements déjà pris**

Puis :

**Disponible après Engagement = Disponible – Montant du nouvel Engagement**

Un Engagement ne doit pas pouvoir être définitivement validé lorsque :

**Montant à engager > Crédit disponible**

sauf mécanisme particulier explicitement autorisé par le cadre réglementaire et les habilitations du système.

---

# 9. Réservation des crédits

La création automatique du dossier peut provoquer une réservation provisoire.

Deux niveaux peuvent être distingués :

### Réservation provisoire

À la création de l’Engagement, le système bloque temporairement le montant afin d’éviter qu’une autre opération consomme les mêmes crédits.

### Engagement définitif

Après visa du Contrôleur Financier, la réservation devient un engagement budgétaire ferme.

Le système doit donc distinguer :

- crédit disponible ;
- crédit réservé ;
- crédit engagé ;
- crédit liquidé ;
- crédit ordonnancé ;
- crédit payé.

---

# 10. Informations héritées de l’Expression de Besoin

Le dossier ENGAGEMENT reprend automatiquement au minimum :

- numéro EB ;
- date EB ;
- exercice budgétaire ;
- service initiateur ;
- direction ;
- département ;
- initiateur ;
- objet ;
- description du besoin ;
- justification ;
- catégorie de dépense ;
- nature PAP/Hors PAP ;
- montant prévisionnel ;
- devise ;
- lignes budgétaires ;
- imputations ;
- références PAP ;
- bénéficiaire/fournisseur éventuel ;
- pièces jointes ;
- observations antérieures ;
- historique des validations ;
- approbation de l’Ordonnateur.

Les informations provenant d’une EB définitivement approuvée doivent être protégées contre les modifications non autorisées.

---

# 11. Informations spécifiques à l’Engagement

Le module doit permettre de compléter notamment :

- numéro d’Engagement ;
- date de l’Engagement ;
- type d’Engagement ;
- nature juridique de la dépense ;
- bénéficiaire ;
- fournisseur ;
- créancier ;
- référence du marché ou contrat ;
- référence du bon de commande ;
- référence de convention ;
- montant à engager ;
- montant HT ;
- taxes ;
- montant TTC ;
- retenues éventuelles ;
- devise ;
- taux de change lorsque nécessaire ;
- échéancier éventuel ;
- observations du service Budget ;
- observations du Contrôle Financier.

---

# 12. Types d’Engagement

Le référentiel doit permettre de paramétrer différents types d’Engagement, notamment :

- engagement sur bon de commande ;
- engagement sur contrat ;
- engagement sur marché ;
- engagement sur convention ;
- engagement de mission ;
- engagement de rémunération ;
- engagement de prestation ;
- engagement de fourniture ;
- engagement d’investissement ;
- engagement de subvention ;
- engagement de transfert ;
- engagement récurrent ;
- engagement pluriannuel ;
- engagement juridique spécifique.

Les types ne doivent pas être codés directement dans le code applicatif.

Ils doivent être administrables depuis les référentiels.

---

# 13. Gestion du bénéficiaire

Un Engagement peut être associé à un tiers.

Ce tiers peut être :

- fournisseur ;
- prestataire ;
- consultant ;
- opérateur économique ;
- attributaire ;
- créancier ;
- bénéficiaire institutionnel ;
- agent ;
- partenaire ;
- autre tiers autorisé.

Le tiers provient du référentiel central **ENTREPRISE / TIERS / BÉNÉFICIAIRE**.

Un même tiers peut exercer plusieurs rôles.

Le module doit éviter la création de doublons.

---

# 14. Contrôle des informations du tiers

Avant validation, le système peut contrôler :

- existence du tiers ;
- statut actif ;
- raison sociale ;
- identifiant fiscal ;
- coordonnées ;
- compte bancaire ;
- domiciliation bancaire ;
- statut fournisseur ;
- conformité administrative ;
- pièces réglementaires ;
- éventuelles restrictions ;
- historique contractuel.

Les règles exactes doivent pouvoir être paramétrées.

---

# 15. Pièces justificatives

Les pièces de l’Expression de Besoin restent accessibles.

Le module Engagement peut demander des documents complémentaires.

Par exemple :

- Expression de Besoin approuvée ;
- devis ;
- facture pro forma ;
- bon de commande ;
- contrat ;
- marché ;
- lettre de notification ;
- décision ;
- convention ;
- bordereau ;
- procès-verbal ;
- certificat administratif ;
- documents du fournisseur ;
- justificatifs fiscaux ;
- autres documents réglementaires.

Les pièces doivent être gérées par la GED intégrée.

---

# 16. GED et dossier numérique unique

Chaque Engagement dispose d’un dossier électronique.

Ce dossier contient :

- EB d’origine ;
- pièces héritées ;
- documents ajoutés pendant l’Engagement ;
- validations ;
- observations ;
- visa ;
- documents générés automatiquement ;
- versions successives ;
- journal d’événements.

Chaque document doit comporter notamment :

- type ;
- nom ;
- version ;
- auteur ;
- date d’ajout ;
- étape d’ajout ;
- statut ;
- empreinte numérique éventuelle.

---

# 17. Workflow interne de la Direction du Budget

Le traitement standard peut être organisé comme suit :

### Niveau 1 — Expert Budget

L’Expert Budget :

- reçoit l’Engagement ;
- vérifie la complétude ;
- contrôle l’imputation ;
- contrôle les crédits ;
- analyse les pièces ;
- formule éventuellement des observations ;
- prépare le dossier ;
- transmet au Chef de Service Budget.

### Niveau 2 — Chef de Service Budget

Le Chef de Service :

- contrôle les travaux de l’Expert ;
- vérifie la régularité budgétaire ;
- confirme ou rectifie les imputations ;
- demande éventuellement une correction ;
- valide puis transmet au Directeur du Budget.

### Niveau 3 — Directeur du Budget

Le Directeur du Budget :

- effectue le contrôle final de la Direction ;
- valide la conformité ;
- signe ou valide électroniquement ;
- transmet automatiquement le dossier au Contrôleur Financier.

Le workflow réel doit être paramétrable.

---

# 18. Intervention du Contrôleur Financier

Le Contrôleur Financier constitue le niveau de contrôle préalable final du module.

Il doit disposer d’une interface lui permettant de consulter :

- dossier complet ;
- Expression de Besoin ;
- Engagement ;
- imputations ;
- situation des crédits ;
- pièces justificatives ;
- validations précédentes ;
- historique ;
- commentaires ;
- documents contractuels.

Il dispose notamment des décisions suivantes :

- **Viser** ;
- **Retourner pour correction** ;
- **Ajourner** ;
- **Rejeter** ;
- **Demander une pièce complémentaire** ;
- **Émettre une observation**.

---

# 19. Visa du Contrôleur Financier

Lorsque le Contrôleur Financier vise l’Engagement :

- le visa est enregistré ;
- la date est enregistrée ;
- l’auteur est enregistré ;
- le numéro de visa peut être généré ;
- la version du dossier est figée ;
- la réservation devient définitive ;
- le document officiel d’Engagement est généré ;
- l’Engagement passe au statut **VISÉ** ;
- la Liquidation est créée automatiquement.

---

# 20. Retour pour correction

Lorsque le dossier est retourné :

- le Contrôleur Financier indique obligatoirement le motif ;
- le dossier revient au niveau compétent ;
- les champs autorisés deviennent modifiables ;
- les éléments déjà validés restent historisés ;
- toute correction génère une nouvelle version ;
- le dossier peut ensuite reprendre le workflow.

Le système doit éviter de réinitialiser inutilement toute la chaîne lorsque la correction ne concerne qu’un élément limité.

---

# 21. Rejet

Un rejet constitue une décision plus forte qu’un retour.

Il doit obligatoirement contenir :

- motif ;
- auteur ;
- date ;
- référence éventuelle ;
- commentaire ;
- pièces justificatives éventuelles.

Le rejet doit être historisé et consultable.

La possibilité de reprendre le dossier après rejet doit dépendre des règles de paramétrage.

---

# 22. Statuts du dossier

Le module doit gérer au minimum les statuts suivants :

- À générer ;
- Généré ;
- En préparation ;
- Affecté ;
- En cours d’analyse ;
- À compléter ;
- Retourné ;
- Corrigé ;
- Soumis ;
- En validation ;
- Validé Direction du Budget ;
- Transmis au Contrôle Financier ;
- En contrôle ;
- Visa en attente ;
- Visé ;
- Rejeté ;
- Annulé ;
- Transformé en Liquidation ;
- Clôturé.

Ces statuts peuvent être représentés par une machine à états.

---

# 23. Interface « Mes tâches »

Chaque acteur dispose d’une rubrique **Mes tâches**.

Elle présente uniquement les Engagements nécessitant une intervention de l’utilisateur.

La liste doit être triée par défaut de la date la plus récente vers la plus ancienne.

Chaque tâche affiche notamment :

- numéro Engagement ;
- numéro EB ;
- objet ;
- initiateur ;
- service ;
- montant ;
- type ;
- PAP/Hors PAP ;
- date de réception ;
- délai de traitement ;
- statut ;
- priorité ;
- action attendue.

---

# 24. Tableau de bord ENGAGEMENT

Le module comporte un tableau de bord spécifique.

Il peut présenter notamment les indicateurs suivants :

- Engagements générés ;
- Engagements en préparation ;
- Engagements en validation ;
- Engagements retournés ;
- Engagements transmis au CF ;
- Engagements visés ;
- Engagements rejetés ;
- Engagements en retard ;
- montant total engagé ;
- montant réservé ;
- taux d’engagement du Budget ;
- taux d’engagement du PAP ;
- engagement par département ;
- engagement par direction ;
- engagement par ligne budgétaire ;
- engagement par source de financement ;
- engagement par type de dépense.

Chaque carte doit être cliquable et ouvrir la liste correspondante.

---

# 25. Écran de liste des Engagements

La liste principale doit proposer des colonnes telles que :

- N° Engagement ;
- N° EB ;
- date ;
- objet ;
- unité initiatrice ;
- bénéficiaire ;
- ligne budgétaire ;
- PAP/Hors PAP ;
- montant ;
- montant engagé ;
- statut ;
- acteur actuel ;
- date dernière action ;
- délai ;
- actions.

---

# 26. Filtres de recherche

La liste doit pouvoir être filtrée par :

- exercice ;
- numéro Engagement ;
- numéro EB ;
- objet ;
- statut ;
- période ;
- département ;
- direction ;
- service ;
- initiateur ;
- bénéficiaire ;
- fournisseur ;
- PAP/Hors PAP ;
- ligne budgétaire ;
- chapitre ;
- article ;
- source de financement ;
- montant ;
- acteur actuel ;
- retard ;
- priorité.

Une recherche globale en texte libre doit également être disponible.

---

# 27. Écran détail

La page détail de l’Engagement doit présenter le dossier de manière structurée.

### Bandeau d’identification

- numéro Engagement ;
- statut ;
- montant ;
- date ;
- type ;
- exercice.

### Bandeau de progression

Exemple :

**Expression de Besoin ✓ → Engagement ● → Liquidation ○ → Ordonnancement ○ → Paiement ○**

### Bloc « Situation du dossier »

Il précise :

- dernière action ;
- acteur ayant réalisé l’action ;
- date ;
- prochaine étape ;
- acteur attendu ;
- délai éventuel.

### Onglets

- Synthèse ;
- Expression de Besoin ;
- Engagement ;
- Imputations ;
- PAP ;
- Fournisseur / bénéficiaire ;
- Pièces justificatives ;
- Workflow ;
- Observations ;
- Historique ;
- Documents générés ;
- Journal d’audit.

---

# 28. Bandeau de workflow

Chaque dossier doit afficher un bandeau explicite.

Exemple :

**Dernière action : Validation du Chef de Service Budget**  
**Réalisée par : Jean X**  
**Date : 07/09/2026 à 14:35**  
**Étape actuelle : Validation Direction du Budget**  
**Acteur attendu : Directeur du Budget**

Cela évite toute ambiguïté sur la localisation du dossier.

---

# 29. Actions disponibles

Selon les droits et l’état du dossier, les actions possibles peuvent être :

- Ouvrir ;
- Consulter ;
- Compléter ;
- Modifier ;
- Affecter ;
- Soumettre ;
- Valider ;
- Retourner ;
- Rejeter ;
- Ajouter une observation ;
- Ajouter une pièce ;
- Télécharger ;
- Générer le document ;
- Viser ;
- Annuler ;
- Voir l’historique.

Les boutons doivent être contrôlés par les permissions et l’état du workflow.

---

# 30. Séparation des fonctions

BUDGET-CEEAC doit respecter la séparation des responsabilités.

Le système doit empêcher qu’un même utilisateur :

- initie ;
- contrôle ;
- valide ;
- vise ;

une même opération lorsque la matrice de séparation des fonctions l’interdit.

Les restrictions doivent être configurables dans la gestion des rôles et permissions.

---

# 31. Contrôles automatiques

Avant toute validation, le système vérifie notamment :

### Contrôles budgétaires

- exercice ouvert ;
- ligne active ;
- crédit disponible ;
- absence de dépassement ;
- cohérence des imputations ;
- disponibilité de la source de financement.

### Contrôles financiers

- montant total cohérent ;
- taxes cohérentes ;
- devises valides ;
- somme des imputations correcte.

### Contrôles administratifs

- dossier complet ;
- bénéficiaire identifié ;
- pièces obligatoires présentes ;
- EB approuvée ;
- workflow respecté.

### Contrôles PAP

Lorsque la ligne appartient au PAP :

- activité active ;
- tâche active ;
- période compatible ;
- crédit PAP disponible ;
- cohérence avec la programmation.

---

# 32. Numérotation

Chaque Engagement doit disposer d’un numéro unique.

Exemple :

**ENG/CEEAC/2026/000125**

La structure doit être paramétrable.

Elle peut intégrer :

- code document ;
- institution ;
- exercice ;
- numéro séquentiel.

Le numéro ne doit jamais être réutilisé.

---

# 33. Documents générés automatiquement

À l’issue de l’Engagement, BUDGET-CEEAC doit pouvoir produire automatiquement :

### Fiche d’Engagement

Elle contient notamment :

- numéro Engagement ;
- référence EB ;
- exercice ;
- unité initiatrice ;
- objet ;
- bénéficiaire ;
- montant ;
- imputations ;
- situation des crédits ;
- validations ;
- visa du Contrôle Financier.

### Certificat ou fiche de réservation de crédit

Selon les règles retenues.

### Bordereau de transmission

Pour la transmission entre services.

### Historique de validation

Document de contrôle pouvant être joint au dossier.

Tous les documents officiels doivent être générés en PDF et figés après validation finale.

---

# 34. Signature électronique

Lorsque la politique de sécurité le permet, le module peut prendre en charge :

- signature électronique ;
- certificat ;
- horodatage ;
- QR Code de vérification ;
- empreinte cryptographique ;
- contrôle d’intégrité.

Un QR Code peut permettre de vérifier :

- numéro du document ;
- statut ;
- date de validation ;
- signataire ;
- empreinte du document.

---

# 35. Historisation

Toute modification doit être historisée.

Pour chaque événement :

- utilisateur ;
- rôle ;
- date ;
- heure ;
- adresse IP si autorisée ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- commentaire ;
- étape ;
- version.

Le système ne doit jamais écraser silencieusement une donnée précédemment validée.

---

# 36. Journal d’audit

Les actions sensibles doivent être enregistrées dans un journal d’audit immuable.

Exemples :

- création ;
- génération ;
- consultation sensible ;
- modification ;
- affectation ;
- ajout de pièce ;
- validation ;
- retour ;
- rejet ;
- visa ;
- annulation ;
- changement d’imputation ;
- changement de montant ;
- génération PDF ;
- transformation en Liquidation.

---

# 37. Notifications

Le module doit émettre des notifications pour les événements importants.

Exemples :

- nouvel Engagement à traiter ;
- affectation ;
- dossier retourné ;
- document manquant ;
- dossier validé ;
- dossier transmis au CF ;
- dossier visé ;
- dossier rejeté ;
- dépassement de délai ;
- Liquidation automatiquement générée.

Canaux possibles :

- notification interne ;
- courriel ;
- éventuellement SMS ou autre canal intégré.

---

# 38. Gestion des délais

Chaque niveau du workflow peut disposer d’un délai cible.

Le système calcule :

- date de réception ;
- délai réglementaire ou cible ;
- date limite ;
- durée de traitement ;
- nombre de jours de retard.

Des codes visuels peuvent permettre d’identifier :

- dans les délais ;
- proche échéance ;
- en retard ;
- délai critique.

---

# 39. Recherche globale

Un Engagement doit être retrouvé depuis la recherche globale de BUDGET-CEEAC à partir :

- du numéro ENG ;
- numéro EB ;
- objet ;
- bénéficiaire ;
- fournisseur ;
- montant ;
- référence de contrat ;
- ligne budgétaire ;
- activité PAP ;
- service initiateur.

---

# 40. Transformation automatique en Liquidation

Une règle fondamentale du système est :

> **Après visa final du Contrôleur Financier, l’Engagement doit produire automatiquement la Liquidation.**

Cette opération doit être transactionnelle.

Elle comprend au minimum :

1. validation définitive du visa ;
2. verrouillage de l’Engagement ;
3. confirmation de l’engagement budgétaire ;
4. génération du PDF officiel ;
5. changement de statut ;
6. création de la Liquidation ;
7. copie des données nécessaires ;
8. héritage des pièces justificatives ;
9. conservation des imputations ;
10. conservation du tiers ;
11. création de la première tâche de Liquidation ;
12. notification de l’acteur concerné.

Il ne doit pas exister de bouton manuel supplémentaire du type :

**« Créer la Liquidation »**

lorsque l’Engagement est définitivement visé.

---

# 41. Données transmises à la Liquidation

La Liquidation hérite notamment :

- Engagement ;
- Expression de Besoin ;
- bénéficiaire ;
- montant engagé ;
- imputations ;
- lignes budgétaires ;
- informations PAP ;
- contrat ;
- marché ;
- fournisseur ;
- pièces justificatives ;
- visa du Contrôle Financier ;
- historique utile.

La Liquidation ajoute ensuite les éléments propres à la constatation du service fait et au montant réellement dû.

---

# 42. Gestion des écarts ultérieurs

Le montant liquidé peut être inférieur au montant engagé.

Le système doit permettre de suivre :

- montant engagé ;
- montant liquidé ;
- reliquat d’engagement.

Exemple :

Montant engagé : **10 000 000 XAF**  
Montant liquidé : **9 500 000 XAF**  
Reliquat : **500 000 XAF**

Le traitement du reliquat doit être prévu :

- maintien ;
- réutilisation autorisée ;
- dégagement ;
- annulation ;
- réaffectation selon les règles applicables.

---

# 43. Gestion des annulations et dégagements

Le système doit permettre, avec autorisations appropriées :

- annulation d’un Engagement ;
- dégagement partiel ;
- dégagement total ;
- rétablissement du crédit disponible.

Toute opération doit être motivée et historisée.

Un Engagement ayant déjà donné lieu à une Liquidation ne doit pas pouvoir être annulé librement.

---

# 44. Engagements pluriannuels

Pour certaines dépenses, le système peut prévoir :

- autorisation d’engagement ;
- crédits de paiement ;
- échéancier ;
- ventilation par exercice ;
- engagements futurs ;
- paiements prévisionnels.

Cette fonctionnalité doit être activée uniquement lorsque le cadre budgétaire retenu le nécessite.

---

# 45. Indicateurs de performance

Le module doit alimenter le reporting global avec notamment :

- taux d’engagement du Budget ;
- taux d’engagement du PAP ;
- engagements mensuels ;
- engagements cumulés ;
- engagements par nature ;
- engagements par département ;
- engagements par source de financement ;
- engagements par fournisseur ;
- engagements rejetés ;
- taux de rejet ;
- délais moyens de traitement ;
- délai moyen du visa CF ;
- taux de dossiers retournés ;
- montant des crédits restant disponibles.

---

# 46. Sécurité et habilitations

L’accès est contrôlé selon :

- utilisateur ;
- rôle ;
- fonction ;
- unité organisationnelle ;
- étape du workflow ;
- type de dépense ;
- niveau d’autorisation.

Les permissions peuvent inclure :

- engagement.view ;
- engagement.create ;
- engagement.update ;
- engagement.assign ;
- engagement.validate ;
- engagement.return ;
- engagement.reject ;
- engagement.visa ;
- engagement.cancel ;
- engagement.export ;
- engagement.audit.

---

# 47. Intégration organisationnelle

Le module s’appuie sur le référentiel organisationnel officiel de la Commission.

Il doit identifier :

- département ;
- direction ;
- service ;
- unité ;
- responsable ;
- supérieur hiérarchique ;
- acteur budgétaire ;
- Contrôleur Financier.

Toute modification du référentiel organisationnel doit être prise en compte sans réécriture du workflow applicatif lorsque celui-ci est paramétré par rôle.

---

# 48. Architecture fonctionnelle recommandée

Le module ENGAGEMENT peut être organisé en sous-composants :

### ENG-01 — Tableau de bord

Indicateurs et accès rapide.

### ENG-02 — Liste des Engagements

Recherche et filtres.

### ENG-03 — Dossier Engagement

Consultation complète.

### ENG-04 — Analyse budgétaire

Contrôle crédits et imputations.

### ENG-05 — Bénéficiaire

Gestion du tiers.

### ENG-06 — Pièces justificatives

GED.

### ENG-07 — Workflow

Validation et transmission.

### ENG-08 — Contrôle Financier

Visa, retour, rejet.

### ENG-09 — Documents

Génération PDF.

### ENG-10 — Historique

Piste d’audit.

### ENG-11 — Reporting

Statistiques et indicateurs.

### ENG-12 — Paramétrage

Types, règles, délais, statuts et workflow.

---

# 49. Règles de gestion essentielles

**RG-ENG-001**  
Un Engagement doit être associé à une Expression de Besoin approuvée.

**RG-ENG-002**  
Une EB ne peut générer qu’un Engagement principal, sauf cas de fractionnement explicitement autorisé.

**RG-ENG-003**  
Le Budget de l’exercice est déterminé automatiquement.

**RG-ENG-004**  
Le PAP ne doit jamais être sélectionné comme un budget distinct.

**RG-ENG-005**  
La nature PAP/Hors PAP est déterminée par la ligne budgétaire.

**RG-ENG-006**  
Les références PAP sont récupérées automatiquement.

**RG-ENG-007**  
La somme des imputations doit être égale au montant engagé.

**RG-ENG-008**  
Aucune imputation ne peut dépasser le crédit disponible.

**RG-ENG-009**  
Toute modification d’une imputation doit être historisée.

**RG-ENG-010**  
Toute modification du montant après une validation antérieure peut nécessiter la reprise du niveau de contrôle concerné.

**RG-ENG-011**  
La validation Direction du Budget entraîne la transmission au Contrôleur Financier.

**RG-ENG-012**  
Le visa du Contrôleur Financier rend l’Engagement définitif.

**RG-ENG-013**  
Le visa entraîne automatiquement la génération de la Liquidation.

**RG-ENG-014**  
Un Engagement définitivement visé est verrouillé.

**RG-ENG-015**  
Les documents officiels sont figés et versionnés.

**RG-ENG-016**  
Chaque action est journalisée.

**RG-ENG-017**  
Les transitions de workflow doivent être atomiques et sécurisées.

**RG-ENG-018**  
Les utilisateurs ne peuvent intervenir que selon leurs habilitations.

---

# 50. Résultat attendu

Le module ENGAGEMENT de BUDGET-CEEAC doit permettre de passer d’un besoin administrativement approuvé à un engagement financier :

- régulier ;
- contrôlé ;
- budgétairement soutenable ;
- correctement imputé ;
- intégralement traçable ;
- sécurisé ;
- validé par les acteurs compétents ;
- visé par le Contrôle Financier ;
- et automatiquement transmis à la Liquidation.

Le module doit donc constituer le **point central de sécurisation budgétaire et financière de la dépense**, tout en évitant les doubles saisies et les ruptures de chaîne.

Le processus cible peut être résumé ainsi :

**EB approuvée**  
↓  
**Génération automatique de l’Engagement**  
↓  
**Réservation des crédits**  
↓  
**Expert Budget**  
↓  
**Chef de Service Budget**  
↓  
**Directeur du Budget**  
↓  
**Transmission automatique au Contrôleur Financier**  
↓  
**Contrôle / Visa**  
↓  
**Engagement définitif**  
↓  
**Génération automatique des documents officiels**  
↓  
**Création automatique de la Liquidation**

Cette conception garantit la continuité numérique complète de la chaîne de dépense de BUDGET-CEEAC, depuis l’Expression de Besoin jusqu’au Paiement.