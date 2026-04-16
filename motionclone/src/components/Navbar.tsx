import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wand2, Menu, X, LogOut, History } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  user: User | null
  onSignOut: () => Promise<void>
}

export function Navbar({ user, onSignOut }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 1.0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const handleSignOut = async () => {
    await onSignOut()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-px" />
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <Wand2 className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
              <span className="text-lg font-bold tracking-tight">MotionClone</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {user && (
                <>
                  <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                    App
                  </Link>
                  <Link to="/history" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                    Histórico
                  </Link>
                </>
              )}
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-text-muted text-sm">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-error transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Entrar
                </Link>
              )}
            </div>

            <button
              className="md:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border-b border-border overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {user && (
                  <>
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium py-2">
                      App
                    </Link>
                    <Link to="/history" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium py-2">
                      <History className="w-4 h-4" />
                      Histórico
                    </Link>
                  </>
                )}
                {user ? (
                  <>
                    <span className="text-text-muted text-xs">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 text-sm text-error py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-medium text-center transition-colors"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
