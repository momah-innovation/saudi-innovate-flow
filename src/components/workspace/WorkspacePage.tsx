import React from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { EnhancedWorkspaceLayout } from '@/components/workspace/layouts/EnhancedWorkspaceLayout';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
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
        label: 'Dashboard',
        icon: BarChart3,
        active: activeView === 'dashboard',
        onClick: () => setActiveView('dashboard')
      },
      {
        id: 'files',
        label: 'Files',
        icon: Folder,
        count: 12, // Would come from file storage hook
        active: activeView === 'files',
        onClick: () => setActiveView('files')
      },
      {
        id: 'messages',
        label: 'Messages',
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
        label: 'Members',
        icon: Users,
        count: onlineMembers.length,
        active: activeView === 'members',
        onClick: () => setActiveView('members')
      });
    }

    if (permissions.canManageSettings) {
      baseItems.push({
        id: 'settings',
        label: 'Settings',
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
        label: 'Online Members',
        value: onlineMembers.length.toString(),
        icon: Users,
        trend: 'up' as const
      },
      {
        label: 'Files Shared',
        value: '24',
        icon: FileText,
        trend: 'up' as const
      }
    ];

    // Add workspace-specific metrics
    if (workspaceType === 'organization' || workspaceType === 'admin') {
      baseMetrics.push({
        label: 'Active Projects',
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
        label: 'New Document',
        icon: Plus,
        onClick: () => console.log('Create document'),
        variant: 'default' as const
      });
    }

    if (permissions.canInviteUsers) {
      actions.push({
        label: 'Invite Members',
        icon: Users,
        onClick: () => console.log('Invite members'),
        variant: 'outline' as const
      });
    }

    return actions;
  };

  const breadcrumbs = [
    { label: 'Workspaces', href: '/workspace' },
    { 
      label: currentWorkspace?.name || `${workspaceType} Workspace`, 
      current: true 
    }
  ];

  return (
    <EnhancedWorkspaceLayout
      workspaceType={workspaceType}
      workspaceId={currentWorkspace?.id || ''}
      title={currentWorkspace?.name || `${workspaceType} Workspace`}
      description={currentWorkspace?.description || `Collaborative ${workspaceType} workspace`}
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
            <h4 className="text-sm font-medium mb-2">Online Now ({onlineMembers.length})</h4>
            <div className="space-y-1">
              {onlineMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="truncate">{member.user_id}</span>
                </div>
              ))}
              {onlineMembers.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{onlineMembers.length - 5} more
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
                  {activeView === 'dashboard' && 'Workspace Overview'}
                  {activeView === 'files' && 'Files & Documents'}
                  {activeView === 'members' && 'Team Members'}
                  {activeView === 'messages' && 'Messages & Chat'}
                  {activeView === 'settings' && 'Workspace Settings'}
                </h3>
                
                <div className="text-muted-foreground">
                  Content for {activeView} view will be rendered here.
                  This is a placeholder for the dynamic workspace content.
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>User joined workspace</div>
                  <div>New file uploaded</div>
                  <div>Meeting scheduled</div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
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