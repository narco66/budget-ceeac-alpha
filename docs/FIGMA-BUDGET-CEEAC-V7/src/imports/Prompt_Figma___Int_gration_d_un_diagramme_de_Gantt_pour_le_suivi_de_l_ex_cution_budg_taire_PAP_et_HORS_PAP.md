# PROMPT FIGMA — INTÉGRATION D’UN GANTT DE SUIVI DE L’EXÉCUTION BUDGÉTAIRE PAP ET HORS PAP DANS BUDGET-CEEAC

Dans le cadre de l’évolution fonctionnelle de **BUDGET-CEEAC**, audite les interfaces existantes relatives au **suivi de l’exécution budgétaire** et intègre un **diagramme de Gantt interactif, moderne et professionnel** permettant de suivre dans le temps l’exécution des opérations budgétaires **PAP et HORS PAP**.

L’objectif est de disposer d’une représentation chronologique claire permettant aux responsables de visualiser simultanément :

- la programmation ;
- les échéances ;
- l’avancement ;
- l’exécution financière ;
- les principales étapes de la chaîne de dépense ;
- les retards ;
- les blocages ;
- les écarts entre prévision et réalisation.

---

# 1. Deux modes de suivi obligatoires

Le Gantt doit permettre de basculer facilement entre :

### Mode HORS PAP

Pour le suivi des dépenses de fonctionnement et autres opérations budgétaires ne relevant pas du PAP.

### Mode PAP

Pour le suivi des activités, tâches, investissements et opérations rattachés au Plan Annuel de Performance.

Ajouter également une vue :

### PAP + HORS PAP

permettant d’obtenir une vision consolidée de l’exécution budgétaire de l’exercice.

---

# 2. Positionnement dans BUDGET-CEEAC

Intégrer le Gantt dans le domaine :

**Budget → Suivi de l’exécution budgétaire**

Prévoir notamment les onglets :

- Vue synthétique ;
- Tableau d’exécution ;
- **Gantt d’exécution** ;
- Analyse des écarts ;
- Alertes ;
- Historique.

Le Gantt doit également être accessible depuis les dashboards Budget et PAP lorsque cela est pertinent.

---

# 3. Gantt HORS PAP

Pour les dépenses **HORS PAP**, construire la hiérarchie selon les dimensions pertinentes de BUDGET-CEEAC.

Exemple :

```text
Structure
   └── Ligne budgétaire
         └── Expression de Besoin
               └── Engagement
                     └── Liquidation
                           └── Ordonnancement
                                 └── Paiement
```

Chaque ligne doit permettre de visualiser :

- référence ;
- objet ;
- structure ;
- ligne budgétaire ;
- montant ;
- responsable ;
- date prévue de début ;
- date prévue de fin ;
- date réelle de début ;
- date réelle de fin ;
- statut ;
- pourcentage d’avancement ;
- consommation financière.

---

# 4. Gantt PAP

Pour les dépenses et activités relevant du PAP, utiliser la chaîne RBM officielle :

**Pilier → Axe → Produit → Sous-produit → Activité → Tâche**

Puis rattacher les opérations budgétaires correspondantes.

Exemple :

```text
Pilier
   └── Axe
        └── Produit
             └── Sous-produit
                  └── Activité
                       └── Tâche
                            ├── EB
                            ├── Engagement
                            ├── Liquidation
                            ├── Ordonnancement
                            └── Paiement
```

Le Gantt PAP doit permettre de rapprocher :

**Avancement physique**

et

**Avancement financier**.

---

# 5. Structure visuelle du Gantt

La partie gauche doit présenter les informations structurées.

Exemple de colonnes :

| Élément | Responsable | Budget | Exécuté | % physique | % financier | Statut |
|---|---|---:|---:|---:|---:|---|

La partie droite représente la chronologie.

Prévoir différentes échelles :

- Jour ;
- Semaine ;
- Mois ;
- Trimestre ;
- Année.

---

# 6. Barres temporelles

Chaque élément doit disposer d’une barre représentant :

- début prévu ;
- fin prévue ;
- période réelle ;
- progression ;
- retard éventuel.

Différencier visuellement :

- planifié ;
- en cours ;
- réalisé ;
- en retard ;
- suspendu ;
- annulé ;
- bloqué.

Respecter le Design System actuel de BUDGET-CEEAC.

---

# 7. Comparaison planifié / réalisé

Le Gantt doit permettre de distinguer clairement :

### Calendrier prévu

Dates issues de la programmation.

### Calendrier réel

Dates issues des traitements réellement réalisés dans BUDGET-CEEAC.

Le décalage entre les deux doit être immédiatement visible.

---

# 8. Jalons de la chaîne de dépense

Afficher des jalons pour les principales étapes :

