Analyse en profondeur le **fichier joint contenant la description fonctionnelle détaillée du module “Import, Export et Interopérabilité” de BUDGET-CEEAC**, puis conçois et implémente intégralement ce module dans la maquette Figma actuelle de l’application.

L’objectif n’est pas simplement de créer quelques écrans illustratifs. Il faut transformer toutes les exigences fonctionnelles décrites dans le document joint en une **expérience UI/UX complète, cohérente, interactive et exploitable par les futurs développeurs de BUDGET-CEEAC**.

Le nouveau module doit être pleinement intégré à l’architecture existante de BUDGET-CEEAC et respecter strictement :

- le Design System actuel ;
- la sidebar existante ;
- la topbar ;
- les breadcrumbs ;
- les composants déjà utilisés ;
- les règles d’espacement ;
- les styles de tableaux ;
- les styles des formulaires ;
- les badges de statut ;
- les composants de workflow ;
- les principes graphiques et ergonomiques actuellement retenus.

Ne crée pas une application parallèle.

Le module doit apparaître comme une **composante native de BUDGET-CEEAC**.

# 1. ANALYSER LE DOCUMENT AVANT DE CONCEVOIR

Commence par parcourir l’intégralité du fichier joint.

Identifie systématiquement :

- objectifs du module ;
- acteurs ;
- cas d’utilisation ;
- données ;
- règles métier ;
- workflows ;
- statuts ;
- contrôles ;
- imports ;
- exports ;
- mappings ;
- API ;
- systèmes externes ;
- synchronisations ;
- événements ;
- notifications ;
- erreurs ;
- journaux ;
- audit ;
- supervision ;
- sécurité ;
- GED ;
- reporting ;
- règles d’habilitation ;
- exigences techniques ayant un impact sur l’interface.

Ne simplifie pas arbitrairement le contenu du document.

Chaque fonctionnalité importante décrite dans le fichier doit avoir une représentation claire dans l’interface lorsque cela est pertinent.

# 2. POSITIONNER LE MODULE DANS BUDGET-CEEAC

Intègre un nouveau menu principal :

**Import, Export & Interopérabilité**

dans la navigation actuelle de BUDGET-CEEAC.

Prévoir les sous-menus suivants :

- Tableau de bord ;
- Imports ;
- Nouvel import ;
- Exports ;
- Modèles d’import ;
- Mappings ;
- API ;
- Intégrations ;
- Synchronisations ;
- Événements ;
- Supervision ;
- Journal des échanges ;
- Incidents ;
- Paramétrage.

Adapter cette organisation si la maquette actuelle possède déjà une architecture plus cohérente.

# 3. CRÉER LE TABLEAU DE BORD DU MODULE

Créer une page :

**Import, Export & Interopérabilité — Tableau de bord**

Elle doit donner une vision synthétique des échanges de données de BUDGET-CEEAC.

Créer des cartes KPI pour notamment :

- imports aujourd’hui ;
- imports réussis ;
- imports en erreur ;
- imports en attente ;
- exports générés ;
- exports en traitement ;
- intégrations actives ;
- intégrations indisponibles ;
- synchronisations réussies ;
- synchronisations en échec ;
- appels API ;
- taux de succès des échanges.

Créer également des zones permettant de visualiser :

- derniers imports ;
- derniers exports ;
- derniers flux ;
- intégrations en anomalie ;
- erreurs critiques ;
- synchronisations récentes ;
- incidents ouverts ;
- volume de données traité ;
- latence des principales intégrations.

Toutes les cartes importantes doivent permettre un drill-down.

# 4. CRÉER LA PAGE “IMPORTS”

Créer une liste complète des imports.

Colonnes recommandées :

- Référence ;
- Type ;
- Module cible ;
- Fichier ;
- Utilisateur ;
- Date ;
- Nombre de lignes ;
- Lignes valides ;
- Erreurs ;
- Avertissements ;
- Statut ;
- Durée ;
- Actions.

Prévoir :

- recherche ;
- filtres ;
- tri ;
- pagination ;
- export de la liste ;
- sélection par statut ;
- accès direct au détail.

Statuts à représenter notamment :

