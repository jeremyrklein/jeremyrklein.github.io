import { useCallback, useEffect, useState } from 'react'
import { loadHallOfFameData } from '../services/dataLoader'

export function useHallOfFameData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async (force = false) => {
    setLoading(true)
    setError('')

    try {
      const loadedData = await loadHallOfFameData(force)
      setData(loadedData)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
