import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Github, AlertCircle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { toast } from 'sonner'

export function Settings() {
  const { value: apiKey, setValue: setApiKey } = useSettings('replicateApiKey', '')
  const { value: outputFolder, setValue: setOutputFolder } = useSettings('outputFolder', '')
  const { value: openOnComplete, setValue: setOpenOnComplete } = useSettings('openFileOnComplete', true)
  const { value: enableNotifications, setValue: setEnableNotifications } = useSettings('enableNotifications', true)
  const [showKey, setShowKey] = useState(false)
  const [version, setVersion] = useState('0.0.1')
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    window.api.app.getVersion().then(setVersion)
  }, [])

  const handleSelectFolder = async () => {
    const folder = await window.api.files.selectOutputDir()
    if (folder) {
      setOutputFolder(folder)
      toast.success('Pasta alterada')
    }
  }

  const handleValidateKey = async () => {
    setValidating(true)
    try {
      const isValid = await window.api.replicate.validateKey(apiKey)
      if (isValid) {
        toast.success('Chave válida')
      } else {
        toast.error('Chave inválida')
      }
    } catch {
      toast.error('Erro ao validar')
    } finally {
      setValidating(false)
    }
  }

  const handleCheckUpdates = async () => {
    toast.info('Verificando atualizações...')
    await window.api.app.checkForUpdates()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Configurações</h1>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Geral</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-text-primary font-medium mb-2">Pasta de saída</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outputFolder}
                  readOnly
                  className="flex-1 px-4 py-2 bg-surface-hover border border-border rounded-lg text-text-secondary"
                  placeholder="Nenhuma pasta selecionada"
                />
                <button
                  onClick={handleSelectFolder}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-background rounded-lg font-medium transition-colors"
                >
                  Alterar
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-text-primary font-medium">Abrir arquivo ao terminar</label>
              <input
                type="checkbox"
                checked={openOnComplete}
                onChange={(e) => setOpenOnComplete(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-text-primary font-medium">Notificações do sistema</label>
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* API */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">API do Replicate</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-text-primary font-medium mb-2">Chave de API</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-hover border border-border rounded-lg text-text-primary"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button
                  onClick={handleValidateKey}
                  disabled={validating || !apiKey}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-background rounded-lg font-medium transition-colors"
                >
                  {validating ? 'Validando...' : 'Validar'}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary text-sm">
                Sua chave é armazenada localmente e nunca é compartilhada.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Sobre</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Versão</span>
              <span className="text-text-primary font-medium">{version}</span>
            </div>

            <button
              onClick={handleCheckUpdates}
              className="w-full px-4 py-2 bg-surface-hover hover:bg-surface-hover/80 text-text-primary rounded-lg font-medium transition-colors border border-border"
            >
              Verificar atualizações
            </button>

            <div className="flex gap-2">
              <a
                href="https://github.com/crisaenz10/motionclone"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface-hover hover:bg-surface-hover/80 text-text-primary rounded-lg font-medium transition-colors border border-border"
              >
                <Github size={18} />
                GitHub
              </a>
            </div>

            <p className="text-text-muted text-xs text-center">
              Construído com ❤ usando Electron, React e Replicate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
