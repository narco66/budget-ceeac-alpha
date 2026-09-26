Conçois et génère une **maquette UI/UX complète, cohérente, moderne, fonctionnelle et haut de gamme de l’application web institutionnelle BUDGET-CEEAC**, en t’appuyant rigoureusement sur :

* le **Cahier des charges fonctionnel de BUDGET-CEEAC joint** ;
* les **descriptions fonctionnelles détaillées des modules jointes**, notamment :

  * Expression de Besoin ;
  * Engagement ;
  * Liquidation ;
  * Ordonnancement ;
  * Paiement ;
  * Suivi-Évaluation ;
* l’ensemble des règles métier, workflows, acteurs, statuts, tableaux de bord, contrôles, documents, indicateurs et interactions décrits dans ces documents.

La maquette doit représenter une **véritable application institutionnelle de gestion budgétaire, de planification stratégique, d’exécution de la dépense et de pilotage de la performance**, et non une simple collection de quelques écrans décoratifs.

# 1. OBJECTIF GÉNÉRAL

Créer dans Figma un **prototype complet de BUDGET-CEEAC**, visuellement exceptionnel mais sobre, professionnel, institutionnel, moderne et parfaitement adapté à une organisation régionale internationale telle que la Commission de la CEEAC.

Le design doit inspirer immédiatement :

* sérieux institutionnel ;
* fiabilité ;
* maîtrise budgétaire ;
* transparence ;
* performance ;
* sécurité ;
* modernité ;
* qualité ;
* facilité d’utilisation.

L’interface doit permettre à un utilisateur de comprendre immédiatement :

* où il se trouve ;
* quel dossier il traite ;
* son statut ;
* ce qui a déjà été réalisé ;
* l’action qu’il doit effectuer ;
* le prochain acteur attendu ;
* les crédits concernés ;
* les documents disponibles ;
* les alertes ou anomalies ;
* l’état d’avancement du workflow.

# 2. PRINCIPE FONCTIONNEL CENTRAL À RESPECTER

BUDGET-CEEAC repose sur un **Budget unique par exercice**.

Le **Plan Annuel de Performance — PAP** n’est pas un budget séparé : il constitue le **segment Investissement du Budget**.

La chaîne stratégique à représenter est :

**Pilier → Axe stratégique → Produit → Sous-Produit → Activité → Tâche**

Une ligne budgétaire relevant du PAP doit permettre d’identifier automatiquement les informations programmatiques associées.

La chaîne complète de dépense doit être représentée comme un processus continu :

**Expression de Besoin
→ Engagement
→ Liquidation
→ Ordonnancement
→ Paiement**

Les transitions entre les grandes étapes validées doivent apparaître comme **automatiques** conformément aux règles décrites dans les documents fonctionnels.

Le système doit conserver un **dossier numérique unique de dépense** permettant de visualiser toute son histoire de bout en bout.

# 3. CONCEVOIR UN DESIGN SYSTEM COMPLET

Avant de réaliser les écrans, créer un **Design System BUDGET-CEEAC** complet et réutilisable.

Prévoir notamment :

## Couleurs

Créer une palette institutionnelle élégante inspirée de l’identité de la CEEAC, avec :

* couleur primaire ;
* couleur secondaire ;
* couleurs d’accent ;
* couleurs neutres ;
* états :

  * succès ;
  * information ;
  * attention ;
  * anomalie ;
  * rejet ;
  * blocage ;
  * urgence.

Utiliser les couleurs de manière maîtrisée.

Éviter les interfaces trop saturées.

## Typographie

Créer une hiérarchie typographique complète :

* titre de page ;
* titre de section ;
* sous-titre ;
* cartes KPI ;
* labels ;
* formulaires ;
* tableaux ;
* textes secondaires ;
* badges ;
* messages d’aide ;
* alertes.

La typographie doit être extrêmement lisible sur des interfaces contenant beaucoup d’informations financières.

## Espacement et grille

Utiliser :

* grille cohérente ;
* système d’espacement régulier ;
* alignements précis ;
* Auto Layout ;
* composants responsives ;
* marges généreuses ;
* densité maîtrisée pour les tableaux administratifs.

## Composants

Créer des composants Figma réutilisables et leurs variantes :

