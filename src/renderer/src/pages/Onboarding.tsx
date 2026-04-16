import React, { useState } from 'react'
import { ExternalLink, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useSettings } from '../hooks/useSettings'

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [validating, setValidating] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const { value: savedKey, setValue: saveKey } = useSettings('replicateApiKey', '')

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      toast.error('Digite sua chave de API')
      return
    }

    setValidating(true)
    try {
      const isValid = await window.api.replicate.validateKey(apiKey)
      if (isValid) {
        await saveKey(apiKey)
        toast.success('Chave validada com sucesso!')
        onComplete()
      } else {
        toast.error('Chave de API inválida')
      }
    } catch (error) {
      toast.error('Erro ao validar chave')
    } finally {
      setValidating(false)
    }
  }

  const handleSkip = () => {
    setSkipped(true)
    onComplete()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Blobs background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
            top: '0%',
            left: '10%'
          }}
        />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-surface border border-border rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Bem-vindo ao MotionClone</h1>
            <p className="text-text-secondary">Transforme fotos em vídeos com inteligência artificial</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-text-primary font-medium">Crie uma conta no Replicate</p>
                <p className="text-text-secondary text-sm">Se ainda não tem conta</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-text-primary font-medium">Obtenha sua API key</p>
                <p className="text-text-secondary text-sm">Em Account → API Tokens</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-text-primary font-medium">Cole sua chave abaixo</p>
                <p className="text-text-secondary text-sm">E comece a gerar</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.api.files.openFile('https://replicate.com/account/api-tokens')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary font-medium transition-colors border border-primary/20"
            >
              <ExternalLink size={18} />
              Ir para API Tokens
            </button>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua chave aqui..."
                className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleValidate}
              disabled={validating}
              className="w-full px-4 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-xl text-background font-medium transition-colors"
            >
              {validating ? 'Validando...' : 'Validar e começar'}
            </button>

            <button
              onClick={handleSkip}
              className="w-full px-4 py-2 text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              Pular por agora
            </button>
          </div>

          <p className="text-text-muted text-xs text-center mt-6">
            Sua chave é armazenada localmente no seu computador e nunca é enviada para nossos servidores.
          </p>
        </div>
      </div>
    </div>
  )
}
