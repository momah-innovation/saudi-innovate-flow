import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
// import { useDirection } from '@/contexts/DirectionProvider';
import { useMemo, useCallback } from 'react';
import { formatNumber } from '@/lib/rtl-utils';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspaceTranslationOptions {
  workspaceType: WorkspaceType;
  dynamicContent?: boolean;
  fallbackStrategy?: 'system' | 'english' | 'arabic';
  namespace?: string;
}

interface WorkspaceTranslationData {
  tw: (key: string, params?: Record<string, any>) => string;
  formatWorkspaceContent: (content: any, type?: 'number' | 'date' | 'text') => string;
  formatWorkspaceNumber: (value: number, options?: { useArabicNumerals?: boolean }) => string;
  formatWorkspaceDate: (date: Date | string, options?: { dateStyle?: 'short' | 'medium' | 'long' }) => string;
  getWorkspaceDirection: () => 'ltr' | 'rtl';
  isRTL: boolean;
  currentLanguage: string;
  isLoadingTranslations: boolean;
}

export function useWorkspaceTranslations(
  options: WorkspaceTranslationOptions
): WorkspaceTranslationData {
  const { t, isRTL } = useUnifiedTranslation();
  const direction = isRTL ? 'rtl' : 'ltr';
  const currentLanguage = 'en';
  
  const {
    workspaceType,
    dynamicContent = false,
    fallbackStrategy = 'system',
    namespace
  } = options;

  // Workspace-specific translation function
  const tw = useCallback((key: string, params?: Record<string, any>) => {
    const workspaceNamespace = namespace || `workspace.${workspaceType}`;
    const fullKey = `${workspaceNamespace}.${key}`;
    
    // Try workspace-specific key first
    const workspaceTranslation = t(fullKey, { ...params, defaultValue: null });
    if (workspaceTranslation !== fullKey) {
      return workspaceTranslation;
    }
    
    // Try general workspace key
    const generalKey = `workspace.general.${key}`;
    const generalTranslation = t(generalKey, { ...params, defaultValue: null });
    if (generalTranslation !== generalKey) {
      return generalTranslation;
    }
    
    // Fallback strategy
    switch (fallbackStrategy) {
      case 'english':
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      case 'arabic':
        // Return Arabic fallback if available
        return t(`ar.${fullKey}`, { ...params, defaultValue: key });
      default:
        return t(fullKey, { ...params, defaultValue: key });
    }
  }, [workspaceType, namespace, fallbackStrategy, t]);

  // RTL-aware content formatting
  const formatWorkspaceContent = useCallback((content: any, type: 'number' | 'date' | 'text' = 'text') => {
    if (content === null || content === undefined) return '';
    
    switch (type) {
      case 'number':
        return formatNumber(Number(content), isRTL, { useArabicNumerals: true });
      case 'date':
        const date = new Date(content);
        return new Intl.DateTimeFormat(
          isRTL ? 'ar-SA' : 'en-US',
          { 
            dateStyle: 'medium',
            calendar: isRTL ? 'islamic' : 'gregory'
          }
        ).format(date);
      default:
        return String(content);
    }
  }, [isRTL]);

  // Workspace-specific number formatting
  const formatWorkspaceNumber = useCallback((
    value: number, 
    options: { useArabicNumerals?: boolean } = {}
  ) => {
    const { useArabicNumerals = isRTL } = options;
    return formatNumber(value, isRTL, { useArabicNumerals });
  }, [isRTL]);

  // Workspace-specific date formatting
  const formatWorkspaceDate = useCallback((
    date: Date | string,
    options: { dateStyle?: 'short' | 'medium' | 'long' } = {}
  ) => {
    const { dateStyle = 'medium' } = options;
    const dateObj = new Date(date);
    
    return new Intl.DateTimeFormat(
      isRTL ? 'ar-SA' : 'en-US',
      { 
        dateStyle,
        calendar: isRTL ? 'islamic' : 'gregory',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    ).format(dateObj);
  }, [isRTL]);

  // Get workspace direction
  const getWorkspaceDirection = useCallback(() => direction, [direction]);

  // Mock loading state (in real implementation, this would track translation loading)
  const isLoadingTranslations = false;

  return {
    tw,
    formatWorkspaceContent,
    formatWorkspaceNumber,
    formatWorkspaceDate,
    getWorkspaceDirection,
    isRTL,
    currentLanguage,
    isLoadingTranslations
  };
}