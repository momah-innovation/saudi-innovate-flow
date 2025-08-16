/**
 * Navigation State Machine for Router Performance Integration
 * Manages navigation states and optimizes route transitions
 */

interface NavigationState {
  current: string;
  previous: string | null;
  loading: boolean;
  error: string | null;
  timestamp: number;
}

interface NavigationTransition {
  from: string;
  to: string;
  duration: number;
  success: boolean;
}

class NavigationStateMachine {
  private state: NavigationState = {
    current: '/',
    previous: null,
    loading: false,
    error: null,
    timestamp: Date.now()
  };

  private transitions: NavigationTransition[] = [];
  private listeners: Array<(state: NavigationState) => void> = [];

  /**
   * Start navigation transition
   */
  startNavigation(to: string): void {
    const from = this.state.current;
    
    this.setState({
      current: to,
      previous: from,
      loading: true,
      error: null,
      timestamp: Date.now()
    });

    // Record transition start
    this.recordTransition(from, to, 0, false);
  }

  /**
   * Complete navigation successfully
   */
  completeNavigation(to: string, duration: number): void {
    const from = this.state.previous || '/';
    
    this.setState({
      current: to,
      previous: from,
      loading: false,
      error: null,
      timestamp: Date.now()
    });

    // Record successful transition
    this.recordTransition(from, to, duration, true);
  }

  /**
   * Handle navigation error
   */
  failNavigation(error: string): void {
    this.setState({
      ...this.state,
      loading: false,
      error,
      timestamp: Date.now()
    });
  }

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * Get navigation performance metrics
   */
  getMetrics(): {
    averageTransitionTime: number;
    successRate: number;
    totalTransitions: number;
    recentTransitions: NavigationTransition[];
  } {
    const successful = this.transitions.filter(t => t.success);
    const averageTime = successful.length > 0 
      ? successful.reduce((sum, t) => sum + t.duration, 0) / successful.length 
      : 0;

    return {
      averageTransitionTime: averageTime,
      successRate: this.transitions.length > 0 
        ? (successful.length / this.transitions.length) * 100 
        : 0,
      totalTransitions: this.transitions.length,
      recentTransitions: this.transitions.slice(-10)
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: NavigationState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Check if route should be preloaded
   */
  shouldPreload(route: string): boolean {
    // Preload frequently visited routes
    const routeVisits = this.transitions.filter(t => t.to === route).length;
    return routeVisits >= 3;
  }

  private setState(newState: NavigationState): void {
    this.state = newState;
    this.listeners.forEach(listener => listener(newState));
  }

  private recordTransition(from: string, to: string, duration: number, success: boolean): void {
    this.transitions.push({ from, to, duration, success });
    
    // Keep only last 100 transitions for memory efficiency
    if (this.transitions.length > 100) {
      this.transitions.shift();
    }
  }
}

// Global navigation state machine instance
export const navigationStateMachine = new NavigationStateMachine();

/**
 * Hook for using navigation state machine in React components
 */
export function useNavigationState() {
  const [state, setState] = React.useState(navigationStateMachine.getState());

  React.useEffect(() => {
    const unsubscribe = navigationStateMachine.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    state,
    metrics: navigationStateMachine.getMetrics(),
    shouldPreload: navigationStateMachine.shouldPreload.bind(navigationStateMachine)
  };
}

import React from 'react';
