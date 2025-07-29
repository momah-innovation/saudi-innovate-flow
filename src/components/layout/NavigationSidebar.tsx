import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Target, Lightbulb, Users, Calendar, TrendingUp,
  FileText, Settings, PieChart, Briefcase, Award, Zap,
  Shield, BookOpen, BarChart3, UserCheck, Network
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

/**
 * NavigationSidebar - Optimized sidebar navigation with role-based menu items
 * Features:
 * - Performance optimized with useMemo
 * - Role-based visibility
 * - RTL support
 * - Active state management
 * - Grouped menu items
 */
export function NavigationSidebar() {
  const { state } = useSidebar();
  const { userProfile, hasRole } = useAuth();
  const { isRTL, language } = useDirection();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoized menu items for performance - consolidated from all sidebars
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

    const workflowItems = [
      { 
        id: 'challenges', 
        label: 'Challenges', 
        arabicLabel: 'التحديات',
        icon: Target, 
        path: '/challenges',
        badge: 12,
        group: 'workflow',
        roles: ['innovator', 'all'] 
      },
      { 
        id: 'ideas', 
        label: 'Ideas', 
        arabicLabel: 'الأفكار',
        icon: Lightbulb, 
        path: '/ideas',
        badge: 3,
        group: 'workflow',
        roles: ['innovator', 'expert', 'all'] 
      },
      { 
        id: 'evaluations', 
        label: 'Evaluations', 
        arabicLabel: 'التقييمات',
        icon: UserCheck, 
        path: '/admin/evaluations',
        badge: 8,
        group: 'workflow',
        roles: ['expert', 'team', 'admin'] 
      },
      { 
        id: 'expertise', 
        label: 'Expertise Profile', 
        arabicLabel: 'ملف الخبرة',
        icon: BookOpen, 
        path: '/expertise',
        group: 'workflow',
        roles: ['expert'] 
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
        id: 'focus-questions', 
        label: 'Focus Questions', 
        arabicLabel: 'الأسئلة المحورية',
        icon: FileText, 
        path: '/admin/focus-questions',
        group: 'management',
        roles: ['admin'] 
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
      { 
        id: 'stakeholders', 
        label: 'Stakeholders', 
        arabicLabel: 'المعنيين',
        icon: Users, 
        path: '/admin/stakeholders',
        group: 'management',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'innovation-teams', 
        label: 'Core Innovation Team', 
        arabicLabel: 'فريق الابتكار الأساسي',
        icon: Zap, 
        path: '/innovation-teams',
        group: 'management',
        roles: ['admin'] 
      },
      { 
        id: 'team-management', 
        label: 'Team Management', 
        arabicLabel: 'إدارة الفرق',
        icon: Users, 
        path: '/team-management',
        group: 'management',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'team-workspace', 
        label: 'Team Workspace', 
        arabicLabel: 'مساحة عمل الفريق',
        icon: Users, 
        path: '/team-workspace',
        group: 'workflow',
        roles: ['team', 'admin', 'innovator', 'expert'] 
      },
    ];

    const analyticsItems = [
      { 
        id: 'analytics', 
        label: 'Analytics', 
        arabicLabel: 'التحليلات',
        icon: PieChart, 
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
      { 
        id: 'reports', 
        label: 'Reports', 
        arabicLabel: 'التقارير',
        icon: FileText, 
        path: '/reports',
        group: 'analytics',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'system-analytics', 
        label: 'System Analytics', 
        arabicLabel: 'تحليلات النظام',
        icon: BarChart3, 
        path: '/admin/system-analytics',
        group: 'analytics',
        roles: ['admin'] 
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
        id: 'sectors', 
        label: 'Sectors', 
        arabicLabel: 'القطاعات',
        icon: Shield, 
        path: '/admin/sectors',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'organizational-structure', 
        label: 'Organizational Structure', 
        arabicLabel: 'الهيكل التنظيمي',
        icon: Network, 
        path: '/admin/organizational-structure',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'expert-assignments', 
        label: 'Expert Assignments', 
        arabicLabel: 'تعيين الخبراء',
        icon: Award, 
        path: '/admin/expert-assignments',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'user-management', 
        label: 'User Management', 
        arabicLabel: 'إدارة المستخدمين',
        icon: UserCheck, 
        path: '/admin/users',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'system-settings', 
        label: 'System Settings', 
        arabicLabel: 'إعدادات النظام',
        icon: Settings, 
        path: '/admin/system-settings',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'system-documentation', 
        label: 'System Documentation', 
        arabicLabel: 'وثائق النظام',
        icon: BookOpen, 
        path: '/admin/system-documentation',
        group: 'admin',
        roles: ['all'] 
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

    return [...baseItems, ...workflowItems, ...managementItems, ...analyticsItems, ...adminItems, ...settingsItems];
  }, []);

  // Check if user can see a menu item - same logic as AppSidebar
  const canAccessItem = (item: any) => {
    if (item.roles.includes('all')) return true;
    
    if (!userProfile?.user_roles?.length) {
      return item.roles.includes('innovator');
    }
    
    const userRoles = [];
    if (userProfile?.innovator_profile) userRoles.push('innovator');
    if (userProfile?.expert_profile) userRoles.push('expert');
    if (hasRole('admin')) userRoles.push('admin');
    if (hasRole('super_admin')) userRoles.push('admin'); // super_admin should see admin items
    if (hasRole('team_member')) userRoles.push('team');
    
    return item.roles.some((role: string) => userRoles.includes(role));
  };

  // Get visible items grouped
  const visibleItems = useMemo(() => {
    const filtered = menuItems.filter(canAccessItem);
    return {
      main: filtered.filter(item => item.group === 'main'),
      workflow: filtered.filter(item => item.group === 'workflow'),
      management: filtered.filter(item => item.group === 'management'),
      analytics: filtered.filter(item => item.group === 'analytics'),
      admin: filtered.filter(item => item.group === 'admin'),
      settings: filtered.filter(item => item.group === 'settings'),
    };
  }, [menuItems, userProfile, hasRole]);

  // Check if current path matches item
  const isActive = (item: any) => {
    return location.pathname === item.path;
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Get localized label
  const getLabel = (item: any) => {
    return isRTL && language === 'ar' ? item.arabicLabel : item.label;
  };

  // Get localized group label
  const getGroupLabel = (key: string) => {
    const labels = {
      workflow: isRTL ? 'سير العمل' : 'Workflow',
      management: isRTL ? 'الإدارة' : 'Management',
      analytics: isRTL ? 'التحليلات' : 'Analytics',
      admin: isRTL ? 'الإدارة العامة' : 'Administration',
    };
    return labels[key as keyof typeof labels];
  };

  // Render menu group
  const renderGroup = (items: any[], groupKey?: string) => {
    if (!items.length) return null;

    return (
      <SidebarGroup key={groupKey}>
        {groupKey && (
          <SidebarGroupLabel className={cn(isRTL && 'text-right')}>
            {getGroupLabel(groupKey)}
          </SidebarGroupLabel>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      active && "bg-primary/10 text-primary font-medium",
                      isRTL && "flex-row-reverse",
                      "transition-colors hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {state !== "collapsed" && (
                      <>
                        <span className={cn(
                          "flex-1 truncate",
                          isRTL && "text-right"
                        )}>
                          {getLabel(item)}
                        </span>
                        {item.badge && (
                          <Badge variant="secondary" className={cn(
                            "bg-primary/10 text-primary text-xs",
                            isRTL ? "mr-auto" : "ml-auto"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar 
      className={cn(
        state === "collapsed" ? "w-16" : "w-60",
        isRTL && "border-l border-r-0"
      )} 
      collapsible="icon"
      side={isRTL ? "right" : "left"}
    >
      <SidebarContent className={cn(isRTL && "text-right")}>
        {renderGroup(visibleItems.main)}
        {renderGroup(visibleItems.workflow, 'workflow')}
        {renderGroup(visibleItems.management, 'management')}
        {renderGroup(visibleItems.analytics, 'analytics')}
        {renderGroup(visibleItems.admin, 'admin')}
        {renderGroup(visibleItems.settings)}
      </SidebarContent>
    </Sidebar>
  );
}