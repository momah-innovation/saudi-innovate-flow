import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceBreadcrumb } from './WorkspaceBreadcrumb';
import { WorkspaceNotifications } from './WorkspaceNotifications';
// import { RealTimeCollaborationWrapper } from '@/components/collaboration/RealTimeCollaborationWrapper';
import { AlertCircle, Settings, Users, Activity, FileText, Calendar } from 'lucide-react';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspaceMetric {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

interface WorkspaceAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  disabled?: boolean;
}

interface WorkspaceBreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface EnhancedWorkspaceLayoutProps {
  workspaceType: WorkspaceType;
  workspaceId?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  
  // Header props
  userRole?: string;
  metrics?: WorkspaceMetric[];
  actions?: WorkspaceAction[];
  breadcrumbs?: WorkspaceBreadcrumbItem[];
  
  // Sidebar props
  sidebarContent?: React.ReactNode;
  showCollaboration?: boolean;
  
  // Layout props
  fullWidth?: boolean;
  className?: string;
}

export function EnhancedWorkspaceLayout({
  workspaceType,
  workspaceId,
  title,
  description,
  children,
  userRole,
  metrics = [],
  actions = [],
  breadcrumbs = [],
  sidebarContent,
  showCollaboration = true,
  fullWidth = false,
  className
}: EnhancedWorkspaceLayoutProps) {
  const { t, getDynamicText, isRTL } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Default breadcrumbs
  const defaultBreadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('workspace.title'), href: '/workspace' },
    { label: title, current: true }
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  // Default actions for all workspaces
  const defaultActions: WorkspaceAction[] = [
    {
      id: 'settings',
      label: t('common.settings'),
      icon: Settings,
      onClick: () => console.log('Open settings'),
      variant: 'outline'
    },
    {
      id: 'members',
      label: t('workspace.members'),
      icon: Users,
      onClick: () => console.log('View members'),
      variant: 'outline'
    },
    {
      id: 'activity',
      label: t('workspace.activity'),
      icon: Activity,
      onClick: () => console.log('View activity'),
      variant: 'outline'
    }
  ];

  const allActions = [...actions, ...defaultActions];

  return (
    <>
      <SidebarProvider defaultOpen={!sidebarCollapsed}>
        <div className={cn("min-h-screen flex w-full bg-background", className)}>
          {/* Workspace Sidebar */}
          <WorkspaceSidebar
            workspaceType={workspaceType}
            workspaceId={workspaceId}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          >
            {sidebarContent}
          </WorkspaceSidebar>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Workspace Header */}
            <WorkspaceHeader
              title={title}
              description={description}
              userRole={userRole}
              metrics={metrics}
              actions={allActions}
              workspaceType={workspaceType}
            />

            {/* Breadcrumb Navigation */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-2">
                <WorkspaceBreadcrumb items={finalBreadcrumbs} />
              </div>
            </div>

            {/* Content Area */}
            <main className={cn(
              "flex-1 overflow-auto",
              fullWidth ? "w-full" : "container mx-auto px-4 py-6"
            )}>
              {children}
            </main>

            {/* Footer with workspace info */}
            <footer className="border-t bg-background/50 py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>
                      {t('workspace.type')}: {getDynamicText(`workspace.types.${workspaceType}`)}
                    </span>
                    {userRole && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span>
                          {t('workspace.role')}: {userRole}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      v2.4
                    </Badge>
                    <WorkspaceNotifications workspaceId={workspaceId} />
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}