# 🔐 **WORKSPACE MULTI-ROLE RBAC SPECIFICATION**
*Complete specification for multi-role user access and workspace navigation*

## 🎯 **Overview**

This document provides comprehensive specifications for handling users with multiple roles across different workspaces, ensuring proper RBAC implementation, dynamic navigation, and seamless workspace switching.

---

## 🧭 **Multi-Role Navigation System**

### **Workspace Access Hierarchy**
```typescript
// Priority-based workspace access for users with multiple roles
const WORKSPACE_ACCESS_HIERARCHY = {
  'super_admin': ['admin', 'organization', 'manager', 'expert', 'user'],
  'admin': ['admin', 'organization', 'manager', 'expert', 'user'], 
  'organization_admin': ['organization', 'manager', 'admin', 'expert', 'user'],
  'entity_manager': ['organization', 'manager', 'expert', 'user'],
  'deputy_manager': ['organization', 'manager', 'expert', 'user'],
  'manager': ['manager', 'expert', 'user'],
  'team_lead': ['manager', 'expert', 'user'],
  'project_manager': ['manager', 'expert', 'user'],
  'coordinator': ['coordinator', 'manager', 'expert', 'user'],
  'event_coordinator': ['coordinator', 'expert', 'user'],
  'analyst': ['analyst', 'expert', 'user'],
  'data_analyst': ['analyst', 'expert', 'user'],
  'business_analyst': ['analyst', 'manager', 'expert', 'user'],
  'content_manager': ['content', 'expert', 'user'],
  'challenge_manager': ['content', 'manager', 'expert', 'user'],
  'research_lead': ['content', 'analyst', 'expert', 'user'],
  'expert': ['expert', 'user'],
  'evaluator': ['expert', 'user'],
  'consultant': ['expert', 'user'],
  'partner': ['partner', 'user'],
  'external_partner': ['partner', 'user'],
  'innovator': ['user'],
  'stakeholder': ['user']
} as const;
```

### **Dynamic Workspace Resolution**
```typescript
export const resolveUserWorkspaces = (userRoles: string[]): {
  availableWorkspaces: WorkspaceType[];
  defaultWorkspace: WorkspaceType;
  workspacePriority: WorkspaceType[];
} => {
  const workspaceSet = new Set<WorkspaceType>();
  let highestPriorityRole = 'innovator';
  
  // Determine highest priority role
  const rolePriority = ['super_admin', 'admin', 'organization_admin', 'entity_manager', 'deputy_manager', 'manager', 'team_lead', 'project_manager', 'coordinator', 'analyst', 'content_manager', 'expert', 'partner', 'innovator'];
  
  for (const role of rolePriority) {
    if (userRoles.includes(role)) {
      highestPriorityRole = role;
      break;
    }
  }
  
  // Add all accessible workspaces
  userRoles.forEach(role => {
    const accessibleWorkspaces = WORKSPACE_ACCESS_HIERARCHY[role] || ['user'];
    accessibleWorkspaces.forEach(ws => workspaceSet.add(ws));
  });
  
  const availableWorkspaces = Array.from(workspaceSet);
  const workspacePriority = WORKSPACE_ACCESS_HIERARCHY[highestPriorityRole] || ['user'];
  const defaultWorkspace = workspacePriority.find(ws => availableWorkspaces.includes(ws)) || 'user';
  
  return {
    availableWorkspaces,
    defaultWorkspace,
    workspacePriority: workspacePriority.filter(ws => availableWorkspaces.includes(ws))
  };
};
```

---

## 🎛️ **Dynamic Sidebar Configuration**

### **Workspace Switcher Component**
```typescript
interface WorkspaceSwitcherConfig {
  currentWorkspace: WorkspaceType;
  availableWorkspaces: WorkspaceType[];
  userRoles: string[];
  onWorkspaceSwitch: (workspace: WorkspaceType) => void;
  workspaceNotifications: Record<WorkspaceType, number>;
}

export const generateWorkspaceSwitcher = (config: WorkspaceSwitcherConfig) => {
  const { currentWorkspace, availableWorkspaces, userRoles, workspaceNotifications } = config;
  
  return availableWorkspaces.map(workspace => {
    const notificationCount = workspaceNotifications[workspace] || 0;
    const hasAccess = hasWorkspaceAccess(workspace, userRoles);
    const isActive = workspace === currentWorkspace;
    
    return {
      type: workspace,
      label: `workspace.${workspace}.title`,
      description: `workspace.${workspace}.description`,
      icon: getWorkspaceIcon(workspace),
      isActive,
      hasAccess,
      notificationCount,
      badge: notificationCount > 0 ? String(notificationCount) : undefined,
      onClick: () => config.onWorkspaceSwitch(workspace)
    };
  });
};
```