- création EB ;
- validation EB ;
- génération Engagement ;
- validation Engagement ;
- génération Liquidation ;
- certification service fait ;
- visa Liquidation ;
- génération Ordonnancement ;
- signature Ordonnancement ;
- génération Paiement ;
- règlement ;
- rapprochement.

Utiliser des marqueurs graphiques distincts.

---

# 9. Avancement financier

Pour chaque élément, afficher notamment :

- budget autorisé ;
- budget révisé ;
- montant engagé ;
- montant liquidé ;
- montant ordonnancé ;
- montant payé ;
- reste disponible ;
- taux d’engagement ;
- taux de paiement.

Afficher ces données dans les infobulles et le panneau de détail.

---

# 10. Avancement physique du PAP

Pour les activités et tâches PAP, afficher :

- cible ;
- réalisation ;
- taux d’avancement physique ;
- indicateur associé ;
- résultat attendu ;
- état du livrable.

Le Gantt doit permettre de détecter des situations telles que :

> activité financièrement exécutée à 80 %, mais physiquement réalisée à seulement 40 %.

---

# 11. Indicateur physique-financier

Créer un indicateur permettant de comparer :

**% d’exécution physique**

avec

**% d’exécution financière**.

Exemple :

```text
Physique : 65 %
Financier : 82 %
Écart : +17 points
```

Signaler automatiquement les écarts significatifs.

---

# 12. Détection des retards

Le Gantt doit identifier automatiquement les opérations dont :

- la date prévue est dépassée ;
- l’étape suivante n’a pas commencé ;
- le SLA est dépassé ;
- le traitement reste bloqué trop longtemps.

Afficher :

- nombre de jours de retard ;
- étape concernée ;
- acteur attendu ;
- criticité.

---

# 13. Dépendances

Pour les activités PAP, représenter les dépendances lorsqu’elles existent.

Exemple :

```text
Tâche A
   ↓
Tâche B
   ↓
Tâche C
```

Une tâche dépendante ne peut être considérée comme démarrée si son prérequis obligatoire n’est pas terminé.

---

# 14. Chemin critique

Prévoir une vue ou un indicateur permettant d’identifier le **chemin critique** des activités importantes.

Les tâches critiques doivent être clairement distinguées.

---

# 15. Filtres avancés

Ajouter un panneau de filtres comprenant au minimum :

- exercice ;
- PAP / HORS PAP ;
- département ;
- direction ;
- service ;
- Pilier ;
- Axe ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- ligne budgétaire ;
- source de financement ;
- PTF ;
- responsable ;
- statut ;
- niveau de priorité ;
- période ;
- tranche de montant.

---

# 16. Recherche

Ajouter une recherche directe par :

- référence EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement ;
- activité ;
- tâche ;
- ligne budgétaire ;
- objet ;
- structure.

---

# 17. Drill-down

Chaque ligne du Gantt doit être interactive.

Un clic doit ouvrir :

- le détail de l’activité ;
- le dossier budgétaire ;
- la ligne budgétaire ;
- le workflow ;
- les pièces ;
- les événements ;
- la situation financière.

Éviter d’obliger l’utilisateur à quitter systématiquement le Gantt.

Privilégier un **drawer latéral** pour les consultations rapides.

---

# 18. Drawer de détail

Le drawer doit pouvoir présenter :

### Identification

- référence ;
- objet ;
- structure ;
- responsable.

### Planning

- début prévu ;
- fin prévue ;
- début réel ;
- fin réelle ;
- retard.

### Finances

- budget ;
- engagé ;
- liquidé ;
- ordonnancé ;
- payé.

### Workflow

- étape actuelle ;
- acteur précédent ;
- acteur attendu ;
- SLA.

### PAP

Lorsque applicable :

- Pilier ;
- Axe ;
- Produit ;
- Sous-produit ;
- Activité ;
- Tâche ;
- indicateur.

---

# 19. Indicateurs synthétiques au-dessus du Gantt

Prévoir des cartes KPI telles que :

- Budget total ;
- Montant engagé ;
- Montant payé ;
- Taux d’exécution ;
- Activités en cours ;
- Activités terminées ;
- Activités en retard ;
- Opérations bloquées ;
- PAP en retard ;
- HORS PAP en retard.

---

# 20. Alertes visuelles

Créer des alertes contextuelles telles que :

### Retard critique
> 12 activités PAP ont dépassé leur date prévue de fin.

### Blocage financier
> 8 opérations sont en attente de validation depuis plus de 7 jours.

### Écart physique-financier
> 5 activités présentent un écart supérieur à 20 points.

---

# 21. Ligne « Aujourd’hui »

Afficher une ligne verticale :

**Aujourd’hui**

sur toute la hauteur du diagramme.

Cette ligne doit permettre de voir rapidement :

- les tâches en retard ;
- les activités en cours ;
- les tâches à venir.

---

# 22. Zoom temporel

Prévoir :

