# DESCRIPTION DÉTAILLÉE DU MODULE ORDONNANCEMENT  
## Application BUDGET-CEEAC

---

# 1. Présentation générale

Le module **ORDONNANCEMENT** constitue la quatrième étape majeure de la chaîne d’exécution de la dépense dans **BUDGET-CEEAC**.

Il intervient après :

1. l’**Expression de Besoin** ;
2. l’**Engagement** ;
3. la **Liquidation** ;
4. et la validation définitive de la Liquidation.

L’Ordonnancement a pour finalité de donner l’ordre administratif et financier de payer une dette régulièrement constatée et liquidée.

Il matérialise donc la décision de l’Ordonnateur autorisant le règlement d’une dépense dont :

- le besoin a été approuvé ;
- l’Engagement a été validé ;
- le service fait a été constaté ;
- la créance a été liquidée ;
- le montant dû a été arrêté ;
- les pièces justificatives ont été vérifiées ;
- les contrôles réglementaires ont été effectués.

L’Ordonnancement constitue ainsi l’interface entre la **phase administrative de la dépense** et la **phase comptable du Paiement**.

---

# 2. Position dans la chaîne de dépense

La chaîne cible de BUDGET-CEEAC est :

**Expression de Besoin**  
↓  
**Engagement**  
↓  
**Liquidation**  
↓  
**Ordonnancement**  
↓  
**Paiement**

L’Ordonnancement ne doit jamais être considéré comme un module isolé.

Il fait partie du **dossier numérique unique de dépense** et hérite automatiquement des informations validées lors des étapes précédentes.

---

# 3. Principe fondamental

Dans BUDGET-CEEAC, un Ordonnancement ne doit pas être créé manuellement à partir de zéro.

Il est **généré automatiquement après la validation définitive de la Liquidation**.

Le principe cible est :

> **Liquidation définitivement validée → création automatique de l’Ordonnancement.**

Aucune action manuelle du type :

**« Créer un Ordonnancement »**

ne doit être requise après la validation finale de la Liquidation.

La transition doit être :

- automatique ;
- sécurisée ;
- transactionnelle ;
- idempotente ;
- intégralement tracée.

---

# 4. Finalité fonctionnelle

Le module ORDONNANCEMENT doit permettre de répondre à plusieurs questions fondamentales.

### 4.1 La dette peut-elle être payée ?

Le système doit vérifier :

- que la Liquidation est valide ;
- que le service fait a été certifié ;
- que le montant dû est définitivement arrêté ;
- que les pièces justificatives nécessaires sont présentes ;
- que le créancier est correctement identifié ;
- que l’imputation budgétaire est régulière ;
- que les validations antérieures sont acquises.

### 4.2 Quel est le montant à ordonnancer ?

Le montant à ordonnancer doit correspondre au montant net validé dans la Liquidation.

### 4.3 Qui est compétent pour ordonnancer ?

Le système doit déterminer automatiquement l’Ordonnateur compétent conformément aux seuils et règles applicables.

### 4.4 Le dossier peut-il être transmis à l’Agence Comptable ?

Après signature définitive de l’Ordre de Paiement :

> **le système doit créer automatiquement le dossier de Paiement et le transmettre à l’Agence Comptable.**

---

# 5. Objectifs du module

Le module doit permettre de :

1. générer automatiquement un Ordonnancement après validation de la Liquidation ;
2. récupérer toutes les données nécessaires des étapes précédentes ;
3. calculer le montant à ordonnancer ;
4. identifier automatiquement l’Ordonnateur compétent ;
5. vérifier la complétude du dossier ;
6. préparer l’Ordre de Paiement ;
7. permettre la validation et la signature ;
8. générer les documents officiels ;
9. assurer la traçabilité de la décision ;
10. empêcher toute modification non autorisée après validation ;
11. transmettre automatiquement le dossier à l’Agence Comptable ;
12. créer automatiquement le Paiement.

---

# 6. Génération automatique de l’Ordonnancement

Lorsque la Liquidation est définitivement validée :

