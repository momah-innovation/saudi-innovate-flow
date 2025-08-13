import React, { ReactNode, Suspense, useState, createContext, useContext } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useTheme } from '@/components/ui/theme-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { RealTimeCollaborationWrapper } from '@/components/collaboration/RealTimeCollaborationWrapper';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { OptimizedSidebar } from './OptimizedSidebar';
import { UnifiedHeader } from './UnifiedHeader';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface AppShellProps {
  children: ReactNode;
  enableCollaboration?: boolean;
  collaborationContext?: {
    contextType?: 'global' | 'organization' | 'team' | 'project' | 'direct';
    contextId?: string;
    entityType?: string;
    entityId?: string;
  };
}

// Error Boundary Component for AppShell
class AppShellErrorBoundary extends React.Component<
  { children: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppShell Error Boundary caught error', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center space-y-4 p-4 sm:p-6 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-destructive">
              خطأ في التطبيق | Application Error
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors touch-manipulation"
            >
              إعادة تحميل | Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global app context that provides all common hooks
interface AppContextType {
  // Auth
  user: any;
  userProfile: any;
  signOut: () => void;
  
  // Direction & Language
  isRTL: boolean;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleDirection: () => void;
  
  // Theme
  theme: any;
  setTheme: (theme: any) => void;
  
  // Translation (full unified system)
  t: (key: string, fallback?: string, options?: Record<string, any>) => string;
  getTranslation: (key: string, targetLanguage?: 'en' | 'ar', fallback?: string) => string;
  getDynamicText: (textAr: string, textEn?: string | null) => string;
  formatNumber: (num: number) => string;
  formatRelativeTime: (date: Date) => string;
  translationLoading: boolean;
  translationError: Error | null;
  changeLanguage: (lang: string) => Promise<any>;
  refreshTranslations: () => Promise<void>;
  
  // System
  systemSettings: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppShell - Optimized root layout with fast sidebar
 * Features:
 * - Ultra-fast Shadcn sidebar with instant open/close
 * - Optimized performance with minimal re-renders
 * - Centralized hook injection for all components
 * - Global RTL/LTR and i18n setup
 */
export function AppShell({ children, enableCollaboration, collaborationContext }: AppShellProps) {
  // Initialize all hooks at app level
  const auth = useAuth();
  const direction = useDirection();
  const theme = useTheme();
  const translation = useUnifiedTranslation();
  const systemSettings = useSystemSettings();
  const location = useLocation();
  
  // Determine if collaboration should be enabled based on route
  const shouldEnableCollaboration = enableCollaboration !== false && (
    enableCollaboration === true ||
    ['/challenges', '/ideas', '/workspace', '/events', '/opportunities'].some(route => 
      location.pathname.startsWith(route)
    )
  );
  
  // Auto-generate collaboration context based on current route
  const getCollaborationContext = () => {
    if (collaborationContext) return collaborationContext;
    
    const path = location.pathname;
    if (path.startsWith('/challenges')) {
      return { contextType: 'global' as const, contextId: 'challenges', entityType: 'challenges', entityId: 'browse' };
    } else if (path.startsWith('/ideas')) {
      return { contextType: 'global' as const, contextId: 'ideas', entityType: 'ideas', entityId: 'browse' };
    } else if (path.startsWith('/workspace')) {
      return { contextType: 'global' as const, contextId: 'workspace', entityType: 'workspace', entityId: 'global' };
    } else if (path.startsWith('/events')) {
      return { contextType: 'global' as const, contextId: 'events', entityType: 'events', entityId: 'browse' };
    } else if (path.startsWith('/opportunities')) {
      return { contextType: 'global' as const, contextId: 'opportunities', entityType: 'opportunities', entityId: 'browse' };
    }
    return { contextType: 'global' as const, contextId: 'general', entityType: 'system', entityId: 'main' };
  };
  
  // Apply global RTL/LTR classes to document
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Apply direction
    root.dir = direction.isRTL ? 'rtl' : 'ltr';
    root.lang = direction.language;
    
    // Apply direction classes
    root.classList.remove('ltr', 'rtl');
    root.classList.add(direction.isRTL ? 'rtl' : 'ltr');
    
    // Apply language classes for font handling
    root.classList.remove('lang-ar', 'lang-en');
    root.classList.add(`lang-${direction.language}`);
    
  }, [direction.isRTL, direction.language]);
  
  // Provide unified context
  const appContextValue: AppContextType = {
    // Auth
    user: auth.user,
    userProfile: auth.userProfile,
    signOut: auth.signOut,
    
    // Direction & Language
    isRTL: direction.isRTL,
    language: direction.language,
    setLanguage: direction.setLanguage,
    toggleDirection: direction.toggleDirection,
    
    // Theme
    theme: theme.theme,
    setTheme: theme.setTheme,
    
    // Translation (full unified system)
    t: translation.t,
    getTranslation: translation.getTranslation,
    getDynamicText: translation.getDynamicText,
    formatNumber: translation.formatNumber,
    formatRelativeTime: translation.formatRelativeTime,
    translationLoading: translation.isLoading,
    translationError: translation.error,
    changeLanguage: translation.changeLanguage,
    refreshTranslations: translation.refreshTranslations,
    
    // System
    systemSettings,
  };
  
  const handleError = (error: Error) => {
    console.error('AppShell runtime error:', error, 'Route:', location.pathname);
  };
  
  const content = (
    <AppShellErrorBoundary onError={handleError}>
      <TranslationProvider>
        <AnalyticsProvider options={{ includeRoleSpecific: true, autoRefresh: true }}>
          <AppContext.Provider value={appContextValue}>
            <div className="min-h-screen flex w-full">
              <SidebarProvider>
                <OptimizedSidebar />
                <SidebarInset>
                  {/* Optimized Header with Sidebar Trigger */}
                  <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <SidebarTrigger className="-ml-1 h-8 w-8" />
                    <UnifiedHeader 
                      variant="system" 
                      className="flex-1 border-none px-0 h-auto py-0"
                    />
                  </header>
                  
                  {/* Optimized Page Content */}
                  <main className="flex-1 overflow-auto">
                    <Suspense fallback={
                      <div className="flex items-center justify-center min-h-[50vh] px-4">
                        <LoadingSpinner />
                      </div>
                    }>
                      {children}
                    </Suspense>
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </div>
          </AppContext.Provider>
        </AnalyticsProvider>
      </TranslationProvider>
    </AppShellErrorBoundary>
  );

  // Wrap with collaboration if enabled
  if (shouldEnableCollaboration) {
    const context = getCollaborationContext();
    return (
      <AppShellErrorBoundary onError={handleError}>
        <RealTimeCollaborationWrapper
          contextType={context.contextType}
          contextId={context.contextId}
          entityType={context.entityType}
          entityId={context.entityId}
          showWidget={true}
          widgetPosition="bottom-right"
        >
          {content}
        </RealTimeCollaborationWrapper>
      </AppShellErrorBoundary>
    );
  }

  return content;
}

/**
 * Hook to access all app-level functionality
 * Components can use this instead of importing individual hooks
 */
export function useAppShell() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppShell must be used within AppShell');
  }
  return context;
}

// Legacy hook exports for backward compatibility during migration
export const useAppDirection = () => {
  const { isRTL, language, setLanguage, toggleDirection } = useAppShell();
  return { isRTL, language, setLanguage, toggleDirection };
};

export const useAppAuth = () => {
  const { user, userProfile, signOut } = useAppShell();
  return { user, userProfile, signOut };
};

export const useAppTheme = () => {
  const { theme, setTheme } = useAppShell();
  return { theme, setTheme };
};

export const useAppShellTranslation = () => {
  const { 
    t, 
    getTranslation, 
    getDynamicText, 
    formatNumber, 
    formatRelativeTime,
    translationLoading,
    translationError,
    changeLanguage,
    refreshTranslations
  } = useAppShell();
  return { 
    t, 
    getTranslation, 
    getDynamicText, 
    formatNumber, 
    formatRelativeTime,
    isLoading: translationLoading,
    error: translationError,
    changeLanguage,
    refreshTranslations
  };
};