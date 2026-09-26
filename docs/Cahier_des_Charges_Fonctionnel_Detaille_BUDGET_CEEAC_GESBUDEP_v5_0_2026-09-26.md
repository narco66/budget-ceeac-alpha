# CAHIER DES CHARGES FONCTIONNEL DÉTAILLÉ - BUDGET-CEEAC (GESBUDEP)

**Système intégré de Planification, Programmation, Budgétisation, Exécution de la Dépense, Suivi-Évaluation, Contrôle, Comptabilité de gestion et Reporting**

**Version détaillée et enrichie 5.0 - 26 septembre 2026**

Commission de la Communauté Économique des États de l’Afrique Centrale (CEEAC)

Document maître de référence fonctionnelle destiné à la conception, au développement, à l'intégration, à la recette, au déploiement, à l'exploitation, à l'audit et à l'évolution de GESBUDEP.

## Historique et statut du document

| Élément | Valeur |
| --- | --- |
| Version | 5.0 détaillée et enrichie |
| Date | 26/09/2026 |
| Statut | Baseline fonctionnelle enrichie proposée pour validation |
| Périmètre | Budget unique, PAP, planification, chaîne de dépense, marchés, S&E, GED, contrôle, reporting, administration, interopérabilité, sécurité, continuité et gouvernance des données |
| Principe de consolidation | Les règles validées les plus récentes prévalent ; les procédures EB, ENG, LIQ, ORD et PAI sont intégrées et complétées par les contrôles, exceptions et fonctions transversales nécessaires à une application institutionnelle robuste. |
| Référence visuelle | Maquette Figma : vérité visuelle |
| Référence métier | /docs, procédures validées, référentiel organisationnel et Budget 2026 : vérité fonctionnelle et métier |
| Architecture cible | Frontend React + Vite + Tailwind ; Backend Laravel 13+ ; PostgreSQL 18+ ; APIs sécurisées ; services documentaires et reporting intégrés |

## Résumé exécutif

BUDGET-CEEAC, dénommé GESBUDEP, est conçu comme le système institutionnel intégré de gestion du cycle budgétaire, de la performance et de la dépense de la Commission de la CEEAC. Il ne doit pas être un simple outil de saisie de formulaires : il doit constituer un dispositif de gouvernance financière numérique capable de relier, dans une même chaîne de preuve, la stratégie, les autorisations budgétaires, les actes de dépense, les pièces justificatives, les validations, les paiements, les réalisations physiques, les indicateurs de performance, les contrôles et les rapports.

La solution doit poursuivre quatre objectifs simultanés. Premièrement, garantir la **régularité** de la dépense en empêchant les opérations incohérentes, non autorisées ou insuffisamment documentées. Deuxièmement, assurer la **traçabilité** grâce à une piste d'audit exhaustive et à une gestion documentaire probante. Troisièmement, améliorer la **performance de gestion** par l'automatisation des workflows, des contrôles, des alertes, des tableaux de bord et des rapprochements. Quatrièmement, renforcer la **redevabilité** en permettant de relier les ressources consommées aux résultats attendus et aux résultats effectivement obtenus.

Cette version renforce fortement les exigences relatives à la séparation des fonctions, au contrôle interne, aux délégations, aux substitutions temporaires, à la version des référentiels, aux exceptions, aux opérations partielles, aux annulations, aux avenants, aux retours, aux rejets, aux délais, aux notifications, à la qualité des données, au rapprochement, à l'archivage, à la sécurité, à la continuité d'activité, aux audits et à la recette.

## Références de bonnes pratiques retenues

Le cahier des charges s'inspire, sans prétendre remplacer les textes juridiques et procédures propres à la CEEAC, des principes reconnus de gestion des finances publiques et de gouvernance numérique :

- cadre PEFA : fiabilité du budget, gestion des actifs et passifs, budgétisation fondée sur les politiques publiques, prévisibilité et contrôle de l'exécution, comptabilité/reporting, audit et examen externe ;
- principes de transparence budgétaire et de suivi de l'exécution promus par le FMI ;
- cadre conceptuel et standards IPSAS pour la qualité, la cohérence et l'utilité de l'information financière du secteur public ;
- principes de contrôle interne inspirés de COSO : environnement de contrôle, évaluation des risques, activités de contrôle, information/communication et suivi ;
- NIST Cybersecurity Framework 2.0 pour la gouvernance, l'identification, la protection, la détection, la réponse et la reprise ;
- principes de sécurité applicative, de moindre privilège, de défense en profondeur et de vérification systématique des entrées/sorties.

Ces références constituent des guides de conception. En cas de divergence, les textes institutionnels applicables, les actes de la CEEAC et les procédures formellement approuvées priment.

## Principes directeurs renforcés

1. **Une donnée saisie une seule fois.** Toute information validée est héritée en aval et ne doit être ressaisie que si la procédure autorise explicitement sa modification.
2. **Une opération, une filiation complète.** Toute dépense doit pouvoir être retracée depuis la programmation et le crédit jusqu'au paiement et au résultat produit.
3. **Un contrôle au plus tôt.** Les contrôles budgétaires, d'habilitation, de complétude et de cohérence doivent intervenir avant la validation et non après l'irrégularité.
4. **Séparation des fonctions.** Les rôles incompatibles sont empêchés techniquement au niveau des habilitations et au niveau transactionnel.
5. **Pas de suppression silencieuse.** Les données ayant un effet financier ou probant sont annulées, désactivées ou versionnées, jamais effacées sans trace.
6. **Documents probants et snapshots.** Chaque acte significatif doit pouvoir être reconstitué dans l'état exact dans lequel il a été signé/validé.
7. **Contrôles cumulatifs.** Les montants aval sont bornés par les montants amont et par les crédits disponibles.
8. **Clôture maîtrisée.** Aucune opération ne doit contourner les règles de période, de clôture ou de report sans habilitation et justification formelle.
9. **Paramétrage encadré.** Les seuils et workflows configurables sont soumis à validation, version, date d'effet et journalisation.
10. **Résilience et auditabilité.** La solution doit conserver l'intégrité des données même en cas d'échec technique, de doublon de requête ou de reprise après incident.

# 1. Objet, contexte et finalités

GESBUDEP est le système institutionnel intégré de la Commission de la CEEAC destiné à unifier la planification stratégique, la programmation annuelle, la préparation et l’exécution budgétaires, la chaîne de dépense, le suivi-évaluation, la gestion documentaire, le contrôle interne, l’auditabilité et le reporting décisionnel. Il constitue la source opérationnelle de référence pour le cycle budgétaire et financier, tout en assurant la traçabilité des liens entre objectifs, activités, crédits, actes de dépense, résultats et paiements.

Le cahier des charges couvre les exigences fonctionnelles, les règles métier, les acteurs, les données, les contrôles, les documents, les notifications, les états, les interfaces et les critères d’acceptation nécessaires à une application de gestion des finances publiques adaptée au cadre de la CEEAC.

## 1.1 Objectifs fonctionnels

- Fournir une vision unifiée des crédits, de leur programmation à leur paiement.

- Assurer la continuité numérique et documentaire de chaque dossier de dépense.

- Supprimer les ressaisies et incohérences entre planification, budget et exécution.

- Automatiser les contrôles de disponibilité, de plafonds, de cumul, de séparation des fonctions et de pièces justificatives.

- Rendre la performance physique et financière mesurable par activité, produit, axe, pilier, structure et exercice.

- Permettre aux décideurs de disposer de tableaux de bord consolidés et d’alertes actionnables.

- Garantir l’auditabilité complète de toutes les opérations et décisions.



# 2. Périmètre fonctionnel maître

Le périmètre est organisé en vingt-et-un domaines. Chaque domaine doit être livré comme un module cohérent, intégré aux référentiels communs, aux workflows, à la GED, aux notifications, au journal d’audit et au moteur de reporting.

| Code | Domaine fonctionnel |

| --- | --- |

| M01 | Administration, sécurité et paramétrage |

| M02 | Référentiel organisationnel et acteurs |

| M03 | Planification stratégique / GAR-RBM |

| M04 | Préparation et programmation budgétaire |

| M05 | Gestion du Budget unique et du PAP |

| M06 | Expression de Besoin (EB) |

| M07 | Engagement (ENG) |

| M08 | Liquidation (LIQ) |

| M09 | Ordonnancement (ORD) |

| M10 | Paiement (PAI) |

| M11 | Gestion des marchés, contrats et bons |

| M12 | Entreprises, fournisseurs, consultants et bénéficiaires |

| M13 | Suivi-Évaluation et performance |

| M14 | Contrôle budgétaire et contrôle interne |

| M15 | GED et cycle documentaire |

| M16 | Workflows, tâches, délégations et notifications |

| M17 | Reporting, états et tableaux de bord |

| M18 | Import, export et interopérabilité |

| M19 | GANTT d’exécution PAP / Hors PAP |

| M20 | Tableau de bord exécutif |

| M21 | Clôture budgétaire, rapprochement et archivage |



# 3. Acteurs, rôles et séparation des fonctions

Les rôles ci-dessous représentent les fonctions métier. L’application doit les relier au référentiel organisationnel versionné ; elle ne doit pas coder en dur les noms de personnes. Les délégations, intérims, suppléances et périodes de validité sont gérés par le moteur d’habilitation.

| Acteur / rôle | Responsabilités principales |

| --- | --- |

| Initiateur / Expert / Chef de service | Prépare les dossiers relevant de sa compétence, joint les pièces, suit les retours. |

| Service des Moyens Généraux | Initiateur de référence des EB Hors PAP de fonctionnement ; collecte et consolide les besoins selon les règles établies. |

| Directeur | Valide les besoins PAP des unités relevant de sa direction et certifie certaines opérations selon workflow. |

| Commissaire | Valide les EB PAP des départements techniques avant la poursuite de la chaîne. |

| DRHMG | Validation métier des EB Hors PAP relevant du fonctionnement, avant transmission au SG. |

| Secrétaire Général (SG) | Validation des EB Hors PAP ; validation des EB PAP des départements d’appui ; ordonnateur délégué jusqu’à 5 000 000 XAF inclus. |

| Président | Ordonnateur principal ; approbation/signature selon workflow ; ordonnancement au-delà de 5 000 000 XAF. |

| Expert Budget | Instruction technique de l’engagement, contrôles initiaux, préparation et soumission. |

| Chef de Service Budget | Validation N+1 de l’engagement, retour motivé, contrôle de cohérence. |

| Directeur Budget | Validation budgétaire de l’engagement, réservation/confirmation de crédit et transmission au Contrôle Financier. |

| Contrôleur Financier | Visa des engagements et liquidations, contrôle de conformité et de régularité selon ses attributions. |

| Service initiateur / service fait | Certifie la réalité et la conformité du service fait pour la liquidation. |

| Agence Comptable Centrale | Prend en charge les ordres de paiement transmis, exécute la phase de paiement et le rapprochement. |

| Comptable / Chef comptable | Prépare et contrôle les opérations de paiement avant signature. |

| Agent Comptable | Autorise/signe le paiement et engage la responsabilité comptable selon les règles applicables. |

| Contrôle interne / Audit | Accès en consultation, contrôles, observations, extractions et piste d’audit, sans capacité de se substituer aux acteurs opérationnels. |



Aucune permission ne doit permettre à un même utilisateur de préparer, valider, viser, ordonnancer et payer le même dossier lorsque ces fonctions sont déclarées incompatibles. Les incompatibilités sont matérialisées dans une matrice SoD (Segregation of Duties) vérifiée à l’attribution des rôles et à l’exécution des workflows.

# 4. Référentiels fonctionnels communs

- Organisation : Présidence, Vice-Présidence, Secrétariat Général, départements techniques, directions, services, unités et structures rattachées, versionnés par date d’effet.

- Utilisateurs, fonctions, postes, rôles, groupes, délégations, intérims et périmètres d’accès.

- Exercices, périodes, calendriers, statuts de clôture, devises et taux de change.

- Nomenclature budgétaire : titres, articles, paragraphes, rubriques, lignes et autres niveaux paramétrés.

- Chaîne GAR/RBM : piliers, axes, produits, sous-produits, activités, tâches, indicateurs, résultats attendus, unités responsables, périodes.

- Sources de financement, partenaires techniques et financiers, comptes et centres de responsabilité.

- Fournisseurs, consultants, bénéficiaires, banques et coordonnées de paiement.

- Types de pièces, types d’actes, modèles PDF, règles de signatures et règles de conservation.

- Workflows, seuils, délais, motifs de rejet/retour, escalades et règles de notifications.



# 5. Planification stratégique et GAR/RBM

Le module de planification stratégique doit permettre la création, la modification contrôlée, la publication et le suivi des nœuds de toute la chaîne de résultats. Il ne doit pas se limiter à ajouter des tâches sous des activités : l’utilisateur autorisé doit pouvoir créer un nouveau pilier, axe, produit, sous-produit, activité ou tâche et développer l’arborescence associée, sous réserve des règles de l’exercice et de publication.