- Brouillon ;
- Fichier chargé ;
- Analyse ;
- Erreurs détectées ;
- À corriger ;
- Prêt ;
- En validation ;
- Validé ;
- Import en cours ;
- Importé ;
- Importé avec avertissements ;
- Échec ;
- Annulé.

# 5. CRÉER LE PARCOURS COMPLET “NOUVEL IMPORT”

Construire un assistant multi-étapes extrêmement clair.

Utiliser un stepper visible.

Prévoir les étapes :

### Étape 1 — Type d’import

Permettre de choisir par exemple :

- Budget ;
- PAP ;
- lignes budgétaires ;
- référentiels ;
- indicateurs ;
- tiers ;
- fournisseurs ;
- bénéficiaires ;
- contrats ;
- données S&E ;
- relevés bancaires ;
- autres types paramétrables.

Afficher pour chaque type :

- description ;
- format attendu ;
- modèle disponible ;
- taille maximale ;
- règles spécifiques.

### Étape 2 — Chargement du fichier

Créer une zone de drag-and-drop professionnelle.

Afficher :

- nom ;
- format ;
- taille ;
- date ;
- checksum éventuel ;
- contrôle antivirus ;
- statut.

Formats potentiels :

- XLSX ;
- CSV ;
- JSON ;
- XML.

### Étape 3 — Analyse du fichier

Afficher :

- nombre de lignes ;
- colonnes détectées ;
- feuilles ;
- types détectés ;
- problèmes de format ;
- doublons ;
- cellules vides ;
- erreurs structurelles.

### Étape 4 — Mapping

Créer une interface particulièrement soignée permettant d’associer :

**Champ du fichier → Champ BUDGET-CEEAC**

Utiliser une représentation visuelle en deux colonnes.

Exemple :

**CODE_LIGNE → Code de la ligne budgétaire**

Afficher pour chaque mapping :

- reconnu automatiquement ;
- à confirmer ;
- obligatoire ;
- facultatif ;
- ignoré ;
- incompatible.

Permettre :

- auto-mapping ;
- modification manuelle ;
- sauvegarde du mapping ;
- réutilisation d’un modèle.

### Étape 5 — Contrôles

Afficher les contrôles techniques et métier.

Exemples :

- champ obligatoire absent ;
- ligne budgétaire inconnue ;
- code dupliqué ;
- exercice fermé ;
- structure inexistante ;
- montant incorrect ;
- relation PAP incohérente ;
- source de financement inexistante.

Séparer visuellement :

- erreurs bloquantes ;
- avertissements ;
- informations.

### Étape 6 — Simulation

Afficher une synthèse :

- total de lignes ;
- lignes valides ;
- lignes rejetées ;
- lignes avec avertissements ;
- créations prévues ;
- mises à jour prévues ;
- doublons ;
- éléments ignorés.

Aucune donnée réelle ne doit encore être modifiée.

### Étape 7 — Prévisualisation

Afficher les données qui seront intégrées.

Prévoir un tableau avec codes couleurs et filtres.

### Étape 8 — Validation

Afficher un écran récapitulatif.

Afficher clairement :

- type ;
- exercice ;
- source ;
- fichier ;
- utilisateur ;
- modèle ;
- nombre d’enregistrements ;
- erreurs ;
- avertissements ;
- impact estimé.

Boutons possibles selon habilitation :

- Retour ;
- Enregistrer ;
- Soumettre à validation ;
- Valider l’import ;
- Annuler.

### Étape 9 — Exécution

Créer un écran de progression.

Afficher :

- progression ;
- pourcentage ;
- lignes traitées ;
- lignes restantes ;
- durée ;
- statut.

### Étape 10 — Résultat

Afficher :

- réussite ;
- réussite partielle ;
- échec ;
- nombre de créations ;
- mises à jour ;
- rejets ;
- avertissements ;
- durée ;
- accès au rapport détaillé.

# 6. CRÉER LE RAPPORT D’ERREURS

Créer une interface dédiée.

Tableau :

| Ligne | Colonne | Valeur | Niveau | Erreur | Correction |

Créer des filtres :

- Erreurs ;
- Avertissements ;
- Informations.

Permettre :

