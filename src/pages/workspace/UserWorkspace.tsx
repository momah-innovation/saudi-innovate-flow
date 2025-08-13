import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useUserWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, Target, Bookmark, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function UserWorkspace() {
  const { t } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useUserWorkspaceData();

  const navigationItems = [
    {
      id: 'ideas',
      label: t('workspace.user.nav.ideas'),
      icon: Lightbulb,
      count: workspaceData?.stats?.totalIdeas || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.IDEAS)
    },
    {
      id: 'challenges',
      label: t('workspace.user.nav.challenges'),
      icon: Target,
      count: workspaceData?.stats?.activeChallenges || 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.CHALLENGES)
    },
    {
      id: 'bookmarks',
      label: t('workspace.user.nav.bookmarks'),
      icon: Bookmark,
      count: workspaceData?.stats?.savedItems || 0,
      active: false,
      onClick: () => {}
    }
  ];

  const quickActions = [
    {
      id: 'new-idea',
      title: t('workspace.user.actions.new_idea'),
      description: t('workspace.user.actions.new_idea_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.IDEAS + '?action=create'),
      variant: 'default' as const
    },
    {
      id: 'join-challenge',
      title: t('workspace.user.actions.join_challenge'),
      description: t('workspace.user.actions.join_challenge_desc'),
      icon: Trophy,
      onClick: () => navigate(ALL_ROUTES.CHALLENGES),
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: t('workspace.user.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: Lightbulb
    },
    {
      label: t('workspace.user.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      label: t('workspace.user.metrics.saved_items'),
      value: workspaceData?.stats?.savedItems || 0,
      icon: Bookmark
    }
  ];

  const metrics = [
    {
      title: t('workspace.user.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: Lightbulb
    },
    {
      title: t('workspace.user.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      title: t('workspace.user.metrics.saved_items'),
      value: workspaceData?.stats?.savedItems || 0,
      icon: Bookmark
    }
  ];

  if (isLoading) {
    return (
      <WorkspaceLayout
        title={t('workspace.user.title')}
        description={t('workspace.user.description')}
        userRole={userProfile?.roles?.[0] || 'user'}
      >
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      title={t('workspace.user.title')}
      description={t('workspace.user.description')}
      userRole={userProfile?.roles?.[0] || 'user'}
      stats={stats}
      quickActions={[
        {
          label: t('workspace.user.actions.new_idea'),
          onClick: () => navigate(ALL_ROUTES.IDEAS + '?action=create'),
          icon: Plus
        }
      ]}
    >
      <div className="space-y-6">
        {/* Navigation */}
        <WorkspaceNavigation items={navigationItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Ideas */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.user.recent_ideas')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.ideas?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.ideas.slice(0, 5).map((idea) => (
                      <div key={idea.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{idea.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('common.status')}: {idea.status}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t('common.view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.user.no_ideas')}</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(ALL_ROUTES.IDEAS + '?action=create')}
                    >
                      {t('workspace.user.actions.new_idea')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participated Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.user.participated_challenges')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.participatedChallenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.participatedChallenges.map((participation) => (
                      <div key={participation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{participation.challenges?.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('common.status')}: {participation.challenges?.status}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t('common.view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.user.no_challenges')}</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(ALL_ROUTES.CHALLENGES)}
                    >
                      {t('workspace.user.actions.browse_challenges')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.user.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
      </div>
      
      {/* User Workspace Collaboration */}
      <WorkspaceCollaboration
        workspaceType="user"
        entityId={user?.id}
        showWidget={true}
        showPresence={true}
        showActivity={true}
      />
    </WorkspaceLayout>
  );
}