## 5.1 Données minimales par nœud

- Code unique et libellé

- Parent et position dans l’arborescence

- Description / justification

- Objectifs et résultats attendus

- Unité responsable et unités contributrices

- Période de réalisation

- Indicateurs et cibles lorsque pertinents

- Budget indicatif / enveloppe de référence lorsque pertinent

- Statut : brouillon, en validation, validé, publié, suspendu, clôturé, archivé

- Version, date d’effet, auteur, valideur et justification de modification



## 5.2 Règles de publication

- Une version publiée est immuable ; toute modification produit une nouvelle version ou un avenant logique selon le type de donnée.

- Les dépenses existantes restent rattachées à la version du référentiel applicable au moment de leur validation.

- Un exercice peut utiliser une version publiée spécifique de la chaîne GAR/RBM.

- La suppression physique d’un nœud déjà utilisé est interdite ; il peut être désactivé/archivé avec contrôle des dépendances.



# 6. Préparation et programmation budgétaire

La préparation budgétaire constitue un processus complet, versionné et traçable, depuis l’ouverture de l’exercice jusqu’à l’adoption, la publication et le verrouillage du budget initial. Le système doit gérer le cadrage, les plafonds, les propositions des unités, les arbitrages, la consolidation, les versions, les observations, les annexes et la publication.

## 6.1 Processus détaillé

1. Ouverture de l’exercice budgétaire et définition du calendrier de préparation.

2. Paramétrage des hypothèses, cadrages, enveloppes, plafonds et orientations.

3. Publication des plafonds aux structures et notification des acteurs.

4. Collecte des propositions Hors PAP et des propositions PAP rattachées à la chaîne GAR/RBM.

5. Contrôles automatiques de complétude, nomenclature, doublons, enveloppes et cohérence des périodes.

6. Consolidation au niveau direction/département puis au niveau central.

7. Arbitrages successifs avec historisation des montants proposés, ajustés et retenus.

8. Production des tableaux de consolidation et des écarts entre versions.

9. Validation de la version finale, adoption, publication et verrouillage du budget initial.

10. Création des enveloppes exécutoires et mise à disposition des soldes par ligne budgétaire.

11. Gestion des révisions, virements, transferts, gels/dégels et budget révisé avec piste d’audit.



## 6.2 Critères fonctionnels essentiels

- **PREP-001** - Le système interdit toute proposition sur un exercice non ouvert.

- **PREP-002** - Les plafonds sont contrôlés par structure et niveau de consolidation.

- **PREP-003** - Chaque arbitrage conserve la valeur précédente, la nouvelle valeur, l’auteur, la date et le motif.

- **PREP-004** - Le PAP est intégré au Budget unique et n’est jamais comptabilisé deux fois.

- **PREP-005** - Les versions publiées sont immuables et comparables.

- **PREP-006** - Toute ligne exécutoire dispose d’un budget initial, d’un budget révisé, d’un engagé, d’un liquidé, d’un ordonnancé, d’un payé et d’un disponible calculables.

- **PREP-007** - La publication déclenche les snapshots, états PDF et archivage GED prévus.

- **PREP-008** - La clôture de la préparation empêche les saisies ordinaires hors processus de révision.



# 7. Gestion du Budget unique et du PAP

Le module Budget est la source unique des autorisations financières de l’exercice. Le PAP n’est pas un budget séparé : il représente le segment Investissement du Budget unique et porte les attributs programmatiques nécessaires au suivi de la performance.

## 7.1 Données financières par ligne

- Budget initial

- Mouvements / révisions

- Budget révisé

- Réservations

- Engagé validé

- Liquidé validé

- Ordonnancé validé

- Payé exécuté

- Disponible

- Reste à engager

- Reste à liquider

- Reste à ordonnancer

- Reste à payer



Les soldes sont recalculés après chaque événement financier validé. Ils doivent être reproductibles à partir des écritures d’événements et vérifiables par audit.

## 7.2 PAP : données héritées et complétables

Lorsqu’une EB porte sur une ligne PAP, le système récupère automatiquement les informations programmatiques disponibles : pilier, axe, objectif, produit, sous-produit, activité, tâches, indicateurs, résultats attendus, unité responsable, période de réalisation, budget initial, budget révisé, montants engagés/exécutés et disponible. Si certaines informations n’existent pas dans le Budget 2026 ou dans le référentiel importé, elles restent complétables dans les référentiels de planification, sans altérer le document budgétaire source.

# 8. Procédure détaillée - Expression de Besoin (EB)

L’Expression de Besoin est le point d’entrée de la chaîne de dépense. Elle formalise un besoin, son rattachement budgétaire et, pour le PAP, son rattachement à la chaîne de résultats. Une EB validée constitue l’autorisation de poursuivre vers l’engagement, sous réserve des contrôles budgétaires et institutionnels.

## 8.1 Typologie

- EB Hors PAP / fonctionnement

- EB PAP / investissement

- EB mono-ligne ou multi-lignes lorsque la politique l’autorise

- EB avec sous-lignes de détail pour une même activité budgétaire

- EB liée à un marché, contrat, bon de commande, mission ou autre objet de dépense

- EB rectificative / nouvelle version après retour ou modification substantielle



## 8.2 Initiation et circuits de validation

**Hors PAP :** l’EB de fonctionnement est initiée par le Service des Moyens Généraux selon le processus de collecte prévu. Le circuit de référence est : Service des Moyens Généraux → DRHMG → Secrétaire Général → Ordonnateur principal (Président) pour approbation/signature lorsque cette étape est prévue dans le workflow institutionnel. La validation définitive déclenche la création automatique de l’Engagement.

**PAP - département technique :** initiateur habilité (expert/chef de service) → Directeur → Commissaire compétent. **PAP - département d’appui :** initiateur habilité → Directeur → Secrétaire Général. Les règles d’approbation finale paramétrées sont appliquées sans supprimer les validations institutionnelles ci-dessus.

## 8.3 Formulaire EB

- Référence automatique et exercice ; date de création et date de besoin.

- Structure initiatrice, service, responsable et centre de responsabilité.

- Objet, justification, urgence, priorité et nature du besoin.

- Classification PAP / Hors PAP déterminée à partir de la ligne budgétaire et non par simple saisie libre.

- Ligne budgétaire/activité, nomenclature et source de financement.

- Pour le PAP : chaîne GAR/RBM héritée et affichée.

- Bénéficiaire / fournisseur pressenti lorsque autorisé à ce stade.

- Montant estimatif, devise et ventilation de financement.

- Sous-lignes : désignation, tâche/rubrique, quantité, unité, prix unitaire, montant, observations.

- Pièces jointes obligatoires selon type de besoin.

- Références éventuelles à un marché, contrat, plan de passation ou demande d’achat.



## 8.4 Imputation multi-sous-lignes

Une ligne budgétaire représente l’activité. L’activité peut être détaillée en plusieurs tâches ou rubriques équivalentes aux détails d’un bon de commande ou d’une facture. Le formulaire permet d’ajouter autant de sous-lignes que nécessaire. Chaque sous-ligne comporte au minimum une désignation, une quantité, une unité, un prix unitaire et un montant calculé. Le total de toutes les sous-lignes doit être strictement égal au montant de l’activité imputée. Le contrôle budgétaire s’effectue sur le total de l’activité, tandis que la traçabilité aval conserve le détail des sous-lignes.

## 8.5 Contrôles automatiques

- Exercice ouvert et ligne budgétaire exécutoire.

- Structure autorisée à consommer la ligne.

- Complétude des données obligatoires et pièces requises.

- Cohérence PAP/Hors PAP avec la ligne budgétaire.

- Cohérence de la chaîne GAR/RBM pour les EB PAP.

- Total sous-lignes = montant de l’activité.

- Contrôle du disponible et détection des réservations/dossiers concurrents selon politique.

- Détection des doublons probables (même objet, fournisseur, montant, période ou référence).

- Contrôle des seuils et règles de marché lorsque le montant ou la nature du besoin le requiert.



## 8.6 Statuts de référence

- Brouillon

- À compléter

- Soumise

- En validation DRHMG / Directeur

- En validation SG / Commissaire

- En approbation / signature

- Retournée pour correction

- Rejetée

- Validée

- Annulée

- Remplacée par nouvelle version

- Engagement généré



## 8.7 Retours, rejets et modifications

Tout retour ou rejet est motivé. Un retour conserve le dossier modifiable par l’acteur attendu. Un rejet clôt le circuit sauf décision explicite de réouverture selon droits. Une modification substantielle d’une EB déjà approuvée (montant, imputation, bénéficiaire, objet, structure, source de financement, rattachement PAP ou éléments affectant les validations) crée une nouvelle version et relance le circuit complet. L’ancienne version reste consultable et non modifiable.

## 8.8 Validation définitive et transition

La validation définitive verrouille la version validée, crée un snapshot immuable, journalise les décisions et génère le PDF EB officiel. L’Engagement est créé automatiquement et de manière idempotente : un même événement de validation ne peut créer qu’un seul engagement. Les pièces et métadonnées utiles sont héritées vers l’ENG ; les documents restent liés dans la GED.

## 8.9 PDF et GED

- Fiche EB officielle avec référence, objet, structure, ligne budgétaire, chaîne PAP le cas échéant, sous-lignes, montant, pièces, validations et dates.

- QR-code ou identifiant de vérification lorsque cette fonction est activée.

- Hash du document, version, statut et auteur de génération.

- Archivage automatique dans le dossier GED du dossier de dépense.



## 8.10 Critères d’acceptation EB

- **EB-001** - Une EB Hors PAP est initiée par le Service des Moyens Généraux et suit le circuit configuré conforme à la règle institutionnelle.

- **EB-002** - Une EB PAP récupère automatiquement la chaîne de résultats disponible.

- **EB-003** - Le système permet plusieurs sous-lignes pour une même activité et calcule un total unique.

- **EB-004** - Le système bloque une EB lorsque le total des sous-lignes est incohérent.

- **EB-005** - Toute validation/rejet/retour est historisé avec acteur, date et commentaire.

- **EB-006** - La validation définitive génère une seule fois l’ENG et le PDF officiel.

- **EB-007** - Une modification substantielle d’une EB approuvée produit une nouvelle version et reprend les validations.




## 8.11 Narration fonctionnelle du cycle EB

L'Expression de Besoin est le point d'entrée opérationnel de la dépense. Elle doit traduire un besoin administratif ou programmatique en une demande structurée, chiffrée, justifiée, rattachée à un crédit et suffisamment documentée pour permettre aux niveaux de validation de statuer sans reconstruire le dossier. Le système doit guider l'initiateur, afficher le solde budgétaire pertinent, signaler les pièces attendues et expliquer les anomalies avant soumission.

Pour une EB Hors PAP, l'application doit privilégier l'initiation par le Service des Moyens Généraux conformément aux règles validées. Le besoin peut provenir d'une structure demanderesse, mais la création institutionnelle et la consolidation de l'EB de fonctionnement doivent rester maîtrisées par l'acteur habilité. Pour une EB PAP, l'application doit partir de la programmation approuvée et récupérer les éléments disponibles de la chaîne GAR/RBM. L'utilisateur ne doit pas ressaisir le pilier, l'axe, le produit, le sous-produit, l'activité, les tâches, les indicateurs ou l'unité responsable lorsqu'ils existent déjà dans la programmation.

Lorsqu'une activité budgétaire couvre plusieurs tâches, biens ou prestations, l'EB doit permettre la création de sous-lignes détaillées. Le total de ces sous-lignes doit constituer le montant demandé sur l'activité. Chaque sous-ligne peut porter une quantité, une unité de mesure, un prix unitaire, un montant, une description et, lorsque nécessaire, une tâche GAR/RBM. Le contrôle doit empêcher que le total calculé diverge du montant soumis.

## 8.12 Fonctions essentielles complémentaires de l'EB

- brouillon automatique et sauvegarde progressive ;
- duplication contrôlée d'une EB antérieure, sans reprise de son statut ni de ses signatures ;
- assistant de choix de ligne budgétaire avec affichage du budget initial, révisé, engagé, liquidé, ordonnancé, payé et disponible ;
- contrôle des doublons par combinaison exercice, structure, objet, fournisseur éventuel, montant et période ;
- possibilité de créer une EB multi-pièces et multi-sous-lignes tout en conservant une imputation principale ;
- justification obligatoire en cas de dépassement d'un seuil de matérialité paramétré ;
- historique des retours avec conservation de chaque version soumise ;
- comparaison visuelle entre la version retournée et la version corrigée ;
- checklist dynamique des pièces selon nature de dépense ;
- verrouillage de la version soumise pendant instruction, sauf retour formel ;
- gestion de l'urgence exceptionnelle par workflow spécifique, sans suppression des contrôles obligatoires ;
- indicateur de délai de traitement et ancienneté dans la file de l'acteur attendu ;
- abonnement du demandeur aux changements d'état et à la génération des actes.

