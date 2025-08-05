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
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className={cn(
        "container flex items-center justify-between px-4 h-full max-w-none",
        isRTL && "flex-row-reverse"
      )}>
        
        {/* Left Section: Logo, Sidebar Toggle, Title */}
        <div className={cn(
          "flex items-center gap-3 min-w-0",
          isRTL && "flex-row-reverse"
        )}>
          {/* Sidebar Toggle */}
          <SidebarTrigger 
            className="shrink-0" 
            onClick={toggleSidebar}
          />
          
          {/* Logo & Title */}
          <div className={cn(
            "flex items-center gap-2 min-w-0",
            isRTL && "flex-row-reverse"
          )}>
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">🏗️</span>
            </div>
            <div className={cn(
              "hidden sm:block min-w-0",
              isRTL && "text-right"
            )}>
              <h1 className={cn(
                "font-semibold text-sm truncate",
                language === 'ar' ? 'font-arabic' : 'font-english'
              )}>
                {getSystemTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section: Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              type="search"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-9",
                isRTL ? "pr-10 text-right font-arabic" : "pl-10 font-english"
              )}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className={cn(
          "flex items-center gap-2",
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