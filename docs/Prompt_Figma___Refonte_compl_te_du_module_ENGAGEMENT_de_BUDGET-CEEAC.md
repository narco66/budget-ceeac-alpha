# PROMPT FIGMA — REFONTE COMPLÈTE DU MODULE ENGAGEMENT DE BUDGET-CEEAC

## 1. CONTEXTE

Tu travailles sur la maquette Figma existante de l’application **BUDGET-CEEAC**, plateforme intégrée de planification, budgétisation, exécution budgétaire, suivi-évaluation, gestion documentaire et reporting de la Commission de la CEEAC.

Je joins à ce prompt le fichier contenant la **Description détaillée du module ENGAGEMENT de BUDGET-CEEAC**.

Ce fichier constitue désormais la **référence fonctionnelle principale pour le module ENGAGEMENT**.

Ta mission est de procéder à une **refonte complète, profonde et structurée du module ENGAGEMENT dans la maquette Figma existante**, tout en :

- auditant l’existant ;
- conservant les éléments déjà pertinents ;
- corrigeant les incohérences ;
- supprimant les éléments devenus obsolètes ;
- ajoutant toutes les fonctionnalités manquantes ;
- améliorant profondément l’UX/UI ;
- harmonisant le module avec le nouveau module Expression de Besoin ;
- garantissant la cohérence avec la chaîne complète de dépense.

Le résultat attendu ne doit pas être une simple amélioration graphique.

Il doit s’agir d’une **refonte fonctionnelle et UX complète du module ENGAGEMENT**.

---

# 2. SOURCE DE VÉRITÉ

Pour le module ENGAGEMENT, utiliser l’ordre de priorité suivant :

1. **Description détaillée du module ENGAGEMENT jointe au prompt** ;
2. cahier des charges fonctionnel actuel de BUDGET-CEEAC ;
3. référentiel budgétaire ;
4. référentiel organisationnel ;
5. procédures de la chaîne de dépense ;
6. autres descriptions fonctionnelles des modules ;
7. maquette Figma existante.

Si la maquette actuelle entre en contradiction avec la description détaillée jointe, la nouvelle description prévaut.

Ne jamais conserver une règle métier uniquement parce qu’elle existe actuellement dans Figma si elle est devenue incohérente avec la nouvelle procédure.

---

# 3. AUDIT OBLIGATOIRE AVANT TOUTE MODIFICATION

Avant de modifier les interfaces, audite entièrement le module ENGAGEMENT existant.

Recense :

### Éléments conformes
Les écrans, composants, informations et interactions déjà compatibles avec la description jointe.

### Éléments partiellement conformes
Ceux nécessitant :

- enrichissement ;
- correction ;
- repositionnement ;
- amélioration graphique ;
- amélioration ergonomique ;
- adaptation du workflow.

### Éléments obsolètes
Tout ce qui doit être supprimé ou remplacé.

### Éléments manquants
Toutes les fonctionnalités prévues dans la description mais absentes de Figma.

Produis une logique de type :

**Exigence fonctionnelle → Existant → Écart → Action de refonte → Écran concerné**

Aucune exigence importante ne doit rester sans traduction visuelle dans la maquette.

---

# 4. PRINCIPE CENTRAL DU MODULE

Le module ENGAGEMENT ne doit pas être conçu comme un formulaire autonome.

Il constitue la suite directe de l’Expression de Besoin.

Le processus cible est :

**Expression de Besoin approuvée**

↓

**Création automatique de l’Engagement**

↓

**Instruction par le Budget**

↓

**Contrôle de disponibilité et conformité**

↓

**Validation budgétaire**

↓

**Transmission automatique au Contrôleur Financier**

↓

**Contrôle financier**

↓

**Visa**

↓

**Création automatique de la Liquidation**

La maquette doit rendre ce processus immédiatement compréhensible.

---

# 5. HÉRITAGE AUTOMATIQUE DEPUIS L’EXPRESSION DE BESOIN

Lorsqu’un Engagement est créé, il doit reprendre automatiquement toutes les données disponibles dans l’Expression de Besoin approuvée.

La maquette doit donc distinguer clairement :

### Données héritées et verrouillées

Exemples :

