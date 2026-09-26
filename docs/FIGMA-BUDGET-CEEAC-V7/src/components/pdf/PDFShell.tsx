import type { ReactNode } from 'react'

/* ── CEEAC institutional logo (simplified SVG emblem) ── */
export function CEEACLogo({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0B1C3E" stroke="#D4A017" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#D4A017" strokeWidth="1" />
      {/* African continent silhouette (simplified) */}
      <path d="M42 18 C38 22 36 28 37 34 C34 36 32 40 33 45 C30 48 30 54 33 58 C34 65 40 72 44 76 C46 80 50 82 50 82 C50 82 54 80 56 76 C60 72 66 65 67 58 C70 54 70 48 67 45 C68 40 66 36 63 34 C64 28 62 22 58 18 C55 16 52 15 50 15 C48 15 45 16 42 18 Z" fill="#1A6B3A" />
      {/* Stars representing member states */}
      {[0,1,2,3,4,5,6,7,8,9,10].map((i) => {
        const angle = (i / 11) * 2 * Math.PI - Math.PI / 2
        const r = 44
        const x = 50 + r * Math.cos(angle)
        const y = 50 + r * Math.sin(angle)
        return <circle key={i} cx={x} cy={y} r="2" fill="#D4A017" />
      })}
      <text x="50" y="95" textAnchor="middle" fontSize="7" fill="#D4A017" fontWeight="bold" fontFamily="serif">CEEAC-ECCAS</text>
    </svg>
  )
}

export interface SignatureBlock {
  titre: string
  nom: string
  date: string
  heure?: string
  statut?: 'VALIDE' | 'EN_ATTENTE' | 'NON_REQUIS'
}

interface PDFShellProps {
  codeRapport: string
  dateEdition: string
  exercice: string
  page?: string
  children: ReactNode
}

export function PDFShell({ codeRapport, dateEdition, exercice, page = '1 / 1', children }: PDFShellProps) {
  return (
    <div className="pdf-doc" style={{
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: '10.5px',
      color: '#1A1A1A',
      background: 'white',
      width: '794px',
      minHeight: '1123px',
      margin: '0 auto',
      padding: '32px 40px 24px',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* ── Document header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '2px solid #0B1C3E', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CEEACLogo size={68} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0B1C3E', letterSpacing: '0.02em', lineHeight: 1.2 }}>COMMISSION DE LA CEEAC</div>
            <div style={{ fontSize: '9px', color: '#374151', marginTop: '2px' }}>Communauté Économique des États de l&apos;Afrique Centrale</div>
            <div style={{ fontSize: '9px', color: '#374151' }}>Gestion de la Chaîne de la Dépense et de Suivi</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#1A6B3A', marginTop: '3px', letterSpacing: '0.05em' }}>GESBUDEP</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '9.5px', color: '#374151', lineHeight: '1.8' }}>
          <MetaRow label="Code rapport" value={codeRapport} />
          <MetaRow label="Date d'édition" value={dateEdition} />
          <MetaRow label="Exercice" value={exercice} />
          <MetaRow label="Page" value={page} />
        </div>
      </div>

      {/* ── Page content ── */}
      {children}

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '7px 40px',
        background: '#F1F5F9',
        borderTop: '1px solid #CBD5E1',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '8.5px',
        color: '#6B7280',
      }}>
        <span>Document officiel — GESBUDEP</span>
        <span>Commission de la CEEAC · Version électronique vérifiable</span>
        <span>Page {page}</span>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <span style={{ color: '#9CA3AF' }}>{label} :</span>
      <span style={{ fontWeight: 600, color: '#0B1C3E', minWidth: '110px', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

/* ── Reusable section header ── */
export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: '#EBF0F8',
      border: '1px solid #CBD5E1',
      borderLeft: '3px solid #0B1C3E',
      padding: '6px 10px',
      marginBottom: '10px',
      marginTop: '14px',
      fontSize: '10px',
      fontWeight: 700,
      color: '#0B1C3E',
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
    }}>
      {children}
    </div>
  )
}

