# Workflows de référence — BUDGET-CEEAC / GESBUDEP

**Date :** 26 septembre 2026  
**Source :** cahier v5.0 §8 à §12. Les gardes de montant ne sont pas désactivables par le paramétrage du circuit.

## 1. Moteur

Une définition comporte : code, version, date d’effet, étapes, acteur attendu (fonction + périmètre), actions (`submit`, `validate`, `visa`, `certify`, `approve`, `sign`, `return`, `reject`, `cancel`, `suspend`, `reopen`), conditions, délai SLA, notification, document à produire.

Chaque instance conserve l’étape courante, la dernière action, l’acteur, l’horodatage, l’acteur attendu et l’échéance. C’est le contenu de la bannière de dossier.

Toute transition écrit un événement. Un retour exige un motif. Un rejet clôt le circuit sauf réouverture habilitée. Une modification substantielle après approbation crée une nouvelle version et ne réécrit pas l’acte signé.

## 2. EB Hors PAP

| Ordre | Étape | Acteur attendu | Issue nominale |
| --- | --- | --- | --- |
| 1 | Brouillon | Service des Moyens Généraux | Soumission |
| 2 | Validation DRHMG | DRHMG | Validation |
| 3 | Validation SG | Secrétaire Général | Validation |
| 4 | Approbation | Président (ordonnateur principal) | Signature |
| 5 | Clôture EB | Système | ENG unique créé, PDF archivé |

Gardes : exercice ouvert, ligne exécutoire, structure autorisée, PAP/Hors PAP cohérent avec la ligne, somme des sous-lignes égale au montant, pièces requises, SoD.

## 3. EB PAP

| Type de département | Circuit |
| --- | --- |
| Technique | Initiateur habilité → Directeur → Commissaire du département |
| Appui | Initiateur habilité → Directeur → Secrétaire Général |

Même clôture : snapshot, PDF, ENG idempotent. La chaîne GAR/RBM est héritée et affichée, non ressaisie.

## 4. ENG

| Ordre | Étape | Acteur | Effet financier |
| --- | --- | --- | --- |
| 1 | Généré | Système, depuis EB validée | Aucun. L’instruction s’ouvre aussitôt. |
| 2 | Instruction | Expert Budget | Aucun |
| 3 | Validation N+1 | Chef de Service Budget | Aucun |
| 4 | Validation budget | Directeur Budget | Réservation du crédit |
| 5 | Visa | Contrôleur Financier | Réservation transformée en engagement ; LIQ coquille créée |
| — | Visa refusé | Contrôleur Financier | Réservation libérée si le refus est définitif |

Gardes : montant ≤ reliquat EB, montant ≤ disponible verrouillé, pas de double engagement de la même obligation, période ouverte.

Engagements partiels autorisés dans la limite du reliquat. Dégagement : restitution du non liquidé, avec motif et validation.

## 5. LIQ

| Ordre | Étape | Acteur |
| --- | --- | --- |
| 1 | Générée | Système |
| 2 | Préparation | Service compétent |
| 3 | Service fait | Service initiateur / certificateur |
| 4 | Visa | Contrôleur Financier |
| 5 | Clôture | Système : ORD en coquille. Le PDF est reporté. |

Gardes : ENG visé, cumul des liquidations non refusées ≤ ENG net, facture unique par numéro, libellé de fournisseur et exercice, service fait obligatoire, montant net ≥ 0. Seul le visa entre dans le liquidé.

## 6. ORD

| Ordre | Étape | Acteur |
| --- | --- | --- |
| 1 | Généré | Système, depuis LIQ visée |
| 2 | Contrôle | Préparation administrative, sans fonction nommée : passage automatique, retour bloqué |
| 3 | Signature | SG si montant ≤ seuil ; Président si montant > seuil |
| 4 | Transmission | Système vers Agence Comptable |
| 5 | Prise en charge | Agence Comptable, ou rejet motivé |

Seuil initial : 5 000 000 XAF, copié sur l’acte.  
Gardes : cumul ≤ LIQ, ordonnateur conforme, SoD avec l’agent comptable, compte bénéficiaire contrôlé.

## 7. PAI

| Ordre | Étape | Acteur |
| --- | --- | --- |
| 1 | Pris en charge | Agence Comptable |
| 2 | Préparation | Comptable |
| 3 | Contrôle | Chef Comptable |
| 4 | Autorisation | Agent Comptable |
| 5 | Exécution | Mode virement, chèque ou caisse |
| 6 | Résultat | Exécuté, rejet bancaire, annulation de chèque, ou nouvelle tentative |

Gardes : cumul des paiements non rejetés ≤ ordre pris en charge, preuve avant exécution, référence d’instrument non réutilisée. Le compte bancaire et la trésorerie ne sont pas chargés.

## 8. Mouvement budgétaire

Brouillon → justification et pièce → validation habilitée → application au révisé. Le budget initial n’est pas réécrit. Types : virement, transfert, annulation, ouverture, abondement, correction, révision, gel, dégel.

## 9. SLA

Chaque étape porte un délai cible. Le dépassement crée un rappel puis une alerte. Il ne bloque pas l’acte, conformément au cahier §41. Les corbeilles distinguent : dans les délais, proche échéance, en retard, critique.

## 10. Bannière

Champs obligatoires sur chaque dossier : étape actuelle, dernière action, acteur, date et heure, prochaine étape, acteur attendu, délai, statut.
