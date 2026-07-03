/** Format an ISO date (YYYY-MM-DD) as e.g. 'Mon 3 Jul 2026'. Returns '' if empty. */
export function formatTravelDate(iso: string | null | undefined): string {
  if (!iso) return ''
  // Parse as local date to avoid timezone shifting the day.
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
