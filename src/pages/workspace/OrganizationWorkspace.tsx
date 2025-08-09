import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useOrganizationWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Target, Users, FileText, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function OrganizationWorkspace() {
  const { t } = useUnifiedTranslation();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useOrganizationWorkspaceData();

  const navigationItems = [
    {
      id: 'challenges',
      label: t('workspace.org.nav.challenges'),
      icon: Target,
      count: workspaceData?.stats?.activeChallenges || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES)
    },
    {
      id: 'submissions',
      label: t('workspace.org.nav.submissions'),
      icon: FileText,
      count: workspaceData?.stats?.totalSubmissions || 0,
      active: false,
      onClick: () => {}
    },
    {
      id: 'team',
      label: t('workspace.org.nav.team'),
      icon: Users,
      count: workspaceData?.stats?.teamSize || 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.ADMIN_TEAMS)
    }
  ];

  const quickActions = [
    {
      id: 'create-challenge',
      title: t('workspace.org.actions.create_challenge'),
      description: t('workspace.org.actions.create_challenge_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create'),
      variant: 'default' as const
    },
    {
      id: 'manage-team',
      title: t('workspace.org.actions.manage_team'),
      description: t('workspace.org.actions.manage_team_desc'),
      icon: Settings,
      onClick: () => navigate(ALL_ROUTES.ADMIN_TEAMS),
      variant: 'outline' as const
    }
  ];

  const metrics = [
    {
      title: t('workspace.org.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: t('workspace.org.metrics.total_submissions'),
      value: workspaceData?.stats?.totalSubmissions || 0,
      icon: FileText,
      color: 'bg-success/10 text-success'
    },
    {
      title: t('workspace.org.metrics.team_members'),
      value: workspaceData?.stats?.teamSize || 0,
      icon: Users,
      color: 'bg-info/10 text-info'
    },
    {
      title: t('workspace.org.metrics.completed_challenges'),
      value: workspaceData?.stats?.completedChallenges || 0,
      icon: Building,
      color: 'bg-warning/10 text-warning'
    }
  ];

  if (isLoading) {
    return (
      <WorkspaceLayout
        title={t('workspace.org.title')}
        description={t('workspace.org.description')}
        userRole={userProfile?.roles?.[0] || 'admin'}
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
      title={t('workspace.org.title')}
      description={t('workspace.org.description')}
      userRole={userProfile?.roles?.[0] || 'admin'}
      stats={metrics}
      quickActions={[
        {
          label: t('workspace.org.actions.create_challenge'),
          onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create'),
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
            {/* Active Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('workspace.org.active_challenges')}
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('workspace.org.new_challenge')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.challenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.challenges.slice(0, 5).map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{challenge.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.org.created')}: {new Date(challenge.created_at || '').toLocaleDateString('ar')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={challenge.status === 'active' ? 'success' : 'secondary'}>
                            {challenge.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {t('common.manage')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.org.no_challenges')}</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create')}
                    >
                      {t('workspace.org.actions.create_challenge')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.org.recent_submissions')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.submissions?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{submission.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.org.challenge')}: {submission.challenges?.title_ar}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={submission.status === 'submitted' ? 'success' : 'secondary'}>
                            {submission.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {t('common.review')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.org.no_submissions')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.org.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics
              title={t('workspace.org.overview')}
              metrics={metrics}
            />
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}