## 8.13 Gestion des exceptions EB

Une EB peut être retournée pour correction, rejetée, annulée avant engagement ou rendue caduque. Tout retour doit comporter un motif, l'acteur, la date et les éléments à corriger. Le rejet doit clore la version concernée tout en permettant, selon les droits, la création d'une nouvelle EB liée à l'ancienne. L'annulation d'une EB ayant déjà généré un engagement ne doit pas être possible directement : elle doit déclencher la procédure d'annulation ou de dégagement en aval afin de préserver la cohérence des montants.

## 8.14 Données et contrôles supplémentaires EB

Le système doit conserver au minimum : devise, taux applicable si devise étrangère, urgence éventuelle, nature d'achat, type de bénéficiaire, centre de coût, source de financement, localisation de la dépense, exercice, période d'exécution, référence de marché ou contrat lorsqu'elle existe, responsable technique, date souhaitée, niveau de priorité et justification métier. Les champs doivent être rendus obligatoires de manière conditionnelle selon la nature de la dépense.


# 9. Procédure détaillée - Engagement (ENG)

L’Engagement matérialise l’affectation d’une partie du crédit disponible à une obligation déterminée. Il est normalement généré automatiquement à partir d’une EB validée. Une création manuelle n’est admise que dans les cas autorisés par la réglementation interne, avec justification obligatoire, droit spécifique et traçabilité renforcée.

## 9.1 Préconditions

- EB validée et non annulée, sauf cas manuel autorisé.

- Exercice ouvert et ligne budgétaire exécutoire.

- Crédit disponible suffisant, en tenant compte des engagements et réservations existants.

- Données du tiers complètes lorsque le bénéficiaire est connu.

- Pièces requises présentes selon la nature de l’engagement.



## 9.2 Données héritées

L’ENG reprend automatiquement la référence EB, l’objet, le type PAP/Hors PAP, l’organisation, la chaîne GAR/RBM, les imputations, sous-lignes, sources de financement, montant autorisé, pièces, marché/contrat éventuel et métadonnées de validation. La ressaisie de ces informations est interdite lorsque les données sont déjà validées en amont ; seules les données propres à l’engagement sont ajoutées.

## 9.3 Données propres à l’engagement

- Type d’engagement : initial, complémentaire, modificatif, régularisation autorisée, pluriannuel le cas échéant.

- Date d’engagement, échéance et période.

- Bénéficiaire/fournisseur, références fiscales ou administratives et coordonnées utiles.

- Référence du marché/contrat/bon de commande lorsque applicable.

- Montant brut, taxes, retenues prévisionnelles, montant net indicatif et devise.

- Ventilation par ligne, source de financement, tâche/sous-ligne et composante.

- Observations de l’Expert Budget, du Chef de Service Budget, du Directeur Budget et du Contrôle Financier.



## 9.4 Workflow de référence

1. Création automatique de l’ENG à partir de l’EB validée.

2. Instruction par l’Expert Budget : contrôle des données héritées, compléments, pièces et cohérence budgétaire.

3. Soumission au Chef de Service Budget pour validation N+1.

4. Validation par le Chef de Service Budget ou retour motivé à l’Expert Budget.

5. Validation par le Directeur Budget : vérification budgétaire finale, réservation/confirmation du crédit et transmission.

6. Visa du Contrôleur Financier. Le visa positif rend l’engagement exécutoire pour la liquidation.

7. Après visa, génération automatique et idempotente de la Liquidation ou ouverture du dossier de liquidation selon la configuration.

8. Production du Bon/Fiche d’Engagement et du Certificat d’Engagement Budgétaire ; archivage GED.



## 9.5 Contrôles budgétaires et métier

- Montant engagé ≤ montant de l’EB validée, sauf avenant/version régulièrement approuvé.

- Cumul des engagements actifs rattachés à l’EB ≤ montant autorisé par l’EB.

- Montant engagé ≤ crédit disponible de la ligne au moment de la validation transactionnelle.

- Absence de double engagement pour la même obligation/référence.

- Cohérence entre activité budgétaire et sous-lignes/tâches.

- Cohérence fournisseur/contrat/marché et respect des plafonds lorsque ces objets sont utilisés.

- Interdiction de modifier les données héritées qui conditionnent l’autorisation budgétaire sans revenir à une version de l’EB.

- Verrouillage pessimiste ou contrôle transactionnel pour empêcher deux validations concurrentes de consommer le même solde.



## 9.6 Statuts de référence

- Généré

- En instruction Budget

- Soumis Chef de Service Budget

- Retourné Budget

- Validé N+1

- Soumis Directeur Budget

- Validé Budget / crédit réservé

- Transmis Contrôle Financier

- Visé

- Visa refusé

- Annulé

- Modifié / remplacé

- Liquidation ouverte

- Soldé



## 9.7 Retour, refus de visa, annulation et modification

Tout retour ou refus est motivé et journalisé. Un refus de visa ne doit pas effacer la réservation ou l’historique ; le traitement de la réservation dépend du statut final et de la règle paramétrée (maintien temporaire, libération après rejet définitif ou nouvelle version). Une modification portant sur le montant, l’imputation, le bénéficiaire ou le fondement contractuel après visa doit produire un engagement modificatif ou une nouvelle version conforme au circuit d’approbation, sans altérer l’acte visé.

## 9.8 Engagements partiels / multiples

Une EB peut, lorsque la règle métier l’autorise, donner lieu à plusieurs engagements partiels. Le système conserve le cumul engagé, le reliquat de l’EB et l’état de consommation. Aucun nouvel engagement ne peut dépasser le reliquat. La liquidation est rattachée à l’engagement précis ayant créé l’obligation.

## 9.9 Documents

- Fiche / Bon d’Engagement

- Certificat d’Engagement Budgétaire

- Bordereau de transmission au Contrôle Financier lorsque requis

- Historique des visas et observations

- Pièces contractuelles ou administratives associées



## 9.10 Critères d’acceptation ENG

- **ENG-001** - Un ENG est généré automatiquement à partir d’une EB validée et hérite de ses données structurantes.

- **ENG-002** - La validation budgétaire s’effectue transactionnellement sur le crédit disponible.

- **ENG-003** - Le cumul engagé ne peut excéder l’EB ni le disponible.

- **ENG-004** - Le visa du Contrôle Financier est requis avant la liquidation selon le workflow retenu.

- **ENG-005** - Le système gère les engagements partiels avec reliquat visible.

- **ENG-006** - Les versions, refus, annulations et engagements modificatifs sont intégralement auditables.

- **ENG-007** - La validation finale produit les PDF prévus et ouvre la LIQ de manière idempotente.




## 9.11 Narration fonctionnelle du cycle ENG

L'Engagement matérialise la décision de réserver une partie des crédits pour une obligation déterminée. GESBUDEP doit distinguer l'engagement juridique, lorsque le contexte l'exige, et l'engagement budgétaire/financier qui consomme ou réserve le disponible. L'acte ne doit être créé qu'à partir d'une EB validée et ne doit jamais pouvoir porter sur un montant supérieur au besoin autorisé, sous réserve des procédures d'avenant ou de modification formelle.

Le contrôle de disponibilité doit être transactionnel : au moment où plusieurs utilisateurs tentent d'engager le même crédit, une seule opération doit pouvoir consommer le solde correspondant. Les soldes affichés à l'écran ne suffisent pas ; le backend doit recalculer et verrouiller les montants lors de la validation définitive afin d'éviter un surengagement lié à des opérations concurrentes.

## 9.12 Fonctions essentielles complémentaires de l'ENG

- gestion des engagements totaux, partiels, successifs et pluriannuels lorsque le cadre institutionnel le permet ;
- réservation temporaire de crédit pendant la phase d'instruction, avec délai d'expiration paramétrable ;
- prise en compte des marchés, contrats, bons de commande et conventions ;
- gestion des avenants avec calcul automatique du montant initial, des avenants antérieurs, du nouveau cumul et du disponible ;
- dégagement total ou partiel des crédits non consommés, avec motif et validation ;
- distinction des montants engagés, consommés, dégagés et restant à liquider ;
- contrôle des seuils de marché et du type de procédure d'achat, sans préjuger des règles juridiques qui seront paramétrées ;
- vérification automatique des coordonnées et du statut du fournisseur ;
- contrôle de l'existence et de la validité des pièces exigées ;
- génération d'un numéro unique non réutilisable par exercice ;
- chronologie complète des visas, observations et délais.

## 9.13 Cas de modification, annulation et dégagement

Une modification d'engagement ne doit jamais écraser l'acte antérieur. Le système doit créer une opération de modification ou d'avenant, conserver les valeurs avant/après et recalculer les soldes. Le dégagement doit restituer au disponible la partie explicitement libérée qui n'a pas déjà fait l'objet d'une liquidation. Une annulation d'engagement déjà liquidé doit être interdite sauf procédure de correction spécifique, avec contre-passation ou opération compensatrice correctement tracée.


# 10. Procédure détaillée - Liquidation (LIQ)

La Liquidation constate la réalité de la dette et arrête le montant exact dû après vérification du service fait, des quantités, des prix, des pièces justificatives et des retenues applicables. Elle ne peut intervenir que sur un engagement valide, visé et non annulé.

## 10.1 Préconditions

- Engagement validé/visé et disposant d’un reliquat liquidable.

- Service fait, livraison ou événement justificatif réel et documenté.

- Pièces justificatives présentes et valides : facture, PV, attestation, bon de livraison, décompte, contrat ou autres selon nature.

- Le tiers correspond au bénéficiaire autorisé ou à une substitution régulièrement approuvée.



## 10.2 Génération et héritage

La LIQ est créée automatiquement à partir de l’ENG visé. Elle hérite de toutes les références amont : EB, ENG, budget, PAP/GAR, activité, tâche, tiers, contrat/marché et pièces communes. Les données propres à la liquidation sont ajoutées sans modifier le fondement de l’engagement.

## 10.3 Données et calculs

- Montant brut liquidé par ligne / sous-ligne.

- Quantités engagées, livrées, acceptées, rejetées et restant à livrer lorsque applicable.

- Taxes, retenues, pénalités, avances à déduire, garanties, révisions de prix et autres ajustements.

- Montant net liquidé.

- Cumul déjà liquidé, reliquat liquidable et solde après opération.

- Numéro et date de facture ; contrôle d’unicité du numéro par fournisseur/exercice selon règle.

- Date du service fait / réception ; référence PV ou attestation.

- Commentaire de certification et réserves éventuelles.



## 10.4 Workflow de référence

1. Création automatique de la LIQ depuis l’ENG visé.

2. Préparation des éléments de liquidation et rattachement des pièces justificatives.

3. Certification du service fait par le service initiateur ou le responsable compétent.

4. Contrôles automatiques de montant, facture, pièces, engagement et cumul.

5. Transmission au Contrôle Financier pour visa selon le circuit défini.

6. Visa, retour pour correction ou rejet motivé.

7. Après visa définitif, verrouillage de la liquidation, production des états PDF et génération automatique/idempotente de l’Ordonnancement.

8. Mise à jour des agrégats : liquidé, reste à liquider et indicateurs d’exécution.



## 10.5 Liquidations totales, partielles et successives

Le système doit gérer les liquidations totales, partielles et successives. Le cumul des liquidations validées non annulées ne peut dépasser le montant net engagé autorisé. Chaque liquidation indique son rang, son montant, le cumul antérieur et le reliquat. Les opérations simultanées doivent être protégées par transaction afin que deux liquidations concurrentes ne puissent dépasser le solde.

## 10.6 Contrôles bloquants

- LIQ valide uniquement si ENG est visé et non annulé.

- Cumul LIQ validé ≤ ENG net disponible.

- Facture non dupliquée selon clés de contrôle configurées.

- Service fait obligatoire sauf cas réglementaire explicitement autorisé (avance, acompte ou autre régime identifié).

- Pièces obligatoires selon type de dépense.

- Montants calculés cohérents avec quantités, prix, retenues et taxes.

- Le montant net ne peut être négatif.

- Les pénalités/retenues doivent être justifiées et tracées.

- Toute substitution de pièce après validation crée une nouvelle version ou une procédure de rectification.



## 10.7 Statuts

- Générée

- En préparation

- Service fait à certifier

- Service fait certifié

- Soumise au Contrôle Financier

- Retournée

- Visée

- Visa refusé

- Partiellement liquidée

- Totalement liquidée

- Annulée / rectifiée

- Ordonnancement généré



## 10.8 Documents

- Fiche / État de Liquidation

- Attestation ou Certificat de Service Fait

- PV de réception lorsque requis

- Bordereau ou état des retenues / pénalités

- Pièces justificatives originales ou copies contrôlées

