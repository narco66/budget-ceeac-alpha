# PROMPT FIGMA — AUDIT ET REFONTE DU MODULE DE GESTION DES UTILISATEURS ET DES CRUD ASSOCIÉS

Audite en profondeur le module **Administration / Gestion des utilisateurs** actuellement présent dans **BUDGET-CEEAC**, puis corrige, complète et réorganise l’ensemble des formulaires, écrans, CRUD, règles de gestion et interfaces nécessaires afin d’obtenir un module de gestion des utilisateurs complet, cohérent, sécurisé et exploitable en production.

Le formulaire actuel de création des utilisateurs est incomplet. Plusieurs informations essentielles sont absentes, notamment le **mot de passe**, mais probablement aussi d’autres données utiles à l’identification, au rattachement organisationnel, aux habilitations et à la sécurité.

L’objectif n’est donc pas uniquement d’ajouter un champ mot de passe, mais de réaliser un **audit fonctionnel complet du module Utilisateurs et de tous les CRUD associés**, puis de corriger tous les manquements identifiés.

## 1. Audit préalable obligatoire

Avant toute modification :

- analyser le formulaire actuel de création d’un utilisateur ;
- analyser la page de modification ;
- analyser la fiche de consultation ;
- analyser la liste des utilisateurs ;
- analyser les actions disponibles ;
- analyser les relations avec les rôles, permissions et structures ;
- analyser les filtres ;
- analyser les statuts ;
- analyser les mécanismes d’activation et désactivation ;
- analyser les écrans de gestion des rôles ;
- analyser les écrans de gestion des permissions ;
- analyser les CRUD liés au référentiel organisationnel ;
- analyser les éventuelles fonctionnalités de sécurité déjà présentes.

Pour chaque composant existant, déterminer s’il faut :

- conserver ;
- compléter ;
- améliorer ;
- réorganiser ;
- fusionner ;
- remplacer ;
- supprimer.

Ne pas casser les éléments déjà correctement conçus.

---

# 2. FORMULAIRE DE CRÉATION D’UN UTILISATEUR

Créer ou compléter un formulaire professionnel et structuré.

Le formulaire doit au minimum comporter les sections suivantes.

## A. Informations personnelles

Prévoir :

- matricule ;
- civilité ;
- nom ;
- prénom(s) ;
- nom d’usage éventuel ;
- sexe si requis par le référentiel RH ;
- date de naissance si nécessaire ;
- photo/avatar ;
- téléphone professionnel ;
- téléphone secondaire éventuel ;
- adresse e-mail professionnelle ;
- adresse e-mail secondaire éventuelle.

Ne pas rendre obligatoires les données qui ne sont pas nécessaires au fonctionnement de BUDGET-CEEAC.

---

# 3. INFORMATIONS PROFESSIONNELLES

L’utilisateur doit obligatoirement pouvoir être rattaché au **référentiel organisationnel officiel de la CEEAC**.

Prévoir :

- structure principale ;
- Département ;
- Direction ;
- Service ;
- unité administrative ;
- fonction ;
- poste ;
- supérieur hiérarchique ;
- type d’utilisateur ;
- catégorie éventuelle ;
- date de prise de fonction ;
- date de fin d’affectation éventuelle.

Ces informations ne doivent pas être saisies librement lorsqu’elles existent déjà dans le référentiel organisationnel.

Utiliser des listes contrôlées et dépendantes.

Exemple :

**Département → Direction → Service → Fonction**

---

# 4. IDENTIFIANTS DE CONNEXION

Le formulaire doit comporter explicitement :

- nom d’utilisateur ;
- adresse e-mail de connexion ;
- mot de passe ;
- confirmation du mot de passe.

Prévoir également :

- génération automatique d’un mot de passe temporaire ;
- affichage/masquage du mot de passe ;
- indicateur de robustesse ;
- règles minimales de sécurité ;
- obligation éventuelle de changement lors de la première connexion.

Le système doit pouvoir permettre deux scénarios :

### Création manuelle

L’administrateur définit le mot de passe.

### Création avec mot de passe temporaire

Le système génère automatiquement un mot de passe temporaire.

