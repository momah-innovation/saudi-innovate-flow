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
  
  // ✅ FIXED: Call hook directly instead of in useEffect to prevent timing issues
  try {
    useTranslationAppShell();
  } catch (error) {
    // Silent handling - don't break app initialization
  }
  
  return <>{children}</>;
};