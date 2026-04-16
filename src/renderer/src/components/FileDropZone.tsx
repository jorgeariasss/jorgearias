import React, { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../lib/cn'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept: string
  maxSize: number // em MB
  children?: React.ReactNode
}

export function FileDropZone({ onFile, accept, maxSize, children }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const sizeInMB = file.size / (1024 * 1024)

      if (sizeInMB > maxSize) {
        alert(`Arquivo muito grande. Máximo: ${maxSize}MB`)
        return
      }

      onFile(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onFile(files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-primary-glow bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-surface-hover/50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center gap-3"
      >
        <Upload size={32} className="text-primary-glow" />

        {children ? (
          children
        ) : (
          <>
            <p className="text-text-primary font-medium">Arraste um arquivo aqui</p>
            <p className="text-text-secondary text-sm">ou clique para selecionar</p>
          </>
        )}
      </button>
    </div>
  )
}
