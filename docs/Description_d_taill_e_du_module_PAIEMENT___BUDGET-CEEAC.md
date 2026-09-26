# DESCRIPTION DÉTAILLÉE DU MODULE PAIEMENT  
## Application BUDGET-CEEAC

## 1. OBJET DU MODULE

Le module **PAIEMENT** constitue la cinquième et dernière étape opérationnelle de la chaîne d’exécution de la dépense dans BUDGET-CEEAC.

Il intervient après la signature définitive de l’Ordre de Paiement par l’Ordonnateur compétent.

Sa finalité est de permettre à l’**Agence Comptable** :

- de prendre en charge le dossier transmis par l’Ordonnateur ;
- d’effectuer les contrôles comptables nécessaires ;
- de préparer le règlement ;
- d’exécuter le paiement ;
- de constater la sortie effective des fonds ;
- d’enregistrer les références bancaires ou de caisse ;
- d’assurer la traçabilité complète du règlement ;
- de produire les pièces comptables et justificatives ;
- de rapprocher ultérieurement le paiement avec les écritures comptables et bancaires ;
- de clôturer financièrement la chaîne de dépense.

Le module ne doit donc pas être conçu comme un simple écran où l’on renseigne « payé ».

Il constitue le **point d’exécution financière effective de la dépense**.

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

Le processus de Paiement doit être représenté comme suit :

**Ordre de Paiement signé**

↓

**Transmission automatique à l’Agence Comptable**

↓

**Création automatique du dossier Paiement**

↓

**Prise en charge comptable**

↓

**Contrôles comptables**

↓

**Préparation du règlement**

↓

**Validation / signature Agent Comptable**

↓

**Exécution du paiement**

↓

**Enregistrement de la preuve de règlement**

↓

**Rapprochement**

↓

**Clôture financière du dossier**

---

# 3. OBJECTIFS DU MODULE

Le module doit permettre de :

1. recevoir automatiquement les Ordres de Paiement signés ;
2. affecter les dossiers à l’Agence Comptable ;
3. vérifier la régularité comptable du dossier ;
4. contrôler les pièces justificatives ;
5. vérifier le bénéficiaire et ses coordonnées de paiement ;
6. préparer le règlement ;
7. gérer plusieurs modes de paiement ;
8. soumettre le paiement à validation ;
9. faire signer ou valider le règlement par l’Agent Comptable ;
10. enregistrer l’exécution effective du paiement ;
11. gérer les paiements partiels si autorisés ;
12. gérer les rejets et suspensions comptables ;
13. produire les documents et preuves de paiement ;
14. intégrer les documents à la GED ;
15. assurer la traçabilité complète ;
16. permettre le rapprochement bancaire ou de caisse ;
17. alimenter les tableaux de bord et le reporting ;
18. clôturer le dossier une fois le paiement confirmé.

---

# 4. PRINCIPE FONDAMENTAL : CRÉATION AUTOMATIQUE

Le dossier de Paiement doit être automatiquement créé à partir de l’Ordonnancement signé.

Dans le processus nominal, aucun utilisateur ne doit avoir à cliquer sur :

**« Créer un paiement »**

La transition doit être :

**OP signé**

→ **Dossier Paiement créé automatiquement**

→ **Transmission Agence Comptable**

→ **Notification**

→ **Mes tâches**

---

# 5. HÉRITAGE AUTOMATIQUE DES DONNÉES

Le module Paiement doit reprendre automatiquement les informations validées dans les étapes précédentes.

Notamment :

- référence EB ;
- référence Engagement ;
- référence Liquidation ;
- référence Ordonnancement ;
- numéro OP ;
- exercice ;
- structure initiatrice ;
- objet ;
- bénéficiaire ;
- fournisseur ;
- classification PAP/Hors PAP ;
- ligne budgétaire ;
- imputations ;
- montant engagé ;
- montant liquidé ;
- retenues ;
- montant net ordonnancé ;
- données bancaires ;
- facture ;
- marché ;
- contrat ;
- service fait ;
- visa du Contrôleur Financier ;
- signature de l’Ordonnateur ;
- pièces justificatives ;
- données PAP ;
- historique essentiel.

Aucune information financière déjà validée ne doit être ressaisie manuellement.