* boutons ;
* champs texte ;
* textarea ;
* listes déroulantes ;
* autocomplete ;
* sélecteurs de lignes budgétaires ;
* sélecteurs de périodes ;
* sélecteurs de structures ;
* date picker ;
* upload de fichiers ;
* tags ;
* badges ;
* statuts ;
* cartes KPI ;
* tables ;
* pagination ;
* filtres ;
* accordéons ;
* onglets ;
* modales ;
* drawers ;
* menus contextuels ;
* tooltips ;
* timeline ;
* stepper ;
* alertes ;
* notifications ;
* menus ;
* breadcrumbs ;
* cartes de tâches ;
* widgets de performance ;
* indicateurs de progression ;
* graphiques ;
* jauges ;
* tableaux de suivi ;
* commentaires ;
* pièces jointes ;
* signatures et visas ;
* historiques ;
* composants GED.

Prévoir les états :

* normal ;
* hover ;
* focus ;
* sélectionné ;
* actif ;
* inactif ;
* disabled ;
* erreur ;
* succès ;
* chargement.

# 4. STRUCTURE GLOBALE DE L’APPLICATION

Concevoir un **App Shell principal** comprenant :

### Barre latérale gauche

Sidebar rétractable et hiérarchisée avec icônes et menus.

Prévoir au minimum :

* Accueil ;
* Tableau de bord ;
* Planification stratégique ;
* Budget ;
* PAP ;
* Chaîne de dépense ;
* Suivi-Évaluation ;
* Reporting ;
* GED ;
* Contrôle interne ;
* Audit ;
* Référentiels ;
* Administration.

Sous **Chaîne de dépense** :

* Expressions de Besoin ;
* Engagements ;
* Liquidations ;
* Ordonnancements ;
* Paiements.

### Barre supérieure

Prévoir :

* recherche globale ;
* exercice budgétaire actif ;
* notifications ;
* tâches en attente ;
* aide ;
* profil utilisateur ;
* structure ;
* rôle ;
* paramètres rapides.

### Breadcrumb

Toujours afficher le chemin fonctionnel.

Exemple :

**Accueil / Chaîne de dépense / Engagement / ENG-2026-000458**

# 5. PAGE D’ACCUEIL ET TABLEAU DE BORD EXÉCUTIF

Créer un tableau de bord institutionnel particulièrement soigné.

Prévoir :

## KPI principaux

* Budget initial ;
* Budget révisé ;
* crédits disponibles ;
* crédits engagés ;
* crédits liquidés ;
* crédits ordonnancés ;
* crédits payés ;
* taux d’exécution budgétaire ;
* taux d’exécution financière ;
* taux de réalisation physique ;
* performance globale PAP.

## Graphiques

Créer notamment :

* exécution budgétaire mensuelle ;
* budget vs engagement vs liquidation vs paiement ;
* exécution physique vs exécution financière ;
* performance par Pilier ;
* performance par Département ;
* consommation par source de financement ;
* état des indicateurs ;
* activités en retard ;
* risques critiques.

## Zones de pilotage

Prévoir :

* Mes tâches ;
* dossiers prioritaires ;
* validations en attente ;
* alertes budgétaires ;
* alertes S&E ;
* dernières activités ;
* échéances ;
* recommandations en retard.

Toutes les cartes importantes doivent être **cliquables et drill-down**.

# 6. MODULE PLANIFICATION STRATÉGIQUE

Créer les écrans permettant de gérer et visualiser :

**Pilier
→ Axe
→ Produit
→ Sous-Produit
→ Activité
→ Tâche**

Prévoir :

* vue arborescente ;
* vue tableau ;
* fiche détaillée ;
* filtres ;
* responsables ;
* échéances ;
* indicateurs ;
* résultats attendus ;
* financements ;
* coûts ;
* historique.

Prévoir une visualisation graphique claire de la chaîne de résultats.

# 7. MODULE BUDGET

Concevoir notamment :

* tableau de bord budgétaire ;
* exercices budgétaires ;
* Budget actif ;
* nomenclature budgétaire ;
* chapitres ;
* articles ;
* paragraphes ;
* lignes budgétaires ;
* sources de financement ;
* partenaires techniques et financiers ;
* dotations ;
* modifications budgétaires ;
* virements ;
* transferts ;
* gels ;
* dégels ;
* réservations ;
* crédits disponibles ;
* historique des mouvements.

Créer une **fiche ligne budgétaire très riche** indiquant :

* code ;
* libellé ;
* chapitre ;
* article ;
* paragraphe ;
* nature économique ;
* PAP/Hors PAP ;
* dotation initiale ;
* dotation actuelle ;
* réservé ;
* engagé ;
* liquidé ;
* ordonnancé ;
* payé ;
* disponible ;
* source de financement ;
* structure responsable ;
* éléments PAP associés.

# 8. MODULE PAP

Créer une expérience permettant de piloter le segment Investissement du Budget.

Prévoir :

