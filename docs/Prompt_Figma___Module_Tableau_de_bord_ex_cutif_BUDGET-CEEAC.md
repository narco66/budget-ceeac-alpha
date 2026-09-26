# PROMPT FIGMA — IMPLÉMENTATION DU MODULE « TABLEAU DE BORD EXÉCUTIF » DE BUDGET-CEEAC

Audite l’existant de **BUDGET-CEEAC**, conserve les composants, données, graphiques et fonctionnalités déjà correctement implémentés, puis conçois, développe et intègre un nouveau module stratégique intitulé :

# TABLEAU DE BORD EXÉCUTIF

Ce module doit constituer la **vue de pilotage de haut niveau de l’exécution budgétaire de la Commission de la CEEAC**.

Il doit permettre aux principaux décideurs institutionnels de connaître, en quelques secondes, la situation budgétaire, financière, physique et programmatique de l’exercice en cours.

Le tableau de bord doit proposer notamment des vues adaptées :

- à la **Présidence** ;
- au **Secrétaire Général** ;
- aux **Commissaires** ;
- et, selon les habilitations, aux autres responsables de haut niveau.

Le principe UX fondamental est :

> **Une page doit permettre au décideur de comprendre immédiatement où en est l’exécution budgétaire, quels sont les problèmes critiques, quelles structures sont concernées et quelles décisions nécessitent son attention.**

---

# 1. OBJECTIFS DU MODULE

Le Tableau de bord exécutif doit fournir une vision consolidée de :

- l’exécution globale du Budget ;
- l’exécution du volet Fonctionnement / Hors PAP ;
- l’exécution du volet Investissement / PAP ;
- l’exécution financière ;
- l’exécution physique ;
- la consommation des crédits ;
- l’état de la chaîne de dépense ;
- les dossiers en attente ;
- les engagements ;
- les liquidations ;
- les ordonnancements ;
- les paiements ;
- les activités PAP ;
- les résultats ;
- les indicateurs ;
- les risques ;
- les anomalies ;
- les délais de traitement ;
- les alertes nécessitant une décision.

Le module ne doit pas être un simple assemblage de graphiques.

Il doit constituer un véritable **outil d’aide à la décision**.

---

# 2. PRINCIPE « UNE PAGE »

Créer une vue exécutive principale permettant de présenter sur **une seule page**, autant que possible sans surcharge visuelle :

1. la situation générale du Budget ;
2. les principaux KPI ;
3. l’état du PAP ;
4. la chaîne de dépense ;
5. les principales alertes ;
6. les structures nécessitant une attention particulière ;
7. les décisions ou dossiers en attente.

La page doit fonctionner selon une logique :

**Situation → Écart → Alerte → Analyse → Action.**

Chaque KPI, graphique ou alerte doit être interactif et permettre d’accéder au détail correspondant.

---

# 3. VUES PAR PROFIL

Le tableau de bord doit automatiquement adapter son contenu à l’utilisateur connecté.

## 3.1 Vue Présidence

La Présidence doit disposer d’une vision consolidée de l’ensemble de la Commission.

Afficher notamment :

- Budget total de l’exercice ;
- Budget Fonctionnement ;
- Budget Investissement/PAP ;
- montant engagé ;
- montant liquidé ;
- montant ordonnancé ;
- montant payé ;
- crédits disponibles ;
- taux global d’exécution financière ;
- taux global d’exécution physique du PAP ;
- nombre de dossiers en attente de décision ;
- engagements majeurs ;
- paiements importants ;
- alertes critiques ;
- structures affichant des retards significatifs ;
- activités stratégiques en difficulté ;
- situation des principaux résultats du PAP.

Permettre à la Présidence de descendre progressivement :

**Commission → Département → Direction → Service → Activité → Dossier.**

---

# 4. VUE SECRÉTAIRE GÉNÉRAL

La vue du Secrétaire Général doit mettre davantage l’accent sur :

- exécution budgétaire des structures d’appui ;
- fonctionnement administratif ;
- performance des Directions ;
- consommation des crédits ;
- EB en attente ;
- dossiers nécessitant validation ou arbitrage ;
- délais de traitement ;
- engagements ;
- marchés ;
- liquidations ;
- ordonnancements relevant de ses compétences ;
- anomalies administratives ;
- dossiers bloqués ;
- alertes opérationnelles.

Afficher également les dossiers pour lesquels une action du SG est attendue.

Prévoir une zone :

