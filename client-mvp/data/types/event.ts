import { Round } from './round';
import { Stadium } from './stadium';
import { Team } from './team';
import { User } from './user';
import { Sport } from './sport';

export type Event = {
  id: string;
  name: string;
  round: Round;
  stadium: Stadium;
  sport: Sport;
  home_team: Team;
  home_team_score: number;
  away_team: Team;
  away_team_score: number;
  is_private: boolean;
  lobby_start_time: string;
  event_start_time: string;
  status: string;
  banner: string; // not sure if there is an image type?
  host: User;
};

export interface EventDetail extends Event {
  public_chatroom_id: string
}

export type EventTiming = "live" | "upcoming" | "previous" | "all";