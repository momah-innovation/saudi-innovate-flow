/**
 * Timer Management Utility
 * 
 * Provides optimized timer patterns with automatic cleanup
 * to prevent memory leaks and improve performance.
 */

import React from 'react';
import { debugLog } from './debugLogger';

type TimerCallback = () => void;
type AsyncTimerCallback = () => Promise<void>;

interface TimerOptions {
  immediate?: boolean;
  cleanup?: () => void;
  maxRetries?: number;
  retryDelay?: number;
}

class TimerManager {
  private timers = new Map<string, number>();
  private intervals = new Map<string, number>();

  /**
   * Creates a timeout with automatic cleanup
   */
  setTimeout(
    id: string,
    callback: TimerCallback | AsyncTimerCallback,
    delay: number,
    options: TimerOptions = {}
  ): void {
    this.clearTimeout(id);
    
    const wrappedCallback = async () => {
      try {
        await callback();
      } catch (error) {
        debugLog.error(`Timer ${id} callback failed`, { timerId: id, error: error.message });
        if (options.maxRetries && options.maxRetries > 0) {
          // Retry with exponential backoff
          const retryDelay = options.retryDelay || delay;
          this.setTimeout(id + '_retry', callback, retryDelay, {
            ...options,
            maxRetries: options.maxRetries - 1
          });
        }
      } finally {
        this.timers.delete(id);
        options.cleanup?.();
      }
    };

    const timerId = window.setTimeout(wrappedCallback, delay);
    this.timers.set(id, timerId);
  }

  /**
   * Creates an interval with automatic cleanup
   */
  setInterval(
    id: string,
    callback: TimerCallback | AsyncTimerCallback,
    delay: number,
    options: TimerOptions = {}
  ): void {
    this.clearInterval(id);
    
    const wrappedCallback = async () => {
      try {
        await callback();
      } catch (error) {
        debugLog.error(`Interval ${id} callback failed`, { intervalId: id, error: error.message });
      }
    };

    // Execute immediately if requested
    if (options.immediate) {
      wrappedCallback();
    }

    const intervalId = window.setInterval(wrappedCallback, delay);
    this.intervals.set(id, intervalId);
  }

  /**
   * Clears a timeout by ID
   */
  clearTimeout(id: string): void {
    const timerId = this.timers.get(id);
    if (timerId) {
      window.clearTimeout(timerId);
      this.timers.delete(id);
    }
  }

  /**
   * Clears an interval by ID  
   */
  clearInterval(id: string): void {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      window.clearInterval(intervalId);
      this.intervals.delete(id);
    }
  }

  /**
   * Clears all timers and intervals
   */
  clearAll(): void {
    this.timers.forEach((timerId) => window.clearTimeout(timerId));
    this.intervals.forEach((intervalId) => window.clearInterval(intervalId));
    this.timers.clear();
    this.intervals.clear();
  }

  /**
   * Gets active timer count (for debugging)
   */
  getActiveCount(): { timeouts: number; intervals: number } {
    return {
      timeouts: this.timers.size,
      intervals: this.intervals.size
    };
  }
}

// Singleton instance
const timerManager = new TimerManager();

/**
 * React hook for optimized timer management
 */
export const useTimerManager = () => {
  const [componentId] = React.useState(`timer_${Date.now()}_${Math.random()}`);
  
  React.useEffect(() => {
    return () => {
      // Cleanup all timers for this component
      timerManager.clearAll();
    };
  }, []);

  return {
    setTimeout: (callback: TimerCallback | AsyncTimerCallback, delay: number, options?: TimerOptions) => {
      const id = `${componentId}_timeout_${Date.now()}`;
      timerManager.setTimeout(id, callback, delay, options);
      return () => timerManager.clearTimeout(id);
    },
    
    setInterval: (callback: TimerCallback | AsyncTimerCallback, delay: number, options?: TimerOptions) => {
      const id = `${componentId}_interval_${Date.now()}`;
      timerManager.setInterval(id, callback, delay, options);
      return () => timerManager.clearInterval(id);
    },
    
    clearAll: () => timerManager.clearAll(),
    getActiveCount: () => timerManager.getActiveCount()
  };
};

/**
 * Debounced timer utility
 */
export const useDebounce = (callback: () => void, delay: number) => {
  const timeoutRef = React.useRef<number>();

  const debouncedCallback = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(callback, delay);
  }, [callback, delay]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Animation frame utility for performance-optimized animations
 */
export const useAnimationFrame = (callback: (deltaTime: number) => void, deps: any[] = []) => {
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();
  const isActive = React.useRef(false);

  const animate = React.useCallback((time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    if (isActive.current) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback]);

  const start = React.useCallback(() => {
    isActive.current = true;
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = React.useCallback(() => {
    isActive.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      stop();
    };
  }, deps);

  return { start, stop, isActive: () => isActive.current };
};

export default timerManager;