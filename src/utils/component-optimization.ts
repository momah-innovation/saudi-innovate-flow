/**
 * Phase 8: Performance Optimization - Component Optimization Utilities
 * Utilities for optimizing React components and reducing re-renders
 */

import React, { memo, forwardRef, ComponentType, PropsWithChildren } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

/**
 * Enhanced memo with custom comparison and debug info
 */
export function optimizedMemo<T extends ComponentType<any>>(
  Component: T,
  compare?: (prevProps: any, nextProps: any) => boolean,
  debugName?: string
): T {
  const MemoizedComponent = memo(Component, (prevProps, nextProps) => {
    if (process.env.NODE_ENV === 'development' && debugName) {
      const changedProps = Object.keys(nextProps).filter(
        key => prevProps[key] !== nextProps[key]
      );
      if (changedProps.length > 0) {
        console.log(`${debugName} props changed:`, changedProps);
      }
    }
    
    return compare ? compare(prevProps, nextProps) : false;
  });
  
  MemoizedComponent.displayName = `OptimizedMemo(${Component.displayName || Component.name})`;
  return MemoizedComponent as any;
}

/**
 * Higher-order component for performance monitoring
 */
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Anonymous';
    
    React.useEffect(() => {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        if (process.env.NODE_ENV === 'development') {
          console.log(`${name} lifecycle time: ${end - start}ms`);
        }
      };
    }, []);
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * HOC for adding error boundary and lazy loading
 */
export function withOptimizations<P extends object>(
  Component: ComponentType<P>,
  options: {
    errorBoundary?: boolean;
    memo?: boolean;
    performanceMonitoring?: boolean;
    lazyLoad?: boolean;
    displayName?: string;
  } = {}
) {
  const {
    errorBoundary = true,
    memo: shouldMemo = true,
    performanceMonitoring = process.env.NODE_ENV === 'development',
    displayName = Component.displayName || Component.name
  } = options;
  
  let OptimizedComponent = Component;
  
  // Apply performance monitoring
  if (performanceMonitoring) {
    OptimizedComponent = withPerformanceMonitoring(OptimizedComponent, displayName);
  }
  
  // Apply memoization
  if (shouldMemo) {
    OptimizedComponent = optimizedMemo(OptimizedComponent, undefined, displayName);
  }
  
  // Wrap with error boundary
  if (errorBoundary) {
    const FinalComponent = (props: P) => (
      React.createElement(ErrorBoundary, { 
        level: "component",
        children: React.createElement(OptimizedComponent, props)
      })
    );
    
    FinalComponent.displayName = `withOptimizations(${displayName})`;
    return FinalComponent;
  }
  
  return OptimizedComponent;
}

/**
 * Component for conditional rendering with performance optimization
 */
interface ConditionalRenderProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  keepMounted?: boolean;
}

export const ConditionalRender = memo(({ 
  when, 
  children, 
  fallback = null, 
  keepMounted = false 
}: ConditionalRenderProps) => {
  if (when) {
    return React.createElement(React.Fragment, null, children);
  }
  
  if (keepMounted) {
    return React.createElement('div', { style: { display: 'none' } }, children);
  }
  
  return React.createElement(React.Fragment, null, fallback);
});

ConditionalRender.displayName = 'ConditionalRender';

/**
 * Optimized list component with virtual scrolling
 */
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  height: number;
  className?: string;
  keyExtractor?: (item: T, index: number) => string | number;
  overscan?: number;
}

export function OptimizedList<T>({
  items,
  renderItem,
  itemHeight,
  height,
  className = '',
  keyExtractor = (_, index) => index,
  overscan = 5
}: OptimizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleRange = React.useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan);
    
    return { start, end };
  }, [scrollTop, itemHeight, height, items.length, overscan]);
  
  const visibleItems = React.useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return React.createElement('div', {
    className: `overflow-auto ${className}`,
    style: { height },
    onScroll: (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop)
  }, React.createElement('div', {
    style: { height: totalHeight, position: 'relative' }
  }, React.createElement('div', {
    style: { transform: `translateY(${offsetY}px)` }
  }, visibleItems.map((item, index) => {
    const actualIndex = visibleRange.start + index;
    return React.createElement('div', {
      key: keyExtractor(item, actualIndex),
      style: { height: itemHeight }
    }, renderItem(item, actualIndex));
  }))));
}

/**
 * Lazy loading wrapper for heavy components
 */
interface LazyWrapperProps extends PropsWithChildren {
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
  onVisible?: () => void;
}

export const LazyWrapper = memo<LazyWrapperProps>(({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder = null,
  onVisible
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          onVisible?.();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold, rootMargin, isVisible, onVisible]);
  
  return React.createElement('div', { ref }, 
    isVisible ? children : placeholder
  );
});

LazyWrapper.displayName = 'LazyWrapper';

/**
 * Debounced input component
 */
interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onDebouncedChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = memo<DebouncedInputProps>(({
  onDebouncedChange,
  debounceMs = 300,
  ...props
}) => {
  const [value, setValue] = React.useState(props.value || '');
  
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDebouncedChange(value as string);
    }, debounceMs);
    
    return () => clearTimeout(timeoutId);
  }, [value, debounceMs, onDebouncedChange]);
  
  return React.createElement('input', {
    ...props,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  });
});

DebouncedInput.displayName = 'DebouncedInput';

/**
 * Performance-optimized image component
 */
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  lazy?: boolean;
  fadeIn?: boolean;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  placeholder,
  lazy = true,
  fadeIn = true,
  className = '',
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(!lazy);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    if (!lazy) return;
    
    const element = imgRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [lazy]);
  
  const imageStyles = {
    ...style,
    transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined,
    opacity: isLoaded ? 1 : 0
  };
  
  return React.createElement('div', {
    ref: imgRef,
    className,
    style: { position: 'relative', ...style }
  }, [
    isVisible && React.createElement('img', {
      ...props,
      src: error ? placeholder : src,
      alt,
      style: imageStyles,
      onLoad: () => setIsLoaded(true),
      onError: () => setError(true)
    }),
    !isLoaded && placeholder && React.createElement('img', {
      src: placeholder,
      alt: '',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isLoaded ? 0 : 1,
        transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined
      }
    })
  ].filter(Boolean));
});

OptimizedImage.displayName = 'OptimizedImage';

export default {
  optimizedMemo,
  withPerformanceMonitoring,
  withOptimizations,
  ConditionalRender,
  OptimizedList,
  LazyWrapper,
  DebouncedInput,
  OptimizedImage
};