/**
 * Enhanced Navigation Sidebar
 * Comprehensive sidebar with RBAC, RTL/LTR, mobile support, animations, tooltips, and full feature set
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { debugLog } from '@/utils/debugLogger';
import { useNavigationCache } from '@/hooks/useOptimizedDashboardStats';
import { Search, X, ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useTheme } from '@/components/ui/theme-provider';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedNavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnhancedNavigationSidebar = React.memo(function EnhancedNavigationSidebar({ open, onOpenChange }: EnhancedNavigationSidebarProps) {
  // Use individual hooks instead of useAppContext to avoid state conflicts
  const { userProfile } = useAuth();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Direct navigation - no debouncing needed
  const directNavigate = navigate;
  const { data: navigationCache } = useNavigationCache(user?.id);
  
  // Get user roles robustly with comprehensive fallback system
  const userRoles = React.useMemo(() => {
    if (!user) return ['user'];
    
    // Try multiple sources for roles with comprehensive fallbacks
    const sources = [
      (userProfile as any)?.roles as string[] | undefined,
      (userProfile as any)?.user_roles?.map((ur: any) => ur.role) as string[] | undefined,
      (user as any)?.user_metadata?.roles as string[] | undefined,
      // Check auth.user.app_metadata as well (common Supabase pattern)
      (user as any)?.app_metadata?.roles as string[] | undefined,
      // Try raw role field
      userProfile?.user_roles?.filter(ur => ur.is_active).map(ur => ur.role),
      // Always fallback to 'user' if nothing found
      ['user']
    ];
    
    const merged = sources.find(roles => Array.isArray(roles) && roles.length > 0) || ['user'];
    debugLog.log('🔍 Sidebar roles resolved:', { roles: Array.from(new Set(merged)) });
    return Array.from(new Set(merged));
  }, [userProfile, user]);
  
  // State management with navigation cache restoration
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // OPTIMIZED: Restore sidebar state from cache
  useEffect(() => {
    if (navigationCache?.sidebar_open !== undefined) {
      onOpenChange(navigationCache.sidebar_open);
    }
  }, [navigationCache, onOpenChange]);

  // Navigation handler with direct navigate
  const handleNavigation = useCallback((path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    directNavigate(path);
    
    // Close mobile sidebar on navigation
    if (window.innerWidth < 768) {
      onOpenChange(false);
      setIsMobileMenuOpen(false);
    }
  }, [directNavigate, onOpenChange]);
  
  // OPTIMIZED: State management for navigation groups
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set([MENU_GROUPS.MAIN, MENU_GROUPS.INNOVATION])
  );
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

  // Filter menu items by user roles with debug logging
  const filteredMenuItems = useMemo(() => {
    const filtered = filterMenuItemsByRoles(NAVIGATION_ITEMS, userRoles);
    debugLog.log('📋 Menu items filtered:', { 
      totalItems: NAVIGATION_ITEMS.length, 
      filteredItems: filtered.length, 
      userRoles, 
      filtered: filtered.map(i => i.id) 
    });
    
    // Always ensure at least basic navigation is available
    if (filtered.length === 0) {
      debugLog.warn('⚠️ No menu items available, providing fallback navigation');
      return NAVIGATION_ITEMS.filter(item => 
        ['dashboard', 'workspace-user', 'settings'].includes(item.id)
      );
    }
    
    return filtered;
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
        item.path.toLowerCase().includes(query) ||
        (item.description && t(item.description).toLowerCase().includes(query)) ||
        (item.descriptionAr && item.descriptionAr.toLowerCase().includes(query))
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

  // Get tooltip content for menu item
  const getTooltipContent = useCallback((item: MenuItem) => {
    const description = item.description ? t(item.description) : (isRTL ? item.descriptionAr : '') || t(item.label);
    return description;
  }, [t, isRTL]);

  // Render menu item with tooltip and enhanced animations
  const renderMenuItem = useCallback((item: MenuItem, index: number = 0) => {
    const isActive = isActiveItem(item);
    const Icon = item.icon;
    const tooltipContent = getTooltipContent(item);
    
    return (
      <TooltipProvider key={item.id} delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => handleNavigation(item.path, e)}
              className={cn(
                'w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500',
                'hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground',
                'hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
                'group relative overflow-hidden animate-fade-in',
                'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent',
                'before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]',
                isActive && 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]',
                isRTL && 'flex-row-reverse text-right'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Enhanced active indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-xl pointer-events-none animate-pulse" />
              )}
              
              <div className={cn(
                'p-2 rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10',
                'group-hover:shadow-lg group-hover:shadow-primary/20',
                isActive 
                  ? 'bg-primary-foreground/20 text-primary-foreground shadow-inner' 
                  : 'bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 group-hover:shadow-md'
              )}>
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </div>
              
              <span className={cn(
                'font-medium truncate flex-1 relative z-10 transition-all duration-500',
                'group-hover:translate-x-2 group-hover:font-semibold',
                isRTL && 'group-hover:-translate-x-2'
              )}>
                {t(item.label)}
              </span>
              
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'h-5 min-w-[20px] px-1.5 text-xs relative z-10 transition-all duration-500',
                    'group-hover:scale-110 group-hover:shadow-md animate-pulse',
                    isActive && 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              
              {/* Hover glow effect */}
              <div className={cn(
                'absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5',
                'opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                isActive && 'opacity-0'
              )} />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side={isRTL ? "left" : "right"} 
            className={cn(
              "max-w-xs text-sm font-medium animate-scale-in",
              "bg-gradient-to-br from-background via-background to-muted/50",
              "border-2 gradient-border shadow-xl backdrop-blur-sm"
            )}
            sideOffset={12}
          >
            <div className="space-y-2">
              <p className="font-semibold text-primary">{t(item.label)}</p>
              {tooltipContent !== t(item.label) && (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {tooltipContent}
                </p>
              )}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <p className="text-xs text-muted-foreground/80">
                {t('nav.click_to_navigate', 'Click to navigate')}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, [t, isRTL, handleNavigation, isActiveItem, getTooltipContent]);

  // Render group section with enhanced styling
  const renderGroup = useCallback((groupId: string, items: MenuItem[]) => {
    const isOpen = openGroups.has(groupId);
    const groupLabel = GROUP_LABELS[groupId];
    const hasActiveItem = items.some(item => isActiveItem(item));
    
    return (
      <div key={groupId} className="space-y-2">
        <Collapsible open={isOpen} onOpenChange={() => toggleGroup(groupId)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between px-3 py-2.5 h-auto font-semibold text-sm rounded-xl',
                'hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground',
                'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
                'data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground',
                'group relative overflow-hidden',
                hasActiveItem && 'text-primary bg-primary/10',
                isRTL && 'flex-row-reverse'
              )}
            >
              {/* Gradient accent */}
              <div className={cn(
                'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50 transition-all duration-300',
                'opacity-0 group-hover:opacity-100',
                hasActiveItem && 'opacity-100',
                isRTL && 'left-auto right-0'
              )} />
              
              <span className="truncate relative z-10 transition-all duration-300 group-hover:translate-x-1">
                {t(`nav.group.${groupLabel?.en?.toLowerCase()?.replace(/\s+/g, '_')?.replace(/&/g, '')}`, groupLabel?.en || groupId)}
              </span>
              
              <div className={cn(
                'transition-all duration-300 relative z-10',
                isOpen && 'rotate-180'
              )}>
                <ChevronDown className="h-4 w-4 shrink-0" />
              </div>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-1 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className={cn('pl-2 space-y-1', isRTL && 'pr-2 pl-0')}>
              {items.map((item, index) => renderMenuItem(item, index))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {Object.keys(searchFilteredItems).indexOf(groupId) < Object.keys(searchFilteredItems).length - 1 && (
          <Separator className="my-3 bg-gradient-to-r from-transparent via-border to-transparent" />
        )}
      </div>
    );
  }, [openGroups, toggleGroup, t, isRTL, isActiveItem, renderMenuItem, searchFilteredItems]);

  // Memoize sidebar content to prevent unnecessary re-renders
  const sidebarContent = React.useMemo(() => (
    <>
      {/* Overlay for mobile */}
      {open && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar panel */}
      <div
        className={cn(
          'fixed top-0 h-full bg-gradient-to-b from-background via-background/95 to-background',
          'border-r shadow-2xl flex flex-col overflow-hidden z-50',
          'backdrop-blur-xl transition-all duration-300 ease-out',
          isRTL ? 'right-0' : 'left-0',
          'w-80 max-w-[85vw] lg:w-72',
          // Enhanced visibility toggle with smooth animations
          open ? 'translate-x-0 opacity-100' : (isRTL ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'),
          'will-change-[transform,opacity]'
        )}
      >
        {/* Enhanced Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b',
          'bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 backdrop-blur-sm',
          isRTL && 'flex-row-reverse'
        )}>
          <div className={cn(
            'flex items-center gap-3',
            isRTL && 'flex-row-reverse'
          )}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
              <Menu className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {t('nav.navigation_menu', 'Navigation Menu')}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0 hover:bg-accent/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Enhanced Search */}
        <div className="p-4 border-b bg-muted/20">
          <div className="relative group">
            <Search className={cn(
              'absolute top-2.5 h-4 w-4 text-muted-foreground transition-colors duration-200',
              'group-focus-within:text-primary',
              isRTL ? 'right-3' : 'left-3'
            )} />
            <Input
              placeholder={t('common.search_placeholder', 'Search navigation...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'bg-background/50 backdrop-blur-sm border-0 ring-1 ring-border/50',
                'focus:ring-2 focus:ring-primary/50 transition-all duration-200',
                'hover:ring-border/80',
                isRTL ? 'pr-9 text-right' : 'pl-9'
              )}
            />
          </div>
        </div>
        
        {/* Enhanced User info */}
        {user && (
          <div className={cn(
            'p-4 border-b bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30',
            'flex items-center gap-3 backdrop-blur-sm',
            isRTL && 'flex-row-reverse text-right'
          )}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-sm font-bold text-primary">
                {userProfile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {userProfile?.name || user.email}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {userRoles.slice(0, 2).map((role, index) => (
                  <Badge key={role} variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                    {role}
                  </Badge>
                ))}
                {userRoles.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                    +{userRoles.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Navigation Menu */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-3">
            {Object.entries(searchFilteredItems).length > 0 ? (
              Object.entries(searchFilteredItems).map(([groupId, items], groupIndex) =>
                <div 
                  key={groupId}
                  className="animate-fade-in"
                  style={{ animationDelay: `${groupIndex * 100}ms` }}
                >
                  {renderGroup(groupId, items)}
                </div>
              )
            ) : searchQuery ? (
              <div className="text-center py-12 text-muted-foreground animate-fade-in">
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 w-fit mx-auto mb-4 hover-scale">
                  <Search className="h-8 w-8 mx-auto animate-pulse" />
                </div>
                <p className="text-sm font-medium">
                  {t('common.no_results_found', 'No results found')}
                </p>
                <p className="text-xs mt-1">
                  {t('common.try_different_search', 'Try a different search term')}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground animate-fade-in">
                <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 w-fit mx-auto mb-4 hover-scale">
                  <Menu className="h-8 w-8 mx-auto animate-pulse" />
                </div>
                <p className="text-sm font-medium mb-2">Navigation Loading...</p>
                <p className="text-xs space-y-1">
                  <span className="block">User: {user?.email || 'None'}</span>
                  <span className="block">Roles: {userRoles.join(', ') || 'None'}</span>
                  <span className="block">Items: {filteredMenuItems.length}</span>
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Enhanced Footer */}
        <div className="p-4 border-t text-center bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
          <p className="text-xs text-muted-foreground font-medium">
            {t('system.title', 'Innovation System')} v2.0
          </p>
          <div className="mt-1 h-0.5 w-12 mx-auto bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-full" />
        </div>
      </div>
    </>
  ), [open, isMobile, handleOverlayClick, isRTL, t, user, userProfile, userRoles, searchQuery, searchFilteredItems, renderGroup, filteredMenuItems]);

  return createPortal(sidebarContent, document.body);
});