- référence EB ;
- exercice ;
- structure initiatrice ;
- service initiateur ;
- objet ;
- justification ;
- PAP/Hors PAP ;
- ligne budgétaire principale ;
- imputations ;
- montant ;
- données PAP ;
- détail des tâches ;
- pièces justificatives ;
- historique.

### Données propres à l’Engagement

Exemples :

- bénéficiaire ;
- références contractuelles ;
- contrôles ;
- informations complémentaires ;
- visa ;
- réservations budgétaires ;
- annotations.

Ne pas obliger l’utilisateur à ressaisir une donnée déjà disponible.

---

# 6. PAGE D’ACCUEIL DU MODULE ENGAGEMENT

Créer ou refondre une page d’accueil permettant d’accéder immédiatement :

- au tableau de bord ;
- à « Mes engagements à traiter » ;
- aux Engagements récents ;
- aux Engagements retournés ;
- aux Engagements en attente de validation ;
- aux Engagements transmis au Contrôle Financier ;
- aux Engagements visés ;
- aux Engagements transformés en Liquidation.

---

# 7. TABLEAU DE BORD ENGAGEMENT

Créer un tableau de bord riche mais lisible.

Prévoir des KPI tels que :

### Dossiers

- Tous les Engagements ;
- À traiter ;
- En préparation ;
- À valider ;
- Retournés ;
- Rejetés ;
- Au Contrôle Financier ;
- Visés ;
- Transformés en Liquidation.

### Finances

- Montant total engagé ;
- Engagements PAP ;
- Engagements Hors PAP ;
- engagements du mois ;
- crédit disponible ;
- taux d’engagement ;
- montant retourné/rejeté.

Les cartes doivent être interactives.

Un clic doit filtrer la liste.

---

# 8. ANALYSES VISUELLES

Prévoir des composants graphiques pertinents :

- engagements par structure ;
- engagements par mois ;
- PAP/Hors PAP ;
- engagements par ligne budgétaire ;
- engagements par bénéficiaire ;
- délais moyens de traitement ;
- répartition par statut.

Ne pas surcharger la page.

Privilégier quelques visualisations réellement utiles.

---

# 9. LISTE DES ENGAGEMENTS

Refondre complètement la liste.

Afficher notamment :

- référence ENG ;
- référence EB ;
- date ;
- objet ;
- structure ;
- PAP/Hors PAP ;
- bénéficiaire ;
- ligne budgétaire ;
- montant ;
- statut ;
- étape ;
- acteur attendu ;
- dernière action ;
- délai.

Prévoir :

- recherche globale ;
- filtres avancés ;
- tris ;
- pagination ;
- exports ;
- vues enregistrées ;
- filtres rapides.

---

# 10. CARTES DE FILTRES RAPIDES

Ajouter des cartes telles que :

**Tous**

**À traiter**

**À compléter**

**À valider**

**Au Contrôle Financier**

**Retournés**

**Rejetés**

**Visés**

**Transformés**

Les cartes affichées doivent dépendre du rôle de l’utilisateur.

---

# 11. PAGE DÉTAIL DE L’ENGAGEMENT

Créer une véritable fiche dossier professionnelle.

En-tête recommandé :

**ENG-2026-000457**

Objet de l’opération

Badges :

**PAP / Hors PAP**

**Statut**

**Priorité éventuelle**

**Montant**

Puis un bandeau workflow transversal.

---

# 12. ORGANISATION PAR ONGLETS

Prévoir notamment :

### Synthèse

### Expression de Besoin

### Budget et imputations

### Détail de l’engagement

### Bénéficiaire

### PAP

### Marché / Contrat

### Pièces justificatives

### Contrôles

### Workflow

### Historique

### Documents générés

### Commentaires

Éviter une page unique excessivement longue.

---

# 13. BANDEAU DE SUIVI DU DOSSIER

Créer un composant homogène avec celui du module EB.

Exemple :

**ÉTAPE ACTUELLE**

Instruction budgétaire

**DERNIÈRE ACTION**

Contrôle effectué par l’Expert Budget

**ACTEUR ATTENDU**

Directeur du Budget

**PROCHAINE ÉTAPE**

Validation puis transmission au Contrôleur Financier

---

# 14. VISION IMMÉDIATE DE LA SITUATION FINANCIÈRE

Créer une carte budgétaire particulièrement visible.

Exemple :

**Budget révisé**  
125 000 000 FCFA