Dans ce cas, l’utilisateur devra obligatoirement définir son propre mot de passe lors de sa première connexion.

---

# 5. RÈGLES DE MOT DE PASSE

Prévoir des contrôles configurables, notamment :

- longueur minimale ;
- majuscule ;
- minuscule ;
- chiffre ;
- caractère spécial ;
- interdiction des mots de passe trop faibles ;
- interdiction de réutiliser certains anciens mots de passe ;
- expiration éventuelle ;
- délai avant réinitialisation.

Ces paramètres doivent relever de la politique de sécurité et ne pas être codés en dur dans l’interface.

---

# 6. RÔLES ET HABILITATIONS

Le formulaire doit permettre d’associer :

- un ou plusieurs rôles ;
- des permissions ;
- un périmètre organisationnel ;
- éventuellement un périmètre budgétaire ;
- éventuellement un périmètre fonctionnel.

Exemples de rôles :

- Administrateur ;
- Président ;
- Vice-Président ;
- Secrétaire Général ;
- Commissaire ;
- Directeur ;
- Chef de Service ;
- Expert ;
- Contrôleur Financier ;
- Agent Comptable ;
- Comptable ;
- Chef Comptable ;
- Gestionnaire budgétaire ;
- Auditeur ;
- utilisateur en consultation.

Ne pas figer ces rôles si le système dispose déjà d’un CRUD des rôles.

Les rôles doivent venir du référentiel des rôles.

---

# 7. PÉRIMÈTRE D’ACCÈS

Prévoir un mécanisme permettant de déterminer le périmètre de visibilité de l’utilisateur.

Exemples :

- toute la Commission ;
- un Département ;
- une Direction ;
- un Service ;
- un programme ;
- une activité ;
- un type de dossier.

Un Commissaire doit par exemple pouvoir disposer d’un périmètre correspondant à son Département.

Un Chef de Service doit pouvoir avoir un périmètre correspondant à son Service.

Les règles de sécurité ne doivent pas dépendre uniquement de ce que l’interface masque visuellement.

---

# 8. STATUT DU COMPTE

Prévoir :

- Actif ;
- Inactif ;
- Suspendu ;
- Verrouillé ;
- En attente d’activation ;
- Expiré ;
- Archivé.

Afficher clairement le statut dans :

- la liste ;
- la fiche ;
- les filtres ;
- le formulaire.

---

# 9. PARAMÈTRES DE SÉCURITÉ

Prévoir notamment :

- changement obligatoire du mot de passe ;
- authentification renforcée si disponible ;
- dernière connexion ;
- dernière modification du mot de passe ;
- nombre de tentatives échouées ;
- verrouillage automatique ;
- date d’expiration du compte ;
- déconnexion forcée ;
- révocation des sessions.

Prévoir une interface permettant à l’administrateur de :

- réinitialiser un mot de passe ;
- déverrouiller un utilisateur ;
- suspendre le compte ;
- réactiver le compte ;
- forcer la déconnexion.

---

# 10. LISTE DES UTILISATEURS

Reconcevoir si nécessaire la page liste.

Afficher au minimum :

- avatar ;
- nom complet ;
- matricule ;
- e-mail ;
- fonction ;
- structure ;
- rôle principal ;
- statut ;
- dernière connexion ;
- actions.

Prévoir :

- recherche ;
- filtres ;
- pagination ;
- tri ;
- vue compacte ;
- vue détaillée.

Filtres recommandés :

- Département ;
- Direction ;
- Service ;
- rôle ;
- statut ;
- actif/inactif ;
- date de création ;
- dernière connexion.

---

# 11. ACTIONS SUR UN UTILISATEUR

Prévoir les actions suivantes selon les habilitations :

- consulter ;
- modifier ;
- activer ;
- désactiver ;
- suspendre ;
- réactiver ;
- verrouiller ;
- déverrouiller ;
- réinitialiser le mot de passe ;
- forcer le changement du mot de passe ;
- modifier les rôles ;
- modifier les permissions ;
- consulter l’historique ;
- archiver.

La suppression définitive d’un utilisateur doit être évitée lorsque celui-ci possède déjà un historique dans l’application.

Privilégier :

