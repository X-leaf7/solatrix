import { JSONValue } from './helpers';
import { League } from './league';
import { Sport } from './sport';
import { Stadium } from './stadium';

export type Team = {
  name: string;
  sport: Sport;
  league: League;
  stadium: Stadium;
  colors: JSONValue;
  logo: string;
};
