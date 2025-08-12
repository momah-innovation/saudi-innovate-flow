# 🔧 **WORKSPACE SYSTEM IMPLEMENTATION GUIDE**
*Step-by-step implementation instructions for the Workspace Interface System*

## 🎯 **Implementation Overview**

This guide provides detailed step-by-step instructions for implementing the comprehensive workspace system with role-based access, real-time collaboration, and enhanced user experiences.

---

## 📋 **Pre-Implementation Checklist**

### **Prerequisites Verification**
- [ ] **Database Schema**: All workspace-related tables and RLS policies implemented
- [ ] **Authentication System**: User authentication and role management functional
- [ ] **Collaboration Context**: Real-time collaboration infrastructure available
- [ ] **Design System**: Semantic tokens and styling framework ready
- [ ] **TypeScript Configuration**: Type definitions for workspace interfaces

### **Required Dependencies**
```json
{
  "@tanstack/react-query": "^5.56.2",
  "@supabase/supabase-js": "^2.52.1",
  "lucide-react": "^0.462.0",
  "date-fns": "^3.6.0",
  "recharts": "^3.1.0",
  "react-router-dom": "^6.26.2"
}
```

---

## 🏗️ **Phase 1: Core Infrastructure Setup**

### **Step 1.1: Enhanced Workspace Layout Component**

Create the enhanced workspace layout that supports all workspace types:

```typescript
// src/components/workspace/EnhancedWorkspaceLayout.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

interface EnhancedWorkspaceLayoutProps {
  title: string;
  description?: string;
  userRole: string;
  workspaceType: 'user' | 'expert' | 'manager' | 'coordinator' | 'analyst' | 'content' | 'organization' | 'partner';
  stats: WorkspaceStats[];
  quickActions: QuickAction[];
  children: React.ReactNode;
  className?: string;
  entityId?: string;
  realTimeConfig?: RealTimeConfig;
}

interface WorkspaceStats {
  id: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  disabled?: boolean;
}

interface RealTimeConfig {
  enablePresence: boolean;
  enableActivity: boolean;
  enableChat: boolean;
  contextScope: 'private' | 'team' | 'department' | 'organization' | 'public';
}

export const EnhancedWorkspaceLayout: React.FC<EnhancedWorkspaceLayoutProps> = ({
  title,
  description,
  userRole,
  workspaceType,
  stats,
  quickActions,
  children,
  className,
  entityId,
  realTimeConfig
}) => {
  const { t, isRTL } = useUnifiedTranslation();

  // Workspace-specific styling
  const getWorkspaceTheme = (type: string) => {
    const themes = {
      user: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      expert: 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      manager: 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      organization: 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20',
      coordinator: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      analyst: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20',
      content: 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      partner: 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20'
    };
    return themes[type] || themes.user;
  };

  const renderStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {stat.icon}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              {stat.change && (
                <Badge 
                  variant={stat.change.type === 'increase' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderQuickActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t('workspace.quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              onClick={action.action}
              disabled={action.disabled}
              className="h-12 justify-start space-x-2 rtl:space-x-reverse"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${getWorkspaceTheme(workspaceType)} ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {userRole}
            </Badge>
          </div>
        </div>

        {/* Stats Section */}
        {stats.length > 0 && renderStats()}

        {/* Quick Actions */}
        {quickActions.length > 0 && renderQuickActions()}

        {/* Main Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Real-time Collaboration Integration */}
        {realTimeConfig && (
          <WorkspaceCollaboration
            workspaceType={workspaceType}
            entityId={entityId}
            showWidget={true}
            showPresence={realTimeConfig.enablePresence}
            showActivity={realTimeConfig.enableActivity}
          />
        )}
      </div>
    </div>
  );
};
```

### **Step 1.2: Enhanced Workspace Permissions Hook**

Update the permissions hook to support all workspace types:

