import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, Film } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface FileDropZoneProps {
  type: 'image' | 'video'
  file: File | null
  preview: string | null
  onFileSelect: (file: File, preview: string) => void
  onRemove: () => void
}

const imageAccept = '.png,.jpg,.jpeg,.webp'
const videoAccept = '.mp4,.mov,.webm'

const maxSizes = { image: 10 * 1024 * 1024, video: 50 * 1024 * 1024 }
const maxLabels = { image: '10MB', video: '50MB' }

export function FileDropZone({ type, file, preview, onFileSelect, onRemove }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = type === 'image' ? imageAccept : videoAccept
  const Icon = type === 'image' ? Image : Film

  const validateAndSelect = useCallback((f: File) => {
    if (f.size > maxSizes[type]) {
      toast.error(`Arquivo muito grande. Máximo: ${maxLabels[type]}`)
      return
    }

    const url = URL.createObjectURL(f)
    onFileSelect(f, url)
  }, [type, onFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSelect(f)
  }, [validateAndSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) validateAndSelect(f)
  }, [validateAndSelect])

  if (file && preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-surface border border-border">
        {type === 'image' ? (
          <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-black/50" />
        ) : (
          <video src={preview} controls className="w-full h-64 object-contain bg-black/50" />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-surface/90 backdrop-blur text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-border"
          >
            Trocar
          </button>
          <button
            onClick={onRemove}
            className="bg-surface/90 backdrop-blur text-text-secondary hover:text-error p-1.5 rounded-lg transition-colors border border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-4 transition-all duration-200 min-h-[16rem] ${
        dragging
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-text-muted bg-surface'
      }`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${dragging ? 'bg-primary/20' : 'bg-surface-hover'}`}>
        {dragging ? (
          <Upload className="w-7 h-7 text-primary" />
        ) : (
          <Icon className="w-7 h-7 text-text-muted" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-secondary">
          {dragging ? 'Solte o arquivo aqui' : `Arraste ou clique para enviar ${type === 'image' ? 'uma foto' : 'um vídeo'}`}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {type === 'image' ? 'PNG, JPG, WEBP' : 'MP4, MOV, WEBM'} — máx {maxLabels[type]}
          {type === 'video' && ', máx 10s'}
        </p>
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </motion.div>
  )
}
