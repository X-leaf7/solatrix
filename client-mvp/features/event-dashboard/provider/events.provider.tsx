"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Event as EventType, EventTiming } from '@/data/types/event'

// Define the context type
interface EventsContextType {
  liveEvents: {
    events: EventType[];
    isLoading: boolean;
    isError: any;
    hasMore: boolean;
    loadMore: () => void;
    isLoadingMore: boolean;
    mutate: () => void;
  };
  upcomingEvents: {
    events: EventType[];
    isLoading: boolean;
    isError: any;
    hasMore: boolean;
    loadMore: () => void;
    isLoadingMore: boolean;
    mutate: () => void;
  };
  previousEvents: {
    events: EventType[];
    isLoading: boolean;
    isError: any;
    hasMore: boolean;
    loadMore: () => void;
    isLoadingMore: boolean;
    mutate: () => void;
  };
  allEvents: {
    events: EventType[];
    isLoading: boolean;
    isError: any;
    hasMore: boolean;
    loadMore: () => void;
    isLoadingMore: boolean;
    mutate: () => void;
  };
}

// Create the context with a default value
const EventsContext = createContext<EventsContextType | undefined>(undefined)

// Custom hook for managing events of a specific timing
function useEventsByTiming(timing: EventTiming) {
  const [page, setPage] = useState(1)
  const [allEvents, setAllEvents] = useState<EventType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<any>(null)
  const [hasMore, setHasMore] = useState(false)
  
  // Function to fetch events
  const fetchEvents = useCallback(async (currentPage: number, append: boolean = false) => {
    try {
      // Set loading state
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      
      // Build the API URL with timing and pagination parameters
      const apiUrl = `api/events/?timing=${timing}&page=${currentPage}&page_size=20`
      
      // Fetch data
      const response = await fetch(apiUrl)
      
      // Check for errors
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      // Parse response
      const data = await response.json()
      
      // Update state
      if (append) {
        setAllEvents(prev => [...prev, ...(data.results || [])])
      } else {
        setAllEvents(data.results || [])
      }
      
      // Update pagination state
      setHasMore(data.next !== null)
      
      // Clear error state
      setError(null)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err)
    } finally {
      // Clear loading states
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [timing])
  
  // Initial fetch
  useEffect(() => {
    fetchEvents(1, false)
  }, [fetchEvents])
  
  // Function to load more events
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    
    const nextPage = page + 1
    setPage(nextPage)
    fetchEvents(nextPage, true)
  }, [fetchEvents, isLoadingMore, hasMore, page])
  
  // Function to reset and reload events
  const mutate = useCallback(() => {
    setPage(1)
    setAllEvents([])
    fetchEvents(1, false)
  }, [fetchEvents])
  
  return {
    events: allEvents,
    isLoading,
    isError: error,
    hasMore,
    loadMore,
    isLoadingMore,
    mutate
  }
}

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create separate state for each event timing type
  const liveEvents = useEventsByTiming('live')
  const upcomingEvents = useEventsByTiming('upcoming')
  const previousEvents = useEventsByTiming('previous')
  const allEvents = useEventsByTiming('all')
  
  // Create the context value
  const value = {
    liveEvents,
    upcomingEvents,
    previousEvents,
    allEvents
  }
  
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

// Custom hook to use the events context
export const useEventsContext = () => {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEventsContext must be used within an EventsProvider')
  }
  return context
}
