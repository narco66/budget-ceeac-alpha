# DESCRIPTION DÉTAILLÉE DU MODULE LIQUIDATION  
## Application BUDGET-CEEAC

---

# 1. Présentation générale

Le module **LIQUIDATION** constitue la troisième étape majeure de la chaîne d’exécution de la dépense dans **BUDGET-CEEAC**.

Il intervient après :

1. l’**Expression de Besoin** ;
2. l’**Engagement** ;
3. et le **visa définitif de l’Engagement par le Contrôleur Financier**.

La Liquidation a pour finalité de constater et d’arrêter le **montant exact de la dette de la Commission de la CEEAC envers un créancier**, après vérification de la réalité de la prestation, de la livraison, du service fait ou de l’événement générateur de la dépense.

Elle constitue donc l’étape au cours de laquelle la Commission vérifie que :

- la dépense a été régulièrement engagée ;
- les biens ont effectivement été livrés ;
- les prestations ont effectivement été exécutées ;
- les travaux ont effectivement été réalisés ;
- les quantités correspondent aux éléments contractuels ;
- les prix appliqués sont conformes ;
- les pièces justificatives sont disponibles ;
- la créance est certaine ;
- la créance est liquide ;
- la créance est exigible ;
- le montant à payer est correctement déterminé ;
- les retenues, taxes et pénalités éventuelles sont correctement calculées ;
- les imputations budgétaires restent cohérentes ;
- le montant liquidé n’excède pas le montant régulièrement engagé.

Le module LIQUIDATION doit ainsi sécuriser la reconnaissance de la dette avant son passage à l’**Ordonnancement**.

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

La Liquidation ne doit pas être traitée comme une opération isolée.

Elle appartient au **dossier numérique unique de dépense** qui conserve toutes les informations, pièces, validations, imputations et traces depuis l’Expression de Besoin jusqu’au Paiement.

---

# 3. Principe fondamental

Dans BUDGET-CEEAC, une Liquidation n’est normalement pas créée manuellement à partir de zéro.

Elle doit être **générée automatiquement à partir d’un Engagement définitivement visé**.

Le principe cible est :

> **Visa définitif de l’Engagement → création automatique de la Liquidation.**

Il ne doit donc pas être nécessaire de cliquer sur un bouton du type :

**« Créer la Liquidation »**

après le visa final de l’Engagement.

La transition doit être automatique, sécurisée, traçable et transactionnelle.

---

# 4. Finalité fonctionnelle

Le module LIQUIDATION doit permettre de répondre à quatre questions fondamentales :

### 4.1 La dépense a-t-elle réellement été exécutée ?

Le système doit permettre de constater :

- le service fait ;
- la livraison ;
- l’exécution de la prestation ;
- la réalisation des travaux ;
- ou tout autre fait générateur permettant de constater la dette.

### 4.2 Le créancier a-t-il effectivement droit au paiement ?

Le système vérifie :

- son identité ;
- la relation contractuelle ;
- les pièces justificatives ;
- les références de la facture ;
- l’existence de la prestation ;
- la conformité avec l’Engagement.

### 4.3 Quel est le montant exact dû ?

La Liquidation arrête le montant réel à payer après prise en compte :

- du montant brut ;
- des quantités réellement exécutées ;
- des prix unitaires ;
- des taxes ;
- des retenues ;
- des avances ;
- des pénalités ;
- des acomptes ;
- des rabais éventuels ;
- des déductions.

### 4.4 Le dossier peut-il être ordonnancé ?

Après les contrôles et le visa final prévu par le workflow :

> **la Liquidation doit être automatiquement transformée en Ordonnancement.**

---

# 5. Objectifs du module

Le module doit permettre de :

1. générer automatiquement une Liquidation après validation définitive de l’Engagement ;
2. récupérer les données de l’Engagement ;
3. récupérer l’Expression de Besoin d’origine ;
4. conserver les imputations budgétaires ;
5. enregistrer la constatation du service fait ;
6. identifier le responsable ayant certifié le service fait ;
7. enregistrer les factures et pièces justificatives ;
8. déterminer le montant brut de la créance ;
9. calculer les retenues et déductions ;
10. déterminer le montant net à liquider ;
11. gérer les liquidations partielles ;
12. gérer les reliquats d’Engagement ;
13. contrôler que la liquidation ne dépasse pas l’Engagement ;
14. contrôler la conformité contractuelle ;
15. assurer la validation du service initiateur ;
16. assurer le contrôle financier ;
17. produire les documents officiels ;
18. assurer une piste d’audit complète ;
19. transmettre automatiquement le dossier à l’Ordonnancement.

