/**
 * Database row shapes as stored in Supabase (PostgreSQL).
 *
 * These map 1:1 to the `trips` and `trip_segments` tables. Keeping them
 * separate from the app-facing domain types (see `models.ts`) means the
 * database schema can evolve independently of how the UI consumes the data.
 */

export type TransportType =
  | 'bus'
  | 'train'
  | 'ferry'
  | 'car'
  | 'walking'
  | 'flight'
  | 'other'

// NB: these use `type` (not `interface`) on purpose. supabase-js requires each
// table's Row to satisfy `Record<string, unknown>`, and object-literal type
// aliases carry an implicit index signature that interfaces do not — using
// `interface` here would collapse the client's Insert/Update types to `never`.
export type TripRow = {
  id: string
  user_id: string
  title: string
  description: string | null
  travel_date: string | null // ISO date: YYYY-MM-DD
  created_at: string
  updated_at: string
}

export type TripSegmentRow = {
  id: string
  trip_id: string
  position: number
  transport_type: TransportType
  from_location: string
  to_location: string
  departure_time: string | null // HH:MM (24h)
  arrival_time: string | null // HH:MM (24h)
  notes: string | null
  created_at: string
  updated_at: string
}

/**
 * Minimal typed surface for the Supabase client. Only the tables the app
 * touches are declared; this gives us autocomplete and type-safety on
 * `.from('trips')` / `.from('trip_segments')` without a generated schema file.
 *
 * The `Views`/`Functions`/`Enums`/`CompositeTypes` keys and per-table
 * `Relationships` are required for supabase-js to resolve its Insert/Update
 * helper types — omitting them collapses those to `never`.
 */
export interface Database {
  public: {
    Tables: {
      trips: {
        Row: TripRow
        Insert: Omit<TripRow, 'id' | 'created_at' | 'updated_at'> &
          Partial<Pick<TripRow, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<TripRow, 'id' | 'user_id' | 'created_at'>>
        Relationships: []
      }
      trip_segments: {
        Row: TripSegmentRow
        Insert: Omit<TripSegmentRow, 'id' | 'created_at' | 'updated_at'> &
          Partial<Pick<TripSegmentRow, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<TripSegmentRow, 'id' | 'trip_id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
