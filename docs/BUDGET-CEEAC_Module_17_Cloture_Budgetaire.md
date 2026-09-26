# BUDGET-CEEAC - Module 17 - Clôture budgétaire

**Description fonctionnelle détaillée**

## Résumé exécutif

Le module 17 formalise le processus complet de fin d’exercice budgétaire, depuis la pré-clôture jusqu’à l’archivage et la reprise contrôlée vers N+1. Il sécurise les crédits, opérations en cours, reports, annulations, rapprochements, contrôles, documents officiels et décisions de clôture.

## 1. Présentation générale

Le module Clôture budgétaire organise, sécurise et trace l’ensemble des opérations permettant d’arrêter un exercice budgétaire dans BUDGET-CEEAC. Il intervient après la phase d’exécution et couvre la pré-clôture, l’inventaire des opérations en cours, les contrôles de cohérence, les rapprochements, les décisions de report ou d’annulation, l’arrêté des situations, le verrouillage de l’exercice, l’archivage et, le cas échéant, la réouverture exceptionnelle.

La clôture ne doit pas être considérée comme une simple action technique de fermeture. Elle constitue un processus institutionnel de certification de la situation budgétaire de fin d’exercice et doit fournir une image complète des crédits votés, révisés, engagés, liquidés, ordonnancés, payés, disponibles, annulés ou reportés.

## 2. Finalités du module

Garantir qu’aucune opération de l’exercice ne reste dans un état incohérent au moment de la clôture ; fiabiliser la situation d’exécution ; sécuriser les reports et annulations ; assurer la séparation des exercices ; produire les états officiels de fin d’année ; préserver la traçabilité ; préparer l’ouverture de l’exercice suivant ; fournir les données de référence nécessaires au contrôle, à l’audit, au reporting et au suivi-évaluation.

## 3. Principes directeurs

Un exercice ne peut être clôturé que lorsque les contrôles obligatoires sont satisfaits ou que les exceptions ont été formellement autorisées. Toute action de clôture doit être horodatée, imputée à un acteur habilité et conservée dans le journal des événements.

Le Budget demeure unique pour l’exercice. Le PAP, en tant que composante investissement du Budget, est clôturé avec le même exercice tout en conservant ses propres indicateurs de réalisation et engagements pluriannuels.

## 4. Périmètre fonctionnel

Le module couvre le Budget, le PAP, les crédits, les lignes budgétaires, les mouvements de crédits, l’Expression de Besoin, l’Engagement, la Liquidation, l’Ordonnancement, le Paiement, les financements CEEAC/PTF, les contrats et engagements pluriannuels, la GED, les workflows, le reporting, le contrôle budgétaire, le contrôle interne et le journal d’audit.

## 5. Types de clôture à gérer

Pré-clôture ou clôture préparatoire : phase de contrôle, d’inventaire et de correction avant la date d’arrêté.

Clôture provisoire : gel contrôlé de l’exercice permettant les derniers rapprochements et validations institutionnelles.

Clôture définitive : verrouillage officiel de l’exercice après validation des acteurs compétents.

Clôture technique : opérations système de verrouillage, archivage, indexation et génération des soldes d’ouverture de l’exercice suivant.

Clôture exceptionnelle ou partielle : utilisée uniquement lorsqu’une règle spécifique autorise la fermeture d’un périmètre déterminé, par exemple un projet ou un financement PTF.

## 6. Calendrier de clôture

Le système doit gérer un calendrier de clôture paramétrable comportant au minimum : date d’ouverture de la campagne de clôture, date limite de saisie des EB, date limite d’engagement, date limite de liquidation, date limite d’ordonnancement, date limite de paiement, période de régularisation, date de clôture provisoire, date de validation institutionnelle et date de clôture définitive.

Les échéances doivent pouvoir différer selon le type de financement, la catégorie d’opération ou une décision autorisée, tout en conservant la règle générale de l’exercice.

## 7. Campagne de clôture