* tableau de bord PAP ;
* structure du PAP ;
* activités programmées ;
* tâches ;
* calendriers ;
* responsables ;
* indicateurs ;
* valeurs de référence ;
* cibles ;
* coûts programmés ;
* financements ;
* consommation budgétaire ;
* progression physique ;
* écarts ;
* alertes.

Ne jamais concevoir le PAP comme un budget autonome.

# 9. MODULE EXPRESSION DE BESOIN

Créer un formulaire EB exceptionnel, ergonomique et progressif.

La première donnée métier à sélectionner doit être :

**Ligne budgétaire du besoin**

À partir de cette ligne :

* déterminer automatiquement PAP/Hors PAP ;
* afficher crédits disponibles ;
* récupérer les informations budgétaires ;
* récupérer automatiquement les informations PAP lorsqu’elles existent.

Pour une ligne PAP, afficher immédiatement et en lecture seule :

**Pilier
→ Axe
→ Produit
→ Sous-Produit
→ Activité
→ Tâche**

ainsi que :

* indicateurs ;
* cible ;
* responsable ;
* calendrier ;
* coût programmé ;
* coût consommé ;
* disponible.

Concevoir ensuite les étapes du formulaire :

1. ligne budgétaire ;
2. contexte budgétaire/PAP ;
3. identification du demandeur ;
4. description du besoin ;
5. justification ;
6. priorité ;
7. montant ;
8. imputation budgétaire ;
9. bénéficiaire/fournisseur éventuel ;
10. pièces justificatives ;
11. récapitulatif ;
12. contrôles ;
13. soumission.

Permettre :

**1 EB = 1 ligne principale de classification**

mais également :

**1 EB = N lignes d’imputation**, lorsque cela est autorisé.

Afficher clairement :

**Total imputé = Montant EB**

# 10. MODULE ENGAGEMENT

Créer :

* dashboard Engagement ;
* liste ;
* formulaire/fiche ;
* contrôle crédits ;
* imputation ;
* réservation ;
* validation Budget ;
* visa Contrôleur Financier ;
* retour ;
* rejet ;
* observations ;
* documents ;
* historique.

Les données héritées de l’EB doivent être affichées en lecture seule lorsque cela est nécessaire.

Afficher les niveaux :

* crédit disponible ;
* crédit réservé ;
* crédit engagé ;
* crédit liquidé ;
* crédit ordonnancé ;
* crédit payé.

Après visa final :

**création automatique de la Liquidation**.

# 11. MODULE LIQUIDATION

Créer des interfaces permettant :

* réception de l’Engagement ;
* constatation de la prestation ;
* enregistrement des factures ;
* certification du service fait ;
* pièces justificatives ;
* calcul du montant brut ;
* taxes ;
* retenues ;
* pénalités ;
* avances ;
* acomptes ;
* montant net à liquider ;
* liquidation partielle ;
* reliquat ;
* contrôle financier ;
* visa ;
* retour ;
* rejet.

Créer une section très visible :

**CERTIFIER LE SERVICE FAIT**

Prévoir :

* conforme ;
* partiel ;
* avec réserves ;
* non conforme ;
* non fait.

Après validation finale :

**création automatique de l’Ordonnancement**.

# 12. MODULE ORDONNANCEMENT

Créer :

* tableau de bord ;
* liste ;
* fiche Ordonnancement ;
* contrôle de complétude ;
* montant net ;
* créancier ;
* imputations ;
* pièces ;
* ordre de paiement ;
* signature ;
* historique.

Le système doit mettre en évidence :

**Ordonnateur compétent**

et déterminer celui-ci automatiquement à partir des règles paramétrées.

Le design doit supporter notamment les délégations et seuils d’autorisation.

Après signature de l’Ordre de Paiement :

**transmission automatique à l’Agence Comptable et génération du Paiement**.

# 13. MODULE PAIEMENT

Créer une interface sécurisée, adaptée à :

* Comptable ;
* Chef Comptable ;
* Agent Comptable.

Afficher de manière permanente :

* créancier ;
* bénéficiaire ;
* montant ordonnancé ;
* montant payé ;
* montant du paiement courant ;
* reliquat ;
* compte bancaire ;
* mode de paiement ;
* état du dossier.

Prévoir :

* contrôle comptable ;
* contrôle bénéficiaire ;
* coordonnées bancaires ;
* préparation du paiement ;
* validation Chef Comptable ;
* validation Agent Comptable ;
* virement ;
* chèque ;
* caisse ;
* lots de paiement ;
* preuve de paiement ;
* rejets bancaires ;
* paiements partiels ;
* rapprochement bancaire ;
* clôture.