- Historique du visa



## 10.9 Critères d’acceptation LIQ

- **LIQ-001** - Aucune LIQ n’est validable sans ENG visé.

- **LIQ-002** - Le service fait et les pièces requises sont contrôlés avant validation.

- **LIQ-003** - Le cumul liquidé ne peut dépasser le montant engagé disponible.

- **LIQ-004** - Les liquidations partielles et successives sont gérées avec reliquat exact.

- **LIQ-005** - Le système détecte les factures potentiellement dupliquées.

- **LIQ-006** - La validation finale crée une seule fois l’ORD et les PDF officiels.

- **LIQ-007** - Les retenues, pénalités, avances et taxes restent calculables et auditables.




## 10.10 Narration fonctionnelle du cycle LIQ

La Liquidation constate le droit du créancier et arrête le montant exact de la dette après vérification du service fait. Elle ne doit donc pas être une simple copie de l'engagement : elle doit porter les éléments de preuve permettant de constater que le bien a été livré, que la prestation a été exécutée ou que la condition de paiement prévue est satisfaite.

Le système doit permettre plusieurs liquidations sur un engagement lorsque les prestations sont partielles ou échelonnées. Chaque liquidation doit diminuer le solde restant à liquider. Le contrôle doit porter simultanément sur le montant de la liquidation, le cumul des liquidations antérieures, les éventuelles retenues et pénalités, les taxes, les avances déjà versées et le plafond de l'engagement.

## 10.11 Fonctions essentielles complémentaires de la LIQ

- certificat de service fait ou procès-verbal de réception selon nature de dépense ;
- saisie des références de facture, date, échéance et montant TTC/HT/taxes lorsqu'applicable ;
- contrôle de facture en doublon par numéro, fournisseur, date et montant ;
- ventilation des retenues, pénalités, avances à récupérer, taxes et net à payer ;
- association à un lot, jalon, livraison ou période de prestation ;
- rapprochement commande/contrat - réception - facture (contrôle à deux ou trois pièces selon configuration) ;
- contrôle des quantités réceptionnées par rapport aux quantités commandées ;
- gestion des écarts de réception avec justification et validation ;
- gestion des avoirs et notes de crédit ;
- blocage d'une facture litigieuse sans bloquer nécessairement l'intégralité du contrat ;
- calcul du délai entre réception de facture, certification, visa et ordonnancement.

## 10.12 Règles de preuve du service fait

La nature des preuves doit être paramétrable : bon de livraison, procès-verbal de réception, attestation de service fait, rapport de mission, feuille de présence, livrable technique, photographie, décompte ou autre pièce. Le système doit imposer les pièces pertinentes selon le type de dépense et conserver la version exacte utilisée lors de la certification.


# 11. Procédure détaillée - Ordonnancement (ORD)

L’Ordonnancement est l’acte par lequel l’ordonnateur donne ordre de payer une dette liquidée et validée. Il est créé à partir d’une liquidation visée. L’application applique les délégations et seuils d’ordonnancement, assure les contrôles documentaires et transmet l’ordre signé à l’Agence Comptable.

## 11.1 Préconditions

- Liquidation validée/visée et non annulée.

- Solde ordonnançable positif.

- Pièces justificatives complètes et disponibles dans la GED.

- Ordonnateur ou délégataire disposant d’une habilitation valide à la date de décision.



## 11.2 Seuils d’ordonnateur

Règle institutionnelle consolidée : le Secrétaire Général, ordonnateur délégué, ordonne les montants **inférieurs ou égaux à 5 000 000 XAF** ; le Président, ordonnateur principal, ordonne les montants **strictement supérieurs à 5 000 000 XAF**. Le seuil doit être paramétrable et versionné pour permettre une évolution réglementaire, mais la valeur applicable à l’exercice est conservée avec chaque acte.

## 11.3 Données

- Références EB, ENG, LIQ et dossier GED.

- Bénéficiaire, coordonnées et compte de paiement validé.

- Montant ordonnancé brut/net selon modèle retenu.

- Retenues déjà prises en compte et montant effectivement payable.

- Imputation budgétaire, financement, PAP/GAR, activité et tâche.

- Ordonnateur déterminé par règle de seuil et délégation.

- Date de l’ordre, échéance et priorité de paiement.



## 11.4 Workflow de référence

1. Génération automatique de l’ORD à partir de la LIQ validée.

2. Contrôles automatiques du solde, des pièces, de l’habilitation et du seuil.

3. Préparation de l’ordre de paiement et, si nécessaire, contrôle interne administratif préalable.

4. Affectation automatique à l’ordonnateur compétent : SG jusqu’au seuil inclus, Président au-delà.

5. Lecture, retour motivé ou signature/validation par l’ordonnateur.

6. Après signature : production de l’Ordre de Paiement (OP) signé, verrouillage et transmission automatique à l’Agence Comptable.

7. Génération du dossier de paiement et mise à jour des agrégats ordonnancés.

8. Notification au service initiateur, Budget, Contrôle Financier et Agence Comptable selon profils.



## 11.5 Ordonnancements partiels et multiples

Lorsque le cadre de gestion l’autorise, une même liquidation peut donner lieu à plusieurs ordonnancements partiels. Le cumul des ordonnancements validés ne peut dépasser la liquidation validée. Le système conserve le reste à ordonnancer et interdit tout dépassement en concurrence. Chaque ordonnancement reste lié à la liquidation source et à ses pièces.

## 11.6 Contrôles

- ORD ≤ solde de la LIQ validée.

- Cumul ORD validé ≤ cumul LIQ validé.

- Ordonnateur conforme au seuil et à la délégation en vigueur.

- Absence d’incompatibilité SoD entre ordonnateur et Agent Comptable.

- Compte bancaire ou modalité de paiement du bénéficiaire contrôlé selon les règles de l’Agence Comptable.

- Pièces et visas requis présents.

- Absence d’ordre déjà signé pour le même reliquat.

- Interdiction de modifier le montant ou le bénéficiaire après signature sans procédure de rectification/annulation.



## 11.7 Statuts

- Généré

- En contrôle

- À signer SG

- À signer Président

- Retourné

- Signé / ordonnancé

- Rejeté

- Annulé / rectifié

- Transmis Agence Comptable

- Pris en charge

- Paiement ouvert

- Soldé



## 11.8 Documents

- Fiche d’Ordonnancement

- Ordre de Paiement (OP)

- Bordereau de transmission à l’Agence Comptable

- Historique de signature et délégation applicable

- Annexe des pièces et références amont



## 11.9 Critères d’acceptation ORD

- **ORD-001** - Un ORD ne peut être créé que depuis une LIQ validée, sauf procédure exceptionnelle explicitement autorisée.

- **ORD-002** - Le SG est sélectionné automatiquement pour un montant ≤ 5 000 000 XAF et le Président au-delà.

- **ORD-003** - Le cumul ordonnancé ne peut dépasser le liquidé.

- **ORD-004** - L’OP signé est archivé et transmis automatiquement à l’Agence Comptable.

- **ORD-005** - Les ordonnancements partiels conservent le reliquat exact.

- **ORD-006** - Toute signature, délégation, retour, rejet, annulation ou rectification est auditée.

- **ORD-007** - La signature déclenche une seule fois l’ouverture du paiement.




## 11.10 Narration fonctionnelle du cycle ORD

L'Ordonnancement constitue l'instruction donnée au comptable de payer une dette régulièrement liquidée. GESBUDEP doit vérifier que l'acte porte sur une liquidation valide, non déjà ordonnancée au-delà de son solde et qu'il respecte les seuils de compétence de l'ordonnateur. Dans la configuration de référence, le Secrétaire Général est ordonnateur délégué jusqu'à 5 000 000 XAF inclus et le Président, ordonnateur principal, intervient au-delà de ce seuil.

Le choix de l'ordonnateur doit être automatique à partir du montant à ordonnancer et de la règle applicable à la date de l'acte. Toute modification des seuils doit être versionnée et ne doit pas modifier rétroactivement les dossiers déjà validés.

## 11.11 Fonctions essentielles complémentaires de l'ORD

- ordonnancement total ou partiel ;
- regroupement contrôlé de plusieurs liquidations homogènes si les procédures l'autorisent ;
- interdiction d'ordonnancer un montant supérieur au solde liquidé non ordonnancé ;
- contrôle automatique de l'exercice et de la période ;
- gestion des suspensions et rejets par l'Agence Comptable avec motif codifié et commentaire libre ;
- correction sans perte de l'historique ;
- signature électronique ou visa numérique lorsque l'infrastructure est disponible ;
- QR code ou identifiant de vérification du document officiel ;
- bordereau de transmission à l'Agence Comptable ;
- gestion de lots de transmission et accusés de réception ;
- suivi des délais entre liquidation, ordonnancement, prise en charge et paiement.

## 11.12 Prise en charge comptable

Le système doit permettre à l'Agence Comptable de prendre en charge, suspendre ou rejeter un ordre selon ses compétences. Une prise en charge crée une trace comptable de référence et rend le dossier disponible pour le paiement. Un rejet doit réorienter le dossier vers l'étape compétente sans effacer les actes précédents. Les motifs de rejet doivent être analysables statistiquement afin d'identifier les causes récurrentes d'anomalies.


# 12. Procédure détaillée - Paiement (PAI)

Le Paiement constitue le décaissement effectif après prise en charge de l’ordre de paiement par l’Agence Comptable. Il doit pouvoir être exécuté par virement, chèque ou caisse selon les règles autorisées. La phase de paiement assure les contrôles du tiers, des coordonnées de règlement, de la trésorerie, des plafonds, des doublons et des preuves d’exécution.

## 12.1 Préconditions

- OP signé et transmis à l’Agence Comptable.

- Prise en charge comptable ou statut équivalent requis avant décaissement.

- Bénéficiaire et coordonnées de paiement contrôlés.

- Solde payable positif.

- Mode de paiement autorisé et moyens de trésorerie disponibles selon politique.



## 12.2 Acteurs et workflow

1. Réception / prise en charge de l’OP par l’Agence Comptable.

2. Préparation de l’opération par le Comptable ou agent habilité : compte payeur, bénéficiaire, mode, montant, référence bancaire/caisse/chèque.

3. Contrôle par le Chef Comptable : conformité, doublons, solde payable, trésorerie et pièces.

4. Signature / autorisation par l’Agent Comptable selon les règles en vigueur.

5. Exécution : ordre de virement, émission de chèque, décaissement caisse ou interface bancaire.

6. Enregistrement du résultat : exécuté, en attente, rejet bancaire, chèque annulé, échec technique, paiement partiel.

7. Rattachement de la preuve de paiement et, le cas échéant, accusé bancaire.

8. Rapprochement bancaire / caisse et mise à jour des statuts financiers.

9. Production de l’avis / fiche de paiement et notification des acteurs.



## 12.3 Calcul du solde payable

Le solde payable d’un ordonnancement correspond au montant net ordonnancé diminué du cumul des paiements exécutés et non annulés. Un paiement ne peut jamais dépasser ce solde. Le calcul doit être effectué au moment de la validation dans une transaction protégée contre les doubles paiements et les validations concurrentes.

## 12.4 Paiements partiels et multiples

Le système gère les paiements partiels et multiples lorsque l’Agence Comptable le décide ou lorsque les disponibilités de trésorerie l’imposent. Chaque paiement indique le montant, le rang, le cumul payé, le reste à payer et la preuve. Le dossier ORD reste ouvert jusqu’au paiement total ou à une clôture/annulation régulièrement justifiée.

## 12.5 Modes de paiement

- Virement bancaire : génération/référence de l’ordre, compte débit, compte crédit, banque, date de valeur, statut bancaire.

- Chèque : numéro, banque, signataire(s), date d’émission, remise, encaissement/annulation.

- Caisse : pièce de caisse, bénéficiaire, identification, date, plafond, acquit et justification.



## 12.6 Contrôles bloquants

- PAI ≤ solde ORD payable.

- Absence de paiement exécuté dupliqué pour la même référence bancaire/chèque/transaction.

- Compte bénéficiaire valide, actif et cohérent avec le tiers ; changement sensible soumis à contrôle renforcé.

- Compte payeur et devise autorisés.

- Plafond caisse/chèque respecté si paramétré.

- Trésorerie disponible ou autorisation explicite de mise en attente.

- Signature Agent Comptable requise avant exécution définitive selon le mode.

- Preuve obligatoire pour passer au statut payé/exécuté.

- Un rejet bancaire ne doit pas être comptabilisé comme paiement exécuté ; il ouvre une action de correction/réémission.



## 12.7 Statuts

- Reçu Agence Comptable

- Pris en charge

- En préparation

- En contrôle Chef Comptable

- À signer Agent Comptable

- Autorisé

- En exécution

- Exécuté partiellement

- Payé

- Rejet bancaire

- Échec / à réémettre

- Annulé

- Rapproché

