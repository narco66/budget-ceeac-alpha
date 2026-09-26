import { useState } from 'react'
import {
  Folder, FileText, File, Download, Eye, Upload, Search,
  Filter, Clock, CheckCircle, AlertCircle, Lock, Tag, X, Share2, History,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'Tous les documents', count: 142, icon: <Folder size={14} /> },
  { id: 'budgetaires', label: 'Documents budgétaires', count: 38, icon: <FileText size={14} /> },
  { id: 'engagements', label: 'Dossiers engagement', count: 41, icon: <FileText size={14} /> },
  { id: 'paiements', label: 'Justificatifs paiement', count: 29, icon: <FileText size={14} /> },
  { id: 'marches', label: 'Marchés & contrats', count: 17, icon: <FileText size={14} /> },
  { id: 'rapports', label: 'Rapports & comptes rendus', count: 12, icon: <FileText size={14} /> },
  { id: 'reglementaires', label: 'Textes réglementaires', count: 5, icon: <FileText size={14} /> },
]

type DocStatus = 'VALIDE' | 'EN_ATTENTE' | 'EXPIRE' | 'CONFIDENTIEL'

interface Doc {
  id: string
  nom: string
  reference: string
  categorie: string
  type: string
  taille: string
  auteur: string
  dateDepot: string
  dateExpiration?: string
  statut: DocStatus
  tags: string[]
  dossierLie?: string
}

const DOCUMENTS: Doc[] = [
  {
    id: 'D-001', nom: 'Budget Initial CEEAC 2026 — Décision n°001/2025', reference: 'BUD-2026-001',
    categorie: 'budgetaires', type: 'PDF', taille: '2.4 Mo', auteur: 'Direction du Budget',
    dateDepot: '02/01/2026', statut: 'VALIDE',
    tags: ['budget', '2026', 'initial'], dossierLie: undefined
  },
  {
    id: 'D-002', nom: 'Budget Révisé CEEAC 2026 — Décision n°012/2026', reference: 'BUD-2026-012',
    categorie: 'budgetaires', type: 'PDF', taille: '3.1 Mo', auteur: 'Direction du Budget',
    dateDepot: '15/04/2026', statut: 'VALIDE',
    tags: ['budget', '2026', 'révisé']
  },
  {
    id: 'D-003', nom: 'PAP 2026 approuvé — Plan Annuel de Performance', reference: 'PAP-2026-001',
    categorie: 'budgetaires', type: 'PDF', taille: '5.7 Mo', auteur: 'DEPIEC',
    dateDepot: '10/01/2026', statut: 'VALIDE',
    tags: ['PAP', '2026', 'performance']
  },
  {
    id: 'D-004', nom: 'Contrat de fournitures informatiques — SOLTEC SA', reference: 'ENG-2026-002-CTR',
    categorie: 'marches', type: 'PDF', taille: '1.8 Mo', auteur: 'Direction des Affaires Juridiques',
    dateDepot: '18/07/2026', dateExpiration: '17/07/2027', statut: 'VALIDE',
    tags: ['contrat', 'fournitures', 'informatique'], dossierLie: 'ENG-2026-002'
  },
  {
    id: 'D-005', nom: 'Facture n°SOLTEC-2026-0412 — Fournitures bureau', reference: 'LIQ-2026-001-FAC',
    categorie: 'paiements', type: 'PDF', taille: '0.6 Mo', auteur: 'SOLTEC SA',
    dateDepot: '22/07/2026', statut: 'VALIDE',
    tags: ['facture', 'fournisseur'], dossierLie: 'LIQ-2026-001'
  },
  {
    id: 'D-006', nom: 'Bordereau de livraison — lot 1/3', reference: 'LIQ-2026-001-BL1',
    categorie: 'paiements', type: 'PDF', taille: '0.3 Mo', auteur: 'SOLTEC SA',
    dateDepot: '22/07/2026', statut: 'VALIDE',
    tags: ['livraison', 'service fait'], dossierLie: 'LIQ-2026-001'
  },
  {
    id: 'D-007', nom: 'Ordre de mission — Réunion UA Addis-Abeba', reference: 'EB-2026-004-OM',
    categorie: 'engagements', type: 'PDF', taille: '0.2 Mo', auteur: 'Secrétariat Général',
    dateDepot: '14/07/2026', dateExpiration: '25/08/2026', statut: 'EXPIRE',
    tags: ['mission', 'déplacement'], dossierLie: 'EB-2026-004'
  },
  {
    id: 'D-008', nom: 'Rapport annuel de performance 2025 — CEEAC', reference: 'RAP-2025-001',
    categorie: 'rapports', type: 'PDF', taille: '8.2 Mo', auteur: 'DEPIEC',
    dateDepot: '28/02/2026', statut: 'VALIDE',
    tags: ['rapport', '2025', 'performance']
  },
  {
    id: 'D-009', nom: 'Règlement financier CEEAC (version consolidée 2023)', reference: 'REG-FIN-2023',
    categorie: 'reglementaires', type: 'PDF', taille: '4.4 Mo', auteur: 'Secrétariat Général',
    dateDepot: '01/01/2024', statut: 'CONFIDENTIEL',
    tags: ['règlement', 'financier', 'référentiel']
  },
  {
    id: 'D-010', nom: 'PV réception définitive — matériel informatique lot 2', reference: 'LIQ-2026-002-PV',
    categorie: 'paiements', type: 'PDF', taille: '0.9 Mo', auteur: 'Commission de réception',
    dateDepot: '30/07/2026', statut: 'EN_ATTENTE',
    tags: ['PV', 'réception', 'matériel'], dossierLie: 'LIQ-2026-002'
  },
  {
    id: 'D-011', nom: 'Contrat de consultant — Expertise Développement Reg.', reference: 'ENG-2026-003-CTR',
    categorie: 'marches', type: 'PDF', taille: '2.2 Mo', auteur: 'Direction des Affaires Juridiques',
    dateDepot: '20/07/2026', dateExpiration: '19/07/2027', statut: 'VALIDE',
    tags: ['consultant', 'expertise'], dossierLie: 'ENG-2026-003'
  },
  {
    id: 'D-012', nom: 'Note de saisine CF — Engagement ENG-2026-002', reference: 'ENG-2026-002-NS',
    categorie: 'engagements', type: 'PDF', taille: '0.1 Mo', auteur: 'Direction du Budget',
    dateDepot: '17/07/2026', statut: 'VALIDE',
    tags: ['saisine', 'CF', 'engagement'], dossierLie: 'ENG-2026-002'
  },
]

