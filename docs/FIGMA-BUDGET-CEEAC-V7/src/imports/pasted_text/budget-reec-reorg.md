# PROMPT FIGMA — RÉORGANISATION DE BUDGET-CEEAC À PARTIR DES RÉFÉRENTIELS OFFICIELS DE LA CEEAC

Audite en profondeur la maquette et l’architecture fonctionnelle existantes de **BUDGET-CEEAC**, puis réorganise et fais évoluer l’ensemble de l’application afin qu’elle repose exclusivement, dans leurs domaines respectifs, sur les **données officielles réelles de la Commission de la CEEAC** fournies dans les fichiers joints.

Les deux documents joints doivent devenir les **sources de référence uniques** de l’application pour les domaines qu’ils couvrent :

1. le **Référentiel organisationnel officiel de la CEEAC**, pour toute donnée relative à l’organisation, aux structures, unités administratives et acteurs institutionnels ;
2. le **Budget réel 2026 de la CEEAC**, pour toute donnée budgétaire, financière, programmatique et relative au PAP disponible dans ce document.

L’objectif est de supprimer progressivement les données fictives, génériques, dupliquées ou incohérentes actuellement présentes dans la maquette et de les remplacer par des données conformes aux documents officiels joints, sans casser les fonctionnalités déjà correctement conçues.

## 1. Principe fondamental : référentiels uniques

L’application doit fonctionner selon un principe de **Single Source of Truth**.

### Référentiel organisationnel

Le référentiel organisationnel joint devient la seule source autorisée pour :

* la Présidence ;
* la Vice-Présidence ;
* le Secrétariat Général ;
* les Départements ;
* les Cabinets ;
* les Directions ;
* les Services ;
* les unités administratives ;
* les structures de contrôle ;
* les structures financières ;
* les unités opérationnelles ;
* les rattachements hiérarchiques ;
* les niveaux organisationnels ;
* les acteurs institutionnels associés aux workflows.

Aucune structure administrative ne doit être recréée manuellement dans un autre module lorsqu’elle existe déjà dans ce référentiel.

Toutes les interfaces nécessitant une structure, une direction, un service ou une unité responsable doivent interroger ce référentiel central.

## 2. Budget 2026 comme référentiel budgétaire officiel

Le **Budget réel 2026 de la CEEAC joint au projet** doit devenir la source budgétaire principale et officielle de l’application pour l’exercice 2026.

Importer, structurer, normaliser et exploiter toutes les informations disponibles dans ce budget, notamment :

* exercice budgétaire ;
* sections éventuelles ;
* chapitres ;
* articles ;
* paragraphes ;
* lignes budgétaires ;
* codes budgétaires ;
* libellés ;
* structures responsables ;
* sources de financement ;
* montants prévus ;
* crédits ouverts ;
* crédits révisés lorsqu’ils existent ;
* crédits disponibles ;
* programmes ;
* composantes ;
* activités ;
* investissements ;
* dépenses de fonctionnement ;
* informations du PAP ;
* toute autre dimension identifiable dans le document.

Lorsqu’une donnée existe dans le Budget 2026 officiel, elle ne doit pas être saisie manuellement une seconde fois dans l’application.

## 3. Principe fondamental concernant le PAP

Ne pas considérer le PAP comme un budget indépendant.

Dans **BUDGET-CEEAC** :

> **Le PAP constitue le volet Investissement du Budget annuel de la CEEAC.**

Le modèle de données, les écrans et les workflows doivent donc représenter :

**BUDGET DE L’EXERCICE**

* Fonctionnement / Hors PAP ;
* Investissement / PAP.

Le PAP appartient au même budget annuel.

Il ne doit donc pas exister :

* un Budget 2026 séparé ;
* et un PAP 2026 traité comme un second budget indépendant.

L’application doit maintenir un **budget annuel unique**, dont certaines lignes relèvent du fonctionnement et d’autres de l’investissement/PAP.

## 4. Reconstruction de la chaîne programmatique

