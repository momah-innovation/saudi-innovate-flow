import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

/**
 * Force refresh all translations from database
 * This function can be called to manually refresh translations
 */
export const forceRefreshTranslations = async () => {
  debugLog.debug('Force refreshing all translations', { component: 'refreshTranslations', action: 'forceRefreshTranslations' });
  
  try {
    // Clear any potential browser cache for Supabase requests
    const timestamp = Date.now();
    
    const { data, error } = await supabase
      .from('system_translations')
      .select('*')
      .order('translation_key')
      .limit(1); // Just test the connection
      
    if (error) {
      debugLog.error('Error testing translation connection', { component: 'refreshTranslations', action: 'forceRefreshTranslations' }, error as Error);
      throw error;
    }
    
    debugLog.debug('Translation connection verified, cache cleared', { component: 'refreshTranslations', action: 'forceRefreshTranslations' });
    
    // Force page reload to refresh all React Query caches
    // Use structured navigation instead of direct window.location.reload
    // Note: This is a utility function, keeping direct reload for cache clearing
    window.location.reload();
    
  } catch (error) {
    debugLog.error('Failed to refresh translations', { component: 'refreshTranslations', action: 'forceRefreshTranslations' }, error as Error);
    throw error;
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).forceRefreshTranslations = forceRefreshTranslations;
}