---

# 6. IDENTIFICATION DU PAIEMENT

Chaque dossier doit disposer d’une référence unique.

Exemple :

**PAY-2026-000154**

ou selon la nomenclature retenue :

**PAI-2026-000154**

La fiche doit afficher clairement :

**Paiement : PAY-2026-000154**

**Ordonnancement : ORD-2026-000184**

**Liquidation : LIQ-2026-000167**

**Engagement : ENG-2026-000142**

**Expression de Besoin : EB-2026-000119**

---

# 7. ACTEURS PRINCIPAUX

Le module doit distinguer clairement les responsabilités.

## Comptable

Peut notamment :

- prendre en charge le dossier ;
- vérifier les pièces ;
- contrôler le bénéficiaire ;
- préparer le règlement ;
- saisir les informations de paiement ;
- joindre des pièces ;
- soumettre le dossier.

## Chef Comptable

Peut notamment :

- superviser ;
- contrôler ;
- corriger ;
- valider ;
- retourner ;
- transmettre à l’Agent Comptable.

## Agent Comptable

Intervient comme autorité finale du paiement.

Il doit pouvoir :

- contrôler ;
- valider ;
- signer ;
- rejeter ;
- suspendre ;
- autoriser le règlement.

---

# 8. ACCÈS AU MODULE

Le module Paiement doit être accessible à tout le personnel habilité de l’Agence Comptable selon ses droits.

Par exemple :

- Comptable ;
- Chef Comptable ;
- Agent Comptable.

Le système ne doit pas limiter artificiellement la visibilité du module à un seul profil.

Les actions doivent toutefois rester contrôlées par rôle.

---

# 9. TABLEAU DE BORD PAIEMENT

Créer un tableau de bord spécifique.

Prévoir notamment :

### Dossiers

- Tous les Paiements ;
- Nouveaux dossiers ;
- À prendre en charge ;
- En préparation ;
- À contrôler ;
- À valider ;
- À signer ;
- En attente de règlement ;
- Exécutés ;
- Rejetés ;
- Suspendus ;
- Retournés ;
- À rapprocher ;
- Rapprochés ;
- Clôturés.

---

# 10. KPI FINANCIERS

Prévoir notamment :

**Montant total à payer**

**Montant payé**

**Montant restant**

**Paiements du jour**

**Paiements du mois**

**Paiements en attente**

**Paiements PAP**

**Paiements Hors PAP**

**Montant en anomalie**

**Montant non rapproché**

---

# 11. LISTE DES PAIEMENTS

La liste doit contenir notamment :

| Champ | Description |
|---|---|
| Référence | Numéro PAY |
| OP | Référence Ordre de Paiement |
| Liquidation | Référence LIQ |
| Engagement | Référence ENG |
| EB | Référence EB |
| Date | Date de création |
| Bénéficiaire | Créancier |
| Objet | Objet de la dépense |
| Structure | Unité initiatrice |
| PAP/Hors PAP | Classification |
| Montant ordonnancé | Net à payer |
| Montant payé | Montant exécuté |
| Solde | Reste |
| Mode | Virement, chèque, caisse |
| Statut | État |
| Acteur attendu | Prochain intervenant |

---

# 12. STATUTS DU MODULE

Prévoir notamment :

- Généré ;
- Transmis à l’Agence Comptable ;
- Reçu ;
- Pris en charge ;
- En préparation ;
- À compléter ;
- À contrôler ;
- À valider ;
- À signer ;
- Autorisé au paiement ;
- En cours de règlement ;
- Payé partiellement ;
- Payé ;
- À rapprocher ;
- Rapproché ;
- Suspendu ;
- Retourné ;
- Rejeté ;
- Annulé ;
- Clôturé.

---

# 13. PAGE DÉTAIL DU PAIEMENT

Créer une fiche complète organisée par onglets :

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

# 14. BANDEAU DE SUIVI

Afficher systématiquement :

**ÉTAPE ACTUELLE**

Préparation du règlement

**DERNIÈRE ACTION**

Dossier pris en charge par le Comptable

**ACTEUR ATTENDU**

Chef Comptable

**PROCHAINE ÉTAPE**

Validation puis signature Agent Comptable

---

# 15. CARTE FINANCIÈRE PRINCIPALE

