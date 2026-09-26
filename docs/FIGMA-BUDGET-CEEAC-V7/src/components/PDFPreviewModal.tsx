import { useRef, type ReactNode } from 'react'
import { X, Printer, Download, ExternalLink, Clock, FileText } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  reference: string
  docCode: string
  onClose: () => void
  children: ReactNode
}

const HISTORY = [
  { version: 'v1.0', date: '09/09/2026 08:14', user: 'Système', action: 'Génération initiale' },
]

export default function PDFPreviewModal({ title, subtitle, reference, docCode, onClose, children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow || !contentRef.current) return
    const styles = Array.from(document.styleSheets)
      .map(s => {
        try { return Array.from(s.cssRules).map(r => r.cssText).join('\n') }
        catch { return '' }
      })
      .join('\n')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8"/>
        <title>${title} — ${reference}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
          body { margin: 0; padding: 0; background: white; }
          .pdf-doc { margin: 0 auto; }
          ${styles}
          @media print {
            @page { size: A4; margin: 0; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>${contentRef.current.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => { printWindow.focus(); printWindow.print() }, 500)
  }

  const handleDownload = () => {
    if (!contentRef.current) return
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>${title} — ${reference}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { margin: 0; padding: 0; background: white; font-family: Inter, Arial, sans-serif; }
    @media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>${contentRef.current.innerHTML}</body>
</html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docCode}_${reference.replace(/\//g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(11, 28, 62, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: '#0B1C3E', borderBottom: '1px solid rgba(255,255,255,0.12)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1A6B3A' }}>
            <FileText size={15} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-[14px] leading-tight">{title}</div>
            <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {reference} {subtitle ? `· ${subtitle}` : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <Printer size={13} /> Imprimer
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ background: '#1A6B3A', color: 'white', border: '1px solid #1A6B3A' }}
            onMouseOver={e => (e.currentTarget.style.background = '#155e32')}
            onMouseOut={e => (e.currentTarget.style.background = '#1A6B3A')}
          >
            <Download size={13} /> Télécharger
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + document ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 overflow-y-auto p-4 space-y-5" style={{ background: '#111827', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Document</div>
            <div className="space-y-1">
              {[
                { label: 'Code', value: docCode },
                { label: 'Référence', value: reference },
                { label: 'Format', value: 'A4 Portrait' },
                { label: 'Pages', value: '1 / 1' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Statut</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1A6B3A' }} />
              <span className="text-[11px]" style={{ color: '#4ADE80' }}>Généré</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Historique</div>
            <div className="space-y-2">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <Clock size={9} style={{ color: 'rgba(255,255,255,0.35)' }} />
                    <span className="text-[9.5px] font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{h.version}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{h.action}</span>
                  <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{h.date} · {h.user}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Actions</div>
            <div className="space-y-1.5">
              {[
                { icon: <Printer size={12} />, label: 'Imprimer', action: handlePrint },
                { icon: <Download size={12} />, label: 'Télécharger', action: handleDownload },
                { icon: <ExternalLink size={12} />, label: 'Ouvrir dans onglet', action: handlePrint },
              ].map(({ icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors text-left"
                  style={{ color: 'rgba(255,255,255,0.65)', background: 'transparent' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document preview */}
        <div className="flex-1 overflow-y-auto py-8" style={{ background: '#374151' }}>
          <div ref={contentRef} style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
