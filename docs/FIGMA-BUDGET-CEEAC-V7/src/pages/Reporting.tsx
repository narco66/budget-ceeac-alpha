import { useState, useRef, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Download, FileText, Calendar, Filter, X, Check, Search,
  BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp,
  Table2, History, Send, ChevronRight, FileSpreadsheet,
  Eye, Trash2, RotateCcw, Plus,
} from 'lucide-react'
import type { Page } from '../types'

// ─── Data ────────────────────────────────────────────────────────────────────

const REPORTS = [
  // Budget
  { code: 'REP-BUD-01', titre: 'Budget initial, modifications et budget actuel', module: 'Budget', periodicite: 'À la demande', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Tableau comparatif dotations initiales vs actuelles par chapitre/article.' },
  { code: 'REP-BUD-02', titre: 'Exécution par chapitre / article / paragraphe / ligne', module: 'Budget', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Détail de l\'exécution budgétaire sur l\'ensemble de la nomenclature.' },
  { code: 'REP-BUD-03', titre: 'Exécution PAP vs Hors-PAP', module: 'Budget', periodicite: 'Mensuel/Trimestriel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Comparaison des dépenses rattachées au PAP et hors-PAP.' },
  { code: 'REP-BUD-04', titre: 'Crédits disponibles, réservés, engagés et consommés', module: 'Budget', periodicite: 'Temps réel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'État instantané de l\'utilisation des crédits par ligne budgétaire.' },
  // PAP / S&E
  { code: 'REP-PAP-01', titre: 'PAP approuvé 2026', module: 'PAP', periodicite: 'Annuel', format: 'PDF', statut: 'DISPONIBLE', desc: 'Plan Annuel de Performance officiel validé par les instances compétentes.' },
  { code: 'REP-PAP-02', titre: 'Avancement physique-financier du PAP', module: 'PAP', periodicite: 'Mensuel/Trimestriel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Suivi de l\'avancement physique couplé à l\'exécution financière par activité.' },
  { code: 'REP-PAP-03', titre: 'Indicateurs et taux d\'atteinte des cibles', module: 'S&E', periodicite: 'Trimestriel/Annuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Tableau de bord des indicateurs de performance avec tendances et écarts.' },
  { code: 'REP-SE-01', titre: 'Tableau de performance par Pilier / Axe / Produit / Activité', module: 'S&E', periodicite: 'Trimestriel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Hiérarchie complète des résultats physiques par nœud stratégique.' },
  { code: 'REP-SE-02', titre: 'Écarts, risques et mesures correctives', module: 'S&E', periodicite: 'Mensuel/Trimestriel', format: 'PDF', statut: 'DISPONIBLE', desc: 'Analyse des écarts plan-réalisé, cartographie des risques et plans d\'action.' },
  // Planification
  { code: 'REP-PLAN-01', titre: 'Structure hiérarchique du plan stratégique', module: 'Planification', periodicite: 'À la demande', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Export complet de l\'arborescence Pilier→Axe→Produit→Activité→Tâche.' },
  { code: 'REP-PLAN-02', titre: 'Avancement et pondération par exercice', module: 'Planification', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Taux d\'avancement pondéré remontant de la tâche jusqu\'au pilier.' },
  { code: 'REP-PLAN-03', titre: 'Rapport de version et journal de modifications', module: 'Planification', periodicite: 'À la demande', format: 'PDF', statut: 'DISPONIBLE', desc: 'Historique versionné du plan avec diff et workflow de validation.' },
  // Chaîne de dépense
  { code: 'REP-DEP-01', titre: 'Portefeuille de dossiers de dépense par étape', module: 'Chaîne dépense', periodicite: 'Temps réel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'État du stock de dossiers à chaque étape EB→ENG→LIQ→ORD→PAY.' },
  { code: 'REP-DEP-02', titre: 'Délais moyens et dossiers en retard', module: 'Chaîne dépense', periodicite: 'Hebdomadaire', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Analyse des temps de traitement et identification des goulots d\'étranglement.' },
  // Paiement
  { code: 'REP-PAY-01', titre: 'Ordonnancé, payé, reste à payer', module: 'Paiement', periodicite: 'Temps réel/Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Tableau de réconciliation entre ordonnancements, paiements et reliquats.' },
  { code: 'REP-PAY-02', titre: 'Paiements par tiers et mode de règlement', module: 'Paiement', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Détail des décaissements par bénéficiaire, mode et compte bancaire.' },
  { code: 'REP-PAY-03', titre: 'Rapprochement bancaire', module: 'Paiement', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'EN_GENERATION', desc: 'Réconciliation des flux GESBUDEP avec les relevés bancaires de la BEAC.' },
  // Marchés
  { code: 'REP-MAR-01', titre: 'Plan de passation des marchés 2026', module: 'Marchés', periodicite: 'Trimestriel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Tableau prévisionnel de tous les marchés à lancer, avec statuts.' },
  { code: 'REP-MAR-02', titre: 'Exécution des contrats et taux de paiement', module: 'Marchés', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'Suivi de l\'avancement contractuel et des paiements aux prestataires.' },
  // Recettes
  { code: 'REP-REC-01', titre: 'Recouvrement des contributions et recettes', module: 'Recettes', periodicite: 'Mensuel', format: 'PDF/XLSX', statut: 'DISPONIBLE', desc: 'État des contributions des États membres et recettes propres perçues.' },
  // Audit / Contrôle
  { code: 'REP-AUD-01', titre: 'Journal des actions sensibles', module: 'Audit', periodicite: 'À la demande', format: 'PDF/CSV', statut: 'DISPONIBLE', desc: 'Traçabilité complète des opérations à risque élevé pour la conformité.' },
  { code: 'REP-AUD-02', titre: 'Exceptions de séparation des fonctions', module: 'Contrôle interne', periodicite: 'Mensuel', format: 'PDF', statut: 'DISPONIBLE', desc: 'Détection des cumuls de droits incompatibles et recommandations.' },
  // Rapport annuel
  { code: 'REP-RAP-01', titre: 'Rapport Annuel de Performance 2026', module: 'PAP/S&E', periodicite: 'Annuel', format: 'PDF', statut: 'EN_PREPARATION', desc: 'RAP consolidé intégrant exécution budgétaire, physique et indicateurs.' },
]

const MODULE_META: Record<string, { bg: string; text: string; cat: string }> = {
  'Budget':          { bg: '#EDF2FB', text: '#1B3269', cat: 'budget' },
  'PAP':             { bg: '#DCFCE7', text: '#166534', cat: 'pap' },
  'PAP/S&E':         { bg: '#D1FAE5', text: '#064E3B', cat: 'pap' },
  'S&E':             { bg: '#FDF4FF', text: '#7E22CE', cat: 'se' },
  'Planification':   { bg: '#EFF6FF', text: '#1D4ED8', cat: 'plan' },
  'Chaîne dépense':  { bg: '#FEF3C7', text: '#92400E', cat: 'depense' },
  'Paiement':        { bg: '#FFF7ED', text: '#9A3412', cat: 'depense' },
  'Marchés':         { bg: '#F0FDF4', text: '#14532D', cat: 'marche' },
  'Recettes':        { bg: '#ECFDF5', text: '#065F46', cat: 'recette' },
  'Audit':           { bg: '#FEE2E2', text: '#991B1B', cat: 'audit' },
  'Contrôle interne':{ bg: '#FEF2F2', text: '#7F1D1D', cat: 'audit' },
}

const MODULES = [...new Set(REPORTS.map(r => r.module))]

// ─── Charts data ─────────────────────────────────────────────────────────────

const EXEC_DATA = [
  { mois: 'Jan', engage: 5.2, liquide: 3.4, paye: 2.8 },
  { mois: 'Fév', engage: 9.8, liquide: 6.7, paye: 5.1 },
  { mois: 'Mar', engage: 15.1, liquide: 10.4, paye: 7.9 },
  { mois: 'Avr', engage: 22.4, liquide: 15.8, paye: 11.2 },
  { mois: 'Mai', engage: 31.6, liquide: 22.3, paye: 16.7 },
  { mois: 'Jun', engage: 41.8, liquide: 30.1, paye: 22.4 },
  { mois: 'Jul', engage: 51.2, liquide: 37.9, paye: 28.6 },
  { mois: 'Aoû', engage: 57.4, liquide: 41.2, paye: 31.8 },
]

const PILIER_DATA = [
  { name: 'P1 · Intégration éco.', budget: 8240, engage: 5120, liquide: 3240, color: '#2B50A8' },
  { name: 'P2 · Paix & Sécurité',  budget: 6870, engage: 4340, liquide: 2870, color: '#1A6B3A' },
  { name: 'P3 · Dév. humain',       budget: 5340, engage: 3870, liquide: 2640, color: '#7C3AED' },
  { name: 'P4 · Institutionnel',    budget: 7440, engage: 3905, liquide: 2485, color: '#D97706' },
]

const MODULE_PIE = [
  { name: 'Budget',       value: 4, color: '#4B72C8' },
  { name: 'PAP / S&E',   value: 4, color: '#16A34A' },
  { name: 'Planification',value: 3, color: '#2563EB' },
  { name: 'Dépense',     value: 4, color: '#F59E0B' },
  { name: 'Marchés',     value: 2, color: '#059669' },
  { name: 'Audit',       value: 3, color: '#DC2626' },
]

const PERF_IND = [
  { code: 'IND-01', libelle: 'Taux de droits de douane', cible: 2.5, realise: 4.2, unite: '%', statut: 'ROUGE' },
  { code: 'IND-02', libelle: 'Textes harmonisés', cible: 8, realise: 5, unite: 'textes', statut: 'ORANGE' },
  { code: 'IND-03', libelle: 'Forums régionaux', cible: 4, realise: 2, unite: 'forums', statut: 'ORANGE' },
  { code: 'IND-04', libelle: 'Délai alertes sécurité', cible: 48, realise: 72, unite: 'h', statut: 'ROUGE' },
  { code: 'IND-05', libelle: 'Agents formés', cible: 300, realise: 45, unite: 'agents', statut: 'ROUGE' },
  { code: 'IND-06', libelle: 'Digitalisation processus', cible: 80, realise: 78, unite: '%', statut: 'VERT' },
]

// ─── History mock ─────────────────────────────────────────────────────────────

interface HistEntry {
  id: string; code: string; titre: string; date: string; user: string; format: string; size: string
}

const HIST_INIT: HistEntry[] = [
  { id: 'h1', code: 'REP-BUD-02', titre: 'Exécution par chapitre / article', date: '2026-09-12 14:32', user: 'M.C. Nkumu', format: 'PDF', size: '248 ko' },
  { id: 'h2', code: 'REP-PAP-02', titre: 'Avancement physique-financier du PAP', date: '2026-09-10 09:15', user: 'E. Lissouba', format: 'XLSX', size: '84 ko' },
  { id: 'h3', code: 'REP-SE-01', titre: 'Performance par Pilier / Axe', date: '2026-09-05 11:00', user: 'F. Al-Rashid', format: 'PDF', size: '312 ko' },
  { id: 'h4', code: 'REP-AUD-01', titre: 'Journal des actions sensibles', date: '2026-09-01 16:45', user: 'Admin', format: 'CSV', size: '56 ko' },
]

// ─── Scheduled mock ──────────────────────────────────────────────────────────

interface Scheduled {
  id: string; code: string; titre: string; nextRun: string; email: string; periodicite: string
}
const SCHED_INIT: Scheduled[] = [
  { id: 's1', code: 'REP-BUD-02', titre: 'Exécution par chapitre', nextRun: '2026-10-01', email: 'daf@ceeac-eccas.org', periodicite: 'Mensuel' },
  { id: 's2', code: 'REP-PAP-03', titre: 'Indicateurs de performance', nextRun: '2026-10-01', email: 'sg@ceeac-eccas.org', periodicite: 'Trimestriel' },
  { id: 's3', code: 'REP-DEP-02', titre: 'Délais moyens — Chaîne dépense', nextRun: '2026-09-22', email: 'cf@ceeac-eccas.org', periodicite: 'Hebdomadaire' },
]

// ─── PDF generator (per-report tailored content) ──────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
const fmtM = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n)} M FCFA`

function buildHtml(code: string, format: string): string {
  const r = REPORTS.find(x => x.code === code)!
  const now = new Date().toLocaleDateString('fr-FR')
  const common = {
    header: `<div class="header">
      <div><div class="header-title">Commission de la CEEAC</div>
      <div class="header-sub">Communauté Économique des États de l'Afrique Centrale · GESBUDEP</div></div>
      <div style="text-align:right"><div style="font-size:10px;font-weight:700">Exercice 2026</div><div style="font-size:9px;opacity:.65">${code}</div></div>
    </div>`,
    meta: `<div class="meta-bar">
      <span>Code : <strong>${code}</strong></span>
      <span>Module : <strong>${r.module}</strong></span>
      <span>Édité le : <strong>${now}</strong></span>
      <span>Format : <strong>${format}</strong></span>
    </div>`,
    title: `<div class="doc-title">${r.titre}</div><div class="doc-sub">${r.periodicite} · ${r.module}</div>`,
  }

  let body = ''
  if (code.startsWith('REP-BUD')) {
    body = `
    <h2>1. Tableau de synthèse budgétaire</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Budget total 2026</div><div class="kpi-value" style="color:#0B1C3E">${fmtM(27_890)}</div></div>
      <div class="kpi"><div class="kpi-label">Engagé</div><div class="kpi-value" style="color:#1D4ED8">62%</div></div>
      <div class="kpi"><div class="kpi-label">Liquidé</div><div class="kpi-value" style="color:#7C3AED">40%</div></div>
      <div class="kpi"><div class="kpi-label">Disponible</div><div class="kpi-value" style="color:#1A6B3A">${fmtM(10_655)}</div></div>
    </div>
    <h2>2. Exécution par pilier stratégique</h2>
    <table><thead><tr><th>Pilier</th><th>Budget (M FCFA)</th><th>Engagé</th><th>Liquidé</th><th>Payé</th><th>Disponible</th><th>Taux</th></tr></thead><tbody>
      <tr><td>P1 — Intégration économique</td><td>${fmt(8240)}</td><td>${fmt(5120)}</td><td>${fmt(3240)}</td><td>${fmt(2480)}</td><td>${fmt(3120)}</td><td>62%</td></tr>
      <tr><td>P2 — Paix &amp; Sécurité</td><td>${fmt(6870)}</td><td>${fmt(4340)}</td><td>${fmt(2870)}</td><td>${fmt(2100)}</td><td>${fmt(2530)}</td><td>63%</td></tr>
      <tr><td>P3 — Développement humain</td><td>${fmt(5340)}</td><td>${fmt(3870)}</td><td>${fmt(2640)}</td><td>${fmt(1920)}</td><td>${fmt(1470)}</td><td>72%</td></tr>
      <tr><td>P4 — Fonctionnement institutionnel</td><td>${fmt(7440)}</td><td>${fmt(3905)}</td><td>${fmt(2485)}</td><td>${fmt(1870)}</td><td>${fmt(3535)}</td><td>52%</td></tr>
      <tr style="font-weight:800"><td>TOTAL</td><td>${fmt(27890)}</td><td>${fmt(17235)}</td><td>${fmt(11235)}</td><td>${fmt(8370)}</td><td>${fmt(10655)}</td><td>62%</td></tr>
    </tbody></table>
    <h2>3. Répartition par nature économique</h2>
    <table><thead><tr><th>Nature</th><th>Dotation</th><th>Engagé</th><th>Taux</th></tr></thead><tbody>
      <tr><td>Dépenses de personnel</td><td>${fmt(6800)}</td><td>${fmt(5100)}</td><td>75%</td></tr>
      <tr><td>Biens et services</td><td>${fmt(8500)}</td><td>${fmt(4590)}</td><td>54%</td></tr>
      <tr><td>Transferts courants</td><td>${fmt(4200)}</td><td>${fmt(2310)}</td><td>55%</td></tr>
      <tr><td>Investissements</td><td>${fmt(8390)}</td><td>${fmt(5235)}</td><td>62%</td></tr>
    </tbody></table>`
  } else if (code.startsWith('REP-PAP') || code.startsWith('REP-SE')) {
    body = `
    <h2>1. Synthèse des performances</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Avancement physique</div><div class="kpi-value" style="color:#D97706">62%</div></div>
      <div class="kpi"><div class="kpi-label">Indicateurs verts</div><div class="kpi-value" style="color:#16A34A">1</div></div>
      <div class="kpi"><div class="kpi-label">Indicateurs orange</div><div class="kpi-value" style="color:#D97706">2</div></div>
      <div class="kpi"><div class="kpi-label">Indicateurs rouges</div><div class="kpi-value" style="color:#DC2626">3</div></div>
    </div>
    <h2>2. Tableau des indicateurs</h2>
    <table><thead><tr><th>Code</th><th>Indicateur</th><th>Cible 2026</th><th>Réalisé</th><th>Taux</th><th>Statut</th></tr></thead><tbody>
      <tr><td>IND-01</td><td>Taux moyen droits de douane</td><td>2,5%</td><td>4,2%</td><td>60%</td><td>🔴 ROUGE</td></tr>
      <tr><td>IND-02</td><td>Textes harmonisés adoptés</td><td>8</td><td>5</td><td>63%</td><td>🟠 ORANGE</td></tr>
      <tr><td>IND-03</td><td>Forums régionaux organisés</td><td>4</td><td>2</td><td>50%</td><td>🟠 ORANGE</td></tr>
      <tr><td>IND-04</td><td>Délai réponse alertes (h)</td><td>48h</td><td>72h</td><td>67%</td><td>🔴 ROUGE</td></tr>
      <tr><td>IND-05</td><td>Agents formés</td><td>300</td><td>45</td><td>15%</td><td>🔴 ROUGE</td></tr>
      <tr><td>IND-06</td><td>Taux digitalisation processus</td><td>80%</td><td>78%</td><td>98%</td><td>🟢 VERT</td></tr>
    </tbody></table>
    <h2>3. Recommandations</h2>
    <ol style="font-size:10px;line-height:1.9;color:#374151">
      <li>Accélérer l'exécution P3 (formation) — plan de rattrapage urgent.</li>
      <li>Mobiliser les reliquats P4 avant clôture T3.</li>
      <li>Renforcer le suivi mensuel des indicateurs IND-04 et IND-05.</li>
      <li>Activer les plans de mitigation pour risques critiques (score ≥ 12).</li>
    </ol>`
  } else if (code.startsWith('REP-PLAN')) {
    body = `
    <h2>1. Structure du plan stratégique 2026</h2>
    <table><thead><tr><th>Code</th><th>Libellé</th><th>Niveau</th><th>Avancement</th><th>Poids</th><th>Statut nœud</th></tr></thead><tbody>
      <tr><td>P01</td><td>Intégration économique et commerciale</td><td>Pilier</td><td>64%</td><td>30%</td><td>Actif</td></tr>
      <tr><td>P01-A01</td><td>Zone de libre-échange régionale</td><td>Axe</td><td>58%</td><td>40%</td><td>Actif</td></tr>
      <tr><td>P01-A01-PR01</td><td>Harmonisation des tarifs douaniers</td><td>Produit</td><td>45%</td><td>50%</td><td>Actif</td></tr>
      <tr><td>P02</td><td>Paix, Sécurité et Stabilité régionale</td><td>Pilier</td><td>58%</td><td>25%</td><td>Actif</td></tr>
      <tr><td>P03</td><td>Développement humain et social</td><td>Pilier</td><td>73%</td><td>25%</td><td>Actif</td></tr>
      <tr><td>P04</td><td>Fonctionnement institutionnel</td><td>Pilier</td><td>52%</td><td>20%</td><td>Actif</td></tr>
    </tbody></table>
    <h2>2. Versions actives par exercice</h2>
    <table><thead><tr><th>Exercice</th><th>Version active</th><th>Statut</th><th>Date publication</th><th>Auteur</th></tr></thead><tbody>
      <tr><td>2025</td><td>v2.0</td><td>Archivée</td><td>2025-01-15</td><td>DAF · M.C. Nkumu</td></tr>
      <tr><td>2026</td><td>v1.2</td><td>Publiée</td><td>2026-01-10</td><td>DAF · M.C. Nkumu</td></tr>
      <tr><td>2027</td><td>v0.4 (brouillon)</td><td>En vérification</td><td>—</td><td>RP · F. Al-Rashid</td></tr>
    </tbody></table>`
  } else if (code.startsWith('REP-DEP')) {
    body = `
    <h2>1. Stock de dossiers par étape</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">EB en traitement</div><div class="kpi-value" style="color:#0B1C3E">34</div></div>
      <div class="kpi"><div class="kpi-label">Engagements en cours</div><div class="kpi-value" style="color:#1D4ED8">28</div></div>
      <div class="kpi"><div class="kpi-label">Liquidations</div><div class="kpi-value" style="color:#7C3AED">19</div></div>
      <div class="kpi"><div class="kpi-label">Délai moyen (j)</div><div class="kpi-value" style="color:#D97706">12</div></div>
    </div>
    <h2>2. Dossiers en retard (&gt; délai réglementaire)</h2>
    <table><thead><tr><th>Référence</th><th>Étape</th><th>Structure</th><th>Jours écoulés</th><th>Délai max</th><th>Dépassement</th></tr></thead><tbody>
      <tr><td>EB-2026-004523</td><td>Validation DAF</td><td>DCP</td><td>18</td><td>15</td><td>+3 j</td></tr>
      <tr><td>ENG-2026-003756</td><td>Visa CF</td><td>DGIP</td><td>22</td><td>10</td><td>+12 j</td></tr>
      <tr><td>LIQ-2026-001234</td><td>Certification service fait</td><td>DRH</td><td>35</td><td>20</td><td>+15 j</td></tr>
    </tbody></table>`
  } else if (code.startsWith('REP-PAY')) {
    body = `
    <h2>1. Situation des paiements</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Ordonnancé</div><div class="kpi-value" style="color:#0B1C3E">${fmtM(11_235)}</div></div>
      <div class="kpi"><div class="kpi-label">Payé</div><div class="kpi-value" style="color:#1A6B3A">${fmtM(8_370)}</div></div>
      <div class="kpi"><div class="kpi-label">Reste à payer</div><div class="kpi-value" style="color:#D97706">${fmtM(2_865)}</div></div>
      <div class="kpi"><div class="kpi-label">Taux paiement</div><div class="kpi-value" style="color:#7C3AED">74%</div></div>
    </div>
    <h2>2. Paiements par mode de règlement</h2>
    <table><thead><tr><th>Mode</th><th>Nb ordres</th><th>Montant (M FCFA)</th><th>%</th></tr></thead><tbody>
      <tr><td>Virement BEAC</td><td>142</td><td>${fmt(7245)}</td><td>87%</td></tr>
      <tr><td>Chèque banque</td><td>23</td><td>${fmt(890)}</td><td>11%</td></tr>
      <tr><td>Caisse régie</td><td>12</td><td>${fmt(235)}</td><td>3%</td></tr>
    </tbody></table>`
  } else {
    body = `
    <h2>1. Synthèse</h2>
    <p style="font-size:10.5px;color:#374151;line-height:1.8">${r.desc}</p>
    <h2>2. Données de l'exercice 2026</h2>
    <table><thead><tr><th>Rubrique</th><th>Valeur</th><th>Commentaire</th></tr></thead><tbody>
      <tr><td>Période couverte</td><td>Janv. – Août 2026</td><td>8 mois sur 12</td></tr>
      <tr><td>Modules concernés</td><td>${r.module}</td><td>${r.periodicite}</td></tr>
      <tr><td>Statut</td><td>${r.statut}</td><td>Généré automatiquement</td></tr>
    </tbody></table>`
  }

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${r.titre} — CEEAC</title>
<style>
  body{font-family:Arial,sans-serif;font-size:11px;color:#1E293B;margin:0;padding:0}
  @media print{@page{margin:18mm 14mm;size:A4}}
  .header{background:#0B1C3E;color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
  .header-title{font-size:13px;font-weight:800;letter-spacing:.06em}
  .header-sub{font-size:9.5px;color:rgba(255,255,255,.6);margin-top:2px}
  .content{padding:20px 24px}
  .doc-title{font-size:17px;font-weight:800;color:#0B1C3E;text-align:center;text-transform:uppercase;letter-spacing:.04em;margin:12px 0 3px}
  .doc-sub{font-size:10.5px;color:#1A6B3A;text-align:center;font-weight:600;margin-bottom:14px}
  .meta-bar{border:1px solid #E2E8F0;border-radius:5px;padding:7px 12px;background:#F8FAFC;display:flex;gap:20px;font-size:9.5px;color:#6B7280;margin-bottom:14px;flex-wrap:wrap}
  .meta-bar span strong{color:#1E293B}
  h2{font-size:10.5px;font-weight:700;color:#0B1C3E;background:#EDF2FB;padding:5px 10px;border-left:3px solid #0B1C3E;margin:14px 0 8px;text-transform:uppercase;letter-spacing:.04em}
  table{width:100%;border-collapse:collapse;font-size:9.5px;margin-bottom:12px}
  th{background:#0B1C3E;color:white;padding:6px 8px;text-align:left;font-weight:700}
  td{padding:5px 8px;border-bottom:1px solid #F1F5F9}
  tr:nth-child(even) td{background:#F8FAFC}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
  .kpi{border:1px solid #E2E8F0;border-radius:5px;padding:10px;text-align:center}
  .kpi-label{font-size:8.5px;color:#9CA3AF;text-transform:uppercase;font-weight:700}
  .kpi-value{font-size:20px;font-weight:800;margin:3px 0}
  .sig-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}
  .sig{border:1px solid #E2E8F0;border-radius:5px;padding:10px 12px;text-align:center;font-size:9px}
  .sig-title{font-weight:700;color:#0B1C3E;font-size:9.5px}
  .sig-line{border-top:1px dashed #CBD5E1;margin:12px 0 3px}
  .footer{background:#F8FAFC;border-top:2px solid #0B1C3E;padding:7px 24px;display:flex;justify-content:space-between;font-size:8.5px;color:#9CA3AF;margin-top:16px}
</style></head><body>
${common.header}
<div class="content">
${common.title}
${common.meta}
${body}
<div class="sig-row">
  <div class="sig"><div class="sig-title">Responsable Module</div><div style="color:#374151;margin:3px 0">M.C. Nkumu</div><div class="sig-line"></div><div>${now}</div></div>
  <div class="sig"><div class="sig-title">Directeur de Programme</div><div style="color:#374151;margin:3px 0">E. Lissouba</div><div class="sig-line"></div><div>En attente</div></div>
  <div class="sig"><div class="sig-title">Secrétaire Général</div><div style="color:#374151;margin:3px 0">Dr. J-B. Ondaye</div><div class="sig-line"></div><div>En attente</div></div>
</div>
</div>
<div class="footer">
  <span>GESBUDEP 2026 — Commission de la CEEAC</span>
  <span>${code} · Édité le ${now}</span>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'catalogue' | 'historique' | 'planification'

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: string }) {
  const s =
    statut === 'DISPONIBLE' ? { bg: '#DCFCE7', color: '#166534', label: 'Disponible', icon: <CheckCircle2 size={10} /> } :
    statut === 'EN_GENERATION' ? { bg: '#FEF3C7', color: '#92400E', label: 'En génération', icon: <RotateCcw size={10} className="animate-spin" /> } :
    { bg: '#DBEAFE', color: '#1D4ED8', label: 'En préparation', icon: <Clock size={10} /> }
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.icon}{s.label}
    </span>
  )
}

function IndBar({ code, libelle, cible, realise, unite, statut }: typeof PERF_IND[0]) {
  const pct = Math.min(100, Math.round((realise / cible) * 100))
  const c = statut === 'VERT' ? '#16A34A' : statut === 'ORANGE' ? '#D97706' : '#DC2626'
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="font-mono text-[10.5px] text-gray-400 w-14 flex-shrink-0">{code}</span>
      <span className="text-[12px] text-gray-700 flex-1 min-w-0 truncate">{libelle}</span>
      <div className="w-28 flex-shrink-0">
        <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
          <span>{realise} {unite}</span>
          <span>{cible} {unite}</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c }} />
        </div>
      </div>
      <span className="font-bold text-[12px] w-10 text-right" style={{ color: c }}>{pct}%</span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Reporting({ onNavigate: _onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [genFormat, setGenFormat] = useState<Record<string, 'PDF' | 'XLSX' | 'CSV'>>({})
  const [history, setHistory] = useState<HistEntry[]>(HIST_INIT)
  const [scheduled, setScheduled] = useState<Scheduled[]>(SCHED_INIT)
  const [showPlanifier, setShowPlanifier] = useState(false)
  const [planCode, setPlanCode] = useState('')
  const [planDate, setPlanDate] = useState('')
  const [planEmail, setPlanEmail] = useState('')
  const [planPerio, setPlanPerio] = useState('Mensuel')
  const [planSaved, setPlanSaved] = useState(false)

  // Close filter on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilterPanel(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Filtered catalogue — module filter uses "contains" to match compound modules like "PAP/S&E"
  const filtered = REPORTS.filter(r => {
    const matchMod = !filterModule || r.module.includes(filterModule) || filterModule.includes(r.module)
    const matchSearch = !search || r.titre.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())
    return matchMod && matchSearch
  })

  const disponibles = REPORTS.filter(r => r.statut === 'DISPONIBLE').length
  const enGeneration = REPORTS.filter(r => r.statut === 'EN_GENERATION').length
  const enPrep = REPORTS.filter(r => r.statut === 'EN_PREPARATION').length

  const doGenerate = (code: string) => {
    const r = REPORTS.find(x => x.code === code)!
    const format = genFormat[code] ?? 'PDF'
    setGenerating(code)
    setTimeout(() => {
      setGenerating(null)
      const html = buildHtml(code, format)
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      if (!win) { const a = document.createElement('a'); a.href = url; a.download = `${code}.html`; a.click() }
      URL.revokeObjectURL(url)
      const sizes: Record<string, string> = { PDF: '248 ko', XLSX: '84 ko', CSV: '36 ko' }
      const user = 'Utilisateur courant'
      setHistory(prev => [
        { id: `h${Date.now()}`, code, titre: r.titre, date: new Date().toLocaleString('fr-FR'), user, format, size: sizes[format] ?? '—' },
        ...prev,
      ])
    }, 900)
  }

  const saveSchedule = () => {
    const r = REPORTS.find(x => x.code === planCode)!
    setScheduled(prev => [...prev, { id: `s${Date.now()}`, code: planCode, titre: r.titre, nextRun: planDate, email: planEmail, periodicite: planPerio }])
    setPlanSaved(true)
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart3 size={14} /> },
    { id: 'catalogue', label: 'Catalogue', icon: <Table2 size={14} /> },
    { id: 'historique', label: `Historique (${history.length})`, icon: <History size={14} /> },
    { id: 'planification', label: `Planifiés (${scheduled.length})`, icon: <Send size={14} /> },
  ]

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Reporting institutionnel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bibliothèque des états et rapports — Exercice 2026</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setShowPlanifier(true); setPlanSaved(false); setPlanCode(''); setPlanDate(''); setPlanEmail(''); setPlanPerio('Mensuel') }}
        >
          <Plus size={13} /> Planifier un envoi
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Rapports disponibles', value: disponibles, color: '#16A34A', icon: <CheckCircle2 size={16} /> },
          { label: 'En génération', value: enGeneration, color: '#D97706', icon: <RotateCcw size={16} /> },
          { label: 'En préparation', value: enPrep, color: '#2563EB', icon: <Clock size={16} /> },
          { label: 'Envois planifiés', value: scheduled.length, color: '#7E22CE', icon: <Send size={16} /> },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3 flex items-center gap-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: k.color + '18', color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors -mb-px ${tab === t.id ? 'border-navy-900 text-navy-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">

            {/* Execution curve */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-[14px] text-gray-800">Courbe d'exécution 2026</div>
                  <div className="text-[11px] text-gray-400">Cumul mensuel (Milliards FCFA)</div>
                </div>
                <TrendingUp size={16} className="text-navy-700" />
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={EXEC_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="B" />
                  <Tooltip formatter={(v: number) => [`${v} Mrd FCFA`]} labelStyle={{ fontSize: 11 }} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="engage" name="Engagé" stroke="#2B50A8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="liquide" name="Liquidé" stroke="#7C3AED" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="paye" name="Payé" stroke="#1A6B3A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pilier bars */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-[14px] text-gray-800">Budget par pilier stratégique</div>
                  <div className="text-[11px] text-gray-400">Millions FCFA — exercice 2026</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={PILIER_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 9 }} unit="M" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip formatter={(v: number) => [`${fmt(v)} M FCFA`]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="budget" name="Budget" fill="#B8CFF0" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="engage" name="Engagé" fill="#2B50A8" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="liquide" name="Liquidé" fill="#1A6B3A" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">

            {/* Module pie */}
            <div className="card p-5">
              <div className="font-semibold text-[14px] text-gray-800 mb-1">Répartition par module</div>
              <div className="text-[11px] text-gray-400 mb-3">{REPORTS.length} rapports au catalogue</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={MODULE_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={38}>
                    {MODULE_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Performance indicators */}
            <div className="card p-5 col-span-2">
              <div className="font-semibold text-[14px] text-gray-800 mb-1">Indicateurs de performance clés</div>
              <div className="text-[11px] text-gray-400 mb-3">Taux d'atteinte des cibles 2026</div>
              <div className="space-y-0 divide-y divide-gray-50">
                {PERF_IND.map(ind => <IndBar key={ind.code} {...ind} />)}
              </div>
            </div>
          </div>

          {/* Quick access */}
          <div className="card p-5">
            <div className="font-semibold text-[14px] text-gray-800 mb-3">Rapports fréquents</div>
            <div className="grid grid-cols-3 gap-3">
              {REPORTS.filter(r => r.statut === 'DISPONIBLE').slice(0, 6).map(r => {
                const mc = MODULE_META[r.module] ?? { bg: '#F1F5F9', text: '#475569' }
                return (
                  <button
                    key={r.code}
                    className="flex items-start gap-3 p-3 rounded-xl text-left transition-colors hover:bg-gray-50 border border-gray-100"
                    onClick={() => { setTab('catalogue') }}
                  >
                    <FileText size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-gray-800 truncate leading-tight">{r.titre}</div>
                      <span className="inline-block text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full mt-1" style={{ background: mc.bg, color: mc.text }}>{r.module}</span>
                    </div>
                    <ChevronRight size={12} className="flex-shrink-0 mt-0.5 text-gray-300 ml-auto" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CATALOGUE ── */}
      {tab === 'catalogue' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un rapport…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input pl-8 py-2 text-[13px]"
              />
              {search && <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setSearch('')}><X size={12} /></button>}
            </div>

            <div className="relative" ref={filterRef}>
              <button
                className={`btn btn-outline btn-sm ${filterModule ? 'ring-1 ring-navy-700' : ''}`}
                onClick={() => setShowFilterPanel(v => !v)}
              >
                <Filter size={13} /> {filterModule || 'Module'} {filterModule && <span className="w-1.5 h-1.5 rounded-full bg-navy-700 inline-block ml-0.5" />}
              </button>
              {showFilterPanel && (
                <div className="absolute left-0 top-9 w-52 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                  <button className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 text-gray-500 border-b border-gray-100" onClick={() => { setFilterModule(''); setShowFilterPanel(false) }}>
                    Tous les modules
                  </button>
                  {MODULES.map(m => (
                    <button key={m} className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 flex items-center justify-between ${filterModule === m ? 'font-semibold text-navy-900 bg-navy-50' : 'text-gray-700'}`}
                      onClick={() => { setFilterModule(m); setShowFilterPanel(false) }}>
                      {m} {filterModule === m && <Check size={11} className="text-navy-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[12px] text-gray-400 ml-1">{filtered.length} rapport{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Titre</th>
                  <th>Module</th>
                  <th>Périodicité</th>
                  <th>Format</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const mc = MODULE_META[r.module] ?? { bg: '#F1F5F9', text: '#475569' }
                  const fmtOptions = r.format.split('/') as ('PDF' | 'XLSX' | 'CSV')[]
                  const selected = genFormat[r.code] ?? fmtOptions[0]
                  return (
                    <tr key={i}>
                      <td><span className="font-mono text-[11.5px] font-semibold text-navy-900">{r.code}</span></td>
                      <td>
                        <div className="flex items-start gap-2">
                          <FileText size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-[12.5px] text-gray-800 leading-tight">{r.titre}</div>
                            <div className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">{r.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge text-[10px] px-2 py-0.5" style={{ background: mc.bg, color: mc.text }}>{r.module}</span></td>
                      <td className="text-[11.5px] text-gray-600 whitespace-nowrap">{r.periodicite}</td>
                      <td>
                        {fmtOptions.length > 1 ? (
                          <select
                            className="text-[11px] border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600"
                            value={selected}
                            disabled={r.statut !== 'DISPONIBLE'}
                            onChange={e => setGenFormat(prev => ({ ...prev, [r.code]: e.target.value as 'PDF' | 'XLSX' | 'CSV' }))}
                          >
                            {fmtOptions.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        ) : (
                          <span className="font-mono text-[11px] text-gray-500">{r.format}</span>
                        )}
                      </td>
                      <td><StatutBadge statut={r.statut} /></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="btn btn-outline btn-sm text-[11px] gap-1"
                            disabled={r.statut !== 'DISPONIBLE' || generating === r.code}
                            style={{ opacity: r.statut !== 'DISPONIBLE' ? 0.4 : 1 }}
                            onClick={() => doGenerate(r.code)}
                          >
                            {generating === r.code ? <><RotateCcw size={11} className="animate-spin" /> Génération…</> : <><Download size={11} /> Générer</>}
                          </button>
                          <button
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 flex-shrink-0"
                            disabled={r.statut !== 'DISPONIBLE'}
                            title="Planifier l'envoi"
                            onClick={() => { setPlanCode(r.code); setShowPlanifier(true); setPlanSaved(false); setPlanDate(''); setPlanEmail(''); setPlanPerio('Mensuel') }}
                          >
                            <Send size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-gray-400 text-sm">
                <FileText size={28} className="mx-auto mb-2 opacity-30" />
                Aucun rapport correspondant aux critères
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HISTORIQUE ── */}
      {tab === 'historique' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[14px] text-gray-800">Historique des générations</div>
            <span className="text-[12px] text-gray-400">{history.length} entrées</span>
          </div>
          {history.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              <History size={28} className="mx-auto mb-2 opacity-30" />
              Aucune génération enregistrée
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date / heure</th>
                  <th>Code rapport</th>
                  <th>Titre</th>
                  <th>Format</th>
                  <th>Taille</th>
                  <th>Générateur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td className="font-mono text-[11px] text-gray-500 whitespace-nowrap">{h.date}</td>
                    <td><span className="font-mono text-[11.5px] font-semibold text-navy-900">{h.code}</span></td>
                    <td className="text-[12.5px] text-gray-700 max-w-[260px] truncate">{h.titre}</td>
                    <td>
                      <span className="flex items-center gap-1 text-[11px] text-gray-600">
                        {h.format === 'PDF' ? <FileText size={11} className="text-red-400" /> : <FileSpreadsheet size={11} className="text-green-500" />}
                        {h.format}
                      </span>
                    </td>
                    <td className="text-[11px] text-gray-400">{h.size}</td>
                    <td className="text-[12px] text-gray-600">{h.user}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="btn btn-outline btn-sm text-[11px] gap-1" onClick={() => doGenerate(h.code)}>
                          <Eye size={11} /> Re-générer
                        </button>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                          onClick={() => setHistory(prev => prev.filter(x => x.id !== h.id))}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── PLANIFICATION ── */}
      {tab === 'planification' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="font-semibold text-[14px] text-gray-800">Envois planifiés</div>
            <button className="btn btn-primary btn-sm" onClick={() => { setShowPlanifier(true); setPlanSaved(false); setPlanCode(''); setPlanDate(''); setPlanEmail(''); setPlanPerio('Mensuel') }}>
              <Plus size={13} /> Nouvel envoi
            </button>
          </div>
          {scheduled.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              <Send size={28} className="mx-auto mb-2 opacity-30" />
              Aucun envoi planifié
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code rapport</th>
                  <th>Titre</th>
                  <th>Prochain envoi</th>
                  <th>Périodicité</th>
                  <th>Destinataire</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduled.map(s => (
                  <tr key={s.id}>
                    <td><span className="font-mono text-[11.5px] font-semibold text-navy-900">{s.code}</span></td>
                    <td className="text-[12.5px] text-gray-700 max-w-[220px] truncate">{s.titre}</td>
                    <td className="font-mono text-[11px] text-gray-600">{s.nextRun}</td>
                    <td>
                      <span className="badge text-[10px] px-2 py-0.5" style={{ background: '#EDF2FB', color: '#1B3269' }}>{s.periodicite}</span>
                    </td>
                    <td className="text-[12px] text-gray-600">{s.email}</td>
                    <td>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                        onClick={() => setScheduled(prev => prev.filter(x => x.id !== s.id))}>
                        <Trash2 size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── MODAL PLANIFIER ── */}
      {showPlanifier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white rounded-2xl w-[460px] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EDF2FB' }}>
                  <Send size={15} style={{ color: '#1B3269' }} />
                </div>
                <h3 className="font-semibold text-[15px] text-gray-900">Planifier un envoi</h3>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400" onClick={() => setShowPlanifier(false)}>
                <X size={14} />
              </button>
            </div>

            {planSaved ? (
              <div className="flex flex-col items-center gap-3 py-10 px-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                  <Check size={22} className="text-green-600" />
                </div>
                <div className="text-[15px] font-semibold text-gray-800">Envoi planifié</div>
                <div className="text-[13px] text-gray-500 text-center">
                  Le rapport <strong>{planCode}</strong> sera envoyé à <strong>{planEmail}</strong> le <strong>{planDate}</strong> puis <strong>{planPerio.toLowerCase()}ement</strong>.
                </div>
                <button className="btn btn-outline btn-sm mt-2" onClick={() => setShowPlanifier(false)}>Fermer</button>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="form-label">Rapport à planifier <span className="text-red-500">*</span></label>
                  <select className="form-input text-[13px]" value={planCode} onChange={e => setPlanCode(e.target.value)}>
                    <option value="">— Choisir un rapport —</option>
                    {REPORTS.filter(r => r.statut === 'DISPONIBLE').map(r => (
                      <option key={r.code} value={r.code}>{r.code} — {r.titre}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Date de début <span className="text-red-500">*</span></label>
                    <input type="date" className="form-input text-[13px]" value={planDate} onChange={e => setPlanDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Périodicité</label>
                    <select className="form-input text-[13px]" value={planPerio} onChange={e => setPlanPerio(e.target.value)}>
                      {['Quotidien', 'Hebdomadaire', 'Mensuel', 'Trimestriel', 'Annuel', 'À la demande'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Destinataire e-mail <span className="text-red-500">*</span></label>
                  <input type="email" className="form-input text-[13px]" placeholder="prenom.nom@ceeac-eccas.org" value={planEmail} onChange={e => setPlanEmail(e.target.value)} />
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl text-[11.5px]" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                  Le rapport sera généré automatiquement et envoyé par e-mail à la date programmée.
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button className="btn btn-outline btn-sm" onClick={() => setShowPlanifier(false)}>Annuler</button>
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={!planCode || !planDate || !planEmail}
                    onClick={saveSchedule}
                  >
                    <Calendar size={13} /> Confirmer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
