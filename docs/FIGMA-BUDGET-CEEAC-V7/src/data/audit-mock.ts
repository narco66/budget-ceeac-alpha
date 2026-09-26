export type ActionType =
  | 'CONNEXION' | 'DECONNEXION' | 'ECHEC_CONNEXION' | 'EXPIRATION_SESSION'
  | 'CREATION' | 'MODIFICATION' | 'CONSULTATION' | 'SUPPRESSION' | 'DUPLICATION' | 'ARCHIVAGE'
  | 'SOUMISSION' | 'VALIDATION' | 'REJET' | 'RETOUR' | 'APPROBATION' | 'VISA' | 'SIGNATURE'
  | 'TRANSMISSION' | 'ANNULATION' | 'SUSPENSION' | 'CLOTURE'
  | 'EXPORT' | 'TELECHARGEMENT' | 'GENERATION_PDF' | 'ERREUR'
  | 'CHANGEMENT_ROLE' | 'CHANGEMENT_PERMISSION' | 'ACTIVATION_COMPTE' | 'DESACTIVATION_COMPTE'

export type ModuleType =
  | 'Authentification' | 'Expression de Besoin' | 'Engagement' | 'Liquidation'
  | 'Ordonnancement' | 'Paiement' | 'Budget' | 'PAP' | 'Suivi-Évaluation'
  | 'Reporting' | 'GED' | 'Contrôle interne' | 'Audit' | 'Administration' | 'Workflow'

export type ResultatType = 'SUCCES' | 'ECHEC' | 'AVERTISSEMENT'
export type NiveauType = 'INFO' | 'WARN' | 'CRITIQUE'

export interface AuditEvent {
  id: string
  timestamp: string
  date: string
  heure: string
  utilisateur: string
  utilisateurId: string
  role: string
  service: string
  module: ModuleType
  action: ActionType
  objet: string
  reference: string
  statutAvant?: string
  statutApres?: string
  valeurAvant?: string
  valeurApres?: string
  ip: string
  navigateur: string
  session: string
  resultat: ResultatType
  niveau: NiveauType
  commentaire?: string
}

