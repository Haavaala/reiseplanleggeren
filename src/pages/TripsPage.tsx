import { useState } from 'react'
import { useTrips } from '@/hooks/useTrips'
import type { Trip } from '@/types/models'
import { TripCard } from '@/components/trips/TripCard'
import { TripForm } from '@/components/trips/TripForm'
import { Button } from '@/components/ui/Button'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { FullPageSpinner } from '@/components/ui/Spinner'

export function TripsPage() {
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } = useTrips()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Trip | null>(null)
  const [deleting, setDeleting] = useState<Trip | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(trip: Trip) {
    setEditing(trip)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteTrip(deleting.id)
      setDeleting(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <FullPageSpinner />

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Your trips</h1>
          <p className="text-sm text-slate-500">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
          </p>
        </div>
        <Button onClick={openCreate}>+ New trip</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {trips.length === 0 ? (
        <EmptyState
          icon="🧳"
          title="No trips yet"
          description="Create your first trip, then add each leg of the journey to see the full timeline."
          action={<Button onClick={openCreate}>+ New trip</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit trip' : 'New trip'}
      >
        <TripForm
          trip={editing ?? undefined}
          onCancel={() => setFormOpen(false)}
          onSubmit={async (input) => {
            if (editing) await updateTrip(editing.id, input)
            else await createTrip(input)
            setFormOpen(false)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete trip?"
        message={`"${deleting?.title}" and all its segments will be permanently deleted.`}
        loading={deleteLoading}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
