import React, { ReactNode, Suspense, useState, createContext, useContext } from 'react';
import { SystemHeader } from './UnifiedHeader';
import { NavigationSidebar } from './NavigationSidebar';
import { LoadingSpinner } from '@/components/ui/loading';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useTheme } from '@/components/ui/theme-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
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
export function AppShell({ children }: AppShellProps) {
  // Initialize all hooks at app level
  const auth = useAuth();
  const direction = useDirection();
  const theme = useTheme();
  const translation = useUnifiedTranslation();
  const systemSettings = useSystemSettings();
  
  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
  
  return (
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