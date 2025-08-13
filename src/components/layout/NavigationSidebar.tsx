import React, { useMemo, memo, useState, useLayoutEffect } from 'react';
import { 
  Home, Calendar, Users, Lightbulb, Briefcase, Target, 
  Settings, Shield, ChevronDown, ChevronRight
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Badge } from '@/components/ui/badge';
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
  console.log('NavigationSidebar render', { open });
  
  React.useEffect(() => {
    console.log('NavigationSidebar open state changed', { open });
  }, [open]);
  
  useLayoutEffect(() => {
    // Layout effect - DOM measurements (debug removed to prevent re-renders)
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
              // Navigation item clicked (debug removed to prevent re-renders)
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
              "flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground mb-2 p-0 border-0 bg-transparent cursor-pointer",
              isRTL && "text-right"
            )}>
              <span>{isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}</span>
              <span className="h-4 w-4 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </span>
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

  // Add console log to track rendering
  console.log('NavigationSidebar render', { open });
  
  return (
    <>
      {/* Visibility Test - Simple red box that should always be visible when open */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
          zIndex: 10000,
          border: '3px solid black'
        }}>
          TEST
        </div>
      )}
      
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => {
            console.log('Overlay clicked, closing sidebar');
            onOpenChange(false);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 h-screen w-80 shadow-2xl transition-transform duration-300 ease-out",
          isRTL ? "right-0" : "left-0",
          isRTL && "text-right"
        )}
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: isRTL ? 'auto' : 0,
          right: isRTL ? 0 : 'auto',
          width: '320px',
          height: '100vh',
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          transform: open 
            ? 'translateX(0px)' 
            : isRTL 
              ? 'translateX(100%)' 
              : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out'
        }}
        onTransitionEnd={() => {
          console.log('Sidebar transition ended, open:', open);
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <h2 className={cn("text-left text-sm sm:text-base font-semibold", isRTL && "text-right")}>
            {t('nav.navigation_menu', 'Navigation Menu')}
          </h2>
        </div>
        
        {/* Content */}
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
      </div>
    </>
  );
});

NavigationSidebar.displayName = 'NavigationSidebar';