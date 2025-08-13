/**
 * Enhanced Navigation Sidebar
 * Comprehensive sidebar with RBAC, RTL/LTR, mobile support, animations, and full feature set
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/hooks/useAppContext';
import { 
  NAVIGATION_ITEMS, 
  GROUP_LABELS, 
  MENU_GROUPS,
  getMenuItemsByGroup,
  filterMenuItemsByRoles 
} from '@/config/navigation-menu';
import { MenuItem } from '@/types/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnhancedNavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedNavigationSidebar({ open, onOpenChange }: EnhancedNavigationSidebarProps) {
  const {
    userRoles,
    isRTL,
    t,
    theme,
    user,
    userProfile
  } = useAppContext();
  
  const location = useLocation();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set([MENU_GROUPS.MAIN]));
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter menu items by user roles
  const filteredMenuItems = useMemo(() => {
    return filterMenuItemsByRoles(NAVIGATION_ITEMS, userRoles);
  }, [userRoles]);

  // Group filtered menu items
  const groupedMenuItems = useMemo(() => {
    return getMenuItemsByGroup(filteredMenuItems);
  }, [filteredMenuItems]);

  // Filter items by search query
  const searchFilteredItems = useMemo(() => {
    if (!searchQuery.trim()) return groupedMenuItems;
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, MenuItem[]> = {};
    
    Object.entries(groupedMenuItems).forEach(([group, items]) => {
      const matchingItems = items.filter(item => 
        t(item.label).toLowerCase().includes(query) ||
        item.arabicLabel.toLowerCase().includes(query) ||
        item.path.toLowerCase().includes(query)
      );
      
      if (matchingItems.length > 0) {
        filtered[group] = matchingItems;
      }
    });
    
    return filtered;
  }, [groupedMenuItems, searchQuery, t]);

  // Toggle group expansion
  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  // Close sidebar on mobile when navigating
  const handleItemClick = useCallback(() => {
    if (isMobile) {
      onOpenChange(false);
    }
  }, [isMobile, onOpenChange]);

  // Close sidebar when clicking overlay
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  // Check if menu item is active
  const isActiveItem = useCallback((item: MenuItem) => {
    return location.pathname === item.path;
  }, [location.pathname]);

  // Render menu item
  const renderMenuItem = useCallback((item: MenuItem) => {
    const isActive = isActiveItem(item);
    const Icon = item.icon;
    
    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={handleItemClick}
        className={({ isActive: navIsActive }) => cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          (navIsActive || isActive) && 'bg-primary text-primary-foreground shadow-sm',
          isRTL && 'flex-row-reverse text-right'
        )}
      >
        <Icon className={cn(
          'h-5 w-5 shrink-0 transition-colors',
          (isActive) && 'text-primary-foreground'
        )} />
        
        <span className="font-medium truncate flex-1">
          {t(item.label)}
        </span>
        
        {item.badge && item.badge > 0 && (
          <Badge 
            variant="secondary" 
            className={cn(
              'h-5 min-w-[20px] px-1.5 text-xs',
              isActive && 'bg-primary-foreground/20 text-primary-foreground'
            )}
          >
            {item.badge}
          </Badge>
        )}
      </NavLink>
    );
  }, [t, isRTL, handleItemClick, isActiveItem]);

  // Render group section
  const renderGroup = useCallback((groupId: string, items: MenuItem[]) => {
    const isOpen = openGroups.has(groupId);
    const groupLabel = GROUP_LABELS[groupId];
    const hasActiveItem = items.some(item => isActiveItem(item));
    
    return (
      <div key={groupId} className="space-y-1">
        <Collapsible open={isOpen} onOpenChange={() => toggleGroup(groupId)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between px-3 py-2 h-auto font-medium text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
                hasActiveItem && 'text-primary',
                isRTL && 'flex-row-reverse'
              )}
            >
              <span className="truncate">
                {t(groupLabel?.en || groupId)}
              </span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className={cn(
                  'h-4 w-4 shrink-0',
                  isRTL && 'rotate-180'
                )} />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-1 animate-accordion-down">
            <div className={cn('pl-3 space-y-1', isRTL && 'pr-3 pl-0')}>
              {items.map(renderMenuItem)}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {Object.keys(searchFilteredItems).indexOf(groupId) < Object.keys(searchFilteredItems).length - 1 && (
          <Separator className="my-2" />
        )}
      </div>
    );
  }, [openGroups, toggleGroup, t, isRTL, isActiveItem, renderMenuItem, searchFilteredItems]);

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Overlay for mobile */}
      {open && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar panel */}
      <div
        className={cn(
          'fixed top-0 h-full bg-background border-r shadow-lg z-50 transform transition-all duration-300 ease-in-out',
          'flex flex-col overflow-hidden',
          // Positioning and width
          open ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full',
          isRTL ? 'right-0' : 'left-0',
          'w-80 max-w-[80vw]',
          // Mobile adjustments
          'lg:w-72'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b bg-muted/50',
          isRTL && 'flex-row-reverse'
        )}>
          <div className={cn(
            'flex items-center gap-3',
            isRTL && 'flex-row-reverse'
          )}>
            <Menu className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">
              {t('nav.navigation_menu', 'Navigation Menu')}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className={cn(
              'absolute top-2.5 h-4 w-4 text-muted-foreground',
              isRTL ? 'right-3' : 'left-3'
            )} />
            <Input
              placeholder={t('search_placeholder', 'Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'bg-background',
                isRTL ? 'pr-9 text-right' : 'pl-9'
              )}
            />
          </div>
        </div>
        
        {/* User info */}
        {user && (
          <div className={cn(
            'p-4 border-b bg-muted/30',
            'flex items-center gap-3',
            isRTL && 'flex-row-reverse text-right'
          )}>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {userProfile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile?.name || user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userRoles.join(', ') || 'User'}
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-2">
            {Object.entries(searchFilteredItems).map(([groupId, items]) =>
              renderGroup(groupId, items)
            )}
            
            {Object.keys(searchFilteredItems).length === 0 && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">
                  {t('no_results_found', 'No results found')}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            {t('system_title', 'Innovation System')} v1.0
          </p>
        </div>
      </div>
    </>
  );

  return createPortal(sidebarContent, document.body);
}