import { useState, useMemo } from 'react'
import {
  Building2, ChevronRight, ChevronDown, Search, Filter,
  Database, BarChart3, AlertCircle, CheckCircle, Clock,
  FileText, Users, Layers, TrendingUp, DollarSign,
  BookOpen, Shield, Activity, Info, Download, RefreshCw,
  TreePine, Landmark, Briefcase, Globe, Leaf, Home,
  Cpu, Heart, Scale
} from 'lucide-react'
import type { NavProps } from '../types'

type OrgTab = 'arborescence' | 'organigramme' | 'fiche' | 'regles'
type BudgetTab = 'budget' | 'pap' | 'a-completer' | 'qualite'
type MainTab = 'org' | 'budget'

interface OrgUnit {
  code: string
  libelle: string
  niveau: number
  type: 'commission' | 'presidence' | 'vice-presidence' | 'sg' | 'departement' | 'cabinet' | 'direction' | 'service' | 'bureau' | 'centre' | 'etat-major' | 'composante'
  children?: OrgUnit[]
  responsableFonction?: string
  expanded?: boolean
}

interface BudgetChapter {
  code: string
  libelle: string
  total: number
  ceeac: number
  ptf: number
  isPAP: boolean
  statut: 'PUBLIE' | 'VALIDE' | 'EN_CONTROLE' | 'IMPORTE'
}

interface PilierPAP {
  code: string
  numero: number
  libelle: string
  totalBudget: number
  ceeacBudget: number
  ptfBudget: number
  axes: AxePAP[]
}

interface AxePAP {
  code: string
  libelle: string
  total: number
  ceeac: number
  ptf: number
}

