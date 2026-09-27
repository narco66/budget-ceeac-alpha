# Sécurité — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Portée :** exigences de conception. Ce document ne vaut pas audit de pénétration ni homologation. Les en-têtes, le CORS et la file de notification sont en place. Le MFA et PostgreSQL ne le sont pas. Le constat est dans `FINAL_AUDIT.md`.

## 1. Principes

Moindre privilège, besoin d’en connaître, défense en profondeur, validation serveur systématique, séparation des fonctions, privacy by design. Une interface masquée n’est pas un contrôle.

## 2. Authentification

- Mots de passe hachés par l’algorithme Laravel par défaut (bcrypt/argon selon configuration du framework).
- Politique de mot de passe paramétrable (longueur minimale, complexité).
- Verrouillage temporaire après tentatives abusives (compteur et durée en paramètres, défauts documentés : 5 tentatives, 15 minutes).
- Expiration de session et révocation de tous les jetons d’un utilisateur.
- Historique de connexion : horodatage, résultat, adresse IP, user-agent.
- MFA TOTP activable pour les profils sensibles (Président, SG, Agent Comptable, Contrôleur Financier, administrateur). Non imposé aux profils ordinaires tant que Q10 n’est pas tranchée.
- Réauthentification possible sur les actions critiques (paiement, changement de compte bancaire, attribution de rôle).

## 3. Autorisation

Contrôle à chaque requête :

```text
permission atomique
+ rôle effectif à la date
+ structure et exercice du dossier
+ fonction attendue par l’étape
+ délégation ou intérim non expiré
+ matrice SoD
```

Les policies Laravel portent ces contrôles. Les délégations ont début, fin, périmètre, acte justificatif et approbateur. L’audit indique « agit par délégation ».

Incompatibilités minimales sur un même dossier :

| Fonction A | Incompatible avec |
| --- | --- |
| Initiateur du dossier | Visa CF, ordonnancement, paiement |
| Validateur budgétaire | Paiement du même dossier |
| Contrôleur Financier | Ordonnancement, paiement |
| Ordonnateur | Agent Comptable sur le même dossier |
| Gestionnaire du compte bancaire du tiers | Autorisation du paiement correspondant |

## 4. Données financières

- Transactions et verrous pessimistes sur les crédits.
- Idempotence des créations d’actes.
- Pas de `DELETE` physique sur un acte visé : annulation ou contre-opération.
- Journal d’audit sans route de modification : acteur, action, objet, avant/après, motif, référence, IP lorsque le journal de sécurité le prévoit.
- Snapshots immuables des actes signés.

## 5. Fichiers

Taille maximale paramétrable, liste de MIME autorisés vérifiée sur le contenu, renommage opaque, stockage hors racine publique, somme SHA-256, refus des exécutables. L’antivirus, s’il est disponible sur l’hôte, est un point d’extension documenté et non simulé.

## 6. API

- HTTPS en production.
- CORS limité à l’origine du frontend.
- Limitation de débit sur `/auth/login` et les exports.
- Requêtes paramétrées (Eloquent / query builder).
- En-têtes : `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` ou CSP frame-ancestors, désactivation de l’exposition de la version.
- Pagination obligatoire des listes.
- Pas de trace de pile ni de secret dans les réponses.

## 7. Secrets et environnements

`.env` hors dépôt. `.env.example` sans valeur réelle. Rotation documentée. Données de production interdites en test sans anonymisation.

## 8. Protection des données

Classification simple : public institutionnel, interne, financier, secret d’habilitation. Durées de conservation paramétrables. Purge contrôlée et auditée, jamais sur une pièce probante encore dans son délai. Les exports massifs sont une permission distincte et sont journalisés.

## 9. Continuité

Sauvegarde PostgreSQL et fichiers GED, rétention, restauration testée. Le détail opératoire sera dans `BACKUP_RESTORE.md` avant toute mise en production. Une sauvegarde non restaurée au moins une fois en exercice ne sera pas déclarée suffisante.

## 10. Limites assumées

- Signature électronique qualifiée non implémentée en P0 (ADR et Q10).
- Pas d’affirmation de conformité juridique IPSAS/SYSCOHADA/COSO du seul fait de ces contrôles.
- Le poste de développement actuel n’a pas encore PostgreSQL : le durcissement réseau de production reste à configurer dans `infra/` au moment du déploiement.
