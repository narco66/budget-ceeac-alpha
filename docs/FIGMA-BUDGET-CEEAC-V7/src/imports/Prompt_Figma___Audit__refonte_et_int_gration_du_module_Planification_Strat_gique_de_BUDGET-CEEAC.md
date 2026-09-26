# PROMPT FIGMA — AUDIT, REFONTE ET INTÉGRATION DU MODULE PLANIFICATION STRATÉGIQUE DE BUDGET-CEEAC

## 1. CONTEXTE

Tu travailles sur la maquette Figma existante de **BUDGET-CEEAC**.

Je joins à ce prompt un fichier intitulé ou correspondant à :

# « DESCRIPTION DÉTAILLÉE DU MODULE PLANIFICATION STRATÉGIQUE DE BUDGET-CEEAC »

Ce fichier constitue la **référence fonctionnelle principale** pour l’évolution du module Planification Stratégique.

Ta mission consiste à :

1. auditer intégralement l’existant ;
2. comprendre ce qui est déjà correctement conçu ;
3. identifier les écarts avec la nouvelle description fonctionnelle ;
4. conserver tout ce qui est pertinent et fonctionnel ;
5. compléter ce qui est incomplet ;
6. corriger ce qui est incohérent ;
7. remplacer uniquement ce qui est réellement obsolète ;
8. créer les fonctionnalités et écrans manquants ;
9. intégrer le nouveau fonctionnement à l’ensemble de BUDGET-CEEAC ;
10. garantir qu’aucune régression n’est introduite.

Il ne s’agit donc pas de supprimer le module actuel pour le reconstruire aveuglément.

La cible est une **refonte contrôlée, progressive et non destructive**.

---

# 2. RÈGLE ABSOLUE : NE PAS CASSER L’EXISTANT

Avant toute modification :

- comprendre le rôle de chaque écran existant ;
- comprendre les composants utilisés ;
- identifier les dépendances avec les autres modules ;
- identifier les interactions existantes ;
- identifier les données déjà représentées ;
- identifier les workflows déjà maquettés.

Ne supprimer aucun élément uniquement parce qu’il n’apparaît pas explicitement dans le nouveau document.

Pour chaque élément existant, déterminer s’il doit être :

### Conservé tel quel

### Conservé et amélioré

### Fusionné avec un nouveau composant

### Déplacé

### Remplacé

### Déprécié

### Supprimé uniquement s’il est réellement obsolète ou contradictoire

Toute suppression doit pouvoir être justifiée.

---

# 3. ORDRE DE PRIORITÉ DES SOURCES

Utiliser les sources dans l’ordre suivant :

1. **Description détaillée du module Planification Stratégique jointe à ce prompt** ;
2. cahier des charges actuel de BUDGET-CEEAC ;
3. référentiel PAP ;
4. référentiel budgétaire ;
5. référentiel organisationnel ;
6. description du module Suivi-Évaluation ;
7. description du module Expression de Besoin ;
8. description des autres modules impactés ;
9. maquette Figma existante.

En cas de contradiction sur une fonctionnalité propre à la Planification Stratégique, la description détaillée jointe prévaut.

Cependant, préserver toute fonctionnalité existante utile qui ne contredit pas cette nouvelle description.

---

# 4. AUDIT FONCTIONNEL COMPLET DE L’EXISTANT

Avant de produire la nouvelle maquette, auditer le module actuel.

Analyser au minimum :

- Dashboard ;
- Exercices ;
- Piliers ;
- Axes ;
- Produits ;
- Sous-Produits ;
- Activités ;
- Tâches éventuelles ;
- indicateurs ;
- Gantt ;
- responsables ;
- périodes ;
- statuts ;
- workflows ;
- versions ;
- publications ;
- rapports ;
- historique ;
- notifications ;
- intégrations avec PAP et S&E.

---

# 5. MATRICE D’AUDIT

Produire une matrice du type :

| Fonction | Existant | Conforme | Partiel | Manquant | Obsolète | Action |
|---|---|---|---|---|---|---|
| Gestion Pilier | Oui | ✓ | | | | Conserver |
| Création Axe | Oui | | ✓ | | | Compléter |
| Gestion Tâches | Non | | | ✓ | | Créer |
| Versionnement | Partiel | | ✓ | | | Refondre |

