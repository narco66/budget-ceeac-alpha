# BUDGET-CEEAC — Cahier des charges fonctionnel complet
**Planification • Budget • PAP/GAR/RBM • Chaîne de dépense • Suivi-Évaluation • Contrôle • Reporting • Audit**  
**Version 3.0 - 9 septembre 2026**  
**Cadre cible : Laravel 13 / PostgreSQL 18+**
## 0. Gestion documentaire et gouvernance
Ce document constitue la référence fonctionnelle consolidée v3.0 de BUDGET-CEEAC. Il intègre les vingt-et-un domaines fonctionnels, les workflows consolidés et les exigences transversales.
## 1. Résumé exécutif
BUDGET-CEEAC relie planification, Budget, PAP/GAR/RBM, chaîne de dépense, suivi-évaluation, contrôle, reporting et audit dans une même chaîne de vérité.
- Un exercice = un Budget unique ; le PAP est intégré au Budget.
- Chaîne RBM : Pilier → Axe → Produit → Sous-produit → Activité → Tâche.
- Chaîne de dépense : EB → ENG → LIQ → ORD → PAY → Rapprochement.
- Transitions automatiques, atomiques pour le cœur financier et idempotentes.
- GED versionnée, audit append-only, SoD, métriques gouvernées.

## 2. Contexte, objectifs et périmètre
Objectifs : source unique de vérité, fin des ressaisies, contrôle transactionnel des crédits, suivi des résultats, reporting fiable, auditabilité, sécurité et interopérabilité.

## 3. Principes directeurs et bonnes pratiques
- **TR-001** — Un exercice = un Budget unique ; le PAP est une composante du Budget.
- **TR-002** — Une version validée d’un référentiel, Budget, PAP ou document probatoire n’est jamais écrasée.
- **TR-003** — Les workflows sont pilotés par les données, versionnés et datés ; aucune prochaine étape n’est codée dans l’interface.
- **TR-004** — Les contrôles d’autorisation et de SoD sont exécutés côté serveur.
- **TR-005** — Les montants utilisent des types numériques exacts, jamais FLOAT pour les valeurs financières.
- **TR-006** — Les suppressions physiques sont interdites pour les objets ayant déjà été utilisés.
- **TR-007** — Les transitions EB→ENG→LIQ→ORD→PAY sont automatiques après validation finale, atomiques pour le cœur financier et idempotentes.
- **TR-008** — Les événements externes critiques sont publiés via Transactional Outbox après commit.
- **TR-009** — Le journal d’audit est append-only pour les actions sensibles.
- **TR-010** — Les documents officiels sont générés depuis les données validées et les signataires réels.
- **TR-011** — Les dashboards, exports, API et BI utilisent les mêmes définitions de métriques.
- **TR-012** — Toute correction d’un objet validé crée une version, une rectification ou une régularisation ; le passé n’est pas réécrit.
- **TR-013** — Le contrôle de crédit est transactionnel et protège contre les opérations concurrentes.
- **TR-014** — La filiation amont/aval du dossier de dépense est conservée jusqu’au rapprochement et au reporting.
- **TR-015** — Les rôles techniques n’accordent aucun pouvoir financier métier.

| Domaine | Référence / application |
| --- | --- |
| Gestion des finances publiques | PEFA 2016 : fiabilité du Budget, transparence, budgétisation fondée sur les politiques, prévisibilité et contrôle de l’exécution, reporting et audit. |
| Transparence budgétaire | Fiscal Transparency Code du FMI : exhaustivité, fiabilité, ponctualité, prévisions/budgétisation et gestion des risques budgétaires. |
| Contrôle interne et risques | COSO / INTOSAI, ISO 31000 : environnement de contrôle, évaluation des risques, activités de contrôle, information/communication et suivi. |
| Sécurité | ISO/IEC 27001/27002, NIST Zero Trust et OWASP ASVS (version stable applicable au moment du développement). |
| Continuité | ISO 22301 et bonnes pratiques de sauvegarde/restauration/PRA/PCA. |
| Accessibilité | WCAG 2.2 niveau AA pour les parcours critiques. |
| Gestion axée résultats | RBM/GAR : chaîne de résultats, indicateurs, cibles, réalisations, preuves, performance et apprentissage. |
| Interopérabilité | API versionnées, OpenAPI, OAuth2/OIDC, idempotence, correlation IDs, webhooks signés et Transactional Outbox. |

## 4. Architecture fonctionnelle cible

`Orientations → Préparation/Programmation → Budget unique ↔ PAP/RBM → Crédits → EB → ENG → LIQ → ORD → PAY → Rapprochement → S&E → Reporting → Contrôle/Audit → Clôture`

| Code | Module | Finalité |
| --- | --- | --- |
| M01 | Administration et paramétrage | Constituer le socle de configuration gouvernée de BUDGET-CEEAC et garantir que les règles transversales sont versionnées, datées, auditables et non codées en dur. |
| M02 | Préparation et programmation budgétaire | Organiser le cycle amont de préparation du Budget : cadrage, programmation pluriannuelle, collecte des besoins, PAP, plafonds, simulations, arbitrages et constitution du projet de Budget. |
| M03 | Gestion du Budget | Tenir le registre financier central : Budget unique par exercice, versions, lignes, crédits, mouvements, disponibilités, réservations, exécution et révisions. |
| M04 | Chaîne de la dépense : EB → Engagement → Liquidation → Ordonnancement → Paiement | Gérer le dossier de dépense de bout en bout, sans ressaisie, avec filiation des données, contrôles de crédit, workflows versionnés, documents officiels et transitions automatiques idempotentes. |
| M05 | Tiers, entreprises et bénéficiaires | Maintenir un référentiel unique, multi-rôles et sécurisé de tous les tiers utilisés dans les opérations budgétaires et financières. |
| M06 | Achats, marchés et contrats | Planifier, référencer ou gérer les achats et marchés reliés à la programmation budgétaire et à la chaîne de dépense, sans ressaisie des données déjà disponibles. |
| M07 | Recettes | Gérer les prévisions et l’exécution des recettes dans la limite du périmètre validé, avec rapprochement et reporting. |
| M08 | Suivi-Évaluation et performance | Suivre les réalisations physiques et financières, mesurer les écarts, documenter les preuves, conduire les évaluations et suivre les recommandations. |
| M09 | PAP, GAR et RBM | Modéliser la chaîne de résultats et relier stratégie, ressources, activités, produits, indicateurs et Budget sans duplication de lignes. |
| M10 | Dashboards, reporting et Business Intelligence | Fournir des indicateurs gouvernés, des rapports fiables et un drill-down complet, avec la même définition de métrique sur écran, export, API et BI. |
| M11 | GED, documents et signatures | Conserver les preuves et documents de manière versionnée, vérifiable, indexée et liée aux objets métier. |
| M12 | Workflow, validations et Mes tâches | Fournir un moteur générique d’états et de tâches comme source unique de vérité pour statuts, acteurs attendus, SLA, délégations et transitions. |
| M13 | Notifications, alertes et communications | Informer les acteurs au bon moment sans générer de bruit ni de doublons, et tracer les communications liées aux processus. |
| M14 | Contrôle budgétaire et contrôle interne | Automatiser les contrôles répétitifs, documenter les contrôles humains et sécuriser Budget, dépenses, financements, habilitations et pièces sans créer de doublon avec l’audit indépendant. |
| M15 | Audit, risques et conformité | Garantir une piste d’audit append-only, permettre les missions d’audit, l’analyse des risques, les recommandations et la surveillance de conformité. |
| M16 | Projets et investissements | Piloter les projets/investissements financés par le Budget/PAP et leurs jalons, coûts, financements, contrats, livrables et risques. |
| M17 | Clôture budgétaire | Organiser la pré-clôture, l’arrêté des opérations, les reports/annulations, rapprochements, clôture du PAP, archivage et reprise N+1 de façon contrôlée. |
| M18 | Référentiels financiers et budgétaires | Centraliser les nomenclatures, classifications, sources de financement et dimensions financières utilisées par tous les modules. |
| M19 | Administration technique, sécurité et habilitations | Protéger l’application, les identités, les droits, les données et l’exploitation tout en empêchant l’administration technique de contourner les contrôles financiers. |
| M20 | Import, export et interopérabilité | Échanger des données de manière versionnée, sécurisée, idempotente et réconciliable avec les systèmes internes et externes. |
| M21 | Accueil, cockpit, navigation et recherche globale | Offrir une entrée unique, personnalisée et orientée action vers BUDGET-CEEAC, avec accès direct aux tâches, alertes, dossiers, indicateurs et recherche transversale. |

## 5. M01 — Administration et paramétrage

### 5.1 Finalité

Constituer le socle de configuration gouvernée de BUDGET-CEEAC et garantir que les règles transversales sont versionnées, datées, auditables et non codées en dur.

### 5.2 Acteurs principaux
- Administrateur fonctionnel
- DSI / administrateur technique
- Responsables métiers habilités
- Audit en consultation

### 5.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| ADM-01 | Gestion des paramètres généraux | Identité institutionnelle, exercice courant, formats, fuseau, langues, devise de référence et préférences applicatives. |
| ADM-02 | Gestion des exercices et périodes | Créer, ouvrir, verrouiller, clôturer et archiver les exercices et sous-périodes. |
| ADM-03 | Calendriers et jours ouvrés | Paramétrer calendriers, jours fériés, dates limites et échéances métier. |
| ADM-04 | Séquences et numérotation | Gérer les références EB/ENG/LIQ/ORD/PAY, documents, lots, marchés, notifications et imports. |
| ADM-05 | Listes de valeurs maîtrisées | Administrer statuts, catégories, natures, motifs, priorités, types de pièces et autres référentiels courts. |
| ADM-06 | Seuils et règles versionnées | Paramétrer les seuils financiers, règles de routage, plafonds, alertes et dates d’effet. |
| ADM-07 | Catalogue de pièces obligatoires | Définir les documents requis selon processus, nature, montant, financement, tiers et étape. |
| ADM-08 | Modèles de documents officiels | Gérer modèles PDF, en-têtes, pieds, visas, signatures, QR/code de vérification et mentions légales. |
| ADM-09 | Paramétrage des workflows | Créer, versionner, activer et archiver les définitions de workflow sans modification rétroactive des instances. |
| ADM-10 | SLA et escalades | Définir délais de traitement, rappels, escalades et règles de suppléance. |
| ADM-11 | Paramètres de notifications | Modèles, canaux, destinataires, événements, préférences et règles anti-duplication. |
| ADM-12 | Paramètres d’import/export | Formats, mappings, tailles, tolérances, rapprochements et politiques de validation. |
| ADM-13 | Paramètres d’intégration | Références de connecteurs, endpoints logiques, timeouts, files et modes dégradés sans stocker de secrets en clair. |
| ADM-14 | Versioning et journal des paramètres | Conserver auteur, date, valeur avant/après, motif, approbateur et date d’effet de toute modification critique. |
| ADM-15 | Analyse d’impact | Afficher les objets et processus potentiellement affectés avant activation d’un paramètre sensible. |

### 5.4 Règles métier essentielles
- Toute règle financière ou de workflow critique est versionnée avec date d’effet.
- Une modification de paramètre ne réinterprète jamais rétroactivement un dossier déjà créé.
- Les paramètres techniques ne confèrent aucun droit métier de validation.

### 5.5 Écrans / vues
- Tableau de bord Administration
- Paramètres généraux
- Exercices/périodes
- Séquences
- Listes de valeurs
- Seuils
- Pièces obligatoires
- Modèles PDF
- SLA
- Journal des paramètres

