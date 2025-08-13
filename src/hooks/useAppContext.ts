/**
 * App Context Hook
 * Provides access to all AppShell injected hooks and context
 */

import { useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useTheme } from '@/components/ui/theme-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { useSidebarPersistence } from '@/contexts/SidebarContext';

/**
 * Comprehensive app context that combines all major hooks
 * This provides a single point of access to all app-level functionality
 */
export function useAppContext() {
  // Authentication context
  const auth = useAuth();
  
  // Direction and internationalization
  const direction = useDirection();
  const translation = useUnifiedTranslation();
  
  // Theme management
  const theme = useTheme();
  
  // System settings
  const systemSettings = useSystemSettings();
  
  // Sidebar persistence
  const sidebarPersistence = useSidebarPersistence();

  // Derived values
  const userRoles = auth.userProfile?.user_roles?.map(ur => ur.role) || [];
  const isAuthenticated = !!auth.user;
  const primaryRole = userRoles[0] || 'user';

  return {
    // Authentication
    user: auth.user,
    userProfile: auth.userProfile,
    userRoles,
    isAuthenticated,
    primaryRole,
    signOut: auth.signOut,
    
    // Direction & Language
    direction: direction.direction,
    language: direction.language,
    isRTL: direction.isRTL,
    setDirection: direction.setDirection,
    setLanguage: direction.setLanguage,
    toggleDirection: direction.toggleDirection,
    
    // Translation
    t: translation.t,
    getTranslation: translation.getTranslation,
    getDynamicText: translation.getDynamicText,
    formatNumber: translation.formatNumber,
    formatRelativeTime: translation.formatRelativeTime,
    translationLoading: translation.isLoading,
    translationError: translation.error,
    changeLanguage: translation.changeLanguage,
    refreshTranslations: translation.refreshTranslations,
    
    // Theme
    theme: theme.theme,
    setTheme: theme.setTheme,
    
    // System Settings
    systemSettings,
    
    // Sidebar
    sidebarOpen: sidebarPersistence.isOpen,
    setSidebarOpen: sidebarPersistence.setIsOpen,
    toggleSidebar: sidebarPersistence.toggleSidebar,
  };
}

export type AppContextType = ReturnType<typeof useAppContext>;