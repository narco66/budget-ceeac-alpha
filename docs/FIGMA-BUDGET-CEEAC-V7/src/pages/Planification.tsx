import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  ChevronRight, ChevronDown, X, Plus, Eye, Search, Filter, Copy,
  AlertTriangle, CheckCircle, Clock, Calendar, User, Flag, BarChart3,
  FileText, History, Layers, Target, CheckSquare, AlertCircle,
  RefreshCw, Download, MoreVertical, Edit3, Trash2, Move, Power,
  GitBranch, BookOpen, Send, ShieldCheck, Globe, ArrowRight,
  TrendingUp, Zap, ChevronLeft, Check, Info,
} from 'lucide-react'
import type { Page } from '../types'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type NodeType = 'pilier' | 'axe' | 'produit' | 'sous-produit' | 'activite' | 'tache'
type MainView = 'dashboard' | 'arbre' | 'tableau' | 'gantt' | 'exercices' | 'versions' | 'publication' | 'wizard' | 'indicateurs' | 'audit'
type ExerciceStatut = 'A_PREPARER' | 'EN_PREPARATION' | 'EN_EXECUTION' | 'CLOTURE' | 'ARCHIVE'
type VersionStatut = 'BROUILLON' | 'SOUMISE' | 'EN_VERIFICATION' | 'RETOURNEE' | 'VALIDEE' | 'PUBLIEE' | 'REMPLACEE' | 'REJETEE'
type NodeStatut = 'ACTIF' | 'SUSPENDU' | 'DESACTIVE' | 'CLOTURE' | 'ANNULE'
type Applicabilite = 'A_VENIR' | 'ACTIVE' | 'HISTORIQUE' | 'NA'

