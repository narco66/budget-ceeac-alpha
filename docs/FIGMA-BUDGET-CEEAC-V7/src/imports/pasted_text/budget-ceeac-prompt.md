# PROMPT FIGMA — RÉFORME COMPLÈTE DU MODULE « EXPRESSION DE BESOIN » DE BUDGET-CEEAC

## 1. CONTEXTE GÉNÉRAL

Tu travailles sur la maquette Figma existante de l’application **BUDGET-CEEAC**, système intégré de planification, budgétisation, exécution budgétaire, suivi-évaluation et reporting de la Commission de la CEEAC.

Je joins à ce prompt la **nouvelle description fonctionnelle complète du module Expression de Besoin (EB)**.

Cette nouvelle description constitue désormais la **source de vérité fonctionnelle prioritaire** pour le module Expression de Besoin.

Ta mission ne consiste pas à effectuer quelques retouches graphiques sur les écrans existants.

Tu dois réaliser une **réforme complète, structurée et cohérente du module Expression de Besoin**, aussi bien sur le plan :

* fonctionnel ;
* métier ;
* ergonomique ;
* graphique ;
* navigationnel ;
* informationnel ;
* documentaire ;
* workflow ;
* contrôle budgétaire ;
* traçabilité ;
* accessibilité ;
* responsive design.

La réforme doit cependant préserver les composants, écrans, interactions et choix graphiques existants qui sont de bonne qualité et compatibles avec la nouvelle description fonctionnelle.

---

# 2. PRINCIPE FONDAMENTAL : AUDITER AVANT DE MODIFIER

Commence impérativement par réaliser un **audit exhaustif de l’existant**.

Analyse l’ensemble des écrans, composants et parcours actuellement associés directement ou indirectement à l’Expression de Besoin.

Tu dois identifier :

### Éléments conformes

Les éléments déjà présents dans la maquette qui répondent correctement à la nouvelle description et qui peuvent être conservés.

### Éléments partiellement conformes

Les éléments intéressants mais nécessitant :

* adaptation ;
* enrichissement ;
* repositionnement ;
* amélioration UX/UI ;
* ajout de champs ;
* ajout d'interactions ;
* modification du workflow.

### Éléments obsolètes

Les éléments devenus incompatibles avec la nouvelle procédure et qui doivent être supprimés ou remplacés.

### Éléments manquants

Toutes les fonctionnalités, pages, formulaires, états, interactions, composants, contrôles ou informations exigés par la nouvelle description mais absents de la maquette.

Ne supprime jamais un élément existant de qualité uniquement parce qu’il n’est pas explicitement mentionné dans le nouveau document.

Évalue d’abord sa pertinence fonctionnelle.

---

# 3. MATRICE DE CONFORMITÉ

Avant la refonte, construis mentalement ou explicitement une matrice :

**Exigence de la nouvelle description → Existant dans Figma → Écart constaté → Action proposée → Écran concerné**

Chaque exigence fonctionnelle de la description jointe doit être matérialisée quelque part dans la maquette.

Aucune fonctionnalité importante ne doit rester uniquement décrite textuellement sans traduction graphique ou interactionnelle.

---

# 4. OBJECTIF DE LA NOUVELLE EXPÉRIENCE UTILISATEUR

Le nouveau module Expression de Besoin doit devenir l’un des modules les plus aboutis de BUDGET-CEEAC.

L’utilisateur doit comprendre immédiatement :

* ce qu’il doit faire ;
* dans quel contexte budgétaire il travaille ;
* si le besoin relève du PAP ou du Hors PAP ;
* quelle ligne budgétaire est concernée ;
* quel montant est disponible ;
* quelles informations doivent être complétées ;
* quelles pièces doivent être jointes ;
* quelles validations sont nécessaires ;
* à quelle étape se trouve son dossier ;
* qui doit intervenir ensuite ;
* quels événements ont déjà eu lieu.

L’interface doit être riche en informations mais ne jamais donner une impression de surcharge.

Utilise :

* révélation progressive ;
* regroupement logique ;
* panneaux contextuels ;
* cartes ;
* accordéons ;
* onglets ;
* stepper ;
* tooltips ;
* badges ;
* résumés automatiques ;
* contrôles temps réel ;
* messages d’aide contextuels.

---

