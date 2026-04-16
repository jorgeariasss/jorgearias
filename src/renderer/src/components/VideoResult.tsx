import React from 'react'
import { Download, Folder, RotateCcw } from 'lucide-react'

interface VideoResultProps {
  videoUrl: string
  onDownload: () => void
  onOpenFolder: () => void
  onGenerateAnother: () => void
}

export function VideoResult({ videoUrl, onDownload, onOpenFolder, onGenerateAnother }: VideoResultProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="w-full max-w-2xl">
        <video
          src={videoUrl}
          controls
          className="w-full rounded-2xl border border-border bg-surface"
        />
      </div>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-medium text-background transition-colors"
        >
          <Download size={20} />
          Baixar vídeo
        </button>

        <button
          onClick={onOpenFolder}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover rounded-xl font-medium text-text-primary transition-colors border border-border"
        >
          <Folder size={20} />
          Abrir pasta
        </button>

        <button
          onClick={onGenerateAnother}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover rounded-xl font-medium text-text-primary transition-colors border border-border"
        >
          <RotateCcw size={20} />
          Gerar outro
        </button>
      </div>
    </div>
  )
}
