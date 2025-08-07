import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { useUnifiedTranslation } from './useUnifiedTranslation';

/**
 * Legacy translation hook for backward compatibility
 * @deprecated Use useUnifiedTranslation directly instead
 */
export function useTranslation() {
  // Use the unified translation system
  const unified = useUnifiedTranslation();
  
  return {
    t: unified.t,
    language: unified.language,
    isRTL: unified.isRTL,
    getDynamicText: unified.getDynamicText,
    formatNumber: unified.formatNumber,
    formatRelativeTime: unified.formatRelativeTime
  };
}

// Export the unified hook as the primary translation system
export { useUnifiedTranslation };