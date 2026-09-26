# DESCRIPTION DÉTAILLÉE DU MODULE PLANIFICATION STRATÉGIQUE  
## Application BUDGET-CEEAC

## 1. OBJET DU MODULE

Le module **Planification Stratégique** constitue le socle programmatique de BUDGET-CEEAC.

Il permet à la Commission de la CEEAC de structurer, organiser, versionner, publier et suivre sa chaîne de résultats, depuis les orientations stratégiques de haut niveau jusqu’aux tâches opérationnelles.

La chaîne de résultats retenue est :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

Le module doit permettre non seulement de consulter cette chaîne, mais également de la construire et de la faire évoluer dynamiquement.

Il doit donc permettre :

- de créer un nouveau Pilier ;
- de créer plusieurs Axes sous un Pilier ;
- de créer plusieurs Produits sous un Axe ;
- de créer plusieurs Sous-Produits sous un Produit ;
- de créer plusieurs Activités sous un Sous-Produit ;
- de créer plusieurs Tâches sous une Activité ;
- de modifier les nœuds ;
- de les réordonner ;
- de les déplacer de manière contrôlée ;
- de les désactiver ;
- de les versionner ;
- de les publier ;
- de les rattacher à un exercice ;
- de les exploiter dans le PAP ;
- de les exploiter dans le Budget ;
- de les suivre dans le Suivi-Évaluation.

Le module doit devenir le **référentiel stratégique central de BUDGET-CEEAC**.

---

# 2. OBJECTIFS DU MODULE

Le module doit permettre de :

1. formaliser la stratégie de la Commission de la CEEAC ;
2. structurer la chaîne de résultats ;
3. créer et administrer tous les niveaux de la hiérarchie ;
4. rattacher les objectifs et résultats attendus ;
5. gérer les indicateurs ;
6. affecter les responsabilités ;
7. planifier les périodes ;
8. gérer les tâches ;
9. établir les dépendances ;
10. construire le Gantt ;
11. préparer le PAP ;
12. alimenter le Budget ;
13. alimenter le Suivi-Évaluation ;
14. suivre l’évolution de la stratégie entre exercices ;
15. versionner la structure ;
16. publier une version officielle ;
17. préserver l’historique ;
18. assurer la traçabilité des modifications ;
19. empêcher les incohérences structurelles ;
20. faciliter le pilotage stratégique.

---

# 3. CHAÎNE DE RÉSULTATS DE RÉFÉRENCE

La structure hiérarchique officielle est :

## Niveau 1 — Pilier

↓

## Niveau 2 — Axe

↓

## Niveau 3 — Produit

↓

## Niveau 4 — Sous-Produit

↓

## Niveau 5 — Activité

↓

## Niveau 6 — Tâche

Cette structure doit être exploitée de manière homogène dans toute l’application.

---

# 4. PRINCIPE DE STRUCTURE DYNAMIQUE

La chaîne de résultats ne doit jamais être codée en dur dans l’interface.

Les utilisateurs habilités doivent pouvoir créer de nouveaux nœuds.

Exemple :

**Pilier 1**

→ Axe 1.1

→ Axe 1.2

→ Axe 1.3

Puis sous Axe 1.2 :

→ Produit 1.2.1

→ Produit 1.2.2

Puis :

→ Sous-Produits

→ Activités

→ Tâches.

Le système doit pouvoir accueillir de nouvelles branches sans modification du code applicatif.

---

# 5. LE PILIER

Le Pilier représente un domaine stratégique majeur.

Exemples de données :

- code ;
- libellé ;
- description ;
- orientation stratégique ;
- objectif général ;
- période ;
- ordre d’affichage ;
- responsable institutionnel ;
- statut ;
- exercice ;
- version.

Un Pilier peut contenir plusieurs Axes.

---

# 6. L’AXE

L’Axe constitue une orientation structurante au sein d’un Pilier.

Il contient notamment :

- code ;
- libellé ;
- Pilier parent ;
- description ;
- objectif ;
- responsable ;
- période ;
- ordre ;
- statut ;
- exercice ;
- version.

Un Axe ne peut exister sans Pilier.

Un Axe peut contenir plusieurs Produits.

---

# 7. LE PRODUIT