Pour les lignes relevant du PAP, structurer autant que possible la chaîne de résultats selon le modèle :

**Pilier
→ Axe stratégique
→ Objectif
→ Produit
→ Sous-produit
→ Activité
→ Tâche**

Puis rattacher, lorsque disponibles :

* indicateurs ;
* résultats attendus ;
* unité de mesure ;
* valeur de référence ;
* valeur cible ;
* source de vérification ;
* responsable ;
* unité organisationnelle ;
* période d’exécution ;
* localisation ;
* source de financement ;
* ligne budgétaire ;
* montant prévu.

La structure doit permettre une navigation hiérarchique claire entre tous les niveaux.

## 5. Gestion des informations absentes du Budget 2026

Le Budget 2026 réel peut ne pas contenir certains niveaux de détail nécessaires à un système moderne de planification et de suivi.

C’est notamment susceptible d’être le cas pour :

* les tâches ;
* certains indicateurs ;
* les valeurs de référence ;
* les valeurs cibles ;
* les résultats attendus ;
* les échéances ;
* les responsables opérationnels ;
* certaines sources de vérification ;
* certaines ventilations détaillées.

**Ne pas inventer ces informations.**

Lorsqu’un segment indispensable au modèle fonctionnel n’existe pas dans le document officiel :

1. créer malgré tout le niveau correspondant dans le modèle de données ;
2. laisser sa valeur vide ou dans un état « À compléter » ;
3. permettre à l’utilisateur autorisé de renseigner ultérieurement cette information ;
4. conserver l’information sur l’origine de cette donnée :

   * importée du Budget officiel ;
   * importée d’un référentiel ;
   * ajoutée manuellement ;
   * enrichie ultérieurement.

### Exemple

Si le Budget 2026 contient :

**Pilier → Axe → Produit → Activité**

mais ne présente pas les tâches, l’application doit conserver :

**Pilier → Axe → Produit → Activité → Tâches**

Les tâches seront créées et complétées ultérieurement par les utilisateurs autorisés.

## 6. Enrichissement sans altération du document officiel

Les données issues des documents officiels doivent être distinguées des données ajoutées ultérieurement par les utilisateurs.

Prévoir pour chaque donnée structurante :

* `source_donnee` ;
* `document_source` ;
* `date_import` ;
* `importe_par` ;
* `date_modification` ;
* `modifie_par` ;
* `statut_donnee`.

Exemples de statuts :

* Officiel importé ;
* À compléter ;
* Complété ;
* Validé ;
* Révisé ;
* Archivé.

Les données officielles importées ne doivent pas être modifiables librement.

Toute correction doit être tracée et soumise aux habilitations appropriées.

## 7. Réorganisation des modules existants

Auditer tous les écrans et modules de BUDGET-CEEAC afin d’identifier :

* données fictives ;
* référentiels dupliqués ;
* structures organisationnelles erronées ;
* lignes budgétaires fictives ;
* programmes fictifs ;
* activités fictives ;
* PAP indépendants du budget ;
* relations incohérentes entre organisation, budget et programmation.

Réorganiser ensuite les modules autour des nouveaux référentiels centraux.

Cela concerne notamment :

* Référentiels ;
* Planification stratégique ;
* Budget ;
* PAP ;
* Expression de Besoin ;
* Engagement ;
* Liquidation ;
* Ordonnancement ;
* Paiement ;
* Marchés ;
* Suivi-Évaluation ;
* Reporting ;
* Tableaux de bord ;
* GED ;
* Notifications ;
* Import/Export ;
* Administration ;
* Utilisateurs ;
* Rôles et habilitations.

## 8. Relation avec l’Expression de Besoin

Lorsqu’un utilisateur crée une Expression de Besoin, il ne doit pas ressaisir les informations déjà disponibles dans les référentiels.

Le système doit lui permettre de sélectionner une ligne budgétaire du Budget officiel.

À partir de cette sélection, récupérer automatiquement :

