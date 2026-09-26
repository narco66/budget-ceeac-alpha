# DESCRIPTION DÉTAILLÉE DU MODULE LIQUIDATION

## Application BUDGET-CEEAC

**Commission de la Communauté Économique des États de l’Afrique Centrale – CEEAC**

---

# 1. OBJET DU MODULE

Le module **LIQUIDATION** intervient après la validation définitive de l’Engagement.

Il a pour objet de constater et de vérifier :

- la réalité de la dette ;
- la bonne exécution de la prestation ;
- la conformité des biens livrés ou des services rendus ;
- la conformité des pièces justificatives ;
- le montant exact à payer au créancier ;
- la concordance entre l’Expression de Besoin, l’Engagement, la prestation exécutée et la facture ;
- la disponibilité et la régularité de l’imputation budgétaire ;
- la conformité administrative, financière et documentaire du dossier.

La Liquidation constitue donc l’étape au cours de laquelle la Commission détermine avec précision :

> **ce qu’elle doit effectivement au créancier après constatation du service fait.**

Elle précède obligatoirement l’Ordonnancement.

---

# 2. POSITIONNEMENT DANS LA CHAÎNE DE DÉPENSE

Le processus général est :

**Expression de Besoin**

↓

**Engagement**

↓

**LIQUIDATION**

↓

**Ordonnancement**

↓

**Paiement**

Le dossier de Liquidation doit être généré automatiquement à partir de l’Engagement validé.

L’utilisateur ne doit pas avoir à recréer manuellement un dossier déjà existant dans les étapes précédentes.

---

# 3. PRINCIPE DIRECTEUR

Le module repose sur le principe suivant :

> **La Liquidation vérifie la réalité, la conformité et le montant exact de la dette avant l’émission de l’ordre de paiement.**

Il ne suffit donc pas qu’une dépense ait été engagée.

Il faut également démontrer que :

- le bien a été livré ;
- le service a été exécuté ;
- la prestation est conforme ;
- la facture est correcte ;
- les pièces nécessaires sont disponibles ;
- le montant à payer est justifié.

---

# 4. DÉCLENCHEMENT AUTOMATIQUE

Après validation définitive de l’Engagement, BUDGET-CEEAC doit automatiquement :

1. créer le dossier de Liquidation ;
2. lui attribuer une référence ;
3. récupérer les informations de l’Engagement ;
4. récupérer les informations de l’Expression de Besoin ;
5. transférer les pièces déjà disponibles ;
6. transférer les imputations budgétaires ;
7. transférer les sous-lignes ;
8. transférer les informations du fournisseur ou bénéficiaire ;
9. positionner le dossier dans la file de traitement appropriée ;
10. notifier les acteurs concernés.

Aucun bouton manuel du type :

> « Créer une Liquidation »

ne doit être nécessaire dans le processus normal.

---

# 5. NUMÉROTATION

Chaque dossier reçoit une référence unique.

Exemples :

**LIQ/2026/000145**

ou :

**CEEAC/LIQ/2026/000145**

La référence doit être :

- unique ;
- séquentielle ;
- liée à l’exercice ;
- non réutilisable.

---

# 6. DONNÉES HÉRITÉES

Le dossier de Liquidation doit automatiquement hériter des informations précédentes.

## Depuis l’Expression de Besoin

- objet ;
- justification ;
- structure initiatrice ;
- activité ;
- PAP/Hors PAP ;
- tâches ;
- sous-lignes ;
- imputations ;
- pièces pertinentes.

## Depuis l’Engagement

- référence Engagement ;
- fournisseur ou bénéficiaire ;
- montant engagé ;
- lignes budgétaires ;
- mode de passation ;
- contrat ou bon de commande ;
- références juridiques ;
- visa du Contrôleur Financier ;
- dates ;
- engagements comptables ;
- pièces administratives.

Le principe doit être :

> **Une donnée déjà validée n’est jamais ressaisie inutilement.**

---

# 7. ACTEURS DU MODULE

Selon l’organisation et le workflow paramétré, les acteurs peuvent comprendre :

- structure initiatrice ;
- Expert ou agent ;
- Chef de Service ;
- Directeur ;
- responsable technique ;
- responsable de marché ;
- gestionnaire du contrat ;
- Contrôleur Financier ;
- service budgétaire ;
- service financier ;
- acteur habilité à certifier le service fait.

