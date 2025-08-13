import React, { useMemo, memo, useState, useLayoutEffect } from 'react';
import { 
  Home, Calendar, Users, Lightbulb, Briefcase, Target, 
  Settings, Shield, ChevronDown, ChevronRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MenuItem, GroupedMenuItems } from '@/types/navigation';

/**
 * NavigationSidebar - Fast overlay navigation with core menu items
 * Optimized for performance with minimal re-renders
 */

interface NavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavigationSidebar = memo(function NavigationSidebar({ open, onOpenChange }: NavigationSidebarProps) {
  console.log('🎯 SIDEBAR DEBUG: NavigationSidebar render', {
    timestamp: Date.now(),
    open,
    rerenderReason: 'Component re-rendered'
  });
  
  React.useEffect(() => {
    console.log('📱 SIDEBAR DEBUG: Open state changed', {
      timestamp: Date.now(),
      open,
      visibility: open ? 'OPENING' : 'CLOSING'
    });
    performance.mark(`sidebar-${open ? 'open' : 'close'}-effect`);
  }, [open]);
  
  useLayoutEffect(() => {
    console.log('🎯 SIDEBAR DEBUG: Layout effect - DOM measurements', {
      timestamp: Date.now(),
      open,
      windowWidth: window.innerWidth,
      scrollPosition: window.scrollY
    });
  }, [open]);
  
  const location = useLocation();
  const { isRTL, t } = useUnifiedTranslation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(['main'])); // Optimize initialization

  // Static menu items - optimized for performance
  const menuItems = useMemo(() => {
    // Only compute when translation function changes, not on every render
    return [
      // Main navigation - authenticated routes  
      { 
        id: 'dashboard', 
        label: t('nav.dashboard', 'Dashboard'), 
        arabicLabel: 'لوحة التحكم',
        icon: Home, 
        path: '/dashboard',
        group: 'main',
        roles: ['all'] 
      },
      { 
        id: 'challenges', 
        label: t('nav.challenges', 'Challenges'), 
        arabicLabel: 'التحديات',
        icon: Target, 
        path: '/challenges',
        group: 'main',
        roles: ['all'] 
      },
      { 
        id: 'events', 
        label: t('nav.events', 'Events'), 
        arabicLabel: 'الفعاليات',
        icon: Calendar, 
        path: '/events',
        group: 'main',
        roles: ['all'] 
      },
      { 
        id: 'ideas', 
        label: t('nav.ideas', 'Ideas'), 
        arabicLabel: 'الأفكار',
        icon: Lightbulb, 
        path: '/ideas',
        group: 'main',
        roles: ['all'] 
      },
      { 
        id: 'opportunities', 
        label: t('nav.opportunities', 'Opportunities'), 
        arabicLabel: 'الفرص',
        icon: Briefcase, 
        path: '/opportunities',
        group: 'main',
        roles: ['all'] 
      },
      { 
        id: 'collaboration', 
        label: t('nav.collaboration', 'Collaboration'), 
        arabicLabel: 'التعاون',
        icon: Users, 
        path: '/collaboration',
        group: 'workspace',
        roles: ['all'] 
      },
      { 
        id: 'admin-dashboard', 
        label: t('nav.admin_dashboard', 'Admin Dashboard'), 
        arabicLabel: 'لوحة التحكم الإدارية',
        icon: Shield, 
        path: '/admin/dashboard',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'settings', 
        label: t('nav.settings', 'Settings'), 
        arabicLabel: 'الإعدادات',
        icon: Settings, 
        path: '/settings',
        group: 'settings',
        roles: ['all'] 
      }
    ];
  }, [t]); // Only depend on translation function

  // Static group labels - no need to recompute
  const groupLabels = {
    main: { en: 'Explore', ar: 'استكشف' },
    workspace: { en: 'Workspace', ar: 'مساحة العمل' },
    admin: { en: 'Administration', ar: 'الإدارة' },
    settings: { en: 'Settings', ar: 'الإعدادات' }
  };

  // Pre-grouped items for performance
  const groupedItems = useMemo(() => {
    const groups: GroupedMenuItems = {
      main: menuItems.filter(item => item.group === 'main'),
      workspace: menuItems.filter(item => item.group === 'workspace'),
      admin: menuItems.filter(item => item.group === 'admin'),
      settings: menuItems.filter(item => item.group === 'settings')
    };
    return groups;
  }, [menuItems]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      return (
        <li key={item.id} className="mb-1">
          <NavLink 
            to={item.path}
            onClick={() => {
              console.log('🔗 SIDEBAR DEBUG: Navigation item clicked', {
                timestamp: Date.now(),
                item: item.id,
                path: item.path,
                action: 'Closing sidebar'
              });
              onOpenChange(false);
            }}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full duration-150", // Faster transition
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              isRTL && "flex-row-reverse text-right"
            )}
          >
            <item.icon className={cn("h-4 w-4", isRTL && "ml-3 mr-0")} />
            <span className="flex-1">
              {isRTL ? item.arabicLabel : item.label}
            </span>
            {item.badge && (
              <Badge variant="secondary" className={cn("ml-auto text-xs", isRTL && "ml-0 mr-auto")}>
                {item.badge}
              </Badge>
            )}
          </NavLink>
        </li>
      );
    });
  };

  const renderGroup = (groupKey: string, items: MenuItem[]) => {
    const isExpanded = expandedGroups.has(groupKey);
    const shouldCollapse = groupKey !== 'main'; // Keep main always expanded

    if (shouldCollapse) {
      return (
        <Collapsible key={groupKey} open={isExpanded} onOpenChange={() => toggleGroup(groupKey)}>
          <div className="mb-4">
            <CollapsibleTrigger className={cn(
              "flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground mb-2",
              isRTL && "text-right"
            )}>
              <span>{isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}</span>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-1">
                {renderMenuItems(items)}
              </ul>
            </CollapsibleContent>
          </div>
        </Collapsible>
      );
    }

    return (
      <div key={groupKey} className="mb-4">
        <h4 className={cn("text-xs font-medium text-muted-foreground mb-2", isRTL && 'text-right')}>
          {isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}
        </h4>
        <ul className="space-y-1">
          {renderMenuItems(items)}
        </ul>
      </div>
    );
  };

  // Define group order
  const groupOrder = ['main', 'workspace', 'admin', 'settings'];

  return (
    <Sheet 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log('📋 SIDEBAR DEBUG: Sheet onOpenChange triggered', {
          timestamp: Date.now(),
          newOpen,
          trigger: 'Sheet component'
        });
        onOpenChange(newOpen);
      }}
    >
      <SheetContent
        side={isRTL ? "right" : "left"}
        className={cn("w-80 p-0 border-0", isRTL && "text-right")}
        style={{ transition: 'transform 0.15s ease-out' }} // Faster transition
        onAnimationStart={() => {
          console.log('🎬 SIDEBAR DEBUG: Animation started', {
            timestamp: Date.now(),
            phase: 'opening'
          });
          performance.mark('sidebar-animation-start');
        }}
        onAnimationEnd={() => {
          console.log('🎬 SIDEBAR DEBUG: Animation ended', {
            timestamp: Date.now(),
            phase: 'opened'
          });
          performance.mark('sidebar-animation-end');
          try {
            performance.measure('sidebar-animation-duration', 'sidebar-animation-start', 'sidebar-animation-end');
            const measure = performance.getEntriesByName('sidebar-animation-duration')[0];
            console.log('⏱️ SIDEBAR DEBUG: Animation performance', {
              duration: measure.duration,
              startTime: measure.startTime
            });
          } catch (e) {
            console.log('⚠️ SIDEBAR DEBUG: Animation measurement failed', e);
          }
        }}
      >
        <SheetHeader className="p-4 sm:p-6 border-b">
          <SheetTitle className={cn("text-left text-sm sm:text-base", isRTL && "text-right")}>
            {t('nav.navigation_menu', 'Navigation Menu')}
          </SheetTitle>
        </SheetHeader>
        
        <div className="p-4 sm:p-6 overflow-y-auto h-full pb-safe-area-inset-bottom">
          {/* Render groups in priority order */}
          {groupOrder.map(groupKey => {
            const items = groupedItems[groupKey];
            if (!items || items.length === 0) return null;
            return renderGroup(groupKey, items);
          })}

          {/* Render remaining groups not in priority order */}
          {Object.entries(groupedItems).map(([groupKey, items]) => {
            if (groupOrder.includes(groupKey) || !items || items.length === 0) return null;
            return renderGroup(groupKey, items);
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
});

NavigationSidebar.displayName = 'NavigationSidebar';