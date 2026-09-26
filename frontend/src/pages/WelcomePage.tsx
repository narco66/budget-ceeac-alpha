import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, BarChart3, Eye, EyeOff, FileText, Globe, LoaderCircle, Lock, LogIn, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../api/client'
import type { ApiSuccess, SessionUser } from '../api/types'
import logo from '../assets/logo-ceeac.jpg'
import { useAuth } from '../auth/AuthProvider'
import { writeToken } from '../auth/token'
import { loginSchema, type LoginValues } from '../features/auth/loginSchema'

const FEATURES = [
  { icon: BarChart3, title: 'Planification stratégique', text: 'Chaîne de résultats, de la stratégie jusqu’aux tâches.' },
  { icon: FileText, title: 'Exécution budgétaire', text: 'Circuit EB, engagement, liquidation, ordonnancement et paiement.' },
  { icon: Globe, title: 'Budget unique', text: 'Fonctionnement et PAP dans un même référentiel.' },
  { icon: Users, title: 'Séparation des fonctions', text: 'Habilitations, périmètres et contrôle des incompatibilités.' },
]

const COUNTRIES = [
  'Angola', 'Burundi', 'Cameroun', 'Congo', 'Gabon', 'Guinée équatoriale',
  'RCA', 'RDC', 'Rwanda', 'São Tomé-et-Príncipe', 'Tchad',
]

export function WelcomePage() {
  const { user, setSession } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  if (user) {
    return <Navigate to="/app" replace />
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError('')
    try {
      const response = await api<ApiSuccess<{ token: string; user: SessionUser }>>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: values.email, password: values.password }),
      })
      writeToken(response.data.token, values.remember)
      setSession(response.data.user)
      navigate('/app')
    } catch (error) {
      if (error instanceof ApiError) {
        const detail = Object.values(error.errors).flat()[0]
        setFormError(detail ?? error.message)
        return
      }
      setFormError('La connexion n’a pas abouti.')
    }
  })

  return (
    <div className="flex min-h-full">
      <section className="relative hidden w-[52%] flex-col overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-800 px-12 py-10 text-white lg:flex">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo de la CEEAC" className="h-16 w-16 rounded-full bg-white object-cover ring-2 ring-white/20" />
          <div>
            <div className="text-lg font-bold tracking-wide">BUDGET-CEEAC</div>
            <div className="text-xs tracking-widest text-white/50 uppercase">Système de gestion budgétaire</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-ceeac-700/50 bg-ceeac-700/25 px-3 py-1 text-xs font-semibold tracking-widest text-green-300 uppercase">
            Commission de la CEEAC
          </p>
          <h1 className="font-serif text-5xl leading-tight">
            Pilotez vos finances<br />
            <span className="text-blue-200">au service de</span><br />
            l’intégration africaine
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
            Plateforme intégrée de planification, de budgétisation et d’exécution de la dépense de la Communauté économique des États de l’Afrique centrale.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                    <Icon size={14} aria-hidden />
                    {feature.title}
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/50">{feature.text}</p>
                </article>
              )
            })}
          </div>
          <div className="mt-8">
            <div className="mb-2 text-[10px] tracking-widest text-white/40 uppercase">États membres</div>
            <div className="flex flex-wrap gap-1.5">
              {COUNTRIES.map((country) => (
                <span key={country} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
          <span>Commission de la CEEAC — Libreville</span>
          <span className="inline-flex items-center gap-1"><Lock size={12} aria-hidden /> Accès authentifié</span>
        </footer>
      </section>

      <section className="flex flex-1 flex-col bg-[#F5F7FB]">
        <div className="flex items-center gap-3 bg-navy-900 px-6 py-4 text-white lg:hidden">
          <img src={logo} alt="" className="h-9 w-9 rounded-full bg-white object-cover" />
          <span className="text-sm font-bold">BUDGET-CEEAC</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-widest text-navy-900 uppercase">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <Shield size={18} aria-hidden />
                </span>
                Authentification sécurisée
              </div>
              <h2 className="font-serif text-3xl text-navy-900">Connexion à votre espace</h2>
              <p className="mt-2 text-sm text-slate-500">
                Utilisez les identifiants qui vous ont été attribués. Aucun compte de démonstration n’est proposé ici.
              </p>
            </div>

            {formError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
                <AlertCircle size={18} aria-hidden />
                {formError}
              </div>
            )}

            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Adresse email institutionnelle
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
                  {...form.register('email')}
                />
                {form.formState.errors.email && <p className="mt-1 text-xs text-red-700">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-slate-700">Mot de passe</label>
                  <Link to="/mot-de-passe-oublie" className="text-xs font-medium text-navy-500">Mot de passe oublié ?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.password && <p className="mt-1 text-xs text-red-700">{form.formState.errors.password.message}</p>}
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" {...form.register('remember')} />
                Conserver la session sur cet appareil
              </label>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <LogIn size={16} />}
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
