import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Target, Lightbulb, Users, Calendar, TrendingUp,
  FileText, Settings, PieChart, Briefcase, Award, Zap,
  Shield, BookOpen, BarChart3, UserCheck, Network, Search,
  PlusCircle, Star, HelpCircle, Globe, Edit, Bookmark,
  Database, HardDrive
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
      { 
        id: 'partner-profile', 
        label: 'Partner Profile', 
        arabicLabel: 'ملف الشريك',
        icon: Edit, 
        path: '/partner-profile',
        group: 'partners',
        roles: ['partner', 'admin'] 
      },
    ];

    const workflowItems = [
      // User Dashboards - grouped by role
      { 
        id: 'user-dashboard', 
        label: 'My Dashboard', 
        arabicLabel: 'لوحة التحكم الشخصية',
        icon: Home, 
        path: '/dashboard',
        group: 'personal',
        roles: ['innovator', 'stakeholder'] 
      },
      { 
        id: 'expert-dashboard', 
        label: 'Expert Dashboard', 
        arabicLabel: 'لوحة تحكم الخبير',
        icon: Star, 
        path: '/expert-dashboard',
        badge: 8,
        group: 'personal',
        roles: ['expert', 'admin'] 
      },
      { 
        id: 'stakeholder-dashboard', 
        label: 'Stakeholder Dashboard', 
        arabicLabel: 'لوحة تحكم المعني',
        icon: Users, 
        path: '/stakeholder-dashboard',
        group: 'personal',
        roles: ['stakeholder', 'admin'] 
      },
      
      // Core workflow items
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
      
      // Profile management - moved to personal group
      { 
        id: 'user-profile', 
        label: 'My Profile', 
        arabicLabel: 'ملفي الشخصي',
        icon: Edit, 
        path: '/profile',
        group: 'personal',
        roles: ['all'] 
      },
      { 
        id: 'expert-profile', 
        label: 'Expert Profile', 
        arabicLabel: 'ملف الخبير',
        icon: Edit, 
        path: '/expert-profile',
        group: 'personal',
        roles: ['expert'] 
      },
      
      // Event participation
      { 
        id: 'event-registration', 
        label: 'Event Registration', 
        arabicLabel: 'تسجيل الفعاليات',
        icon: Award, 
        path: '/event-registration',
        group: 'workflow',
        roles: ['all'] 
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
        id: 'evaluations-management', 
        label: 'Evaluation System', 
        arabicLabel: 'نظام التقييم',
        icon: FileText, 
        path: '/admin/evaluation-management',
        group: 'management',
        roles: ['admin'] 
      },
      { 
        id: 'opportunities-management', 
        label: 'Partnership Opportunities', 
        arabicLabel: 'إدارة فرص الشراكة',
        icon: Briefcase, 
        path: '/admin/opportunities',
        group: 'management',
        roles: ['admin'] 
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
         id: 'admin-dashboard', 
         label: 'Admin Dashboard', 
         arabicLabel: 'لوحة الإدارة',
         icon: BarChart3, 
         path: '/admin/dashboard',
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
         id: 'storage-policies', 
         label: 'Storage Policies', 
         arabicLabel: 'سياسات التخزين',
         icon: HardDrive, 
         path: '/admin/storage/policies',
         group: 'admin',
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
    ];

    return [...baseItems, ...discoverItems, ...partnerItems, ...workflowItems, ...managementItems, ...analyticsItems, ...adminItems, ...settingsItems];
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
    if (userProfile?.partner_profile) userRoles.push('partner');
    if (userProfile?.stakeholder_profile) userRoles.push('stakeholder');
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
      discover: filtered.filter(item => item.group === 'discover'),
      personal: filtered.filter(item => item.group === 'personal'),
      partners: filtered.filter(item => item.group === 'partners'),
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
      discover: isRTL ? 'استكشاف' : 'Discover',
      personal: isRTL ? 'الحساب الشخصي' : 'Personal',
      partners: isRTL ? 'الشراكات' : 'Partnerships',
      workflow: isRTL ? 'سير العمل' : 'Workflow',
      management: isRTL ? 'الإدارة' : 'Management',
      analytics: isRTL ? 'التحليلات' : 'Analytics',
      admin: isRTL ? 'الإدارة العامة' : 'Administration',
      settings: isRTL ? 'الإعدادات' : 'Settings',
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
        {renderGroup(visibleItems.discover, 'discover')}
        {renderGroup(visibleItems.personal, 'personal')}
        {renderGroup(visibleItems.partners, 'partners')}
        {renderGroup(visibleItems.workflow, 'workflow')}
        {renderGroup(visibleItems.management, 'management')}
        {renderGroup(visibleItems.analytics, 'analytics')}
        {renderGroup(visibleItems.admin, 'admin')}
        {renderGroup(visibleItems.settings, 'settings')}
      </SidebarContent>
    </Sidebar>
  );
}