Le workflow doit être configurable.

---

# 8. PRINCIPE DU SERVICE FAIT

La Liquidation ne doit normalement être possible que si le **service fait** a été constaté.

Le système doit permettre de renseigner :

- date du service fait ;
- acteur ayant constaté le service fait ;
- fonction ;
- nature de la prestation ;
- quantité reçue ;
- quantité acceptée ;
- qualité ;
- conformité ;
- observations ;
- réserves éventuelles.

---

# 9. CERTIFICATION DU SERVICE FAIT

La structure bénéficiaire ou initiatrice doit pouvoir certifier :

> **« Je certifie que les biens, services ou prestations ont été effectivement reçus ou exécutés conformément aux conditions convenues. »**

La certification doit être horodatée.

Le système conserve :

- nom ;
- fonction ;
- structure ;
- date ;
- heure ;
- observation ;
- éventuelle signature électronique.

---

# 10. CAS D’UN SERVICE FAIT PARTIEL

Le système doit supporter les prestations partiellement exécutées.

Exemple :

Montant engagé :

**20 000 000 FCFA**

Prestations exécutées :

**12 000 000 FCFA**

Liquidation :

**12 000 000 FCFA**

Solde restant :

**8 000 000 FCFA**

Le module doit donc supporter :

- liquidation totale ;
- liquidation partielle ;
- liquidations successives.

---

# 11. LIQUIDATIONS SUCCESSIVES

Pour un même Engagement, plusieurs Liquidations peuvent être créées lorsque le contrat prévoit :

- acomptes ;
- tranches ;
- situations de travaux ;
- paiements progressifs ;
- prestations périodiques ;
- livraisons échelonnées.

Exemple :

Engagement : **30 000 000 FCFA**

- Liquidation 1 : 10 000 000
- Liquidation 2 : 8 000 000
- Liquidation 3 : 12 000 000

Total liquidé :

**30 000 000 FCFA**

Le système doit empêcher :

> Total liquidé > montant engagé.

---

# 12. TABLEAU DE SUIVI DU MONTANT

Le dossier doit présenter clairement :

- montant engagé ;
- montant déjà liquidé ;
- montant de la présente Liquidation ;
- solde restant à liquider.

Exemple :

| Élément | Montant |
|---|---:|
| Engagement | 25 000 000 |
| Liquidations antérieures | 10 000 000 |
| Liquidation actuelle | 8 000 000 |
| Solde à liquider | 7 000 000 |

---

# 13. DÉTAIL PAR SOUS-LIGNE

La Liquidation doit pouvoir reprendre les sous-lignes de l’EB et de l’Engagement.

Pour chacune :

- quantité commandée ;
- quantité livrée ;
- quantité acceptée ;
- prix unitaire ;
- montant engagé ;
- montant liquidé précédemment ;
- montant à liquider ;
- solde.

---

# 14. CONTRÔLE PAR TÂCHE OU RUBRIQUE

Exemple :

### Engagement

Développement BUDGET-CEEAC.

Sous-lignes :

- analyse ;
- développement ;
- tests ;
- déploiement ;
- formation.

La Liquidation peut constater que :

- analyse : 100 % réalisée ;
- développement : 100 % ;
- tests : 50 % ;
- déploiement : 0 % ;
- formation : 0 %.

Le système doit calculer les montants liquidables correspondants.

---

# 15. FACTURE

Le système doit permettre d’enregistrer les informations de la facture :

- numéro ;
- date ;
- fournisseur ;
- référence contrat ;
- montant HT ;
- taxes ;
- montant TTC ;
- retenues ;
- pénalités éventuelles ;
- montant net à payer ;
- devise ;
- échéance.

La facture originale ou numérisée est jointe au dossier.

---

# 16. CONTRÔLE DE LA FACTURE

Le système doit effectuer des contrôles automatiques :

- fournisseur conforme ;
- montant cohérent ;
- absence de dépassement ;
- référence correcte ;
- doublon éventuel ;
- facture déjà utilisée ;
- concordance avec contrat/commande ;
- conformité des calculs.

---

# 17. DÉTECTION DES DOUBLONS

Le système doit détecter une facture potentiellement déjà liquidée.

Critères possibles :

