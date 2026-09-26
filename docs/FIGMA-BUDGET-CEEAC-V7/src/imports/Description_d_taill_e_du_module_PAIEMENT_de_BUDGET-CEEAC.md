# DESCRIPTION DÉTAILLÉE DU MODULE PAIEMENT  
## Application BUDGET-CEEAC

---

# 1. Présentation générale

Le module **PAIEMENT** constitue la cinquième et dernière étape opérationnelle de la chaîne d’exécution de la dépense dans **BUDGET-CEEAC**.

Il intervient après :

1. l’**Expression de Besoin** ;
2. l’**Engagement** ;
3. la **Liquidation** ;
4. l’**Ordonnancement** ;
5. la signature définitive de l’**Ordre de Paiement** par l’Ordonnateur compétent.

Le Paiement correspond à la phase comptable au cours de laquelle l’**Agence Comptable** procède aux contrôles nécessaires puis exécute matériellement le règlement au profit du créancier.

Il constitue donc l’aboutissement financier du dossier de dépense.

Le module doit garantir qu’aucun règlement n’est exécuté sans :

- Ordonnancement valide ;
- Ordre de Paiement signé ;
- créancier correctement identifié ;
- montant définitivement arrêté ;
- coordonnées de paiement vérifiées ;
- pièces justificatives complètes ;
- contrôles comptables réalisés ;
- disponibilité des moyens de règlement ;
- autorisation de l’Agent Comptable ;
- traçabilité complète de l’opération.

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

Le module PAIEMENT constitue la dernière phase du dossier courant de dépense.

Il ne doit cependant pas rompre la continuité fonctionnelle avec les étapes précédentes.

L’Agence Comptable doit pouvoir consulter l’intégralité du dossier ayant conduit à l’ordre de payer.

---

# 3. Principe fondamental

Dans BUDGET-CEEAC, le dossier de Paiement ne doit normalement pas être créé manuellement.

Le principe cible est :

> **Ordre de Paiement définitivement signé → création automatique du dossier de Paiement.**

Après signature de l’Ordonnancement :

1. le document signé est figé ;
2. le dossier de Paiement est créé ;
3. les données nécessaires sont héritées ;
4. les pièces justificatives sont mises à disposition ;
5. le dossier est transmis automatiquement à l’Agence Comptable ;
6. une tâche est créée pour les agents compétents.

Il ne doit pas exister de bouton intermédiaire du type :

**« Créer le Paiement »**

ou :

**« Envoyer à l’Agence Comptable »**

lorsque l’Ordre de Paiement a été définitivement signé.

---

# 4. Finalité du module

Le module PAIEMENT doit répondre à quatre questions principales.

## 4.1 L’ordre de payer est-il régulier ?

L’Agence Comptable doit pouvoir contrôler :

- l’existence de l’Ordonnancement ;
- la signature de l’Ordonnateur ;
- la Liquidation correspondante ;
- le service fait ;
- le montant ;
- les pièces justificatives ;
- l’identité du créancier.

## 4.2 À qui faut-il payer ?

Le système doit identifier précisément :

- le bénéficiaire ;
- le créancier ;
- le compte bancaire ;
- le titulaire du compte ;
- ou le bénéficiaire physique du règlement selon le mode utilisé.

## 4.3 Combien faut-il payer ?

Le système doit déterminer :

- le montant ordonnancé ;
- le montant éventuellement déjà payé ;
- le montant restant à payer ;
- le montant du règlement courant.

## 4.4 Comment la dette est-elle éteinte ?

Après exécution du règlement, le système doit :

- enregistrer la preuve ;
- actualiser le montant payé ;
- mettre à jour le reliquat ;
- actualiser le statut du dossier ;
- alimenter le reporting budgétaire et comptable ;
- permettre le rapprochement bancaire ou de caisse.

---

# 5. Objectifs fonctionnels

Le module doit notamment permettre de :

1. générer automatiquement un Paiement après signature de l’Ordonnancement ;
2. transmettre automatiquement le dossier à l’Agence Comptable ;
3. permettre aux Comptables et Chefs Comptables de traiter le dossier ;
4. assurer la validation définitive par l’Agent Comptable ;
5. vérifier la régularité du dossier ;
6. contrôler l’identité du bénéficiaire ;
7. contrôler les coordonnées bancaires ;
8. gérer plusieurs modes de paiement ;
9. préparer les ordres de virement ;
10. gérer les chèques ;
11. gérer les règlements par caisse lorsqu’ils sont autorisés ;
12. enregistrer les références bancaires ;
13. gérer les paiements partiels lorsque cela est autorisé ;
14. empêcher les doubles paiements ;
15. enregistrer les preuves de règlement ;
16. gérer les échecs et rejets bancaires ;
17. permettre les rapprochements ;
18. produire les documents officiels ;
19. assurer la piste d’audit ;
20. clôturer automatiquement la dépense après extinction complète de la dette.

---

# 6. Génération automatique du Paiement

Lorsque l’Ordre de Paiement est signé :

1. l’Ordonnancement passe au statut **SIGNÉ** ;
2. le document officiel est figé ;
3. le système génère le Paiement ;
4. un numéro unique est attribué ;
5. les données sont héritées ;
6. les pièces justificatives sont liées ;
7. le dossier est transmis à l’Agence Comptable ;
8. une tâche est créée ;
9. les acteurs compétents sont notifiés.