1. le système verrouille la version validée ;
2. les données financières sont figées ;
3. le montant net à payer est arrêté ;
4. un Ordonnancement est créé ;
5. un numéro unique est attribué ;
6. les données héritées sont copiées ;
7. les pièces justificatives sont associées ;
8. l’Ordonnateur compétent est déterminé ;
9. une tâche est créée ;
10. une notification est envoyée.

La génération doit être idempotente afin d’empêcher la création de plusieurs Ordonnancements pour une même Liquidation.

---

# 7. Dossier numérique unique

Le module doit permettre de naviguer facilement entre :

- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement.

L’ensemble des étapes doit rester lié à un même dossier fonctionnel.

Exemple :

**Dossier DEP-2026-000458**

avec :

- EB-2026-000458 ;
- ENG-2026-000458 ;
- LIQ-2026-000458 ;
- ORD-2026-000458 ;
- PAY-2026-000458.

---

# 8. Données héritées de la Liquidation

L’Ordonnancement doit récupérer automatiquement au minimum :

- numéro de Liquidation ;
- numéro d’Engagement ;
- numéro EB ;
- exercice budgétaire ;
- objet ;
- service initiateur ;
- direction ;
- département ;
- bénéficiaire ;
- créancier ;
- fournisseur ;
- montant engagé ;
- montant liquidé ;
- montant net à payer ;
- taxes ;
- retenues ;
- pénalités ;
- imputations budgétaires ;
- données PAP ;
- source de financement ;
- références de contrats ;
- références de factures ;
- service fait ;
- pièces justificatives ;
- validations antérieures ;
- historique.

---

# 9. Protection des données héritées

Les informations héritées des étapes précédentes doivent normalement être en lecture seule.

Doivent notamment être protégés :

- bénéficiaire ;
- créancier ;
- ligne budgétaire ;
- montant liquidé ;
- montant net à payer ;
- factures ;
- données PAP ;
- service fait.

Toute modification structurelle doit passer par une procédure formalisée de retour à l’étape concernée.

---

# 10. Notion d’Ordonnancement

L’Ordonnancement est l’acte par lequel l’autorité habilitée ordonne le paiement d’une dette.

Il intervient après la reconnaissance de la dette et sa Liquidation.

Le système doit donc distinguer clairement :

- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement.

L’Ordonnancement ne signifie pas que le paiement a déjà été effectué.

Il constitue l’ordre donné à l’Agence Comptable de procéder au règlement.

---

# 11. Détermination de l’Ordonnateur compétent

Dans le processus BUDGET-CEEAC actuellement retenu, la compétence dépend du montant.

### Cas 1 — Montant inférieur ou égal à 5 000 000 XAF

L’Ordonnateur compétent est :

**Secrétaire Général — Ordonnateur délégué**

### Cas 2 — Montant supérieur à 5 000 000 XAF

L’Ordonnateur compétent est :

**Président de la Commission — Ordonnateur principal**

La règle doit être paramétrable dans le système.

---

# 12. Automatisation du routage

Le système doit déterminer automatiquement l’acteur attendu.

Exemple :

**Montant : 4 500 000 XAF**

→ routage vers le Secrétaire Général.

**Montant : 12 000 000 XAF**

→ routage vers le Président de la Commission.

Aucun utilisateur ne doit choisir manuellement l’Ordonnateur lorsque le seuil permet une détermination automatique.

---

# 13. Paramétrage des seuils

Les seuils ne doivent pas être codés en dur.

Ils doivent être stockés dans un référentiel administrable avec :

- montant minimal ;
- montant maximal ;
- devise ;
- Ordonnateur compétent ;
- période de validité ;
- référence juridique ;
- date d’effet ;
- statut actif.

---

# 14. Gestion des délégations

Le module doit pouvoir gérer les délégations d’ordonnancement.

Une délégation peut préciser :

- délégant ;
- délégataire ;
- type de délégation ;
- plafond ;
- période ;
- actes concernés ;
- référence de décision ;
- statut.

Le système doit vérifier automatiquement si la délégation est valide au moment de la signature.

---

# 15. Préparation de l’Ordre de Paiement

Le système doit générer un projet d’Ordre de Paiement contenant notamment :