Afficher :

**Montant ordonnancé**

8 750 000 FCFA

**Déjà payé**

0 FCFA

**Paiement en cours**

8 750 000 FCFA

**Reste après paiement**

0 FCFA

---

# 16. CONTRÔLES AUTOMATIQUES AVANT PAIEMENT

Créer une zone :

# CONTRÔLES COMPTABLES

Exemple :

✓ OP signé

✓ Liquidation visée

✓ Bénéficiaire actif

✓ Coordonnées bancaires vérifiées

✓ Montant cohérent

✓ Pièces justificatives complètes

✓ Paiement non déjà exécuté

✓ Exercice ouvert

✓ Compte de paiement valide

✓ Mode de paiement autorisé

Toute anomalie bloquante doit empêcher la validation.

---

# 17. PRISE EN CHARGE COMPTABLE

Lorsqu’un nouveau dossier arrive, il doit apparaître dans la file :

**Dossiers à prendre en charge**

Le Comptable doit pouvoir cliquer :

**Prendre en charge**

Le système enregistre :

- utilisateur ;
- date ;
- heure ;
- unité ;
- statut.

---

# 18. ESPACE DU COMPTABLE

Le Comptable doit pouvoir :

- examiner l’OP ;
- vérifier le bénéficiaire ;
- vérifier les coordonnées bancaires ;
- vérifier les pièces ;
- choisir ou confirmer le mode de règlement ;
- saisir les informations bancaires ou de caisse ;
- joindre des pièces ;
- enregistrer ;
- soumettre.

---

# 19. ESPACE DU CHEF COMPTABLE

Le Chef Comptable doit pouvoir :

- vérifier le dossier ;
- corriger ou demander correction ;
- valider ;
- retourner ;
- transmettre à l’Agent Comptable.

Il doit disposer d’une vue synthétique orientée contrôle.

---

# 20. ESPACE DE L’AGENT COMPTABLE

L’Agent Comptable doit disposer d’une vue décisionnelle montrant :

- bénéficiaire ;
- montant ;
- mode de règlement ;
- coordonnées ;
- OP ;
- facture ;
- contrôles ;
- anomalies ;
- pièces ;
- historique.

Actions :

**Signer / Valider**

**Suspendre**

**Retourner**

**Rejeter**

---

# 21. MODES DE PAIEMENT

Le module doit gérer au minimum :

### Virement bancaire

### Chèque

### Caisse Agence Comptable

Selon les évolutions, il pourra aussi supporter :

- virement électronique ;
- paiement groupé ;
- compensation ;
- autres modes paramétrables.

---

# 22. VIREMENT BANCAIRE

Pour un virement, afficher :

- banque ;
- agence ;
- numéro de compte ;
- IBAN/RIB si applicable ;
- titulaire ;
- montant ;
- motif ;
- date valeur ;
- compte CEEAC débité ;
- référence de virement.

---

# 23. CHÈQUE

Pour un paiement par chèque :

- banque émettrice ;
- compte débité ;
- numéro chèque ;
- date ;
- bénéficiaire ;
- montant ;
- date de remise ;
- personne ayant reçu ;
- pièce d’identité éventuelle.

---

# 24. CAISSE AGENCE COMPTABLE

Pour un règlement caisse :

- caisse ;
- caissier ;
- bénéficiaire ;
- montant ;
- pièce d’identité ;
- référence ;
- date ;
- reçu signé ;
- motif.

---

# 25. COMPTE BANCAIRE DE LA CEEAC

Le système doit utiliser un référentiel des comptes de paiement.

Pour chaque compte :

- banque ;
- numéro ;
- devise ;
- type ;
- solde disponible si disponible ;
- statut ;
- autorisation ;
- périmètre d’utilisation.

---

# 26. CONTRÔLE DU COMPTE DE PAIEMENT

Avant exécution :

✓ Compte actif

✓ Devise compatible

✓ Solde suffisant si information disponible

✓ Mode de paiement autorisé

✓ Signataire habilité

---

# 27. BÉNÉFICIAIRE

Afficher :

- raison sociale ;
- identité ;
- NIF ;
- RCCM ;
- adresse ;
- banque ;
- compte ;
- titulaire du compte ;
- statut.

