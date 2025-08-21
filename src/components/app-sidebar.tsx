import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Home,
  Settings,
  Users,
  FolderOpen,
  Calendar,
  MessageSquare,
  Activity,
  FileText,
  Target,
  Lightbulb,
  BarChart3,
  Bell,
  Search,
  Plus,
  Bookmark,
  Trophy,
  Building2,
  UserCheck,
  Shield,
  Briefcase,
  PieChart,
  Database,
  Lock,
  Globe,
  Zap,
  Layers,
  GitBranch,
  Archive,
  HelpCircle,
  Palette,
  Crown,
  Star,
  Workflow,
  Brain
} from 'lucide-react';
import type { UserRole } from '@/hooks/useRoleAccess';

interface SidebarNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: UserRole[];
  children?: SidebarNavItem[];
}

export function AppSidebar() {
  const { t } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const { isAdmin, isSuperAdmin, isTeamMember, isExpert, isPartner, uiAccess } = useRoleBasedAccess();
  const location = useLocation();
  const { state } = useSidebar();

  // Define navigation structure with RBAC
  const navigationSections: { 
    id: string; 
    label: string; 
    items: SidebarNavItem[];
    roles?: UserRole[];
  }[] = [
    // Main Navigation (All Users)
    {
      id: 'main',
      label: t('navigation:main.dashboard'),
      items: [
        {
          id: 'dashboard',
          label: t('navigation:main.dashboard'),
          href: '/dashboard',
          icon: Home,
        },
        {
          id: 'ideas',
          label: t('navigation:main.ideas'),
          href: '/ideas',
          icon: Lightbulb,
          badge: '3'
        },
        {
          id: 'challenges',
          label: t('navigation:main.challenges'),
          href: '/challenges',
          icon: Target,
        },
        {
          id: 'events',
          label: t('navigation:main.events'),
          href: '/events',
          icon: Calendar,
        },
        {
          id: 'opportunities',
          label: t('pages:opportunities.title'),
          href: '/opportunities',
          icon: Star,
          roles: ['admin', 'super_admin']
        }
      ]
    },

    // Workspace Navigation (All Users)
    {
      id: 'workspace',
      label: t('navigation:main.workspace'),
      items: [
        {
          id: 'user-workspace',
          label: t('routes:titles.workspace_user'),
          href: '/workspace/user',
          icon: Users,
        },
        {
          id: 'expert-workspace',
          label: t('routes:titles.workspace_expert'),
          href: '/workspace/expert',
          icon: UserCheck,
          roles: ['expert', 'admin', 'super_admin']
        },
        {
          id: 'organization-workspace',
          label: t('routes:titles.workspace_organization'),
          href: '/workspace/organization',
          icon: Building2,
          roles: ['organization_member', 'admin', 'super_admin']
        },
        {
          id: 'partner-workspace',
          label: t('routes:titles.workspace_partner'),
          href: '/workspace/partner',
          icon: Briefcase,
          roles: ['partner', 'admin', 'super_admin']
        },
        {
          id: 'team-workspace',
          label: t('routes:titles.workspace_team'),
          href: '/workspace/team',
          icon: Users,
          roles: ['team_member', 'team_lead', 'project_manager', 'admin', 'super_admin']
        },
        {
          id: 'admin-workspace',
          label: t('routes:titles.workspace_admin'),
          href: '/workspace/admin',
          icon: Shield,
          roles: ['admin', 'super_admin']
        }
      ]
    },

    // Admin Management (Admin & Super Admin)
    {
      id: 'admin',
      label: t('navigation:admin.users'),
      roles: ['admin', 'super_admin'],
      items: [
        {
          id: 'admin-dashboard',
          label: t('routes:titles.admin_dashboard'),
          href: '/admin/dashboard',
          icon: PieChart,
        },
        {
          id: 'admin-users',
          label: t('routes:titles.admin_users'),
          href: '/admin/users',
          icon: Users,
        },
        {
          id: 'admin-challenges',
          label: t('routes:titles.admin_challenges'),
          href: '/admin/challenges',
          icon: Target,
        },
        {
          id: 'admin-campaigns',
          label: t('routes:titles.admin_campaigns'),
          href: '/admin/campaigns',
          icon: Zap,
        },
        {
          id: 'admin-ideas',
          label: t('routes:titles.admin_ideas'),
          href: '/admin/ideas',
          icon: Lightbulb,
        },
        {
          id: 'admin-events',
          label: t('routes:titles.admin_events'),
          href: '/admin/events',
          icon: Calendar,
        },
        {
          id: 'admin-evaluations',
          label: t('routes:titles.admin_evaluations'),
          href: '/admin/evaluations',
          icon: UserCheck,
        },
        {
          id: 'admin-relationships',
          label: t('routes:titles.admin_relationships'),
          href: '/admin/relationships',
          icon: GitBranch,
        }
      ]
    },

    // System Management (Admin & Super Admin)
    {
      id: 'system',
      label: t('routes:titles.admin_settings'),
      roles: ['admin', 'super_admin'],
      items: [
        {
          id: 'admin-partners',
          label: t('routes:titles.admin_partners'),
          href: '/admin/partners',
          icon: Briefcase,
        },
        {
          id: 'admin-sectors',
          label: t('routes:titles.admin_sectors'),
          href: '/admin/sectors',
          icon: Layers,
        },
        {
          id: 'admin-teams',
          label: t('routes:titles.admin_teams'),
          href: '/admin/teams',
          icon: Users,
        },
        {
          id: 'admin-stakeholders',
          label: t('routes:titles.admin_stakeholders'),
          href: '/admin/stakeholders',
          icon: Crown,
        },
        {
          id: 'admin-entities',
          label: t('routes:titles.admin_entities'),
          href: '/admin/entities',
          icon: Database,
        },
        {
          id: 'admin-settings',
          label: t('routes:titles.admin_settings'),
          href: '/admin/settings',
          icon: Settings,
        },
        {
          id: 'admin-analytics',
          label: t('routes:titles.admin_analytics'),
          href: '/admin/analytics',
          icon: BarChart3,
        }
      ]
    },

    // Advanced Admin (Admin & Super Admin)
    {
      id: 'advanced',
      label: t('pages:advanced.title'),
      roles: ['admin', 'super_admin'],
      items: [
        {
          id: 'admin-storage',
          label: t('routes:titles.admin_storage'),
          href: '/admin/storage',
          icon: Database,
        },
        {
          id: 'admin-storage-policies',
          label: t('routes:titles.admin_storage_policies'),
          href: '/admin/storage-policies',
          icon: Archive,
        },
        {
          id: 'admin-security',
          label: t('routes:titles.admin_security'),
          href: '/admin/security',
          icon: Lock,
        },
        {
          id: 'admin-core-team',
          label: t('routes:titles.admin_core_team'),
          href: '/admin/core-team',
          icon: Star,
        },
        {
          id: 'admin-focus-questions',
          label: t('routes:titles.admin_focus_questions'),
          href: '/admin/focus-questions',
          icon: Brain,
        },
        {
          id: 'admin-opportunities',
          label: t('routes:titles.admin_opportunities'),
          href: '/admin/opportunities',
          icon: Globe,
        }
      ]
    },

    // Super Admin Only
    {
      id: 'super-admin',
      label: t('pages:super_admin.title'),
      roles: ['super_admin'],
      items: [
        {
          id: 'access-control',
          label: t('routes:titles.dashboard_access_control'),
          href: '/dashboard/access-control',
          icon: Shield,
        },
        {
          id: 'elevation-monitor',
          label: t('pages:elevation_monitor.title'),
          href: '/admin/elevation-monitor',
          icon: Crown,
        },
        {
          id: 'security-advanced',
          label: t('pages:security_advanced.title'),
          href: '/admin/security-advanced',
          icon: Lock,
        },
        {
          id: 'ai-management',
          label: t('pages:ai_management.title'),
          href: '/admin/ai-management',
          icon: Brain,
        }
      ]
    },

    // Tools & Utilities (All Users)
    {
      id: 'tools',
      label: t('pages:tools.title'),
      items: [
        {
          id: 'design-system',
          label: t('routes:titles.design_system'),
          href: '/design-system',
          icon: Palette,
        },
        {
          id: 'workspace-docs',
          label: t('routes:titles.workspace_docs'),
          href: '/workspace-docs',
          icon: FileText,
        },
        {
          id: 'collaboration',
          label: t('routes:titles.collaboration'),
          href: '/collaboration',
          icon: Workflow,
          roles: ['admin', 'super_admin']
        },
        {
          id: 'help',
          label: t('routes:titles.help'),
          href: '/help',
          icon: HelpCircle,
        }
      ]
    }
  ];

  // Filter items based on user roles
  const hasRole = (roles?: UserRole[]): boolean => {
    if (!roles || roles.length === 0) return true;
    
    return roles.some(role => {
      switch (role) {
        case 'admin':
          return isAdmin;
        case 'super_admin':
          return isSuperAdmin;
        case 'team_member':
        case 'team_lead':
        case 'project_manager':
          return isTeamMember;
        case 'expert':
          return isExpert;
        case 'partner':
          return isPartner;
        case 'organization_member':
          return userProfile?.organization !== null;
        default:
          return false;
      }
    });
  };

  const getVisibleSections = () => {
    return navigationSections
      .filter(section => hasRole(section.roles))
      .map(section => ({
        ...section,
        items: section.items.filter(item => hasRole(item.roles))
      }))
      .filter(section => section.items.length > 0);
  };

  const visibleSections = getVisibleSections();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Sidebar className={cn(
      "border-r bg-sidebar transition-all duration-300",
      state === "collapsed" ? "w-14" : "w-64"
    )}>
      {/* Sidebar Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        state === "collapsed" && "justify-center"
      )}>
        {state !== "collapsed" && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">R</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {t('pages:app.title')}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('pages:app.subtitle')}
              </p>
            </div>
          </div>
        )}
        <SidebarTrigger className="h-6 w-6" />
      </div>

      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Quick Create Button */}
          <div className="p-2">
            <SidebarMenuButton asChild>
              <NavLink
                to="/ideas/submit"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {state !== "collapsed" && (
                  <span className="font-medium">{t('common:actions.submit_idea')}</span>
                )}
              </NavLink>
            </SidebarMenuButton>
          </div>

          <Separator className="my-2" />

          {/* Navigation Sections */}
          {visibleSections.map((section, sectionIndex) => (
            <React.Fragment key={section.id}>
              <SidebarGroup>
                {state !== "collapsed" && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.label}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) => cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                                : "hover:bg-sidebar-accent/50"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {state !== "collapsed" && (
                              <>
                                <span className="flex-1 truncate">{item.label}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {sectionIndex < visibleSections.length - 1 && (
                <Separator className="my-2" />
              )}
            </React.Fragment>
          ))}
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center gap-2",
            state === "collapsed" && "justify-center"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userProfile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {state !== "collapsed" && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userProfile?.display_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? t('common:roles.admin') : 
                   isExpert ? t('common:roles.expert') :
                   isPartner ? t('common:roles.partner') :
                   t('common:roles.user')}
                </p>
              </div>
            )}
          </div>
          
          {state !== "collapsed" && (
            <div className="mt-3 space-y-1">
              <SidebarMenuButton asChild size="sm">
                <NavLink to="/profile" className="flex items-center gap-2 text-xs">
                  <Users className="h-3 w-3" />
                  {t('navigation:main.profile')}
                </NavLink>
              </SidebarMenuButton>
              <SidebarMenuButton asChild size="sm">
                <NavLink to="/settings" className="flex items-center gap-2 text-xs">
                  <Settings className="h-3 w-3" />
                  {t('navigation:main.settings')}
                </NavLink>
              </SidebarMenuButton>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}