### 5.6 Documents / sorties
- Rapport de configuration
- Historique des paramètres
- Matrice des seuils
- Catalogue de pièces
- Matrice des workflows

### 5.7 Critères d’acceptation
- Un paramètre critique peut être versionné, approuvé et activé à date sans modifier les dossiers historiques.
- Toute modification critique apparaît dans le journal d’audit.

## 6. M02 — Préparation et programmation budgétaire

### 6.1 Finalité

Organiser le cycle amont de préparation du Budget : cadrage, programmation pluriannuelle, collecte des besoins, PAP, plafonds, simulations, arbitrages et constitution du projet de Budget.

### 6.2 Acteurs principaux
- Structures initiatrices
- Direction du Budget / DPPB
- Secrétariat Général
- Autorités d’arbitrage
- Responsables PAP/S&E

### 6.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| PPB-01 | Campagnes budgétaires | Créer et piloter les campagnes par exercice avec calendrier, statut, instructions et responsables. |
| PPB-02 | Cadrage et orientations | Enregistrer orientations stratégiques, hypothèses, priorités, contraintes et documents de cadrage. |
| PPB-03 | Programmation pluriannuelle | Planifier activités/projets sur N, N+1, N+2 avec coûts, financements, jalons et résultats. |
| PPB-04 | Scénarios budgétaires | Construire et comparer des scénarios minimal, prudent, référence ou optimal sans altérer le scénario officiel. |
| PPB-05 | Plafonds et enveloppes | Affecter des plafonds par structure, programme, nature, source, projet ou PAP. |
| PPB-06 | Collecte des propositions | Saisir les propositions de fonctionnement et PAP, leurs coûts, justifications, priorités, financements et pièces. |
| PPB-07 | Chiffrage détaillé | Calculer quantité × coût unitaire, forfaits, composantes, devises et coûts pluriannuels. |
| PPB-08 | Financement CEEAC/PTF | Ventiler un besoin entre ressources CEEAC, PTF et autres sources autorisées. |
| PPB-09 | Priorisation multicritère | Noter les propositions selon alignement stratégique, urgence, impact, maturité, financement et risques. |
| PPB-10 | Validation hiérarchique | Soumettre, retourner, rejeter et valider les propositions selon structure et campagne. |
| PPB-11 | Consolidation | Consolider par structure, nature, source, RBM/PAP, priorité et période. |
| PPB-12 | Centre des anomalies | Détecter doublons, plafonds dépassés, données manquantes, incohérences PAP/RBM et financements incomplets. |
| PPB-13 | Arbitrages | Comparer demandé/révisé/arbitré/retenu et historiser chaque décision et justification. |
| PPB-14 | Cadre ressources-dépenses | Comparer ressources prévisionnelles, besoins et solde, avec analyses par financement. |
| PPB-15 | Génération du projet de Budget | Transformer les propositions retenues en projet de Budget et PAP sans ressaisie. |
| PPB-16 | Gel et clôture de campagne | Verrouiller la version approuvée et archiver la campagne, ses pièces, décisions et rapports. |

### 6.4 Règles métier essentielles
- Un exercice possède un Budget unique ; le PAP n’est jamais un Budget parallèle.
- Toute proposition PAP doit être rattachée à la chaîne RBM applicable.
- Tout arbitrage conserve le montant avant/après et une justification.
- Une campagne clôturée est verrouillée hors procédure exceptionnelle.

### 6.5 Écrans / vues
- Dashboard campagne
- Calendrier
- Cadrage
- Programmation pluriannuelle
- Plafonds/enveloppes
- Propositions
- PAP/RBM
- Consolidation
- Anomalies
- Arbitrages
- Projet de Budget

### 6.6 Documents / sorties
- Circulaire de cadrage
- Programmation pluriannuelle
- PAP
- Synthèse des besoins
- Rapport d’arbitrage
- Projet de Budget
- Rapport de clôture de campagne

### 6.7 Critères d’acceptation
- Les propositions validées et arbitrées alimentent le projet de Budget sans ressaisie.
- La traçabilité proposition → arbitrage → ligne budgétaire est conservée.

## 7. M03 — Gestion du Budget

### 7.1 Finalité

Tenir le registre financier central : Budget unique par exercice, versions, lignes, crédits, mouvements, disponibilités, réservations, exécution et révisions.

### 7.2 Acteurs principaux
- Direction du Budget
- Contrôle budgétaire
- Responsables de structures
- Ordonnateurs
- Audit

### 7.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| BUD-01 | Budget unique par exercice | Créer un Budget principal par exercice avec statut, version officielle et cycle de vie. |
| BUD-02 | Versions budgétaires | Gérer budget initial, révisions et versions approuvées immuables. |
| BUD-03 | Structure/nomenclature | Organiser sections/chapitres/articles/paragraphes/rubriques selon le référentiel applicable. |
| BUD-04 | Lignes budgétaires multidimensionnelles | Identifier chaque ligne par exercice/version, structure, nature, source et dimension PAP si applicable. |
| BUD-05 | Ventilations de financement | Gérer la part CEEAC/PTF et autres financeurs sans dupliquer l’objet budgétaire. |
| BUD-06 | Crédits autorisés | Calculer crédit initial + ouvertures + reports + transferts entrants - annulations - transferts sortants. |
| BUD-07 | Disponibilité | Calculer disponible à engager en tenant compte des gels, engagements nets et réservations actives. |
| BUD-08 | Réservations | Créer, libérer, consommer ou expirer les réservations de crédit selon règles. |
| BUD-09 | Mouvements de crédits | Gérer ouverture, transfert, virement, redéploiement, gel/dégel, annulation, report et régularisation. |
| BUD-10 | Contrôle des mouvements | Exiger motif, acte, autorité, pièces, origine, destination, montant et date d’effet. |
| BUD-11 | Import Budget | Importer XLSX/CSV et PDF exploitable avec mapping, prévalidation, contrôle des totaux et rapport d’erreurs. |
| BUD-12 | Situation à date | Restituer crédits, mouvements, engagements, disponibilités et exécution à une date donnée. |
| BUD-13 | Exécution budgétaire | Suivre engagé, liquidé, ordonnancé, payé et rapproché par ligne, structure, source et PAP. |
| BUD-14 | Budget vs réalisé | Comparer budget initial/révisé/exécuté et calculer taux, écarts et restes. |
| BUD-15 | Clôture et archivage | Passer les lignes et versions en état clôturé selon le module M17. |

### 7.4 Règles métier essentielles
- Le disponible négatif est interdit hors procédure exceptionnelle formalisée.
- Les montants financiers utilisent des types exacts NUMERIC/DECIMAL.
- Une version validée ne peut être écrasée ; toute évolution passe par un mouvement ou une nouvelle version.

### 7.5 Écrans / vues
- Dashboard Budget
- Exercices
- Versions
- Lignes
- Fiche ligne
- Mouvements
- Réservations
- Imports
- Situation à date
- Exécution
- Budget vs réalisé

### 7.6 Documents / sorties
- Budget approuvé
- Situation des crédits
- État des mouvements
- Exécution par ligne
- Exécution CEEAC/PTF
- Budget vs réalisé

### 7.7 Critères d’acceptation
- Un seul Budget officiel actif est possible par exercice.
- Deux opérations concurrentes ne peuvent provoquer un dépassement du disponible.

## 8. M04 — Chaîne de la dépense : EB → Engagement → Liquidation → Ordonnancement → Paiement

### 8.1 Finalité

Gérer le dossier de dépense de bout en bout, sans ressaisie, avec filiation des données, contrôles de crédit, workflows versionnés, documents officiels et transitions automatiques idempotentes.

### 8.2 Acteurs principaux
- Services initiateurs
- Direction du Budget
- Contrôle Financier Central
- Secrétaire Général
- Président/Ordonnateur principal
- Agence Comptable Centrale

### 8.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| DEP-01 | Dossier unique de dépense | Conserver la filiation et les références amont/aval de l’EB au rapprochement. |
| EB-01 | Classification PAP/HORS PAP | Classer chaque EB ; HORS PAP signifie fonctionnement, jamais hors Budget. |
| EB-02 | Saisie EB | Gérer objet, justification, bénéficiaire, structure, pièces, montant, lignes et imputation. |
| EB-03 | Imputation automatique | À partir de la ligne, charger budget, disponibilité, financement et rattachement PAP/RBM. |
| EB-04 | Multi-imputation | Ventiler une EB sur plusieurs lignes avec somme des imputations = montant du besoin. |
| EB-05 | Workflow HORS PAP | Expert/Chef SMG → DRHMG → SG → Président/Ordonnateur → Engagement automatique. |
| EB-06 | Workflow PAP technique | Expert/Chef Service → Directeur → Commissaire → Président → Engagement automatique. |
| EB-07 | Workflow PAP appui | Expert/Chef Service → Directeur → SG → Président → Engagement automatique. |
| EB-08 | Modification substantielle | Créer une nouvelle version et reprendre le circuit applicable depuis le début. |
| ENG-01 | Génération automatique Engagement | Créer un Engagement unique après approbation/signature définitive de l’EB. |
| ENG-02 | Contrôle Budget L1 | Expert Budget OU Chef Service Budget : contrôler, annoter, retourner, rejeter ou valider. |
| ENG-03 | Validation Directeur Budget | Effectuer le contrôle supérieur puis transmettre au Contrôle Financier. |
| ENG-04 | Visa final CFC | Valider définitivement l’Engagement et déclencher une Liquidation unique. |
| ENG-05 | Contrôle de crédit atomique | Verrouiller les agrégats nécessaires et empêcher toute double consommation. |
| LIQ-01 | Génération automatique Liquidation | Créer la Liquidation après validation définitive de l’Engagement. |
| LIQ-02 | Certification service fait | Faire certifier réception/service fait par le service initiateur résolu selon la nature du dossier. |
| LIQ-03 | Calcul du dû | Gérer brut, retenues, pénalités, avances, acomptes, taxes, quantités et net à payer. |
| LIQ-04 | Liquidations partielles | Autoriser plusieurs liquidations dans la limite de l’Engagement net. |
| LIQ-05 | Visa CFC Liquidation | Retourner, rejeter ou viser ; le visa final génère l’Ordonnancement. |
| LIQ-06 | Rectification après visa | Créer avoir, liquidation complémentaire ou régularisation sans modifier l’original visé. |
| ORD-01 | Génération automatique Ordonnancement | Créer l’ORD après visa final de la Liquidation. |
| ORD-02 | Contrôles automatiques ORD | Vérifier filiation, plafonds, pièces, tiers, source, SoD, doublons et cohérence. |
| ORD-03 | Routage par seuil | Montant ≤ 5 000 000 XAF : SG ; montant > 5 000 000 XAF : Président, seuil versionné. |
| ORD-04 | Signature | Enregistrer signataire, date, méthode, version et preuve de signature. |
| PAY-01 | Génération automatique Payment | Après signature ORD, créer un dossier Payment unique transmis à l’ACC. |
| PAY-02 | Prise en charge ACC | Comptable OU Chef Service Comptabilité examine, contrôle et prépare le règlement. |
| PAY-03 | Validation Agent Comptable | Agent Comptable Central valide et signe le Paiement avant exécution. |
| PAY-04 | Paiement caisse | Contrôler caisse, session, solde, plafond, bon, quittance et mouvement. |
| PAY-05 | Paiement chèque | Gérer comptes, chéquiers, numéros uniques, états et rapprochement. |
| PAY-06 | Virement bancaire | Gérer instruction idempotente, compte bénéficiaire, preuves et confirmation externe. |
| PAY-07 | Paiements partiels | Autoriser plusieurs règlements dans la limite de l’Ordonnancement pris en charge. |
| PAY-08 | Rapprochement | Distinguer paiement préparé, validé, exécuté et rapproché ; rapprocher banque/caisse. |
| DEP-02 | Restes automatiques | Calculer reste à liquider, ordonnancer et payer. |
| DEP-03 | Bandeau de dossier | Afficher statut, dernière action, acteur attendu, prochaine étape, SLA, filiation et situation financière. |
| DEP-04 | Documents automatiques | Générer les documents officiels EB/ENG/LIQ/ORD/PAY à partir des données validées. |

