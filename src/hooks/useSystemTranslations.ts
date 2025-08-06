import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useAppTranslation';

export interface SystemTranslation {
  id: string;
  translation_key: string;
  language_code: string;
  translation_text: string;
  category: string;
}

export const useSystemTranslations = () => {
  const { language } = useTranslation();
  
  // Normalize language code (en-US -> en, ar-SA -> ar, etc.)
  const normalizedLanguage = language.split('-')[0];

  const { data: translations = [], isLoading } = useQuery({
    queryKey: ['system-translations', normalizedLanguage],
    queryFn: async () => {
      console.log('Fetching translations for language:', normalizedLanguage);
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .eq('language_code', normalizedLanguage);

      if (error) {
        console.error('Translation fetch error:', error);
        throw error;
      }
      console.log('Fetched translations:', data?.length || 0, 'items');
      return data as SystemTranslation[];
    },
  });

  const getTranslation = (key: string, fallback?: string): string => {
    const translation = translations.find(t => t.translation_key === key);
    const result = translation?.translation_text || fallback || key;
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