- fournisseur ;
- numéro facture ;
- date ;
- montant ;
- référence contrat ;
- Engagement.

En cas de doublon :

> **Attention : cette facture semble avoir déjà été enregistrée dans une Liquidation.**

La soumission doit être bloquée ou soumise à autorisation selon les règles configurées.

---

# 18. RETENUES ET DÉDUCTIONS

Le module doit supporter :

- retenue de garantie ;
- avance à récupérer ;
- retenue fiscale ;
- pénalités ;
- avoirs ;
- autres déductions.

Le calcul doit être explicite.

Exemple :

Montant brut :

10 000 000

Retenue de garantie :

500 000

Pénalité :

200 000

Net à payer :

9 300 000 FCFA

---

# 19. GESTION DES TAXES

Le système doit pouvoir gérer les taxes applicables selon les règles de la Commission.

Exemples :

- HT ;
- TVA ;
- retenues fiscales ;
- exonérations ;
- taxes spécifiques.

Les règles doivent être paramétrables.

---

# 20. CONTRÔLE DU MONTANT

La règle fondamentale est :

> **Montant liquidé cumulé ≤ montant engagé.**

Aucun dépassement ne doit être autorisé sans procédure régulière de modification de l’Engagement.

---

# 21. IMPUTATION BUDGÉTAIRE

La Liquidation hérite des imputations de l’Engagement.

L’utilisateur ne doit pas modifier librement l’imputation budgétaire.

En cas de nécessité de modification :

- retour à l’étape appropriée ;
- justification ;
- autorisation ;
- traçabilité.

---

# 22. CAS MULTI-IMPUTATIONS

Si l’Engagement comporte plusieurs imputations, la Liquidation doit répartir le montant liquidé entre les lignes concernées.

Exemple :

Liquidation : 10 000 000 FCFA

| Ligne | Montant |
|---|---:|
| Ligne A | 6 500 000 |
| Ligne B | 3 500 000 |

Total :

**10 000 000 FCFA**

---

# 23. PIÈCES JUSTIFICATIVES

Le dossier peut comprendre :

- facture ;
- bon de commande ;
- contrat ;
- bon de livraison ;
- procès-verbal de réception ;
- attestation de service fait ;
- rapport de mission ;
- rapport technique ;
- situation de travaux ;
- décompte ;
- feuille de présence ;
- certificat ;
- bordereau ;
- pièce fiscale ;
- preuve de livraison ;
- document bancaire ;
- toute pièce requise.

---

# 24. PIÈCES OBLIGATOIRES DYNAMIQUES

Les pièces requises doivent dépendre :

- type de dépense ;
- montant ;
- fournisseur ;
- type de contrat ;
- nature du service ;
- procédure de marché ;
- type de Liquidation.

Exemple :

Pour un achat de matériel :

- facture ;
- bon de livraison ;
- PV de réception.

Pour une prestation intellectuelle :

- facture ;
- rapport ;
- attestation de service fait.

---

# 25. CHECK-LIST DE LIQUIDATION

Le système doit disposer d’une check-list.

Exemple :

- Engagement valide : Oui
- Contrat disponible : Oui
- Facture disponible : Oui
- Service fait : Oui
- PV réception : Oui
- Montant conforme : Oui
- Imputation conforme : Oui
- Fournisseur conforme : Oui

Statut :

> **Dossier complet**

ou

> **Dossier incomplet**

---

# 26. FORMULAIRE DE LIQUIDATION

Le formulaire peut être organisé en étapes.

## Étape 1 – Informations de l’Engagement

Lecture seule.

---

## Étape 2 – Service fait

- date ;
- certification ;
- observations ;
- quantités ;
- conformité.

---

## Étape 3 – Facture

- références ;
- montants ;
- taxes ;
- retenues ;
- net.

---

## Étape 4 – Détail de Liquidation

- sous-lignes ;
- tâches ;
- quantités ;
- montant.

---

## Étape 5 – Imputations

Répartition du montant.

---

## Étape 6 – Pièces justificatives

Téléversement et contrôle.

---

## Étape 7 – Récapitulatif

Contrôle complet.

---

## Étape 8 – Soumission

Transmission au Contrôleur Financier.

---

# 27. WORKFLOW CIBLE

Le workflow standard est :

**Engagement validé**

↓

**Création automatique Liquidation**

↓

