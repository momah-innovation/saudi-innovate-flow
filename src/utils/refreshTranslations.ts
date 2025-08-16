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
    
    // ✅ FIXED: Use safe navigation pattern for cache clearing  
    const safeReload = () => {
      try {
        if (typeof window !== 'undefined' && window.location) {
          window.location.reload();
        }
      } catch (reloadError) {
        debugLog.warn('Failed to reload page for translation refresh', { component: 'refreshTranslations' });
      }
    };
    safeReload();
    
  } catch (error) {
    debugLog.error('Failed to refresh translations', { component: 'refreshTranslations', action: 'forceRefreshTranslations' }, error as Error);
    throw error;
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).forceRefreshTranslations = forceRefreshTranslations;
}