Le Produit correspond à un résultat majeur attendu.

Il peut comporter :

- code ;
- libellé ;
- Axe parent ;
- description ;
- résultat attendu ;
- indicateurs ;
- responsable ;
- période ;
- statut.

Un Produit peut contenir plusieurs Sous-Produits.

---

# 8. LE SOUS-PRODUIT

Le Sous-Produit représente un niveau plus détaillé du résultat.

Il comporte notamment :

- code ;
- libellé ;
- Produit parent ;
- description ;
- résultat attendu ;
- responsable ;
- indicateurs ;
- période ;
- statut.

Il contient plusieurs Activités.

---

# 9. L’ACTIVITÉ

L’Activité est le niveau principal de programmation opérationnelle et budgétaire.

Elle doit pouvoir contenir :

- code ;
- libellé ;
- Sous-Produit parent ;
- description ;
- résultat attendu ;
- structure responsable ;
- responsable ;
- date de début ;
- date de fin ;
- priorité ;
- budget prévisionnel ;
- indicateurs ;
- statut ;
- observations.

Une Activité peut contenir plusieurs Tâches.

---

# 10. LA TÂCHE

La Tâche constitue le niveau opérationnel le plus fin de la chaîne.

Elle doit permettre de renseigner :

- code ;
- libellé ;
- Activité parente ;
- description ;
- responsable ;
- structure responsable ;
- date de début ;
- date de fin ;
- durée ;
- priorité ;
- poids ;
- coût estimatif ;
- indicateur associé ;
- résultat attendu ;
- statut ;
- observations.

La Tâche doit servir notamment pour :

- le Gantt ;
- le suivi physique ;
- l’affectation opérationnelle ;
- les preuves de réalisation ;
- l’analyse des retards ;
- les sous-lignes détaillées d’une activité lorsque pertinent.

---

# 11. RÈGLE D’INTÉGRITÉ PARENT-ENFANT

Les relations doivent obligatoirement respecter :

**Axe → Pilier**

**Produit → Axe**

**Sous-Produit → Produit**

**Activité → Sous-Produit**

**Tâche → Activité**

Le système doit empêcher toute création de nœud orphelin.

---

# 12. CRÉATION DE NŒUDS

Chaque niveau doit proposer une action contextuelle.

Exemples :

Depuis Pilier :

**+ Ajouter un Axe**

Depuis Axe :

**+ Ajouter un Produit**

Depuis Produit :

**+ Ajouter un Sous-Produit**

Depuis Sous-Produit :

**+ Ajouter une Activité**

Depuis Activité :

**+ Ajouter une Tâche**

---

# 13. CRÉATION D’UN NOUVEAU PILIER

Prévoir l’action :

# NOUVEAU PILIER

Le système doit ensuite permettre de construire la branche associée.

---

# 14. ASSISTANT DE CRÉATION D’UNE BRANCHE

Prévoir un assistant :

**Étape 1 — Pilier**

**Étape 2 — Axes**

**Étape 3 — Produits**

**Étape 4 — Sous-Produits**

**Étape 5 — Activités**

**Étape 6 — Tâches**

**Étape 7 — Indicateurs**

**Étape 8 — Contrôle de cohérence**

**Étape 9 — Soumission**

**Étape 10 — Publication**

La branche doit pouvoir rester en brouillon.

---

# 15. ARBRE HIÉRARCHIQUE

Créer une vue interactive :

▼ Pilier

 ▼ Axe

  ▼ Produit

   ▼ Sous-Produit

    ▼ Activité

     • Tâche

Chaque nœud doit permettre :

- consulter ;
- modifier ;
- ajouter un enfant ;
- dupliquer ;
- réordonner ;
- déplacer ;
- désactiver ;
- consulter l’historique.

---

# 16. VUE TABLEAU

Prévoir aussi une vue tableau :

| Code | Niveau | Libellé | Parent | Responsable | Statut |
|---|---|---|---|---|---|

Filtres :

- exercice ;
- niveau ;
- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité ;
- responsable ;
- structure ;
- statut.

---

# 17. CODIFICATION

Le système doit pouvoir gérer une codification hiérarchique.

Exemple :

Pilier :

**P01**

Axe :

