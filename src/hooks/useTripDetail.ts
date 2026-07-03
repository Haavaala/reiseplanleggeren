import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SegmentInput, Trip, TripInput, TripSegment } from '@/types/models'

interface UseTripDetailResult {
  trip: Trip | null
  segments: TripSegment[]
  loading: boolean
  /** Set when the trip can't be found or the user lacks access. */
  notFound: boolean
  error: string | null
  updateTrip: (input: Partial<TripInput>) => Promise<void>
  addSegment: (input: SegmentInput) => Promise<void>
  updateSegment: (id: string, input: Partial<SegmentInput>) => Promise<void>
  deleteSegment: (id: string) => Promise<void>
  reorderSegments: (orderedIds: string[]) => Promise<void>
}

/** Loads a single trip with its ordered segments and exposes mutations. */
export function useTripDetail(tripId: string): UseTripDetailResult {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [segments, setSegments] = useState<TripSegment[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)

    const [tripRes, segRes] = await Promise.all([
      supabase.from('trips').select('*').eq('id', tripId).maybeSingle(),
      supabase
        .from('trip_segments')
        .select('*')
        .eq('trip_id', tripId)
        .order('position', { ascending: true }),
    ])

    if (tripRes.error) {
      setError(tripRes.error.message)
    } else if (!tripRes.data) {
      setNotFound(true)
    } else {
      setTrip(tripRes.data)
    }

    if (segRes.error) setError(segRes.error.message)
    else setSegments(segRes.data ?? [])

    setLoading(false)
  }, [tripId])

  useEffect(() => {
    // Fetch on mount / when the trip id changes. The setLoading(true) inside
    // load() is an intentional loading transition for a data fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const updateTrip = useCallback(
    async (input: Partial<TripInput>) => {
      const { data, error } = await supabase
        .from('trips')
        .update(input)
        .eq('id', tripId)
        .select('*')
        .single()
      if (error) throw error
      setTrip(data)
    },
    [tripId],
  )

  const addSegment = useCallback(
    async (input: SegmentInput) => {
      // New segments append to the end of the current order.
      const nextPosition = segments.length
        ? Math.max(...segments.map((s) => s.position)) + 1
        : 0
      const { data, error } = await supabase
        .from('trip_segments')
        .insert({ ...input, trip_id: tripId, position: nextPosition })
        .select('*')
        .single()
      if (error) throw error
      setSegments((prev) => [...prev, data])
    },
    [tripId, segments],
  )

  const updateSegment = useCallback(
    async (id: string, input: Partial<SegmentInput>) => {
      const { data, error } = await supabase
        .from('trip_segments')
        .update(input)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      setSegments((prev) => prev.map((s) => (s.id === id ? data : s)))
    },
    [],
  )

  const deleteSegment = useCallback(async (id: string) => {
    const { error } = await supabase.from('trip_segments').delete().eq('id', id)
    if (error) throw error
    setSegments((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const reorderSegments = useCallback(
    async (orderedIds: string[]) => {
      // Optimistically apply the new order, then persist changed positions.
      const byId = new Map(segments.map((s) => [s.id, s]))
      const reordered = orderedIds
        .map((id, index) => {
          const seg = byId.get(id)
          return seg ? { ...seg, position: index } : null
        })
        .filter((s): s is TripSegment => s !== null)

      const previous = segments
      setSegments(reordered)

      const changed = reordered.filter(
        (s) => byId.get(s.id)?.position !== s.position,
      )
      const results = await Promise.all(
        changed.map((s) =>
          supabase
            .from('trip_segments')
            .update({ position: s.position })
            .eq('id', s.id),
        ),
      )
      const failed = results.find((r) => r.error)
      if (failed?.error) {
        setSegments(previous) // roll back on failure
        throw failed.error
      }
    },
    [segments],
  )

  return {
    trip,
    segments,
    loading,
    notFound,
    error,
    updateTrip,
    addSegment,
    updateSegment,
    deleteSegment,
    reorderSegments,
  }
}
