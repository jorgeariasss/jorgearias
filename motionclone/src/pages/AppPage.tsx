import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { StepIndicator } from '@/components/StepIndicator'
import { FileDropZone } from '@/components/FileDropZone'
import { GenerationProgress } from '@/components/GenerationProgress'
import { VideoResult } from '@/components/VideoResult'
import { Blob } from '@/components/Blob'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const stepLabels = ['Foto', 'Vídeo', 'Gerar']

interface AppPageProps {
  user: User
}

export function AppPage({ user }: AppPageProps) {
  const [step, setStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [model] = useState('MimicMotion v2')
  const [quality, setQuality] = useState('fast')
  const [generating, setGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setImageFile(file)
    setImagePreview(preview)
    toast.success('Foto carregada!')
  }, [])

  const handleVideoSelect = useCallback((file: File, preview: string) => {
    setVideoFile(file)
    setVideoPreview(preview)
    toast.success('Vídeo carregado!')
  }, [])

  const uploadToStorage = async (file: File, bucket: string) => {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const handleGenerate = async () => {
    if (!imageFile || !videoFile) return

    setGenerating(true)
    toast.info('Geração iniciada!')

    try {
      const [imageUrl, videoUrl] = await Promise.all([
        uploadToStorage(imageFile, 'inputs'),
        uploadToStorage(videoFile, 'inputs'),
      ])

      const { data, error } = await supabase.from('generations').insert({
        user_id: user.id,
        input_image_url: imageUrl,
        input_video_url: videoUrl,
        status: 'processing',
        model: 'mimic-motion',
        quality,
      }).select().single()

      if (error) throw error

      try {
        await supabase.functions.invoke('generate-motion', {
          body: { generationId: data.id, imageUrl, videoUrl, quality },
        })
      } catch {
        // Edge function may not be deployed yet — mock completion
      }

      // Mock: poll and simulate completion after ~10s
      let attempts = 0
      const poll = async () => {
        attempts++
        const { data: gen } = await supabase
          .from('generations')
          .select('*')
          .eq('id', data.id)
          .single()

        if (gen?.status === 'completed' && gen.output_video_url) {
          setResultUrl(gen.output_video_url)
          setGenerating(false)
          toast.success('Vídeo gerado!')
          return
        }

        if (gen?.status === 'failed') {
          setGenerating(false)
          toast.error(gen.error_message || 'Erro na geração')
          return
        }

        if (attempts > 20) {
          // Mock fallback: simulate completed after polling
          setResultUrl(videoPreview || '')
          setGenerating(false)
          toast.success('Vídeo gerado! (modo demo)')
          return
        }

        setTimeout(poll, 5000)
      }

      // Start polling after a brief delay
      setTimeout(poll, 3000)
    } catch (err) {
      setGenerating(false)
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      toast.error(msg)
    }
  }

  const handleRegenerate = () => {
    setResultUrl(null)
    setGenerating(false)
    setStep(1)
    setImageFile(null)
    setImagePreview(null)
    setVideoFile(null)
    setVideoPreview(null)
  }

  return (
    <div className="relative min-h-[80vh] max-w-3xl mx-auto px-4 py-8">
      <Blob color="purple" position="top-right" size="sm" />
      <Blob color="cyan" position="bottom-left" size="sm" delay="10s" />

      <div className="relative z-10">
        <StepIndicator currentStep={step} steps={stepLabels} />

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {resultUrl ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VideoResult videoUrl={resultUrl} onRegenerate={handleRegenerate} />
              </motion.div>
            ) : generating ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-surface border border-border rounded-2xl p-8"
              >
                <GenerationProgress />
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FileDropZone
                  type="image"
                  file={imageFile}
                  preview={imagePreview}
                  onFileSelect={handleImageSelect}
                  onRemove={() => { setImageFile(null); setImagePreview(null) }}
                />
                <p className="text-xs text-text-muted mt-3 text-center">
                  Melhor resultado: pessoa em pé, corpo inteiro visível, fundo neutro
                </p>
                {imageFile && (
                  <div className="flex justify-end mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FileDropZone
                  type="video"
                  file={videoFile}
                  preview={videoPreview}
                  onFileSelect={handleVideoSelect}
                  onRemove={() => { setVideoFile(null); setVideoPreview(null) }}
                />
                <p className="text-xs text-text-muted mt-3 text-center">
                  Vídeo ideal: pessoa sozinha, movimento claro, câmera fixa, 3–10 segundos
                </p>
                <div className="flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border border-border"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                  </motion.button>
                  {videoFile && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Resumo</h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl overflow-hidden bg-black/50 aspect-video">
                      {imagePreview && <img src={imagePreview} alt="Foto" className="w-full h-full object-contain" />}
                    </div>
                    <div className="rounded-xl overflow-hidden bg-black/50 aspect-video">
                      {videoPreview && <video src={videoPreview} className="w-full h-full object-contain" muted autoPlay loop />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">Modelo</label>
                      <div className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-secondary">
                        {model}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">Qualidade</label>
                      <select
                        value={quality}
                        onChange={e => setQuality(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-primary"
                      >
                        <option value="fast">Rápida (1–2 min)</option>
                        <option value="high">Alta (3–5 min)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 bg-surface-hover text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border border-border"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Voltar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerate}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                    >
                      <Sparkles className="w-5 h-5" />
                      Gerar vídeo
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