La création doit être **idempotente**.

Une même signature ne doit jamais générer plusieurs dossiers de Paiement accidentels.

---

# 7. Séparation Ordonnateur / Comptable

Le module doit respecter le principe de séparation des fonctions entre :

- l’**Ordonnateur**, qui autorise la dépense ;
- le **Comptable**, qui contrôle et exécute le paiement.

L’Ordonnateur ne doit pas pouvoir exécuter matériellement le paiement dans le système.

L’Agence Comptable ne doit pas modifier arbitrairement la décision administrative ayant conduit à l’Ordre de Paiement.

---

# 8. Dossier numérique unique

Le Paiement demeure rattaché au même dossier fonctionnel.

Exemple :

**DEP-2026-000458**

avec :

- EB-2026-000458 ;
- ENG-2026-000458 ;
- LIQ-2026-000458 ;
- ORD-2026-000458 ;
- PAY-2026-000458.

Depuis le module Paiement, l’Agence Comptable doit pouvoir consulter toute la chaîne.

---

# 9. Données héritées de l’Ordonnancement

Le Paiement doit récupérer automatiquement :

- numéro de l’Ordonnancement ;
- numéro de l’Ordre de Paiement ;
- numéro de Liquidation ;
- numéro d’Engagement ;
- numéro EB ;
- exercice budgétaire ;
- objet ;
- service initiateur ;
- créancier ;
- bénéficiaire ;
- fournisseur ;
- montant engagé ;
- montant liquidé ;
- montant ordonnancé ;
- montant net à payer ;
- taxes ;
- retenues ;
- imputations budgétaires ;
- références PAP ;
- contrats ;
- factures ;
- service fait ;
- pièces justificatives ;
- signature de l’Ordonnateur ;
- historique utile.

---

# 10. Protection des données héritées

Les données administratives et financières validées doivent être protégées.

L’Agence Comptable ne doit notamment pas pouvoir modifier librement :

- le montant ordonnancé ;
- l’objet ;
- la ligne budgétaire ;
- la facture ;
- la Liquidation ;
- le bénéficiaire prévu par l’Ordonnancement.

En présence d’une anomalie majeure, le dossier doit être **retourné formellement** plutôt que corrigé silencieusement.

---

# 11. Acteurs du module

Les principaux acteurs sont :

### Comptable

Il peut :

- recevoir les dossiers ;
- effectuer les contrôles ;
- préparer le règlement ;
- renseigner les informations de paiement ;
- joindre les justificatifs ;
- transmettre au niveau supérieur.

### Chef Comptable

Il peut notamment :

- superviser les contrôles ;
- vérifier les dossiers préparés ;
- retourner pour correction ;
- valider la préparation ;
- transmettre à l’Agent Comptable.

### Agent Comptable

Il constitue le niveau de validation comptable définitif.

Il peut :

- contrôler ;
- approuver ;
- rejeter ;
- retourner ;
- signer ;
- autoriser l’exécution du règlement ;
- constater l’exécution du paiement.

Les habilitations précises doivent rester paramétrables.

---

# 12. Visibilité à l’Agence Comptable

Tous les personnels habilités de l’Agence Comptable doivent pouvoir accéder aux dossiers correspondant à leurs fonctions.

L’accès ne doit pas être limité artificiellement à l’Agent Comptable.

Les rôles tels que :

- Comptable ;
- Chef Comptable ;
- Agent Comptable

doivent pouvoir intervenir conformément à leurs habilitations respectives.

---

# 13. Contrôle comptable préalable

Avant tout paiement, le Comptable doit pouvoir vérifier :

- qualité de l’Ordonnateur ;
- signature ;
- disponibilité des pièces ;
- identité du créancier ;
- conformité du bénéficiaire ;
- montant ordonnancé ;
- absence de paiement antérieur ;
- coordonnées de règlement ;
- cohérence documentaire ;
- éventuelles oppositions ou restrictions ;
- règles comptables applicables.

---

# 14. Contrôle de l’identité du créancier

Le système doit afficher de manière explicite :

- raison sociale ou nom ;
- identifiant du tiers ;
- type de tiers ;
- identification fiscale lorsqu’applicable ;
- adresse ;
- coordonnées ;
- références bancaires ;
- statut.

Il doit réduire les risques de paiement au mauvais bénéficiaire.

---

# 15. Coordonnées bancaires

Pour les virements, le dossier doit gérer notamment :

- titulaire du compte ;
- établissement bancaire ;
- agence ;
- numéro de compte ;
- code banque ;
- code guichet ;
- clé éventuelle ;
- IBAN lorsqu’applicable ;
- SWIFT/BIC pour les opérations internationales ;
- devise du compte ;
- pays.

Les champs exacts doivent être configurables selon la zone bancaire.

---

# 16. Sécurisation des coordonnées bancaires

Toute modification d’un compte bancaire doit être considérée comme une opération sensible.

Elle doit entraîner :

- identification de l’auteur ;
- horodatage ;
- conservation de l’ancienne valeur ;
- justification ;
- contrôle renforcé ;
- éventuellement double validation.

Le système doit signaler un changement récent de coordonnées bancaires avant paiement.

---

# 17. Référentiel des comptes bénéficiaires

