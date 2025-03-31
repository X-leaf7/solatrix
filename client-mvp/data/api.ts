import useSWR from "swr"

// Use relative URL for the proxy API
const PROXY_EVENTS_URL = "/api/events"

// Simple fetcher that doesn't need token parameter anymore
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useEvents() {
  // No need to pass token as the API route will get it from cookies
  const { data, error, mutate } = useSWR(PROXY_EVENTS_URL, fetcher)

  return {
    events: data,
    isLoadingEvents: !error && !data,
    isErrorEvents: error,
    mutate: mutate,
  }
}

