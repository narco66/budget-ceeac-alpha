Revoir et refondre le module **Planification stratégique** de BUDGET-CEEAC afin d’intégrer pleinement la notion de **Tâche** comme niveau opérationnel rattaché à chaque **Activité**, puis d’appliquer cette logique de manière cohérente à toute la chaîne de résultats de la CEEAC.

La chaîne de résultats cible doit désormais être structurée comme suit :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

## Objectifs de la refonte

1. **Auditer l’existant**
   - Identifier comment les niveaux Pilier, Axe, Produit, Sous-Produit et Activité sont actuellement modélisés dans la maquette.
   - Identifier les écrans, formulaires, tableaux et composants impactés par l’introduction du niveau **Tâche**.
   - Conserver les éléments existants qui restent pertinents et corriger ceux qui deviennent incohérents.

2. **Ajouter le niveau Tâche sous chaque Activité**
   - Permettre à une Activité de contenir une ou plusieurs Tâches.
   - Permettre l’ajout, la modification, la suppression, la duplication et le réordonnancement des Tâches.
   - Chaque Tâche doit être clairement rattachée à son Activité parente.
   - Prévoir un affichage hiérarchique simple et lisible.

3. **Appliquer la logique hiérarchique à toute la chaîne**
   Chaque niveau doit permettre de naviguer vers ses niveaux enfants :
   - Pilier → Axes
   - Axe → Produits
   - Produit → Sous-Produits
   - Sous-Produit → Activités
   - Activité → Tâches

   Et réciproquement, chaque niveau doit permettre de remonter vers ses parents.

4. **Créer une navigation hiérarchique claire**
   Prévoir des composants tels que :
   - arbre hiérarchique ;
   - accordéons ;
   - vue en cascade ;
   - breadcrumb ;
   - drill-down ;
   - compteurs d’éléments enfants.

   Exemple :

   **Pilier 1**  
   → Axe 1.2  
   → Produit 1.2.3  
   → Sous-Produit 1.2.3.1  
   → Activité 1.2.3.1.4  
   → Tâche 1.2.3.1.4.2

5. **Refondre les formulaires**
   Chaque niveau doit disposer d’un formulaire cohérent permettant de renseigner les informations utiles.

   Pour les Tâches, prévoir notamment :
   - code ;
   - libellé ;
   - description ;
   - Activité parente ;
   - responsable ;
   - structure responsable ;
   - date de début ;
   - date de fin ;
   - durée ;
   - priorité ;
   - statut ;
   - coût estimatif ;
   - indicateur associé ;
   - résultat attendu ;
   - observations.

6. **Prévoir la codification hiérarchique**
   La codification doit refléter la hiérarchie.

   Exemple :
   - Pilier : P01
   - Axe : P01-A02
   - Produit : P01-A02-PR03
   - Sous-Produit : P01-A02-PR03-SP01
   - Activité : P01-A02-PR03-SP01-ACT04
   - Tâche : P01-A02-PR03-SP01-ACT04-T02

   La logique de codification doit être uniforme et exploitable dans toute l’application.

7. **Faire de la Tâche l’unité opérationnelle fine**
   La Tâche doit pouvoir servir de niveau de détail pour :
   - la planification opérationnelle ;
   - le Gantt ;
   - le suivi physique ;
   - l’affectation de responsables ;
   - les échéances ;
   - les indicateurs ;
   - les preuves de réalisation ;
   - l’analyse des retards ;
   - les sous-lignes de détail dans l’Expression de Besoin lorsque pertinent.

8. **Prévoir des informations agrégées**
   Les informations des Tâches doivent remonter automatiquement vers leur Activité, puis vers les niveaux supérieurs.

   Exemple :
   - avancement des Tâches → avancement de l’Activité ;
   - budget des Activités → consolidation au niveau Sous-Produit ;
   - performance des Sous-Produits → Produit ;
   - Produit → Axe ;
   - Axe → Pilier.

9. **Adapter les tableaux de bord**
   Mettre à jour tous les tableaux de bord concernés pour permettre un drill-down jusqu’au niveau Tâche.

