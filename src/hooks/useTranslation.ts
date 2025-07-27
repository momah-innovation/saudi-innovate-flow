import { useContext } from 'react';
import { useDirection } from '@/components/ui/direction-provider';
import { translations, interpolate, type Language } from '@/lib/translations';

export function useTranslation() {
  const { language } = useDirection();
  const currentLang = language as Language;

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if Arabic translation not found
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if no translation found
    }
    
    return params ? interpolate(value, params) : value;
  };

  const getDynamicText = (textAr: string, textEn?: string | null): string => {
    if (currentLang === 'en' && textEn) {
      return textEn;
    }
    return textAr;
  };

  const getStatusText = (status: string): string => {
    const statusKey = `status${status.charAt(0).toUpperCase() + status.slice(1).replace('_', '')}`;
    return t(statusKey) || status;
  };

  const getThemeText = (theme: string): string => {
    const themeKey = `theme${theme.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}`;
    return t(themeKey) || theme;
  };

  return {
    t,
    getDynamicText,
    getStatusText,
    getThemeText,
    language: currentLang,
    isRTL: currentLang === 'ar'
  };
}