### 8.4 Règles métier essentielles
- Aucune transition automatique ne peut créer de doublon : toutes les créations aval sont idempotentes.
- LIQ cumulée ≤ ENG net ; ORD cumulé ≤ LIQ validée ; PAY cumulé ≤ ORD pris en charge.
- Le Président n’est pas revalidateur de l’Engagement après avoir approuvé l’EB.
- Le CFC n’est pas revalidateur de l’Ordonnancement dans le workflow consolidé.

### 8.5 Écrans / vues
- Dashboard chaîne de dépense
- EB liste/détail/formulaire
- Engagements
- Liquidations
- Rectifications
- Ordonnancements
- Paiements
- Rapprochements
- Mes dossiers
- Historique/timeline

### 8.6 Documents / sorties
- Fiche EB
- Certificat/Fiche Engagement
- Liquidation
- Certificat de service fait
- Ordonnancement/mandat
- Ordre de règlement
- Bordereaux
- Rapport de rapprochement

### 8.7 Critères d’acceptation
- Une EB approuvée génère exactement un Engagement.
- Un visa final ENG génère exactement une Liquidation.
- Un visa final LIQ génère exactement un Ordonnancement dans la transaction critique.
- Une signature ORD génère exactement un Payment transmis à l’ACC.

## 9. M05 — Tiers, entreprises et bénéficiaires

### 9.1 Finalité

Maintenir un référentiel unique, multi-rôles et sécurisé de tous les tiers utilisés dans les opérations budgétaires et financières.

### 9.2 Acteurs principaux
- Administration fonctionnelle
- Achats/marchés
- Budget
- Agence Comptable
- Audit

### 9.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| TIE-01 | Référentiel unique | Créer une fiche tiers unique évitant les doublons fonctionnels. |
| TIE-02 | Multi-rôles | Attribuer fournisseur, prestataire, consultant, soumissionnaire, attributaire, créancier, bénéficiaire, PTF/bailleur. |
| TIE-03 | Identité juridique | Gérer raison sociale, forme, identifiants, pays, adresses, contacts et représentants. |
| TIE-04 | Conformité | Gérer pièces administratives, dates de validité, listes de contrôle et statut de conformité. |
| TIE-05 | Comptes bancaires | Versionner et protéger coordonnées bancaires ; historiser changements et justificatifs. |
| TIE-06 | Alerte changement sensible | Déclencher contrôle renforcé après modification récente de compte ou identité. |
| TIE-07 | Dédoublonnage | Détecter similitudes par identifiant, nom, compte, contact ou document. |
| TIE-08 | Risque tiers | Attribuer niveau de risque et observations selon règles de contrôle interne. |
| TIE-09 | Historique d’activité | Afficher contrats, engagements, liquidations, paiements, incidents et documents liés. |
| TIE-10 | Import/export tiers | Importer et exporter selon droits, avec rapport d’anomalies. |

### 9.4 Règles métier essentielles
- Un compte bancaire déjà utilisé n’est pas remplacé rétroactivement ; une nouvelle version est créée.
- Les tiers utilisés par une opération ne peuvent être supprimés physiquement.

### 9.5 Écrans / vues
- Liste tiers
- Fiche tiers
- Rôles
- Conformité
- Comptes bancaires
- Historique
- Doublons/alertes

### 9.6 Documents / sorties
- Fiche tiers
- Liste de conformité
- Rapport de doublons
- Historique des comptes

### 9.7 Critères d’acceptation
- Un changement de compte bancaire est versionné, justifié et audité.
- Le système bloque l’utilisation d’un tiers inactif ou non conforme selon la règle applicable.

## 10. M06 — Achats, marchés et contrats

### 10.1 Finalité

Planifier, référencer ou gérer les achats et marchés reliés à la programmation budgétaire et à la chaîne de dépense, sans ressaisie des données déjà disponibles.

### 10.2 Acteurs principaux
- Achats/marchés
- Structures demandeuses
- Commissions habilitées
- Budget
- Contrôle financier
- Audit

### 10.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| ACH-01 | Plan de passation/achats | Planifier les achats par exercice, structure, nature, montant, financement et calendrier. |
| ACH-02 | Consultations | Créer consultations, lots, critères, calendrier, pièces et invitations. |
| ACH-03 | Soumissionnaires | Associer les tiers candidats et leurs documents. |
| ACH-04 | Évaluation | Enregistrer évaluations techniques/financières, scores, commentaires et décisions. |
| ACH-05 | Attribution | Formaliser attributaire, décision, montant et pièces. |
| ACH-06 | Contrats/marchés | Gérer référence, objet, montant, période, parties, financement, lignes, clauses et statut. |
| ACH-07 | Bons de commande | Émettre et suivre les bons selon contrat ou procédure autorisée. |
| ACH-08 | Avenants | Versionner les modifications de montant, délai, objet ou conditions. |
| ACH-09 | Garanties et avances | Suivre garanties, retenues, avances, échéances et mainlevées. |
| ACH-10 | Réceptions/livrables | Enregistrer réceptions partielles/définitives, livrables et réserves. |
| ACH-11 | Lien avec dépense | Réutiliser contrat, tiers, montants, lignes et pièces dans ENG/LIQ sans ressaisie. |
| ACH-12 | Interopérabilité achats | Si un système spécialisé existe, référencer les objets externes via API et conserver la traçabilité. |

### 10.4 Règles métier essentielles
- Les montants engagés/liquidés rattachés à un contrat respectent ses plafonds et avenants validés.
- Une donnée issue d’un système achats intégré n’est pas ressaisie si un identifiant fiable est disponible.

### 10.5 Écrans / vues
- Plan achats
- Consultations
- Évaluations
- Attributions
- Contrats
- Avenants
- Réceptions
- Garanties

### 10.6 Documents / sorties
- Plan d’achats
- Rapport d’évaluation
- Décision d’attribution
- Fiche contrat
- Situation d’exécution contractuelle

### 10.7 Critères d’acceptation
- Un contrat validé est directement sélectionnable dans l’Engagement et la Liquidation avec ses données contrôlées.

## 11. M07 — Recettes

### 11.1 Finalité

Gérer les prévisions et l’exécution des recettes dans la limite du périmètre validé, avec rapprochement et reporting.

### 11.2 Acteurs principaux
- Direction du Budget
- Agence Comptable
- Structures habilitées
- Audit

### 11.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| REC-01 | Prévisions de recettes | Saisir les prévisions par nature, source, période et contributeur. |
| REC-02 | Titres/ordres de recettes | Émettre ou référencer les titres selon règles institutionnelles. |
| REC-03 | Liquidation de recettes | Constater le droit et le montant dû. |
| REC-04 | Recouvrement | Suivre échéances, paiements reçus, relances et soldes. |
| REC-05 | Encaissement | Enregistrer encaissements caisse/banque ou via interface comptable. |
| REC-06 | Arriérés | Identifier, classer et suivre les créances en retard. |
| REC-07 | Contributions statutaires | Suivre appels, échéances et règlements selon le référentiel applicable. |
| REC-08 | Financements PTF | Tracer versements, conventions, tranches et conditions de financement. |
| REC-09 | Rapprochement recettes | Rapprocher encaissements avec banques/comptabilité. |
| REC-10 | Reporting recettes | Comparer prévisions/réalisations et analyser les écarts. |

### 11.4 Règles métier essentielles
- Le périmètre de comptabilité générale reste une interface tant qu’il n’est pas formellement confié à BUDGET-CEEAC.
- Toute recette encaissée conserve une preuve et un statut de rapprochement.

### 11.5 Écrans / vues
- Prévisions
- Titres
- Recouvrement
- Encaissements
- Arriérés
- Contributions
- Rapprochement
- Dashboard recettes

### 11.6 Documents / sorties
- Situation des recettes
- Arriérés
- Contributions statutaires
- Exécution par source

### 11.7 Critères d’acceptation
- Les encaissements peuvent être rapprochés avec les références externes sans double comptabilisation.

## 12. M08 — Suivi-Évaluation et performance

### 12.1 Finalité

Suivre les réalisations physiques et financières, mesurer les écarts, documenter les preuves, conduire les évaluations et suivre les recommandations.

### 12.2 Acteurs principaux
- SPSE/structures S&E
- Responsables d’activités
- Directions
- Commissaires/SG
- Pilotage

### 12.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| SE-01 | Plan de suivi | Définir périodicités, responsables, sources, échéances et mécanismes de validation. |
| SE-02 | Collecte des réalisations | Saisir ou importer valeurs, commentaires et preuves par période. |
| SE-03 | Validation des données | Soumettre, retourner et valider les réalisations selon workflow. |
| SE-04 | Suivi des activités | Suivre état, jalons, livrables, dates, difficultés et actions correctives. |
| SE-05 | Suivi financier | Consommer exclusivement les données validées de la chaîne budgétaire, sans ressaisie des paiements. |
| SE-06 | Analyse des écarts | Comparer cibles/réalisations et budget/exécution avec seuils paramétrables. |
| SE-07 | Alertes de performance | Détecter retard, sous-performance, surcoût ou absence de données. |
| SE-08 | Évaluations | Planifier et documenter évaluations, constats, conclusions et leçons. |
| SE-09 | Recommandations | Créer recommandations, responsables, échéances, preuves et statut de mise en œuvre. |
| SE-10 | Revues de performance | Préparer revues périodiques et tableaux de bord physiques-financiers. |
| SE-11 | Historisation | Conserver toutes les versions après révision d’un PAP ou correction d’une réalisation. |
| SE-12 | Export contrôlé | Exporter selon périmètre d’autorisation et définitions gouvernées. |

### 12.4 Règles métier essentielles
- Une donnée manquante n’est jamais assimilée automatiquement à zéro.
- Une réalisation validée n’est pas écrasée ; une correction crée une nouvelle version.
- Le suivi financier provient des données d’exécution réelles.

### 12.5 Écrans / vues
- Dashboard S&E
- Plan de suivi
- Collecte
- Validation
- Activités
- Écarts
- Évaluations
- Recommandations
- Revues

### 12.6 Documents / sorties
- Rapport de performance
- Exécution physique-financière
- Rapport d’évaluation
- Suivi des recommandations

### 12.7 Critères d’acceptation
- Un indicateur et ses preuves permettent de reconstituer toutes les valeurs historiques par période.

## 13. M09 — PAP, GAR et RBM

### 13.1 Finalité

Modéliser la chaîne de résultats et relier stratégie, ressources, activités, produits, indicateurs et Budget sans duplication de lignes.

### 13.2 Acteurs principaux
- Planification/PAP
- Structures opérationnelles
- Budget
- S&E
- Pilotage