const STATUS_CFG: Record<DocStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  VALIDE: { label: 'Valide', bg: '#DCFCE7', text: '#166534', icon: <CheckCircle size={10} /> },
  EN_ATTENTE: { label: 'En attente', bg: '#FEF3C7', text: '#92400E', icon: <Clock size={10} /> },
  EXPIRE: { label: 'Expiré', bg: '#FEE2E2', text: '#991B1B', icon: <AlertCircle size={10} /> },
  CONFIDENTIEL: { label: 'Confidentiel', bg: '#EDE9FE', text: '#5B21B6', icon: <Lock size={10} /> },
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  PDF: <FileText size={15} className="text-red-500" />,
  XLSX: <File size={15} className="text-green-600" />,
  DOCX: <File size={15} className="text-blue-600" />,
}

export default function GED() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showDepotModal, setShowDepotModal] = useState(false)
  const [apercuDoc, setApercuDoc] = useState<Doc | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showPartageModal, setShowPartageModal] = useState(false)
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false)
  const [partageEmail, setPartageEmail] = useState('')
  const [partageMsg, setPartageMsg] = useState('')
  const [depotNom, setDepotNom] = useState('')
  const [depotType, setDepotType] = useState('PDF')
  const [depotCategorie, setDepotCategorie] = useState('budgetaires')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const filtered = DOCUMENTS.filter(d => {
    if (activeCategory !== 'all' && d.categorie !== activeCategory) return false
    if (search && !d.nom.toLowerCase().includes(search.toLowerCase()) && !d.reference.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title text-2xl">Gestion Électronique des Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">Archivage institutionnel — {DOCUMENTS.length} documents — Exercice 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm flex items-center gap-1.5" onClick={() => setShowAdvancedFilters(f => !f)}><Filter size={13} /> Filtres avancés</button>
          <button className="btn btn-primary btn-sm flex items-center gap-1.5" onClick={() => setShowDepotModal(true)}><Upload size={13} /> Déposer un document</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Documents total', value: 142, color: '#0B1C3E' },
          { label: 'Valides', value: 128, color: '#16A34A' },
          { label: 'En attente visa', value: 9, color: '#D97706' },
          { label: 'Expirés', value: 5, color: '#DC2626' },
        ].map((k, i) => (
          <div key={i} className="kpi-card py-3" style={{ borderLeft: `3px solid ${k.color}` }}>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">{k.label}</div>
            <div className="amount text-2xl font-bold mt-0.5" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Advanced filters panel */}
      {showAdvancedFilters && (
        <div className="card p-4 border-l-4" style={{ borderLeftColor: '#0B1C3E' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold" style={{ color: '#0B1C3E' }}>Filtres avancés</span>
            <button onClick={() => setShowAdvancedFilters(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div><label className="form-label">Type de document</label><select className="form-input text-[12px]"><option>Tous</option><option>PDF</option><option>XLSX</option><option>DOCX</option></select></div>
            <div><label className="form-label">Date de dépôt (début)</label><input type="date" className="form-input text-[12px]" /></div>
            <div><label className="form-label">Date de dépôt (fin)</label><input type="date" className="form-input text-[12px]" /></div>
            <div><label className="form-label">Auteur / Source</label><input type="text" className="form-input text-[12px]" placeholder="Ex : Direction du Budget" /></div>
            <div><label className="form-label">Statut</label><select className="form-input text-[12px]"><option>Tous</option><option>Valide</option><option>En attente</option><option>Expiré</option><option>Confidentiel</option></select></div>
            <div><label className="form-label">Dossier lié</label><input type="text" className="form-input text-[12px]" placeholder="Ex : ENG-2026-002" /></div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn btn-primary btn-sm">Appliquer les filtres</button>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAdvancedFilters(false)}>Réinitialiser</button>
          </div>
        </div>
      )}

      <div className="flex gap-5">
        {/* Sidebar categories */}
        <div className="w-52 flex-shrink-0 space-y-1">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-3 px-2">Catégories</div>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${activeCategory === cat.id ? 'bg-navy-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              style={activeCategory === cat.id ? { background: '#0B1C3E' } : {}}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="flex items-center gap-2">
                <span className={activeCategory === cat.id ? 'text-white' : 'text-gray-400'}>{cat.icon}</span>
                <span className="text-[12.5px] font-medium">{cat.label}</span>
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="form-input pl-9 py-2 text-[13px]"
                placeholder="Nom du document, référence, mot-clé…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <span className="text-[12px] text-gray-400">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
          </div>

          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Référence</th>
                  <th>Dossier lié</th>
                  <th>Auteur / Source</th>
                  <th>Dépôt</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => {
                  const sc = STATUS_CFG[doc.statut]
                  return (
                    <tr key={doc.id} className="cursor-pointer" onClick={() => setSelectedDoc(doc === selectedDoc ? null : doc)}>
                      <td>
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex-shrink-0">{TYPE_ICON[doc.type] ?? <File size={15} className="text-gray-400" />}</div>
                          <div>
                            <div className="font-medium text-[13px] text-gray-900 leading-snug">{doc.nom}</div>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {doc.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#EDF2FB', color: '#1B3269' }}>
                                  <Tag size={8} /> {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td><span className="font-mono text-[11.5px] text-gray-600">{doc.reference}</span></td>
                      <td>
                        {doc.dossierLie
                          ? <span className="font-mono text-[11.5px] text-ceeac-700 underline decoration-dotted">{doc.dossierLie}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="text-[12.5px] text-gray-600">{doc.auteur}</td>
                      <td>
                        <div className="font-mono text-[12px] text-gray-600">{doc.dateDepot}</div>
                        {doc.dateExpiration && (
                          <div className={`text-[10.5px] font-mono ${doc.statut === 'EXPIRE' ? 'text-red-500' : 'text-gray-400'}`}>
                            exp. {doc.dateExpiration}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge text-[10.5px] px-2 py-0.5 flex items-center gap-1 w-fit"
                          style={{ background: sc.bg, color: sc.text }}>
                          {sc.icon} {sc.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-outline btn-sm gap-1" title="Aperçu" onClick={e => { e.stopPropagation(); setApercuDoc(doc) }}><Eye size={11} /></button>
                          <button className="btn btn-outline btn-sm gap-1" title="Télécharger" onClick={e => { e.stopPropagation(); showToast(`Téléchargement de ${doc.nom} en cours...`) }}><Download size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedDoc && (
            <div className="card p-5 border-l-4" style={{ borderLeftColor: '#0B1C3E' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-[15px] text-gray-900">{selectedDoc.nom}</div>
                  <div className="font-mono text-[12px] text-gray-500 mt-0.5">{selectedDoc.reference}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-lg font-light" onClick={() => setSelectedDoc(null)}>✕</button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-[13px]">
                {[
                  { label: 'Catégorie', value: CATEGORIES.find(c => c.id === selectedDoc.categorie)?.label ?? selectedDoc.categorie },
                  { label: 'Format', value: selectedDoc.type },
                  { label: 'Taille', value: selectedDoc.taille },
                  { label: 'Auteur / Source', value: selectedDoc.auteur },
                  { label: 'Date de dépôt', value: selectedDoc.dateDepot },
                  { label: 'Expiration', value: selectedDoc.dateExpiration ?? 'Sans date limite' },
                  { label: 'Dossier lié', value: selectedDoc.dossierLie ?? '—' },
                  { label: 'Statut', value: STATUS_CFG[selectedDoc.statut].label },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-[10.5px] uppercase font-semibold tracking-wider text-gray-400 mb-0.5">{item.label}</div>
                    <div className="font-medium text-gray-800 font-mono">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary btn-sm gap-1.5" onClick={() => setApercuDoc(selectedDoc)}><Eye size={12} /> Aperçu</button>
                <button className="btn btn-outline btn-sm gap-1.5" onClick={() => showToast(`Téléchargement de ${selectedDoc.nom} en cours...`)}><Download size={12} /> Télécharger</button>
                <button className="btn btn-outline btn-sm flex items-center gap-1" onClick={() => setShowPartageModal(true)}><Share2 size={11} />Partager</button>
                <button className="btn btn-outline btn-sm flex items-center gap-1" onClick={() => setShowHistoriqueModal(true)}><History size={11} />Historique</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium" style={{ background: '#0B1C3E', minWidth: 300 }}>
          <Download size={14} className="flex-shrink-0" />{toast}
        </div>
      )}

      {/* Aperçu modal */}
      {apercuDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[480px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Aperçu du document</span>
              <button onClick={() => setApercuDoc(null)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="rounded-lg border flex flex-col items-center justify-center py-10 mb-4" style={{ background: '#F8FBFF', borderColor: '#E5E9F0' }}>
              <FileText size={48} className="text-red-400 mb-3" />
              <div className="text-[13px] font-semibold text-gray-700 text-center px-4">{apercuDoc.nom}</div>
              <div className="text-[11px] text-gray-500 mt-1">{apercuDoc.type} · {apercuDoc.taille}</div>
              <div className="text-[10px] text-gray-400 mt-3">Aperçu non disponible — affichage en visionneuse externe</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-[12px] mb-4">
              <div><div className="text-[10px] text-gray-400 uppercase font-semibold">Référence</div><div className="font-mono font-medium text-gray-700">{apercuDoc.reference}</div></div>
              <div><div className="text-[10px] text-gray-400 uppercase font-semibold">Pages</div><div className="font-medium text-gray-700">{Math.floor(Math.random() * 40) + 2} pages</div></div>
              <div><div className="text-[10px] text-gray-400 uppercase font-semibold">Statut</div><div className="font-medium" style={{ color: STATUS_CFG[apercuDoc.statut].text }}>{STATUS_CFG[apercuDoc.statut].label}</div></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-outline btn-sm" onClick={() => { showToast(`Téléchargement de ${apercuDoc.nom} en cours...`); setApercuDoc(null) }}><Download size={12} className="inline mr-1" />Télécharger</button>
              <button className="btn btn-primary btn-sm" onClick={() => setApercuDoc(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Dépôt modal */}
      {showDepotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[480px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Déposer un document</span>
              <button onClick={() => setShowDepotModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="form-label">Nom du document *</label><input className="form-input text-[13px]" placeholder="Ex : Facture n°0045 — SOLTEC SA" value={depotNom} onChange={e => setDepotNom(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Type</label><select className="form-input text-[12px]" value={depotType} onChange={e => setDepotType(e.target.value)}><option>PDF</option><option>XLSX</option><option>DOCX</option><option>CSV</option></select></div>
                <div><label className="form-label">Catégorie</label><select className="form-input text-[12px]" value={depotCategorie} onChange={e => setDepotCategorie(e.target.value)}>{CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
              </div>
              <div>
                <label className="form-label">Fichier *</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor: '#93C5FD' }}>
                  <Upload size={24} className="mx-auto mb-2 text-blue-400" />
                  <div className="text-[12px] text-gray-600">Glissez votre fichier ou <span className="text-blue-600 underline">parcourir</span></div>
                  <div className="text-[10px] text-gray-400 mt-1">PDF, XLSX, DOCX · 50 MB max</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary btn-sm flex-1" onClick={() => { setShowDepotModal(false); showToast("Document déposé avec succès.") }} disabled={!depotNom}>Valider le dépôt</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDepotModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Partage modal */}
      {showPartageModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[420px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Partager le document</span>
              <button onClick={() => setShowPartageModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="text-[12px] text-gray-500 mb-3 truncate font-mono">{selectedDoc.reference} — {selectedDoc.nom}</div>
            <div className="space-y-3">
              <div><label className="form-label">E-mail du destinataire</label><input className="form-input text-[13px]" placeholder="prenom.nom@institution.org" value={partageEmail} onChange={e => setPartageEmail(e.target.value)} /></div>
              <div><label className="form-label">Message (optionnel)</label><textarea className="form-input text-[12px] resize-none" rows={3} placeholder="Objet du partage..." value={partageMsg} onChange={e => setPartageMsg(e.target.value)} /></div>
              <div className="flex items-center gap-2 p-2 rounded-lg border text-[11px]" style={{ borderColor: '#E5E9F0', background: '#F8FBFF' }}>
                <span className="flex-1 text-gray-500 font-mono truncate">https://ged.ceeac.org/docs/{selectedDoc.id}</span>
                <button className="btn btn-outline btn-sm text-[10px] px-2 py-0.5" onClick={() => { navigator.clipboard.writeText(`https://ged.ceeac.org/docs/${selectedDoc.id}`); showToast("Lien copié dans le presse-papiers !") }}>Copier le lien</button>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary btn-sm flex-1" onClick={() => { setShowPartageModal(false); showToast("Document partagé avec succès.") }}>Envoyer</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowPartageModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Historique des versions modal */}
      {showHistoriqueModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(11,28,62,0.55)' }}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[540px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold" style={{ color: '#0B1C3E' }}>Historique des versions</span>
              <button onClick={() => setShowHistoriqueModal(false)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
            </div>
            <div className="text-[12px] text-gray-500 mb-3 font-mono">{selectedDoc.nom}</div>
            <table className="data-table w-full">
              <thead><tr><th>Version</th><th>Date</th><th>Auteur</th><th>Modification</th><th>Actions</th></tr></thead>
              <tbody>
                {[
                  { v: 'v3.0', date: selectedDoc.dateDepot, auteur: selectedDoc.auteur, note: 'Version courante' },
                  { v: 'v2.1', date: '14/06/2026', auteur: selectedDoc.auteur, note: 'Corrections mineures' },
                  { v: 'v2.0', date: '01/05/2026', auteur: 'Secrétariat Général', note: 'Révision complète' },
                  { v: 'v1.0', date: '02/01/2026', auteur: 'Direction du Budget', note: 'Version initiale' },
                ].map((ver, i) => (
                  <tr key={i}>
                    <td><span className={`font-mono font-bold text-[11px] ${i === 0 ? 'text-blue-600' : 'text-gray-500'}`}>{ver.v}</span>{i === 0 && <span className="ml-1 badge bg-blue-100 text-blue-600 text-[9px]">actuelle</span>}</td>
                    <td className="font-mono text-[11px] text-gray-500">{ver.date}</td>
                    <td className="text-[11px] text-gray-600">{ver.auteur}</td>
                    <td className="text-[11px] text-gray-500 italic">{ver.note}</td>
                    <td><button className="btn btn-outline btn-sm text-[9px] px-2 py-0.5" onClick={() => showToast(`Téléchargement de ${selectedDoc.nom} (${ver.v}) en cours...`)}>Restaurer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button className="btn btn-outline btn-sm" onClick={() => setShowHistoriqueModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