**P01-A02**

Produit :

**P01-A02-PR03**

Sous-Produit :

**P01-A02-PR03-SP01**

Activité :

**P01-A02-PR03-SP01-ACT04**

Tâche :

**P01-A02-PR03-SP01-ACT04-T02**

---

# 18. GÉNÉRATION DES CODES

Lors de la création d’un enfant, le système doit pouvoir proposer automatiquement le prochain code disponible.

Les codes doivent être uniques selon le périmètre défini.

---

# 19. STABILITÉ DES CODES

Après publication, un code utilisé dans :

- Budget ;
- PAP ;
- EB ;
- Engagement ;
- Suivi-Évaluation ;
- Reporting

ne doit pas être modifié librement.

Toute modification structurante doit passer par une révision contrôlée.

---

# 20. EXERCICE DE PLANIFICATION

Toute structure doit être rattachée à un exercice.

Exemple :

**Exercice 2027**

Le système doit pouvoir gérer simultanément :

**2026 — En exécution**

et

**2027 — En préparation**

---

# 21. STATUTS DE L’EXERCICE

Le cycle de vie recommandé est :

### À préparer

### En préparation

### En exécution

### Clôturé

### Archivé

Ces statuts doivent rester distincts du statut de la version.

---

# 22. VERSION DE PLANIFICATION

Un exercice peut comporter plusieurs versions.

Exemple :

**2027 — Version 1.0**

Puis :

**2027 — Version 1.1**

La version possède son propre cycle.

---

# 23. STATUTS DE LA VERSION

Prévoir :

### Brouillon

### Soumise

### En vérification

### Retournée

### Validée

### Publiée

### Rejetée

### Remplacée

---

# 24. APPLICABILITÉ

Une version publiée possède une période d’applicabilité.

Exemple :

**Version 1.1**

Publiée le :

15/03/2027

Applicable à partir du :

01/04/2027

---

# 25. VERSION ACTIVE

Pour une date donnée, il doit normalement exister une seule version active pour le périmètre concerné.

Exemple :

Jusqu’au 31/03/2027 :

**v1.0**

À partir du 01/04/2027 :

**v1.1**

La version précédente devient historique ou remplacée.

---

# 26. INITIALISATION D’UN NOUVEL EXERCICE

Prévoir :

# INITIALISER UN EXERCICE

Options :

### Chaîne vide

### Reprendre l’exercice précédent

### Reprise sélective

---

# 27. REPRISE DE L’EXERCICE PRÉCÉDENT

Permettre de reprendre :

- Piliers ;
- Axes ;
- Produits ;
- Sous-Produits ;
- Activités ;
- Tâches ;
- indicateurs ;
- responsables ;
- plannings.

La reprise ne doit jamais modifier l’exercice source.

---

# 28. DONNÉES NON REPRISES AUTOMATIQUEMENT

Ne pas recopier comme nouvelles données :

- Engagements ;
- Liquidations ;
- Ordonnancements ;
- Paiements ;
- réalisations historiques ;
- documents transactionnels ;
- historiques d’audit.

---

# 29. RECONDUCTION

Prévoir :

# RECONDUIRE VERS L’EXERCICE SUIVANT

Pour une activité non achevée, l’utilisateur doit pouvoir décider de la reprendre dans l’exercice suivant.

La reconduction doit être tracée.

---

# 30. PUBLICATION

La publication rend la structure officielle.

Avant publication :

- structure modifiable ;
- non utilisable officiellement dans les modules transactionnels.

Après publication :

- structure exploitable ;
- modifications structurelles contrôlées ;
- intégration au PAP ;
- intégration au Budget ;
- intégration au S&E.

---

# 31. WORKFLOW DE PUBLICATION

Prévoir :

**Brouillon**

↓

**Soumise**

↓

**En vérification**

↓

**Validée**

↓

**Publiée**

Avec :

**Retournée**

ou

**Rejetée**

---

# 32. VALIDATION ET PUBLICATION

Distinguer :

### Validation

Confirme la conformité.

### Publication

Rend la version officielle et exploitable.

Une version peut être :

**Validée — En attente de publication**

---

# 33. CONTRÔLES AVANT PUBLICATION

Vérifier notamment :

✓ exercice valide

