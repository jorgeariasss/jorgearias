import React, { useState, useRef } from 'react'
import { X, Play } from 'lucide-react'
import { FileDropZone } from './FileDropZone'

interface VideoUploadProps {
  onFileSelect: (file: File, duration: number) => void
  value?: File
}

export function VideoUpload({ onFileSelect, value }: VideoUploadProps) {
  const [localFile, setLocalFile] = useState<File | undefined>(value)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFile = (file: File) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      if (video.duration > 10) {
        alert('Vídeo muito longo. Máximo: 10 segundos')
        return
      }
      setLocalFile(file)
      setDuration(video.duration)
      onFileSelect(file, video.duration)
    }
    video.onerror = () => {
      alert('Arquivo de vídeo inválido')
    }
    video.src = URL.createObjectURL(file)
  }

  const handleClear = () => {
    setLocalFile(undefined)
    setDuration(0)
    onFileSelect(null as any, 0)
  }

  if (localFile) {
    return (
      <div className="relative w-full">
        <div className="relative group rounded-2xl overflow-hidden border border-border">
          <video
            ref={videoRef}
            src={URL.createObjectURL(localFile)}
            className="w-full h-48 object-cover bg-surface"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Play size={48} className="text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <p className="text-text-secondary text-sm mt-2">Duração: {duration.toFixed(1)}s</p>
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 p-2 bg-error/20 hover:bg-error/30 rounded-lg transition-colors"
        >
          <X size={20} className="text-error" />
        </button>
      </div>
    )
  }

  return (
    <FileDropZone onFile={handleFile} accept="video/*" maxSize={50}>
      <p className="text-text-primary font-medium">Selecione um vídeo</p>
      <p className="text-text-secondary text-sm">MP4, MOV ou WEBM (máx 50MB, até 10s)</p>
    </FileDropZone>
  )
}