- zoom avant ;
- zoom arrière ;
- ajuster à l’écran ;
- aujourd’hui ;
- mois précédent ;
- mois suivant.

---

# 23. Vues enregistrées

Permettre à l’utilisateur de sauvegarder des vues telles que :

- Mon département ;
- PAP en retard ;
- HORS PAP critiques ;
- Projets PTF ;
- Paiements non terminés ;
- Activités du trimestre.

---

# 24. Export

Prévoir :

- Export PDF ;
- Export Excel ;
- Export image du Gantt ;
- Impression.

Le PDF doit conserver la chronologie et la légende.

---

# 25. Gantt global et Gantt détaillé

Prévoir deux niveaux :

### Gantt global

Vision macro :

- départements ;
- programmes ;
- PAP ;
- grandes enveloppes.

### Gantt détaillé

Vision opérationnelle :

- activités ;
- tâches ;
- EB ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement.

---

# 26. Code couleur fonctionnel

Utiliser une convention visuelle cohérente avec le Design System BUDGET-CEEAC.

Les couleurs doivent permettre de reconnaître rapidement :

- planifié ;
- en cours ;
- réalisé ;
- en retard ;
- bloqué ;
- rejeté ;
- annulé.

Prévoir également une légende clairement visible.

---

# 27. Responsive

Optimiser prioritairement pour :

- Desktop 1440 px ;
- Laptop 1366 px ;
- Tablette paysage.

Sur petit écran, favoriser :

- colonnes repliables ;
- scroll horizontal contrôlé ;
- filtres dans un drawer ;
- panneau de détail latéral.

---

# 28. Performance UX

Le diagramme pouvant contenir beaucoup d’éléments, prévoir dans la maquette :

- chargement progressif ;
- regroupement ;
- lignes pliables/dépliables ;
- pagination ou virtualisation conceptuelle ;
- filtres rapides ;
- mémorisation de la position.

---

# 29. Intégration avec les autres modules

Le Gantt doit exploiter les informations déjà présentes dans :

- Budget ;
- PAP ;
- RBM ;
- Expression de Besoin ;
- Engagement ;
- Liquidation ;
- Ordonnancement ;
- Paiement ;
- Suivi-Évaluation ;
- Workflow ;
- GED ;
- Journal des événements.

Aucune donnée ne doit être ressaisie uniquement pour alimenter le Gantt lorsqu’elle existe déjà.

---

# 30. Écrans Figma à générer

Créer au minimum :

1. **Dashboard — Suivi de l’exécution budgétaire**
2. **Gantt global PAP + HORS PAP**
3. **Gantt HORS PAP**
4. **Gantt PAP**
5. **Gantt détaillé d’une activité PAP**
6. **Gantt d’une structure**
7. **Vue retards et blocages**
8. **Vue analyse physique-financière**
9. **Drawer détail d’une opération**
10. **Filtres avancés**
11. **Vue export / impression**
12. **Vue plein écran du Gantt**

---

# 31. Préserver le style BUDGET-CEEAC

Ne crée pas un design indépendant.

Le Gantt doit s’intégrer naturellement au style actuel de BUDGET-CEEAC :

- sidebar existante ;
- header ;
- breadcrumbs ;
- cartes KPI ;
- typographies ;
- boutons ;
- badges ;
- tableaux ;
- espacements ;
- iconographie ;
- palette fonctionnelle.

Le résultat doit sembler appartenir nativement à l’application.

---

# 32. Prototype Figma

Créer les interactions permettant de simuler :

**Dashboard**
→ **Suivi exécution**
→ **Gantt**
→ **Filtre PAP/HORS PAP**
→ **Sélection activité**
→ **Drawer détail**
→ **Ouverture dossier**
→ **Historique/Workflow**

---

# 33. Résultat attendu

Le diagramme de Gantt doit devenir un véritable **outil de pilotage temporel, physique et financier de BUDGET-CEEAC**, et non une simple représentation graphique.

Il doit permettre de répondre immédiatement à des questions telles que :

- Quelles activités étaient prévues à cette période ?
- Quelles opérations sont réellement en cours ?
- Quelles activités sont en retard ?
- Où se situe le blocage ?
- Quel acteur doit agir ?
- Quel montant est engagé ?
- Quel montant est payé ?
- Quel est le taux d’exécution du Budget ?
- Quel est le taux d’exécution du PAP ?
- Quels projets ont une exécution financière supérieure à leur réalisation physique ?
- Quels dossiers HORS PAP accusent un retard ?
- Quelle activité représente un risque pour l’atteinte des résultats ?

L’objectif final est de disposer dans BUDGET-CEEAC d’un **Gantt dynamique, interactif et décisionnel**, capable de rapprocher :

> **Programmation temporelle + Exécution budgétaire + Avancement physique + Workflow + Performance**

pour les opérations **PAP et HORS PAP**.