/**
 * Time helpers for the trip timeline.
 *
 * Segment times are stored as 'HH:MM' (24h) strings. All arithmetic is done in
 * whole minutes. When an end time is earlier than its start time we assume the
 * segment (or wait) crosses midnight and add 24h — a reasonable Phase-1
 * heuristic that keeps single-overnight journeys correct.
 */

const MINUTES_PER_DAY = 24 * 60

/** Parse 'HH:MM' into minutes past midnight, or null if invalid/empty. */
export function parseTime(value: string | null | undefined): number | null {
  if (!value) return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

/**
 * Minutes from `start` to `end`, treating a negative gap as crossing midnight.
 * Returns null when either time is missing/invalid.
 */
export function diffMinutes(
  start: string | null | undefined,
  end: string | null | undefined,
): number | null {
  const from = parseTime(start)
  const to = parseTime(end)
  if (from === null || to === null) return null
  const delta = to - from
  return delta >= 0 ? delta : delta + MINUTES_PER_DAY
}

/** Format a minute count as '3h 37m' / '45m' / '2h'. */
export function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '–'
  if (minutes <= 0) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export type WaitLevel = 'good' | 'tight' | 'risky'

/**
 * Colour band for a waiting time:
 *  - good  (green):  more than 15 minutes
 *  - tight (yellow): 5–15 minutes (inclusive)
 *  - risky (red):    less than 5 minutes
 */
export function waitLevel(minutes: number): WaitLevel {
  if (minutes > 15) return 'good'
  if (minutes >= 5) return 'tight'
  return 'risky'
}
