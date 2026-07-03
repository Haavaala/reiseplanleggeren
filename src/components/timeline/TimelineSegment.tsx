import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TripSegment } from '@/types/models'
import { transportMeta } from '@/utils/transport'
import { formatDuration } from '@/utils/time'

interface TimelineSegmentProps {
  segment: TripSegment
  durationMinutes: number | null
  onEdit: (segment: TripSegment) => void
  onDelete: (segment: TripSegment) => void
}

export function TimelineSegment({
  segment,
  durationMinutes,
  onEdit,
  onDelete,
}: TimelineSegmentProps) {
  const meta = transportMeta(segment.transport_type)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: segment.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const hasTimes = segment.departure_time || segment.arrival_time

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex gap-3 ${isDragging ? 'z-10 opacity-80' : ''}`}
    >
      {/* Timeline rail node */}
      <div className="flex flex-col items-center">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ring-2 ring-white ${meta.badgeClass}`}
        >
          {meta.icon}
        </span>
        <span className="mt-1 w-px flex-1 bg-slate-200" />
      </div>

      {/* Card */}
      <div
        className={`mb-1 flex-1 rounded-xl border bg-white p-3 shadow-sm transition-shadow ${
          isDragging ? 'border-brand-300 shadow-md' : 'border-slate-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {meta.label}
              </span>
              {durationMinutes !== null && (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                  {formatDuration(durationMinutes)}
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-sm text-slate-600">
              {segment.from_location}
              <span className="mx-1 text-slate-300">→</span>
              {segment.to_location}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={() => onEdit(segment)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Edit segment"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(segment)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Delete segment"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 6h12M8 6V4h4v2m-6 0v10h8V6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* Drag handle */}
            <button
              className="cursor-grab touch-none rounded-md p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
              aria-label="Reorder segment"
              {...attributes}
              {...listeners}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="7" cy="5" r="1.4" />
                <circle cx="13" cy="5" r="1.4" />
                <circle cx="7" cy="10" r="1.4" />
                <circle cx="13" cy="10" r="1.4" />
                <circle cx="7" cy="15" r="1.4" />
                <circle cx="13" cy="15" r="1.4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {hasTimes ? (
            <span className="font-medium tabular-nums text-slate-900">
              {segment.departure_time ?? '––:––'}
              <span className="mx-1 font-normal text-slate-300">→</span>
              {segment.arrival_time ?? '––:––'}
            </span>
          ) : (
            <span className="text-xs italic text-slate-400">No times set</span>
          )}
        </div>

        {segment.notes && (
          <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
            {segment.notes}
          </p>
        )}
      </div>
    </div>
  )
}