**désactivation → archivage → conservation de la traçabilité.**

---

# 12. FICHE UTILISATEUR

Créer une fiche détaillée structurée en onglets.

Exemple :

### Identité
Informations personnelles.

### Organisation
Affectation et rattachement.

### Rôles et permissions
Habilitations.

### Sécurité
Connexion, mot de passe, sessions.

### Activité
Dernières actions.

### Historique
Modifications et affectations.

### Dossiers
Dossiers créés ou traités.

---

# 13. CRUD DES RÔLES

Auditer le CRUD des rôles.

Il doit permettre :

- créer ;
- consulter ;
- modifier ;
- activer ;
- désactiver ;
- archiver.

Champs recommandés :

- code ;
- nom ;
- description ;
- niveau ;
- type ;
- périmètre ;
- statut.

Permettre l’association des permissions.

---

# 14. CRUD DES PERMISSIONS

Auditer ou créer le CRUD des permissions.

Prévoir une nomenclature claire.

Exemples :

- users.view ;
- users.create ;
- users.update ;
- users.disable ;
- budget.view ;
- eb.create ;
- eb.validate ;
- engagement.validate ;
- liquidation.validate ;
- ordonnancement.sign ;
- paiement.validate ;
- reporting.view.

Permettre de regrouper les permissions par module.

---

# 15. MATRICE RÔLES / PERMISSIONS

Créer une interface dédiée permettant de visualiser :

**Rôles × Permissions**

Utiliser une matrice claire avec :

- lecture ;
- création ;
- modification ;
- validation ;
- approbation ;
- suppression éventuelle ;
- administration.

Prévoir :

- recherche ;
- filtre par module ;
- sélection en masse ;
- contrôle des incohérences.

---

# 16. CRUD DES STRUCTURES

Auditer les CRUD actuellement disponibles pour :

- Départements ;
- Directions ;
- Services ;
- unités ;
- fonctions ;
- postes.

Ces CRUD doivent être cohérents avec le **référentiel organisationnel officiel de la CEEAC**.

Éviter toute duplication du référentiel.

Les utilisateurs doivent seulement être rattachés aux structures existantes.

---

# 17. CRUD DES FONCTIONS ET POSTES

Si ces référentiels n’existent pas encore, prévoir au minimum :

### Fonction

- code ;
- libellé ;
- description ;
- niveau hiérarchique ;
- statut.

### Poste

- code ;
- intitulé ;
- structure ;
- fonction associée ;
- titulaire éventuel ;
- statut.

---

# 18. GESTION DES AFFECTATIONS

Un utilisateur peut changer :

- de Direction ;
- de Service ;
- de poste ;
- de fonction ;
- de Département.

Il faut donc éviter d’écraser l’historique.

Créer un mécanisme d’affectation avec :

- structure ;
- poste ;
- fonction ;
- date de début ;
- date de fin ;
- statut ;
- motif.

Conserver l’historique complet.

---

# 19. CRUD DES TYPES D’UTILISATEURS

Si nécessaire, créer un référentiel permettant de distinguer par exemple :

- personnel interne ;
- administrateur ;
- consultant ;
- prestataire ;
- auditeur ;
- utilisateur externe ;
- compte technique.

Chaque type doit pouvoir avoir des règles d’accès spécifiques.

---

# 20. JOURNAL D’AUDIT

Toutes les actions sensibles doivent être journalisées.

Tracer notamment :

- création ;
- modification ;
- activation ;
- désactivation ;
- suspension ;
- modification des rôles ;
- modification des permissions ;
- réinitialisation du mot de passe ;
- verrouillage ;
- déverrouillage ;
- modification de l’affectation.

Conserver :

- utilisateur ayant réalisé l’action ;
- utilisateur concerné ;
- date ;
- heure ;
- ancienne valeur ;
- nouvelle valeur ;
- action ;
- justification éventuelle.

---

# 21. RÈGLES DE SUPPRESSION

Auditer tous les boutons « Supprimer ».

Ne pas permettre une suppression qui casserait l’historique des dossiers.

Pour les objets utilisés dans le système :

**privilégier désactivation ou archivage.**

Une suppression définitive doit être réservée aux objets jamais utilisés ou créés par erreur, sous contrôle strict.

