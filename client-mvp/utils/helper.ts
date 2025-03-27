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

