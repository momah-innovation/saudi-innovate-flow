import { useTranslation as useI18nextTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();
  
  const language = i18n.language as 'en' | 'ar';
  const isRTL = language === 'ar';
  
  const getDynamicText = (textAr: string, textEn?: string | null): string => {
    if (language === 'en' && textEn) {
      return textEn;
    }
    return textAr;
  };
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };
  
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return t('just_now');
    } else if (diffInMinutes < 60) {
      return t('minutes_ago', { count: diffInMinutes });
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return t('hours_ago', { count: hours });
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return t('days_ago', { count: days });
    }
  };
  
  return {
    t,
    language,
    isRTL,
    getDynamicText,
    formatNumber,
    formatRelativeTime
  };
}