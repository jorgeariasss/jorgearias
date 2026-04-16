import type { User } from '@supabase/supabase-js'
import { LandingPage } from './LandingPage'
import { AppPage } from './AppPage'

interface HomePageProps {
  user: User | null
}

export function HomePage({ user }: HomePageProps) {
  if (user) return <AppPage user={user} />
  return <LandingPage />
}