Chaque exercice dispose d’une campagne de clôture unique identifiée par un code, une période, un statut, un responsable, un calendrier, des règles, une liste de contrôles obligatoires et les décisions associées. Les statuts recommandés sont : Préparation, Ouverte, Contrôles en cours, Corrections, Validation, Provisoirement clôturée, Définitivement clôturée, Archivée.

## 8. Tableau de bord de clôture

Le dashboard doit fournir une vision immédiate de l’état de préparation à la clôture : pourcentage de contrôles réussis, dossiers en cours, anomalies bloquantes, crédits non consommés, engagements non liquidés, liquidations non ordonnancées, ordonnancements non payés, paiements en attente de rapprochement, montants à reporter, montants à annuler, dossiers par structure et dossiers par source de financement.

## 9. Inventaire des opérations en cours

Avant clôture, le système doit inventorier automatiquement toutes les opérations non terminées. Chaque dossier est classé selon son étape réelle : EB non définitivement validée, engagement en cours, engagement validé non liquidé, liquidation non ordonnancée, ordonnancement non payé, paiement non rapproché ou dossier suspendu/rejeté.

L’inventaire doit indiquer pour chaque dossier le montant, la ligne budgétaire, le financement, l’acteur responsable, le dernier événement, le délai d’inactivité et l’action de clôture attendue.

## 10. Traitement des Expressions de Besoin en fin d’exercice

Les EB non engagées à la date limite doivent être soit finalisées avant l’échéance autorisée, soit abandonnées, soit reprogrammées dans l’exercice suivant selon une décision formelle. Une EB ne doit jamais basculer automatiquement d’un exercice à l’autre sans justification et sans contrôle de la ligne budgétaire correspondante dans le nouvel exercice.

## 11. Traitement des engagements non liquidés

Le système identifie les engagements totalement liquidés, partiellement liquidés et non liquidés. Pour chaque engagement restant, il propose les traitements autorisés : liquidation avant clôture, annulation du reliquat, maintien au titre d’un engagement à reporter, ou bascule encadrée vers l’exercice suivant lorsque les règles l’autorisent.

Le montant à reporter doit être distinct du crédit disponible non engagé. Le système conserve l’engagement d’origine, les pièces, le fournisseur, la référence contractuelle, la ligne budgétaire et la décision de report.

## 12. Traitement des liquidations non ordonnancées

Les liquidations validées mais non ordonnancées doivent être identifiées comme opérations sensibles de fin d’exercice. Le système doit empêcher leur disparition lors de la clôture et exiger soit leur ordonnancement dans les délais, soit une décision de rattachement/report selon les règles applicables.

## 13. Traitement des ordonnancements non payés

Les ordres de paiement signés mais non réglés doivent être recensés, rapprochés avec les dossiers de l’Agence Comptable et classés selon leur statut : transmis, pris en charge, rejeté, en attente de trésorerie, en cours de paiement ou payé non rapproché. Le traitement de clôture doit préserver la dette et la traçabilité de l’ordre de paiement.

## 14. Paiements et rapprochement de fin d’exercice

Le module doit vérifier que les paiements déclarés comme exécutés disposent d’une date, d’un mode, d’une référence, d’un bénéficiaire, d’un montant et des pièces justificatives attendues. Les paiements doivent être rapprochés des ordonnancements correspondants et les écarts doivent générer des anomalies.

## 15. Contrôle des crédits

Pour chaque ligne, le système reconstitue la situation : crédit initial, modifications, crédit révisé, réservations, engagements, liquidations, ordonnancements, paiements, annulations, reports et solde disponible. Les égalités de contrôle doivent être paramétrées et vérifiées avant clôture.

## 16. Crédits non consommés

Les crédits non consommés doivent être identifiés et classés selon leur traitement : annulation en fin d’exercice, report autorisé, maintien dans un dispositif pluriannuel ou autre traitement institutionnel paramétré. Aucune décision ne doit modifier le budget d’origine sans laisser une trace de la valeur avant et après.

## 17. Reports de crédits