Cette matrice doit guider toute la refonte.

---

# 6. AUDIT UX/UI

Analyser également :

- qualité de navigation ;
- densité des interfaces ;
- lisibilité ;
- organisation des formulaires ;
- cohérence des tableaux ;
- filtres ;
- breadcrumbs ;
- responsive ;
- accessibilité ;
- qualité des composants ;
- cohérence du design system.

Identifier les composants réutilisables avant d’en créer de nouveaux.

---

# 7. CHAÎNE DE RÉSULTATS CIBLE

La structure fonctionnelle à intégrer est :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

Cette hiérarchie doit devenir la référence du module.

Chaque niveau doit pouvoir :

- être consulté ;
- être créé ;
- être modifié ;
- avoir plusieurs enfants ;
- être recherché ;
- être filtré ;
- disposer d’un historique ;
- disposer d’un statut ;
- être rattaché à un exercice ;
- être rattaché à une version.

---

# 8. GESTION DYNAMIQUE DE TOUS LES NIVEAUX

Le système ne doit pas permettre uniquement l’ajout d’une Tâche.

Il doit permettre :

### + Nouveau Pilier

### + Nouvel Axe

### + Nouveau Produit

### + Nouveau Sous-Produit

### + Nouvelle Activité

### + Nouvelle Tâche

Chaque parent doit pouvoir créer plusieurs enfants.

---

# 9. ARBRE STRATÉGIQUE INTERACTIF

Créer ou améliorer une vue :

▼ Pilier

 ▼ Axe

  ▼ Produit

   ▼ Sous-Produit

    ▼ Activité

     • Tâche

Chaque nœud doit proposer selon les droits :

- consulter ;
- modifier ;
- ajouter enfant ;
- dupliquer ;
- réordonner ;
- déplacer ;
- désactiver ;
- voir historique.

---

# 10. VUE TABLEAU COMPLÉMENTAIRE

Créer une vue tableau permettant de gérer de grands volumes.

Colonnes :

- code ;
- niveau ;
- libellé ;
- parent ;
- responsable ;
- exercice ;
- version ;
- statut ;
- nombre d’enfants.

Prévoir filtres et recherche.

---

# 11. CRÉATION D’UN NOUVEAU PILIER

Prévoir un parcours complet permettant de créer un nouveau Pilier.

Champs principaux :

- code ;
- libellé ;
- description ;
- orientation stratégique ;
- objectif général ;
- période ;
- responsable ;
- ordre ;
- statut ;
- exercice ;
- version.

Après création, permettre immédiatement :

**+ Ajouter un Axe**

---

# 12. CRÉATION DES AUTRES NŒUDS

Chaque niveau doit disposer d’un formulaire contextualisé.

Exemple :

### Axe
Rattaché au Pilier.

### Produit
Rattaché à l’Axe.

### Sous-Produit
Rattaché au Produit.

### Activité
Rattachée au Sous-Produit.

### Tâche
Rattachée à l’Activité.

Le parent doit toujours être visible.

---

# 13. ASSISTANT DE CRÉATION D’UNE BRANCHE COMPLÈTE

Créer un assistant optionnel :

**Étape 1 — Pilier**

**Étape 2 — Axes**

**Étape 3 — Produits**

**Étape 4 — Sous-Produits**

**Étape 5 — Activités**

**Étape 6 — Tâches**

**Étape 7 — Indicateurs**

**Étape 8 — Planning**

**Étape 9 — Contrôle**

**Étape 10 — Soumission / Publication**

---

# 14. CODIFICATION HIÉRARCHIQUE

Prévoir une codification cohérente :

**P01**

**P01-A01**

**P01-A01-PR01**

**P01-A01-PR01-SP01**

**P01-A01-PR01-SP01-ACT01**

**P01-A01-PR01-SP01-ACT01-T01**

Le code doit être :

- unique ;
- stable après publication ;
- généré ou assisté ;
- traçable.

---

# 15. INTÉGRITÉ HIÉRARCHIQUE

Empêcher :

- Axe sans Pilier ;
- Produit sans Axe ;
- Sous-Produit sans Produit ;
- Activité sans Sous-Produit ;
- Tâche sans Activité.

Prévoir des états d’erreur explicites.

---

# 16. GESTION DES EXERCICES

