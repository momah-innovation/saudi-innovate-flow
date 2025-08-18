import React from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { EnhancedWorkspaceLayout } from '@/components/workspace/layouts/EnhancedWorkspaceLayout';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageCircle, 
  BarChart3, 
  Settings,
  Folder,
  Plus
} from 'lucide-react';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspacePageProps {
  workspaceType: WorkspaceType;
  children?: React.ReactNode;
}

export function WorkspacePage({ workspaceType, children }: WorkspacePageProps) {
  const { t } = useUnifiedTranslation();
  const {
    currentWorkspace,
    userRole,
    sidebarCollapsed,
    activeView,
    setActiveView,
    isConnected,
    onlineMembers
  } = useWorkspace();

  const permissions = useWorkspacePermissions();

  // Dynamic navigation based on workspace type and permissions
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        label: t('workspace.general.nav.dashboard'),
        icon: BarChart3,
        active: activeView === 'dashboard',
        onClick: () => setActiveView('dashboard')
      },
      {
        id: 'files',
        label: t('workspace.general.nav.files'),
        icon: Folder,
        count: 12, // Would come from file storage hook
        active: activeView === 'files',
        onClick: () => setActiveView('files')
      },
      {
        id: 'messages',
        label: t('workspace.general.nav.messages'),
        icon: MessageCircle,
        count: 3, // Would come from real-time messages
        active: activeView === 'messages',
        onClick: () => setActiveView('messages')
      }
    ];

    // Add workspace-type specific items
    if (workspaceType === 'team' || workspaceType === 'organization') {
      baseItems.splice(1, 0, {
        id: 'members',
        label: t('workspace.general.nav.members'),
        icon: Users,
        count: onlineMembers.length,
        active: activeView === 'members',
        onClick: () => setActiveView('members')
      });
    }

    if (permissions.canManageSettings) {
      baseItems.push({
        id: 'settings',
        label: t('workspace.general.nav.settings'),
        icon: Settings,
        active: activeView === 'settings',
        onClick: () => setActiveView('settings')
      });
    }

    return baseItems;
  };

  // Dynamic metrics based on workspace type
  const getWorkspaceMetrics = () => {
    const baseMetrics = [
      {
        label: t('workspace.general.metrics.online_members'),
        value: onlineMembers.length.toString(),
        icon: Users,
        trend: 'up' as const
      },
      {
        label: t('workspace.general.metrics.files_shared'),
        value: '24',
        icon: FileText,
        trend: 'up' as const
      }
    ];

    // Add workspace-specific metrics
    if (workspaceType === 'organization' || workspaceType === 'admin') {
      baseMetrics.push({
        label: t('workspace.general.metrics.active_projects'),
        value: '8',
        icon: Folder,
        trend: 'up' as const
      });
    }

    return baseMetrics;
  };

  // Dynamic actions based on permissions
  const getWorkspaceActions = () => {
    const actions = [];

    if (permissions.canCreate) {
      actions.push({
        label: t('workspace.general.actions.new_document'),
        icon: Plus,
        onClick: () => console.log('Create document'),
        variant: 'default' as const
      });
    }

    if (permissions.canInviteUsers) {
      actions.push({
        label: t('workspace.general.actions.invite_members'),
        icon: Users,
        onClick: () => console.log('Invite members'),
        variant: 'outline' as const
      });
    }

    return actions;
  };

  const breadcrumbs = [
    { label: t('workspace.general.breadcrumbs.workspaces'), href: '/workspace' },
    { 
      label: currentWorkspace?.name || t('workspace.general.breadcrumbs.workspace_type', { type: workspaceType }), 
      current: true 
    }
  ];

  return (
    <EnhancedWorkspaceLayout
      workspaceType={workspaceType}
      workspaceId={currentWorkspace?.id || ''}
      title={currentWorkspace?.name || t('workspace.general.title', { type: workspaceType })}
      description={currentWorkspace?.description || t('workspace.general.description', { type: workspaceType })}
      userRole={userRole || 'member'}
      metrics={getWorkspaceMetrics()}
      actions={getWorkspaceActions()}
      breadcrumbs={breadcrumbs}
      showCollaboration={isConnected}
      sidebarContent={
        <div className="space-y-4">
          <WorkspaceNavigation 
            items={getNavigationItems()}
            orientation="vertical"
          />
          
          {/* Online Members Widget */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-2">{t('workspace.general.sidebar.online_now', { count: onlineMembers.length })}</h4>
            <div className="space-y-1">
              {onlineMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="truncate">{member.user_id}</span>
                </div>
              ))}
              {onlineMembers.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  {t('workspace.general.sidebar.more_members', { count: onlineMembers.length - 5 })}
                </div>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div className={cn(
        "flex-1 space-y-6",
        sidebarCollapsed ? "ml-0" : "ml-64"
      )}>
        {children || (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {activeView === 'dashboard' && t('workspace.general.content.workspace_overview')}
                  {activeView === 'files' && t('workspace.general.content.files_documents')}
                  {activeView === 'members' && t('workspace.general.content.team_members')}
                  {activeView === 'messages' && t('workspace.general.content.messages_chat')}
                  {activeView === 'settings' && t('workspace.general.content.workspace_settings')}
                </h3>
                
                <div className="text-muted-foreground">
                  {t('workspace.general.content.placeholder', { view: activeView })}
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-medium mb-3">{t('workspace.general.sidebar.recent_activity')}</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>{t('workspace.general.sidebar.user_joined')}</div>
                  <div>{t('workspace.general.sidebar.file_uploaded')}</div>
                  <div>{t('workspace.general.sidebar.meeting_scheduled')}</div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-medium mb-3">{t('workspace.general.sidebar.quick_actions')}</h4>
                <div className="space-y-2">
                  {getWorkspaceActions().map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="w-full text-left p-2 text-sm hover:bg-muted rounded"
                    >
                      <action.icon className="w-4 h-4 inline mr-2" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EnhancedWorkspaceLayout>
  );
}