Les informations doivent provenir du référentiel des tiers.

---

# 28. VÉRIFICATION DES COORDONNÉES BANCAIRES

Avant un virement, le système doit afficher :

**Coordonnées vérifiées**

Avec :

- date de validation ;
- utilisateur ;
- document justificatif ;
- statut.

Une modification tardive doit déclencher une nouvelle vérification.

---

# 29. LUTTE CONTRE LES FRAUDES DE COORDONNÉES

Le système doit signaler :

- changement récent de compte ;
- compte utilisé pour plusieurs bénéficiaires ;
- incohérence titulaire/bénéficiaire ;
- données manquantes ;
- compte suspendu.

Les modifications sensibles doivent être journalisées.

---

# 30. MONTANT À PAYER

Le module doit reprendre :

**Montant brut**

moins

**Retenues**

égal

**Net ordonnancé**

Le paiement ne peut normalement pas dépasser le montant net ordonnancé.

---

# 31. PAIEMENT TOTAL

Exemple :

**Net ordonnancé : 8 750 000 FCFA**

**Paiement : 8 750 000 FCFA**

**Reste : 0**

Statut :

**PAYÉ**

---

# 32. PAIEMENT PARTIEL

Lorsque la procédure l’autorise :

**Net ordonnancé : 10 000 000 FCFA**

**Paiement 1 : 6 000 000 FCFA**

**Reste : 4 000 000 FCFA**

Le système doit conserver le solde.

---

# 33. CONTRÔLE DU PLAFOND

Le système doit imposer :

**Cumul des paiements ≤ montant net ordonnancé**

Toute tentative de dépassement doit être bloquée.

---

# 34. PAIEMENT MULTI-VERSEMENTS

Si un règlement est exécuté en plusieurs versements :

| Versement | Date | Mode | Montant | Référence |
|---|---|---|---:|---|

Afficher :

- total payé ;
- reste à payer ;
- statut.

---

# 35. PAIEMENTS GROUPÉS

Le module peut permettre le traitement de plusieurs OP dans un lot de paiement.

Exemple :

**Lot PAY-BATCH-2026-018**

- 12 bénéficiaires ;
- 32 450 000 FCFA ;
- banque ;
- date ;
- statut.

Chaque paiement individuel doit néanmoins rester identifiable.

---

# 36. CONTRÔLE DES DOUBLONS

Empêcher :

- double paiement du même OP ;
- double paiement de la même facture ;
- duplication d’un virement ;
- double émission de chèque.

---

# 37. RÉFÉRENCE BANCAIRE

Après exécution, enregistrer :

- numéro de transaction ;
- référence SWIFT si applicable ;
- référence banque ;
- numéro chèque ;
- numéro reçu caisse ;
- date d’exécution ;
- date valeur ;
- montant.

---

# 38. PREUVE DE PAIEMENT

Le système doit permettre de joindre ou générer :

- avis de débit ;
- preuve de virement ;
- copie de chèque ;
- reçu ;
- bordereau bancaire ;
- relevé ;
- accusé du bénéficiaire.

---

# 39. VALIDATION DU PAIEMENT

Le processus peut être :

**Comptable**

↓

**Chef Comptable**

↓

**Agent Comptable**

↓

**Exécution**

Ce workflow doit être paramétrable.

---

# 40. SUPPRESSION DU VERROU D’AUTO-VALIDATION

Le système ne doit pas empêcher artificiellement un utilisateur habilité de traiter un dossier simplement parce qu’il a déjà réalisé une action antérieure, sauf règle de séparation des fonctions réellement applicable.

La séparation des fonctions doit être configurée par rôle et règle métier, et non par un verrou arbitraire.

---

# 41. SIGNATURE DE L’AGENT COMPTABLE

La validation finale doit être une action formelle.

Afficher :

**Bénéficiaire**

**Montant**

**Mode**

**Compte débité**

**Référence OP**

Puis :

**Je valide l’exécution de ce paiement.**

---

# 42. PAIEMENT EXÉCUTÉ

Après exécution :

# PAIEMENT EXÉCUTÉ

Afficher :

- montant ;
- bénéficiaire ;
- mode ;
- date ;
- compte ;
- référence ;
- opérateur ;
- Agent Comptable ;
- preuve.