10. **Adapter le Gantt**
    Le Gantt du module Planification et du Suivi-Évaluation doit pouvoir afficher :
    - Activités ;
    - Tâches ;
    - responsables ;
    - dépendances ;
    - dates prévues ;
    - dates réelles ;
    - avancement ;
    - retards.

11. **Adapter les indicateurs**
    Les indicateurs doivent pouvoir être associés au niveau pertinent :
    - Produit ;
    - Sous-Produit ;
    - Activité ;
    - Tâche.

12. **Adapter le PAP**
    La chaîne PAP doit intégrer la nouvelle granularité :

    **Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

13. **Adapter le Suivi-Évaluation**
    Le module Suivi-Évaluation doit pouvoir suivre :
    - l’avancement de chaque Tâche ;
    - les preuves ;
    - les indicateurs ;
    - les risques ;
    - les retards ;
    - les responsables ;
    - l’avancement consolidé de l’Activité.

14. **Adapter l’Expression de Besoin**
    Lorsqu’une Expression de Besoin concerne une Activité PAP, les Tâches rattachées doivent pouvoir être affichées et utilisées comme niveau de détail opérationnel lorsque pertinent.

15. **Respecter l’ergonomie de BUDGET-CEEAC**
    La refonte doit rester cohérente avec :
    - le design system existant ;
    - les composants ;
    - les couleurs ;
    - les tableaux ;
    - les cartes ;
    - les formulaires ;
    - la navigation.

## Critères d’acceptation fonctionnelle

La refonte sera considérée comme fonctionnellement acceptable uniquement si tous les critères suivants sont satisfaits :

- chaîne hiérarchique complète visible et exploitable ;
- création d’une Tâche depuis une Activité ;
- possibilité d’avoir plusieurs Tâches par Activité ;
- navigation descendante et ascendante ;
- breadcrumb complet ;
- codification hiérarchique ;
- unicité des codes ;
- intégrité parent-enfant ;
- champs minimum de la Tâche ;
- validation des dates ;
- cohérence temporelle avec l’Activité ;
- responsable et structure affectables ;
- modification contrôlée ;
- suppression contrôlée ;
- réordonnancement ;
- duplication ;
- compteurs ;
- drill-down ;
- consolidation ascendante ;
- calcul d’avancement ;
- pondération ;
- Gantt ;
- dépendances ;
- gestion des retards ;
- association d’indicateurs ;
- prise en compte par le Suivi-Évaluation ;
- prise en compte par l’Expression de Besoin ;
- préremplissage ;
- cohérence PAP ;
- recherche ;
- filtres ;
- états vides ;
- droits ;
- traçabilité ;
- historique ;
- non-régression ;
- responsive ;
- accessibilité ;
- cohérence graphique ;
- prototype complet ;
- matrice de conformité.

## Critères de validation

La refonte ne pourra être déclarée **validée** qu’après vérification des critères suivants.

### CV-01 — Validation de l’architecture fonctionnelle

La chaîne cible doit être correctement représentée partout :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

Validation réussie si aucun écran critique ne conserve une ancienne structure incompatible.

### CV-02 — Validation du modèle parent-enfant

Chaque objet doit être rattaché à son parent correct.

Validation réussie si aucun objet orphelin n’est représenté dans la maquette.

### CV-03 — Validation de la création d’une Tâche

Le prototype doit démontrer la création complète d’une Tâche depuis une Activité.

Le scénario doit inclure :

- ouverture de l’Activité ;
- clic sur « Ajouter une Tâche » ;
- saisie ;
- validation ;
- affichage de la nouvelle Tâche dans l’Activité.

### CV-04 — Validation du formulaire Tâche

Tous les champs fonctionnels obligatoires doivent être présents.

Les champs obligatoires et facultatifs doivent être clairement distingués.

### CV-05 — Validation des règles de contrôle

Le prototype doit démontrer au moins les contrôles suivants :

- champ obligatoire absent ;
- date de fin antérieure à la date de début ;
- pondération incohérente ;
- code en doublon ;
- Tâche hors période de l’Activité.

### CV-06 — Validation de la codification

Une Tâche créée doit avoir un code cohérent avec son chemin hiérarchique.

Le code affiché dans la liste, la fiche et le breadcrumb doit être identique.