Le système doit gérer une procédure spécifique de report : proposition, justification, contrôle, validation, approbation et génération dans l’exercice suivant. Le report doit préciser le montant, la ligne source, la future ligne cible, le financement, le motif, la base décisionnelle et le dossier associé lorsque le report concerne un engagement existant.

## 18. Annulations de crédits

Les crédits devenus sans emploi ou non reportables peuvent faire l’objet d’une annulation de fin d’exercice. L’annulation est soumise à habilitation, justification et validation. Elle doit mettre à jour le solde de la ligne sans altérer les historiques d’exécution.

## 19. Mouvements de crédits en période de clôture

À partir d’une date paramétrable, les mouvements de crédits doivent être restreints. Toute modification tardive doit passer par un circuit exceptionnel et être signalée dans le tableau de bord de clôture. Le système doit empêcher les mouvements susceptibles de rendre incohérentes des opérations déjà engagées ou liquidées.

## 20. Financements CEEAC et PTF

La clôture doit préserver la ventilation entre part CEEAC et part PTF. Les soldes, engagements, paiements, reliquats, reports et annulations sont calculés par source de financement. Pour les conventions PTF, le système doit pouvoir appliquer des dates, règles de report ou exigences documentaires spécifiques sans rompre la cohérence du Budget global.

## 21. Clôture du PAP

La clôture du PAP comprend l’arrêté financier et l’arrêté de performance. Pour chaque élément RBM - Pilier, Axe, Produit, Sous-produit, Activité, Tâche - le système doit présenter les crédits prévus, exécutés, réalisations physiques, indicateurs, taux d’exécution, écarts et commentaires de fin d’exercice.

Les activités pluriannuelles doivent être reconduites sans être recréées artificiellement, tout en séparant les réalisations de chaque exercice.

## 22. Rattachement des opérations au bon exercice

Le module doit vérifier que chaque opération porte l’exercice approprié et que les dates de création, validation, engagement, service fait, ordonnancement et paiement sont cohérentes. Les opérations antidatées ou postérieures aux dates limites doivent être détectées et justifiées.

## 23. Contrôles d’intégrité des données

Avant clôture, exécuter des contrôles automatiques : lignes orphelines, références inexistantes, montants négatifs non autorisés, incohérences de statuts, doublons, pièces manquantes, dossiers sans bénéficiaire, crédits consommés au-delà du disponible, ruptures de workflow, dossiers sans journalisation et divergences Budget/PAP.

## 24. Contrôle des workflows

Aucun dossier ne doit être considéré comme achevé si les validations obligatoires n’ont pas été exécutées. Le système vérifie la complétude des chaînes de validation et identifie les dossiers ayant subi un contournement, une transition manuelle exceptionnelle ou une validation réalisée par un acteur non habilité.

## 25. Contrôle des pièces justificatives et GED

Le module doit générer une liste des dossiers dont la GED est incomplète. Les pièces requises sont contrôlées par type d’opération. Les documents finaux générés à chaque étape doivent être présents, figés, versionnés et liés au dossier avant archivage définitif.

## 26. Gestion des anomalies de clôture

Chaque anomalie possède un identifiant, une règle déclenchée, une criticité, un dossier concerné, une structure responsable, un acteur chargé de correction, une échéance, un statut et un historique. Les anomalies critiques bloquent la clôture définitive sauf dérogation formelle.

## 27. Classification des anomalies

Critique : empêche la clôture ou compromet l’intégrité financière. Majeure : nécessite correction ou justification avant validation. Mineure : peut être clôturée avec action corrective tracée. Information : signale un point de vigilance sans blocage.

## 28. Plans d’actions correctives

Les anomalies peuvent générer des actions correctives : responsable, action attendue, échéance, preuve de réalisation, validation de la correction et date de clôture. Le tableau de bord doit suivre les actions en retard et leur criticité.

## 29. Dérogations et exceptions

Une opération bloquante ne peut être contournée qu’au moyen d’une dérogation autorisée. La dérogation précise le motif, la règle concernée, l’autorité d’approbation, la durée, le périmètre et les conséquences. Toute dérogation doit apparaître dans le rapport final de clôture.

