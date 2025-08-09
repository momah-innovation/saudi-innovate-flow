import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
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
  const { userProfile } = useAuth();
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
    );
  }

  return (
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('workspace.expert.pending_evaluations')}
                  {workspaceData?.stats?.pendingEvaluations > 0 && (
                    <Badge variant="destructive">
                      {workspaceData.stats.pendingEvaluations} {t('workspace.expert.pending')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.evaluations?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.evaluations.slice(0, 5).map((evaluation) => (
                      <div key={evaluation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{evaluation.ideas?.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.expert.submitted')}: {new Date(evaluation.ideas?.created_at || '').toLocaleDateString('ar')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={evaluation.evaluation_date ? 'success' : 'secondary'}>
                            {evaluation.evaluation_date ? t('common.completed') : t('common.pending')}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {t('workspace.expert.evaluate')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ClipboardList className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.expert.no_evaluations')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.expert.assigned_challenges')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.assignedChallenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.assignedChallenges.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{assignment.challenges?.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.expert.status')}: {assignment.challenges?.status}
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
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.expert.no_challenges')}</p>
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
    </WorkspaceLayout>
  );
}