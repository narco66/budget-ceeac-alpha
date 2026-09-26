# Matrice de traçabilité — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Statut :** initiale (phase 0). Les colonnes API, table, service et test décrivent la cible. Elles seront mises à jour lorsque le code existera. Aucune exigence majeure du cahier v5.0 n’est écartée.

Légende de couverture : **Cible** = prévue, non encore codée. **Maquette** = écran Figma seulement.

## 1. Exigences de chaîne de dépense

| Exigence | Module | Écran cible (Figma) | API cible | Table cible | Service cible | Test cible |
| --- | --- | --- | --- | --- | --- | --- |
| EB-FR-001 Circuit Hors PAP SMG → DRHMG → SG → Ordonnateur | M06, M16 | `ExpressionBesoin`, `EBDetail`, `EBForm` | `POST/GET /api/v1/expressions-besoin`, transitions | `need_requests`, `workflow_instances` | `SubmitNeedRequest`, `TransitionWorkflow` | Feature + E2E circuit Hors PAP |
| EB-FR-002 Circuit PAP technique : initiateur → Directeur → Commissaire | M06 | idem | idem, type `pap_technique` | `need_requests` | `ResolveEbCircuit` | Feature PAP technique |
| EB-FR-003 Circuit PAP appui : initiateur → Directeur → SG | M06 | idem | idem, type `pap_appui` | `need_requests` | `ResolveEbCircuit` | Feature PAP appui |
| EB-FR-004 Sous-lignes : somme = montant activité | M06 | `EBForm` | validation Form Request | `need_request_lines` | `AssertSubLinesBalance` | Unit + Feature |
| EB-FR-005 Héritage GAR/RBM sans ressaisie | M03, M05, M06 | `EBForm`, `PAP` | ressource EB enrichie | `program_nodes`, `budget_lines` | `InheritProgramContext` | Feature EB PAP |
| EB-FR-006 Validation définitive → un seul ENG | M06, M07 | `EBDetail` | `POST .../validate` idempotent | `commitments`, `idempotency_keys` | `GenerateCommitmentFromNeed` | Feature double soumission |
| ENG-001 Génération et héritage | M07 | `EngagementDetail` | `/api/v1/engagements` | `commitments`, `commitment_lines` | `GenerateCommitmentFromNeed` | Feature héritage |
| ENG-002 Disponible transactionnel | M05, M07 | `EngagementDetail` | transition visa/validation budget | `budget_balances`, `credit_reservations` | `ReserveCredit` | Concurrence |
| ENG-003 Cumul ENG ≤ EB et ≤ disponible | M07 | bannière + détail | Form Request + domaine | contraintes + verrou | `AssertCommitmentCeiling` | Feature dépassement |
| ENG-004 Visa CF avant LIQ | M07, M08 | `WorkflowBanner` | transition `visa_cf` | `approvals` | `TransitionWorkflow` | Autorisation + workflow |
| ENG-007 PDF + ouverture LIQ idempotente | M07, M08, M15 | détail ENG | job documentaire après commit | `documents` | `OpenLiquidationFromCommitment` | Feature idempotence |
| LIQ-001 LIQ seulement si ENG visé | M08 | `LiquidationDetail` | `/api/v1/liquidations` | `liquidations` | `OpenLiquidationFromCommitment` | Feature précondition |
| LIQ-002 Service fait et pièces | M08, M15 | détail LIQ | transition certification | `service_facts`, `documents` | `CertifyServiceDone` | Feature pièces manquantes |
| LIQ-003 Cumul LIQ ≤ ENG net | M08 | détail | domaine transactionnel | `liquidation_lines` | `AssertLiquidationCeiling` | Feature + concurrence |
| LIQ-006 Un seul ORD | M08, M09 | détail LIQ | transition visa | `payment_orders` | `GenerateOrderFromLiquidation` | Feature idempotence |
| ORD-002 Seuil 5 000 000 XAF | M09 | `OrdonancementDetail` | lecture paramètre versionné | `threshold_rules`, `payment_orders.ordonnateur_role` | `ResolveOrdonnateur` | Feature 5 000 000 et 5 000 001 |
| ORD-003 Cumul ORD ≤ LIQ | M09 | détail | domaine | `payment_orders` | `AssertOrderCeiling` | Feature dépassement |
| ORD-004 Transmission ACC après signature | M09, M10 | détail | transition `transmit_acc` | `workflow_events` | `TransmitToAccountingAgency` | Feature |
| PAI-001 Paiement après prise en charge | M10 | `PaiementDetail` | `/api/v1/paiements` | `payments` | `RegisterPayment` | Feature précondition |
| PAI-002 Cumul PAI ≤ ORD pris en charge | M10 | détail | domaine transactionnel | `payments` | `AssertPaymentCeiling` | Feature + concurrence |
| PAI-003 Modes virement, chèque, caisse | M10 | formulaire paiement | enum paramétrable | `payment_methods` | `RegisterPayment` | Feature par mode |
| CHAIN-001 Filiation EB→ENG→LIQ→ORD→PAI | M06–M10 | `Dossier` | `/api/v1/dossiers/{ref}` | clés étrangères | `FinancialDossierQuery` | E2E nominal |
| CHAIN-002 Pas de flottant | transverse | affichage XAF | integer / numeric | `numeric(20,0)` | `Money` | Unit |