---

# 6. Génération automatique de la Liquidation

Lorsqu’un Engagement reçoit son visa final :

1. le visa est enregistré ;
2. l’Engagement est verrouillé ;
3. les crédits engagés sont confirmés ;
4. les documents d’Engagement sont générés ;
5. le statut de l’Engagement devient **VISÉ** ;
6. le système crée automatiquement une Liquidation ;
7. le système lui attribue une référence unique ;
8. les informations de l’Engagement sont héritées ;
9. les pièces justificatives sont mises à disposition ;
10. une tâche est créée pour l’acteur compétent ;
11. une notification est envoyée.

La création doit être **idempotente** : un même visa ne doit jamais produire plusieurs Liquidations de manière accidentelle.

---

# 7. Dossier unique de dépense

La Liquidation doit rester rattachée au même dossier de dépense.

Le système doit permettre de naviguer facilement entre :

- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement.

Chaque dossier doit disposer d’un identifiant technique unique permettant de reconstituer toute la chaîne.

Exemple :

**Dossier DEP-2026-000458**

avec :

- EB-2026-000458 ;
- ENG-2026-000458 ;
- LIQ-2026-000458 ;
- ORD-2026-000458 ;
- PAY-2026-000458.

La logique exacte de numérotation peut être paramétrable.

---

# 8. Données héritées de l’Engagement

La Liquidation doit récupérer automatiquement au minimum :

- numéro de l’Engagement ;
- numéro de l’Expression de Besoin ;
- exercice budgétaire ;
- objet de la dépense ;
- description ;
- service initiateur ;
- direction ;
- département ;
- bénéficiaire ;
- fournisseur ;
- prestataire ;
- créancier ;
- contrat éventuel ;
- marché éventuel ;
- bon de commande ;
- convention ;
- montant engagé ;
- devise ;
- ligne ou lignes budgétaires ;
- ventilation des imputations ;
- informations PAP ;
- source de financement ;
- références du visa ;
- pièces justificatives ;
- observations ;
- historique du dossier.

Ces données doivent être reprises automatiquement afin d’éviter la ressaisie.

---

# 9. Protection des données héritées

Les informations provenant de l’Engagement validé ne doivent normalement pas être modifiables depuis la Liquidation.

Doivent notamment être protégés :

- référence de l’Engagement ;
- bénéficiaire engagé ;
- objet ;
- lignes budgétaires ;
- montant engagé ;
- données PAP ;
- contrat de référence.

Toute modification structurelle nécessitant de changer l’Engagement doit suivre une procédure formelle de :

- retour ;
- annulation ;
- dégagement ;
- réengagement ;
- ou avenant,

selon le cas.

---

# 10. Notion de service fait

La Liquidation repose notamment sur la constatation du **service fait**.

Le service fait atteste que :

- la prestation a été exécutée ;
- le bien a été livré ;
- les travaux ont été réalisés ;
- les obligations contractuelles correspondantes ont été respectées.

La certification doit être effectuée par un acteur habilité de l’unité bénéficiaire ou du service compétent.

---

# 11. Types de constatation

Selon la nature de la dépense, le système doit pouvoir gérer différentes formes de constatation :

- livraison de fournitures ;
- prestation de services ;
- réalisation de travaux ;
- mission ;
- formation ;
- prestation intellectuelle ;
- maintenance ;
- abonnement ;
- loyer ;
- transfert ;
- subvention ;
- rémunération ;
- remboursement ;
- prestation périodique ;
- autre catégorie paramétrable.

---

# 12. Certification du service fait

Le module doit comporter une fonctionnalité explicite :

**CERTIFIER LE SERVICE FAIT**

La certification doit enregistrer :

- auteur ;
- fonction ;
- service ;
- date ;
- heure ;
- nature du service ;
- période d’exécution ;
- commentaire ;
- pièces justificatives ;
- éventuelles réserves.

La certification constitue une action sensible et doit être journalisée.

---

# 13. Service fait avec réserves

La certification ne doit pas nécessairement être binaire.

Le système peut prévoir :

- service fait conforme ;
- service fait partiel ;
- service fait avec réserves ;
- service non conforme ;
- service non fait.

Lorsque des réserves existent, le système doit permettre de préciser :