### « Mes décisions à prendre »

avec par exemple :

- EB à valider ;
- dossiers nécessitant arbitrage ;
- ordonnancements relevant de son seuil ;
- dossiers retournés ;
- alertes critiques ;
- demandes exceptionnelles.

---

# 5. VUE COMMISSAIRE

Chaque Commissaire doit disposer d’une vue correspondant uniquement à son périmètre institutionnel.

Afficher notamment :

- budget du Département ;
- budget PAP ;
- budget Hors PAP ;
- crédits consommés ;
- crédits disponibles ;
- taux d’engagement ;
- taux de liquidation ;
- taux de paiement ;
- taux d’exécution physique ;
- produits ;
- sous-produits ;
- activités ;
- tâches ;
- indicateurs ;
- résultats atteints ;
- activités en retard ;
- lignes budgétaires sous-consommées ;
- lignes proches de l’épuisement ;
- dossiers nécessitant validation.

Permettre le drill-down :

**Département → Direction → Service → Produit → Activité → Tâche → Dossier.**

---

# 6. KPI EXÉCUTIFS CONSOLIDÉS

Créer une première rangée de cartes KPI particulièrement lisibles.

Prévoir notamment :

### Budget voté
Montant total officiel du Budget de l’exercice.

### Budget disponible
Crédits restant disponibles.

### Engagements
Montant total engagé.

### Liquidations
Montant total liquidé.

### Ordonnancements
Montant total ordonnancé.

### Paiements
Montant effectivement payé.

### Taux d’exécution financière

Calcul :

**Paiements / Budget disponible ou Budget applicable × 100**

selon la règle financière retenue.

### Taux d’engagement

**Engagements / crédits ouverts × 100**

### Taux de liquidation

### Taux d’ordonnancement

### Taux de paiement

### Exécution physique du PAP

Afficher le taux consolidé issu du module Suivi-Évaluation.

Chaque carte doit présenter :

- valeur principale ;
- unité ;
- évolution ;
- comparaison éventuelle ;
- statut ;
- tendance ;
- accès au détail.

---

# 7. DISTINCTION PAP / HORS PAP

Le tableau de bord doit respecter le modèle officiel de BUDGET-CEEAC :

> Le PAP constitue le volet Investissement du Budget annuel.

Afficher donc systématiquement :

### Budget global

avec ventilation :

**Fonctionnement / Hors PAP**

et

**Investissement / PAP**

Prévoir une comparaison graphique claire entre :

- prévisions ;
- engagements ;
- liquidations ;
- ordonnancements ;
- paiements.

---

# 8. CHAÎNE DE LA DÉPENSE

Créer une visualisation synthétique et interactive de la chaîne :

**Expression de Besoin  
→ Engagement  
→ Liquidation  
→ Ordonnancement  
→ Paiement**

Pour chaque étape afficher :

- nombre total de dossiers ;
- montant concerné ;
- dossiers en cours ;
- dossiers validés ;
- dossiers retournés ;
- dossiers rejetés ;
- délai moyen de traitement ;
- dossiers en retard.

Permettre de cliquer sur chaque étape pour afficher immédiatement la liste des dossiers correspondants.

---

# 9. EXÉCUTION DU PAP

Créer une zone spécifique consacrée au PAP.

Afficher :

- nombre total d’activités ;
- activités démarrées ;
- activités terminées ;
- activités en retard ;
- activités non démarrées ;
- taux d’exécution physique ;
- taux d’exécution financière ;
- indicateurs atteints ;
- indicateurs en retard ;
- produits atteints ;
- résultats à risque.

Prévoir une vue permettant la navigation :

**Pilier  
→ Axe  
→ Objectif  
→ Produit  
→ Sous-produit  
→ Activité  
→ Tâche.**

---

# 10. MATRICE PHYSIQUE / FINANCIÈRE

Créer une visualisation permettant de comparer :

**Exécution financière**  
versus  
**Exécution physique**

afin d’identifier notamment :

- forte consommation financière mais faible réalisation physique ;
- bonne réalisation physique avec faible consommation ;
- projets équilibrés ;
- projets en retard ;
- situations anormales.

Les écarts importants doivent générer une alerte automatique.

---

# 11. ALERTES EXÉCUTIVES

Créer un véritable **moteur d’alertes**.

Afficher les alertes selon plusieurs niveaux :

- Information ;
- Attention ;
- Important ;
- Critique.

Exemples :

### Sous-consommation

