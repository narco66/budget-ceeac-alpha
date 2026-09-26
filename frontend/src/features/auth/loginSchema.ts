import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
  remember: z.boolean(),
})

export type LoginValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide.'),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
