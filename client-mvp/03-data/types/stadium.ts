import { Sport } from './sport';

export type Stadium = {
  name: string;
  sport: Sport;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  zip_code: string;
};
