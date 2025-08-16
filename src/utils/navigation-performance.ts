/**
 * Navigation Performance Optimizations
 * Prevents navigation cascades and implements debouncing
 */

import { NavigateFunction } from 'react-router-dom';
import { debugLog } from '@/utils/debugLogger';

// Navigation state management
let isNavigating = false;
let pendingNavigation: string | null = null;
let navigationTimeout: NodeJS.Timeout | null = null;

/**
 * Creates a debounced navigation function to prevent rapid navigation calls
 */
export const createDebouncedNavigate = (navigate: NavigateFunction, delay = 300) => {
  return (path: string, options?: { replace?: boolean; state?: any }) => {
    // Clear any existing timeout
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
    
    // If already navigating to the same path, ignore
    if (isNavigating && pendingNavigation === path) {
      debugLog.log('Navigation ignored - already navigating to same path', { path });
      return;
    }
    
    // Set pending navigation
    pendingNavigation = path;
    
    // Debounce the navigation
    navigationTimeout = setTimeout(() => {
      if (!isNavigating) {
        isNavigating = true;
        debugLog.log('Debounced navigation starting', { path });
        
        try {
          navigate(path, options);
        } catch (error) {
          debugLog.error('Navigation error', { path, error });
        } finally {
          // Reset navigation state after a short delay
          setTimeout(() => {
            isNavigating = false;
            pendingNavigation = null;
          }, 100);
        }
      }
    }, delay);
  };
};

/**
 * Navigation state machine to prevent overlapping navigations
 */
export class NavigationStateMachine {
  private currentRoute: string = '';
  private isTransitioning: boolean = false;
  private navigationQueue: Array<{ path: string; options?: any }> = [];
  
  constructor(private navigate: NavigateFunction) {}
  
  /**
   * Navigate with state management
   */
  navigateTo(path: string, options?: { replace?: boolean; state?: any }) {
    // If transitioning, queue the navigation
    if (this.isTransitioning) {
      this.navigationQueue.push({ path, options });
      debugLog.log('Navigation queued', { path, queueLength: this.navigationQueue.length });
      return;
    }
    
    // If already on the same route, ignore
    if (this.currentRoute === path) {
      debugLog.log('Navigation ignored - already on route', { path });
      return;
    }
    
    this.executeNavigation(path, options);
  }
  
  private executeNavigation(path: string, options?: any) {
    this.isTransitioning = true;
    this.currentRoute = path;
    
    debugLog.log('Navigation starting', { path, from: this.currentRoute });
    
    try {
      this.navigate(path, options);
    } catch (error) {
      debugLog.error('Navigation failed', { path, error });
    }
    
    // Reset transition state after navigation
    setTimeout(() => {
      this.isTransitioning = false;
      this.processQueue();
    }, 100);
  }
  
  private processQueue() {
    if (this.navigationQueue.length > 0) {
      const next = this.navigationQueue.shift();
      if (next) {
        this.navigateTo(next.path, next.options);
      }
    }
  }
  
  /**
   * Update current route (called by router)
   */
  updateCurrentRoute(path: string) {
    this.currentRoute = path;
    this.isTransitioning = false;
  }
  
  /**
   * Clear navigation queue
   */
  clearQueue() {
    this.navigationQueue = [];
  }
}