Ligne ayant un taux d’exécution anormalement faible par rapport à la période de l’exercice.

### Surconsommation

Ligne budgétaire proche ou au-delà du seuil autorisé.

### Retard d’activité

Activité dont l’avancement physique est inférieur au niveau attendu.

### Dossier bloqué

Dossier dépassant le délai réglementaire ou interne de traitement.

### Écart physique/financier

Consommation élevée mais faible réalisation physique.

### Crédits presque épuisés

Exemple :

- 80 % ;
- 90 % ;
- 95 %.

Les seuils doivent être paramétrables.

---

# 12. ZONE « ALERTES CRITIQUES »

Créer une zone très visible sur la page exécutive.

Pour chaque alerte afficher :

- niveau ;
- structure concernée ;
- type de problème ;
- montant éventuel ;
- activité/dossier ;
- ancienneté ;
- responsable attendu ;
- action recommandée ;
- bouton « Voir le détail ».

Permettre un classement par :

- criticité ;
- montant ;
- ancienneté ;
- structure ;
- type.

---

# 13. INDICATEUR DE SANTÉ BUDGÉTAIRE

Créer un indicateur synthétique permettant de visualiser rapidement la situation.

Exemple :

**Santé de l’exécution budgétaire**

Reposant sur plusieurs composantes :

- exécution financière ;
- exécution physique ;
- délais ;
- anomalies ;
- blocages ;
- consommation des crédits.

Il ne doit toutefois pas masquer les KPI réels : le détail du calcul doit être transparent et consultable.

---

# 14. EXÉCUTION PAR STRUCTURE

Créer un tableau ou graphique permettant de comparer les structures sur des métriques factuelles.

Afficher par exemple :

| Structure | Budget | Engagé | Payé | Exécution financière | Exécution physique | Alertes |
|---|---:|---:|---:|---:|---:|---:|

La hiérarchie doit provenir exclusivement du **référentiel organisationnel officiel de la CEEAC**.

Permettre de naviguer entre :

- Commission ;
- Département ;
- Direction ;
- Service.

Éviter tout classement simpliste « meilleur/pire ». Présenter les valeurs, écarts et alertes afin que le décideur puisse analyser la situation.

---

# 15. TENDANCE DE L’EXÉCUTION

Ajouter un graphique mensuel affichant :

- budget prévu ;
- engagements ;
- liquidations ;
- ordonnancements ;
- paiements.

Afficher l’évolution de janvier à décembre.

Permettre également une comparaison :

**réalisation réelle versus trajectoire prévisionnelle.**

---

# 16. PROJECTION DE FIN D’EXERCICE

À partir des données existantes, prévoir une zone de projection analytique présentant notamment :

- rythme actuel de consommation ;
- montant restant ;
- écart par rapport à la programmation ;
- activités nécessitant une accélération ;
- lignes à surveiller.

Toute projection doit être clairement distinguée des données réalisées.

---

# 17. DOSSIERS EN ATTENTE DE DÉCISION

Créer une zone :

# Mes décisions à prendre

Afficher selon le profil :

- dossier ;
- référence ;
- étape ;
- montant ;
- structure ;
- date de soumission ;
- délai écoulé ;
- priorité ;
- action attendue.

Permettre d’ouvrir directement le dossier sans passer par plusieurs menus.

---

# 18. FILTRES EXÉCUTIFS

Ajouter une barre de filtres compacte.

Filtres :

- exercice ;
- période ;
- Département ;
- Direction ;
- Service ;
- PAP / Hors PAP ;
- source de financement ;
- programme ;
- activité ;
- état de la dépense ;
- statut ;
- niveau d’alerte.

Prévoir :

- filtres rapides ;
- filtres avancés ;
- réinitialisation ;
- mémorisation éventuelle des filtres utilisateur.

---

# 19. DRILL-DOWN

Tous les composants doivent permettre de descendre du niveau consolidé vers le détail.

Exemple :

**Budget global  
→ PAP  
→ Département  
→ Produit  
→ Activité  
→ Tâche  
→ Expression de Besoin  
→ Engagement  
→ Liquidation  
→ Ordonnancement  
→ Paiement.**

Les données détaillées doivent s’ouvrir dans une vue latérale, un panneau contextuel ou une page dédiée suivant la quantité d’informations.

---

# 20. EXPORT DU TABLEAU DE BORD

Prévoir :

- export PDF ;
- impression ;
- export Excel des données détaillées ;
- génération d’un rapport exécutif.