- numéro d’Ordonnancement ;
- exercice ;
- bénéficiaire ;
- objet ;
- montant ;
- devise ;
- montant en lettres ;
- références de la Liquidation ;
- référence de l’Engagement ;
- référence EB ;
- imputations ;
- nature de dépense ;
- compte ou coordonnées du bénéficiaire si nécessaire ;
- pièces justificatives ;
- Ordonnateur compétent.

---

# 16. Montant ordonnancé

Par principe :

> **Montant ordonnancé = montant net liquidé validé**

Le système doit empêcher toute modification arbitraire du montant à ce stade.

Si le montant doit être modifié, le dossier doit revenir à la Liquidation.

---

# 17. Ordonnancement total

Un Ordonnancement est total lorsque la totalité du montant liquidé est ordonnancée.

Exemple :

Montant liquidé : **10 000 000 XAF**  
Montant ordonnancé : **10 000 000 XAF**

---

# 18. Ordonnancement partiel

Si les règles de gestion l’autorisent, un montant liquidé peut être ordonnancé en plusieurs fois.

Exemple :

Montant liquidé : **10 000 000 XAF**

Premier Ordonnancement : **6 000 000 XAF**

Second Ordonnancement : **4 000 000 XAF**

Cette fonctionnalité doit être strictement contrôlée et paramétrable.

---

# 19. Contrôle du plafond

Le système doit appliquer la règle :

> **Total ordonnancé ≤ total liquidé validé**

Tout dépassement doit être bloqué.

---

# 20. Contrôle du bénéficiaire

Le créancier ordonnancé doit correspondre au bénéficiaire de la Liquidation.

Toute substitution doit être interdite sauf procédure réglementaire spécifique.

Le système doit notamment vérifier :

- identité ;
- raison sociale ;
- statut ;
- coordonnées bancaires ;
- compte bénéficiaire ;
- conformité du tiers.

---

# 21. Coordination avec le module Entreprise / Tiers

Le créancier provient du référentiel central des tiers.

Un même tiers peut jouer plusieurs rôles :

- fournisseur ;
- prestataire ;
- consultant ;
- attributaire ;
- créancier ;
- bénéficiaire.

Le module ORDONNANCEMENT ne doit pas créer de référentiel parallèle.

---

# 22. Imputations budgétaires

L’Ordonnancement conserve les imputations validées lors des étapes précédentes.

Pour chaque ligne :

- ligne budgétaire ;
- montant engagé ;
- montant liquidé ;
- montant ordonnancé ;
- montant payé ;
- reliquat.

L’utilisateur ne doit pas modifier librement les lignes à cette étape.

---

# 23. PAP

Lorsqu’une dépense relève du PAP, les données programmatiques restent visibles :

- Pilier ;
- Axe ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateur ;
- source de financement.

Aucune nouvelle référence PAP ne doit être saisie.

---

# 24. Pièces justificatives

Le module doit donner accès aux pièces héritées :

- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- facture ;
- contrat ;
- marché ;
- bon de commande ;
- service fait ;
- procès-verbal ;
- visa du Contrôleur Financier ;
- autres pièces justificatives.

Il peut également recevoir des pièces propres à l’Ordonnancement.

---

# 25. GED intégrée

Toutes les pièces doivent rester accessibles via la GED.

Chaque document doit conserver :

- catégorie ;
- type ;
- auteur ;
- version ;
- date ;
- statut ;
- étape d’origine ;
- niveau de confidentialité.

---

# 26. Contrôle de complétude

Avant transmission à l’Ordonnateur, le système doit vérifier notamment :

- Liquidation valide ;
- service fait certifié ;
- facture valide ;
- bénéficiaire valide ;
- montant cohérent ;
- pièces obligatoires présentes ;
- imputations présentes ;
- validations antérieures obtenues.

---

# 27. Workflow cible

Le workflow de référence est :

### Étape 1 — Génération automatique

Création après validation définitive de la Liquidation.

### Étape 2 — Préparation

Le système prépare automatiquement les données du dossier.