### **Context-Aware Navigation**
```typescript
export const getWorkspaceNavigationItems = (
  workspaceType: WorkspaceType, 
  userRoles: string[]
): NavigationItem[] => {
  const baseNavigation = getBaseWorkspaceNavigation(workspaceType);
  
  // Add role-specific navigation items
  const roleBasedItems = userRoles.flatMap(role => 
    getRoleSpecificNavigation(role, workspaceType)
  );
  
  // Add cross-workspace quick actions for multi-role users
  const crossWorkspaceActions = userRoles.length > 1 
    ? getCrossWorkspaceQuickActions(userRoles)
    : [];
  
  return [
    ...baseNavigation,
    ...roleBasedItems,
    ...(crossWorkspaceActions.length > 0 ? [{ type: 'separator' }] : []),
    ...crossWorkspaceActions
  ].filter(Boolean);
};
```

---

## 🔒 **Enhanced RBAC Implementation**

### **Multi-Role Permission Hook**
```typescript
export const useEnhancedWorkspacePermissions = () => {
  const { userRoles, hasRole, hasAnyRole } = useRoleAccess();
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>('user');
  
  const workspacePermissions = useMemo(() => {
    const permissions: Record<WorkspaceType, WorkspacePermissions> = {
      user: {
        canRead: true,
        canWrite: true,
        canDelete: hasRole('innovator'),
        canModerate: false,
        canInvite: false,
        canExport: false
      },
      expert: {
        canRead: hasAnyRole(['expert', 'evaluator', 'consultant']),
        canWrite: hasAnyRole(['expert', 'evaluator', 'consultant']),
        canDelete: hasAnyRole(['senior_expert', 'lead_evaluator']),
        canModerate: hasAnyRole(['senior_expert', 'expert_moderator']),
        canInvite: hasAnyRole(['senior_expert', 'lead_evaluator']),
        canExport: hasAnyRole(['expert', 'evaluator', 'consultant'])
      },
      manager: {
        canRead: hasAnyRole(['manager', 'team_lead', 'project_manager']),
        canWrite: hasAnyRole(['manager', 'team_lead', 'project_manager']),
        canDelete: hasAnyRole(['manager', 'senior_manager']),
        canModerate: hasAnyRole(['manager', 'team_lead']),
        canInvite: hasAnyRole(['manager', 'team_lead', 'project_manager']),
        canExport: hasAnyRole(['manager', 'team_lead', 'project_manager'])
      },
      organization: {
        canRead: hasAnyRole(['organization_admin', 'entity_manager', 'deputy_manager']),
        canWrite: hasAnyRole(['organization_admin', 'entity_manager']),
        canDelete: hasRole('organization_admin'),
        canModerate: hasAnyRole(['organization_admin', 'entity_manager']),
        canInvite: hasAnyRole(['organization_admin', 'entity_manager', 'deputy_manager']),
        canExport: hasAnyRole(['organization_admin', 'entity_manager', 'deputy_manager'])
      },
      admin: {
        canRead: hasAnyRole(['admin', 'super_admin']),
        canWrite: hasAnyRole(['admin', 'super_admin']),
        canDelete: hasAnyRole(['admin', 'super_admin']),
        canModerate: hasAnyRole(['admin', 'super_admin']),
        canInvite: hasAnyRole(['admin', 'super_admin']),
        canExport: hasAnyRole(['admin', 'super_admin'])
      },
      // ... other workspace permissions
    };
    
    return permissions;
  }, [userRoles, hasRole, hasAnyRole]);
  
  const getCurrentWorkspacePermissions = useCallback(() => {
    return workspacePermissions[currentWorkspace] || workspacePermissions.user;
  }, [currentWorkspace, workspacePermissions]);
  
  return {
    workspacePermissions,
    getCurrentWorkspacePermissions,
    canAccessWorkspace: (workspace: WorkspaceType) => workspacePermissions[workspace]?.canRead || false,
    hasPermissionInWorkspace: (workspace: WorkspaceType, permission: keyof WorkspacePermissions) => 
      workspacePermissions[workspace]?.[permission] || false
  };
};
```

---

## 🗃️ **Database Enhancements**

### **User Workspace Preferences**
```sql
CREATE TABLE public.user_workspace_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    default_workspace VARCHAR(50) NOT NULL DEFAULT 'user',
    workspace_order JSONB DEFAULT '[]', -- Custom sidebar order
    pinned_workspaces JSONB DEFAULT '[]', -- User's pinned workspaces
    workspace_settings JSONB DEFAULT '{}', -- Per-workspace UI settings
    notification_preferences JSONB DEFAULT '{}', -- Cross-workspace notifications
    auto_switch_enabled BOOLEAN DEFAULT false, -- Auto-switch on role change
    last_accessed_workspaces JSONB DEFAULT '{}', -- Timestamp tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_workspace_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their workspace preferences"
ON public.user_workspace_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### **Workspace Access Audit**
```sql
CREATE TABLE public.workspace_access_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    workspace_type VARCHAR(50) NOT NULL,
    access_method VARCHAR(50) NOT NULL, -- 'direct', 'switch', 'deep_link'
    user_roles JSONB NOT NULL, -- Snapshot of user roles at access time
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    duration_seconds INTEGER, -- Time spent in workspace
    actions_performed JSONB DEFAULT '{}', -- Actions taken during session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.workspace_access_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view workspace access audit"