Les coordonnées du créancier doivent provenir du référentiel central des tiers.

Le module Paiement ne doit pas créer un référentiel parallèle non synchronisé.

Plusieurs comptes peuvent éventuellement être associés à un tiers, mais le compte utilisé doit être clairement identifié et validé.

---

# 18. Modes de paiement

Le module doit gérer au minimum les modes suivants :

### Virement bancaire

Mode privilégié pour les règlements bancaires.

### Chèque

Lorsque ce mode est autorisé.

### Caisse de l’Agence Comptable

Pour les opérations autorisées par les règles internes.

D’autres modes peuvent être ajoutés par paramétrage lorsque le cadre institutionnel l’exige.

---

# 19. Paramétrage des modes de paiement

Chaque mode doit comporter :

- code ;
- libellé ;
- statut ;
- plafond éventuel ;
- devise ;
- pièces obligatoires ;
- acteurs autorisés ;
- règles de validation ;
- informations nécessaires.

---

# 20. Sélection du mode de paiement

Le système peut proposer automatiquement le mode privilégié en fonction :

- du type de bénéficiaire ;
- du montant ;
- de la devise ;
- du pays ;
- du type de dépense ;
- des informations bancaires disponibles.

L’utilisateur habilité conserve uniquement les choix autorisés.

---

# 21. Paiement par virement bancaire

Le dossier doit pouvoir enregistrer :

- banque émettrice ;
- compte débiteur ;
- banque bénéficiaire ;
- compte bénéficiaire ;
- montant ;
- devise ;
- date d’exécution ;
- référence bancaire ;
- libellé ;
- statut.

---

# 22. Ordre de virement

Le système doit pouvoir produire un ordre de virement contenant notamment :

- référence ;
- bénéficiaire ;
- compte ;
- banque ;
- montant ;
- devise ;
- motif ;
- date ;
- autorisations ;
- références du dossier.

Le document peut être généré en PDF et, lorsque l’intégration bancaire existe, sous un format électronique compatible.

---

# 23. Paiement par chèque

Pour un chèque, le système doit gérer :

- numéro de chèque ;
- banque ;
- compte ;
- bénéficiaire ;
- montant ;
- date d’émission ;
- date de remise ;
- personne ayant retiré le chèque ;
- pièce d’identité éventuelle ;
- accusé de réception ;
- statut.

---

# 24. Paiement par caisse

Lorsque le règlement par caisse est autorisé, le système doit permettre de renseigner :

- caisse ;
- référence ;
- bénéficiaire ;
- montant ;
- date ;
- motif ;
- pièce d’identité éventuelle ;
- bénéficiaire physique ;
- reçu ;
- émargement.

Le respect des plafonds de caisse doit être contrôlé automatiquement lorsque ceux-ci sont paramétrés.

---

# 25. Comptes de trésorerie

Le module doit pouvoir identifier la source du règlement :

- compte bancaire ;
- caisse ;
- compte spécial ;
- compte projet ;
- compte partenaire ;
- autre compte autorisé.

Le compte débiteur doit être choisi parmi les comptes actifs et autorisés.

---

# 26. Disponibilité de trésorerie

Le Paiement doit distinguer :

- disponibilité budgétaire ;
- et disponibilité de trésorerie.

Une dépense peut avoir été régulièrement budgétée et ordonnancée tout en nécessitant une programmation de trésorerie.

Le module doit donc pouvoir afficher ou intégrer :

- solde du compte lorsque disponible ;
- plafond de paiement ;
- disponibilité ;
- priorisation ;
- programmation éventuelle.

---

# 27. Paiement total

Un Paiement est total lorsque :

**Montant payé = montant ordonnancé restant dû**

Exemple :

Montant ordonnancé : **12 000 000 XAF**  
Montant payé : **12 000 000 XAF**  
Reliquat : **0 XAF**

Le dossier peut alors être clôturé.

---

# 28. Paiement partiel

Lorsque les règles l’autorisent, un Ordonnancement peut donner lieu à plusieurs règlements.

Exemple :

Montant ordonnancé : **20 000 000 XAF**

Premier Paiement : **12 000 000 XAF**

Second Paiement : **8 000 000 XAF**

Le système doit suivre :

- montant ordonnancé ;
- montant déjà payé ;
- nouveau paiement ;
- cumul payé ;
- reste à payer.

---

# 29. Contrôle du plafond

La règle fondamentale est :

> **Total payé ≤ montant ordonnancé autorisé**

Aucun dépassement ne doit être possible.

---

# 30. Reliquat à payer

Le système doit calculer automatiquement :

**Reliquat = montant ordonnancé – paiements exécutés**

Le dossier reste ouvert tant que le reliquat n’est pas nul, sauf annulation ou traitement réglementaire spécifique.

---

# 31. Prévention du double paiement

Le système doit empêcher qu’un même Ordre de Paiement ou une même facture soit réglé deux fois.

Les contrôles doivent rechercher notamment :

- même OP ;
- même facture ;
- même bénéficiaire ;
- même montant ;
- même référence bancaire ;
- même dossier ;
- même ordre de virement.

Les alertes doivent être bloquantes lorsque le doublon est confirmé.

---

# 32. Statuts du règlement

Un paiement doit pouvoir connaître plusieurs états :

