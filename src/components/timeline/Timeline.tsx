import { Fragment } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { TripSegment } from '@/types/models'
import type { TripStats } from '@/utils/tripStats'
import { TimelineSegment } from './TimelineSegment'
import { WaitingIndicator } from './WaitingIndicator'

interface TimelineProps {
  segments: TripSegment[]
  stats: TripStats
  onEditSegment: (segment: TripSegment) => void
  onDeleteSegment: (segment: TripSegment) => void
  onReorder: (orderedIds: string[]) => void
}

export function Timeline({
  segments,
  stats,
  onEditSegment,
  onDeleteSegment,
  onReorder,
}: TimelineProps) {
  const sensors = useSensors(
    // Small activation distance so taps still register as clicks on the buttons.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Waiting minutes keyed by the index of the segment the wait follows.
  const waitAfterIndex = new Map(stats.waits.map((w) => [w.afterIndex, w.minutes]))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = segments.map((s) => s.id)
    const from = ids.indexOf(active.id as string)
    const to = ids.indexOf(over.id as string)
    if (from === -1 || to === -1) return
    onReorder(arrayMove(ids, from, to))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={segments.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {segments.map((segment, index) => (
            <Fragment key={segment.id}>
              <TimelineSegment
                segment={segment}
                durationMinutes={stats.segmentDurations[index]}
                onEdit={onEditSegment}
                onDelete={onDeleteSegment}
              />
              {waitAfterIndex.has(index) && (
                <WaitingIndicator minutes={waitAfterIndex.get(index)!} />
              )}
            </Fragment>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