export const AUDIT_EVENTS: AuditEvent[] = [
  // ── Authentification ──
  {
    id: 'EVT-2026-000001', timestamp: '2026-09-09T07:45:12Z', date: '2026-09-09', heure: '07:45:12',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Authentification', action: 'CONNEXION', objet: 'Session utilisateur', reference: 'SES-20260909-AM01',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000002', timestamp: '2026-09-09T07:46:02Z', date: '2026-09-09', heure: '07:46:02',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Authentification', action: 'CONNEXION', objet: 'Session utilisateur', reference: 'SES-20260909-MN01',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000003', timestamp: '2026-09-09T07:52:30Z', date: '2026-09-09', heure: '07:52:30',
    utilisateur: 'Inconnu', utilisateurId: '—', role: '—', service: '—',
    module: 'Authentification', action: 'ECHEC_CONNEXION', objet: 'Tentative de connexion', reference: 'AUTH-FAIL-0045',
    ip: '41.77.198.3', navigateur: 'Chrome 127', session: '—',
    resultat: 'ECHEC', niveau: 'CRITIQUE',
    commentaire: '3e tentative consécutive — compte temporairement bloqué',
  },
  {
    id: 'EVT-2026-000004', timestamp: '2026-09-09T08:00:15Z', date: '2026-09-09', heure: '08:00:15',
    utilisateur: 'Agnès ENGONE', utilisateurId: 'USR-005', role: 'Comptable', service: 'AC',
    module: 'Authentification', action: 'CONNEXION', objet: 'Session utilisateur', reference: 'SES-20260909-AE01',
    ip: '196.207.45.22', navigateur: 'Edge 128', session: 'SES-20260909-AE01',
    resultat: 'SUCCES', niveau: 'INFO',
  },

  // ── Expression de Besoin ──
  {
    id: 'EVT-2026-000010', timestamp: '2026-09-09T08:12:04Z', date: '2026-09-09', heure: '08:12:04',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Expression de Besoin', action: 'CREATION', objet: 'Expression de Besoin', reference: 'EB-2026-004523',
    statutAvant: undefined, statutApres: 'BROUILLON',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000011', timestamp: '2026-09-09T08:25:18Z', date: '2026-09-09', heure: '08:25:18',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Expression de Besoin', action: 'MODIFICATION', objet: 'Expression de Besoin', reference: 'EB-2026-004523',
    valeurAvant: 'Montant : 120 000 000 XAF', valeurApres: 'Montant : 125 000 000 XAF',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000012', timestamp: '2026-09-09T08:45:33Z', date: '2026-09-09', heure: '08:45:33',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Expression de Besoin', action: 'SOUMISSION', objet: 'Expression de Besoin', reference: 'EB-2026-004523',
    statutAvant: 'BROUILLON', statutApres: 'SOUMIS',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000013', timestamp: '2026-09-09T09:02:11Z', date: '2026-09-09', heure: '09:02:11',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Expression de Besoin', action: 'VALIDATION', objet: 'Expression de Besoin', reference: 'EB-2026-004523',
    statutAvant: 'SOUMIS', statutApres: 'EN_VALIDATION',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260909-HB01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000014', timestamp: '2026-09-09T10:30:44Z', date: '2026-09-09', heure: '10:30:44',
    utilisateur: 'Jean-Paul OBIANG', utilisateurId: 'USR-010', role: 'Secrétaire Général', service: 'SG',
    module: 'Expression de Besoin', action: 'APPROBATION', objet: 'Expression de Besoin', reference: 'EB-2026-004456',
    statutAvant: 'EN_VALIDATION', statutApres: 'APPROUVE',
    ip: '196.207.45.5', navigateur: 'Safari 17', session: 'SES-20260909-JO01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000015', timestamp: '2026-09-08T14:20:00Z', date: '2026-09-08', heure: '14:20:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Expression de Besoin', action: 'REJET', objet: 'Expression de Besoin', reference: 'EB-2026-003987',
    statutAvant: 'EN_VALIDATION', statutApres: 'REJETE',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260908-HB01',
    resultat: 'SUCCES', niveau: 'WARN',
    commentaire: 'Montant injustifié — documentation insuffisante',
  },
  {
    id: 'EVT-2026-000016', timestamp: '2026-09-07T11:05:22Z', date: '2026-09-07', heure: '11:05:22',
    utilisateur: 'Col. Patrice MOUKALA', utilisateurId: 'USR-012', role: 'Expert DEPIEC', service: 'DEPIEC',
    module: 'Expression de Besoin', action: 'RETOUR', objet: 'Expression de Besoin', reference: 'EB-2026-004389',
    statutAvant: 'EN_VALIDATION', statutApres: 'RETOURNE',
    ip: '196.207.45.33', navigateur: 'Chrome 128', session: 'SES-20260907-PM01',
    resultat: 'SUCCES', niveau: 'INFO',
    commentaire: 'Complétude du dossier requise — PV de réception manquant',
  },

  // ── Engagement ──
  {
    id: 'EVT-2026-000020', timestamp: '2026-09-09T09:15:00Z', date: '2026-09-09', heure: '09:15:00',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Engagement', action: 'CREATION', objet: 'Engagement', reference: 'ENG-2026-003891',
    statutAvant: undefined, statutApres: 'EN_PREPARATION',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000021', timestamp: '2026-09-09T09:55:12Z', date: '2026-09-09', heure: '09:55:12',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Engagement', action: 'VALIDATION', objet: 'Engagement', reference: 'ENG-2026-003891',
    statutAvant: 'EN_VALIDATION_BUDGET', statutApres: 'CONTROLE_FINANCIER',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260909-HB01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000022', timestamp: '2026-09-09T11:40:25Z', date: '2026-09-09', heure: '11:40:25',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Engagement', action: 'VISA', objet: 'Engagement', reference: 'ENG-2026-003891',
    statutAvant: 'CONTROLE_FINANCIER', statutApres: 'VISE',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'INFO',
    commentaire: 'Visa CF — crédits disponibles confirmés',
  },
  {
    id: 'EVT-2026-000023', timestamp: '2026-09-09T12:10:08Z', date: '2026-09-09', heure: '12:10:08',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Engagement', action: 'MODIFICATION', objet: 'Engagement', reference: 'ENG-2026-003756',
    valeurAvant: 'Montant : 340 000 000 XAF', valeurApres: 'Montant : 345 000 000 XAF',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'WARN',
    commentaire: 'Ajustement montant après révision devis — autorisation DG obtenue',
  },
  {
    id: 'EVT-2026-000024', timestamp: '2026-09-08T16:30:00Z', date: '2026-09-08', heure: '16:30:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Engagement', action: 'RETOUR', objet: 'Engagement', reference: 'ENG-2026-003345',
    statutAvant: 'EN_VALIDATION_BUDGET', statutApres: 'RETOURNE',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260908-HB01',
    resultat: 'SUCCES', niveau: 'INFO',
    commentaire: 'Ligne budgétaire incorrecte',
  },

  // ── Liquidation ──
  {
    id: 'EVT-2026-000030', timestamp: '2026-09-09T13:00:00Z', date: '2026-09-09', heure: '13:00:00',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Liquidation', action: 'CREATION', objet: 'Liquidation', reference: 'LIQ-2026-002934',
    statutAvant: undefined, statutApres: 'A_CONSTATER',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000031', timestamp: '2026-09-09T13:45:22Z', date: '2026-09-09', heure: '13:45:22',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Liquidation', action: 'VALIDATION', objet: 'Liquidation', reference: 'LIQ-2026-002756',
    statutAvant: 'EN_CONTROLE', statutApres: 'VALIDEE',
    valeurAvant: 'Service fait : Non constaté', valeurApres: 'Service fait : CONFORME',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000032', timestamp: '2026-09-08T10:15:00Z', date: '2026-09-08', heure: '10:15:00',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Liquidation', action: 'REJET', objet: 'Liquidation', reference: 'LIQ-2026-002589',
    statutAvant: 'EN_CONTROLE', statutApres: 'REJETEE',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260908-AM01',
    resultat: 'SUCCES', niveau: 'WARN',
    commentaire: 'Réserves non levées — service fait partiel',
  },

  // ── Ordonnancement ──
  {
    id: 'EVT-2026-000040', timestamp: '2026-09-09T14:00:00Z', date: '2026-09-09', heure: '14:00:00',
    utilisateur: 'Agnès ENGONE', utilisateurId: 'USR-005', role: 'Comptable', service: 'AC',
    module: 'Ordonnancement', action: 'CREATION', objet: 'Ordre de Paiement', reference: 'ORD-2026-001823',
    statutAvant: undefined, statutApres: 'A_PREPARER',
    ip: '196.207.45.22', navigateur: 'Edge 128', session: 'SES-20260909-AE01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000041', timestamp: '2026-09-09T14:30:55Z', date: '2026-09-09', heure: '14:30:55',
    utilisateur: 'Jean-Paul OBIANG', utilisateurId: 'USR-010', role: 'Secrétaire Général', service: 'SG',
    module: 'Ordonnancement', action: 'SIGNATURE', objet: 'Ordre de Paiement', reference: 'ORD-2026-001823',
    statutAvant: 'A_SIGNER', statutApres: 'SIGNE',
    ip: '196.207.45.5', navigateur: 'Safari 17', session: 'SES-20260909-JO01',
    resultat: 'SUCCES', niveau: 'INFO',
    commentaire: 'Signature électronique — délégation SG ≤ 5 M XAF',
  },
  {
    id: 'EVT-2026-000042', timestamp: '2026-09-09T14:45:03Z', date: '2026-09-09', heure: '14:45:03',
    utilisateur: 'Jean-Paul OBIANG', utilisateurId: 'USR-010', role: 'Secrétaire Général', service: 'SG',
    module: 'Ordonnancement', action: 'TRANSMISSION', objet: 'Ordre de Paiement', reference: 'ORD-2026-001823',
    statutAvant: 'SIGNE', statutApres: 'TRANSMIS_AC',
    ip: '196.207.45.5', navigateur: 'Safari 17', session: 'SES-20260909-JO01',
    resultat: 'SUCCES', niveau: 'INFO',
  },

  // ── Paiement ──
  {
    id: 'EVT-2026-000050', timestamp: '2026-09-09T15:10:00Z', date: '2026-09-09', heure: '15:10:00',
    utilisateur: 'Agnès ENGONE', utilisateurId: 'USR-005', role: 'Comptable', service: 'AC',
    module: 'Paiement', action: 'CREATION', objet: 'Paiement', reference: 'PAY-2026-001023',
    statutAvant: undefined, statutApres: 'EN_PREPARATION',
    ip: '196.207.45.22', navigateur: 'Edge 128', session: 'SES-20260909-AE01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000051', timestamp: '2026-09-09T15:55:40Z', date: '2026-09-09', heure: '15:55:40',
    utilisateur: 'Agnès ENGONE', utilisateurId: 'USR-005', role: 'Comptable', service: 'AC',
    module: 'Paiement', action: 'VALIDATION', objet: 'Paiement', reference: 'PAY-2026-001023',
    statutAvant: 'CONTROLE_COMPTABLE', statutApres: 'VALIDE',
    ip: '196.207.45.22', navigateur: 'Edge 128', session: 'SES-20260909-AE01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000052', timestamp: '2026-09-08T09:30:00Z', date: '2026-09-08', heure: '09:30:00',
    utilisateur: 'Agnès ENGONE', utilisateurId: 'USR-005', role: 'Comptable', service: 'AC',
    module: 'Paiement', action: 'ERREUR', objet: 'Paiement — Virement bancaire', reference: 'PAY-2026-001012',
    ip: '196.207.45.22', navigateur: 'Edge 128', session: 'SES-20260908-AE01',
    resultat: 'ECHEC', niveau: 'CRITIQUE',
    commentaire: 'IBAN invalide — virement rejeté par la banque BGFI',
  },

  // ── Budget ──
  {
    id: 'EVT-2026-000060', timestamp: '2026-09-05T09:00:00Z', date: '2026-09-05', heure: '09:00:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Budget', action: 'MODIFICATION', objet: 'Ligne budgétaire', reference: 'LB-2.2.1.2',
    valeurAvant: 'Dotation : 45 000 000 XAF', valeurApres: 'Dotation : 50 000 000 XAF',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260905-HB01',
    resultat: 'SUCCES', niveau: 'CRITIQUE',
    commentaire: 'Virement de crédits — décision DG n° 2026-VIR-045',
  },
  {
    id: 'EVT-2026-000061', timestamp: '2026-09-06T11:20:00Z', date: '2026-09-06', heure: '11:20:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Budget', action: 'CREATION', objet: 'Virement de crédits', reference: 'VIR-2026-0023',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260906-HB01',
    resultat: 'SUCCES', niveau: 'WARN',
  },

  // ── Administration — événements critiques ──
  {
    id: 'EVT-2026-000070', timestamp: '2026-09-07T17:05:00Z', date: '2026-09-07', heure: '17:05:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Administrateur fonctionnel', service: 'ADMIN',
    module: 'Administration', action: 'CHANGEMENT_ROLE', objet: 'Utilisateur — Emmanuel BIYOGHE', reference: 'USR-006',
    valeurAvant: 'Rôle : Expert DEPIEC', valeurApres: 'Rôle : Expert Budget',
    ip: '196.207.45.30', navigateur: 'Chrome 128', session: 'SES-20260907-SN01',
    resultat: 'SUCCES', niveau: 'CRITIQUE',
    commentaire: 'Modification autorisée par le SG — note DG/RH/2026-145',
  },
  {
    id: 'EVT-2026-000071', timestamp: '2026-09-07T17:12:00Z', date: '2026-09-07', heure: '17:12:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Administrateur fonctionnel', service: 'ADMIN',
    module: 'Administration', action: 'DESACTIVATION_COMPTE', objet: 'Utilisateur — Emmanuel BIYOGHE', reference: 'USR-006',
    valeurAvant: 'Statut : ACTIF', valeurApres: 'Statut : INACTIF',
    ip: '196.207.45.30', navigateur: 'Chrome 128', session: 'SES-20260907-SN01',
    resultat: 'SUCCES', niveau: 'CRITIQUE',
  },
  {
    id: 'EVT-2026-000072', timestamp: '2026-09-09T08:30:00Z', date: '2026-09-09', heure: '08:30:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Administrateur fonctionnel', service: 'ADMIN',
    module: 'Administration', action: 'CHANGEMENT_PERMISSION', objet: 'Rôle — Comptable', reference: 'ROLE-COMPTABLE',
    valeurAvant: 'Modules : PAY, ORD', valeurApres: 'Modules : PAY, ORD, Reporting',
    ip: '196.207.45.30', navigateur: 'Chrome 128', session: 'SES-20260909-SN01',
    resultat: 'SUCCES', niveau: 'CRITIQUE',
  },

  // ── GED ──
  {
    id: 'EVT-2026-000080', timestamp: '2026-09-09T09:30:00Z', date: '2026-09-09', heure: '09:30:00',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'GED', action: 'TELECHARGEMENT', objet: 'Certificat d\'engagement', reference: 'DOC-ENG-2026-003891',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000081', timestamp: '2026-09-09T10:00:00Z', date: '2026-09-09', heure: '10:00:00',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'GED', action: 'SUPPRESSION', objet: 'Document temporaire', reference: 'DOC-TMP-2026-0034',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'WARN',
    commentaire: 'Document dupliqué supprimé — double dépôt accidentel',
  },

  // ── Reporting / Export ──
  {
    id: 'EVT-2026-000090', timestamp: '2026-09-09T16:00:00Z', date: '2026-09-09', heure: '16:00:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Reporting', action: 'GENERATION_PDF', objet: 'Rapport exécution budgétaire', reference: 'REP-BUD-02',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260909-HB01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000091', timestamp: '2026-09-09T16:05:00Z', date: '2026-09-09', heure: '16:05:00',
    utilisateur: 'Henri BONGO', utilisateurId: 'USR-003', role: 'Directeur du Budget', service: 'DB',
    module: 'Reporting', action: 'EXPORT', objet: 'Export Excel — Exécution budgétaire', reference: 'REP-BUD-02',
    ip: '196.207.45.10', navigateur: 'Chrome 128', session: 'SES-20260909-HB01',
    resultat: 'SUCCES', niveau: 'INFO',
  },

  // ── Workflow ──
  {
    id: 'EVT-2026-000100', timestamp: '2026-09-09T08:00:00Z', date: '2026-09-09', heure: '08:00:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Administrateur fonctionnel', service: 'ADMIN',
    module: 'Workflow', action: 'MODIFICATION', objet: 'Workflow ENG — Chaîne de validation', reference: 'WF-ENG-PRINCIPAL',
    valeurAvant: 'SLA Étape CF : 3 jours', valeurApres: 'SLA Étape CF : 5 jours',
    ip: '196.207.45.30', navigateur: 'Chrome 128', session: 'SES-20260909-SN01',
    resultat: 'SUCCES', niveau: 'CRITIQUE',
    commentaire: 'Modification SLA approuvée par le SG — note 2026-WF-012',
  },

  // ── Suivi-Évaluation ──
  {
    id: 'EVT-2026-000110', timestamp: '2026-09-08T14:30:00Z', date: '2026-09-08', heure: '14:30:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Expert S&E', service: 'DEPIEC',
    module: 'Suivi-Évaluation', action: 'MODIFICATION', objet: 'Indicateur PAP', reference: 'IND-A2.1.1',
    valeurAvant: 'Réalisation : 65 %', valeurApres: 'Réalisation : 72 %',
    ip: '196.207.45.33', navigateur: 'Chrome 128', session: 'SES-20260908-SN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },

  // ── Connexions diverses ──
  {
    id: 'EVT-2026-000120', timestamp: '2026-09-09T17:30:00Z', date: '2026-09-09', heure: '17:30:00',
    utilisateur: 'Marie-Claire NKOGHE', utilisateurId: 'USR-002', role: 'Expert Budget', service: 'DB',
    module: 'Authentification', action: 'DECONNEXION', objet: 'Session utilisateur', reference: 'SES-20260909-MN01',
    ip: '196.207.45.18', navigateur: 'Firefox 130', session: 'SES-20260909-MN01',
    resultat: 'SUCCES', niveau: 'INFO',
  },
  {
    id: 'EVT-2026-000121', timestamp: '2026-09-09T18:00:00Z', date: '2026-09-09', heure: '18:00:00',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Authentification', action: 'EXPIRATION_SESSION', objet: 'Session expirée', reference: 'SES-20260909-AM01',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'AVERTISSEMENT', niveau: 'WARN',
    commentaire: 'Session inactive depuis 30 minutes — déconnexion automatique',
  },

  // ── PAP ──
  {
    id: 'EVT-2026-000130', timestamp: '2026-09-06T10:00:00Z', date: '2026-09-06', heure: '10:00:00',
    utilisateur: 'Sylvie NKOMO ESSAMA', utilisateurId: 'USR-007', role: 'Expert S&E', service: 'DEPIEC',
    module: 'PAP', action: 'MODIFICATION', objet: 'Activité PAP', reference: 'ACT-1.2.4',
    valeurAvant: 'Budget activité : 200 000 000 XAF', valeurApres: 'Budget activité : 220 000 000 XAF',
    ip: '196.207.45.33', navigateur: 'Chrome 128', session: 'SES-20260906-SN01',
    resultat: 'SUCCES', niveau: 'WARN',
  },

  // ── Contrôle interne ──
  {
    id: 'EVT-2026-000140', timestamp: '2026-09-09T11:00:00Z', date: '2026-09-09', heure: '11:00:00',
    utilisateur: 'Alain MBONGO', utilisateurId: 'USR-004', role: 'Contrôleur Financier', service: 'DCF',
    module: 'Contrôle interne', action: 'CREATION', objet: 'Constatation de risque', reference: 'CONST-2026-0012',
    ip: '196.207.45.12', navigateur: 'Chrome 128', session: 'SES-20260909-AM01',
    resultat: 'SUCCES', niveau: 'INFO',
  },

  // ── Tentatives d'accès non autorisé ──
  {
    id: 'EVT-2026-000150', timestamp: '2026-09-09T03:14:00Z', date: '2026-09-09', heure: '03:14:00',
    utilisateur: 'Inconnu', utilisateurId: '—', role: '—', service: '—',
    module: 'Authentification', action: 'ECHEC_CONNEXION', objet: 'Tentative de connexion', reference: 'AUTH-FAIL-0046',
    ip: '185.220.101.45', navigateur: 'curl/7.68', session: '—',
    resultat: 'ECHEC', niveau: 'CRITIQUE',
    commentaire: 'Tentative automatisée — IP blacklistée (Tor exit node)',
  },
  {
    id: 'EVT-2026-000151', timestamp: '2026-09-09T03:14:05Z', date: '2026-09-09', heure: '03:14:05',
    utilisateur: 'Inconnu', utilisateurId: '—', role: '—', service: '—',
    module: 'Authentification', action: 'ECHEC_CONNEXION', objet: 'Tentative de connexion', reference: 'AUTH-FAIL-0047',
    ip: '185.220.101.45', navigateur: 'curl/7.68', session: '—',
    resultat: 'ECHEC', niveau: 'CRITIQUE',
    commentaire: 'Attaque par force brute détectée — 47 tentatives/min',
  },
]

export const ACTION_CONFIG: Record<ActionType, { label: string; color: string; bg: string; icon: string }> = {
  CONNEXION:           { label: 'Connexion',         color: '#374151', bg: '#F3F4F6', icon: '🔑' },
  DECONNEXION:         { label: 'Déconnexion',       color: '#6B7280', bg: '#F9FAFB', icon: '🔓' },
  ECHEC_CONNEXION:     { label: 'Échec connexion',   color: '#991B1B', bg: '#FEE2E2', icon: '⛔' },
  EXPIRATION_SESSION:  { label: 'Session expirée',   color: '#92400E', bg: '#FEF3C7', icon: '⏰' },
  CREATION:            { label: 'Création',           color: '#1D4ED8', bg: '#DBEAFE', icon: '➕' },
  MODIFICATION:        { label: 'Modification',       color: '#92400E', bg: '#FEF3C7', icon: '✏️' },
  CONSULTATION:        { label: 'Consultation',       color: '#374151', bg: '#F1F5F9', icon: '👁️' },
  SUPPRESSION:         { label: 'Suppression',        color: '#991B1B', bg: '#FEE2E2', icon: '🗑️' },
  DUPLICATION:         { label: 'Duplication',        color: '#374151', bg: '#F1F5F9', icon: '📋' },
  ARCHIVAGE:           { label: 'Archivage',          color: '#374151', bg: '#F1F5F9', icon: '📦' },
  SOUMISSION:          { label: 'Soumission',         color: '#3730A3', bg: '#EDE9FE', icon: '📤' },
  VALIDATION:          { label: 'Validation',         color: '#166534', bg: '#DCFCE7', icon: '✅' },
  REJET:               { label: 'Rejet',              color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
  RETOUR:              { label: 'Retour correction',  color: '#92400E', bg: '#FFEDD5', icon: '↩️' },
  APPROBATION:         { label: 'Approbation',        color: '#166534', bg: '#DCFCE7', icon: '👍' },
  VISA:                { label: 'Visa CF',            color: '#0E7490', bg: '#CFFAFE', icon: '🔏' },
  SIGNATURE:           { label: 'Signature',          color: '#166534', bg: '#DCFCE7', icon: '✍️' },
  TRANSMISSION:        { label: 'Transmission',       color: '#7E22CE', bg: '#F3E8FF', icon: '📨' },
  ANNULATION:          { label: 'Annulation',         color: '#9A3412', bg: '#FFEDD5', icon: '🚫' },
  SUSPENSION:          { label: 'Suspension',         color: '#92400E', bg: '#FEF3C7', icon: '⏸️' },
  CLOTURE:             { label: 'Clôture',            color: '#374151', bg: '#F1F5F9', icon: '🔒' },
  EXPORT:              { label: 'Export',             color: '#374151', bg: '#F1F5F9', icon: '📊' },
  TELECHARGEMENT:      { label: 'Téléchargement',     color: '#374151', bg: '#F1F5F9', icon: '⬇️' },
  GENERATION_PDF:      { label: 'Génération PDF',     color: '#374151', bg: '#F1F5F9', icon: '📄' },
  ERREUR:              { label: 'Erreur',             color: '#991B1B', bg: '#FEE2E2', icon: '⚠️' },
  CHANGEMENT_ROLE:     { label: 'Changement rôle',   color: '#991B1B', bg: '#FEE2E2', icon: '🎭' },
  CHANGEMENT_PERMISSION:{ label: 'Permission',       color: '#991B1B', bg: '#FEE2E2', icon: '🛡️' },
  ACTIVATION_COMPTE:   { label: 'Activation compte', color: '#166534', bg: '#DCFCE7', icon: '✅' },
  DESACTIVATION_COMPTE:{ label: 'Désactivation',     color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
}

export const RESULTAT_CONFIG = {
  SUCCES:       { label: 'Succès',       color: '#166534', bg: '#DCFCE7' },
  ECHEC:        { label: 'Échec',        color: '#991B1B', bg: '#FEE2E2' },
  AVERTISSEMENT:{ label: 'Avertissement',color: '#92400E', bg: '#FEF3C7' },
}
