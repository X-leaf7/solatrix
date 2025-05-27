"use client"

import type React from "react"
import Image from "next/image"
import { Icons } from "@/shared/dsm"
import type { TeamType } from "../../types"
import { REST_API_BASE_URL } from "@/shared/constants"

import styles from "./styles.module.sass"

type TeamPosition = "home" | "away"

interface TeamChooseProps {
  team?: TeamType
  onClick: () => void
  type: TeamPosition
  isSelected: boolean
  isDisabled?: boolean
}

export const TeamChoose: React.FC<TeamChooseProps> = ({
  team,
  onClick,
  type,
  isSelected,
  isDisabled
}) => {
  const icon = type === "home" ? "home" : "globe"
  const Icon = Icons[icon]

  let cleanLogo = null
  if (team?.logo) {
    cleanLogo = new URL(team?.logo).pathname
  }

  if (!team) {
    return (
      <label className={`${styles.base} animate-pulse`}>
        <input type="checkbox" className={styles.input} checked={isSelected} readOnly />
        <div className="w-[74px] h-[74px] bg-gray-200 rounded-full" />
        <div className={`${styles.heading} mt-2 h-4 w-24 bg-gray-200 rounded`} />
      </label>
    )
  }

  return (
    <label
      className={`${styles.base} ${isDisabled ? styles.disabled : ''}`}
      onClick={isDisabled ? undefined : onClick}
    >
      <input type="checkbox" className={styles.input} checked={isSelected} readOnly />
      {cleanLogo ? (
        <Image
          src={REST_API_BASE_URL + cleanLogo}
          width={74}
          height={74}
          alt={`${team.name} logo`}
          unoptimized
        />
      ) : (
        <Icon width={74} height={74} />
      )}
      <span className={styles.heading}>{team.name}</span>
    </label>
  )
}
