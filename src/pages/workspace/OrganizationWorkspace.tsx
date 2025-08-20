import React from 'react';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { EnhancedWorkspaceHero } from '@/components/workspace/EnhancedWorkspaceHero';
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
  const { t, getDynamicText } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useOrganizationWorkspaceData();

  const navigationItems = [
    {
      id: 'challenges',
      label: t('workspace.organization.nav.challenges'),
      icon: Target,
      count: workspaceData?.stats?.activeChallenges || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES)
    },
    {
      id: 'submissions',
      label: t('workspace.organization.nav.submissions'),
      icon: FileText,
      count: workspaceData?.stats?.totalSubmissions || 0,
      active: false,
      onClick: () => {}
    },
    {
      id: 'team',
      label: t('workspace.organization.nav.team'),
      icon: Users,
      count: workspaceData?.stats?.teamSize || 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.ADMIN_TEAMS)
    }
  ];

  const quickActions = [
    {
      id: 'create-challenge',
      title: t('workspace.organization.actions.create_challenge'),
      description: t('workspace.organization.actions.create_challenge_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create'),
      variant: 'default' as const
    },
    {
      id: 'manage-team',
      title: t('workspace.organization.actions.manage_team'),
      description: t('workspace.organization.actions.manage_team_desc'),
      icon: Settings,
      onClick: () => navigate(ALL_ROUTES.ADMIN_TEAMS),
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: t('workspace.organization.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      label: t('workspace.organization.metrics.total_submissions'),
      value: workspaceData?.stats?.totalSubmissions || 0,
      icon: FileText
    },
    {
      label: t('workspace.organization.metrics.team_size'),
      value: workspaceData?.stats?.teamSize || 0,
      icon: Users
    },
    {
      label: t('workspace.organization.metrics.completed_challenges'),
      value: workspaceData?.stats?.completedChallenges || 0,
      icon: Building
    }
  ];

  const metrics = [
    {
      title: t('workspace.organization.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      title: t('workspace.organization.metrics.total_submissions'),
      value: workspaceData?.stats?.totalSubmissions || 0,
      icon: FileText
    },
    {
      title: t('workspace.organization.metrics.team_size'),
      value: workspaceData?.stats?.teamSize || 0,
      icon: Users
    },
    {
      title: t('workspace.organization.metrics.completed_challenges'),
      value: workspaceData?.stats?.completedChallenges || 0,
      icon: Building
    }
  ];

  if (isLoading) {
    return (
      <>
        <WorkspaceBreadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WorkspaceBreadcrumb />
      <div className="container mx-auto px-4 py-8">
        <EnhancedWorkspaceHero
          userRole={userProfile?.roles?.[0] || 'organization'}
          userProfile={userProfile}
          title={t('workspace.organization.title')}
          description={t('workspace.organization.description')}
          stats={stats}
          quickActions={[
            {
              label: t('workspace.organization.actions.create_challenge'),
              onClick: () => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create'),
              icon: Plus
            }
          ]}
        />
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-6">
        {/* Navigation */}
        <WorkspaceNavigation items={navigationItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Challenges */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                    {t('workspace.organization.active_challenges')}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create')}
                    className="hover-scale gradient-border"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('workspace.organization.new_challenge')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.challenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.challenges.slice(0, 5).map((challenge) => (
                      <div key={challenge.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{getDynamicText(challenge.title_ar, (challenge as any).title_en)}</h4>
                             <p className="text-sm text-muted-foreground">
                               {t('workspace.organization.created')}: {new Date(challenge.created_at || '').toLocaleDateString(t('common.locale'))}
                             </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={challenge.status === 'active' ? 'success' : 'secondary'} className="gradient-border">
                            {challenge.status?.startsWith('status.') ? t(challenge.status) : t(`status.${challenge.status}`) || challenge.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('common.manage')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Target className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.organization.no_challenges')}</p>
                    <p className="text-sm mb-6">{t('workspace.organization.no_challenges_desc', 'Create your first challenge to start innovation')}</p>
                    <Button 
                      className="hover-scale gradient-border" 
                      onClick={() => navigate(ALL_ROUTES.ADMIN_CHALLENGES + '?action=create')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('workspace.organization.actions.create_challenge')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.organization.recent_submissions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.submissions?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{getDynamicText(submission.title_ar, (submission as any).title_en)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.organization.challenge')}: {getDynamicText(submission.challenges?.title_ar, (submission.challenges as any)?.title_en)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={submission.status === 'submitted' ? 'success' : 'secondary'} className="gradient-border">
                            {submission.status?.startsWith('status.') ? t(submission.status) : t(`status.${submission.status}`) || submission.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('common.review')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.organization.no_submissions')}</p>
                    <p className="text-sm mb-6">{t('workspace.organization.no_submissions_desc', 'No submissions received yet')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.organization.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
        </div>
        
        {/* Organization Workspace Collaboration */}
        <WorkspaceCollaboration
          workspaceType="organization"
          entityId={user?.id}
          showWidget={true}
          showPresence={true}
          showActivity={true}
        />
      </div>
    </>
  );
}