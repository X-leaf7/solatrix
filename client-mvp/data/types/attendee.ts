import { Event } from './event';
import { Team } from './team';
import { User } from './user';

export type Attendee = {
  user: User;
  event: Event;
  team: Team;
};