- télécharger le rapport ;
- exporter Excel ;
- exporter CSV ;
- revenir au mapping ;
- remplacer le fichier ;
- relancer la simulation.

Utiliser des messages métier compréhensibles.

Ne jamais afficher directement à l’utilisateur métier des erreurs techniques comme :

`SQLSTATE 23505`

Transformer cela en message métier explicite.

# 7. CRÉER LA FICHE DÉTAILLÉE D’UN IMPORT

Créer une page de détail contenant plusieurs onglets :

### Synthèse

Afficher :

- référence ;
- type ;
- module ;
- fichier ;
- statut ;
- utilisateur ;
- date ;
- durée ;
- nombre de lignes.

### Données

Afficher :

- données lues ;
- données importées ;
- données rejetées.

### Mapping

Afficher le mapping utilisé.

### Erreurs

Afficher les anomalies.

### Fichier source

Donner accès au fichier archivé.

### Historique

Afficher la timeline complète.

### Audit

Afficher les actions sensibles.

# 8. CRÉER LA GESTION DES MODÈLES D’IMPORT

Créer une liste des modèles.

Afficher :

- code ;
- nom ;
- module ;
- format ;
- version ;
- statut ;
- date de modification ;
- propriétaire.

Créer la fiche modèle permettant de configurer :

- colonnes attendues ;
- champs obligatoires ;
- types ;
- valeurs par défaut ;
- règles ;
- mapping ;
- validations ;
- transformations.

Prévoir :

- créer ;
- dupliquer ;
- versionner ;
- activer ;
- désactiver ;
- tester.

# 9. CRÉER LE MODULE EXPORT

Créer une page :

**Nouvel export**

Permettre de sélectionner :

- module ;
- type de données ;
- exercice ;
- période ;
- structure ;
- statut ;
- filtres ;
- format.

Formats :

- XLSX ;
- CSV ;
- PDF ;
- JSON ;
- XML.

Prévoir :

- aperçu ;
- estimation du nombre de lignes ;
- confidentialité ;
- génération ;
- téléchargement.

# 10. CRÉER L’HISTORIQUE DES EXPORTS

Afficher :

- référence ;
- type ;
- utilisateur ;
- date ;
- format ;
- volume ;
- filtre utilisé ;
- statut ;
- durée ;
- téléchargement.

Prévoir des statuts tels que :

- demandé ;
- en attente ;
- en génération ;
- disponible ;
- expiré ;
- erreur.

# 11. CRÉER LES EXPORTS PROGRAMMÉS

Créer une interface permettant de programmer un export.

Champs :

- rapport ;
- périodicité ;
- date ;
- heure ;
- filtres ;
- format ;
- destinataire ;
- durée de conservation.

Périodicités :

- quotidienne ;
- hebdomadaire ;
- mensuelle ;
- trimestrielle ;
- annuelle.

# 12. CRÉER LA PAGE “API”

Créer une console de gestion des API.

Afficher les API sous forme de catalogue.

Exemples :

- Budgets ;
- lignes budgétaires ;
- PAP ;
- Expressions de Besoin ;
- Engagements ;
- Liquidations ;
- Ordonnancements ;
- Paiements ;
- indicateurs ;
- tiers.

Pour chaque API afficher :

- endpoint ;
- version ;
- méthode ;
- statut ;
- authentification ;
- dernière utilisation ;
- consommation ;
- disponibilité.

Créer une fiche détaillée permettant d’afficher :

- description ;
- méthode ;
- paramètres ;
- payload ;
- réponse ;
- permissions ;
- erreurs ;
- exemples.

# 13. CRÉER LA GESTION DES CLIENTS API

Créer une page permettant d’administrer les applications autorisées.

Afficher :

- application ;
- client ID ;
- environnement ;
- propriétaire ;
- scopes ;
- date d’expiration ;
- statut ;
- dernière utilisation.

Ne jamais afficher les secrets en clair.

# 14. CRÉER LA PAGE “INTÉGRATIONS”

Créer une vue catalogue des systèmes connectés.

Exemples :

- SIRH ;
- Paie ;
- Comptabilité ;
- Banque ;
- Power BI ;
- GED ;
- système partenaire.

Présenter chaque intégration avec :

