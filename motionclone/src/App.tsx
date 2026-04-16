import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useGenerations } from '@/hooks/useGenerations'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { HistoryPage } from '@/pages/HistoryPage'

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { generations, loading: genLoading, deleteGeneration } = useGenerations(user?.id)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onSignOut={signOut} />}>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/auth" element={<AuthPage onSignIn={signIn} onSignUp={signUp} />} />
          <Route element={<ProtectedRoute user={user} loading={loading} />}>
            <Route
              path="/history"
              element={
                <HistoryPage
                  generations={generations}
                  loading={genLoading}
                  onDelete={deleteGeneration}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