---

# 43. DISTINCTION ENTRE « VALIDÉ » ET « PAYÉ »

Le système doit clairement distinguer :

### Paiement validé

Autorisation donnée.

### Paiement exécuté

Ordre transmis ou opération réalisée.

### Paiement confirmé

Preuve de débit ou règlement disponible.

### Paiement rapproché

Correspondance confirmée avec relevé bancaire/caisse.

---

# 44. SUSPENSION

Le dossier peut être suspendu pour :

- anomalie bancaire ;
- bénéficiaire bloqué ;
- pièce manquante ;
- compte invalide ;
- opposition ;
- décision administrative ;
- suspicion de doublon.

Le système doit demander :

- motif ;
- commentaire ;
- date ;
- responsable.

---

# 45. RETOUR

Le Comptable, Chef Comptable ou Agent Comptable peut retourner un dossier lorsque la correction est possible.

Exiger :

- motif ;
- étape destinataire ;
- commentaire ;
- éléments concernés.

---

# 46. REJET

Le rejet doit être réservé aux situations où le paiement ne peut pas être poursuivi.

Afficher :

- motif ;
- autorité ;
- date ;
- conséquences ;
- référence.

---

# 47. RÉVOCATION AVANT EXÉCUTION

Un paiement préparé mais non encore exécuté peut être annulé selon procédure.

La révocation doit être :

- autorisée ;
- motivée ;
- documentée ;
- journalisée.

---

# 48. ANNULATION APRÈS EXÉCUTION

Un paiement exécuté ne doit jamais être simplement supprimé.

Toute correction doit utiliser une procédure :

- annulation comptable ;
- contre-passation ;
- remboursement ;
- régularisation.

L’historique doit être conservé.

---

# 49. ÉCHEC BANCAIRE

Prévoir les statuts :

- virement rejeté ;
- compte fermé ;
- coordonnées invalides ;
- solde insuffisant ;
- erreur banque ;
- bénéficiaire non reconnu.

Le système doit permettre :

**Corriger**

puis

**Relancer**

sans dupliquer le paiement.

---

# 50. REPRISE IDEMPOTENTE

Toute reprise technique doit éviter :

- double virement ;
- double chèque ;
- double enregistrement ;
- double comptabilisation.

---

# 51. RAPPROCHEMENT BANCAIRE

Le module doit intégrer un processus de rapprochement.

Pour chaque paiement :

- montant système ;
- montant banque ;
- date système ;
- date valeur ;
- référence système ;
- référence banque.

Statuts :

**Non rapproché**

**Rapproché automatiquement**

**Rapproché manuellement**

**Écart détecté**

---

# 52. RAPPROCHEMENT DE CAISSE

Pour les paiements caisse :

- référence ;
- reçu ;
- montant ;
- caisse ;
- date ;
- bénéficiaire ;
- signature.

---

# 53. ÉCART DE RAPPROCHEMENT

Afficher :

**Montant BUDGET-CEEAC**

5 000 000 FCFA

**Montant banque**

4 950 000 FCFA

**Écart**

50 000 FCFA

Le système doit exiger une justification.

---

# 54. INTÉGRATION COMPTABLE

Le paiement doit pouvoir alimenter les écritures comptables nécessaires.

Selon l’architecture, le système pourra :

- générer une écriture ;
- transmettre une écriture ;
- synchroniser un système comptable.

---

# 55. RETENUES ET TIERS

Le système doit distinguer :

- montant versé au fournisseur ;
- retenues fiscales ;
- garanties ;
- autres tiers bénéficiaires.

Les retenues doivent pouvoir être suivies séparément.

---

# 56. PAP

Pour un dossier PAP, le paiement doit conserver :

- pilier ;
- axe ;
- objectif ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateur ;
- réalisation physique ;
- montant engagé ;
- liquidé ;
- ordonnancé ;
- payé.

---

# 57. CHAÎNE FINANCIÈRE PAP

Afficher :

**Budget**

↓

**Engagé**

↓

**Liquidé**

↓

**Ordonnancé**

↓

**Payé**

Avec les taux correspondants.

---

# 58. TAUX DE PAIEMENT

Formule :

**Montant payé / Montant ordonnancé × 100**