**Structure initiatrice**

Certification du service fait

↓

**Constitution du dossier**

↓

**Contrôleur Financier**

Vérification

↓

### Si conforme

**Visa Liquidation**

↓

**Ordonnancement automatique**

### Si non conforme

- retour pour correction ;
- demande de complément ;
- rejet.

---

# 28. CONTRÔLEUR FINANCIER

Le Contrôleur Financier doit pouvoir vérifier :

- Engagement ;
- disponibilité ;
- pièces ;
- service fait ;
- facture ;
- imputations ;
- calculs ;
- conformité ;
- montant.

Il dispose des actions :

- Viser ;
- Retourner ;
- Demander complément ;
- Rejeter.

---

# 29. RETOUR POUR CORRECTION

En cas de retour :

- motif obligatoire ;
- champs concernés ;
- commentaire ;
- date ;
- acteur.

La structure concernée reçoit automatiquement une notification.

---

# 30. DEMANDE DE COMPLÉMENT

Le Contrôleur Financier peut demander :

- document supplémentaire ;
- clarification ;
- correction ;
- justification.

Le dossier conserve son historique.

---

# 31. REJET

Le rejet doit être motivé.

Le système conserve :

- motif ;
- auteur ;
- fonction ;
- date ;
- documents concernés.

Une Liquidation rejetée ne peut pas être transformée en Ordonnancement.

---

# 32. VISA

Après validation complète :

- visa électronique ;
- identité ;
- fonction ;
- date ;
- heure ;
- commentaire éventuel.

Le dossier est alors considéré comme :

> **Liquidation visée**

---

# 33. STATUTS

Statuts possibles :

- Générée ;
- En préparation ;
- En certification ;
- Service fait certifié ;
- À compléter ;
- Soumise ;
- En contrôle ;
- Retournée ;
- Complément demandé ;
- Visée ;
- Rejetée ;
- Annulée ;
- Transformée en Ordonnancement.

---

# 34. TRANSFORMATION AUTOMATIQUE EN ORDONNANCEMENT

Après visa final du Contrôleur Financier, le système doit automatiquement :

1. figer la Liquidation ;
2. générer le PDF officiel ;
3. archiver les documents ;
4. créer l’Ordonnancement ;
5. transmettre les montants ;
6. transmettre les pièces ;
7. transmettre les imputations ;
8. transmettre le bénéficiaire ;
9. créer la relation LIQ → ORD ;
10. notifier l’acteur compétent.

Aucun bouton manuel ne doit être nécessaire dans le processus normal.

---

# 35. DONNÉES TRANSMISES À L’ORDONNANCEMENT

- référence Liquidation ;
- référence Engagement ;
- référence EB ;
- créancier ;
- objet ;
- montant brut ;
- retenues ;
- montant net ;
- imputations ;
- facture ;
- pièces ;
- visa ;
- historique.

---

# 36. DOCUMENT PDF OFFICIEL

Le système doit générer une :

# FICHE DE LIQUIDATION

Elle doit comprendre :

- identité CEEAC ;
- référence Liquidation ;
- exercice ;
- EB ;
- Engagement ;
- créancier ;
- objet ;
- contrat ;
- facture ;
- service fait ;
- montant engagé ;
- montant liquidé ;
- retenues ;
- montant net ;
- imputations ;
- pièces ;
- certification ;
- visa ;
- QR Code ;
- identifiant documentaire ;
- date ;
- heure.

---

# 37. INTÉGRATION GED

Tous les documents sont automatiquement classés dans la GED.

Structure possible :

**Exercice → Dépenses → Liquidations → Référence**

La GED doit intégrer :

- pièces héritées ;
- nouvelles pièces ;
- PDF généré ;
- versions ;
- métadonnées.

---

# 38. BANDEAU DE SUIVI

Chaque dossier affiche :

- statut actuel ;
- dernière action ;
- acteur ;
- date ;
- prochaine étape ;
- acteur attendu ;
- délai.

Exemple :

> Service fait certifié par la DSI le 15/09/2026.  
> Prochaine étape : contrôle du Contrôleur Financier.

---

# 39. TIMELINE

La timeline peut afficher :

**Création automatique**

→ **Service fait**

→ **Certification**

→ **Facture enregistrée**

→ **Soumission**

→ **Contrôle**

→ **Visa**