- À préparer ;
- En préparation ;
- Contrôle comptable ;
- À compléter ;
- Retourné ;
- En validation ;
- Validé ;
- À exécuter ;
- Ordre transmis ;
- En cours bancaire ;
- Exécuté ;
- Rejeté par la banque ;
- Annulé ;
- Partiellement payé ;
- Totalement payé ;
- Rapproché ;
- Clôturé.

---

# 33. Workflow cible de l’Agence Comptable

Le workflow standard peut être organisé comme suit :

### Niveau 1 — Comptable

Le Comptable :

- reçoit le dossier ;
- vérifie les pièces ;
- vérifie le bénéficiaire ;
- renseigne le compte ;
- choisit le mode de paiement ;
- prépare l’opération ;
- transmet au Chef Comptable.

### Niveau 2 — Chef Comptable

Le Chef Comptable :

- contrôle la préparation ;
- vérifie la régularité ;
- retourne si nécessaire ;
- valide ;
- transmet à l’Agent Comptable.

### Niveau 3 — Agent Comptable

L’Agent Comptable :

- effectue le contrôle définitif ;
- autorise ;
- valide ;
- signe le cas échéant ;
- ordonne l’exécution comptable du règlement.

Le circuit réel doit rester paramétrable.

---

# 34. Suppression des étapes manuelles inutiles

Le module ne doit pas ajouter artificiellement des étapes de soumission sans valeur métier.

Une fois le traitement d’un niveau validé, le dossier doit passer automatiquement à l’acteur suivant.

Après validation finale du paiement :

- l’état doit être actualisé ;
- les documents doivent être générés ;
- le dossier doit passer automatiquement au statut approprié.

---

# 35. Retour pour correction

Un dossier peut être retourné lorsqu’une anomalie est détectée.

Le retour doit obligatoirement contenir :

- motif ;
- auteur ;
- date ;
- niveau de retour ;
- observations ;
- pièces éventuelles.

Le dossier ne doit pas être supprimé.

---

# 36. Retour vers une étape antérieure

Certaines anomalies peuvent nécessiter un retour au :

- Paiement ;
- Ordonnancement ;
- Liquidation ;
- exceptionnellement Engagement.

Le système doit choisir l’étape correcte selon la nature de l’anomalie.

Le retour doit conserver toute la piste d’audit.

---

# 37. Rejet comptable

Lorsque le paiement ne peut pas être exécuté, l’Agence Comptable peut prononcer un rejet motivé.

Le rejet doit enregistrer :

- motif ;
- catégorie ;
- auteur ;
- date ;
- observations ;
- référence réglementaire éventuelle ;
- pièces.

---

# 38. Distinction entre rejet interne et rejet bancaire

Le système doit distinguer :

### Rejet interne

Décidé avant transmission à la banque.

### Rejet bancaire

Survient après transmission de l’ordre de règlement.

Exemples de causes :

- compte fermé ;
- coordonnées erronées ;
- compte bloqué ;
- bénéficiaire incorrect ;
- insuffisance de provision ;
- problème technique.

---

# 39. Traitement d’un rejet bancaire

En cas de rejet bancaire :

1. le paiement ne doit pas être considéré comme exécuté ;
2. le motif est enregistré ;
3. le justificatif bancaire est attaché ;
4. le dossier revient en traitement ;
5. une correction peut être effectuée selon les habilitations ;
6. une nouvelle tentative est historisée.

---

# 40. Date effective de paiement

Le système doit distinguer :

- date de préparation ;
- date de validation ;
- date d’émission ;
- date de transmission ;
- date de valeur ;
- date d’exécution effective.

La date officielle de paiement doit correspondre à la règle comptable paramétrée.

---

# 41. Preuve de paiement

Tout règlement exécuté doit disposer d’une preuve.

Exemples :

- avis de débit ;
- confirmation bancaire ;
- reçu ;
- copie du chèque ;
- accusé de réception ;
- bordereau de caisse ;
- référence électronique.

Aucun paiement ne doit être clôturé sans preuve lorsqu’elle est exigée.

---

# 42. Justificatifs du Paiement

La GED doit pouvoir contenir :

- Ordre de Paiement ;
- ordre de virement ;
- bordereau bancaire ;
- avis de débit ;
- chèque ;
- reçu ;
- relevé bancaire ;
- bordereau de caisse ;
- accusé de réception ;
- justificatif de transfert ;
- rejet bancaire ;
- autres documents comptables.

---

# 43. GED intégrée

Chaque pièce doit conserver :

- type ;
- catégorie ;
- version ;
- auteur ;
- date ;
- source ;
- statut ;
- lien avec le Paiement ;
- niveau de confidentialité.

---

# 44. Écriture comptable

Le module doit être conçu pour permettre l’intégration avec la comptabilité.

Lors de l’exécution du paiement, il doit pouvoir générer ou transmettre les informations nécessaires à la comptabilisation.

Cela peut inclure :

- comptes comptables ;
- journal ;
- tiers ;
- référence ;
- date ;
- débit ;
- crédit ;
- devise ;
- analytique ;
- pièces.

La comptabilisation détaillée doit respecter le référentiel comptable configuré dans BUDGET-CEEAC ou dans le système comptable intégré.

---

# 45. Interface avec la comptabilité générale

BUDGET-CEEAC doit éviter les doubles saisies.