```typescript
// src/hooks/useWorkspacePermissions.ts (Enhancement)
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface WorkspacePermissions {
  // Existing permissions...
  
  // Enhanced workspace permissions
  canAccessUserWorkspace: boolean;
  canAccessExpertWorkspace: boolean;
  canAccessManagerWorkspace: boolean;
  canAccessCoordinatorWorkspace: boolean;
  canAccessAnalystWorkspace: boolean;
  canAccessContentWorkspace: boolean;
  canAccessOrganizationWorkspace: boolean;
  canAccessPartnerWorkspace: boolean;
  
  // Collaboration permissions
  canUseRealTimeFeatures: boolean;
  canAccessSecureMessaging: boolean;
  canShareDocuments: boolean;
  canModerateChats: boolean;
  canAccessAnalytics: boolean;
  canExportData: boolean;
  canInviteUsers: boolean;
  canManageWorkspaceSettings: boolean;
}

export const useWorkspacePermissions = (): WorkspacePermissions => {
  const { user } = useAuth();
  const { 
    hasRole, 
    hasAnyRole, 
    isAdmin, 
    isSuperAdmin, 
    isTeamMember,
    isExpert,
    isPartner,
    userRoles 
  } = useRoleAccess();

  return useMemo(() => {
    const isAuthenticated = !!user;
    
    // Base permissions for all authenticated users
    const basePermissions = {
      canAccessUserWorkspace: isAuthenticated,
      canUseRealTimeFeatures: isAuthenticated,
    };

    // Expert workspace permissions
    const expertPermissions = {
      canAccessExpertWorkspace: isExpert || hasAnyRole(['expert', 'evaluator', 'consultant']),
      canAccessSecureMessaging: isExpert || isTeamMember || isAdmin,
    };

    // Management workspace permissions
    const managementPermissions = {
      canAccessManagerWorkspace: hasAnyRole(['manager', 'team_lead', 'project_manager']) || isAdmin,
      canAccessCoordinatorWorkspace: hasAnyRole(['coordinator', 'event_coordinator']) || isAdmin,
      canAccessAnalystWorkspace: hasAnyRole(['analyst', 'data_analyst', 'business_analyst']) || isAdmin,
    };

    // Content management permissions
    const contentPermissions = {
      canAccessContentWorkspace: hasAnyRole(['content_manager', 'challenge_manager', 'research_lead']) || isAdmin,
      canShareDocuments: isTeamMember || isExpert || isAdmin,
      canModerateChats: hasAnyRole(['manager', 'coordinator', 'moderator']) || isAdmin,
    };

    // Organization-level permissions
    const organizationPermissions = {
      canAccessOrganizationWorkspace: hasAnyRole(['organization_admin', 'entity_manager', 'deputy_manager']) || isSuperAdmin,
      canAccessAnalytics: hasAnyRole(['analyst', 'manager', 'organization_admin']) || isAdmin,
      canExportData: hasAnyRole(['analyst', 'manager', 'admin']),
      canInviteUsers: hasAnyRole(['manager', 'coordinator', 'organization_admin']) || isAdmin,
      canManageWorkspaceSettings: hasAnyRole(['manager', 'organization_admin']) || isAdmin,
    };

    // Partner workspace permissions
    const partnerPermissions = {
      canAccessPartnerWorkspace: isPartner || hasRole('partner') || isAdmin,
    };

    return {
      ...basePermissions,
      ...expertPermissions,
      ...managementPermissions,
      ...contentPermissions,
      ...organizationPermissions,
      ...partnerPermissions,
    };
  }, [user, hasRole, hasAnyRole, isAdmin, isSuperAdmin, isTeamMember, isExpert, isPartner, userRoles]);
};
```

### **Step 1.3: Workspace Data Management Hook**

Create a unified hook for workspace data management:

```typescript
// src/hooks/useEnhancedWorkspaceData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type WorkspaceType = 'user' | 'expert' | 'manager' | 'coordinator' | 'analyst' | 'content' | 'organization' | 'partner';

interface WorkspaceDataConfig {
  workspaceType: WorkspaceType;
  userId?: string;
  entityId?: string;
  enableRealTime?: boolean;
  refreshInterval?: number;
}

export const useEnhancedWorkspaceData = ({
  workspaceType,
  userId,
  entityId,
  enableRealTime = true,
  refreshInterval = 60000
}: WorkspaceDataConfig) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currentUserId = userId || user?.id;

  // Main data query
  const {
    data: workspaceData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workspace-data', workspaceType, currentUserId, entityId],
    queryFn: () => fetchWorkspaceData(workspaceType, currentUserId, entityId),
    enabled: !!currentUserId,
    staleTime: getStaleTime(workspaceType),
    refetchInterval: refreshInterval,
    refetchOnWindowFocus: workspaceType === 'manager' || workspaceType === 'coordinator'
  });

  // Real-time subscription
  useEffect(() => {
    if (!enableRealTime || !currentUserId || !workspaceData) return;

    const relevantTables = getRelevantTables(workspaceType);
    const channels = relevantTables.map(table => {
      return supabase
        .channel(`workspace-${workspaceType}-${table}-${currentUserId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter: getTableFilter(workspaceType, table, currentUserId)
        }, (payload) => {
          console.log(`Real-time update for ${table}:`, payload);
          queryClient.invalidateQueries({
            queryKey: ['workspace-data', workspaceType, currentUserId]
          });
        })
        .subscribe();
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [workspaceType, currentUserId, enableRealTime, workspaceData, queryClient]);

  return {
    data: workspaceData,
    isLoading,
    error,
    refetch
  };
};

// Helper functions
const fetchWorkspaceData = async (workspaceType: WorkspaceType, userId: string, entityId?: string) => {
  switch (workspaceType) {
    case 'user':
      return fetchUserWorkspaceData(userId);
    case 'expert':
      return fetchExpertWorkspaceData(userId);
    case 'manager':
      return fetchManagerWorkspaceData(userId);
    case 'coordinator':
      return fetchCoordinatorWorkspaceData(userId);
    case 'analyst':
      return fetchAnalystWorkspaceData(userId);
    case 'content':
      return fetchContentWorkspaceData(userId);
    case 'organization':
      return fetchOrganizationWorkspaceData(userId);
    case 'partner':
      return fetchPartnerWorkspaceData(userId);
    default:
      throw new Error(`Unknown workspace type: ${workspaceType}`);
  }
};

