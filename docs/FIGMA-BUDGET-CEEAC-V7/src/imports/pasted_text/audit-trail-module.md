### OBJECTIF

Intègre dans **BUDGET-CEEAC** un module complet de **Journal des événements / Audit Trail** permettant de **tracer, horodater et historiser toutes les actions réalisées dans l'application**.

Le journal doit constituer une fonctionnalité transverse de sécurité, de contrôle interne, de conformité et de traçabilité de l'ensemble de la chaîne de dépense.

---

### 1. CONCEPTION DU MODULE

Créer dans la navigation principale un module :

**JOURNAL DES ÉVÉNEMENTS**

Le module doit permettre aux utilisateurs autorisés de consulter l'historique complet des événements intervenus dans BUDGET-CEEAC.

Prévoir une interface professionnelle, claire et adaptée à une application institutionnelle de gestion budgétaire.

---

### 2. TRACER TOUTES LES ACTIONS

Le système doit journaliser automatiquement toutes les actions importantes réalisées dans l'application, notamment :

#### Authentification

* connexion ;
* déconnexion ;
* échec de connexion ;
* expiration de session ;
* changement de mot de passe ;
* réinitialisation du mot de passe ;
* activation/désactivation d'un compte.

#### Actions CRUD

Tracer :

* création ;
* consultation ;
* modification ;
* suppression ;
* restauration ;
* archivage ;
* duplication.

Ces événements doivent être applicables aux différents objets métier de l'application.

#### Workflow

Tracer notamment :

* soumission ;
* transmission ;
* validation ;
* rejet ;
* retour pour correction ;
* approbation ;
* visa ;
* signature ;
* annulation ;
* suspension ;
* reprise ;
* clôture.

---

### 3. COUVERTURE DE LA CHAÎNE DE DÉPENSE

Le journal doit notamment permettre de suivre intégralement :

**Expression de Besoin → Engagement → Liquidation → Ordonnancement → Paiement**

Mais également :

* Budget ;
* PAP ;
* Nomenclature budgétaire ;
* Suivi-Évaluation ;
* Reporting ;
* GED ;
* paramètres ;
* utilisateurs ;
* rôles et permissions.

Chaque changement d'état d'un dossier doit générer automatiquement un événement.

---

### 4. INFORMATIONS À ENREGISTRER

Chaque événement doit contenir au minimum :

* identifiant unique de l'événement ;
* date ;
* heure ;
* horodatage complet ;
* utilisateur ;
* identifiant utilisateur ;
* rôle/fonction de l'utilisateur ;
* service/direction ;
* type d'action ;
* module ;
* objet concerné ;
* référence de l'objet ;
* ancien statut ;
* nouveau statut ;
* ancienne valeur lorsque pertinent ;
* nouvelle valeur lorsque pertinent ;
* adresse IP ;
* navigateur/client ;
* appareil ou session lorsque disponible ;
* résultat de l'action ;
* commentaire/motif lorsque nécessaire.

L'horodatage doit être **fiable, uniforme et non ambigu**, avec date et heure précises.

---

### 5. PRÉSENTATION DU JOURNAL

Créer une page principale sous forme de tableau professionnel avec notamment :

| Date/Heure | Utilisateur | Module | Action | Objet | Référence | Résultat |
| ---------- | ----------- | ------ | ------ | ----- | --------- | -------- |

Utiliser des badges visuels pour distinguer rapidement :

* Création ;
* Modification ;
* Suppression ;
* Validation ;
* Rejet ;
* Signature ;
* Transmission ;
* Connexion ;
* Consultation ;
* Erreur ;
* Annulation.

---

### 6. FILTRES AVANCÉS

Permettre de filtrer les événements par :

* période ;
* date de début ;
* date de fin ;
* utilisateur ;
* rôle ;
* service/direction ;
* module ;
* type d'action ;
* objet ;
* référence ;
* statut ;
* résultat ;
* adresse IP.

Prévoir une recherche globale permettant de rechercher directement une référence de dossier, un utilisateur ou un événement.

Prévoir également :

**Réinitialiser les filtres**

et

**Exporter les résultats**

---

### 7. FICHE DÉTAILLÉE D'UN ÉVÉNEMENT

Lorsqu'un utilisateur sélectionne un événement, afficher un panneau ou une page de détail contenant :

**Informations générales**

* ID événement ;
* date ;
* heure ;
* utilisateur ;
* rôle ;
* service ;
* module ;
* action.

**Contexte**

* objet concerné ;
* référence ;
* statut avant ;
* statut après ;
* étape du workflow.

**Traçabilité technique**

* adresse IP ;
* session ;
* navigateur ;
* appareil ;
* informations techniques disponibles.

**Données modifiées**

Lorsque l'action est une modification, afficher clairement :

**Avant → Après**

Exemple :

> Montant : 5 000 000 XAF → 5 500 000 XAF

> Statut : Brouillon → Soumis

Mettre visuellement en évidence les champs ayant changé.

---

### 8. HISTORIQUE D'UN DOSSIER

Ajouter également une fonctionnalité permettant, depuis n'importe quel dossier de BUDGET-CEEAC, d'accéder à son historique.

Exemple :

**EB-2026-000125**

Afficher une timeline :

**09/09/2026 08:15 — Création**
Expert — Service X

↓

**09/09/2026 09:02 — Soumission**
Expert — Service X

↓

**09/09/2026 10:30 — Validation N**
Chef de Service

