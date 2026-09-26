import React, { useState, useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell,
  AreaChart, Area, LineChart, Line,
} from 'recharts'
import {
  LayoutDashboard, List, BarChart3, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Wrench, ClipboardList, Star, CalendarCheck, FileText,
  User, ChevronRight, ChevronDown, X, Plus, Eye, Download, Filter,
  Search, Target, CheckCircle, XCircle, Clock, AlertCircle, Shield,
  Activity, Flag, Bell, BookOpen, Archive, Gauge, RefreshCw, ArrowRight,
  Layers, CheckSquare, Zap, Users, GitBranch, FileBarChart, BarChart2,
} from 'lucide-react'
import type { Page } from '../types'
import PDFPreviewModal from '../components/PDFPreviewModal'
import RapportSuivi from '../components/pdf/RapportSuivi'
import { INDICATORS, PILIER_PERFORMANCE } from '../data/mock'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type SEView =
  | 'dashboard' | 'portfolio' | 'indicateurs' | 'physique-financier'
  | 'risques' | 'problemes' | 'actions' | 'evaluations'
  | 'recommandations' | 'pap' | 'rapports' | 'mon-portefeuille'

type ActivityTab =
  | 'synthese' | 'planification' | 'taches' | 'gantt' | 'physique'
  | 'financier' | 'indicateurs' | 'risques' | 'actions' | 'documents' | 'historique'

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const fmtM = (n: number) => (n / 1_000_000).toFixed(1) + ' M XAF'
const pct = (n: number) => `${n}%`
const perfColor = (v: number) => v >= 80 ? '#16A34A' : v >= 60 ? '#D97706' : '#DC2626'
const perfBg = (v: number) => v >= 80 ? '#DCFCE7' : v >= 60 ? '#FEF9C3' : '#FEE2E2'
const perfLabel = (v: number) => v >= 90 ? 'Excellent' : v >= 75 ? 'Satisfaisant' : v >= 60 ? 'À améliorer' : v >= 40 ? 'Insuffisant' : 'Critique'
const ecartColor = (e: number) => Math.abs(e) <= 10 ? '#16A34A' : Math.abs(e) <= 20 ? '#D97706' : '#DC2626'
const ecartLabel = (e: number) => Math.abs(e) <= 10 ? 'Normal' : Math.abs(e) <= 20 ? 'À surveiller' : 'Critique'

const STATUT_ACT: Record<string, { label: string; bg: string; color: string }> = {
  NON_DEMARREE: { label: 'Non démarrée', bg: '#F1F5F9', color: '#475569' },
  PLANIFIEE:    { label: 'Planifiée',    bg: '#EFF6FF', color: '#1D4ED8' },
  EN_COURS:     { label: 'En cours',     bg: '#ECFDF5', color: '#059669' },
  EN_RETARD:    { label: 'En retard',    bg: '#FFF7ED', color: '#C2410C' },
  BLOQUEE:      { label: 'Bloquée',      bg: '#FEF2F2', color: '#DC2626' },
  PARTIELLEMENT_REALISEE: { label: 'Part. réalisée', bg: '#F0FDFA', color: '#0F766E' },
  REALISEE:     { label: 'Réalisée',     bg: '#DCFCE7', color: '#16A34A' },
  CLOTUREE:     { label: 'Clôturée',     bg: '#F8FAFC', color: '#475569' },
  ANNULEE:      { label: 'Annulée',      bg: '#FEF2F2', color: '#9F1239' },
}

/* ═══════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════ */
const ACTIVITIES_SE = [
  { id: 'ACT-1.2.4', code: 'ACT-1.2.4', label: 'Forums et concertations régionales pour l\'intégration commerciale', programme: 'Pilier 1', produit: 'Commerce régional', structure: 'DEPIEC', responsable: 'M. Jean-Paul MOUAMBA', debut: '2026-03-01', fin: '2026-11-30', debutReel: '2026-03-15', finReelle: null, avanPhysique: 65, budget: 1190000000, budgetRevise: 1190000000, engage: 875000000, liquide: 712000000, ordonnance: 634000000, paye: 589000000, statut: 'EN_COURS', score: 72, risques: 1, nbTaches: 4, nbIndicateurs: 3, type: 'PAP', jalons: 3, retardJours: 0 },
  { id: 'ACT-2.1.3', code: 'ACT-2.1.3', label: 'Évaluation des programmes de maintien de la paix en Afrique centrale', programme: 'Pilier 2', produit: 'Paix & Sécurité', structure: 'DEPPS', responsable: 'Mme Claire NGUESSA', debut: '2026-01-15', fin: '2026-12-31', debutReel: '2026-01-20', finReelle: null, avanPhysique: 45, budget: 890000000, budgetRevise: 920000000, engage: 610000000, liquide: 498000000, ordonnance: 421000000, paye: 390000000, statut: 'EN_RETARD', score: 51, risques: 3, nbTaches: 6, nbIndicateurs: 4, type: 'PAP', jalons: 4, retardJours: 18 },
  { id: 'ACT-3.2.1', code: 'ACT-3.2.1', label: 'Renforcement des capacités institutionnelles des États membres', programme: 'Pilier 3', produit: 'Développement humain', structure: 'DEPDHS', responsable: 'M. Alain BIYOGHE', debut: '2026-04-01', fin: '2026-10-31', debutReel: '2026-04-12', finReelle: null, avanPhysique: 28, budget: 567000000, budgetRevise: 567000000, engage: 312000000, liquide: 187000000, ordonnance: 134000000, paye: 118000000, statut: 'EN_RETARD', score: 38, risques: 4, nbTaches: 5, nbIndicateurs: 2, type: 'PAP', jalons: 3, retardJours: 24 },
  { id: 'ACT-1.3.2', code: 'ACT-1.3.2', label: 'Réduction des barrières non-tarifaires au commerce intrarégional', programme: 'Pilier 1', produit: 'Facilitation des échanges', structure: 'DEPIEC', responsable: 'Mme Fanta DIALLO', debut: '2026-02-01', fin: '2026-09-30', debutReel: '2026-02-08', finReelle: null, avanPhysique: 52, budget: 340000000, budgetRevise: 340000000, engage: 228000000, liquide: 198000000, ordonnance: 178000000, paye: 165000000, statut: 'EN_COURS', score: 64, risques: 2, nbTaches: 3, nbIndicateurs: 2, type: 'PAP', jalons: 2, retardJours: 0 },
  { id: 'ACT-4.1.1', code: 'ACT-4.1.1', label: 'Mise en place du système d\'information intégré de la CEEAC', programme: 'Pilier 4', produit: 'Gouvernance & Numérique', structure: 'DSI', responsable: 'M. Patrick ESSONO', debut: '2026-01-01', fin: '2026-06-30', debutReel: '2026-01-05', finReelle: '2026-07-15', avanPhysique: 100, budget: 780000000, budgetRevise: 820000000, engage: 820000000, liquide: 820000000, ordonnance: 795000000, paye: 795000000, statut: 'REALISEE', score: 88, risques: 0, nbTaches: 8, nbIndicateurs: 5, type: 'PAP', jalons: 5, retardJours: 0 },
  { id: 'ACT-HPAP-01', code: 'ACT-HPAP-01', label: 'Entretien et maintenance des équipements du siège', programme: 'Fonctionnement', produit: 'Hors PAP', structure: 'DAF', responsable: 'M. Serge MABIALA', debut: '2026-01-01', fin: '2026-12-31', debutReel: '2026-01-01', finReelle: null, avanPhysique: 78, budget: 245000000, budgetRevise: 245000000, engage: 198000000, liquide: 178000000, ordonnance: 158000000, paye: 145000000, statut: 'EN_COURS', score: 79, risques: 0, nbTaches: 2, nbIndicateurs: 1, type: 'HORS_PAP', jalons: 0, retardJours: 0 },
]

const TASKS_SE: Record<string, Array<{ id: string; label: string; responsable: string; debut: string; fin: string; finReel: string | null; poids: number; avancement: number; statut: string }>> = {
  'ACT-1.2.4': [
    { id: 'T1', label: 'Préparation des TDR et du calendrier', responsable: 'J.-P. MOUAMBA', debut: '2026-03-01', fin: '2026-03-31', finReel: '2026-04-05', poids: 10, avancement: 100, statut: 'REALISEE' },
    { id: 'T2', label: 'Organisation des forums régionaux (Libreville, Kinshasa)', responsable: 'Mme ESSONO', debut: '2026-04-01', fin: '2026-07-31', finReel: null, poids: 40, avancement: 75, statut: 'EN_COURS' },
    { id: 'T3', label: 'Rédaction et négociation des accords', responsable: 'J.-P. MOUAMBA', debut: '2026-07-01', fin: '2026-10-31', finReel: null, poids: 35, avancement: 40, statut: 'EN_COURS' },
    { id: 'T4', label: 'Rapport de clôture et dissémination', responsable: 'Mme ESSONO', debut: '2026-10-01', fin: '2026-11-30', finReel: null, poids: 15, avancement: 0, statut: 'NON_DEMARREE' },
  ],
  'ACT-3.2.1': [
    { id: 'T1', label: 'Diagnostic des besoins en formation', responsable: 'A. BIYOGHE', debut: '2026-04-01', fin: '2026-05-15', finReel: '2026-05-20', poids: 15, avancement: 100, statut: 'REALISEE' },
    { id: 'T2', label: 'Recrutement des formateurs et prestataires', responsable: 'DRH', debut: '2026-05-01', fin: '2026-06-30', finReel: null, poids: 20, avancement: 30, statut: 'EN_RETARD' },
    { id: 'T3', label: 'Sessions de formation (300 participants)', responsable: 'A. BIYOGHE', debut: '2026-06-15', fin: '2026-09-30', finReel: null, poids: 50, avancement: 15, statut: 'EN_RETARD' },
    { id: 'T4', label: 'Évaluation des acquis et certification', responsable: 'DRH', debut: '2026-09-01', fin: '2026-10-15', finReel: null, poids: 10, avancement: 0, statut: 'NON_DEMARREE' },
    { id: 'T5', label: 'Rapport final de formation', responsable: 'A. BIYOGHE', debut: '2026-10-01', fin: '2026-10-31', finReel: null, poids: 5, avancement: 0, statut: 'NON_DEMARREE' },
  ],
}

const RISKS_SE = [
  { id: 'RSK-001', activite: 'ACT-2.1.3', label: 'Instabilité politique dans les pays membres', categorie: 'Politique', probabilite: 4, impact: 4, niveau: 'CRITIQUE', proprietaire: 'Mme NGUESSA', traitement: 'MITIGATION', echeance: '2026-10-01', statut: 'OUVERT', description: 'Les tensions politiques au sein de certains États membres pourraient compromettre la réalisation des programmes de paix.', actions: 'Dialogue diplomatique renforcé, mécanismes de médiation préventive activés.' },
  { id: 'RSK-002', activite: 'ACT-3.2.1', label: 'Insuffisance de participants aux formations (retrait des délégations)', categorie: 'RH', probabilite: 3, impact: 4, niveau: 'ELEVE', proprietaire: 'M. BIYOGHE', traitement: 'MITIGATION', echeance: '2026-09-15', statut: 'OUVERT', description: 'La mobilisation des 300 participants prévus est à risque en raison des contraintes des administrations nationales.', actions: 'Relances officielles aux points focaux, format hybride présentiel/virtuel.' },
  { id: 'RSK-003', activite: 'ACT-3.2.1', label: 'Retard de contractualisation des prestataires de formation', categorie: 'Contractuel', probabilite: 4, impact: 3, niveau: 'ELEVE', proprietaire: 'DAJ', traitement: 'MITIGATION', echeance: '2026-07-01', statut: 'EN_TRAITEMENT', description: 'Les procédures de passation de marchés pour le recrutement des formateurs accusent un retard de 6 semaines.', actions: 'Procédure d\'urgence déclenchée. Saisine du Directeur DAJ.' },
  { id: 'RSK-004', activite: 'ACT-1.3.2', label: 'Résistance des autorités nationales à l\'harmonisation', categorie: 'Institutionnel', probabilite: 3, impact: 3, niveau: 'MODERE', proprietaire: 'Mme DIALLO', traitement: 'ACCEPTATION', echeance: '2026-12-31', statut: 'OUVERT', description: 'Certains pays membres manifestent une résistance à l\'harmonisation des réglementations commerciales.', actions: 'Plaidoyer politique renforcé lors des prochains sommets.' },
  { id: 'RSK-005', activite: 'ACT-2.1.3', label: 'Couverture médiatique négative des missions de paix', categorie: 'Communication', probabilite: 2, impact: 3, niveau: 'MODERE', proprietaire: 'DCP', traitement: 'MITIGATION', echeance: '2026-09-01', statut: 'CLOS', description: 'Risque de perception négative des opérations de paix par l\'opinion publique.', actions: 'Stratégie de communication proactive développée.' },
  { id: 'RSK-006', activite: 'ACT-1.2.4', label: 'Annulation ou report d\'un forum suite à des événements imprévus', categorie: 'Logistique', probabilite: 2, impact: 2, niveau: 'FAIBLE', proprietaire: 'J.-P. MOUAMBA', traitement: 'ACCEPTATION', echeance: '2026-11-30', statut: 'OUVERT', description: 'Des événements ponctuels (grèves, météo, crises sanitaires) pourraient forcer l\'annulation d\'un forum.', actions: 'Plans B identifiés pour chaque forum (format virtuel ou report immédiat).' },
]

const ISSUES_SE = [
  { id: 'PRB-001', activite: 'ACT-3.2.1', date: '2026-06-12', label: 'Défaillance du prestataire principal de formation FORMAC S.A.', impact: 'CRITIQUE', description: 'FORMAC S.A. a notifié son incapacité à exécuter le contrat de formation suite à une liquidation judiciaire. 300 bénéficiaires non formés à ce jour.', responsable: 'M. BIYOGHE', statut: 'EN_COURS', resolution: 'Relance d\'appel d\'offres d\'urgence. Décision attendue avant le 30 juillet.' },
  { id: 'PRB-002', activite: 'ACT-2.1.3', date: '2026-05-28', label: 'Refus de visa pour 3 experts internationaux', impact: 'ELEVE', description: 'Trois experts internationaux mandatés pour l\'évaluation des programmes n\'ont pas pu obtenir leur visa à temps pour la mission de terrain.', responsable: 'Mme NGUESSA', statut: 'RESOLU', resolution: 'Notes verbales adressées aux ambassades concernées. Visas obtenus avec 3 semaines de retard.' },
  { id: 'PRB-003', activite: 'ACT-1.3.2', date: '2026-07-05', label: 'Données douanières incomplètes pour 2 États membres', impact: 'MODERE', description: 'Le Cameroun et la RCA n\'ont pas transmis leurs statistiques douanières du S1 2026, rendant le suivi des indicateurs de réduction des barrières impossible.', responsable: 'Mme DIALLO', statut: 'EN_COURS', resolution: 'Relance officielle adressée aux ministères des finances.' },
]