Intégrer complètement la notion d’exercice.

Le système doit pouvoir gérer simultanément :

**2026 — En exécution**

et

**2027 — En préparation**

Prévoir un sélecteur d’exercice global.

---

# 17. STATUTS D’EXERCICE

Distinguer clairement :

### À préparer

### En préparation

### En exécution

### Clôturé

### Archivé

Ne pas mélanger ces statuts avec ceux de publication.

---

# 18. GESTION DES VERSIONS

Chaque exercice peut avoir plusieurs versions.

Exemple :

**2027 — v1.0**

**2027 — v1.1**

**2027 — v1.2**

Chaque version doit afficher :

- numéro ;
- auteur ;
- statut ;
- date ;
- date d’effet ;
- motif.

---

# 19. STATUTS DE VERSION

Prévoir :

### Brouillon

### Soumise

### En vérification

### Retournée

### Validée

### Publiée

### Rejetée

### Remplacée

Ces statuts doivent rester indépendants du statut de l’exercice.

---

# 20. PUBLICATION

Une version publiée devient une référence officielle de BUDGET-CEEAC.

Avant publication :

- elle reste modifiable selon les droits ;
- elle n’est pas utilisée par les modules transactionnels.

Après publication :

- elle peut alimenter PAP ;
- Budget ;
- S&E ;
- EB ;
- Reporting.

---

# 21. DATE D’EFFET

Afficher :

**Publié le**

**Applicable à partir du**

Une version peut être publiée mais ne pas encore être active.

---

# 22. RÉVISION APRÈS PUBLICATION

Ne jamais modifier directement une structure publiée.

Créer :

**Demander une révision**

Puis :

**v1.0 publiée**

→ **v1.1 brouillon**

La v1.0 reste active jusqu’à la date d’effet de la v1.1.

---

# 23. COMPARAISON DE VERSIONS

Créer une page permettant de visualiser :

### Ajouts

### Modifications

### Déplacements

### Désactivations

### Suppressions autorisées

Exemple :

**+ Axe 3**

**~ Responsable ACT-04**

**→ Activité déplacée**

---

# 24. PRÉSERVATION DE L’HISTORIQUE

Règle absolue :

> Une nouvelle version ne doit jamais réécrire rétroactivement les versions précédentes.

Les données historiques doivent rester reproductibles.

---

# 25. INITIALISATION D’UN NOUVEL EXERCICE

Créer un assistant :

**Initialiser 2027**

Options :

### Partir de zéro

### Reprendre 2026

### Reprise sélective

---

# 26. REPRISE DE L’EXERCICE PRÉCÉDENT

Permettre de sélectionner :

- Piliers ;
- Axes ;
- Produits ;
- Sous-Produits ;
- Activités ;
- Tâches ;
- indicateurs ;
- responsables ;
- calendriers.

Ne jamais recopier automatiquement les transactions financières historiques.

---

# 27. RECONDUCTION

Créer :

**Reconduire vers l’exercice suivant**

Pour :

- Activité inachevée ;
- Tâche inachevée ;
- programme pluriannuel.

La relation source/cible doit rester visible.

---

# 28. INDICATEURS

Intégrer la gestion des indicateurs.

Prévoir notamment :

- code ;
- libellé ;
- définition ;
- type ;
- unité ;
- source ;
- fréquence ;
- baseline ;
- cible ;
- responsable ;
- formule.

---

# 29. RATTACHEMENT DES INDICATEURS

Permettre leur rattachement aux niveaux pertinents :

- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité ;
- Tâche.

Afficher clairement leur niveau.

---

# 30. CIBLES PAR EXERCICE

Un indicateur peut avoir :

**2026 → cible 60 %**

**2027 → cible 75 %**

**2028 → cible 85 %**

Ne jamais écraser les cibles antérieures.

---

# 31. RESPONSABLES ET STRUCTURES

Chaque niveau pertinent peut avoir :

- responsable ;
- fonction ;
- structure ;
- date début ;
- date fin.

Utiliser le référentiel organisationnel existant.

---

# 32. ACTIVITÉS ET TÂCHES

La Tâche doit devenir le niveau opérationnel fin.

Elle doit être intégrée à :

- Planification ;
- PAP ;
- Gantt ;
- S&E ;
- EB lorsque pertinent.

