import React, { ReactNode, Suspense, useState, createContext, useContext } from 'react';
import { SystemHeader } from './UnifiedHeader';
import { NavigationSidebar } from './NavigationSidebar';
import { LoadingSpinner } from '@/components/ui/loading';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useTheme } from '@/components/ui/theme-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { RealTimeCollaborationWrapper } from '@/components/collaboration/RealTimeCollaborationWrapper';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  
  // Translation
  t: (key: string, params?: any) => string;
  
  // System
  systemSettings: any;
  
  // Navigation
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppShell - Root layout component providing unified app context
 * Features:
 * - Centralized hook injection for all components
 * - Global RTL/LTR and i18n setup
 * - Auto direction detection (Arabic = RTL, English = LTR)
 * - Overlay navigation sidebar
 * - Global header with search and user controls
 * - Loading states and performance optimization
 */
export function AppShell({ children, enableCollaboration, collaborationContext }: AppShellProps) {
  // Initialize all hooks at app level
  const auth = useAuth();
  const direction = useDirection();
  const theme = useTheme();
  const translation = useUnifiedTranslation();
  const systemSettings = useSystemSettings();
  const location = useLocation();
  
  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    
    // Translation
    t: translation.t,
    
    // System
    systemSettings,
    
    // Navigation
    sidebarOpen,
    setSidebarOpen,
  };
  
  const content = (
    <AppContext.Provider value={appContextValue}>
      <div className={cn(
        "min-h-screen flex w-full bg-background transition-all duration-300",
        direction.isRTL && "flex-row-reverse"
      )}>
        {/* Navigation Sidebar Overlay */}
        <NavigationSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Global Header */}
          <SystemHeader onSidebarToggle={() => setSidebarOpen(true)} />
          
          {/* Page Content with Loading */}
          <main className="flex-1 overflow-auto">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );

  // Wrap with collaboration if enabled
  if (shouldEnableCollaboration) {
    const context = getCollaborationContext();
    return (
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
  const { t } = useAppShell();
  return { t };
};