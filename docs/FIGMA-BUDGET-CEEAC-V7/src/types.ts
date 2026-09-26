export type Page =
  | 'dashboard'
  | 'planification'
  | 'budget'
  | 'pap'
  | 'eb-list'
  | 'eb-detail'
  | 'eb-form'
  | 'eng-list'
  | 'eng-detail'
  | 'liq-list'
  | 'liq-detail'
  | 'ord-list'
  | 'ord-detail'
  | 'pay-list'
  | 'pay-detail'
  | 'se'
  | 'reporting'
  | 'ged'
  | 'controle'
  | 'audit'
  | 'administration'
  | 'mes-taches'
  | 'dossier'
  | 'workflow-list'
  | 'workflow-detail'
  | 'journal'
  | 'preparation'
  | 'cloture'
  | 'tiers'
  | 'tiers-detail'
  | 'marches'
  | 'recettes'
  | 'projets'
  | 'gantt'
  | 'interop'
  | 'referentiel'
  | 'executive'

export interface NavProps {
  onNavigate: (page: Page, id?: string) => void
}

export type EBStatus =
  | 'BROUILLON'
  | 'SOUMIS'
  | 'EN_VALIDATION'
  | 'A_COMPLETER'
  | 'RETOURNE'
  | 'EN_ATTENTE_INFO'
  | 'REJETE'
  | 'APPROUVE'
  | 'TRANSFORME'
  | 'ANNULE'

export type ENGStatus =
  | 'GENERE'
  | 'EN_PREPARATION'
  | 'A_COMPLETER'
  | 'EN_VALIDATION_BUDGET'
  | 'CONTROLE_FINANCIER'
  | 'RETOURNE'
  | 'REJETE'
  | 'VISE'
  | 'TRANSFORME'
  | 'ANNULE'

export type LIQStatus =
  | 'GENEREE'
  | 'EN_PREPARATION'
  | 'EN_CERTIFICATION'
  | 'SERVICE_FAIT'
  | 'A_COMPLETER'
  | 'SOUMISE'
  | 'EN_CONTROLE'
  | 'RETOURNEE'
  | 'COMPLEMENT_DEMANDE'
  | 'VISEE'
  | 'REJETEE'
  | 'ANNULEE'
  | 'TRANSFORMEE'

export type ORDStatus =
  | 'GENERE'
  | 'A_PREPARER'
  | 'A_SIGNER'
  | 'RETOURNE'
  | 'REJETE'
  | 'SIGNE'
  | 'TRANSMIS_AC'
  | 'TRANSFORME'

export type PAYStatus =
  | 'GENERE'
  | 'TRANSMIS_AC'
  | 'PRIS_EN_CHARGE'
  | 'A_PREPARER'
  | 'EN_PREPARATION'
  | 'CONTROLE_COMPTABLE'
  | 'EN_VALIDATION'
  | 'VALIDE'
  | 'A_EXECUTER'
  | 'AUTORISE'
  | 'EN_COURS_BANCAIRE'
  | 'EXECUTE'
  | 'PARTIELLEMENT_PAYE'
  | 'RAPPROCHE'
  | 'CLOTURE'
  | 'SUSPENDU'
  | 'RETOURNE'
  | 'REJETE'
  | 'REJETE_BANQUE'
  | 'ANNULE'

export type ServiceFaitStatus =
  | 'CONFORME'
  | 'PARTIEL'
  | 'AVEC_RESERVES'
  | 'NON_CONFORME'
  | 'NON_FAIT'

export interface BudgetLine {
  code: string
  libelle: string
  chapitre: string
  article: string
  paragraphe: string
  nature: string
  isPAP: boolean
  dotationInitiale: number
  dotationActuelle: number
  reserve: number
  engage: number
  liquide: number
  ordonnance: number
  paye: number
  disponible: number
  source: string
  structure: string
  pilier?: string
  axe?: string
  produit?: string
  activite?: string
}