- Clôturé



## 12.8 Documents

- Fiche / Avis de Paiement

- Ordre de Virement lorsque applicable

- Chèque / bordereau de chèque lorsque applicable

- Pièce de caisse / acquit lorsque applicable

- Preuve de règlement / retour bancaire

- Bordereau de rapprochement

- Historique de prise en charge et signatures



## 12.9 Rapprochement et impact aval

Un paiement exécuté met à jour le payé budgétaire et les restes à payer. Le rapprochement compare les opérations du système avec les mouvements bancaires/caisse. Les écarts sont classés, affectés, justifiés et résolus. Le dossier ne peut être considéré comme définitivement clôturé que lorsque les conditions de rapprochement et d’archivage définies sont satisfaites.

## 12.10 Critères d’acceptation PAI

- **PAI-001** - Aucun paiement n’est possible sans OP pris en charge.

- **PAI-002** - Le cumul payé ne peut dépasser le net ordonnancé.

- **PAI-003** - Le système gère virement, chèque et caisse.

- **PAI-004** - Les paiements partiels, rejets bancaires et réémissions sont gérés sans double comptabilisation.

- **PAI-005** - Une preuve est exigée avant le statut payé/exécuté.

- **PAI-006** - Le rapprochement met en évidence les écarts et conserve leur résolution.

- **PAI-007** - Chaque paiement est traçable jusqu’à l’EB, au budget, au PAP et aux pièces justificatives.




## 12.11 Narration fonctionnelle du cycle PAI

Le Paiement est l'étape qui matérialise l'extinction totale ou partielle de la dette par décaissement. Il doit être exécuté par l'Agence Comptable sur la base d'un ordonnancement pris en charge et dans la limite du montant restant payable. Le système doit distinguer la préparation du paiement, son autorisation, son émission et sa confirmation bancaire ou de caisse.

Le paiement doit être conçu comme une opération fortement sécurisée. Toute tentative de double paiement, de modification des coordonnées bancaires après validation ou de réutilisation d'une référence de paiement doit déclencher un blocage ou une alerte selon la criticité. Les coordonnées bénéficiaires utilisées doivent être figées dans un snapshot rattaché au paiement afin qu'un changement ultérieur dans la fiche fournisseur ne modifie pas l'historique.

## 12.12 Fonctions essentielles complémentaires du PAI

- ordre de virement, chèque, caisse ou autre mode autorisé ;
- paiements partiels, fractionnés et groupés selon les règles définies ;
- lots bancaires avec contrôle du total, du nombre d'ordres et de la somme de contrôle ;
- double contrôle ou double approbation des paiements sensibles ;
- liste des paiements en attente de confirmation bancaire ;
- gestion des rejets bancaires, retours de virements et chèques annulés ;
- réémission sécurisée après rejet sans créer de double paiement ;
- rapprochement avec relevés bancaires ou fichiers de confirmation ;
- date de valeur, date d'émission, date de règlement et référence bancaire ;
- calcul du reste à payer et du reste à ordonnancer ;
- production d'avis de paiement et preuve de règlement ;
- gestion des retenues à reverser et des tiers bénéficiaires, lorsque requis ;
- détection des coordonnées bancaires récemment modifiées ou inhabituelles ;
- export bancaire signé/chiffré lorsque l'écosystème technique le permet.

## 12.13 Rapprochement et anomalies de paiement

Un paiement émis mais non confirmé doit rester dans un état intermédiaire. La confirmation doit provenir d'une saisie contrôlée ou, de préférence, d'un retour bancaire/rapprochement. Un rejet bancaire ne rétablit le solde payable qu'après validation de l'anomalie et doit conserver la référence de l'opération rejetée. Les écarts de rapprochement doivent être placés dans une file d'investigation avec affectation, motif, commentaire et résolution documentée.


# 13. Règles transversales de la chaîne de dépense

## 13.1 Contraintes de montants

- Somme des sous-lignes EB = montant EB.

- Cumul ENG ≤ montant EB autorisé et crédit disponible.

- Cumul LIQ ≤ montant ENG disponible.

- Cumul ORD ≤ montant LIQ validé.

- Cumul PAI exécuté ≤ montant ORD net payable.

- Les montants annulés sont neutralisés selon leur date d’effet et restent visibles dans l’audit.



## 13.2 Filiation obligatoire

Chaque objet financier porte les identifiants de filiation nécessaires pour reconstituer le graphe EB → ENG → LIQ → ORD → PAI ainsi que Budget → PAP/GAR → activité → tâche. Aucune dépense orpheline ne doit être admise en production, sauf procédure exceptionnelle explicitement identifiée, autorisée et auditée.

## 13.3 Idempotence et atomicité

Toute transition automatique doit posséder une clé d’idempotence fondée sur l’événement source. La validation définitive, la consommation de crédit, la génération de l’étape aval, l’écriture d’audit et la création des documents critiques doivent être réalisées dans une transaction cohérente ou selon un mécanisme garantissant la reprise sans duplication.

## 13.4 Mes tâches

Le tableau « Mes tâches » présente les dossiers nécessitant une action de l’utilisateur, triés par défaut du plus récent au plus ancien. Chaque ligne affiche la référence, le type d’acte, l’objet, le montant, l’émetteur, l’étape, la date d’arrivée, le délai et l’urgence. Une bannière de processus indique qui a réalisé la dernière action, quelle est la prochaine étape et quel acteur est attendu.

# 14. Gestion des marchés, contrats et commandes

Le module gère les informations nécessaires pour rattacher une dépense à un marché, contrat, bon de commande ou convention. Il ne remplace pas nécessairement une plateforme complète de passation, mais doit couvrir le cycle utile à GESBUDEP et permettre l’interopérabilité avec un système de marchés publics.

- Référence, objet, type, procédure, attributaire, dates, montant initial et révisé.

- Lots, avenants, garanties, pénalités, délais, échéances et taux d’exécution.

- Plafond engagé, liquidé et payé par contrat.

- Pièces contractuelles dans la GED.

- Rattachement aux EB/ENG/LIQ/ORD/PAI et contrôle de dépassement du contrat.

- Alertes d’échéance, de plafond et de garantie.



# 15. Entreprises, fournisseurs, consultants et bénéficiaires

- Fiche tiers unique avec identifiant, type, raison sociale/nom, coordonnées, pays, informations fiscales et administratives.

- Comptes bancaires versionnés, avec statut et justificatifs ; changement de compte soumis à contrôle renforcé.

- Pièces de conformité et dates d’expiration.

- Historique des contrats, engagements, paiements et incidents.

- Détection des doublons de tiers et rapprochement des fiches.

- Statut actif, suspendu, bloqué, archivé, avec motif et période.



# 16. Suivi-Évaluation et performance

Le processus S&E doit couvrir en un cycle cohérent : **Réalisation physique → Mesure des indicateurs → Évaluation → Reporting**. Il est alimenté par la planification et les données financières réelles de la chaîne de dépense.

## 16.1 Réalisation physique

- Déclaration des réalisations par activité/tâche et période.

- Pièces probantes, commentaires, localisation lorsque utile et responsables.

- Validation ou certification des réalisations selon workflow.

- Lien avec les dépenses correspondantes sans imposer une égalité mécanique entre avancement physique et paiement.



## 16.2 Mesure des indicateurs

- Valeur de référence, cible annuelle/pluriannuelle, valeur réalisée, unité, source et méthode de calcul.

- Fréquence de collecte et responsable de donnée.

- Contrôles de cohérence, pièces et justification des écarts.

- Agrégation aux niveaux produit, axe, pilier et structure lorsque la formule le permet.



## 16.3 Évaluation

- Analyse des écarts physique/financier.

- Commentaires, causes, risques, mesures correctives et responsables.

- Notation qualitative configurée sans masquer les valeurs sources.

- Historique des évaluations et décisions.



## 16.4 Reporting S&E

- Tableaux de performance physique et financière.

- Taux d’exécution par activité, structure, produit, axe et pilier.

- Alertes sur retard, sous-exécution, dépassement ou incohérence.

- Rapports périodiques et exports PDF/Excel.



# 17. Contrôle budgétaire et contrôle interne

Le module de contrôle agrège les règles préventives, détectives et correctives. Il ne doit pas seulement afficher des alertes : certaines règles sont bloquantes et doivent empêcher une transition tant que la condition n’est pas corrigée ou qu’une dérogation régulière n’est pas enregistrée.

- Contrôle du crédit disponible et des cumuls à chaque étape.

- Contrôle des seuils de délégation et des habilitations.

- Contrôle SoD et conflits de rôles.

- Contrôle des pièces obligatoires et expirations.

- Contrôle des doublons de facture, tiers, paiement et référence bancaire.

- Contrôle des dépassements de contrat/marché.

- Contrôle des délais de traitement et dossiers stagnants.

- Contrôle des modifications après validation et versionnement.

- Journal des anomalies, observations, plans d’action et clôture des recommandations.

- Échantillonnage et extraction des dossiers pour audit.



# 18. GED - Gestion électronique des documents

La GED est native et transversale. Elle reçoit automatiquement tous les documents générés par l’application, toutes les pièces jointes déposées dans les formulaires et tous les documents importés depuis les fonctions d’import. Chaque document est rattaché à un dossier, à une catégorie, à un objet métier et à une version.

## 18.1 Sources documentaires

- Documents générés par GESBUDEP : EB, ENG, certificats, LIQ, service fait, ORD/OP, avis de paiement, états, rapports.

- Pièces jointes ajoutées par les utilisateurs.

- Documents importés via fonctions d’import, interfaces ou reprise de données.

- Documents reçus de systèmes tiers lorsque l’interopérabilité l’autorise.



## 18.2 Métadonnées

- Identifiant, nom, catégorie, type MIME, taille et empreinte SHA-256.

- Objet métier, dossier, exercice, structure et niveau de confidentialité.

- Auteur, source, dates, version, statut, validité et expiration.

- Lien vers document remplacé / remplaçant.

- Droits de consultation, téléchargement et suppression logique.



## 18.3 Règles

- Un document validé ou utilisé comme pièce d’un acte signé ne peut être remplacé silencieusement.

- Les suppressions sont logiques et auditables, sauf politique de purge autorisée après échéance légale.

- Les documents officiels générés après validation sont immuables ; une nouvelle version produit un nouveau document.

- Les accès et téléchargements sensibles peuvent être journalisés.



# 19. Workflows, délégations, tâches et notifications

## 19.1 Moteur de workflow

- Définition de processus par type d’acte et exercice/date d’effet.

- Étapes, acteurs, règles de routage, seuils, conditions et délais.

- Retours, rejets, annulations, reprises et escalades.

- Délégations temporaires et suppléances avec dates et périmètres.

- Actions obligatoirement motivées lorsqu’elles dérogent au chemin nominal.

- Interdiction de modifier rétroactivement le workflow d’un dossier déjà en cours sans migration explicite.



## 19.2 Notifications

- Création d’une tâche à chaque étape nécessitant une action humaine.

- Notification in-app et, selon configuration, email/SMS/outil collaboratif.

- Rappels avant et après échéance.

- Escalade à la hiérarchie pour tâches en retard.

- Notifications d’information après validation, rejet, paiement, clôture ou anomalie.

- Préférences utilisateur dans les limites des notifications obligatoires.



# 20. Reporting, états et tableaux de bord

## 20.1 Rapports standards

- Budget initial/révisé, engagements, liquidations, ordonnancements, paiements et disponible.

- Exécution PAP et Hors PAP.

- Reste à engager, à liquider, à ordonnancer et à payer.

- Dépenses par structure, nature, ligne, fournisseur, source de financement et période.

- Dossiers bloqués, retournés, rejetés et délais moyens de traitement.

- Rapports de S&E et performance.

- Rapports de Contrôle Financier, Agence Comptable, contrôle interne et audit.

- Rapports GED et complétude des pièces.



## 20.2 Tableau de bord exécutif

La vue Présidence / SG / Commissaire présente sur une page les KPI consolidés, les alertes critiques, l’exécution budgétaire, la situation PAP/Hors PAP, les principaux risques, les dossiers nécessitant une décision et les tendances. Les droits filtrent automatiquement le périmètre visible.

- Budget révisé, engagé, liquidé, ordonnancé, payé, disponible.

- Taux d’exécution global et par département.

- Top écarts / sous-exécutions.

- Alertes seuils critiques et crédits proches de l’épuisement.

- Dossiers en attente par étape et âge.

- Avancement physique vs financier du PAP.



# 21. GANTT d’exécution PAP / Hors PAP

Le GANTT permet de suivre les activités et tâches programmées dans le temps, y compris les activités PAP et Hors PAP lorsqu’elles disposent de jalons. Il affiche périodes prévues/réelles, dépendances, responsables, avancement, dépenses associées, retards et alertes. Les données temporelles proviennent de la planification et du S&E ; les montants proviennent du Budget et de la chaîne de dépense.