**Déjà engagé**  
70 000 000 FCFA

**Présent engagement**  
10 000 000 FCFA

**Disponible après engagement**  
45 000 000 FCFA

L’utilisateur doit immédiatement comprendre l’impact de l’Engagement sur le Budget.

---

# 15. CONTRÔLE DE DISPONIBILITÉ DES CRÉDITS

Créer un composant de contrôle indiquant :

- budget initial ;
- mouvements ;
- budget révisé ;
- déjà engagé ;
- engagement en cours ;
- disponible avant ;
- disponible après.

Utiliser des états :

**Crédit disponible**

**Attention**

**Crédit insuffisant**

Ne pas se limiter à une alerte rouge.

Expliquer la cause du blocage.

---

# 16. RÉSERVATION BUDGÉTAIRE

La maquette doit matérialiser la notion de réservation de crédits.

Prévoir un état visuel :

**Crédit contrôlé**

puis :

**Crédit réservé**

Avec :

- date ;
- montant ;
- ligne ;
- référence Engagement ;
- acteur ou mécanisme ayant déclenché l’opération.

---

# 17. IMPUTATION MULTI-LIGNES

Le module doit reprendre les imputations de l’EB tout en permettant leur contrôle.

Créer un tableau :

| Ligne | Libellé | Budget révisé | Disponible | Montant ENG | Disponible après |
|---|---|---:|---:|---:|---:|

Afficher :

**Montant Engagement**

**Total imputé**

**Écart**

La validation doit être impossible si les montants ne sont pas équilibrés.

---

# 18. CONTRÔLES DE COHÉRENCE

Créer une zone :

## Contrôles automatiques

Exemple :

✓ EB définitivement approuvée

✓ Exercice budgétaire ouvert

✓ Ligne budgétaire valide

✓ Crédit disponible

✓ Imputation équilibrée

✓ Pièces obligatoires présentes

✓ Bénéficiaire conforme

✓ Marché conforme

⚠ Document fiscal bientôt expiré

Cette zone doit rendre le contrôle facilement compréhensible.

---

# 19. ENGAGEMENT PAP

Lorsqu’un dossier relève du PAP, afficher automatiquement les informations programmatiques.

Prévoir une fiche synthétique comprenant :

- pilier ;
- axe ;
- objectif ;
- programme ;
- produit ;
- sous-produit ;
- activité ;
- tâche ;
- indicateur ;
- résultat attendu ;
- unité responsable ;
- période ;
- budget programmé ;
- budget révisé ;
- déjà engagé ;
- présent engagement ;
- disponible.

Créer une visualisation permettant de relier clairement :

**programmation → activité → budget → engagement**

---

# 20. ENGAGEMENT HORS PAP

Pour les dépenses Hors PAP, adapter l’information affichée :

- nature de la dépense ;
- ligne ;
- structure ;
- objet ;
- justification ;
- budget ;
- disponible ;
- montant engagé ;
- bénéficiaire.

Ne pas afficher inutilement des blocs PAP vides.

---

# 21. DÉTAIL DES PRESTATIONS

Reprendre automatiquement le détail des tâches ou rubriques de l’EB.

Prévoir un tableau tel que :

| Désignation | Tâche | Quantité | Unité | Prix | Montant |
|---|---|---:|---|---:|---:|

Afficher le total.

Distinguer clairement les informations héritées de l’EB des informations propres à l’Engagement.

---

# 22. BÉNÉFICIAIRE / CRÉANCIER

Créer une fiche bénéficiaire professionnelle.

Afficher :

- raison sociale ;
- type ;
- RCCM ;
- NIF ;
- adresse ;
- contact ;
- téléphone ;
- email ;
- banque ;
- compte ;
- statut ;
- conformité administrative.

Utiliser le référentiel Entreprises/Tiers.

Prévoir une action :

**Voir la fiche complète du bénéficiaire**

---

# 23. CONTRÔLE DU BÉNÉFICIAIRE

Afficher des indicateurs :

✓ Actif

✓ Documents valides

✓ Informations fiscales disponibles

✓ Compte bancaire validé

⚠ Document expirant

⛔ Bénéficiaire suspendu

---

# 24. INTÉGRATION AVEC LES MARCHÉS

Si l’opération relève d’un marché, afficher automatiquement :