### 13.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| RBM-01 | Hiérarchie de résultats | Gérer Pilier → Axe → Produit → Sous-produit → Activité → Tâche, avec types explicites et versionnés. |
| RBM-02 | Version du PAP | Créer le PAP annuel intégré au Budget de l’exercice. |
| RBM-03 | Responsabilités | Affecter structures et responsables aux nœuds et périodes. |
| RBM-04 | Planification des activités | Définir dates, jalons, livrables, coûts, financements et responsables. |
| RBM-05 | Allocations Budget-PAP | Relier lignes budgétaires et nœuds PAP par tables d’allocation, montant ou clé de ventilation. |
| RBM-06 | Indicateurs | Associer indicateurs aux résultats/produits/activités. |
| RBM-07 | Cibles | Définir baseline et cibles périodiques. |
| RBM-08 | Révisions PAP | Versionner toute modification et préserver les liens historiques avec dépenses et résultats. |
| RBM-09 | Contrôle de cohérence | Détecter nœuds orphelins, coûts non financés, indicateurs absents, dates invalides et doublons. |
| RBM-10 | Contribution multi-lignes | Autoriser plusieurs lignes pour une activité et plusieurs activités pour une ligne via allocations contrôlées. |
| RBM-11 | Navigation arborescente | Afficher arbre, matrice, calendrier et vue budgétaire. |
| RBM-12 | Traçabilité résultat-dépense | Drill-down du résultat jusqu’aux lignes, EB, paiements et preuves. |

### 13.4 Règles métier essentielles
- Le PAP est une composante du Budget unique, pas un Budget distinct.
- Le type d’un nœud RBM est un attribut et ne dépend pas de la longueur du code.
- Aucune ligne PAP autonome ne duplique une ligne budgétaire.

### 13.5 Écrans / vues
- PAP annuel
- Arbre RBM
- Matrice PAP
- Allocations Budget-PAP
- Activités/tâches
- Indicateurs
- Révisions
- Cohérences

### 13.6 Documents / sorties
- PAP consolidé
- Matrice RBM
- Plan d’activités
- Allocation Budget-PAP
- Rapport de cohérence

### 13.7 Critères d’acceptation
- Toute dépense PAP peut être reliée à son nœud RBM et à la ligne budgétaire source.

## 14. M10 — Dashboards, reporting et Business Intelligence

### 14.1 Finalité

Fournir des indicateurs gouvernés, des rapports fiables et un drill-down complet, avec la même définition de métrique sur écran, export, API et BI.

### 14.2 Acteurs principaux
- Direction générale
- Budget
- S&E
- Contrôle
- Audit
- Structures
- DSI/BI

### 14.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| RPT-01 | Catalogue de métriques | Définir formule, source, granularité, date d’effet, propriétaire et dimensions de chaque KPI. |
| RPT-02 | Dashboard exécutif | Budget, PAP, exécution, performance, alertes, délais et risques. |
| RPT-03 | Dashboard Budget | Crédits, mouvements, disponibilité, exécution et écarts. |
| RPT-04 | Dashboard chaîne de dépense | Volumes et montants EB/ENG/LIQ/ORD/PAY, restes, délais et goulots. |
| RPT-05 | Dashboard PAP/S&E | Cibles, réalisations, performance physique-financière et alertes. |
| RPT-06 | Dashboard PTF | Exécution par source, bailleur, convention, programme et activité. |
| RPT-07 | Reporting contrôle/audit | Anomalies, SoD, risques, réserves, recommandations et sécurité. |
| RPT-08 | Filtres globaux | Exercice, période, version, structure, nature, ligne, source, PAP, tiers, statut et étape. |
| RPT-09 | Drill-down | Total → source → structure → nature → ligne → dossier → document/preuve. |
| RPT-10 | Rapports paramétrés | Générer PDF/Excel/CSV selon droits et modèles officiels. |
| RPT-11 | Planification des rapports | Programmer production/diffusion selon calendrier et destinataires. |
| RPT-12 | Exports lourds asynchrones | Exécuter les rapports volumineux en tâche contrôlée sans bloquer les transactions. |
| RPT-13 | BI/Data Warehouse | Exposer des données gouvernées en lecture seule sans redéfinir les règles financières. |
| RPT-14 | Qualité et réconciliation | Afficher date de rafraîchissement, source et contrôles de cohérence. |

### 14.4 Règles métier essentielles
- Aucun KPI fictif ou codé en dur ; toute métrique doit provenir de données opérationnelles gouvernées.
- Power BI ou tout outil externe ne redéfinit pas les règles financières.

### 14.5 Écrans / vues
- Cockpit exécutif
- Dashboard Budget
- Dashboard dépense
- Dashboard PAP/S&E
- Dashboard PTF
- Catalogue rapports
- Générateur
- Historique exports

### 14.6 Documents / sorties
- Situation globale Budget
- Exécution par ligne
- PAP consolidé
- Chaîne de dépense
- Restes
- Délais/SLA
- PTF
- Audit
- SoD
- Rapprochement

### 14.7 Critères d’acceptation
- Un même KPI produit la même valeur sur dashboard, export et API pour un même filtre et une même date.

## 15. M11 — GED, documents et signatures

### 15.1 Finalité

Conserver les preuves et documents de manière versionnée, vérifiable, indexée et liée aux objets métier.

### 15.2 Acteurs principaux
- Tous utilisateurs selon droits
- Secrétariats
- Contrôleurs
- Ordonnateurs
- Agence Comptable
- Audit

### 15.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| GED-01 | Document logique/version physique | Séparer document métier et versions de fichiers. |
| GED-02 | Métadonnées | Type, référence, auteur, date, statut, classification, confidentialité, objet lié. |
| GED-03 | Hash d’intégrité | Calculer et conserver SHA-256 ou mécanisme équivalent pour vérification. |
| GED-04 | Contrôle MIME/antivirus | Valider type réel, taille et sécurité du fichier avant stockage. |
| GED-05 | Catalogue de pièces | Appliquer les pièces obligatoires selon règles du module M01. |
| GED-06 | Versioning | Une correction ajoute une version ; une pièce ayant servi à validation n’est jamais remplacée. |
| GED-07 | Prévisualisation | Prévisualiser PDF/images et télécharger selon habilitation. |
| GED-08 | Génération PDF | Générer les documents officiels à partir des données validées. |
| GED-09 | Signature/visa | Associer signataire, méthode, horodatage, preuve et statut. |
| GED-10 | Vérification | Option de QR/code ou identifiant de vérification pour documents officiels. |
| GED-11 | Indexation/recherche | Rechercher par métadonnées, référence, dossier, tiers, exercice et type. |
| GED-12 | Archivage/rétention | Appliquer politique de conservation et gel juridique selon décisions institutionnelles. |
| GED-13 | Accès sensible | Journaliser consultation/téléchargement des pièces classifiées. |

### 15.4 Règles métier essentielles
- Une pièce utilisée dans une décision reste immuable et consultable dans son état d’origine.
- Les documents générés reflètent exclusivement les données et signataires validés.

### 15.5 Écrans / vues
- Documents
- Pièces du dossier
- Prévisualisation
- Versions
- Signatures
- Recherche documentaire
- Archivage

### 15.6 Documents / sorties
- Documents officiels des processus
- Bordereaux
- Rapports
- Journal d’intégrité documentaire

### 15.7 Critères d’acceptation
- Le hash et la version permettent de vérifier qu’une pièce de validation n’a pas été remplacée.

## 16. M12 — Workflow, validations et Mes tâches

### 16.1 Finalité

Fournir un moteur générique d’états et de tâches comme source unique de vérité pour statuts, acteurs attendus, SLA, délégations et transitions.

### 16.2 Acteurs principaux
- Administrateur fonctionnel workflow
- Tous validateurs
- Managers
- Audit

### 16.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| WF-01 | Définition de workflow | Créer processus, versions, étapes, transitions, conditions et actions. |
| WF-02 | Activation à date | Activer une version à une date précise et conserver les anciennes instances. |
| WF-03 | Résolution d’acteur | Résoudre poste/rôle selon structure, montant, source, période, délégation et intérim. |
| WF-04 | Tâches | Créer tâches unitaires avec propriétaire, SLA, priorité, date et contexte. |
| WF-05 | Mes tâches | Lister par date décroissante, étape, priorité, module, montant et échéance. |
| WF-06 | Actions | Soumettre, valider, viser, signer, retourner, rejeter, annuler, clôturer selon droits. |
| WF-07 | Retours | Conserver dossier, motif et historique, puis créer la tâche à l’étape cible. |
| WF-08 | Rejets | Exiger motif/classification et clôturer ou router selon règle. |
| WF-09 | Délégations/suppléances | Prendre en compte les affectations datées au moment de la résolution. |
| WF-10 | SLA/escalades | Calculer échéance, rappels et escalade selon calendrier ouvré. |
| WF-11 | Idempotence | Empêcher le double traitement d’une décision ou transition répétée. |
| WF-12 | Migration de workflow | Supporter grandfathering, boundary migration, direct migration ou régularisation. |
| WF-13 | Timeline | Afficher décisions, acteurs, dates, commentaires et changements d’état. |
| WF-14 | Source unique de vérité | Statut, bandeau, Mes tâches, notification et acteur attendu dérivent de la même instance. |

### 16.4 Règles métier essentielles
- Aucune prochaine étape ne doit être codée dans une page UI.
- Les décisions historiques ne sont jamais supprimées.
- Une action répétée ne produit jamais un double effet financier.

### 16.5 Écrans / vues
- Définitions
- Versions
- Étapes/transitions
- Mes tâches
- Détail tâche
- Timeline
- Délégations
- Migrations

### 16.6 Documents / sorties
- Historique workflow
- Rapport SLA
- Rapport tâches
- Rapport migrations

### 16.7 Critères d’acceptation
- Tâche, statut, bandeau et notification indiquent toujours le même acteur attendu.

## 17. M13 — Notifications, alertes et communications

### 17.1 Finalité

Informer les acteurs au bon moment sans générer de bruit ni de doublons, et tracer les communications liées aux processus.

### 17.2 Acteurs principaux
- Tous utilisateurs
- Managers
- Administrateurs fonctionnels
- DSI

### 17.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| NOT-01 | Centre de notifications | Afficher notifications lues/non lues avec lien vers le dossier. |
| NOT-02 | Événements métier | Déclencher notification sur soumission, retour, validation, rejet, signature, retard et anomalie. |
| NOT-03 | Rappels SLA | Notifier avant échéance puis escalader selon règle. |
| NOT-04 | Canaux | In-app, e-mail et autres canaux institutionnels autorisés. |
| NOT-05 | Préférences | Gérer préférences non critiques sans permettre de désactiver les alertes obligatoires. |
| NOT-06 | Modèles | Versionner objet, corps, variables, langue et catégorie. |
| NOT-07 | Anti-duplication | Utiliser clé d’événement/idempotence pour éviter plusieurs messages identiques. |
| NOT-08 | Escalades hiérarchiques | Notifier le responsable supérieur ou rôle de contrôle en cas de retard critique. |
| NOT-09 | Alertes financières | Crédit faible/épuisé, dépassement, mouvement majeur, anomalie d’imputation. |
| NOT-10 | Alertes de sécurité | Connexion suspecte, changement compte bancaire, export massif, conflit SoD. |
| NOT-11 | Historique de diffusion | Conserver destinataire, canal, statut, date, erreur et nouvelle tentative. |

### 17.4 Règles métier essentielles
- Les notifications ne remplacent jamais le workflow ; elles reflètent son état.
- Une notification critique doit être traçable jusqu’à l’événement source.

### 17.5 Écrans / vues
- Centre notifications
- Alertes
- Préférences
- Modèles
- Historique diffusion

