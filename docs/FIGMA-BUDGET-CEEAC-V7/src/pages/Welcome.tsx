import { useState } from 'react'
import { Eye, EyeOff, LogIn, Shield, ChevronRight, Globe, BarChart3, FileText, Users, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Props {
  onLogin: (user: { nom: string; role: string; structure: string; email: string }) => void
}

const USERS = [
  {
    email: 'sg@ceeac-eccas.org',
    password: 'SG@2026',
    nom: 'Dr. Jean-Baptiste Ondaye',
    role: 'Secrétaire Général',
    structure: 'Secrétariat Général',
    badge: 'SG',
    color: '#D97706',
  },
  {
    email: 'daf@ceeac-eccas.org',
    password: 'DAF@2026',
    nom: 'Marie-Claire Nkumu',
    role: 'Directeur des Affaires Financières',
    structure: 'Direction des Affaires Financières',
    badge: 'DAF',
    color: '#1A6B3A',
  },
  {
    email: 'cf@ceeac-eccas.org',
    password: 'CF@2026',
    nom: 'Emmanuel Lissouba',
    role: 'Contrôleur Financier',
    structure: 'Contrôle Financier',
    badge: 'CF',
    color: '#0B1C3E',
  },
  {
    email: 'rp@ceeac-eccas.org',
    password: 'RP@2026',
    nom: 'Fatima Al-Rashid',
    role: 'Responsable Programme',
    structure: 'Direction des Programmes',
    badge: 'RP',
    color: '#7C3AED',
  },
  {
    email: 'admin@ceeac-eccas.org',
    password: 'Admin@2026',
    nom: 'Système Administrateur',
    role: 'Administrateur Système',
    structure: 'DSI / Informatique',
    badge: 'ADM',
    color: '#DC2626',
  },
]

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Planification Stratégique',
    desc: 'Pilotage multi-exercices avec suivi hiérarchique à 6 niveaux',
  },
  {
    icon: FileText,
    title: 'Exécution Budgétaire',
    desc: 'Circuit complet : EB → Engagement → Liquidation → Paiement',
  },
  {
    icon: Globe,
    title: 'Interopérabilité',
    desc: 'Connexion avec les systèmes des 11 États membres',
  },
  {
    icon: Users,
    title: 'Gouvernance Multi-acteurs',
    desc: 'Workflows collaboratifs avec séparation des rôles',
  },
]

const COUNTRIES = [
  'Angola', 'Burundi', 'Cameroun', 'Congo', 'Gabon',
  'Guinée Équatoriale', 'RCA', 'RDC', 'Rwanda', 'São Tomé-et-Príncipe', 'Tchad',
]

