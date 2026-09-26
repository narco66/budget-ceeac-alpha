import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../api/client'
import type { ApiSuccess } from '../api/types'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../features/auth/loginSchema'

export function ForgotPasswordPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setMessage('')
    setError('')
    try {
      const response = await api<ApiSuccess<null>>('/api/v1/auth/password/forgot', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      setMessage(response.message)
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'La demande n’a pas abouti.')
    }
  })

  return (
    <main className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-navy-900">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-slate-600">
          Indiquez votre adresse institutionnelle. Le message de confirmation est le même que le compte existe ou non.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="forgot-email" className="mb-1 block text-xs font-semibold">Adresse email</label>
            <input id="forgot-email" type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" {...form.register('email')} />
            {form.formState.errors.email && <p className="mt-1 text-xs text-red-700">{form.formState.errors.email.message}</p>}
          </div>
          {message && <p className="text-sm text-green-800" role="status">{message}</p>}
          {error && <p className="text-sm text-red-800" role="alert">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-navy-900 py-3 text-sm font-semibold text-white" disabled={form.formState.isSubmitting}>
            Envoyer la demande
          </button>
        </form>
        <Link to="/" className="mt-4 inline-block text-sm text-navy-500">Retour à la connexion</Link>
      </div>
    </main>
  )
}
