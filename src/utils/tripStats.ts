import type { TripSegment } from '@/types/models'
import { diffMinutes, parseTime } from './time'

/** The waiting gap that sits between two consecutive segments. */
export interface WaitGap {
  /** Index of the segment that arrives before this wait. */
  afterIndex: number
  minutes: number
}

export interface TripStats {
  /** Duration of each segment, aligned by index with the segment list (null if unknown). */
  segmentDurations: (number | null)[]
  /** Waiting gaps between segments (only those where both times are known). */
  waits: WaitGap[]
  /** Sum of all known segment durations, in minutes. */
  totalTransportMinutes: number
  /** Sum of all known waiting gaps, in minutes. */
  totalWaitMinutes: number
  /** Transport + waiting, in minutes. Equals first-departure → final-arrival for same-day trips. */
  totalTravelMinutes: number
  /** First known departure time ('HH:MM') or null. */
  firstDeparture: string | null
  /** Last known arrival time ('HH:MM') or null. */
  finalArrival: string | null
}

/**
 * Compute all timeline statistics for an ordered list of segments.
 *
 * Waiting time between segment i and i+1 is (next departure − this arrival),
 * wrapping past midnight when negative. Segments with missing times simply
 * don't contribute to the relevant totals rather than breaking the whole trip.
 */
export function computeTripStats(segments: TripSegment[]): TripStats {
  const segmentDurations = segments.map((s) =>
    diffMinutes(s.departure_time, s.arrival_time),
  )

  const waits: WaitGap[] = []
  for (let i = 0; i < segments.length - 1; i++) {
    const wait = diffMinutes(
      segments[i].arrival_time,
      segments[i + 1].departure_time,
    )
    if (wait !== null) {
      waits.push({ afterIndex: i, minutes: wait })
    }
  }

  const totalTransportMinutes = segmentDurations.reduce<number>(
    (sum, d) => sum + (d ?? 0),
    0,
  )
  const totalWaitMinutes = waits.reduce((sum, w) => sum + w.minutes, 0)

  const firstDeparture =
    segments.find((s) => parseTime(s.departure_time) !== null)
      ?.departure_time ?? null

  const finalArrival =
    [...segments].reverse().find((s) => parseTime(s.arrival_time) !== null)
      ?.arrival_time ?? null

  return {
    segmentDurations,
    waits,
    totalTransportMinutes,
    totalWaitMinutes,
    totalTravelMinutes: totalTransportMinutes + totalWaitMinutes,
    firstDeparture,
    finalArrival,
  }
}
