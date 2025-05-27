type SelectedTeam = "home" | "away" | "neutral"

export interface Message {
  id: string
  text: string
  firstName: string
  lastName: string
  isHostMessage: boolean
  profileImage: string
  isCurrentUser: boolean
  selectedTeam: SelectedTeam
}

export interface SocketMessage {
  type: string
  message: string
  is_host_message: boolean
  sender_id: string
  first_name: string
  last_name: string
  username: string
  timestamp: string
  message_id: string
  profile_image_url: string
  selected_team: SelectedTeam
}