↓

**09/09/2026 14:10 — Validation N+1**
Directeur

↓

**10/09/2026 09:20 — Validation finale**
Autorité compétente

Cette timeline doit permettre de comprendre immédiatement le parcours du dossier.

---

### 9. INTÉGRATION AUX WORKFLOWS

Le journal doit être intégré à tous les workflows de BUDGET-CEEAC.

Chaque transition doit automatiquement créer un événement.

Exemple :

**Expression de Besoin**

Création → Soumission → Validation N → Validation N+1 → Validation finale → Génération Engagement

**Engagement**

Création → Validation Expert Budget → Validation Chef Service Budget → Validation Directeur Budget → Contrôle Financier → SG → Président → Signature

Puis :

**Liquidation → Ordonnancement → Paiement**

Aucune transition importante ne doit pouvoir se produire sans laisser une trace dans le journal.

---

### 10. JOURNAL IMMUTABLE

Concevoir le module comme un véritable mécanisme d'audit.

Les événements enregistrés doivent être considérés comme **non modifiables et non supprimables par les utilisateurs ordinaires**.

Prévoir des droits spécifiques pour :

* consulter ;
* exporter ;
* administrer ;
* auditer.

Même les administrateurs système ne doivent pas disposer, depuis l'interface standard, d'une fonction permettant de modifier arbitrairement l'historique métier.

---

### 11. TABLEAU DE BORD DU JOURNAL

Créer un dashboard spécifique affichant notamment :

* nombre total d'événements ;
* événements aujourd'hui ;
* événements cette semaine ;
* événements ce mois ;
* connexions ;
* validations ;
* rejets ;
* modifications ;
* suppressions ;
* erreurs ;
* événements critiques.

Ajouter des graphiques permettant d'analyser :

* événements par module ;
* événements par utilisateur ;
* événements par type d'action ;
* événements par période.

---

### 12. ALERTES ET ÉVÉNEMENTS CRITIQUES

Prévoir un mécanisme permettant d'identifier visuellement les événements sensibles :

* nombreuses tentatives de connexion échouées ;
* suppression ;
* modification importante ;
* changement de permission ;
* changement de rôle ;
* modification d'une donnée budgétaire sensible ;
* annulation d'une opération ;
* intervention exceptionnelle sur un workflow.

Les événements critiques doivent être clairement signalés.

---

### 13. EXPORT ET RAPPORT D'AUDIT

Permettre l'export du journal selon les filtres sélectionnés :

* PDF ;
* Excel ;
* CSV si prévu.

Créer également un **Rapport d'Audit** PDF professionnel contenant :

* période analysée ;
* filtres appliqués ;
* nombre d'événements ;
* synthèse ;
* détail des événements ;
* utilisateurs concernés ;
* modules concernés ;
* événements critiques ;
* date de génération ;
* utilisateur ayant généré le rapport.

---

### 14. PERMISSIONS

Intégrer le journal au système de rôles et permissions de BUDGET-CEEAC.

Prévoir des permissions distinctes telles que :

* `journal.view`
* `journal.view_detail`
* `journal.export`
* `journal.audit`
* `journal.admin`

L'accès aux informations sensibles doit être strictement contrôlé.

---

### 15. DESIGN UI/UX

Conserver intégralement le **Design System actuel de BUDGET-CEEAC**.

Le nouveau module doit utiliser :

* les mêmes couleurs ;
* la même typographie ;
* les mêmes boutons ;
* les mêmes tableaux ;
* les mêmes cartes ;
* les mêmes badges ;
* les mêmes icônes ;
* les mêmes espacements ;
* les mêmes composants de navigation.

Le résultat doit donner l'impression que le Journal des événements a été conçu nativement avec le reste de BUDGET-CEEAC.

Privilégier une interface **institutionnelle, moderne, sobre, très lisible et orientée contrôle/audit**.

---

### 16. ÉCRANS FIGMA À CRÉER

Créer au minimum les écrans suivants :

1. **Journal des événements — Dashboard**
2. **Journal des événements — Liste**
3. **Journal — Filtres avancés**
4. **Détail d'un événement**
5. **Historique d'un dossier**
6. **Timeline d'un workflow**
7. **Événements critiques**
8. **Rapport d'audit**
9. **Aperçu PDF du journal**
10. **Export du journal**
11. **Gestion des permissions du journal**

Prévoir également les états :

* chargement ;
* aucun événement ;
* recherche sans résultat ;
* erreur ;
* accès non autorisé ;
* événement critique ;
* export en cours ;
* export terminé.

---

### 17. OBJECTIF FINAL

Ne considère pas le Journal des événements comme une simple liste de logs techniques.

Il doit constituer un **véritable système de traçabilité métier et d'audit de BUDGET-CEEAC**, permettant de répondre à tout moment aux questions :

**Qui a fait quoi ?**

**Sur quel objet ?**

**Quand ?**

**Depuis quelle session ?**

**À quelle étape du workflow ?**

**Quelle était la valeur avant l'action ?**

**Quelle est la valeur après l'action ?**

**Quel était le résultat de l'action ?**

**Quelle autorité a validé, rejeté ou signé ?**

L'objectif est de garantir une **traçabilité complète, chronologique, fiable et exploitable de toutes les opérations réalisées dans BUDGET-CEEAC**, depuis la création d'une Expression de Besoin jusqu'au paiement, ainsi que pour toutes les fonctions transversales de l'application.
