import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'
import { FullPageSpinner } from '@/components/ui/Spinner'

export function LoginPage() {
  const { user, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-sm">
            🧭
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reiseplanleggeren</h1>
          <p className="mt-1 text-sm text-slate-500">
            Plan every leg of your journey in one clean timeline.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
