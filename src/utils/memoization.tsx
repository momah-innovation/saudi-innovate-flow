// Strategic React.memo Implementation for Performance Optimization
// Provides intelligent memoization for React components

import React, { memo, ReactNode, ComponentType } from 'react';
import { debugLog } from '@/utils/debugLogger';

// Utility to determine if component should be memoized
export function shouldMemoize(Component: ComponentType<any>): boolean {
  const componentName = Component.displayName || Component.name || 'Anonymous';
  
  // Skip memoization for simple components that are unlikely to re-render often
  const skipMemoization = [
    'Button',
    'Input',
    'Label',
    'Icon',
    'Separator'
  ];

  return !skipMemoization.includes(componentName);
}

// Enhanced memo with custom comparison and performance tracking
export function smartMemo<P extends object>(
  Component: ComponentType<P>,
  customCompare?: (prevProps: P, nextProps: P) => boolean
) {
  const componentName = Component.displayName || Component.name || 'Anonymous';
  
  if (!shouldMemoize(Component)) {
    debugLog.debug('Skipping memoization for simple component', {
      component: 'smartMemo',
      action: 'skip',
      componentName
    });
    return Component;
  }

  const compare = customCompare || ((prevProps: P, nextProps: P) => {
    // Track comparison performance
    const startTime = performance.now();
    
    // Shallow comparison for most props
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) {
      return false;
    }
    
    for (const key of prevKeys) {
      if (prevProps[key as keyof P] !== nextProps[key as keyof P]) {
        return false;
      }
    }
    
    const duration = performance.now() - startTime;
    if (duration > 1) {
      debugLog.warn('Slow prop comparison', {
        component: 'smartMemo',
        action: 'compare',
        componentName,
        duration
      });
    }
    
    return true;
  });

  const MemoizedComponent = memo(Component, compare);
  MemoizedComponent.displayName = `Memo(${componentName})`;
  
  return MemoizedComponent;
}

// Memoization for list components with optimized key comparison
export function memoListComponent<T extends { id: string | number }>(
  Component: ComponentType<{ items: T[]; [key: string]: any }>,
  keyExtractor?: (item: T) => string | number
): ComponentType<{ items: T[]; [key: string]: any }> {
  
  return smartMemo(Component, (prevProps, nextProps) => {
    // Compare non-items props first
    const { items: prevItems, ...prevOtherProps } = prevProps;
    const { items: nextItems, ...nextOtherProps } = nextProps;
    
    // Quick reference check
    if (prevItems === nextItems) {
      return Object.keys(prevOtherProps).every(key => 
        prevOtherProps[key] === nextOtherProps[key]
      );
    }
    
    // Length check
    if (prevItems.length !== nextItems.length) {
      return false;
    }
    
    // Compare item keys/IDs
    const extractor = keyExtractor || ((item: T) => item.id);
    for (let i = 0; i < prevItems.length; i++) {
      if (extractor(prevItems[i]) !== extractor(nextItems[i])) {
        return false;
      }
    }
    
    // Compare other props
    return Object.keys(prevOtherProps).every(key => 
      prevOtherProps[key] === nextOtherProps[key]
    );
  });
}

// Specialized memo for form components  
export function memoFormComponent<P extends { value?: any; onChange?: (...args: any[]) => void }>(
  Component: ComponentType<P>
) {
  return smartMemo(Component, (prevProps, nextProps) => {
    const criticalProps = ['value', 'error', 'disabled', 'required'];
    
    for (const prop of criticalProps) {
      if (prevProps[prop as keyof P] !== nextProps[prop as keyof P]) {
        return false;
      }
    }
    return true;
  });
}

// Memo for data display components
export function memoDataComponent<P extends { data?: any }>(
  Component: ComponentType<P>
) {
  return smartMemo(Component, (prevProps, nextProps) => {
    const { data: prevData, ...prevOther } = prevProps;
    const { data: nextData, ...nextOther } = nextProps;
    
    if (prevData === nextData) {
      return Object.keys(prevOther).every(key => 
        prevOther[key] === nextOther[key]
      );
    }
    
    try {
      return JSON.stringify(prevData) === JSON.stringify(nextData) &&
             Object.keys(prevOther).every(key => prevOther[key] === nextOther[key]);
    } catch {
      return prevData === nextData;
    }
  });
}

// HOC for automatic memoization
export function autoMemo<P extends object>(
  Component: ComponentType<P>,
  options?: { type?: 'form' | 'list' | 'data' | 'default' }
) {
  const { type = 'default' } = options || {};
  
  switch (type) {
    case 'form':
      return memoFormComponent(Component as any);
    case 'data':
      return memoDataComponent(Component as any);
    default:
      return smartMemo(Component);
  }
}

// Performance tracking wrapper
export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  trackingName?: string
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    const componentName = trackingName || Component.displayName || Component.name || 'Anonymous';
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      
      if (renderTime > 16) { // Longer than one frame (60fps)
        debugLog.warn('Slow component render', {
          component: 'withPerformanceTracking',
          action: 'render',
          componentName,
          renderTime
        });
      }
    });
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `PerformanceTracked(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Export commonly used memoized components
export const MemoizedCard = smartMemo(({ children, className, ...props }: { 
  children: ReactNode; 
  className?: string;
  [key: string]: any;
}) => <div className={className} {...props}>{children}</div>);

export const MemoizedList = memoListComponent(({ items, renderItem }: {
  items: Array<{ id: string | number; [key: string]: any }>;
  renderItem: (item: any, index: number) => ReactNode;
}) => (
  <div>
    {items.map((item, index) => (
      <div key={item.id}>
        {renderItem(item, index)}
      </div>
    ))}
  </div>
));