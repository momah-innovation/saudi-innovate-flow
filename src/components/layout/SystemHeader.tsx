import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { UserMenu } from './UserMenu';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';
import { cn } from '@/lib/utils';

/**
 * SystemHeader - Global header component with improved UX and performance
 * Features:
 * - Responsive design (mobile drawer trigger, desktop sidebar trigger)
 * - Global search functionality
 * - User controls and notifications
 * - Language switching
 * - Optimized for RTL
 */
export function SystemHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { userProfile } = useAuth();
  const { isRTL, language } = useDirection();
  const { uiInitialsMaxLength } = useSystemSettings();

  const getUserDisplayName = () => {
    if (!userProfile) return 'User';
    return userProfile.name || userProfile.email || 'User';
  };

  const getSearchPlaceholder = () => {
    return isRTL ? 'البحث...' : 'Search...';
  };

  const getSystemTitle = () => {
    return isRTL ? 'نظام رواد للابتكار' : 'Ruwād Innovation';
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
          <SidebarTrigger className="shrink-0" />
          
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
              <h1 className="font-semibold text-sm truncate">
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
                isRTL ? "pr-10 text-right" : "pl-10"
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
          <NotificationCenter />
          
          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}