const ACTIONS_SE = [
  { id: 'AC-001', anomalie: 'ACT-3.2.1 — Retard formations (15 semaines)', cause: 'Contractuel + RH', action: 'Lancer un appel d\'offres d\'urgence pour un prestataire de remplacement', responsable: 'DAJ / M. BIYOGHE', debut: '2026-07-01', echeance: '2026-08-15', priorite: 'CRITIQUE', statut: 'EN_COURS', progression: 45, preuveCloture: null },
  { id: 'AC-002', anomalie: 'ACT-2.1.3 — Retard missions terrain (18 jours)', cause: 'Administrative', action: 'Accélérer les procédures de visas pour experts, saisir le SG pour intervention diplomatique', responsable: 'Mme NGUESSA + DCP', debut: '2026-05-30', echeance: '2026-07-31', priorite: 'ELEVE', statut: 'CLOTUREE', progression: 100, preuveCloture: 'Note SG-2026-118.pdf' },
  { id: 'AC-003', anomalie: 'ACT-1.3.2 — Données manquantes (Cameroun, RCA)', cause: 'Institutionnel', action: 'Adresser des notes verbales officielles et activer les points focaux douaniers', responsable: 'Mme DIALLO', debut: '2026-07-06', echeance: '2026-08-01', priorite: 'MODERE', statut: 'EN_COURS', progression: 30, preuveCloture: null },
  { id: 'AC-004', anomalie: 'Écart physique/financier ACT-2.1.3 > 25 pts', cause: 'Technique + Financière', action: 'Audit interne de l\'exécution et révision du plan financier S2', responsable: 'DAF + Mme NGUESSA', debut: '2026-07-15', echeance: '2026-09-01', priorite: 'ELEVE', statut: 'EN_COURS', progression: 20, preuveCloture: null },
  { id: 'AC-005', anomalie: 'Indicateur IND-3.4 sous 35% de sa cible', cause: 'RH + Logistique', action: 'Réviser le dispositif de collecte de données et renforcer les capacités locales', responsable: 'M. BIYOGHE', debut: '2026-06-01', echeance: '2026-10-31', priorite: 'MODERE', statut: 'EN_COURS', progression: 55, preuveCloture: null },
]

const EVALUATIONS_SE = [
  {
    id: 'EVAL-T1', type: 'Revue trimestrielle', periode: 'T1 2026', date: '2026-04-15', programme: 'Tous programmes',
    physique: 38, financier: 42, delais: 55, qualite: 72, poidsPhysique: 40, poidsFinancier: 30, poidsDelais: 15, poidsQualite: 15,
    statut: 'VALIDEE', auteur: 'M. KOMBILA', valideur: 'Mme ESSOMBA',
    contexte: 'Premier trimestre marqué par une mobilisation lente des ressources financières et des difficultés de démarrage dans les pays membres.',
    difficultes: 'Retards administratifs, procédures de marchés prolongées, faible mobilisation des délégations nationales.',
    recommandations: ['Accélérer les procédures de passation de marchés', 'Renforcer le dialogue avec les États membres', 'Réviser les plans de travail des activités en retard'],
  },
  {
    id: 'EVAL-T2', type: 'Revue trimestrielle', periode: 'T2 2026', date: '2026-07-20', programme: 'Tous programmes',
    physique: 54, financier: 61, delais: 48, qualite: 78, poidsPhysique: 40, poidsFinancier: 30, poidsDelais: 15, poidsQualite: 15,
    statut: 'VALIDEE', auteur: 'M. KOMBILA', valideur: 'Mme ESSOMBA',
    contexte: 'Amélioration notable de l\'exécution financière. Les activités en retard du Pilier 3 continuent de peser sur la performance globale.',
    difficultes: 'Défaillance du prestataire FORMAC, données manquantes de 2 États membres, tensions politiques dans la sous-région.',
    recommandations: ['Déclencher les actions correctives pour ACT-3.2.1', 'Saisir le SG pour intervention diplomatique', 'Renforcer le système de reporting des États membres'],
  },
  {
    id: 'EVAL-MI', type: 'Évaluation à mi-parcours', periode: 'S1 2026', date: '2026-08-01', programme: 'PAP 2026 complet',
    physique: 48, financier: 58, delais: 46, qualite: 76, poidsPhysique: 40, poidsFinancier: 30, poidsDelais: 15, poidsQualite: 15,
    statut: 'EN_COURS', auteur: 'Équipe S&E', valideur: null,
    contexte: 'Mi-parcours de l\'exercice 2026. Les indicateurs physiques sont en deçà des trajectoires attendues malgré une bonne mobilisation financière.',
    difficultes: 'Difficultés institutionnelles dans 3 pays membres, impact résiduel de la crise COVID-19, retard contractuel de 6 semaines sur ACT-3.2.1.',
    recommandations: ['Réviser les cibles de ACT-3.2.1 avec les États membres', 'Organiser une revue extraordinaire du Pilier 3', 'Renforcer le suivi hebdomadaire des activités critiques'],
  },
]

const RECOMMENDATIONS_SE = [
  { id: 'REC-001', texte: 'Accélérer les procédures de passation de marchés pour les activités PAP en retard', source: 'Revue T1 2026', priorite: 'HAUTE', responsable: 'DAJ', date: '2026-04-15', echeance: '2026-06-30', avancement: 100, statut: 'REALISEE' },
  { id: 'REC-002', texte: 'Renforcer le dialogue politique avec les États membres pour la mobilisation des participants', source: 'Revue T1 2026', priorite: 'HAUTE', responsable: 'SG', date: '2026-04-15', echeance: '2026-07-31', avancement: 60, statut: 'EN_COURS' },
  { id: 'REC-003', texte: 'Déclencher les actions correctives pour ACT-3.2.1 — Renforcement capacités', source: 'Revue T2 2026', priorite: 'CRITIQUE', responsable: 'M. BIYOGHE', date: '2026-07-20', echeance: '2026-08-15', avancement: 45, statut: 'EN_COURS' },
  { id: 'REC-004', texte: 'Saisir le Secrétaire Général pour intervention diplomatique sur les données douanières', source: 'Revue T2 2026', priorite: 'HAUTE', responsable: 'DCP', date: '2026-07-20', echeance: '2026-08-01', avancement: 0, statut: 'EN_RETARD' },
  { id: 'REC-005', texte: 'Organiser une revue extraordinaire du Pilier 3 avant fin septembre', source: 'Éval. Mi-parcours', priorite: 'HAUTE', responsable: 'Équipe S&E', date: '2026-08-01', echeance: '2026-09-30', avancement: 0, statut: 'NOUVELLE' },
  { id: 'REC-006', texte: 'Réviser les cibles de l\'indicateur IND-3.4 en accord avec les États membres', source: 'Éval. Mi-parcours', priorite: 'MODERE', responsable: 'M. BIYOGHE', date: '2026-08-01', echeance: '2026-10-31', avancement: 0, statut: 'NOUVELLE' },
  { id: 'REC-007', texte: 'Introduire des mécanismes de suivi hebdomadaire pour les activités critiques', source: 'Éval. Mi-parcours', priorite: 'MODERE', responsable: 'Équipe S&E', date: '2026-08-01', echeance: '2026-09-15', avancement: 20, statut: 'EN_COURS' },
  { id: 'REC-008', texte: 'Créer une base de données des experts régionaux mobilisables en urgence', source: 'Revue T1 2026', priorite: 'FAIBLE', responsable: 'DRH', date: '2026-04-15', echeance: '2026-12-31', avancement: 80, statut: 'EN_COURS' },
]

const PAP_TREE = [
  {
    id: 'P1', label: 'Pilier 1 — Intégration Économique et Commerce', physique: 59, financier: 63, budget: 3200000000,
    axes: [
      {
        id: 'P1-A1', label: 'Axe 1.2 — Commerce intrarégional', physique: 62, financier: 65,
        produits: [
          { id: 'P1-A1-PR1', label: 'Commerce régional renforcé', physique: 65, financier: 63, activites: ['ACT-1.2.4'] },
          { id: 'P1-A1-PR2', label: 'Facilitation des échanges', physique: 52, financier: 67, activites: ['ACT-1.3.2'] },
        ],
      },
    ],
  },
  {
    id: 'P2', label: 'Pilier 2 — Paix, Sécurité et Gouvernance', physique: 45, financier: 62, budget: 2100000000,
    axes: [
      {
        id: 'P2-A1', label: 'Axe 2.1 — Maintien de la paix', physique: 45, financier: 62,
        produits: [
          { id: 'P2-A1-PR1', label: 'Programmes de paix évalués', physique: 45, financier: 62, activites: ['ACT-2.1.3'] },
        ],
      },
    ],
  },
  {
    id: 'P3', label: 'Pilier 3 — Développement Humain et Social', physique: 28, financier: 51, budget: 1400000000,
    axes: [
      {
        id: 'P3-A1', label: 'Axe 3.2 — Capacités institutionnelles', physique: 28, financier: 51,
        produits: [
          { id: 'P3-A1-PR1', label: 'Capacités renforcées', physique: 28, financier: 51, activites: ['ACT-3.2.1'] },
        ],
      },
    ],
  },
  {
    id: 'P4', label: 'Pilier 4 — Gouvernance & Numérique', physique: 88, financier: 92, budget: 1800000000,
    axes: [
      {
        id: 'P4-A1', label: 'Axe 4.1 — Transformation numérique', physique: 88, financier: 92,
        produits: [
          { id: 'P4-A1-PR1', label: 'Système d\'information intégré', physique: 100, financier: 100, activites: ['ACT-4.1.1'] },
        ],
      },
    ],
  },
]

const RAPPORTS_SE = [
  { id: 'RPT-001', type: 'Rapport mensuel', periode: 'Juillet 2026', version: '1.0', statut: 'BROUILLON', auteur: 'M. KOMBILA', date: '2026-08-05', taille: '1.2 Mo' },
  { id: 'RPT-002', type: 'Rapport trimestriel', periode: 'T2 2026', version: '2.1', statut: 'PUBLIE', auteur: 'Équipe S&E', date: '2026-07-22', taille: '3.8 Mo' },
  { id: 'RPT-003', type: 'Rapport d\'exécution PAP', periode: 'S1 2026', version: '1.3', statut: 'VALIDATION', auteur: 'Équipe S&E', date: '2026-08-01', taille: '5.2 Mo' },
  { id: 'RPT-004', type: 'Rapport des indicateurs', periode: 'T2 2026', version: '1.0', statut: 'PUBLIE', auteur: 'M. KOMBILA', date: '2026-07-18', taille: '2.1 Mo' },
  { id: 'RPT-005', type: 'Rapport des risques', periode: 'T2 2026', version: '1.0', statut: 'PUBLIE', auteur: 'Équipe S&E', date: '2026-07-20', taille: '1.5 Mo' },
]

const NOTIFICATIONS_SE = [
  { id: 'N1', type: 'RETARD', label: 'ACT-3.2.1 en retard de 24 jours', detail: 'Renforcement capacités — Taux physique 28%', urgent: true },
  { id: 'N2', type: 'ECART', label: 'Écart critique ACT-2.1.3: physique 45% vs financier 68%', detail: 'Écart de 23 points — Analyse requise', urgent: true },
  { id: 'N3', type: 'INDICATEUR', label: 'IND-3.4 à renseigner avant le 20/08', detail: 'Bénéficiaires de formation — Q3 2026', urgent: false },
  { id: 'N4', type: 'RAPPORT', label: 'Rapport T3 2026 attendu avant le 15/10', detail: 'Rapport trimestriel de performance', urgent: false },
  { id: 'N5', type: 'ACTION', label: 'AC-001 en retard — Échéance 15/08/2026', detail: 'Prestataire remplacement ACT-3.2.1', urgent: true },
  { id: 'N6', type: 'RECOMMANDATION', label: 'REC-004 non traitée — Délai dépassé', detail: 'Intervention diplomatique données douanières', urgent: true },
]

const IND_EVOLUTION = [
  { periode: 'Jan', cible: 45, realisation: 32 },
  { periode: 'Fév', cible: 50, realisation: 38 },
  { periode: 'Mar', cible: 55, realisation: 42 },
  { periode: 'Avr', cible: 60, realisation: 47 },
  { periode: 'Mai', cible: 65, realisation: 51 },
  { periode: 'Jun', cible: 68, realisation: 56 },
  { periode: 'Jul', cible: 70, realisation: 60 },
  { periode: 'Aoû', cible: 70, realisation: 62 },
]

/* ═══════════════════════════════════════════════════════
   SUB COMPONENTS
═══════════════════════════════════════════════════════ */
function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_ACT[statut] ?? { label: statut, bg: '#F1F5F9', color: '#475569' }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function PerfBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold"
      style={{ background: perfBg(value), color: perfColor(value) }}>
      {perfLabel(value)} — {value}/100
    </span>
  )
}

function ProgressBar({ value, color, height = 6 }: { value: number; color?: string; height?: number }) {
  const c = color ?? perfColor(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full bg-slate-100 overflow-hidden" style={{ height }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, background: c }} />
      </div>
      <span className="font-mono font-bold text-[12px]" style={{ color: c }}>{value}%</span>
    </div>
  )
}

