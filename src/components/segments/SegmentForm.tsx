import { useState, type FormEvent } from 'react'
import type { SegmentInput, TransportType, TripSegment } from '@/types/models'
import { TRANSPORT_OPTIONS } from '@/utils/transport'
import { diffMinutes, formatDuration } from '@/utils/time'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'

interface SegmentFormProps {
  segment?: TripSegment
  onSubmit: (input: SegmentInput) => Promise<void>
  onCancel: () => void
}

export function SegmentForm({ segment, onSubmit, onCancel }: SegmentFormProps) {
  const [transportType, setTransportType] = useState<TransportType>(
    segment?.transport_type ?? 'bus',
  )
  const [fromLocation, setFromLocation] = useState(segment?.from_location ?? '')
  const [toLocation, setToLocation] = useState(segment?.to_location ?? '')
  const [departure, setDeparture] = useState(segment?.departure_time ?? '')
  const [arrival, setArrival] = useState(segment?.arrival_time ?? '')
  const [notes, setNotes] = useState(segment?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const duration = diffMinutes(departure || null, arrival || null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!fromLocation.trim() || !toLocation.trim()) {
      setError('Please fill in both the from and to locations.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        transport_type: transportType,
        from_location: fromLocation.trim(),
        to_location: toLocation.trim(),
        departure_time: departure || null,
        arrival_time: arrival || null,
        notes: notes.trim() || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the segment.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Transport type"
        value={transportType}
        onChange={(e) => setTransportType(e.target.value as TransportType)}
      >
        {TRANSPORT_OPTIONS.map((opt) => (
          <option key={opt.type} value={opt.type}>
            {opt.icon}  {opt.label}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="From"
          required
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          placeholder="Oslo S"
        />
        <Input
          label="To"
          required
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          placeholder="Bergen"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Departure"
          type="time"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <Input
          label="Arrival"
          type="time"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
      </div>

      {duration !== null && (
        <p className="text-xs text-slate-500">
          Duration: <span className="font-medium text-slate-700">{formatDuration(duration)}</span>
        </p>
      )}

      <Textarea
        label="Notes"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional — platform, seat, booking reference…"
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
          {segment ? 'Save changes' : 'Add segment'}
        </Button>
      </div>
    </form>
  )
}
