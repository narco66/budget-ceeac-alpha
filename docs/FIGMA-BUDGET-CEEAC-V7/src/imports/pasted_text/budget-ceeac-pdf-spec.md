### OBJECTIF

Dans le projet **BUDGET-CEEAC**, chaque étape de la chaîne de dépense doit produire automatiquement les documents PDF correspondant à son processus, conformément aux procédures fonctionnelles et aux descriptions détaillées déjà définies dans le projet.

Je veux que tu réalises une **analyse complète du projet existant**, puis que tu conçoives et intègres l’ensemble des documents PDF nécessaires.

### 1. ANALYSER LE PROJET EXISTANT

Parcours l'intégralité du projet **BUDGET-CEEAC** et identifie :

* les différents modules ;
* les étapes de la chaîne de dépense ;
* les workflows et statuts ;
* les formulaires ;
* les validations ;
* les documents générés à chaque étape ;
* les rapports existants ;
* les tableaux de bord et états nécessitant une édition PDF.

Ne supprime aucune fonctionnalité existante sans justification.

### 2. MODÈLE PDF DE RÉFÉRENCE

Le **PDF joint à ce prompt constitue le modèle graphique et documentaire de référence**.

Analyse attentivement sa structure :

* format et dimensions ;
* en-tête ;
* logo et identité visuelle ;
* couleurs ;
* typographies ;
* marges ;
* tableaux ;
* bordures ;
* titres et sous-titres ;
* numérotation ;
* pied de page ;
* zones de signatures ;
* références administratives ;
* présentation des informations ;
* pagination ;
* hiérarchie visuelle.

Utilise ce modèle comme **référence de conception**, tout en l'améliorant lorsque cela permet d'obtenir un rendu plus professionnel, institutionnel, lisible et cohérent avec BUDGET-CEEAC.

### 3. IDENTIFIER TOUS LES PDF À PRODUIRE

À partir des procédures et descriptions fonctionnelles du projet, établis la liste exhaustive des documents PDF requis.

Couvre notamment les étapes :

1. **Expression de Besoin**
2. **Engagement**
3. **Liquidation**
4. **Ordonnancement**
5. **Paiement**
6. **Suivi-Évaluation**
7. **Budget**
8. **PAP**
9. **Reporting**
10. **États et rapports de synthèse**

Pour chaque étape, détermine précisément :

* le document à générer ;
* son objectif ;
* le moment de sa génération ;
* les données à afficher ;
* les références du dossier ;
* les informations budgétaires ;
* les informations relatives aux acteurs ;
* les validations ;
* les signatures ;
* les pièces justificatives ;
* le statut du document ;
* la date et l'heure de génération ;
* le numéro ou identifiant du document.

### 4. DOCUMENTS DE LA CHAÎNE DE DÉPENSE

Prévoir notamment les éditions correspondant aux processus suivants :

#### EXPRESSION DE BESOIN

Créer le PDF officiel de l'Expression de Besoin avec notamment :

* référence de l'EB ;
* exercice budgétaire ;
* nature du besoin ;
* classification PAP / Hors PAP ;
* ligne budgétaire ;
* imputation budgétaire ;
* description détaillée ;
* montant ;
* service demandeur ;
* responsable ;
* bénéficiaire/fournisseur lorsque pertinent ;
* pièces jointes ;
* circuit de validation ;
* historique des validations ;
* signatures.

#### ENGAGEMENT

Prévoir notamment :

* Fiche d'Engagement ;
* références de l'EB ;
* ligne(s) budgétaire(s) concernée(s) ;
* montant engagé ;
* fournisseur/bénéficiaire ;
* objet ;
* imputations ;
* contrôles ;
* visas ;
* validations ;
* signatures des autorités compétentes.

#### LIQUIDATION

Prévoir le document de liquidation avec :

* référence de l'engagement ;
* montant engagé ;
* montant liquidé ;
* pièces justificatives ;
* contrôle du service fait ;
* retenues éventuelles ;
* montant net ;
* validations ;
* signatures.

#### ORDONNANCEMENT

Prévoir l'état ou document d'ordonnancement avec :

* référence de la liquidation ;
* créancier/bénéficiaire ;
* montant ;
* imputations ;
* références comptables ;
* ordonnateur ;
* validations ;
* signature ;
* date d'ordonnancement.

#### PAIEMENT

Prévoir le document ou état de paiement avec :

* référence de l'ordonnancement ;
* bénéficiaire ;
* montant payé ;
* mode de paiement ;
* références bancaires lorsque nécessaires ;
* date ;
* statut du paiement ;
* validations ;
* signatures.

### 5. RAPPORTS ET ÉTATS

Tous les rapports disponibles dans **BUDGET-CEEAC** doivent également disposer d'une **version PDF professionnelle**.

