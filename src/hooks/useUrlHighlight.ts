import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to handle highlighting specific items based on URL parameters
 * Useful for showing highlighted search results when navigating from global search
 */
export function useUrlHighlight(paramName: string = 'highlight') {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get(paramName);
    
    if (id) {
      setHighlightId(id);
      
      // Auto-remove highlight after 3 seconds
      const timeout = setTimeout(() => {
        setHighlightId(null);
        // Remove the highlight parameter from URL without triggering navigation
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.delete(paramName);
        const newUrl = `${location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [location.search, paramName]);

  const clearHighlight = () => {
    setHighlightId(null);
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(paramName);
    const newUrl = `${location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  return { highlightId, clearHighlight };
}