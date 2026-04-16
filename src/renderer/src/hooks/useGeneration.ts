import { useState, useCallback, useEffect } from 'react'
import { GenerationStatus } from '../types'

export function useGeneration() {
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [status, setStatus] = useState<GenerationStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = window.api.replicate.onStatus((newStatus) => {
      setStatus(newStatus)

      if (newStatus.status === 'completed' || newStatus.status === 'failed') {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const generate = useCallback(
    async (params: {
      imageBase64: string
      videoBase64: string
      imagePath: string
      videoPath: string
      quality: 'fast' | 'high'
    }) => {
      setLoading(true)
      setStatus(null)
      setGenerationId(null)

      try {
        const id = await window.api.replicate.generate(params)
        setGenerationId(id)
        return id
      } catch (error) {
        setLoading(false)
        setStatus({
          generationId: '',
          status: 'failed',
          progress: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        throw error
      }
    },
    []
  )

  const reset = useCallback(() => {
    setGenerationId(null)
    setStatus(null)
    setLoading(false)
  }, [])

  return { generationId, status, loading, generate, reset }
}