---

# 59. RESTE À PAYER

Formule :

**Montant ordonnancé – Paiements cumulés**

---

# 60. MARCHÉ / CONTRAT

Afficher :

- contrat ;
- marché ;
- titulaire ;
- montant ;
- ordonnancé ;
- payé ;
- solde ;
- échéance.

---

# 61. GED

Tous les documents doivent être automatiquement intégrés à la GED.

Notamment :

- OP signé ;
- preuve de paiement ;
- bordereau ;
- chèque ;
- ordre de virement ;
- avis de débit ;
- reçu ;
- rapprochement ;
- décisions de rejet ou suspension.

Classement :

**Exercice → Chaîne de dépense → Paiement → Référence PAY**

---

# 62. DOCUMENTS GÉNÉRÉS

Prévoir notamment :

### Fiche de Paiement

### Ordre de virement

### Bordereau de paiement

### Avis de paiement

### Reçu

### Fiche de contrôle comptable

### Fiche de rapprochement

### Avis de rejet

### Avis de suspension

---

# 63. FICHE DE PAIEMENT PDF

Elle doit comprendre :

- logo CEEAC ;
- référence Paiement ;
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

# 64. AVIS DE PAIEMENT

Le système peut générer un avis destiné au bénéficiaire.

Exemple :

**Votre facture n° XXX a été réglée**

Montant : XXX FCFA

Date : XX/XX/XXXX

Référence : XXXXX

---

# 65. NOTIFICATIONS

Prévoir notamment :

- dossier reçu à l’Agence Comptable ;
- dossier à prendre en charge ;
- validation requise ;
- paiement prêt ;
- paiement validé ;
- paiement exécuté ;
- paiement rejeté ;
- paiement suspendu ;
- paiement échoué ;
- rapprochement effectué ;
- dossier clôturé.

---

# 66. MES TÂCHES

Exemple :

**PAY-2026-000154**

Bénéficiaire : Société ABC

**8 750 000 FCFA**

Action attendue :

**Préparer le règlement**

Mode :

Virement bancaire

---

# 67. HISTORIQUE

Créer une timeline.

Exemple :

**17/09/2026 – 14:22**

Paiement créé automatiquement

**17/09/2026 – 14:24**

Reçu par l’Agence Comptable

**17/09/2026 – 15:10**

Pris en charge par le Comptable

**18/09/2026 – 09:40**

Préparation terminée

**18/09/2026 – 11:00**

Validé par Chef Comptable

**18/09/2026 – 14:10**

Signé par Agent Comptable

**18/09/2026 – 14:30**

Virement exécuté

**19/09/2026 – 09:00**

Paiement rapproché

---

# 68. JOURNAL D’AUDIT

Journaliser :

- utilisateur ;
- rôle ;
- date ;
- heure ;
- action ;
- données modifiées ;
- ancienne valeur ;
- nouvelle valeur ;
- document ;
- référence transaction ;
- événement système.

---

# 69. REPORTING PAIEMENT

Prévoir :

- montant payé ;
- nombre de paiements ;
- paiement par structure ;
- par bénéficiaire ;
- par mode ;
- par compte bancaire ;
- PAP/Hors PAP ;
- par période ;
- paiements en attente ;
- paiements suspendus ;
- rejets ;
- anomalies ;
- rapprochements.

---

# 70. KPI PAIEMENT

### Taux de paiement

**Montant payé / Montant ordonnancé × 100**

### Délai moyen de paiement

**Date paiement – Date signature OP**

### Taux de rapprochement

**Paiements rapprochés / Paiements exécutés**

### Taux d’échec bancaire

**Paiements échoués / Paiements transmis**

---

# 71. DÉLAIS

Le système doit calculer :

- temps de prise en charge ;
- temps de préparation ;
- temps de validation ;
- temps de paiement ;
- temps de rapprochement.

---

# 72. ALERTES

Exemples :

**Dossier non pris en charge depuis 24h**

**Paiement validé mais non exécuté**

**Virement rejeté**

**Rapprochement en attente**

**Compte bancaire modifié récemment**

**Bénéficiaire suspendu**

---

# 73. RECHERCHE GLOBALE

Un Paiement doit être retrouvable par :