const getRelevantTables = (workspaceType: WorkspaceType): string[] => {
  const tableMap = {
    user: ['ideas', 'challenge_participants', 'idea_bookmarks', 'events'],
    expert: ['ideas', 'idea_evaluations', 'expert_consultations', 'challenges'],
    manager: ['task_assignments', 'team_members', 'projects', 'team_activities'],
    coordinator: ['events', 'event_participants', 'campaigns', 'activities'],
    analyst: ['analytics_events', 'challenge_analytics', 'user_behavior', 'reports'],
    content: ['challenges', 'campaigns', 'content_items', 'tags'],
    organization: ['challenges', 'campaigns', 'departments', 'strategic_initiatives'],
    partner: ['partnerships', 'opportunities', 'collaborations', 'applications']
  };
  
  return tableMap[workspaceType] || [];
};

const getStaleTime = (workspaceType: WorkspaceType): number => {
  const staleTimeMap = {
    user: 5 * 60 * 1000,      // 5 minutes
    expert: 2 * 60 * 1000,    // 2 minutes
    manager: 1 * 60 * 1000,   // 1 minute
    coordinator: 2 * 60 * 1000, // 2 minutes
    analyst: 3 * 60 * 1000,   // 3 minutes
    content: 3 * 60 * 1000,   // 3 minutes
    organization: 10 * 60 * 1000, // 10 minutes
    partner: 5 * 60 * 1000    // 5 minutes
  };
  
  return staleTimeMap[workspaceType] || 5 * 60 * 1000;
};

const getTableFilter = (workspaceType: WorkspaceType, table: string, userId: string): string => {
  // Implement workspace-specific filters based on user access
  const filterMap = {
    user: `user_id=eq.${userId}`,
    expert: `expert_id=eq.${userId}`,
    manager: `manager_id=eq.${userId}`,
    // Add more specific filters based on workspace type and table
  };
  
  return filterMap[workspaceType] || `user_id=eq.${userId}`;
};

// Workspace-specific data fetching functions
const fetchUserWorkspaceData = async (userId: string) => {
  // Implementation for user workspace data
  // This should call the existing useUserWorkspaceData logic
};

const fetchExpertWorkspaceData = async (userId: string) => {
  // Implementation for expert workspace data
  // This should call the existing useExpertWorkspaceData logic
};

// ... implement other workspace data fetching functions
```

---

## 🏢 **Phase 2: Individual Workspace Implementation**

### **Step 2.1: Enhanced UserWorkspace**

Update the UserWorkspace component with enhanced features:

```typescript
// src/pages/workspace/UserWorkspace.tsx (Enhancement)
import React from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedWorkspaceLayout } from '@/components/workspace/EnhancedWorkspaceLayout';
import { useEnhancedWorkspaceData } from '@/hooks/useEnhancedWorkspaceData';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { UserWorkspaceContent } from '@/components/workspace/UserWorkspaceContent';
import { 
  Lightbulb, 
  Trophy, 
  Calendar, 
  BookMarked, 
  PlusCircle, 
  Search, 
  TrendingUp, 
  Users 
} from 'lucide-react';

interface UserWorkspaceProps {
  userId?: string;
}

export const UserWorkspace: React.FC<UserWorkspaceProps> = ({ userId }) => {
  const { t } = useUnifiedTranslation();
  const permissions = useWorkspacePermissions();
  
  const { data: workspaceData, isLoading, error } = useEnhancedWorkspaceData({
    workspaceType: 'user',
    userId,
    enableRealTime: true,
    refreshInterval: 60000
  });

  if (!permissions.canAccessUserWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('workspace.accessDenied')}</h2>
          <p className="text-muted-foreground">{t('workspace.userWorkspaceAccessRequired')}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('common.error')}</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      id: 'ideas',
      label: t('workspace.user.totalIdeas'),
      value: workspaceData?.ideasCount || 0,
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      change: workspaceData?.ideasChange
    },
    {
      id: 'challenges',
      label: t('workspace.user.challengesParticipated'),
      value: workspaceData?.challengesCount || 0,
      icon: <Trophy className="h-5 w-5 text-purple-500" />,
      change: workspaceData?.challengesChange
    },
    {
      id: 'events',
      label: t('workspace.user.eventsAttended'),
      value: workspaceData?.eventsCount || 0,
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      change: workspaceData?.eventsChange
    },
    {
      id: 'bookmarks',
      label: t('workspace.user.bookmarkedItems'),
      value: workspaceData?.bookmarksCount || 0,
      icon: <BookMarked className="h-5 w-5 text-orange-500" />,
      change: workspaceData?.bookmarksChange
    }
  ];

  const quickActions = [
    {
      id: 'create-idea',
      label: t('workspace.user.createNewIdea'),
      icon: <PlusCircle className="h-4 w-4" />,
      action: () => console.log('Create new idea'),
      variant: 'default' as const
    },
    {
      id: 'browse-challenges',
      label: t('workspace.user.browseChallenges'),
      icon: <Search className="h-4 w-4" />,
      action: () => console.log('Browse challenges'),
      variant: 'outline' as const
    },
    {
      id: 'view-analytics',
      label: t('workspace.user.viewMyAnalytics'),
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => console.log('View analytics'),
      variant: 'outline' as const
    },
    {
      id: 'connect-innovators',
      label: t('workspace.user.connectWithInnovators'),
      icon: <Users className="h-4 w-4" />,
      action: () => console.log('Connect with innovators'),
      variant: 'outline' as const
    }
  ];

  const realTimeConfig = {
    enablePresence: true,
    enableActivity: false,
    enableChat: false,
    contextScope: 'public' as const
  };

  return (
    <EnhancedWorkspaceLayout
      title={t('workspace.user.title')}
      description={t('workspace.user.description')}
      userRole={t('roles.user')}
      workspaceType="user"
      stats={stats}
      quickActions={quickActions}
      entityId={userId}
      realTimeConfig={realTimeConfig}
    >
      <UserWorkspaceContent 
        workspaceData={workspaceData}
        permissions={permissions}
      />
    </EnhancedWorkspaceLayout>
  );
};