---

# 22. VALIDATIONS DU FORMULAIRE

Prévoir des contrôles clairs :

- nom obligatoire ;
- prénom obligatoire ;
- e-mail valide ;
- e-mail unique ;
- matricule unique lorsque applicable ;
- nom d’utilisateur unique ;
- confirmation du mot de passe ;
- rôle obligatoire ;
- rattachement organisationnel cohérent ;
- date de fin supérieure à la date de début ;
- compte non dupliqué.

Afficher les erreurs à proximité du champ concerné.

---

# 23. UX/UI DU FORMULAIRE

Ne pas présenter un formulaire extrêmement long sur une seule colonne.

Organiser les informations en sections ou étapes.

Proposition :

### Étape 1 — Identité

### Étape 2 — Affectation

### Étape 3 — Compte et sécurité

### Étape 4 — Rôles et permissions

### Étape 5 — Vérification

Prévoir une synthèse avant création.

Le design doit être cohérent avec le Design System de BUDGET-CEEAC.

---

# 24. CRUD À AUDITER DANS L’ENSEMBLE DU MODULE ADMINISTRATION

Ne pas limiter l’audit au seul formulaire Utilisateur.

Auditer également l’existence et la qualité des CRUD suivants :

- Utilisateurs ;
- Rôles ;
- Permissions ;
- Profils ;
- Structures ;
- Départements ;
- Directions ;
- Services ;
- Fonctions ;
- Postes ;
- Affectations ;
- types d’utilisateurs ;
- statuts ;
- paramètres de sécurité ;
- politiques de mot de passe ;
- sessions ;
- notifications administratives.

Identifier automatiquement :

- CRUD absents ;
- CRUD partiels ;
- formulaires incomplets ;
- relations manquantes ;
- actions manquantes ;
- incohérences ;
- doublons.

Puis les corriger.

---

# 25. DROITS D’ACCÈS

Les pages d’administration doivent respecter les habilitations.

Un utilisateur non autorisé ne doit pas pouvoir :

- accéder directement par URL ;
- modifier un rôle ;
- attribuer une permission ;
- créer un administrateur ;
- réinitialiser un mot de passe ;
- modifier les paramètres de sécurité.

La sécurité doit être contrôlée au niveau fonctionnel, et non uniquement par masquage des boutons.

---

# 26. CRITÈRES D’ACCEPTATION

La refonte sera considérée conforme lorsque :

- le formulaire de création d’utilisateur contient toutes les informations nécessaires ;
- le mot de passe et sa confirmation sont correctement gérés ;
- la génération d’un mot de passe temporaire est possible ;
- l’utilisateur peut être rattaché au référentiel organisationnel ;
- les rôles sont gérés dynamiquement ;
- les permissions sont administrables ;
- les statuts de compte sont correctement gérés ;
- la désactivation et la suspension sont possibles ;
- la réinitialisation du mot de passe est disponible ;
- la matrice rôles/permissions existe ;
- les affectations sont historisées ;
- les CRUD nécessaires existent ;
- aucun référentiel important n’est dupliqué inutilement ;
- les utilisateurs désactivés conservent leur historique ;
- les actions sensibles sont journalisées ;
- les validations du formulaire sont complètes ;
- les droits d’accès sont respectés ;
- aucune fonctionnalité correcte existante n’est cassée.

---

# 27. CONSIGNE FINALE

Ne te contente pas d’ajouter quelques champs au formulaire existant.

Réalise un **audit fonctionnel complet de l’administration des utilisateurs et des CRUD connexes**, puis fais évoluer la maquette pour obtenir un véritable module :

**Utilisateurs  
→ Affectations  
→ Rôles  
→ Permissions  
→ Périmètres  
→ Sécurité  
→ Sessions  
→ Historique  
→ Journal d’audit.**

L’objectif final est que le module d’administration de **BUDGET-CEEAC** soit suffisamment complet pour gérer de façon fiable les utilisateurs réels de la Commission, leur rattachement institutionnel, leurs habilitations et leur cycle de vie, tout en restant parfaitement intégré au référentiel organisationnel officiel et aux autres modules de l’application.