- nature de la réserve ;
- montant concerné ;
- quantité concernée ;
- délai de régularisation ;
- document justificatif ;
- décision retenue.

---

# 14. Liquidation totale

Une Liquidation est totale lorsque le montant liquidé correspond exactement au montant de l’Engagement restant à liquider.

Exemple :

**Montant engagé : 10 000 000 XAF**  
**Montant liquidé : 10 000 000 XAF**  
**Reliquat : 0 XAF**

Dans ce cas, l’Engagement peut être considéré comme totalement liquidé.

---

# 15. Liquidation partielle

Le module doit également permettre les Liquidations partielles lorsqu’elles sont autorisées.

Exemple :

**Montant engagé : 20 000 000 XAF**

Première Liquidation :

**8 000 000 XAF**

Deuxième Liquidation :

**7 000 000 XAF**

Reliquat :

**5 000 000 XAF**

Le système doit afficher en permanence :

- montant initial engagé ;
- montant déjà liquidé ;
- nouvelle Liquidation ;
- total liquidé ;
- solde restant à liquider.

---

# 16. Règle de contrôle du plafond

La règle fondamentale est :

> **Total des Liquidations ≤ montant engagé autorisé**

Le système doit empêcher :

**Total liquidé > montant engagé**

sauf si un nouvel Engagement complémentaire ou un avenant régulièrement autorisé a été enregistré.

---

# 17. Reliquat d’Engagement

Lorsque :

**Montant liquidé < montant engagé**

le système doit identifier automatiquement le reliquat.

Exemple :

Montant engagé : **15 000 000 XAF**  
Montant liquidé : **13 800 000 XAF**

Reliquat :

**1 200 000 XAF**

Le reliquat peut être :

- maintenu pour une Liquidation ultérieure ;
- dégagé ;
- annulé ;
- traité conformément aux règles budgétaires applicables.

---

# 18. Facturation

Le module doit permettre l’enregistrement d’une ou plusieurs factures.

Pour chaque facture :

- numéro ;
- date ;
- fournisseur ;
- référence ;
- montant HT ;
- TVA éventuelle ;
- autres taxes ;
- montant TTC ;
- devise ;
- échéance ;
- objet ;
- période ;
- fichier électronique.

Le système doit vérifier l’unicité de la facture selon des règles paramétrables.

---

# 19. Prévention des doubles paiements

Le système doit détecter les risques de doublons.

Par exemple :

- même fournisseur ;
- même numéro de facture ;
- même montant ;
- même date ;
- même contrat.

Une facture déjà liquidée ou payée ne doit pas pouvoir être utilisée une seconde fois sans justification et autorisation spécifique.

---

# 20. Calcul du montant liquidé

Le système doit distinguer :

### Montant brut

Valeur totale constatée avant déductions.

### Retenues

Par exemple :

- retenue de garantie ;
- retenue contractuelle ;
- retenue fiscale ;
- pénalité ;
- avance à récupérer ;
- autre retenue.

### Montant net

Formule indicative :

**Net à payer = Montant brut – retenues – déductions + ajustements autorisés**

Les règles précises doivent être paramétrables.

---

# 21. Taxes

Le module doit pouvoir gérer différents éléments fiscaux selon les règles applicables :

- TVA ;
- retenue à la source ;
- taxes spécifiques ;
- exonération ;
- franchise ;
- autres prélèvements.

Les taux ne doivent pas être codés en dur.

Ils doivent provenir de référentiels paramétrables.

---

# 22. Gestion des pénalités

Lorsque le contrat prévoit des pénalités, le module peut permettre de saisir :

- type de pénalité ;
- motif ;
- nombre de jours ;
- taux ;
- base de calcul ;
- montant ;
- décision ;
- pièce justificative.

Le calcul peut être automatique lorsque les paramètres sont disponibles.

---

# 23. Avances et acomptes

La Liquidation doit pouvoir prendre en compte :

- avance de démarrage ;
- avance contractuelle ;
- acomptes déjà versés ;
- récupération d’avance ;
- décompte précédent.

Le système doit éviter tout double règlement.

---

# 24. Décomptes de travaux

Pour les marchés de travaux, le système peut gérer :

- décompte provisoire ;
- décompte mensuel ;
- situation de travaux ;
- décompte final ;
- retenue de garantie ;
- pénalités ;
- avance récupérée ;
- montant net.

La fonctionnalité doit être activable selon le type de dépense.

