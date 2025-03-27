import { DateTime, Interval } from 'luxon';
import { EventTiming } from '@/data/types/event';

import styles from './styles.module.sass';


export function Time({ startTime }: {eventTiming: EventTiming, startTime: string}) {

  const now = DateTime.now();
  const eventStartTime = DateTime.fromISO(startTime);
  const interval = Interval.fromDateTimes(eventStartTime, now);
  const duration = interval.toDuration(['minutes', 'seconds', 'milliseconds']);

  // TODO Use eventTiming to change this component
  return (
    <div className={styles.base}>
      <h4 className={styles.heading}>Match Time</h4>
      <time className={styles.time}>{duration.minutes}min : {duration.seconds}sec</time>
    </div>
  );
}