- référence marché ;
- objet ;
- titulaire ;
- procédure ;
- lot ;
- montant initial ;
- avenants ;
- montant actualisé ;
- montant déjà engagé ;
- disponible contractuel ;
- dates ;
- statut.

Permettre l’accès direct au dossier Marché.

---

# 25. PIÈCES JUSTIFICATIVES

Créer une véritable zone documentaire.

Distinguer :

### Documents hérités de l’EB

### Documents ajoutés à l’Engagement

### Documents générés automatiquement

Exemples :

- devis ;
- TDR ;
- contrat ;
- bon de commande ;
- marché ;
- certificat ;
- notes ;
- autorisations.

Prévoir :

- prévisualisation ;
- téléchargement ;
- métadonnées ;
- version ;
- auteur ;
- date ;
- type.

---

# 26. CHECKLIST DES PIÈCES

Créer une checklist dynamique.

Exemple :

✓ EB approuvée

✓ TDR

✓ Devis

✓ Document fournisseur

⚠ Attestation fiscale manquante

La liste des pièces obligatoires doit varier selon :

- type de dépense ;
- montant ;
- marché ;
- PAP/Hors PAP ;
- bénéficiaire.

---

# 27. ESPACE D’INSTRUCTION BUDGET

Créer une interface spécifique pour l’Expert/Agent Budget.

Elle doit permettre de contrôler rapidement :

- EB source ;
- montant ;
- disponible ;
- imputation ;
- bénéficiaire ;
- pièces ;
- marché ;
- PAP ;
- conformité.

Prévoir une logique de checklist et de commentaires.

---

# 28. ACTIONS DE L’EXPERT BUDGET

Selon les droits :

**Prendre en charge**

**Compléter**

**Annoter**

**Contrôler**

**Retourner**

**Transmettre**

Les actions doivent être contextualisées et non dispersées sur l’écran.

---

# 29. VALIDATION HIÉRARCHIQUE BUDGET

Créer l’écran ou l’état correspondant au niveau de validation du :

- Chef de Service Budget ;
- Directeur du Budget ;

selon le workflow paramétré.

L’acteur doit disposer d’une vue synthétique lui permettant de décider sans devoir relire tout le dossier.

---

# 30. TRANSMISSION AUTOMATIQUE AU CONTRÔLEUR FINANCIER

Une fois la validation budgétaire finale acquise :

**Validation Budget**

↓

**Transmission automatique**

↓

**Contrôleur Financier**

La maquette ne doit pas imposer un bouton supplémentaire inutile du type :

**Envoyer au Contrôle Financier**

si la procédure définit la transmission comme automatique.

---

# 31. ESPACE CONTRÔLEUR FINANCIER

Créer une interface spécifique très claire.

En une page ou un espace organisé, le Contrôleur Financier doit pouvoir visualiser :

- EB ;
- Engagement ;
- crédits ;
- imputations ;
- bénéficiaire ;
- marché ;
- pièces ;
- historique ;
- validations ;
- anomalies.

---

# 32. DÉCISIONS DU CONTRÔLEUR FINANCIER

Prévoir les actions :

### Viser

### Retourner pour correction

### Rejeter

### Demander un complément

### Ajouter une observation

Pour les décisions négatives, rendre le motif obligatoire.

---

# 33. VISA

Créer une zone de visa clairement identifiable.

Afficher :

**Visa n°**

**Date**

**Montant**

**Contrôleur Financier**

**Observations**

Après visa :

- verrouiller les données validées ;
- générer les documents ;
- archiver dans la GED ;
- générer la Liquidation.

---

# 34. RETOUR POUR CORRECTION

Lorsqu’un dossier est retourné, créer une expérience dédiée.

Afficher :

**Dossier retourné**

par : [acteur]

le : [date]

Motif :

[texte]

Sections concernées :

- imputation ;
- bénéficiaire ;
- pièce justificative.

Les champs ou onglets concernés doivent afficher des indicateurs visuels.

---

# 35. REJET

Le rejet doit être distingué visuellement d’un retour.

Créer un écran ou état indiquant :

- motif du rejet ;
- autorité ;
- date ;
- montant ;
- conséquences ;
- situation des crédits.

---

# 36. ENGAGEMENT COMPLÉMENTAIRE

Prévoir les maquettes nécessaires à un Engagement complémentaire :

**Engagement initial**

