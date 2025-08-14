// Cleanup Manager for Memory Leak Prevention
// Centralized cleanup system for subscriptions, timers, and resources

import { useEffect, useState } from 'react';
import { debugLog } from '@/utils/debugLogger';

export class CleanupManager {
  private cleanups: Set<() => void> = new Set();
  private name: string;

  constructor(name = 'unnamed') {
    this.name = name;
    debugLog.debug('CleanupManager created', {
      component: 'CleanupManager',
      action: 'constructor',
      name
    });
  }

  add(cleanup: () => void): () => void {
    this.cleanups.add(cleanup);
    debugLog.debug('Cleanup function added', {
      component: 'CleanupManager',
      action: 'add',
      name: this.name,
      count: this.cleanups.size
    });
    
    // Return a function to remove this specific cleanup
    return () => {
      this.cleanups.delete(cleanup);
      debugLog.debug('Cleanup function removed', {
        component: 'CleanupManager',
        action: 'remove',
        name: this.name,
        count: this.cleanups.size
      });
    };
  }

  cleanup(): void {
    debugLog.debug('Running cleanup', {
      component: 'CleanupManager',
      action: 'cleanup',
      name: this.name,
      count: this.cleanups.size
    });

    this.cleanups.forEach((cleanupFn) => {
      try {
        cleanupFn();
      } catch (error) {
        debugLog.error('Cleanup function failed', {
          component: 'CleanupManager',
          action: 'cleanup',
          name: this.name
        }, error);
      }
    });
    
    this.cleanups.clear();
  }

  size(): number {
    return this.cleanups.size;
  }
}

// React hook for automatic cleanup management
export function useCleanup(name?: string): CleanupManager {
  const [manager] = useState(() => new CleanupManager(name));

  useEffect(() => {
    return () => {
      manager.cleanup();
    };
  }, [manager]);

  return manager;
}

// Utility functions for common cleanup patterns
export function createTimeoutCleanup(callback: () => void, delay: number): () => void {
  const timeoutId = setTimeout(callback, delay);
  return () => clearTimeout(timeoutId);
}

export function createIntervalCleanup(callback: () => void, interval: number): () => void {
  const intervalId = setInterval(callback, interval);
  return () => clearInterval(intervalId);
}

export function createAbortControllerCleanup(): { controller: AbortController; cleanup: () => void } {
  const controller = new AbortController();
  return {
    controller,
    cleanup: () => controller.abort()
  };
}

// Event listener cleanup helper
export function createEventListenerCleanup(
  target: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}