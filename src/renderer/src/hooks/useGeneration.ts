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

    return unsubscribe
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

      try {
        const id = await window.api.replicate.generate({
          ...params
        })
        setGenerationId(id)
        return id
      } catch (error) {
        setLoading(false)
        throw error
      }
    },
    []
  )

  return { generationId, status, loading, generate }
}
