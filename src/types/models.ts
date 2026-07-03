import type { TransportType, TripRow, TripSegmentRow } from './database'

export type { TransportType }

/** App-facing trip. Currently identical to the row, aliased for a stable domain API. */
export type Trip = TripRow

/** App-facing segment. */
export type TripSegment = TripSegmentRow

/** A trip together with its ordered segments. */
export interface TripWithSegments extends Trip {
  segments: TripSegment[]
}

/** Fields the user provides when creating or editing a trip. */
export interface TripInput {
  title: string
  description: string | null
  travel_date: string | null
}

/** Fields the user provides when creating or editing a segment. */
export interface SegmentInput {
  transport_type: TransportType
  from_location: string
  to_location: string
  departure_time: string | null
  arrival_time: string | null
  notes: string | null
}