### CV-07 — Validation de la navigation descendante

Il doit être possible de partir d’un Pilier et d’arriver jusqu’à une Tâche sans utiliser la recherche globale.

### CV-08 — Validation de la navigation ascendante

Depuis une Tâche, il doit être possible de remonter jusqu’au Pilier par le breadcrumb ou un mécanisme équivalent.

### CV-09 — Validation du drill-down

Les tableaux de bord utilisant la chaîne de résultats doivent permettre une navigation détaillée jusqu’au niveau Tâche.

### CV-10 — Validation de la consolidation

La maquette doit montrer comment les données d’une Tâche contribuent à son Activité.

Au moins un exemple doit démontrer la remontée d’un avancement de Tâches vers l’Activité.

### CV-11 — Validation des pondérations

Si plusieurs Tâches sont pondérées, la maquette doit permettre de vérifier visuellement :

**Somme des poids = 100 %**

Un état d’erreur doit être prévu lorsque le total est différent.

### CV-12 — Validation du calcul d’avancement

La fiche Activité doit permettre de comprendre comment son avancement est obtenu à partir des Tâches.

Une action telle que **Voir le calcul** doit être présente si le calcul n’est pas évident.

### CV-13 — Validation du Gantt

Le Gantt doit montrer au minimum :

- une Activité ;
- plusieurs Tâches ;
- un jalon ;
- une Tâche en retard ;
- une dépendance.

### CV-14 — Validation du retard

Une Tâche en retard doit être identifiable sans se fier uniquement à une couleur.

Le retard doit afficher une information explicite telle que :

**En retard de 8 jours**

### CV-15 — Validation des indicateurs

Le prototype doit montrer un indicateur rattaché à une Tâche et un autre rattaché à un niveau supérieur.

Le niveau de rattachement doit être explicite.

### CV-16 — Validation Suivi-Évaluation

Depuis le module Suivi-Évaluation, il doit être possible de consulter une Tâche et ses informations de suivi.

La validation doit couvrir :

- avancement ;
- indicateur ;
- responsable ;
- preuve ;
- statut ;
- retard.

### CV-17 — Validation Expression de Besoin

Le prototype doit démontrer au moins un cas où une EB PAP accède aux Tâches disponibles d’une Activité.

### CV-18 — Validation du préremplissage

Lorsqu’une Tâche est sélectionnée depuis un autre module, ses données de référence doivent être automatiquement reprises dans l’interface correspondante.

### CV-19 — Validation de la recherche

Une Tâche doit pouvoir être retrouvée par :

- code ;
- libellé ;
- Activité ;
- responsable.

### CV-20 — Validation des filtres

Les listes doivent permettre de filtrer les Tâches par niveaux hiérarchiques et par statut.

### CV-21 — Validation des permissions

Prévoir au moins trois états de droits :

- utilisateur pouvant consulter ;
- utilisateur pouvant créer/modifier ;
- utilisateur sans habilitation.

L’interface doit montrer des comportements différents.

### CV-22 — Validation de la suppression contrôlée

Le prototype doit montrer qu’une Tâche avec historique ou réalisation ne peut pas être supprimée directement.

Une alternative doit être proposée :

- annuler ;
- désactiver ;
- archiver.

### CV-23 — Validation de l’historique

Une modification significative d’une Tâche doit apparaître dans son historique.

### CV-24 — Validation de la traçabilité

La maquette doit prévoir l’affichage de :

- auteur ;
- date ;
- action ;
- ancienne valeur ;
- nouvelle valeur.

### CV-25 — Validation du PAP

Les vues du PAP impactées doivent intégrer le niveau Tâche.

Aucune rupture visuelle ou fonctionnelle ne doit apparaître entre Activité et Tâche.

### CV-26 — Validation de la cohérence avec le Suivi-Évaluation

Une Tâche créée dans Planification stratégique doit être représentée comme disponible dans le Suivi-Évaluation sans double saisie.

### CV-27 — Validation de la non-régression

Vérifier que les parcours existants restent utilisables pour :

- Pilier ;
- Axe ;
- Produit ;
- Sous-Produit ;
- Activité.