export default function Welcome({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showDemoPanel, setShowDemoPanel] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const user = USERS.find(u => u.email === email.trim() && u.password === password)
      if (user) {
        setSuccess(true)
        setTimeout(() => {
          onLogin({ nom: user.nom, role: user.role, structure: user.structure, email: user.email })
        }, 800)
      } else {
        setError("Identifiants incorrects. Vérifiez votre email et mot de passe.")
        setLoading(false)
      }
    }, 900)
  }

  const fillDemo = (user: typeof USERS[0]) => {
    setEmail(user.email)
    setPassword(user.password)
    setShowDemoPanel(false)
    setError('')
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* LEFT PANEL — Brand */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #050F20 0%, #0B1C3E 45%, #132654 100%)' }}
      >
        {/* Geometric grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden>
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Radial glow top-right */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2B50A8 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
        />
        {/* Radial glow bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1A6B3A 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-10">

          {/* Logo + system name */}
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0 bg-white/10">
              <img
                src="/src/imports/LOGO-CEEAC-CERTO_.jpg"
                alt="CEEAC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight tracking-wide">BUDGET-CEEAC</div>
              <div className="text-white/50 text-xs tracking-widest uppercase mt-0.5">Système de Gestion Budgétaire</div>
            </div>
          </div>

          {/* Main tagline */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: 'rgba(27,106,58,0.25)', color: '#4ade80', border: '1px solid rgba(27,106,58,0.5)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Exercice 2026 en cours
              </span>
            </div>

            <h1
              className="text-4xl xl:text-5xl font-bold leading-[1.15] mb-6"
              style={{ color: 'white', fontFamily: "'DM Serif Display', serif" }}
            >
              Pilotez vos finances<br />
              <span style={{ color: '#93C5FD' }}>au service de</span><br />
              l'intégration africaine
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-10">
              Plateforme intégrée de gestion budgétaire de la Communauté Économique des États de l'Afrique Centrale — 11 États membres, une vision commune.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {FEATURES.map(f => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="rounded-xl p-4 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(43,80,168,0.4)' }}>
                        <Icon size={14} className="text-blue-300" />
                      </div>
                      <span className="text-white text-xs font-semibold leading-tight">{f.title}</span>
                    </div>
                    <p className="text-white/45 text-[11px] leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>

            {/* Countries strip */}
            <div>
              <div className="text-white/35 text-[10px] tracking-widest uppercase font-medium mb-2">États membres</div>
              <div className="flex flex-wrap gap-1.5">
                {COUNTRIES.map(c => (
                  <span
                    key={c}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <span className="text-white/30 text-xs">© 2026 CEEAC-ECCAS · Tous droits réservés</span>
            <div className="flex items-center gap-1 text-white/30 text-xs">
              <Lock size={10} />
              <span>Accès sécurisé SSL/TLS</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Login */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ background: '#F5F7FB' }}>

        {/* Mobile logo bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-6 py-4 border-b"
          style={{ background: '#0B1C3E', borderColor: '#1B3269' }}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10">
            <img src="/src/imports/LOGO-CEEAC-CERTO_.jpg" alt="CEEAC" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-bold text-sm">BUDGET-CEEAC</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12">

          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: '#0B1C3E' }}
                >
                  <Shield size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#0B1C3E' }}>Authentification Sécurisée</span>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#0B1C3E', fontFamily: "'DM Serif Display', serif" }}>
                Connexion à votre espace
              </h2>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Utilisez vos identifiants institutionnels CEEAC pour accéder à la plateforme.
              </p>
            </div>

            {/* Success state */}
            {success && (
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
                style={{ background: '#ECFDF5', border: '1px solid #86EFAC' }}
              >
                <CheckCircle2 size={18} style={{ color: '#16A34A' }} />
                <span className="text-sm font-medium" style={{ color: '#15803D' }}>Connexion réussie, redirection en cours…</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6"
                style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}
              >
                <AlertCircle size={18} style={{ color: '#DC2626' }} />
                <span className="text-sm" style={{ color: '#991B1B' }}>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: '#374151' }}>
                  Adresse email institutionnelle
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="prenom.nom@ceeac-eccas.org"
                  required
                  disabled={loading || success}
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                  style={{
                    background: 'white',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#0B1C3E')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold tracking-wide" style={{ color: '#374151' }}>
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium hover:underline transition-colors"
                    style={{ color: '#2B50A8' }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    required
                    disabled={loading || success}
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all outline-none"
                    style={{
                      background: 'white',
                      border: '1.5px solid #E2E8F0',
                      color: '#1E293B',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#0B1C3E')}
                    onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                    style={{ color: '#94A3B8' }}
                    disabled={loading || success}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div
                    className="w-4 h-4 rounded border-2 peer-checked:border-0 peer-checked:flex peer-checked:items-center peer-checked:justify-center transition-all"
                    style={{ borderColor: '#CBD5E1', background: 'white' }}
                  />
                </div>
                <span className="text-xs" style={{ color: '#64748B' }}>Garder ma session ouverte sur cet appareil</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: loading || success ? '#4B72C8' : '#0B1C3E',
                  opacity: !email || !password ? 0.5 : 1,
                  cursor: !email || !password ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(11,28,62,0.3)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Vérification…
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={16} />
                    Connexion réussie
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Accès démonstration</span>
                <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
              </div>

              <button
                type="button"
                onClick={() => setShowDemoPanel(!showDemoPanel)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors"
                style={{
                  background: 'white',
                  border: '1.5px solid #E2E8F0',
                  color: '#374151',
                }}
              >
                <span className="font-medium">Comptes de démonstration</span>
                <ChevronRight
                  size={16}
                  style={{
                    color: '#94A3B8',
                    transform: showDemoPanel ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {showDemoPanel && (
                <div
                  className="mt-2 rounded-xl overflow-hidden"
                  style={{ border: '1.5px solid #E2E8F0', background: 'white' }}
                >
                  {USERS.map((u, i) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => fillDemo(u)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                      style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                        style={{ background: u.color }}
                      >
                        {u.badge}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: '#1E293B' }}>{u.nom}</div>
                        <div className="text-[11px] truncate" style={{ color: '#64748B' }}>{u.role}</div>
                      </div>
                      <ChevronRight size={14} className="ml-auto flex-shrink-0" style={{ color: '#CBD5E1' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Security note */}
            <div
              className="flex items-start gap-3 mt-8 p-4 rounded-xl"
              style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
            >
              <Lock size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#2563EB' }} />
              <p className="text-[11px] leading-relaxed" style={{ color: '#1D4ED8' }}>
                Vos données sont protégées par un chiffrement TLS 1.3. Ne partagez jamais vos identifiants. En cas de problème, contactez la DSI : <span className="font-semibold">dsi@ceeac-eccas.org</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-8 py-4 flex items-center justify-between border-t text-xs"
          style={{ borderColor: '#E2E8F0', color: '#94A3B8' }}
        >
          <span>Version 3.2.0 · BUDGET-CEEAC</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  )
}
