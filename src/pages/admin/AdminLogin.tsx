import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export function AdminLogin() {
  const { user, signIn, loading, configError } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('anthonyjuniorbritoabreu11@gmail.com')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!loading && user) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await signIn(email, password)
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(from || '/admin', { replace: true })
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo iniciar sesion.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-700 text-white">
          <Lock size={20} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-950">Entrar al admin</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Usa el usuario administrador creado en Supabase Auth.
        </p>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="field-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className="field-input mt-2"
              value={email}
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-password">
              Contrasena
            </label>
            <input
              id="admin-password"
              className="field-input mt-2"
              value={password}
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>

        {configError || error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {configError || error}
          </p>
        ) : null}

        <button type="submit" className="primary-button mt-5 w-full" disabled={submitting || Boolean(configError)}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