Le Paiement doit pouvoir alimenter automatiquement :

- comptabilité générale ;
- comptabilité auxiliaire ;
- comptabilité budgétaire ;
- suivi de trésorerie ;
- reporting.

---

# 46. Rapprochement bancaire

Le module doit prévoir une fonctionnalité de rapprochement permettant de comparer :

- paiements enregistrés ;
- ordres transmis ;
- mouvements bancaires ;
- relevés.

Un Paiement exécuté peut ainsi passer ensuite au statut :

**RAPPROCHÉ**

---

# 47. États de rapprochement

Le système doit identifier :

- paiement rapproché ;
- paiement non rapproché ;
- montant différent ;
- date différente ;
- mouvement bancaire sans correspondance ;
- paiement annulé ;
- rejet bancaire.

---

# 48. Intégration bancaire

Lorsque possible, le module peut être intégré aux établissements bancaires ou plateformes de paiement afin de :

- transmettre les ordres ;
- récupérer les statuts ;
- récupérer les confirmations ;
- automatiser le rapprochement.

Cette intégration doit respecter des exigences renforcées de sécurité.

---

# 49. Traitement par lot

Le module peut permettre la constitution de lots de paiement.

Exemple :

**LOT-PAY-2026-00128**

Un lot peut regrouper plusieurs paiements devant être exécutés via :

- même banque ;
- même compte débiteur ;
- même devise ;
- même date.

---

# 50. Contrôle d’un lot

Avant validation d’un lot, le système doit afficher :

- nombre de paiements ;
- montant total ;
- bénéficiaires ;
- compte débiteur ;
- devise ;
- anomalies ;
- paiements bloqués.

Un paiement non conforme ne doit pas être dissimulé dans un lot.

---

# 51. Signature des lots

Lorsque les règles institutionnelles le prévoient, les lots peuvent nécessiter une validation ou signature.

Le système doit identifier :

- préparateur ;
- contrôleur ;
- validateur ;
- signataire ;
- date ;
- heure.

---

# 52. Paiements en devise

Le module doit pouvoir gérer des paiements en monnaies étrangères.

Il doit conserver :

- devise d’origine ;
- montant en devise ;
- montant de référence en XAF ;
- taux de change ;
- source ;
- date du taux ;
- frais bancaires éventuels.

---

# 53. Frais bancaires

Le système doit pouvoir enregistrer :

- frais de transfert ;
- commissions ;
- frais correspondants ;
- montant initial ;
- montant effectivement débité.

Les règles de prise en charge des frais doivent être paramétrables.

---

# 54. Retenues et reversements

Certaines retenues opérées à la Liquidation peuvent nécessiter un reversement distinct.

Le système doit pouvoir suivre :

- nature de la retenue ;
- montant ;
- organisme bénéficiaire ;
- état du reversement ;
- référence.

---

# 55. Écran de liste des Paiements

La liste principale doit afficher notamment :

- N° Paiement ;
- N° OP ;
- N° ORD ;
- bénéficiaire ;
- objet ;
- montant ordonnancé ;
- montant payé ;
- reste à payer ;
- mode ;
- banque ;
- statut ;
- acteur actuel ;
- date ;
- délai.

---

# 56. Filtres

Le module doit proposer des filtres par :

- exercice ;
- numéro PAY ;
- numéro OP ;
- numéro ORD ;
- numéro LIQ ;
- numéro ENG ;
- numéro EB ;
- bénéficiaire ;
- fournisseur ;
- banque ;
- compte ;
- mode de paiement ;
- statut ;
- période ;
- montant ;
- département ;
- direction ;
- ligne budgétaire ;
- PAP/Hors PAP ;
- source de financement ;
- retard ;
- acteur.

---

# 57. Page détail du Paiement

La page doit présenter un bandeau principal avec :

- numéro PAY ;
- statut ;
- bénéficiaire ;
- montant ;
- mode de paiement ;
- banque ;
- référence OP.

La progression doit afficher :

**EB ✓ → ENG ✓ → LIQ ✓ → ORD ✓ → PAY ●**

Après exécution :

**EB ✓ → ENG ✓ → LIQ ✓ → ORD ✓ → PAY ✓**

---

# 58. Onglets du dossier

La page détail peut comporter :

- Synthèse ;
- Ordonnancement ;
- Liquidation ;
- Engagement ;
- EB ;
- Bénéficiaire ;
- Coordonnées bancaires ;
- Paiement ;
- Pièces ;
- Contrôles ;
- Workflow ;
- Observations ;
- Historique ;
- Documents générés ;
- Journal d’audit ;
- Rapprochement.

---

# 59. Bandeau de situation

Exemple :

**Dernière action : Préparation du règlement**  
**Réalisée par : Comptable**  
**Date : 07/09/2026 à 15:40**  
**Étape actuelle : Contrôle comptable**  
**Acteur attendu : Chef Comptable**

Puis :

**Étape actuelle : Validation définitive du Paiement**  
**Acteur attendu : Agent Comptable**

---

# 60. Formulaire de préparation du paiement

Le formulaire peut être organisé en étapes.

### Étape 1 — Dossier

Informations héritées en lecture seule.

### Étape 2 — Bénéficiaire

Vérification du tiers.

### Étape 3 — Mode de paiement

Virement, chèque ou caisse.