✓ structure complète

✓ codes uniques

✓ parents valides

✓ périodes cohérentes

✓ responsables renseignés

✓ indicateurs requis

✓ absence de nœud orphelin

✓ validation acquise

---

# 34. NIVEAUX D’ANOMALIE

Prévoir :

### Information

### Avertissement

### Bloquant

Une anomalie bloquante doit empêcher la publication.

---

# 35. RÉVISION D’UNE VERSION PUBLIÉE

Une structure publiée ne doit pas être modifiée directement.

Prévoir :

# DEMANDER UNE RÉVISION

Puis créer une version de travail.

Exemple :

**v1.0 publiée**

↓

**v1.1 brouillon**

---

# 36. COMPARAISON DE VERSIONS

Permettre de comparer :

### Ajouté

### Modifié

### Déplacé

### Désactivé

### Supprimé lorsque autorisé

---

# 37. ABSENCE DE MODIFICATION RÉTROACTIVE

Règle impérative :

> Une modification future ne doit jamais réécrire le passé.

Les transactions historiques doivent continuer à référencer la version qui leur était applicable.

---

# 38. DÉPLACEMENT D’UN NŒUD

Le déplacement doit être contrôlé.

Exemple :

Activité A

de Sous-Produit 1

vers Sous-Produit 2.

Afficher :

- parent actuel ;
- nouveau parent ;
- impacts ;
- exercice ;
- version.

---

# 39. DÉPLACEMENT SENSIBLE

Si le nœud possède :

- Budget ;
- dépenses ;
- réalisations ;
- indicateurs ;
- historiques ;
- documents ;

le déplacement doit nécessiter une procédure contrôlée.

---

# 40. RÉORDONNANCEMENT

Permettre de modifier l’ordre d’affichage des nœuds sans modifier leur identité.

---

# 41. DUPLICATION

Permettre de dupliquer un nœud lorsque pertinent.

Exemple :

dupliquer une Activité avec ou sans :

- Tâches ;
- indicateurs ;
- planning.

Le système doit demander quels éléments reprendre.

---

# 42. CLONAGE DE BRANCHE

Prévoir éventuellement :

# DUPLIQUER UNE BRANCHE

Exemple :

Produit

→ Sous-Produits

→ Activités

→ Tâches.

Les données transactionnelles ne doivent jamais être dupliquées automatiquement.

---

# 43. SUPPRESSION

La suppression directe doit être limitée aux éléments sans dépendance.

Si un nœud a déjà été utilisé, proposer :

- désactiver ;
- clôturer ;
- archiver.

---

# 44. STATUTS DES NŒUDS

Prévoir notamment :

### Actif

### Suspendu

### Désactivé

### Clôturé

### Annulé

Ces statuts sont distincts des statuts d’exercice et de version.

---

# 45. RESPONSABLES

Chaque niveau peut disposer d’un responsable.

La responsabilité doit pouvoir être définie par :

- utilisateur ;
- fonction ;
- structure ;
- période de validité.

---

# 46. STRUCTURES RESPONSABLES

Le système doit s’appuyer sur le référentiel organisationnel.

Une Activité ou Tâche doit pouvoir être associée à une structure responsable.

---

# 47. PÉRIODES

Gérer :

- date de début prévue ;
- date de fin prévue ;
- durée ;
- période d’exécution ;
- exercice.

---

# 48. CONTRÔLE TEMPOREL

Le système doit signaler :

- Tâche hors période de l’Activité ;
- Activité hors période du Sous-Produit si la règle s’applique ;
- dates incohérentes ;
- planning hors exercice.

---

# 49. INDICATEURS

Le module doit permettre d’associer des indicateurs à différents niveaux.

Au minimum :

- Produit ;
- Sous-Produit ;
- Activité ;
- Tâche.

Et si nécessaire :

- Pilier ;
- Axe.

---

# 50. FICHE INDICATEUR

Prévoir :

- code ;
- libellé ;
- définition ;
- type ;
- unité ;
- source ;
- fréquence ;
- baseline ;
- cible ;
- méthode de calcul ;
- responsable ;
- niveau de rattachement.

---

# 51. CIBLES PAR EXERCICE

Une cible doit pouvoir varier selon l’exercice.

