"use client"

import styles from "./styles.module.sass"
import { Button, Table, type TableColumn } from "@/shared/dsm"
import { League, Sport, Teams } from "@/shared/dsm"
import { Events } from "@/features/event-dashboard/components"
import { useEffect, useState, type ReactNode } from "react"
import type { Event as EventType } from "@/data/types/event"
import { useMyEvents } from "../../hooks"
import { EventTiming } from "@/data/types/event"

const columns: TableColumn[] = [
  {
    label: "Teams",
  },
  {
    label: "Sport",
  },
  {
    label: "League",
  },
  {
    label: "Date",
  },
  {
    label: "Actions",
  },
]

interface ITableEventsProps {
  timing: EventTiming
}

export const TableEvents: React.FC<ITableEventsProps> = ({ timing }) => {
  // TODO: update this to fetch my events
  const { events } = useMyEvents(timing)
  // Properly type the state to accept arrays of strings or React elements
  const [eventRows, setEventRows] = useState<(string | ReactNode)[][]>([])

  useEffect(() => {
    if (events) {
      const rows = events.map((event: EventType) => {
        const teams = [event.home_team, event.away_team]
        return [
          <Teams key="team" teams={teams} />,
          <Sport key="sport" sport={event.sport} />,
          <League key="league" league={event.round.season.league} />,
          event.event_start_time,
          <TableEventsActions key="actions" />,
        ]
      })
      setEventRows(rows)
    }
  }, [events])

  return (
    <>
      <div className={styles.desktop}>
        <Table columns={columns} body={eventRows} />
      </div>
      <div className={styles.mobile}>
        <Events eventTiming="all" />
      </div>
    </>
  )
}

function TableEventsActions() {
  return (
    <div className={styles.actions}>
      <Button size="medium" intent="secondary" icon="arrowTopRight" />
      <Button size="medium" intent="secondary" icon="copy" />
      <Button size="medium" intent="danger" icon="trash" />
    </div>
  )
}
