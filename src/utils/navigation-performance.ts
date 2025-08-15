/**
 * Navigation Performance Optimizations
 * Prevents navigation freezes and improves card interaction performance
 */

// Simple debounce function
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Debounced navigation to prevent rapid clicks causing freezes
export const createDebouncedNavigate = (navigate: (path: string) => void) => {
  return debounce((path: string) => {
    // Use setTimeout to allow current render cycle to complete
    setTimeout(() => {
      navigate(path);
    }, 0);
  }, 200);
};

// Optimized card click handler
export const createOptimizedCardClick = (
  onClick: () => void,
  onNavigate?: (path: string) => void,
  path?: string
) => {
  return debounce((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Disable animations temporarily during navigation
    document.body.style.pointerEvents = 'none';
    document.body.classList.add('navigating');
    
    // Execute click handler or navigation
    if (onNavigate && path) {
      onNavigate(path);
    } else {
      onClick();
    }
    
    // Re-enable interactions after a short delay
    setTimeout(() => {
      document.body.style.pointerEvents = '';
      document.body.classList.remove('navigating');
    }, 100);
  }, 150);
};

// CSS class to disable expensive animations during navigation
export const navigationStyles = `
  .navigating * {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
  
  .navigating .card-hover-effect {
    transform: none !important;
    box-shadow: none !important;
  }
`;

// Inject navigation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = navigationStyles;
  document.head.appendChild(style);
}

// Performance-optimized intersection observer for cards
export const createCardObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  });
};

// Virtualization helper for large lists
export const calculateVisibleItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  totalItems: number,
  buffer: number = 2
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + buffer * 2);
  
  return { startIndex, endIndex, visibleCount };
};