Les modifications de coordonnées bancaires doivent recevoir une alerte visuelle très forte.

Afficher clairement la distinction :

**Préparé → Validé → Exécuté → Rapproché → Clôturé**

# 14. MODULE SUIVI-ÉVALUATION

Créer un centre de pilotage GAR/RBM extrêmement visuel.

Le module doit relier :

**Planification
→ Budget
→ Exécution
→ Réalisations
→ Indicateurs
→ Performance
→ Décision**

Créer :

* dashboard global ;
* dashboard par Pilier ;
* Axe ;
* Produit ;
* Sous-Produit ;
* Activité ;
* Tâche ;
* Département ;
* Direction ;
* Service ;
* source de financement.

Prévoir les dimensions :

### Suivi physique

### Suivi financier

### Suivi temporel

### Suivi des indicateurs

### Suivi qualitatif

### Suivi des risques

Pour chaque indicateur prévoir :

* code ;
* libellé ;
* type ;
* unité ;
* baseline ;
* cible ;
* réalisation ;
* taux d’atteinte ;
* tendance ;
* période ;
* source ;
* moyen de vérification ;
* responsable ;
* statut.

Créer des visualisations :

* progression ;
* tendance ;
* target vs actual ;
* feu tricolore ;
* jauge ;
* courbe temporelle.

Permettre le drill-down jusqu’aux données sources.

# 15. ÉCARTS, RISQUES ET MESURES CORRECTIVES

Créer des écrans dédiés aux :

* écarts ;
* causes ;
* conséquences ;
* risques ;
* criticité ;
* recommandations ;
* actions correctives ;
* responsables ;
* échéances ;
* taux de réalisation.

Créer une matrice :

**Probabilité × Impact**

avec niveaux :

* faible ;
* modéré ;
* élevé ;
* critique.

# 16. REPORTING INSTITUTIONNEL

Créer un véritable module Reporting avec :

* bibliothèque des rapports ;
* états budgétaires ;
* états PAP ;
* exécution de la dépense ;
* suivi financier ;
* suivi physique ;
* performance ;
* risques ;
* recommandations ;
* fournisseurs ;
* financements ;
* audit.

Prévoir :

* filtres multi-critères ;
* génération PDF ;
* Excel ;
* CSV ;
* impression ;
* planification ;
* export ;
* partage sécurisé.

# 17. GED

Créer un espace documentaire transversal avec :

* dossiers ;
* pièces justificatives ;
* catégories ;
* versions ;
* prévisualisation ;
* téléchargement ;
* confidentialité ;
* historique ;
* liens entre documents et dossiers métiers.

Les documents officiels validés doivent apparaître comme :

**FIGÉS / SIGNÉS / ARCHIVÉS**

# 18. WORKFLOW ET MES TÂCHES

Créer un moteur de workflow visuel.

Chaque dossier doit comporter un bandeau intelligent indiquant :

* statut ;
* dernière action ;
* auteur ;
* date/heure ;
* étape actuelle ;
* prochain acteur ;
* délai ;
* niveau d’avancement ;
* éventuelle alerte.

Exemple :

**Dernière action : Validation du Directeur
Étape actuelle : Validation N+1
Acteur attendu : Commissaire
Statut : En attente de validation**

Créer également un espace **Mes tâches** :

* tâches les plus récentes en premier ;
* priorité ;
* échéance ;
* retard ;
* module ;
* dossier ;
* montant ;
* action attendue ;
* accès direct.

# 19. DOSSIER NUMÉRIQUE UNIQUE

Créer une page exceptionnelle permettant de visualiser toute la vie d’une dépense.

Exemple :

**DEP-2026-000458**

Timeline :

**EB
→ ENG
→ LIQ
→ ORD
→ PAY**

Pour chaque étape afficher :

* statut ;
* montant ;
* acteur ;
* date ;
* visa/signature ;
* documents ;
* commentaires ;
* durée ;
* anomalies.

La timeline doit permettre de naviguer directement vers chaque étape.

# 20. AUDIT ET CONTRÔLE INTERNE

Créer :

* journal d’audit ;
* matrice des risques ;
* contrôles ;
* anomalies ;
* incidents ;
* recommandations ;
* plans d’action ;
* accès aux dossiers ;
* historique des modifications.

Le journal doit afficher :

* utilisateur ;
* rôle ;
* action ;
* date ;
* heure ;
* ancienne valeur ;
* nouvelle valeur ;
* motif ;
* adresse IP lorsque pertinente ;
* document ;
* étape.

# 21. ADMINISTRATION

Créer les écrans :