---

# 33. PONDÉRATION DES TÂCHES

Prévoir :

| Tâche | Poids |
|---|---:|
| Étude | 20 % |
| Acquisition | 30 % |
| Déploiement | 40 % |
| Formation | 10 % |

Total :

**100 %**

Afficher une anomalie si incohérent.

---

# 34. GANTT

Le Gantt doit afficher :

- Activités ;
- Tâches ;
- jalons ;
- dépendances ;
- périodes prévues ;
- périodes réelles ;
- avancement ;
- retards.

---

# 35. DÉPENDANCES

Prévoir :

- fin-début ;
- début-début ;
- fin-fin ;
- autres relations pertinentes.

---

# 36. JALONS

Exemples :

- TDR validés ;
- marché lancé ;
- contrat signé ;
- livraison ;
- réception ;
- mise en service.

---

# 37. BUDGET PRÉVISIONNEL

Permettre de renseigner :

- coût estimatif Activité ;
- coût estimatif Tâche ;
- source de financement éventuelle.

Ces montants servent à la préparation mais ne doivent pas être confondus avec un crédit budgétaire voté.

---

# 38. INTÉGRATION PAP

Après publication, la chaîne doit pouvoir être utilisée directement dans le PAP.

Ne jamais recréer une seconde chaîne spécifique au PAP.

---

# 39. INTÉGRATION BUDGET

Les éléments stratégiques publiés doivent pouvoir être rattachés aux lignes budgétaires.

Conserver la distinction :

**Planification stratégique**

≠

**Dotation budgétaire approuvée**

---

# 40. INTÉGRATION EXPRESSION DE BESOIN

Lorsqu’une EB relève du PAP, elle doit pouvoir récupérer automatiquement :

- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité ;
- Tâches ;
- indicateurs ;
- responsable.

---

# 41. INTÉGRATION SUIVI-ÉVALUATION

Après publication, les nouveaux éléments doivent devenir disponibles dans S&E sans ressaisie.

Prévoir suivi :

- activités ;
- tâches ;
- indicateurs ;
- réalisations ;
- risques ;
- écarts ;
- recommandations.

---

# 42. AGRÉGATION

Prévoir la remontée :

**Tâches → Activité → Sous-Produit → Produit → Axe → Pilier**

Pour :

- progression ;
- coût ;
- performance ;
- indicateurs ;
- risques.

---

# 43. DASHBOARD PLANIFICATION

Créer ou refondre le dashboard avec :

- nombre de Piliers ;
- Axes ;
- Produits ;
- Sous-Produits ;
- Activités ;
- Tâches ;
- branches Brouillon ;
- versions à valider ;
- publications ;
- incohérences ;
- éléments sans responsable ;
- éléments sans indicateur.

---

# 44. DASHBOARD DES EXERCICES

Afficher :

- exercice ;
- statut ;
- version active ;
- dernière publication ;
- nombre de Piliers ;
- nombre de modifications en cours.

---

# 45. RECHERCHE GLOBALE

Rechercher par :

- code ;
- libellé ;
- niveau ;
- parent ;
- responsable ;
- structure ;
- exercice.

---

# 46. FILTRES

Prévoir :

- exercice ;
- version ;
- niveau ;
- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité ;
- responsable ;
- statut.

---

# 47. WORKFLOW DE PRÉPARATION

Prévoir :

**Brouillon**

↓

**Soumis**

↓

**En vérification**

↓

**Validé**

↓

**Publié**

Avec :

**Retourné**

ou

**Rejeté**

---

# 48. CONTRÔLE DE COHÉRENCE

Avant publication, créer une page :

# CONTRÔLE DE COHÉRENCE

Vérifier :

✓ codes uniques

✓ parents valides

✓ exercice valide

✓ périodes cohérentes

✓ responsables

✓ indicateurs requis

✓ pondérations cohérentes

✓ absence de nœuds orphelins

---

# 49. NIVEAUX D’ANOMALIE

### Information

### Avertissement

### Bloquant

Une anomalie bloquante interdit la publication.

---

# 50. « MES TÂCHES »

Créer des cartes :

- branche à compléter ;
- version à vérifier ;
- correction attendue ;
- version à valider ;
- publication à effectuer ;
- indicateur manquant.

---

