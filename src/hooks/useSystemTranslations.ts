import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useAppTranslation';
import { queryKeys } from '@/lib/query/query-keys';

export interface SystemTranslation {
  id: string;
  translation_key: string;
  text_en: string;
  text_ar: string;
  category: string;
}

export const useSystemTranslations = () => {
  const { language } = useTranslation();
  
  // Normalize language code (en-US -> en, ar-SA -> ar, etc.)
  const normalizedLanguage = language.split('-')[0];

  const { data: translations = [], isLoading } = useQuery({
    queryKey: queryKeys.system.translation(normalizedLanguage),
    queryFn: async () => {
      console.log('Fetching bilingual translations');
      const { data, error } = await supabase
        .from('system_translations')
        .select('*');

      if (error) {
        console.error('Translation fetch error:', error);
        throw error;
      }
      console.log('Fetched translations:', data?.length || 0, 'items');
      return data as SystemTranslation[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - translations don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    refetchOnWindowFocus: false, // Don't refetch on focus for translations
    refetchOnMount: false, // Only refetch if data is stale
  });

  const getTranslation = (key: string, fallback?: string): string => {
    const translation = translations.find(t => t.translation_key === key);
    const textField = normalizedLanguage === 'ar' ? 'text_ar' : 'text_en';
    const result = translation?.[textField] || fallback || key;
    if (!translation && fallback !== key) {
      console.log('Missing translation for key:', key, 'language:', normalizedLanguage);
    }
    return result;
  };

  return {
    translations,
    isLoading,
    getTranslation,
  };
};