Créer notamment :

### Rapport exécutif de l’exécution budgétaire

contenant :

- situation globale ;
- KPI ;
- PAP ;
- exécution financière ;
- exécution physique ;
- alertes ;
- dossiers critiques ;
- principales variations ;
- date et heure de génération.

---

# 21. DONNÉES TEMPS RÉEL

Le tableau de bord ne doit pas utiliser des données indépendantes ou ressaisies manuellement.

Tous les KPI doivent provenir automatiquement des modules :

- Budget ;
- Planification stratégique ;
- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement ;
- Marchés ;
- Suivi-Évaluation ;
- GED ;
- Référentiel organisationnel.

Une même donnée ne doit jamais être recalculée différemment selon les pages.

---

# 22. QUALITÉ ET FIABILITÉ DES DONNÉES

Afficher la date de dernière actualisation.

Prévoir également un indicateur signalant :

- données incomplètes ;
- informations non validées ;
- données en attente de mise à jour ;
- incohérences détectées.

Un décideur doit pouvoir distinguer une donnée validée d’une information encore provisoire.

---

# 23. DESIGN UX/UI

Créer une interface exceptionnelle, professionnelle et institutionnelle.

Le tableau de bord doit être :

- moderne ;
- sobre ;
- premium ;
- lisible ;
- responsive ;
- très rapide à comprendre ;
- adapté à un écran de direction ;
- utilisable également sur tablette.

Éviter :

- surcharge graphique ;
- trop de couleurs ;
- graphiques décoratifs sans valeur décisionnelle ;
- KPI redondants ;
- informations techniques inutiles aux décideurs.

Respecter le Design System général de BUDGET-CEEAC.

Hiérarchie visuelle recommandée :

**Niveau 1 : situation générale**

**Niveau 2 : KPI**

**Niveau 3 : exécution budgétaire et PAP**

**Niveau 4 : alertes**

**Niveau 5 : dossiers nécessitant une action**

---

# 24. RESPONSIVE DESIGN

Prévoir au minimum :

### Desktop
Vue exécutive complète.

### Tablette
KPI et alertes prioritaires adaptés.

### Mobile
Vue fortement synthétisée avec :

- Budget ;
- exécution ;
- alertes critiques ;
- décisions à prendre.

---

# 25. CRITÈRES D’ACCEPTATION

Le module sera considéré conforme lorsque :

- la Présidence dispose d’une vue consolidée de toute la Commission ;
- le SG dispose d’une vue correspondant à son périmètre ;
- chaque Commissaire ne visualise par défaut que son Département ;
- les KPI sont calculés à partir des données réelles de BUDGET-CEEAC ;
- PAP et Hors PAP sont clairement distingués ;
- le PAP est traité comme volet Investissement du Budget ;
- la chaîne EB → Engagement → Liquidation → Ordonnancement → Paiement est visible ;
- l’exécution physique et financière peut être comparée ;
- les alertes critiques apparaissent automatiquement ;
- les seuils d’alerte sont paramétrables ;
- chaque indicateur peut être exploré par drill-down ;
- les dossiers nécessitant une décision sont accessibles directement ;
- les données respectent les droits et habilitations ;
- aucune donnée fictive n’est utilisée lorsque l’information réelle existe ;
- la page reste lisible malgré le volume d’informations ;
- l’ensemble reste cohérent avec les autres modules de BUDGET-CEEAC.

---

# 26. CONSIGNE D’IMPLÉMENTATION

Avant toute modification :

1. auditer le tableau de bord et les composants existants ;
2. identifier ce qui peut être conservé ;
3. identifier les données et KPI déjà disponibles ;
4. supprimer les doublons ;
5. connecter les composants aux référentiels et modules réels ;
6. créer les nouveaux composants manquants ;
7. harmoniser les vues Présidence, SG et Commissaire ;
8. tester le responsive ;
9. tester les droits d’accès ;
10. vérifier tous les calculs de KPI.

Ne pas casser les fonctionnalités existantes correctement implémentées.

Le résultat final doit être un **cockpit exécutif de pilotage budgétaire et programmatique**, permettant à un décideur de comprendre immédiatement :

**Où en sommes-nous ?  
Que consommons-nous ?  
Que réalisons-nous ?  
Où sont les écarts ?  
Quels dossiers sont bloqués ?  
Quelles alertes nécessitent une attention ?  
Quelles décisions doivent être prises maintenant ?**