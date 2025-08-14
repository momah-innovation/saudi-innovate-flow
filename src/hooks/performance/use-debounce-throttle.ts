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
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  
  return useCallback(
    ((...args: unknown[]) => {
      if (!inThrottle.current) {
        func.apply(null, args);
        inThrottle.current = true;
        // Use regular setTimeout for internal throttling to prevent hook violations
        setTimeout(() => (inThrottle.current = false), limit);
      }
    }) as T,
    [func, limit]
  );
}