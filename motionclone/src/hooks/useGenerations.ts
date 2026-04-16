import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Generation } from '@/types'

export function useGenerations(userId: string | undefined) {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGenerations = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setGenerations(data as Generation[])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchGenerations()
  }, [fetchGenerations])

  const deleteGeneration = async (id: string) => {
    const { error } = await supabase.from('generations').delete().eq('id', id)
    if (!error) {
      setGenerations(prev => prev.filter(g => g.id !== id))
    }
    return { error }
  }

  return { generations, loading, fetchGenerations, deleteGeneration }
}

export function useGenerationPolling(generationId: string | null) {
  const [generation, setGeneration] = useState<Generation | null>(null)

  useEffect(() => {
    if (!generationId) return

    let cancelled = false

    const poll = async () => {
      const { data } = await supabase
        .from('generations')
        .select('*')
        .eq('id', generationId)
        .single()

      if (cancelled) return

      if (data) {
        setGeneration(data as Generation)
        if (data.status === 'completed' || data.status === 'failed') return
      }

      const timeout = setTimeout(poll, 5000)
      return () => clearTimeout(timeout)
    }

    poll()

    return () => { cancelled = true }
  }, [generationId])

  return generation
}
