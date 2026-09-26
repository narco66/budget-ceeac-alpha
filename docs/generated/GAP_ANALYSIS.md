# Analyse des écarts — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Comparaison :** Cahier des charges v5.0 × procédures `docs/` × Figma V7 × code applicatif × base de données.

Légende : **Absente** = ni écran réel ni persistance. **Maquette** = écran Figma sur données simulées, sans règle serveur. **Partielle** = élément documenté mais incomplet ou contradictoire entre sources.

Le tableau de la section 2 est le constat de la phase 0, lorsque l’application métier n’existait pas. L’état au 26 septembre 2026, après les phases 0 à 15, est dans `FINAL_AUDIT.md`. La chaîne de dépense, les pièces scellées et les tableaux de bord calculés existent. PostgreSQL, le Budget 2026 tabulaire, le GAR/RBM, les seuils de marchés, le MFA, le QR et les états de clôture restent fermés.

## 1. Synthèse

| Couche | Présent | Complet | Écart principal |
| --- | --- | --- | --- |
| Cahier v5.0 | Oui | Baseline proposée, non encore validée institutionnellement | Statut « proposée pour validation » |
| Procédures modulaires | Oui | Doublons LIQ, ORD, PAI, S&E | Arbitrage par le cahier v5.0 |
| Référentiel organisationnel | Oui (PDF) | Document de travail, codes à valider | Pas encore chargé en base |
| Budget 2026 | Oui (PDF) | Texte exploitable p. 1–20 ; p. 21–42 difficiles | Pas de fichier tabulaire structuré |
| Figma V7 | Oui | Couverture large des écrans | Données fictives, pas d’API |
| Backend Laravel | Non | — | À créer |
| Frontend de production | Non | — | À créer, fidèle à Figma |
| PostgreSQL | Non installé | — | Bloquant pour l’exécution réelle |
| Tests | Non | — | À créer avec chaque module |

## 2. Écarts par domaine du cahier

| Code | Fonctionnalité | Source | Figma | Application | Base | Action | Priorité |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | Administration, sécurité, paramétrage | CDC §3, §24, §53–55 | Maquette `Administration`, `WorkflowAdmin` | Absente | Absente | Socle auth, RBAC, SoD, paramètres | P0 |
| M02 | Référentiel organisationnel | PDF org. 2026 + CDC §4, §34 | Maquette `Referentiel` | Absente | Absente | Importer l’organigramme versionné, pas d’organisation inventée | P0 |
| M03 | Planification GAR/RBM | CDC §5 | Maquette `Planification` (très développée, mock) | Absente | Absente | Arborescence Pilier→Tâche versionnée | P0/P1 |
| M04 | Préparation budgétaire | CDC §6 + description module 2 | Maquette `PreparationBudgetaire` | Absente | Absente | Exercice, plafonds, versions, adoption | P0 |
| M05 | Budget unique et PAP | Budget 2026 + CDC §7 | Maquettes `Budget`, `PAP` | Absente | Absente | Charger le budget officiel, soldes calculés | P0 |
| M06 | Expression de besoin | CDC §8 | `ExpressionBesoin`, `EBForm`, `EBDetail` | Absente | Absente | Circuit Hors PAP et PAP, sous-lignes, PDF | P0 |
| M07 | Engagement | CDC §9 | `Engagement`, `EngagementDetail` | Absente | Absente | Génération idempotente, visa CF, disponible | P0 |
| M08 | Liquidation | CDC §10 | `Liquidation`, `LiquidationDetail` | Absente | Absente | Service fait, cumul ≤ ENG | P0 |
| M09 | Ordonnancement | CDC §11 | `Ordonnancement`, `OrdonancementDetail` | Absente | Absente | Seuil 5 000 000 XAF, transmission ACC | P0 |
| M10 | Paiement | CDC §12 | `Paiement`, `PaiementDetail` | Absente | Absente | Modes, cumul ≤ ORD, rapprochement de base | P0 |
| M11 | Marchés et contrats | CDC §14, §38 | `Marches` (et fichier `MarchesContrats` non routé) | Absente | Absente | Après la chaîne de dépense | P1 |
| M12 | Tiers | CDC §15, §39 | `Tiers`, `TiersDetail` | Absente | Absente | Référentiel unique, comptes bancaires sensibles | P0 pour le paiement, P1 pour le cycle complet |
| M13 | Suivi-évaluation | CDC §16, §48 | `SuiviEvaluation` | Absente | Absente | Réalisation, indicateurs, écarts | P1 |
| M14 | Contrôle interne | CDC §17, §43–44 | `ControleInterne`, `Audit` | Absente | Absente | Registre d’anomalies et risques | P1 |
| M15 | GED | CDC §18, §51 | `GED` | Absente | Absente | Métadonnées, hash, archivage des PDF | P0 |
| M16 | Workflows, tâches, notifications | CDC §19, §41–42, §52 | `MesTaches`, `WorkflowAdmin`, `WorkflowBanner` | Absente | Absente | Moteur de transitions + bannière + corbeille | P0 |
| M17 | Reporting | CDC §20, §49 | `Reporting` | Absente | Absente | États de base puis exports | P0 états minimaux, P1 BI |
| M18 | Import / export | CDC §22, §57 | `Interoperabilite` | Absente | Absente | Staging, rapport d’erreurs, import budget | P0 pour le budget, P1 pour le reste |
| M19 | GANTT | CDC §21 | `GanttExecution` | Absente | Absente | Après planification et exécution | P1 |
| M20 | Tableau exécutif | CDC §50 | `ExecutiveDashboard` | Absente | Absente | KPI calculés depuis les écritures, pas des constantes | P1 |
| M21 | Clôture, rapprochement, archivage | CDC §23, §46, §63 | `ClotureBudgetaire` | Absente | Absente | Périodes, gel, balance âgée de base | P0 période, P1 rapprochement bancaire |
| — | Mouvements budgétaires | CDC §35 | Non isolé clairement | Absente | Absente | Virements, gels, révisions sans altérer l’initial | P0 |
| — | Arriérés et trésorerie | CDC §36–37 | Partiel dans clôture / paiement | Absente | Absente | Balance âgée, plan de décaissement | P1 |
| — | Recettes | CDC §47 (extension recommandée) | Maquette `Recettes` | Absente | Absente | Prévisions de contributions, sans comptabilité générale complète | P2 |
| — | Audit trail | CDC §25, §54 | `JournalEvenements`, `Audit` | Absente | Absente | Journal append-only | P0 |
| — | Dossier unifié | CDC §58 | `Dossier` | Absente | Absente | Filiation EB→PAI | P0 |