/* ── Two-col info grid ── */
export function InfoGrid({ rows }: { rows: Array<{ label: string; value: string | ReactNode; wide?: boolean }> }) {
  const pairs: Array<Array<{ label: string; value: string | ReactNode; wide?: boolean }>> = []
  let i = 0
  while (i < rows.length) {
    if (rows[i].wide) { pairs.push([rows[i]]); i++ }
    else { pairs.push(rows.slice(i, i + 2)); i += 2 }
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
      <tbody>
        {pairs.map((pair, pi) => (
          <tr key={pi} style={{ borderBottom: '1px solid #F1F5F9' }}>
            {pair[0].wide ? (
              <td colSpan={4} style={{ padding: '5px 8px 5px 0' }}>
                <span style={{ color: '#6B7280', minWidth: '160px', display: 'inline-block' }}>{pair[0].label}</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{pair[0].value}</span>
              </td>
            ) : (
              <>
                <td style={{ padding: '5px 8px 5px 0', color: '#6B7280', width: '160px', verticalAlign: 'top' }}>{pair[0]?.label}</td>
                <td style={{ padding: '5px 16px 5px 0', fontWeight: 600, color: '#111827', verticalAlign: 'top' }}>{pair[0]?.value}</td>
                {pair[1] ? (
                  <>
                    <td style={{ padding: '5px 8px 5px 0', color: '#6B7280', width: '140px', verticalAlign: 'top' }}>{pair[1].label}</td>
                    <td style={{ padding: '5px 0', fontWeight: 600, color: '#111827', verticalAlign: 'top' }}>{pair[1].value}</td>
                  </>
                ) : <td colSpan={2} />}
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ── Financial table ── */
export function FinancialTable({ rows }: { rows: Array<{ label: string; value: string; highlight?: boolean }> }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{
            background: r.highlight ? '#EBF0F8' : i % 2 === 0 ? 'white' : '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
          }}>
            <td style={{ padding: '6px 10px', color: r.highlight ? '#0B1C3E' : '#374151', fontWeight: r.highlight ? 700 : 400 }}>{r.label}</td>
            <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: r.highlight ? 700 : 600, color: r.highlight ? '#0B1C3E' : '#111827' }}>{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ── Status badge ── */
export function PDFBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; color: string; border: string; label: string }> = {
    VALIDE: { bg: '#F0FDF4', color: '#166534', border: '#16A34A', label: 'VALIDÉ' },
    APPROUVE: { bg: '#F0FDF4', color: '#166534', border: '#16A34A', label: 'APPROUVÉ' },
    SIGNE: { bg: '#F0FDF4', color: '#166534', border: '#16A34A', label: 'SIGNÉ' },
    EN_ATTENTE: { bg: '#FFFBEB', color: '#92400E', border: '#D97706', label: 'EN ATTENTE' },
    BROUILLON: { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF', label: 'BROUILLON' },
    REJETE: { bg: '#FEF2F2', color: '#991B1B', border: '#DC2626', label: 'REJETÉ' },
    PAYE: { bg: '#F0FDF4', color: '#166534', border: '#16A34A', label: 'PAYÉ' },
  }
  const cfg = configs[status] ?? configs.EN_ATTENTE
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      border: `1.5px solid ${cfg.border}`,
      borderRadius: '4px',
      background: cfg.bg,
      color: cfg.color,
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '0.06em',
    }}>
      {cfg.label}
    </span>
  )
}

/* ── Signature blocks row ── */
export function SignatureRow({ blocks }: { blocks: SignatureBlock[] }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
      {blocks.map((b, i) => (
        <div key={i} style={{
          flex: 1,
          border: '1px solid #CBD5E1',
          borderRadius: '6px',
          padding: '10px 12px',
          textAlign: 'center',
          background: '#FAFAFA',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#0B1C3E', marginBottom: '4px' }}>{b.titre}</div>
          {b.statut === 'VALIDE' ? (
            <div style={{ color: '#1A6B3A', fontSize: '9.5px', fontWeight: 600, marginBottom: '6px' }}>
              ✓ Validé électroniquement
            </div>
          ) : b.statut === 'NON_REQUIS' ? (
            <div style={{ color: '#6B7280', fontSize: '9px', marginBottom: '6px' }}>— Non requis —</div>
          ) : (
            <div style={{ color: '#D97706', fontSize: '9px', fontWeight: 600, marginBottom: '6px' }}>⏳ En attente de signature</div>
          )}
          <div style={{ borderTop: '1px solid #D1D5DB', marginTop: '20px', paddingTop: '6px' }}>
            <div style={{ fontWeight: 600, fontSize: '10px', color: '#111827' }}>{b.nom}</div>
            <div style={{ fontSize: '8.5px', color: '#6B7280', marginTop: '2px' }}>{b.date}{b.heure ? ` · ${b.heure}` : ''}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