const ORG_TREE: OrgUnit[] = [
  {
    code: 'COM-CEEAC', libelle: 'Commission de la CEEAC', niveau: 1,
    type: 'commission', responsableFonction: 'Président de la Commission',
    children: [
      {
        code: 'DPRES', libelle: 'Présidence de la Commission', niveau: 2,
        type: 'presidence', responsableFonction: 'Président de la Commission',
        children: [
          {
            code: 'DPRES-CAB', libelle: 'Cabinet du Président', niveau: 3, type: 'cabinet',
            responsableFonction: 'Directeur de Cabinet',
            children: [
              { code: 'DPRES-CAB-DIRCAB', libelle: 'Direction du Cabinet', niveau: 4, type: 'direction', responsableFonction: 'Directeur de Cabinet' },
              { code: 'DPRES-CAB-CONS', libelle: 'Conseillers du Président', niveau: 4, type: 'bureau', responsableFonction: 'Conseiller' },
              { code: 'DPRES-CAB-SCOUR', libelle: 'Service Courrier', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              {
                code: 'DPRES-CAB-BCJ', libelle: 'Bureau du Conseiller Juridique', niveau: 4, type: 'bureau',
                responsableFonction: 'Conseiller Juridique',
                children: [
                  { code: 'DPRES-BCJ-SCADS', libelle: 'Service Conventions, Accords et Documents solennels', niveau: 5, type: 'service', responsableFonction: 'Chef de Service' },
                  { code: 'DPRES-BCJ-SARC', libelle: 'Service Affaires réglementaires et contentieuses', niveau: 5, type: 'service', responsableFonction: 'Chef de Service' },
                ]
              },
            ]
          },
          {
            code: 'DPRES-ACC', libelle: 'Agence Comptable Centrale', niveau: 3, type: 'centre',
            responsableFonction: 'Agent Comptable Central',
            children: [
              { code: 'DPRES-ACC-SCPT', libelle: 'Service Comptabilité', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPRES-ACC-SCPP', libelle: 'Service Comptabilité des projets et programmes', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPRES-ACC-SRT', libelle: 'Service Recouvrement et Trésorerie', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DPRES-AI', libelle: 'Audit Interne', niveau: 3, type: 'centre',
            responsableFonction: 'Auditeur Interne',
            children: [
              { code: 'DPRES-AI-SAI', libelle: 'Service Audit Interne', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPRES-AI-SAPP', libelle: "Service Audit des projets et programmes", niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DPRES-CFC', libelle: 'Contrôle Financier Central', niveau: 3, type: 'centre',
            responsableFonction: 'Contrôleur Financier Central',
            children: [
              { code: 'DPRES-CFC-SCF', libelle: 'Service Contrôle Financier', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPRES-CFC-SCFPP', libelle: 'Service Contrôle financier des programmes et projets', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          { code: 'DPRES-BL', libelle: 'Bureaux de Liaison', niveau: 3, type: 'bureau', responsableFonction: 'Chef de Bureau de Liaison' },
        ]
      },
      {
        code: 'DVPRES', libelle: 'Vice-Présidence', niveau: 2, type: 'vice-presidence',
        responsableFonction: 'Vice-Président de la Commission',
        children: [
          {
            code: 'DVPRES-CAB', libelle: 'Cabinet du Vice-Président', niveau: 3, type: 'cabinet',
            responsableFonction: 'Chef de Cabinet',
            children: [
              { code: 'DVPRES-CAB-CHCAB', libelle: 'Chef de Cabinet', niveau: 4, type: 'bureau', responsableFonction: 'Chef de Cabinet' },
              { code: 'DVPRES-CAB-CE', libelle: "Chargés d'études", niveau: 4, type: 'bureau', responsableFonction: "Chargé d'études" },
            ]
          }
        ]
      },
      {
        code: 'DSG', libelle: 'Secrétariat Général', niveau: 2, type: 'sg',
        responsableFonction: 'Secrétaire Général',
        children: [
          {
            code: 'DSG-DCRPP', libelle: 'Direction Communication, Relations publiques et Protocole', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DSG-DCRPP-SCRP', libelle: 'Service Communication et Relations publiques', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DCRPP-CDA', libelle: 'Centre de Documentation et des Archives', niveau: 4, type: 'centre', responsableFonction: 'Chef de Centre' },
              { code: 'DSG-DCRPP-SPC', libelle: 'Service Protocole et Cérémonial', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DCRPP-STI', libelle: 'Service Traduction et Interprétariat', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DSG-DCMR', libelle: 'Direction Coopération et Mobilisation des ressources', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DSG-DCMR-SCOOP', libelle: 'Service Coopération', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DCMR-SMR', libelle: 'Service Mobilisation des ressources', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DSG-DPPB', libelle: 'Direction Planification, Programmes et Budget', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DSG-DPPB-SPSE', libelle: 'Service Planification et Suivi-évaluation', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DPPB-SPP', libelle: 'Service Programmes et Projets', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DPPB-SB', libelle: 'Service Budget', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DSG-DRHMG', libelle: 'Direction Ressources humaines et Moyens généraux', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DSG-DRHMG-SARH', libelle: 'Service Administration des ressources humaines', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DRHMG-SDRH', libelle: 'Service Développement des ressources humaines', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DRHMG-SMG', libelle: 'Service Moyens généraux', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DSG-DSI', libelle: "Direction des Systèmes d'information", niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DSG-DSI-SED', libelle: 'Service Études et Développement', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DSG-DSI-SEM', libelle: 'Service Exploitation et Maintenance', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
        ]
      },
      {
        code: 'DAPPS', libelle: 'Département Affaires politiques, Paix et Sécurité', niveau: 2, type: 'departement',
        responsableFonction: 'Commissaire, Chef de Département',
        children: [
          {
            code: 'DAPPS-DAP', libelle: 'Direction des Affaires politiques', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DAPPS-DAP-SEGDH', libelle: 'Service Élections, Gouvernance démocratique et Droits humains', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DAPPS-DAP-SMDP', libelle: 'Service Médiation et Diplomatie préventive', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DAPPS-DMARAC', libelle: 'Direction MARAC et Sécurité', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DAPPS-DMARAC-SOBD', libelle: 'Service Observation et Banque de données', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DAPPS-DMARAC-SEA', libelle: 'Service Évaluation et Analyses', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DAPPS-DMARAC-SSEC', libelle: 'Service Sécurité', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DAPPS-EMR', libelle: 'État-Major Régional', niveau: 3, type: 'etat-major',
            responsableFonction: "Chef d'État-Major Régional",
            children: [
              { code: 'DAPPS-EMR-CMIL', libelle: 'Composante militaire', niveau: 4, type: 'composante', responsableFonction: 'Chef de Composante' },
              { code: 'DAPPS-EMR-CPG', libelle: 'Composante Police/Gendarmerie', niveau: 4, type: 'composante', responsableFonction: 'Chef de Composante' },
              { code: 'DAPPS-EMR-CCIV', libelle: 'Composante civile', niveau: 4, type: 'composante', responsableFonction: 'Chef de Composante' },
              { code: 'DAPPS-EMR-CAS', libelle: 'Composante Appui et Soutien', niveau: 4, type: 'composante', responsableFonction: 'Chef de Composante' },
            ]
          },
        ]
      },
      {
        code: 'DMCAEMF', libelle: 'Département Marché commun, Affaires économiques, monétaires et financières', niveau: 2, type: 'departement',
        responsableFonction: 'Commissaire, Chef de Département',
        children: [
          {
            code: 'DMCAEMF-DAEM', libelle: 'Direction des Affaires économiques et monétaires', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DMCAEMF-DAEM-SPEMF', libelle: 'Service Politiques économiques, monétaires et fiscales', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DMCAEMF-DAEM-SIPSP', libelle: 'Service Industrie et Promotion du secteur privé', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DMCAEMF-DPES', libelle: 'Direction des Prévisions économiques et des Statistiques', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DMCAEMF-DPES-SAPE', libelle: 'Service Analyses et Prévisions économiques', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DMCAEMF-DPES-SGBD', libelle: 'Service Gestion des bases de données', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DMCAEMF-DMC', libelle: 'Direction du Marché commun', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DMCAEMF-DMC-SADFE', libelle: 'Service Affaires douanières et Facilitation des échanges', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DMCAEMF-DMC-SPCCPI', libelle: 'Service Politique commerciale, Concurrence et Promotion des investissements', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DMCAEMF-DMC-SLCD', libelle: "Service Libre circulation et Droits d'établissement", niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
        ]
      },
      {
        code: 'DENRADR', libelle: 'Département Environnement, Ressources naturelles, Agriculture et Développement rural', niveau: 2, type: 'departement',
        responsableFonction: 'Commissaire, Chef de Département',
        children: [
          {
            code: 'DENRADR-DERN', libelle: 'Direction Environnement et Ressources naturelles', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DENRADR-DERN-SGRN', libelle: 'Service Gestion des ressources naturelles', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DENRADR-DERN-SEB', libelle: 'Service Environnement et Biodiversité', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DENRADR-DERN-SGRC', libelle: 'Service Gestion des risques et catastrophes', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DENRADR-DADR', libelle: 'Direction Agriculture et Développement rural', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DENRADR-DADR-SAAN', libelle: 'Service Agriculture, Alimentation et Nutrition', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DENRADR-DADR-SEP', libelle: 'Service Élevage et Pêche', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DENRADR-DADR-SDR', libelle: 'Service Développement rural', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DENRADR-CRCGRE', libelle: 'Centre régional de coordination et de gestion des ressources en eau', niveau: 3, type: 'centre',
            responsableFonction: 'Chef de Centre',
            children: [
              { code: 'DENRADR-CRCGRE-SGSIE', libelle: "Service Gestion du système d'information sur l'eau", niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DENRADR-CRCGRE-SPRD', libelle: 'Service Politiques, Recherche et Développement', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
        ]
      },
      {
        code: 'DATI', libelle: 'Département Aménagement du territoire et Infrastructures', niveau: 2, type: 'departement',
        responsableFonction: 'Commissaire, Chef de Département',
        children: [
          {
            code: 'DATI-DATT', libelle: 'Direction Aménagement du territoire et Transports', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DATI-DATT-SAT', libelle: 'Service Aménagement du territoire', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DATI-DATT-STRFF', libelle: 'Service Transport routier, ferroviaire et fluvial', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DATI-DATT-STAM', libelle: 'Service Transport aérien et maritime', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DATI-DPTEN', libelle: 'Direction Postes, Télécommunications et Économie numérique', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DATI-DPTEN-SPT', libelle: 'Service Postes et Télécommunications', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DATI-DPTEN-SEN', libelle: 'Service Économie numérique', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DATI-DENER', libelle: "Direction de l'Énergie", niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DATI-DENER-SRS', libelle: 'Service Réglementation et Statistiques', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DATI-DENER-SENR', libelle: 'Service Énergies nouvelles et renouvelables', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
        ]
      },
      {
        code: 'DPGDHS', libelle: 'Département Promotion du genre, Développement humain et social', niveau: 2, type: 'departement',
        responsableFonction: 'Commissaire, Chef de Département',
        children: [
          {
            code: 'DPGDHS-DGPF', libelle: 'Direction Genre et Promotion de la femme', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DPGDHS-DGPF-SGRC', libelle: 'Service Genre et Renforcement des capacités', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPGDHS-DGPF-SPF', libelle: 'Service Promotion de la femme', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DPGDHS-DSAS', libelle: 'Direction Santé et Affaires sociales', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DPGDHS-DSAS-SS', libelle: 'Service Santé', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPGDHS-DSAS-SAS', libelle: 'Service Affaires sociales', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DPGDHS-DJSE', libelle: 'Direction Jeunesse, Sports et Emploi', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DPGDHS-DJSE-SJS', libelle: 'Service Jeunesse et Sports', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPGDHS-DJSE-SE', libelle: 'Service Emploi', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
          {
            code: 'DPGDHS-DECDT', libelle: 'Direction Éducation, Culture et Développement technologique', niveau: 3, type: 'direction',
            responsableFonction: 'Directeur',
            children: [
              { code: 'DPGDHS-DECDT-SEDT', libelle: 'Service Éducation et Développement technologique', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
              { code: 'DPGDHS-DECDT-SC', libelle: 'Service Culture', niveau: 4, type: 'service', responsableFonction: 'Chef de Service' },
            ]
          },
        ]
      },
    ]
  }
]

// Montants en FCFA (valeurs du PDF × 1 000 — le tableau PAP est exprimé en kFCFA)
const PAP_PILIERS: PilierPAP[] = [
  {
    code: '201', numero: 1,
    libelle: 'Intégration politique, Paix et Sécurité',
    totalBudget: 1750000000, ceeacBudget: 1750000000, ptfBudget: 0,
    axes: [
      { code: '2011', libelle: 'Renforcer la Gouvernance politique', total: 655000000, ceeac: 655000000, ptf: 0 },
      { code: '2012', libelle: 'Maintenir, rétablir et consolider la Paix en Afrique Centrale', total: 885000000, ceeac: 885000000, ptf: 0 },
      { code: '2013', libelle: 'Prévenir les conflits et crises en Afrique Centrale', total: 210000000, ceeac: 210000000, ptf: 0 },
    ]
  },
  {
    code: '202', numero: 2,
    libelle: 'Intégration économique et commerciale',
    totalBudget: 3095000000, ceeacBudget: 1750000000, ptfBudget: 1345000000,
    axes: [
      { code: '2021', libelle: 'Opérationnaliser le marché commun régional', total: 890000000, ceeac: 625000000, ptf: 265000000 },
      { code: '2022', libelle: 'Améliorer la gouvernance économique et environnement des affaires', total: 275000000, ceeac: 275000000, ptf: 0 },
      { code: '2023', libelle: 'Renforcer les capacités productives et innovation', total: 1490000000, ceeac: 510000000, ptf: 980000000 },
      { code: '2024', libelle: 'Opérationaliser le système statistique de la Communauté', total: 440000000, ceeac: 340000000, ptf: 100000000 },
    ]
  },
  {
    code: '203', numero: 3,
    libelle: 'Aménagement du territoire, développement des Infrastructures et Intégration physique',
    totalBudget: 11172061000, ceeacBudget: 1000000000, ptfBudget: 10172061000,
    axes: [
      { code: '2031', libelle: 'Aménager le territoire communautaire et développer des infrastructures de transport', total: 6928536000, ceeac: 290000000, ptf: 6638536000 },
      { code: '2032', libelle: "Accélérer la mise en place d'un marché régional de l'Énergie", total: 3142525000, ceeac: 500000000, ptf: 2642525000 },
      { code: '2033', libelle: "Accélérer l'intégration régionale numérique", total: 1101000000, ceeac: 210000000, ptf: 891000000 },
    ]
  },
  {
    code: '204', numero: 4,
    libelle: 'Intégration environnementale, Agriculture, Transformation productive et Agro industrielle',
    totalBudget: 2907120000, ceeacBudget: 1000000000, ptfBudget: 1907120000,
    axes: [
      { code: '2041', libelle: 'Agriculture, Développement Rural et Sécurité Alimentaire et Nutritionnelle', total: 855020000, ceeac: 340000000, ptf: 515020000 },
      { code: '2042', libelle: 'Environnement, Ressources Naturelles, Biodiversité et Changement Climatique', total: 2052100000, ceeac: 660000000, ptf: 1392100000 },
    ]
  },
  {
    code: '205', numero: 5,
    libelle: 'Promotion du genre, intégration humaine et sociale',
    totalBudget: 1956100000, ceeacBudget: 1350000000, ptfBudget: 606100000,
    axes: [
      { code: '2051', libelle: 'Renforcer les systèmes communautaires de santé, de protection sociale et de résilience sanitaire', total: 1026100000, ceeac: 420000000, ptf: 606100000 },
      { code: '2052', libelle: "Faciliter l'inclusion socio-économique des jeunes et promouvoir les politiques communautaires en matière de sport et d'emploi", total: 150000000, ceeac: 150000000, ptf: 0 },
      { code: '2053', libelle: "Faciliter l'intégration systématique du genre dans les politiques communautaires et l'autonomisation des femmes", total: 110000000, ceeac: 110000000, ptf: 0 },
      { code: '2054', libelle: 'Transformer les systèmes éducatifs, scientifiques, technologiques et culturels', total: 520000000, ceeac: 520000000, ptf: 0 },
      { code: '2055', libelle: 'Renforcer les cadres de gestion des migrations, de protection des réfugiés et asile', total: 150000000, ceeac: 150000000, ptf: 0 },
    ]
  },
  {
    code: '206', numero: 6,
    libelle: 'Poursuite de la réforme et renforcement de la gouvernance institutionnelle',
    totalBudget: 1485000000, ceeacBudget: 1485000000, ptfBudget: 0,
    axes: [
      { code: '2061', libelle: 'Réviser les textes fondamentaux et adopter les textes application subséquents', total: 135000000, ceeac: 135000000, ptf: 0 },
      { code: '2062', libelle: 'Améliorer les capacités opérationnelles (humaines, matérielles et financières)', total: 362000000, ceeac: 362000000, ptf: 0 },
      { code: '2063', libelle: 'Renforcer les mécanismes de communication, de planification et de contrôle', total: 792000000, ceeac: 792000000, ptf: 0 },
      { code: '2064', libelle: 'Assurer la coordination et le renforcement des cadres de coopération et de mobilisation des ressources', total: 196000000, ceeac: 196000000, ptf: 0 },
    ]
  },
]

// Masse budgétaire 2026 conforme au document BUDGET_EXERCICE_2026_Final.pdf
// FONCTIONNEMENT = 13 677 514 803 FCFA
// INVESTISSEMENT  = 25 887 281 000 FCFA (PAP 22 365 281 000 + Assises 1 525 000 000 + Dotations instit. 1 997 000 000)
// ÉQUIPEMENTS     =    741 000 000 FCFA
// TOTAL           = 40 305 795 803 FCFA
const BUDGET_CHAPTERS: BudgetChapter[] = [
  // — FONCTIONNEMENT —
  { code: '66',    libelle: 'Dépenses du personnel',                                total: 11586264803, ceeac: 11586264803, ptf: 0,           isPAP: false, statut: 'PUBLIE' },
  { code: '60-61', libelle: 'Dépenses de biens et services',                        total: 1871250000,  ceeac: 1871250000,  ptf: 0,           isPAP: false, statut: 'PUBLIE' },
  { code: '64',    libelle: 'Dépenses de transferts de fonctionnement',              total: 210000000,   ceeac: 210000000,   ptf: 0,           isPAP: false, statut: 'PUBLIE' },
  { code: '67',    libelle: 'Charges financières de la dette',                       total: 10000000,    ceeac: 10000000,    ptf: 0,           isPAP: false, statut: 'PUBLIE' },
  // — INVESTISSEMENT —
  { code: 'PAP',   libelle: 'PAP — Plan Annuel de Performance (Programmes/Projets)', total: 22365281000, ceeac: 8335000000,  ptf: 14030281000, isPAP: true,  statut: 'PUBLIE' },
  { code: '209',   libelle: 'Assises statutaires et autres dépenses d\'investissement', total: 1525000000, ceeac: 1525000000, ptf: 0,          isPAP: true,  statut: 'PUBLIE' },
  { code: '63',    libelle: 'Dotations spéciales aux institutions spécialisées',    total: 1997000000,  ceeac: 1997000000,  ptf: 0,           isPAP: true,  statut: 'PUBLIE' },
  // — ÉQUIPEMENTS —
  { code: '21-24', libelle: "Dépenses d'équipements",                               total: 741000000,   ceeac: 741000000,   ptf: 0,           isPAP: false, statut: 'PUBLIE' },
]

const DATA_QUALITY = [
  { referentiel: 'Référentiel organisationnel', complet: 95, aCompleter: 5, statut: 'PUBLIE', source: 'Référentiel_organisationnel_Commission_CEEAC_2026.pdf', dateImport: '2026-06-15' },
  { referentiel: 'Budget 2026 — Fonctionnement', complet: 100, aCompleter: 0, statut: 'PUBLIE', source: 'BUDGET_EXERCICE_2026_Final.pdf', dateImport: '2026-06-15' },
  { referentiel: 'Budget 2026 — Investissement/PAP', complet: 78, aCompleter: 22, statut: 'IMPORTE', source: 'BUDGET_EXERCICE_2026_Final.pdf', dateImport: '2026-06-15' },
  { referentiel: 'PAP — Tâches opérationnelles', complet: 0, aCompleter: 100, statut: 'A_COMPLETER', source: 'Non disponible dans le document officiel', dateImport: '—' },
  { referentiel: 'PAP — Indicateurs chiffrés', complet: 35, aCompleter: 65, statut: 'A_COMPLETER', source: 'Partiellement dans BUDGET_EXERCICE_2026_Final.pdf', dateImport: '2026-06-15' },
  { referentiel: 'PAP — Responsables opérationnels', complet: 0, aCompleter: 100, statut: 'A_COMPLETER', source: 'Non disponible dans le document officiel', dateImport: '—' },
  { referentiel: 'PAP — Calendriers d\'exécution', complet: 0, aCompleter: 100, statut: 'A_COMPLETER', source: 'Non disponible dans le document officiel', dateImport: '—' },
]

const MISSING_DATA = [
  { domaine: 'PAP', niveau: 'Tâche', description: 'Aucune tâche opérationnelle renseignée dans le budget officiel', nombre: 'Toutes', priorite: 'HAUTE' },
  { domaine: 'PAP', niveau: 'Responsable', description: 'Responsables opérationnels des activités PAP non fournis', nombre: 'Toutes activités', priorite: 'HAUTE' },
  { domaine: 'PAP', niveau: 'Indicateur', description: 'Valeurs de référence (baseline) et cibles 2026 manquantes pour la majorité des indicateurs', nombre: '>200', priorite: 'HAUTE' },
  { domaine: 'PAP', niveau: 'Calendrier', description: "Dates de début et fin d'activité non renseignées", nombre: 'Toutes activités', priorite: 'MOYENNE' },
  { domaine: 'PAP', niveau: 'Source de vérification', description: 'Sources de vérification des indicateurs absentes', nombre: '>150', priorite: 'MOYENNE' },
  { domaine: 'Organisation', niveau: 'Responsable titulaire', description: 'Noms des titulaires des fonctions non fournis dans le référentiel', nombre: 'Toutes structures', priorite: 'HAUTE' },
  { domaine: 'Organisation', niveau: 'Coordonnées', description: 'Adresses, téléphones et courriels des structures non renseignés', nombre: 'Toutes structures', priorite: 'BASSE' },
  { domaine: 'Budget', niveau: 'Centre de coût', description: 'Correspondance lignes budgétaires ↔ structures org. à valider', nombre: 'Partielle', priorite: 'MOYENNE' },
]

const REGLES = [
  { code: 'ORG-001', libelle: 'Unicité', description: 'Le code d\'une structure doit être unique dans une version organisationnelle.' },
  { code: 'ORG-002', libelle: 'Absence de cycle', description: 'Une structure ne peut être son propre parent, directement ou indirectement.' },
  { code: 'ORG-003', libelle: 'Historisation', description: 'Toute modification de rattachement, de libellé officiel ou de niveau hiérarchique doit être historisée.' },
  { code: 'ORG-004', libelle: 'Non-suppression', description: 'Une structure déjà utilisée dans un PAP, un budget, un engagement ou une opération financière ne peut pas être supprimée physiquement.' },
  { code: 'ORG-005', libelle: 'Structure active', description: "Une opération ne peut être créée que pour une structure active à la date de l'opération." },
  { code: 'ORG-006', libelle: 'Responsable unique', description: "Une fonction de responsabilité principale ne doit avoir qu'un titulaire actif pour une même période, sauf collégialité explicitement définie." },
  { code: 'ORG-007', libelle: 'Affectations datées', description: 'Toute affectation, délégation, suppléance ou intérim possède une date de début et une date de fin.' },
  { code: 'ORG-008', libelle: 'Réorganisation', description: 'Le transfert, la fusion, la scission ou le changement de rattachement doit conserver les opérations historiques dans leur structure d\'origine.' },
  { code: 'ORG-009', libelle: 'Périmètre financier', description: 'Une structure ne peut imputer une dépense que sur les centres de coût, budgets et sources de financement autorisés.' },
  { code: 'ORG-010', libelle: 'Séparation des fonctions', description: "La DSI, l'Audit interne, le Contrôle financier, l'Agence comptable et les structures initiatrices disposent de permissions distinctes." },
]

function formatMontant(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

function getTypeIcon(type: OrgUnit['type']) {
  switch (type) {
    case 'commission': return <Globe size={14} className="text-white" />
    case 'presidence': return <Landmark size={14} className="text-blue-700" />
    case 'vice-presidence': return <Landmark size={14} className="text-indigo-600" />
    case 'sg': return <Briefcase size={14} className="text-green-700" />
    case 'departement': return <Layers size={14} className="text-orange-600" />
    case 'direction': return <Building2 size={14} className="text-slate-600" />
    case 'cabinet': return <Home size={14} className="text-purple-600" />
    case 'service': return <Activity size={14} className="text-slate-500" />
    case 'bureau': return <FileText size={14} className="text-slate-500" />
    case 'centre': return <Cpu size={14} className="text-teal-600" />
    case 'etat-major': return <Shield size={14} className="text-red-600" />
    case 'composante': return <Users size={14} className="text-red-400" />
    default: return <Building2 size={14} className="text-slate-500" />
  }
}

function getTypeBadge(type: OrgUnit['type']) {
  const map: Record<string, string> = {
    commission: 'bg-navy-100 text-[#0B1C3E]',
    presidence: 'bg-blue-100 text-blue-800',
    'vice-presidence': 'bg-indigo-100 text-indigo-800',
    sg: 'bg-green-100 text-green-800',
    departement: 'bg-orange-100 text-orange-800',
    direction: 'bg-slate-100 text-slate-700',
    cabinet: 'bg-purple-100 text-purple-800',
    service: 'bg-gray-100 text-gray-700',
    bureau: 'bg-gray-100 text-gray-700',
    centre: 'bg-teal-100 text-teal-800',
    'etat-major': 'bg-red-100 text-red-800',
    composante: 'bg-red-50 text-red-700',
  }
  return map[type] || 'bg-gray-100 text-gray-700'
}

function countUnits(units: OrgUnit[]): number {
  return units.reduce((acc, u) => acc + 1 + (u.children ? countUnits(u.children) : 0), 0)
}

function flattenUnits(units: OrgUnit[]): OrgUnit[] {
  return units.reduce<OrgUnit[]>((acc, u) => {
    acc.push(u)
    if (u.children) acc.push(...flattenUnits(u.children))
    return acc
  }, [])
}

function TreeNodeComp({ unit, expanded, onToggle, onSelect, selected, searchQ }: {
  unit: OrgUnit
  expanded: Set<string>
  onToggle: (code: string) => void
  onSelect: (u: OrgUnit) => void
  selected: string | null
  searchQ: string
}) {
  const hasChildren = unit.children && unit.children.length > 0
  const isExpanded = expanded.has(unit.code)
  const isSelected = selected === unit.code
  const matched = !searchQ || unit.libelle.toLowerCase().includes(searchQ.toLowerCase()) || unit.code.toLowerCase().includes(searchQ.toLowerCase())

  const indent = (unit.niveau - 1) * 20

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'} ${!matched && searchQ ? 'opacity-40' : ''}`}
        style={{ marginLeft: indent }}
        onClick={() => onSelect(unit)}
      >
        <button
          className="w-4 h-4 flex items-center justify-center shrink-0"
          onClick={e => { e.stopPropagation(); if (hasChildren) onToggle(unit.code) }}
        >
          {hasChildren ? (isExpanded ? <ChevronDown size={12} className="text-gray-500" /> : <ChevronRight size={12} className="text-gray-500" />) : <span className="w-3" />}
        </button>
        <span className="shrink-0">{getTypeIcon(unit.type)}</span>
        <span className="font-mono text-xs text-gray-400 shrink-0">{unit.code}</span>
        <span className={`text-xs flex-1 ${isSelected ? 'font-medium text-[#0B1C3E]' : 'text-gray-700'}`}>{unit.libelle}</span>
      </div>
      {hasChildren && isExpanded && unit.children!.map(child => (
        <TreeNodeComp key={child.code} unit={child} expanded={expanded} onToggle={onToggle} onSelect={onSelect} selected={selected} searchQ={searchQ} />
      ))}
    </div>
  )
}

function getPilierColor(n: number) {
  const colors = [
    'from-[#0B1C3E] to-blue-800',
    'from-green-800 to-green-600',
    'from-orange-700 to-orange-500',
    'from-emerald-800 to-teal-600',
    'from-purple-800 to-purple-600',
    'from-slate-700 to-slate-500',
  ]
  return colors[(n - 1) % colors.length]
}

export default function Referentiel({ onNavigate }: NavProps) {
  const [mainTab, setMainTab] = useState<MainTab>('org')
  const [orgTab, setOrgTab] = useState<OrgTab>('arborescence')
  const [budgetTab, setBudgetTab] = useState<BudgetTab>('budget')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['COM-CEEAC', 'DPRES', 'DVPRES', 'DSG']))
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [expandedPilier, setExpandedPilier] = useState<string | null>('201')
  const [showStatut, setShowStatut] = useState<string>('all')

  const toggleExpand = (code: string) => {
    setExpanded(prev => {
      const n = new Set(prev)
      if (n.has(code)) n.delete(code); else n.add(code)
      return n
    })
  }

  const allUnits = useMemo(() => flattenUnits(ORG_TREE), [])
  const totalUnits = useMemo(() => countUnits(ORG_TREE), [])

  const totalBudget = 40305795803
  const totalFonctionnement = 13677514803   // Personnel + Biens&Svcs + Transferts + Charges fin.
  const totalInvestissement = 25887281000   // PAP + Assises + Dotations institutions spécialisées
  const totalPAP = 22365281000             // volet PAP seul (= somme des 6 piliers)

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#0B1C3E]">Référentiels officiels de la CEEAC</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Source unique · Version 1.0 · Juin 2026 · Document de travail consolidé — à valider
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded">
            <AlertCircle size={11} /> Codes applicatifs à valider avant consécration officielle
          </span>
          <button className="flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50">
            <Download size={12} /> Exporter
          </button>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
        <button
          onClick={() => setMainTab('org')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${mainTab === 'org' ? 'bg-[#0B1C3E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Building2 size={14} /> Référentiel organisationnel
        </button>
        <button
          onClick={() => setMainTab('budget')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${mainTab === 'budget' ? 'bg-[#0B1C3E] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <DollarSign size={14} /> Référentiel budgétaire 2026
        </button>
      </div>

      {/* ===================== RÉFÉRENTIEL ORGANISATIONNEL ===================== */}
      {mainTab === 'org' && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Structures totales', value: totalUnits.toString(), icon: <Building2 size={16} />, color: 'text-[#0B1C3E]' },
              { label: 'Départements techniques', value: '5', icon: <Layers size={16} />, color: 'text-orange-600' },
              { label: 'Directions', value: '20', icon: <FileText size={16} />, color: 'text-blue-700' },
              { label: 'Services', value: '45+', icon: <Activity size={16} />, color: 'text-green-700' },
              { label: 'Complétude', value: '95%', icon: <CheckCircle size={16} />, color: 'text-green-600' },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className={`${k.color} mb-1`}>{k.icon}</div>
                <div className="text-xl font-bold text-[#0B1C3E]">{k.value}</div>
                <div className="text-xs text-gray-500">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {([
              ['arborescence', 'Arborescence', <TreePine size={12} />],
              ['organigramme', 'Organigramme', <Users size={12} />],
              ['fiche', 'Fiche structure', <FileText size={12} />],
              ['regles', 'Règles de gestion', <Shield size={12} />],
            ] as [OrgTab, string, React.ReactNode][]).map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setOrgTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${orgTab === id ? 'border-[#0B1C3E] text-[#0B1C3E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Arborescence */}
          {orgTab === 'arborescence' && (
            <div className="flex gap-4">
              <div className="w-2/3 bg-white border border-gray-200 rounded-lg">
                <div className="p-3 border-b border-gray-100 flex gap-2">
                  <div className="flex-1 relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      placeholder="Rechercher une structure ou un code..."
                      value={searchQ}
                      onChange={e => setSearchQ(e.target.value)}
                    />
                  </div>
                  <button
                    className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                    onClick={() => setExpanded(new Set(allUnits.map(u => u.code)))}
                  >Tout développer</button>
                  <button
                    className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                    onClick={() => setExpanded(new Set(['COM-CEEAC']))}
                  >Réduire</button>
                </div>
                <div className="p-3 max-h-[60vh] overflow-y-auto text-sm">
                  {ORG_TREE.map(unit => (
                    <TreeNodeComp
                      key={unit.code} unit={unit}
                      expanded={expanded} onToggle={toggleExpand}
                      onSelect={u => { setSelectedUnit(u); setOrgTab('fiche') }}
                      selected={selectedUnit?.code ?? null}
                      searchQ={searchQ}
                    />
                  ))}
                </div>
              </div>
              <div className="w-1/3 space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Légende des niveaux</h3>
                  {[
                    { niveau: 'N1', libelle: 'Commission', color: 'bg-[#0B1C3E]' },
                    { niveau: 'N2', libelle: 'Présidence / VP / SG / Département', color: 'bg-blue-600' },
                    { niveau: 'N3', libelle: 'Cabinet / Direction / État-Major / Centre', color: 'bg-orange-500' },
                    { niveau: 'N4', libelle: 'Bureau / Service / Composante', color: 'bg-green-500' },
                    { niveau: 'N5', libelle: 'Sous-service / Unité', color: 'bg-gray-400' },
                  ].map(lv => (
                    <div key={lv.niveau} className="flex items-center gap-2 mb-1.5">
                      <span className={`${lv.color} text-white text-xs font-bold px-1.5 py-0.5 rounded`}>{lv.niveau}</span>
                      <span className="text-xs text-gray-600">{lv.libelle}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1"><Info size={12} /> Statut du référentiel</h3>
                  <p className="text-xs text-amber-700">Version fonctionnelle consolidée destinée à l'implémentation. Les codes et rattachements doivent être validés avant leur adoption officielle.</p>
                  <div className="mt-2 text-xs text-amber-600">Version 1.0 · Juin 2026</div>
                </div>
              </div>
            </div>
          )}

          {/* Organigramme */}
          {orgTab === 'organigramme' && (
            <div className="overflow-x-auto">
              <div className="min-w-[900px] space-y-4">
                {/* Présidence */}
                <div className="flex justify-center">
                  <div className="bg-[#0B1C3E] text-white rounded-lg p-3 text-center w-72 shadow">
                    <div className="font-bold text-sm">Commission de la CEEAC</div>
                    <div className="text-xs text-blue-300 mt-0.5">COM-CEEAC</div>
                    <div className="text-xs text-blue-200 mt-1">Président de la Commission</div>
                  </div>
                </div>
                {/* Level 2 */}
                <div className="flex gap-3 justify-center flex-wrap">
                  {[
                    { code: 'DPRES', label: 'Présidence', color: 'bg-blue-700', role: 'Président' },
                    { code: 'DVPRES', label: 'Vice-Présidence', color: 'bg-indigo-700', role: 'Vice-Président' },
                    { code: 'DSG', label: 'Secrétariat Général', color: 'bg-green-700', role: 'Secrétaire Général' },
                    { code: 'DAPPS', label: 'DAPPS — Paix & Sécurité', color: 'bg-red-700', role: 'Commissaire' },
                    { code: 'DMCAEMF', label: 'DMCAEMF — Écon.', color: 'bg-amber-700', role: 'Commissaire' },
                    { code: 'DENRADR', label: 'DENRADR — Env.', color: 'bg-emerald-700', role: 'Commissaire' },
                    { code: 'DATI', label: 'DATI — Infrastructures', color: 'bg-orange-700', role: 'Commissaire' },
                    { code: 'DPGDHS', label: 'DPGDHS — Genre', color: 'bg-purple-700', role: 'Commissaire' },
                  ].map(u => (
                    <div key={u.code} className={`${u.color} text-white rounded p-2.5 text-center w-44 cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                      onClick={() => {
                        const found = allUnits.find(x => x.code === u.code)
                        if (found) { setSelectedUnit(found); setOrgTab('fiche') }
                      }}
                    >
                      <div className="font-semibold text-xs">{u.label}</div>
                      <div className="font-mono text-xs opacity-70 mt-0.5">{u.code}</div>
                      <div className="text-xs opacity-80 mt-1">{u.role}</div>
                    </div>
                  ))}
                </div>
                {/* Structures rattachées Présidence */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Structures spécialisées rattachées à la Présidence</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: 'DPRES-ACC', label: 'Agence Comptable Centrale', role: 'Agent Comptable Central' },
                      { code: 'DPRES-AI', label: 'Audit Interne', role: 'Auditeur Interne' },
                      { code: 'DPRES-CFC', label: 'Contrôle Financier Central', role: 'Contrôleur Financier Central' },
                    ].map(u => (
                      <div key={u.code} className="border border-blue-200 bg-blue-50 rounded p-2.5 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          const found = allUnits.find(x => x.code === u.code)
                          if (found) { setSelectedUnit(found); setOrgTab('fiche') }
                        }}
                      >
                        <div className="text-xs font-semibold text-blue-900">{u.label}</div>
                        <div className="font-mono text-xs text-blue-600 mt-0.5">{u.code}</div>
                        <div className="text-xs text-blue-700 mt-1">{u.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">5 Directions du Secrétariat Général</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { code: 'DSG-DCRPP', label: 'Communication & Protocole' },
                      { code: 'DSG-DCMR', label: 'Coopération & Mobilisation' },
                      { code: 'DSG-DPPB', label: 'Planification, Programmes & Budget' },
                      { code: 'DSG-DRHMG', label: 'RH & Moyens généraux' },
                      { code: 'DSG-DSI', label: "Systèmes d'information" },
                    ].map(d => (
                      <div key={d.code} className="border border-green-200 bg-green-50 rounded p-2 text-center cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => {
                          const found = allUnits.find(x => x.code === d.code)
                          if (found) { setSelectedUnit(found); setOrgTab('fiche') }
                        }}
                      >
                        <div className="font-mono text-xs text-green-700">{d.code}</div>
                        <div className="text-xs text-green-900 mt-1">{d.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fiche structure */}
          {orgTab === 'fiche' && (
            <div className="flex gap-4">
              <div className="w-72 shrink-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded" placeholder="Rechercher..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                    </div>
                  </div>
                  <div className="max-h-[55vh] overflow-y-auto p-2">
                    {allUnits.filter(u => !searchQ || u.libelle.toLowerCase().includes(searchQ.toLowerCase()) || u.code.toLowerCase().includes(searchQ.toLowerCase())).map(u => (
                      <div
                        key={u.code}
                        onClick={() => setSelectedUnit(u)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${selectedUnit?.code === u.code ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                        style={{ paddingLeft: (u.niveau - 1) * 12 + 8 }}
                      >
                        {getTypeIcon(u.type)}
                        <div className="min-w-0">
                          <div className="font-mono text-xs text-gray-400">{u.code}</div>
                          <div className="text-xs text-gray-700 truncate">{u.libelle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                {!selectedUnit ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                    <Building2 size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Sélectionnez une structure dans la liste</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-[#0B1C3E] px-5 py-4 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono text-sm text-blue-300">{selectedUnit.code}</div>
                          <h2 className="font-bold text-base mt-1">{selectedUnit.libelle}</h2>
                          <div className="mt-1">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded ${getTypeBadge(selectedUnit.type)} opacity-90`}>
                              {selectedUnit.type.charAt(0).toUpperCase() + selectedUnit.type.slice(1).replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">Niveau {selectedUnit.niveau}</span>
                      </div>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Identification</div>
                          <div className="bg-gray-50 rounded p-3 space-y-1.5">
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Code institutionnel</span><span className="font-mono font-medium">{selectedUnit.code}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Libellé officiel</span><span className="font-medium text-right max-w-[200px]">{selectedUnit.libelle}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Type de structure</span><span>{selectedUnit.type}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Niveau hiérarchique</span><span>N{selectedUnit.niveau}</span></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gouvernance</div>
                          <div className="bg-gray-50 rounded p-3 space-y-1.5">
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Fonction responsable</span><span className="font-medium">{selectedUnit.responsableFonction ?? '—'}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Responsable titulaire</span><span className="text-amber-600 italic">À compléter</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Intérimaire</span><span className="text-amber-600 italic">À compléter</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classification</div>
                          <div className="bg-gray-50 rounded p-3 space-y-1.5">
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Caractère</span><span>Permanent</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Statut</span><span className="text-green-700 font-medium">ACTIF</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Sous-structures</span><span>{selectedUnit.children?.length ?? 0}</span></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Source de la donnée</div>
                          <div className="bg-gray-50 rounded p-3 space-y-1.5">
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Document source</span><span className="text-right font-mono text-xs max-w-[200px] truncate">Référentiel_organisationnel_Commission_CEEAC_2026.pdf</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Date import</span><span>Juin 2026</span></div>
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Statut donnée</span><span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Officiel importé</span></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Données à compléter</div>
                          <div className="bg-amber-50 border border-amber-200 rounded p-3 space-y-1.5">
                            {['Responsable titulaire', 'Coordonnées (tél., email)', 'Centre de coût', 'Circuit de validation'].map(d => (
                              <div key={d} className="flex items-center gap-1.5 text-xs text-amber-700">
                                <AlertCircle size={10} /> {d}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Règles de gestion */}
          {orgTab === 'regles' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#0B1C3E]">Règles de gestion organisationnelles (ORG-001 à ORG-010)</h3>
                <span className="text-xs text-gray-500">Source : Référentiel_organisationnel_Commission_CEEAC_2026.pdf · Section 18</span>
              </div>
              <div className="divide-y divide-gray-100">
                {REGLES.map(r => (
                  <div key={r.code} className="px-5 py-3 flex gap-4">
                    <div className="shrink-0">
                      <span className="font-mono text-xs bg-[#0B1C3E] text-white px-2 py-1 rounded">{r.code}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{r.libelle}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== RÉFÉRENTIEL BUDGÉTAIRE ===================== */}
      {mainTab === 'budget' && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#0B1C3E] text-white rounded-lg p-4">
              <div className="text-xs text-blue-300 uppercase tracking-wide">Budget total 2026</div>
              <div className="text-2xl font-bold mt-1">{new Intl.NumberFormat('fr-FR').format(totalBudget)}</div>
              <div className="text-xs text-blue-300 mt-0.5">FCFA</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Fonctionnement</div>
              <div className="text-xl font-bold text-gray-800 mt-1">{new Intl.NumberFormat('fr-FR').format(totalFonctionnement)}</div>
              <div className="text-xs text-gray-400 mt-0.5">FCFA · {Math.round(totalFonctionnement / totalBudget * 100)}% du total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Investissement total</div>
              <div className="text-xl font-bold text-[#1A6B3A] mt-1">{new Intl.NumberFormat('fr-FR').format(totalInvestissement)}</div>
              <div className="text-xs text-gray-400 mt-0.5">dont PAP {new Intl.NumberFormat('fr-FR').format(totalPAP)} · {Math.round(totalInvestissement / totalBudget * 100)}% du total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Recettes internes</div>
              <div className="text-xl font-bold text-blue-700 mt-1">{new Intl.NumberFormat('fr-FR').format(26275514803)}</div>
              <div className="text-xs text-gray-400 mt-0.5">FCFA · 11 États membres</div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 border-b border-gray-200">
            {([
              ['budget', 'Budget 2026', <BarChart3 size={12} />],
              ['pap', 'PAP — Vue Investissement', <TrendingUp size={12} />],
              ['a-completer', 'Données à compléter', <AlertCircle size={12} />],
              ['qualite', 'Qualité des données', <CheckCircle size={12} />],
            ] as [BudgetTab, string, React.ReactNode][]).map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setBudgetTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${budgetTab === id ? 'border-[#0B1C3E] text-[#0B1C3E]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Budget 2026 */}
          {budgetTab === 'budget' && (
            <div className="space-y-4">
              {/* Source banner */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded p-2.5 text-xs text-green-800">
                <CheckCircle size={13} className="text-green-600 shrink-0" />
                Source officielle : <strong>BUDGET_EXERCICE_2026_Final.pdf</strong> · Statut : <strong>PUBLIÉ</strong> · Exercice 2026 · CEEAC-ECCAS
              </div>

              {/* Architecture budget */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-sm text-[#0B1C3E]">Structure du Budget 2026 par composante</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Dépenses totales : {formatMontant(totalBudget)}</p>
                </div>
                {/* Visual bar */}
                <div className="p-4">
                  <div className="flex h-8 rounded-lg overflow-hidden mb-3">
                    {[
                      { label: 'Personnel', pct: Math.round(11586264803 / totalBudget * 100), color: 'bg-blue-500' },
                      { label: 'PAP (Investissement)', pct: Math.round(totalPAP / totalBudget * 100), color: 'bg-green-500' },
                      { label: 'Assises statutaires', pct: Math.round(1525000000 / totalBudget * 100), color: 'bg-teal-500' },
                      { label: 'Dotations institutions', pct: Math.round(1997000000 / totalBudget * 100), color: 'bg-purple-500' },
                      { label: 'Biens & Services', pct: Math.round(1871250000 / totalBudget * 100), color: 'bg-amber-400' },
                      { label: 'Équipements', pct: Math.round(741000000 / totalBudget * 100), color: 'bg-orange-400' },
                      { label: 'Transferts & Autres', pct: Math.round(220000000 / totalBudget * 100), color: 'bg-gray-300' },
                    ].map((seg, i) => (
                      <div key={i} className={`${seg.color} flex items-center justify-center text-white text-xs font-medium`} style={{ width: `${seg.pct}%` }}>
                        {seg.pct > 6 ? `${seg.pct}%` : ''}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {[
                      { label: 'Personnel', color: 'bg-blue-500', v: '11 586 264 803' },
                      { label: 'PAP / Investissement', color: 'bg-green-500', v: '22 365 281 000' },
                      { label: 'Institutions spécialisées', color: 'bg-purple-500', v: '1 997 000 000' },
                      { label: 'Équipements', color: 'bg-orange-500', v: '741 000 000' },
                      { label: 'Biens & Services', color: 'bg-amber-400', v: '1 871 250 000' },
                      { label: 'Autres (charges fin., transferts, assises)', color: 'bg-gray-300', v: '1 745 000 000' },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`}></span>
                        <span className="text-gray-600">{l.label}</span>
                        <span className="font-medium">{l.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-t border-gray-100">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Code</th>
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Libellé</th>
                      <th className="text-right px-4 py-2 text-gray-500 font-medium">Total FCFA</th>
                      <th className="text-right px-4 py-2 text-gray-500 font-medium">CEEAC-EM</th>
                      <th className="text-right px-4 py-2 text-gray-500 font-medium">PTF</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Type</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {BUDGET_CHAPTERS.map(ch => (
                      <tr key={ch.code} className={`hover:bg-gray-50 ${ch.isPAP ? 'bg-green-50' : ''}`}>
                        <td className="px-4 py-2.5 font-mono text-gray-600">{ch.code}</td>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{ch.libelle}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{new Intl.NumberFormat('fr-FR').format(ch.total)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gray-600">{new Intl.NumberFormat('fr-FR').format(ch.ceeac)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-gray-600">{ch.ptf > 0 ? new Intl.NumberFormat('fr-FR').format(ch.ptf) : '—'}</td>
                        <td className="px-4 py-2.5 text-center">
                          {ch.code === 'PAP'
                            ? <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">Investissement · PAP</span>
                            : ch.isPAP
                              ? <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded text-xs font-medium">Investissement</span>
                              : ch.code === '21-24'
                                ? <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs">Équipements</span>
                                : <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">Fonctionnement</span>}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">{ch.statut}</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#0B1C3E] text-white font-bold">
                      <td className="px-4 py-2.5 font-mono">TOTAL</td>
                      <td className="px-4 py-2.5">TOTAL DES DÉPENSES 2026</td>
                      <td className="px-4 py-2.5 text-right font-mono">{new Intl.NumberFormat('fr-FR').format(totalBudget)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-200">{new Intl.NumberFormat('fr-FR').format(26275514803)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-200">{new Intl.NumberFormat('fr-FR').format(14030281000)}</td>
                      <td className="px-4 py-2.5 text-center"></td>
                      <td className="px-4 py-2.5 text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Recettes */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-sm text-[#0B1C3E]">Recettes 2026 — Contributions des États membres</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">Recettes internes — Contributions 2026</h4>
                    <table className="w-full text-xs">
                      <thead><tr className="bg-gray-50"><th className="text-left p-2">Code</th><th className="text-left p-2">État membre</th><th className="text-right p-2">Montant FCFA</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          ['72101', 'République d\'Angola', 2890306628],
                          ['72102', 'République du Burundi', 1313775740],
                          ['72103', 'République du Cameroun', 2890306628],
                          ['72104', 'République Centrafricaine', 1313775740],
                          ['72105', 'République du Congo', 2890306628],
                          ['72106', 'République Démocratique du Congo', 2627551480],
                          ['72107', 'République Gabonaise', 2890306628],
                          ['72108', 'République de Guinée Équatoriale', 2890306628],
                          ['72109', 'République Rwandaise', 2627551480],
                          ['72110', 'Sao Tomé et Principe', 1313775740],
                          ['72111', 'République du Tchad', 2627551480],
                        ].map(([code, pays, montant]) => (
                          <tr key={code as string} className="hover:bg-gray-50">
                            <td className="p-2 font-mono text-gray-500">{code}</td>
                            <td className="p-2">{pays}</td>
                            <td className="p-2 text-right font-mono">{new Intl.NumberFormat('fr-FR').format(montant as number)}</td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50 font-semibold">
                          <td className="p-2 font-mono">7210</td>
                          <td className="p-2">TOTAL contributions internes</td>
                          <td className="p-2 text-right font-mono">{new Intl.NumberFormat('fr-FR').format(26275514803)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">Recettes externes — Partenaires techniques et financiers</h4>
                    <div className="space-y-2">
                      {[
                        ['Union Européenne (ITC, ONUDI)', 1280000000],
                        ['AU/AUDA-NEPAD/AU-BIRA, Autres IS', 755000000],
                        ['Banque Mondiale', 350000000],
                        ['ONUDI', 715275000],
                        ['ONU/UNOCA/UNOP/ONUSIDA, ONU-Habitat, Autres IS', 629020000],
                        ['Consortium PTF', 195000000],
                        ['AGRA', 115000000],
                        ['CDC Afrique', 100000000],
                        ['FAO', 85000000],
                        ['CARD', 50000000],
                        ['Dons projets PTF (autres)', 9355786000],
                      ].map(([ptf, m]) => (
                        <div key={ptf as string} className="flex justify-between items-center text-xs py-1 border-b border-gray-100">
                          <span className="text-gray-700">{ptf}</span>
                          <span className="font-mono font-medium">{new Intl.NumberFormat('fr-FR').format(m as number)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center text-xs py-1 bg-amber-50 px-2 rounded font-semibold">
                        <span>TOTAL recettes externes</span>
                        <span className="font-mono">{new Intl.NumberFormat('fr-FR').format(14030281000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAP — Vue Investissement */}
          {budgetTab === 'pap' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded p-2.5 text-xs text-green-800">
                <Info size={13} className="text-green-600 shrink-0" />
                <span>Le <strong>PAP constitue le volet Investissement du Budget annuel de la CEEAC</strong>. Il ne s'agit pas d'un budget indépendant. Total PAP 2026 : <strong>{formatMontant(totalPAP)}</strong> dont CEEAC : {formatMontant(8335000000)} et PTF : {formatMontant(14030281000)}.</span>
              </div>
              {/* Piliers */}
              {PAP_PILIERS.map(pilier => (
                <div key={pilier.code} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full text-left"
                    onClick={() => setExpandedPilier(expandedPilier === pilier.code ? null : pilier.code)}
                  >
                    <div className={`bg-gradient-to-r ${getPilierColor(pilier.numero)} px-5 py-4 text-white flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm bg-white/20 px-2 py-0.5 rounded">{pilier.code}</span>
                        <div>
                          <div className="text-xs text-white/70 uppercase tracking-wide">Pilier {pilier.numero}</div>
                          <div className="font-bold text-sm">{pilier.libelle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-white/70">Budget total</div>
                          <div className="font-bold text-base">{new Intl.NumberFormat('fr-FR').format(pilier.totalBudget)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/70">CEEAC</div>
                          <div className="font-semibold">{new Intl.NumberFormat('fr-FR').format(pilier.ceeacBudget)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/70">PTF</div>
                          <div className="font-semibold">{new Intl.NumberFormat('fr-FR').format(pilier.ptfBudget)}</div>
                        </div>
                        {expandedPilier === pilier.code ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </div>
                  </button>
                  {expandedPilier === pilier.code && (
                    <div className="divide-y divide-gray-100">
                      {pilier.axes.map(axe => (
                        <div key={axe.code} className="px-5 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-mono text-xs text-gray-400 mr-2">{axe.code}</span>
                              <span className="text-sm font-medium text-gray-800">{axe.libelle}</span>
                            </div>
                            <div className="flex gap-6 text-xs shrink-0">
                              <div className="text-right">
                                <div className="text-gray-400">Total</div>
                                <div className="font-medium">{new Intl.NumberFormat('fr-FR').format(axe.total)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-400">CEEAC</div>
                                <div className="font-medium">{new Intl.NumberFormat('fr-FR').format(axe.ceeac)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-400">PTF</div>
                                <div className="font-medium">{axe.ptf > 0 ? new Intl.NumberFormat('fr-FR').format(axe.ptf) : '—'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round(axe.ceeac / axe.total * 100)}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{Math.round(axe.ceeac / axe.total * 100)}% CEEAC</span>
                          </div>
                          <div className="mt-2 flex gap-3">
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertCircle size={9} /> Tâches : À compléter
                            </span>
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertCircle size={9} /> Responsable : À compléter
                            </span>
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertCircle size={9} /> Calendrier : À compléter
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">TOTAL PAP 2026 — 6 Piliers, {PAP_PILIERS.reduce((s, p) => s + p.axes.length, 0)} Axes</span>
                <div className="flex gap-6 text-sm">
                  <div className="text-right"><div className="text-xs text-gray-400">Total</div><div className="font-bold">{new Intl.NumberFormat('fr-FR').format(totalPAP)}</div></div>
                  <div className="text-right"><div className="text-xs text-gray-400">CEEAC</div><div className="font-bold text-[#0B1C3E]">{new Intl.NumberFormat('fr-FR').format(8335000000)}</div></div>
                  <div className="text-right"><div className="text-xs text-gray-400">PTF</div><div className="font-bold text-green-700">{new Intl.NumberFormat('fr-FR').format(14030281000)}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* Données à compléter */}
          {budgetTab === 'a-completer' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-2"><AlertCircle size={14} /> Principe directeur</h3>
                <p className="text-xs text-amber-800">Les documents officiels déterminent les données. Lorsqu'une donnée indispensable manque dans le document officiel, l'application prévoit sa structure, signale qu'elle est à compléter, permet son enrichissement, trace son origine et permet sa validation.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-[#0B1C3E]">Données manquantes identifiées</h3>
                  <span className="text-xs text-gray-500">{MISSING_DATA.length} domaines concernés</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-t border-gray-100">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Domaine</th>
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Niveau manquant</th>
                      <th className="text-left px-4 py-2 text-gray-500 font-medium w-1/2">Description</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Volume</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Priorité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MISSING_DATA.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${d.domaine === 'PAP' ? 'bg-green-100 text-green-800' : d.domaine === 'Organisation' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{d.domaine}</span>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-700">{d.niveau}</td>
                        <td className="px-4 py-2.5 text-gray-600">{d.description}</td>
                        <td className="px-4 py-2.5 text-center font-mono">{d.nombre}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${d.priorite === 'HAUTE' ? 'bg-red-100 text-red-800' : d.priorite === 'MOYENNE' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>{d.priorite}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Qualité des données */}
          {budgetTab === 'qualite' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle size={24} className="text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">2</div>
                  <div className="text-xs text-green-600">Référentiels complets (≥95%)</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <Clock size={24} className="text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-700">2</div>
                  <div className="text-xs text-amber-600">Référentiels partiels (35-78%)</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <AlertCircle size={24} className="text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-700">3</div>
                  <div className="text-xs text-red-600">Référentiels à compléter (0%)</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-sm text-[#0B1C3E]">Tableau de qualité par référentiel</h3>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-t border-gray-100">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Référentiel</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Taux de complétude</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Statut</th>
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">Document source</th>
                      <th className="text-center px-4 py-2 text-gray-500 font-medium">Date import</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DATA_QUALITY.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{d.referentiel}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${d.complet >= 90 ? 'bg-green-500' : d.complet >= 50 ? 'bg-amber-500' : d.complet > 0 ? 'bg-orange-400' : 'bg-red-300'}`}
                                style={{ width: `${d.complet}%` }}
                              />
                            </div>
                            <span className={`font-mono font-bold w-8 text-right ${d.complet >= 90 ? 'text-green-700' : d.complet >= 50 ? 'text-amber-700' : 'text-red-700'}`}>{d.complet}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${d.statut === 'PUBLIE' ? 'bg-blue-100 text-blue-800' : d.statut === 'IMPORTE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{d.statut}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate text-xs font-mono">{d.source}</td>
                        <td className="px-4 py-3 text-center text-gray-500">{d.dateImport}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-[#0B1C3E] mb-3">Statuts des données officielles importées</h3>
                <div className="grid grid-cols-6 gap-2 text-xs">
                  {[
                    { statut: 'Officiel importé', color: 'bg-blue-100 text-blue-800', desc: 'Données issues des documents officiels, non modifiables librement' },
                    { statut: 'À compléter', color: 'bg-amber-100 text-amber-800', desc: 'Structure créée, valeur manquante dans les sources officielles' },
                    { statut: 'Complété', color: 'bg-green-100 text-green-800', desc: 'Donnée complétée manuellement par un utilisateur autorisé' },
                    { statut: 'Validé', color: 'bg-blue-100 text-blue-900', desc: "Donnée validée par l'autorité compétente" },
                    { statut: 'Révisé', color: 'bg-purple-100 text-purple-800', desc: 'Donnée officielle révisée via processus formel' },
                    { statut: 'Archivé', color: 'bg-gray-100 text-gray-700', desc: 'Donnée historisée, conservée pour audit' },
                  ].map(s => (
                    <div key={s.statut} className="border border-gray-100 rounded p-2">
                      <span className={`${s.color} px-1.5 py-0.5 rounded text-xs font-medium block mb-1`}>{s.statut}</span>
                      <span className="text-gray-500 text-xs">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
