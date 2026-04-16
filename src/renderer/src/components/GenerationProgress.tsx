import React, { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

interface GenerationProgressProps {
  message: string
  progress: number
}

export function GenerationProgress({ message, progress }: GenerationProgressProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <Loader size={48} className="text-primary-glow animate-spin" />

      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Gerando seu vídeo...</h2>
        <p className="text-text-secondary">{message}</p>
      </div>

      <div className="w-full max-w-md">
        <div className="relative h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-text-muted text-sm mt-2 text-center">{Math.round(progress)}%</p>
      </div>

      <p className="text-text-muted text-sm text-center max-w-md">
        Isto pode levar alguns minutos. Deixe a janela aberta.
      </p>
    </div>
  )
}
