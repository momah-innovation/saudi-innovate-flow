/**
 * Simple Timer Utilities
 * 
 * Non-hook timer utilities that can be safely used inside useEffect
 * and other React hooks without violating Rules of Hooks.
 */

export const createTimeoutCleanup = (callback: () => void, delay: number): (() => void) => {
  const timeoutId = setTimeout(callback, delay);
  return () => clearTimeout(timeoutId);
};

export const createIntervalCleanup = (callback: () => void, interval: number): (() => void) => {
  const intervalId = setInterval(callback, interval);
  return () => clearInterval(intervalId);
};

export const createAsyncTimeoutCleanup = (callback: () => Promise<void>, delay: number): (() => void) => {
  const timeoutId = setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      // Use structured logging instead of console.error
      if (typeof window !== 'undefined' && (window as any).debugLog) {
        (window as any).debugLog.error('Async timeout callback failed', { component: 'SimpleTimers' }, error);
      }
    }
  }, delay);
  return () => clearTimeout(timeoutId);
};

export const createAsyncIntervalCleanup = (callback: () => Promise<void>, interval: number): (() => void) => {
  const intervalId = setInterval(async () => {
    try {
      await callback();
    } catch (error) {
      // Use structured logging instead of console.error
      if (typeof window !== 'undefined' && (window as any).debugLog) {
        (window as any).debugLog.error('Async interval callback failed', { component: 'SimpleTimers' }, error);
      }
    }
  }, interval);
  return () => clearInterval(intervalId);
};