### Étape 4 — Coordonnées

Banque, compte, caisse ou chèque.

### Étape 5 — Montant

Montant ordonnancé, déjà payé, montant courant et reliquat.

### Étape 6 — Pièces

Ajout des justificatifs.

### Étape 7 — Contrôle

Résumé avant validation.

---

# 61. Résumé financier permanent

Le formulaire doit afficher un résumé du type :

| Élément | Montant |
|---|---:|
| Engagement | 20 000 000 XAF |
| Liquidation | 19 500 000 XAF |
| Ordonnancement | 19 500 000 XAF |
| Déjà payé | 10 000 000 XAF |
| Paiement courant | 9 500 000 XAF |
| Reste après paiement | 0 XAF |

---

# 62. Contrôles automatiques

Avant validation, le système doit vérifier :

### Origine

- Ordonnancement existant ;
- OP signé ;
- absence d’annulation.

### Bénéficiaire

- tiers valide ;
- compte valide ;
- cohérence du titulaire.

### Montant

- montant positif ;
- absence de dépassement ;
- montant restant suffisant.

### Documents

- pièces obligatoires présentes ;
- justificatifs valides.

### Sécurité

- absence de doublon ;
- absence de modification suspecte ;
- utilisateur habilité.

---

# 63. Alertes critiques

Le système doit notamment signaler :

- compte bancaire modifié récemment ;
- compte différent du référentiel ;
- bénéficiaire différent ;
- facture déjà payée ;
- OP déjà payé ;
- montant excessif ;
- justificatif manquant ;
- compte bancaire inactif ;
- paiement dupliqué ;
- rejet bancaire antérieur ;
- incohérence de devise.

---

# 64. Mes tâches

La rubrique **Mes tâches** doit afficher les dossiers nécessitant l’intervention de l’utilisateur.

La liste est triée :

> **du plus récent au plus ancien.**

Elle doit présenter :

- numéro ;
- bénéficiaire ;
- objet ;
- montant ;
- mode ;
- statut ;
- date de réception ;
- délai ;
- priorité ;
- action attendue.

---

# 65. Tableau de bord PAIEMENT

Le tableau de bord doit afficher :

- Paiements générés ;
- à préparer ;
- en contrôle ;
- en validation ;
- à exécuter ;
- exécutés ;
- partiellement payés ;
- rejetés ;
- retournés ;
- en retard ;
- non rapprochés ;
- montant à payer ;
- montant payé ;
- reste à payer.

Les cartes doivent être cliquables.

---

# 66. Indicateurs

Le module doit alimenter le reporting avec notamment :

- taux de paiement ;
- montant ordonnancé ;
- montant payé ;
- reste à payer ;
- délai moyen Ordonnancement → Paiement ;
- délai moyen Agence Comptable ;
- paiements par banque ;
- paiements par mode ;
- paiements par bénéficiaire ;
- paiements par département ;
- paiements PAP ;
- paiements Hors PAP ;
- paiements par source de financement ;
- taux de rejet ;
- taux de rapprochement bancaire.

---

# 67. Documents générés

Le système doit pouvoir produire :

- fiche de Paiement ;
- ordre de virement ;
- bordereau de Paiement ;
- bordereau bancaire ;
- bordereau de caisse ;
- reçu ;
- état de contrôle comptable ;
- historique ;
- état de rapprochement ;
- attestation ou preuve interne de règlement.

---

# 68. Numérotation

Chaque Paiement doit posséder un numéro unique.

Exemple :

**PAY/CEEAC/2026/000145**

Les lots peuvent utiliser :

**LOT-PAY/CEEAC/2026/000032**

La numérotation doit être paramétrable.

---

# 69. Signature et validation électronique

Les validations peuvent inclure :

- signature électronique ;
- horodatage ;
- certificat ;
- QR Code ;
- empreinte cryptographique ;
- identifiant du signataire.

Les actes sensibles de l’Agent Comptable doivent être protégés.

---

# 70. Historisation

Toute modification doit conserver :

- ancienne valeur ;
- nouvelle valeur ;
- utilisateur ;
- rôle ;
- date ;
- heure ;
- motif ;
- étape ;
- version.

---

# 71. Journal d’audit

Doivent notamment être journalisés :

- création du Paiement ;
- ouverture du dossier ;
- affectation ;
- modification des coordonnées bancaires ;
- préparation ;
- validation ;
- retour ;
- rejet ;
- changement de mode ;
- changement de compte ;
- exécution ;
- ajout d’une preuve ;
- annulation ;
- rejet bancaire ;
- rapprochement ;
- clôture.

---

# 72. Notifications

Le module doit notifier :

- nouveau Paiement ;
- dossier affecté ;
- dossier à contrôler ;
- dossier retourné ;
- dossier à valider ;
- paiement exécuté ;
- paiement rejeté ;
- anomalie bancaire ;
- paiement en retard ;
- rapprochement en attente ;
- clôture.

---

# 73. Gestion des délais

Le système doit calculer :

- date de réception ;
- date de prise en charge ;
- date de validation ;
- date d’exécution ;
- délai de traitement ;
- retard.

Des codes visuels doivent identifier les dossiers prioritaires.

---

# 74. Séparation des fonctions

Le module doit empêcher les cumuls incompatibles lorsqu’ils sont interdits.