Selon le paramétrage, un agent habilité peut effectuer un contrôle administratif préalable.

### Étape 3 — Détermination de l’Ordonnateur

Le système applique automatiquement les seuils.

### Étape 4 — Validation / Signature

Le dossier est transmis à l’Ordonnateur compétent.

### Étape 5 — Signature de l’Ordre de Paiement

L’Ordonnateur valide et signe.

### Étape 6 — Paiement automatique

Après signature :

> **création automatique du dossier de Paiement et transmission à l’Agence Comptable.**

---

# 28. Acteurs

Les acteurs peuvent notamment être :

- agents de préparation ;
- responsables financiers ;
- Secrétaire Général ;
- Président de la Commission ;
- administrateurs fonctionnels ;
- acteurs de contrôle.

Les rôles doivent être gérés par le système d’habilitation.

---

# 29. Actions de l’Ordonnateur

L’Ordonnateur doit pouvoir :

- consulter le dossier ;
- consulter la chaîne complète ;
- examiner les pièces ;
- voir les contrôles antérieurs ;
- approuver ;
- signer ;
- retourner ;
- demander un complément ;
- rejeter ;
- formuler une observation.

---

# 30. Retour pour correction

En cas de retour :

- le motif est obligatoire ;
- le dossier reste historisé ;
- l’acteur concerné est notifié ;
- seuls les champs autorisés sont modifiables ;
- une nouvelle version est créée si nécessaire.

---

# 31. Rejet

Un rejet doit contenir :

- motif ;
- auteur ;
- date ;
- commentaire ;
- référence éventuelle ;
- pièce justificative éventuelle.

Le dossier rejeté ne doit pas être supprimé.

---

# 32. Signature

La signature peut être :

- électronique ;
- numérique ;
- ou enregistrée selon les mécanismes institutionnels autorisés.

Elle doit comporter :

- identité du signataire ;
- fonction ;
- date ;
- heure ;
- référence ;
- statut de la signature.

---

# 33. Signature électronique renforcée

Le système peut intégrer :

- certificat électronique ;
- horodatage ;
- empreinte cryptographique ;
- QR Code ;
- mécanisme de vérification ;
- journal de signature.

---

# 34. Document officiel : Ordre de Paiement

Après validation, le système doit générer automatiquement un document officiel.

Le document peut contenir :

- logo et identité institutionnelle ;
- numéro OP ;
- exercice ;
- date ;
- créancier ;
- objet ;
- montant ;
- montant en lettres ;
- références EB / ENG / LIQ ;
- imputations ;
- coordonnées de paiement ;
- signature de l’Ordonnateur ;
- QR Code éventuel ;
- références de contrôle.

---

# 35. Numérotation

Chaque Ordonnancement doit avoir un numéro unique.

Exemple :

**ORD/CEEAC/2026/000145**

L’Ordre de Paiement peut avoir sa propre numérotation :

**OP/CEEAC/2026/000145**

La structure doit être paramétrable.

---

# 36. Statuts

Le module peut gérer notamment :

- Généré ;
- En préparation ;
- En contrôle ;
- À compléter ;
- Retourné ;
- Corrigé ;
- Soumis ;
- En attente de signature ;
- Signé ;
- Rejeté ;
- Annulé ;
- Transmis à l’Agence Comptable ;
- Transformé en Paiement ;
- Clôturé.

---

# 37. Écran de liste

La liste doit afficher notamment :

- N° Ordonnancement ;
- N° OP ;
- N° Liquidation ;
- N° Engagement ;
- N° EB ;
- date ;
- objet ;
- bénéficiaire ;
- montant ;
- Ordonnateur ;
- statut ;
- acteur actuel ;
- délai ;
- dernière action.

---

# 38. Filtres

Les filtres doivent inclure :

- exercice ;
- numéro ORD ;
- numéro OP ;
- Liquidation ;
- Engagement ;
- EB ;
- statut ;
- période ;
- bénéficiaire ;
- direction ;
- département ;
- service ;
- montant ;
- Ordonnateur ;
- PAP/Hors PAP ;
- source de financement ;
- ligne budgétaire ;
- retard.

---