# 5. RÉFORME DU FORMULAIRE DE CRÉATION D’UNE EXPRESSION DE BESOIN

Le formulaire actuel doit être profondément repensé.

Évite un formulaire monolithique de plusieurs dizaines de champs.

Conçois un **assistant de création moderne en plusieurs étapes**, avec sauvegarde automatique du brouillon.

Prévoir idéalement les étapes suivantes, à adapter exactement à la description fonctionnelle jointe :

### Étape 1 — Contexte du besoin

Afficher notamment :

* exercice budgétaire actif ;
* structure de l’utilisateur ;
* service initiateur ;
* responsable ;
* date ;
* référence automatique ;
* objet du besoin ;
* urgence/priorité si prévue par la procédure.

Les informations déjà connues du système doivent être préremplies.

---

# 6. LA LIGNE BUDGÉTAIRE COMME POINT D’ENTRÉE MAJEUR

La sélection de la **ligne budgétaire principale du besoin** doit intervenir très tôt dans le processus.

Cette ligne constitue notamment un élément de classification permettant au système de déterminer automatiquement si le besoin relève :

* du **PAP / investissement** ;
* ou du **Hors PAP / fonctionnement**.

Ne demander jamais à l’utilisateur de saisir manuellement PAP ou Hors PAP lorsque cette information peut être déterminée à partir du référentiel budgétaire.

Après sélection de la ligne, afficher immédiatement un bandeau récapitulatif contenant notamment :

**Ligne budgétaire**
Code — Libellé

**Nature**
PAP / Hors PAP

**Budget**
Crédit initial

**Révisions**
Budget révisé

**Exécution**
Engagé — Liquidé — Ordonnancé — Payé

**Disponible**
Solde disponible

Les montants devront être présentés de façon extrêmement lisible.

---

# 7. RECHERCHE ET SÉLECTION D’UNE LIGNE BUDGÉTAIRE

Ne limite pas cette opération à une petite liste déroulante.

Créer un véritable composant de recherche budgétaire permettant :

* recherche par code ;
* recherche par libellé ;
* recherche plein texte ;
* filtres ;
* navigation dans la nomenclature ;
* affichage du disponible ;
* identification PAP/Hors PAP ;
* identification de l’unité responsable ;
* indication visuelle des lignes sans crédit disponible.

Prévoir une fenêtre ou un drawer « Sélectionner une ligne budgétaire ».

Une ligne sans crédit suffisant doit être clairement identifiable.

---

# 8. CAS DES BESOINS PAP

Lorsque la ligne budgétaire sélectionnée appartient au PAP, l’interface doit automatiquement basculer dans un **contexte programmatique enrichi**.

Le système doit récupérer et afficher toutes les informations programmatiques disponibles.

Selon la nouvelle description jointe et les informations disponibles dans BUDGET-CEEAC, cela peut notamment comprendre :

* pilier ;
* axe stratégique ;
* objectif ;
* programme ;
* produit ;
* sous-produit ;
* résultat ;
* activité ;
* tâche ;
* indicateur ;
* valeur de référence ;
* valeur cible ;
* unité de mesure ;
* source de vérification ;
* unité responsable ;
* responsables ;
* période d’exécution ;
* échéances ;
* résultat attendu ;
* budget initial ;
* budget révisé ;
* engagement ;
* liquidation ;
* ordonnancement ;
* paiement ;
* solde disponible ;
* taux d’exécution physique ;
* taux d’exécution financière.

Les données existantes doivent être récupérées automatiquement.

L’utilisateur ne doit pas ressaisir une information déjà disponible dans le système.

---

# 9. ENRICHISSEMENT DU PAP LORSQUE LE BUDGET SOURCE EST INCOMPLET

Le Budget 2026 de la CEEAC peut ne pas contenir l’ensemble des informations nécessaires à une gestion moderne du PAP.

La conception du module doit donc prévoir une architecture graphique permettant :

### Données officielles importées

Données récupérées du Budget/PAP officiel.

### Données enrichies dans BUDGET-CEEAC

Informations complémentaires nécessaires au pilotage qui peuvent être renseignées dans le système.

Les données officielles provenant du document budgétaire ne doivent jamais être écrasées ou confondues avec des données complémentaires créées dans l’application.

