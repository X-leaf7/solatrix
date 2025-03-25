import useSWR from 'swr';

import { Token } from '@/data/types/helpers';

const jsonFetcher = (url: string) => fetch(url).then(res => res.json())

const URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "";
const GET_EVENTS = `${URL}/api/events/`

export function useEvents(token: Token) {
    //let options = {}
    //if (token) {
    //    options.headers = {
    //        'Authorization': 'Token ' + token
    //    }
    //}
    const { data, error, mutate } = useSWR([GET_EVENTS], jsonFetcher);

  return {
    events: data,
    isLoadingEvents: !error && !data,
    isErrorEvents: error,
    mutate: mutate
  }
}
