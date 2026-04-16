import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface ProtectedRouteProps {
  user: User | null
  loading: boolean
}

export function ProtectedRoute({ user, loading }: ProtectedRouteProps) {
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return <Outlet />
}