Exemple :

2026 : 60 %

2027 : 75 %

2028 : 85 %

Ne jamais écraser l’historique.

---

# 52. TÂCHES ET PONDÉRATIONS

Les Tâches peuvent être pondérées.

Exemple :

Étude : 20 %

Acquisition : 30 %

Déploiement : 40 %

Formation : 10 %

Total :

**100 %**

---

# 53. AVANCEMENT D’UNE ACTIVITÉ

Si l’Activité est composée de Tâches pondérées :

**Avancement Activité = Somme des avancements pondérés**

Le détail du calcul doit être accessible.

---

# 54. GANTT

Le module doit intégrer un Gantt permettant de visualiser :

- Activités ;
- Tâches ;
- jalons ;
- dépendances ;
- début prévu ;
- fin prévue ;
- début réel ;
- fin réelle ;
- avancement ;
- retard.

---

# 55. DÉPENDANCES

Prévoir :

- fin-début ;
- début-début ;
- fin-fin ;
- autres relations pertinentes.

---

# 56. JALONS

Une Activité peut comporter des jalons.

Exemples :

- TDR validés ;
- marché lancé ;
- contrat signé ;
- livraison ;
- réception ;
- mise en service.

---

# 57. BUDGET PRÉVISIONNEL

Une Activité peut porter un besoin financier prévisionnel.

Une Tâche peut également disposer d’un coût estimatif.

Ces données doivent pouvoir servir à la préparation budgétaire.

---

# 58. LIEN AVEC LE PAP

Le PAP doit exploiter la chaîne :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

Une branche en brouillon ne doit pas être utilisée comme référence officielle.

---

# 59. LIEN AVEC LE BUDGET

Une structure stratégique publiée peut être liée :

- aux lignes budgétaires ;
- aux dotations ;
- au PAP ;
- aux sources de financement.

La publication d’une structure ne doit pas créer automatiquement un crédit budgétaire sans procédure appropriée.

---

# 60. LIEN AVEC L’EXPRESSION DE BESOIN

Pour une EB PAP, le système doit pouvoir récupérer :

- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité ;
- Tâches ;
- indicateurs ;
- responsable ;
- budget programmé.

---

# 61. LIEN AVEC LE SUIVI-ÉVALUATION

Les éléments publiés doivent devenir automatiquement disponibles dans le Suivi-Évaluation.

Le S&E doit pouvoir suivre :

- Activités ;
- Tâches ;
- indicateurs ;
- avancement ;
- risques ;
- réalisations ;
- écarts ;
- recommandations.

---

# 62. AGRÉGATION

Les données doivent pouvoir remonter :

**Tâches**

→ Activité

→ Sous-Produit

→ Produit

→ Axe

→ Pilier

Pour :

- avancement ;
- performance ;
- coûts ;
- indicateurs ;
- risques ;
- volumes.

---

# 63. DRILL-DOWN

Les tableaux de bord doivent permettre :

**Pilier**

→ Axe

→ Produit

→ Sous-Produit

→ Activité

→ Tâche.

---

# 64. TABLEAU DE BORD PLANIFICATION

Prévoir notamment :

- nombre de Piliers ;
- nombre d’Axes ;
- nombre de Produits ;
- nombre de Sous-Produits ;
- nombre d’Activités ;
- nombre de Tâches ;
- branches en brouillon ;
- branches validées ;
- branches publiées ;
- activités sans Tâches ;
- indicateurs manquants ;
- incohérences.

---

# 65. TABLEAU DE BORD DES EXERCICES

Afficher :

| Exercice | Statut | Version active | Nb Piliers | Dernière publication |
|---|---|---|---:|---|

---

# 66. TABLEAU DES VERSIONS

Afficher :

| Version | Statut | Date publication | Date effet | Situation |
|---|---|---|---|---|

---

# 67. RECHERCHE GLOBALE

Permettre de retrouver un nœud par :

- code ;
- libellé ;
- niveau ;
- responsable ;
- structure ;
- parent.

---

# 68. FILTRES

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
- structure ;
- statut.

---

# 69. WORKFLOW

Le workflow de préparation doit pouvoir être paramétré.

Exemple :

**Brouillon**