# 39. Page détail

La page détail doit présenter :

## Bandeau principal

- numéro ORD ;
- numéro OP ;
- statut ;
- montant ;
- bénéficiaire ;
- Ordonnateur.

## Progression

**EB ✓ → ENG ✓ → LIQ ✓ → ORD ● → PAY ○**

## Situation du dossier

- dernière action ;
- acteur ;
- date ;
- étape actuelle ;
- acteur attendu ;
- délai.

## Onglets

- Synthèse ;
- Liquidation ;
- Engagement ;
- EB ;
- Imputations ;
- PAP ;
- Bénéficiaire ;
- Pièces ;
- Workflow ;
- Observations ;
- Historique ;
- Documents générés ;
- Journal d’audit.

---

# 40. Interface de validation

L’interface doit permettre à l’Ordonnateur de voir immédiatement :

- objet ;
- montant ;
- bénéficiaire ;
- service initiateur ;
- montant engagé ;
- montant liquidé ;
- montant ordonnancé ;
- imputations ;
- situation des contrôles ;
- pièces importantes.

Les actions principales doivent être clairement visibles.

---

# 41. Actions possibles

Selon le rôle et le statut :

- Consulter ;
- Vérifier ;
- Ajouter une observation ;
- Retourner ;
- Demander une pièce ;
- Rejeter ;
- Approuver ;
- Signer ;
- Télécharger l’OP ;
- Voir l’historique.

---

# 42. Bandeau de workflow

Exemple :

**Dernière action : Validation définitive de la Liquidation**  
**Réalisée par : Contrôleur Financier**  
**Date : 07/09/2026 à 14:35**  
**Étape actuelle : Signature de l’Ordre de Paiement**  
**Acteur attendu : Secrétaire Général**

ou :

**Acteur attendu : Président de la Commission**

selon le seuil.

---

# 43. Mes tâches

La rubrique **Mes tâches** doit afficher uniquement les dossiers nécessitant une intervention de l’utilisateur.

Tri par défaut :

> **du plus récent au plus ancien.**

Colonnes :

- numéro ;
- objet ;
- bénéficiaire ;
- montant ;
- statut ;
- date ;
- délai ;
- priorité ;
- action attendue.

---

# 44. Tableau de bord

Le tableau de bord ORDONNANCEMENT doit afficher notamment :

- Ordonnancements générés ;
- en préparation ;
- en attente de signature ;
- signés ;
- retournés ;
- rejetés ;
- en retard ;
- transmis à l’Agence Comptable ;
- montant total ordonnancé ;
- taux d’ordonnancement ;
- délai moyen de signature.

---

# 45. Indicateurs

Le module doit alimenter le reporting avec :

- montant liquidé ;
- montant ordonnancé ;
- montant payé ;
- taux d’ordonnancement ;
- délai Liquidation → Ordonnancement ;
- délai moyen de signature ;
- taux de retour ;
- taux de rejet ;
- nombre d’OP par Ordonnateur ;
- Ordonnancements par département ;
- Ordonnancements PAP ;
- Ordonnancements Hors PAP ;
- Ordonnancements par source de financement.

---

# 46. Contrôles automatiques

Avant signature, le système doit vérifier :

### Contrôles d’origine

- Liquidation existante ;
- Liquidation validée ;
- absence d’annulation.

### Contrôles financiers

- montant cohérent ;
- absence de dépassement ;
- imputations valides ;
- montant net identique au montant liquidé autorisé.

### Contrôles administratifs

- créancier identifié ;
- pièces complètes ;
- workflow respecté.

### Contrôle de compétence

- Ordonnateur correspondant au seuil ;
- délégation valide le cas échéant.

---

# 47. Alertes

Le système doit générer des alertes notamment en cas de :

- Liquidation incomplète ;
- montant incohérent ;
- créancier non conforme ;
- délégation expirée ;
- seuil dépassé ;
- pièce manquante ;
- facture annulée ;
- dossier retourné ;
- délai dépassé.

---

# 48. Séparation des fonctions

Le module doit respecter les règles de séparation des tâches.