**Montant initial**

**Montant complémentaire**

**Nouveau montant cumulé**

**Crédit disponible**

**Justification**

Le lien avec l’Engagement d’origine doit rester visible.

---

# 37. ANNULATION D’ENGAGEMENT

Créer une procédure visuelle spécifique :

- demander l’annulation ;
- saisir le motif ;
- joindre une pièce ;
- afficher l’impact budgétaire ;
- soumettre ;
- valider ;
- libérer les crédits.

Afficher clairement :

**Crédit à restituer : XXX FCFA**

---

# 38. ENGAGEMENT MODIFICATIF

Si prévu par la description fonctionnelle, prévoir un parcours permettant :

- modification du montant ;
- correction administrative ;
- modification contrôlée d’une imputation ;
- justification ;
- approbation ;
- traçabilité.

L’Engagement initial ne doit jamais être écrasé silencieusement.

---

# 39. ENGAGEMENT PARTIEL

Prévoir une représentation des cas où une EB peut donner lieu à plusieurs Engagements.

Exemple :

**Montant EB : 20 000 000 FCFA**

**Engagement 1 : 8 000 000**

**Engagement 2 : 7 000 000**

**Reste mobilisable : 5 000 000**

Créer une visualisation parent/enfants.

---

# 40. HISTORIQUE DU DOSSIER

Créer une timeline complète.

Exemple :

**15/09/2026 – 08:30**  
Engagement généré automatiquement

**15/09/2026 – 09:10**  
Prise en charge par l’Expert Budget

**15/09/2026 – 11:25**  
Contrôle terminé

**15/09/2026 – 15:00**  
Validation Directeur Budget

**15/09/2026 – 15:01**  
Transmission au Contrôleur Financier

**16/09/2026 – 09:20**  
Visa accordé

**16/09/2026 – 09:21**  
Liquidation générée automatiquement

---

# 41. JOURNAL D’AUDIT

Créer une vue distincte permettant aux profils autorisés de consulter :

- date/heure ;
- utilisateur ;
- rôle ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- document ;
- commentaire ;
- événement système.

Différencier :

**Historique métier**

et

**Journal technique/audit**

---

# 42. DOCUMENTS GÉNÉRÉS

Créer une bibliothèque de documents liée au dossier.

Prévoir notamment :

- Fiche d’Engagement ;
- certificat de disponibilité des crédits ;
- fiche de contrôle ;
- visa ;
- bordereau de transmission ;
- document d’annulation ;
- document modificatif.

Chaque document doit afficher :

- référence ;
- version ;
- date ;
- statut ;
- auteur ;
- aperçu ;
- téléchargement.

---

# 43. MAQUETTE DU PDF OFFICIEL

Créer également la maquette du document :

# FICHE D’ENGAGEMENT BUDGÉTAIRE

Il doit comporter :

- logo CEEAC ;
- exercice ;
- référence ;
- EB source ;
- structure ;
- objet ;
- bénéficiaire ;
- imputation ;
- détail ;
- montants ;
- situation du crédit ;
- validations ;
- visa ;
- QR Code ou identifiant de vérification.

---

# 44. GED

Tous les documents importés ou générés doivent être représentés comme intégrés à la GED.

Prévoir une indication :

**Archivé dans la GED**

Avec accès au document correspondant.

---

# 45. MES TÂCHES

Le module ENGAGEMENT doit alimenter « Mes tâches ».

Créer une carte ou ligne du type :

**ENG-2026-000457**

Acquisition de matériels informatiques

4 500 000 FCFA

Action attendue : **Contrôler l’imputation**

Reçu : **Aujourd’hui à 09:15**

---

# 46. NOTIFICATIONS

Prévoir les notifications correspondant aux principaux événements :

- Engagement créé ;
- dossier reçu ;
- validation requise ;
- retour ;
- correction ;
- transmission au CF ;
- visa ;
- rejet ;
- Liquidation créée.

Permettre l’ouverture directe du dossier depuis la notification.

---

# 47. DÉLAIS ET ESCALADES

Afficher le temps passé à l’étape.

Exemple :

**Au niveau Directeur Budget depuis 1 j 6 h**

Créer des états :

Normal

Approche de l’échéance

En retard

Critique

Prévoir graphiquement les rappels et escalades.

---

# 48. REPORTING ENGAGEMENT