### 17.6 Documents / sorties
- Rapport notifications
- Rapport alertes
- Suivi SLA/escalades

### 17.7 Critères d’acceptation
- Un événement idempotent n’envoie pas plusieurs notifications identiques au même destinataire.

## 18. M14 — Contrôle budgétaire et contrôle interne

### 18.1 Finalité

Automatiser les contrôles répétitifs, documenter les contrôles humains et sécuriser Budget, dépenses, financements, habilitations et pièces sans créer de doublon avec l’audit indépendant.

### 18.2 Acteurs principaux
- Contrôleurs budgétaires
- Contrôle Financier Central
- Responsables de contrôle interne
- Managers
- Audit en consultation

### 18.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| CTL-01 | Moteur de règles de contrôle | Paramétrer code, module, condition, criticité, effet, rôle responsable, période et version. |
| CTL-02 | Contrôle disponibilité | Vérifier crédits autorisés, réservations, engagements et consommation avant opération. |
| CTL-03 | Contrôle imputation | Vérifier exercice, ligne active, nature, source, structure et multi-imputation. |
| CTL-04 | Contrôle PAP/RBM | Vérifier cohérence Budget-PAP-RBM, montants, exercice, financement et programmation. |
| CTL-05 | Contrôle workflow | Vérifier validations, rôles, seuils, délais et pièces requises. |
| CTL-06 | Contrôle seuils | Identifier automatiquement l’autorité requise à partir des règles versionnées. |
| CTL-07 | Séparation des fonctions | Bloquer ou signaler les incompatibilités de rôles et d’actions. |
| CTL-08 | Contrôle pièces | Détecter absence, expiration, type incorrect ou incohérence documentaire. |
| CTL-09 | Contrôle tiers | Vérifier statut, conformité, doublons, comptes et changements sensibles. |
| CTL-10 | Contrôle mouvements | Contrôler origine/destination, acte, autorité, impact et disponibilités. |
| CTL-11 | Anomalies/non-conformités | Créer incident avec criticité, responsable, statut, cause et historique. |
| CTL-12 | Réserves | Enregistrer motif, action attendue, échéance et décision de levée. |
| CTL-13 | Dérogations/exceptions | Documenter exception, base, autorité, durée et contrôles compensatoires. |
| CTL-14 | Plan de contrôle | Programmer contrôles périodiques, ciblés ou par échantillonnage. |
| CTL-15 | Matrice des risques de processus | Relier risque, cause, impact, probabilité, contrôle, propriétaire et action. |
| CTL-16 | Contrôle continu | Exécuter des contrôles automatiques périodiques et produire alertes. |
| CTL-17 | Plan d’actions correctives | Suivre responsables, échéances, preuves et clôture. |
| CTL-18 | Indicateurs de contrôle | Taux de conformité, anomalies, blocages, délais de correction, risques critiques. |

### 18.4 Règles métier essentielles
- Les contrôles bloquants empêchent la poursuite tant qu’ils ne sont pas levés par une procédure autorisée.
- Le contrôle interne exécute/encadre des contrôles ; l’audit interne conserve son indépendance d’évaluation.

### 18.5 Écrans / vues
- Dashboard contrôle
- Centre de contrôle
- Règles
- Anomalies
- Réserves
- Dérogations
- Plan de contrôle
- Matrice risques
- Actions correctives

### 18.6 Documents / sorties
- Rapport de contrôle
- Anomalies
- Réserves
- Matrice risques
- Plan d’actions
- Conformité SoD

### 18.7 Critères d’acceptation
- Chaque anomalie permet de retrouver règle, objet, acteur, date, décision et preuve de correction.

## 19. M15 — Audit, risques et conformité

### 19.1 Finalité

Garantir une piste d’audit append-only, permettre les missions d’audit, l’analyse des risques, les recommandations et la surveillance de conformité.

### 19.2 Acteurs principaux
- Audit Interne
- Contrôle interne
- RSSI
- Direction
- Auditeurs autorisés

### 19.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| AUD-01 | Journal append-only | Enregistrer authentifications, CRUD sensibles, validations, signatures, mouvements, exports, transitions et intégrations. |
| AUD-02 | Recherche audit | Filtrer par utilisateur, module, objet, période, action, IP/session, résultat et criticité. |
| AUD-03 | Vue avant/après | Conserver valeurs anciennes/nouvelles pour les modifications structurées. |
| AUD-04 | Chronologie dossier | Reconstituer toutes les actions d’un dossier et sa filiation. |
| AUD-05 | Missions d’audit | Planifier mission, périmètre, équipe, calendrier, objectifs et travaux. |
| AUD-06 | Constats | Enregistrer constat, critère, cause, impact, preuve et criticité. |
| AUD-07 | Recommandations | Attribuer responsable, échéance, priorité et preuves de mise en œuvre. |
| AUD-08 | Suivi des recommandations | Mesurer retard, taux de mise en œuvre et clôture. |
| AUD-09 | Cartographie des risques | Maintenir risques stratégiques, opérationnels, financiers, fraude, SI et conformité. |
| AUD-10 | Conformité | Suivre contrôles par référentiel/obligation applicable. |
| AUD-11 | Événements critiques | Surveiller changements de droits, comptes bancaires, exports massifs, tentatives de contournement. |
| AUD-12 | Export probatoire | Produire rapports scellés et auditables selon habilitation. |

### 19.4 Règles métier essentielles
- L’Audit Interne a un accès transversal en lecture conforme à sa mission, sans exécuter les opérations métier.
- Aucun utilisateur normal ne peut modifier ou supprimer le journal d’audit.

### 19.5 Écrans / vues
- Journal événements
- Explorateur audit
- Missions
- Constats
- Recommandations
- Risques
- Conformité
- Événements critiques

### 19.6 Documents / sorties
- Journal d’audit
- Rapport de mission
- Suivi recommandations
- Cartographie risques
- Rapport conformité

### 19.7 Critères d’acceptation
- Un auditeur peut reconstituer qui a fait quoi, quand, sur quel objet, avec quelles valeurs et quel résultat.

## 20. M16 — Projets et investissements

### 20.1 Finalité

Piloter les projets/investissements financés par le Budget/PAP et leurs jalons, coûts, financements, contrats, livrables et risques.

### 20.2 Acteurs principaux
- Chefs de projets
- Structures techniques
- Budget
- S&E
- PTF
- Direction

### 20.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| PRJ-01 | Portefeuille de projets | Créer projets avec code, sponsor, responsable, période, objectif, statut et priorité. |
| PRJ-02 | Fiche projet | Business case, justification, périmètre, bénéficiaires et résultats attendus. |
| PRJ-03 | Budget projet | Relier lignes budgétaires, allocations PAP et sources de financement. |
| PRJ-04 | Planification | Jalons, activités, tâches, dépendances et calendrier. |
| PRJ-05 | Financement PTF | Conventions, tranches, conditions, cofinancements et échéances. |
| PRJ-06 | Contrats/lots | Associer marchés, contrats, avenants et livrables. |
| PRJ-07 | Exécution financière | Agrégation ENG/LIQ/ORD/PAY du projet. |
| PRJ-08 | Exécution physique | Progression, livrables, jalons et preuves. |
| PRJ-09 | Risques/problèmes | Registre, probabilité, impact, responsable et action. |
| PRJ-10 | Changements | Gérer demandes de changement de coût, délai, périmètre et financement. |
| PRJ-11 | Clôture projet | Bilan, réception, solde, leçons apprises et archivage. |
| PRJ-12 | Dashboard portefeuille | Coût, avancement, risques, retard et performance. |

### 20.4 Règles métier essentielles
- Les données financières projet proviennent des objets réels de la chaîne de dépense.
- Toute modification majeure de coût/périmètre doit être versionnée et autorisée.

### 20.5 Écrans / vues
- Portefeuille
- Fiche projet
- Planning
- Budget/financement
- Contrats
- Risques
- Changements
- Dashboard

### 20.6 Documents / sorties
- Fiche projet
- Rapport d’avancement
- Situation financière
- Registre risques
- Rapport de clôture

### 20.7 Critères d’acceptation
- Un projet peut être analysé simultanément en avancement physique et exécution financière sans ressaisie.

## 21. M17 — Clôture budgétaire

### 21.1 Finalité

Organiser la pré-clôture, l’arrêté des opérations, les reports/annulations, rapprochements, clôture du PAP, archivage et reprise N+1 de façon contrôlée.

### 21.2 Acteurs principaux
- Direction du Budget
- Contrôle Financier
- Agence Comptable
- S&E/PAP
- SG/Ordonnateur
- Audit

### 21.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| CLO-01 | Calendrier de clôture | Définir jalons, dates limites, responsabilités et verrouillages progressifs. |
| CLO-02 | Pré-clôture | Inventorier crédits, mouvements, dossiers en cours, recettes, rapprochements et anomalies. |
| CLO-03 | Gel des opérations | Bloquer ou restreindre créations/modifications selon phase de clôture. |
| CLO-04 | Traitement EB en cours | Classer annulation, report, poursuite ou reprise N+1 selon état et règle. |
| CLO-05 | Engagements non liquidés | Identifier restes, annulations, reports ou rattachements autorisés. |
| CLO-06 | Liquidations en cours | Contrôler service fait, factures, visas et rattachements de période. |
| CLO-07 | Ordonnancements/paiements | Traiter ordres non payés, paiements en cours et rapprochements. |
| CLO-08 | Reports N→N+1 | Créer les opérations de report avec source, destination, acte et traçabilité. |
| CLO-09 | Annulations de crédits | Annuler soldes selon décision, nature et financement. |
| CLO-10 | Clôture PTF | Distinguer soldes, engagements, conditions de convention et reports autorisés. |
| CLO-11 | Clôture PAP | Arrêter activités, cibles, réalisations et situation physique-financière. |
| CLO-12 | Contrôles de clôture | Vérifier équilibres, plafonds, dossiers orphelins, pièces, rapprochements et anomalies bloquantes. |
| CLO-13 | Clôture provisoire | Produire états d’arrêté et période de correction contrôlée. |
| CLO-14 | Clôture définitive | Verrouiller Budget, versions, lignes, dossiers et états officiels. |
| CLO-15 | Réouverture exceptionnelle | Autoriser réouverture limitée, motivée, approuvée, datée et totalement auditée. |
| CLO-16 | Reprise N+1 | Créer les éléments autorisés de l’exercice suivant sans modifier l’exercice clos. |
| CLO-17 | Archivage | Constituer paquet de clôture, index, documents, journaux et preuves. |
| CLO-18 | Rapport de clôture | Produire synthèse Budget/PAP/dépense/financement/anomalies. |

### 21.4 Règles métier essentielles
- Une clôture définitive rend l’exercice non modifiable hors procédure exceptionnelle formalisée.
- Les reports N→N+1 créent de nouveaux objets liés aux objets sources, sans réécriture du passé.

### 21.5 Écrans / vues
- Dashboard clôture
- Calendrier
- Pré-clôture
- Dossiers en cours
- Reports
- Annulations
- Rapprochements
- Clôture PAP
- Contrôles
- Réouverture
- Archivage

### 21.6 Documents / sorties
- Situation de pré-clôture
- État des restes
- État des reports
- Annulations
- Arrêté PAP
- Rapport de clôture
- Dossier d’archives

### 21.7 Critères d’acceptation
- Après clôture définitive, aucune transaction métier de l’exercice n’est modifiable par le circuit ordinaire.

## 22. M18 — Référentiels financiers et budgétaires

### 22.1 Finalité