---

# 25. Imputation budgétaire

La Liquidation conserve l’imputation issue de l’Engagement.

Elle ne doit normalement pas permettre de sélectionner arbitrairement de nouvelles lignes budgétaires.

Pour chaque ligne, le système doit afficher :

- ligne budgétaire ;
- montant engagé ;
- montant déjà liquidé ;
- montant de la présente Liquidation ;
- reliquat.

---

# 26. PAP et Liquidation

Lorsqu’une dépense relève du PAP, les données programmatiques doivent rester visibles.

Le système récupère notamment :

- Pilier ;
- Axe ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateur ;
- source de financement ;
- unité responsable.

Ces données sont héritées de la ligne budgétaire.

Le PAP ne doit pas être ressaisi séparément.

---

# 27. Pièces justificatives

Le dossier de Liquidation doit regrouper :

### Pièces héritées

- Expression de Besoin ;
- Engagement ;
- contrat ;
- marché ;
- convention ;
- bon de commande ;
- devis ;
- visa du Contrôleur Financier.

### Pièces de Liquidation

Selon le cas :

- facture ;
- bon de livraison ;
- procès-verbal de réception ;
- attestation de service fait ;
- certificat de conformité ;
- rapport de mission ;
- rapport d’activité ;
- feuille de présence ;
- décompte ;
- situation de travaux ;
- bordereau ;
- fiche de réception ;
- procès-verbal technique ;
- autre justificatif.

---

# 28. GED intégrée

Toutes les pièces doivent être conservées dans la GED de BUDGET-CEEAC.

Chaque document doit comporter au minimum :

- catégorie ;
- nom ;
- version ;
- auteur ;
- date ;
- étape ;
- statut ;
- niveau de confidentialité.

Le système doit conserver les anciennes versions lorsqu’un document est remplacé.

---

# 29. Contrôle de complétude

Avant soumission, le système doit vérifier automatiquement les pièces obligatoires.

Les règles peuvent dépendre :

- du type de dépense ;
- du montant ;
- du type de fournisseur ;
- du contrat ;
- du mode d’acquisition ;
- de la nature PAP/Hors PAP.

Une Liquidation incomplète ne doit pas pouvoir être validée.

---

# 30. Workflow cible

Le workflow de principe est :

### Étape 1 — Génération automatique

Création après visa définitif de l’Engagement.

### Étape 2 — Service initiateur

Le service bénéficiaire :

- constate la prestation ;
- renseigne les éléments de Liquidation ;
- joint les justificatifs ;
- certifie le service fait.

### Étape 3 — Transmission au Contrôleur Financier

Le dossier est automatiquement transmis au contrôle compétent.

### Étape 4 — Contrôle

Le Contrôleur Financier vérifie :

- réalité de la dépense ;
- régularité ;
- service fait ;
- factures ;
- calculs ;
- imputations ;
- pièces justificatives.

### Étape 5 — Décision

Il peut :

- viser/valider ;
- retourner ;
- demander un complément ;
- ajourner ;
- rejeter.

### Étape 6 — Ordonnancement automatique

Après validation finale :

> **création automatique de l’Ordonnancement.**

Le workflow doit rester paramétrable.

---

# 31. Acteurs

Les principaux acteurs peuvent être :

- Expert du service initiateur ;
- Chef de Service ;
- Directeur ;
- responsable technique ;
- responsable réceptionnaire ;
- certificateur du service fait ;
- Contrôleur Financier ;
- acteurs de contrôle ;
- administrateur fonctionnel.

Les habilitations doivent être fondées sur les rôles et responsabilités.

---

# 32. Contrôle du service initiateur

Le service initiateur doit notamment vérifier :

- conformité du bien ou service reçu ;
- quantité ;
- qualité ;
- délai ;
- respect du contrat ;
- documents de réception ;
- montant facturé ;
- conformité de la facture.

Il engage sa responsabilité lors de la certification.

---

# 33. Contrôle Financier

Le Contrôleur Financier doit disposer d’un écran regroupant :

- EB ;
- Engagement ;
- visa de l’Engagement ;
- Liquidation ;
- facture ;
- service fait ;
- imputations ;
- situation budgétaire ;
- contrat ;
- pièces justificatives ;
- historique.

---

# 34. Décisions du Contrôleur Financier

Les principales décisions doivent être :

- **Viser / Valider** ;
- **Retourner pour correction** ;
- **Demander un complément** ;
- **Ajourner** ;
- **Rejeter**.