# 22. Import, export et interopérabilité

- Imports contrôlés : budget, nomenclature, organisation, planification, tiers, soldes/reprises et autres référentiels autorisés.

- Prévisualisation, mapping, validation, journal d’erreurs et possibilité de rejouer uniquement les lignes corrigées.

- Exports Excel/CSV/PDF selon droits et périmètre.

- API sécurisées pour SIRH, comptabilité, banques, marchés, IAM/SSO et autres systèmes autorisés.

- Identifiants externes, traçabilité des échanges, idempotence et journal technique.

- Aucune interface ne doit contourner les contrôles métier essentiels de GESBUDEP.



# 23. Clôture budgétaire, rapprochement et archivage

1. Pré-clôture : inventaire des dossiers ouverts, engagements non liquidés, liquidations non ordonnancées, OP non payés et paiements non rapprochés.

2. Traitement des anomalies et décisions sur reports, annulations ou régularisations.

3. Rapprochement final des paiements, comptes, soldes et documents.

4. Verrouillage progressif des périodes puis de l’exercice.

5. Production des états de clôture et snapshots financiers.

6. Archivage GED et application des règles de conservation.

7. Ouverture contrôlée de l’exercice suivant et, si autorisé, reprise des engagements/report de crédits selon règles.



Une clôture ne doit jamais supprimer l’historique. Toute réouverture d’une période ou d’un exercice exige une habilitation exceptionnelle, un motif, une durée et une piste d’audit complète.

# 24. Administration et paramétrage

- Utilisateurs, rôles, fonctions, permissions, groupes, politiques de mot de passe/SSO et MFA si disponible.

- Référentiel organisationnel versionné et affectations.

- Exercices, périodes, nomenclatures, sources de financement et devises.

- GAR/RBM, PAP, catégories d’activités et indicateurs.

- Workflows, seuils, délégations, délais, motifs et règles SoD.

- Types de pièces, règles de complétude, modèles PDF, signatures et cachets.

- Paramètres GED, conservation et confidentialité.

- Canaux de notification, modèles de messages et escalades.

- Paramètres d’import/export, API, webhooks et systèmes tiers.

- Journalisation, supervision fonctionnelle, files d’erreur et reprise contrôlée.



# 25. Sécurité, audit et traçabilité

- Authentification forte selon politique institutionnelle ; sessions sécurisées et expiration.

- RBAC avec périmètre organisationnel et financier.

- Journal d’audit append-only pour les événements métier critiques.

- Enregistrement : utilisateur, rôle, date/heure, adresse IP lorsque disponible, objet, ancienne valeur, nouvelle valeur, motif et contexte.

- Historique des connexions et actions sensibles.

- Protection des données sensibles et secrets ; chiffrement en transit et au repos selon architecture.

- Verrouillage ou validation renforcée des changements de comptes bancaires et données de paiement.

- Exports sensibles journalisés et soumis aux droits.

- Rapports d’audit filtrables par dossier, utilisateur, module, période et type d’événement.



# 26. Exigences documentaires et PDF officiels

Les documents officiels sont générés par événements métier après validation/signature. Chaque PDF doit contenir les références croisées, l’exercice, les montants, imputations, bénéficiaire, pièces, validateurs/signataires et dates nécessaires à son autonomie documentaire.

| Étape | Documents minimaux |

| --- | --- |

| EB | Fiche EB validée |

| ENG | Fiche/Bon d’Engagement ; Certificat d’Engagement Budgétaire |

| LIQ | Fiche/État de Liquidation ; Attestation de Service Fait ; PV si requis |

| ORD | Fiche d’Ordonnancement ; Ordre de Paiement signé |

| PAI | Fiche/Avis de Paiement ; ordre de virement/chèque/pièce de caisse si applicable ; preuve de règlement |

| Clôture/Reporting | États de clôture, rapports et situations périodiques |



- Snapshot des données au moment de la génération.

- Numéro de version, date, hash et identifiant de vérification.

- Archivage automatique GED.

- Régénération interdite sous le même identifiant lorsque les données ont changé ; création d’une nouvelle version.

- Possibilité de vérifier la filiation du document avec le dossier métier.



# 27. États financiers et indicateurs calculés

| Indicateur | Formule de référence |

| --- | --- |

| Disponible | Budget révisé - engagements actifs (selon politique de réservation) |

| Reste à engager | Budget révisé - engagé cumulé |

| Reste à liquider | Engagé cumulé - liquidé cumulé |

| Reste à ordonnancer | Liquidé cumulé - ordonnancé cumulé |

| Reste à payer | Ordonnancé net - paiements exécutés non annulés |

| Taux engagement | Engagé / Budget révisé × 100 |

| Taux liquidation | Liquidé / Budget révisé × 100 |

| Taux paiement | Payé / Budget révisé × 100 |

| Taux exécution physique | Réalisé / cible selon formule de l’indicateur |



Les formules doivent être définies de manière centralisée, versionnées lorsqu’elles évoluent et réutilisées par les écrans, API, rapports et exports afin d’éviter les divergences.

# 28. Écrans fonctionnels minimaux

- Welcome publique / institutionnelle, authentification, récupération d’accès et pages connexes.

- Tableau de bord personnel et Mes tâches.

- Tableau de bord exécutif.

- Référentiels organisation, budget, PAP/GAR, tiers et paramètres.

- Préparation budgétaire : cadrage, plafonds, propositions, arbitrages, consolidation, publication.

- Liste + fiche + création/édition + historique pour EB, ENG, LIQ, ORD, PAI.

- Écrans de visa, validation, signature, retour et rejet.

- Page Paiements avec tableau de bord Agence Comptable.

- GED : recherche, dossier, aperçu, versions et métadonnées.

- S&E : réalisations, indicateurs, évaluations et rapports.

- GANTT PAP/Hors PAP.

- Reporting et exports.

- Administration : utilisateurs, rôles, permissions, workflows, seuils, modèles, notifications, journaux.



# 29. Exigences non fonctionnelles

- Architecture cible : frontend React.js + Vite + Tailwind ; backend Laravel 13+ ; PostgreSQL 18+.

- API structurée, validation serveur systématique et contrôle d’autorisation sur chaque action.

- Base de données transactionnelle avec contraintes d’intégrité et indexation adaptée.

- Performance : pagination serveur, recherche optimisée, traitements lourds asynchrones uniquement pour les tâches non bloquantes ; les validations métier restent cohérentes et atomiques.

- Disponibilité, sauvegardes, restauration, journalisation et supervision adaptées à une application institutionnelle critique.

- Accessibilité et ergonomie : navigation cohérente, feedback utilisateur, statuts explicites, erreurs actionnables.

- Internationalisation et formats monétaires/date configurables si nécessaire.

- Conformité aux principes pertinents IPSAS/SYSCOHADA/COSO et aux règles internes de la CEEAC ; exigences de protection des données intégrées à la conception.

- Tests automatisés unitaires, d’intégration, d’autorisation, de concurrence et end-to-end sur les parcours critiques.



# 30. Modèle de données fonctionnel - entités majeures

- OrganisationUnit, Position, User, Role, Permission, Delegation, SoDRule.

- FiscalYear, Period, BudgetVersion, BudgetLine, BudgetMovement, FundingSource, CreditReservation.

- Pillar, Axis, Product, SubProduct, Activity, Task, Indicator, Target, PhysicalAchievement.

- NeedRequest (EB), NeedRequestLine/SubLine, Commitment (ENG), CommitmentLine, Liquidation, LiquidationLine, Ordonnancement, PaymentOrder, Payment, Reconciliation.

- Supplier/Beneficiary, BankAccount, Contract, ProcurementReference.

- Document, DocumentVersion, DocumentLink, GeneratedArtifact.

- WorkflowDefinition, WorkflowInstance, WorkflowStep, TaskAssignment, Approval, Rejection, ReturnAction.

- Notification, NotificationTemplate, AuditEvent, ControlFinding, ClosingSnapshot.



Le MCD/MLD détaillé doit imposer les clés étrangères, contraintes d’unicité, règles de suppression logique, versionnement et index nécessaires pour que les règles fonctionnelles ne reposent pas uniquement sur l’interface.

# 31. Matrice de traçabilité et exigences de recette

Chaque exigence fonctionnelle doit être reliée à au moins un écran ou API, une règle de données, un ou plusieurs tests et, si applicable, un état PDF. La matrice de traçabilité est un livrable obligatoire de réalisation et de recette.

| Chaîne | Test E2E minimal |

| --- | --- |

| EB→ENG | Créer EB, valider selon circuit, vérifier génération ENG unique et héritage. |

| ENG→LIQ | Valider ENG, visa CF, vérifier consommation du disponible et génération LIQ. |

| LIQ→ORD | Certifier service fait, liquider partiellement, viser, vérifier reliquat et génération ORD. |

| ORD→PAI | Tester ≤5M avec SG, >5M avec Président, transmettre ACC, effectuer paiement partiel puis solde. |

| Contrôles montants | Tenter LIQ>ENG, ORD>LIQ, PAI>ORD : chaque tentative doit être bloquée. |

| Concurrence | Simuler deux validations simultanées consommant le même solde : une seule combinaison valide doit être acceptée. |

| GED | Vérifier archivage automatique des PDF, pièces jointes et documents importés. |

| Audit | Reconstituer l’historique complet d’un dossier depuis l’EB jusqu’au paiement. |

| S&E | Renseigner réalisation et indicateur, rapprocher avec exécution financière et produire rapport. |

| Clôture | Bloquer nouvelles écritures sur période clôturée et tester réouverture exceptionnelle auditée. |



# 32. Critères de recette globale

- Tous les parcours nominaux de la chaîne de dépense fonctionnent sans ressaisie des données déjà validées.

- Tous les parcours de retour, rejet, annulation, rectification et versionnement conservent une piste d’audit complète.

- Les contrôles de montants sont exacts en situation de paiements/liquidations/ordonnancements partiels et de concurrence.

- Les droits empêchent tout utilisateur non habilité d’effectuer une action même en appel direct API.

- Les PDF officiels sont générés au bon événement, archivés dans la GED et reproductibles par référence/version.

- Les tableaux de bord et rapports donnent les mêmes totaux que les données transactionnelles de référence.

- Les imports rejettent proprement les données incohérentes et produisent un journal exploitable.

- Les journaux d’audit permettent de reconstituer qui a fait quoi, quand, sur quelle donnée, avec quelle valeur avant/après.

- Les procédures de clôture empêchent les modifications non autorisées sur les périodes closes.

- La non-régression est démontrée sur les modules interconnectés après chaque évolution.



# 33. Priorités de mise en œuvre

1. Référentiels, sécurité, organisation, exercices et budget.

2. Planification/PAP et préparation budgétaire.

3. Chaîne de dépense EB→ENG→LIQ→ORD→PAI avec GED, PDF, tâches, notifications et audit.

4. Marchés/tiers, contrôles et rapprochement.

5. Suivi-évaluation, GANTT, reporting et tableau exécutif.

6. Interopérabilité, optimisation, supervision, clôture et fonctions avancées.




# 34. Gouvernance des données et qualité des référentiels

GESBUDEP doit traiter les référentiels comme des données de gouvernance et non comme de simples listes déroulantes. Toute modification d'un référentiel susceptible d'impacter le budget, les workflows, les habilitations ou les états doit être soumise à des contrôles de cohérence, à une date d'effet et, pour les éléments sensibles, à un processus d'approbation.

## 34.1 Principes de qualité des données

- unicité des codes structurants ;
- validité temporelle avec dates d'effet et de fin ;
- interdiction de supprimer physiquement un référentiel déjà utilisé ;
- détection des doublons et des quasi-doublons ;
- normalisation des libellés, identifiants, coordonnées bancaires et pièces fiscales ;
- responsable métier identifié pour chaque référentiel majeur ;
- indicateurs de complétude, fraîcheur, cohérence et taux d'anomalies ;
- file de correction des données avec responsable et échéance.

## 34.2 Référentiel organisationnel versionné

L'organigramme doit être versionné dans le temps. Une structure peut être renommée, fusionnée, rattachée différemment ou fermée sans casser les dossiers historiques. Chaque transaction conserve l'identifiant et la version organisationnelle applicables à sa date de validation. Les mouvements futurs peuvent être préparés avec une date d'effet sans être immédiatement visibles dans les workflows courants.

# 35. Gestion des virements, transferts, réallocations et révisions budgétaires

Une application budgétaire mature doit gérer les mouvements intervenant après adoption du budget. GESBUDEP doit donc prévoir un sous-module de modification budgétaire, distinct des dépenses, permettant de documenter l'origine, la destination, le fondement et l'autorisation de chaque mouvement.

## 35.1 Types de mouvements

