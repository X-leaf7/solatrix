import { Icons } from "@/shared/dsm"
import Image from "next/image"
import { useState } from "react"
import type { Team as TeamType } from "@/data/types/team"
import styles from "./styles.module.sass"

import { CDN_BASE_URL } from "@/shared/constants"

type TeamProps = {
  team: TeamType
  type?: "home" | "away"
}

export function Team({ team, type = "home" }: TeamProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const icon = type === "home" ? "home" : "globe"
  const Icon = Icons[icon]
  const alignmentClass = type === "home" ? styles.home : styles.away

  let cleanLogo = null
  try {
    cleanLogo = new URL(team.logo).pathname
  } catch {
    // use null default
  }

  console.log('clean logo url: ', cleanLogo)

  return (
    <div className={`${styles.base} ${alignmentClass}`}>
      {cleanLogo ? (
        <div className={styles.imageContainer}>
          {/* Skeleton loader */}
          {imageLoading && (
            <div className={styles.skeleton}></div>
          )}

          <Image
            src={cleanLogo ? CDN_BASE_URL + cleanLogo : "/images/avatar-default.svg"}
            width={64}
            height={64}
            alt={team.name}
            loading="lazy" // Enable lazy loading
            onLoad={() => setImageLoading(false)} // Hide skeleton when image loads
            className={imageLoading ? styles.hiddenImage : styles.loadedImage}
            unoptimized 
          />
        </div>
      ) : (
        <Icon width={64} height={64} />
      )}
      <h3 className={styles.heading}>{team.name}</h3>
    </div>
  )
}
