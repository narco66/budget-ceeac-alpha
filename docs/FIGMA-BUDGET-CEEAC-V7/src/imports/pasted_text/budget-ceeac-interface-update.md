Parcours méthodiquement l’ensemble des **liens fournis**.

Chaque lien correspond à **un module spécifique de l’application BUDGET-CEEAC** et donne accès aux différentes interfaces, pages, écrans, formulaires, tableaux, vues détaillées, tableaux de bord, composants et états fonctionnels de ce module.

Ta mission consiste à **explorer chaque lien, identifier et récupérer toutes les interfaces utiles du module correspondant, les analyser, les optimiser puis les intégrer dans la maquette Figma actuelle de BUDGET-CEEAC**, en remplacement des interfaces existantes correspondantes.

L’objectif est de conserver la **richesse fonctionnelle réelle des modules accessibles via les liens**, tout en maintenant strictement le **style graphique, le Design System, l’identité visuelle et les principes UX/UI actuels de la maquette BUDGET-CEEAC**.

# 1. PARCOURIR CHAQUE LIEN

Pour chaque lien :

1. identifier précisément le module concerné ;
2. parcourir toutes les pages accessibles ;
3. explorer les menus, sous-menus, onglets et actions ;
4. identifier les interfaces principales et secondaires ;
5. identifier les formulaires ;
6. identifier les tableaux ;
7. identifier les tableaux de bord ;
8. identifier les vues détaillées ;
9. identifier les fenêtres modales ;
10. identifier les panneaux latéraux ;
11. identifier les filtres ;
12. identifier les workflows ;
13. identifier les statuts ;
14. identifier les messages, alertes et notifications ;
15. identifier les différents états d’un même écran ;
16. identifier les interactions et parcours utilisateurs ;
17. identifier les composants réutilisables.

Ne te limite pas uniquement à la page d’accueil du module.

Explore le module en profondeur afin de récupérer **toutes les interfaces nécessaires à son fonctionnement**.

# 2. ÉTABLIR UNE CARTOGRAPHIE DES INTERFACES

Pour chaque module, établir une cartographie logique de type :

**Module
→ Sous-module
→ Page
→ Vue
→ Composant
→ Action
→ État**

Exemple :

**Expression de Besoin
→ Tableau de bord
→ Liste des EB
→ Nouvelle EB
→ Détail EB
→ Modification
→ Soumission
→ Validation
→ Retour
→ Rejet
→ Pièces justificatives
→ Historique
→ Workflow**

Cette cartographie doit permettre de s’assurer qu’aucune interface significative n’est oubliée.

# 3. COMPARER AVEC LA MAQUETTE ACTUELLE

Pour chaque interface récupérée depuis un lien :

* rechercher l’écran équivalent dans la maquette actuelle ;
* comparer les deux versions ;
* identifier les fonctionnalités absentes de la maquette ;
* identifier les informations supplémentaires ;
* identifier les champs manquants ;
* identifier les actions manquantes ;
* identifier les composants métier importants ;
* identifier les éventuels doublons ;
* identifier les incohérences UX/UI.

Ne crée pas inutilement une nouvelle page lorsqu’un écran correspondant existe déjà.

Dans ce cas :

**analyse
→ consolidation
→ optimisation
→ remplacement de l’écran existant**

# 4. UTILISER LES LIENS COMME RÉFÉRENCE FONCTIONNELLE

Les interfaces accessibles via les liens doivent être considérées comme une **référence fonctionnelle importante**.

Elles doivent permettre de déterminer :

* données affichées ;
* champs ;
* tableaux ;
* colonnes ;
* filtres ;
* actions ;
* boutons ;
* workflows ;
* statuts ;
* documents ;
* informations financières ;
* contrôles ;
* interactions ;
* comportements métier.

Cependant, ne reproduis pas automatiquement leur apparence graphique.

# 5. CONSERVER LE STYLE ACTUEL DE BUDGET-CEEAC

La maquette actuelle constitue la **référence graphique officielle**.

Conserve notamment :

* palette de couleurs ;
* typographies ;
* sidebar ;
* topbar ;
* breadcrumbs ;
* grille ;
* système d’espacement ;
* cartes ;
* boutons ;
* tableaux ;
* formulaires ;
* badges ;
* iconographie ;
* bordures ;
* ombres ;
* rayons ;
* modales ;
* alertes ;
* navigation ;
* composants ;
* Design System existant.

Les interfaces récupérées depuis les différents liens doivent être **reconstruites selon ce même langage visuel**.

Le résultat final doit donner l’impression que toutes les interfaces ont été conçues dès l’origine dans le même Design System.

