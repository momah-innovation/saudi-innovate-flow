import React from 'react';
import { useTranslationAppShell } from '@/hooks/useTranslationAppShell';

/**
 * Translation AppShell Wrapper Component
 * Handles route-based translation preloading within Router context
 * This must be rendered INSIDE the Router context
 */
export const TranslationAppShellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize translation appshell integration (safe within router context)
  useTranslationAppShell();
  
  return <>{children}</>;
};