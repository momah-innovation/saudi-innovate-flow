import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import { useUserWorkspaceData } from '@/hooks/useUserWorkspaceData';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useWorkspaceRealtime } from '@/hooks/useWorkspaceRealtime';
import { useWorkspaceNotifications } from '@/hooks/useWorkspaceNotifications';
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics';
import { useWorkspaceTranslations } from '@/hooks/useWorkspaceTranslations';
import type { WorkspaceType, Workspace, WorkspaceMember } from '@/types/workspace';

interface WorkspaceState {
  // Current workspace
  currentWorkspace: Workspace | null;
  currentWorkspaceType: WorkspaceType | null;
  userRole: string | null;
  permissions: Record<string, boolean>;
  
  // Data state
  isLoading: boolean;
  error: string | null;
  
  // Real-time state
  isConnected: boolean;
  onlineMembers: WorkspaceMember[];
  
  // UI state
  sidebarCollapsed: boolean;
  activeView: string;
  filters: Record<string, any>;
  preferences: Record<string, any>;
}

interface WorkspaceActions {
  // Workspace management
  setCurrentWorkspace: (workspace: Workspace, workspaceType: WorkspaceType) => void;
  switchWorkspace: (workspaceId: string, workspaceType: WorkspaceType) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  
  // UI actions
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;
  updateFilters: (filters: Record<string, any>) => void;
  updatePreferences: (preferences: Record<string, any>) => void;
  
  // Real-time actions
  sendMessage: (content: string, channelId?: string) => Promise<void>;
  updatePresence: (status: string, metadata?: Record<string, any>) => Promise<void>;
  