Selon la matrice d’habilitation, un utilisateur ne doit pas pouvoir cumuler des fonctions incompatibles sur le même dossier.

La signature de l’Ordonnateur constitue une action fortement protégée.

---

# 49. Historisation

Toute modification doit être historisée.

Le journal doit contenir :

- utilisateur ;
- rôle ;
- ancienne valeur ;
- nouvelle valeur ;
- date ;
- heure ;
- commentaire ;
- motif ;
- étape.

---

# 50. Journal d’audit

Doivent être journalisés :

- création ;
- consultation sensible ;
- modification ;
- validation ;
- retour ;
- rejet ;
- signature ;
- génération OP ;
- téléchargement ;
- transmission à l’Agence Comptable ;
- transformation en Paiement.

---

# 51. Notifications

Le module doit produire des notifications pour :

- nouvel Ordonnancement ;
- dossier à signer ;
- retour ;
- demande de pièce ;
- rejet ;
- signature ;
- transmission à l’Agence Comptable ;
- création du Paiement ;
- dépassement de délai.

---

# 52. Gestion des délais

Le système doit calculer :

- date de création ;
- date de réception ;
- date limite ;
- temps passé ;
- délai restant ;
- retard.

Les dossiers en retard doivent apparaître clairement.

---

# 53. Documents générés

Le module doit pouvoir générer :

- Ordre de Paiement ;
- fiche d’Ordonnancement ;
- bordereau de transmission ;
- historique de validation ;
- état des imputations ;
- certificat ou état de contrôle ;
- journal de signature.

---

# 54. Documents figés

Après signature :

- le document OP est figé ;
- son empreinte est conservée ;
- toute nouvelle version doit être clairement identifiable ;
- la version signée ne doit jamais être écrasée.

---

# 55. Cas d’annulation

L’annulation d’un Ordonnancement signé doit être exceptionnelle.

Elle doit nécessiter :

- motif ;
- autorité compétente ;
- référence ;
- date ;
- justification ;
- journalisation complète.

Elle doit également produire les effets nécessaires sur le Paiement s’il a déjà été généré.

---

# 56. Cas de retour depuis l’Agence Comptable

L’Agence Comptable peut détecter une anomalie avant paiement.

Le système doit permettre un retour formalisé vers l’étape appropriée sans suppression du dossier.

Le retour doit indiquer :

- motif ;
- auteur ;
- date ;
- observation ;
- pièces éventuelles.

---

# 57. Transmission à l’Agence Comptable

Après signature définitive de l’Ordre de Paiement :

1. le document est figé ;
2. la signature est enregistrée ;
3. le statut devient **SIGNÉ** ;
4. le dossier est transmis automatiquement à l’Agence Comptable ;
5. le Paiement est créé ;
6. les pièces sont héritées ;
7. les tâches du module Paiement sont créées.

---

# 58. Transformation automatique en Paiement

La règle fondamentale est :

> **Ordonnancement signé → Paiement généré automatiquement**

Il ne doit pas exister de bouton intermédiaire du type :

- « Créer Paiement » ;
- « Envoyer au Paiement » ;
- « Générer dossier de règlement ».

---

# 59. Transactionnalité

La transformation doit être atomique.

Soit :

- l’Ordonnancement est signé ;
- l’OP est généré ;
- le Paiement est créé ;
- la tâche Agence Comptable est créée ;

soit l’opération est annulée techniquement.

Il ne doit pas exister de situation intermédiaire incohérente.

---

# 60. Idempotence

Si une opération est relancée à la suite d’un incident technique :

- aucun second Paiement ne doit être créé ;
- aucun second OP ne doit être généré inutilement ;
- la transition doit pouvoir reprendre correctement.

---

# 61. Données transmises au Paiement

Le Paiement doit hériter notamment :

- numéro OP ;
- Ordonnancement ;
- Liquidation ;
- Engagement ;
- EB ;
- bénéficiaire ;
- créancier ;
- montant ;
- devise ;
- taxes ;
- retenues ;
- imputations ;
- coordonnées bancaires ;
- pièces justificatives ;
- signature de l’Ordonnateur ;
- historique utile.

