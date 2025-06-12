"use client"

import { useMyEventsContext } from '../providers'
import { EventTiming } from '@/data/types/event'

export function useMyEvents(eventTiming: EventTiming) {
  const { liveEvents, upcomingEvents, previousEvents, allEvents } = useMyEventsContext()

  // Return the appropriate events data based on the timing
  switch (eventTiming) {
    case 'live':
      return {
        events: liveEvents.events,
        isLoadingEvents: liveEvents.isLoading,
        isErrorEvents: liveEvents.isError,
        hasMore: liveEvents.hasMore,
        loadMore: liveEvents.loadMore,
        isLoadingMore: liveEvents.isLoadingMore,
        mutate: liveEvents.mutate
      }
    case 'upcoming':
      return {
        events: upcomingEvents.events,
        isLoadingEvents: upcomingEvents.isLoading,
        isErrorEvents: upcomingEvents.isError,
        hasMore: upcomingEvents.hasMore,
        loadMore: upcomingEvents.loadMore,
        isLoadingMore: upcomingEvents.isLoadingMore,
        mutate: upcomingEvents.mutate
      }
    case 'previous':
      return {
        events: previousEvents.events,
        isLoadingEvents: previousEvents.isLoading,
        isErrorEvents: previousEvents.isError,
        hasMore: previousEvents.hasMore,
        loadMore: previousEvents.loadMore,
        isLoadingMore: previousEvents.isLoadingMore,
        mutate: previousEvents.mutate
      }
    case 'all':
    default:
      return {
        events: allEvents.events,
        isLoadingEvents: allEvents.isLoading,
        isErrorEvents: allEvents.isError,
        hasMore: allEvents.hasMore,
        loadMore: allEvents.loadMore,
        isLoadingMore: allEvents.isLoadingMore,
        mutate: allEvents.mutate
      }
  }
}