## 30. Workflow de clôture

Workflow cible : Préparation de la campagne → Ouverture → Inventaire automatique → Contrôles → Corrections → Proposition de reports/annulations → Validation des situations → Clôture provisoire → Rapprochements finaux → Approbation → Clôture définitive → Archivage → Génération des soldes et données d’ouverture N+1.

Les rôles exacts doivent être paramétrables afin de respecter l’organisation et les délégations en vigueur.

## 31. Clôture provisoire

La clôture provisoire interdit les nouvelles opérations ordinaires tout en autorisant un nombre limité d’actions de régularisation. Le système doit afficher clairement cet état et journaliser toute opération réalisée durant cette période.

## 32. Clôture définitive

La clôture définitive fige les données financières de l’exercice. Les créations, modifications, validations et mouvements ordinaires sont désactivés. Les données restent consultables et exploitables en reporting, audit et comparaison historique.

## 33. Verrouillage applicatif

Le verrouillage doit être appliqué à la fois au niveau de l’exercice, des modules et des opérations. Les API, imports, traitements batch et interfaces utilisateurs doivent respecter le statut de clôture afin d’éviter toute modification hors interface.

## 34. Réouverture exceptionnelle

La réouverture d’un exercice clôturé doit rester exceptionnelle. Elle nécessite une demande motivée, l’identification précise du périmètre à corriger, une approbation renforcée et une durée limitée. Le système crée un événement de réouverture, conserve l’état avant modification et impose une nouvelle clôture après correction.

## 35. Archivage

Après clôture définitive, les dossiers, états, rapports, pièces GED et journaux sont archivés selon une politique de conservation. L’archive doit rester consultable en lecture seule et conserver les relations entre Budget, PAP et chaîne de dépense.

## 36. Génération des données d’ouverture N+1

Le système doit préparer les données nécessaires à l’exercice suivant sans dupliquer aveuglément l’exercice clôturé. Peuvent être repris selon paramétrage : référentiels, structures, nomenclature, lignes reconduites, engagements reportés, programmes pluriannuels, activités PAP en cours, financements et paramètres. Les montants d’ouverture doivent provenir de décisions validées.

## 37. Continuité entre N et N+1

Les opérations reportées doivent conserver une relation explicite entre leur identifiant d’origine et leur représentation dans N+1. L’utilisateur doit pouvoir naviguer de l’opération source vers l’opération reprise et inversement.

## 38. États et rapports de clôture

Le module doit produire au minimum : situation globale d’exécution, situation par ligne, crédits initiaux/révisés, engagements, liquidations, ordonnancements, paiements, restes à engager, restes à liquider, restes à ordonnancer, restes à payer, crédits à annuler, crédits à reporter, engagements reportés, exécution CEEAC/PTF, synthèse PAP, anomalies, dérogations, actions correctives et rapport final de clôture.

## 39. Documents PDF officiels

Les documents officiels doivent être générés à partir de modèles normalisés, numérotés, datés et figés. Prévoir notamment : rapport de pré-clôture, état des engagements restant à liquider, état des ordonnancements restant à payer, état des reports, état des annulations, procès-verbal ou décision de clôture, rapport final de clôture et état d’ouverture N+1 lorsque requis.

## 40. Exports et analyses

Les listes et états doivent être exportables en PDF et Excel selon les habilitations. Les exports doivent reprendre les filtres appliqués et indiquer l’exercice, la date d’extraction et l’utilisateur ayant généré le fichier.

## 41. Notifications et alertes

Prévoir des notifications pour l’ouverture de campagne, échéances proches, dossiers non finalisés, anomalies critiques, actions correctives en retard, propositions de report à valider, clôture provisoire, approbation attendue et clôture définitive. Les alertes doivent conduire directement au dossier concerné.

## 42. Journal des événements

Toutes les actions sont historisées : ouverture de campagne, changements de paramètres, contrôles exécutés, anomalies, corrections, reports, annulations, validations, dérogations, clôture provisoire, clôture définitive, réouverture, génération d’états et archivage. L’historique doit permettre de répondre à : qui a fait quoi, quand, sur quel exercice, avec quelles valeurs avant/après et quel résultat ?

