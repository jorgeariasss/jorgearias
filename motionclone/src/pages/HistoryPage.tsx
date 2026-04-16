import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Trash2, Loader2, Film, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import type { Generation } from '@/types'

interface HistoryPageProps {
  generations: Generation[]
  loading: boolean
  onDelete: (id: string) => Promise<{ error: unknown }>
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'text-warning', icon: Clock },
  processing: { label: 'Processando', color: 'text-accent', icon: Loader2 },
  completed: { label: 'Concluído', color: 'text-success', icon: Film },
  failed: { label: 'Falhou', color: 'text-error', icon: AlertCircle },
}

type StatusFilter = 'all' | Generation['status']

export function HistoryPage({ generations, loading, onDelete }: HistoryPageProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = filter === 'all' ? generations : generations.filter(g => g.status === filter)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta geração?')) return
    setDeleting(id)
    const { error } = await onDelete(id)
    if (error) toast.error('Erro ao excluir')
    else toast.success('Geração excluída')
    setDeleting(null)
  }

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'completed', label: 'Concluídos' },
    { value: 'processing', label: 'Processando' },
    { value: 'failed', label: 'Falhas' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold tracking-tight mb-6">Histórico</h1>

        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Film className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Nenhuma geração encontrada</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((gen, index) => {
              const status = statusConfig[gen.status]
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={gen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video bg-black/50 relative">
                    {gen.output_video_url ? (
                      <video src={gen.output_video_url} className="w-full h-full object-contain" controls />
                    ) : (
                      <img src={gen.input_image_url} alt="" className="w-full h-full object-contain opacity-50" />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${gen.status === 'processing' ? 'animate-spin' : ''}`} />
                        {status.label}
                      </div>
                      <span className="text-xs text-text-muted">
                        {new Date(gen.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {gen.output_video_url && (
                        <a
                          href={gen.output_video_url}
                          download
                          className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(gen.id)}
                        disabled={deleting === gen.id}
                        className="flex items-center gap-1.5 bg-surface-hover hover:bg-error/20 text-text-muted hover:text-error px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border"
                      >
                        {deleting === gen.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Excluir
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