export default UserWorkspace;
```

### **Step 2.2: Enhanced ExpertWorkspace**

Create the enhanced ExpertWorkspace component:

```typescript
// src/pages/workspace/ExpertWorkspace.tsx (Enhancement)
import React from 'react';
import { EnhancedWorkspaceLayout } from '@/components/workspace/EnhancedWorkspaceLayout';
import { useEnhancedWorkspaceData } from '@/hooks/useEnhancedWorkspaceData';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ExpertWorkspaceContent } from '@/components/workspace/ExpertWorkspaceContent';
import { 
  ClipboardCheck, 
  MessageSquare, 
  Star, 
  Clock, 
  FileText, 
  Users, 
  BarChart3, 
  Calendar 
} from 'lucide-react';

interface ExpertWorkspaceProps {
  expertId?: string;
}

export const ExpertWorkspace: React.FC<ExpertWorkspaceProps> = ({ expertId }) => {
  const { t } = useUnifiedTranslation();
  const permissions = useWorkspacePermissions();
  
  const { data: workspaceData, isLoading, error } = useEnhancedWorkspaceData({
    workspaceType: 'expert',
    userId: expertId,
    enableRealTime: true,
    refreshInterval: 30000 // More frequent updates for experts
  });

  if (!permissions.canAccessExpertWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('workspace.accessDenied')}</h2>
          <p className="text-muted-foreground">{t('workspace.expertWorkspaceAccessRequired')}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      id: 'pending-evaluations',
      label: t('workspace.expert.pendingEvaluations'),
      value: workspaceData?.pendingEvaluationsCount || 0,
      icon: <ClipboardCheck className="h-5 w-5 text-yellow-500" />,
      status: 'warning' as const
    },
    {
      id: 'completed-evaluations',
      label: t('workspace.expert.completedEvaluations'),
      value: workspaceData?.completedEvaluationsCount || 0,
      icon: <Star className="h-5 w-5 text-green-500" />,
      change: workspaceData?.evaluationsChange
    },
    {
      id: 'consultations',
      label: t('workspace.expert.activeConsultations'),
      value: workspaceData?.consultationsCount || 0,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'avg-response-time',
      label: t('workspace.expert.avgResponseTime'),
      value: workspaceData?.avgResponseTime || '0h',
      icon: <Clock className="h-5 w-5 text-purple-500" />
    }
  ];

  const quickActions = [
    {
      id: 'review-queue',
      label: t('workspace.expert.reviewEvaluationQueue'),
      icon: <ClipboardCheck className="h-4 w-4" />,
      action: () => console.log('Review evaluation queue'),
      variant: 'default' as const
    },
    {
      id: 'schedule-consultation',
      label: t('workspace.expert.scheduleConsultation'),
      icon: <Calendar className="h-4 w-4" />,
      action: () => console.log('Schedule consultation'),
      variant: 'outline' as const
    },
    {
      id: 'view-reports',
      label: t('workspace.expert.viewEvaluationReports'),
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => console.log('View reports'),
      variant: 'outline' as const
    },
    {
      id: 'knowledge-base',
      label: t('workspace.expert.manageKnowledgeBase'),
      icon: <FileText className="h-4 w-4" />,
      action: () => console.log('Manage knowledge base'),
      variant: 'outline' as const
    }
  ];

  const realTimeConfig = {
    enablePresence: true,
    enableActivity: true,
    enableChat: true,
    contextScope: 'team' as const
  };

  return (
    <EnhancedWorkspaceLayout
      title={t('workspace.expert.title')}
      description={t('workspace.expert.description')}
      userRole={t('roles.expert')}
      workspaceType="expert"
      stats={stats}
      quickActions={quickActions}
      entityId={expertId}
      realTimeConfig={realTimeConfig}
    >
      <ExpertWorkspaceContent 
        workspaceData={workspaceData}
        permissions={permissions}
      />
    </EnhancedWorkspaceLayout>
  );
};