  // Analytics actions
  trackEvent: (eventType: string, metadata?: Record<string, any>) => Promise<void>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type WorkspaceAction = 
  | { type: 'SET_WORKSPACE'; payload: { workspace: Workspace; workspaceType: WorkspaceType; userRole: string; permissions: Record<string, boolean> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ONLINE_MEMBERS'; payload: WorkspaceMember[] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_VIEW'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Record<string, any> }
  | { type: 'UPDATE_PREFERENCES'; payload: Record<string, any> }
  | { type: 'RESET_STATE' };

const initialState: WorkspaceState = {
  currentWorkspace: null,
  currentWorkspaceType: null,
  userRole: null,
  permissions: {},
  isLoading: false,
  error: null,
  isConnected: false,
  onlineMembers: [],
  sidebarCollapsed: false,
  activeView: 'dashboard',
  filters: {},
  preferences: {}
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload.workspace,
        currentWorkspaceType: action.payload.workspaceType,
        userRole: action.payload.userRole,
        permissions: action.payload.permissions,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload
      };
    
    case 'SET_ONLINE_MEMBERS':
      return {
        ...state,
        onlineMembers: action.payload
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    
    case 'SET_ACTIVE_VIEW':
      return {
        ...state,
        activeView: action.payload
      };
    
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

interface WorkspaceContextValue extends WorkspaceState, WorkspaceActions {
  // Hook integrations
  translations: ReturnType<typeof useWorkspaceTranslations>;
  notifications: ReturnType<typeof useWorkspaceNotifications>;
  analytics: ReturnType<typeof useWorkspaceAnalytics>;
  realTime: ReturnType<typeof useWorkspaceRealtime>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: React.ReactNode;
  defaultWorkspaceType?: WorkspaceType;
  defaultWorkspaceId?: string;
}

export function WorkspaceProvider({ 
  children, 
  defaultWorkspaceType = 'user',
  defaultWorkspaceId 
}: WorkspaceProviderProps) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Mock workspace data for now
  const userWorkspaceData = { workspaces: [] };
  const workspaceLoading = false;

  // Current workspace from user data
  const currentWorkspace = userWorkspaceData?.workspaces?.[0] || null;
  
  // Loading state
  const loading = workspaceLoading;

  // Initialize other hooks conditionally
  const translations = useWorkspaceTranslations({
    workspaceType: state.currentWorkspaceType || defaultWorkspaceType,
    dynamicContent: true
  });

  const notifications = useWorkspaceNotifications({
    workspaceType: state.currentWorkspaceType || defaultWorkspaceType,
    workspaceId: currentWorkspace?.id || defaultWorkspaceId || '',
    realTimeUpdates: true
  });

  const analytics = useWorkspaceAnalytics({
    workspaceType: state.currentWorkspaceType || defaultWorkspaceType,
    workspaceId: currentWorkspace?.id || defaultWorkspaceId || '',
    realTimeUpdates: true
  });

  const realTime = useWorkspaceRealtime({
    workspaceId: currentWorkspace?.id,
    enabled: !!currentWorkspace
  });

  // Sync loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  // Sync connection state
  useEffect(() => {
    dispatch({ type: 'SET_CONNECTED', payload: realTime.isConnected });
  }, [realTime.isConnected]);

  // Sync online members
  useEffect(() => {
    const members = realTime.onlineMembers.map(member => ({
      id: member.id,
      user_id: member.user_id,
      workspace_id: currentWorkspace?.id || '',
      role: 'member',
      permissions: [],
      access_level: 'read',
      status: member.status || 'active',
      joined_at: new Date().toISOString(),
      last_active: member.last_active || new Date().toISOString(),
      name: member.name,
      email: '',
      avatar_url: null
    })) as WorkspaceMember[];
    
    dispatch({ type: 'SET_ONLINE_MEMBERS', payload: members });
  }, [realTime.onlineMembers, currentWorkspace?.id]);

  // Workspace management actions
  const setCurrentWorkspace = useCallback((workspace: Workspace, workspaceType: WorkspaceType) => {
    const userRole = 'member'; // This would be determined from workspace membership
    const permissions = {
      canView: true,
      canEdit: true,
      canManage: false,
      canInvite: false
    }; // This would be calculated based on role

    dispatch({
      type: 'SET_WORKSPACE',
      payload: { workspace, workspaceType, userRole, permissions }
    });
  }, []);

  const switchWorkspace = useCallback(async (workspaceId: string, workspaceType: WorkspaceType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // This would load the new workspace data
      // For now, we'll simulate it
      const workspace: Workspace = {
        id: workspaceId,
        name: `${workspaceType} Workspace`,
        workspace_type: workspaceType,
        privacy_level: 'private',
        status: 'active',
        owner_id: user?.id || '',
        settings: {},
        features_enabled: {},
        access_rules: {},
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      };

      setCurrentWorkspace(workspace, workspaceType);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to switch workspace' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user?.id, setCurrentWorkspace]);

  const refreshWorkspace = useCallback(async () => {
    if (state.currentWorkspace && state.currentWorkspaceType) {
      await switchWorkspace(state.currentWorkspace.id, state.currentWorkspaceType);
    }
  }, [state.currentWorkspace, state.currentWorkspaceType, switchWorkspace]);

  // UI actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setActiveView = useCallback((view: string) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);

  const updateFilters = useCallback((filters: Record<string, any>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  }, []);

  const updatePreferences = useCallback((preferences: Record<string, any>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  }, []);

  // Real-time actions
  const sendMessage = useCallback(async (content: string, channelId?: string) => {
    console.log('Sending message:', content, channelId);
    // Implementation would go here
  }, []);

  const updatePresence = useCallback(async (status: string, metadata?: Record<string, any>) => {
    return realTime.updatePresence(status as any, metadata);
  }, [realTime]);

  // Analytics actions
  const trackEvent = useCallback(async (eventType: string, metadata?: Record<string, any>) => {
    return analytics.trackEvent({
      eventType,
      metadata
    });
  }, [analytics]);

  // Error handling
  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Initialize default workspace if user is authenticated
  useEffect(() => {
    if (user && !state.currentWorkspace && defaultWorkspaceId) {
      switchWorkspace(defaultWorkspaceId, defaultWorkspaceType);
    }
  }, [user, state.currentWorkspace, defaultWorkspaceId, defaultWorkspaceType, switchWorkspace]);

  // Reset state when user logs out
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [user]);

  const contextValue: WorkspaceContextValue = {
    // State
    ...state,
    currentWorkspace,
    
    // Actions
    setCurrentWorkspace,
    switchWorkspace,
    refreshWorkspace,
    toggleSidebar,
    setActiveView,
    updateFilters,
    updatePreferences,
    sendMessage,
    updatePresence,
    trackEvent,
    setError,
    clearError,
    
    // Hook integrations
    translations,
    notifications,
    analytics,
    realTime
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}