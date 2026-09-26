# Modèle de domaine — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Source :** cahier v5.0 §30, référentiel organisationnel, Budget 2026

## 1. Agrégats

| Agrégat | Racine | Invariants |
| --- | --- | --- |
| Identité et habilitation | `User` | Un compte actif, rôles datés, SoD respectée à l’attribution |
| Organisation | `OrganizationUnit` | Un parent, pas de cycle, pas de suppression physique si utilisée, version datée |
| Planification | `ProgramNode` | Parent dans la chaîne Pilier→Axe→Objectif→Produit→Sous-produit→Activité→Tâche, version publiée immuable |
| Budget | `BudgetLine` | Initial immuable après publication ; révisé = initial + mouvements validés ; disponible cohérent avec réservations et engagements |
| Dossier de dépense | `NeedRequest` | Filiation EB→ENG→LIQ→ORD→PAI ; sous-lignes équilibrées ; cumuls |
| Tiers | `Party` | Identité unique, compte bancaire historisé, changement sensible à double regard |
| Workflow | `WorkflowInstance` | Transition seulement si définition + garde domaine |
| Document | `Document` | Version, hash, pas de modification d’un binaire probant |
| Audit | `AuditEvent` | Append-only |

## 2. Chaîne programmatique

```text
Pillar → Axis → Objective (si applicable) → Product → SubProduct → Activity → Task
```

Chaque nœud : code, libellé, description, responsable (poste), indicateurs, résultats attendus, période, statut, exercice, version.

Une ligne PAP pointe vers un nœud d’activité (et éventuellement des tâches) sans dupliquer le montant budgétaire officiel. Les compléments absents du PDF 2026 sont saisis dans le référentiel de programmation et marqués `completed_locally`, jamais écrits en retour dans la pièce source.

## 3. Ligne budgétaire

Attributs financiers dérivés, reproductibles :

```text
révisé     = initial + Σ mouvements validés
réservé    = Σ réservations actives
engagé     = Σ engagements visés − dégagements
liquidé    = Σ liquidations visées
ordonnancé = Σ ordres signés
payé       = Σ paiements exécutés non annulés
disponible = révisé − réservé − engagé
```

La formule de disponible est celle de la décision ADR-006 : une réservation et un engagement visé ne se cumulent pas deux fois. Quand le visa CF transforme la réservation en engagement, la réservation est close dans la même transaction.

Segment : `fonctionnement`, `investissement` (PAP), `equipement`.  
Source : `ceeac` (ressources propres) et `ptf` (partenaires), conformément aux colonnes du Budget 2026.

## 4. Chaîne de dépense

```text
NeedRequest 1──* Commitment 1──* Liquidation 1──* PaymentOrder 1──* Payment
```

Chaque maillon conserve `source_id`, le snapshot des données héritées et sa propre référence. Les sous-lignes se propagent : le total des sous-lignes égale le montant du palier.

Invariants transactionnels :

```text
Σ ENG visés − dégagements  ≤  disponible au moment du visa + réservation de ce dossier
Σ ENG actifs d’une EB      ≤  montant EB validé
Σ LIQ visées               ≤  ENG net
Σ ORD signés               ≤  LIQ visées
Σ PAI exécutés             ≤  ORD pris en charge
```

Statuts : ceux du cahier §8.6, §9.6, §10.7, §11.7, §12.7. Un statut n’est pas un champ libre. Il résulte d’une transition.

## 5. Acteurs (fonctions, pas des personnes figées)

Initiateur, Service des Moyens Généraux, Directeur, Commissaire, DRHMG, Secrétaire Général, Président, Expert Budget, Chef de Service Budget, Directeur Budget, Contrôleur Financier, certificateur du service fait, Agence Comptable, Comptable, Chef Comptable, Agent Comptable, Audit, Contrôle interne, administrateur technique.

La séparation minimale interdit qu’un même utilisateur, sur un même dossier, cumule une fonction de la liste incompatible (préparation, visa CF, ordonnancement, paiement). La matrice est en base (`sod_rules`).

## 6. Numérotation

Domaines : `EB`, `ENG`, `LIQ`, `ORD`, `PAI`, `RES` (réservation), `MOV` (mouvement budgétaire), `DOC`.  
Format : `{DOMAINE}-{EXERCICE}-{séquence sur 6 chiffres}`.  
La séquence est incrémentée sous verrou de ligne dans la transaction qui crée l’acte.

## 7. Hors agrégat financier immédiat

Marché/contrat, indicateur de performance, réalisation physique, risque, anomalie de contrôle, arriéré, relevé bancaire, notification, tâche personnelle. Ils référencent les agrégats ci-dessus et ne recalculent pas les soldes officiels par une seconde écriture.
