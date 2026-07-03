import { formatDuration, waitLevel, type WaitLevel } from '@/utils/time'

interface WaitingIndicatorProps {
  minutes: number
}

const STYLES: Record<WaitLevel, { dot: string; text: string; label: string }> = {
  good: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    label: 'Comfortable',
  },
  tight: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    label: 'Tight',
  },
  risky: {
    dot: 'bg-red-500',
    text: 'text-red-700',
    label: 'Risky',
  },
}

/**
 * The waiting gap shown between two segments. Colour-coded:
 * green > 15m, yellow 5–15m, red < 5m.
 */
export function WaitingIndicator({ minutes }: WaitingIndicatorProps) {
  const level = waitLevel(minutes)
  const style = STYLES[level]

  return (
    <div className="flex items-center gap-3 py-1 pl-[0.6875rem]">
      {/* Dashed connector aligned under the timeline rail. */}
      <div className="flex flex-col items-center self-stretch">
        <div className="h-full w-px border-l-2 border-dashed border-slate-200" />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} aria-hidden />
        <span className="text-slate-500">Waiting</span>
        <span className={`font-semibold ${style.text}`}>
          {formatDuration(minutes)}
        </span>
        <span className={`rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium ${style.text}`}>
          {style.label}
        </span>
      </div>
    </div>
  )
}
