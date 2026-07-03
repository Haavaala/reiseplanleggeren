import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTripDetail } from '@/hooks/useTripDetail'
import { computeTripStats } from '@/utils/tripStats'
import { formatTravelDate } from '@/utils/date'
import type { TripSegment } from '@/types/models'
import { Timeline } from '@/components/timeline/Timeline'
import { TripStatsBar } from '@/components/timeline/TripStatsBar'
import { SegmentForm } from '@/components/segments/SegmentForm'
import { Button } from '@/components/ui/Button'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'

export function TripDetailPage() {
  const { tripId = '' } = useParams()
  const {
    trip,
    segments,
    loading,
    notFound,
    error,
    addSegment,
    updateSegment,
    deleteSegment,
    reorderSegments,
  } = useTripDetail(tripId)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TripSegment | null>(null)
  const [deleting, setDeleting] = useState<TripSegment | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const stats = useMemo(() => computeTripStats(segments), [segments])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(segment: TripSegment) {
    setEditing(segment)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteSegment(deleting.id)
      setDeleting(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <FullPageSpinner />

  if (notFound || !trip) {
    return (
      <EmptyState
        icon="🔍"
        title="Trip not found"
        description="This trip may have been deleted, or it doesn't belong to you."
        action={
          <Link to="/">
            <Button variant="secondary">Back to trips</Button>
          </Link>
        }
      />
    )
  }

  const dateLabel = formatTravelDate(trip.travel_date)

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 5l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All trips
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {trip.title}
            </h1>
            {dateLabel && (
              <p className="mt-0.5 text-sm font-medium text-brand-600">
                {dateLabel}
              </p>
            )}
            {trip.description && (
              <p className="mt-1 text-sm text-slate-500">{trip.description}</p>
            )}
          </div>
          <Button onClick={openAdd} className="shrink-0">
            + Add segment
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {segments.length > 0 && <TripStatsBar stats={stats} />}

      {segments.length === 0 ? (
        <EmptyState
          icon="🧭"
          title="No segments yet"
          description="Add each leg of the journey — bus, train, ferry, and more. Waiting times are calculated automatically."
          action={<Button onClick={openAdd}>+ Add first segment</Button>}
        />
      ) : (
        <Timeline
          segments={segments}
          stats={stats}
          onEditSegment={openEdit}
          onDeleteSegment={setDeleting}
          onReorder={(ids) => void reorderSegments(ids)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit segment' : 'Add segment'}
      >
        <SegmentForm
          segment={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={async (input) => {
            if (editing) await updateSegment(editing.id, input)
            else await addSegment(input)
            setFormOpen(false)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete segment?"
        message={`The ${deleting?.from_location} → ${deleting?.to_location} segment will be removed.`}
        loading={deleteLoading}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
