"use client"

import { EventItem } from '../event-item'
import { useEvents } from '../../hooks'
import { InfiniteScroll } from '@/shared/components'
import { EventTiming } from '@/data/types/event'

import styles from './styles.module.sass'

interface EventsProps {
  eventTiming: EventTiming
}

export const Events: React.FC<EventsProps> = ({ eventTiming }) => {
  const { 
    events, 
    isLoadingEvents, 
    isErrorEvents,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useEvents(eventTiming);

  return (
    <div className={styles.container}>
      {isLoadingEvents ? (
        <div className={styles.message}>Checking the Scoreboards...</div>
      ) : isErrorEvents ? (
        <div className={styles.errorMessage}>Scoreboards are down. Sad day. Come back later?</div>
      ) : events.length === 0 ? (
        <div className={styles.message}>No {eventTiming} events found.</div>
      ) : (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoadingMore}
        >
          <div className={styles.base}>
            {events.map((event, index) => (
              <EventItem
                key={index}
                event={event}
                eventTiming={eventTiming}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  )
}