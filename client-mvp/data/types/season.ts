import { League } from './league';

export type Season = {
  // sport: Sport
  league: League;
  name: string;
  start_date: string;
  end_date: string;
  sports_data_season: number;
};