Utiliser une distinction visuelle claire telle que :

**Source : Budget/PAP officiel**

ou

**Donnée complémentaire BUDGET-CEEAC**

Prévoir les écrans et interactions nécessaires pour compléter progressivement les informations programmatiques absentes.

---

# 10. RELATION ENTRE ACTIVITÉ ET DÉTAIL DU BESOIN

Une ligne budgétaire peut représenter une activité globale alors que l’Expression de Besoin doit détailler plusieurs tâches, prestations, fournitures ou rubriques.

La maquette doit donc permettre la création de **plusieurs sous-lignes de détail** associées à une même imputation ou activité.

Créer un véritable tableau dynamique permettant par exemple :

| Désignation | Tâche/Rubrique | Description | Quantité | Unité | Prix unitaire | Montant |
| ----------- | -------------- | ----------- | -------: | ----- | ------------: | ------: |

Permettre :

* ajouter une ligne ;
* modifier ;
* supprimer ;
* dupliquer ;
* réordonner ;
* ajouter une observation ;
* associer éventuellement une tâche PAP.

Le système calcule automatiquement :

**Montant de la ligne = Quantité × Prix unitaire**

puis :

**Montant total du besoin = somme de toutes les sous-lignes.**

Le total doit toujours être visible.

---

# 11. IMPUTATION BUDGÉTAIRE MULTI-LIGNES

Même lorsqu’une ligne budgétaire principale permet de caractériser le besoin, l’imputation financière peut nécessiter plusieurs lignes budgétaires.

Prévoir une interface professionnelle de ventilation permettant :

* ajout de plusieurs imputations ;
* montant par imputation ;
* pourcentage éventuel ;
* solde disponible ;
* contrôle du disponible ;
* suppression/modification ;
* total automatique.

Afficher obligatoirement :

**Montant total du besoin**

**Total imputé**

**Reste à imputer**

La soumission doit être impossible si :

**Montant total du besoin ≠ Total des imputations.**

---

# 12. CONTRÔLE DE DISPONIBILITÉ DES CRÉDITS

Le contrôle budgétaire doit être immédiatement compréhensible.

Prévoir des composants indiquant notamment :

* crédit initial ;
* mouvements ;
* budget révisé ;
* engagements ;
* liquidations ;
* ordonnancements ;
* paiements ;
* disponible avant opération ;
* montant de l’EB ;
* disponible après opération.

Utiliser des états visuels :

**Disponible**

**Attention**

**Insuffisant**

Ne pas se contenter d’un message technique.

Présenter le contexte permettant à l’utilisateur de comprendre pourquoi une opération est ou non autorisée.

---

# 13. PIÈCES JUSTIFICATIVES

Créer un espace documentaire moderne intégré au formulaire.

Permettre notamment :

* glisser-déposer ;
* sélection de fichiers ;
* prévisualisation ;
* téléchargement ;
* suppression avant soumission ;
* catégorisation ;
* commentaires ;
* identification du déposant ;
* date/heure ;
* version.

Afficher les pièces obligatoires attendues selon le type de besoin.

Prévoir différents types de documents :

* devis ;
* facture pro forma ;
* termes de référence ;
* spécifications techniques ;
* correspondances ;
* notes ;
* études ;
* documents administratifs ;
* autres justificatifs.

Les pièces déposées devront être destinées à être intégrées automatiquement à la GED de BUDGET-CEEAC.

---

# 14. JUSTIFICATION DU BESOIN

Créer une zone particulièrement soignée permettant de présenter :

* contexte ;
* justification ;
* objectifs ;
* résultats attendus ;
* bénéficiaires ;
* contraintes ;
* urgence éventuelle ;
* observations.

Pour le PAP, permettre de visualiser directement la contribution du besoin aux objectifs et résultats programmatiques.

---

# 15. RÉCAPITULATIF AVANT SOUMISSION

Avant toute soumission, créer un véritable écran de synthèse.

Présenter sous forme de cartes ou sections :

**Identification**

**Demandeur**

**Structure**

**Classification PAP/Hors PAP**

**Ligne budgétaire**

**Informations PAP**

**Détail du besoin**

**Imputations**

**Montants**

**Disponibilité budgétaire**

**Pièces justificatives**

**Circuit de validation**

**Observations**