## 2. Exigences transverses P0

| Exigence | Module | Écran | API | Table | Service | Test |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-AUTH-001 Connexion, verrouillage, sessions, historique | M01 | `Welcome` | `/api/v1/auth/*` | `users`, `login_attempts`, `sessions` | `AuthenticateUser` | Feature sécurité |
| SEC-RBAC-001 Rôle, permission, structure, exercice | M01, M02 | Administration | policies sur chaque route | `roles`, `permissions`, `role_user`, `scopes` | Policies Laravel | Autorisation autorisé / interdit / hors périmètre |
| SEC-SOD-001 Matrice de séparation des fonctions | M01 | Administration | refus à l’exécution | `sod_rules` | `AssertSegregationOfDuties` | Feature conflit de rôles |
| SEC-AUD-001 Journal non modifiable par un profil fonctionnel | M14 | `JournalEvenements` | `GET /api/v1/audit-events` lecture seule | `audit_events` | `AuditLogger` | Feature absence d’update/delete API |
| WF-001 Moteur étapes / transitions / motifs | M16 | `WorkflowBanner`, `WorkflowAdmin` | `/api/v1/workflows` | `workflow_definitions`, `workflow_steps`, `workflow_transitions`, `workflow_instances` | `WorkflowEngine` | Workflow tests |
| TASK-001 Mes tâches, tri antéchronologique | M16 | `MesTaches` | `/api/v1/taches` | `tasks` | `TaskInboxQuery` | Feature filtres |
| NUM-001 Séquences EB/ENG/LIQ/ORD/PAI | transverse | références affichées | service interne | `number_sequences` | `ReferenceNumberGenerator` | Concurrence unicité |
| BUD-001 Budget initial immuable, révisé par mouvements | M05 | `Budget` | `/api/v1/budgets`, `/mouvements` | `budget_lines`, `budget_movements` | `ApplyBudgetMovement` | Feature virement |
| BUD-002 PAP dans le budget unique | M05 | `PAP` | `/api/v1/pap` | `budget_lines.segment` | `BudgetBalanceQuery` | Feature pas de double comptage |
| GED-001 PDF archivé avec hash | M15 | `GED` | `/api/v1/documents` | `documents`, `document_versions` | `ArchiveGeneratedDocument` | Feature hash |
| FY-001 Période close bloque l’écriture | M21 | `ClotureBudgetaire` | garde domaine | `fiscal_years`, `fiscal_periods` | `AssertPeriodOpen` | Feature clôture |
| ORG-001 Organigramme versionné réel | M02 | `Referentiel` | `/api/v1/organisation` | `organization_units` | `OrganizationRegistry` | Feature code unique, pas de cycle |

