import { useState, type FormEvent } from 'react'
import type { Trip, TripInput } from '@/types/models'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

interface TripFormProps {
  /** When provided, the form edits this trip; otherwise it creates a new one. */
  trip?: Trip
  onSubmit: (input: TripInput) => Promise<void>
  onCancel: () => void
}

export function TripForm({ trip, onSubmit, onCancel }: TripFormProps) {
  const [title, setTitle] = useState(trip?.title ?? '')
  const [description, setDescription] = useState(trip?.description ?? '')
  const [travelDate, setTravelDate] = useState(trip?.travel_date ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = title.trim()
    if (!trimmed) {
      setError('A title is required.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        title: trimmed,
        description: description.trim() || null,
        travel_date: travelDate || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the trip.')
      setSubmitting(false)
    }
  }

  return (
    <form id="trip-form" onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        required
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Trip to the cabin"
      />
      <Textarea
        label="Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional — a note about this journey"
      />
      <Input
        label="Travel date"
        type="date"
        value={travelDate}
        onChange={(e) => setTravelDate(e.target.value)}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {trip ? 'Save changes' : 'Create trip'}
        </Button>
      </div>
    </form>
  )
}