# 6. NE PAS COPIER LES ANCIENS DESIGNS

Lorsqu’une interface accessible via un lien possède un design :

* ancien ;
* trop technique ;
* peu ergonomique ;
* incohérent ;
* visuellement faible ;
* non conforme au style actuel ;

ne reproduis pas son apparence.

Conserve uniquement :

* ses informations ;
* ses fonctionnalités ;
* son workflow ;
* ses actions ;
* sa logique métier.

Puis reconstruis-la dans le style actuel de BUDGET-CEEAC.

# 7. OPTIMISER CHAQUE INTERFACE

Avant toute intégration, effectuer une analyse UX/UI.

Chercher notamment à améliorer :

* lisibilité ;
* hiérarchie de l’information ;
* regroupement des données ;
* navigation ;
* nombre de clics ;
* longueur des formulaires ;
* compréhension des statuts ;
* visibilité des actions principales ;
* visibilité de l’acteur attendu ;
* affichage des données financières ;
* lecture du workflow ;
* accès aux pièces justificatives ;
* compréhension globale du dossier.

L’objectif est d’obtenir une interface **plus efficace que l’interface source**, sans perdre aucune fonctionnalité importante.

# 8. PRÉSERVER LES BONNES INTERFACES EXISTANTES

Le remplacement ne signifie pas qu’il faut supprimer systématiquement tout ce qui existe déjà dans la maquette.

Lorsqu’un écran actuel comporte :

* une meilleure organisation ;
* un meilleur composant ;
* une meilleure visualisation ;
* une meilleure interaction ;
* une meilleure ergonomie ;

conserve ces éléments et enrichis-les avec les fonctionnalités récupérées depuis les liens.

La nouvelle version doit donc être une fusion intelligente entre :

**fonctionnalités réelles issues des liens
+
qualité graphique et UX de la maquette actuelle**

# 9. REMPLACER LES ÉCRANS CORRESPONDANTS

Lorsqu’un écran issu d’un lien correspond directement à un écran de la maquette actuelle :

1. analyser les deux versions ;
2. inventorier leurs différences ;
3. conserver les meilleures fonctionnalités ;
4. harmoniser les données ;
5. optimiser l’ergonomie ;
6. reconstruire l’écran ;
7. remplacer l’ancienne version.

Ne conserve pas plusieurs variantes concurrentes d’un même écran lorsque cela n’a pas de justification fonctionnelle.

# 10. HARMONISER LES TABLEAUX

Tous les tableaux intégrés doivent respecter le standard BUDGET-CEEAC.

Prévoir selon les besoins :

* recherche ;
* filtres simples ;
* filtres avancés ;
* tri ;
* pagination ;
* colonnes configurables ;
* export ;
* badges de statut ;
* actions rapides ;
* ouverture de la fiche ;
* sélection multiple ;
* vues enregistrées.

Uniformiser les statuts et les comportements dans tous les modules.

# 11. HARMONISER LES FORMULAIRES

Pour les formulaires récupérés depuis les liens :

* regrouper les champs de manière logique ;
* supprimer les répétitions inutiles ;
* préremplir les informations connues ;
* conserver les données héritées en lecture seule ;
* utiliser des steppers lorsque le formulaire est complexe ;
* afficher les contrôles en temps réel ;
* signaler clairement les erreurs ;
* gérer les champs conditionnels ;
* afficher la progression ;
* permettre l’enregistrement en brouillon lorsque nécessaire.

# 12. HARMONISER LES FICHES MÉTIER

Les fiches détaillées doivent suivre une structure commune.

Prévoir notamment :

## En-tête

* référence ;
* statut ;
* montant ;
* exercice ;
* structure ;
* acteur attendu.

## Synthèse

* informations principales ;
* informations budgétaires ;
* informations programmatiques ;
* indicateurs importants.

## Contenu

* détails métier ;
* imputations ;
* documents ;
* observations.

## Workflow

* validations ;
* retours ;
* rejets ;
* signatures ;
* historique.

## Actions

Afficher uniquement les actions autorisées pour le profil concerné.

# 13. STANDARDISER LES WORKFLOWS

Lorsque les différents modules utilisent des représentations différentes du workflow, harmonise-les avec le composant standard BUDGET-CEEAC.

Afficher notamment :

* étape actuelle ;
* étapes terminées ;
* acteur ;
* date ;
* heure ;
* commentaire ;
* validation ;
* retour ;
* rejet ;
* prochain acteur ;
* délai.

# 14. CONSERVER LA NAVIGATION ACTUELLE

