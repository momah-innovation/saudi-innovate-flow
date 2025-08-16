/**
 * Search Analytics Hook
 * Handles tracking search analytics events
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

export const useSearchAnalytics = () => {
  
  // Track search performed event
  const trackSearchPerformed = useCallback(async (
    searchQuery: string,
    resultCount: number,
    selectedTypes: string[],
    language: string
  ) => {
    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_type: 'search_performed',
        event_category: 'user_interaction',
        properties: {
          query: searchQuery,
          result_count: resultCount,
          search_types: selectedTypes,
          language: language,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      debugLog.debug('Search analytics tracked', {
        query: searchQuery,
        resultCount,
        selectedTypes,
        language
      });
    } catch (err) {
      debugLog.error('Failed to track search analytics', {
        query: searchQuery,
        error: err
      });
      // Don't throw error to avoid disrupting search functionality
    }
  }, []);

  // Track search filter usage
  const trackSearchFilter = useCallback(async (
    filterType: string,
    filterValue: string,
    resultCount: number
  ) => {
    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_type: 'search_filter_applied',
        event_category: 'user_interaction',
        properties: {
          filter_type: filterType,
          filter_value: filterValue,
          result_count: resultCount,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      debugLog.debug('Search filter analytics tracked', {
        filterType,
        filterValue,
        resultCount
      });
    } catch (err) {
      debugLog.error('Failed to track search filter analytics', {
        filterType,
        filterValue,
        error: err
      });
    }
  }, []);

  return {
    trackSearchPerformed,
    trackSearchFilter
  };
};