import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { StepIndicator } from '../components/StepIndicator'
import { ImageUpload } from '../components/ImageUpload'
import { VideoUpload } from '../components/VideoUpload'
import { GenerationProgress } from '../components/GenerationProgress'
import { VideoResult } from '../components/VideoResult'
import { useGeneration } from '../hooks/useGeneration'
import { fileToBase64, getEstimatedCost } from '../lib/utils'

export function Generate() {
  const [currentStep, setCurrentStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [quality, setQuality] = useState<'fast' | 'high'>('fast')
  const [resultUrl, setResultUrl] = useState<string>('')

  const { status, loading, generate } = useGeneration()

  useEffect(() => {
    if (status?.status === 'completed' && (status as any).videoUrl) {
      setResultUrl((status as any).videoUrl)
    } else if (status?.status === 'failed') {
      toast.error(status.error || 'Falha na geração')
    }
  }, [status])

  const steps = [
    { label: 'Foto', number: 1 },
    { label: 'Vídeo', number: 2 },
    { label: 'Gerar', number: 3 }
  ]

  const handleImageSelect = (file: File | null, preview: string) => {
    setImageFile(file)
    setImagePreview(preview)
  }

  const handleVideoSelect = (file: File | null, duration: number) => {
    setVideoFile(file)
    setVideoDuration(duration)
  }

  const handleNext = () => {
    if (currentStep === 1 && !imageFile) {
      toast.error('Selecione uma foto')
      return
    }
    if (currentStep === 2 && !videoFile) {
      toast.error('Selecione um vídeo')
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handleGenerateClick = async () => {
    if (!imageFile || !videoFile) {
      toast.error('Selecione foto e vídeo')
      return
    }

    try {
      const imageBase64 = await fileToBase64(imageFile)
      const videoBase64 = await fileToBase64(videoFile)

      await generate({
        imageBase64,
        videoBase64,
        imagePath: imageFile.name,
        videoPath: videoFile.name,
        quality
      })
    } catch (error) {
      toast.error('Erro ao iniciar geração')
      console.error(error)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `motionclone-${Date.now()}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Erro ao baixar vídeo')
    }
  }

  const handleOpenFolder = async () => {
    const outputFolder = await window.api.settings.get('outputFolder')
    if (outputFolder) {
      await window.api.files.openFolder(outputFolder)
    } else {
      toast.error('Pasta de saída não configurada')
    }
  }

  const handleGenerateAnother = () => {
    setCurrentStep(1)
    setImageFile(null)
    setImagePreview('')
    setVideoFile(null)
    setVideoDuration(0)
    setResultUrl('')
  }

  // Show result
  if (resultUrl) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Sucesso! 🎉</h1>
        <VideoResult
          videoUrl={resultUrl}
          onDownload={handleDownload}
          onOpenFolder={handleOpenFolder}
          onGenerateAnother={handleGenerateAnother}
        />
      </div>
    )
  }

  // Show progress
  if (loading && status) {
    return (
      <div className="max-w-2xl mx-auto">
        <GenerationProgress message={status.message} progress={status.progress} />
      </div>
    )
  }

  // Show form
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Gerar vídeo</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="bg-surface border border-border rounded-2xl p-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Selecione uma foto</h2>
            <p className="text-text-secondary mb-6">
              Melhor resultado: pessoa em pé, corpo inteiro visível, fundo neutro
            </p>
            <ImageUpload onFileSelect={handleImageSelect} preview={imagePreview} value={imageFile} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Selecione um vídeo</h2>
            <p className="text-text-secondary mb-6">
              Vídeo ideal: pessoa sozinha, movimento claro, câmera fixa, 3–10 segundos
            </p>
            <VideoUpload onFileSelect={handleVideoSelect} value={videoFile} />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Revisar e gerar</h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {imagePreview && (
                <div>
                  <p className="text-text-secondary text-sm mb-2">Foto selecionada</p>
                  <img src={imagePreview} alt="Selected" className="w-full rounded-xl object-cover h-32" />
                </div>
              )}
              <div>
                <p className="text-text-secondary text-sm mb-2">Vídeo selecionado</p>
                <video src={URL.createObjectURL(videoFile!)} className="w-full rounded-xl object-cover h-32" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-text-primary font-medium mb-2">Qualidade</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as 'fast' | 'high')}
                  className="w-full px-4 py-2 bg-surface-hover border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="fast">Rápida (~1-2 min) - {getEstimatedCost('fast')}</option>
                  <option value="high">Alta (~3-5 min) - {getEstimatedCost('high')}</option>
                </select>
              </div>
            </div>

            <p className="text-text-secondary text-sm mb-6">
              Custo estimado: {getEstimatedCost(quality)}
            </p>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 border border-border text-text-primary rounded-xl hover:bg-surface-hover transition-colors"
            >
              Voltar
            </button>
          )}

          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-2 bg-primary hover:bg-primary-hover text-background rounded-xl font-medium transition-colors"
            >
              Próximo
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleGenerateClick}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-background rounded-xl font-medium transition-colors shadow-lg shadow-primary/30"
            >
              {loading ? 'Gerando...' : 'Gerar vídeo'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
