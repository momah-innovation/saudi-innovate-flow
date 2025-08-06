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

  const { data: translations = [], isLoading } = useQuery({
    queryKey: ['system-translations', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_translations')
        .select('*')
        .eq('language_code', language);

      if (error) throw error;
      return data as SystemTranslation[];
    },
  });

  const getTranslation = (key: string, fallback?: string): string => {
    const translation = translations.find(t => t.translation_key === key);
    return translation?.translation_text || fallback || key;
  };

  return {
    translations,
    isLoading,
    getTranslation,
  };
};