---

# 62. Rôle de l’Agence Comptable

Une fois le Paiement généré, le traitement quitte la phase administrative de l’Ordonnateur et passe à l’Agence Comptable.

L’Agence Comptable assure notamment :

- le contrôle comptable ;
- le contrôle du créancier ;
- le contrôle des pièces ;
- la préparation du règlement ;
- l’exécution du paiement ;
- l’enregistrement de la preuve de paiement.

---

# 63. Visibilité du dossier

L’Ordonnateur doit pouvoir suivre ultérieurement :

- Paiement en préparation ;
- paiement validé ;
- paiement exécuté ;
- date de règlement ;
- moyen de paiement ;
- référence bancaire ;
- statut final.

Cette visibilité doit être en lecture seule.

---

# 64. Recherche globale

Un Ordonnancement doit pouvoir être retrouvé par :

- numéro ORD ;
- numéro OP ;
- numéro LIQ ;
- numéro ENG ;
- numéro EB ;
- bénéficiaire ;
- objet ;
- montant ;
- facture ;
- contrat ;
- service ;
- Ordonnateur.

---

# 65. Architecture fonctionnelle

Le module peut être organisé comme suit :

**ORD-01 — Tableau de bord**  
Indicateurs et suivi.

**ORD-02 — Liste des Ordonnancements**  
Recherche et filtres.

**ORD-03 — Dossier Ordonnancement**  
Consultation complète.

**ORD-04 — Contrôle de complétude**  
Vérification des données et pièces.

**ORD-05 — Détermination de l’Ordonnateur**  
Seuils et délégations.

**ORD-06 — Préparation OP**  
Génération du projet d’Ordre de Paiement.

**ORD-07 — Signature**  
Validation et signature de l’Ordonnateur.

**ORD-08 — GED**  
Pièces justificatives.

**ORD-09 — Workflow**  
Transitions, retours et validations.

**ORD-10 — Documents**  
PDF officiels.

**ORD-11 — Historique et Audit**  
Piste d’audit.

**ORD-12 — Reporting**  
Statistiques et indicateurs.

**ORD-13 — Paramétrage**  
Seuils, Ordonnateurs, délégations, numérotation et workflow.

---

# 66. Règles de gestion essentielles

**RG-ORD-001**  
Un Ordonnancement doit provenir d’une Liquidation définitivement validée.

**RG-ORD-002**  
L’Ordonnancement est généré automatiquement.

**RG-ORD-003**  
Une même Liquidation ne doit pas produire plusieurs Ordonnancements principaux non autorisés.

**RG-ORD-004**  
Les données structurelles sont héritées de la Liquidation.

**RG-ORD-005**  
Le montant ordonnancé ne peut dépasser le montant liquidé.

**RG-ORD-006**  
Le bénéficiaire doit correspondre à celui validé dans la Liquidation.

**RG-ORD-007**  
Les imputations ne doivent pas être modifiées arbitrairement.

**RG-ORD-008**  
L’Ordonnateur est déterminé automatiquement selon les règles actives.

**RG-ORD-009**  
Pour un montant ≤ 5 000 000 XAF, le système route le dossier vers l’Ordonnateur délégué conformément au paramétrage.

**RG-ORD-010**  
Pour un montant > 5 000 000 XAF, le système route le dossier vers l’Ordonnateur principal conformément au paramétrage.

**RG-ORD-011**  
Les seuils doivent être paramétrables.

**RG-ORD-012**  
Toute délégation doit être valide à la date de signature.

**RG-ORD-013**  
Aucune signature ne peut être effectuée par un utilisateur non habilité.

**RG-ORD-014**  
Toute signature doit être horodatée.

**RG-ORD-015**  
Tout retour doit être motivé.

**RG-ORD-016**  
Tout rejet doit être motivé et historisé.

**RG-ORD-017**  
Une modification importante peut provoquer un retour à la Liquidation.

**RG-ORD-018**  
Un Ordonnancement signé doit être verrouillé.

**RG-ORD-019**  
L’Ordre de Paiement signé doit être figé.