- virement entre lignes lorsque permis ;
- transfert entre structures ou programmes lorsque permis ;
- réallocation interne ;
- budget rectificatif ;
- ouverture ou annulation de crédits ;
- report de crédits ;
- gel/dégel de crédits ;
- mise en réserve ;
- ajustement technique ne modifiant pas l'enveloppe globale.

Chaque mouvement doit comporter un workflow, un document justificatif, une date d'effet, un impact avant/après et un journal de validation. Le budget initial reste immuable ; le budget révisé se calcule à partir des mouvements validés.

# 36. Plan d'engagement, plan de trésorerie et prévision des décaissements

Afin d'améliorer la prévisibilité de l'exécution, le système doit permettre de planifier les engagements et les décaissements par mois ou trimestre. Le plan d'engagement doit rapprocher le calendrier des activités, les marchés, les contrats et les besoins de financement. Le plan de trésorerie doit consolider les paiements attendus et permettre à la direction financière et à l'Agence Comptable d'anticiper les besoins de liquidité.

Fonctions minimales : calendrier prévisionnel, actualisation glissante, comparaison prévision/réalisé, alertes de concentration de décaissement, visualisation des engagements non liquidés, liquidations non ordonnancées et ordres non payés, analyse des restes à payer et des délais moyens.

# 37. Gestion des arriérés, engagements non dénoués et restes à payer

Le système doit distinguer un simple solde en cours d'un arriéré. Les règles de qualification d'un arriéré doivent être paramétrables en fonction de l'échéance contractuelle, de la date de réception de facture, de la liquidation ou de tout autre critère retenu. Les arriérés doivent être analysables par fournisseur, structure, nature, âge, exercice et cause.

Des tableaux d'ancienneté doivent classer les obligations, par exemple : 0-30 jours, 31-60, 61-90, 91-180, plus de 180 jours. Le responsable doit pouvoir suivre un plan d'apurement et documenter les contestations.

# 38. Gestion des marchés, contrats, bons de commande et conventions - approfondissement

Le module Marchés doit être relié aux crédits et à la dépense. Un contrat doit pouvoir porter un montant initial, une durée, des lots, des jalons, des garanties, des pénalités, des avances, des retenues, des avenants, des révisions et un calendrier de livraison.

## 38.1 Cycle contractuel

1. Référence au besoin et à la ligne budgétaire.
2. Référence à la procédure d'achat ou de sélection.
3. Enregistrement de l'attribution et du titulaire.
4. Création du contrat ou bon.
5. Visa/signature selon workflow.
6. Enregistrement des garanties et dates critiques.
7. Suivi des commandes, livraisons et réceptions.
8. Gestion des factures et liquidations.
9. Avenants, suspensions, résiliations ou clôture.
10. Évaluation du fournisseur et archivage.

Le système doit alerter sur les contrats proches de leur échéance, les garanties expirantes, les plafonds consommés, les livraisons en retard et les avenants approchant les limites paramétrées.

# 39. Référentiel fournisseurs, consultants, bénéficiaires et tiers - approfondissement

La fiche tiers doit être unique et contrôlée. Elle doit comporter identité, catégorie, statut juridique, coordonnées, pays, identifiants fiscaux, contacts, banques, comptes de paiement, pièces justificatives, statut actif/suspendu et historique des modifications.

La modification d'une coordonnée bancaire doit être considérée comme sensible : journalisation renforcée, validation par un second acteur, notification et période de vigilance. Le système doit empêcher qu'un utilisateur modifie les coordonnées puis autorise le paiement correspondant si la matrice de séparation des fonctions l'interdit.

# 40. Gestion des signatures, visas numériques et preuve d'intégrité

Les actes critiques doivent pouvoir être signés ou visés selon plusieurs niveaux de maturité : validation applicative forte, signature électronique interne, signature électronique qualifiée si l'infrastructure le permet, ou impression/signature physique avec retour du document numérisé.

Dans tous les cas, la solution doit conserver : l'identité du signataire, son rôle au moment de la signature, la date/heure, l'adresse ou contexte technique pertinent, l'empreinte du document, la version des données et la décision. Un document déjà signé ne doit pas être modifié ; toute correction produit une nouvelle version.

# 41. Gestion de dossiers, corbeilles de travail et SLA

Chaque utilisateur doit disposer de « Mes tâches » et de vues par rôle. Les tâches doivent être triables par urgence, ancienneté, montant, structure, étape et date limite. Les dossiers doivent afficher une bannière indiquant : dernière action, acteur l'ayant réalisée, prochaine étape, acteur attendu, délai écoulé et pièces manquantes.

Le système doit gérer des délais cibles (SLA) par étape. Les dépassements génèrent des alertes, puis des escalades vers le supérieur ou le gestionnaire de processus. Les SLA servent au pilotage, mais ne doivent pas bloquer automatiquement un acte lorsque les règles métier ne le prévoient pas.

# 42. Moteur d'exceptions, suspensions, rejets et reprises

Toutes les procédures doivent définir explicitement les chemins non nominaux. Une opération peut être retournée, suspendue, rejetée, annulée, réouverte ou corrigée uniquement selon des transitions autorisées. Chaque transition exceptionnelle doit exiger un motif et, pour les cas sensibles, une pièce ou une approbation.

Le système doit éviter les « raccourcis administrateurs » permettant de modifier directement un statut en base. Les opérations exceptionnelles doivent passer par des commandes métier auditées produisant les effets financiers inverses ou compensatoires requis.

# 43. Contrôle interne continu et moteur de règles

GESBUDEP doit embarquer un moteur de contrôles capable d'exécuter des règles avant soumission, avant validation et en surveillance a posteriori. Les règles doivent être classées par niveau : information, avertissement, contrôle bloquant, anomalie critique.

Exemples : dépassement de crédit, incompatibilité de rôles, pièce expirée, facture potentiellement dupliquée, paiement vers un compte nouvellement modifié, fractionnement inhabituel d'une dépense, engagement restant longtemps sans liquidation, ordonnancement restant longtemps sans paiement, fournisseur suspendu, montant proche d'un seuil récurrent, fréquence anormale de retours/rejets.

Les règles de détection ne doivent pas accuser automatiquement une fraude ; elles créent des alertes à examiner et à clôturer avec une conclusion documentée.

# 44. Gestion des risques et plan de contrôle

Le système doit permettre d'associer des risques à des processus, activités, structures ou catégories de dépense. Chaque risque peut comporter probabilité, impact, niveau brut, contrôles existants, niveau résiduel, responsable, plan d'action et échéance.

Un plan de contrôle périodique doit pouvoir être défini : contrôles quotidiens, mensuels, trimestriels ou ponctuels. Les résultats sont documentés et reliés aux anomalies détectées et recommandations d'audit.

# 45. Comptabilité de gestion, interfaces comptables et schémas d'écritures

Même si GESBUDEP n'a pas vocation à se substituer à une comptabilité générale complète sans décision institutionnelle, il doit produire des informations suffisamment structurées pour s'interfacer avec le système comptable et l'Agence Comptable.

Chaque événement financier doit pouvoir être mappé vers un schéma d'écritures, un compte, un tiers, un centre de responsabilité, une source de financement et une période. Les exports doivent être équilibrés, numérotés, datés et rapprochables. Les rejets d'interface doivent revenir dans une file de correction sans perte de l'identifiant d'origine.

# 46. Rapprochement budgétaire, comptable et bancaire

La solution doit intégrer des mécanismes de rapprochement entre : budget et engagements ; engagements et liquidations ; liquidations et ordonnancements ; ordonnancements et paiements ; paiements et mouvements bancaires ; GESBUDEP et système comptable externe.

Les écarts doivent être classés, affectés et résolus. Un écart ne doit jamais être effacé par simple modification de la donnée source si celle-ci a déjà produit un acte validé. La résolution doit être explicite et traçable.

# 47. Gestion des ressources et prévisions de recettes - extension fonctionnelle recommandée

Pour disposer à terme d'une vision budgétaire complète, GESBUDEP devrait pouvoir intégrer un module de ressources/recettes : prévisions, appels de contribution, encaissements, affectations, restes à recouvrer et rapprochement. Cette fonction peut être déployée progressivement si les procédures institutionnelles ne sont pas encore formalisées.

Le module doit au minimum permettre de relier les ressources prévues aux enveloppes budgétaires et d'alimenter les tableaux de disponibilité de trésorerie sans confondre autorisation budgétaire et liquidité effective.

# 48. Suivi-Évaluation - approfondissement du lien financier/physique

Le S&E doit fonctionner comme une chaîne de preuve de la performance. Pour chaque activité, l'utilisateur doit pouvoir enregistrer la réalisation physique, la période, la localisation, les bénéficiaires ou unités couvertes, les preuves, les difficultés et la valeur des indicateurs.

Le système calcule les taux de réalisation physique et financière mais doit éviter les comparaisons trompeuses : les formules, unités et périodes de mesure des indicateurs doivent être connues. Les rapports doivent pouvoir afficher l'écart entre consommation budgétaire et progrès physique, signaler les activités fortement dépensées mais faiblement réalisées et inversement.

# 49. Reporting avancé, analyse et pilotage décisionnel

Le moteur de reporting doit distinguer les rapports opérationnels, de contrôle, de gestion, de performance et exécutifs. Les filtres usuels doivent être disponibles : exercice, période, département, direction, service, ligne budgétaire, source de financement, PAP/Hors PAP, fournisseur, statut, acteur, tranche de montant.

Fonctions essentielles : drill-down depuis un indicateur jusqu'aux transactions sources, export Excel/CSV/PDF, rapports planifiés, envoi sécurisé, favoris, filtres enregistrés, commentaires, indicateurs comparatifs, courbes d'exécution, top anomalies, vieillissement des dossiers, projections de fin d'exercice.

# 50. Tableau de bord exécutif « une page »

La Présidence, le SG et les Commissaires doivent disposer d'une vue synthétique adaptée à leur périmètre. Le tableau doit notamment présenter : budget initial/révisé, engagements, liquidations, ordonnancements, paiements, disponible, taux d'exécution, taux de réalisation physique, engagements non liquidés, ordres non payés, dossiers bloqués, délais moyens, alertes critiques, marchés majeurs et activités PAP en retard.

Chaque KPI doit être explicable : formule, date de calcul, périmètre et possibilité d'accéder au détail. L'application doit éviter les chiffres « orphelins » impossibles à réconcilier.

# 51. GED probante et archivage électronique - approfondissement

La GED doit être nativement intégrée aux modules. Tout document généré, importé ou joint à un dossier doit recevoir des métadonnées, un hash, une version, une source, un propriétaire, une politique de conservation et des droits d'accès.

Le système doit permettre la recherche plein texte, la recherche par métadonnées, la prévisualisation, le classement automatique, les liens entre documents et transactions, les dossiers documentaires et les restrictions d'accès. Les documents probants validés doivent devenir non modifiables ; leur remplacement exige une nouvelle version et une justification.

Des mécanismes doivent être prévus pour l'archivage à long terme : format pérenne lorsque possible, contrôle d'intégrité périodique, journal des accès, conservation légale et procédure de destruction autorisée lorsque le délai expire.

# 52. Gestion des notifications et communications opérationnelles - approfondissement

Les notifications peuvent être in-app, email et, si retenu, SMS ou messagerie d'entreprise. Elles doivent être événementielles : soumission, retour, approbation, visa, rejet, échéance, retard, paiement, rejet bancaire, modification sensible, délégation, clôture.

Le système doit distinguer notification informative et action requise. Les utilisateurs peuvent régler certaines préférences, mais les alertes critiques ou réglementaires ne doivent pas pouvoir être désactivées. Les notifications doivent pointer vers le dossier concerné et ne pas exposer de données sensibles dans un canal non sécurisé.

# 53. Gestion des habilitations, délégations, intérims et séparation des fonctions - approfondissement

Le contrôle d'accès doit combiner rôles (RBAC), périmètres organisationnels et, lorsque nécessaire, attributs contextuels : exercice, type de dépense, montant, structure, statut. Une permission générique « valider » est insuffisante ; la solution doit vérifier que l'utilisateur est compétent sur le dossier concret.

Les délégations et intérims ont une date de début, date de fin, périmètre, rôle délégué, acte justificatif et approbateur. Elles expirent automatiquement. Le système doit afficher clairement lorsqu'une personne agit par délégation et conserver cette qualité dans la piste d'audit et les documents.

# 54. Journal d'audit, supervision et investigations

Le journal d'audit doit enregistrer les événements fonctionnels et de sécurité : connexion, échec d'authentification, création, modification, soumission, validation, visa, signature, rejet, annulation, changement de coordonnées bancaires, changement de rôle, délégation, export, accès à un document sensible et opération d'administration.

Les événements doivent contenir au minimum : horodatage fiable, utilisateur, rôle effectif, action, objet, identifiant, valeurs avant/après pour les champs sensibles, contexte technique pertinent et corrélation de requête. Les administrateurs fonctionnels ne doivent pas pouvoir effacer ces traces depuis l'interface normale.

