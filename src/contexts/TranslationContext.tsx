import React, { createContext, useContext, ReactNode } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

// Types for Translation Context
export interface TranslationContextType {
  t: (key: string, fallback?: string, options?: Record<string, any>) => string;
  getTranslation: (key: string, targetLanguage?: 'en' | 'ar', fallback?: string) => string;
  getDynamicText: (textAr: string, textEn?: string | null) => string;
  formatNumber: (num: number) => string;
  formatRelativeTime: (date: Date) => string;
  language: 'en' | 'ar';
  isRTL: boolean;
  isLoading: boolean;
  error: Error | null;
  changeLanguage: (lang: string) => Promise<any>;
  refreshTranslations: () => Promise<void>;
}

// Create the context
const TranslationContext = createContext<TranslationContextType | null>(null);

// Provider component
interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const translationData = useUnifiedTranslation();
  
  return (
    <TranslationContext.Provider value={translationData}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use translation context
export function useTranslationContext() {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  
  return context;
}

// Export for backward compatibility
export { useUnifiedTranslation as useTranslation };