import { useState, useEffect, useCallback } from 'react'
import { Generation } from '../types'

export function useHistory(filter: 'all' | 'completed' | 'failed' = 'all') {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.api.history.list(filter)
      setGenerations(data)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const deleteGeneration = useCallback(async (id: string) => {
    try {
      await window.api.history.delete(id)
      setGenerations((prev) => prev.filter((g) => g.id !== id))
    } catch (error) {
      console.error('Failed to delete generation:', error)
    }
  }, [])

  return { generations, loading, deleteGeneration, refetch: loadHistory }
}
