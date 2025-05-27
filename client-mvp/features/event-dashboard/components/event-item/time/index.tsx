import { EventTiming } from '@/data/types/event';
import { formatEventStartTimeDisplay } from '@/shared/utils';

import styles from './styles.module.sass';

interface TimeProps {
  eventTiming: EventTiming
  startTime: string
}

export const Time: React.FC<TimeProps> = ({ startTime, eventTiming }) => {
  return (
    <div className={styles.base}>
      <h4 className={styles.heading}>Match Time</h4>
      <time className={styles.time}>
        {formatEventStartTimeDisplay(eventTiming, startTime)}
      </time>
    </div>
  );
}