Créer ou adapter les écrans de reporting permettant notamment :

- engagement par période ;
- structure ;
- ligne ;
- PAP/Hors PAP ;
- activité PAP ;
- bénéficiaire ;
- type de dépense ;
- statut ;
- délai.

---

# 49. KPI

Afficher notamment :

### Taux d’engagement

**Montant engagé / Budget révisé**

### Disponible

**Budget révisé – Engagements nets**

### Délai moyen

**Visa – création**

### Taux de retour

**Dossiers retournés / dossiers transmis**

---

# 50. RECHERCHE GLOBALE

Prévoir que l’Engagement soit retrouvé par :

- référence ENG ;
- référence EB ;
- objet ;
- bénéficiaire ;
- ligne budgétaire ;
- montant ;
- marché ;
- structure.

---

# 51. ÉTATS D’ERREUR

Concevoir les écrans ou composants correspondant notamment à :

- crédit insuffisant ;
- exercice clôturé ;
- ligne suspendue ;
- bénéficiaire bloqué ;
- document obligatoire manquant ;
- marché dépassé ;
- doublon ;
- workflow indisponible ;
- erreur documentaire ;
- droits insuffisants.

Chaque erreur doit proposer une explication et, lorsque possible, la marche à suivre.

---

# 52. SÉPARATION DES FONCTIONS

La maquette doit traduire clairement les différents rôles :

- initiateur ;
- Expert Budget ;
- Chef de Service ;
- Directeur Budget ;
- Contrôleur Financier ;
- audit ;
- consultation.

Ne jamais afficher une action interdite à un profil.

---

# 53. ACTIONS CONTEXTUELLES

Les actions proposées doivent dépendre simultanément :

- du rôle ;
- du statut ;
- de l’étape ;
- du workflow ;
- du niveau hiérarchique.

Éviter les boutons permanents sans contexte.

---

# 54. DESIGN UX/UI

Le résultat doit être :

- institutionnel ;
- premium ;
- moderne ;
- clair ;
- sobre ;
- professionnel ;
- fluide ;
- particulièrement lisible.

Le design doit être cohérent avec la réforme du module Expression de Besoin.

Utiliser :

- espaces généreux ;
- hiérarchie typographique claire ;
- cartes ;
- panneaux ;
- tableaux professionnels ;
- badges ;
- icônes cohérentes ;
- informations financières très lisibles.

---

# 55. NE PAS SURCHARGER LES ÉCRANS

Le module ENGAGEMENT contient beaucoup de données.

Utiliser intelligemment :

- onglets ;
- accordéons ;
- panneaux latéraux ;
- drawers ;
- vues synthétiques ;
- détails progressifs ;
- tooltips.

L’utilisateur ne doit pas recevoir toutes les informations en même temps.

---

# 56. DESIGN SYSTEM

Créer ou améliorer les composants réutilisables :

- bandeau workflow ;
- résumé budgétaire ;
- état de crédit ;
- tableau imputations ;
- card bénéficiaire ;
- card marché ;
- checklist documentaire ;
- timeline ;
- badges de statut ;
- actions de décision ;
- document card ;
- alertes ;
- KPI.

Utiliser :

- Auto Layout ;
- Components ;
- Variants ;
- Variables ;
- tokens.

---

# 57. ÉTATS DES COMPOSANTS

Prévoir :

- default ;
- hover ;
- focus ;
- selected ;
- loading ;
- disabled ;
- success ;
- warning ;
- error ;
- read-only.

---

# 58. RESPONSIVE

Créer les versions :

### Desktop

Prioritaire pour les tâches financières.

### Laptop

### Tablette

Pour consultation/validation.

### Mobile

Pour :

- notifications ;
- Mes tâches ;
- consultation synthétique ;
- validation simple lorsque permise.

---

# 59. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA.

Prévoir :

- contrastes ;
- labels ;
- focus clavier ;
- navigation cohérente ;
- tailles lisibles ;
- statut non exprimé uniquement par couleur.

---

# 60. PROTOTYPE INTERACTIF

Créer un prototype permettant de simuler au minimum :

### Scénario 1

EB approuvée → Engagement créé automatiquement.

### Scénario 2

Instruction par Expert Budget.

### Scénario 3

Contrôle crédit disponible.

### Scénario 4

