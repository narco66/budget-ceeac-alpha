# PROMPT FIGMA — AUDIT, MISE À NIVEAU ET INTÉGRATION DU NOUVEAU CAHIER DES CHARGES DE BUDGET-CEEAC

Le contenu fonctionnel de **BUDGET-CEEAC a fortement évolué**. Plusieurs modules, sous-modules, fonctionnalités, workflows, règles métier, écrans, contrôles, tableaux de bord, états PDF et fonctions transversales ont été ajoutés, enrichis ou restructurés.

Je joins à ce prompt la **nouvelle version du Cahier des Charges Fonctionnel complet de BUDGET-CEEAC**, qui devient désormais la **référence fonctionnelle principale et prioritaire du projet**.

Ta mission consiste à réaliser un **audit fonctionnel et UX/UI complet de la maquette BUDGET-CEEAC existante**, puis à **corriger, compléter, adapter, générer et intégrer tout ce qui est nécessaire** afin que la maquette Figma soit pleinement alignée sur cette nouvelle version du cahier des charges.

---

## 1. Principe de priorité documentaire

Considère le **nouveau Cahier des Charges Fonctionnel joint** comme la nouvelle source de vérité.

En cas de contradiction entre :

- une ancienne maquette ;
- une ancienne description de module ;
- un ancien workflow ;
- un ancien écran ;
- une ancienne règle métier ;
- une ancienne organisation du menu ;

et le nouveau cahier des charges :

> **le nouveau Cahier des Charges Fonctionnel doit prévaloir.**

Toutefois, ne supprime pas arbitrairement les éléments existants : analyse d’abord leur utilité et adapte-les intelligemment.

---

# 2. Audit complet de l’existant

Commence par analyser exhaustivement la maquette Figma actuelle.

Pour chaque module, écran et composant existant, détermine son état :

- Conforme ;
- Partiellement conforme ;
- À mettre à jour ;
- Incomplet ;
- Obsolète ;
- À fusionner ;
- À restructurer ;
- À remplacer ;
- Manquant.

Produis mentalement une matrice de correspondance :

**Cahier des charges → Module → Fonctionnalité → Écran existant → Écart → Action à mener**

---

# 3. Identifier tous les écarts fonctionnels

Compare intégralement la maquette actuelle avec le nouveau cahier des charges.

Recherche notamment :

- modules absents ;
- sous-modules absents ;
- fonctionnalités manquantes ;
- écrans inexistants ;
- formulaires incomplets ;
- champs manquants ;
- tableaux incomplets ;
- dashboards non conformes ;
- workflows incorrects ;
- rôles manquants ;
- boutons/action manquants ;
- statuts manquants ;
- règles métier non matérialisées ;
- validations non représentées ;
- contrôles insuffisants ;
- filtres inexistants ;
- vues de détail insuffisantes ;
- historiques non visibles ;
- journaux absents ;
- GED incomplète ;
- notifications absentes ;
- alertes manquantes ;
- exports non intégrés ;
- états PDF non prévus ;
- vues d’audit absentes ;
- interfaces de paramétrage insuffisantes.

---

# 4. Couverture exhaustive des domaines fonctionnels

Audite et actualise notamment l’ensemble des domaines suivants :

1. Administration et paramétrage ;
2. Préparation et programmation budgétaire ;
3. Gestion du Budget ;
4. PAP / GAR / RBM ;
5. Expression de Besoin ;
6. Engagement ;
7. Liquidation ;
8. Ordonnancement ;
9. Paiement ;
10. Recettes ;
11. Tiers / fournisseurs / entreprises ;
12. Achats, marchés et contrats ;
13. Projets et investissements ;
14. Suivi-Évaluation ;
15. Reporting et Business Intelligence ;
16. GED ;
17. Workflow / Mes tâches / Notifications ;
18. Contrôle budgétaire et contrôle interne ;
19. Audit, risques et conformité ;
20. Clôture budgétaire ;
21. Administration technique, sécurité et interopérabilité.

Ajoute également tout autre module ou sous-module présent dans le nouveau cahier des charges.

---

# 5. Respect impératif du principe du Budget unique

Toute la maquette doit respecter le principe :

> **Un exercice budgétaire = un Budget unique.**

Le **PAP fait partie du Budget**.

Il ne doit jamais être présenté comme un deuxième Budget indépendant.