## 43. Habilitations et séparation des fonctions

Prévoir des permissions distinctes : consulter la clôture, préparer une campagne, exécuter les contrôles, corriger, proposer un report, valider un report, proposer une annulation, approuver, lancer la clôture provisoire, clôturer définitivement, réouvrir, générer les états, exporter et consulter l’audit. Les actions incompatibles doivent pouvoir être séparées par rôle.

## 44. Intégration avec le contrôle budgétaire et le contrôle interne

Le module 17 doit réutiliser le moteur de règles et les anomalies du module 14. La clôture déclenche un jeu de contrôles renforcés de fin d’exercice. Les anomalies non résolues, réserves et dérogations doivent apparaître dans le dossier de clôture.

## 45. Intégration avec le Suivi-Évaluation

Les réalisations financières de clôture doivent alimenter les indicateurs de performance et les rapports de suivi-évaluation. Le module doit distinguer la performance financière de la performance physique afin de permettre l’analyse des écarts.

## 46. Interfaces à concevoir

Au minimum : Dashboard Clôture ; campagnes de clôture ; calendrier ; inventaire des dossiers ; situation des crédits ; engagements à traiter ; liquidations à traiter ; ordonnancements à traiter ; paiements à rapprocher ; reports ; annulations ; contrôles ; anomalies ; actions correctives ; dérogations ; situation PAP ; rapprochements ; validation de clôture ; clôture provisoire ; clôture définitive ; réouverture ; reprise N+1 ; archives ; rapports ; prévisualisation PDF ; journal d’audit ; paramétrage.

## 47. Modèle conceptuel minimal

Entités principales recommandées : ExerciceBudgetaire, CampagneCloture, CalendrierCloture, ControleCloture, RegleControle, AnomalieCloture, ActionCorrective, DerogationCloture, PropositionReport, ReportCredit, AnnulationCredit, EngagementReporte, RapprochementCloture, ValidationCloture, DocumentCloture, EvenementAudit et ReouvertureExercice.

Les entités opérationnelles existantes - Budget, LigneBudgetaire, PAP, EB, Engagement, Liquidation, Ordonnancement, Paiement, Tiers, DocumentGED - doivent être référencées plutôt que dupliquées.

## 48. Règles métier essentielles

RM-01 : un exercice définitivement clôturé est en lecture seule. RM-02 : aucune clôture définitive n’est possible en présence d’anomalies critiques non résolues sauf dérogation autorisée. RM-03 : tout report doit identifier une source N et une destination N+1. RM-04 : les crédits non reportés suivent le traitement de fin d’exercice paramétré. RM-05 : un dossier payé ne peut être clôturé comme non payé. RM-06 : toute réouverture doit être approuvée et temporaire. RM-07 : toute modification postérieure à une clôture provisoire est journalisée comme régularisation de clôture. RM-08 : les montants du PAP et du Budget doivent rester cohérents après traitement des reports.

## 49. Critères d’acceptation

Le module est accepté lorsqu’il est possible de lancer une campagne complète sur un exercice de test, d’obtenir automatiquement l’inventaire des opérations, de détecter les incohérences, de traiter les reports et annulations, de générer les états, de réaliser une clôture provisoire puis définitive, de bloquer toute modification ultérieure et de réouvrir exceptionnellement l’exercice avec une traçabilité intégrale.

Les totaux des états de clôture doivent être réconciliables avec les données sources de chaque module et aucun écart non expliqué ne doit subsister.

## 50. Principe directeur final

La Clôture budgétaire de BUDGET-CEEAC doit constituer la preuve numérique et documentaire que l’exercice a été correctement arrêté. Elle doit préserver l’historique, sécuriser la séparation entre exercices, identifier toutes les obligations restant à traiter, garantir la cohérence Budget-PAP-exécution et préparer N+1 sans altérer la vérité de l’exercice N.