Centraliser les nomenclatures, classifications, sources de financement et dimensions financières utilisées par tous les modules.

### 22.2 Acteurs principaux
- Direction du Budget
- Administration fonctionnelle
- Agence Comptable en consultation
- Audit

### 22.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| REF-01 | Nomenclature économique | Versionner titres/articles/paragraphes/rubriques ou structure officielle applicable. |
| REF-02 | Classification administrative | Relier structures, centres de responsabilité et centres de coût. |
| REF-03 | Sources de financement | CEEAC, PTF, bailleurs, fonds et autres sources autorisées. |
| REF-04 | Bailleurs/PTF | Référentiel des partenaires, conventions et identifiants. |
| REF-05 | Natures de dépense/recette | Catégoriser opérations pour contrôle, reporting et pièces. |
| REF-06 | Devises et taux | Gérer devises autorisées, source, date et taux applicables. |
| REF-07 | Comptes bancaires institutionnels | Référencer comptes CEEAC, statut, banque, devise et usage. |
| REF-08 | Caisses | Référencer caisses et paramètres de fonctionnement. |
| REF-09 | Taxes/retenues | Paramétrer types et règles seulement après validation du référentiel applicable. |
| REF-10 | Localisations/projets | Dimensions supplémentaires lorsque nécessaires à la clé de ligne. |
| REF-11 | Versioning référentiel | Activer à date et préserver les codes historiques utilisés. |
| REF-12 | Mapping ancien→nouveau | Maintenir tables de correspondance pour migrations et réorganisations. |

### 22.4 Règles métier essentielles
- Les libellés ne constituent jamais une clé fonctionnelle de ligne.
- Une valeur de référentiel utilisée n’est pas supprimée physiquement.

### 22.5 Écrans / vues
- Nomenclature
- Sources
- PTF
- Natures
- Devises/taux
- Comptes
- Caisses
- Taxes/retenues
- Mappings

### 22.6 Documents / sorties
- Nomenclature officielle
- Référentiel financements
- Historique des versions
- Mappings de migration

### 22.7 Critères d’acceptation
- Un dossier historique reste interprétable avec la version de référentiel qui lui était applicable.

## 23. M19 — Administration technique, sécurité et habilitations

### 23.1 Finalité

Protéger l’application, les identités, les droits, les données et l’exploitation tout en empêchant l’administration technique de contourner les contrôles financiers.

### 23.2 Acteurs principaux
- DSI
- RSSI
- Administrateurs IAM
- Responsables métiers
- Audit

### 23.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| SEC-01 | Cycle de vie des comptes | Provisioning, activation, suspension, désactivation, expiration et révocation des sessions. |
| SEC-02 | SSO/OIDC | Intégrer l’authentification institutionnelle lorsque disponible. |
| SEC-03 | MFA | Imposer authentification multifacteur pour rôles sensibles selon politique. |
| SEC-04 | RBAC | Attribuer permissions via rôles. |
| SEC-05 | Scopes organisationnels | Limiter accès par structure, exercice, source, processus ou portefeuille. |
| SEC-06 | ABAC contextuel | Prendre en compte montant, statut, nature et attributs de contexte. |
| SEC-07 | SoD à l’attribution | Détecter conflits lors d’attribution de rôles. |
| SEC-08 | SoD runtime | Bloquer conflits au moment de l’action même si plusieurs rôles existent. |
| SEC-09 | Sessions | Gérer durée, timeout, révocation, appareils et historique. |
| SEC-10 | Chiffrement et secrets | TLS, secrets hors code, chiffrement pertinent, sauvegardes chiffrées. |
| SEC-11 | Protection fichiers | MIME réel, antivirus, tailles, extensions, stockage contrôlé. |
| SEC-12 | Sécurité applicative | SAST/SCA, secrets scanning, revue dépendances et contrôles OWASP ASVS. |
| SEC-13 | Journal sécurité | Tracer refus, échecs, changements droits, actions administratives et événements critiques. |
| SEC-14 | Environnements | Séparer développement, test, préproduction et production. |
| SEC-15 | Sauvegardes/PRA | Planifier backups, tests de restauration, réplication/WAL selon infrastructure et objectifs RPO/RTO. |
| SEC-16 | Supervision | Santé applicative, erreurs, files, jobs, base, stockage, certificats et capacité. |

### 23.4 Règles métier essentielles
- Ordonnateur ≠ Agent Comptable Central ; Audit ≠ exécution métier ; DSI admin ≠ validation financière métier ; CFC ≠ initiateur de l’opération contrôlée.
- Aucun super-administrateur technique ne contourne un conflit SoD financier critique.

### 23.5 Écrans / vues
- Utilisateurs
- Rôles/permissions
- Scopes
- SoD
- Sessions
- Événements sécurité
- Sauvegardes
- Supervision

### 23.6 Documents / sorties
- Matrice habilitations
- Rapport SoD
- Journal sécurité
- Rapport sauvegarde/restauration
- Rapport de supervision

### 23.7 Critères d’acceptation
- Un administrateur technique sans rôle métier ne peut valider une opération financière.

## 24. M20 — Import, export et interopérabilité

### 24.1 Finalité

Échanger des données de manière versionnée, sécurisée, idempotente et réconciliable avec les systèmes internes et externes.

### 24.2 Acteurs principaux
- DSI/intégration
- Administrateurs fonctionnels
- Systèmes partenaires
- Audit

### 24.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| INT-01 | Imports structurés | XLSX/CSV et PDF exploitable via chargement, mapping, prévalidation, simulation, import et rapprochement. |
| INT-02 | Lots d’import | Identifier lot, source, auteur, date, statut, erreurs, totaux et validation. |
| INT-03 | Export contrôlé | PDF/XLSX/CSV selon droits, filtres, volume et journalisation. |
| INT-04 | API versionnée | Exposer /api/v1 ou version équivalente avec contrat OpenAPI. |
| INT-05 | Authentification API | OAuth2/OIDC, scopes et clients techniques. |
| INT-06 | Idempotency-Key | Exiger une clé d’idempotence sur les créations financières externes. |
| INT-07 | Correlation ID | Propager identifiant de corrélation de bout en bout. |
| INT-08 | Webhooks signés | Signer, horodater et protéger contre le rejeu. |
| INT-09 | Transactional Outbox | Écrire les événements critiques dans la transaction puis publier après commit avec retries. |
| INT-10 | Journal d’échanges | Conserver sens, message, statut, tentative, erreur, corrélation et reprise. |
| INT-11 | Connecteur comptabilité | Échanger écritures/références selon périmètre validé. |
| INT-12 | Connecteur banques | Ordres, relevés, confirmations et rapprochements selon possibilités. |
| INT-13 | Connecteur RH/Paie | Recevoir états certifiés ou données de référence sans calculer la paie dans BUDGET-CEEAC. |
| INT-14 | Connecteur achats | Référencer marchés/contrats d’un système spécialisé. |
| INT-15 | Connecteur BI | Alimenter DW/Power BI en lecture gouvernée. |
| INT-16 | Mode dégradé/reprise | Files, retries, dead-letter, reprise manuelle contrôlée et réconciliation. |

### 24.4 Règles métier essentielles
- Une intégration externe ne peut contourner les contrôles de droits et de plafonds.
- Les effets externes critiques utilisent l’Outbox ; les créations financières utilisent l’idempotence.

### 24.5 Écrans / vues
- Imports
- Mapping
- Rapport erreurs
- Exports
- Clients API
- Journal échanges
- Outbox
- Webhooks
- Connecteurs

### 24.6 Documents / sorties
- Rapport d’import
- Journal API
- Rapport d’intégration
- Rapport de réconciliation

### 24.7 Critères d’acceptation
- Le rejeu d’un message ou d’un webhook ne crée pas de doublon financier.

## 25. M21 — Accueil, cockpit, navigation et recherche globale

### 25.1 Finalité

Offrir une entrée unique, personnalisée et orientée action vers BUDGET-CEEAC, avec accès direct aux tâches, alertes, dossiers, indicateurs et recherche transversale.

### 25.2 Acteurs principaux
- Tous utilisateurs selon profil

### 25.3 Exigences fonctionnelles détaillées

| ID | Fonction | Description attendue |
| --- | --- | --- |
| UX-01 | Accueil institutionnel | Présenter identité de l’application, informations essentielles et accès sécurisé. |
| UX-02 | Cockpit personnalisé | Afficher KPI, tâches, alertes et raccourcis selon rôle et périmètre. |
| UX-03 | Sidebar dynamique | Construire les menus à partir des permissions, sans afficher des fonctions interdites. |
| UX-04 | Mes tâches | Afficher les tâches les plus récentes en tête, avec priorité, SLA et action directe. |
| UX-05 | Mes dossiers récents | Accès rapide aux objets récemment consultés ou traités. |
| UX-06 | Recherche globale | Rechercher références EB/ENG/LIQ/ORD/PAY, tiers, lignes, PAP, projets, contrats et documents. |
| UX-07 | Breadcrumbs | Afficher clairement module, objet et niveau de navigation. |
| UX-08 | Badges et compteurs | Calculer sur données réelles et filtrables. |
| UX-09 | Filtres persistants | Mémoriser des préférences non sensibles par utilisateur. |
| UX-10 | Actions contextuelles | N’afficher que les actions autorisées par l’état, la permission et la règle métier. |
| UX-11 | Responsive | Assurer utilisation sur desktop/tablette et parcours essentiels sur mobile. |
| UX-12 | Accessibilité | Viser WCAG 2.2 niveau AA pour les parcours clés. |
| UX-13 | Aide contextuelle | Glossaire, infobulles, guide utilisateur et liens vers procédures. |
| UX-14 | Erreurs explicites | Afficher message compréhensible, identifiant de corrélation et action corrective. |

### 25.4 Règles métier essentielles
- La visibilité UI ne remplace jamais le contrôle d’autorisation côté serveur.
- Les compteurs et badges proviennent de requêtes réelles et cohérentes avec les listes.

### 25.5 Écrans / vues
- Accueil
- Cockpit
- Mes tâches
- Recherche globale
- Notifications
- Profil/préférences
- Aide

### 25.6 Documents / sorties
- Vue personnalisée
- Résultats de recherche
- Exports autorisés depuis listes

### 25.7 Critères d’acceptation
- Un utilisateur ne voit et ne peut exécuter que les actions compatibles avec ses droits et l’état métier.

## 26. Règles financières transversales
- Liquidations validées cumulées ≤ Engagement net ajusté.
- Ordonnancements cumulés ≤ Liquidations validées.
- Paiements cumulés ≤ Ordonnancements pris en charge.

| Indicateur | Formule |
| --- | --- |
| Crédit autorisé | initial + ouvertures + reports + transferts entrants - annulations - transferts sortants |
| Disponible à engager | crédit autorisé - gels - engagements nets - réservations actives |
| Reste à liquider | engagement net - liquidations validées cumulées |
| Reste à ordonnancer | liquidations validées - ordonnancements cumulés |
| Reste à payer | ordonnancements pris en charge - paiements rapprochés |
| Taux d’engagement | engagements nets / crédit autorisé |

## 27. Architecture transactionnelle et idempotence
- Chaque transition automatique possède une clé d’idempotence unique.
- Visa LIQ + création ORD + workflow/tâche + audit + Outbox dans une transaction PostgreSQL.
- Après commit : notifications, BI, webhooks et intégrations via Outbox/retries.

