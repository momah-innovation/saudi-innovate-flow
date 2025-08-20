import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceRealTime } from '@/hooks/useWorkspaceRealTime';
import { useWorkspaceChat } from '@/hooks/useWorkspaceChat';
import { useWorkspaceDocuments } from '@/hooks/useWorkspaceDocuments';
import type { Workspace, WorkspaceMember, UserWorkspaceContext, WorkspaceType } from '@/types/workspace';

interface WorkspaceContextType {
  // Current workspace state
  currentWorkspace: Workspace | null;
  currentWorkspaceMembers: WorkspaceMember[];
  userWorkspaceContext: UserWorkspaceContext | null;
  
  // All user workspaces
  userWorkspaces: Workspace[];
  
  // Loading states
  loading: boolean;
  membersLoading: boolean;
  
  // UI State - Add missing properties
  userRole: string | null;
  sidebarCollapsed: boolean;
  activeView: string;
  isConnected: boolean;
  onlineMembers: WorkspaceMember[];
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
  refreshMembers: () => Promise<void>;
  setActiveView: (view: string) => void;
  
  // Workspace management
  createWorkspace: (workspaceData: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<void>;
  
  // Member management
  inviteMember: (workspaceId: string, email: string, role: string) => Promise<void>;
  updateMemberRole: (memberId: string, newRole: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  
  // Utility functions
  hasWorkspaceAccess: (workspaceType: WorkspaceType, requiredRoles?: string[]) => boolean;
  getWorkspacesByType: (workspaceType: WorkspaceType) => Workspace[];
  getCurrentUserRole: () => string | null;
  
  // Real-time features
  realtime: ReturnType<typeof useWorkspaceRealTime>;
  chat: ReturnType<typeof useWorkspaceChat>;
  documents: ReturnType<typeof useWorkspaceDocuments>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentWorkspaceMembers, setCurrentWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [userWorkspaceContext, setUserWorkspaceContext] = useState<UserWorkspaceContext | null>(null);
  const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  
  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Initialize real-time hooks
  const realtime = useWorkspaceRealTime({ 
    workspaceId: currentWorkspace?.id || ''
  });
  
  const chat = useWorkspaceChat({ 
    workspaceId: currentWorkspace?.id || '', 
    enabled: !!currentWorkspace 
  });
  
  const documents = useWorkspaceDocuments({ 
    workspaceId: currentWorkspace?.id || '', 
    enabled: !!currentWorkspace 
  });

  // Fetch user's workspaces and build context
  const refreshWorkspaces = async () => {
    if (!user) {
      setUserWorkspaces([]);
      setUserWorkspaceContext(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch workspaces where user is owner or member
      const { data: workspaces, error: workspacesError } = await supabase
        .from('workspaces')
        .select(`
          *,
          workspace_members!inner(
            role,
            access_level,
            permissions,
            status
          )
        `)
        .eq('workspace_members.user_id', user.id)
        .eq('workspace_members.status', 'active');

      if (workspacesError) throw workspacesError;

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (rolesError) throw rolesError;

      const roles = userRoles?.map(r => r.role) || [];

      // Build workspace context
      const workspaceContext: UserWorkspaceContext = {
        user_id: user.id,
        roles,
        workspaces: workspaces?.map(w => ({
          workspace_id: w.id,
          workspace_type: w.workspace_type,
          member_role: w.workspace_members[0]?.role || 'member',
          access_level: w.workspace_members[0]?.access_level || 'standard',
          permissions: (w.workspace_members[0]?.permissions as Record<string, any>) || {}
        })) || [],
        workspace_priority: workspaces?.map((w, index) => ({
          workspace_id: w.id,
          priority_order: index
        })) || []
      };

      // Set default workspace (first user workspace or admin workspace)
      const defaultWorkspace = workspaces?.find(w => 
        w.workspace_type === 'user' || 
        (roles.includes('admin') && w.workspace_type === 'admin')
      ) || workspaces?.[0];

      setUserWorkspaces((workspaces || []) as Workspace[]);
      setUserWorkspaceContext(workspaceContext);
      
      if (defaultWorkspace && !currentWorkspace) {
        setCurrentWorkspace(defaultWorkspace as Workspace);
      }

    } catch (error) {
      console.error('Error refreshing workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current workspace members
  const refreshMembers = async () => {
    if (!currentWorkspace) {
      setCurrentWorkspaceMembers([]);
      return;
    }

    try {
      setMembersLoading(true);

      const { data: members, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          profiles(
            display_name,
            profile_image_url
          )
        `)
        .eq('workspace_id', currentWorkspace.id)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (error) throw error;

      setCurrentWorkspaceMembers((members || []).map(m => ({
        ...m,
        access_level: (m.access_level as 'standard' | 'elevated' | 'admin') || 'standard',
        status: (m.status as 'active' | 'inactive' | 'pending' | 'suspended') || 'active',
        permissions: (m.permissions as Record<string, any>) || {},
        notification_preferences: (m.notification_preferences as Record<string, any>) || {},
        workspace_settings: (m.workspace_settings as Record<string, any>) || {}
      })));
    } catch (error) {
      console.error('Error refreshing members:', error);
    } finally {
      setMembersLoading(false);
    }
  };

  // Switch to a different workspace
  const switchWorkspace = async (workspaceId: string) => {
    const workspace = userWorkspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      // Store user preference
      localStorage.setItem('preferred_workspace_id', workspaceId);
    }
  };

  // Create new workspace
  const createWorkspace = async (workspaceData: Partial<Workspace>): Promise<Workspace> => {
    if (!user) throw new Error('User must be authenticated');

    const insertData = {
      name: workspaceData.name || 'New Workspace',
      name_ar: workspaceData.name_ar,
      description: workspaceData.description,
      description_ar: workspaceData.description_ar,
      workspace_type: workspaceData.workspace_type || 'user',
      privacy_level: workspaceData.privacy_level || 'private',
      owner_id: user.id,
      innovation_team_id: workspaceData.innovation_team_id,
      parent_workspace_id: workspaceData.parent_workspace_id,
      organization_id: workspaceData.organization_id,
      department_id: workspaceData.department_id,
      deputy_id: workspaceData.deputy_id,
      sector_id: workspaceData.sector_id,
      settings: workspaceData.settings || {},
      features_enabled: workspaceData.features_enabled || {},
      access_rules: workspaceData.access_rules || {},
      avatar_url: workspaceData.avatar_url,
      banner_url: workspaceData.banner_url,
      tags: workspaceData.tags,
      metadata: workspaceData.metadata || {}
    };

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert(insertData)
      .select()
      .maybeSingle();

    if (error) throw error;

    // Add creator as admin member
    await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'admin',
        access_level: 'admin',
        permissions: { all: true }
      });

    // Refresh workspaces
    await refreshWorkspaces();

    return workspace as Workspace;
  };

  // Update workspace
  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>) => {
    const { error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId);

    if (error) throw error;

    // Refresh workspaces
    await refreshWorkspaces();
  };

  // Invite member to workspace
  const inviteMember = async (workspaceId: string, email: string, role: string) => {
    const { error } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email,
        role,
        invited_by: user?.id
      });

    if (error) throw error;
  };

  // Update member role
  const updateMemberRole = async (memberId: string, newRole: string) => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) throw error;

    // Refresh members
    await refreshMembers();
  };

  // Remove member from workspace
  const removeMember = async (memberId: string) => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ status: 'inactive' })
      .eq('id', memberId);

    if (error) throw error;

    // Refresh members
    await refreshMembers();
  };

  // Check if user has access to workspace type
  const hasWorkspaceAccess = (workspaceType: WorkspaceType, requiredRoles?: string[]): boolean => {
    if (!userWorkspaceContext) return false;

    // Check if user has workspace of this type
    const hasWorkspaceType = userWorkspaceContext.workspaces.some(w => w.workspace_type === workspaceType);

    // Check if user has required roles
    const hasRequiredRoles = !requiredRoles || requiredRoles.some(role => 
      userWorkspaceContext.roles.includes(role)
    );

    return hasWorkspaceType || hasRequiredRoles;
  };

  // Get workspaces by type
  const getWorkspacesByType = (workspaceType: WorkspaceType): Workspace[] => {
    return userWorkspaces.filter(w => w.workspace_type === workspaceType);
  };

  // Get current user's role in current workspace
  const getCurrentUserRole = (): string | null => {
    if (!currentWorkspace || !userWorkspaceContext) return null;

    const workspaceContext = userWorkspaceContext.workspaces.find(
      w => w.workspace_id === currentWorkspace.id
    );

    return workspaceContext?.member_role || null;
  };

  // Effects
  useEffect(() => {
    refreshWorkspaces();
  }, [user]);

  useEffect(() => {
    refreshMembers();
  }, [currentWorkspace]);

  // Real-time subscriptions for workspace changes
  useEffect(() => {
    if (!user) return;

    const workspaceSubscription = supabase
      .channel('workspace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspaces'
        },
        () => {
          refreshWorkspaces();
        }
      )
      .subscribe();

    const memberSubscription = supabase
      .channel('member-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspace_members'
        },
        () => {
          refreshMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(workspaceSubscription);
      supabase.removeChannel(memberSubscription);
    };
  }, [user, currentWorkspace]);

  // Get user role for current workspace
  const userRole = getCurrentUserRole();
  
  const value: WorkspaceContextType = {
    currentWorkspace,
    currentWorkspaceMembers,
    userWorkspaceContext,
    userWorkspaces,
    loading,
    membersLoading,
    userRole,
    sidebarCollapsed,
    activeView,
    isConnected: realtime.isConnected,
    onlineMembers: realtime.onlineMembers.map(member => ({
      id: member.id,
      workspace_id: currentWorkspace?.id || '',
      user_id: member.user_id,
      role: 'member',
      permissions: {},
      access_level: 'standard' as const,
      status: member.status as 'active',
      invited_by: undefined,
      joined_at: new Date().toISOString(),
      last_active_at: member.last_active,
      notification_preferences: {},
      workspace_settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })),
    setCurrentWorkspace,
    switchWorkspace,
    refreshWorkspaces,
    refreshMembers,
    setActiveView,
    createWorkspace,
    updateWorkspace,
    inviteMember,
    updateMemberRole,
    removeMember,
    hasWorkspaceAccess,
    getWorkspacesByType,
    getCurrentUserRole,
    realtime,
    chat,
    documents,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};