Par exemple, selon la matrice configurée, un même utilisateur ne doit pas pouvoir :

- préparer ;
- contrôler ;
- valider définitivement

le même paiement.

---

# 75. Cas d’annulation

L’annulation d’un paiement doit distinguer :

### Avant exécution

Le règlement préparé peut être annulé avec justification.

### Après exécution

Une simple suppression est interdite.

Toute correction doit suivre une opération comptable appropriée :

- annulation ;
- contre-passation ;
- remboursement ;
- régularisation,

selon la situation.

---

# 76. Interdiction de suppression physique

Un Paiement validé, exécuté ou rapproché ne doit jamais être supprimé physiquement de la base.

Il doit être conservé avec son statut et son historique.

---

# 77. Clôture du dossier

Lorsque :

- le montant ordonnancé est entièrement payé ;
- les preuves sont enregistrées ;
- le rapprochement requis est effectué ;
- aucune anomalie n’est ouverte,

le dossier peut passer automatiquement au statut :

**CLÔTURÉ**

---

# 78. Impact sur la situation budgétaire

Après Paiement, le système doit actualiser les indicateurs :

- budget disponible ;
- engagé ;
- liquidé ;
- ordonnancé ;
- payé.

Pour une ligne donnée, il doit être possible de visualiser toute la chaîne financière.

---

# 79. Situation d’une ligne budgétaire

Exemple :

| Situation | Montant |
|---|---:|
| Crédit actuel | 100 000 000 XAF |
| Engagé | 70 000 000 XAF |
| Liquidé | 60 000 000 XAF |
| Ordonnancé | 55 000 000 XAF |
| Payé | 50 000 000 XAF |

Cette vue doit être disponible au niveau du reporting budgétaire.

---

# 80. PAP et Paiement

Pour les dépenses PAP, le Paiement doit conserver le lien avec :

- Pilier ;
- Axe ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateur ;
- source de financement.

Cela permet de rapprocher l’exécution financière des résultats programmatiques.

---

# 81. Suivi des décaissements PAP

Le module doit permettre de connaître :

- budget PAP ;
- engagements PAP ;
- liquidations PAP ;
- ordonnancements PAP ;
- paiements PAP ;
- taux de décaissement.

---

# 82. Recherche globale

Un Paiement doit pouvoir être retrouvé par :

- numéro PAY ;
- OP ;
- ORD ;
- LIQ ;
- ENG ;
- EB ;
- bénéficiaire ;
- numéro de facture ;
- référence bancaire ;
- numéro de chèque ;
- montant ;
- compte bancaire ;
- service ;
- contrat.

---

# 83. Reporting exportable

Les données doivent pouvoir être exportées, selon les droits, vers :

- Excel ;
- CSV ;
- PDF ;
- outils BI ;
- API de reporting.

---

# 84. Architecture fonctionnelle recommandée

Le module peut être structuré en sous-composants :

**PAY-01 — Tableau de bord**  
Indicateurs et alertes.

**PAY-02 — Liste des Paiements**  
Recherche, filtres et accès.

**PAY-03 — Dossier Paiement**  
Vue consolidée.

**PAY-04 — Contrôle comptable**  
Vérification du dossier.

**PAY-05 — Bénéficiaire**  
Contrôle du tiers.

**PAY-06 — Coordonnées bancaires**  
Gestion sécurisée.

**PAY-07 — Préparation du règlement**  
Mode, compte, montant.

**PAY-08 — Validation**  
Chef Comptable / Agent Comptable.

**PAY-09 — Exécution**  
Virement, chèque ou caisse.

**PAY-10 — Lots de Paiement**  
Regroupements et transmissions.

**PAY-11 — GED**  
Pièces justificatives.

**PAY-12 — Banque / Caisse**  
Suivi des mouvements.

**PAY-13 — Rapprochement**  
Contrôle post-paiement.

**PAY-14 — Documents**  
PDF et justificatifs.

**PAY-15 — Audit**  
Historique et journal.

**PAY-16 — Reporting**  
Statistiques.

**PAY-17 — Paramétrage**  
Modes, comptes, workflows, seuils et règles.

---

# 85. Règles de gestion essentielles

**RG-PAY-001**  
Un Paiement doit provenir d’un Ordonnancement signé et valide.

**RG-PAY-002**  
Le dossier de Paiement est généré automatiquement après signature de l’OP.

**RG-PAY-003**  
La transmission à l’Agence Comptable est automatique.

**RG-PAY-004**  
Les données structurelles sont héritées de l’Ordonnancement.

**RG-PAY-005**  
Le montant payé ne peut excéder le montant ordonnancé restant.

**RG-PAY-006**  
Le bénéficiaire doit correspondre au créancier autorisé.

**RG-PAY-007**  
Les coordonnées bancaires doivent être contrôlées avant virement.

**RG-PAY-008**  
Toute modification de coordonnées bancaires doit être auditée.

**RG-PAY-009**  
Le mode de paiement doit être autorisé.

**RG-PAY-010**  
Aucun règlement ne peut être exécuté sans validation comptable requise.

**RG-PAY-011**  
Les Comptables, Chefs Comptables et Agents Comptables accèdent au module selon leurs permissions.

**RG-PAY-012**  
Le système doit empêcher les doubles paiements.

