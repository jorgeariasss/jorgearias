import { useState, useEffect } from 'react'

const messages = [
  'Analisando pose...',
  'Transferindo movimento...',
  'Renderizando frames...',
  'Aplicando texturas...',
  'Finalizando...',
]

export function GenerationProgress() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageIndex(prev => (prev + 1) % messages.length)
    }, 8000)
    return () => clearTimeout(timeout)
  }, [messageIndex])

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="w-full max-w-xs h-2 bg-surface rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer" />
      </div>
      <p className="text-sm text-text-secondary transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
    </div>
  )
}