Toute décision autre que la validation doit comporter un motif.

---

# 35. Retour pour correction

Lors d’un retour :

- le dossier ne disparaît pas ;
- le motif est enregistré ;
- l’acteur concerné est notifié ;
- seuls les champs autorisés sont réouverts ;
- une nouvelle version est créée si nécessaire ;
- l’historique reste intégralement conservé.

---

# 36. Rejet

Le rejet doit obligatoirement comporter :

- motif ;
- auteur ;
- date ;
- commentaire ;
- références éventuelles.

Un dossier rejeté ne doit pas être supprimé.

Il reste dans la piste d’audit.

---

# 37. Statuts

Le module peut gérer notamment :

- Générée ;
- En préparation ;
- À compléter ;
- Service fait à certifier ;
- Service fait certifié ;
- Soumise ;
- En contrôle ;
- Retournée ;
- Corrigée ;
- En attente de pièce ;
- Ajournée ;
- Visée ;
- Validée ;
- Rejetée ;
- Annulée ;
- Partiellement liquidée ;
- Totalement liquidée ;
- Transformée en Ordonnancement ;
- Clôturée.

---

# 38. Écran de liste

La liste des Liquidations doit afficher notamment :

- N° Liquidation ;
- N° Engagement ;
- N° EB ;
- date ;
- objet ;
- fournisseur ;
- service ;
- montant engagé ;
- montant liquidé ;
- reliquat ;
- statut ;
- acteur actuel ;
- délai ;
- dernière action.

---

# 39. Filtres

Les utilisateurs doivent pouvoir filtrer par :

- exercice ;
- numéro ;
- Engagement ;
- EB ;
- statut ;
- période ;
- département ;
- direction ;
- service ;
- fournisseur ;
- créancier ;
- nature de dépense ;
- PAP/Hors PAP ;
- ligne budgétaire ;
- source de financement ;
- montant ;
- acteur ;
- retard.

---

# 40. Page détail

La page détail doit comprendre :

## Bandeau principal

- numéro LIQ ;
- statut ;
- objet ;
- montant engagé ;
- montant liquidé ;
- reliquat.

## Progression

**EB ✓ → ENG ✓ → LIQ ● → ORD ○ → PAY ○**

## Situation du workflow

- dernière action ;
- acteur ;
- date ;
- étape actuelle ;
- acteur attendu ;
- délai.

## Onglets

- Synthèse ;
- Engagement ;
- Service fait ;
- Factures ;
- Calcul de Liquidation ;
- Imputations ;
- PAP ;
- Pièces ;
- Workflow ;
- Observations ;
- Historique ;
- Documents générés ;
- Journal d’audit.

---

# 41. Formulaire de Liquidation

Le formulaire doit être organisé en étapes.

### Étape 1 — Référence

Affichage des données héritées.

### Étape 2 — Service fait

- type ;
- date ;
- description ;
- quantité ;
- période ;
- certificateur.

### Étape 3 — Facturation

- facture ;
- dates ;
- montants ;
- fournisseur.

### Étape 4 — Calcul

- brut ;
- taxes ;
- retenues ;
- pénalités ;
- avances ;
- net.

### Étape 5 — Pièces

Contrôle de complétude.

### Étape 6 — Vérification

Résumé avant certification.

---

# 42. Expérience utilisateur

L’interface doit éviter les formulaires longs et difficiles à contrôler.

Il est recommandé d’utiliser :

- sections progressives ;
- blocs synthétiques ;
- données héritées en lecture seule ;
- calculs automatiques ;
- alertes contextualisées ;
- résumés financiers ;
- indicateurs de complétude ;
- bandeaux de statut ;
- timeline du workflow.

---

# 43. Tableau récapitulatif financier

Un bloc permanent peut afficher :

| Élément | Montant |
|---|---:|
| Engagement initial | 20 000 000 XAF |
| Déjà liquidé | 8 000 000 XAF |
| Liquidation actuelle | 7 000 000 XAF |
| Total liquidé après opération | 15 000 000 XAF |
| Reliquat | 5 000 000 XAF |

Ce bloc doit se recalculer automatiquement.

---

# 44. Contrôles automatiques

Avant validation, le système doit vérifier :

### Contrôles d’origine

- Engagement existant ;
- Engagement visé ;
- Engagement actif.

### Contrôles financiers