→ **Soumis**

→ **Vérification**

→ **Validation**

→ **Publication**

---

# 70. « MES TÂCHES »

Le module doit alimenter « Mes tâches ».

Exemples :

- branche à vérifier ;
- Activité à compléter ;
- indicateurs manquants ;
- version à valider ;
- publication à effectuer.

---

# 71. NOTIFICATIONS

Prévoir :

- nouveau nœud créé ;
- branche soumise ;
- correction demandée ;
- validation acquise ;
- version publiée ;
- révision ouverte ;
- exercice clôturé ;
- incohérence détectée.

---

# 72. HISTORIQUE DU NŒUD

Afficher :

- création ;
- modification ;
- déplacement ;
- changement de responsable ;
- changement de période ;
- désactivation ;
- réactivation ;
- publication.

---

# 73. JOURNAL D’AUDIT

Toutes les actions structurelles doivent enregistrer :

- exercice ;
- version ;
- utilisateur ;
- rôle ;
- date ;
- heure ;
- action ;
- ancienne valeur ;
- nouvelle valeur ;
- justification.

---

# 74. DOCUMENTS

Le module peut gérer :

- cadre stratégique ;
- décisions ;
- matrices ;
- PAP ;
- documents de planification ;
- notes ;
- preuves d’approbation.

Ils doivent être intégrés à la GED.

---

# 75. RAPPORTS

Prévoir notamment :

### Arbre stratégique

### Matrice de la chaîne de résultats

### Rapport par Pilier

### Rapport des Activités

### Rapport des Tâches

### Matrice des indicateurs

### Planning annuel

### Gantt

### Rapport de cohérence

### Rapport des versions

---

# 76. EXPORTS

Prévoir :

- PDF ;
- Excel ;
- CSV.

---

# 77. IMPORTS

Prévoir l’import contrôlé de :

- structure stratégique ;
- activités ;
- tâches ;
- indicateurs.

Processus :

**Importer**

→ **Prévisualiser**

→ **Contrôler**

→ **Corriger**

→ **Valider**

---

# 78. DROITS ET HABILITATIONS

Prévoir des droits distincts :

- consulter ;
- créer ;
- modifier ;
- soumettre ;
- valider ;
- publier ;
- déplacer ;
- désactiver ;
- administrer.

---

# 79. RÔLES

Exemples :

### Contributeur

Crée et modifie les brouillons.

### Responsable Planification

Contrôle et consolide.

### Autorité de validation

Valide.

### Publieur habilité

Publie.

### Administrateur

Gère la configuration.

### Auditeur

Consulte l’historique.

---

# 80. SÉPARATION DES FONCTIONS

Le système doit pouvoir différencier :

- auteur ;
- vérificateur ;
- valideur ;
- publieur.

---

# 81. CONTRÔLES AUTOMATIQUES

Vérifier notamment :

✓ code unique

✓ parent valide

✓ période cohérente

✓ exercice valide

✓ version valide

✓ responsable valide

✓ pondération cohérente

✓ absence d’orphelins

✓ structure publiable

---

# 82. QUALITÉ DE LA PLANIFICATION

Le système peut produire un score de complétude.

Exemple :

**Structure**

100 %

**Responsables**

95 %

**Indicateurs**

80 %

**Planning**

90 %

**Tâches**

85 %

**Complétude globale**

90 %

---

# 83. ÉTATS EXCEPTIONNELS

Prévoir :

- nœud orphelin ;
- code dupliqué ;
- parent incompatible ;
- exercice clôturé ;
- version remplacée ;
- nœud déjà utilisé ;
- déplacement impossible ;
- publication bloquée ;
- indicateur manquant ;
- pondération incorrecte.

---

# 84. CLÔTURE D’EXERCICE

À la clôture :

- structure figée ;
- versions conservées ;
- historique conservé ;
- rapports reproductibles ;
- consultation possible.

---

# 85. ARCHIVAGE

Un exercice archivé doit rester :

- consultable ;
- recherchable ;
- exportable ;
- auditable.

---

# 86. RESPONSIVE DESIGN

Prévoir :

### Desktop

Usage principal.

### Laptop

### Tablette

Pour consultation et validation.

### Mobile

