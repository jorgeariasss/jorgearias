import React, { useState } from 'react'
import { X } from 'lucide-react'
import { FileDropZone } from './FileDropZone'

interface ImageUploadProps {
  onFileSelect: (file: File, preview: string) => void
  value?: File
  preview?: string
}

export function ImageUpload({ onFileSelect, value, preview }: ImageUploadProps) {
  const [localPreview, setLocalPreview] = useState<string | undefined>(preview)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setLocalPreview(dataUrl)
      onFileSelect(file, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    setLocalPreview(undefined)
    onFileSelect(null as any, '')
  }

  if (localPreview) {
    return (
      <div className="relative inline-block">
        <img
          src={localPreview}
          alt="Selected"
          className="w-full rounded-2xl object-cover border border-border"
        />
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
    <FileDropZone onFile={handleFile} accept="image/*" maxSize={10}>
      <p className="text-text-primary font-medium">Selecione uma foto</p>
      <p className="text-text-secondary text-sm">PNG, JPG ou WEBP (máx 10MB)</p>
    </FileDropZone>
  )
}
