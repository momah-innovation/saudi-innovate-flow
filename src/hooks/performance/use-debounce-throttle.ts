/**
 * Debounce and Throttle Hooks
 * Extracted from performance-hooks.ts for better organization
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for debounced values (search, filtering)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for throttled functions (scroll, resize)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  
  return useCallback(
    ((...args: any[]) => {
      if (!inThrottle.current) {
        func.apply(null, args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    }) as T,
    [func, limit]
  );
}