L’ajout de la Tâche ne doit pas dégrader les fonctions existantes.

### CV-28 — Validation de la cohérence graphique

Les composants utilisés pour la Tâche doivent respecter le design system de BUDGET-CEEAC.

Vérifier :

- typographie ;
- espacements ;
- cartes ;
- tableaux ;
- formulaires ;
- badges ;
- icônes ;
- boutons.

### CV-29 — Validation responsive

Tester dans la maquette :

- desktop ;
- laptop ;
- tablette ;
- mobile.

La hiérarchie doit rester compréhensible sur chaque format.

### CV-30 — Validation accessibilité

Vérifier :

- contraste ;
- labels ;
- focus ;
- tailles de texte ;
- navigation logique ;
- information non dépendante uniquement des couleurs.

### CV-31 — Validation des états vides

Prévoir au minimum :

**Aucune Tâche**

avec action :

**Ajouter la première Tâche**

si l’utilisateur est habilité.

### CV-32 — Validation des états d’erreur

Prévoir visuellement :

- erreur de saisie ;
- code déjà utilisé ;
- date incohérente ;
- accès refusé ;
- chargement impossible ;
- opération interdite.

### CV-33 — Validation des états de chargement

Les écrans critiques doivent prévoir :

- loading ;
- skeleton ;
- chargement partiel ;
- action en cours.

### CV-34 — Validation des états de succès

Prévoir des confirmations après :

- création ;
- modification ;
- duplication ;
- réordonnancement ;
- désactivation.

### CV-35 — Validation du prototype bout en bout

Le prototype doit permettre de réaliser intégralement le parcours :

**Pilier**

→ **Axe**

→ **Produit**

→ **Sous-Produit**

→ **Activité**

→ **Création Tâche**

→ **Planification**

→ **Gantt**

→ **Mise à jour de l’avancement**

→ **Suivi-Évaluation**

→ **Consolidation Activité**

### CV-36 — Validation de cohérence des données

Une même Tâche utilisée dans plusieurs écrans doit toujours afficher :

- le même code ;
- le même libellé ;
- le même responsable ;
- le même statut ;
- le même rattachement.

### CV-37 — Validation des composants réutilisables

La Tâche ne doit pas être dessinée manuellement différemment sur chaque écran.

Les éléments communs doivent utiliser des composants Figma réutilisables et des variants.

### CV-38 — Validation Auto Layout

Les principales pages et composants doivent utiliser Auto Layout afin de permettre :

- adaptation ;
- maintenance ;
- responsive ;
- évolutivité.

### CV-39 — Validation du prototype par cas nominal et cas d’erreur

Le prototype doit inclure :

**Cas nominal**

Création d’une Tâche valide.

**Cas d’erreur**

Création impossible en raison d’une incohérence.

### CV-40 — Validation de la matrice de conformité

Chaque critère d’acceptation et de validation doit être rattaché à au moins :

- un écran ;
- un composant ;
- un état ;
- ou une interaction.

### CV-41 — Critère de clôture de la refonte

La refonte ne peut être déclarée terminée que si :

- tous les critères d’acceptation fonctionnelle sont couverts ;
- tous les critères de validation sont vérifiables ;
- les principaux parcours sont prototypés ;
- les impacts sur PAP, Suivi-Évaluation et Expression de Besoin sont intégrés ;
- aucune incohérence majeure n’est laissée sans traitement.

## Résultat attendu

Le module Planification stratégique ne doit plus s’arrêter au niveau **Activité**.

Il doit désormais gérer nativement et de manière homogène :

**Pilier → Axe → Produit → Sous-Produit → Activité → Tâche**

La **Tâche** devient le niveau opérationnel le plus fin de la chaîne de résultats et doit être prise en compte dans la planification, le Gantt, le PAP, le Suivi-Évaluation et, lorsque pertinent, l’Expression de Besoin.

Avant de terminer, audite l’ensemble des écrans et composants utilisant actuellement les niveaux Pilier, Axe, Produit, Sous-Produit et Activité.

La refonte ne doit être considérée comme **fonctionnellement acceptée et validée** que lorsque tous les critères d’acceptation et de validation peuvent être démontrés directement dans la maquette et le prototype Figma.