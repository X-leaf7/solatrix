export interface ChatRoomInfo {
  homeTeam: string
  awayTeam: string
  score: {
    homeTeamScore: number
    awayTeamScore: number
  }
  eventStartTime: string
  hostName: string
  roomMemberCount: number
}
