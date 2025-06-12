import { EventTiming } from "@/data"
import { DateTime, Interval } from "luxon"

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified timeout has elapsed since the last time it was invoked.
 *
 * @param func The function to debounce
 * @param timeout The delay in milliseconds (default: 300ms)
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, timeout = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

// Format the time display based on duration
export const formatEventStartTimeDisplay = (eventTiming: EventTiming, startTime: string) => {
  const now = DateTime.now();
  const eventStartTime = DateTime.fromISO(startTime);

  // Check if eventStartTime is valid before proceeding
  if (!eventStartTime.isValid) {
    console.error('Invalid date format:', startTime);

    return;
  }

  let interval;
  if (eventTiming === "upcoming") {
    interval = Interval.fromDateTimes(now, eventStartTime);
  } else {
    interval = Interval.fromDateTimes(eventStartTime, now);
  }

  const duration = interval.toDuration(['days', 'hours', 'minutes', 'seconds', 'milliseconds']);

  // If more than 24 hours (1 day)
  if (duration.days >= 1) {
    // For previous events (in the past)
    if (eventTiming === "previous") {
      // If it's within the last 30 days
      if (duration.days < 30) {
        return `${Math.floor(duration.days)} days ago`;
      } 
      // If it's more than 30 days ago, show a readable date
      return eventStartTime.toFormat('MMMM d, yyyy');
    } 
    // For upcoming events (in the future)
    else {
      // If it's within the next 30 days
      if (duration.days < 30) {
        return `In ${Math.floor(duration.days)} days`;
      }
      // If it's more than 30 days away, show a readable date
      return eventStartTime.toFormat('MMMM d, yyyy');
    }
  } 
  // If less than 24 hours, show hours:minutes:seconds
  else {
    return `${Math.floor(duration.hours)}h : ${Math.floor(duration.minutes)}m : ${Math.floor(duration.seconds)}s`;
  }
};

