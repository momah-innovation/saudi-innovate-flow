import React, { useMemo } from 'react';
import { 
  Home, Search, Calendar, BarChart3, Users, Lightbulb, Bookmark, UserCheck, 
  Edit, Award, FileText, Building, Database, HardDrive, Briefcase, Target, 
  Star, Activity, MessageSquare, TrendingUp, Settings, HelpCircle, Palette, 
  BookOpen, Network, DollarSign, Shield, Zap, Brain, Archive, Tag, Upload,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail, SidebarHeader, SidebarTrigger
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useResponsiveSidebar } from '@/contexts/ResponsiveSidebarContext';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * ResponsiveNavigationSidebar - Enhanced sidebar with full RTL/LTR support and responsive behavior
 * Features:
 * - Desktop: Full sidebar with controlled state and mini mode
 * - Tablet: Auto-collapse to mini mode (icons only)
 * - Mobile: Overlay/sheet behavior
 * - RTL/LTR: Proper positioning and icon rotation
 * - Coordinated with notifications (only one open at a time)
 */

export function ResponsiveNavigationSidebar() {
  const { isOpen, isMiniMode, isOverlay, isRTL, sidePosition, isMobile, isTablet, isDesktop } = useResponsiveSidebar();
  const location = useLocation();
  const { isRTL: translationRTL } = useTranslation();
  const [isOldLinksOpen, setIsOldLinksOpen] = React.useState(false);

  // Debug logging for RTL issues
  console.log('ResponsiveNavigationSidebar RTL Debug:', { 
    isRTL, 
    translationRTL, 
    sidePosition, 
    isOpen, 
    isMiniMode, 
    isOverlay,
    isMobile,
    isTablet,
    isDesktop
  });

  // Menu items remain the same as original
  const menuItems = useMemo(() => {
    const baseItems = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        arabicLabel: 'لوحة التحكم',
        icon: Home, 
        path: '/dashboard',
        group: 'main',
        roles: ['all'] 
      },
    ];

    const discoverItems = [
      { 
        id: 'challenges-browse', 
        label: 'Browse Challenges', 
        arabicLabel: 'استكشاف التحديات',
        icon: Target, 
        path: '/challenges',
        badge: 12,
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'events-browse', 
        label: 'Browse Events', 
        arabicLabel: 'استكشاف الفعاليات',
        icon: Calendar, 
        path: '/events',
        badge: 2,
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'opportunities', 
        label: 'Partnership Opportunities', 
        arabicLabel: 'فرص الشراكة',
        icon: Briefcase, 
        path: '/opportunities',
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'search', 
        label: 'Smart Search', 
        arabicLabel: 'البحث الذكي',
        icon: Search, 
        path: '/search',
        group: 'discover',
        roles: ['all'] 
      },
    ];

    const personalItems = [
      { 
        id: 'ideas', 
        label: 'My Ideas', 
        arabicLabel: 'أفكاري',
        icon: Lightbulb, 
        path: '/ideas',
        badge: 3,
        group: 'personal',
        roles: ['innovator', 'expert', 'all'] 
      },
      { 
        id: 'saved-items', 
        label: 'Saved Items', 
        arabicLabel: 'العناصر المحفوظة',
        icon: Bookmark, 
        path: '/saved',
        group: 'personal',
        roles: ['all'] 
      },
      { 
        id: 'user-profile', 
        label: 'My Profile', 
        arabicLabel: 'ملفي الشخصي',
        icon: Edit, 
        path: '/profile',
        group: 'personal',
        roles: ['all'] 
      },
    ];

    const workflowItems = [
      { 
        id: 'evaluations', 
        label: 'Evaluations', 
        arabicLabel: 'التقييمات',
        icon: UserCheck, 
        path: '/evaluations',
        badge: 8,
        group: 'workflow',
        roles: ['expert', 'team', 'admin'] 
      },
    ];

    const settingsItems = [
      { 
        id: 'settings', 
        label: 'Settings', 
        arabicLabel: 'الإعدادات',
        icon: Settings, 
        path: '/settings',
        group: 'settings',
        roles: ['all'] 
      },
    ];

    return [...baseItems, ...discoverItems, ...personalItems, ...workflowItems, ...settingsItems];
  }, []);

  // Check if user can see a menu item
  const canAccessItem = (item: any) => {
    return item.roles.includes('all');
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    
    menuItems.forEach(item => {
      if (canAccessItem(item)) {
        if (!groups[item.group]) {
          groups[item.group] = [];
        }
        groups[item.group].push(item);
      }
    });
    
    return groups;
  }, [menuItems]);

  const groupLabels: Record<string, { en: string; ar: string }> = {
    main: { en: 'Dashboard', ar: 'لوحة التحكم' },
    discover: { en: 'Discover', ar: 'استكشاف' },
    personal: { en: 'Personal', ar: 'شخصي' },
    workflow: { en: 'Workflow', ar: 'سير العمل' },
    settings: { en: 'Settings', ar: 'الإعدادات' }
  };

  const groupOrder = ['main', 'discover', 'personal', 'workflow', 'settings'];

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.path;
    const showTooltip = isMiniMode || (isDesktop && !isOpen);
    
    const menuButton = (
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className={cn(
          "w-full justify-start transition-all duration-200",
          isRTL && "flex-row-reverse",
          isMiniMode && "justify-center px-2"
        )}
      >
        <NavLink 
          to={item.path}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            isActive && "bg-primary text-primary-foreground shadow-md",
            !isActive && "text-muted-foreground hover:text-foreground hover:bg-muted",
            isRTL && "flex-row-reverse text-right",
            isMiniMode && "justify-center px-2"
          )}
        >
          <item.icon className={cn(
            "h-4 w-4 transition-transform duration-200", 
            isRTL && "ml-3 mr-0",
            isMiniMode && "h-5 w-5"
          )} />
          {!isMiniMode && (
            <>
              <span className="flex-1 truncate">
                {isRTL ? item.arabicLabel : item.label}
              </span>
              {item.badge && (
                <Badge variant="secondary" className={cn(
                  "ml-auto text-xs transition-all duration-200", 
                  isRTL && "ml-0 mr-auto"
                )}>
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    );

    if (showTooltip) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            {menuButton}
          </TooltipTrigger>
          <TooltipContent 
            side={isRTL ? "left" : "right"} 
            className="z-50 font-medium"
          >
            {isRTL ? item.arabicLabel : item.label}
            {item.badge && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return menuButton;
  };

  const renderGroup = (groupKey: string, items: any[]) => (
    <SidebarGroup key={groupKey} className="transition-all duration-200">
      {!isMiniMode && (
        <SidebarGroupLabel className={cn(
          "text-xs font-medium text-sidebar-foreground/70 mb-2",
          isRTL && "text-right"
        )}>
          {isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              {renderMenuItem(item)}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const sidebarContent = (
    <>
      {/* Header with logo and trigger (hidden in mini mode) */}
      {!isMiniMode && (
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className={cn(
            "flex items-center gap-3",
            isRTL && "flex-row-reverse"
          )}>
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">🏗️</span>
            </div>
            <div className={cn("min-w-0", isRTL && "text-right")}>
              <h2 className="font-semibold text-sm truncate">
                {isRTL ? 'نظام رواد للابتكار' : 'Ruwād Innovation'}
              </h2>
            </div>
          </div>
        </SidebarHeader>
      )}

      {/* Navigation Content */}
      <SidebarContent className="p-2">
        {groupOrder.map((groupKey) => {
          const items = groupedItems[groupKey];
          return items && items.length > 0 ? renderGroup(groupKey, items) : null;
        })}
      </SidebarContent>

      {/* Rail for desktop resize */}
      {isDesktop && <SidebarRail />}
    </>
  );

  // Mobile overlay
  if (isOverlay) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && useResponsiveSidebar().setIsOpen(false)}>
        <SheetContent 
          side={sidePosition}
          className="w-[280px] p-0 bg-sidebar border-sidebar-border"
        >
          <div className="h-full flex flex-col">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop/Tablet sidebar
  return (
    <Sidebar
      side={sidePosition}
      variant="sidebar"
      collapsible={isMiniMode ? "icon" : "offcanvas"}
      className={cn(
        "transition-all duration-300 ease-in-out z-40 border-r border-sidebar-border",
        isMiniMode && "w-16",
        !isOpen && isDesktop && "w-0 border-r-0",
        isOpen && !isMiniMode && "w-64",
        isRTL && "border-r-0 border-l border-sidebar-border"
      )}
      style={{
        [isRTL ? 'right' : 'left']: 0,
      }}
    >
      {sidebarContent}
    </Sidebar>
  );
}