- système ;
- type ;
- sens ;
- protocole ;
- fréquence ;
- dernière synchronisation ;
- statut ;
- disponibilité.

Utiliser des états visuels :

- Opérationnel ;
- Dégradé ;
- En erreur ;
- Désactivé ;
- Maintenance.

# 15. CRÉER LA FICHE D’UNE INTÉGRATION

Créer plusieurs onglets :

### Général

- système ;
- propriétaire ;
- environnement ;
- URL ;
- protocole ;
- fréquence ;
- statut.

### Authentification

- méthode ;
- certificat ;
- OAuth ;
- token ;
- expiration.

Masquer les secrets.

### Mapping

Afficher les correspondances de données.

### Synchronisation

Afficher les dernières opérations.

### Monitoring

Afficher :

- disponibilité ;
- latence ;
- taux de succès ;
- erreurs.

### Journal

Afficher tous les échanges.

### Paramètres

Permettre de gérer :

- timeout ;
- retry ;
- limite ;
- fréquence.

# 16. CRÉER LA PAGE “SYNCHRONISATIONS”

Afficher :

- source ;
- cible ;
- objet ;
- direction ;
- fréquence ;
- dernière exécution ;
- résultat ;
- prochain passage.

Permettre :

- lancer manuellement ;
- suspendre ;
- reprendre ;
- consulter les erreurs ;
- rejouer une opération.

# 17. VISUALISER LES SOURCES MAÎTRES

Créer une interface spécifique **Référentiels maîtres / Master Data**.

Exemple :

| Donnée | Source maître | Systèmes consommateurs |

Afficher notamment :

- Agents → SIRH ;
- structures → Référentiel organisationnel ;
- Budget → BUDGET-CEEAC ;
- lignes budgétaires → BUDGET-CEEAC ;
- Paiements → BUDGET-CEEAC / Agence Comptable ;
- fournisseurs → Référentiel tiers.

Permettre de visualiser les dépendances entre systèmes.

# 18. CRÉER UNE CARTOGRAPHIE D’INTEROPÉRABILITÉ

Créer une page très visuelle représentant :

**SIRH  
↔  
BUDGET-CEEAC  
↔  
Paie  
↔  
Comptabilité  
↔  
Banques  
↔  
Power BI  
↔  
Partenaires**

BUDGET-CEEAC doit être placé au centre.

Afficher les flux entrants et sortants.

Permettre de cliquer sur un flux pour ouvrir son détail.

# 19. CRÉER LA PAGE “ÉVÉNEMENTS”

Afficher le catalogue des événements métier.

Exemples :

- BudgetApproved ;
- EBApproved ;
- EngagementValidated ;
- LiquidationValidated ;
- OrdonnancementSigned ;
- PaymentExecuted ;
- IndicatorValidated.

Afficher :

- nom ;
- domaine ;
- producteur ;
- consommateurs ;
- version ;
- statut.

# 20. CRÉER LA SUPERVISION DES FLUX

Créer une console de monitoring.

KPI :

- disponibilité globale ;
- taux de succès ;
- latence moyenne ;
- flux traités ;
- flux en erreur ;
- retries ;
- messages en attente ;
- messages en Dead Letter Queue.

Créer des graphiques :

- succès/échecs par heure ;
- volume par système ;
- latence ;
- erreurs par type ;
- évolution des incidents.

# 21. CRÉER LE JOURNAL DES ÉCHANGES

Afficher :

- timestamp ;
- source ;
- cible ;
- interface ;
- référence ;
- opération ;
- volume ;
- durée ;
- statut.

Filtres :

- système ;
- période ;
- résultat ;
- interface ;
- type ;
- référence.

Permettre d’ouvrir le détail.

# 22. CRÉER LE DÉTAIL D’UN ÉCHANGE

Afficher :

- ID ;
- corrélation ;
- source ;
- cible ;
- heure départ ;
- heure fin ;
- durée ;
- statut ;
- requête ;
- réponse ;
- erreur ;
- retry ;
- trace.

Les données sensibles doivent être masquées.

# 23. GÉRER LES ERREURS ET RETRIES

Créer une interface :

**Flux en erreur**

Afficher :

