import React, { useMemo } from 'react';
import { 
  Home, Search, Calendar, BarChart3, Users, Lightbulb, Bookmark, UserCheck, 
  Edit, Award, FileText, Building, Database, HardDrive, Briefcase, Target, 
  Star, Activity, MessageSquare, TrendingUp, Settings, HelpCircle, Palette, 
  BookOpen, Network, DollarSign, Shield, Zap, Brain, Archive, Tag, Upload,
  ChevronDown, ChevronRight, User, GraduationCap, Handshake
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/hooks/useAuth';
// import { useProfile } from '@/hooks/useProfile';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { useSidebarPersistence } from '@/contexts/SidebarContext';
import { MenuItem, UserProfile, GroupLabels, GroupedMenuItems } from '@/types/navigation';

/**
 * NavigationSidebar - Overlay navigation with role-based menu items
 * Now includes new tag management and file system pages with organized grouping
 */

interface NavigationSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavigationSidebar({ open, onOpenChange }: NavigationSidebarProps) {
  const location = useLocation();
  const { isRTL, t } = useUnifiedTranslation();
  // const { user } = useAuth();
  // const { profile: userProfile } = useProfile();
  const userProfile = null; // Simplified for now
  const [isOldLinksOpen, setIsOldLinksOpen] = React.useState(false);

  const menuItems = useMemo(() => {
    const baseItems = [
      { 
        id: 'dashboard', 
        label: t('nav.dashboard', 'Dashboard'), 
        arabicLabel: t('nav.dashboard', 'لوحة التحكم'),
        icon: Home, 
        path: '/dashboard',
        group: 'main',
        roles: ['all'] 
      },
    ];

    const discoverItems = [
      { 
        id: 'challenges-basic', 
        label: t('nav.challenges_basic', 'Challenges (Basic)'), 
        arabicLabel: t('nav.challenges_basic', 'التحديات (أساسي)'),
        icon: Target, 
        path: '/challenges',
        badge: 12,
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'challenges-browse', 
        label: t('nav.challenges_browse', 'Challenges (Advanced)'), 
        arabicLabel: t('nav.challenges_browse', 'التحديات (متقدم)'),
        icon: Target, 
        path: '/challenges-browse',
        badge: 25,
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'events-browse', 
        label: t('nav.browse_events', 'Browse Events'), 
        arabicLabel: t('nav.browse_events', 'استكشاف الفعاليات'),
        icon: Calendar, 
        path: '/events',
        badge: 2,
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'opportunities', 
        label: t('nav.partnership_opportunities', 'Partnership Opportunities'), 
        arabicLabel: t('nav.partnership_opportunities', 'فرص الشراكة'),
        icon: Briefcase, 
        path: '/opportunities',
        group: 'discover',
        roles: ['all'] 
      },
      { 
        id: 'search', 
        label: t('nav.smart_search', 'Smart Search'), 
        arabicLabel: t('nav.smart_search', 'البحث الذكي'),
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
        id: 'idea-submission', 
        label: 'Submit New Idea', 
        arabicLabel: 'تقديم فكرة جديدة',
        icon: Lightbulb, 
        path: '/ideas/submit',
        group: 'personal',
        roles: ['all'] 
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
        id: 'collaboration', 
        label: 'Live Collaboration', 
        arabicLabel: 'التعاون المباشر',
        icon: Users, 
        path: '/collaboration',
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
      { 
        id: 'expert-dashboard', 
        label: 'Expert Dashboard', 
        arabicLabel: 'لوحة تحكم الخبير',
        icon: Award, 
        path: '/expert',
        group: 'workflow',
        roles: ['expert', 'admin'] 
      },
      { 
        id: 'partner-dashboard', 
        label: 'Partner Dashboard', 
        arabicLabel: 'لوحة تحكم الشريك',
        icon: Briefcase, 
        path: '/partner-dashboard',
        group: 'workflow',
        roles: ['partner', 'admin'] 
      },
    ];

    const workspaceItems = [
      { 
        id: 'user-workspace', 
        label: 'My Workspace', 
        arabicLabel: 'مساحة عملي',
        icon: User, 
        path: '/workspace/user/' + (userProfile?.id || 'me'),
        group: 'workspace',
        roles: ['all'] 
      },
      { 
        id: 'expert-workspace', 
        label: 'Expert Workspace', 
        arabicLabel: 'مساحة عمل الخبير',
        icon: GraduationCap, 
        path: '/workspace/expert/' + (userProfile?.id || 'me'),
        group: 'workspace',
        roles: ['expert', 'admin'] 
      },
      { 
        id: 'organization-workspace', 
        label: 'Organization Workspace', 
        arabicLabel: 'مساحة عمل المؤسسة',
        icon: Building, 
        path: '/workspace/org/' + (userProfile?.id || 'me'),
        group: 'workspace',
        roles: ['admin', 'team'] 
      },
      { 
        id: 'partner-workspace', 
        label: 'Partner Workspace', 
        arabicLabel: 'مساحة عمل الشريك',
        icon: Handshake, 
        path: '/workspace/partner/' + (userProfile?.id || 'me'),
        group: 'workspace',
        roles: ['partner', 'admin'] 
      },
      { 
        id: 'admin-workspace', 
        label: 'Admin Workspace', 
        arabicLabel: 'مساحة عمل الإدارة',
        icon: Shield, 
        path: '/workspace/admin',
        group: 'workspace',
        roles: ['admin'] 
      },
      { 
        id: 'team-workspace', 
        label: 'Team Collaboration', 
        arabicLabel: 'التعاون الجماعي',
        icon: Users, 
        path: '/dashboard/teams',
        group: 'workspace',
        roles: ['team', 'admin'] 
      },
    ];

    const subscriptionItems = [
      { 
        id: 'subscription', 
        label: 'Subscription Plans', 
        arabicLabel: 'خطط الاشتراك',
        icon: DollarSign, 
        path: '/subscription',
        group: 'subscription',
        roles: ['all'] 
      },
      { 
        id: 'ai-preferences', 
        label: 'AI Preferences', 
        arabicLabel: 'إعدادات الذكاء الاصطناعي',
        icon: Brain, 
        path: '/ai-preferences',
        group: 'subscription',
        roles: ['all'] 
      },
    ];

    const analyticsItems = [
      { 
        id: 'analytics', 
        label: 'Analytics Dashboard', 
        arabicLabel: 'لوحة التحليلات',
        icon: BarChart3, 
        path: '/analytics',
        group: 'analytics',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'statistics', 
        label: 'Platform Statistics', 
        arabicLabel: 'إحصائيات المنصة',
        icon: TrendingUp, 
        path: '/statistics',
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
    ];

    const adminItems = [
      { 
        id: 'admin-dashboard', 
        label: 'Admin Dashboard', 
        arabicLabel: 'لوحة التحكم الإدارية',
        icon: Shield, 
        path: '/admin/dashboard',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-challenges', 
        label: 'Manage Challenges', 
        arabicLabel: 'إدارة التحديات',
        icon: Target, 
        path: '/admin/challenges',
        badge: 5,
        group: 'admin',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'admin-ideas', 
        label: 'Manage Ideas', 
        arabicLabel: 'إدارة الأفكار',
        icon: Lightbulb, 
        path: '/admin/ideas',
        group: 'admin',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'admin-events', 
        label: 'Manage Events', 
        arabicLabel: 'إدارة الفعاليات',
        icon: Calendar, 
        path: '/admin/events',
        badge: 2,
        group: 'admin',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'admin-users', 
        label: 'User Management', 
        arabicLabel: 'إدارة المستخدمين',
        icon: Users, 
        path: '/admin/users',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-partners', 
        label: 'Partner Management', 
        arabicLabel: 'إدارة الشركاء',
        icon: Briefcase, 
        path: '/admin/partners',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-sectors', 
        label: 'Sectors Management', 
        arabicLabel: 'إدارة القطاعات',
        icon: Building, 
        path: '/admin/sectors',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-expert-assignments', 
        label: 'Expert Assignments', 
        arabicLabel: 'مهام الخبراء',
        icon: Users, 
        path: '/admin/expert-assignments',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-evaluations', 
        label: 'Evaluation Management', 
        arabicLabel: 'إدارة التقييمات',
        icon: UserCheck, 
        path: '/admin/evaluations',
        group: 'admin',
        roles: ['admin'] 
      },
      { 
        id: 'admin-campaigns', 
        label: 'Campaign Management', 
        arabicLabel: 'إدارة الحملات',
        icon: Zap, 
        path: '/admin/campaigns',
        badge: 3,
        group: 'admin',
        roles: ['team', 'admin'] 
      },
      { 
        id: 'admin-core-team', 
        label: 'Core Team', 
        arabicLabel: 'الفريق الأساسي',
        icon: Users, 
        path: '/admin/core-team',
        group: 'admin',
        roles: ['admin'] 
      },
    ];

    const systemItems = [
      { 
        id: 'storage-management', 
        label: 'Storage Management', 
        arabicLabel: 'إدارة التخزين',
        icon: Database, 
        path: '/admin/storage',
        group: 'system',
        roles: ['admin'] 
      },
      { 
        id: 'tag-management', 
        label: 'Tag Management', 
        arabicLabel: 'إدارة العلامات',
        icon: Tag, 
        path: '/admin/tags',
        group: 'system',
        roles: ['admin', 'team'] 
      },
      { 
        id: 'system-settings', 
        label: 'System Settings', 
        arabicLabel: 'إعدادات النظام',
        icon: Settings, 
        path: '/admin/system-settings',
        group: 'system',
        roles: ['admin'] 
      },
      { 
        id: 'system-analytics', 
        label: 'System Analytics', 
        arabicLabel: 'تحليلات النظام',
        icon: Activity, 
        path: '/admin/system-analytics',
        group: 'system',
        roles: ['admin'] 
      },
      { 
        id: 'organizational-structure', 
        label: 'Organizational Structure', 
        arabicLabel: 'الهيكل التنظيمي',
        icon: Building, 
        path: '/admin/organizational-structure',
        group: 'system',
        roles: ['admin'] 
      },
    ];

    const settingsItems = [
      { 
        id: 'settings', 
        label: 'User Settings', 
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
        roles: ['all'] 
      },
    ];

    return [...baseItems, ...discoverItems, ...personalItems, ...workflowItems, ...workspaceItems, ...subscriptionItems, ...analyticsItems, ...adminItems, ...systemItems, ...settingsItems];
  }, []);

  // Check if user can see a menu item
  const canAccessItem = (item: MenuItem) => {
    if (item.roles.includes('all')) return true;
    
    if (!userProfile?.user_roles?.length) {
      return item.roles.includes('innovator');
    }
    
    const userRoles = userProfile.user_roles.map((role) => role.role);
    return item.roles.some((role) => userRoles.includes(role));
  };

  const groupedItems = useMemo(() => {
    const groups: GroupedMenuItems = {};
    
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

  const groupLabels: GroupLabels = {
    main: { en: t('nav.group.dashboard', 'Dashboard'), ar: t('nav.group.dashboard', 'لوحة التحكم') },
    discover: { en: t('nav.group.discover', 'Discover'), ar: t('nav.group.discover', 'استكشاف') },
    personal: { en: t('nav.group.personal', 'Personal'), ar: t('nav.group.personal', 'شخصي') },
    workflow: { en: t('nav.group.workflow', 'Workflow'), ar: t('nav.group.workflow', 'سير العمل') },
    workspace: { en: t('nav.group.workspaces', 'Workspaces'), ar: t('nav.group.workspaces', 'مساحات العمل') },
    subscription: { en: t('nav.group.subscription_ai', 'Subscription & AI'), ar: t('nav.group.subscription_ai', 'الاشتراك والذكاء الاصطناعي') },
    analytics: { en: t('nav.group.analytics_reports', 'Analytics & Reports'), ar: t('nav.group.analytics_reports', 'التحليلات والتقارير') },
    admin: { en: t('nav.group.administration', 'Administration'), ar: t('nav.group.administration', 'الإدارة العامة') },
    system: { en: t('nav.group.system_management', 'System Management'), ar: t('nav.group.system_management', 'إدارة النظام') },
    settings: { en: t('nav.group.settings_help', 'Settings & Help'), ar: t('nav.group.settings_help', 'الإعدادات والمساعدة') }
  };

  // Priority order for groups
  const { getSettingValue } = useSettingsManager();
  const groupOrder = getSettingValue('navigation_group_order', ['main', 'discover', 'personal', 'workspace', 'workflow', 'subscription', 'analytics', 'admin', 'system', 'settings']) as string[];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      
      return (
        <li key={item.id} className="mb-1">
          <NavLink 
            to={item.path}
            onClick={() => onOpenChange(false)} // Close overlay on navigation
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
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
        </li>
      );
    });
  };

  const renderGroup = (groupKey: string, items: MenuItem[]) => {
    if (groupKey === 'old') {
      return (
        <Collapsible key={groupKey} open={isOldLinksOpen} onOpenChange={setIsOldLinksOpen}>
          <div className="mb-4">
            <CollapsibleTrigger className={cn(
              "flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground mb-2",
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? "right" : "left"}
        className={cn("w-80 p-0", isRTL && "text-right")}
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

          {/* Always render old links section at the bottom */}
          {groupedItems.old && groupedItems.old.length > 0 && renderGroup('old', groupedItems.old)}
        </div>
      </SheetContent>
    </Sheet>
  );
}