# 55. Sécurité fonctionnelle et cybersécurité

La sécurité doit être conçue dès l'origine. Exigences minimales : authentification forte pour profils sensibles, politique de session, verrouillage après tentatives, moindre privilège, revue périodique des accès, chiffrement des communications, protection des secrets, journalisation, sauvegardes, contrôles d'intégrité, limitation des exports, masquage des données sensibles et politique de mises à jour.

L'application doit supporter la révocation immédiate des accès, la fermeture globale des sessions d'un utilisateur et l'expiration des comptes inactifs. Les opérations critiques peuvent exiger une réauthentification ou un second facteur.

# 56. Continuité d'activité, sauvegarde et reprise

Le système doit disposer d'une politique de sauvegarde et de reprise adaptée à la criticité des données financières. Les objectifs RPO/RTO doivent être définis contractuellement. Les sauvegardes doivent être testées par des restaurations périodiques ; une sauvegarde non testée ne doit pas être considérée comme une garantie de reprise.

Les composants critiques doivent être supervisés. Les incidents doivent produire des alertes, des journaux et un processus d'escalade. Une procédure de fonctionnement dégradé peut être prévue pour certaines opérations, mais toute ressaisie après reprise doit être rapprochée et auditée.

# 57. Interopérabilité et architecture des API - approfondissement

Les échanges doivent privilégier des API versionnées et documentées. Chaque API doit définir authentification, autorisation, format, validation, erreurs, idempotence, pagination et limites de débit. Les intégrations critiques doivent utiliser des identifiants de corrélation pour suivre une opération de bout en bout.

Les imports en masse passent par une zone de staging avec contrôles de syntaxe et de cohérence avant intégration. Le système produit un rapport de rejet ligne par ligne. Aucun import ne doit contourner les règles métier applicables aux saisies manuelles.

# 58. Recherche globale et dossier financier unifié

Une recherche transverse doit permettre de retrouver un dossier par numéro EB/ENG/LIQ/ORD/PAI, fournisseur, objet, référence de facture, contrat, marché, ligne budgétaire, structure ou montant. Le « dossier financier unifié » doit présenter sur une page la filiation complète de l'opération, les montants par étape, les pièces, validations, événements, anomalies et liens S&E.

Cette vue constitue l'outil privilégié d'audit et d'assistance aux utilisateurs.

# 59. Expérience utilisateur et accessibilité

Les interfaces doivent réduire les erreurs de saisie : libellés explicites, champs conditionnels, aide contextuelle, validation immédiate, messages d'erreur actionnables, conservation des données en cas d'erreur, raccourcis pour les utilisateurs fréquents et cohérence visuelle avec Figma.

Les tableaux longs doivent gérer pagination, tri, filtres, colonnes personnalisables et export. Les formulaires doivent être utilisables au clavier, conserver un contraste suffisant et ne pas transmettre une information uniquement par la couleur.

# 60. Performance, volumétrie et scalabilité fonctionnelle

Les pages opérationnelles courantes doivent rester réactives sur les volumes attendus. Les recherches et tableaux doivent être paginés côté serveur. Les exports massifs et rapports lourds doivent être générés en tâche de fond avec notification de disponibilité. Les traitements asynchrones doivent être idempotents et reprendre proprement après échec.

Les tests de charge doivent couvrir au minimum : connexion simultanée, soumissions concurrentes sur une même ligne budgétaire, génération PDF en masse, import volumineux, recherche GED et tableau de bord exécutif.

# 61. Observabilité et administration opérationnelle

Une console d'exploitation doit présenter l'état des files de traitement, tâches échouées, intégrations, génération de documents, espace de stockage, sauvegardes, erreurs applicatives et services externes. Les informations techniques doivent être séparées des fonctions métier et accessibles uniquement aux profils autorisés.

Le système doit produire des métriques permettant de distinguer incident technique, lenteur, erreur utilisateur et blocage métier.

# 62. Protection contre les doubles opérations et cohérence transactionnelle

Les validations, signatures, générations d'actes financiers et paiements doivent utiliser des clés d'idempotence et des transactions de base de données. En cas de double clic, retry réseau ou reprise d'un job, l'opération ne doit pas être créée deux fois.

Les séquences critiques doivent verrouiller ou vérifier la version des données. Une mise à jour concurrente doit être rejetée proprement avec message invitant l'utilisateur à recharger la version courante.

# 63. Gestion du calendrier, périodes et clôtures

Le calendrier doit gérer exercice, périodes ouvertes, périodes fermées et période spéciale de clôture lorsque décidée. Les droits d'ouverture/réouverture doivent être fortement restreints. Toute réouverture produit une justification, une approbation, un journal et un périmètre temporel.

À la clôture, le système doit produire la situation des crédits, engagements, liquidations, ordonnancements, paiements, restes à payer, engagements à annuler/report, arriérés et opérations non rapprochées.

# 64. Reprise des données, migration et qualité initiale

La migration des données historiques doit être traitée comme un projet à part entière : inventaire des sources, mapping, nettoyage, règles de transformation, chargement en staging, contrôles, rapprochement et procès-verbal de validation.

Les données migrées doivent porter leur source, date de migration et niveau de fiabilité. Les historiques incomplets ne doivent pas être artificiellement enrichis par des valeurs inventées ; les champs inconnus doivent être identifiés comme tels.

# 65. Gestion des environnements et paramètres sensibles

Les environnements développement, test, recette, préproduction et production doivent être séparés. Les paramètres sensibles, secrets et comptes techniques ne doivent jamais être copiés en clair dans le code ou les documents. Les données de production ne doivent pas être utilisées en test sans anonymisation appropriée.

# 66. Recette fonctionnelle détaillée et stratégie de tests

La recette doit combiner tests unitaires métier, tests d'intégration, tests de workflow, tests de droits, tests de concurrence, tests de sécurité, tests d'édition PDF, tests d'import/export, tests de reprise et tests utilisateurs.

## 66.1 Jeux de tests indispensables

- création d'une EB PAP complète avec héritage GAR/RBM ;
- EB Hors PAP initiée par le Service des Moyens Généraux ;
- EB multi-sous-lignes dont le total doit être exact ;
- engagement partiel puis second engagement sur le reliquat ;
- tentative de surengagement concurrente ;
- liquidation partielle avec réception partielle ;
- facture dupliquée ;
- ordonnancement à 5 000 000 XAF et à 5 000 001 XAF ;
- paiement partiel suivi d'un second paiement ;
- double clic sur validation/paiement ;
- rejet bancaire puis réémission ;
- modification de compte bancaire avant paiement ;
- délégation temporaire expirée ;
- conflit de séparation des fonctions ;
- clôture puis tentative d'opération dans période fermée ;
- annulation/dégagement avec restitution correcte du disponible ;
- rapprochement des montants de bout en bout ;
- production et archivage de tous les PDF ;
- vérification que les documents archivés restent identiques après modification des référentiels.

# 67. Matrice RACI fonctionnelle de référence

Une matrice RACI exhaustive doit être produite lors de la conception détaillée pour chaque action sensible : création, soumission, validation, visa, certification, ordonnancement, prise en charge, paiement, annulation, délégation, changement de seuil, ouverture de période, modification de coordonnées bancaires, création d'utilisateur, attribution de rôle, import de données et clôture.

Cette matrice doit être paramétrée dans l'application et utilisée comme base des tests de séparation des fonctions.

# 68. Catalogue des documents et états obligatoires

Outre les actes EB/ENG/LIQ/ORD/PAI, le système doit prévoir : bordereaux de transmission, états de crédits, situation par ligne, situation par structure, situation PAP, engagements non liquidés, liquidations non ordonnancées, ordonnancements non payés, paiements par fournisseur, échéancier de trésorerie, arriérés, liste des rejets, journal des validations, suivi des SLA, rapport de clôture, rapport S&E, fiche activité, fiche contrat, état des avenants et journal d'audit exportable selon habilitation.

Chaque état doit indiquer la période, les filtres, l'heure de génération et, lorsque nécessaire, la version du référentiel utilisée.

# 69. Indicateurs de pilotage recommandés

- taux d'engagement = engagements nets / budget révisé ;
- taux de liquidation = liquidations / engagements nets ;
- taux d'ordonnancement = ordonnancements / liquidations ;
- taux de paiement = paiements confirmés / ordonnancements pris en charge ;
- taux d'exécution budgétaire = paiements ou autre base retenue / budget révisé, avec définition explicite ;
- taux de réalisation physique par activité ;
- délai moyen EB→ENG, ENG→LIQ, LIQ→ORD, ORD→PAI ;
- nombre et montant des dossiers en retard ;
- taux de rejet/retour par étape ;
- montant des engagements non liquidés ;
- montant des restes à payer ;
- ancienneté moyenne des factures ;
- nombre d'alertes critiques ouvertes ;
- taux de complétude documentaire ;
- taux de rapprochement bancaire ;
- disponibilité du système et taux d'échec des traitements critiques.

Les formules doivent être définies dans un dictionnaire des KPI et ne pas être modifiables sans version et approbation.

# 70. Exigences de déploiement et conduite du changement

Le déploiement doit être progressif : paramétrage, reprise des référentiels, tests, pilote, formation, assistance au démarrage et généralisation. Les utilisateurs doivent être formés par rôle et par scénario métier, pas uniquement par écran.

Une base de connaissances, des guides pas-à-pas, des FAQ et un circuit de support doivent être disponibles. Les incidents récurrents doivent alimenter l'amélioration des écrans et de la documentation.

# 71. Gouvernance du produit et gestion des évolutions

Après mise en production, les demandes d'évolution doivent être qualifiées : correction, amélioration, changement réglementaire, nouveau rapport, nouveau workflow, intégration. Chaque évolution sensible doit être analysée quant à son impact sur les données, contrôles, sécurité, documentation, tests et compatibilité avec les dossiers en cours.

La feuille de route doit être gouvernée par un comité métier/DSI. Les modifications de règles budgétaires ne doivent pas être déployées directement en production sans recette et date d'effet maîtrisée.

# 72. Traçabilité des exigences

Chaque exigence du présent cahier doit recevoir un identifiant unique lors de la phase de conception détaillée (ex. EB-FR-001, ENG-CTRL-014, SEC-AUD-008). La matrice de traçabilité doit relier exigence, maquette, règle métier, modèle de données, API, test, résultat de recette et anomalie éventuelle.

Aucune fonctionnalité critique ne doit être considérée comme livrée si elle ne possède pas de preuve de test et de recette.

# 73. Priorisation de mise en œuvre enrichie

**Priorité P0 - indispensable avant mise en production :** référentiels, sécurité, rôles/SoD, budget unique/PAP, EB/ENG/LIQ/ORD/PAI, contrôles de cumul, GED, génération PDF, audit, notifications essentielles, sauvegarde, reprise, clôture de période, états de base.

**Priorité P1 - indispensable à la pleine exploitation :** marchés/contrats, S&E complet, tableaux de bord exécutifs, rapprochement bancaire/comptable, plans d'engagement/trésorerie, arriérés, délégations avancées, SLA, moteur de contrôle continu, imports structurés.

**Priorité P2 - optimisation :** analytics avancé, détection d'anomalies enrichie, signature électronique avancée, extension recettes/ressources, automatisations externes, reporting planifié avancé et fonctions prédictives.

# 74. Références documentaires externes

- PEFA Framework et Fieldguide, notamment les piliers relatifs à la prévisibilité et au contrôle de l'exécution budgétaire, à la comptabilité/reporting et à l'audit.
- Fonds monétaire international, principes de transparence budgétaire et de suivi ouvert de la préparation, de l'exécution et du reporting.
- IPSASB, Handbook 2026 et Conceptual Framework for General Purpose Financial Reporting by Public Sector Entities.
- NIST Cybersecurity Framework 2.0 : Govern, Identify, Protect, Detect, Respond, Recover.
- Références internes CEEAC : procédures validées, référentiel organisationnel, nomenclature budgétaire, Budget 2026, documents /docs et maquette Figma du projet.


# 75. Conclusion fonctionnelle

GESBUDEP doit être conçu comme une plateforme intégrée de gestion de la performance et des finances de la Commission de la CEEAC, et non comme une juxtaposition d’écrans. Le point central est la continuité de la donnée et de la responsabilité : une activité planifiée reçoit une autorisation budgétaire, donne naissance à un besoin, à un engagement, à une dette liquidée, à un ordre de paiement, à un règlement, puis à une mesure de résultat. À chaque étape, le système doit préserver la filiation, la preuve documentaire, la décision humaine, le contrôle financier et l’auditabilité.

Le présent document constitue la baseline fonctionnelle consolidée à utiliser pour l’audit de l’existant, l’implémentation, la migration, les tests et la recette. Toute divergence d’implémentation doit être documentée dans une matrice d’écarts et approuvée avant mise en production.