- intégration ;
- opération ;
- erreur ;
- date ;
- nombre de tentatives ;
- prochaine tentative ;
- statut.

Actions :

- Voir ;
- Rejouer ;
- Suspendre ;
- Marquer traité ;
- Ouvrir incident.

# 24. DEAD LETTER QUEUE

Créer un écran d’administration spécifique.

Afficher :

- message ;
- intégration ;
- événement ;
- erreur ;
- nombre de tentatives ;
- première erreur ;
- dernière erreur.

Actions réservées aux administrateurs :

- rejouer ;
- corriger ;
- archiver.

# 25. INTÉGRATION AVEC LA COMPTABILITÉ

Prévoir des maquettes illustrant les échanges :

**BUDGET-CEEAC → Comptabilité**

notamment :

- paiements ;
- comptes ;
- tiers ;
- références ;
- écritures ;
- taxes ;
- retenues.

Afficher l’état de synchronisation.

# 26. INTÉGRATION AVEC LE SIRH

Prévoir une interface de synchronisation :

**SIRH → BUDGET-CEEAC**

pour :

- agents ;
- matricules ;
- fonctions ;
- directions ;
- services ;
- responsables ;
- affectations.

# 27. INTÉGRATION AVEC LA PAIE

Prévoir un flux permettant de représenter :

- masse salariale ;
- imputations ;
- charges ;
- paiements ;
- écritures.

# 28. INTÉGRATION BANCAIRE

Créer une vue particulièrement sécurisée permettant de suivre :

- ordres transmis ;
- lots ;
- statuts ;
- confirmations ;
- rejets ;
- relevés ;
- rapprochements.

Afficher :

**BUDGET-CEEAC  
→ Banque  
→ Confirmation  
→ Rapprochement**

# 29. IMPORT DES RELEVÉS BANCAIRES

Créer un parcours spécialisé :

**Compte  
→ Fichier bancaire  
→ Analyse  
→ Mouvements  
→ Correspondances  
→ Anomalies  
→ Rapprochement**

# 30. GED

Tous les fichiers liés aux échanges doivent pouvoir être associés à la GED.

Afficher notamment :

- fichier source ;
- rapport d’erreurs ;
- rapport de simulation ;
- fichier exporté ;
- preuve d’échange ;
- version ;
- hash.

# 31. AUDIT

Créer une timeline d’audit permettant de visualiser :

- utilisateur ;
- action ;
- rôle ;
- date ;
- heure ;
- ancienne valeur ;
- nouvelle valeur ;
- justification ;
- source.

# 32. HABILITATIONS

Intégrer une matrice permettant de distinguer les responsabilités :

- Préparateur ;
- Contrôleur ;
- Validateur ;
- Administrateur ;
- Administrateur technique ;
- Auditeur.

Certaines opérations doivent nécessiter une validation distincte.

# 33. BANDEAU DE CONTEXTE

Sur chaque page métier importante, afficher un bandeau permettant de comprendre :

- état ;
- dernière opération ;
- utilisateur ;
- date ;
- prochaine action ;
- éventuel acteur attendu ;
- anomalie éventuelle.

# 34. NOTIFICATIONS

Intégrer les notifications :

- import terminé ;
- import en erreur ;
- fichier invalide ;
- export prêt ;
- export échoué ;
- synchronisation échouée ;
- API indisponible ;
- incident d’intégration ;
- retry épuisé ;
- DLQ non vide.

# 35. DESIGN ET UX

Le module doit rester fidèle au style actuel de BUDGET-CEEAC.

Ne crée pas un design « DevOps » sombre et technique qui détonnerait avec l’application.

L’objectif est de produire une console :

**institutionnelle + financière + technique + facilement compréhensible.**

Les écrans destinés aux utilisateurs métier doivent rester simples.

Les informations techniques détaillées doivent être réservées :

- administrateurs ;
- DSI ;
- intégrateurs ;
- auditeurs habilités.

# 36. UTILISER LA DIVULGATION PROGRESSIVE

Ne montre pas toutes les informations techniques immédiatement.

Exemple :

### Vue synthétique
- opération ;
- système ;
- statut ;
- heure.

Puis :

**Voir détails techniques**

pour accéder à :

