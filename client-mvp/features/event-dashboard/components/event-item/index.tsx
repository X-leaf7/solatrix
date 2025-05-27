"use client"

import type React from "react"

import { useRouter } from "next/navigation"

import { DividerGradient, League, Sport } from "@/shared/dsm"
import type { Event as EventType, EventTiming } from "@/data/types/event"

import { Location } from "./location"
import { Score } from "./score"
import { Team } from "./team"
import { Time } from "./time"
import { TeamLocation } from "./team-location"

import styles from "./styles.module.sass"

interface EventItemProps {
  event: EventType
  eventTiming: EventTiming
}

export const EventItem: React.FC<EventItemProps> = ({ event, eventTiming }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/event/choose?eventId=${event.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={styles.base}
    >
      {/* CARD HEADER */}
      <div className={styles.flexStart}>
        <div className={styles.host}>{event.host ? event.host.username : "@host111"}</div>
        <div className={styles.location}>
          <Location name={event.stadium.name} />
          <League league={event.round.season.league} />
          <DividerGradient type="top" color="#D8D8D8" />
        </div>

        <Sport sport={event.sport} />
      </div>

      <div className={styles.flexCenter}>
        <Team team={event.home_team} type="home" />
        <Score home={event.home_team_score} away={event.away_team_score} />
        <Team team={event.away_team} type="away" />
      </div>
      <div className={styles.grid}>
        <TeamLocation isHome={true} />
        <div className={styles.time}>
          <DividerGradient color="#45DC65" />
          <Time eventTiming={eventTiming} startTime={event.event_start_time} />
        </div>
        <TeamLocation isHome={false} />
      </div>
    </div>
  )
}