→ **Ordonnancement généré**

---

# 40. NOTIFICATIONS

Le système notifie lors de :

- création ;
- certification ;
- soumission ;
- retour ;
- demande de complément ;
- visa ;
- rejet ;
- création Ordonnancement ;
- dépassement de délai.

---

# 41. « MES TÂCHES »

Les Liquidations à traiter doivent apparaître dans :

**Mes tâches**

Avec :

- référence ;
- objet ;
- fournisseur ;
- montant ;
- étape ;
- date ;
- délai ;
- acteur attendu.

Tri :

> plus récent au plus ancien.

---

# 42. TABLEAU DE BORD

KPI possibles :

- nombre total ;
- montant total ;
- en préparation ;
- en contrôle ;
- retournées ;
- visées ;
- rejetées ;
- partielles ;
- complètes ;
- en retard ;
- délai moyen ;
- montant par structure ;
- montant PAP/Hors PAP.

---

# 43. FILTRES

Filtres par :

- référence ;
- exercice ;
- EB ;
- Engagement ;
- structure ;
- fournisseur ;
- montant ;
- statut ;
- date ;
- PAP/Hors PAP ;
- Contrôleur Financier.

---

# 44. CONTRÔLES AUTOMATIQUES

Le système doit notamment vérifier :

- existence Engagement ;
- Engagement valide ;
- service fait ;
- facture ;
- absence de doublon ;
- montant ;
- imputations ;
- pièces obligatoires ;
- fournisseur ;
- contrat ;
- taxes ;
- retenues ;
- habilitations ;
- workflow.

---

# 45. CONTRÔLE ANTI-DÉPASSEMENT

Le système doit empêcher :

> Liquidations cumulées > Engagement.

Ce contrôle doit être réalisé côté serveur et base de données autant que possible.

---

# 46. JOURNAL D’AUDIT

Journaliser :

- création ;
- certification ;
- modification ;
- ajout pièce ;
- facture ;
- retour ;
- visa ;
- rejet ;
- génération PDF ;
- création Ordonnancement.

Conserver :

- utilisateur ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- date ;
- heure ;
- IP ;
- contexte.

---

# 47. GESTION DES VERSIONS

Une modification après retour doit créer ou conserver un historique logique.

Comparer :

- version précédente ;
- version actuelle.

Identifier :

- champ ;
- ancienne valeur ;
- nouvelle valeur ;
- auteur ;
- date.

---

# 48. DROITS ET PERMISSIONS

Exemples :

- `liquidation.view`
- `liquidation.prepare`
- `liquidation.certify`
- `liquidation.submit`
- `liquidation.control`
- `liquidation.return`
- `liquidation.reject`
- `liquidation.approve`
- `liquidation.export`
- `liquidation.view_all`

---

# 49. SÉPARATION DES FONCTIONS

Le système doit empêcher les incompatibilités de rôles.

Par exemple, selon configuration :

- auteur de la prestation ;
- certificateur ;
- contrôleur ;
- ordonnateur ;
- payeur

ne doivent pas être confondus lorsque les règles de contrôle interne l’interdisent.

---

# 50. MODÈLE DE DONNÉES INDICATIF

## `liquidations`

- id
- reference
- engagement_id
- exercice_id
- fournisseur_id
- montant_brut
- montant_retenues
- montant_net
- date_service_fait
- statut
- workflow_instance_id
- created_at
- updated_at

## `liquidation_details`

- id
- liquidation_id
- engagement_detail_id
- task_id
- quantite_engagee
- quantite_recue
- quantite_acceptee
- montant_engage
- montant_liquide
- solde

## `liquidation_factures`

- id
- liquidation_id
- numero
- date_facture
- montant_ht
- taxes
- montant_ttc
- retenues
- net_a_payer

## `liquidation_imputations`

- id
- liquidation_id
- ligne_budgetaire_id
- montant

## `liquidation_documents`

- id
- liquidation_id
- document_id
- type_document

## `liquidation_actions`

- id
- liquidation_id
- utilisateur_id
- action
- statut_avant
- statut_apres
- commentaire
- created_at

---

# 51. INTÉGRATIONS

Le module doit communiquer avec :

- Expression de Besoin ;
- Engagement ;
- Budget ;
- PAP ;
- fournisseurs ;
- marchés ;
- GED ;
- workflow ;
- notifications ;
- Ordonnancement ;
- reporting ;
- audit.