* exercice ;
* classification budgétaire ;
* code budgétaire ;
* libellé ;
* structure responsable ;
* nature de la dépense ;
* PAP / Hors PAP ;
* crédit initial ;
* crédit révisé ;
* engagements existants ;
* montant consommé ;
* crédit disponible.

Pour une ligne PAP, récupérer également automatiquement tous les éléments programmatiques existants :

* pilier ;
* axe ;
* objectif ;
* produit ;
* sous-produit ;
* activité ;
* indicateurs disponibles ;
* résultats disponibles.

Si les tâches ne sont pas renseignées dans le Budget officiel, permettre de les ajouter dans l’Expression de Besoin ou dans le module de planification, selon les habilitations.

## 9. Gestion des tâches et sous-lignes d’activité

Une activité budgétaire peut être composée de plusieurs tâches ou rubriques opérationnelles.

Prévoir donc :

**Activité / ligne budgétaire principale**

puis :

**Tâche 1
Tâche 2
Tâche 3
…**

Chaque tâche peut comporter :

* libellé ;
* description ;
* quantité ;
* unité ;
* prix unitaire ;
* montant ;
* période ;
* responsable ;
* pièce justificative ;
* indicateur éventuel.

La somme des tâches doit correspondre au montant imputé sur l’activité.

Prévoir des contrôles automatiques de cohérence.

## 10. Référencement organisationnel automatique

Toute unité responsable d’une activité, d’un budget, d’une EB ou d’une opération doit être sélectionnée dans le référentiel organisationnel officiel.

Éviter toute duplication de :

* départements ;
* directions ;
* services ;
* fonctions ;
* structures.

La chaîne de validation doit être construite à partir :

1. du référentiel organisationnel ;
2. du rôle de l’utilisateur ;
3. de la nature du dossier ;
4. du montant ;
5. du type PAP/Hors PAP ;
6. des règles de workflow.

## 11. Traçabilité

Toute importation ou modification des référentiels doit être auditée.

Conserver au minimum :

* utilisateur ;
* date et heure ;
* ancienne valeur ;
* nouvelle valeur ;
* type d’opération ;
* source ;
* justification ;
* version du référentiel ;
* exercice concerné.

Aucune modification importante d’un référentiel officiel ne doit être invisible.

## 12. Gestion des exercices

Le Budget 2026 constitue le référentiel officiel initial.

L’architecture doit toutefois permettre ultérieurement l’intégration :

* Budget 2027 ;
* Budget 2028 ;
* etc.

Les données doivent être versionnées par exercice sans écraser les exercices précédents.

Un changement d’exercice ne doit pas modifier les données historiques.

## 13. Publication et verrouillage

Prévoir des statuts pour le Budget :

* Brouillon ;
* Importé ;
* En contrôle ;
* Validé ;
* Publié ;
* Révisé ;
* Clôturé ;
* Archivé.

Un budget publié ne doit plus pouvoir être modifié directement.

Toute évolution doit passer par :

* une révision ;
* un budget rectificatif ;
* ou un mécanisme formel d’amendement.

## 14. Écrans à prévoir ou à réorganiser

Créer ou améliorer notamment :

### Référentiel organisationnel

* vue arborescente ;
* organigramme interactif ;
* fiche structure ;
* rattachements ;
* responsables ;
* historique.

### Référentiel budgétaire

* budget de l’exercice ;
* classification PAP/Hors PAP ;
* arborescence budgétaire ;
* crédits ;
* consommations ;
* disponibilités.

### Référentiel PAP

Afficher le PAP comme **vue investissement du Budget**, et non comme budget indépendant.

Prévoir :

* arborescence stratégique ;
* activités ;
* tâches ;
* indicateurs ;
* budgets ;
* responsables ;
* taux d’exécution physique ;
* taux d’exécution financière.

### Données à compléter

Créer une interface spécifique affichant toutes les données nécessaires mais absentes des documents importés.

Exemples :