Pour consultation synthétique et tâches simples.

---

# 87. ACCESSIBILITÉ

Respecter autant que possible :

- WCAG 2.2 AA ;
- contraste ;
- focus ;
- navigation clavier ;
- labels ;
- information non uniquement colorimétrique.

---

# 88. PRINCIPAUX ÉCRANS

Le module doit comporter au minimum :

1. Dashboard Planification ;
2. Exercices ;
3. Initialisation d’exercice ;
4. Arbre stratégique ;
5. Vue tableau ;
6. Fiche Pilier ;
7. Fiche Axe ;
8. Fiche Produit ;
9. Fiche Sous-Produit ;
10. Fiche Activité ;
11. Fiche Tâche ;
12. Assistant de branche ;
13. Indicateurs ;
14. Gantt ;
15. Contrôle de cohérence ;
16. Validation ;
17. Publication ;
18. Révision ;
19. Comparaison de versions ;
20. Historique ;
21. Audit ;
22. Rapports.

---

# 89. CRITÈRES D’ACCEPTATION FONCTIONNELLE

Le module sera accepté si :

- un nouveau Pilier peut être créé ;
- plusieurs Axes peuvent être créés ;
- plusieurs Produits peuvent être créés ;
- plusieurs Sous-Produits peuvent être créés ;
- plusieurs Activités peuvent être créées ;
- plusieurs Tâches peuvent être créées ;
- aucun nœud orphelin n’est possible ;
- la hiérarchie est navigable ;
- les codes sont contrôlés ;
- les exercices sont séparés ;
- les versions sont historisées ;
- la publication est contrôlée ;
- les nœuds publiés sont intégrés au PAP et au S&E ;
- la Tâche apparaît dans le Gantt ;
- les indicateurs sont rattachables ;
- les données historiques sont conservées ;
- les modifications sont auditées.

---

# 90. CRITÈRES DE VALIDATION

Le prototype devra démontrer au minimum :

### Scénario 1
Créer un nouveau Pilier.

### Scénario 2
Créer un Axe sous ce Pilier.

### Scénario 3
Créer Produit → Sous-Produit → Activité → Tâches.

### Scénario 4
Afficher toute la branche dans l’arbre.

### Scénario 5
Configurer indicateurs et planning.

### Scénario 6
Afficher les Tâches dans le Gantt.

### Scénario 7
Soumettre la version.

### Scénario 8
Retourner pour correction.

### Scénario 9
Valider.

### Scénario 10
Publier.

### Scénario 11
Vérifier la disponibilité dans PAP et S&E.

### Scénario 12
Créer une révision.

### Scénario 13
Comparer v1.0 et v1.1.

### Scénario 14
Clôturer l’exercice.

---

# 91. RÈGLES DE NON-RÉGRESSION

Le module ne doit pas :

- casser les branches existantes ;
- écraser les exercices antérieurs ;
- supprimer les versions ;
- modifier rétroactivement les transactions ;
- créer des objets orphelins ;
- dupliquer le PAP ;
- dupliquer les données budgétaires ;
- dissocier Planification et Suivi-Évaluation.

---

# 92. VISION CIBLE

Le module Planification Stratégique doit évoluer d’un simple référentiel consultatif vers un véritable système de **construction et de gouvernance de la stratégie**.

Il doit permettre le cycle :

**CRÉER L’EXERCICE**

↓

**INITIALISER LA PLANIFICATION**

↓

**CONSTRUIRE**

Pilier  
→ Axe  
→ Produit  
→ Sous-Produit  
→ Activité  
→ Tâche

↓

**RATTACHER**

Indicateurs  
Responsables  
Calendrier  
Coûts

↓

**CONTRÔLER**

↓

**SOUMETTRE**

↓

**VALIDER**

↓

**PUBLIER**

↓

**ALIMENTER LE PAP ET LE BUDGET**

↓

**EXÉCUTER**

↓

**SUIVRE ET ÉVALUER**

↓

**RÉVISER**

↓

**VERSIONNER**

↓

**CLÔTURER**

↓

**ARCHIVER**

Le module doit ainsi constituer le **référentiel stratégique officiel, dynamique, multi-exercice, versionné, traçable et intégré de BUDGET-CEEAC**.