"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Event as EventType, EventTiming } from '@/data/types/event'

// Define the context type
interface MyEventsContextType {
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
const MyEventsContext = createContext<MyEventsContextType | undefined>(undefined)

// Custom hook for managing my events of a specific timing
function useMyEventsByTiming(timing: EventTiming) {
  const [page, setPage] = useState(1)
  const [allEvents, setAllEvents] = useState<EventType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<any>(null)
  const [hasMore, setHasMore] = useState(false)
  
  // Function to fetch my events
  const fetchMyEvents = useCallback(async (currentPage: number, append: boolean = false) => {
    try {
      // Set loading state
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      
      // Build the API URL with timing and pagination parameters
      const apiUrl = `api/events/participated/?timing=${timing}&page=${currentPage}&page_size=20`
      
      // Fetch data
      const response = await fetch(apiUrl, {
        credentials: 'include', // Include cookies for authentication
      })
      
      // Check for authentication
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      
      // Check for other errors
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
      console.error("Error fetching my events:", err)
      setError(err)
    } finally {
      // Clear loading states
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [timing])
  
  // Initial fetch
  useEffect(() => {
    fetchMyEvents(1, false)
  }, [fetchMyEvents])
  
  // Function to load more events
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    
    const nextPage = page + 1
    setPage(nextPage)
    fetchMyEvents(nextPage, true)
  }, [fetchMyEvents, isLoadingMore, hasMore, page])
  
  // Function to reset and reload events
  const mutate = useCallback(() => {
    setPage(1)
    setAllEvents([])
    fetchMyEvents(1, false)
  }, [fetchMyEvents])
  
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

export const MyEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create separate state for each event timing type
  const liveEvents = useMyEventsByTiming('live')
  const upcomingEvents = useMyEventsByTiming('upcoming')
  const previousEvents = useMyEventsByTiming('previous')
  const allEvents = useMyEventsByTiming('all')
  
  // Create the context value
  const value = {
    liveEvents,
    upcomingEvents,
    previousEvents,
    allEvents
  }
  
  return <MyEventsContext.Provider value={value}>{children}</MyEventsContext.Provider>
}

// Custom hook to use the my events context
export const useMyEventsContext = () => {
  const context = useContext(MyEventsContext)
  if (context === undefined) {
    throw new Error('useMyEventsContext must be used within a MyEventsProvider')
  }
  return context
}