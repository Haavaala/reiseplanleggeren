import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Trip, TripInput } from '@/types/models'

interface UseTripsResult {
  trips: Trip[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createTrip: (input: TripInput) => Promise<Trip>
  updateTrip: (id: string, input: Partial<TripInput>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
}

/** Loads and mutates the signed-in user's trips. */
export function useTrips(): UseTripsResult {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('travel_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setTrips(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    // Fetch on mount / when the user changes. The setLoading(true) inside
    // refresh() is an intentional loading transition for a data fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const createTrip = useCallback(
    async (input: TripInput) => {
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('trips')
        .insert({ ...input, user_id: user.id })
        .select('*')
        .single()
      if (error) throw error
      setTrips((prev) => [data, ...prev])
      return data
    },
    [user],
  )

  const updateTrip = useCallback(
    async (id: string, input: Partial<TripInput>) => {
      const { data, error } = await supabase
        .from('trips')
        .update(input)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      setTrips((prev) => prev.map((t) => (t.id === id ? data : t)))
    },
    [],
  )

  const deleteTrip = useCallback(async (id: string) => {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (error) throw error
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { trips, loading, error, refresh, createTrip, updateTrip, deleteTrip }
}
