import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navbar } from './Navbar'
import type { User } from '@supabase/supabase-js'

interface LayoutProps {
  user: User | null
  onSignOut: () => Promise<void>
}

export function Layout({ user, onSignOut }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar user={user} onSignOut={onSignOut} />
      <main>
        <Outlet />
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#13131a',
            border: '1px solid #27272e',
            color: '#fafafa',
          },
        }}
      />
    </div>
  )
}