# 51. NOTIFICATIONS

Prévoir :

- nouveau nœud créé ;
- nouvelle branche ;
- soumission ;
- retour ;
- validation ;
- publication ;
- révision ;
- clôture ;
- incohérence.

---

# 52. HISTORIQUE

Chaque nœud doit afficher :

- création ;
- modification ;
- déplacement ;
- changement responsable ;
- changement période ;
- désactivation ;
- publication.

---

# 53. AUDIT

Créer un journal avec :

- utilisateur ;
- rôle ;
- exercice ;
- version ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- justification ;
- date ;
- heure.

---

# 54. DROITS

Prévoir au minimum :

- consulter ;
- créer ;
- modifier ;
- déplacer ;
- soumettre ;
- vérifier ;
- valider ;
- publier ;
- désactiver ;
- administrer.

---

# 55. NON-RÉGRESSION

La refonte ne doit jamais :

- casser les branches existantes ;
- modifier rétroactivement les anciennes versions ;
- supprimer les liens PAP ;
- supprimer les liens Budget ;
- supprimer les liens S&E ;
- perdre les indicateurs ;
- perdre les historiques ;
- créer des doublons de référentiel.

---

# 56. DESIGN SYSTEM

Réutiliser autant que possible :

- composants existants ;
- tables ;
- cards ;
- formulaires ;
- badges ;
- modales ;
- breadcrumbs ;
- notifications.

Créer uniquement les composants manquants.

---

# 57. RESPONSIVE

Prévoir :

### Desktop

### Laptop

### Tablette

### Mobile adapté

L’arbre hiérarchique doit rester exploitable sur écran réduit.

---

# 58. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA.

---

# 59. ÉTATS À MAQUETTER

Prévoir :

- arbre vide ;
- aucun exercice ;
- aucune branche ;
- nœud orphelin ;
- code en doublon ;
- version remplacée ;
- exercice clôturé ;
- publication bloquée ;
- droits insuffisants ;
- chargement ;
- erreur ;
- succès.

---

# 60. ARCHITECTURE FIGMA RECOMMANDÉE

Organiser les frames :

**PLAN / 00 — Audit**

**PLAN / 01 — Components**

**PLAN / 02 — Dashboard**

**PLAN / 03 — Exercises**

**PLAN / 04 — Exercise Initialization**

**PLAN / 05 — Tree View**

**PLAN / 06 — Table View**

**PLAN / 07 — Pilier**

**PLAN / 08 — Axe**

**PLAN / 09 — Produit**

**PLAN / 10 — Sous-Produit**

**PLAN / 11 — Activité**

**PLAN / 12 — Tâche**

**PLAN / 13 — Branch Builder**

**PLAN / 14 — Indicators**

**PLAN / 15 — Gantt**

**PLAN / 16 — Coherence Check**

**PLAN / 17 — Validation**

**PLAN / 18 — Publication**

**PLAN / 19 — Revision**

**PLAN / 20 — Version Comparison**

**PLAN / 21 — PAP Integration**

**PLAN / 22 — Budget Integration**

**PLAN / 23 — S&E Integration**

**PLAN / 24 — History**

**PLAN / 25 — Audit**

**PLAN / 26 — Responsive**

**PLAN / 27 — Prototype**

---

# 61. PROTOTYPE OBLIGATOIRE — CAS PRINCIPAL

Le prototype doit démontrer :

**Créer Exercice**

↓

**Initialiser Planification**

↓

**Créer Pilier**

↓

**Créer Axe**

↓

**Créer Produit**

↓

**Créer Sous-Produit**

↓

**Créer Activité**

↓

**Créer plusieurs Tâches**

↓

**Rattacher indicateurs**

↓

**Configurer planning**

↓

**Contrôle de cohérence**

↓

**Soumettre**

↓

**Valider**

↓

**Publier**

↓

**Visualiser dans PAP**

↓

**Visualiser dans Suivi-Évaluation**

---

# 62. PROTOTYPE — RÉVISION

Démontrer également :

**v1.0 publiée**

↓

**Demander révision**

↓

**v1.1 brouillon**

↓

**Ajouter un nouvel Axe**

↓

**Soumettre**

↓

**Valider**

↓

**Publier avec date d’effet**

↓

**v1.0 remplacée**

↓

**v1.1 active**