- payload ;
- headers ;
- corrélation ;
- traces ;
- retries.

# 37. COMPOSANTS À CRÉER

Créer notamment les composants réutilisables suivants :

- ImportStatusBadge ;
- ExportStatusBadge ;
- IntegrationStatusBadge ;
- FileDropzone ;
- MappingRow ;
- ImportStepper ;
- ValidationSummary ;
- ErrorTable ;
- SyncStatus ;
- APIEndpointCard ;
- IntegrationCard ;
- FlowStatus ;
- RetryBadge ;
- SystemConnector ;
- DataSourceBadge ;
- ExchangeTimeline ;
- MonitoringKPI ;
- ErrorSeverityBadge ;
- TechnicalDetailsDrawer.

Utiliser Auto Layout et Variants.

# 38. RESPONSIVE

Créer prioritairement la version Desktop 1440 px.

Prévoir également une adaptation :

- 1280 px ;
- tablette.

Les écrans techniques complexes peuvent rester optimisés principalement pour Desktop.

# 39. PROTOTYPE INTERACTIF

Créer au minimum les parcours Figma suivants :

### Parcours A — Import Budget

Nouvel import  
→ Budget  
→ Fichier  
→ Analyse  
→ Mapping  
→ Contrôles  
→ Simulation  
→ Validation  
→ Import  
→ Résultat.

### Parcours B — Import avec erreur

Fichier  
→ Analyse  
→ Erreurs  
→ Rapport  
→ Correction  
→ Nouvelle simulation.

### Parcours C — Export

Module  
→ Filtres  
→ Format  
→ Génération  
→ Notification  
→ Téléchargement.

### Parcours D — Supervision d’intégration

Dashboard  
→ Intégration en erreur  
→ Flux  
→ Erreur  
→ Retry  
→ Succès.

### Parcours E — Dead Letter Queue

Erreur répétée  
→ DLQ  
→ Analyse  
→ Correction  
→ Rejeu.

### Parcours F — API

Catalogue  
→ Endpoint  
→ Documentation  
→ Monitoring.

# 40. NE PAS CASSER L’EXISTANT

Avant toute modification :

1. analyser les écrans existants ;
2. identifier les composants réutilisables ;
3. conserver les meilleurs éléments ;
4. ajouter les nouveaux composants ;
5. harmoniser ;
6. éviter les duplications.

Le module doit s’insérer naturellement dans la maquette existante.

# 41. AUDIT FINAL

À la fin de l’implémentation, vérifier :

- toutes les fonctions importantes du document joint sont représentées ;
- les pages sont connectées ;
- les états sont cohérents ;
- les workflows sont représentés ;
- les imports sont complets ;
- les exports sont complets ;
- les intégrations sont administrables ;
- les flux sont supervisables ;
- les erreurs sont gérables ;
- les journaux sont disponibles ;
- les habilitations sont respectées ;
- le Design System est respecté ;
- aucun écran inutile n’a été créé ;
- aucune fonctionnalité importante du fichier n’a été oubliée.

# 42. RÉSULTAT ATTENDU

À l’issue du travail, BUDGET-CEEAC doit disposer d’un véritable module :

# IMPORT, EXPORT & INTEROPÉRABILITÉ

permettant visuellement et fonctionnellement de gérer :

**Fichiers externes  
→ Import  
→ Mapping  
→ Contrôles  
→ Validation  
→ BUDGET-CEEAC  
→ Export**

ainsi que :

**Systèmes externes  
↔ API / Événements / Synchronisation  
↔ BUDGET-CEEAC**

et :

**Échanges  
→ Supervision  
→ Détection d’erreurs  
→ Retry  
→ Réconciliation  
→ Audit**

Le module final doit constituer la **couche d’ouverture, d’échange, de synchronisation et d’intégration de BUDGET-CEEAC**, tout en restant totalement cohérent avec les modules Budget, PAP, chaîne de dépense, Suivi-Évaluation, Reporting, GED, Audit et Administration.

Le résultat doit être suffisamment complet, cohérent et détaillé pour devenir le **référentiel UI/UX officiel du module Import, Export et Interopérabilité**, directement exploitable par les développeurs Laravel/PostgreSQL pour son implémentation.