L’intégration des nouvelles interfaces ne doit pas casser la structure de navigation existante.

Conserver :

* sidebar ;
* menus ;
* sous-menus ;
* topbar ;
* breadcrumbs ;
* recherche globale ;
* notifications ;
* Mes tâches ;
* navigation inter-modules.

Si les applications accessibles via les liens utilisent d’autres menus, adapte leur contenu à l’architecture actuelle de BUDGET-CEEAC.

# 15. CRÉER DES COMPOSANTS RÉUTILISABLES

Lorsque plusieurs interfaces utilisent les mêmes éléments, créer des composants Figma réutilisables.

Exemples :

* bandeau de suivi ;
* statut ;
* résumé financier ;
* ligne budgétaire ;
* section PAP ;
* timeline ;
* pièces jointes ;
* observations ;
* validations ;
* bénéficiaire ;
* historique ;
* cartes KPI ;
* alertes.

Utiliser :

* Components ;
* Variants ;
* Auto Layout ;
* propriétés configurables.

# 16. GÉRER LES DIFFÉRENTS ÉTATS

Lorsque les interfaces accessibles via les liens montrent plusieurs états fonctionnels, les intégrer dans la maquette.

Exemples :

* brouillon ;
* soumis ;
* en traitement ;
* en validation ;
* retourné ;
* rejeté ;
* validé ;
* signé ;
* exécuté ;
* clôturé.

Éviter les duplications inutiles en utilisant les Variants lorsque cela est possible.

# 17. PRÉSERVER LA COHÉRENCE ENTRE MODULES

À la fin du travail, tous les modules doivent sembler appartenir à une seule application.

Vérifier notamment :

* mêmes couleurs de statuts ;
* mêmes boutons ;
* mêmes formulaires ;
* mêmes tables ;
* mêmes filtres ;
* mêmes timelines ;
* mêmes alertes ;
* mêmes principes d’espacement ;
* mêmes conventions de navigation ;
* mêmes règles d’interaction.

# 18. MÉTHODE DE TRAITEMENT OBLIGATOIRE

Traiter chaque lien indépendamment selon la séquence suivante :

**1. Ouvrir le lien
2. Identifier le module
3. Explorer toutes les interfaces
4. Inventorier les pages et états
5. Identifier les fonctionnalités
6. Comparer avec la maquette actuelle
7. Identifier les écarts
8. Conserver les meilleures fonctionnalités
9. Optimiser UX/UI
10. Reconstruire dans le Design System actuel
11. Remplacer l’interface correspondante
12. Reconnecter le prototype
13. Vérifier le résultat
14. Passer au lien suivant**

Ne mélange pas plusieurs modules avant d’avoir correctement analysé chacun d’eux.

# 19. NE PAS INVENTER DES INTERFACES INUTILES

Lorsque le lien ne montre pas une fonctionnalité particulière et que la maquette actuelle n’en dispose pas non plus, ne crée pas arbitrairement des écrans sans justification.

L’objectif principal est de **consolider ce qui existe réellement**.

# 20. CONTRÔLE FINAL GLOBAL

Après intégration de tous les liens, réaliser un audit complet de la maquette.

Vérifier :

* que tous les liens ont été parcourus ;
* que tous les modules ont été traités ;
* qu’aucun écran significatif n’a été oublié ;
* qu’aucune fonctionnalité importante n’a disparu ;
* qu’aucun doublon inutile ne subsiste ;
* que le Design System est respecté ;
* que la navigation fonctionne ;
* que les workflows sont cohérents ;
* que les composants sont réutilisables ;
* que les interactions du prototype fonctionnent.

# 21. RÉSULTAT FINAL ATTENDU

À l’issue du travail, la maquette actuelle de **BUDGET-CEEAC** doit intégrer les meilleures interfaces fonctionnelles récupérées depuis les différents liens tout en conservant intégralement son identité graphique actuelle.

Le résultat doit correspondre à :

**Interfaces réelles accessibles via les liens
+
fonctionnalités existantes de la maquette
+
Design System actuel
+
optimisation UI/UX
==================

Nouvelle maquette BUDGET-CEEAC consolidée**

Il ne doit pas s’agir d’une juxtaposition d’interfaces provenant de plusieurs applications.

Le résultat doit apparaître comme **une seule plateforme homogène, moderne, professionnelle, institutionnelle et parfaitement cohérente**.

Cette nouvelle version doit devenir le **référentiel UI/UX de référence de BUDGET-CEEAC**, exploitable directement par les développeurs pour l’implémentation fidèle des différents modules.