Le PAP représente la dimension programmatique et d’investissement du Budget.

Toute présentation de type :

- « Budget » d’un côté ;
- « Budget PAP » séparé de l’autre ;

doit être corrigée.

---

# 6. Intégration complète du PAP et de la RBM

La maquette doit représenter clairement la chaîne :

**Pilier → Axe → Produit → Sous-produit → Activité → Tâche**

Prévoir des interfaces permettant :

- navigation hiérarchique ;
- vue arborescente ;
- vue tabulaire ;
- rattachement au Budget ;
- allocations budgétaires ;
- indicateurs ;
- responsables ;
- calendriers ;
- suivi physique ;
- suivi financier ;
- performance.

---

# 7. Chaîne de dépense

La chaîne suivante doit être clairement visible et parfaitement cohérente :

**Expression de Besoin**
↓  
**Engagement**
↓  
**Liquidation**
↓  
**Ordonnancement**
↓  
**Paiement**
↓  
**Rapprochement**
↓  
**Reporting / Suivi-Évaluation / Audit**

Les transitions automatiques définies dans le cahier des charges doivent être représentées correctement.

Évite toute étape manuelle fictive qui ne figure pas dans le nouveau référentiel.

---

# 8. Harmonisation des workflows

Chaque workflow doit disposer d’une représentation visuelle homogène.

Pour chaque dossier, afficher notamment :

- étape actuelle ;
- statut précis ;
- acteur ayant effectué la dernière action ;
- acteur attendu ;
- date de la dernière action ;
- temps passé ;
- SLA ;
- étape suivante ;
- actions disponibles.

Prévoir une timeline visuelle telle que :

**Créé → Soumis → Validé N → Validé N+1 → Contrôlé → Approuvé → Étape suivante**

---

# 9. Refonte des formulaires

Pour tous les formulaires existants :

- analyser les champs ;
- supprimer les doublons ;
- ajouter les champs manquants ;
- automatiser les données déductibles ;
- limiter les ressaisies ;
- utiliser des sélecteurs intelligents ;
- prévoir l’autocomplétion ;
- intégrer les contrôles métier ;
- afficher les disponibilités budgétaires ;
- afficher les informations PAP/RBM lorsqu’elles sont pertinentes.

Utiliser des formulaires multi-étapes lorsque cela améliore l’expérience utilisateur.

---

# 10. Dashboard et cockpit

Créer ou améliorer les dashboards de chaque domaine.

Prévoir :

- KPI ;
- cartes synthétiques ;
- graphiques ;
- alertes ;
- dossiers en attente ;
- activités récentes ;
- anomalies ;
- tâches ;
- échéances ;
- disponibilités budgétaires ;
- taux d’exécution ;
- performance PAP ;
- filtres dynamiques.

Toutes les cartes pertinentes doivent permettre un **drill-down** vers les dossiers concernés.

---

# 11. « Mes tâches »

Créer ou actualiser une véritable interface transversale **Mes tâches**.

Elle doit présenter :

- référence du dossier ;
- type ;
- module ;
- objet ;
- montant ;
- initiateur ;
- structure ;
- date de réception ;
- délai ;
- priorité ;
- étape ;
- action attendue.

Tri par défaut :

> **les dossiers les plus récents en tête**, avec possibilité de modifier le tri.

---

# 12. GED

La GED doit être intégrée dans l’ensemble du parcours.

Prévoir :

- ajout de pièces ;
- prévisualisation ;
- versions ;
- classification ;
- téléchargement ;
- historique ;
- pièces obligatoires ;
- pièces manquantes ;
- statut documentaire ;
- signature ;
- preuve d’intégrité ;
- archivage.

---

# 13. Documents PDF officiels

À chaque grande étape métier, prévoir les interfaces permettant :

- Prévisualiser ;
- Générer ;
- Régénérer si autorisé ;
- Télécharger ;
- Imprimer ;
- Archiver.

Les états doivent reprendre la charte documentaire officielle du projet.

Exemples :

- fiche EB ;
- Engagement ;
- certificat d’engagement ;
- Liquidation ;
- certificat de service fait ;
- Ordonnancement ;
- mandat ;
- ordre de paiement ;
- rapports budgétaires ;
- états PAP ;
- rapports de suivi-évaluation ;
- rapports d’audit ;
- états de clôture.

---

# 14. Journal des événements