Faire apparaître les anomalies avant soumission.

Exemples :

✓ Informations obligatoires complètes
✓ Imputation équilibrée
✓ Crédit disponible
✓ Pièces obligatoires fournies
⚠ Une information recommandée est manquante

---

# 16. WORKFLOW DE VALIDATION

La maquette doit représenter explicitement le workflow prévu par la nouvelle description.

Le workflow dépend notamment du type d’Expression de Besoin.

Pour chaque dossier, afficher :

**Étape actuelle**

**Action réalisée**

**Auteur**

**Date et heure**

**Décision**

**Observation**

**Étape suivante**

**Acteur attendu**

Les actions prévues doivent pouvoir comprendre selon les droits et la procédure :

* enregistrer ;
* modifier ;
* soumettre ;
* valider ;
* retourner pour correction ;
* rejeter ;
* approuver ;
* signer ;
* commenter.

Aucune action ne doit être proposée à un utilisateur non habilité.

---

# 17. WORKFLOW PAP

Pour les Expressions de Besoin PAP, représenter graphiquement la chaîne de validation prévue dans la description fonctionnelle jointe.

Elle doit notamment prendre en compte :

* initiateur ;
* responsable hiérarchique N ;
* niveau N+1 approprié ;
* éventuels contrôles complémentaires ;
* approbation finale selon la procédure.

Adapter précisément les acteurs à la structure organisationnelle de la CEEAC et à la description jointe.

---

# 18. WORKFLOW HORS PAP

Prévoir également le circuit spécifique des Expressions de Besoin Hors PAP / fonctionnement décrit dans la documentation jointe.

Ne pas utiliser artificiellement le même workflow pour PAP et Hors PAP si les procédures sont différentes.

L’interface doit afficher automatiquement le bon circuit dès que le système connaît la classification du besoin.

---

# 19. TRANSITION EB → ENGAGEMENT

Lorsque l’Expression de Besoin atteint son niveau final d’approbation conformément à la procédure, la maquette doit clairement matérialiser la transition vers l’étape suivante de la chaîne de dépense.

Si la règle fonctionnelle prévoit une génération automatique de l’Engagement, représenter :

**Expression de Besoin approuvée**

↓

**Génération automatique de l’Engagement**

↓

**Dossier transmis au service compétent**

L’utilisateur ne doit pas avoir à effectuer une seconde « soumission » inutile si la procédure prévoit une transition automatique.

---

# 20. PAGE LISTE DES EXPRESSIONS DE BESOIN

Repenser complètement la liste.

Prévoir une interface permettant de gérer efficacement un volume important de dossiers.

Colonnes possibles :

* référence ;
* date ;
* objet ;
* structure ;
* demandeur ;
* PAP/Hors PAP ;
* ligne budgétaire ;
* montant ;
* statut ;
* étape ;
* acteur attendu ;
* priorité ;
* dernière modification.

Permettre :

* recherche globale ;
* filtrage avancé ;
* tri ;
* pagination ;
* vues enregistrées ;
* filtres rapides ;
* export ;
* sélection multiple si pertinente.

---

# 21. FILTRES RAPIDES ET CARTES KPI

Ajouter en tête de page des cartes interactives :

**Toutes**

**Brouillons**

**À compléter**

**Soumises**

**À valider**

**Retournées**

**Rejetées**

**Approuvées**

**Transformées en engagement**

Le clic sur une carte doit filtrer immédiatement la liste.

Adapter les cartes aux droits et au rôle de l’utilisateur connecté.

---

# 22. PAGE DÉTAIL D’UNE EXPRESSION DE BESOIN

Créer une page de consultation particulièrement riche.

Organisation recommandée :

### En-tête

Référence — Statut — PAP/Hors PAP — Montant — Priorité

### Bandeau workflow

Étape actuelle — acteur attendu — dernière action — prochaine action

### Onglets

**Synthèse**

**Détail du besoin**

**Budget & imputations**

**PAP**

**Pièces jointes**

**Workflow**

**Historique**

**Documents générés**

**Commentaires**

La page doit permettre de comprendre intégralement le dossier sans retourner vers plusieurs pages.

---

# 23. BANNIÈRE DE SUIVI DU DOSSIER

Créer un composant transversal réutilisable dans toute la chaîne de dépense.