---

# 63. PROTOTYPE — NON-RÉGRESSION

Montrer que :

- une branche existante reste fonctionnelle ;
- une nouvelle branche peut être ajoutée ;
- les deux coexistent ;
- aucune ancienne donnée n’est perdue.

---

# 64. CRITÈRES D’ACCEPTATION

La refonte sera acceptée uniquement si :

1. l’existant a été audité ;
2. les fonctions conformes ont été conservées ;
3. tous les niveaux peuvent être créés ;
4. la Tâche est pleinement intégrée ;
5. les exercices sont gérés ;
6. les versions sont gérées ;
7. la publication est contrôlée ;
8. les révisions préservent l’historique ;
9. PAP récupère les nouveaux nœuds ;
10. S&E récupère les nouveaux nœuds ;
11. les tableaux de bord sont mis à jour ;
12. aucun nœud orphelin ne peut être créé ;
13. les codes sont contrôlés ;
14. l’historique est conservé ;
15. les droits sont respectés ;
16. le responsive est prévu ;
17. les principaux scénarios sont prototypés.

---

# 65. CRITÈRES DE VALIDATION

La validation finale doit démontrer au moins :

### CV-01
Création d’un Pilier.

### CV-02
Création de plusieurs Axes.

### CV-03
Création d’un Produit.

### CV-04
Création d’un Sous-Produit.

### CV-05
Création d’une Activité.

### CV-06
Création de plusieurs Tâches.

### CV-07
Navigation complète Pilier → Tâche.

### CV-08
Navigation retour Tâche → Pilier.

### CV-09
Gantt affichant Activités et Tâches.

### CV-10
Création d’un nouvel exercice.

### CV-11
Reprise d’un exercice précédent.

### CV-12
Soumission d’une version.

### CV-13
Validation.

### CV-14
Publication.

### CV-15
Création d’une révision.

### CV-16
Comparaison de versions.

### CV-17
Intégration PAP.

### CV-18
Intégration S&E.

### CV-19
Conservation des anciennes données.

### CV-20
Aucune régression majeure sur l’existant.

---

# 66. MATRICE DE CONFORMITÉ FINALE

Produire une matrice :

| Exigence | Existant | Nouvelle maquette | Écran | Interaction | Statut |
|---|---|---|---|---|---|
| Créer Pilier | Non | Oui | Pilier | Ajouter | Conforme |
| Ajouter Tâche | Non | Oui | Activité | Ajouter enfant | Conforme |
| Versionnement | Partiel | Oui | Versions | Révision | Conforme |
| Publication | Partiel | Oui | Publication | Publier | Conforme |
| PAP | Oui | Étendu | PAP | Synchronisation | Conforme |

---

# 67. INSTRUCTION FINALE

Ne reconstruis pas aveuglément le module.

La priorité est :

**AUDITER**

↓

**COMPRENDRE**

↓

**CONSERVER CE QUI EST BON**

↓

**CORRIGER CE QUI EST INCOMPLET**

↓

**AJOUTER CE QUI MANQUE**

↓

**INTÉGRER**

↓

**TESTER LA NON-RÉGRESSION**

La cible fonctionnelle est un module capable de gérer de bout en bout :

**Exercice**

↓

**Version**

↓

**Pilier**

↓

**Axe**

↓

**Produit**

↓

**Sous-Produit**

↓

**Activité**

↓

**Tâche**

↓

**Indicateurs / Planning / Responsables**

↓

**Contrôle**

↓

**Validation**

↓

**Publication**

↓

**PAP / Budget / S&E**

↓

**Révision**

↓

**Historique**

Le fichier joint contenant la **Description détaillée du module Planification Stratégique** doit être relu intégralement avant de considérer la refonte comme achevée.

Pour chaque exigence du fichier joint, vérifier qu’elle correspond dans la nouvelle maquette à au moins :

- un écran ;
- un composant ;
- une interaction ;
- un état ;
- un contrôle ;
- un workflow ;
- un document ;
- ou une règle fonctionnelle clairement matérialisée.

Si une exigence importante n’a pas de traduction précise dans la maquette, considérer la refonte comme incomplète.

Enfin, vérifier explicitement que **l’intégration du nouveau module n’a cassé aucune fonctionnalité existante de BUDGET-CEEAC**.