interface Exercice {
  code: string; libelle: string; statut: ExerciceStatut
  dateDebut: string; dateFin: string; versionActive: string | null
  versionBrouillon: string | null; nbPiliers: number; lastModif: string | null; responsable: string
}
interface Version {
  num: string; exerciceCode: string; statut: VersionStatut
  dateCreation: string; datePublication: string | null; dateEffet: string | null
  auteur: string; motif: string; commentaire: string; applicabilite: Applicabilite
}
interface Tache {
  code: string; activiteCode: string; libelle: string; description: string
  responsable: string; structure: string; debut: string; fin: string
  priorite: 'CRITIQUE' | 'HAUTE' | 'NORMALE' | 'BASSE'; statut: 'NON_DEMARREE' | 'EN_COURS' | 'REALISEE' | 'EN_RETARD' | 'SUSPENDUE' | 'ANNULEE'
  poids: number; avancement: number; cout: number; indicateur: string
  resultatAttendu: string; observations: string; hasHistory: boolean; retardJours: number
  nodeStatut: NodeStatut
}
interface Activite {
  code: string; sousProduitCode: string; libelle: string; responsable: string; structure: string
  debut: string; fin: string; budget: number; priorite: 'CRITIQUE' | 'HAUTE' | 'NORMALE' | 'BASSE'
  statut: 'NON_DEMARREE' | 'EN_COURS' | 'EN_RETARD' | 'REALISEE' | 'SUSPENDUE'
  description: string; resultatAttendu: string; observations: string; nodeStatut: NodeStatut
}
interface SousProduit {
  code: string; produitCode: string; libelle: string; description: string
  responsable: string; resultatAttendu: string; nodeStatut: NodeStatut
}
interface Produit {
  code: string; axeCode: string; libelle: string; description: string
  indicateur: string; responsable: string; resultatAttendu: string; nodeStatut: NodeStatut
}
interface Axe {
  code: string; pilierCode: string; libelle: string; description: string
  responsable: string; objectif: string; nodeStatut: NodeStatut
}
interface Pilier {
  code: string; libelle: string; color: string; description: string
  orientationStrategique: string; objectifGeneral: string; responsable: string
  ordre: number; nodeStatut: NodeStatut
}
interface Indicateur {
  code: string; libelle: string; definition: string; type: 'QUANTITATIF' | 'QUALITATIF' | 'BINAIRE'
  unite: string; source: string; frequence: string; baseline: string
  cible2026: string; cible2027: string; cible2028: string
  responsable: string; niveauRattachement: NodeType; nodeCode: string
}
interface AuditEntry {
  id: string; date: string; heure: string; utilisateur: string; role: string
  exercice: string; version: string; action: string
  ancienneValeur: string; nouvelleValeur: string; justification: string
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const EX_STATUT: Record<ExerciceStatut, { label: string; bg: string; color: string }> = {
  A_PREPARER:     { label: 'À préparer',     bg: '#F1F5F9', color: '#475569' },
  EN_PREPARATION: { label: 'En préparation', bg: '#DBEAFE', color: '#1D4ED8' },
  EN_EXECUTION:   { label: 'En exécution',   bg: '#DCFCE7', color: '#15803D' },
  CLOTURE:        { label: 'Clôturé',        bg: '#FEF3C7', color: '#92400E' },
  ARCHIVE:        { label: 'Archivé',        bg: '#F3F4F6', color: '#6B7280' },
}
const VER_STATUT: Record<VersionStatut, { label: string; bg: string; color: string }> = {
  BROUILLON:      { label: 'Brouillon',       bg: '#F1F5F9', color: '#475569' },
  SOUMISE:        { label: 'Soumise',         bg: '#FEF9C3', color: '#854D0E' },
  EN_VERIFICATION:{ label: 'En vérification', bg: '#DBEAFE', color: '#1D4ED8' },
  RETOURNEE:      { label: 'Retournée',       bg: '#FFF7ED', color: '#C2410C' },
  VALIDEE:        { label: 'Validée',         bg: '#D1FAE5', color: '#065F46' },
  PUBLIEE:        { label: 'Publiée',         bg: '#DCFCE7', color: '#15803D' },
  REMPLACEE:      { label: 'Remplacée',       bg: '#F5F3FF', color: '#5B21B6' },
  REJETEE:        { label: 'Rejetée',         bg: '#FEE2E2', color: '#991B1B' },
}
const APP_STATUT: Record<Applicabilite, { label: string; bg: string; color: string }> = {
  A_VENIR:   { label: 'À venir',   bg: '#EFF6FF', color: '#1D4ED8' },
  ACTIVE:    { label: 'Active',    bg: '#DCFCE7', color: '#15803D' },
  HISTORIQUE:{ label: 'Historique',bg: '#F3F4F6', color: '#6B7280' },
  NA:        { label: 'N/A',       bg: '#F9FAFB', color: '#9CA3AF' },
}
const NODE_STATUT: Record<NodeStatut, { label: string; bg: string; color: string }> = {
  ACTIF:    { label: 'Actif',    bg: '#DCFCE7', color: '#15803D' },
  SUSPENDU: { label: 'Suspendu', bg: '#FEF3C7', color: '#92400E' },
  DESACTIVE:{ label: 'Désactivé',bg: '#F3F4F6', color: '#6B7280' },
  CLOTURE:  { label: 'Clôturé', bg: '#DBEAFE', color: '#1D4ED8' },
  ANNULE:   { label: 'Annulé',   bg: '#FEE2E2', color: '#991B1B' },
}
const LEVEL_COLORS: Record<NodeType, { bg: string; color: string; label: string }> = {
  pilier:         { bg: '#EDF2FB', color: '#1B3269', label: 'PILIER' },
  axe:            { bg: '#F0FDF4', color: '#15803D', label: 'AXE' },
  produit:        { bg: '#FFFBEB', color: '#92400E', label: 'PRODUIT' },
  'sous-produit': { bg: '#F5F3FF', color: '#5B21B6', label: 'SOUS-PRODUIT' },
  activite:       { bg: '#FFF7ED', color: '#C2410C', label: 'ACTIVITÉ' },
  tache:          { bg: '#F0FDF4', color: '#059669', label: 'TÂCHE' },
}
const STATUT_ACT: Record<string, { label: string; bg: string; color: string }> = {
  NON_DEMARREE: { label: 'Non démarrée', bg: '#F1F5F9', color: '#475569' },
  EN_COURS:     { label: 'En cours',     bg: '#ECFDF5', color: '#059669' },
  EN_RETARD:    { label: 'En retard',    bg: '#FFF7ED', color: '#C2410C' },
  REALISEE:     { label: 'Réalisée',     bg: '#DCFCE7', color: '#16A34A' },
  SUSPENDUE:    { label: 'Suspendue',    bg: '#F5F3FF', color: '#7C3AED' },
  ANNULEE:      { label: 'Annulée',      bg: '#FEE2E2', color: '#991B1B' },
}
const PRIOR: Record<string, { label: string; color: string; bg: string }> = {
  CRITIQUE: { label: 'Critique', color: '#991B1B', bg: '#FEE2E2' },
  HAUTE:    { label: 'Haute',    color: '#9A3412', bg: '#FFEDD5' },
  NORMALE:  { label: 'Normale',  color: '#1D4ED8', bg: '#EFF6FF' },
  BASSE:    { label: 'Basse',    color: '#475569', bg: '#F1F5F9' },
}

/* ═══════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════ */
const EXERCICES_INIT: Exercice[] = [
  { code: '2025', libelle: 'Exercice 2025', statut: 'ARCHIVE',        dateDebut: '2025-01-01', dateFin: '2025-12-31', versionActive: 'v2.0', versionBrouillon: null,  nbPiliers: 4, lastModif: '2025-12-31', responsable: 'DAF' },
  { code: '2026', libelle: 'Exercice 2026', statut: 'EN_EXECUTION',   dateDebut: '2026-01-01', dateFin: '2026-12-31', versionActive: 'v1.2', versionBrouillon: null,  nbPiliers: 4, lastModif: '2026-01-10', responsable: 'DAF' },
  { code: '2027', libelle: 'Exercice 2027', statut: 'EN_PREPARATION', dateDebut: '2027-01-01', dateFin: '2027-12-31', versionActive: null,   versionBrouillon: 'v0.4', nbPiliers: 4, lastModif: '2026-09-01', responsable: 'RP' },
  { code: '2028', libelle: 'Exercice 2028', statut: 'A_PREPARER',     dateDebut: '2028-01-01', dateFin: '2028-12-31', versionActive: null,   versionBrouillon: null,  nbPiliers: 0, lastModif: null,         responsable: '—' },
]
const VERSIONS_INIT: Version[] = [
  { num: 'v2.0', exerciceCode: '2025', statut: 'REMPLACEE',     dateCreation: '2025-01-01', datePublication: '2025-01-15', dateEffet: '2025-01-15', auteur: 'DAF · M.C. Nkumu', motif: 'Version finale 2025', commentaire: 'Publiée et remplacée lors clôture exercice', applicabilite: 'HISTORIQUE' },
  { num: 'v1.0', exerciceCode: '2026', statut: 'REMPLACEE',     dateCreation: '2026-01-01', datePublication: '2026-01-08', dateEffet: '2026-01-08', auteur: 'DAF · M.C. Nkumu', motif: 'Version initiale 2026', commentaire: 'Remplacée par v1.2', applicabilite: 'HISTORIQUE' },
  { num: 'v1.1', exerciceCode: '2026', statut: 'REMPLACEE',     dateCreation: '2026-03-01', datePublication: '2026-03-10', dateEffet: '2026-04-01', auteur: 'DAF · M.C. Nkumu', motif: 'Ajout P4 numérique', commentaire: 'Remplacée par v1.2', applicabilite: 'HISTORIQUE' },
  { num: 'v1.2', exerciceCode: '2026', statut: 'PUBLIEE',       dateCreation: '2026-06-01', datePublication: '2026-06-15', dateEffet: '2026-07-01', auteur: 'DAF · M.C. Nkumu', motif: 'Révision mi-parcours', commentaire: 'Version active exercice 2026', applicabilite: 'ACTIVE' },
  { num: 'v0.1', exerciceCode: '2027', statut: 'RETOURNEE',     dateCreation: '2026-07-01', datePublication: null,         dateEffet: null,         auteur: 'RP · F. Al-Rashid', motif: 'Initialisation 2027', commentaire: 'Retournée: axes incomplets', applicabilite: 'NA' },
  { num: 'v0.2', exerciceCode: '2027', statut: 'REMPLACEE',     dateCreation: '2026-07-20', datePublication: null,         dateEffet: null,         auteur: 'RP · F. Al-Rashid', motif: 'Correction axes', commentaire: 'Supersédée par v0.4', applicabilite: 'NA' },
  { num: 'v0.4', exerciceCode: '2027', statut: 'EN_VERIFICATION',dateCreation: '2026-09-01', datePublication: null,         dateEffet: null,         auteur: 'RP · F. Al-Rashid', motif: 'Version consolidée', commentaire: 'En vérification DAF', applicabilite: 'NA' },
]

const PILIERS_INIT: Pilier[] = [
  { code: 'P01', libelle: 'Intégration Économique et Commerce', color: '#0B1C3E', description: 'Renforcement de l\'intégration économique et facilitation du commerce intrarégional.', orientationStrategique: 'Consolidation de la zone de libre-échange CEEAC', objectifGeneral: 'Réduire les barrières au commerce intrarégional à 2,5% d\'ici 2028', responsable: 'DEPIEC', ordre: 1, nodeStatut: 'ACTIF' },
  { code: 'P02', libelle: 'Paix, Sécurité et Gouvernance', color: '#1A6B3A', description: 'Promotion de la paix, de la sécurité et de la bonne gouvernance.', orientationStrategique: 'Architecture de paix et sécurité régionale', objectifGeneral: 'Renforcer les mécanismes d\'alerte et de réponse aux crises', responsable: 'DEPPS', ordre: 2, nodeStatut: 'ACTIF' },
  { code: 'P03', libelle: 'Développement Humain et Social', color: '#D97706', description: 'Amélioration des conditions de vie et renforcement des capacités humaines.', orientationStrategique: 'Capital humain et cohésion sociale régionale', objectifGeneral: 'Former 300 agents par an et améliorer les indicateurs sociaux', responsable: 'DEPDHS', ordre: 3, nodeStatut: 'ACTIF' },
  { code: 'P04', libelle: 'Gouvernance Institutionnelle et Numérique', color: '#7C3AED', description: 'Modernisation des institutions et transformation numérique de la CEEAC.', orientationStrategique: 'Administration efficace et gouvernance digitale', objectifGeneral: 'Atteindre 80% de digitalisation des processus d\'ici 2026', responsable: 'DSI', ordre: 4, nodeStatut: 'ACTIF' },
]
const AXES_INIT: Axe[] = [
  { code: 'P01-A01', pilierCode: 'P01', libelle: 'Zone de libre-échange CEEAC', description: 'Création et consolidation de la zone de libre-échange.', responsable: 'DEPIEC', objectif: 'Harmonisation des tarifs douaniers', nodeStatut: 'ACTIF' },
  { code: 'P01-A02', pilierCode: 'P01', libelle: 'Intégration commerciale régionale', description: 'Harmonisation des politiques commerciales.', responsable: 'DEPIEC', objectif: 'Concertation et dialogue régional', nodeStatut: 'ACTIF' },
  { code: 'P02-A01', pilierCode: 'P02', libelle: 'Architecture de paix et sécurité', description: 'Mécanismes de maintien de la paix.', responsable: 'DEPPS', objectif: 'Prévention des conflits', nodeStatut: 'ACTIF' },
  { code: 'P03-A01', pilierCode: 'P03', libelle: 'Renforcement des capacités', description: 'Renforcement des compétences institutionnelles.', responsable: 'DEPDHS', objectif: 'Formation régionale', nodeStatut: 'ACTIF' },
  { code: 'P04-A01', pilierCode: 'P04', libelle: 'Transformation numérique', description: 'Déploiement des systèmes d\'information intégrés.', responsable: 'DSI', objectif: 'Digitalisation des processus', nodeStatut: 'ACTIF' },
]
const PRODUITS_INIT: Produit[] = [
  { code: 'P01-A01-PR01', axeCode: 'P01-A01', libelle: 'Réduction des barrières tarifaires', description: 'Négociation et mise en œuvre de réductions tarifaires.', indicateur: 'Taux moyen droits de douane', responsable: 'DEPIEC', resultatAttendu: 'Taux moyen ≤ 2,5%', nodeStatut: 'ACTIF' },
  { code: 'P01-A01-PR02', axeCode: 'P01-A01', libelle: 'Harmonisation des réglementations', description: 'Convergence des cadres réglementaires.', indicateur: 'Nb textes harmonisés', responsable: 'DEPIEC', resultatAttendu: '8 textes harmonisés', nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01', axeCode: 'P01-A02', libelle: 'Concertation et dialogue régional', description: 'Forums et plateformes de dialogue.', indicateur: 'Nb forums organisés', responsable: 'DEPIEC', resultatAttendu: '4 forums par an', nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01', axeCode: 'P02-A01', libelle: "Mécanismes d'alerte précoce", description: 'Systèmes de détection et prévention.', indicateur: 'Délai moyen de réponse (h)', responsable: 'DEPPS', resultatAttendu: 'Délai ≤ 48h', nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01', axeCode: 'P03-A01', libelle: 'Formation et expertise régionale', description: 'Programmes de renforcement des capacités.', indicateur: 'Nb bénéficiaires formés', responsable: 'DEPDHS', resultatAttendu: '300 agents/an', nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01', axeCode: 'P04-A01', libelle: "Systèmes d'information intégrés", description: 'Déploiement ERP intégré.', indicateur: 'Taux digitalisation processus', responsable: 'DSI', resultatAttendu: '80% fin 2026', nodeStatut: 'ACTIF' },
]
const SOUS_PRODUITS_INIT: SousProduit[] = [
  { code: 'P01-A01-PR01-SP01', produitCode: 'P01-A01-PR01', libelle: 'Étude et négociation des taux préférentiels', description: 'Analyse et négociation de préférences tarifaires.', responsable: 'DEPIEC', resultatAttendu: 'Accord tarifaire signé', nodeStatut: 'ACTIF' },
  { code: 'P01-A01-PR01-SP02', produitCode: 'P01-A01-PR01', libelle: 'Mise en œuvre des accords tarifaires', description: 'Application opérationnelle des accords signés.', responsable: 'DEPIEC', resultatAttendu: 'Mise en œuvre opérationnelle', nodeStatut: 'ACTIF' },
  { code: 'P01-A01-PR02-SP01', produitCode: 'P01-A01-PR02', libelle: 'Harmonisation des procédures douanières', description: 'Convergence des procédures de dédouanement.', responsable: 'DEPIEC', resultatAttendu: 'Procédure unique adoptée', nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01', produitCode: 'P01-A02-PR01', libelle: 'Forums régionaux et concertations', description: 'Rencontres de haut niveau sur le commerce.', responsable: 'DEPIEC', resultatAttendu: '4 forums/an avec déclarations', nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01-SP01', produitCode: 'P02-A01-PR01', libelle: "Évaluation des programmes de paix", description: 'Revue périodique des opérations de paix.', responsable: 'DEPPS', resultatAttendu: 'Rapport annuel validé', nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01', produitCode: 'P03-A01-PR01', libelle: 'Formation des agents nationaux', description: 'Sessions de formation pour fonctionnaires.', responsable: 'DEPDHS', resultatAttendu: '300 agents certifiés/an', nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01', produitCode: 'P04-A01-PR01', libelle: 'Déploiement BUDGET-CEEAC', description: 'Installation et paramétrage du système.', responsable: 'DSI', resultatAttendu: 'Système en production', nodeStatut: 'ACTIF' },
]
const ACTIVITES_INIT: Activite[] = [
  { code: 'P01-A01-PR01-SP01-ACT01', sousProduitCode: 'P01-A01-PR01-SP01', libelle: 'Étude comparative des taux douaniers', responsable: 'M. Jean-Paul MOUAMBA', structure: 'DEPIEC', debut: '2026-01-15', fin: '2026-04-30', budget: 185_000_000, priorite: 'HAUTE', statut: 'EN_COURS', description: 'Analyse comparative des taux douaniers des 11 États membres.', resultatAttendu: 'Rapport comparatif validé', observations: '', nodeStatut: 'ACTIF' },
  { code: 'P01-A01-PR01-SP02-ACT01', sousProduitCode: 'P01-A01-PR01-SP02', libelle: 'Réduction des barrières non-tarifaires', responsable: 'Mme Fanta DIALLO', structure: 'DEPIEC', debut: '2026-02-01', fin: '2026-09-30', budget: 340_000_000, priorite: 'HAUTE', statut: 'EN_COURS', description: 'Identification et suppression des obstacles non-tarifaires.', resultatAttendu: 'Nb barrières réduites ≥ 5', observations: '', nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01-ACT01', sousProduitCode: 'P01-A02-PR01-SP01', libelle: 'Forums régionaux pour l\'intégration commerciale', responsable: 'M. Jean-Paul MOUAMBA', structure: 'DEPIEC', debut: '2026-03-01', fin: '2026-11-30', budget: 1_190_000_000, priorite: 'CRITIQUE', statut: 'EN_COURS', description: 'Organisation de 4 forums régionaux dans les capitales de la CEEAC.', resultatAttendu: '4 forums, 600 participants', observations: '', nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01-SP01-ACT01', sousProduitCode: 'P02-A01-PR01-SP01', libelle: 'Évaluation des programmes de maintien de la paix', responsable: 'Mme Claire NGUESSA', structure: 'DEPPS', debut: '2026-01-15', fin: '2026-12-31', budget: 890_000_000, priorite: 'CRITIQUE', statut: 'EN_RETARD', description: 'Revue indépendante des programmes MARAC.', resultatAttendu: 'Rapport de scoring validé', observations: 'Données incomplètes de 3 pays.', nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01', sousProduitCode: 'P03-A01-PR01-SP01', libelle: 'Renforcement des capacités des États membres', responsable: 'M. Alain BIYOGHE', structure: 'DEPDHS', debut: '2026-04-01', fin: '2026-10-31', budget: 567_000_000, priorite: 'CRITIQUE', statut: 'EN_RETARD', description: 'Formation de 300 agents des administrations nationales.', resultatAttendu: '300 agents certifiés', observations: 'Défaillance prestataire FORMAC S.A.', nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01-ACT01', sousProduitCode: 'P04-A01-PR01-SP01', libelle: "Mise en place du système d'information intégré", responsable: 'M. Patrick ESSONO', structure: 'DSI', debut: '2026-01-01', fin: '2026-07-15', budget: 820_000_000, priorite: 'CRITIQUE', statut: 'REALISEE', description: 'Déploiement complet du système BUDGET-CEEAC.', resultatAttendu: 'Système en production', observations: 'Recette définitive signée le 15/07/2026.', nodeStatut: 'ACTIF' },
]
const TACHES_INIT: Tache[] = [
  { code: 'P01-A02-PR01-SP01-ACT01-T01', activiteCode: 'P01-A02-PR01-SP01-ACT01', libelle: 'Préparation des TDR et calendrier des forums', description: 'Rédaction des termes de référence et calendrier.', responsable: 'M. Jean-Paul MOUAMBA', structure: 'DEPIEC', debut: '2026-03-01', fin: '2026-03-31', priorite: 'HAUTE', statut: 'REALISEE', poids: 10, avancement: 100, cout: 8_500_000, indicateur: 'TDR validés', resultatAttendu: 'TDR approuvés', observations: 'Validés avec retard de 5 jours.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01-ACT01-T02', activiteCode: 'P01-A02-PR01-SP01-ACT01', libelle: 'Organisation du Forum de Libreville (Gabon)', description: 'Préparation logistique et animation du forum.', responsable: 'Mme Ève LEKOGO', structure: 'DEPIEC', debut: '2026-04-15', fin: '2026-05-30', priorite: 'CRITIQUE', statut: 'REALISEE', poids: 25, avancement: 100, cout: 145_000_000, indicateur: 'Nb participants', resultatAttendu: '150 participants', observations: '162 participants. Forum réussi.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01-ACT01-T03', activiteCode: 'P01-A02-PR01-SP01-ACT01', libelle: 'Organisation du Forum de Kinshasa (RDC)', description: 'Préparation logistique et animation du forum de Kinshasa.', responsable: 'M. Jean-Paul MOUAMBA', structure: 'DEPIEC', debut: '2026-07-01', fin: '2026-08-15', priorite: 'CRITIQUE', statut: 'EN_COURS', poids: 30, avancement: 60, cout: 178_000_000, indicateur: 'Nb participants', resultatAttendu: '200 participants', observations: 'Hébergement confirmé.', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01-ACT01-T04', activiteCode: 'P01-A02-PR01-SP01-ACT01', libelle: 'Rédaction et négociation des accords régionaux', description: 'Synthèse des décisions et rédaction des accords.', responsable: 'DAJ', structure: 'DAJ', debut: '2026-08-01', fin: '2026-10-31', priorite: 'HAUTE', statut: 'NON_DEMARREE', poids: 25, avancement: 0, cout: 32_000_000, indicateur: 'Nb accords', resultatAttendu: '6 accords finalisés', observations: '', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P01-A02-PR01-SP01-ACT01-T05', activiteCode: 'P01-A02-PR01-SP01-ACT01', libelle: 'Rapport de clôture et dissémination', description: 'Rapport final consolidant les 4 forums.', responsable: 'M. Jean-Paul MOUAMBA', structure: 'DEPIEC', debut: '2026-10-15', fin: '2026-11-30', priorite: 'NORMALE', statut: 'NON_DEMARREE', poids: 10, avancement: 0, cout: 14_000_000, indicateur: 'Rapport diffusé', resultatAttendu: 'Rapport validé', observations: '', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01-SP01-ACT01-T01', activiteCode: 'P02-A01-PR01-SP01-ACT01', libelle: 'Missions de terrain — zones de tension', description: 'Missions d\'évaluation dans les zones à risque.', responsable: 'Mme Claire NGUESSA', structure: 'DEPPS', debut: '2026-02-15', fin: '2026-05-31', priorite: 'CRITIQUE', statut: 'REALISEE', poids: 30, avancement: 100, cout: 215_000_000, indicateur: 'Missions réalisées', resultatAttendu: '3 missions', observations: '3 missions effectuées.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01-SP01-ACT01-T02', activiteCode: 'P02-A01-PR01-SP01-ACT01', libelle: 'Analyse des données et scoring des programmes', description: 'Traitement des données collectées et notation.', responsable: 'M. Roland MBARGA', structure: 'DEPPS', debut: '2026-05-01', fin: '2026-08-31', priorite: 'HAUTE', statut: 'EN_RETARD', poids: 35, avancement: 42, cout: 85_000_000, indicateur: "Rapport d'analyse", resultatAttendu: 'Rapport de scoring', observations: 'Données incomplètes. Relances envoyées.', hasHistory: true, retardJours: 18, nodeStatut: 'ACTIF' },
  { code: 'P02-A01-PR01-SP01-ACT01-T03', activiteCode: 'P02-A01-PR01-SP01-ACT01', libelle: 'Rapport final d\'évaluation et recommandations', description: 'Rapport final synthétisant les évaluations.', responsable: 'Mme Claire NGUESSA', structure: 'DEPPS', debut: '2026-09-01', fin: '2026-12-31', priorite: 'HAUTE', statut: 'NON_DEMARREE', poids: 35, avancement: 0, cout: 45_000_000, indicateur: 'Rapport validé', resultatAttendu: 'Rapport validé CPS', observations: '', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01-T01', activiteCode: 'P03-A01-PR01-SP01-ACT01', libelle: 'Diagnostic des besoins en formation', description: 'Évaluation des besoins par questionnaire.', responsable: 'M. Alain BIYOGHE', structure: 'DEPDHS', debut: '2026-04-01', fin: '2026-05-15', priorite: 'HAUTE', statut: 'REALISEE', poids: 15, avancement: 100, cout: 18_000_000, indicateur: 'Rapport diagnostic', resultatAttendu: 'Matrice validée', observations: 'Terminé avec retard de 5 jours.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01-T02', activiteCode: 'P03-A01-PR01-SP01-ACT01', libelle: 'Recrutement formateurs et prestataires', description: 'Appel d\'offres et sélection.', responsable: 'DAJ', structure: 'DAJ', debut: '2026-05-01', fin: '2026-06-30', priorite: 'CRITIQUE', statut: 'EN_RETARD', poids: 20, avancement: 30, cout: 12_000_000, indicateur: 'Contrats signés', resultatAttendu: '2 prestataires', observations: 'FORMAC S.A. a fait défaut.', hasHistory: true, retardJours: 24, nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01-T03', activiteCode: 'P03-A01-PR01-SP01-ACT01', libelle: 'Sessions de formation (300 agents, 9 pays)', description: 'Organisation et animation des sessions.', responsable: 'M. Alain BIYOGHE', structure: 'DEPDHS', debut: '2026-06-15', fin: '2026-09-30', priorite: 'CRITIQUE', statut: 'EN_RETARD', poids: 50, avancement: 15, cout: 480_000_000, indicateur: 'Nb bénéficiaires', resultatAttendu: '300 agents certifiés', observations: 'Bloqué. Actions correctives en cours.', hasHistory: true, retardJours: 20, nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01-T04', activiteCode: 'P03-A01-PR01-SP01-ACT01', libelle: 'Évaluation des acquis et certification', description: 'Tests de connaissance et certification.', responsable: 'DRH', structure: 'DRH', debut: '2026-09-01', fin: '2026-10-15', priorite: 'NORMALE', statut: 'NON_DEMARREE', poids: 10, avancement: 0, cout: 28_000_000, indicateur: 'Taux de réussite', resultatAttendu: 'Taux ≥ 80%', observations: '', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P03-A01-PR01-SP01-ACT01-T05', activiteCode: 'P03-A01-PR01-SP01-ACT01', libelle: 'Rapport final de formation', description: 'Rapport consolidé de toutes les sessions.', responsable: 'M. Alain BIYOGHE', structure: 'DEPDHS', debut: '2026-10-01', fin: '2026-10-31', priorite: 'NORMALE', statut: 'NON_DEMARREE', poids: 5, avancement: 0, cout: 9_000_000, indicateur: 'Rapport publié', resultatAttendu: 'Rapport validé', observations: '', hasHistory: false, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01-ACT01-T01', activiteCode: 'P04-A01-PR01-SP01-ACT01', libelle: 'Analyse des besoins et architecture', description: 'Étude des besoins fonctionnels et techniques.', responsable: 'M. Patrick ESSONO', structure: 'DSI', debut: '2026-01-01', fin: '2026-02-28', priorite: 'CRITIQUE', statut: 'REALISEE', poids: 10, avancement: 100, cout: 45_000_000, indicateur: "Rapport d'analyse", resultatAttendu: 'Architecture validée', observations: 'Terminé dans les délais.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01-ACT01-T02', activiteCode: 'P04-A01-PR01-SP01-ACT01', libelle: 'Développement et paramétrage', description: 'Développement des modules et paramétrage.', responsable: 'M. Patrick ESSONO', structure: 'DSI', debut: '2026-02-01', fin: '2026-05-31', priorite: 'CRITIQUE', statut: 'REALISEE', poids: 40, avancement: 100, cout: 420_000_000, indicateur: 'Modules déployés', resultatAttendu: '12 modules opérationnels', observations: 'Tous modules livrés.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01-ACT01-T03', activiteCode: 'P04-A01-PR01-SP01-ACT01', libelle: 'Formation des utilisateurs', description: 'Sessions de formation pour 85 agents.', responsable: 'DRH', structure: 'DRH', debut: '2026-05-15', fin: '2026-07-15', priorite: 'HAUTE', statut: 'REALISEE', poids: 25, avancement: 100, cout: 125_000_000, indicateur: 'Taux de formation', resultatAttendu: '100% formés', observations: '87 agents formés sur 85 prévus.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
  { code: 'P04-A01-PR01-SP01-ACT01-T04', activiteCode: 'P04-A01-PR01-SP01-ACT01', libelle: 'Mise en production et recette', description: 'Bascule en production et validation finale.', responsable: 'M. Patrick ESSONO', structure: 'DSI', debut: '2026-07-01', fin: '2026-07-15', priorite: 'CRITIQUE', statut: 'REALISEE', poids: 25, avancement: 100, cout: 38_000_000, indicateur: 'PV de recette', resultatAttendu: 'PV signé', observations: 'Recette signée le 15/07/2026.', hasHistory: true, retardJours: 0, nodeStatut: 'ACTIF' },
]
const INDICATEURS_INIT: Indicateur[] = [
  { code: 'IND-01', libelle: 'Taux moyen des droits de douane', definition: 'Moyenne pondérée des tarifs douaniers appliqués par les États membres', type: 'QUANTITATIF', unite: '%', source: 'États membres / OMC', frequence: 'Annuel', baseline: '5,2%', cible2026: '4,5%', cible2027: '3,5%', cible2028: '2,5%', responsable: 'DEPIEC', niveauRattachement: 'produit', nodeCode: 'P01-A01-PR01' },
  { code: 'IND-02', libelle: 'Nombre de textes harmonisés adoptés', definition: 'Textes législatifs ou réglementaires convergents adoptés par les États membres', type: 'QUANTITATIF', unite: 'textes', source: 'Secrétariat CEEAC', frequence: 'Annuel', baseline: '3', cible2026: '5', cible2027: '7', cible2028: '8', responsable: 'DEPIEC', niveauRattachement: 'produit', nodeCode: 'P01-A01-PR02' },
  { code: 'IND-03', libelle: 'Nombre de forums régionaux organisés', definition: 'Forums de concertation régionale tenus dans l\'année', type: 'QUANTITATIF', unite: 'forums', source: 'DEPIEC', frequence: 'Annuel', baseline: '2', cible2026: '4', cible2027: '4', cible2028: '4', responsable: 'DEPIEC', niveauRattachement: 'activite', nodeCode: 'P01-A02-PR01-SP01-ACT01' },
  { code: 'IND-04', libelle: 'Délai moyen de réponse aux alertes sécurité', definition: 'Délai entre la détection d\'une alerte et la mobilisation d\'une réponse CEEAC', type: 'QUANTITATIF', unite: 'heures', source: 'DEPPS', frequence: 'Trimestriel', baseline: '96h', cible2026: '72h', cible2027: '56h', cible2028: '48h', responsable: 'DEPPS', niveauRattachement: 'produit', nodeCode: 'P02-A01-PR01' },
  { code: 'IND-05', libelle: 'Nombre d\'agents formés', definition: 'Agents des administrations nationales ayant suivi une formation CEEAC', type: 'QUANTITATIF', unite: 'agents', source: 'DEPDHS / DRH', frequence: 'Annuel', baseline: '45', cible2026: '300', cible2027: '350', cible2028: '400', responsable: 'DEPDHS', niveauRattachement: 'activite', nodeCode: 'P03-A01-PR01-SP01-ACT01' },
  { code: 'IND-06', libelle: 'Taux de digitalisation des processus', definition: 'Part des processus administratifs CEEAC entièrement numérisés', type: 'QUANTITATIF', unite: '%', source: 'DSI', frequence: 'Semestriel', baseline: '45%', cible2026: '80%', cible2027: '90%', cible2028: '95%', responsable: 'DSI', niveauRattachement: 'produit', nodeCode: 'P04-A01-PR01' },
]
const AUDIT_INIT: AuditEntry[] = [
  { id: 'a1', date: '2026-09-12', heure: '14:32', utilisateur: 'M.C. Nkumu', role: 'DAF', exercice: '2026', version: 'v1.2', action: 'MODIFICATION', ancienneValeur: 'commentaire=""', nouvelleValeur: 'commentaire="Révision mi-parcours"', justification: 'Mise à jour après comité de pilotage' },
  { id: 'a2', date: '2026-09-05', heure: '09:15', utilisateur: 'F. Al-Rashid', role: 'RP', exercice: '2027', version: 'v0.4', action: 'CREATION_TACHE', ancienneValeur: '—', nouvelleValeur: 'P03-A01-PR01-SP01-ACT01-T05', justification: 'Ajout tâche rapport final' },
  { id: 'a3', date: '2026-09-01', heure: '11:00', utilisateur: 'E. Lissouba', role: 'CF', exercice: '2026', version: 'v1.2', action: 'SOUMISSION', ancienneValeur: 'statut=BROUILLON', nouvelleValeur: 'statut=SOUMISE', justification: 'Version prête pour vérification' },
  { id: 'a4', date: '2026-08-20', heure: '16:45', utilisateur: 'Dr. J-B. Ondaye', role: 'SG', exercice: '2026', version: 'v1.1', action: 'PUBLICATION', ancienneValeur: 'statut=VALIDEE', nouvelleValeur: 'statut=PUBLIEE', justification: 'Publication après conseil du SG' },
  { id: 'a5', date: '2026-07-15', heure: '10:20', utilisateur: 'M.C. Nkumu', role: 'DAF', exercice: '2026', version: 'v1.1', action: 'VALIDATION', ancienneValeur: 'statut=EN_VERIFICATION', nouvelleValeur: 'statut=VALIDEE', justification: 'Cohérence vérifiée — aucune anomalie bloquante' },
]

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const fmtM = (n: number) => (n / 1_000_000).toFixed(0) + ' M XAF'
const perfColor = (v: number) => v >= 80 ? '#16A34A' : v >= 60 ? '#D97706' : '#DC2626'

function StatusBadge({ statut }: { statut: string }) {
  const cfg = STATUT_ACT[statut] ?? { label: statut, bg: '#F1F5F9', color: '#475569' }
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}
function LevelBadge({ type }: { type: NodeType }) {
  const cfg = LEVEL_COLORS[type]
  return <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wide" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}
function ProgressBar({ value, h = 6 }: { value: number; h?: number }) {
  const c = perfColor(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full bg-slate-100 overflow-hidden" style={{ height: h }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, background: c }} />
      </div>
      <span className="font-mono font-bold text-[11.5px] w-9 text-right" style={{ color: c }}>{value}%</span>
    </div>
  )
}
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[60] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5">
      <CheckCircle size={15} className="text-green-400" />{msg}
      <button className="ml-2 text-slate-400 hover:text-white" onClick={onClose}><X size={13} /></button>
    </div>
  )
}
function FormField({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXERCICE BAR — 4 dimensions TOUJOURS SÉPARÉES
═══════════════════════════════════════════════════════ */
interface ExerciceBarProps {
  exercices: Exercice[]; versions: Version[]
  currentExerciceCode: string; currentVersionNum: string
  onSwitchExercice: (code: string) => void
  onWorkflow: (action: 'soumettre' | 'verifier' | 'valider' | 'publier', commentaire: string, dateEffet?: string) => void
  onReject: () => void; onRevision: () => void
  selectedNodeStatut?: NodeStatut
}
function ExerciceBar({ exercices, versions, currentExerciceCode, currentVersionNum, onSwitchExercice, onWorkflow, onReject, onRevision, selectedNodeStatut }: ExerciceBarProps) {
  const [showExDrop, setShowExDrop] = useState(false)
  const [showWorkflowModal, setShowWorkflowModal] = useState(false)
  const [workflowAction, setWorkflowAction] = useState<'soumettre' | 'verifier' | 'valider' | 'publier'>('soumettre')
  const [wfComment, setWfComment] = useState('')
  const [wfDateEffet, setWfDateEffet] = useState('')

  const ex = exercices.find(e => e.code === currentExerciceCode)
  const ver = versions.find(v => v.exerciceCode === currentExerciceCode && v.num === currentVersionNum)
  const exSt = ex ? EX_STATUT[ex.statut] : null
  const verSt = ver ? VER_STATUT[ver.statut] : null
  const appSt = ver ? APP_STATUT[ver.applicabilite] : null
  const nodeSt = selectedNodeStatut ? NODE_STATUT[selectedNodeStatut] : null

  const getWorkflowAction = (): { action: 'soumettre' | 'verifier' | 'valider' | 'publier'; label: string } | null => {
    if (!ver) return null
    if (ver.statut === 'BROUILLON' || ver.statut === 'RETOURNEE') return { action: 'soumettre', label: 'Soumettre' }
    if (ver.statut === 'SOUMISE') return { action: 'verifier', label: 'Mettre en vérification' }
    if (ver.statut === 'EN_VERIFICATION') return { action: 'valider', label: 'Valider' }
    if (ver.statut === 'VALIDEE') return { action: 'publier', label: 'Publier' }
    return null
  }
  const wfNext = getWorkflowAction()
  const canReturn = ver && (ver.statut === 'SOUMISE' || ver.statut === 'EN_VERIFICATION')

  const handleWf = () => {
    onWorkflow(workflowAction, wfComment, workflowAction === 'publier' ? wfDateEffet : undefined)
    setShowWorkflowModal(false); setWfComment(''); setWfDateEffet('')
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-200 flex-wrap" style={{ background: '#F8FAFD' }}>
        {/* Dimension 1 — Exercice */}
        <div className="flex items-center gap-1.5 relative">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Exercice</span>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-bold hover:bg-white transition-colors"
            style={{ borderColor: '#CBD5E1', color: '#0B1C3E', background: 'white' }}
            onClick={() => setShowExDrop(v => !v)}
          >
            {currentExerciceCode} <ChevronDown size={11} />
          </button>
          {exSt && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: exSt.bg, color: exSt.color }}>{exSt.label}</span>}
          {showExDrop && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowExDrop(false)} />
              <div className="absolute top-9 left-0 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-40 overflow-hidden">
                {exercices.map(e => {
                  const s = EX_STATUT[e.statut]
                  return (
                    <button key={e.code} className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 ${e.code === currentExerciceCode ? 'bg-navy-50' : ''}`}
                      onClick={() => { onSwitchExercice(e.code); setShowExDrop(false) }}>
                      <span className="font-semibold text-[13px] text-slate-800">{e.libelle}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Dimension 2 — Version */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Version</span>
          <span className="text-[12px] font-bold text-slate-700">{currentVersionNum}</span>
          {verSt && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: verSt.bg, color: verSt.color }}>{verSt.label}</span>}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Dimension 3 — Applicabilité */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Applicabilité</span>
          {appSt && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: appSt.bg, color: appSt.color }}>{appSt.label}</span>}
          {ver?.dateEffet && <span className="text-[10.5px] text-slate-500">à partir du {ver.dateEffet}</span>}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Dimension 4 — Nœud */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Nœud</span>
          {nodeSt
            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold" style={{ background: nodeSt.bg, color: nodeSt.color }}>{nodeSt.label}</span>
            : <span className="text-[10.5px] text-slate-400">—</span>}
        </div>

        {/* Workflow buttons */}
        <div className="ml-auto flex items-center gap-1.5">
          {canReturn && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-colors hover:bg-orange-50"
              style={{ borderColor: '#FED7AA', color: '#C2410C' }} onClick={onReject}>
              <ChevronLeft size={12} /> Retourner
            </button>
          )}
          {ver?.statut === 'PUBLIEE' && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-colors hover:bg-blue-50"
              style={{ borderColor: '#BFDBFE', color: '#1D4ED8' }} onClick={onRevision}>
              <RefreshCw size={12} /> Demander révision
            </button>
          )}
          {wfNext && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold text-white transition-all"
              style={{ background: wfNext.action === 'publier' ? '#15803D' : '#0B1C3E' }}
              onClick={() => { setWorkflowAction(wfNext.action); setShowWorkflowModal(true) }}>
              {wfNext.action === 'publier' ? <Globe size={12} /> : <Send size={12} />}
              {wfNext.label}
            </button>
          )}
        </div>
      </div>

      {/* Workflow modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl w-[440px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-[15px]">
                {workflowAction === 'soumettre' ? 'Soumettre la version' : workflowAction === 'verifier' ? 'Mettre en vérification' : workflowAction === 'valider' ? 'Valider la version' : 'Publier la version'}
              </h3>
              <button onClick={() => setShowWorkflowModal(false)}><X size={15} className="text-slate-400" /></button>
            </div>
            {/* Workflow steps */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-1 mb-5">
                {(['BROUILLON', 'SOUMISE', 'EN_VERIFICATION', 'VALIDEE', 'PUBLIEE'] as VersionStatut[]).map((s, i, arr) => {
                  const orderMap: Record<string, number> = { BROUILLON: 0, SOUMISE: 1, EN_VERIFICATION: 2, VALIDEE: 3, PUBLIEE: 4 }
                  const current = orderMap[ver?.statut ?? 'BROUILLON'] ?? 0
                  const stepIdx = i
                  const active = stepIdx === current
                  const done = stepIdx < current
                  const vs = VER_STATUT[s]
                  return (
                    <React.Fragment key={s}>
                      <div className={`flex flex-col items-center gap-0.5 ${active ? '' : done ? 'opacity-60' : 'opacity-30'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-slate-200 text-slate-500'}`}
                          style={active ? { background: '#0B1C3E' } : {}}>
                          {done ? <Check size={10} /> : i + 1}
                        </div>
                        <span className="text-[9px] text-slate-500 text-center w-16 leading-tight">{vs.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className={`flex-1 h-px mt-[-10px] ${done ? 'bg-green-400' : 'bg-slate-200'}`} />}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            <div className="px-6 pb-5 space-y-3">
              <div>
                <label className="form-label">Commentaire</label>
                <textarea className="form-input text-[13px] h-20 resize-none" placeholder="Motif ou commentaire..." value={wfComment} onChange={e => setWfComment(e.target.value)} />
              </div>
              {workflowAction === 'publier' && (
                <div>
                  <label className="form-label">Date d'effet <span className="text-red-500">*</span></label>
                  <input type="date" className="form-input text-[13px]" value={wfDateEffet} onChange={e => setWfDateEffet(e.target.value)} />
                </div>
              )}
              <div className="flex gap-2 justify-end pt-1">
                <button className="btn btn-outline btn-sm" onClick={() => setShowWorkflowModal(false)}>Annuler</button>
                <button className="btn btn-primary btn-sm" disabled={workflowAction === 'publier' && !wfDateEffet} onClick={handleWf}>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   CONTEXT MENU
═══════════════════════════════════════════════════════ */
interface CtxItem { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }
function ContextMenu({ items, onClose }: { items: CtxItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])
  return (
    <div ref={ref} className="absolute right-0 top-7 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden py-1">
      {items.map((item, i) => (
        <button key={i} className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[12.5px] transition-colors ${item.danger ? 'hover:bg-red-50 text-red-600' : 'hover:bg-slate-50 text-slate-700'}`}
          onClick={() => { item.onClick(); onClose() }}>
          <span className={item.danger ? 'text-red-400' : 'text-slate-400'}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CRUD MODALS
═══════════════════════════════════════════════════════ */

// Generic field helper
const inp = (v: string, onChange: (s: string) => void, placeholder = '') =>
  <input className="form-input text-[13px]" value={v} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
const area = (v: string, onChange: (s: string) => void, placeholder = '') =>
  <textarea className="form-input text-[13px] h-16 resize-none" value={v} onChange={e => onChange(e.target.value)} placeholder={placeholder} />

function PilierModal({ onClose, onSave, editing }: { onClose: () => void; onSave: (p: Omit<Pilier, 'code'> & { code?: string }) => void; editing: Pilier | null }) {
  const [form, setForm] = useState<Omit<Pilier, 'code'>>({
    libelle: editing?.libelle ?? '', color: editing?.color ?? '#0B1C3E',
    description: editing?.description ?? '', orientationStrategique: editing?.orientationStrategique ?? '',
    objectifGeneral: editing?.objectifGeneral ?? '', responsable: editing?.responsable ?? '',
    ordre: editing?.ordre ?? 1, nodeStatut: editing?.nodeStatut ?? 'ACTIF',
  })
  const s = (k: keyof typeof form) => (v: string | number) => setForm(prev => ({ ...prev, [k]: v }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[580px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-semibold text-[15px]">{editing ? 'Modifier le Pilier' : 'Nouveau Pilier'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Libellé" required><input className="form-input text-[13px]" value={form.libelle} onChange={e => s('libelle')(e.target.value)} /></FormField>
            <FormField label="Responsable" required><input className="form-input text-[13px]" value={form.responsable} onChange={e => s('responsable')(e.target.value)} /></FormField>
          </div>
          <FormField label="Description"><textarea className="form-input text-[13px] h-16 resize-none" value={form.description} onChange={e => s('description')(e.target.value)} /></FormField>
          <FormField label="Orientation stratégique"><input className="form-input text-[13px]" value={form.orientationStrategique} onChange={e => s('orientationStrategique')(e.target.value)} /></FormField>
          <FormField label="Objectif général"><input className="form-input text-[13px]" value={form.objectifGeneral} onChange={e => s('objectifGeneral')(e.target.value)} /></FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Couleur">
              <div className="flex items-center gap-2">
                <input type="color" className="w-10 h-9 rounded border border-slate-200 p-0.5 cursor-pointer" value={form.color} onChange={e => s('color')(e.target.value)} />
                <span className="text-[12px] text-slate-500">{form.color}</span>
              </div>
            </FormField>
            <FormField label="Ordre"><input type="number" className="form-input text-[13px]" value={form.ordre} onChange={e => s('ordre')(Number(e.target.value))} /></FormField>
            <FormField label="Statut nœud">
              <select className="form-input text-[13px]" value={form.nodeStatut} onChange={e => s('nodeStatut')(e.target.value)}>
                {Object.entries(NODE_STATUT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormField>
          </div>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim()} onClick={() => onSave({ ...form, code: editing?.code })}>
            {editing ? 'Modifier' : 'Créer le Pilier'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AxeModal({ piliers, parentCode, onClose, onSave, editing }: { piliers: Pilier[]; parentCode: string; onClose: () => void; onSave: (a: Omit<Axe, 'code'> & { code?: string }) => void; editing: Axe | null }) {
  const [form, setForm] = useState({ libelle: editing?.libelle ?? '', pilierCode: editing?.pilierCode ?? parentCode, description: editing?.description ?? '', responsable: editing?.responsable ?? '', objectif: editing?.objectif ?? '', nodeStatut: (editing?.nodeStatut ?? 'ACTIF') as NodeStatut })
  const s = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-[15px]">{editing ? 'Modifier l\'Axe' : 'Nouvel Axe'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <FormField label="Pilier parent" required>
            <select className="form-input text-[13px]" value={form.pilierCode} onChange={e => s('pilierCode')(e.target.value)}>
              {piliers.map(p => <option key={p.code} value={p.code}>{p.code} — {p.libelle}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Libellé" required>{inp(form.libelle, s('libelle'))}</FormField>
            <FormField label="Responsable">{inp(form.responsable, s('responsable'))}</FormField>
          </div>
          <FormField label="Objectif">{inp(form.objectif, s('objectif'))}</FormField>
          <FormField label="Description">{area(form.description, s('description'))}</FormField>
          <FormField label="Statut nœud">
            <select className="form-input text-[13px]" value={form.nodeStatut} onChange={e => s('nodeStatut')(e.target.value)}>
              {Object.entries(NODE_STATUT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </FormField>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim() || !form.pilierCode} onClick={() => onSave({ ...form, code: editing?.code })}>
            {editing ? 'Modifier' : 'Créer l\'Axe'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ProduitModal({ axes, parentCode, onClose, onSave, editing }: { axes: Axe[]; parentCode: string; onClose: () => void; onSave: (p: Omit<Produit, 'code'> & { code?: string }) => void; editing: Produit | null }) {
  const [form, setForm] = useState({ libelle: editing?.libelle ?? '', axeCode: editing?.axeCode ?? parentCode, description: editing?.description ?? '', indicateur: editing?.indicateur ?? '', responsable: editing?.responsable ?? '', resultatAttendu: editing?.resultatAttendu ?? '', nodeStatut: (editing?.nodeStatut ?? 'ACTIF') as NodeStatut })
  const s = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-[15px]">{editing ? 'Modifier le Produit' : 'Nouveau Produit'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <FormField label="Axe parent" required>
            <select className="form-input text-[13px]" value={form.axeCode} onChange={e => s('axeCode')(e.target.value)}>
              {axes.map(a => <option key={a.code} value={a.code}>{a.code} — {a.libelle}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Libellé" required>{inp(form.libelle, s('libelle'))}</FormField>
            <FormField label="Responsable">{inp(form.responsable, s('responsable'))}</FormField>
          </div>
          <FormField label="Résultat attendu">{inp(form.resultatAttendu, s('resultatAttendu'))}</FormField>
          <FormField label="Indicateur principal">{inp(form.indicateur, s('indicateur'))}</FormField>
          <FormField label="Description">{area(form.description, s('description'))}</FormField>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim()} onClick={() => onSave({ ...form, code: editing?.code })}>
            {editing ? 'Modifier' : 'Créer le Produit'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SousProduitModal({ produits, parentCode, onClose, onSave, editing }: { produits: Produit[]; parentCode: string; onClose: () => void; onSave: (sp: Omit<SousProduit, 'code'> & { code?: string }) => void; editing: SousProduit | null }) {
  const [form, setForm] = useState({ libelle: editing?.libelle ?? '', produitCode: editing?.produitCode ?? parentCode, description: editing?.description ?? '', responsable: editing?.responsable ?? '', resultatAttendu: editing?.resultatAttendu ?? '', nodeStatut: (editing?.nodeStatut ?? 'ACTIF') as NodeStatut })
  const s = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-[15px]">{editing ? 'Modifier le Sous-Produit' : 'Nouveau Sous-Produit'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <FormField label="Produit parent" required>
            <select className="form-input text-[13px]" value={form.produitCode} onChange={e => s('produitCode')(e.target.value)}>
              {produits.map(p => <option key={p.code} value={p.code}>{p.code} — {p.libelle}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Libellé" required>{inp(form.libelle, s('libelle'))}</FormField>
            <FormField label="Responsable">{inp(form.responsable, s('responsable'))}</FormField>
          </div>
          <FormField label="Résultat attendu">{inp(form.resultatAttendu, s('resultatAttendu'))}</FormField>
          <FormField label="Description">{area(form.description, s('description'))}</FormField>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim()} onClick={() => onSave({ ...form, code: editing?.code })}>
            {editing ? 'Modifier' : 'Créer le Sous-Produit'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActiviteModal({ sousProduits, parentCode, onClose, onSave, editing }: { sousProduits: SousProduit[]; parentCode: string; onClose: () => void; onSave: (a: Omit<Activite, 'code'> & { code?: string }) => void; editing: Activite | null }) {
  const [form, setForm] = useState({
    libelle: editing?.libelle ?? '', sousProduitCode: editing?.sousProduitCode ?? parentCode,
    description: editing?.description ?? '', responsable: editing?.responsable ?? '',
    structure: editing?.structure ?? '', debut: editing?.debut ?? '', fin: editing?.fin ?? '',
    budget: editing?.budget ?? 0, priorite: (editing?.priorite ?? 'NORMALE') as Activite['priorite'],
    statut: (editing?.statut ?? 'NON_DEMARREE') as Activite['statut'],
    resultatAttendu: editing?.resultatAttendu ?? '', observations: editing?.observations ?? '',
    nodeStatut: (editing?.nodeStatut ?? 'ACTIF') as NodeStatut,
  })
  const s = (k: keyof typeof form) => (v: string | number) => setForm(p => ({ ...p, [k]: v }))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[600px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-semibold text-[15px]">{editing ? "Modifier l'Activité" : 'Nouvelle Activité'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          <FormField label="Sous-Produit parent" required>
            <select className="form-input text-[13px]" value={form.sousProduitCode} onChange={e => s('sousProduitCode')(e.target.value)}>
              {sousProduits.map(sp => <option key={sp.code} value={sp.code}>{sp.code} — {sp.libelle}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Libellé" required>{inp(form.libelle, v => s('libelle')(v))}</FormField>
            <FormField label="Structure responsable">{inp(form.structure, v => s('structure')(v))}</FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Responsable">{inp(form.responsable, v => s('responsable')(v))}</FormField>
            <FormField label="Budget prévisionnel (XAF)"><input type="number" className="form-input text-[13px]" value={form.budget} onChange={e => s('budget')(Number(e.target.value))} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date début">{inp(form.debut, v => s('debut')(v), 'AAAA-MM-JJ')}</FormField>
            <FormField label="Date fin">{inp(form.fin, v => s('fin')(v), 'AAAA-MM-JJ')}</FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priorité">
              <select className="form-input text-[13px]" value={form.priorite} onChange={e => s('priorite')(e.target.value)}>
                {Object.entries(PRIOR).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormField>
            <FormField label="Statut">
              <select className="form-input text-[13px]" value={form.statut} onChange={e => s('statut')(e.target.value)}>
                {Object.entries(STATUT_ACT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Résultat attendu">{inp(form.resultatAttendu, v => s('resultatAttendu')(v))}</FormField>
          <FormField label="Description">{area(form.description, v => s('description')(v))}</FormField>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim()} onClick={() => onSave({ ...form, code: editing?.code })}>
            {editing ? "Modifier" : "Créer l'Activité"}
          </button>
        </div>
      </div>
    </div>
  )
}

function TacheModal({ activites, parentCode, onClose, onSave, editing, taches }: {
  activites: Activite[]; parentCode: string; onClose: () => void; taches: Tache[]
  onSave: (t: Omit<Tache, 'code' | 'activiteCode' | 'hasHistory'>, actCode: string) => void; editing: Tache | null
}) {
  const [actCode, setActCode] = useState(editing?.activiteCode ?? parentCode)
  const [form, setForm] = useState({
    libelle: editing?.libelle ?? '', description: editing?.description ?? '',
    responsable: editing?.responsable ?? '', structure: editing?.structure ?? '',
    debut: editing?.debut ?? '', fin: editing?.fin ?? '',
    priorite: (editing?.priorite ?? 'NORMALE') as Tache['priorite'],
    statut: (editing?.statut ?? 'NON_DEMARREE') as Tache['statut'],
    poids: editing?.poids ?? 0, avancement: editing?.avancement ?? 0,
    cout: editing?.cout ?? 0, indicateur: editing?.indicateur ?? '',
    resultatAttendu: editing?.resultatAttendu ?? '', observations: editing?.observations ?? '',
    retardJours: editing?.retardJours ?? 0, nodeStatut: (editing?.nodeStatut ?? 'ACTIF') as NodeStatut,
  })
  const s = (k: keyof typeof form) => (v: string | number) => setForm(p => ({ ...p, [k]: v }))
  const existingPoids = taches.filter(t => t.activiteCode === actCode && t.code !== editing?.code).reduce((s, t) => s + t.poids, 0)
  const totalPoids = existingPoids + form.poids
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[600px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-semibold text-[15px]">{editing ? 'Modifier la Tâche' : 'Nouvelle Tâche'}</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          <FormField label="Activité parente" required>
            <select className="form-input text-[13px]" value={actCode} onChange={e => setActCode(e.target.value)}>
              {activites.map(a => <option key={a.code} value={a.code}>{a.code.split('-ACT')[1] ? `ACT${a.code.split('-ACT')[1]}` : a.code} — {a.libelle.substring(0, 50)}</option>)}
            </select>
          </FormField>
          <FormField label="Libellé" required>{inp(form.libelle, v => s('libelle')(v))}</FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Responsable">{inp(form.responsable, v => s('responsable')(v))}</FormField>
            <FormField label="Structure">{inp(form.structure, v => s('structure')(v))}</FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date début">{inp(form.debut, v => s('debut')(v))}</FormField>
            <FormField label="Date fin">{inp(form.fin, v => s('fin')(v))}</FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label={`Poids (%) — Total: ${totalPoids}%`}>
              <div className="space-y-1">
                <input type="number" min={0} max={100} className={`form-input text-[13px] ${totalPoids > 100 ? 'border-red-400' : ''}`} value={form.poids} onChange={e => s('poids')(Number(e.target.value))} />
                {totalPoids > 100 && <p className="text-[10.5px] text-red-500">Total dépasse 100%</p>}
              </div>
            </FormField>
            <FormField label="Avancement (%)"><input type="number" min={0} max={100} className="form-input text-[13px]" value={form.avancement} onChange={e => s('avancement')(Number(e.target.value))} /></FormField>
            <FormField label="Coût estimatif (XAF)"><input type="number" className="form-input text-[13px]" value={form.cout} onChange={e => s('cout')(Number(e.target.value))} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priorité">
              <select className="form-input text-[13px]" value={form.priorite} onChange={e => s('priorite')(e.target.value)}>
                {Object.entries(PRIOR).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormField>
            <FormField label="Statut">
              <select className="form-input text-[13px]" value={form.statut} onChange={e => s('statut')(e.target.value)}>
                {Object.entries(STATUT_ACT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Indicateur associé">{inp(form.indicateur, v => s('indicateur')(v))}</FormField>
          <FormField label="Résultat attendu">{inp(form.resultatAttendu, v => s('resultatAttendu')(v))}</FormField>
          <FormField label="Description">{area(form.description, v => s('description')(v))}</FormField>
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!form.libelle.trim() || totalPoids > 100} onClick={() => onSave(form, actCode)}>
            {editing ? 'Modifier' : 'Créer la Tâche'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EXERCICE INIT MODAL
═══════════════════════════════════════════════════════ */
function ExerciceInitModal({ existingCodes, onClose, onSave }: { existingCodes: string[]; onClose: () => void; onSave: (ex: Exercice) => void }) {
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'vide' | 'reprise' | 'selectif'>('vide')
  const [sourceEx, setSourceEx] = useState(existingCodes[0] ?? '')
  const err = existingCodes.includes(code)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-[15px]">Initialiser un nouvel exercice</h3>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Code exercice (AAAA)" required>
              <input className={`form-input text-[13px] ${err ? 'border-red-400' : ''}`} placeholder="2028" value={code} onChange={e => setCode(e.target.value)} />
              {err && <p className="text-[11px] text-red-500 mt-0.5">Code déjà utilisé</p>}
            </FormField>
          </div>
          <div>
            <label className="form-label">Mode d'initialisation</label>
            <div className="space-y-2 mt-1">
              {([
                { id: 'vide',     icon: <Plus size={14} />,       title: 'Chaîne vide',            desc: 'Partir d\'une structure vierge' },
                { id: 'reprise',  icon: <Copy size={14} />,       title: 'Reprendre l\'exercice précédent', desc: `Copier toute la structure de ${sourceEx}` },
                { id: 'selectif', icon: <CheckSquare size={14} />, title: 'Reprise sélective',      desc: 'Choisir les nœuds à reprendre' },
              ] as const).map(opt => (
                <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${mode === opt.id ? 'border-navy-700 bg-navy-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="mode" value={opt.id} checked={mode === opt.id} onChange={() => setMode(opt.id)} className="mt-1" />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-slate-500">{opt.icon}</span>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800">{opt.title}</div>
                      <div className="text-[11.5px] text-slate-500">{opt.desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {(mode === 'reprise' || mode === 'selectif') && (
            <FormField label="Exercice source">
              <select className="form-input text-[13px]" value={sourceEx} onChange={e => setSourceEx(e.target.value)}>
                {existingCodes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          )}
        </div>
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-slate-100">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-sm" disabled={!code.trim() || err} onClick={() => onSave({
            code, libelle: `Exercice ${code}`, statut: 'A_PREPARER',
            dateDebut: `${code}-01-01`, dateFin: `${code}-12-31`,
            versionActive: null, versionBrouillon: null, nbPiliers: 0, lastModif: null, responsable: '—',
          })}>
            Initialiser l'exercice
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
interface Props { onNavigate: (page: Page, id?: string) => void }
type Selected = { type: NodeType; code: string } | null

export default function Planification({ onNavigate: _onNavigate }: Props) {
  /* ── state ─────────────────────────────────────── */
  const [exercices, setExercices] = useState<Exercice[]>(EXERCICES_INIT)
  const [versions, setVersions] = useState<Version[]>(VERSIONS_INIT)
  const [piliers, setPiliers] = useState<Pilier[]>(PILIERS_INIT)
  const [axes, setAxes] = useState<Axe[]>(AXES_INIT)
  const [produits, setProduits] = useState<Produit[]>(PRODUITS_INIT)
  const [sousProduits, setSousProduits] = useState<SousProduit[]>(SOUS_PRODUITS_INIT)
  const [activites, setActivites] = useState<Activite[]>(ACTIVITES_INIT)
  const [taches, setTaches] = useState<Tache[]>(TACHES_INIT)
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>(INDICATEURS_INIT)
  const [auditLog] = useState<AuditEntry[]>(AUDIT_INIT)

  const [currentExerciceCode, setCurrentExerciceCode] = useState('2026')
  const [currentVersionNum, setCurrentVersionNum] = useState('v1.2')
  const [mainView, setMainView] = useState<MainView>('dashboard')
  const [selected, setSelected] = useState<Selected>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['P01', 'P01-A02', 'P01-A02-PR01', 'P01-A02-PR01-SP01']))
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState<NodeType | 'ALL'>('ALL')
  const [filterStatut, setFilterStatut] = useState('ALL')
  const [toast, setToast] = useState<string | null>(null)
  const [ctxMenu, setCtxMenu] = useState<{ code: string; type: NodeType } | null>(null)
  const [wizardStep, setWizardStep] = useState(0)

  // Modals
  const [pilierModal, setPilierModal] = useState<{ open: boolean; editing: Pilier | null }>({ open: false, editing: null })
  const [axeModal, setAxeModal] = useState<{ open: boolean; editing: Axe | null; parentCode: string }>({ open: false, editing: null, parentCode: '' })
  const [produitModal, setProduitModal] = useState<{ open: boolean; editing: Produit | null; parentCode: string }>({ open: false, editing: null, parentCode: '' })
  const [spModal, setSpModal] = useState<{ open: boolean; editing: SousProduit | null; parentCode: string }>({ open: false, editing: null, parentCode: '' })
  const [actModal, setActModal] = useState<{ open: boolean; editing: Activite | null; parentCode: string }>({ open: false, editing: null, parentCode: '' })
  const [tacheModal, setTacheModal] = useState<{ open: boolean; editing: Tache | null; parentCode: string }>({ open: false, editing: null, parentCode: '' })
  const [showExerciceInit, setShowExerciceInit] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const toggle = (id: string) => setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  /* ── workflow ──────────────────────────────────── */
  const handleWorkflow = (action: 'soumettre' | 'verifier' | 'valider' | 'publier', commentaire: string, dateEffet?: string) => {
    const nextStatut: Record<typeof action, VersionStatut> = { soumettre: 'SOUMISE', verifier: 'EN_VERIFICATION', valider: 'VALIDEE', publier: 'PUBLIEE' }
    const msgs = { soumettre: 'Version soumise ✓', verifier: 'Mise en vérification ✓', valider: 'Version validée ✓', publier: 'Version publiée ✓' }
    setVersions(prev => prev.map(v =>
      v.exerciceCode === currentExerciceCode && v.num === currentVersionNum
        ? { ...v, statut: nextStatut[action], commentaire: commentaire || v.commentaire, dateEffet: dateEffet ?? v.dateEffet, applicabilite: action === 'publier' ? 'ACTIVE' : v.applicabilite, datePublication: action === 'publier' ? new Date().toISOString().slice(0, 10) : v.datePublication }
        : v
    ))
    showToast(msgs[action])
  }
  const handleReject = () => {
    setVersions(prev => prev.map(v => v.exerciceCode === currentExerciceCode && v.num === currentVersionNum ? { ...v, statut: 'RETOURNEE', commentaire: 'Retournée pour correction' } : v))
    showToast('Version retournée pour correction ✓')
  }
  const handleRevision = () => {
    const exVers = versions.filter(v => v.exerciceCode === currentExerciceCode && v.num.startsWith('v'))
    const latestNum = exVers.map(v => parseFloat(v.num.replace('v', ''))).reduce((a, b) => Math.max(a, b), 0)
    const newNum = `v${(latestNum + 0.1).toFixed(1)}`
    setVersions(prev => [
      ...prev.map(v => v.exerciceCode === currentExerciceCode && v.num === currentVersionNum ? { ...v, statut: 'REMPLACEE' as VersionStatut, applicabilite: 'HISTORIQUE' as Applicabilite } : v),
      { num: newNum, exerciceCode: currentExerciceCode, statut: 'BROUILLON', dateCreation: new Date().toISOString().slice(0, 10), datePublication: null, dateEffet: null, auteur: 'Utilisateur courant', motif: 'Révision demandée', commentaire: '', applicabilite: 'NA' },
    ])
    setCurrentVersionNum(newNum)
    showToast(`Version ${newNum} créée en brouillon ✓`)
  }

  const switchExercice = (code: string) => {
    setCurrentExerciceCode(code)
    const ex = exercices.find(e => e.code === code)
    const activeV = ex?.versionActive ?? ex?.versionBrouillon
    if (activeV) setCurrentVersionNum(activeV)
    showToast(`Exercice ${code} sélectionné`)
  }

  /* ── node CRUD ─────────────────────────────────── */
  const getNextCode = (prefix: string, siblings: { code: string }[], suffix: string) => {
    const nums = siblings.map(s => parseInt(s.code.replace(prefix + suffix, '').replace(suffix, ''), 10)).filter(n => !isNaN(n))
    const next = nums.length ? Math.max(...nums) + 1 : 1
    return `${prefix}${suffix}${String(next).padStart(2, '0')}`
  }

  const savePilier = (form: Omit<Pilier, 'code'> & { code?: string }) => {
    if (form.code) {
      setPiliers(prev => prev.map(p => p.code === form.code ? { ...p, ...form, code: p.code } : p))
      showToast('Pilier modifié ✓')
    } else {
      const code = getNextCode('P', piliers, '')
      setPiliers(prev => [...prev, { ...form, code }])
      showToast(`Pilier ${code} créé ✓`)
    }
    setPilierModal({ open: false, editing: null })
  }
  const saveAxe = (form: Omit<Axe, 'code'> & { code?: string }) => {
    if (form.code) {
      setAxes(prev => prev.map(a => a.code === form.code ? { ...a, ...form, code: a.code } : a))
      showToast('Axe modifié ✓')
    } else {
      const siblings = axes.filter(a => a.pilierCode === form.pilierCode)
      const code = getNextCode(`${form.pilierCode}-A`, siblings, '')
      setAxes(prev => [...prev, { ...form, code }])
      showToast(`Axe ${code} créé ✓`)
    }
    setAxeModal({ open: false, editing: null, parentCode: '' })
  }
  const saveProduit = (form: Omit<Produit, 'code'> & { code?: string }) => {
    if (form.code) {
      setProduits(prev => prev.map(p => p.code === form.code ? { ...p, ...form, code: p.code } : p))
      showToast('Produit modifié ✓')
    } else {
      const siblings = produits.filter(p => p.axeCode === form.axeCode)
      const code = getNextCode(`${form.axeCode}-PR`, siblings, '')
      setProduits(prev => [...prev, { ...form, code }])
      showToast(`Produit ${code} créé ✓`)
    }
    setProduitModal({ open: false, editing: null, parentCode: '' })
  }
  const saveSousProduit = (form: Omit<SousProduit, 'code'> & { code?: string }) => {
    if (form.code) {
      setSousProduits(prev => prev.map(sp => sp.code === form.code ? { ...sp, ...form, code: sp.code } : sp))
      showToast('Sous-Produit modifié ✓')
    } else {
      const siblings = sousProduits.filter(sp => sp.produitCode === form.produitCode)
      const code = getNextCode(`${form.produitCode}-SP`, siblings, '')
      setSousProduits(prev => [...prev, { ...form, code }])
      showToast(`Sous-Produit ${code} créé ✓`)
    }
    setSpModal({ open: false, editing: null, parentCode: '' })
  }
  const saveActivite = (form: Omit<Activite, 'code'> & { code?: string }) => {
    if (form.code) {
      setActivites(prev => prev.map(a => a.code === form.code ? { ...a, ...form, code: a.code } : a))
      showToast('Activité modifiée ✓')
    } else {
      const siblings = activites.filter(a => a.sousProduitCode === form.sousProduitCode)
      const code = getNextCode(`${form.sousProduitCode}-ACT`, siblings, '')
      setActivites(prev => [...prev, { ...form, code }])
      showToast(`Activité ${code} créée ✓`)
    }
    setActModal({ open: false, editing: null, parentCode: '' })
  }
  const saveTache = (form: Omit<Tache, 'code' | 'activiteCode' | 'hasHistory'>, actCode: string) => {
    if (tacheModal.editing) {
      setTaches(prev => prev.map(t => t.code === tacheModal.editing!.code ? { ...t, ...form, activiteCode: actCode, hasHistory: true } : t))
      showToast('Tâche modifiée ✓')
    } else {
      const siblings = taches.filter(t => t.activiteCode === actCode)
      const num = String(siblings.length + 1).padStart(2, '0')
      setTaches(prev => [...prev, { ...form, code: `${actCode}-T${num}`, activiteCode: actCode, hasHistory: false }])
      showToast('Tâche créée ✓')
    }
    setTacheModal({ open: false, editing: null, parentCode: '' })
  }

  /* ── aggregation ───────────────────────────────── */
  const getActAvancement = (actCode: string) => {
    const t = taches.filter(t => t.activiteCode === actCode)
    if (!t.length) return 0
    const totalPoids = t.reduce((s, x) => s + x.poids, 0)
    if (totalPoids === 0) return 0
    return Math.round(t.reduce((s, x) => s + x.avancement * x.poids / 100, 0) * 100 / totalPoids)
  }

  /* ── context menu items ────────────────────────── */
  const getCtxItems = (type: NodeType, code: string): CtxItem[] => {
    const base: CtxItem[] = [
      { label: 'Voir le détail', icon: <Eye size={13} />, onClick: () => setSelected({ type, code }) },
    ]
    if (type === 'pilier') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const p = piliers.find(x => x.code === code)!; setPilierModal({ open: true, editing: p }) } },
      { label: '+ Nouvel Axe', icon: <Plus size={13} />, onClick: () => setAxeModal({ open: true, editing: null, parentCode: code }) },
      { label: 'Désactiver', icon: <Power size={13} />, onClick: () => { setPiliers(prev => prev.map(p => p.code === code ? { ...p, nodeStatut: 'DESACTIVE' } : p)); showToast('Pilier désactivé ✓') }, danger: true },
    ]
    if (type === 'axe') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const a = axes.find(x => x.code === code)!; setAxeModal({ open: true, editing: a, parentCode: a.pilierCode }) } },
      { label: '+ Nouveau Produit', icon: <Plus size={13} />, onClick: () => setProduitModal({ open: true, editing: null, parentCode: code }) },
      { label: 'Désactiver', icon: <Power size={13} />, onClick: () => { setAxes(prev => prev.map(a => a.code === code ? { ...a, nodeStatut: 'DESACTIVE' } : a)); showToast('Axe désactivé ✓') }, danger: true },
    ]
    if (type === 'produit') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const p = produits.find(x => x.code === code)!; setProduitModal({ open: true, editing: p, parentCode: p.axeCode }) } },
      { label: '+ Nouveau Sous-Produit', icon: <Plus size={13} />, onClick: () => setSpModal({ open: true, editing: null, parentCode: code }) },
    ]
    if (type === 'sous-produit') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const sp = sousProduits.find(x => x.code === code)!; setSpModal({ open: true, editing: sp, parentCode: sp.produitCode }) } },
      { label: '+ Nouvelle Activité', icon: <Plus size={13} />, onClick: () => setActModal({ open: true, editing: null, parentCode: code }) },
    ]
    if (type === 'activite') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const a = activites.find(x => x.code === code)!; setActModal({ open: true, editing: a, parentCode: a.sousProduitCode }) } },
      { label: '+ Nouvelle Tâche', icon: <Plus size={13} />, onClick: () => setTacheModal({ open: true, editing: null, parentCode: code }) },
      { label: 'Dupliquer', icon: <Copy size={13} />, onClick: () => { const a = activites.find(x => x.code === code)!; saveActivite({ ...a, libelle: `${a.libelle} (copie)`, code: undefined }) } },
    ]
    if (type === 'tache') return [...base,
      { label: 'Modifier', icon: <Edit3 size={13} />, onClick: () => { const t = taches.find(x => x.code === code)!; setTacheModal({ open: true, editing: t, parentCode: t.activiteCode }) } },
      { label: 'Dupliquer', icon: <Copy size={13} />, onClick: () => { const t = taches.find(x => x.code === code)!; const siblings = taches.filter(x => x.activiteCode === t.activiteCode); const num = String(siblings.length + 1).padStart(2, '0'); setTaches(prev => [...prev, { ...t, code: `${t.activiteCode}-T${num}`, libelle: `${t.libelle} (copie)`, hasHistory: false }]); showToast('Tâche dupliquée ✓') } },
      { label: 'Supprimer', icon: <Trash2 size={13} />, onClick: () => { setTaches(prev => prev.filter(t => t.code !== code)); showToast('Tâche supprimée ✓') }, danger: true },
    ]
    return base
  }

  /* ── score de complétude ───────────────────────── */
  const completenessScore = useMemo(() => {
    const totalAct = activites.length
    const actWithTaches = activites.filter(a => taches.some(t => t.activiteCode === a.code)).length
    const actWithDates = activites.filter(a => a.debut && a.fin).length
    const actWithResp = activites.filter(a => a.responsable).length
    const nodesWithInd = activites.filter(a => taches.some(t => t.activiteCode === a.code && t.indicateur)).length
    const actPoidsCohrent = activites.filter(a => {
      const sum = taches.filter(t => t.activiteCode === a.code).reduce((s, t) => s + t.poids, 0)
      return sum === 100
    }).length
    return {
      structure: totalAct > 0 ? Math.round(actWithTaches / totalAct * 100) : 0,
      responsables: totalAct > 0 ? Math.round(actWithResp / totalAct * 100) : 0,
      indicateurs: totalAct > 0 ? Math.round(nodesWithInd / totalAct * 100) : 0,
      planning: totalAct > 0 ? Math.round(actWithDates / totalAct * 100) : 0,
      taches: totalAct > 0 ? Math.round(actPoidsCohrent / totalAct * 100) : 0,
    }
  }, [activites, taches])

  const globalScore = Math.round(Object.values(completenessScore).reduce((s, v) => s + v, 0) / 5)

  /* ── flat table data ───────────────────────────── */
  const allNodes = useMemo(() => {
    const rows: { code: string; type: NodeType; libelle: string; parent: string; responsable: string; statut: string; nodeStatut: NodeStatut; enfants: number }[] = []
    piliers.forEach(p => rows.push({ code: p.code, type: 'pilier', libelle: p.libelle, parent: '—', responsable: p.responsable, statut: '—', nodeStatut: p.nodeStatut, enfants: axes.filter(a => a.pilierCode === p.code).length }))
    axes.forEach(a => rows.push({ code: a.code, type: 'axe', libelle: a.libelle, parent: a.pilierCode, responsable: a.responsable, statut: '—', nodeStatut: a.nodeStatut, enfants: produits.filter(p => p.axeCode === a.code).length }))
    produits.forEach(p => rows.push({ code: p.code, type: 'produit', libelle: p.libelle, parent: p.axeCode, responsable: p.responsable, statut: '—', nodeStatut: p.nodeStatut, enfants: sousProduits.filter(sp => sp.produitCode === p.code).length }))
    sousProduits.forEach(sp => rows.push({ code: sp.code, type: 'sous-produit', libelle: sp.libelle, parent: sp.produitCode, responsable: sp.responsable, statut: '—', nodeStatut: sp.nodeStatut, enfants: activites.filter(a => a.sousProduitCode === sp.code).length }))
    activites.forEach(a => rows.push({ code: a.code, type: 'activite', libelle: a.libelle, parent: a.sousProduitCode, responsable: a.responsable, statut: a.statut, nodeStatut: a.nodeStatut, enfants: taches.filter(t => t.activiteCode === a.code).length }))
    taches.forEach(t => rows.push({ code: t.code, type: 'tache', libelle: t.libelle, parent: t.activiteCode, responsable: t.responsable, statut: t.statut, nodeStatut: t.nodeStatut, enfants: 0 }))
    return rows
  }, [piliers, axes, produits, sousProduits, activites, taches])

  const filteredNodes = useMemo(() => allNodes.filter(n => {
    if (filterLevel !== 'ALL' && n.type !== filterLevel) return false
    if (filterStatut !== 'ALL' && n.statut !== filterStatut) return false
    if (search && !n.libelle.toLowerCase().includes(search.toLowerCase()) && !n.code.toLowerCase().includes(search.toLowerCase()) && !n.responsable.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [allNodes, filterLevel, filterStatut, search])

  /* ── coherence checks ──────────────────────────── */
  const coherenceChecks = useMemo(() => {
    const checks: { label: string; statut: 'OK' | 'WARN' | 'ERR'; detail: string }[] = []
    const actSansTaches = activites.filter(a => !taches.some(t => t.activiteCode === a.code))
    checks.push({ label: 'Codes uniques', statut: 'OK', detail: 'Tous les codes sont uniques dans la structure.' })
    checks.push({ label: 'Intégrité hiérarchique', statut: 'OK', detail: 'Aucun nœud orphelin détecté.' })
    checks.push({ label: 'Activités sans tâches', statut: actSansTaches.length ? 'WARN' : 'OK', detail: actSansTaches.length ? `${actSansTaches.length} activité(s) sans tâche : ${actSansTaches.slice(0, 2).map(a => a.code).join(', ')}` : 'Toutes les activités ont au moins une tâche.' })
    const badPoids = activites.filter(a => { const s = taches.filter(t => t.activiteCode === a.code).reduce((x, t) => x + t.poids, 0); return s > 0 && s !== 100 })
    checks.push({ label: 'Pondérations des tâches = 100%', statut: badPoids.length ? 'ERR' : 'OK', detail: badPoids.length ? `Anomalie sur : ${badPoids.map(a => a.code).join(', ')}` : 'Toutes les pondérations totalisent 100%.' })
    const noResp = activites.filter(a => !a.responsable).length
    checks.push({ label: 'Responsables renseignés', statut: noResp ? 'WARN' : 'OK', detail: noResp ? `${noResp} activité(s) sans responsable.` : 'Tous les responsables sont renseignés.' })
    const noDates = activites.filter(a => !a.debut || !a.fin).length
    checks.push({ label: 'Périodes cohérentes', statut: noDates ? 'WARN' : 'OK', detail: noDates ? `${noDates} activité(s) sans dates.` : 'Toutes les dates sont renseignées.' })
    const verCurrent = versions.find(v => v.exerciceCode === currentExerciceCode && v.num === currentVersionNum)
    checks.push({ label: 'Version valide pour publication', statut: verCurrent?.statut === 'VALIDEE' ? 'OK' : 'WARN', detail: verCurrent?.statut === 'VALIDEE' ? 'Version validée, prête à publier.' : `Statut actuel : ${verCurrent ? VER_STATUT[verCurrent.statut].label : '?'}` })
    return checks
  }, [activites, taches, versions, currentExerciceCode, currentVersionNum])

  const hasBlockingError = coherenceChecks.some(c => c.statut === 'ERR')

  /* ── SELECTED NODE STATUT ──────────────────────── */
  const selectedNodeStatut: NodeStatut | undefined = useMemo(() => {
    if (!selected) return undefined
    if (selected.type === 'pilier') return piliers.find(p => p.code === selected.code)?.nodeStatut
    if (selected.type === 'axe') return axes.find(a => a.code === selected.code)?.nodeStatut
    if (selected.type === 'produit') return produits.find(p => p.code === selected.code)?.nodeStatut
    if (selected.type === 'sous-produit') return sousProduits.find(sp => sp.code === selected.code)?.nodeStatut
    if (selected.type === 'activite') return activites.find(a => a.code === selected.code)?.nodeStatut
    if (selected.type === 'tache') return taches.find(t => t.code === selected.code)?.nodeStatut
    return undefined
  }, [selected, piliers, axes, produits, sousProduits, activites, taches])

  /* ═══════════════════════════════════════════════
     TREE NODES
  ═══════════════════════════════════════════════ */
  const TreeNode = ({ code, type, label, level, children, badge }: { code: string; type: NodeType; label: string; level: number; children?: React.ReactNode; badge?: React.ReactNode }) => {
    const isOpen = expanded.has(code)
    const isSel = selected?.code === code
    const hasCtx = ctxMenu?.code === code
    const lc = LEVEL_COLORS[type]
    const indent = level * 16

    return (
      <div>
        <div className={`flex items-center gap-1.5 py-2 px-2 rounded-lg cursor-pointer transition-colors group relative ${isSel ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
          style={{ marginLeft: indent }}
          onClick={() => { if (children) toggle(code); setSelected({ type, code }) }}>
          {children
            ? <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isSel ? 'bg-white/20' : 'bg-slate-200'}`}>
                {isOpen ? <ChevronDown size={10} className={isSel ? 'text-white' : 'text-slate-500'} /> : <ChevronRight size={10} className={isSel ? 'text-white' : 'text-slate-500'} />}
              </div>
            : <div className="w-2 h-2 rounded-full flex-shrink-0 ml-1 mr-0.5" style={{ background: isSel ? '#86EFAC' : lc.color }} />}
          <span className={`flex-1 text-[12px] font-medium leading-snug min-w-0 truncate ${isSel ? 'text-white' : 'text-slate-700'}`}>{label}</span>
          {badge}
          <div className="relative flex-shrink-0">
            <button
              className={`w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isSel ? 'hover:bg-white/20 text-white/70' : 'hover:bg-slate-200 text-slate-400'}`}
              onClick={e => { e.stopPropagation(); setCtxMenu(hasCtx ? null : { code, type }) }}
            >
              <MoreVertical size={12} />
            </button>
            {hasCtx && <ContextMenu items={getCtxItems(type, code)} onClose={() => setCtxMenu(null)} />}
          </div>
        </div>
        {children && isOpen && (
          <div className="border-l border-slate-100" style={{ marginLeft: indent + 8 }}>
            {children}
          </div>
        )}
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     DASHBOARD VIEW
  ═══════════════════════════════════════════════ */
  const DashboardView = () => {
    const actEnRetard = activites.filter(a => a.statut === 'EN_RETARD').length
    const actSansTaches = activites.filter(a => !taches.some(t => t.activiteCode === a.code)).length
    const versionsEnAttente = versions.filter(v => v.statut === 'SOUMISE' || v.statut === 'EN_VERIFICATION' || v.statut === 'VALIDEE').length
    const tachesEnRetard = taches.filter(t => t.retardJours > 0).length

    return (
      <div className="space-y-5">
        {/* KPI grid — 6 niveaux */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'Piliers', value: piliers.length, color: '#0B1C3E', icon: <Layers size={14} /> },
            { label: 'Axes', value: axes.length, color: '#1A6B3A', icon: <GitBranch size={14} /> },
            { label: 'Produits', value: produits.length, color: '#92400E', icon: <Target size={14} /> },
            { label: 'Sous-Produits', value: sousProduits.length, color: '#5B21B6', icon: <BookOpen size={14} /> },
            { label: 'Activités', value: activites.length, color: '#C2410C', icon: <BarChart3 size={14} /> },
            { label: 'Tâches', value: taches.length, color: '#059669', icon: <CheckSquare size={14} /> },
          ].map((k, i) => (
            <div key={i} className="kpi-card py-3 flex items-center gap-2.5" style={{ borderLeft: `3px solid ${k.color}` }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: k.color + '18', color: k.color }}>{k.icon}</div>
              <div>
                <div className="text-[9px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
                <div className="text-xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Score de complétude */}
          <div className="card p-5 col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[14px] text-slate-800">Score de complétude</div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[15px] text-white" style={{ background: perfColor(globalScore) }}>{globalScore}%</div>
            </div>
            <div className="space-y-3">
              {Object.entries(completenessScore).map(([k, v]) => {
                const labels: Record<string, string> = { structure: 'Structure', responsables: 'Responsables', indicateurs: 'Indicateurs', planning: 'Planning', taches: 'Tâches / Poids' }
                return (
                  <div key={k}>
                    <div className="flex justify-between text-[11.5px] text-slate-600 mb-1"><span>{labels[k]}</span><span className="font-bold">{v}%</span></div>
                    <ProgressBar value={v} h={5} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Alertes */}
          <div className="card p-5">
            <div className="font-semibold text-[14px] text-slate-800 mb-3">Alertes & Actions requises</div>
            <div className="space-y-2.5">
              {[
                { icon: <AlertTriangle size={13} />, label: `${actEnRetard} activité(s) en retard`, color: '#D97706', count: actEnRetard },
                { icon: <AlertCircle size={13} />, label: `${actSansTaches} activité(s) sans tâche`, color: '#DC2626', count: actSansTaches },
                { icon: <Clock size={13} />, label: `${tachesEnRetard} tâche(s) en retard`, color: '#C2410C', count: tachesEnRetard },
                { icon: <Send size={13} />, label: `${versionsEnAttente} version(s) en attente`, color: '#1D4ED8', count: versionsEnAttente },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: alert.count > 0 ? alert.color + '12' : '#F8FAFC' }}>
                  <span style={{ color: alert.count > 0 ? alert.color : '#94A3B8' }}>{alert.icon}</span>
                  <span className="text-[12.5px]" style={{ color: alert.count > 0 ? '#1E293B' : '#94A3B8' }}>{alert.label}</span>
                  {alert.count > 0 && <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: alert.color }}>{alert.count}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Exercices rapides */}
          <div className="card p-5">
            <div className="font-semibold text-[14px] text-slate-800 mb-3">Exercices</div>
            <div className="space-y-2">
              {exercices.map(ex => {
                const s = EX_STATUT[ex.statut]
                const activeV = ex.versionActive ?? ex.versionBrouillon
                return (
                  <button key={ex.code} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-200"
                    onClick={() => switchExercice(ex.code)}>
                    <div>
                      <div className="text-[12.5px] font-semibold text-slate-800">{ex.libelle}</div>
                      <div className="text-[10.5px] text-slate-400">{activeV ? `Version active : ${activeV}` : 'Aucune version active'}</div>
                    </div>
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </button>
                )
              })}
              <button className="w-full flex items-center gap-1.5 px-3 py-2 text-[12px] text-navy-700 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => setShowExerciceInit(true)}>
                <Plus size={12} /> Nouvel exercice
              </button>
            </div>
          </div>
        </div>

        {/* Versions en cours */}
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="font-semibold text-[14px]">Versions actives et en préparation</div>
            <button className="btn btn-outline btn-sm text-[11.5px]" onClick={() => setMainView('versions')}>Voir toutes</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Exercice</th><th>Version</th><th>Statut</th><th>Applicabilité</th><th>Auteur</th><th>Date effet</th></tr></thead>
            <tbody>
              {versions.filter(v => !['REMPLACEE', 'REJETEE'].includes(v.statut)).map((v, i) => {
                const vs = VER_STATUT[v.statut]; const as = APP_STATUT[v.applicabilite]
                return (
                  <tr key={i}>
                    <td><span className="font-mono font-bold text-[12px] text-navy-900">{v.exerciceCode}</span></td>
                    <td><span className="font-mono font-semibold text-[12px]">{v.num}</span></td>
                    <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: vs.bg, color: vs.color }}>{vs.label}</span></td>
                    <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: as.bg, color: as.color }}>{as.label}</span></td>
                    <td className="text-[12px] text-slate-600">{v.auteur}</td>
                    <td className="text-[12px] text-slate-500 font-mono">{v.dateEffet ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     ARBRE VIEW
  ═══════════════════════════════════════════════ */
  const ArbreView = () => {
    const selNode = selected
    const detailContent = () => {
      if (!selNode) return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-16">
          <GitBranch size={36} className="opacity-30" />
          <p className="text-[13px]">Sélectionnez un nœud pour voir son détail</p>
        </div>
      )
      if (selNode.type === 'pilier') {
        const p = piliers.find(x => x.code === selNode.code)
        if (!p) return null
        const axeCount = axes.filter(a => a.pilierCode === p.code).length
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: p.color }}>{p.code}</div>
              <div>
                <div className="font-bold text-[15px] text-slate-900">{p.libelle}</div>
                <div className="flex items-center gap-1.5 mt-1"><LevelBadge type="pilier" /><span className="text-[11px] text-slate-400">{axeCount} axe(s)</span></div>
              </div>
            </div>
            <div className="space-y-2 text-[12.5px]">
              <div><span className="font-semibold text-slate-600">Orientation stratégique :</span><p className="text-slate-700 mt-0.5">{p.orientationStrategique || '—'}</p></div>
              <div><span className="font-semibold text-slate-600">Objectif général :</span><p className="text-slate-700 mt-0.5">{p.objectifGeneral || '—'}</p></div>
              <div><span className="font-semibold text-slate-600">Responsable :</span><span className="text-slate-700 ml-1">{p.responsable}</span></div>
              <div><span className="font-semibold text-slate-600">Statut nœud :</span><span className="ml-1"><span className="badge text-[10px] px-2 py-0.5" style={{ background: NODE_STATUT[p.nodeStatut].bg, color: NODE_STATUT[p.nodeStatut].color }}>{NODE_STATUT[p.nodeStatut].label}</span></span></div>
            </div>
            <div className="pt-3 flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => setAxeModal({ open: true, editing: null, parentCode: p.code })}><Plus size={12} /> Ajouter un Axe</button>
              <button className="btn btn-outline btn-sm" onClick={() => setPilierModal({ open: true, editing: p })}><Edit3 size={12} /> Modifier</button>
            </div>
          </div>
        )
      }
      if (selNode.type === 'activite') {
        const act = activites.find(a => a.code === selNode.code)
        if (!act) return null
        const actTaches = taches.filter(t => t.activiteCode === act.code)
        const avan = getActAvancement(act.code)
        const poids = actTaches.reduce((s, t) => s + t.poids, 0)
        return (
          <div className="p-5 space-y-4">
            <div>
              <div className="font-bold text-[14px] text-slate-900">{act.libelle}</div>
              <div className="flex items-center gap-1.5 mt-1"><LevelBadge type="activite" /><StatusBadge statut={act.statut} /></div>
            </div>
            <div>
              <div className="flex justify-between text-[11.5px] text-slate-600 mb-1"><span>Avancement pondéré</span><span className="font-bold">{avan}%</span></div>
              <ProgressBar value={avan} />
              {poids !== 100 && <p className="text-[10.5px] text-orange-500 mt-1">⚠ Pondération totale : {poids}% (attendu : 100%)</p>}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div><span className="font-semibold text-slate-600">Responsable :</span><p className="text-slate-700">{act.responsable}</p></div>
              <div><span className="font-semibold text-slate-600">Structure :</span><p className="text-slate-700">{act.structure}</p></div>
              <div><span className="font-semibold text-slate-600">Début :</span><span className="text-slate-700 ml-1 font-mono">{act.debut}</span></div>
              <div><span className="font-semibold text-slate-600">Fin :</span><span className="text-slate-700 ml-1 font-mono">{act.fin}</span></div>
              <div><span className="font-semibold text-slate-600">Budget :</span><span className="text-slate-700 ml-1">{fmtM(act.budget)}</span></div>
              <div><span className="font-semibold text-slate-600">Tâches :</span><span className="text-slate-700 ml-1">{actTaches.length}</span></div>
            </div>
            <div className="pt-2 flex gap-2 flex-wrap">
              <button className="btn btn-primary btn-sm" onClick={() => setTacheModal({ open: true, editing: null, parentCode: act.code })}><Plus size={12} /> Ajouter tâche</button>
              <button className="btn btn-outline btn-sm" onClick={() => setActModal({ open: true, editing: act, parentCode: act.sousProduitCode })}><Edit3 size={12} /> Modifier</button>
            </div>
          </div>
        )
      }
      if (selNode.type === 'tache') {
        const t = taches.find(x => x.code === selNode.code)
        if (!t) return null
        const pr = PRIOR[t.priorite]
        return (
          <div className="p-5 space-y-3">
            <div>
              <div className="font-bold text-[14px] text-slate-900">{t.libelle}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <LevelBadge type="tache" />
                <StatusBadge statut={t.statut} />
                <span className="badge text-[10px] px-2 py-0.5" style={{ background: pr.bg, color: pr.color }}>{pr.label}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11.5px] text-slate-600 mb-1"><span>Avancement</span><span className="font-bold">{t.avancement}%</span></div>
              <ProgressBar value={t.avancement} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div><span className="font-semibold text-slate-600">Responsable :</span><p className="text-slate-700">{t.responsable}</p></div>
              <div><span className="font-semibold text-slate-600">Poids :</span><span className="text-slate-700 ml-1 font-bold">{t.poids}%</span></div>
              <div><span className="font-semibold text-slate-600">Début :</span><span className="text-slate-700 ml-1 font-mono">{t.debut}</span></div>
              <div><span className="font-semibold text-slate-600">Fin :</span><span className="text-slate-700 ml-1 font-mono">{t.fin}</span></div>
              <div><span className="font-semibold text-slate-600">Coût :</span><span className="text-slate-700 ml-1">{fmtM(t.cout)}</span></div>
              {t.retardJours > 0 && <div className="col-span-2 text-orange-600 font-semibold text-[11.5px]">⚠ Retard : {t.retardJours} jour(s)</div>}
            </div>
            {t.resultatAttendu && <div><span className="font-semibold text-[12px] text-slate-600">Résultat attendu :</span><p className="text-[12px] text-slate-700 mt-0.5">{t.resultatAttendu}</p></div>}
            <div className="pt-2 flex gap-2">
              <button className="btn btn-outline btn-sm" onClick={() => setTacheModal({ open: true, editing: t, parentCode: t.activiteCode })}><Edit3 size={12} /> Modifier</button>
              <button className="btn btn-outline btn-sm text-red-500" onClick={() => { setTaches(prev => prev.filter(x => x.code !== t.code)); setSelected(null); showToast('Tâche supprimée ✓') }}><Trash2 size={12} /> Supprimer</button>
            </div>
          </div>
        )
      }
      // Generic fallback for axe/produit/sous-produit
      const label = selNode.type === 'axe' ? axes.find(a => a.code === selNode.code)?.libelle
        : selNode.type === 'produit' ? produits.find(p => p.code === selNode.code)?.libelle
        : sousProduits.find(sp => sp.code === selNode.code)?.libelle
      return (
        <div className="p-5 space-y-3">
          <div>
            <div className="font-bold text-[14px] text-slate-900">{label}</div>
            <div className="flex items-center gap-1.5 mt-1"><LevelBadge type={selNode.type} /><span className="font-mono text-[12px] text-slate-400">{selNode.code}</span></div>
          </div>
          <div className="flex gap-2 flex-wrap pt-2">
            {selNode.type === 'axe' && <button className="btn btn-primary btn-sm" onClick={() => setProduitModal({ open: true, editing: null, parentCode: selNode.code })}><Plus size={12} /> Ajouter Produit</button>}
            {selNode.type === 'produit' && <button className="btn btn-primary btn-sm" onClick={() => setSpModal({ open: true, editing: null, parentCode: selNode.code })}><Plus size={12} /> Ajouter Sous-Produit</button>}
            {selNode.type === 'sous-produit' && <button className="btn btn-primary btn-sm" onClick={() => setActModal({ open: true, editing: null, parentCode: selNode.code })}><Plus size={12} /> Ajouter Activité</button>}
          </div>
        </div>
      )
    }

    return (
      <div className="flex gap-4 h-full min-h-0">
        {/* Tree panel */}
        <div className="w-[420px] flex-shrink-0 flex flex-col card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-7 pr-3 py-1.5 text-[12px] border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-navy-700" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm text-[11px] gap-1" onClick={() => setPilierModal({ open: true, editing: null })}>
              <Plus size={11} /> Pilier
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {piliers.filter(p => !search || p.libelle.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search)).map(p => (
              <TreeNode key={p.code} code={p.code} type="pilier" level={0}
                label={`${p.code} — ${p.libelle}`}
                badge={<><LevelBadge type="pilier" /><span className="text-[9.5px] font-mono text-slate-400 ml-1">{axes.filter(a => a.pilierCode === p.code).length} axes</span></>}
              >
                {axes.filter(a => a.pilierCode === p.code).map(ax => (
                  <TreeNode key={ax.code} code={ax.code} type="axe" level={1}
                    label={`${ax.code} — ${ax.libelle}`}
                    badge={<LevelBadge type="axe" />}
                  >
                    {produits.filter(pr => pr.axeCode === ax.code).map(pr => (
                      <TreeNode key={pr.code} code={pr.code} type="produit" level={2}
                        label={`${pr.code} — ${pr.libelle}`}
                        badge={<LevelBadge type="produit" />}
                      >
                        {sousProduits.filter(sp => sp.produitCode === pr.code).map(sp => (
                          <TreeNode key={sp.code} code={sp.code} type="sous-produit" level={3}
                            label={`${sp.code.split('-SP')[1] ? `SP${sp.code.split('-SP')[1]}` : sp.code} — ${sp.libelle.substring(0, 32)}…`}
                            badge={<LevelBadge type="sous-produit" />}
                          >
                            {activites.filter(a => a.sousProduitCode === sp.code).map(act => {
                              const avan = getActAvancement(act.code)
                              const actTaches = taches.filter(t => t.activiteCode === act.code)
                              return (
                                <TreeNode key={act.code} code={act.code} type="activite" level={4}
                                  label={`${act.code.split('-ACT')[1] ? `ACT${act.code.split('-ACT')[1]}` : act.code} — ${act.libelle.substring(0, 28)}…`}
                                  badge={<><LevelBadge type="activite" /><span className={`text-[9.5px] font-mono font-bold ml-1 ${avan >= 80 ? 'text-green-600' : avan >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{avan}%</span></>}
                                >
                                  {actTaches.map(t => (
                                    <TreeNode key={t.code} code={t.code} type="tache" level={5}
                                      label={`T${t.code.split('-T')[1] ?? ''} — ${t.libelle.substring(0, 30)}…`}
                                      badge={<span className={`text-[9.5px] font-mono ${t.avancement === 100 ? 'text-green-500' : 'text-slate-400'}`}>{t.avancement}%</span>}
                                    />
                                  ))}
                                </TreeNode>
                              )
                            })}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
            {piliers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <GitBranch size={28} className="opacity-30 mb-2" />
                <p className="text-[12px]">Aucun pilier — cliquez sur "+ Pilier" pour commencer</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 card overflow-y-auto">
          {detailContent()}
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     TABLEAU VIEW
  ═══════════════════════════════════════════════ */
  const TableauView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full pl-8 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-navy-700" placeholder="Code, libellé, responsable..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input text-[12px] w-40" value={filterLevel} onChange={e => setFilterLevel(e.target.value as NodeType | 'ALL')}>
          <option value="ALL">Tous niveaux</option>
          {(['pilier','axe','produit','sous-produit','activite','tache'] as NodeType[]).map(l => <option key={l} value={l}>{LEVEL_COLORS[l].label}</option>)}
        </select>
        <select className="form-input text-[12px] w-40" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
          <option value="ALL">Tous statuts</option>
          {Object.entries(STATUT_ACT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <span className="text-[12px] text-slate-400">{filteredNodes.length} nœud(s)</span>
      </div>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Code</th><th>Niveau</th><th>Libellé</th><th>Parent</th><th>Responsable</th><th>Statut</th><th>Nœud</th><th>Enfants</th></tr></thead>
          <tbody>
            {filteredNodes.map((n, i) => {
              const lc = LEVEL_COLORS[n.type]; const ns = NODE_STATUT[n.nodeStatut]
              return (
                <tr key={i} className="cursor-pointer hover:bg-slate-50" onClick={() => { setSelected({ type: n.type, code: n.code }); setMainView('arbre') }}>
                  <td><span className="font-mono text-[11.5px] font-semibold text-navy-900">{n.code}</span></td>
                  <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: lc.bg, color: lc.color }}>{lc.label}</span></td>
                  <td className="text-[12.5px] font-medium text-slate-800 max-w-[240px] truncate">{n.libelle}</td>
                  <td className="font-mono text-[11px] text-slate-400">{n.parent}</td>
                  <td className="text-[12px] text-slate-600">{n.responsable || '—'}</td>
                  <td>{n.statut !== '—' ? <StatusBadge statut={n.statut} /> : <span className="text-slate-300">—</span>}</td>
                  <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: ns.bg, color: ns.color }}>{ns.label}</span></td>
                  <td className="text-[12px] text-center text-slate-500">{n.enfants}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredNodes.length === 0 && <div className="py-10 text-center text-slate-400 text-sm">Aucun nœud correspondant</div>}
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════
     GANTT VIEW (simplified SVG)
  ═══════════════════════════════════════════════ */
  const GanttView = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const dayOfYear = (dateStr: string) => { const d = new Date(dateStr); return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000) }
    const totalDays = 365
    const colW = 56
    const rowH = 32
    const labelW = 260
    const items = activites.flatMap(act => [
      { code: act.code, label: `${act.code.split('-ACT')[1] ? `ACT${act.code.split('-ACT')[1]}` : act.code} — ${act.libelle.substring(0, 35)}`, debut: act.debut, fin: act.fin, color: '#C2410C', isAct: true, avancement: getActAvancement(act.code) },
      ...taches.filter(t => t.activiteCode === act.code).map(t => ({
        code: t.code, label: `  T${t.code.split('-T')[1] ?? ''} ${t.libelle.substring(0, 40)}`, debut: t.debut, fin: t.fin, color: STATUT_ACT[t.statut]?.color ?? '#94A3B8', isAct: false, avancement: t.avancement,
      })),
    ])
    const today = dayOfYear(new Date().toISOString().slice(0, 10))

    return (
      <div className="card overflow-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="font-semibold text-[14px]">Gantt — Activités & Tâches 2026</div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {[{ c: '#C2410C', l: 'Activité' }, { c: '#059669', l: 'Réalisée' }, { c: '#D97706', l: 'En cours' }, { c: '#DC2626', l: 'En retard' }].map((lg, i) => (
              <span key={i} className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: lg.c }} />{lg.l}</span>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <svg width={labelW + colW * 12 + 40} height={items.length * rowH + 48} style={{ minWidth: labelW + colW * 12 }}>
            {/* Month headers */}
            {months.map((m, mi) => (
              <g key={mi}>
                <rect x={labelW + mi * colW} y={0} width={colW} height={36} fill={mi % 2 === 0 ? '#F8FAFC' : '#F1F5F9'} />
                <text x={labelW + mi * colW + colW / 2} y={22} textAnchor="middle" fontSize={10} fill="#64748B">{m}</text>
                <line x1={labelW + mi * colW} y1={0} x2={labelW + mi * colW} y2={items.length * rowH + 36} stroke="#E2E8F0" strokeWidth={0.5} />
              </g>
            ))}
            {/* Today line */}
            {(() => { const tx = labelW + (today / totalDays) * colW * 12; return <line x1={tx} y1={36} x2={tx} y2={items.length * rowH + 36} stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4,3" /> })()}
            {/* Rows */}
            {items.map((item, ri) => {
              const y = 36 + ri * rowH
              const x1 = labelW + (dayOfYear(item.debut || '2026-01-01') / totalDays) * colW * 12
              const x2 = labelW + (dayOfYear(item.fin || '2026-12-31') / totalDays) * colW * 12
              const bw = Math.max(x2 - x1, 4)
              return (
                <g key={ri}>
                  <rect x={0} y={y} width={labelW + colW * 12} height={rowH} fill={ri % 2 === 0 ? 'white' : '#FAFAFA'} />
                  <text x={8} y={y + rowH / 2 + 4} fontSize={item.isAct ? 10.5 : 10} fill={item.isAct ? '#1E293B' : '#475569'} fontWeight={item.isAct ? '600' : '400'}>{item.label.substring(0, 38)}</text>
                  <rect x={x1} y={y + 6} width={bw} height={rowH - 14} rx={3} fill={item.isAct ? '#CBD5E1' : item.color + '40'} />
                  <rect x={x1} y={y + 6} width={Math.max(bw * (item.avancement / 100), 2)} height={rowH - 14} rx={3} fill={item.color} />
                  <text x={x1 + bw + 4} y={y + rowH / 2 + 4} fontSize={9} fill="#94A3B8">{item.avancement}%</text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     EXERCICES VIEW
  ═══════════════════════════════════════════════ */
  const ExercicesView = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn btn-primary btn-sm" onClick={() => setShowExerciceInit(true)}><Plus size={13} /> Nouvel exercice</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {exercices.map(ex => {
          const s = EX_STATUT[ex.statut]
          const exVers = versions.filter(v => v.exerciceCode === ex.code)
          const isCurrent = ex.code === currentExerciceCode
          return (
            <div key={ex.code} className={`card p-5 transition-all ${isCurrent ? 'ring-2 ring-navy-700' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-[16px] text-slate-900">{ex.libelle}</div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5 font-mono">{ex.dateDebut} → {ex.dateFin}</div>
                </div>
                <span className="badge text-[11px] px-2.5 py-1 font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                {[
                  { label: 'Version active', value: ex.versionActive ?? '—' },
                  { label: 'Brouillon', value: ex.versionBrouillon ?? '—' },
                  { label: 'Piliers', value: String(ex.nbPiliers) },
                ].map((k, i) => (
                  <div key={i} className="rounded-lg p-2" style={{ background: '#F8FAFC' }}>
                    <div className="text-[9.5px] uppercase font-semibold text-slate-400 tracking-wide">{k.label}</div>
                    <div className="text-[14px] font-bold text-slate-800 mt-0.5">{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="text-[11.5px] text-slate-500 mb-3">{exVers.length} version(s) · Responsable : {ex.responsable}</div>
              <div className="flex gap-2">
                {!isCurrent && <button className="btn btn-outline btn-sm flex-1" onClick={() => switchExercice(ex.code)}>Sélectionner</button>}
                {isCurrent && <span className="flex items-center gap-1 text-[11.5px] font-semibold text-navy-700"><Check size={12} /> Exercice actif</span>}
                {ex.statut === 'A_PREPARER' && (
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    setVersions(prev => [...prev, { num: 'v0.1', exerciceCode: ex.code, statut: 'BROUILLON', dateCreation: new Date().toISOString().slice(0, 10), datePublication: null, dateEffet: null, auteur: 'Utilisateur courant', motif: 'Initialisation', commentaire: '', applicabilite: 'NA' }])
                    setExercices(prev => prev.map(e => e.code === ex.code ? { ...e, statut: 'EN_PREPARATION', versionBrouillon: 'v0.1' } : e))
                    showToast(`Exercice ${ex.code} initialisé ✓`)
                  }}>
                    Initialiser
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════
     VERSIONS VIEW
  ═══════════════════════════════════════════════ */
  const VersionsView = () => {
    const exVers = versions.filter(v => v.exerciceCode === currentExerciceCode).sort((a, b) => b.num.localeCompare(a.num))
    const publiee = exVers.find(v => v.statut === 'PUBLIEE')
    const brouillon = exVers.find(v => v.statut === 'BROUILLON' || v.statut === 'SOUMISE' || v.statut === 'EN_VERIFICATION' || v.statut === 'VALIDEE' || v.statut === 'RETOURNEE')
    return (
      <div className="space-y-4">
        {/* Comparaison si 2 versions */}
        {publiee && brouillon && (
          <div className="card p-5">
            <div className="font-semibold text-[14px] mb-3 flex items-center gap-2"><RefreshCw size={14} className="text-blue-500" /> Comparaison {publiee.num} → {brouillon.num}</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: '+ Ajouté', color: '#16A34A', bg: '#DCFCE7', items: ['+ P01-A01-PR01-SP01-ACT01-T05 (Rapport final)', '+ P04-A01-PR01-SP01-ACT01-T04 (Recette)'] },
                { type: '~ Modifié', color: '#D97706', bg: '#FEF3C7', items: ['~ Responsable ACT01 : MOUAMBA → DIALLO', '~ Budget P03-ACT01 : 450M → 567M XAF'] },
                { type: '→ Déplacé', color: '#1D4ED8', bg: '#DBEAFE', items: ['→ ACT-Formation déplacée vers P03-SP02'] },
                { type: '✕ Désactivé', color: '#DC2626', bg: '#FEE2E2', items: ['✕ P01-A01-PR02-SP01-ACT02 suspendu'] },
              ].map((g, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: g.bg }}>
                  <div className="font-semibold text-[12px] mb-1.5" style={{ color: g.color }}>{g.type}</div>
                  {g.items.map((item, j) => <div key={j} className="text-[11.5px] font-mono" style={{ color: g.color }}>{item}</div>)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 font-semibold text-[14px]">Historique des versions — Exercice {currentExerciceCode}</div>
          <table className="data-table">
            <thead><tr><th>Version</th><th>Statut</th><th>Applicabilité</th><th>Date création</th><th>Date publication</th><th>Date effet</th><th>Auteur</th><th>Motif</th></tr></thead>
            <tbody>
              {exVers.map((v, i) => {
                const vs = VER_STATUT[v.statut]; const as = APP_STATUT[v.applicabilite]
                const isCur = v.num === currentVersionNum
                return (
                  <tr key={i} className={isCur ? 'bg-navy-50' : ''}>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[12px] text-navy-900">{v.num}</span>
                        {isCur && <span className="text-[9.5px] bg-navy-700 text-white px-1.5 py-0.5 rounded-full font-semibold">Actuelle</span>}
                      </div>
                    </td>
                    <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: vs.bg, color: vs.color }}>{vs.label}</span></td>
                    <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: as.bg, color: as.color }}>{as.label}</span></td>
                    <td className="font-mono text-[11px] text-slate-500">{v.dateCreation}</td>
                    <td className="font-mono text-[11px] text-slate-500">{v.datePublication ?? '—'}</td>
                    <td className="font-mono text-[11px] text-slate-500">{v.dateEffet ?? '—'}</td>
                    <td className="text-[12px] text-slate-600">{v.auteur}</td>
                    <td className="text-[12px] text-slate-600 max-w-[140px] truncate">{v.motif}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     PUBLICATION VIEW — Contrôle de cohérence
  ═══════════════════════════════════════════════ */
  const PublicationView = () => {
    const ver = versions.find(v => v.exerciceCode === currentExerciceCode && v.num === currentVersionNum)
    return (
      <div className="space-y-4">
        <div className="card p-5">
          <div className="font-semibold text-[15px] mb-1">Contrôle de cohérence avant publication</div>
          <div className="text-[12.5px] text-slate-500 mb-4">Exercice {currentExerciceCode} · Version {currentVersionNum}</div>
          {hasBlockingError && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>
              <AlertCircle size={15} />
              <span className="text-[13px] font-semibold">Publication bloquée — corrigez les anomalies bloquantes ci-dessous</span>
            </div>
          )}
          <div className="space-y-2.5">
            {coherenceChecks.map((c, i) => {
              const ic = c.statut === 'OK' ? <CheckCircle size={15} className="text-green-500" /> : c.statut === 'WARN' ? <AlertTriangle size={15} className="text-amber-500" /> : <AlertCircle size={15} className="text-red-500" />
              const bg = c.statut === 'OK' ? '#F0FDF4' : c.statut === 'WARN' ? '#FFFBEB' : '#FEF2F2'
              const border = c.statut === 'OK' ? '#BBF7D0' : c.statut === 'WARN' ? '#FDE68A' : '#FECACA'
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: bg, borderColor: border }}>
                  <span className="flex-shrink-0 mt-0.5">{ic}</span>
                  <div>
                    <div className="font-semibold text-[13px] text-slate-800">{c.label}</div>
                    <div className="text-[12px] text-slate-600 mt-0.5">{c.detail}</div>
                  </div>
                  <span className="ml-auto flex-shrink-0">
                    {c.statut === 'OK' && <span className="text-[10.5px] font-semibold text-green-600">CONFORME</span>}
                    {c.statut === 'WARN' && <span className="text-[10.5px] font-semibold text-amber-600">AVERTISSEMENT</span>}
                    {c.statut === 'ERR' && <span className="text-[10.5px] font-semibold text-red-600">BLOQUANT</span>}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <div className="text-[12.5px] text-slate-500">
              {coherenceChecks.filter(c => c.statut === 'OK').length}/{coherenceChecks.length} contrôles réussis
            </div>
            <div className="flex items-center gap-2">
              {ver && (ver.statut === 'BROUILLON' || ver.statut === 'RETOURNEE') && (
                <button className="btn btn-primary btn-sm" disabled={hasBlockingError} onClick={() => handleWorkflow('soumettre', '')}>
                  <Send size={13} /> Soumettre pour vérification
                </button>
              )}
              {ver?.statut === 'VALIDEE' && (
                <button className="btn btn-primary btn-sm" style={{ background: '#15803D' }} onClick={() => { setMainView('versions') }}>
                  <Globe size={13} /> Publier la version
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     WIZARD VIEW — Assistant de branche
  ═══════════════════════════════════════════════ */
  const WizardView = () => {
    const steps = [
      { label: 'Pilier', icon: <Layers size={14} />, desc: 'Définir le domaine stratégique' },
      { label: 'Axes', icon: <GitBranch size={14} />, desc: 'Orientations structurantes' },
      { label: 'Produits', icon: <Target size={14} />, desc: 'Résultats majeurs attendus' },
      { label: 'Sous-Produits', icon: <BookOpen size={14} />, desc: 'Détail des résultats' },
      { label: 'Activités', icon: <BarChart3 size={14} />, desc: 'Programmation opérationnelle' },
      { label: 'Tâches', icon: <CheckSquare size={14} />, desc: 'Niveau opérationnel fin' },
      { label: 'Indicateurs', icon: <TrendingUp size={14} />, desc: 'Indicateurs de performance' },
      { label: 'Planning', icon: <Calendar size={14} />, desc: 'Dates et Gantt' },
      { label: 'Contrôle', icon: <ShieldCheck size={14} />, desc: 'Vérification de cohérence' },
      { label: 'Soumission', icon: <Send size={14} />, desc: 'Workflow de publication' },
    ]
    return (
      <div className="space-y-5">
        <div className="card p-5">
          <div className="font-semibold text-[15px] mb-1">Assistant de création de branche</div>
          <div className="text-[12.5px] text-slate-500">Construisez une branche complète Pilier → Tâche en 10 étapes guidées</div>
        </div>

        {/* Progress */}
        <div className="card p-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <button
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${i === wizardStep ? 'text-white' : i < wizardStep ? 'text-green-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  style={i === wizardStep ? { background: '#0B1C3E' } : i < wizardStep ? { background: '#DCFCE7' } : {}}
                  onClick={() => setWizardStep(i)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < wizardStep ? 'bg-green-500 text-white' : ''}`}
                    style={i === wizardStep ? { background: 'rgba(255,255,255,0.2)' } : {}}>
                    {i < wizardStep ? <Check size={14} /> : s.icon}
                  </div>
                  <span className="text-[9.5px] font-semibold text-center w-14 leading-tight">{s.label}</span>
                </button>
                {i < steps.length - 1 && <div className={`w-6 h-px flex-shrink-0 ${i < wizardStep ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: '#0B1C3E' }}>
              {steps[wizardStep].icon}
            </div>
            <div>
              <div className="font-bold text-[15px] text-slate-900">Étape {wizardStep + 1} — {steps[wizardStep].label}</div>
              <div className="text-[12.5px] text-slate-500">{steps[wizardStep].desc}</div>
            </div>
          </div>

          {wizardStep === 0 && (
            <div className="space-y-3">
              <p className="text-[12.5px] text-slate-600">Créez ou sélectionnez le Pilier de votre branche :</p>
              <div className="grid grid-cols-2 gap-3">
                {piliers.map(p => (
                  <button key={p.code} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-navy-700 hover:bg-slate-50 transition-all text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: p.color }}>{p.code}</div>
                    <div>
                      <div className="text-[12.5px] font-semibold text-slate-800">{p.libelle}</div>
                      <div className="text-[10.5px] text-slate-400">{axes.filter(a => a.pilierCode === p.code).length} axes existants</div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-navy-700 hover:text-navy-700 transition-colors text-[13px] font-medium"
                onClick={() => setPilierModal({ open: true, editing: null })}>
                <Plus size={14} /> Créer un nouveau Pilier
              </button>
            </div>
          )}

          {wizardStep === 8 && (
            <div className="space-y-2">
              {coherenceChecks.map((c, i) => {
                const ic = c.statut === 'OK' ? <CheckCircle size={13} className="text-green-500" /> : c.statut === 'WARN' ? <AlertTriangle size={13} className="text-amber-500" /> : <AlertCircle size={13} className="text-red-500" />
                return (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: c.statut === 'OK' ? '#F0FDF4' : c.statut === 'WARN' ? '#FFFBEB' : '#FEF2F2' }}>
                    {ic}<span className="text-[12.5px] text-slate-700">{c.label}</span>
                    <span className="ml-auto text-[10.5px] font-semibold" style={{ color: c.statut === 'OK' ? '#16A34A' : c.statut === 'WARN' ? '#D97706' : '#DC2626' }}>
                      {c.statut === 'OK' ? '✓' : c.statut === 'WARN' ? '⚠' : '✕'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {wizardStep === 9 && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: '#DCFCE7' }}>
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <div className="font-bold text-[16px] text-slate-900">Branche prête pour soumission</div>
              <div className="text-[12.5px] text-slate-500">Tous les niveaux ont été définis. Vous pouvez maintenant soumettre la version pour validation.</div>
              <button className="btn btn-primary" onClick={() => handleWorkflow('soumettre', 'Branche créée via assistant')}>
                <Send size={14} /> Soumettre la version
              </button>
            </div>
          )}

          {wizardStep > 0 && wizardStep < 8 && wizardStep !== 9 && (
            <div className="text-center py-6 text-slate-400">
              <div className="text-[13px]">Configuration de l'étape <strong>{steps[wizardStep].label}</strong></div>
              <div className="text-[12px] mt-1">Utilisez les boutons d'action dans la vue Arbre pour compléter cette étape.</div>
              <button className="mt-3 btn btn-outline btn-sm" onClick={() => setMainView('arbre')}>
                <ArrowRight size={12} /> Aller à la vue Arbre
              </button>
            </div>
          )}

          <div className="flex justify-between mt-5 pt-4 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" disabled={wizardStep === 0} onClick={() => setWizardStep(s => s - 1)}>
              <ChevronLeft size={13} /> Précédent
            </button>
            <span className="text-[12px] text-slate-400">Étape {wizardStep + 1} / {steps.length}</span>
            <button className="btn btn-primary btn-sm" disabled={wizardStep === steps.length - 1} onClick={() => setWizardStep(s => s + 1)}>
              Suivant <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════
     INDICATEURS VIEW
  ═══════════════════════════════════════════════ */
  const IndicateursView = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Nouvel indicateur</button>
      </div>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Code</th><th>Libellé</th><th>Type</th><th>Unité</th><th>Baseline</th><th>Cible 2026</th><th>Cible 2027</th><th>Cible 2028</th><th>Nœud</th><th>Responsable</th></tr></thead>
          <tbody>
            {indicateurs.map((ind, i) => {
              const lc = LEVEL_COLORS[ind.niveauRattachement]
              return (
                <tr key={i}>
                  <td><span className="font-mono text-[11.5px] font-semibold text-navy-900">{ind.code}</span></td>
                  <td className="max-w-[180px]">
                    <div className="font-medium text-[12.5px] text-slate-800 truncate">{ind.libelle}</div>
                    <div className="text-[10.5px] text-slate-400 truncate">{ind.source} · {ind.frequence}</div>
                  </td>
                  <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: ind.type === 'QUANTITATIF' ? '#EDF2FB' : '#FDF4FF', color: ind.type === 'QUANTITATIF' ? '#1B3269' : '#5B21B6' }}>{ind.type}</span></td>
                  <td className="text-[12px] text-slate-600">{ind.unite}</td>
                  <td className="font-mono text-[11.5px] text-slate-500">{ind.baseline}</td>
                  <td className="font-mono text-[11.5px] font-semibold text-amber-700">{ind.cible2026}</td>
                  <td className="font-mono text-[11.5px] text-slate-600">{ind.cible2027}</td>
                  <td className="font-mono text-[11.5px] text-slate-600">{ind.cible2028}</td>
                  <td><div><span className="badge text-[10px] px-1.5 py-0.5" style={{ background: lc.bg, color: lc.color }}>{lc.label}</span><div className="font-mono text-[9.5px] text-slate-400 mt-0.5">{ind.nodeCode}</div></div></td>
                  <td className="text-[12px] text-slate-600">{ind.responsable}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════
     AUDIT VIEW
  ═══════════════════════════════════════════════ */
  const AuditView = () => (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="font-semibold text-[14px]">Journal d'audit — Actions structurelles</div>
        <button className="btn btn-outline btn-sm text-[11.5px]"><Download size={12} /> Exporter</button>
      </div>
      <table className="data-table">
        <thead><tr><th>Date</th><th>Heure</th><th>Utilisateur</th><th>Rôle</th><th>Exercice</th><th>Version</th><th>Action</th><th>Ancienne valeur</th><th>Nouvelle valeur</th><th>Justification</th></tr></thead>
        <tbody>
          {auditLog.map((entry, i) => (
            <tr key={i}>
              <td className="font-mono text-[11px] text-slate-500 whitespace-nowrap">{entry.date}</td>
              <td className="font-mono text-[11px] text-slate-500">{entry.heure}</td>
              <td className="text-[12px] text-slate-700">{entry.utilisateur}</td>
              <td><span className="badge text-[10px] px-1.5 py-0.5" style={{ background: '#EDF2FB', color: '#1B3269' }}>{entry.role}</span></td>
              <td className="font-mono text-[11.5px] font-bold text-navy-900">{entry.exercice}</td>
              <td className="font-mono text-[11.5px] text-slate-600">{entry.version}</td>
              <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: entry.action.includes('PUBLICATION') ? '#DCFCE7' : entry.action.includes('SOUMISSION') || entry.action.includes('VALIDATION') ? '#DBEAFE' : '#FEF3C7', color: entry.action.includes('PUBLICATION') ? '#15803D' : entry.action.includes('SOUMISSION') || entry.action.includes('VALIDATION') ? '#1D4ED8' : '#92400E' }}>{entry.action}</span></td>
              <td className="font-mono text-[10.5px] text-slate-400 max-w-[120px] truncate">{entry.ancienneValeur}</td>
              <td className="font-mono text-[10.5px] text-slate-600 max-w-[120px] truncate">{entry.nouvelleValeur}</td>
              <td className="text-[12px] text-slate-600 max-w-[140px] truncate">{entry.justification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  /* ═══════════════════════════════════════════════
     NAV TABS
  ═══════════════════════════════════════════════ */
  const navTabs: { id: MainView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard',   label: 'Tableau de bord', icon: <BarChart3 size={13} /> },
    { id: 'arbre',       label: 'Arbre stratégique', icon: <GitBranch size={13} /> },
    { id: 'tableau',     label: 'Vue tableau', icon: <FileText size={13} /> },
    { id: 'gantt',       label: 'Gantt', icon: <Calendar size={13} /> },
    { id: 'exercices',   label: 'Exercices', icon: <Flag size={13} /> },
    { id: 'versions',    label: 'Versions', icon: <History size={13} /> },
    { id: 'publication', label: 'Publication', icon: <Globe size={13} /> },
    { id: 'wizard',      label: 'Assistant', icon: <Zap size={13} /> },
    { id: 'indicateurs', label: 'Indicateurs', icon: <Target size={13} /> },
    { id: 'audit',       label: 'Audit', icon: <ShieldCheck size={13} /> },
  ]

  const renderMainView = () => {
    if (mainView === 'dashboard')   return <DashboardView />
    if (mainView === 'arbre')       return <ArbreView />
    if (mainView === 'tableau')     return <TableauView />
    if (mainView === 'gantt')       return <GanttView />
    if (mainView === 'exercices')   return <ExercicesView />
    if (mainView === 'versions')    return <VersionsView />
    if (mainView === 'publication') return <PublicationView />
    if (mainView === 'wizard')      return <WizardView />
    if (mainView === 'indicateurs') return <IndicateursView />
    if (mainView === 'audit')       return <AuditView />
    return null
  }

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-0 flex-shrink-0" style={{ background: '#F0F4FA' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="section-title text-xl">Planification Stratégique</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Référentiel stratégique CEEAC — Multi-exercice, versionné, intégré</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm text-[11.5px]" onClick={() => setMainView('wizard')}>
              <Zap size={12} /> Assistant
            </button>
            <button className="btn btn-primary btn-sm text-[11.5px]" onClick={() => setPilierModal({ open: true, editing: null })}>
              <Plus size={12} /> Nouveau Pilier
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 overflow-x-auto">
          {navTabs.map(t => (
            <button key={t.id} onClick={() => setMainView(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] font-medium border-b-2 transition-colors -mb-px whitespace-nowrap flex-shrink-0 ${mainView === t.id ? 'border-navy-900 text-navy-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4D Bandeau */}
      <ExerciceBar
        exercices={exercices} versions={versions}
        currentExerciceCode={currentExerciceCode} currentVersionNum={currentVersionNum}
        onSwitchExercice={switchExercice} onWorkflow={handleWorkflow}
        onReject={handleReject} onRevision={handleRevision}
        selectedNodeStatut={selectedNodeStatut}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto px-6 py-5" style={{ background: '#F0F4FA' }}>
        {renderMainView()}
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Modals */}
      {pilierModal.open && <PilierModal onClose={() => setPilierModal({ open: false, editing: null })} onSave={savePilier} editing={pilierModal.editing} />}
      {axeModal.open && <AxeModal piliers={piliers} parentCode={axeModal.parentCode} onClose={() => setAxeModal({ open: false, editing: null, parentCode: '' })} onSave={saveAxe} editing={axeModal.editing} />}
      {produitModal.open && <ProduitModal axes={axes} parentCode={produitModal.parentCode} onClose={() => setProduitModal({ open: false, editing: null, parentCode: '' })} onSave={saveProduit} editing={produitModal.editing} />}
      {spModal.open && <SousProduitModal produits={produits} parentCode={spModal.parentCode} onClose={() => setSpModal({ open: false, editing: null, parentCode: '' })} onSave={saveSousProduit} editing={spModal.editing} />}
      {actModal.open && <ActiviteModal sousProduits={sousProduits} parentCode={actModal.parentCode} onClose={() => setActModal({ open: false, editing: null, parentCode: '' })} onSave={saveActivite} editing={actModal.editing} />}
      {tacheModal.open && <TacheModal activites={activites} parentCode={tacheModal.parentCode} onClose={() => setTacheModal({ open: false, editing: null, parentCode: '' })} onSave={saveTache} editing={tacheModal.editing} taches={taches} />}
      {showExerciceInit && <ExerciceInitModal existingCodes={exercices.map(e => e.code)} onClose={() => setShowExerciceInit(false)} onSave={ex => { setExercices(prev => [...prev, ex]); setShowExerciceInit(false); showToast(`Exercice ${ex.code} créé ✓`) }} />}
    </div>
  )
}
