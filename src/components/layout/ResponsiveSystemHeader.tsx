import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResponsiveNotificationCenter } from '@/components/notifications/ResponsiveNotificationCenter';
import { UserMenu } from './UserMenu';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { getInitials, useSystemSettings } from '@/contexts/SystemSettingsContext';
import { cn } from '@/lib/utils';
import { useResponsiveSidebar } from '@/contexts/ResponsiveSidebarContext';

/**
 * ResponsiveSystemHeader - Enhanced global header with coordinated sidebar/notification behavior
 * Features:
 * - RTL/LTR support with proper positioning
 * - Responsive design (mobile drawer trigger, desktop sidebar trigger)
 * - Global search functionality with RTL placeholder support
 * - Coordinated notifications that respect sidebar position
 * - User controls and language switching
 * - Smooth animations and hover effects
 */
export function ResponsiveSystemHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { userProfile } = useAuth();
  const { isRTL, language } = useDirection();
  const { uiInitialsMaxLength } = useSystemSettings();
  const { toggleSidebar, isOverlay } = useResponsiveSidebar();

  const getUserDisplayName = () => {
    if (!userProfile) return 'User';
    return userProfile.name || userProfile.email || 'User';
  };

  const getSearchPlaceholder = () => {
    return language === 'ar' ? 'البحث...' : 'Search...';
  };

  const getSystemTitle = () => {
    return language === 'ar' ? 'نظام رواد للابتكار' : 'Ruwād Innovation System';
  };

  return (
    <header className="sticky-header">
      <div className={cn(
        "container-responsive header-content",
        isRTL && "flex-row-reverse"
      )}>
        
        {/* Left Section: Logo, Sidebar Toggle, Title */}
        <div className={cn(
          "header-left-section",
          isRTL && "flex-row-reverse"
        )}>
          {/* Sidebar Toggle */}
          <SidebarTrigger 
            className="sidebar-trigger" 
            onClick={toggleSidebar}
          />
          
          {/* Logo & Title */}
          <div className={cn(
            "logo-section",
            isRTL && "flex-row-reverse"
          )}>
            <div className="app-logo">
              <span className="app-logo-icon">🏗️</span>
            </div>
            <div className={cn(
              "app-title-container",
              isRTL && "text-right"
            )}>
              <h1 className={cn(
                "app-title",
                language === 'ar' ? 'font-arabic' : 'font-english'
              )}>
                {getSystemTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section: Search */}
        <div className="search-section">
          <div className="search-container">
            <Search className={cn(
              "search-icon",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="search"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "search-input",
                isRTL ? "pr-10 text-right font-arabic" : "pl-10 font-english"
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className={cn(
          "header-right-section",
          isRTL && "flex-row-reverse"
        )}>
          {/* Language Toggle */}
          <LanguageToggle />
          
          {/* Notifications */}
          <ResponsiveNotificationCenter />
          
          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}