## 3. Exigences P1 et P2 (traçées, implémentation ultérieure)

| Exigence | Priorité | Module | Écran Figma | API cible |
| --- | --- | --- | --- | --- |
| Marchés, avenants, garanties, réceptions | P1 | M11 | `Marches` | `/api/v1/marches` |
| Tiers et comptes bancaires à double validation | P1 | M12 | `Tiers` | `/api/v1/tiers` |
| S&E réalisation et indicateurs | P1 | M13 | `SuiviEvaluation` | `/api/v1/suivi-evaluation` |
| GANTT PAP et Hors PAP | P1 | M19 | `GanttExecution` | `/api/v1/gantt` |
| Tableau exécutif une page, KPI explicables | P1 | M20 | `ExecutiveDashboard` | `/api/v1/dashboards/executif` |
| Arriérés et balance âgée | P1 | M21 | Clôture / Paiement | `/api/v1/arrieres` |
| Rapprochement bancaire | P1 | M21 | Interop / Clôture | `/api/v1/rapprochements` |
| Moteur de contrôle continu | P1 | M14 | `ControleInterne` | `/api/v1/controles` |
| Registre des risques | P1 | M14 | `Audit` | `/api/v1/risques` |
| Plan de trésorerie | P1 | M05/M10 | Reporting | `/api/v1/tresorerie` |
| Recettes / contributions | P2 | extension §47 | `Recettes` | `/api/v1/recettes` |
| Signature électronique qualifiée | P2 | §40 | détails d’actes | à préciser selon infrastructure |

## 4. Préparation budgétaire (PREP)

| ID | Règle | API | Test |
| --- | --- | --- | --- |
| PREP-001 | Pas de proposition hors exercice ouvert | `/api/v1/preparation` | Feature |
| PREP-002 | Plafonds par structure | idem | Feature |
| PREP-003 | Arbitrage historisé | `budget_arbitrations` | Feature |
| PREP-004 | PAP non doublement compté | `budget_lines` | Feature |
| PREP-005 | Version publiée immuable | `budget_versions` | Feature |
| PREP-006 | Soldes initial, révisé, engagé, liquidé, ordonnancé, payé, disponible | vue ou table de soldes dérivée | Feature reproductibilité |
| PREP-007 | Publication → snapshot et GED | `documents` | Feature |
| PREP-008 | Préparation close hors révision | `fiscal_years` | Feature |

## 5. Preuve de recette minimale (cahier §31 et §66)

Chaque ligne ci-dessous devra pointer vers un test automatisé avant de passer la recette :

1. EB PAP avec héritage GAR/RBM.
2. EB Hors PAP initiée par le Service des Moyens Généraux.
3. EB multi-sous-lignes à total exact.
4. Engagement partiel puis reliquat.
5. Surengagement concurrent refusé.
6. Liquidation partielle.
7. Facture dupliquée détectée.
8. Ordonnancement à 5 000 000 XAF (SG) et 5 000 001 XAF (Président).
9. Paiement partiel puis solde.
10. Double clic / double appel sans doublon.
11. Rejet bancaire puis nouvelle tentative.
12. Modification de compte bancaire tracée avant paiement.
13. Délégation expirée refusée.
14. Conflit de séparation des fonctions refusé.
15. Opération refusée sur période close.
16. Dégagement restituant le disponible.
17. PDF générés et hash stables.
18. Appel API direct sans habilitation refusé.

## 6. Mise à jour

Cette matrice est le registre vivant. Toute exigence implémentée doit remplacer « Cible » par le chemin réel du fichier de test et le nom de la route. Une exigence P0 sans test reste non livrée.
