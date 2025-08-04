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
  SidebarMenuItem, useSidebar, SidebarRail
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/hooks/useAuth';
// import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/**
 * NavigationSidebar - Optimized sidebar navigation with role-based menu items
 * Now includes new tag management and file system pages with organized grouping
 */

export function NavigationSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isRTL } = useTranslation();
  // const { user } = useAuth();
  // const { profile: userProfile } = useProfile();
  const userProfile = null; // Simplified for now
  const [isOldLinksOpen, setIsOldLinksOpen] = React.useState(false);

  // Memoized menu items for performance - reorganized with new pages
  const menuItems = useMemo(() => {
    const baseItems = [
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        arabicLabel: 'لوحة التحكم',
        icon: Home, 
        path: '/',
        group: 'main',
        roles: ['all'] 
      },
    ];

    const discoverItems = [
      { 
        id: 'challenges-browse', 
        label: 'Browse Challenges', 
        arabicLabel: 'استكشاف التحديات',
        icon: Search, 
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
        id: 'public-statistics', 
        label: 'Statistics', 
        arabicLabel: 'الإحصائيات',
        icon: BarChart3, 
        path: '/statistics',
        group: 'discover',
        roles: ['admin'] 
      },
    ];

    const partnerItems = [
      { 
        id: 'partner-dashboard', 
        label: 'Partner Dashboard', 
        arabicLabel: 'لوحة تحكم الشريك',
        icon: Briefcase, 
        path: '/partner-dashboard',
        group: 'partners',
        roles: ['partner', 'admin'] 
      },
      { 
        id: 'opportunities', 
        label: 'Partnership Opportunities', 
        arabicLabel: 'فرص الشراكة',
        icon: Target, 
        path: '/opportunities',
        group: 'partners',
        roles: ['all'] 
      },
    ];

    const workflowItems = [
      { 
        id: 'ideas', 
        label: 'My Ideas', 
        arabicLabel: 'أفكاري',
        icon: Lightbulb, 
        path: '/ideas',
        badge: 3,
        group: 'workflow',
        roles: ['innovator', 'expert', 'all'] 
      },
      { 
        id: 'saved-items', 
        label: 'Saved Items', 
        arabicLabel: 'العناصر المحفوظة',
        icon: Bookmark, 
        path: '/saved',
        group: 'workflow',
        roles: ['all'] 
      },
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

    const managementItems = [
      { 
        id: 'campaigns', 
        label: 'Campaigns', 
        arabicLabel: 'الحملات',
        icon: Calendar, 
        path: '/admin/campaigns',
        badge: 3,
        group: 'management',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'admin-challenges', 
        label: 'Challenge Management', 
        arabicLabel: 'إدارة التحديات',
        icon: Target, 
        path: '/admin/challenges',
        badge: 5,
        group: 'management',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'events', 
        label: 'Events', 
        arabicLabel: 'الفعاليات',
        icon: Award, 
        path: '/admin/events',
        badge: 2,
        group: 'management',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'ideas-management', 
        label: 'Ideas Management', 
        arabicLabel: 'إدارة الأفكار',
        icon: Lightbulb, 
        path: '/admin/ideas',
        group: 'management',
        roles: ['team', 'admin'] 
      },
    ];

    const analyticsItems = [
      { 
        id: 'analytics', 
        label: 'Analytics', 
        arabicLabel: 'التحليلات',
        icon: BarChart3, 
        path: '/analytics',
        group: 'analytics',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'trends', 
        label: 'Trends & Insights', 
        arabicLabel: 'الاتجاهات والرؤى',
        icon: TrendingUp, 
        path: '/trends',
        group: 'analytics',
        roles: ['team', 'admin'] 
      },
    ];

    const adminItems = [
      { 
        id: 'partners', 
        label: 'Partners', 
        arabicLabel: 'الشركاء',
        icon: Briefcase, 
        path: '/admin/partners',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'storage-management', 
        label: 'Storage Management', 
        arabicLabel: 'إدارة التخزين',
        icon: Database, 
        path: '/admin/storage',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'tag-management', 
        label: 'Tag Management', 
        arabicLabel: 'إدارة العلامات',
        icon: Tag, 
        path: '/admin/tags',
        group: 'admin',
        roles: ['admin', 'team'] 
      },
      { 
        id: 'admin-relationships', 
        label: 'Relationships', 
        arabicLabel: 'العلاقات',
        icon: Network, 
        path: '/admin/relationships',
        group: 'admin',
        roles: ['admin'] 
      },
    ];

    // New dedicated system pages
    const systemItems = [
      { 
        id: 'file-uploader-demo', 
        label: 'File Upload System', 
        arabicLabel: 'نظام رفع الملفات',
        icon: Upload, 
        path: '/admin/file-uploader',
        group: 'system',
        roles: ['admin', 'team'] 
      },
      { 
        id: 'team-management', 
        label: 'Team Management', 
        arabicLabel: 'إدارة الفريق',
        icon: Users, 
        path: '/team-management',
        group: 'system',
        roles: ['admin', 'team'] 
      },
      { 
        id: 'profile-management', 
        label: 'Profile Management', 
        arabicLabel: 'إدارة الملفات الشخصية',
        icon: Edit, 
        path: '/profile-management',
        group: 'system',
        roles: ['admin'] 
      },
      { 
        id: 'user-management', 
        label: 'User Management', 
        arabicLabel: 'إدارة المستخدمين',
        icon: UserCheck, 
        path: '/user-management',
        group: 'system',
        roles: ['admin'] 
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
      { 
        id: 'help', 
        label: 'Help & Documentation', 
        arabicLabel: 'المساعدة والوثائق',
        icon: HelpCircle, 
        path: '/help',
        group: 'settings',
        roles: ['all'] 
      },
      { 
        id: 'design-system', 
        label: 'Design System', 
        arabicLabel: 'نظام التصميم',
        icon: Palette, 
        path: '/design-system',
        group: 'settings',
        roles: ['admin'] 
      },
    ];

    // Old/Legacy links that will be moved to collapsible section
    const oldItems = [
      { 
        id: 'old-admin-dashboard', 
        label: 'Legacy Admin Dashboard', 
        arabicLabel: 'لوحة التحكم الإدارية القديمة',
        icon: Archive, 
        path: '/admin-dashboard',
        group: 'old',
        roles: ['admin'] 
      },
      { 
        id: 'old-relationships', 
        label: 'Legacy Relationships View', 
        arabicLabel: 'عرض العلاقات القديم',
        icon: Archive, 
        path: '/relationships',
        group: 'old',
        roles: ['admin'] 
      },
    ];

    return [...baseItems, ...discoverItems, ...partnerItems, ...workflowItems, ...managementItems, ...analyticsItems, ...adminItems, ...systemItems, ...settingsItems, ...oldItems];
  }, []);

  // Check if user can see a menu item
  const canAccessItem = (item: any) => {
    if (item.roles.includes('all')) return true;
    
    if (!userProfile?.user_roles?.length) {
      return item.roles.includes('innovator');
    }
    
    const userRoles = userProfile.user_roles.map((role: any) => role.role);
    return item.roles.some((role: string) => userRoles.includes(role));
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
  }, [menuItems, userProfile]);

  // Group labels with translations
  const groupLabels: Record<string, { en: string; ar: string }> = {
    main: { en: 'Dashboard', ar: 'لوحة التحكم' },
    discover: { en: 'Discover', ar: 'استكشاف' },
    personal: { en: 'Personal', ar: 'شخصي' },
    workflow: { en: 'Workflow', ar: 'سير العمل' },
    partners: { en: 'Partners', ar: 'الشركاء' },
    management: { en: 'Management', ar: 'الإدارة' },
    analytics: { en: 'Analytics', ar: 'التحليلات' },
    admin: { en: 'Administration', ar: 'الإدارة العامة' },
    system: { en: 'System Management', ar: 'إدارة النظام' },
    settings: { en: 'Settings', ar: 'الإعدادات' },
    old: { en: 'Legacy Links', ar: 'الروابط القديمة' }
  };

  // Priority order for groups
  const groupOrder = ['main', 'discover', 'personal', 'workflow', 'partners', 'management', 'analytics', 'admin', 'system', 'settings'];

  const renderMenuItems = (items: any[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton 
            asChild 
            className={cn(
              "w-full justify-start",
              isActive && "bg-primary text-primary-foreground",
              isRTL && "flex-row-reverse"
            )}
          >
            <NavLink 
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
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
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  const renderGroup = (groupKey: string, items: any[]) => {
    if (groupKey === 'old') {
      return (
        <Collapsible key={groupKey} open={isOldLinksOpen} onOpenChange={setIsOldLinksOpen}>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className={cn(
                "flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground",
                isRTL && "text-right"
              )}>
                <span>{isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  {isOldLinksOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(items)}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    }

    return (
      <SidebarGroup key={groupKey}>
        <SidebarGroupLabel className={cn(isRTL && 'text-right')}>
          {isRTL ? groupLabels[groupKey]?.ar : groupLabels[groupKey]?.en}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenuItems(items)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar 
      variant="sidebar"
      side={isRTL ? "right" : "left"}
      className={cn(
        "border-r",
        isRTL && "border-l border-r-0"
      )}
    >
      <SidebarContent className={cn(isRTL && "text-right")}>
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

        {/* Always render old links section at the bottom */}
        {groupedItems.old && groupedItems.old.length > 0 && renderGroup('old', groupedItems.old)}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}