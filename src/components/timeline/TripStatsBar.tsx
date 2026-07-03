import type { TripStats } from '@/utils/tripStats'
import { formatDuration } from '@/utils/time'

interface TripStatsBarProps {
  stats: TripStats
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="flex-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-0.5 text-lg font-bold tabular-nums ${
          accent ? 'text-brand-600' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

export function TripStatsBar({ stats }: TripStatsBarProps) {
  const range =
    stats.firstDeparture && stats.finalArrival
      ? `${stats.firstDeparture} → ${stats.finalArrival}`
      : undefined

  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Stat
        label="Total travel"
        value={formatDuration(stats.totalTravelMinutes)}
        sub={range}
        accent
      />
      <Stat label="Transport" value={formatDuration(stats.totalTransportMinutes)} />
      <Stat label="Waiting" value={formatDuration(stats.totalWaitMinutes)} />
    </div>
  )
}