---

# 52. ERGONOMIE

L’interface doit permettre de comprendre immédiatement :

- qui a engagé ;
- ce qui a été commandé ;
- ce qui a été livré ;
- ce qui a été accepté ;
- ce qui a déjà été liquidé ;
- ce qui reste à liquider ;
- ce qui doit être payé.

---

# 53. PANNEAU SYNTHÉTIQUE

Exemple :

> **ENG-2026-00125**  
> Engagement : 20 000 000 FCFA  
> Déjà liquidé : 8 000 000 FCFA  
> Présente Liquidation : 7 000 000 FCFA  
> Solde restant : 5 000 000 FCFA  
> Service fait : Certifié  
> Statut : En contrôle

---

# 54. ALERTES

### Information

> Liquidation partielle.

### Attention

> Il reste 5 000 000 FCFA à liquider.

### Erreur

> Le montant demandé dépasse le solde de l’Engagement.

### Blocage

> Impossible de soumettre : le service fait n’est pas certifié.

---

# 55. KPI DE PERFORMANCE

Indicateurs possibles :

- délai moyen de Liquidation ;
- délai moyen de certification ;
- délai de contrôle ;
- taux de retour ;
- taux de rejet ;
- taux de visa ;
- Liquidations par structure ;
- Liquidations par fournisseur ;
- montant cumulé ;
- montants restant à liquider ;
- nombre de dossiers incomplets.

---

# 56. TRAÇABILITÉ COMPLÈTE

Depuis une Liquidation :

**EB**

↓

**Engagement**

↓

**Liquidation**

↓

**Ordonnancement**

↓

**Paiement**

L’utilisateur doit pouvoir naviguer dans toute la chaîne.

---

# 57. CAS PARTICULIERS À PRÉVOIR

Le module doit pouvoir gérer :

- liquidation totale ;
- liquidation partielle ;
- acomptes ;
- avances ;
- récupération d’avance ;
- retenue de garantie ;
- pénalités ;
- situations de travaux ;
- marchés à tranches ;
- contrats pluriannuels ;
- factures multiples ;
- avoirs ;
- annulations ;
- corrections.

---

# 58. CRITÈRES DE RECETTE

Le module est considéré opérationnel lorsque :

1. une Liquidation est créée automatiquement après l’Engagement ;
2. les données sont héritées correctement ;
3. le service fait peut être certifié ;
4. les factures sont gérées ;
5. les liquidations partielles fonctionnent ;
6. le système empêche les dépassements ;
7. les pièces obligatoires sont contrôlées ;
8. les retenues sont calculées ;
9. les imputations sont conservées ;
10. le workflow fonctionne ;
11. le Contrôleur Financier peut viser ou retourner ;
12. le PDF est généré ;
13. la GED est alimentée ;
14. les notifications fonctionnent ;
15. l’historique est complet ;
16. l’Ordonnancement est créé automatiquement après visa.

---

# 59. PRINCIPE DE COHÉRENCE ENTRE ENGAGEMENT ET LIQUIDATION

La Liquidation ne doit jamais devenir un nouveau point de saisie indépendante.

Elle constitue la continuation du dossier engagé.

Ainsi :

> **Engagement = ce que la CEEAC s’est engagée à payer.**

> **Liquidation = ce que la CEEAC reconnaît effectivement devoir après service fait.**

Cette distinction doit être reflétée dans :

- les données ;
- les interfaces ;
- les contrôles ;
- les workflows ;
- les états.

---

# 60. RÉSULTAT ATTENDU

Le module Liquidation doit garantir que tout dossier transmis à l’Ordonnancement est :

- rattaché à un Engagement régulier ;
- appuyé par un service fait ;
- correctement facturé ;
- documenté ;
- contrôlé ;
- budgétairement cohérent ;
- financièrement exact ;
- visé ;
- traçable.

Le processus cible devient :

**Engagement validé**

→ **Liquidation générée**

→ **Service fait**

→ **Certification**

→ **Facture**

→ **Contrôle des pièces**

→ **Calcul du montant liquidable**

→ **Contrôle du Contrôleur Financier**

→ **Visa**

→ **PDF officiel**

→ **GED**

→ **Ordonnancement automatique**.