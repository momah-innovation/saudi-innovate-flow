// Optimized State Management Hook
// Prevents unnecessary re-renders and optimizes state updates

import { useState, useCallback, useRef } from 'react';
import { debugLog } from '@/utils/debugLogger';

export function useOptimizedState<T>(
  initialValue: T,
  name?: string
): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialValue);
  const previousValueRef = useRef(initialValue);
  const componentName = name || 'unnamed';

  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;

      // Shallow comparison to prevent unnecessary updates
      if (Object.is(prev, next)) {
        debugLog.debug('State update skipped - same value', {
          component: 'useOptimizedState',
          action: 'setState',
          name: componentName
        });
        return prev;
      }

      // Deep comparison for objects and arrays
      if (typeof next === 'object' && next !== null && typeof prev === 'object' && prev !== null) {
        if (JSON.stringify(prev) === JSON.stringify(next)) {
          debugLog.debug('State update skipped - deep equal', {
            component: 'useOptimizedState',
            action: 'setState',
            name: componentName
          });
          return prev;
        }
      }

      debugLog.debug('State updated', {
        component: 'useOptimizedState',
        action: 'setState',
        name: componentName,
        changed: prev !== next
      });

      previousValueRef.current = next;
      return next;
    });
  }, [componentName]);

  return [state, optimizedSetState];
}

// Optimized array state hook for lists
export function useOptimizedListState<T>(
  initialValue: T[] = []
): [T[], {
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  reset: () => void;
  set: (items: T[]) => void;
}] {
  const [items, setItems] = useOptimizedState(initialValue, 'listState');

  const actions = {
    add: useCallback((item: T) => {
      setItems(prev => [...prev, item]);
    }, [setItems]),

    remove: useCallback((index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
    }, [setItems]),

    update: useCallback((index: number, item: T) => {
      setItems(prev => prev.map((existing, i) => i === index ? item : existing));
    }, [setItems]),

    reset: useCallback(() => {
      setItems(initialValue);
    }, [setItems, initialValue]),

    set: useCallback((newItems: T[]) => {
      setItems(newItems);
    }, [setItems])
  };

  return [items, actions];
}

// Optimized object state hook
export function useOptimizedObjectState<T extends Record<string, any>>(
  initialValue: T
): [T, {
  update: (key: keyof T, value: T[keyof T]) => void;
  merge: (updates: Partial<T>) => void;
  reset: () => void;
  set: (newState: T) => void;
}] {
  const [state, setState] = useOptimizedState(initialValue, 'objectState');

  const actions = {
    update: useCallback((key: keyof T, value: T[keyof T]) => {
      setState(prev => ({ ...prev, [key]: value }));
    }, [setState]),

    merge: useCallback((updates: Partial<T>) => {
      setState(prev => ({ ...prev, ...updates }));
    }, [setState]),

    reset: useCallback(() => {
      setState(initialValue);
    }, [setState, initialValue]),

    set: useCallback((newState: T) => {
      setState(newState);
    }, [setState])
  };

  return [state, actions];
}