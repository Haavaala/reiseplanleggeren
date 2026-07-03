import { Link } from 'react-router-dom'
import type { Trip } from '@/types/models'
import { formatTravelDate } from '@/utils/date'

interface TripCardProps {
  trip: Trip
  onEdit: (trip: Trip) => void
  onDelete: (trip: Trip) => void
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const dateLabel = formatTravelDate(trip.travel_date)

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/trips/${trip.id}`}
        className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`Open ${trip.title}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {trip.title}
          </h3>
          {dateLabel && (
            <p className="mt-0.5 text-xs font-medium text-brand-600">{dateLabel}</p>
          )}
        </div>

        {/* Actions sit above the overlay link. */}
        <div className="relative z-10 flex shrink-0 gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <button
            onClick={() => onEdit(trip)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Edit trip"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(trip)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Delete trip"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 6h12M8 6V4h4v2m-6 0v10h8V6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {trip.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {trip.description}
        </p>
      )}
    </div>
  )
}