Exemple :

**ÉTAPE ACTUELLE**

Validation de l’Expression de Besoin

**DERNIÈRE ACTION**

Validée par Jean DUPONT
14 septembre 2026 à 10:36

**ACTEUR ATTENDU**

Directeur XXXXX

**PROCHAINE ÉTAPE**

Approbation / transmission

Utiliser ce composant également dans Engagement, Liquidation, Ordonnancement et Paiement afin de garantir une cohérence globale.

---

# 24. TIMELINE ET TRAÇABILITÉ

Créer une timeline verticale détaillée affichant tous les événements :

* création ;
* modification ;
* ajout de document ;
* soumission ;
* validation ;
* retour ;
* correction ;
* rejet ;
* approbation ;
* génération de document ;
* transformation en Engagement.

Chaque événement doit afficher :

* date ;
* heure ;
* utilisateur ;
* rôle ;
* action ;
* commentaire ;
* éventuellement version concernée.

---

# 25. ÉDITION ET RETOUR POUR CORRECTION

Prévoir soigneusement les scénarios de correction.

Une EB retournée doit montrer :

* la raison du retour ;
* l’auteur ;
* la date ;
* les champs ou éléments concernés ;
* les commentaires ;
* les corrections demandées.

Mettre visuellement en évidence les sections nécessitant une action.

Après correction, l’utilisateur doit pouvoir resoumettre le dossier conformément au workflow.

---

# 26. HISTORIQUE DES VERSIONS

Lorsque des modifications significatives sont réalisées, prévoir une consultation de l’historique :

**Version 1**

**Version 2**

**Version actuelle**

Permettre de comprendre :

* qui a modifié ;
* quand ;
* quoi ;
* pourquoi.

La traçabilité doit être perceptible dans l’UX dès la conception Figma.

---

# 27. DOCUMENTS PDF

Prévoir dans la maquette les documents officiels générés par le système au cours du cycle de vie de l’EB.

Créer les interfaces :

* génération ;
* aperçu ;
* téléchargement ;
* archivage ;
* version ;
* date de génération ;
* auteur système/utilisateur.

Le PDF officiel de l’Expression de Besoin doit reprendre les principales informations du dossier et être intégré automatiquement à la GED.

Prévoir une vraie maquette du document PDF officiel, cohérente avec l’identité de la CEEAC.

---

# 28. NOTIFICATIONS

Identifier les événements nécessitant une notification :

* EB soumise ;
* EB reçue pour validation ;
* EB retournée ;
* EB corrigée ;
* EB rejetée ;
* EB approuvée ;
* EB transformée en Engagement ;
* dossier en attente ;
* échéance dépassée.

Créer les états visuels permettant d’accéder au dossier directement depuis la notification.

---

# 29. « MES TÂCHES »

Les Expressions de Besoin nécessitant une intervention de l’utilisateur doivent être intégrées naturellement à « Mes tâches ».

Afficher :

* dossier ;
* action attendue ;
* montant ;
* demandeur ;
* date de réception ;
* ancienneté ;
* priorité ;
* délai éventuel.

Les dossiers les plus récents pourront être présentés selon la règle globale de classement retenue dans BUDGET-CEEAC, avec possibilité de tri complémentaire.

---

# 30. DROITS ET PROFILS

Adapter les interfaces selon le rôle.

Un demandeur ne doit pas voir les mêmes actions qu’un valideur.

Un valideur ne doit pas voir les mêmes actions qu’un administrateur.

Prévoir les états correspondant notamment à :

* initiateur ;
* chef de service ;
* directeur ;
* responsable N+1 ;
* Secrétaire Général ;
* Ordonnateur ;
* Budget ;
* Contrôle financier ;
* administrateur ;
* consultation/audit.

Ne pas afficher de boutons inopérants.

Masquer ou désactiver correctement les actions selon les habilitations.

---

# 31. DESIGN SYSTEM

Conserver l’identité graphique générale de BUDGET-CEEAC lorsqu’elle est pertinente, mais porter la qualité du module à un niveau supérieur.

Le design recherché doit être :

* institutionnel ;
* premium ;
* moderne ;
* sobre ;
* professionnel ;
* ergonomique ;
* rassurant ;
* particulièrement lisible ;
* adapté à la gestion des finances publiques.