- montant positif ;
- calcul cohérent ;
- plafond respecté ;
- taxes cohérentes ;
- retenues valides.

### Contrôles documentaires

- facture présente ;
- service fait certifié ;
- pièces obligatoires présentes.

### Contrôles de tiers

- bénéficiaire identique à l’Engagement ;
- fournisseur actif ;
- références cohérentes.

### Contrôles budgétaires

- imputations existantes ;
- cohérence du montant liquidé ;
- absence de dépassement.

---

# 45. Alertes

Le système doit générer des alertes notamment en cas de :

- facture déjà utilisée ;
- montant supérieur à l’Engagement ;
- facture différente du fournisseur engagé ;
- absence de service fait ;
- contrat expiré ;
- pièce manquante ;
- facture incohérente ;
- dépassement de délai ;
- retenue incorrecte ;
- doublon potentiel.

---

# 46. Mes tâches

La rubrique **Mes tâches** doit afficher les Liquidations nécessitant une intervention de l’utilisateur.

Le tri par défaut est :

> **plus récent au plus ancien.**

Colonnes :

- numéro ;
- objet ;
- montant ;
- service ;
- fournisseur ;
- statut ;
- date de réception ;
- délai ;
- priorité ;
- action attendue.

---

# 47. Tableau de bord

Le tableau de bord LIQUIDATION doit présenter :

- Liquidations générées ;
- en préparation ;
- service fait à certifier ;
- en contrôle ;
- retournées ;
- validées ;
- rejetées ;
- en retard ;
- montant total liquidé ;
- reliquats ;
- taux de Liquidation des Engagements.

---

# 48. Indicateurs de gestion

Le module doit permettre de calculer :

- taux de Liquidation ;
- montant engagé ;
- montant liquidé ;
- reliquat ;
- délai moyen Engagement → Liquidation ;
- délai moyen de certification ;
- délai moyen de contrôle ;
- taux de retour ;
- taux de rejet ;
- Liquidations par département ;
- Liquidations par fournisseur ;
- Liquidations par ligne budgétaire ;
- Liquidations PAP ;
- Liquidations Hors PAP.

---

# 49. Documents générés

Le système doit pouvoir produire :

### Fiche de Liquidation

Contenant notamment :

- référence ;
- EB ;
- Engagement ;
- bénéficiaire ;
- objet ;
- service fait ;
- facture ;
- montant brut ;
- retenues ;
- montant net ;
- imputations ;
- validations.

### Certificat de service fait

Lorsque requis.

### Bordereau de Liquidation

Pour transmission.

### État de contrôle

Pour les acteurs habilités.

### Historique

Piste de validation.

Tous les documents officiels doivent être figés après validation.

---

# 50. Numérotation

Chaque Liquidation doit avoir un numéro unique.

Exemple :

**LIQ/CEEAC/2026/000325**

La structure doit être paramétrable.

---

# 51. Signature et validation électronique

Les validations sensibles peuvent comporter :

- signature électronique ;
- horodatage ;
- identité du signataire ;
- empreinte documentaire ;
- QR Code ;
- référence de vérification.

---

# 52. Historisation

Toute modification doit enregistrer :

- ancienne valeur ;
- nouvelle valeur ;
- auteur ;
- date ;
- rôle ;
- étape ;
- motif ;
- version.

Aucune modification sensible ne doit écraser silencieusement l’historique.

---

# 53. Journal d’audit

Doivent être journalisés :

- création ;
- consultation sensible ;
- modification ;
- ajout de facture ;
- ajout/suppression de pièce ;
- certification ;
- validation ;
- retour ;
- rejet ;
- génération PDF ;
- transformation en Ordonnancement.

---

# 54. Notifications

Des notifications doivent être émises pour :

- nouvelle Liquidation ;
- service fait à certifier ;
- dossier retourné ;
- pièce manquante ;
- transmission au CF ;
- validation ;
- rejet ;
- retard ;
- création de l’Ordonnancement.

---

# 55. Gestion des délais

Chaque étape peut disposer d’un délai cible.

Le système doit afficher :

- date de réception ;
- délai ;
- échéance ;
- durée écoulée ;
- retard.

Des alertes visuelles doivent identifier les dossiers critiques.

---

# 56. Séparation des fonctions

Le système doit respecter la séparation des responsabilités.

Lorsque la matrice d’habilitation l’interdit, un utilisateur ne doit pas pouvoir :