export interface EBItem {
  id: string
  reference: string
  objet: string
  structure: string
  montant: number
  devise: string
  status: EBStatus
  isPAP: boolean
  ligneBudgetaire: string
  initiateur: string
  dateCreation: string
  dateSubmission?: string
  dateDerniereAction?: string
  acteurAttendu?: string
  priorite: 'NORMALE' | 'IMPORTANTE' | 'URGENTE' | 'CRITIQUE'
  pilier?: string
  activite?: string
  motifRetour?: string
  acteurRetour?: string
  dateRetour?: string
  motifRejet?: string
  acteurRejet?: string
  dateRejet?: string
}

export interface ENGItem {
  id: string
  reference: string
  ebReference: string
  objet: string
  structure: string
  montant: number
  tiers: string
  status: ENGStatus
  isPAP: boolean
  dateCreation: string
  acteurAttendu?: string
  creditAvant: number
  creditApres: number
  ligneBudgetaire?: string
  priorite?: 'NORMALE' | 'IMPORTANTE' | 'URGENTE' | 'CRITIQUE'
  motifRetour?: string
  acteurRetour?: string
  dateRetour?: string
  motifRejet?: string
  acteurRejet?: string
  dateRejet?: string
  dateVisa?: string
  referenceVisa?: string
}

export interface LIQItem {
  id: string
  reference: string
  engReference: string
  ebReference: string
  objet: string
  structure: string
  montantBrut: number
  retenues: number
  montantNet: number
  montantEngage: number
  montantDejaLiquide: number
  tiers: string
  status: LIQStatus
  serviceFait: ServiceFaitStatus
  isPAP: boolean
  dateCreation: string
  dateServiceFait?: string
  dateFacture?: string
  numFacture?: string
  acteurAttendu?: string
  dateVisa?: string
  motifRetour?: string
  acteurRetour?: string
  dateRetour?: string
  motifRejet?: string
  acteurRejet?: string
  dateRejet?: string
}

export interface ORDItem {
  id: string
  reference: string
  opReference: string
  liqReference: string
  engReference: string
  ebReference: string
  objet: string
  structure: string
  isPAP: boolean
  montantEngage: number
  montantBrut: number
  retenues: number
  montant: number          // net à ordonnancer
  tiers: string
  banque: string
  compte: string
  coordsBancairesStatut: 'OK' | 'A_REVALIDER' | 'INCOMPLET'
  ordonnateur: string
  ordonnateurRole: 'SG' | 'PRESIDENT'
  status: ORDStatus
  dateCreation: string
  dateSIgnature?: string
  dateTransmission?: string
  lignesBudgetaires?: { code: string; libelle: string; montant: number }[]
  motifRetour?: string
  motifRejet?: string
}

export interface PAYItem {
  id: string
  reference: string
  ordReference: string
  liqReference: string
  engReference: string
  ebReference: string
  objet: string
  structure: string
  isPAP: boolean
  tiers: string
  montantOrdonnance: number
  montantBrut: number
  retenues: number
  montantPaye: number
  reliquat: number
  banque: string
  compteBancaire: string
  modePaiement: 'VIREMENT' | 'CHEQUE' | 'CAISSE'
  status: PAYStatus
  dateCreation: string
  dateValeur?: string
  refBancaire?: string
  acteurAttendu: string
  ordonnateurNom: string
  compteCEEAC: string
  motifSuspension?: string
  motifRetour?: string
  motifRejet?: string
}

export interface Indicator {
  id: string
  code: string
  libelle: string
  type: 'QUANTITATIF' | 'QUALITATIF' | 'BINAIRE'
  unite: string
  baseline: number | string
  cible: number | string
  realisation: number | string
  tauxAtteinte: number
  tendance: 'HAUSSE' | 'BAISSE' | 'STABLE'
  periode: string
  responsable: string
  statut: 'VERT' | 'ORANGE' | 'ROUGE'
  niveau: string
}
