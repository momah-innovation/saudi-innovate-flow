import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useExpertWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Users, Star, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function ExpertWorkspace() {
  const { t } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useExpertWorkspaceData();

  const navigationItems = [
    {
      id: 'evaluations',
      label: t('workspace.expert.nav.evaluations'),
      icon: ClipboardList,
      count: workspaceData?.stats?.pendingEvaluations || 0,
      active: true,
      onClick: () => {}
    },
    {
      id: 'challenges',
      label: t('workspace.expert.nav.assigned_challenges'),
      icon: Users,
      count: workspaceData?.stats?.assignedChallenges || 0,
      active: false,
      onClick: () => {}
    },
    {
      id: 'completed',
      label: t('workspace.expert.nav.completed'),
      icon: CheckCircle,
      count: workspaceData?.stats?.completedEvaluations || 0,
      active: false,
      onClick: () => {}
    }
  ];

  const quickActions = [
    {
      id: 'evaluate-ideas',
      title: t('workspace.expert.actions.evaluate_ideas'),
      description: t('workspace.expert.actions.evaluate_ideas_desc'),
      icon: Star,
      onClick: () => {},
      variant: 'default' as const,
      badge: workspaceData?.stats?.pendingEvaluations ? {
        text: workspaceData.stats.pendingEvaluations.toString(),
        variant: 'destructive' as const
      } : undefined
    },
    {
      id: 'review-submissions',
      title: t('workspace.expert.actions.review_submissions'),
      description: t('workspace.expert.actions.review_submissions_desc'),
      icon: Eye,
      onClick: () => {},
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: t('workspace.expert.metrics.pending_evaluations'),
      value: workspaceData?.stats?.pendingEvaluations || 0,
      icon: ClipboardList
    },
    {
      label: t('workspace.expert.metrics.completed_evaluations'),
      value: workspaceData?.stats?.completedEvaluations || 0,
      icon: CheckCircle
    },
    {
      label: t('workspace.expert.metrics.assigned_challenges'),
      value: workspaceData?.stats?.assignedChallenges || 0,
      icon: Users
    }
  ];

  const metrics = [
    {
      title: t('workspace.expert.metrics.pending_evaluations'),
      value: workspaceData?.stats?.pendingEvaluations || 0,
      icon: ClipboardList
    },
    {
      title: t('workspace.expert.metrics.completed_evaluations'),
      value: workspaceData?.stats?.completedEvaluations || 0,
      icon: CheckCircle
    },
    {
      title: t('workspace.expert.metrics.assigned_challenges'),
      value: workspaceData?.stats?.assignedChallenges || 0,
      icon: Users
    }
  ];

  if (isLoading) {
    return (
      <>
        <WorkspaceBreadcrumb />
        <WorkspaceLayout
          title={t('workspace.expert.title')}
          description={t('workspace.expert.description')}
          userRole={userProfile?.roles?.[0] || 'expert'}
        >
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </WorkspaceLayout>
      </>
    );
  }

  return (
    <>
      <WorkspaceBreadcrumb />
      <WorkspaceLayout
        title={t('workspace.expert.title')}
        description={t('workspace.expert.description')}
        userRole={userProfile?.roles?.[0] || 'expert'}
        stats={stats}
        quickActions={[
          {
            label: t('workspace.expert.actions.start_evaluation'),
            onClick: () => {},
            icon: Star
          }
        ]}
      >
        <div className="space-y-6">
          {/* Navigation */}
          <WorkspaceNavigation items={navigationItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Evaluations */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                    {t('workspace.expert.pending_evaluations')}
                  </div>
                  {workspaceData?.stats?.pendingEvaluations > 0 && (
                    <Badge variant="destructive" className="gradient-border">
                      {workspaceData.stats.pendingEvaluations} {t('workspace.expert.pending')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.evaluations?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.evaluations.slice(0, 5).map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Star className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{evaluation.ideas?.title_ar}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.expert.submitted')}: {new Date(evaluation.ideas?.created_at || '').toLocaleDateString(t('common.locale'))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={evaluation.evaluation_date ? 'success' : 'secondary'} className="gradient-border">
                            {evaluation.evaluation_date ? t('status.completed') : t('status.pending')}
                          </Badge>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('workspace.expert.evaluate')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <ClipboardList className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.expert.no_evaluations')}</p>
                    <p className="text-sm mb-6">{t('workspace.expert.no_evaluations_desc', 'No pending evaluations at this time')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Challenges */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.expert.assigned_challenges')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.assignedChallenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.assignedChallenges.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{assignment.challenges?.title_ar}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('common.status_label')}: {assignment.challenges?.status?.startsWith('status.') ? t(assignment.challenges.status) : t(`status.${assignment.challenges?.status}`) || assignment.challenges?.status}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                          {t('common.view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.expert.no_challenges')}</p>
                    <p className="text-sm mb-6">{t('workspace.expert.no_challenges_desc', 'No challenges assigned to you currently')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.expert.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
        </div>
        
        {/* Expert Workspace Collaboration */}
        <WorkspaceCollaboration
          workspaceType="expert"
          entityId={user?.id}
          showWidget={true}
          showPresence={true}
          showActivity={true}
        />
      </WorkspaceLayout>
    </>
  );
}