- certifier son propre contrôle ;
- valider sa propre opération ;
- effectuer successivement des fonctions incompatibles.

Ces règles doivent être configurables.

---

# 57. Cas particuliers

Le module doit prévoir les cas suivants :

- Liquidation totale ;
- Liquidation partielle ;
- plusieurs factures ;
- plusieurs décomptes ;
- prestation avec réserves ;
- réception partielle ;
- pénalités ;
- retenue de garantie ;
- récupération d’avance ;
- avoir ;
- annulation de facture ;
- correction après retour ;
- facture en devise ;
- dépense pluriannuelle.

---

# 58. Factures en devise

Pour une dépense libellée dans une autre monnaie, le module doit pouvoir conserver :

- devise d’origine ;
- montant devise ;
- taux de change ;
- date du taux ;
- source du taux ;
- équivalent XAF.

Le taux utilisé doit être traçable.

---

# 59. Modification après certification

Toute modification significative après certification du service fait doit :

1. être détectée ;
2. être journalisée ;
3. invalider la certification antérieure lorsque nécessaire ;
4. provoquer une nouvelle certification.

Il ne doit pas être possible de modifier discrètement un montant après validation.

---

# 60. Transformation automatique en Ordonnancement

Après validation finale de la Liquidation, le système exécute automatiquement :

1. verrouillage de la Liquidation ;
2. enregistrement de la validation ;
3. génération des documents officiels ;
4. calcul définitif du montant à ordonnancer ;
5. confirmation des imputations ;
6. changement de statut ;
7. création de l’Ordonnancement ;
8. copie des données nécessaires ;
9. héritage des pièces ;
10. création de la tâche suivante ;
11. notification de l’acteur concerné.

---

# 61. Absence de soumission intermédiaire

Une fois la Liquidation définitivement validée, aucune étape manuelle supplémentaire ne doit exister du type :

- « Clôturer la Liquidation » ;
- « Créer Ordonnancement » ;
- « Transmettre à l’Ordonnancement ».

La transformation doit être automatique.

---

# 62. Données transmises à l’Ordonnancement

L’Ordonnancement récupère notamment :

- Liquidation ;
- Engagement ;
- EB ;
- créancier ;
- montant brut ;
- montant net ;
- taxes ;
- retenues ;
- imputations ;
- factures ;
- pièces justificatives ;
- service fait ;
- validations ;
- références du Contrôle Financier.

---

# 63. Détermination future de l’Ordonnateur

La Liquidation doit préparer les informations permettant au module Ordonnancement d’appliquer les seuils de compétence.

Dans le processus BUDGET-CEEAC actuellement retenu :

- **montant ≤ 5 000 000 XAF : Secrétaire Général, Ordonnateur délégué** ;
- **montant > 5 000 000 XAF : Président de la Commission, Ordonnateur principal**.

La détermination doit intervenir automatiquement au niveau de l’Ordonnancement selon les règles de paramétrage en vigueur.

---

# 64. Architecture fonctionnelle

Le module peut être structuré en sous-composants :

**LIQ-01 — Tableau de bord**  
Suivi et indicateurs.

**LIQ-02 — Liste des Liquidations**  
Recherche, filtres et accès.

**LIQ-03 — Dossier Liquidation**  
Vue complète.

**LIQ-04 — Service fait**  
Constatation et certification.

**LIQ-05 — Facturation**  
Factures et contrôles.

**LIQ-06 — Calcul financier**  
Montants, retenues et net.

**LIQ-07 — Imputations**  
Suivi budgétaire.

**LIQ-08 — Pièces justificatives**  
GED.

**LIQ-09 — Workflow**  
Traitement et validation.

**LIQ-10 — Contrôle Financier**  
Contrôle, retour, validation.

**LIQ-11 — Documents**  
Génération des états.

**LIQ-12 — Audit**  
Historique et journal.

**LIQ-13 — Reporting**  
Statistiques.

**LIQ-14 — Paramétrage**  
Règles, seuils, pièces et statuts.

---

# 65. Règles de gestion essentielles

**RG-LIQ-001**  
Une Liquidation ne peut provenir que d’un Engagement valide et visé.

**RG-LIQ-002**  
La Liquidation est générée automatiquement après le visa définitif de l’Engagement.

**RG-LIQ-003**  
Les informations structurelles de l’Engagement sont héritées automatiquement.

**RG-LIQ-004**  
Le service fait doit être constaté avant validation définitive.