Intégrer un module complet de **Journal des événements / Audit Trail**.

Chaque événement doit pouvoir afficher :

- date ;
- heure ;
- utilisateur ;
- rôle ;
- structure ;
- action ;
- module ;
- objet ;
- référence ;
- ancienne valeur ;
- nouvelle valeur ;
- statut ;
- résultat ;
- commentaire.

Prévoir :

- filtres ;
- recherche ;
- export ;
- timeline par dossier ;
- détail d’un événement ;
- événements critiques.

---

# 15. Contrôle budgétaire et contrôle interne

Créer ou compléter les interfaces pour :

- disponibilité des crédits ;
- contrôle d’imputation ;
- cohérence Budget/PAP ;
- séparation des fonctions ;
- contrôle des pièces ;
- anomalies ;
- réserves ;
- dérogations ;
- contrôles automatiques ;
- matrice des risques ;
- actions correctives ;
- plans de contrôle.

---

# 16. Clôture budgétaire

Prévoir les interfaces de :

- pré-clôture ;
- contrôle des dossiers ouverts ;
- crédits disponibles ;
- engagements en cours ;
- liquidations en attente ;
- ordonnancements non payés ;
- reports N→N+1 ;
- annulations ;
- rapprochements ;
- clôture provisoire ;
- clôture définitive ;
- réouverture exceptionnelle ;
- archivage.

---

# 17. Reporting et BI

Créer un centre de reporting professionnel.

Prévoir :

- bibliothèque de rapports ;
- favoris ;
- rapports récents ;
- rapports programmés ;
- paramètres ;
- filtres ;
- export PDF/Excel/CSV ;
- visualisations ;
- drill-down.

Inclure notamment :

- situation du Budget ;
- exécution par ligne ;
- exécution par structure ;
- exécution PAP ;
- engagements ;
- liquidations ;
- ordonnancements ;
- paiements ;
- restes à payer ;
- exécution CEEAC/PTF ;
- délais de traitement ;
- performance RBM ;
- anomalies ;
- audit.

---

# 18. Administration et paramétrage

Actualiser les interfaces d’administration pour intégrer :

- utilisateurs ;
- rôles ;
- permissions ;
- structures ;
- affectations ;
- délégations ;
- intérims ;
- exercices ;
- nomenclature ;
- sources de financement ;
- PTF ;
- workflows ;
- seuils ;
- SLA ;
- statuts ;
- numérotation ;
- catégories documentaires ;
- modèles PDF ;
- notifications ;
- paramètres métier ;
- intégrations ;
- journalisation.

---

# 19. Recherche globale

Ajouter une recherche transversale accessible depuis l’ensemble de l’application.

Elle doit pouvoir rechercher notamment :

- EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement ;
- Budget ;
- ligne budgétaire ;
- PAP ;
- activité ;
- fournisseur ;
- contrat ;
- facture ;
- projet ;
- document.

---

# 20. Navigation et sidebar

Réorganise le sidebar en fonction de l’architecture fonctionnelle actualisée.

Le menu doit être :

- logique ;
- compact ;
- hiérarchisé ;
- facilement compréhensible ;
- adapté aux permissions de l’utilisateur.

Utiliser des catégories principales avec sous-menus.

Ne pas surcharger le menu principal.

---

# 21. Cohérence UX/UI

Préserver le **Design System BUDGET-CEEAC existant** lorsqu’il est pertinent.

Conserver notamment :

- identité visuelle ;
- palette ;
- typographies ;
- cartes ;
- boutons ;
- tableaux ;
- badges ;
- icônes ;
- sidebar ;
- header ;
- espacements ;
- bordures ;
- composants.

Mais améliorer l’existant lorsqu’une meilleure solution UX/UI est nécessaire.

---

# 22. Design professionnel

Le résultat attendu doit être :

- institutionnel ;
- moderne ;
- premium ;
- sobre ;
- élégant ;
- lisible ;
- attractif ;
- professionnel ;
- adapté à une application financière critique.

Éviter les interfaces trop chargées.

Privilégier :

- hiérarchie visuelle forte ;
- beaucoup d’espace utile ;
- couleurs fonctionnelles ;
- cartes claires ;
- tableaux professionnels ;
- filtres élégants ;
- actions contextualisées.

---

# 23. Responsive design

Prévoir au minimum les versions :

