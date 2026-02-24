import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'
import { useRequireAuth } from '../hooks/useRequireAuth.ts'

const loginSchema = z.object({
  email: z.string().email('Ervenytelen email cim'),
  password: z.string().min(6, 'A jelszo legalabb 6 karakter legyen'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { session, loading } = useRequireAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already logged in
  if (!loading && session) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null)
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setAuthError('Hibas email vagy jelszo')
        return
      }

      navigate('/admin/dashboard', { replace: true })
    } catch {
      setAuthError('Kapcsolodasi hiba. Probalja ujra.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-200">
        <p className="text-lg">Betoltese...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-800 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-amber-400">Inspekcio</h1>
          <p className="mt-2 text-sm text-stone-400">Bejelentkezes az admin feluletre</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-lg border border-stone-600 bg-stone-700 px-4 py-2.5 text-stone-100 placeholder-stone-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="pelda@email.hu"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-300">
              Jelszo
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full rounded-lg border border-stone-600 bg-stone-700 px-4 py-2.5 text-stone-100 placeholder-stone-500 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Jelszo"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Bejelentkezes...' : 'Bejelentkezes'}
          </button>
        </form>
      </div>
    </div>
  )
}
