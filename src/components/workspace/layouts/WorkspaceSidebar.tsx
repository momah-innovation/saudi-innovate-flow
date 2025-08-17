import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ChevronRight,
  Bookmark,
  Trophy,
  Building2,
  UserCheck,
  Shield,
  Briefcase
} from 'lucide-react';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspaceSidebarProps {
  workspaceType: WorkspaceType;
  workspaceId?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
  children?: SidebarNavItem[];
  requiredPermission?: string;
  workspaceTypes?: WorkspaceType[];
}

export function WorkspaceSidebar({
  workspaceType,
  workspaceId,
  collapsed,
  onCollapsedChange,
  children
}: WorkspaceSidebarProps) {
  const { t } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const permissions = useWorkspacePermissions();
  const location = useLocation();
  const { state } = useSidebar();

  // Navigation items based on workspace type
  const getNavigationItems = (): SidebarNavItem[] => {
    const baseItems: SidebarNavItem[] = [
      {
        id: 'dashboard',
        label: t('workspace.nav.dashboard'),
        icon: Home,
        href: `/workspace/${workspaceType}`,
      },
      {
        id: 'activity',
        label: t('workspace.nav.activity'),
        icon: Activity,
        href: `/workspace/${workspaceType}/activity`,
      }
    ];

    // Type-specific navigation
    const typeSpecificItems: Record<WorkspaceType, SidebarNavItem[]> = {
      user: [
        {
          id: 'ideas',
          label: t('workspace.nav.ideas'),
          icon: Lightbulb,
          href: '/ideas',
          badge: '3'
        },
        {
          id: 'challenges',
          label: t('workspace.nav.challenges'),
          icon: Target,
          href: '/challenges',
        },
        {
          id: 'bookmarks',
          label: t('workspace.nav.bookmarks'),
          icon: Bookmark,
          href: `/workspace/${workspaceType}/bookmarks`,
        }
      ],
      expert: [
        {
          id: 'evaluations',
          label: t('workspace.nav.evaluations'),
          icon: UserCheck,
          href: `/workspace/${workspaceType}/evaluations`,
          badge: '5'
        },
        {
          id: 'expertise',
          label: t('workspace.nav.expertise'),
          icon: Shield,
          href: `/workspace/${workspaceType}/expertise`,
        },
        {
          id: 'reports',
          label: t('workspace.nav.reports'),
          icon: FileText,
          href: `/workspace/${workspaceType}/reports`,
        }
      ],
      organization: [
        {
          id: 'members',
          label: t('workspace.nav.members'),
          icon: Users,
          href: `/workspace/${workspaceType}/members`,
          badge: '12'
        },
        {
          id: 'departments',
          label: t('workspace.nav.departments'),
          icon: Building2,
          href: `/workspace/${workspaceType}/departments`,
        },
        {
          id: 'analytics',
          label: t('workspace.nav.analytics'),
          icon: BarChart3,
          href: `/workspace/${workspaceType}/analytics`,
        }
      ],
      partner: [
        {
          id: 'partnerships',
          label: t('workspace.nav.partnerships'),
          icon: Briefcase,
          href: `/workspace/${workspaceType}/partnerships`,
        },
        {
          id: 'collaborations',
          label: t('workspace.nav.collaborations'),
          icon: Users,
          href: `/workspace/${workspaceType}/collaborations`,
        }
      ],
      admin: [
        {
          id: 'users',
          label: t('workspace.nav.users'),
          icon: Users,
          href: '/admin/users',
        },
        {
          id: 'system',
          label: t('workspace.nav.system'),
          icon: Settings,
          href: '/admin/settings',
        }
      ],
      team: [
        {
          id: 'projects',
          label: t('workspace.nav.projects'),
          icon: FolderOpen,
          href: `/workspace/${workspaceType}/projects`,
        },
        {
          id: 'tasks',
          label: t('workspace.nav.tasks'),
          icon: Target,
          href: `/workspace/${workspaceType}/tasks`,
          badge: '8'
        },
        {
          id: 'meetings',
          label: t('workspace.nav.meetings'),
          icon: Calendar,
          href: `/workspace/${workspaceType}/meetings`,
        }
      ],
      stakeholder: [
        {
          id: 'overview',
          label: t('workspace.nav.overview'),
          icon: BarChart3,
          href: `/workspace/${workspaceType}/overview`,
        },
        {
          id: 'feedback',
          label: t('workspace.nav.feedback'),
          icon: MessageSquare,
          href: `/workspace/${workspaceType}/feedback`,
        }
      ],
      project: [
        {
          id: 'tasks',
          label: t('workspace.nav.tasks'),
          icon: Target,
          href: `/workspace/${workspaceType}/tasks`,
        },
        {
          id: 'files',
          label: t('workspace.nav.files'),
          icon: FileText,
          href: `/workspace/${workspaceType}/files`,
        }
      ]
    };

    const commonItems: SidebarNavItem[] = [
      {
        id: 'messages',
        label: t('workspace.nav.messages'),
        icon: MessageSquare,
        href: `/workspace/${workspaceType}/messages`,
        badge: '2'
      },
      {
        id: 'calendar',
        label: t('workspace.nav.calendar'),
        icon: Calendar,
        href: `/workspace/${workspaceType}/calendar`,
      },
      {
        id: 'files',
        label: t('workspace.nav.files'),
        icon: FileText,
        href: `/workspace/${workspaceType}/files`,
      }
    ];

    return [
      ...baseItems,
      ...typeSpecificItems[workspaceType] || [],
      ...commonItems
    ];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path: string) => location.pathname === path;

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
              <span className="text-primary-foreground text-sm font-bold">W</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                {t(`workspace.types.${workspaceType}`)}
              </h2>
              {userProfile?.display_name && (
                <p className="text-xs text-muted-foreground">
                  {userProfile.display_name}
                </p>
              )}
            </div>
          </div>
        )}
        <SidebarTrigger className="h-6 w-6" />
      </div>

      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Quick Actions */}
          <SidebarGroup>
            {state !== "collapsed" && (
              <SidebarGroupLabel>
                {t('workspace.quick_actions')}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button 
                      variant="default" 
                      size={state === "collapsed" ? "icon" : "sm"}
                      className="w-full justify-start"
                    >
                      <Plus className="h-4 w-4" />
                      {state !== "collapsed" && <span>{t('common.create_new')}</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          {/* Main Navigation */}
          <SidebarGroup>
            {state !== "collapsed" && (
              <SidebarGroupLabel>
                {t('workspace.navigation')}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                            : "hover:bg-sidebar-accent/50"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && (
                          <>
                            <span className="flex-1">{item.label}</span>
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

          {children && (
            <>
              <Separator />
              <SidebarGroup>
                <SidebarGroupContent>
                  {children}
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t p-4">
        <div className={cn(
          "flex items-center gap-2",
          state === "collapsed" && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback>
              {userProfile?.display_name?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {state !== "collapsed" && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile?.display_name || user?.email}
              </p>
                <p className="text-xs text-muted-foreground">
                  {t(`workspace.types.${workspaceType}`)}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}