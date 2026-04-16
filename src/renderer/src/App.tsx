import React, { useState, useEffect } from 'react'
import { Onboarding } from './pages/Onboarding'
import { Router } from './router'

export function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApiKey = async () => {
      const key = await window.api.settings.get('replicateApiKey')
      setHasApiKey(!!key)
    }

    checkApiKey()
  }, [])

  const handleOnboardingComplete = async () => {
    const key = await window.api.settings.get('replicateApiKey')
    setHasApiKey(!!key)
  }

  if (hasApiKey === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    )
  }

  if (!hasApiKey) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return <Router />
}