Prévoir notamment :

* rapports budgétaires ;
* rapports d'exécution ;
* rapports PAP ;
* rapports de suivi des engagements ;
* rapports de liquidation ;
* rapports d'ordonnancement ;
* rapports de paiement ;
* rapports de consommation budgétaire ;
* rapports par ligne budgétaire ;
* rapports par structure/service ;
* rapports par nature de dépense ;
* rapports par période ;
* rapports de suivi-évaluation ;
* états statistiques ;
* tableaux de synthèse ;
* rapports consolidés.

Chaque rapport doit permettre une édition PDF à partir des filtres sélectionnés par l'utilisateur.

### 6. CONCEPTION UI/UX DES ÉCRANS PDF

Dans la maquette Figma, concevoir les interfaces permettant :

* d'apercevoir le document avant génération ;
* de générer le PDF ;
* d'imprimer ;
* de télécharger ;
* de partager lorsque cette fonctionnalité est prévue ;
* de consulter les versions précédentes ;
* d'accéder à l'historique des documents générés.

Créer des boutons et actions clairement identifiés :

**Aperçu PDF → Générer PDF → Télécharger → Imprimer**

### 7. APERÇU DU DOCUMENT

Créer pour chaque document une interface **Aperçu avant impression** reproduisant fidèlement le rendu final du PDF.

L'aperçu doit permettre de vérifier :

* la mise en page ;
* les données ;
* les signatures ;
* les totaux ;
* les références ;
* les pièces justificatives ;
* la pagination.

### 8. COHÉRENCE DOCUMENTAIRE

Tous les PDF doivent utiliser une **charte documentaire commune BUDGET-CEEAC**.

Garantir :

* une identité visuelle uniforme ;
* une nomenclature cohérente ;
* des références documentaires normalisées ;
* une numérotation homogène ;
* des en-têtes et pieds de page cohérents ;
* une présentation uniforme des signatures ;
* une pagination standardisée ;
* une traçabilité complète.

### 9. SIGNATURES ET VALIDATIONS

Lorsque le workflow prévoit une validation ou une signature, représenter clairement dans le PDF :

* nom et prénom ;
* fonction ;
* niveau de validation ;
* date ;
* heure lorsque nécessaire ;
* statut ;
* signature manuscrite ou électronique selon le workflow ;
* éventuellement QR Code ou mécanisme de vérification si prévu par l'application.

Ne jamais afficher une signature comme valide lorsqu'elle n'a pas réellement été effectuée.

### 10. PIÈCES JUSTIFICATIVES

Prévoir la gestion documentaire associée aux PDF :

* pièces jointes ;
* justificatifs ;
* annexes ;
* documents complémentaires.

Lorsque cela est pertinent, le PDF principal doit pouvoir référencer les pièces justificatives associées.

### 11. CONTRAINTES IMPORTANTES

Ne crée pas simplement quelques exemples de PDF.

Je veux une **couverture exhaustive de tous les documents générés par BUDGET-CEEAC**.

Avant de concevoir les interfaces :

1. analyse les fonctionnalités existantes ;
2. analyse les procédures détaillées ;
3. identifie tous les documents nécessaires ;
4. élimine les doublons ;
5. harmonise les noms des documents ;
6. vérifie la cohérence avec les workflows ;
7. puis conçois les interfaces correspondantes.

### 12. INTÉGRATION DANS LA MAQUETTE EXISTANTE

Conserve le **style visuel actuel de la maquette BUDGET-CEEAC**.

N'effectue pas une refonte graphique arbitraire.

Les nouveaux écrans doivent s'intégrer naturellement au Design System existant :

* couleurs ;
* composants ;
* boutons ;
* cartes ;
* tableaux ;
* typographie ;
* icônes ;
* navigation ;
* espacements.

Améliore uniquement les éléments qui nécessitent une optimisation UX/UI.

### 13. LIVRABLE ATTENDU

À la fin de l'analyse, la maquette Figma doit contenir :

* tous les écrans de génération PDF ;
* tous les écrans d'aperçu PDF ;
* tous les modèles de documents de la chaîne de dépense ;
* tous les modèles de rapports ;
* les états budgétaires ;
* les états PAP ;
* les documents de synthèse ;
* les interactions de génération et de téléchargement ;
* les différents états du document : brouillon, généré, validé, signé, annulé, archivé ;
* une organisation claire des composants et écrans.

**Objectif final :** obtenir dans Figma une représentation complète, professionnelle et cohérente de la **GED documentaire et du système d'édition PDF de BUDGET-CEEAC**, couvrant l'ensemble de la chaîne de dépense et du reporting, avec le PDF joint comme référence principale de mise en forme.