## 3. Écarts entre Figma et le cahier des charges

| Sujet | Figma | Cahier v5.0 | Règle retenue |
| --- | --- | --- | --- |
| Données affichées | Jeux de démonstration (`mock.ts`), personnes nommées dans le certificat modèle | Interdiction des données métier codées en dur en production | Les écrans de production lisent l’API. Les noms du certificat modèle sont un exemple de mise en page, pas un annuaire. |
| Authentification | Clic local, aucun mot de passe réel | Sessions, verrouillage, MFA configurable, historique | Backend Sanctum (ou équivalent Laravel) + politiques |
| Nomenclature du certificat modèle | Chapitre 2.2 / article 2.2.1 / ligne 2.2.1.2 | Budget 2026 : titres, chapitres, articles, paragraphes de type `66101`, `60111`, piliers `201` | Importer la nomenclature du PDF budgétaire. Le certificat illustre la composition visuelle. |
| Seuils d’ordonnancement | Peuvent être illustrés par des exemples | ≤ 5 000 000 XAF : SG ; > 5 000 000 : Président ; seuil versionné | Paramètre daté, défaut institutionnel du cahier |
| Recettes | Écran présent | Extension recommandée, procédures non formalisées | Ne pas bloquer la chaîne de dépense. Module progressif. |
| Double page marchés | `Marches.tsx` routée, `MarchesContrats.tsx` orpheline | Un module marchés | S’aligner sur `Marches.tsx` puis enrichir selon CDC §38 |

## 4. Écarts de données

| Besoin | Disponible | Manque |
| --- | --- | --- |
| Organigramme | PDF structuré, codes proposés | Validation officielle des codes ; pas de fichier CSV/JSON |
| Budget 2026 | PDF 42 pages | Jeu tabulaire normalisé (titre, chapitre, article, paragraphe, libellé, CEEAC, PTF, nature PAP/Hors PAP, structure responsable) |
| Chaîne GAR/RBM | Piliers et axes visibles dans l’annexe PAP ; activités/tâches incomplètes dans l’extraction | Complétude produit / sous-produit / activité / tâche / indicateur à constituer sans altérer les montants officiels |
| Utilisateurs réels | Postes décrits, pas de liste nominative officielle | Comptes techniques de démarrage uniquement, hors production nominative inventée |
| Workflows paramétrés | Circuits décrits en prose | Tables de définition à créer, pas de moteur existant |

## 5. Dépendances bloquantes

1. PostgreSQL 18 (ou au minimum un serveur PostgreSQL compatible) n’est pas installé sur le poste de développement Laragon.
2. Le Budget 2026 n’existe qu’en PDF : l’import initial exige un mapping contrôlé et un rapport d’écarts, pas une saisie silencieuse.
3. Le référentiel organisationnel est « à valider » : il sera chargé comme version fonctionnelle 1.0 de travail, avec statut explicite, sans le présenter comme un acte déjà promulgué.
4. Le cahier v5.0 est une baseline « proposée pour validation ». L’implémentation suit cette baseline et journalise les points encore ouverts.

## 6. Ce qui ne sera pas réinventé

- L’organisation du Secrétariat Administratif, remplacée par le Secrétariat Général.
- Une seconde comptabilité PAP parallèle au budget unique.
- Des montants budgétaires de démonstration en lieu et place du Budget 2026, hors jeux de tests isolés.
- La maquette Figma comme backend.