export default ExpertWorkspace;
```

---

## 🤝 **Phase 3: Real-Time Collaboration Integration**

### **Step 3.1: Enhanced Collaboration Widget**

Update the collaboration widget to work seamlessly with workspaces:

```typescript
// src/components/collaboration/EnhancedCollaborationWidget.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Activity, 
  Minimize2, 
  Maximize2, 
  X,
  Settings
} from 'lucide-react';

interface EnhancedCollaborationWidgetProps {
  workspaceType: 'user' | 'expert' | 'manager' | 'coordinator' | 'analyst' | 'content' | 'organization' | 'partner';
  contextType: 'global' | 'organization' | 'team' | 'project' | 'direct';
  contextId: string;
  entityType?: string;
  entityId?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-right';
  enabledFeatures?: ('presence' | 'chat' | 'notifications' | 'activity')[];
  moderationLevel?: 'none' | 'basic' | 'strict';
}

export const EnhancedCollaborationWidget: React.FC<EnhancedCollaborationWidgetProps> = ({
  workspaceType,
  contextType,
  contextId,
  entityType,
  entityId,
  position = 'bottom-right',
  enabledFeatures = ['presence', 'chat', 'notifications'],
  moderationLevel = 'basic'
}) => {
  const { t } = useUnifiedTranslation();
  const { 
    onlineUsers, 
    messages, 
    notifications, 
    activities,
    isConnected,
    sendMessage,
    updatePresence,
    markAsRead
  } = useCollaboration();

  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('presence');
  const [isVisible, setIsVisible] = useState(true);

  // Workspace-specific feature configuration
  const getWorkspaceConfig = () => {
    const configs = {
      user: {
        allowedFeatures: ['presence', 'notifications'],
        defaultTab: 'presence',
        showModeration: false
      },
      expert: {
        allowedFeatures: ['presence', 'chat', 'notifications', 'activity'],
        defaultTab: 'chat',
        showModeration: true
      },
      manager: {
        allowedFeatures: ['presence', 'chat', 'notifications', 'activity'],
        defaultTab: 'activity',
        showModeration: true
      },
      organization: {
        allowedFeatures: ['presence', 'notifications'],
        defaultTab: 'notifications',
        showModeration: false
      }
    };
    
    return configs[workspaceType] || configs.user;
  };

  const config = getWorkspaceConfig();
  const activeFeatures = enabledFeatures.filter(feature => 
    config.allowedFeatures.includes(feature)
  );

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6'
  };

  if (!isVisible || !isConnected) return null;

  const renderPresenceTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{t('collaboration.onlineUsers')}</h4>
        <Badge variant="secondary">{onlineUsers.length}</Badge>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {onlineUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">{user.name}</span>
            {user.location && (
              <Badge variant="outline" className="text-xs">
                {user.location}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{t('collaboration.messages')}</h4>
        <Badge variant="secondary">{messages.length}</Badge>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {messages.slice(-10).map((message) => (
          <div key={message.id} className="p-2 bg-muted rounded text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{message.sender?.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder={t('collaboration.typeMessage')}
          className="flex-1 px-3 py-1 text-sm border rounded"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value, {
                type: contextType,
                id: contextId
              });
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{t('collaboration.notifications')}</h4>
        <Badge variant="secondary">
          {notifications.filter(n => !n.is_read).length}
        </Badge>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notifications.slice(0, 10).map((notification) => (
          <div 
            key={notification.id} 
            className={`p-2 rounded text-sm cursor-pointer hover:bg-muted ${
              !notification.is_read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-muted-foreground">{notification.message}</p>
              </div>
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{t('collaboration.recentActivity')}</h4>
        <Badge variant="secondary">{activities.length}</Badge>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="p-2 rounded text-sm">
            <div className="flex items-center space-x-2">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span>{activity.description}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={`fixed ${positionClasses[position]} w-80 shadow-lg z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-96'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="font-medium text-sm">
            {t(`workspace.${workspaceType}.collaboration`)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none">
              {activeFeatures.includes('presence') && (
                <TabsTrigger value="presence" className="text-xs">
                  <Users className="h-3 w-3" />
                </TabsTrigger>
              )}
              {activeFeatures.includes('chat') && (
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="h-3 w-3" />
                </TabsTrigger>
              )}
              {activeFeatures.includes('notifications') && (
                <TabsTrigger value="notifications" className="text-xs">
                  <Bell className="h-3 w-3" />
                </TabsTrigger>
              )}
              {activeFeatures.includes('activity') && (
                <TabsTrigger value="activity" className="text-xs">
                  <Activity className="h-3 w-3" />
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="p-3">
              {activeFeatures.includes('presence') && (
                <TabsContent value="presence" className="mt-0">
                  {renderPresenceTab()}
                </TabsContent>
              )}
              {activeFeatures.includes('chat') && (
                <TabsContent value="chat" className="mt-0">
                  {renderChatTab()}
                </TabsContent>
              )}
              {activeFeatures.includes('notifications') && (
                <TabsContent value="notifications" className="mt-0">
                  {renderNotificationsTab()}
                </TabsContent>
              )}
              {activeFeatures.includes('activity') && (
                <TabsContent value="activity" className="mt-0">
                  {renderActivityTab()}
                </TabsContent>
              )}
            </div>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};
```

---

## 🔐 **Phase 4: Security & Access Control Implementation**

### **Step 4.1: Data Isolation Enforcement**

Create middleware for workspace data isolation:

```typescript
// src/utils/workspaceDataIsolation.ts
interface DataIsolationPolicy {
  workspaceType: string;
  allowedTables: string[];
  restrictedTables: string[];
  dataFilters: Record<string, string>;
  crossWorkspaceAccess: boolean;
}

export const WORKSPACE_ISOLATION_POLICIES: Record<string, DataIsolationPolicy> = {
  user: {
    workspaceType: 'user',
    allowedTables: ['ideas', 'challenge_participants', 'idea_bookmarks', 'events', 'profiles'],
    restrictedTables: ['security_audit_log', 'admin_elevation_logs', 'role_approval_requests'],
    dataFilters: {
      ideas: 'innovator_id=eq.${userId} OR is_public=eq.true',
      challenge_participants: 'user_id=eq.${userId}',
      idea_bookmarks: 'user_id=eq.${userId}',
      events: 'visibility_level=eq.public OR id IN (SELECT event_id FROM event_participants WHERE user_id=${userId})'
    },
    crossWorkspaceAccess: false
  },
  
  expert: {
    workspaceType: 'expert',
    allowedTables: ['ideas', 'idea_evaluations', 'challenges', 'expert_consultations', 'challenge_experts'],
    restrictedTables: ['admin_elevation_logs', 'security_audit_log'],
    dataFilters: {
      ideas: 'id IN (SELECT idea_id FROM idea_evaluations WHERE expert_id=${userId}) OR is_public=eq.true',
      idea_evaluations: 'expert_id=eq.${userId}',
      challenges: 'id IN (SELECT challenge_id FROM challenge_experts WHERE expert_id=${userId}) OR status=eq.published',
      expert_consultations: 'expert_id=eq.${userId} OR consultant_id=eq.${userId}'
    },
    crossWorkspaceAccess: true
  },
  
  manager: {
    workspaceType: 'manager',
    allowedTables: ['task_assignments', 'team_members', 'projects', 'team_activities', 'challenges'],
    restrictedTables: ['security_audit_log'],
    dataFilters: {
      task_assignments: 'assigner_id=eq.${userId} OR assignee_id=eq.${userId}',
      team_members: 'team_id IN (SELECT team_id FROM team_members WHERE user_id=${userId} AND role IN (\'manager\', \'team_lead\'))',
      projects: 'manager_id=eq.${userId} OR id IN (SELECT project_id FROM project_members WHERE user_id=${userId})',
      team_activities: 'team_id IN (SELECT team_id FROM team_members WHERE user_id=${userId})'
    },
    crossWorkspaceAccess: true
  },
  
  organization: {
    workspaceType: 'organization',
    allowedTables: ['challenges', 'campaigns', 'departments', 'strategic_initiatives', 'analytics_events'],
    restrictedTables: [],
    dataFilters: {
      challenges: 'organization_id=eq.${organizationId} OR sensitivity_level=eq.normal',
      campaigns: 'organization_id=eq.${organizationId}',
      departments: 'organization_id=eq.${organizationId}',
      strategic_initiatives: 'organization_id=eq.${organizationId}',
      analytics_events: 'organization_id=eq.${organizationId}'
    },
    crossWorkspaceAccess: true
  }
};

export const enforceDataIsolation = (
  workspaceType: string, 
  tableName: string, 
  userId: string, 
  organizationId?: string
): string => {
  const policy = WORKSPACE_ISOLATION_POLICIES[workspaceType];
  
  if (!policy) {
    throw new Error(`No isolation policy found for workspace type: ${workspaceType}`);
  }
  
  if (policy.restrictedTables.includes(tableName)) {
    throw new Error(`Access denied: Table ${tableName} is restricted for workspace ${workspaceType}`);
  }
  
  if (!policy.allowedTables.includes(tableName)) {
    throw new Error(`Access denied: Table ${tableName} is not allowed for workspace ${workspaceType}`);
  }
  
  const filter = policy.dataFilters[tableName];
  if (filter) {
    return filter
      .replace('${userId}', userId)
      .replace('${organizationId}', organizationId || '');
  }
  
  return '';
};

export const validateCrossWorkspaceAccess = (
  sourceWorkspace: string, 
  targetWorkspace: string
): boolean => {
  const sourcePolicy = WORKSPACE_ISOLATION_POLICIES[sourceWorkspace];
  return sourcePolicy?.crossWorkspaceAccess || false;
};
```

### **Step 4.2: Workspace Access Middleware**

Create middleware to validate workspace access:

```typescript
// src/middleware/workspaceAccessMiddleware.ts
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { enforceDataIsolation, validateCrossWorkspaceAccess } from '@/utils/workspaceDataIsolation';

interface WorkspaceAccessRequest {
  workspaceType: string;
  action: 'read' | 'write' | 'delete' | 'moderate';
  resource: string;
  resourceId?: string;
  targetUserId?: string;
}

export const useWorkspaceAccessControl = () => {
  const { user } = useAuth();
  const { hasRole, hasAnyRole, isAdmin } = useRoleAccess();

  const validateWorkspaceAccess = async (request: WorkspaceAccessRequest): Promise<boolean> => {
    if (!user) return false;

    // Admin users have access to all workspaces
    if (isAdmin) return true;

    const { workspaceType, action, resource, targetUserId } = request;

    // Check role-based access to workspace type
    const hasWorkspaceAccess = checkWorkspaceRoleAccess(workspaceType, user.id);
    if (!hasWorkspaceAccess) return false;

    // Check action-specific permissions
    const hasActionPermission = checkActionPermission(workspaceType, action, user.id);
    if (!hasActionPermission) return false;

    // Check resource-specific access
    const hasResourceAccess = await checkResourceAccess(workspaceType, resource, user.id, targetUserId);
    if (!hasResourceAccess) return false;

    return true;
  };

  const checkWorkspaceRoleAccess = (workspaceType: string, userId: string): boolean => {
    const workspaceRoleRequirements = {
      user: () => true, // All authenticated users
      expert: () => hasAnyRole(['expert', 'evaluator', 'consultant']),
      manager: () => hasAnyRole(['manager', 'team_lead', 'project_manager']),
      coordinator: () => hasAnyRole(['coordinator', 'event_coordinator']),
      analyst: () => hasAnyRole(['analyst', 'data_analyst', 'business_analyst']),
      content: () => hasAnyRole(['content_manager', 'challenge_manager', 'research_lead']),
      organization: () => hasAnyRole(['organization_admin', 'entity_manager', 'deputy_manager']),
      partner: () => hasAnyRole(['partner', 'external_partner'])
    };

    const checkFunction = workspaceRoleRequirements[workspaceType];
    return checkFunction ? checkFunction() : false;
  };

  const checkActionPermission = (workspaceType: string, action: string, userId: string): boolean => {
    const actionPermissions = {
      user: {
        read: true,
        write: true,
        delete: true,
        moderate: false
      },
      expert: {
        read: true,
        write: true,
        delete: hasAnyRole(['senior_expert', 'lead_evaluator']),
        moderate: hasAnyRole(['senior_expert', 'expert_moderator'])
      },
      manager: {
        read: true,
        write: true,
        delete: true,
        moderate: true
      },
      organization: {
        read: true,
        write: hasAnyRole(['organization_admin', 'entity_manager']),
        delete: hasRole('organization_admin'),
        moderate: true
      }
    };

    const permissions = actionPermissions[workspaceType];
    return permissions ? permissions[action] || false : false;
  };

  const checkResourceAccess = async (
    workspaceType: string, 
    resource: string, 
    userId: string, 
    targetUserId?: string
  ): Promise<boolean> => {
    try {
      // Use data isolation policies to validate access
      const filter = enforceDataIsolation(workspaceType, resource, userId);
      
      // If accessing another user's data, check cross-workspace permissions
      if (targetUserId && targetUserId !== userId) {
        const canAccess = validateCrossWorkspaceAccess(workspaceType, 'user');
        if (!canAccess) return false;
      }

      return true;
    } catch (error) {
      console.error('Resource access validation failed:', error);
      return false;
    }
  };

  const logAccessAttempt = (request: WorkspaceAccessRequest, granted: boolean) => {
    // Log access attempts for audit purposes
    console.log('Workspace access attempt:', {
      userId: user?.id,
      timestamp: new Date().toISOString(),
      request,
      granted
    });

    // In production, this should log to the security audit system
  };

  return {
    validateWorkspaceAccess,
    logAccessAttempt
  };
};
```

---

## 📊 **Phase 5: Testing & Validation**

### **Step 5.1: Component Testing**

Create comprehensive tests for workspace components:

```typescript
// src/components/workspace/__tests__/EnhancedWorkspaceLayout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EnhancedWorkspaceLayout } from '../EnhancedWorkspaceLayout';

const mockProps = {
  title: 'Test Workspace',
  description: 'Test Description',
  userRole: 'user',
  workspaceType: 'user' as const,
  stats: [
    {
      id: 'test-stat',
      label: 'Test Stat',
      value: 42,
      icon: <div>Icon</div>
    }
  ],
  quickActions: [
    {
      id: 'test-action',
      label: 'Test Action',
      icon: <div>Action Icon</div>,
      action: jest.fn()
    }
  ],
  children: <div>Test Content</div>
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('EnhancedWorkspaceLayout', () => {
  test('renders workspace title and description', () => {
    renderWithProviders(<EnhancedWorkspaceLayout {...mockProps} />);
    
    expect(screen.getByText('Test Workspace')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('displays user role badge', () => {
    renderWithProviders(<EnhancedWorkspaceLayout {...mockProps} />);
    
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  test('renders stats correctly', () => {
    renderWithProviders(<EnhancedWorkspaceLayout {...mockProps} />);
    
    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('renders quick actions', () => {
    renderWithProviders(<EnhancedWorkspaceLayout {...mockProps} />);
    
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  test('applies correct workspace theme', () => {
    renderWithProviders(<EnhancedWorkspaceLayout {...mockProps} />);
    
    const container = screen.getByText('Test Workspace').closest('div');
    expect(container).toHaveClass('bg-gradient-to-r', 'from-blue-50', 'to-cyan-50');
  });
});
```

### **Step 5.2: Integration Testing**

Create integration tests for workspace data flow:

```typescript
// src/__tests__/workspaceIntegration.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { UserWorkspace } from '@/pages/workspace/UserWorkspace';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: mockUserData, error: null })) }))
      }))
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn()
      }))
    })),
    removeChannel: jest.fn()
  }
}));

const mockUserData = {
  id: 'user-1',
  ideasCount: 5,
  challengesCount: 3,
  eventsCount: 2,
  bookmarksCount: 8
};

const renderWorkspaceWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CollaborationProvider>
            {component}
          </CollaborationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Workspace Integration', () => {
  test('UserWorkspace loads and displays data correctly', async () => {
    renderWorkspaceWithProviders(<UserWorkspace userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Ideas count
      expect(screen.getByText('3')).toBeInTheDocument(); // Challenges count
      expect(screen.getByText('2')).toBeInTheDocument(); // Events count
      expect(screen.getByText('8')).toBeInTheDocument(); // Bookmarks count
    });
  });

  test('Workspace enforces access control', async () => {
    // Mock user without access
    const mockAuthContext = {
      user: null,
      loading: false
    };

    renderWorkspaceWithProviders(<UserWorkspace userId="user-1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });
});
```

### **Step 5.3: Performance Testing**

Create performance tests for workspace operations:

```typescript
// src/__tests__/workspacePerformance.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnhancedWorkspaceData } from '@/hooks/useEnhancedWorkspaceData';

describe('Workspace Performance', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  test('workspace data loads within performance thresholds', async () => {
    const startTime = performance.now();
    
    const { result } = renderHook(
      () => useEnhancedWorkspaceData({
        workspaceType: 'user',
        userId: 'test-user'
      }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 2 seconds max load time
  });

  test('real-time updates have minimal latency', async () => {
    const { result } = renderHook(
      () => useEnhancedWorkspaceData({
        workspaceType: 'manager',
        userId: 'test-manager',
        enableRealTime: true
      }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        )
      }
    );

    // Simulate real-time update
    const updateStart = performance.now();
    
    // Trigger update simulation
    queryClient.invalidateQueries(['workspace-data', 'manager', 'test-manager']);
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    const updateTime = performance.now() - updateStart;
    expect(updateTime).toBeLessThan(100); // 100ms max update latency
  });
});
```

---

## 📚 **Final Implementation Checklist**

### **Core Infrastructure** ✅
- [ ] Enhanced workspace layout component implemented
- [ ] Workspace permissions hook updated
- [ ] Enhanced workspace data management hook created
- [ ] Real-time collaboration integration completed

### **Individual Workspaces** ✅
- [ ] UserWorkspace enhanced with new features
- [ ] ExpertWorkspace implemented with evaluation tools
- [ ] ManagerWorkspace created with team management
- [ ] CoordinatorWorkspace built with event coordination
- [ ] AnalystWorkspace developed with analytics tools
- [ ] ContentWorkspace implemented with content management
- [ ] OrganizationWorkspace created with strategic oversight
- [ ] PartnerWorkspace enhanced with partnership features

### **Security & Access Control** ✅
- [ ] Data isolation policies implemented
- [ ] Workspace access middleware created
- [ ] Role-based access control enforced
- [ ] Audit logging for workspace actions added

### **Testing & Quality Assurance** ✅
- [ ] Component tests written and passing
- [ ] Integration tests implemented
- [ ] Performance tests created and meeting thresholds
- [ ] Security tests validating access controls

### **Documentation & Training** ✅
- [ ] Technical documentation completed
- [ ] User guides created for each workspace type
- [ ] Admin documentation for configuration
- [ ] Training materials prepared

---

*Implementation Guide Complete*
*Last Updated: January 12, 2025*
*Document Version: 1.0*
*Status: ✅ Ready for Implementation*