- référence PAY ;
- OP ;
- Liquidation ;
- Engagement ;
- EB ;
- facture ;
- bénéficiaire ;
- référence bancaire ;
- chèque ;
- montant ;
- structure.

---

# 74. EXPORTS

Prévoir :

- PDF ;
- Excel ;
- CSV.

---

# 75. INTEROPÉRABILITÉ

Le module doit pouvoir s’interfacer avec :

- banques ;
- systèmes comptables ;
- ERP ;
- Power BI ;
- systèmes d’audit ;
- outils de trésorerie.

---

# 76. API BANCAIRE

Si une intégration bancaire est disponible, prévoir :

- émission de virement ;
- récupération du statut ;
- référence bancaire ;
- confirmation ;
- rejet ;
- relevé.

Toute intégration doit être sécurisée et auditable.

---

# 77. IMPORT DE RELEVÉS

Prévoir la possibilité d’importer :

- relevé bancaire ;
- fichier de paiement ;
- fichier de retour banque.

Les formats doivent être paramétrables.

---

# 78. SÉCURITÉ

Prévoir :

- RBAC ;
- séparation des fonctions ;
- authentification renforcée ;
- contrôle de signature ;
- chiffrement des données sensibles ;
- journalisation ;
- contrôle d’intégrité ;
- protection des coordonnées bancaires.

---

# 79. SÉPARATION DES FONCTIONS

Distinguer clairement :

- Ordonnateur ;
- Comptable ;
- Chef Comptable ;
- Agent Comptable.

La personne qui ordonne la dépense n’exécute pas le paiement.

---

# 80. DONNÉES SENSIBLES

Les informations suivantes nécessitent une protection particulière :

- comptes bancaires ;
- références de transaction ;
- pièces d’identité ;
- signatures ;
- données fiscales.

L’affichage doit dépendre des habilitations.

---

# 81. TABLEAU DE BORD DE L’AGENCE COMPTABLE

Créer une page spécifique permettant de voir :

- dossiers reçus ;
- à traiter ;
- en validation ;
- à signer ;
- à exécuter ;
- en erreur ;
- à rapprocher ;
- clôturés.

Les cartes doivent ouvrir directement les listes correspondantes.

---

# 82. PAGE « MES PAIEMENTS À TRAITER »

Cette page doit afficher prioritairement :

- référence ;
- bénéficiaire ;
- montant ;
- action attendue ;
- ancienneté ;
- priorité ;
- mode ;
- statut.

---

# 83. TRAITEMENT DIRECT DEPUIS LE TABLEAU DE BORD

La page Paiements doit permettre d’accéder directement au dossier à traiter sans multiplication de clics.

---

# 84. ERGONOMIE

L’utilisateur doit répondre rapidement aux questions :

**Quel bénéficiaire dois-je payer ?**

**Quel montant ?**

**Sur quel OP ?**

**Quel mode ?**

**Sur quel compte ?**

**Le dossier est-il complet ?**

**Qui doit valider maintenant ?**

**Le paiement a-t-il réellement été exécuté ?**

---

# 85. PRINCIPAUX ÉCRANS

Le module doit comporter au minimum :

1. tableau de bord ;
2. liste des Paiements ;
3. détail ;
4. prise en charge ;
5. contrôle comptable ;
6. préparation ;
7. virement ;
8. chèque ;
9. caisse ;
10. validation Chef Comptable ;
11. décision Agent Comptable ;
12. paiement exécuté ;
13. échec paiement ;
14. rapprochement ;
15. documents ;
16. historique ;
17. reporting.

---

# 86. ÉTATS EXCEPTIONNELS

Prévoir :

- OP invalide ;
- bénéficiaire bloqué ;
- coordonnées bancaires manquantes ;
- compte CEEAC indisponible ;
- solde insuffisant ;
- paiement doublon ;
- banque indisponible ;
- virement rejeté ;
- chèque annulé ;
- erreur d’interface bancaire ;
- rapprochement impossible ;
- exercice clôturé ;
- droits insuffisants.

---

# 87. REPRISE APRÈS ERREUR

Lors d’une erreur technique :

- conserver l’état du dossier ;
- ne pas créer de doublon ;
- permettre une reprise ;
- journaliser les tentatives.

---

