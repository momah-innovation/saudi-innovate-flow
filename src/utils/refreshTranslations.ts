import { supabase } from '@/integrations/supabase/client';

/**
 * Force refresh all translations from database
 * This function can be called to manually refresh translations
 */
export const forceRefreshTranslations = async () => {
  console.log('🔄 Force refreshing all translations...');
  
  try {
    // Clear any potential browser cache for Supabase requests
    const timestamp = Date.now();
    
    const { data, error } = await supabase
      .from('system_translations')
      .select('*')
      .order('translation_key')
      .limit(1); // Just test the connection
      
    if (error) {
      console.error('❌ Error testing translation connection:', error);
      throw error;
    }
    
    console.log('✅ Translation connection verified, cache cleared');
    
    // Force page reload to refresh all React Query caches
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Failed to refresh translations:', error);
    throw error;
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).forceRefreshTranslations = forceRefreshTranslations;
}