**RG-LIQ-005**  
La certification du service fait doit être effectuée par un utilisateur habilité.

**RG-LIQ-006**  
Toute certification doit être horodatée et tracée.

**RG-LIQ-007**  
Une facture doit être rattachée à un fournisseur ou bénéficiaire valide.

**RG-LIQ-008**  
Le système doit détecter les factures potentiellement dupliquées.

**RG-LIQ-009**  
Le montant total liquidé ne peut excéder le montant engagé restant disponible.

**RG-LIQ-010**  
Les Liquidations partielles sont autorisées lorsque la nature de l’opération le permet.

**RG-LIQ-011**  
Le reliquat doit être calculé automatiquement.

**RG-LIQ-012**  
Les lignes budgétaires sont héritées de l’Engagement.

**RG-LIQ-013**  
Le PAP n’est pas saisi séparément.

**RG-LIQ-014**  
Les données PAP sont déterminées à partir des lignes budgétaires.

**RG-LIQ-015**  
Les taxes et retenues doivent être calculées ou vérifiées selon les référentiels.

**RG-LIQ-016**  
Les pièces obligatoires varient selon la nature de la dépense.

**RG-LIQ-017**  
Une Liquidation incomplète ne peut être validée.

**RG-LIQ-018**  
Tout retour doit être motivé.

**RG-LIQ-019**  
Tout rejet doit être motivé et historisé.

**RG-LIQ-020**  
Toute modification postérieure à une certification doit être tracée.

**RG-LIQ-021**  
Une modification significative peut invalider les validations antérieures.

**RG-LIQ-022**  
La Liquidation définitivement validée doit être verrouillée.

**RG-LIQ-023**  
Les documents officiels doivent être figés.

**RG-LIQ-024**  
La validation finale doit créer automatiquement l’Ordonnancement.

**RG-LIQ-025**  
La transformation Liquidation → Ordonnancement doit être atomique et idempotente.

**RG-LIQ-026**  
Toutes les opérations sensibles doivent être journalisées.

**RG-LIQ-027**  
Les droits d’accès doivent respecter la séparation des fonctions.

**RG-LIQ-028**  
Aucune facture déjà entièrement payée ne peut être liquidée une seconde fois.

**RG-LIQ-029**  
Le dossier doit conserver la traçabilité complète EB → Engagement → Liquidation.

**RG-LIQ-030**  
L’Ordonnancement doit hériter automatiquement des données validées de la Liquidation.

---

# 66. Cycle fonctionnel cible

Le cycle de référence peut être résumé ainsi :

**ENGAGEMENT VISÉ**  
↓  
**Génération automatique de la Liquidation**  
↓  
**Affectation au service initiateur**  
↓  
**Constatation de la prestation / livraison**  
↓  
**Enregistrement de la facture**  
↓  
**Certification du service fait**  
↓  
**Calcul du montant liquidable**  
↓  
**Contrôle des pièces**  
↓  
**Transmission au Contrôleur Financier**  
↓  
**Contrôle**  
↓  
**Visa / validation**  
↓  
**Verrouillage de la Liquidation**  
↓  
**Génération des documents officiels**  
↓  
**Création automatique de l’Ordonnancement**

---

# 67. Résultat attendu

Le module LIQUIDATION de BUDGET-CEEAC doit permettre de garantir que toute dépense passant à l’Ordonnancement correspond à une dette :

- réelle ;
- certaine ;
- justifiée ;
- régulièrement engagée ;
- correctement calculée ;
- documentée ;
- certifiée ;
- budgétairement imputée ;
- contrôlée ;
- traçable.

La Liquidation constitue ainsi le **point de vérité financière du dossier de dépense** : elle transforme le montant initialement engagé en **montant effectivement reconnu comme dû au créancier**.

Elle doit s’inscrire dans une chaîne entièrement intégrée, sans ressaisies inutiles et sans ruptures fonctionnelles :

> **Expression de Besoin → Engagement → Liquidation → Ordonnancement → Paiement**

Le module doit enfin garantir quatre principes essentiels de BUDGET-CEEAC :

**Héritage des données** : aucune ressaisie inutile des informations déjà validées.

**Automatisation des transitions** : aucune création manuelle de l’étape suivante après validation finale.

**Contrôle renforcé** : aucun montant ne peut être liquidé sans justification du service fait et conformité financière.

**Traçabilité intégrale** : toute décision, modification, validation, pièce et transition est historisée dans le dossier numérique unique.