# 88. CLÔTURE DU DOSSIER

Le dossier peut être clôturé lorsque :

✓ paiement exécuté ;

✓ preuve disponible ;

✓ montant totalement réglé ou solde justifié ;

✓ rapprochement effectué ;

✓ documents archivés ;

✓ aucune anomalie bloquante restante.

---

# 89. DOSSIER PAYÉ PARTIELLEMENT

Lorsque le paiement est partiel, le dossier reste ouvert jusqu’à :

- paiement du solde ;
- annulation autorisée du solde ;
- autre décision formalisée.

---

# 90. CHAÎNE COMPLÈTE CONSULTABLE

Depuis le Paiement, l’utilisateur habilité doit pouvoir consulter :

**EB**

→ **Engagement**

→ **Liquidation**

→ **Ordonnancement**

→ **Paiement**

sans perdre le contexte.

---

# 91. UNE SEULE SOURCE DE VÉRITÉ

Les données doivent provenir des référentiels appropriés :

- Budget → référentiel budgétaire ;
- PAP → référentiel programmatique ;
- bénéficiaires → référentiel Tiers ;
- comptes bancaires → référentiel Trésorerie/Agence Comptable ;
- documents → GED ;
- marchés → référentiel Marchés.

---

# 92. RÈGLE DE NON-RÉGRESSION

La réforme du module Paiement ne doit pas :

- casser le lien avec l’Ordonnancement ;
- permettre un paiement sans OP signé ;
- supprimer les pièces antérieures ;
- perdre l’historique ;
- autoriser un double paiement ;
- modifier librement le bénéficiaire ;
- créer une nouvelle chaîne parallèle ;
- supprimer les contrôles existants utiles.

---

# 93. CRITÈRES DE RECETTE

## Scénario nominal virement

OP signé  
→ Paiement automatique  
→ prise en charge  
→ vérification  
→ préparation virement  
→ validation Chef Comptable  
→ signature Agent Comptable  
→ exécution  
→ preuve  
→ rapprochement  
→ clôture.

## Paiement par chèque

Préparation  
→ validation  
→ émission chèque  
→ remise  
→ preuve  
→ clôture.

## Paiement caisse

Préparation  
→ validation  
→ règlement  
→ reçu signé  
→ clôture.

## Échec bancaire

Virement transmis  
→ rejet banque  
→ statut échec  
→ correction  
→ nouvelle tentative sans duplication.

## Paiement partiel

Montant ordonnancé  
→ premier paiement  
→ solde restant  
→ deuxième paiement  
→ clôture.

---

# 94. RÉSUMÉ DU WORKFLOW CIBLE

**ORDRE DE PAIEMENT SIGNÉ**

↓

**PAIEMENT CRÉÉ AUTOMATIQUEMENT**

↓

**TRANSMISSION À L’AGENCE COMPTABLE**

↓

**COMPTABLE**

Prise en charge et préparation

↓

**CHEF COMPTABLE**

Contrôle / validation

↓

**AGENT COMPTABLE**

Validation / signature

↓

**EXÉCUTION DU PAIEMENT**

Virement / Chèque / Caisse

↓

**PREUVE DE PAIEMENT**

↓

**RAPPROCHEMENT**

↓

**ARCHIVAGE GED**

↓

**CLÔTURE**

---

# 95. VISION CIBLE

Le module PAIEMENT doit constituer le **point final de vérité financière de la chaîne de dépense**.

Il doit permettre de démontrer :

- que l’Ordre de Paiement existe ;
- que le bénéficiaire est correctement identifié ;
- que les coordonnées de règlement sont valides ;
- que les contrôles comptables ont été réalisés ;
- que le paiement a été autorisé ;
- que les fonds ont effectivement été transférés ou remis ;
- que la preuve du règlement existe ;
- que le paiement est rapproché ;
- que toute l’opération est traçable.

Le module ne doit donc pas être un simple formulaire de règlement.

Il doit devenir un véritable dispositif numérique de :

**prise en charge comptable**,  
**contrôle**,  
**validation**,  
**exécution**,  
**preuve**,  
**rapprochement**,  
**traçabilité**,  
**séparation des fonctions**,  
**gestion documentaire**,  
et **clôture financière de la dépense**.