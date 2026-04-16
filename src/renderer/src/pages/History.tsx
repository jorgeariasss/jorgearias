import React, { useState } from 'react'
import { Clock, Trash2, Download } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { formatDate, formatDuration } from '../lib/utils'
import { toast } from 'sonner'

export function History() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all')
  const { generations, loading, deleteGeneration } = useHistory(filter)

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar?')) {
      await deleteGeneration(id)
      toast.success('Deletado')
    }
  }

  const handleDownload = async (generation: any) => {
    if (!generation.output_video_path) {
      toast.error('Vídeo não encontrado')
      return
    }

    try {
      const response = await fetch(generation.output_video_path)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `motionclone-${generation.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Erro ao baixar')
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Histórico</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'completed', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-background'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'completed' ? 'Concluídos' : 'Falhados'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Carregando...</p>
        </div>
      ) : generations.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">Nenhuma geração ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((gen) => (
            <div key={gen.id} className="bg-surface border border-border rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-text-primary">#{gen.id.slice(0, 8)}</p>
                  <p className="text-text-secondary text-sm">{formatDate(gen.created_at)}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    gen.status === 'completed'
                      ? 'bg-success/20 text-success'
                      : gen.status === 'failed'
                        ? 'bg-error/20 text-error'
                        : 'bg-primary/20 text-primary'
                  }`}
                >
                  {gen.status === 'completed' ? 'Concluído' : gen.status === 'failed' ? 'Falhou' : 'Processando'}
                </span>
              </div>

              {gen.duration_ms && (
                <p className="text-text-secondary text-sm mb-3">Duração: {formatDuration(gen.duration_ms)}</p>
              )}

              <div className="flex gap-2">
                {gen.status === 'completed' && gen.output_video_path && (
                  <button
                    onClick={() => handleDownload(gen)}
                    className="flex-1 px-3 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Baixar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(gen.id)}
                  className="px-3 py-2 bg-error/20 text-error hover:bg-error/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