Crédit insuffisant.

### Scénario 5

Contrôle d’une imputation multi-lignes.

### Scénario 6

Contrôle du bénéficiaire.

### Scénario 7

Validation par Directeur Budget.

### Scénario 8

Transmission automatique au Contrôleur Financier.

### Scénario 9

Retour pour correction.

### Scénario 10

Correction et retransmission.

### Scénario 11

Visa.

### Scénario 12

Génération automatique de la Liquidation.

### Scénario 13

Annulation d’un Engagement.

### Scénario 14

Engagement complémentaire.

---

# 61. COHÉRENCE AVEC LES AUTRES MODULES

Auditer les impacts sur :

- Expression de Besoin ;
- Liquidation ;
- Budget ;
- PAP ;
- Marchés ;
- Entreprises/Tiers ;
- GED ;
- Notifications ;
- Mes tâches ;
- Suivi-Évaluation ;
- Reporting ;
- Audit ;
- workflow ;
- référentiels.

Adapter les composants transversaux lorsque nécessaire.

---

# 62. ARCHITECTURE FIGMA RECOMMANDÉE

Organiser les frames :

**ENG / 00 — Audit**

**ENG / 01 — Components**

**ENG / 02 — Dashboard**

**ENG / 03 — List**

**ENG / 04 — Detail**

**ENG / 05 — Budget Control**

**ENG / 06 — Imputation**

**ENG / 07 — Beneficiary**

**ENG / 08 — PAP**

**ENG / 09 — Procurement**

**ENG / 10 — Documents**

**ENG / 11 — Budget Workflow**

**ENG / 12 — Financial Control**

**ENG / 13 — Return & Rejection**

**ENG / 14 — Amendment & Cancellation**

**ENG / 15 — History**

**ENG / 16 — PDF**

**ENG / 17 — States**

**ENG / 18 — Responsive**

**ENG / 19 — Prototype**

---

# 63. MATRICE DE CONFORMITÉ FINALE

À la fin, produire une matrice :

| Exigence du document | Écran Figma | Composant | Interaction | Statut |
|---|---|---|---|---|
| Création automatique | Workflow | Timeline | Automatique | Conforme |
| Contrôle crédit | Détail Budget | Budget Card | Temps réel | Conforme |
| Visa CF | Contrôle financier | Visa Panel | Action | Conforme |

Aucune ligne importante ne doit rester « non couverte ».

---

# 64. RÈGLE DE NON-RÉGRESSION

Ne pas supprimer un composant existant utile simplement pour reconstruire le module.

Avant toute suppression :

1. vérifier sa fonction ;
2. déterminer s’il est encore pertinent ;
3. vérifier ses dépendances ;
4. conserver ou adapter si nécessaire.

La refonte doit améliorer BUDGET-CEEAC sans casser les autres parcours.

---

# 65. RÉSULTAT ATTENDU

La nouvelle maquette doit être suffisamment précise pour permettre à une équipe de développement React.js / Laravel de comprendre :

- les écrans ;
- les composants ;
- les données ;
- les rôles ;
- les workflows ;
- les validations ;
- les contrôles ;
- les documents ;
- les transitions ;
- les erreurs ;
- les notifications ;
- les comportements automatiques.

---

# 66. INSTRUCTION FINALE

Ne te contente pas de redessiner les écrans du module ENGAGEMENT.

**Audite, reconstruis, rationalise et professionnalise le processus complet.**

Le nouveau module doit matérialiser clairement le principe :

**Expression de Besoin approuvée**

→ **Engagement automatiquement créé**

→ **Instruction budgétaire**

→ **Contrôle des crédits**

→ **Validation Budget**

→ **Transmission automatique au Contrôleur Financier**

→ **Visa**

→ **Documents et archivage GED**

→ **Création automatique de la Liquidation**

La maquette finale doit être :

**fonctionnellement exhaustive, budgétairement rigoureuse, graphiquement exceptionnelle, ergonomiquement fluide, entièrement traçable, cohérente avec les finances publiques et parfaitement intégrée à BUDGET-CEEAC.**

Avant de terminer, relis intégralement le fichier joint de la **Description détaillée du module ENGAGEMENT** et vérifie exigence par exigence que chacune est effectivement traduite dans un écran, un composant, une interaction, un workflow ou un état de la nouvelle maquette.