## 28. MCD de haut niveau
- EXERCICE 1—1 BUDGET ; BUDGET 1—N VERSION_BUDGET ; BUDGET 1—1 PAP_PLAN.
- VERSION_BUDGET 1—N LIGNE_BUDGETAIRE ; LIGNE N—N SOURCE_FINANCEMENT via ventilation.
- PAP_PLAN 1—N PAP_NODE ; PAP_NODE 1—N PAP_NODE (hiérarchie) ; PAP_NODE N—N LIGNE via allocation.
- PAP_NODE 1—N INDICATEUR ; INDICATEUR 1—N CIBLE et 1—N VALEUR_REALISEE.
- EB 1—N EB_LINE ; EB 1—0/1 ENGAGEMENT ; ENGAGEMENT 1—N LIQUIDATION ; LIQUIDATION 1—N ORD ; ORD 1—N PAIEMENT ; PAIEMENT 1—N RAPPROCHEMENT.
- TIERS 1—N COMPTES_BANCAIRES ; TIERS 1—N CONTRATS ; CONTRAT lié aux objets de dépense.
- WORKFLOW_INSTANCE 1—N TASK ; DOCUMENT 1—N DOCUMENT_VERSION ; tout objet métier N—N DOCUMENT via DOCUMENT_LINK.

## 29. MLD — principales entités
### Organisation / IAM

organization_versions, organization_unit_types, organization_units, positions, persons, position_assignments, delegations, substitutions, cost_centers, users, roles, permissions, user_roles, role_permissions, validation_scopes, sod_rules, sod_runtime_checks.

### Budget / référentiels

fiscal_years, budgets, budget_versions, economic_versions, economic_nodes, funding_sources, donors, budget_lines, budget_line_funding, credit_movements, credit_reservations, budget_closure_runs.

### Préparation / PAP / RBM

budget_campaigns, budget_ceiling_allocations, budget_proposals, budget_proposal_lines, budget_arbitrations, pap_plans, pap_node_types, pap_nodes, pap_budget_allocations.

### Suivi-Évaluation

indicators, indicator_targets, indicator_values, monitoring_periods, activity_progress, evaluations, recommendations, recommendation_actions.

### Dépense

needs, need_lines, commitments, commitment_lines, liquidations, liquidation_lines, invoice_corrections, liquidation_rectifications, orders, order_lines, payments, payment_lines, reconciliations, payment_recoveries.

### Tiers / marchés

third_parties, third_party_roles, third_party_bank_accounts, third_party_compliance_items, procurement_plans, procurements, bids, awards, contracts, contract_amendments, contract_deliverables, receipts.

### Recettes

revenue_forecasts, revenue_titles, revenue_liquidations, collections, receipts, revenue_arrears.

### Workflow / notifications

workflow_definitions, workflow_versions, workflow_steps, workflow_transitions, workflow_instances, workflow_tasks, workflow_decisions, workflow_migrations, notifications, notification_templates, alerts.

### GED / signature

documents, document_versions, document_links, document_requirements, signatures, verification_tokens.

### Contrôle / audit

control_rules, control_results, nonconformities, reservations_controls, exceptions, control_plans, risk_register, corrective_actions, audit_logs, audit_missions, audit_findings.

### Intégration

api_clients, integration_messages, outbox_events, webhook_subscriptions, import_batches, import_errors, export_jobs.

## 30. Catalogue consolidé des écrans

| Module | Écran / vue |
| --- | --- |
| M01 | Tableau de bord Administration |
| M01 | Paramètres généraux |
| M01 | Exercices/périodes |
| M01 | Séquences |
| M01 | Listes de valeurs |
| M01 | Seuils |
| M01 | Pièces obligatoires |
| M01 | Modèles PDF |
| M01 | SLA |
| M01 | Journal des paramètres |
| M02 | Dashboard campagne |
| M02 | Calendrier |
| M02 | Cadrage |
| M02 | Programmation pluriannuelle |
| M02 | Plafonds/enveloppes |
| M02 | Propositions |
| M02 | PAP/RBM |
| M02 | Consolidation |
| M02 | Anomalies |
| M02 | Arbitrages |
| M02 | Projet de Budget |
| M03 | Dashboard Budget |
| M03 | Exercices |
| M03 | Versions |
| M03 | Lignes |
| M03 | Fiche ligne |
| M03 | Mouvements |
| M03 | Réservations |
| M03 | Imports |
| M03 | Situation à date |
| M03 | Exécution |
| M03 | Budget vs réalisé |
| M04 | Dashboard chaîne de dépense |
| M04 | EB liste/détail/formulaire |
| M04 | Engagements |
| M04 | Liquidations |
| M04 | Rectifications |
| M04 | Ordonnancements |
| M04 | Paiements |
| M04 | Rapprochements |
| M04 | Mes dossiers |
| M04 | Historique/timeline |
| M05 | Liste tiers |
| M05 | Fiche tiers |
| M05 | Rôles |
| M05 | Conformité |
| M05 | Comptes bancaires |
| M05 | Historique |
| M05 | Doublons/alertes |
| M06 | Plan achats |
| M06 | Consultations |
| M06 | Évaluations |
| M06 | Attributions |
| M06 | Contrats |
| M06 | Avenants |
| M06 | Réceptions |
| M06 | Garanties |
| M07 | Prévisions |
| M07 | Titres |
| M07 | Recouvrement |
| M07 | Encaissements |
| M07 | Arriérés |
| M07 | Contributions |
| M07 | Rapprochement |
| M07 | Dashboard recettes |
| M08 | Dashboard S&E |
| M08 | Plan de suivi |
| M08 | Collecte |
| M08 | Validation |
| M08 | Activités |
| M08 | Écarts |
| M08 | Évaluations |
| M08 | Recommandations |
| M08 | Revues |
| M09 | PAP annuel |
| M09 | Arbre RBM |
| M09 | Matrice PAP |
| M09 | Allocations Budget-PAP |
| M09 | Activités/tâches |
| M09 | Indicateurs |
| M09 | Révisions |
| M09 | Cohérences |
| M10 | Cockpit exécutif |
| M10 | Dashboard Budget |
| M10 | Dashboard dépense |
| M10 | Dashboard PAP/S&E |
| M10 | Dashboard PTF |
| M10 | Catalogue rapports |
| M10 | Générateur |
| M10 | Historique exports |
| M11 | Documents |
| M11 | Pièces du dossier |
| M11 | Prévisualisation |
| M11 | Versions |
| M11 | Signatures |
| M11 | Recherche documentaire |
| M11 | Archivage |
| M12 | Définitions |
| M12 | Versions |
| M12 | Étapes/transitions |
| M12 | Mes tâches |
| M12 | Détail tâche |
| M12 | Timeline |
| M12 | Délégations |
| M12 | Migrations |
| M13 | Centre notifications |
| M13 | Alertes |
| M13 | Préférences |
| M13 | Modèles |
| M13 | Historique diffusion |
| M14 | Dashboard contrôle |
| M14 | Centre de contrôle |
| M14 | Règles |
| M14 | Anomalies |
| M14 | Réserves |
| M14 | Dérogations |
| M14 | Plan de contrôle |
| M14 | Matrice risques |
| M14 | Actions correctives |
| M15 | Journal événements |
| M15 | Explorateur audit |
| M15 | Missions |
| M15 | Constats |
| M15 | Recommandations |
| M15 | Risques |
| M15 | Conformité |
| M15 | Événements critiques |
| M16 | Portefeuille |
| M16 | Fiche projet |
| M16 | Planning |
| M16 | Budget/financement |
| M16 | Contrats |
| M16 | Risques |
| M16 | Changements |
| M16 | Dashboard |
| M17 | Dashboard clôture |
| M17 | Calendrier |
| M17 | Pré-clôture |
| M17 | Dossiers en cours |
| M17 | Reports |
| M17 | Annulations |
| M17 | Rapprochements |
| M17 | Clôture PAP |
| M17 | Contrôles |
| M17 | Réouverture |
| M17 | Archivage |
| M18 | Nomenclature |
| M18 | Sources |
| M18 | PTF |
| M18 | Natures |
| M18 | Devises/taux |
| M18 | Comptes |
| M18 | Caisses |
| M18 | Taxes/retenues |
| M18 | Mappings |
| M19 | Utilisateurs |
| M19 | Rôles/permissions |
| M19 | Scopes |
| M19 | SoD |
| M19 | Sessions |
| M19 | Événements sécurité |
| M19 | Sauvegardes |
| M19 | Supervision |
| M20 | Imports |
| M20 | Mapping |
| M20 | Rapport erreurs |
| M20 | Exports |
| M20 | Clients API |
| M20 | Journal échanges |
| M20 | Outbox |
| M20 | Webhooks |
| M20 | Connecteurs |
| M21 | Accueil |
| M21 | Cockpit |
| M21 | Mes tâches |
| M21 | Recherche globale |
| M21 | Notifications |
| M21 | Profil/préférences |
| M21 | Aide |

## 31. Catalogue des documents et états officiels

| Module | Document/état |
| --- | --- |
| M01 | Rapport de configuration |
| M01 | Historique des paramètres |
| M01 | Matrice des seuils |
| M01 | Catalogue de pièces |
| M01 | Matrice des workflows |
| M02 | Circulaire de cadrage |
| M02 | Programmation pluriannuelle |
| M02 | PAP |
| M02 | Synthèse des besoins |
| M02 | Rapport d’arbitrage |
| M02 | Projet de Budget |
| M02 | Rapport de clôture de campagne |
| M03 | Budget approuvé |
| M03 | Situation des crédits |
| M03 | État des mouvements |
| M03 | Exécution par ligne |
| M03 | Exécution CEEAC/PTF |
| M03 | Budget vs réalisé |
| M04 | Fiche EB |
| M04 | Certificat/Fiche Engagement |
| M04 | Liquidation |
| M04 | Certificat de service fait |
| M04 | Ordonnancement/mandat |
| M04 | Ordre de règlement |
| M04 | Bordereaux |
| M04 | Rapport de rapprochement |
| M05 | Fiche tiers |
| M05 | Liste de conformité |
| M05 | Rapport de doublons |
| M05 | Historique des comptes |
| M06 | Plan d’achats |
| M06 | Rapport d’évaluation |
| M06 | Décision d’attribution |
| M06 | Fiche contrat |
| M06 | Situation d’exécution contractuelle |
| M07 | Situation des recettes |
| M07 | Arriérés |
| M07 | Contributions statutaires |
| M07 | Exécution par source |
| M08 | Rapport de performance |
| M08 | Exécution physique-financière |
| M08 | Rapport d’évaluation |
| M08 | Suivi des recommandations |
| M09 | PAP consolidé |
| M09 | Matrice RBM |
| M09 | Plan d’activités |
| M09 | Allocation Budget-PAP |
| M09 | Rapport de cohérence |
| M10 | Situation globale Budget |
| M10 | Exécution par ligne |
| M10 | PAP consolidé |
| M10 | Chaîne de dépense |
| M10 | Restes |
| M10 | Délais/SLA |
| M10 | PTF |
| M10 | Audit |
| M10 | SoD |
| M10 | Rapprochement |
| M11 | Documents officiels des processus |
| M11 | Bordereaux |
| M11 | Rapports |
| M11 | Journal d’intégrité documentaire |
| M12 | Historique workflow |
| M12 | Rapport SLA |
| M12 | Rapport tâches |
| M12 | Rapport migrations |
| M13 | Rapport notifications |
| M13 | Rapport alertes |
| M13 | Suivi SLA/escalades |
| M14 | Rapport de contrôle |
| M14 | Anomalies |
| M14 | Réserves |
| M14 | Matrice risques |
| M14 | Plan d’actions |
| M14 | Conformité SoD |
| M15 | Journal d’audit |
| M15 | Rapport de mission |
| M15 | Suivi recommandations |
| M15 | Cartographie risques |
| M15 | Rapport conformité |
| M16 | Fiche projet |
| M16 | Rapport d’avancement |
| M16 | Situation financière |
| M16 | Registre risques |
| M16 | Rapport de clôture |
| M17 | Situation de pré-clôture |
| M17 | État des restes |
| M17 | État des reports |
| M17 | Annulations |
| M17 | Arrêté PAP |
| M17 | Rapport de clôture |
| M17 | Dossier d’archives |
| M18 | Nomenclature officielle |
| M18 | Référentiel financements |
| M18 | Historique des versions |
| M18 | Mappings de migration |
| M19 | Matrice habilitations |
| M19 | Rapport SoD |
| M19 | Journal sécurité |
| M19 | Rapport sauvegarde/restauration |
| M19 | Rapport de supervision |
| M20 | Rapport d’import |
| M20 | Journal API |
| M20 | Rapport d’intégration |
| M20 | Rapport de réconciliation |
| M21 | Vue personnalisée |
| M21 | Résultats de recherche |
| M21 | Exports autorisés depuis listes |