* utilisateurs ;
* rôles ;
* permissions ;
* structures ;
* fonctions ;
* délégations ;
* workflows ;
* seuils ;
* types de documents ;
* numérotation ;
* exercices ;
* paramètres ;
* notifications ;
* référentiels.

Prévoir une matrice avancée :

**Rôle × Module × Action × Structure × Niveau de validation**

# 22. UX DES FORMULAIRES

Pour tous les formulaires longs :

* utiliser un stepper ;
* afficher la progression ;
* sauvegarde brouillon ;
* préremplissage ;
* contrôles en temps réel ;
* validations inline ;
* champs conditionnels ;
* résumés intermédiaires ;
* récapitulatif final.

Les formulaires doivent réduire au maximum la ressaisie.

# 23. UX DES TABLEAUX

Tous les tableaux métier doivent proposer :

* recherche ;
* tri ;
* filtres ;
* filtres enregistrables ;
* colonnes configurables ;
* pagination ;
* sélection ;
* export ;
* badges de statut ;
* actions rapides ;
* ouverture du dossier ;
* drill-down.

Créer des vues :

* Tous ;
* À traiter ;
* En cours ;
* Retournés ;
* Rejetés ;
* Validés ;
* Clôturés.

# 24. RESPONSIVE DESIGN

Créer les déclinaisons :

* Desktop large : 1440 px ;
* Laptop : 1280 px ;
* Tablette ;
* Mobile pour consultation et certaines validations.

La version Desktop constitue la référence principale.

# 25. ACCESSIBILITÉ

Respecter les bonnes pratiques WCAG :

* contrastes suffisants ;
* labels explicites ;
* états focus ;
* navigation clavier ;
* tailles lisibles ;
* couleurs jamais utilisées seules pour transmettre une information.

# 26. PROTOTYPE INTERACTIF

Relier les écrans dans Figma afin de permettre une navigation réaliste.

Créer au minimum les parcours interactifs :

### Parcours 1

Création EB PAP → Validation → Engagement.

### Parcours 2

EB Hors PAP → Workflow de validation → Engagement.

### Parcours 3

Engagement → Visa Contrôleur Financier → Liquidation.

### Parcours 4

Liquidation → Certification service fait → Ordonnancement.

### Parcours 5

Ordonnancement → Signature → Paiement.

### Parcours 6

Paiement → Agence Comptable → Règlement → Rapprochement.

### Parcours 7

PAP → Activité → indicateur → réalisation → performance.

### Parcours 8

Dashboard → KPI → drill-down → dossier source.

# 27. ORGANISATION DU FICHIER FIGMA

Créer les pages Figma suivantes :

**00 — Cover
01 — Foundations
02 — Design System
03 — Components
04 — Layouts
05 — Authentication
06 — Dashboard
07 — Planification
08 — Budget
09 — PAP
10 — Expression de Besoin
11 — Engagement
12 — Liquidation
13 — Ordonnancement
14 — Paiement
15 — Suivi-Évaluation
16 — Reporting
17 — GED
18 — Risques & Contrôle interne
19 — Audit
20 — Administration
21 — Notifications & Mes tâches
22 — Responsive
23 — Prototype**

# 28. RÈGLES DE QUALITÉ

Ne crée pas de faux écrans génériques sans lien avec le cahier des charges.

Chaque écran doit répondre à un besoin métier réel identifié dans les documents fournis.

Ne simplifie pas arbitrairement les workflows.

Ne crée pas de référentiels parallèles.

Ne duplique pas les informations déjà disponibles dans une étape précédente.

Ne traite jamais le PAP comme un budget autonome.

Privilégie :

* héritage automatique ;
* préremplissage ;
* contextualisation ;
* visibilité des étapes ;
* traçabilité ;
* drill-down ;
* contrôles automatiques ;
* réduction du nombre de clics ;
* excellente lisibilité.

# 29. STYLE VISUEL ATTENDU

Le résultat doit se situer au niveau visuel d’une **plateforme institutionnelle financière internationale moderne**, tout en conservant une identité propre à la CEEAC.

Éviter :

* aspect ERP ancien ;
* surcharge visuelle ;
* couleurs criardes ;
* tableaux illisibles ;
* formulaires interminables ;
* grosses zones vides inutiles ;
* multiplication excessive des cartes ;
* effets décoratifs sans valeur fonctionnelle.

Rechercher :

**minimalisme institutionnel + richesse fonctionnelle + précision financière + élégance + excellente expérience utilisateur.**

Le rendu final doit être suffisamment abouti pour devenir le **référentiel UI/UX officiel de BUDGET-CEEAC** et servir directement de base aux développeurs Laravel pour l’implémentation de l’application.
