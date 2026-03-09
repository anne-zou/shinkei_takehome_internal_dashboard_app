import { useState, useEffect } from 'react'
import { getDashboardSummary } from '@/api/MockServerApi'
import type { DashboardSummaryData } from '@/types'

interface UseDashboardDataResult {
  data: DashboardSummaryData | null
  loading: boolean
  error: string | null
}

export function useDashboardData(startDate: string, endDate: string): UseDashboardDataResult {
  const [data, setData]       = useState<DashboardSummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getDashboardSummary({ startDate, endDate })
      .then((res) => {
        if (!cancelled) {
          setData(res.data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [startDate, endDate])

  return { data, loading, error }
}
