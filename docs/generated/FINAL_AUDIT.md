# Audit final — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Périmètre :** phases 0 à 16 du plan d’implémentation.  
**Nature :** constat de livraison de travail. Ce document n’est ni une homologation, ni une certification IPSAS, SYSCOHADA ou COSO.

## 1. Verdict

Le moteur de la chaîne de dépense est en place : identité, organigramme de travail, référentiels d’exécution, budget sans lignes officielles, expression de besoin, engagement, liquidation, ordonnancement, paiement, tiers, contrats, GED, notifications, observations, tableaux de bord calculés et pièces PDF scellées.

L’exploitation n’est pas prête. PostgreSQL n’est pas installé. Le Budget 2026 n’est pas chargé. L’exercice local reste en préparation. Les écrans connectés affichent donc zéro écriture, et c’est le comportement attendu.

## 2. Ce qui s’exécute

| Domaine | Constat |
| --- | --- |
| Identité | Connexion Sanctum, verrouillage après 5 échecs, réinitialisation du mot de passe, rôles, séparation des fonctions à l’affectation, journal d’audit en lecture seule. |
| Organisation | 105 unités, version `ORG-CEEAC-2026-06`, statut proposé. Le Secrétariat Général remplace le Secrétariat Administratif. |
| Référentiels | Exercice 2026 en préparation, circuits, séquences (EB, ENG, LIQ, ORD, PAI, MOV, CTR), seuil d’ordonnancement 5 000 000 XAF versionné. |
| Budget | Versions, mouvements, gel, import refusé si les totaux de contrôle divergent. Aucune ligne du Budget 2026 n’est promue. |
| Chaîne | EB hors PAP, PAP technique et PAP appui. Réservation au visa du directeur du budget, engagement ferme au visa du contrôleur financier. Liquidation avec service fait et retenues. Ordonnancement selon le seuil copié sur l’acte. Paiement en virement, chèque ou caisse, preuve exigée à l’exécution. |
| Pièces | Fiche EB, bon, certificat, attestation de service fait, état de liquidation, ordre signé, avis de paiement. Un fichier par acte et par type, scellé, empreinte SHA-256 des octets archivés. |
| Transversal | Tiers et comptes bancaires activés par une autre personne. Contrats et avenants. GED utilisateur. Notifications issues des tâches ouvertes. Observations ouvertes puis closes avec un motif. |
| Tableaux de bord | Indicateurs calculés sur les écritures du périmètre. Taux entier seulement si le révisé est positif. |
| Dossier unifié | Recherche par référence, objet, facture, fournisseur, ligne et structure. La page montre la filiation EB → PAI. Les observations, le suivi-évaluation et les contrats ne sont pas rattachés à l’acte. |
| Optimisation | Index de lecture, listes préchargées, en-têtes de sécurité, lien clavier vers le contenu, file pour les notifications. |

Les montants sont des entiers XAF. Les plafonds sont transactionnels. Les références métier (`EB-2026-000001`, etc.) sont distinctes des clés UUID.

## 3. Preuves

| Suite | Résultat retenu |
| --- | --- |
| `php artisan test` | 59 réussites, 1 test ignoré, 615 assertions. Le test ignoré est le verrou parallèle, non concluant sur SQLite. |
| `npm test` | 4 réussites : montants, états d’écran, schéma de connexion. |
| `npm run test:e2e` | 2 réussites : refus de connexion, lien d’évitement, parcours des écrans vides sans le total 40 305 795 803 XAF. |

Le circuit nominal EB → PAI et le contenu PDF sont prouvés par PHPUnit. Le navigateur local ne peut pas le rejouer tant qu’aucune ligne n’est exécutoire.

## 4. Ce qui reste fermé

| Sujet | Motif |
| --- | --- |
| PostgreSQL d’exploitation | Absent du poste. Les tests utilisent SQLite en mémoire. ADR-012. |
| Concurrence parallèle | Non concluante tant qu’elle n’est pas rejouée sur PostgreSQL. ADR-023. |
| Lignes du Budget 2026 | Pas de source tabulaire contrôlée. Les totaux de l’annexe sont une barrière d’import. Q4, Q5. |
| Codes organisationnels | Version de travail, pas un acte promulgué. Q2. |
| GAR / RBM, Gantt, suivi-évaluation | Chaîne programmatique non importée. Les écrans le disent. |
| Seuils de marchés | Table vide. Aucun barème inventé. Q14. |
| MFA TOTP et signature qualifiée | Colonnes et exigence documentées, pas de second facteur branché. Q10. |
| QR, procès-verbal de réception, états de clôture | Non produits. ADR-022. |
| Trésorerie, comptes bancaires de la Commission, rapprochement | Non chargés. ADR-019. |
| Facture rattachée à un tiers | La clé reste le libellé fournisseur. ADR-017. |
| Ordonnancement groupé | Désactivé. Q9. |
| Délai d’expiration de la réservation | Non chiffré par l’institution. Q7. |
| Recettes et recouvrement | Hors chaîne de dépense. Q13. |
| Exports de rapports | Non construits. Les indicateurs existent, pas les fichiers. |
| `X-Powered-By` | Le serveur PHP de ce poste l’ajoute encore. `expose_php` ne se coupe pas depuis l’application. |

## 5. Lancement

Le mode opératoire est dans le `README.md` à la racine. Tant que PostgreSQL n’est pas installé, l’API locale peut tourner sur SQLite. Cette base n’est pas la base d’exploitation. `migrate:fresh` est interdit dès qu’elle contient des données utiles.

`php artisan queue:work` est requis pour remplir l’inbox lorsque la file est `database`. Les actes financiers et leurs PDF ne passent pas par cette file.

## 6. Ce que cet audit ne dit pas

Il ne dit pas que le cahier v5.0 a été promulgué. Il ne dit pas que les totaux de l’annexe 2026 sont des crédits ouverts. Il ne dit pas que la maquette Figma est l’application. Il ne dit pas qu’un succès de test SQLite prouve le verrou concurrent de PostgreSQL.