* activités sans tâches ;
* indicateurs sans cible ;
* activités sans calendrier ;
* lignes sans responsable ;
* données nécessitant enrichissement.

Permettre le traitement progressif de ces anomalies.

## 15. Tableau de qualité des données

Prévoir un tableau de bord permettant d’identifier :

* données complètes ;
* données incomplètes ;
* données incohérentes ;
* données à valider ;
* doublons ;
* données non rattachées ;
* données héritées de maquettes fictives ;
* données officielles ;
* données enrichies.

Afficher un taux de complétude par :

* exercice ;
* structure ;
* programme ;
* activité ;
* référentiel.

## 16. Migration de l’existant

Ne pas supprimer automatiquement les éléments existants avant audit.

Pour chaque élément :

**Conserver** s’il est correct et compatible.

**Adapter** s’il peut être aligné sur les nouveaux référentiels.

**Migrer** s’il doit être rattaché aux nouvelles données.

**Archiver** s’il est obsolète mais historiquement utile.

**Supprimer uniquement** les données manifestement fictives, inutiles ou redondantes après vérification.

Documenter toutes les décisions de migration.

## 17. Cohérence UX/UI

Conserver et améliorer l’identité visuelle existante de BUDGET-CEEAC.

Toutes les pages doivent cependant être réorganisées pour refléter clairement les trois dimensions :

**Organisation
→ Planification
→ Budget**

puis la chaîne d’exécution :

**Expression de Besoin
→ Engagement
→ Liquidation
→ Ordonnancement
→ Paiement**

et enfin :

**Suivi-Évaluation
→ Reporting
→ Audit**

Le design doit rester institutionnel, moderne, cohérent, lisible et professionnel.

## 18. Critères d’acceptation

La refonte sera considérée conforme lorsque :

* le référentiel organisationnel officiel joint constitue la source organisationnelle unique ;
* le Budget 2026 réel joint constitue la source budgétaire officielle de l’exercice ;
* le PAP est correctement traité comme le volet Investissement du Budget ;
* aucune donnée absente des documents officiels n’est inventée ;
* les segments manquants nécessaires au système existent néanmoins dans le modèle ;
* les utilisateurs autorisés peuvent compléter les informations manquantes ;
* toute donnée ajoutée manuellement est distinguée d’une donnée officielle ;
* une ligne budgétaire n’est pas recréée dans plusieurs modules ;
* les structures organisationnelles ne sont pas dupliquées ;
* les modules EB, Engagement, Liquidation, Ordonnancement et Paiement utilisent les mêmes référentiels ;
* les activités PAP peuvent recevoir plusieurs tâches ;
* les données historiques sont conservées ;
* toutes les modifications sont tracées ;
* aucune fonctionnalité correcte existante n’est cassée.

## 19. Résultat attendu de Figma

À partir de cet audit et des documents joints :

1. identifier les écarts entre la maquette actuelle et les référentiels officiels ;
2. proposer l’architecture fonctionnelle corrigée ;
3. réorganiser les écrans existants ;
4. créer les écrans manquants ;
5. remplacer les données fictives par les données officielles ;
6. représenter correctement le PAP comme volet Investissement du Budget ;
7. prévoir explicitement les données à compléter ultérieurement ;
8. intégrer la gestion des tâches sous les activités ;
9. rendre tous les référentiels réutilisables par les autres modules ;
10. conserver les fonctionnalités existantes pertinentes ;
11. améliorer l’ergonomie générale de l’application ;
12. produire une maquette cohérente avec le futur développement réel de BUDGET-CEEAC.

### Principe directeur final

**Les documents officiels déterminent les données ; l’application structure, contrôle, enrichit et exploite ces données, mais elle ne doit jamais inventer ce que les sources officielles ne contiennent pas.**

Lorsqu’une donnée indispensable manque dans le document officiel, l’application doit :

**prévoir sa structure → signaler qu’elle est à compléter → permettre son enrichissement → tracer son origine → permettre sa validation.**
