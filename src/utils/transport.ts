import type { TransportType } from '@/types/models'

export interface TransportMeta {
  type: TransportType
  label: string
  /** Emoji icon — keeps the timeline readable without an icon dependency. */
  icon: string
  /** Tailwind classes for the timeline node badge. */
  badgeClass: string
}

export const TRANSPORT_META: Record<TransportType, TransportMeta> = {
  bus: {
    type: 'bus',
    label: 'Bus',
    icon: '🚌',
    badgeClass: 'bg-amber-100 text-amber-700 ring-amber-200',
  },
  train: {
    type: 'train',
    label: 'Train',
    icon: '🚆',
    badgeClass: 'bg-rose-100 text-rose-700 ring-rose-200',
  },
  ferry: {
    type: 'ferry',
    label: 'Ferry',
    icon: '⛴️',
    badgeClass: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
  },
  car: {
    type: 'car',
    label: 'Car',
    icon: '🚗',
    badgeClass: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  walking: {
    type: 'walking',
    label: 'Walking',
    icon: '🚶',
    badgeClass: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  },
  flight: {
    type: 'flight',
    label: 'Flight',
    icon: '✈️',
    badgeClass: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  },
  other: {
    type: 'other',
    label: 'Other',
    icon: '📍',
    badgeClass: 'bg-violet-100 text-violet-700 ring-violet-200',
  },
}

/** Ordered list for select inputs. */
export const TRANSPORT_OPTIONS: TransportMeta[] = [
  TRANSPORT_META.bus,
  TRANSPORT_META.train,
  TRANSPORT_META.ferry,
  TRANSPORT_META.car,
  TRANSPORT_META.walking,
  TRANSPORT_META.flight,
  TRANSPORT_META.other,
]

export function transportMeta(type: TransportType): TransportMeta {
  return TRANSPORT_META[type] ?? TRANSPORT_META.other
}
