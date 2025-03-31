'use client';

import styles from './styles.module.sass';
import { getCookie } from 'cookies-next/client';

import { Button, Table, type TableColumn } from '@/shared/dsm';
import { League, Sport, Teams } from '@/shared/dsm';

import { Events } from '@/components';
import { useEvents } from '@/data/api';
import { useEffect, useState } from 'react';
import { Event as EventType } from '@/data/types/event';

const columns: TableColumn[] = [
  {
    label: 'Teams',
  },
  {
    label: 'Sport',
  },
  {
    label: 'League',
  },
  {
    label: 'Date',
  },
  {
    label: 'Actions',
  },
];

export function TableEvents() {
  const token = getCookie('Token');
  const { events } = useEvents(token);
  const [eventRows, setEventRows] = useState([]);

  useEffect(() => {
    if (events) {
      const rows = events.map((event: EventType) => {
        const teams = [event.home_team, event.away_team];
        return [
          <Teams key="team" teams={teams} />,
          <Sport key="sport" sport={event.sport} />,
          <League key="league" league={event.round.season.league} />,
          event.event_start_time,
          <TableEventsActions key="actions" />,
        ];
      });
      setEventRows(rows);
    }
  }, [events]);

  return (
    <>
      <div className={styles.desktop}>
        <Table columns={columns} body={eventRows} />
      </div>
      <div className={styles.mobile}>
        <Events eventTiming="all" token={token} />
      </div>
    </>
  );
}

function TableEventsActions() {
  return (
    <div className={styles.actions}>
      <Button size="medium" intent="secondary" icon="arrowTopRight" />
      <Button size="medium" intent="secondary" icon="copy" />
      <Button size="medium" intent="danger" icon="trash" />
    </div>
  );
}