ON public.workspace_access_audit FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Users can view their own access history"
ON public.workspace_access_audit FOR SELECT
USING (user_id = auth.uid());
```

---

## 🔄 **Routing & Navigation Logic**

### **Workspace Route Handler**
```typescript
export const useWorkspaceRouting = () => {
  const { userRoles } = useRoleAccess();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { availableWorkspaces, defaultWorkspace } = useMemo(() => 
    resolveUserWorkspaces(userRoles), [userRoles]
  );
  
  const navigateToWorkspace = useCallback((workspace: WorkspaceType, preserveState = true) => {
    const hasAccess = availableWorkspaces.includes(workspace);
    
    if (!hasAccess) {
      console.warn(`User does not have access to workspace: ${workspace}`);
      navigate(`/workspace/${defaultWorkspace}`);
      return false;
    }
    
    // Preserve current route context if requested
    const currentPath = location.pathname;
    const contextPath = preserveState && currentPath.includes('/workspace/') 
      ? currentPath.split('/workspace/')[1]?.split('/').slice(1).join('/') 
      : '';
    
    const targetPath = contextPath 
      ? `/workspace/${workspace}/${contextPath}`
      : `/workspace/${workspace}`;
    
    navigate(targetPath);
    return true;
  }, [availableWorkspaces, defaultWorkspace, navigate, location]);
  
  return {
    availableWorkspaces,
    defaultWorkspace,
    navigateToWorkspace,
    canAccessWorkspace: (workspace: WorkspaceType) => availableWorkspaces.includes(workspace)
  };
};
```

### **Route Protection Component**
```typescript
export const WorkspaceRouteGuard: React.FC<{
  children: React.ReactNode;
  requiredWorkspace: WorkspaceType;
  fallbackWorkspace?: WorkspaceType;
}> = ({ children, requiredWorkspace, fallbackWorkspace }) => {
  const { canAccessWorkspace, navigateToWorkspace, defaultWorkspace } = useWorkspaceRouting();
  
  useEffect(() => {
    if (!canAccessWorkspace(requiredWorkspace)) {
      const fallback = fallbackWorkspace || defaultWorkspace;
      navigateToWorkspace(fallback, false);
    }
  }, [requiredWorkspace, canAccessWorkspace, navigateToWorkspace, fallbackWorkspace, defaultWorkspace]);
  
  if (!canAccessWorkspace(requiredWorkspace)) {
    return <div>Redirecting...</div>;
  }
  
  return <>{children}</>;
};
```

---

## 🔔 **Cross-Workspace Notifications**

### **Notification Context Manager**
```typescript
export const useCrossWorkspaceNotifications = () => {
  const { userRoles } = useRoleAccess();
  const { availableWorkspaces } = useWorkspaceRouting();
  
  const [notifications, setNotifications] = useState<Record<WorkspaceType, number>>({});
  
  useEffect(() => {
    // Subscribe to notifications for all accessible workspaces
    const subscriptions = availableWorkspaces.map(workspace => {
      return supabase
        .channel(`workspace-notifications-${workspace}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'workspace_notifications',
          filter: `workspace_type=eq.${workspace}`
        }, (payload) => {
          setNotifications(prev => ({
            ...prev,
            [workspace]: (prev[workspace] || 0) + 1
          }));
        })
        .subscribe();
    });
    
    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [availableWorkspaces]);
  
  return {
    notifications,
    clearWorkspaceNotifications: (workspace: WorkspaceType) => {
      setNotifications(prev => ({ ...prev, [workspace]: 0 }));
    },
    getTotalNotifications: () => Object.values(notifications).reduce((sum, count) => sum + count, 0)
  };
};
```

---

## ✅ **Implementation Confirmation**

**CONFIRMED: The workspace documentation now properly addresses:**

1. ✅ **Multi-Role Support**: Users can have multiple roles simultaneously
2. ✅ **Dynamic Workspace Access**: Workspaces are shown based on ALL user roles  
3. ✅ **Intelligent Routing**: Priority-based workspace resolution for users with multiple permissions
4. ✅ **Contextual Sidebar**: Dynamic navigation that adapts to user's role combinations
5. ✅ **Cross-Workspace Features**: Notifications, data access, and seamless switching
6. ✅ **RBAC Integration**: Comprehensive permission system that accounts for role combinations

The implementation will now properly handle users with multiple roles and provide appropriate workspace access based on their complete role set.
