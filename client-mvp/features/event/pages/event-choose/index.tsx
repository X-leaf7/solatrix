"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/shared/dsm"
import type { EventDetail as EventDetailType } from "@/data"
import { TeamChoose } from "../../components"
import { fetchEvent } from "../../api"

import styles from "./styles.module.sass"

export function EventChoose() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const eventId = searchParams.get("eventId")
  const privateChatRoomId = searchParams.get("chatId")
  const invitationCode = searchParams.get("code")

  const [event, setEvent] = useState<EventDetailType>()
  const [selectedTeam, setSelectedTeam] = useState<string>("home")
  const [error, setError] = useState<string | null>(null)
  const [membershipCreatable, setMembershipCreatable] = useState<boolean>(false)
  const [isCheckingMembership, setIsCheckingMembership] = useState<boolean>(false)
  const [isJoiningChatRoom, setIsJoiningChatRoom] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    if (eventId) {
      const response = await fetchEvent(eventId)
      setEvent(response)
    }
  }, [eventId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (event) {
      setIsCheckingMembership(true)

      let chatRoomId: string

      if (privateChatRoomId) {
        chatRoomId = privateChatRoomId
      } else {
        if (event?.public_chatroom_id) {
          chatRoomId = event?.public_chatroom_id
        } else {
          setError("This is public chat room, but chat room id is missing in the event.")
          setIsCheckingMembership(false)
          return
        }
      }

      const checkUserMembership = async () => {
        try {
          const response = await fetch("/api/chat/check-membership/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatRoomId: chatRoomId,
            }),
          })
          if (response.ok) {
            const data = await response.json()

            setMembershipCreatable(!data.alreadyJoined)

            if (data.alreadyJoined) {
              setSelectedTeam(data.selectedTeam)
              if (data.chatRoom.isPrivate) {
                router.push(`/chat/${privateChatRoomId}?team=${data.selectedTeam}`)
              }
            }
          } else {
            // TODO: error handling
          }
        } catch (error) {
          console.error("Error checking chat permission:", error)
        } finally {
          setIsCheckingMembership(false)
        }
      }

      checkUserMembership()
    }
  }, [event, privateChatRoomId, router])

  const joinPublicChatRoom = useCallback(async () => {
    if (membershipCreatable) {
      setIsJoiningChatRoom(true)

      try {
        const response = await fetch("/api/chat/join-public-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatRoomId: event?.public_chatroom_id,
            supportedTeam: selectedTeam,
          }),
        })

        if (response.ok) {
          const data = await response.json()

          const url = `/chat/${event?.public_chatroom_id}?team=${encodeURIComponent(data.selectedTeam)}&isPublicRoom=true`
          router.push(url)
        }
      } catch (error) {
        console.error("Error while creating public chatroom membership", error)
        setError("An error occured while creating public chatroom membership")
      } finally {
        setIsJoiningChatRoom(false)
      }
    } else {
      router.push(`/chat/${event?.public_chatroom_id}?team=${encodeURIComponent(selectedTeam)}&isPublicRoom=true`)
    }
  }, [router, event, membershipCreatable, selectedTeam])

  const joinPrivateChatRoom = useCallback(async () => {
    if (!privateChatRoomId || !invitationCode || selectedTeam) {
      return false
    }

    try {
      setIsJoiningChatRoom(true)
      const response = await fetch("/api/chat/check-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatRoomId: privateChatRoomId,
          invitationCode: invitationCode,
          supportedTeam: selectedTeam,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return false
      }

      router.push(`/chat/${privateChatRoomId}?team=${selectedTeam}`)
    } catch (error) {
      console.error("Error checking chat permission:", error)
      setError("An unexpected error occurred")
      return false
    } finally {
      setIsJoiningChatRoom(false)
    }
  }, [router, privateChatRoomId, invitationCode, selectedTeam])

  const handleEnterChat = useCallback(async () => {
    // If we have a private chat room ID and invitation code, check permissions first
    if (privateChatRoomId && invitationCode && membershipCreatable) {
      joinPrivateChatRoom()
    }

    // For public chat rooms
    if (!event?.public_chatroom_id) {
      setError("Chat room is not available yet. Please try again later.")
      return
    }

    joinPublicChatRoom()
  }, [
    joinPrivateChatRoom,
    joinPublicChatRoom,
    event,
    privateChatRoomId,
    invitationCode,
    membershipCreatable
  ])

  const handleCreateClick = () => {
    router.push(`/chat/create?eventId=${eventId}`)
  }

  return (
    <section className={styles.base}>
      <header className={styles.header}>
        <h3 className={styles.subheading}>
          <p className={styles.home}>{event?.home_team.name}</p>
          <p>vs</p>
          <p className={styles.away}>{event?.away_team.name}</p>
        </h3>
        <h2 className={styles.heading}>Choose Side</h2>
      </header>
      <div className={styles.teams}>
        <TeamChoose
          team={event?.home_team}
          onClick={() => setSelectedTeam("home")}
          type="home"
          isSelected={selectedTeam === "home"}
          isDisabled={!membershipCreatable}
        />
        <TeamChoose
          team={event?.away_team}
          onClick={() => setSelectedTeam("away")}
          type="away"
          isSelected={selectedTeam === "away"}
          isDisabled={!membershipCreatable}
        />
      </div>

      {error && <div>{error}</div>}

      <div className={styles.actions}>
        {!privateChatRoomId && !invitationCode && (
          <Button onClick={handleCreateClick} intent="tertiary">
            Create Chat
          </Button>
        )}
        <Button onClick={handleEnterChat} disabled={isCheckingMembership || isJoiningChatRoom}>
          {isCheckingMembership ? "Checking..." : isJoiningChatRoom ? "Joining..." : "Enter the Chat"}
        </Button>
      </div>
    </section>
  )
}