**RG-ORD-020**  
La signature finale doit déclencher automatiquement la création du Paiement.

**RG-ORD-021**  
La transmission à l’Agence Comptable doit être automatique.

**RG-ORD-022**  
La transformation ORD → PAY doit être transactionnelle.

**RG-ORD-023**  
La transformation doit être idempotente.

**RG-ORD-024**  
Toutes les actions sensibles doivent être journalisées.

**RG-ORD-025**  
La séparation des fonctions doit être respectée.

**RG-ORD-026**  
Le Paiement hérite automatiquement des données de l’Ordonnancement.

**RG-ORD-027**  
Les documents officiels doivent être versionnés.

**RG-ORD-028**  
L’annulation d’un Ordonnancement signé doit suivre une procédure formalisée.

**RG-ORD-029**  
Le dossier doit conserver la traçabilité complète EB → ENG → LIQ → ORD.

**RG-ORD-030**  
Aucune suppression physique d’un Ordonnancement validé ne doit être autorisée.

---

# 67. Cycle fonctionnel cible

Le processus cible peut être résumé ainsi :

**LIQUIDATION VALIDÉE**  
↓  
**Génération automatique de l’Ordonnancement**  
↓  
**Contrôle automatique de complétude**  
↓  
**Détermination automatique de l’Ordonnateur**  
↓  
**Préparation de l’Ordre de Paiement**  
↓  
**Transmission à l’Ordonnateur**  
↓  
**Contrôle / décision**  
↓  
**Signature**  
↓  
**Génération du PDF officiel**  
↓  
**Verrouillage de l’Ordonnancement**  
↓  
**Transmission automatique à l’Agence Comptable**  
↓  
**Création automatique du Paiement**

---

# 68. Enchaînement complet de la chaîne

Le module doit préserver la continuité suivante :

**Expression de Besoin approuvée**  
↓  
**Engagement généré**  
↓  
**Engagement visé**  
↓  
**Liquidation générée**  
↓  
**Service fait certifié**  
↓  
**Liquidation validée**  
↓  
**Ordonnancement généré**  
↓  
**Ordre de Paiement signé**  
↓  
**Paiement généré**  
↓  
**Règlement par l’Agence Comptable**

---

# 69. Principes UX/UI

Le module doit proposer une interface claire, professionnelle et orientée traitement.

Les principales règles UX doivent être :

- données héritées affichées en lecture seule ;
- actions critiques clairement distinguées ;
- progression de la chaîne visible en permanence ;
- statut actuel immédiatement identifiable ;
- acteur attendu clairement affiché ;
- résumé financier toujours visible ;
- contrôles automatiques avant signature ;
- alertes contextuelles ;
- navigation fluide entre les étapes du dossier.

---

# 70. Résultat attendu

Le module ORDONNANCEMENT de BUDGET-CEEAC doit garantir qu’aucune dépense ne soit transmise à l’Agence Comptable sans :

- Liquidation régulière ;
- dette certaine ;
- montant définitivement arrêté ;
- pièces justificatives suffisantes ;
- créancier identifié ;
- imputations cohérentes ;
- Ordonnateur compétent ;
- validation et signature formelles.

L’Ordonnancement constitue ainsi **l’acte administratif final autorisant le paiement**.

Il marque la fin de la phase administrative de la dépense et ouvre la phase comptable.

La conception cible repose sur quatre principes essentiels :

### Héritage

Les données sont reprises automatiquement des étapes précédentes.

### Automatisation

La Liquidation validée génère automatiquement l’Ordonnancement, et l’Ordonnancement signé génère automatiquement le Paiement.

### Sécurisation

Le système détermine automatiquement l’autorité compétente, contrôle les seuils et protège la signature.

### Traçabilité

Toute validation, signature, modification, transmission, génération documentaire et transition est journalisée.

Le module ORDONNANCEMENT assure donc la continuité complète de la chaîne :

> **EB → ENGAGEMENT → LIQUIDATION → ORDONNANCEMENT → PAIEMENT**

et garantit que seul un dossier complet, régulier, autorisé et signé puisse être transmis à l’**Agence Comptable** pour exécution du paiement.