function KPICard({ label, value, sub, color, icon: Icon, onClick }: { label: string; value: string | number; sub?: string; color: string; icon?: React.ElementType; onClick?: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 border border-slate-100 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      style={{ borderTop: `3px solid ${color}` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 leading-tight">{label}</div>
        {Icon && <Icon size={14} style={{ color }} className="flex-shrink-0 mt-0.5" />}
      </div>
      <div className="font-bold text-2xl mt-1.5" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function AlertBanner({ type, msg }: { type: 'critique' | 'attention' | 'info'; msg: string }) {
  const cfg = type === 'critique'
    ? { bg: '#FEF2F2', border: '#FCA5A5', color: '#991B1B', Icon: XCircle }
    : type === 'attention'
    ? { bg: '#FFF7ED', border: '#FCD34D', color: '#92400E', Icon: AlertTriangle }
    : { bg: '#EFF6FF', border: '#93C5FD', color: '#1E40AF', Icon: AlertCircle }
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-[12.5px] font-medium"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
      <cfg.Icon size={14} className="flex-shrink-0" />
      {msg}
    </div>
  )
}

const RECSTATUT: Record<string, { label: string; color: string; bg: string }> = {
  NOUVELLE:  { label: 'Nouvelle',  color: '#1D4ED8', bg: '#EFF6FF' },
  ACCEPTEE:  { label: 'Acceptée',  color: '#0F766E', bg: '#F0FDFA' },
  EN_COURS:  { label: 'En cours',  color: '#D97706', bg: '#FFF7ED' },
  EN_RETARD: { label: 'En retard', color: '#DC2626', bg: '#FEF2F2' },
  REALISEE:  { label: 'Réalisée',  color: '#16A34A', bg: '#DCFCE7' },
  CLOTUREE:  { label: 'Clôturée',  color: '#475569', bg: '#F8FAFC' },
}

const RPT_STATUT: Record<string, { label: string; color: string; bg: string }> = {
  BROUILLON:  { label: 'Brouillon',   color: '#475569', bg: '#F8FAFC' },
  REVISION:   { label: 'Révision',    color: '#D97706', bg: '#FFF7ED' },
  VALIDATION: { label: 'Validation',  color: '#1D4ED8', bg: '#EFF6FF' },
  PUBLIE:     { label: 'Publié',      color: '#16A34A', bg: '#DCFCE7' },
  ARCHIVE:    { label: 'Archivé',     color: '#475569', bg: '#F1F5F9' },
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
interface Props {
  onNavigate: (page: Page, id?: string) => void
}

export default function SuiviEvaluation({ onNavigate }: Props) {
  const [activeView, setActiveView] = useState<SEView>('dashboard')
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [activityTab, setActivityTab] = useState<ActivityTab>('synthese')
  const [showNotifs, setShowNotifs] = useState(false)
  const [filterStatut, setFilterStatut] = useState('ALL')
  const [filterProg, setFilterProg] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [search, setSearch] = useState('')
  const [expandedPAP, setExpandedPAP] = useState<string[]>(['P1', 'P2'])
  const [showNewRiskModal, setShowNewRiskModal] = useState(false)
  const [showSaisieModal, setShowSaisieModal] = useState(false)
  const [showEcartModal, setShowEcartModal] = useState(false)
  const [showRapportModal, setShowRapportModal] = useState(false)
  const [showRapportPDF, setShowRapportPDF] = useState(false)
  const [showNewActionModal, setShowNewActionModal] = useState(false)
  const [selectedEval, setSelectedEval] = useState<string | null>(null)
  const [rapportType, setRapportType] = useState('Rapport trimestriel')
  const [rapportPeriode, setRapportPeriode] = useState('T3 2026')
  const [rapportFormat, setRapportFormat] = useState<'PDF' | 'Excel'>('PDF')
  const [rapportGenerating, setRapportGenerating] = useState(false)
  const [rapportDone, setRapportDone] = useState(false)
  const [saisieValeur, setSaisieValeur] = useState('')
  const [saisieSource, setSaisieSource] = useState('')
  const [saisieComment, setSaisieComment] = useState('')
  const [physiqueSaisie, setPhysiqueSaisie] = useState<Record<string, string>>({})
  const [newRiskForm, setNewRiskForm] = useState({ label: '', categorie: 'Politique', probabilite: '2', impact: '2', description: '', actions: '', proprietaire: '' })
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS_SE)
  const [papExpanded, setPapExpanded] = useState<Set<string>>(new Set(['P1']))

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const currentActivity = ACTIVITIES_SE.find(a => a.id === selectedActivity)

  const filteredActivities = useMemo(() => {
    return ACTIVITIES_SE.filter(a => {
      if (filterStatut !== 'ALL' && a.statut !== filterStatut) return false
      if (filterProg !== 'ALL' && a.programme !== filterProg) return false
      if (filterType !== 'ALL' && a.type !== filterType) return false
      if (search && !a.label.toLowerCase().includes(search.toLowerCase()) && !a.code.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [filterStatut, filterProg, filterType, search])

  const NAV_GROUPS = [
    {
      label: 'Vue d\'ensemble',
      items: [
        { id: 'dashboard' as SEView, label: 'Tableau de bord', Icon: LayoutDashboard },
        { id: 'mon-portefeuille' as SEView, label: 'Mon Portefeuille', Icon: User },
      ],
    },
    {
      label: 'Exécution',
      items: [
        { id: 'portfolio' as SEView, label: 'Activités', Icon: List },
        { id: 'pap' as SEView, label: 'Suivi PAP', Icon: Layers },
        { id: 'physique-financier' as SEView, label: 'Physique / Financier', Icon: BarChart2 },
        { id: 'indicateurs' as SEView, label: 'Indicateurs', Icon: BarChart3 },
      ],
    },
    {
      label: 'Gestion des risques',
      items: [
        { id: 'risques' as SEView, label: 'Risques', Icon: Shield },
        { id: 'problemes' as SEView, label: 'Problèmes', Icon: AlertCircle },
        { id: 'actions' as SEView, label: 'Actions Correctives', Icon: Wrench },
      ],
    },
    {
      label: 'Pilotage',
      items: [
        { id: 'evaluations' as SEView, label: 'Évaluations', Icon: Star },
        { id: 'recommandations' as SEView, label: 'Recommandations', Icon: Flag },
        { id: 'rapports' as SEView, label: 'Rapports', Icon: FileBarChart },
      ],
    },
  ]

  const urgentCount = NOTIFICATIONS_SE.filter(n => n.urgent).length

  /* ─── ACTIVITY 360° MODAL ─────────────────────────────── */
  const renderActivity360 = () => {
    if (!currentActivity) return null
    const act = currentActivity
    const tasks = TASKS_SE[act.id] ?? []
    const actRisks = RISKS_SE.filter(r => r.activite === act.id)
    const engagePct = Math.round(act.engage / act.budgetRevise * 100)
    const liquidePct = Math.round(act.liquide / act.budgetRevise * 100)
    const ordPct = Math.round(act.ordonnance / act.budgetRevise * 100)
    const payePct = Math.round(act.paye / act.budgetRevise * 100)
    const ecart = engagePct - act.avanPhysique

    const ATABS: { id: ActivityTab; label: string }[] = [
      { id: 'synthese', label: 'Synthèse' },
      { id: 'planification', label: 'Planification' },
      { id: 'taches', label: `Tâches (${tasks.length})` },
      { id: 'gantt', label: 'Gantt' },
      { id: 'physique', label: 'Exéc. Physique' },
      { id: 'financier', label: 'Exéc. Financière' },
      { id: 'indicateurs', label: 'Indicateurs' },
      { id: 'risques', label: `Risques (${actRisks.length})` },
      { id: 'actions', label: 'Actions' },
      { id: 'documents', label: 'Documents' },
      { id: 'historique', label: 'Historique' },
    ]

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded" onClick={() => setSelectedActivity(null)}>
              <X size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-500">{act.code}</span>
                <StatutBadge statut={act.statut} />
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: act.type === 'PAP' ? '#EDF2FB' : '#F0FDF4', color: act.type === 'PAP' ? '#1B3269' : '#15803D' }}>{act.type}</span>
              </div>
              <div className="font-semibold text-[15px] text-slate-800 mt-0.5 max-w-2xl leading-tight">{act.label}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm gap-1.5"><Download size={13} />Exporter</button>
            <PerfBadge value={act.score} />
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-0 overflow-x-auto flex-shrink-0">
          {ATABS.map(t => (
            <button key={t.id}
              className={`tab-item whitespace-nowrap ${activityTab === t.id ? 'active' : ''}`}
              onClick={() => setActivityTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* SYNTHÈSE */}
          {activityTab === 'synthese' && (
            <div className="space-y-5 max-w-5xl mx-auto">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl p-5 border border-slate-100">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Identification</div>
                  {[
                    ['Programme', act.programme], ['Structure', act.structure],
                    ['Responsable', act.responsable], ['Exercice', '2026'],
                    ['Début prévu', act.debut], ['Fin prévue', act.fin],
                    ['Début réel', act.debutReel], ['Fin réelle', act.finReelle ?? '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
                      <span className="text-[12px] text-slate-500">{k}</span>
                      <span className="text-[12px] font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Avancement physique', value: act.avanPhysique, color: perfColor(act.avanPhysique) },
                      { label: 'Score performance', value: act.score, color: perfColor(act.score) },
                    ].map(k => (
                      <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">{k.label}</div>
                        <div className="text-3xl font-bold mt-2" style={{ color: k.color }}>{k.value}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Chaîne financière</div>
                    {[
                      { label: 'Engagé', pct: engagePct, color: '#1D4ED8' },
                      { label: 'Liquidé', pct: liquidePct, color: '#7C3AED' },
                      { label: 'Ordonnancé', pct: ordPct, color: '#D97706' },
                      { label: 'Payé', pct: payePct, color: '#16A34A' },
                    ].map(f => (
                      <div key={f.label} className="mb-2">
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-500">{f.label}</span>
                          <span className="font-bold" style={{ color: f.color }}>{f.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-xl p-4 border`} style={{ background: perfBg(ecartColor(ecart) === '#16A34A' ? 90 : ecartColor(ecart) === '#D97706' ? 65 : 30), borderColor: ecartColor(ecart) + '44' }}>
                    <div className="text-[10px] uppercase font-semibold tracking-wider mb-1" style={{ color: ecartColor(ecart) }}>Écart Physique / Financier</div>
                    <div className="text-2xl font-bold" style={{ color: ecartColor(ecart) }}>{ecart > 0 ? '+' : ''}{ecart} pts</div>
                    <div className="text-[12px] font-semibold mt-0.5" style={{ color: ecartColor(ecart) }}>{ecartLabel(ecart)}</div>
                    {Math.abs(ecart) > 20 && (
                      <div className="text-[11px] text-slate-600 mt-2">⚠ Analyse d'écart requise — cliquer sur l'onglet Exéc. Physique</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLANIFICATION */}
          {activityTab === 'planification' && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 border border-slate-100 space-y-5">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-2">Planification initiale</div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  ['Date de début prévue', act.debut], ['Date de fin prévue', act.fin],
                  ['Date de début réelle', act.debutReel], ['Date de fin réelle', act.finReelle ?? 'Non terminée'],
                  ['Durée prévue', '9 mois'], ['Budget prévu', fmtM(act.budget)],
                  ['Budget révisé', fmtM(act.budgetRevise)], ['Nombre de tâches', String(act.nbTaches)],
                  ['Jalons', String(act.jalons)], ['Indicateurs liés', String(act.nbIndicateurs)],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-slate-50 pb-2">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">{k}</div>
                    <div className="text-[13px] font-semibold text-slate-800 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Jalons</div>
                <table className="data-table">
                  <thead>
                    <tr><th>Jalon</th><th>Date prévue</th><th>Date réelle</th><th>Statut</th><th>Responsable</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'TDR validés', prevu: '2026-03-31', reel: '2026-04-05', statut: 'REALISEE', resp: act.responsable },
                      { label: 'Contrat signé', prevu: '2026-05-01', reel: '2026-05-12', statut: 'REALISEE', resp: 'DAJ' },
                      { label: 'Livraison finale', prevu: act.fin, reel: null, statut: 'NON_DEMARREE', resp: act.responsable },
                    ].map((j, i) => (
                      <tr key={i}>
                        <td className="font-medium text-[13px]">{j.label}</td>
                        <td className="font-mono text-[12px]">{j.prevu}</td>
                        <td className="font-mono text-[12px]">{j.reel ?? '—'}</td>
                        <td><StatutBadge statut={j.statut} /></td>
                        <td className="text-[12px] text-slate-500">{j.resp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TÂCHES */}
          {activityTab === 'taches' && (
            <div className="max-w-5xl mx-auto space-y-4">
              {tasks.length === 0 ? (
                <div className="bg-white rounded-xl p-12 border border-dashed border-slate-200 text-center text-slate-400">
                  <CheckSquare size={32} className="mx-auto mb-2 opacity-30" />
                  <div className="text-[13px]">Aucune tâche renseignée pour cette activité.</div>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Pondération des tâches</div>
                    <div className="flex gap-3 flex-wrap">
                      {tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="text-[11px] text-slate-600">{t.label.substring(0, 28)}…</span>
                          <span className="font-bold text-[12px] text-slate-800">{t.poids}%</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-bold" style={{ background: tasks.reduce((s, t) => s + t.poids, 0) === 100 ? '#DCFCE7' : '#FEE2E2', color: tasks.reduce((s, t) => s + t.poids, 0) === 100 ? '#16A34A' : '#DC2626' }}>
                        Total: {tasks.reduce((s, t) => s + t.poids, 0)}%
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                    <table className="data-table">
                      <thead>
                        <tr><th>Tâche</th><th>Responsable</th><th>Début</th><th>Fin prévue</th><th className="text-right">Poids</th><th>Avancement</th><th>Statut</th></tr>
                      </thead>
                      <tbody>
                        {tasks.map(t => (
                          <tr key={t.id}>
                            <td className="font-medium text-[13px] max-w-[200px] leading-snug">{t.label}</td>
                            <td className="text-[12px] text-slate-500">{t.responsable}</td>
                            <td className="font-mono text-[12px]">{t.debut}</td>
                            <td className="font-mono text-[12px]">{t.fin}</td>
                            <td className="text-right font-bold text-[12px]">{t.poids}%</td>
                            <td className="w-40">
                              <ProgressBar value={t.avancement} />
                            </td>
                            <td><StatutBadge statut={t.statut} /></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50">
                          <td colSpan={4} className="font-semibold text-[12px]">Avancement global (pondéré)</td>
                          <td />
                          <td className="w-40">
                            <ProgressBar value={Math.round(tasks.reduce((s, t) => s + t.avancement * t.poids / 100, 0))} />
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* GANTT */}
          {activityTab === 'gantt' && (
            <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="font-semibold text-[15px] text-slate-800">Diagramme de Gantt — {act.code}</div>
                <div className="flex gap-3 text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="w-10 h-3 rounded" style={{ background: '#0B1C3E' }} />Planifié</div>
                  <div className="flex items-center gap-1.5"><div className="w-10 h-3 rounded" style={{ background: '#16A34A' }} />Réel</div>
                  <div className="flex items-center gap-1.5"><div className="w-10 h-3 rounded" style={{ background: '#DC2626' }} />Retard</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid border-b border-slate-100 bg-slate-50 text-[10px] font-semibold text-slate-400" style={{ gridTemplateColumns: '200px repeat(9,1fr)' }}>
                    <div className="px-4 py-2">Tâche</div>
                    {['Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov'].map(m => <div key={m} className="py-2 text-center">{m}</div>)}
                  </div>
                  {(tasks.length > 0 ? tasks : [
                    { id: 'T1', label: 'Tâche 1 — Préparation', poids: 25, avancement: 100, statut: 'REALISEE', startMonth: 1, endMonth: 1 },
                    { id: 'T2', label: 'Tâche 2 — Exécution', poids: 50, avancement: 65, statut: 'EN_COURS', startMonth: 2, endMonth: 6 },
                    { id: 'T3', label: 'Tâche 3 — Clôture', poids: 25, avancement: 0, statut: 'NON_DEMARREE', startMonth: 7, endMonth: 9 },
                  ]).map((t: any, i: number) => {
                    const startIdx = i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 4 : i === 3 ? 6 : 0
                    const spanCols = i === 0 ? 2 : i === 1 ? 4 : i === 2 ? 2 : i === 3 ? 2 : 2
                    return (
                      <div key={t.id} className="grid border-b border-slate-50 hover:bg-slate-50 transition-colors" style={{ gridTemplateColumns: '200px repeat(9,1fr)', minHeight: 40 }}>
                        <div className="px-4 flex items-center text-[12px] font-medium text-slate-700 leading-tight">{t.label.substring(0, 25)}</div>
                        {Array.from({ length: 9 }).map((_, ci) => {
                          const inRange = ci >= startIdx && ci < startIdx + spanCols
                          const isStart = ci === startIdx
                          const isEnd = ci === startIdx + spanCols - 1
                          return (
                            <div key={ci} className="flex items-center px-0.5 py-2.5">
                              {inRange && (
                                <div className={`w-full h-5 flex items-center justify-center text-white text-[10px] font-bold ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''}`}
                                  style={{ background: t.statut === 'REALISEE' ? '#16A34A' : t.statut === 'EN_RETARD' ? '#DC2626' : t.statut === 'EN_COURS' ? '#0B1C3E' : '#CBD5E1' }}>
                                  {isStart ? `${t.avancement}%` : ''}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
              {act.retardJours > 0 && (
                <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2 text-[12.5px] font-semibold text-red-700">
                  <Clock size={14} />{act.retardJours} jours de retard sur le planning initial
                </div>
              )}
            </div>
          )}

          {/* PHYSIQUE */}
          {activityTab === 'physique' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Avancement physique</div>
                  <div className="text-4xl font-bold mt-2" style={{ color: perfColor(act.avanPhysique) }}>{act.avanPhysique}%</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Résultat attendu</div>
                  <div className="text-[14px] font-semibold text-slate-800 mt-2">Former 300 agents</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Réalisé</div>
                  <div className="text-[14px] font-semibold text-slate-800 mt-2">84 agents formés</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Saisir une réalisation physique</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">Période *</label><select className="form-input"><option>T3 2026 — Juillet</option><option>T3 2026 — Août</option><option>T3 2026 — Septembre</option></select></div>
                  <div><label className="form-label">Unité de mesure</label><input className="form-input" defaultValue="Nombre d'agents formés" /></div>
                  <div><label className="form-label">Quantité prévue</label><input className="form-input" type="number" defaultValue="100" /></div>
                  <div><label className="form-label">Quantité réalisée *</label>
                    <input className="form-input" type="number"
                      value={physiqueSaisie[act.id] ?? ''}
                      onChange={e => setPhysiqueSaisie(s => ({ ...s, [act.id]: e.target.value }))} />
                  </div>
                  <div className="col-span-2"><label className="form-label">Commentaire / Justification</label><textarea className="form-input" rows={2} placeholder="Expliquer les écarts éventuels…" /></div>
                  <div className="col-span-2">
                    <label className="form-label">Preuve de réalisation</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <Archive size={24} className="mx-auto text-slate-300 mb-2" />
                      <div className="text-[12px] text-slate-400">Glisser-déposer un fichier (rapport, PV, liste présence…)</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="btn btn-outline btn-sm">Sauvegarder brouillon</button>
                  <button className="btn btn-primary btn-sm" onClick={() => showToast('Réalisation soumise pour validation ✓')}>Soumettre pour validation</button>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                <div className="px-5 py-3 border-b border-slate-100 font-semibold text-[13.5px] text-slate-700">Historique des réalisations</div>
                <table className="data-table">
                  <thead><tr><th>Période</th><th>Prévu</th><th>Réalisé</th><th>Taux</th><th>Source</th><th>Statut</th><th>Preuve</th></tr></thead>
                  <tbody>
                    {[
                      { periode: 'T1 2026', prevu: 30, realise: 12, source: 'DAF', statut: 'VALIDEE' },
                      { periode: 'T2 2026', prevu: 70, realise: 47, source: 'Rapport terrain', statut: 'VALIDEE' },
                    ].map((r, i) => (
                      <tr key={i}>
                        <td className="font-medium text-[12px]">{r.periode}</td>
                        <td className="font-mono text-[12px]">{r.prevu}</td>
                        <td className="font-mono font-bold text-[12px]">{r.realise}</td>
                        <td><span className="font-bold text-[12px]" style={{ color: perfColor(Math.round(r.realise / r.prevu * 100)) }}>{Math.round(r.realise / r.prevu * 100)}%</span></td>
                        <td className="text-[12px] text-slate-500">{r.source}</td>
                        <td><span className="badge text-[10px]" style={{ background: '#DCFCE7', color: '#16A34A' }}>Validée</span></td>
                        <td><button className="text-indigo-600 hover:underline text-[11px] flex items-center gap-1"><Eye size={11} />Voir</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FINANCIER */}
          {activityTab === 'financier' && (
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Budget initial', v: act.budget, color: '#0B1C3E' },
                  { label: 'Budget révisé', v: act.budgetRevise, color: '#1D4ED8' },
                  { label: 'Engagé', v: act.engage, color: '#7C3AED' },
                  { label: 'Liquidé', v: act.liquide, color: '#D97706' },
                  { label: 'Ordonnancé', v: act.ordonnance, color: '#059669' },
                  { label: 'Payé', v: act.paye, color: '#16A34A' },
                ].map(f => (
                  <div key={f.label} className="bg-white rounded-xl p-4 border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">{f.label}</div>
                      <div className="font-bold text-[15px] mt-0.5" style={{ color: f.color }}>{fmtM(f.v)}</div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: f.color }}>
                      {Math.round(f.v / act.budgetRevise * 100)}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-4">Visualisation de la chaîne financière</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[
                    { name: 'Budget', value: 100 },
                    { name: 'Engagé', value: engagePct },
                    { name: 'Liquidé', value: liquidePct },
                    { name: 'Ordonnancé', value: ordPct },
                    { name: 'Payé', value: payePct },
                  ]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {['#0B1C3E', '#1D4ED8', '#7C3AED', '#D97706', '#16A34A'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Disponible</div>
                <div className="text-2xl font-bold text-slate-800">{fmtM(act.budgetRevise - act.engage)}</div>
                <div className="text-[11px] text-slate-400">{Math.round((act.budgetRevise - act.engage) / act.budgetRevise * 100)}% du budget révisé</div>
              </div>
            </div>
          )}

          {/* INDICATEURS tab */}
          {activityTab === 'indicateurs' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-semibold text-[15px] text-slate-800">Indicateurs de l'activité</div>
                  <button className="btn btn-outline btn-sm gap-1" onClick={() => showToast('Modal de saisie ouvert')}><Plus size={13} />Saisir réalisation</button>
                </div>
                <table className="data-table">
                  <thead><tr><th>Code</th><th>Indicateur</th><th>Baseline</th><th>Cible</th><th>Réalisation</th><th>Taux</th><th>Statut</th></tr></thead>
                  <tbody>
                    {INDICATORS.slice(0, act.nbIndicateurs).map(ind => (
                      <tr key={ind.id}>
                        <td className="font-mono text-[12px] font-bold text-slate-700">{ind.code}</td>
                        <td className="text-[13px] font-medium max-w-[200px] leading-snug">{ind.libelle}</td>
                        <td className="font-mono text-[12px]">{ind.baseline}</td>
                        <td className="font-mono font-semibold text-[12px]">{ind.cible}</td>
                        <td className="font-mono font-bold text-[12px]" style={{ color: perfColor(ind.tauxAtteinte) }}>{ind.realisation}</td>
                        <td><span className="font-bold text-[13px]" style={{ color: perfColor(ind.tauxAtteinte) }}>{ind.tauxAtteinte.toFixed(1)}%</span></td>
                        <td><div className="w-3 h-3 rounded-full" style={{ background: perfColor(ind.tauxAtteinte) }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RISQUES tab */}
          {activityTab === 'risques' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {actRisks.length === 0 ? (
                <div className="bg-white rounded-xl p-12 border border-dashed border-slate-200 text-center text-slate-400">
                  <Shield size={32} className="mx-auto mb-2 opacity-30" />
                  <div className="text-[13px]">Aucun risque enregistré pour cette activité.</div>
                </div>
              ) : actRisks.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-5 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold flex-shrink-0"
                      style={{ background: r.niveau === 'CRITIQUE' ? '#FEE2E2' : r.niveau === 'ELEVE' ? '#FFEDD5' : '#FEF9C3', color: r.niveau === 'CRITIQUE' ? '#991B1B' : r.niveau === 'ELEVE' ? '#9A3412' : '#713F12' }}>
                      {r.niveau}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-[13.5px] text-slate-800">{r.label}</div>
                      <div className="text-[12px] text-slate-500 mt-1">{r.description}</div>
                      <div className="mt-2 text-[12px] text-indigo-700 bg-indigo-50 rounded px-3 py-1.5">{r.actions}</div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full bg-white border-2 border-dashed border-slate-200 rounded-xl py-4 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-[13px] gap-2 flex items-center justify-center"
                onClick={() => setShowNewRiskModal(true)}>
                <Plus size={16} />Ajouter un risque
              </button>
            </div>
          )}

          {/* ACTIONS tab */}
          {activityTab === 'actions' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {ACTIONS_SE.filter(a => a.anomalie.includes(act.code)).map(ac => (
                <div key={ac.id} className="bg-white rounded-xl p-5 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-[13.5px] text-slate-800">{ac.action}</div>
                      <div className="text-[11.5px] text-slate-500 mt-1">Cause: {ac.cause} · Responsable: {ac.responsable} · Échéance: {ac.echeance}</div>
                      <div className="mt-3"><ProgressBar value={ac.progression} /></div>
                    </div>
                    <span className="ml-4 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold flex-shrink-0"
                      style={{ background: ac.statut === 'CLOTUREE' ? '#DCFCE7' : ac.statut === 'EN_COURS' ? '#FFF7ED' : '#FEF2F2', color: ac.statut === 'CLOTUREE' ? '#16A34A' : ac.statut === 'EN_COURS' ? '#D97706' : '#DC2626' }}>
                      {ac.statut}
                    </span>
                  </div>
                </div>
              ))}
              {ACTIONS_SE.filter(a => a.anomalie.includes(act.code)).length === 0 && (
                <div className="bg-white rounded-xl p-12 border border-dashed border-slate-200 text-center text-slate-400">
                  <Wrench size={32} className="mx-auto mb-2 opacity-30" />
                  <div className="text-[13px]">Aucune action corrective pour cette activité.</div>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS tab */}
          {activityTab === 'documents' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Archive size={28} className="mx-auto text-slate-300 mb-2" />
                <div className="text-[13px] text-slate-400">Déposer des preuves de réalisation (rapport, PV, photos, listes…)</div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                <table className="data-table">
                  <thead><tr><th>Document</th><th>Type</th><th>Date</th><th>Auteur</th><th>Catégorie</th><th>Actions</th></tr></thead>
                  <tbody>
                    {[
                      { nom: 'Rapport_Forum_Libreville_T2.pdf', type: 'PDF', date: '2026-06-20', auteur: act.responsable, categorie: 'Rapport' },
                      { nom: 'PV_validation_TDR_2026.docx', type: 'Word', date: '2026-04-05', auteur: 'DAJ', categorie: 'PV' },
                      { nom: 'Liste_participants_forum.xlsx', type: 'Excel', date: '2026-06-22', auteur: act.responsable, categorie: 'Liste présence' },
                    ].map((d, i) => (
                      <tr key={i}>
                        <td className="text-[12px] font-medium text-slate-700">{d.nom}</td>
                        <td><span className="badge text-[10px] bg-slate-100 text-slate-600">{d.type}</span></td>
                        <td className="font-mono text-[12px]">{d.date}</td>
                        <td className="text-[12px] text-slate-500">{d.auteur}</td>
                        <td className="text-[12px] text-slate-500">{d.categorie}</td>
                        <td className="flex items-center gap-2">
                          <button className="text-indigo-600 hover:underline text-[11px] flex items-center gap-1"><Eye size={11} />Voir</button>
                          <button className="text-slate-500 hover:underline text-[11px] flex items-center gap-1"><Download size={11} />Télécharger</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HISTORIQUE tab */}
          {activityTab === 'historique' && (
            <div className="max-w-3xl mx-auto space-y-2">
              {[
                { date: '2026-08-01', heure: '14:32', user: 'M. KOMBILA', role: 'Resp. S&E', action: 'Réalisation physique T2 soumise pour validation', type: 'SAISIE', valeur: '47 agents formés' },
                { date: '2026-07-28', heure: '09:15', user: 'Mme ESSOMBA', role: 'Directrice', action: 'Validation réalisation T2 confirmée', type: 'VALIDATION', valeur: '' },
                { date: '2026-07-20', heure: '11:00', user: 'Équipe S&E', role: 'Équipe', action: 'Risque RSK-003 créé (retard contractualisation)', type: 'RISQUE', valeur: 'Niveau ÉLEVÉ' },
                { date: '2026-06-22', heure: '16:45', user: act.responsable, role: 'Responsable', action: 'Preuve ajoutée: Liste_participants_forum.xlsx', type: 'DOCUMENT', valeur: '' },
                { date: '2026-04-05', heure: '10:30', user: 'DAJ', role: 'Juridique', action: 'Jalon TDR validés — retard 5 jours documenté', type: 'JALON', valeur: 'Retard 5j' },
              ].map((e, i) => {
                const TYPE_ICON: Record<string, React.ReactNode> = {
                  SAISIE: <Activity size={14} className="text-blue-600" />,
                  VALIDATION: <CheckCircle size={14} className="text-green-600" />,
                  RISQUE: <AlertTriangle size={14} className="text-red-600" />,
                  DOCUMENT: <FileText size={14} className="text-purple-600" />,
                  JALON: <Flag size={14} className="text-orange-600" />,
                }
                return (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">{TYPE_ICON[e.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[13px] text-slate-800">{e.action}</span>
                        {e.valeur && <span className="text-[10.5px] bg-slate-100 rounded px-2 py-0.5 font-mono text-slate-600">{e.valeur}</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{e.user} · {e.role} · {e.date} à {e.heure}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─── SIDEBAR NAV ─────────────────────────────────────── */
  const Sidebar = () => (
    <div className="w-52 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Suivi-Évaluation</div>
        <div className="text-[11px] text-slate-500 mt-0.5">PAP 2026 · T3</div>
      </div>
      <nav className="flex-1 py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            <div className="px-4 pt-3 pb-1 text-[9.5px] uppercase font-bold tracking-widest text-slate-300 select-none">
              {group.label}
            </div>
            {group.items.map(item => {
              const active = activeView === item.id
              return (
                <button key={item.id}
                  onClick={() => { setActiveView(item.id); setSelectedActivity(null) }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors text-[12px] ${active ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                  <item.Icon size={13} className="flex-shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
          onClick={() => setShowNotifs(v => !v)}>
          <Bell size={13} />
          <span>Notifications</span>
          {urgentCount > 0 && (
            <span className="ml-auto bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{urgentCount}</span>
          )}
        </button>
      </div>
    </div>
  )

  /* ─── RENDER VIEWS ────────────────────────────────────── */

  const renderDashboard = () => {
    const RADAR_DATA = PILIER_PERFORMANCE.map(p => ({ subject: `P${p.id}`, physique: p.tauxPhysique, financier: p.tauxFinancier }))
    const BAR_DATA_ACT = ACTIVITIES_SE.slice(0, 4).map(a => ({ name: a.code, physique: a.avanPhysique, financier: Math.round(a.engage / a.budgetRevise * 100) }))

    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title text-xl">Tableau de bord S&E — Exercice 2026</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Gestion axée sur les résultats · Période T3 2026 · Snapshot au {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="form-input text-[12px] py-1.5 w-28"><option>T3 2026</option><option>T2 2026</option><option>T1 2026</option><option>S1 2026</option></select>
            <button className="btn btn-outline btn-sm gap-1.5"><Download size={13} />Exporter</button>
          </div>
        </div>

        {/* Alertes critiques */}
        <div className="space-y-2">
          <AlertBanner type="critique" msg="ACT-3.2.1 — Renforcement capacités : 24 jours de retard · Taux physique 28% — Intervention urgente requise" />
          <AlertBanner type="critique" msg="Écart physique/financier critique : ACT-2.1.3 à 23 pts (physique 45% · financier 68%) — Analyse obligatoire" />
          <AlertBanner type="attention" msg="4 recommandations en retard · 2 actions correctives non traitées · Rapport T3 attendu le 15/10" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-6 gap-3">
          {[
            { label: 'Exécution physique', value: '72%', color: '#D97706', Icon: Gauge, sub: '4 piliers pondérés' },
            { label: 'Exécution financière', value: '64%', color: '#1A6B3A', Icon: BarChart3, sub: 'Engagé / Budget révisé' },
            { label: 'Activités en retard', value: '14', color: '#DC2626', Icon: Clock, sub: 'Sur 32 activités PAP' },
            { label: 'Indicateurs atteints', value: '68%', color: '#16A34A', Icon: Target, sub: '8/12 indicateurs verts' },
            { label: 'Risques critiques', value: '5', color: '#DC2626', Icon: AlertTriangle, sub: 'Niveau élevé ou critique' },
            { label: 'Recommandations retard', value: '8', color: '#92400E', Icon: Flag, sub: '> date d\'échéance' },
          ].map((k, i) => (
            <KPICard key={i} label={k.label} value={k.value} color={k.color} icon={k.Icon} sub={k.sub}
              onClick={() => {
                if (i === 2) setActiveView('portfolio')
                else if (i === 3) setActiveView('indicateurs')
                else if (i === 4) setActiveView('risques')
                else if (i === 5) setActiveView('recommandations')
              }} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="font-semibold text-[14px] text-slate-800 mb-1">Performance par Pilier</div>
            <div className="text-[11px] text-slate-400 mb-3">Physique vs Financier — T3 2026</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5C6B8C' }} />
                <Radar name="Physique" dataKey="physique" stroke="#1A6B3A" fill="#1A6B3A" fillOpacity={0.18} strokeWidth={2} />
                <Radar name="Financier" dataKey="financier" stroke="#0B1C3E" fill="#0B1C3E" fillOpacity={0.1} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="font-semibold text-[14px] text-slate-800 mb-1">Physique vs Financier par Activité</div>
            <div className="text-[11px] text-slate-400 mb-3">Comparaison T3 2026</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BAR_DATA_ACT} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} unit="%" />
                <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="physique" name="Physique" fill="#1A6B3A" radius={[3, 3, 0, 0]} />
                <Bar dataKey="financier" name="Financier" fill="#0B1C3E" radius={[3, 3, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity summary table */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="font-semibold text-[14px] text-slate-800">Synthèse des activités — PAP 2026</div>
            <button className="text-[12px] text-indigo-600 hover:underline flex items-center gap-1" onClick={() => setActiveView('portfolio')}>
              Voir tout <ChevronRight size={13} />
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Activité</th><th>Structure</th><th>Avancement physique</th>
                <th>Exéc. financière</th><th>Score</th><th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITIES_SE.filter(a => a.type === 'PAP').map(a => (
                <tr key={a.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setSelectedActivity(a.id); setActivityTab('synthese') }}>
                  <td>
                    <div className="font-mono text-[11px] text-slate-400">{a.code}</div>
                    <div className="font-medium text-[12.5px] text-slate-800 max-w-[220px] leading-snug">{a.label.substring(0, 50)}…</div>
                  </td>
                  <td className="text-[12px] text-slate-500">{a.structure}</td>
                  <td className="w-40"><ProgressBar value={a.avanPhysique} /></td>
                  <td className="w-40"><ProgressBar value={Math.round(a.engage / a.budgetRevise * 100)} color="#0B1C3E" /></td>
                  <td><PerfBadge value={a.score} /></td>
                  <td><StatutBadge statut={a.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Structures performance */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 font-semibold text-[14px] text-slate-800">Tableau de performance des structures</div>
          <table className="data-table">
            <thead><tr><th>Structure</th><th className="text-right">Physique</th><th className="text-right">Financier</th><th className="text-right">Indicateurs</th><th className="text-right">Délais</th><th className="text-right">Score global</th></tr></thead>
            <tbody>
              {[
                { struct: 'DEPIEC', physique: 60, financier: 65, indicateurs: 72, delais: 68, score: 64 },
                { struct: 'DEPPS', physique: 45, financier: 62, indicateurs: 55, delais: 44, score: 51 },
                { struct: 'DEPDHS', physique: 28, financier: 51, indicateurs: 35, delais: 32, score: 36 },
                { struct: 'DSI', physique: 100, financier: 97, indicateurs: 92, delais: 88, score: 96 },
                { struct: 'DAF', physique: 78, financier: 80, indicateurs: 74, delais: 82, score: 78 },
              ].sort((a, b) => b.score - a.score).map((s, i) => (
                <tr key={s.struct}>
                  <td className="font-semibold text-[12.5px] text-slate-700">#{i + 1} {s.struct}</td>
                  {[s.physique, s.financier, s.indicateurs, s.delais].map((v, j) => (
                    <td key={j} className="text-right">
                      <span className="font-mono font-bold text-[12px]" style={{ color: perfColor(v) }}>{v}%</span>
                    </td>
                  ))}
                  <td className="text-right"><PerfBadge value={s.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderPortfolio = () => (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">Portefeuille des Activités</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-1.5"><Download size={13} />Exporter</button>
        </div>
      </div>
      {/* Summary counts */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', v: ACTIVITIES_SE.length, c: '#0B1C3E' },
          { label: 'En cours', v: ACTIVITIES_SE.filter(a => a.statut === 'EN_COURS').length, c: '#059669' },
          { label: 'En retard', v: ACTIVITIES_SE.filter(a => a.statut === 'EN_RETARD').length, c: '#DC2626' },
          { label: 'Réalisées', v: ACTIVITIES_SE.filter(a => a.statut === 'REALISEE').length, c: '#16A34A' },
          { label: 'PAP', v: ACTIVITIES_SE.filter(a => a.type === 'PAP').length, c: '#1D4ED8' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400">{k.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="form-input pl-8 py-1.5" placeholder="Rechercher une activité…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input py-1.5 w-40" value={filterProg} onChange={e => setFilterProg(e.target.value)}>
          <option value="ALL">Tous programmes</option>
          {['Pilier 1', 'Pilier 2', 'Pilier 3', 'Pilier 4', 'Fonctionnement'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="form-input py-1.5 w-40" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
          <option value="ALL">Tous statuts</option>
          {Object.keys(STATUT_ACT).map(s => <option key={s} value={s}>{STATUT_ACT[s].label}</option>)}
        </select>
        <select className="form-input py-1.5 w-32" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="ALL">PAP + Hors PAP</option>
          <option value="PAP">PAP seulement</option>
          <option value="HORS_PAP">Hors PAP</option>
        </select>
        {(search || filterStatut !== 'ALL' || filterProg !== 'ALL' || filterType !== 'ALL') && (
          <button className="text-[12px] text-red-600 hover:underline" onClick={() => { setSearch(''); setFilterStatut('ALL'); setFilterProg('ALL'); setFilterType('ALL') }}>
            Réinitialiser
          </button>
        )}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th><th>Activité</th><th>Programme</th><th>Responsable</th>
              <th>Fin prévue</th><th>Avancement physique</th><th>Exec. financière</th>
              <th>Score</th><th>Statut</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map(a => (
              <tr key={a.id} className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => { setSelectedActivity(a.id); setActivityTab('synthese') }}>
                <td className="font-mono text-[12px] font-bold text-slate-600">{a.code}</td>
                <td><div className="max-w-[200px] font-medium text-[12.5px] leading-snug">{a.label.substring(0, 55)}{a.label.length > 55 ? '…' : ''}</div></td>
                <td className="text-[11.5px] text-slate-500">{a.programme}</td>
                <td className="text-[12px] text-slate-500">{a.responsable.split(' ').slice(-1)[0]}</td>
                <td className="font-mono text-[11.5px] text-slate-500">{a.fin}</td>
                <td className="w-36"><ProgressBar value={a.avanPhysique} /></td>
                <td className="w-36"><ProgressBar value={Math.round(a.engage / a.budgetRevise * 100)} color="#0B1C3E" /></td>
                <td><span className="font-bold text-[12px]" style={{ color: perfColor(a.score) }}>{a.score}/100</span></td>
                <td><StatutBadge statut={a.statut} /></td>
                <td><ChevronRight size={15} className="text-slate-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredActivities.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-[13px]">Aucune activité ne correspond aux filtres sélectionnés.</div>
        )}
      </div>
    </div>
  )

  const renderIndicateurs = () => (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">Indicateurs de Performance</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-1.5" onClick={() => setShowSaisieModal(true)}><Plus size={13} />Saisir réalisation</button>
          <button className="btn btn-outline btn-sm gap-1.5"><Download size={13} />Exporter</button>
        </div>
      </div>
      {/* Quality score */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Complétude', value: 95, color: '#16A34A' },
          { label: 'Ponctualité', value: 80, color: '#D97706' },
          { label: 'Cohérence', value: 90, color: '#16A34A' },
          { label: 'Traçabilité', value: 100, color: '#16A34A' },
          { label: 'Score qualité', value: 91, color: '#16A34A' },
        ].map(q => (
          <div key={q.label} className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">{q.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: q.color }}>{q.value}%</div>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${q.value}%`, background: q.color }} />
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500">
        {[{ c: '#16A34A', l: 'Vert — Atteint (≥ 80%)' }, { c: '#D97706', l: 'Orange — À surveiller (50-79%)' }, { c: '#DC2626', l: 'Rouge — Critique (< 50%)' }, { c: '#94A3B8', l: 'Gris — Non renseigné' }].map(s => (
          <div key={s.l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />{s.l}</div>
        ))}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th><th>Indicateur</th><th>Type</th><th>Unité</th>
              <th className="text-right">Baseline</th><th className="text-right">Cible</th>
              <th className="text-right">Réalisation</th><th className="text-right">Taux</th>
              <th>Tendance</th><th>Responsable</th><th>Qualité</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {INDICATORS.map(ind => (
              <tr key={ind.id}>
                <td className="font-mono text-[12px] font-bold text-slate-700">{ind.code}</td>
                <td className="max-w-[200px] text-[12.5px] font-medium leading-snug">{ind.libelle}</td>
                <td><span className="badge text-[10px] px-2" style={{ background: '#EDF2FB', color: '#1B3269' }}>Résultat</span></td>
                <td className="text-[12px] text-slate-500">{ind.unite}</td>
                <td className="text-right font-mono text-[12px]">{ind.baseline}</td>
                <td className="text-right font-mono font-semibold text-[12px]">{ind.cible}</td>
                <td className="text-right font-mono font-bold text-[12px]" style={{ color: perfColor(ind.tauxAtteinte) }}>{ind.realisation}</td>
                <td className="text-right">
                  <span className="font-bold text-[13px]" style={{ color: perfColor(ind.tauxAtteinte) }}>{ind.tauxAtteinte.toFixed(1)}%</span>
                </td>
                <td>
                  {ind.tendance === 'HAUSSE' ? <TrendingUp size={14} className="text-green-600" /> : ind.tendance === 'BAISSE' ? <TrendingDown size={14} className="text-red-500" /> : <Minus size={14} className="text-slate-400" />}
                </td>
                <td className="text-[11.5px] text-slate-500">{ind.responsable}</td>
                <td><div className="w-2.5 h-2.5 rounded-full" style={{ background: ind.tauxAtteinte >= 80 ? '#16A34A' : ind.tauxAtteinte >= 50 ? '#D97706' : '#DC2626' }} /></td>
                <td>
                  <button className="text-[11px] text-indigo-600 hover:underline" onClick={() => setShowSaisieModal(true)}>Saisir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Evolution chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-100">
        <div className="font-semibold text-[14px] text-slate-800 mb-1">Évolution d'un indicateur — IND-1.1</div>
        <div className="text-[11px] text-slate-400 mb-4">Taux de réalisation mensuel vs cible</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={IND_EVOLUTION}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="periode" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: any) => [`${v}%`]} />
            <Area type="monotone" dataKey="cible" name="Cible" stroke="#CBD5E1" fill="#F8FAFC" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="realisation" name="Réalisation" stroke="#1A6B3A" fill="#DCFCE7" fillOpacity={0.5} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderPhysiqueFinancier = () => {
    const ecarts = ACTIVITIES_SE.filter(a => a.type === 'PAP').map(a => ({
      ...a,
      engagePct: Math.round(a.engage / a.budgetRevise * 100),
      ecart: Math.round(a.engage / a.budgetRevise * 100) - a.avanPhysique,
    }))
    const globalPhysique = Math.round(ACTIVITIES_SE.filter(a => a.type === 'PAP').reduce((s, a) => s + a.avanPhysique, 0) / ACTIVITIES_SE.filter(a => a.type === 'PAP').length)
    const globalFinancier = Math.round(ACTIVITIES_SE.filter(a => a.type === 'PAP').reduce((s, a) => s + a.engage / a.budgetRevise * 100, 0) / ACTIVITIES_SE.filter(a => a.type === 'PAP').length)
    const ecartGlobal = globalFinancier - globalPhysique

    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="section-title text-xl">Comparaison Physique / Financière</h1>
          <button className="btn btn-outline btn-sm gap-1.5" onClick={() => setShowEcartModal(true)}><Plus size={13} />Analyser un écart</button>
        </div>

        {/* Global comparison */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white rounded-xl p-5 border border-slate-100 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Exécution physique globale</div>
            <div className="text-5xl font-bold" style={{ color: perfColor(globalPhysique) }}>{globalPhysique}%</div>
          </div>
          <div className={`rounded-xl p-5 text-center border-2`}
            style={{ background: perfBg(Math.abs(ecartGlobal) <= 10 ? 90 : Math.abs(ecartGlobal) <= 20 ? 65 : 30), borderColor: ecartColor(ecartGlobal) + '55' }}>
            <div className="text-[10px] uppercase font-semibold mb-2" style={{ color: ecartColor(ecartGlobal) }}>Écart global</div>
            <div className="text-5xl font-bold" style={{ color: ecartColor(ecartGlobal) }}>{ecartGlobal > 0 ? '+' : ''}{ecartGlobal} pts</div>
            <div className="font-semibold text-[13px] mt-1" style={{ color: ecartColor(ecartGlobal) }}>{ecartLabel(ecartGlobal)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-100 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Exécution financière globale</div>
            <div className="text-5xl font-bold text-slate-800">{globalFinancier}%</div>
          </div>
        </div>

        {/* Seuils d'alerte */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Seuils d'alerte paramétrables</div>
          <div className="flex gap-6">
            {[
              { range: '0 – 10 pts', label: 'Normal', color: '#16A34A', bg: '#DCFCE7' },
              { range: '10 – 20 pts', label: 'À surveiller', color: '#D97706', bg: '#FEF9C3' },
              { range: '> 20 pts', label: 'Critique', color: '#DC2626', bg: '#FEE2E2' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-[12px]"
                style={{ background: s.bg, borderColor: s.color + '44', color: s.color }}>
                {s.range} — {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Per-activity ecarts */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 font-semibold text-[14px] text-slate-800">Écarts par activité</div>
          <table className="data-table">
            <thead>
              <tr><th>Activité</th><th className="text-right">Physique</th><th className="text-right">Financier</th><th className="text-right">Écart</th><th>Niveau</th><th>Action</th></tr>
            </thead>
            <tbody>
              {ecarts.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="font-mono text-[11px] text-slate-400">{a.code}</div>
                    <div className="font-medium text-[12.5px]">{a.label.substring(0, 48)}…</div>
                  </td>
                  <td className="text-right"><span className="font-bold" style={{ color: perfColor(a.avanPhysique) }}>{a.avanPhysique}%</span></td>
                  <td className="text-right"><span className="font-bold text-slate-700">{a.engagePct}%</span></td>
                  <td className="text-right">
                    <span className="font-mono font-bold" style={{ color: ecartColor(a.ecart) }}>{a.ecart > 0 ? '+' : ''}{a.ecart} pts</span>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold"
                      style={{ background: perfBg(Math.abs(a.ecart) <= 10 ? 90 : Math.abs(a.ecart) <= 20 ? 65 : 30), color: ecartColor(a.ecart) }}>
                      {ecartLabel(a.ecart)}
                    </span>
                  </td>
                  <td>
                    {Math.abs(a.ecart) > 10 && (
                      <button className="text-[11px] text-indigo-600 hover:underline" onClick={() => setShowEcartModal(true)}>Analyser</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderRisques = () => {
    const PROB_LABELS = ['', 'Peu probable', 'Possible', 'Probable', 'Très probable']
    const IMP_LABELS = ['', 'Faible', 'Modéré', 'Élevé', 'Critique']
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="section-title text-xl">Registre des Risques</h1>
          <button className="btn btn-primary btn-sm gap-1.5" onClick={() => setShowNewRiskModal(true)}><Plus size={13} />Nouveau risque</button>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Risques ouverts', v: RISKS_SE.filter(r => r.statut === 'OUVERT').length, c: '#D97706' },
            { label: 'Risques critiques', v: RISKS_SE.filter(r => r.niveau === 'CRITIQUE').length, c: '#DC2626' },
            { label: 'En traitement', v: RISKS_SE.filter(r => r.statut === 'EN_TRAITEMENT').length, c: '#1D4ED8' },
            { label: 'Sans plan d\'action', v: RISKS_SE.filter(r => !r.actions).length, c: '#DC2626' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="text-[10px] uppercase font-semibold text-slate-400">{k.label}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
        {/* Risk matrix */}
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-4">Matrice des risques — Probabilité × Impact</div>
          <div className="overflow-auto">
            <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(4, 1fr)', gap: 4, minWidth: 500 }}>
              <div />
              {IMP_LABELS.slice(1).map(h => (
                <div key={h} className="text-center text-[10.5px] font-semibold text-slate-500 pb-1">{h}</div>
              ))}
              {PROB_LABELS.slice(1).reverse().map((row, ri) => (
                <React.Fragment key={row}>
                  <div className="flex items-center text-[10.5px] font-semibold text-slate-500 pr-2 leading-tight">{row}</div>
                  {[1, 2, 3, 4].map(ci => {
                    const rIdx = 4 - ri
                    const score = rIdx + ci
                    const bg = score <= 3 ? '#DCFCE7' : score <= 5 ? '#FEF9C3' : score <= 7 ? '#FFEDD5' : '#FEE2E2'
                    const count = RISKS_SE.filter(r => r.probabilite === rIdx && r.impact === ci && r.statut !== 'CLOS').length
                    return (
                      <div key={ci} className="h-14 rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity" style={{ background: bg }}>
                        {count > 0 && (
                          <div className="text-center">
                            <div style={{ color: score >= 6 ? '#991B1B' : score >= 4 ? '#92400E' : '#166534' }}>{count}</div>
                            <div className="text-[9px] font-normal text-slate-500">risque{count > 1 ? 's' : ''}</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {/* Risk register */}
        <div className="space-y-3">
          {RISKS_SE.map(r => (
            <div key={r.id} className="bg-white rounded-xl p-5 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold"
                    style={{ background: r.niveau === 'CRITIQUE' ? '#FEE2E2' : r.niveau === 'ELEVE' ? '#FFEDD5' : r.niveau === 'MODERE' ? '#FEF9C3' : '#DCFCE7', color: r.niveau === 'CRITIQUE' ? '#991B1B' : r.niveau === 'ELEVE' ? '#9A3412' : r.niveau === 'MODERE' ? '#713F12' : '#166534' }}>
                    {r.niveau}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.id}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-[13.5px] text-slate-800">{r.label}</div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold ml-4 flex-shrink-0"
                      style={{ background: r.statut === 'CLOS' ? '#F8FAFC' : r.statut === 'EN_TRAITEMENT' ? '#EFF6FF' : '#FFF7ED', color: r.statut === 'CLOS' ? '#475569' : r.statut === 'EN_TRAITEMENT' ? '#1D4ED8' : '#C2410C' }}>
                      {r.statut}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-2 text-[11.5px]">
                    <div><span className="text-slate-400">Activité:</span> <span className="font-medium">{r.activite}</span></div>
                    <div><span className="text-slate-400">Catégorie:</span> <span className="font-medium">{r.categorie}</span></div>
                    <div><span className="text-slate-400">Prob.:</span> <span className="font-bold">{r.probabilite}/4</span></div>
                    <div><span className="text-slate-400">Impact:</span> <span className="font-bold">{r.impact}/4</span></div>
                  </div>
                  <div className="mt-2 text-[12px] text-slate-600">{r.description}</div>
                  {r.actions && <div className="mt-2 text-[12px] text-indigo-700 bg-indigo-50 rounded px-3 py-1.5">{r.actions}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderProblemes = () => (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">Problèmes / Incidents</h1>
        <button className="btn btn-primary btn-sm gap-1.5"><Plus size={13} />Déclarer un incident</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="font-bold text-amber-800 text-[13px] mb-1">⚠ Risque vs Problème</div>
          <div className="text-[12px] text-amber-700"><strong>Risque</strong> : événement potentiel qui pourrait se produire. Traitement préventif.</div>
          <div className="text-[12px] text-amber-700 mt-1"><strong>Problème</strong> : événement déjà survenu. Traitement curatif urgent.</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ouverts', v: ISSUES_SE.filter(p => p.statut !== 'RESOLU').length, c: '#DC2626' },
            { label: 'En cours', v: ISSUES_SE.filter(p => p.statut === 'EN_COURS').length, c: '#D97706' },
            { label: 'Résolus', v: ISSUES_SE.filter(p => p.statut === 'RESOLU').length, c: '#16A34A' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">{k.label}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {ISSUES_SE.map(p => (
          <div key={p.id} className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold"
                  style={{ background: p.impact === 'CRITIQUE' ? '#FEE2E2' : p.impact === 'ELEVE' ? '#FFEDD5' : '#FEF9C3', color: p.impact === 'CRITIQUE' ? '#991B1B' : p.impact === 'ELEVE' ? '#9A3412' : '#713F12' }}>
                  {p.impact}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-[13.5px] text-slate-800">{p.label}</div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold ml-4"
                    style={{ background: p.statut === 'RESOLU' ? '#DCFCE7' : '#FFF7ED', color: p.statut === 'RESOLU' ? '#16A34A' : '#C2410C' }}>
                    {p.statut}
                  </span>
                </div>
                <div className="text-[11.5px] text-slate-400 mt-0.5">{p.id} · {p.activite} · Déclaré le {p.date}</div>
                <div className="text-[12.5px] text-slate-600 mt-2">{p.description}</div>
                {p.resolution && (
                  <div className="mt-2 text-[12px] text-green-700 bg-green-50 rounded px-3 py-1.5">{p.resolution}</div>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-outline btn-sm text-[11px]">Voir détail</button>
                  {p.statut !== 'RESOLU' && <button className="btn btn-outline btn-sm text-[11px] gap-1.5" onClick={() => showToast('Action corrective créée depuis le problème ' + p.id)}><ArrowRight size={12} />Créer action corrective</button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderActions = () => (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">Actions Correctives</h1>
        <button className="btn btn-primary btn-sm gap-1.5" onClick={() => setShowNewActionModal(true)}><Plus size={13} />Nouvelle action</button>
      </div>
      {/* Progress overview */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', v: ACTIONS_SE.length, c: '#0B1C3E' },
          { label: 'En cours', v: ACTIONS_SE.filter(a => a.statut === 'EN_COURS').length, c: '#D97706' },
          { label: 'Clôturées', v: ACTIONS_SE.filter(a => a.statut === 'CLOTUREE').length, c: '#16A34A' },
          { label: 'Critiques', v: ACTIONS_SE.filter(a => a.priorite === 'CRITIQUE').length, c: '#DC2626' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="text-[10px] uppercase font-semibold text-slate-400">{k.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
        <table className="data-table">
          <thead>
            <tr><th>Anomalie source</th><th>Cause</th><th>Action</th><th>Responsable</th><th>Échéance</th><th>Priorité</th><th>Progression</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {ACTIONS_SE.map(ac => (
              <tr key={ac.id}>
                <td className="max-w-[160px] text-[11.5px] text-slate-600 leading-snug">{ac.anomalie}</td>
                <td><span className="badge text-[10px] bg-slate-100 text-slate-600">{ac.cause}</span></td>
                <td className="max-w-[200px] text-[12.5px] font-medium leading-snug">{ac.action}</td>
                <td className="text-[11.5px] text-slate-500">{ac.responsable}</td>
                <td className="font-mono text-[11.5px]">{ac.echeance}</td>
                <td>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: ac.priorite === 'CRITIQUE' ? '#FEE2E2' : ac.priorite === 'ELEVE' ? '#FFEDD5' : '#FEF9C3', color: ac.priorite === 'CRITIQUE' ? '#991B1B' : ac.priorite === 'ELEVE' ? '#9A3412' : '#713F12' }}>
                    {ac.priorite}
                  </span>
                </td>
                <td className="w-32"><ProgressBar value={ac.progression} /></td>
                <td>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: ac.statut === 'CLOTUREE' ? '#DCFCE7' : ac.statut === 'EN_COURS' ? '#FFF7ED' : '#FEF2F2', color: ac.statut === 'CLOTUREE' ? '#16A34A' : ac.statut === 'EN_COURS' ? '#D97706' : '#DC2626' }}>
                    {ac.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderEvaluations = () => {
    const evalData = selectedEval ? EVALUATIONS_SE.find(e => e.id === selectedEval) : null

    const calcScore = (e: typeof EVALUATIONS_SE[0]) => {
      return Math.round(e.physique * e.poidsPhysique / 100 + e.financier * e.poidsFinancier / 100 + e.delais * e.poidsDelais / 100 + e.qualite * e.poidsQualite / 100)
    }

    if (evalData) {
      const score = calcScore(evalData)
      return (
        <div className="p-6 space-y-5 max-w-4xl">
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[13px]" onClick={() => setSelectedEval(null)}>
            <ChevronRight size={14} className="rotate-180" />Retour aux évaluations
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="section-title text-xl">{evalData.type} — {evalData.periode}</h1>
              <div className="text-[12px] text-slate-400 mt-0.5">Rédigée par {evalData.auteur} · {evalData.date}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: evalData.statut === 'VALIDEE' ? '#DCFCE7' : '#EFF6FF', color: evalData.statut === 'VALIDEE' ? '#16A34A' : '#1D4ED8' }}>{evalData.statut}</span>
              <PerfBadge value={score} />
            </div>
          </div>
          {/* Score breakdown */}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-4">Score de performance composite</div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Physique', value: evalData.physique, poids: evalData.poidsPhysique, color: perfColor(evalData.physique) },
                { label: 'Financier', value: evalData.financier, poids: evalData.poidsFinancier, color: perfColor(evalData.financier) },
                { label: 'Délais', value: evalData.delais, poids: evalData.poidsDelais, color: perfColor(evalData.delais) },
                { label: 'Qualité', value: evalData.qualite, poids: evalData.poidsQualite, color: perfColor(evalData.qualite) },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">{s.label}</div>
                  <div className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[11px] text-slate-400">× {s.poids}% = <strong style={{ color: s.color }}>{Math.round(s.value * s.poids / 100)}</strong></div>
                  <ProgressBar value={s.value} color={s.color} />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[13px] font-semibold text-slate-600">Score global pondéré</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold" style={{ color: perfColor(score) }}>{score} / 100</div>
                <PerfBadge value={score} />
              </div>
            </div>
          </div>
          {/* Sections */}
          {[
            { title: 'Contexte de l\'évaluation', content: evalData.contexte },
            { title: 'Difficultés rencontrées', content: evalData.difficultes },
          ].map(s => (
            <div key={s.title} className="bg-white rounded-xl p-5 border border-slate-100">
              <div className="font-semibold text-[14px] text-slate-800 mb-3">{s.title}</div>
              <div className="text-[13px] text-slate-600 leading-relaxed">{s.content}</div>
            </div>
          ))}
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <div className="font-semibold text-[14px] text-slate-800 mb-3">Recommandations générées</div>
            <div className="space-y-2">
              {evalData.recommandations.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="section-title text-xl">Évaluations Périodiques</h1>
          <button className="btn btn-primary btn-sm gap-1.5"><Plus size={13} />Nouvelle évaluation</button>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {EVALUATIONS_SE.map(e => {
            const score = calcScore(e)
            return (
              <div key={e.id} className="bg-white rounded-xl p-5 border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedEval(e.id)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge text-[10.5px] px-2" style={{ background: '#EDF2FB', color: '#1B3269' }}>{e.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: e.statut === 'VALIDEE' ? '#DCFCE7' : e.statut === 'EN_COURS' ? '#FFF7ED' : '#EFF6FF', color: e.statut === 'VALIDEE' ? '#16A34A' : e.statut === 'EN_COURS' ? '#D97706' : '#1D4ED8' }}>{e.statut}</span>
                </div>
                <div className="font-bold text-[15px] text-slate-800">{e.periode}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{e.date} · {e.auteur}</div>
                <div className="mt-4 text-center">
                  <div className="text-4xl font-bold" style={{ color: perfColor(score) }}>{score}<span className="text-[20px] text-slate-400">/100</span></div>
                  <div className="text-[12px] font-semibold mt-1" style={{ color: perfColor(score) }}>{perfLabel(score)}</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { l: 'Physique', v: e.physique },
                    { l: 'Financier', v: e.financier },
                    { l: 'Délais', v: e.delais },
                    { l: 'Qualité', v: e.qualite },
                  ].map(s => (
                    <div key={s.l} className="text-[11px]">
                      <div className="flex justify-between text-slate-400 mb-0.5"><span>{s.l}</span><span className="font-bold" style={{ color: perfColor(s.v) }}>{s.v}%</span></div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.v}%`, background: perfColor(s.v) }} /></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[12px] text-indigo-600 font-semibold flex items-center gap-1">Voir le détail <ChevronRight size={13} /></div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderRecommandations = () => {
    const REC_STATUTS: Record<string, number> = {}
    recommendations.forEach(r => { REC_STATUTS[r.statut] = (REC_STATUTS[r.statut] ?? 0) + 1 })
    return (
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="section-title text-xl">Recommandations</h1>
          <button className="btn btn-primary btn-sm gap-1.5"><Plus size={13} />Nouvelle recommandation</button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(RECSTATUT).map(([k, v]) => (
            <div key={k} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-400">{v.label}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: v.color }}>{REC_STATUTS[k] ?? 0}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
          <table className="data-table">
            <thead>
              <tr><th>Référence</th><th>Recommandation</th><th>Source</th><th>Priorité</th><th>Responsable</th><th>Échéance</th><th>Avancement</th><th>Statut</th><th></th></tr>
            </thead>
            <tbody>
              {recommendations.map(r => {
                const recStatut = RECSTATUT[r.statut] ?? { label: r.statut, color: '#475569', bg: '#F8FAFC' }
                return (
                  <tr key={r.id}>
                    <td className="font-mono text-[11px] font-bold text-slate-500">{r.id}</td>
                    <td className="max-w-[240px] text-[12.5px] font-medium leading-snug">{r.texte}</td>
                    <td className="text-[11.5px] text-slate-500 max-w-[120px]">{r.source}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: r.priorite === 'CRITIQUE' ? '#FEE2E2' : r.priorite === 'HAUTE' ? '#FFEDD5' : r.priorite === 'MODERE' ? '#FEF9C3' : '#F1F5F9', color: r.priorite === 'CRITIQUE' ? '#991B1B' : r.priorite === 'HAUTE' ? '#9A3412' : r.priorite === 'MODERE' ? '#713F12' : '#475569' }}>
                        {r.priorite}
                      </span>
                    </td>
                    <td className="text-[11.5px] text-slate-500">{r.responsable}</td>
                    <td className="font-mono text-[11.5px]">{r.echeance}</td>
                    <td className="w-28"><ProgressBar value={r.avancement} /></td>
                    <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: recStatut.bg, color: recStatut.color }}>{recStatut.label}</span></td>
                    <td>
                      <button className="text-[11px] text-indigo-600 hover:underline" onClick={() => {
                        setRecommendations(prev => prev.map(rec => rec.id === r.id ? { ...rec, statut: rec.statut === 'NOUVELLE' ? 'ACCEPTEE' : rec.statut === 'ACCEPTEE' ? 'EN_COURS' : 'EN_COURS' } : rec))
                        showToast(`${r.id} mise à jour`)
                      }}>Mettre à jour</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderPAP = () => {
    const togglePAP = (id: string) => {
      setPapExpanded(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id); else next.add(id)
        return next
      })
    }
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="section-title text-xl">Suivi du PAP 2026</h1>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm gap-1.5"><Download size={13} />Exporter</button>
            <button className="btn btn-outline btn-sm gap-1.5" onClick={() => setActiveView('portfolio')}>Vue liste</button>
          </div>
        </div>
        <div className="space-y-3">
          {PAP_TREE.map(pilier => (
            <div key={pilier.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => togglePAP(pilier.id)}>
                {papExpanded.has(pilier.id) ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ background: perfColor(pilier.physique) }}>{pilier.id}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[14px] text-slate-800">{pilier.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Budget: {fmtM(pilier.budget)}</div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Physique</div>
                    <div className="font-bold text-[15px]" style={{ color: perfColor(pilier.physique) }}>{pilier.physique}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Financier</div>
                    <div className="font-bold text-[15px] text-slate-700">{pilier.financier}%</div>
                  </div>
                </div>
              </button>
              {papExpanded.has(pilier.id) && (
                <div className="border-t border-slate-100">
                  {pilier.axes.map(axe => (
                    <div key={axe.id}>
                      <button className="w-full flex items-center gap-3 px-8 py-3 text-left hover:bg-slate-50 transition-colors"
                        onClick={() => togglePAP(axe.id)}>
                        {papExpanded.has(axe.id) ? <ChevronDown size={14} className="text-slate-300" /> : <ChevronRight size={14} className="text-slate-300" />}
                        <div className="flex-1 font-medium text-[13px] text-slate-700">{axe.label}</div>
                        <div className="flex items-center gap-6 text-[12px]">
                          <span style={{ color: perfColor(axe.physique) }}>{axe.physique}% physique</span>
                          <span className="text-slate-500">{axe.financier}% financier</span>
                        </div>
                      </button>
                      {papExpanded.has(axe.id) && axe.produits.map(produit => (
                        <div key={produit.id} className="border-t border-slate-50">
                          <div className="flex items-center gap-3 px-14 py-3 bg-slate-50/50">
                            <div className="flex-1 text-[12.5px] text-slate-600 font-medium">{produit.label}</div>
                            <div className="flex items-center gap-6 text-[12px]">
                              <span style={{ color: perfColor(produit.physique) }}>{produit.physique}% physique</span>
                              <span className="text-slate-500">{produit.financier}% financier</span>
                            </div>
                          </div>
                          {produit.activites.map(actId => {
                            const act = ACTIVITIES_SE.find(a => a.id === actId)
                            if (!act) return null
                            return (
                              <div key={actId}
                                className="flex items-center gap-3 px-20 py-2.5 border-t border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => { setSelectedActivity(act.id); setActivityTab('synthese') }}>
                                <div className="flex-1">
                                  <span className="font-mono text-[11px] text-slate-400">{act.code}</span>
                                  <span className="ml-2 text-[12.5px] text-slate-700">{act.label.substring(0, 60)}…</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="w-24"><ProgressBar value={act.avanPhysique} height={4} /></div>
                                  <StatutBadge statut={act.statut} />
                                  <ChevronRight size={13} className="text-slate-300" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRapports = () => (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="section-title text-xl">Bibliothèque de Rapports</h1>
        <button className="btn btn-primary btn-sm gap-1.5" onClick={() => { setShowRapportModal(true); setRapportDone(false) }}><Plus size={13} />Générer un rapport</button>
      </div>
      {/* Workflow legend */}
      <div className="bg-white rounded-xl p-4 border border-slate-100">
        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-3">Workflow de validation</div>
        <div className="flex items-center gap-2 text-[11.5px]">
          {['Brouillon', 'Révision', 'Validation', 'Publication', 'Archivage GED'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">{step}</div>
              {i < 4 && <ArrowRight size={14} className="text-slate-300 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Report types */}
      <div className="grid grid-cols-3 gap-3">
        {['Rapport mensuel d\'exécution', 'Rapport trimestriel', 'Rapport semestriel', 'Rapport annuel', 'Rapport d\'exécution PAP', 'Rapport de performance', 'Rapport des indicateurs', 'Rapport des risques', 'Rapport des recommandations'].map(t => (
          <div key={t} className="bg-white rounded-xl p-4 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => { setRapportType(t); setShowRapportModal(true); setRapportDone(false) }}>
            <div className="flex items-center gap-3">
              <FileBarChart size={16} className="text-slate-400" />
              <span className="text-[12.5px] font-medium text-slate-700">{t}</span>
            </div>
            <Plus size={14} className="text-slate-300" />
          </div>
        ))}
      </div>
      {/* Existing reports */}
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-[14px] text-slate-800">Rapports générés</div>
        <table className="data-table">
          <thead><tr><th>Type</th><th>Période</th><th>Version</th><th>Auteur</th><th>Date</th><th>Taille</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {RAPPORTS_SE.map(r => {
              const stCfg = RPT_STATUT[r.statut] ?? { label: r.statut, color: '#475569', bg: '#F8FAFC' }
              return (
                <tr key={r.id}>
                  <td className="font-medium text-[12.5px]">{r.type}</td>
                  <td className="text-[12px] text-slate-500">{r.periode}</td>
                  <td className="font-mono text-[12px]">v{r.version}</td>
                  <td className="text-[12px] text-slate-500">{r.auteur}</td>
                  <td className="font-mono text-[12px]">{r.date}</td>
                  <td className="text-[12px] text-slate-400">{r.taille}</td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span></td>
                  <td className="flex items-center gap-2">
                    <button className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                      onClick={() => { setRapportType(r.type); setRapportPeriode(r.periode); setShowRapportPDF(true) }}>
                      <Eye size={11} />Voir
                    </button>
                    <button className="text-[11px] text-slate-500 hover:underline flex items-center gap-1"
                      onClick={() => { setRapportType(r.type); setRapportPeriode(r.periode); setShowRapportPDF(true) }}>
                      <Download size={11} />Télécharger
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderMonPortefeuille = () => (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="section-title text-xl">Mon Portefeuille</h1>
        <p className="text-[12px] text-slate-400 mt-0.5">M. KOMBILA — Responsable Suivi-Évaluation · Exercice 2026 T3</p>
      </div>
      {/* Tasks to do */}
      <div>
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Mes tâches Suivi-Évaluation</div>
        <div className="grid grid-cols-3 gap-3">
          {NOTIFICATIONS_SE.map(n => (
            <div key={n.id} className={`bg-white rounded-xl p-4 border-l-4 border ${n.urgent ? 'border-l-red-500 border-red-100' : 'border-l-slate-300 border-slate-100'} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => {
                if (n.type === 'RETARD') setActiveView('portfolio')
                else if (n.type === 'INDICATEUR') setActiveView('indicateurs')
                else if (n.type === 'RAPPORT') setActiveView('rapports')
                else if (n.type === 'ACTION') setActiveView('actions')
                else if (n.type === 'RECOMMANDATION') setActiveView('recommandations')
              }}>
              <div className="flex items-center gap-2 mb-2">
                {n.type === 'RETARD' && <Clock size={14} className="text-red-500" />}
                {n.type === 'ECART' && <AlertTriangle size={14} className="text-amber-500" />}
                {n.type === 'INDICATEUR' && <BarChart3 size={14} className="text-blue-500" />}
                {n.type === 'RAPPORT' && <FileText size={14} className="text-purple-500" />}
                {n.type === 'ACTION' && <Wrench size={14} className="text-orange-500" />}
                {n.type === 'RECOMMANDATION' && <Flag size={14} className="text-red-500" />}
                <span className="text-[10px] uppercase font-bold text-slate-400">{n.type.replace('_', ' ')}</span>
                {n.urgent && <span className="ml-auto text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">URGENT</span>}
              </div>
              <div className="font-semibold text-[12.5px] text-slate-800 leading-snug">{n.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{n.detail}</div>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-indigo-600 font-semibold">Accéder <ChevronRight size={12} /></div>
            </div>
          ))}
        </div>
      </div>
      {/* My activities */}
      <div>
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Mes activités suivies</div>
        <div className="grid grid-cols-2 gap-3">
          {ACTIVITIES_SE.slice(0, 4).map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => { setSelectedActivity(a.id); setActivityTab('synthese') }}>
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-[11px]" style={{ background: perfColor(a.score) }}>
                {a.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-slate-400">{a.code}</div>
                <div className="font-semibold text-[12.5px] text-slate-800 leading-snug truncate">{a.label}</div>
                <div className="mt-1.5"><ProgressBar value={a.avanPhysique} height={4} /></div>
              </div>
              <div className="flex-shrink-0"><StatutBadge statut={a.statut} /></div>
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming deadlines */}
      <div>
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-3">Échéances à venir</div>
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Élément</th><th>Type</th><th>Échéance</th><th>Délai</th><th>Statut</th></tr></thead>
            <tbody>
              {[
                { label: 'Rapport mensuel Juillet 2026', type: 'Rapport', echeance: '2026-08-05', delai: 'Aujourd\'hui', statut: 'EN_RETARD' },
                { label: 'AC-001 — Prestataire remplacement', type: 'Action corrective', echeance: '2026-08-15', delai: 'J-10', statut: 'EN_COURS' },
                { label: 'Saisie réalisations IND-3.4', type: 'Indicateur', echeance: '2026-08-20', delai: 'J-15', statut: 'EN_COURS' },
                { label: 'REC-004 — Données douanières', type: 'Recommandation', echeance: '2026-08-01', delai: 'J+14 — RETARD', statut: 'EN_RETARD' },
              ].map((d, i) => (
                <tr key={i}>
                  <td className="font-medium text-[12.5px]">{d.label}</td>
                  <td><span className="badge text-[10px] bg-slate-100 text-slate-600">{d.type}</span></td>
                  <td className="font-mono text-[12px]">{d.echeance}</td>
                  <td className="font-semibold text-[12px]" style={{ color: d.delai.includes('RETARD') ? '#DC2626' : '#D97706' }}>{d.delai}</td>
                  <td><StatutBadge statut={d.statut} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════════════
     MODALS
  ═══════════════════════════════════════════════════════ */
  const Modal = ({ title, onClose, children, width = 'max-w-lg' }: { title: string; onClose: () => void; children: React.ReactNode; width?: string }) => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${width}`}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-[15px]">{title}</h2>
          <button className="text-slate-400 hover:text-slate-700 p-1 rounded" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Activity 360° overlay */}
        {selectedActivity && renderActivity360()}

        {/* Views */}
        {!selectedActivity && (
          <>
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'portfolio' && renderPortfolio()}
            {activeView === 'indicateurs' && renderIndicateurs()}
            {activeView === 'physique-financier' && renderPhysiqueFinancier()}
            {activeView === 'risques' && renderRisques()}
            {activeView === 'problemes' && renderProblemes()}
            {activeView === 'actions' && renderActions()}
            {activeView === 'evaluations' && renderEvaluations()}
            {activeView === 'recommandations' && renderRecommandations()}
            {activeView === 'pap' && renderPAP()}
            {activeView === 'rapports' && renderRapports()}
            {activeView === 'mon-portefeuille' && renderMonPortefeuille()}
          </>
        )}
      </div>

      {/* Notifications panel */}
      {showNotifs && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 z-40 flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="font-semibold text-slate-800">Notifications S&E</div>
            <button className="text-slate-400 hover:text-slate-700" onClick={() => setShowNotifs(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {NOTIFICATIONS_SE.map(n => (
              <div key={n.id} className={`rounded-xl p-3.5 border cursor-pointer hover:shadow-sm transition-shadow ${n.urgent ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-white'}`}
                onClick={() => {
                  setShowNotifs(false)
                  if (n.type === 'RETARD' || n.type === 'ECART') setActiveView('portfolio')
                  else if (n.type === 'INDICATEUR') setActiveView('indicateurs')
                  else if (n.type === 'RAPPORT') setActiveView('rapports')
                  else if (n.type === 'ACTION') setActiveView('actions')
                  else if (n.type === 'RECOMMANDATION') setActiveView('recommandations')
                }}>
                <div className="font-semibold text-[12.5px] text-slate-800 leading-snug">{n.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{n.detail}</div>
                {n.urgent && <span className="mt-2 inline-block text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">Urgent</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Saisie réalisation */}
      {showSaisieModal && (
        <Modal title="Saisir une réalisation d'indicateur" onClose={() => setShowSaisieModal(false)}>
          <div className="p-5 space-y-4">
            <div><label className="form-label">Indicateur *</label>
              <select className="form-input">{INDICATORS.map(ind => <option key={ind.id}>{ind.code} — {ind.libelle}</option>)}</select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Période *</label>
                <select className="form-input"><option>T3 2026 — Juillet</option><option>T3 2026 — Août</option><option>T3 2026 — Septembre</option></select>
              </div>
              <div><label className="form-label">Valeur réalisée *</label>
                <input className="form-input" type="number" value={saisieValeur} onChange={e => setSaisieValeur(e.target.value)} placeholder="Ex: 62" />
              </div>
            </div>
            <div><label className="form-label">Source de données</label>
              <input className="form-input" value={saisieSource} onChange={e => setSaisieSource(e.target.value)} placeholder="Ex: Rapport terrain, base de données…" />
            </div>
            <div><label className="form-label">Commentaire</label>
              <textarea className="form-input" rows={2} value={saisieComment} onChange={e => setSaisieComment(e.target.value)} placeholder="Justification, contexte…" />
            </div>
            <div>
              <label className="form-label">Preuve</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 text-[12px] text-slate-400">
                Glisser-déposer ou cliquer pour télécharger
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" onClick={() => setShowSaisieModal(false)}>Annuler</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowSaisieModal(false); showToast('Brouillon sauvegardé') }}>Sauvegarder brouillon</button>
            <button className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
              disabled={!saisieValeur}
              onClick={() => { setShowSaisieModal(false); showToast('Réalisation soumise pour validation ✓') }}>
              <CheckCircle size={14} />Soumettre pour validation
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Analyse écart */}
      {showEcartModal && (
        <Modal title="Analyse d'écart Physique / Financier" onClose={() => setShowEcartModal(false)} width="max-w-2xl">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Activité concernée *</label>
                <select className="form-input">{ACTIVITIES_SE.map(a => <option key={a.id}>{a.code} — {a.label.substring(0, 40)}…</option>)}</select>
              </div>
              <div><label className="form-label">Type d'écart *</label>
                <select className="form-input"><option>Physique</option><option>Financier</option><option>Temporel</option><option>Qualitatif</option></select>
              </div>
            </div>
            <div><label className="form-label">Cause principale *</label>
              <select className="form-input">
                {['Financière', 'Administrative', 'Technique', 'Contractuelle', 'RH', 'Logistique', 'Réglementaire', 'Externe', 'Autre'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="form-label">Explication détaillée *</label>
              <textarea className="form-input" rows={3} placeholder="Décrire précisément les causes de l'écart observé…" />
            </div>
            <div><label className="form-label">Impact sur les objectifs</label>
              <textarea className="form-input" rows={2} placeholder="Impact sur les indicateurs, les délais, le budget…" />
            </div>
            <div><label className="form-label">Mesure corrective proposée</label>
              <textarea className="form-input" rows={2} placeholder="Action corrective à mettre en œuvre…" />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" onClick={() => setShowEcartModal(false)}>Annuler</button>
            <button className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
              onClick={() => { setShowEcartModal(false); showToast('Analyse d\'écart enregistrée ✓') }}>
              Enregistrer l'analyse
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Nouveau risque */}
      {showNewRiskModal && (
        <Modal title="Nouveau risque" onClose={() => setShowNewRiskModal(false)} width="max-w-xl">
          <div className="p-5 space-y-4">
            <div><label className="form-label">Description du risque *</label>
              <input className="form-input" value={newRiskForm.label} onChange={e => setNewRiskForm(f => ({ ...f, label: e.target.value }))} placeholder="Décrire le risque potentiel…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Catégorie</label>
                <select className="form-input" value={newRiskForm.categorie} onChange={e => setNewRiskForm(f => ({ ...f, categorie: e.target.value }))}>
                  {['Politique', 'RH', 'Contractuel', 'Institutionnel', 'Communication', 'Logistique', 'Financier', 'Technique'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="form-label">Propriétaire</label>
                <input className="form-input" value={newRiskForm.proprietaire} onChange={e => setNewRiskForm(f => ({ ...f, proprietaire: e.target.value }))} placeholder="Responsable du risque" />
              </div>
              <div><label className="form-label">Probabilité (1-4)</label>
                <select className="form-input" value={newRiskForm.probabilite} onChange={e => setNewRiskForm(f => ({ ...f, probabilite: e.target.value }))}>
                  <option value="1">1 — Peu probable</option><option value="2">2 — Possible</option><option value="3">3 — Probable</option><option value="4">4 — Très probable</option>
                </select>
              </div>
              <div><label className="form-label">Impact (1-4)</label>
                <select className="form-input" value={newRiskForm.impact} onChange={e => setNewRiskForm(f => ({ ...f, impact: e.target.value }))}>
                  <option value="1">1 — Faible</option><option value="2">2 — Modéré</option><option value="3">3 — Élevé</option><option value="4">4 — Critique</option>
                </select>
              </div>
            </div>
            <div><label className="form-label">Description</label>
              <textarea className="form-input" rows={2} value={newRiskForm.description} onChange={e => setNewRiskForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div><label className="form-label">Mesures préventives / Plan de traitement</label>
              <textarea className="form-input" rows={2} value={newRiskForm.actions} onChange={e => setNewRiskForm(f => ({ ...f, actions: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" onClick={() => setShowNewRiskModal(false)}>Annuler</button>
            <button className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
              disabled={!newRiskForm.label}
              onClick={() => { setShowNewRiskModal(false); showToast('Risque enregistré dans le registre ✓') }}>
              Enregistrer le risque
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Nouvelle action corrective */}
      {showNewActionModal && (
        <Modal title="Nouvelle action corrective" onClose={() => setShowNewActionModal(false)} width="max-w-xl">
          <div className="p-5 space-y-4">
            <div><label className="form-label">Anomalie source *</label>
              <input className="form-input" placeholder="Ex: ACT-3.2.1 — Retard de 24 jours sur formations…" />
            </div>
            <div><label className="form-label">Cause</label>
              <select className="form-input">{['Contractuel', 'RH', 'Financier', 'Technique', 'Administrative', 'Externe'].map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <div><label className="form-label">Action corrective *</label>
              <textarea className="form-input" rows={2} placeholder="Décrire l'action à mettre en œuvre…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Responsable *</label>
                <input className="form-input" placeholder="Nom / Structure" />
              </div>
              <div><label className="form-label">Priorité</label>
                <select className="form-input"><option>CRITIQUE</option><option>ELEVE</option><option>MODERE</option><option>FAIBLE</option></select>
              </div>
              <div><label className="form-label">Date de début</label>
                <input type="date" className="form-input" defaultValue="2026-08-01" />
              </div>
              <div><label className="form-label">Échéance *</label>
                <input type="date" className="form-input" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" onClick={() => setShowNewActionModal(false)}>Annuler</button>
            <button className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
              onClick={() => { setShowNewActionModal(false); showToast('Action corrective créée ✓') }}>
              Créer l'action
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Rapport */}
      {showRapportModal && (
        <Modal title={`Générer — ${rapportType}`} onClose={() => setShowRapportModal(false)}>
          <div className="p-5 space-y-4">
            <div><label className="form-label">Type de rapport</label>
              <select className="form-input" value={rapportType} onChange={e => setRapportType(e.target.value)}>
                {['Rapport mensuel d\'exécution', 'Rapport trimestriel', 'Rapport semestriel', 'Rapport de performance', 'Rapport des indicateurs', 'Rapport des risques', 'Rapport physique/financier'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="form-label">Période *</label>
              <select className="form-input" value={rapportPeriode} onChange={e => setRapportPeriode(e.target.value)}>
                {['Juillet 2026', 'T3 2026', 'S1 2026', 'T2 2026', 'T1 2026', 'Exercice complet 2026'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label mb-2 block">Programmes à inclure</label>
              <div className="space-y-1.5">
                {['Pilier 1', 'Pilier 2', 'Pilier 3', 'Pilier 4', 'Hors PAP'].map(p => (
                  <label key={p} className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input type="checkbox" defaultChecked={p !== 'Hors PAP'} />{p}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Format</label>
              <div className="flex gap-4 mt-1">
                {(['PDF', 'Excel'] as const).map(f => (
                  <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
                    <input type="radio" name="rpt-format" value={f} checked={rapportFormat === f} onChange={() => setRapportFormat(f)} />{f}
                  </label>
                ))}
              </div>
            </div>
            {rapportDone && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-[13px] text-green-700 font-medium flex-1">Rapport généré avec succès</span>
                <button className="btn btn-sm gap-1.5 bg-green-700 text-white border-none hover:bg-green-800" onClick={() => { setShowRapportModal(false); setShowRapportPDF(true) }}>
                  <Eye size={12} />Aperçu PDF
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
            <button className="btn btn-outline btn-sm" onClick={() => setShowRapportModal(false)}>Fermer</button>
            <button className="btn btn-sm gap-1.5" style={{ background: '#0B1C3E', color: 'white', border: 'none' }}
              disabled={rapportGenerating}
              onClick={() => {
                setRapportGenerating(true)
                setTimeout(() => { setRapportGenerating(false); setRapportDone(true) }, 1200)
              }}>
              {rapportGenerating ? <RefreshCw size={13} className="animate-spin" /> : <FileBarChart size={13} />}
              {rapportGenerating ? 'Génération…' : `Générer (${rapportFormat})`}
            </button>
          </div>
        </Modal>
      )}

      {showRapportPDF && (
        <PDFPreviewModal
          title={rapportType}
          reference={`${rapportType.replace(/\s/g, '_')}_${rapportPeriode.replace(/\s/g, '_')}`}
          docCode={`RPT-SE-${rapportType.substring(7, 10).toUpperCase()}-${rapportPeriode.replace(/\s/g, '')}`}
          onClose={() => setShowRapportPDF(false)}
        >
          <RapportSuivi type={rapportType} periode={rapportPeriode} />
        </PDFPreviewModal>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[60] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium flex items-center gap-2.5">
          <CheckCircle size={15} className="text-green-400" />{toastMsg}
        </div>
      )}
    </div>
  )
}