Éviter :

* les interfaces surchargées ;
* les tableaux illisibles ;
* les couleurs excessives ;
* les formulaires interminables ;
* les boutons dispersés ;
* les répétitions d’informations ;
* les modales inutiles.

---

# 32. COMPOSANTS RÉUTILISABLES

Utiliser systématiquement des composants Figma avec variants.

Créer ou améliorer notamment :

* boutons ;
* inputs ;
* select ;
* autocomplete ;
* textarea ;
* date picker ;
* uploader ;
* badges ;
* statuts ;
* cartes KPI ;
* tableaux ;
* pagination ;
* accordéons ;
* onglets ;
* timeline ;
* stepper ;
* alertes ;
* modales ;
* drawers ;
* bandeau workflow ;
* résumé budgétaire ;
* sélecteur de ligne budgétaire ;
* tableau d’imputation ;
* détail PAP ;
* historique.

Éviter les duplications manuelles d’éléments.

---

# 33. ÉTATS DES COMPOSANTS

Prévoir au minimum :

* default ;
* hover ;
* focus ;
* selected ;
* disabled ;
* loading ;
* error ;
* warning ;
* success ;
* read-only.

Prévoir également les écrans :

* chargement ;
* aucune donnée ;
* erreur technique ;
* accès refusé ;
* donnée indisponible ;
* absence de crédit ;
* aucune ligne budgétaire ;
* aucune pièce jointe.

---

# 34. RESPONSIVE DESIGN

Créer au minimum :

### Desktop

1440 px ou largeur de référence équivalente.

### Laptop

Résolution intermédiaire.

### Tablette

Adaptation des tableaux et panneaux.

### Mobile

Au minimum pour :

* consultation ;
* validation ;
* notifications ;
* Mes tâches ;
* détail synthétique d’un dossier.

Ne pas simplement réduire la largeur des écrans desktop.

Repenser les interactions nécessaires.

---

# 35. ACCESSIBILITÉ

Respecter autant que possible WCAG 2.2 AA :

* contraste ;
* taille minimale des textes ;
* focus visible ;
* labels ;
* navigation clavier ;
* états ne reposant pas uniquement sur les couleurs ;
* zones cliquables suffisantes.

---

# 36. PROTOTYPAGE

Ne livre pas uniquement des écrans statiques.

Créer un prototype interactif permettant de simuler au minimum :

### Scénario 1

Création d’une EB Hors PAP.

### Scénario 2

Création d’une EB PAP.

### Scénario 3

Ajout de plusieurs sous-lignes de détail.

### Scénario 4

Ventilation sur plusieurs imputations.

### Scénario 5

Crédit insuffisant.

### Scénario 6

Ajout de pièces justificatives.

### Scénario 7

Soumission.

### Scénario 8

Validation.

### Scénario 9

Retour pour correction.

### Scénario 10

Correction et resoumission.

### Scénario 11

Approbation finale.

### Scénario 12

Transformation automatique en Engagement.

---

# 37. COHÉRENCE AVEC LE RESTE DE BUDGET-CEEAC

La réforme ne doit pas créer un module isolé graphiquement ou fonctionnellement.

Vérifie les impacts sur :

* tableau de bord ;
* Budget ;
* PAP ;
* nomenclature budgétaire ;
* référentiel organisationnel ;
* Engagement ;
* GED ;
* Notifications ;
* Mes tâches ;
* Reporting ;
* Suivi-évaluation ;
* workflow ;
* utilisateurs et rôles ;
* audit ;
* recherche globale.

Si la réforme de l’EB nécessite une adaptation d’un composant transversal, mettre également à jour ce composant.

---

# 38. NE PAS INVENTER DES DONNÉES MÉTIER CONTRADICTOIRES

La priorité des sources est :

**1. Nouvelle description complète du module Expression de Besoin jointe à ce prompt**

**2. Cahier des charges actuel de BUDGET-CEEAC**

**3. Référentiels budgétaires et organisationnels**

**4. Maquette Figma existante**

Lorsqu’un écran existant entre en contradiction avec la nouvelle description, la nouvelle description prévaut.

Ne jamais inventer un workflow qui contredit les procédures fournies.

---

# 39. DONNÉES RÉALISTES

Pour les exemples de maquettes, utiliser des données réalistes dans le contexte CEEAC.

