import { DividerGradient, League, Sport } from '@/dsm';

import { Event as EventType, EventTiming } from '@/data/types/event';

import Link from 'next/link';
import { Location } from './location';
import { Score } from './score';
import { Team } from './team';
import { Time } from './time';
import styles from './styles.module.sass';

export function Event({ event, eventTiming }: {event: EventType, eventTiming: EventTiming}) {
  return (
    <Link href={`/event/choose`} className={styles.base}>
      <div className={styles.grid}>
        <div className={styles.host}>{event.host ? event.host.username : null}</div>
        <div className={styles.location}>
          <Location name={event.stadium.name}/>
          <League league={event.round.season.league}/>
          <DividerGradient type="top" color="#D8D8D8" />
        </div>
        <div>
          <Sport sport={event.sport} />
        </div>
      </div>
      <div className={styles.grid}>
        <div>
          <Team team={event.home_team} type="home" />
        </div>
        <div className={styles.main}>
          <Score home={event.home_team_score} away={event.away_team_score}/>
        </div>
        <div>
          <Team team={event.away_team} type="away" />
        </div>
      </div>
      <div className={styles.grid}>
        <div></div>
        <div className={styles.time}>
          <DividerGradient color="#45DC65" />
          <Time eventTiming={eventTiming} startTime={event.event_start_time}/>
        </div>
        <div></div>
      </div>
    </Link>
  );
}