**RG-PAY-013**  
Un paiement partiel doit conserver le reliquat.

**RG-PAY-014**  
La somme des paiements ne peut dépasser l’Ordonnancement.

**RG-PAY-015**  
Tout rejet doit être motivé.

**RG-PAY-016**  
Un rejet bancaire ne constitue pas un paiement exécuté.

**RG-PAY-017**  
Toute preuve de paiement doit être rattachée au dossier.

**RG-PAY-018**  
Une opération exécutée ne doit pas être supprimée.

**RG-PAY-019**  
Les corrections après paiement doivent suivre des opérations de régularisation.

**RG-PAY-020**  
Chaque opération sensible doit être journalisée.

**RG-PAY-021**  
La séparation Ordonnateur / Comptable doit être respectée.

**RG-PAY-022**  
La séparation des fonctions internes à l’Agence Comptable doit être configurable.

**RG-PAY-023**  
Les documents officiels doivent être versionnés et figés.

**RG-PAY-024**  
Le rapprochement bancaire doit conserver la référence du mouvement.

**RG-PAY-025**  
Les paiements en devise doivent conserver le taux utilisé.

**RG-PAY-026**  
Les coordonnées bancaires sensibles doivent être protégées.

**RG-PAY-027**  
La clôture n’est possible que lorsque les conditions de règlement sont remplies.

**RG-PAY-028**  
Le dossier doit conserver toute la chaîne EB → ENG → LIQ → ORD → PAY.

**RG-PAY-029**  
La situation budgétaire doit être actualisée après exécution.

**RG-PAY-030**  
Le reporting doit distinguer ordonnancé, payé et reste à payer.

---

# 86. Cycle fonctionnel cible

Le cycle de référence est :

**ORDRE DE PAIEMENT SIGNÉ**  
↓  
**Génération automatique du Paiement**  
↓  
**Transmission automatique à l’Agence Comptable**  
↓  
**Affectation au Comptable**  
↓  
**Contrôle du dossier**  
↓  
**Contrôle du bénéficiaire et des coordonnées**  
↓  
**Préparation du règlement**  
↓  
**Contrôle du Chef Comptable**  
↓  
**Validation de l’Agent Comptable**  
↓  
**Exécution du virement / chèque / caisse**  
↓  
**Enregistrement de la preuve**  
↓  
**Actualisation du montant payé**  
↓  
**Rapprochement**  
↓  
**Clôture**

---

# 87. Chaîne complète BUDGET-CEEAC

Le fonctionnement cible devient :

**Expression de Besoin approuvée**  
↓  
**Engagement généré automatiquement**  
↓  
**Engagement visé**  
↓  
**Liquidation générée automatiquement**  
↓  
**Service fait certifié**  
↓  
**Liquidation validée**  
↓  
**Ordonnancement généré automatiquement**  
↓  
**Ordre de Paiement signé**  
↓  
**Paiement généré automatiquement**  
↓  
**Contrôle par l’Agence Comptable**  
↓  
**Règlement**  
↓  
**Preuve de paiement**  
↓  
**Rapprochement**  
↓  
**Clôture du dossier**

---

# 88. Principes UX/UI

Le module doit présenter une interface particulièrement sécurisée et lisible.

Les principes UX recommandés sont :

- affichage du montant à payer toujours visible ;
- identité du bénéficiaire clairement mise en évidence ;
- compte bancaire visible mais données sensibles protégées ;
- alertes fortes sur les modifications de compte ;
- timeline complète EB → PAY ;
- bouton d’action adapté au rôle ;
- bandeau indiquant l’acteur attendu ;
- résumé financier permanent ;
- contrôles automatiques avant validation ;
- distinction claire entre « préparé », « validé » et « exécuté ».

---

# 89. Résultat attendu

Le module PAIEMENT de BUDGET-CEEAC doit garantir que tout règlement exécuté correspond à une dépense :

- régulièrement engagée ;
- effectivement liquidée ;
- valablement ordonnancée ;
- correctement signée ;
- comptablement contrôlée ;
- versée au bon bénéficiaire ;
- pour le bon montant ;
- par un moyen autorisé ;
- accompagnée d’une preuve ;
- traçable de bout en bout.

Le Paiement constitue ainsi **l’acte final d’extinction financière de la dette de la Commission envers son créancier**.

Le module doit garantir cinq principes fondamentaux :

### Continuité

Le Paiement hérite automatiquement de l’ensemble du dossier de dépense.

### Séparation des fonctions

L’Ordonnateur autorise ; l’Agence Comptable contrôle et exécute.

### Sécurisation

Les bénéficiaires, comptes, montants et modes de règlement font l’objet de contrôles renforcés.

### Automatisation

La signature définitive de l’Ordre de Paiement génère automatiquement le dossier de Paiement et le transmet à l’Agence Comptable.

### Traçabilité

Chaque contrôle, validation, modification, règlement, preuve, rejet, rapprochement et clôture est historisé.

Le module PAIEMENT clôt ainsi la chaîne intégrée :

> **EXPRESSION DE BESOIN → ENGAGEMENT → LIQUIDATION → ORDONNANCEMENT → PAIEMENT**

et permet à BUDGET-CEEAC d’assurer une traçabilité complète de la dépense depuis l’expression initiale du besoin jusqu’à son règlement définitif.