## 32. Règles transversales

| ID | Règle |
| --- | --- |
| TR-001 | Un exercice = un Budget unique ; le PAP est une composante du Budget. |
| TR-002 | Une version validée d’un référentiel, Budget, PAP ou document probatoire n’est jamais écrasée. |
| TR-003 | Les workflows sont pilotés par les données, versionnés et datés ; aucune prochaine étape n’est codée dans l’interface. |
| TR-004 | Les contrôles d’autorisation et de SoD sont exécutés côté serveur. |
| TR-005 | Les montants utilisent des types numériques exacts, jamais FLOAT pour les valeurs financières. |
| TR-006 | Les suppressions physiques sont interdites pour les objets ayant déjà été utilisés. |
| TR-007 | Les transitions EB→ENG→LIQ→ORD→PAY sont automatiques après validation finale, atomiques pour le cœur financier et idempotentes. |
| TR-008 | Les événements externes critiques sont publiés via Transactional Outbox après commit. |
| TR-009 | Le journal d’audit est append-only pour les actions sensibles. |
| TR-010 | Les documents officiels sont générés depuis les données validées et les signataires réels. |
| TR-011 | Les dashboards, exports, API et BI utilisent les mêmes définitions de métriques. |
| TR-012 | Toute correction d’un objet validé crée une version, une rectification ou une régularisation ; le passé n’est pas réécrit. |
| TR-013 | Le contrôle de crédit est transactionnel et protège contre les opérations concurrentes. |
| TR-014 | La filiation amont/aval du dossier de dépense est conservée jusqu’au rapprochement et au reporting. |
| TR-015 | Les rôles techniques n’accordent aucun pouvoir financier métier. |

## 33. Exigences non fonctionnelles

| ID | Domaine | Exigence |
| --- | --- | --- |
| NFR-01 | Performance | Cible : 95 % des écrans transactionnels courants en moins de 2 secondes hors rapports lourds, sous charge nominale à préciser. |
| NFR-02 | Pagination | Pagination obligatoire et filtrage serveur pour listes volumineuses. |
| NFR-03 | Disponibilité | Objectifs de disponibilité contractuels à fixer ; maintenance planifiée et supervision proactive. |
| NFR-04 | PRA/PCA | RPO/RTO à valider ; sauvegardes chiffrées, tests de restauration et procédures documentées. |
| NFR-05 | Sécurité | TLS, moindre privilège, MFA rôles sensibles, secrets hors code, journalisation corrélée, scans sécurité. |
| NFR-06 | Accessibilité | WCAG 2.2 AA sur parcours essentiels, navigation clavier, contrastes, labels et erreurs explicites. |
| NFR-07 | Compatibilité | Navigateurs institutionnels récents ; design responsive. |
| NFR-08 | Traçabilité | Correlation ID sur requêtes, jobs et intégrations ; horodatage cohérent. |
| NFR-09 | Scalabilité | Indexation, partitionnement possible des logs/notifications/intégrations, files pour charges asynchrones. |
| NFR-10 | Maintenabilité | Architecture modulaire, conventions de code, tests automatisés, documentation API et runbooks. |
| NFR-11 | Observabilité | Logs structurés, métriques, traces, alertes santé, files, jobs, DB, stockage et intégrations. |
| NFR-12 | Confidentialité | Masquage/chiffrement pertinent, contrôle des exports et accès aux coordonnées bancaires. |

## 34. Architecture technique de référence
- Laravel 13, architecture web modulaire.
- PostgreSQL 18+ comme base transactionnelle.
- API REST versionnée/OpenAPI, OAuth2/OIDC.
- Transactional Outbox pour événements critiques.
- Environnements séparés et CI/CD contrôlé.

## 35. Migration et reprise de données

Extraction → Staging → Mapping → Contrôles → Simulation → Import transactionnel → Rapprochement → Validation.

## 36. Tests et recette
- Tests unitaires, intégration, concurrence, idempotence, sécurité, performance et PRA.
- Recette métier sur scénarios de bout en bout.

| ID | Critère |
| --- | --- |
| REC-01 | Un seul Budget officiel actif par exercice ; PAP intégré sans duplication. |
| REC-02 | Crédits et plafonds ne sont jamais dépassés en concurrence. |
| REC-03 | LIQ≤ENG, ORD≤LIQ, PAY≤ORD au cumul. |
| REC-04 | Chaque validation finale génère exactement un objet aval attendu. |
| REC-05 | Seuil ORD ≤5M SG ; >5M Président selon version applicable. |
| REC-06 | Correction d’un objet validé ne modifie jamais l’original. |
| REC-07 | Tâches, bandeaux, notifications et acteur attendu sont cohérents. |
| REC-08 | Audit append-only pour toutes les actions sensibles. |
| REC-09 | DSI admin ne peut exécuter une validation financière sans rôle métier autorisé et compatible SoD. |
| REC-10 | Dashboard, rapport et API donnent la même métrique sous le même filtre. |

## 37. Roadmap

| Lot | Périmètre | Critère de sortie |
| --- | --- | --- |
| Lot 0 | Socle : organisation, IAM, workflow, GED, audit, paramètres, référentiels financiers | Référentiels versionnés, sécurité et audit opérationnels |
| Lot 1 | Préparation/programmation + Budget + imports | Budget importé/créé, lignes, crédits et campagnes opérationnels |
| Lot 2 | PAP/GAR/RBM + S&E + projets | Traçabilité Budget-PAP et suivi physique-financier validés |
| Lot 3 | EB/ENG/LIQ/ORD/PAY + corrections + rapprochement | Chaîne complète sans rupture ni double consommation |
| Lot 4 | Tiers + achats/marchés + recettes | Référentiels et processus complémentaires intégrés |
| Lot 5 | Contrôle interne + audit + clôture | Contrôles, clôture et piste d’audit homologués |
| Lot 6 | Reporting/BI + API + interopérabilité | Rapports, métriques et interfaces réconciliés |
| Lot 7 | Migration, performance, PRA/PCA, sécurité, homologation | Recette finale et mise en production |

## 38. Risques projet

| Risque | Impact | Mesure |
| --- | --- | --- |
| Règles institutionnelles incomplètes | Workflow/contrôle erroné | Ateliers MOA, paramétrage et gel des décisions avant développement. |
| Doubles consommations concurrentes | Dépassement de crédits | Transactions, verrouillage, contraintes et tests de concurrence. |
| Dossiers actifs lors de migration | Perte de traçabilité | Grandfathering + Boundary Migration + rapport de migration. |
| Perte d’événements externes | Notifications/intégrations manquantes | Transactional Outbox, retries idempotents et réconciliation. |
| Doublon de paiement | Perte financière | Idempotence, SoD, plafonds, rapprochement et alertes. |
| Changement frauduleux de compte | Fraude | Versioning, contrôle renforcé, notification et audit. |
| Documents remplacés | Rupture de preuve | GED versionnée + hash + restrictions de suppression. |
| Volumétrie | Dégradation | Indexation, pagination, partitionnement, archivage et tests de charge. |
| Dépendance systèmes externes | Blocage | Files, retries, mode dégradé, SLA et réconciliation. |

## 39. Décisions à valider avant gel contractuel
- Autorité/acte d’adoption finale Budget/PAP.
- AE/CP éventuel.
- Catalogue définitif des pièces par nature/seuil.
- Règles caisse/signatures bancaires.
- Référentiel fiscal/comptable taxes/retenues.
- Signature électronique et valeur probante.
- RPO/RTO, rétention et archivage.
- Interfaces externes réellement disponibles.

## 40. RACI synthétique

| Étape | Acteur | Responsabilité |
| --- | --- | --- |
| EB HORS PAP - saisie | Expert ou Chef SMG | R |
| EB HORS PAP - validation | DRHMG | A/R |
| EB HORS PAP - N+1 | SG | A/R |
| EB PAP - saisie | Expert ou Chef Service | R |
| EB PAP - N | Directeur | A/R |
| EB PAP technique - N+1 | Commissaire | A/R |
| EB PAP appui - N+1 | SG | A/R |
| EB finale | Président/Ordonnateur | A/R approbation/signature |
| ENG contrôle L1 | Expert Budget OU Chef Service Budget | R |
| ENG niveau supérieur | Directeur du Budget | A/R |
| ENG final | Contrôleur Financier | A/R |
| LIQ service fait | Service initiateur | R certification |
| LIQ final | Contrôleur Financier | A/R visa |
| ORD ≤ 5M | Secrétaire Général | A/R signature |
| ORD > 5M | Président | A/R signature |
| PAY préparation | Comptable OU Chef Service Comptabilité | R |
| PAY validation | Agent Comptable Central | A/R |
| Audit | Audit Interne | Indépendant - lecture/évaluation |
| Administration technique | DSI | Technique - jamais validation financière |

## 41. Glossaire

| Terme | Définition |
| --- | --- |
| EB | Expression / État de Besoin |
| ENG | Engagement |
| LIQ | Liquidation |
| ORD | Ordonnancement |
| PAY | Paiement / dossier Payment |
| PAP | Plan Annuel de Performance |
| GAR/RBM | Gestion Axée sur les Résultats / Results-Based Management |
| CFC | Contrôle Financier Central |
| ACC | Agence Comptable Centrale |
| SoD | Segregation of Duties / séparation des fonctions |
| GED | Gestion Électronique des Documents |
| SLA | Délai de traitement cible |
| Outbox | Journal transactionnel d’événements à publier après commit |
| RPO/RTO | Objectifs de perte de données et de délai de reprise |
| MOA | Maîtrise d’Ouvrage |
| MOE | Maîtrise d’Œuvre |

## 42. Références de conception
- BUDGET_CEEAC — Cahier des charges fonctionnel complet v2.0 (4 septembre 2026).
- Descriptions détaillées des modules déjà consolidés et procédures de la chaîne de dépense.
- PEFA, FMI Fiscal Transparency, COSO/INTOSAI, ISO/IEC 27001/27002, ISO 31000, ISO 22301, OWASP ASVS, WCAG 2.2 et RBM/GAR.

## 43. Conclusion

BUDGET-CEEAC doit être mis en œuvre comme une plateforme intégrée, versionnée, auditable, sécurisée et transactionnellement sûre, garantissant la continuité entre stratégie, Budget, PAP, dépense, résultats et contrôle.
