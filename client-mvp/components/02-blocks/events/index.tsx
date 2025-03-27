"use client"

import { DateTime } from 'luxon';

import { Event as EventType, EventTiming } from '@/data/types/event';
import { Token } from '@/data/types/helpers';
import { Event } from '@/components/01-cards';
import { useEvents } from '@/data/api';
import styles from './styles.module.sass';

export function Events({eventTiming, token}: {eventTiming: EventTiming, token: Token}) {
  const { events, isLoadingEvents, isErrorEvents } = useEvents(token);
  const now = DateTime.now();
  const filters = {
    live: (event: EventType) => {
      return DateTime.fromISO(event.event_start_time) < now && event.status === 'InProgress';
    },
    upcoming: (event: EventType) => {
      return DateTime.fromISO(event.event_start_time) > now && event.status === 'Scheduled';
    },
    previous: (event: EventType) => {
      return DateTime.fromISO(event.event_start_time) < now && event.status === 'Final';
    },
    all: () => true
  };

  const filterFunc = filters[eventTiming];

  return (
    <div className={styles.base}>
      {
        isLoadingEvents ? (
          <div>Checking the Scoreboards...</div>
        ) : isErrorEvents ? (
        <div>Scoreboards are down. Sad day. Come back later?</div>
        ) : (
          events.filter(filterFunc).map((event: EventType) => {
            return <Event key={event.id} event={event} eventTiming={eventTiming} />
          })
        )
      }
    </div>
  );
}
