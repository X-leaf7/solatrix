// components/infinite-scroll/index.tsx
"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.sass'

interface InfiniteScrollProps {
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
  children: React.ReactNode
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loadMore,
  hasMore,
  isLoading,
  threshold = 200,
  children
}) => {
  const [loadingTriggered, setLoadingTriggered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Set up intersection observer to detect when user scrolls to bottom
  useEffect(() => {
    if (isLoading || !hasMore) return
    
    const options = {
      root: null, // viewport
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1
    }
    
    observer.current = new IntersectionObserver(entries => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loadingTriggered) {
        setLoadingTriggered(true)
        loadMore()
      }
    }, options)
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current)
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, isLoading, loadMore, threshold, loadingTriggered])
  
  // Reset loading triggered state when loading completes
  useEffect(() => {
    if (!isLoading && loadingTriggered) {
      setLoadingTriggered(false)
    }
  }, [isLoading, loadingTriggered])

  return (
    <div className={styles.container} ref={containerRef}>
      {children}
      
      {hasMore && (
        <div className={styles.loadingContainer} ref={loadingRef}>
          {isLoading && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Loading more events...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}