Exemples :

**Référence**
EB-2026-00487

**Exercice**
2026

**Devise**
XAF / FCFA

**Montant**
4 750 000 FCFA

Utiliser des libellés métier réalistes plutôt que :

Lorem ipsum
Test 1
Item 2
User 01.

---

# 40. IDENTITÉ CEEAC

Respecter l’identité institutionnelle de la Commission de la CEEAC.

Utiliser correctement :

* logo officiel déjà présent dans le projet ;
* typographies existantes lorsqu’elles sont appropriées ;
* palette institutionnelle ;
* iconographie homogène ;
* composants du design system BUDGET-CEEAC.

Le résultat doit immédiatement apparaître comme une application professionnelle de gestion budgétaire institutionnelle.

---

# 41. ARCHITECTURE FIGMA

Réorganiser proprement les frames du module.

Structure recommandée :

**EB / 00 — Audit**

**EB / 01 — Components**

**EB / 02 — Dashboard**

**EB / 03 — List**

**EB / 04 — Create**

**EB / 05 — PAP**

**EB / 06 — Hors PAP**

**EB / 07 — Detail**

**EB / 08 — Workflow**

**EB / 09 — Documents**

**EB / 10 — History**

**EB / 11 — States**

**EB / 12 — Responsive**

**EB / 13 — Prototype**

Utiliser :

* Auto Layout ;
* composants ;
* variants ;
* variables ;
* styles ;
* tokens ;
* contraintes responsive.

---

# 42. RÉSULTAT ATTENDU

À la fin de la réforme, je veux obtenir une maquette dans laquelle le module Expression de Besoin peut pratiquement servir directement de spécification fonctionnelle et UX pour les développeurs.

Un développeur React.js/Laravel consultant Figma doit pouvoir comprendre :

* les écrans à développer ;
* les champs ;
* les composants ;
* les comportements ;
* les contrôles ;
* les statuts ;
* les workflows ;
* les droits ;
* les données automatiques ;
* les interactions ;
* les documents ;
* les notifications ;
* les cas d’erreur ;
* les transitions.

---

# 43. CONTRÔLE FINAL DE CONFORMITÉ

Avant de considérer la réforme terminée, relis intégralement la nouvelle description fonctionnelle jointe.

Effectue une vérification exigence par exigence.

Pour chaque exigence, pose-toi la question :

> « Où cette exigence apparaît-elle dans la nouvelle maquette et comment l’utilisateur interagit-il avec elle ? »

Si aucune réponse précise n’est possible, la maquette est incomplète.

Corrige-la avant de terminer.

---

# 44. LIVRABLE FINAL ATTENDU

Produis :

**A. Audit de l’existant**

**B. Liste des écarts**

**C. Nouvelle architecture UX du module**

**D. Design system/components nécessaires**

**E. Nouveau dashboard EB**

**F. Nouvelle liste des EB**

**G. Nouveau processus complet de création**

**H. Parcours PAP**

**I. Parcours Hors PAP**

**J. Imputation multi-lignes**

**K. Détail des tâches/rubriques**

**L. Gestion documentaire**

**M. Workflow et validations**

**N. Page détail du dossier**

**O. Historique et audit**

**P. Notifications et Mes tâches**

**Q. Documents/PDF**

**R. États exceptionnels et erreurs**

**S. Responsive desktop/tablette/mobile**

**T. Prototype interactif des principaux scénarios**

**U. Tableau final de conformité entre la description fonctionnelle jointe et les écrans produits**

---

# INSTRUCTION FINALE

Ne te limite pas à embellir la maquette actuelle.

**Repense réellement le module Expression de Besoin de bout en bout.**

Conserve ce qui fonctionne.

Améliore ce qui est incomplet.

Supprime ce qui est devenu incohérent.

Ajoute tout ce qui manque.

Réorganise les parcours lorsque cela améliore l’expérience utilisateur sans modifier les règles métier.

La nouvelle version doit être :

**fonctionnellement complète, budgétairement rigoureuse, ergonomiquement exceptionnelle, graphiquement professionnelle, parfaitement intégrée à BUDGET-CEEAC et directement exploitable pour le développement.**

Aucune exigence importante de la nouvelle description jointe ne doit être oubliée.