- desktop institutionnel ;
- laptop ;
- tablette.

Les principaux dashboards doivent rester exploitables sur mobile pour consultation.

---

# 24. États d’interface

Tous les écrans importants doivent prévoir :

- chargement ;
- vide ;
- erreur ;
- accès interdit ;
- succès ;
- données incomplètes ;
- opération bloquée ;
- avertissement ;
- confirmation.

---

# 25. Composants réutilisables

Créer ou consolider un Design System avec composants Figma réutilisables :

- boutons ;
- champs ;
- sélecteurs ;
- date pickers ;
- tableaux ;
- cartes KPI ;
- badges ;
- modales ;
- drawers ;
- timelines ;
- breadcrumbs ;
- pagination ;
- filtres ;
- alertes ;
- pièces jointes ;
- signatures ;
- statuts ;
- graphiques.

Utiliser les **Variants / Component Properties / Auto Layout**.

---

# 26. Nommage Figma

Organiser les pages Figma de façon claire.

Exemple :

```text
00 — Design System
01 — Authentification
02 — Accueil & Dashboards
03 — Administration
04 — Préparation budgétaire
05 — Budget
06 — PAP / RBM
07 — Expression de Besoin
08 — Engagement
09 — Liquidation
10 — Ordonnancement
11 — Paiement
12 — Recettes
13 — Tiers & Entreprises
14 — Achats & Marchés
15 — Projets
16 — Suivi-Évaluation
17 — Reporting & BI
18 — GED
19 — Workflow & Mes tâches
20 — Contrôle interne
21 — Audit & Risques
22 — Clôture
23 — Paramétrage
24 — États PDF
25 — Prototypes
```

---

# 27. Ne pas détruire les éléments conformes

Si un écran existant est déjà pertinent :

- ne le recrée pas inutilement ;
- conserve sa structure ;
- améliore-la ;
- complète-la ;
- transforme-la en composant lorsque nécessaire.

L’objectif est une **mise à niveau intelligente**, pas une reconstruction aveugle.

---

# 28. Audit fonctionnel écran par écran

Pour chaque écran existant :

1. identifier sa finalité ;
2. rechercher la spécification correspondante dans le cahier des charges ;
3. comparer contenu et comportement ;
4. identifier les écarts ;
5. corriger ;
6. compléter ;
7. harmoniser ;
8. relier au prototype.

---

# 29. Génération des écrans manquants

Lorsqu’un écran prévu dans le cahier des charges n’existe pas :

> **le créer directement dans Figma.**

Ne pas se limiter à signaler qu’il manque.

Créer :

- écran ;
- variantes ;
- composants ;
- interactions ;
- états ;
- navigation associée.

---

# 30. Prototype fonctionnel

Relier les principales interfaces afin de simuler réellement les parcours.

Exemples :

**Dashboard → Mes tâches → EB → Validation → Engagement**

**Engagement → Liquidation → Ordonnancement → Paiement**

**Budget → Ligne → Historique → Exécution**

**PAP → Activité → Indicateur → Suivi**

**Anomalie → Dossier → Correction → Levée**

---

# 31. Cohérence des données

Les maquettes doivent utiliser des exemples de données cohérents d’un écran à l’autre.

Une même référence de dossier doit conserver :

- même montant ;
- même structure ;
- même bénéficiaire ;
- même statut logique ;
- même ligne budgétaire ;
- même PAP ;
- même financement.

---

# 32. Résultat final attendu

À l’issue de ce travail, la maquette Figma doit devenir la **référence UX/UI complète de BUDGET-CEEAC**.

Elle doit permettre de vérifier visuellement que :

> **100 % des domaines, modules, fonctionnalités majeures, workflows, rôles, contrôles et états prévus dans le nouveau Cahier des Charges Fonctionnel disposent d’une traduction cohérente dans l’interface utilisateur.**

Ne te limite pas à produire de simples écrans supplémentaires.

Tu dois :

**AUDITER → COMPARER → CORRIGER → RESTRUCTURER → COMPLÉTER → GÉNÉRER → INTÉGRER → HARMONISER → PROTOTYPER → VÉRIFIER**

l’ensemble de BUDGET-CEEAC.

Le résultat doit être une maquette :

**complète, cohérente, fonctionnelle, professionnelle, institutionnelle, moderne et directement exploitable comme référence pour l’implémentation de BUDGET-CEEAC.**