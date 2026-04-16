import { useState, useEffect, useCallback } from 'react'

export function useSettings<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSetting = async () => {
      try {
        const stored = await window.api.settings.get(key)
        if (stored !== undefined) {
          setValue(stored)
        }
      } catch (error) {
        console.error('Failed to load setting:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSetting()
  }, [key])

  const updateSetting = useCallback(
    async (newValue: T) => {
      setValue(newValue)
      try {
        await window.api.settings.set(key, newValue)
      } catch (error) {
        console.error('Failed to save setting:', error)
      }
    },
    [key]
  )

  return { value, setValue: updateSetting, loading }
}
