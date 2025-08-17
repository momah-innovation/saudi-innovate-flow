import React from 'react';
import { useTranslationAppShell } from '@/hooks/useTranslationAppShell';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/errorHandler';

/**
 * Translation AppShell Wrapper Component
 * Handles route-based translation preloading within Router context
 * This must be rendered INSIDE the Router context
 */
export const TranslationAppShellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { withLoading } = useUnifiedLoading({
    component: 'TranslationAppShellProvider',
    showToast: false,
    logErrors: true,
    timeout: 5000
  });
  
  const { handleError } = createErrorHandler({
    component: 'TranslationAppShellProvider',
    showToast: false,
    logErrors: true
  });
  
  // Initialize translation appshell integration (safe within router context)
  React.useEffect(() => {
    const initializeTranslations = async () => {
      try {
        useTranslationAppShell();
      } catch (error) {
        handleError(error as Error, 'initialize_translations');
      }
    };
    
    initializeTranslations();
  }, [handleError]);
  
  return <>{children}</>;
};