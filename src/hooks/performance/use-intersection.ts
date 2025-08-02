/**
 * Intersection Observer Hook
 * Extracted from performance-hooks.ts for better organization
 */

import { useEffect, useState, useRef } from 'react';

/**
 * Hook for intersection observer (lazy loading, visibility tracking)
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
  onIntersect?: (entry: IntersectionObserverEntry) => void
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
            onIntersect?.(entry);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, onIntersect, hasIntersected, options]);
  
  return { isIntersecting, hasIntersected };
}

/**
 * Hook for image lazy loading
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const { isIntersecting } = useIntersectionObserver(imageRef);
  
  useEffect(() => {
    if (isIntersecting && !isLoaded && !hasError) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setHasError(true);
      };
      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, hasError]);
  
  return {
    ref: imageRef,
    src: imageSrc,
    isLoaded,
    hasError
  };
}