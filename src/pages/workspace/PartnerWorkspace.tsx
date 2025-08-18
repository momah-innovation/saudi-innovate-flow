import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { usePartnerWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Handshake, FileCheck, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function PartnerWorkspace() {
  const { t } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = usePartnerWorkspaceData();

  const navigationItems = [
    {
      id: 'opportunities',
      label: t('workspace.partner.nav.opportunities'),
      icon: Briefcase,
      count: workspaceData?.stats?.availableOpportunities || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES)
    },
    {
      id: 'partnerships',
      label: t('workspace.partner.nav.partnerships'),
      icon: Handshake,
      count: workspaceData?.stats?.activePartnerships || 0,
      active: false,
      onClick: () => {}
    },
    {
      id: 'applications',
      label: t('workspace.partner.nav.applications'),
      icon: FileCheck,
      count: workspaceData?.stats?.pendingApplications || 0,
      active: false,
      onClick: () => {}
    }
  ];

  const quickActions = [
    {
      id: 'browse-opportunities',
      title: t('workspace.partner.actions.browse_opportunities'),
      description: t('workspace.partner.actions.browse_opportunities_desc'),
      icon: Search,
      onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES),
      variant: 'default' as const
    },
    {
      id: 'create-opportunity',
      title: t('workspace.partner.actions.create_opportunity'),
      description: t('workspace.partner.actions.create_opportunity_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES + '?action=create'),
      variant: 'outline' as const,
      disabled: !permissions.canCreateOpportunities
    }
  ];

  const stats = [
    {
      label: t('workspace.partner.metrics.available_opportunities'),
      value: workspaceData?.stats?.availableOpportunities || 0,
      icon: Briefcase
    },
    {
      label: t('workspace.partner.metrics.active_partnerships'),
      value: workspaceData?.stats?.activePartnerships || 0,
      icon: Handshake
    },
    {
      label: t('workspace.partner.metrics.pending_applications'),
      value: workspaceData?.stats?.pendingApplications || 0,
      icon: FileCheck
    },
    {
      label: t('workspace.partner.metrics.accepted_applications'),
      value: workspaceData?.stats?.acceptedApplications || 0,
      icon: FileCheck
    }
  ];

  const metrics = [
    {
      title: t('workspace.partner.metrics.available_opportunities'),
      value: workspaceData?.stats?.availableOpportunities || 0,
      icon: Briefcase
    },
    {
      title: t('workspace.partner.metrics.active_partnerships'),
      value: workspaceData?.stats?.activePartnerships || 0,
      icon: Handshake
    },
    {
      title: t('workspace.partner.metrics.pending_applications'),
      value: workspaceData?.stats?.pendingApplications || 0,
      icon: FileCheck
    },
    {
      title: t('workspace.partner.metrics.accepted_applications'),
      value: workspaceData?.stats?.acceptedApplications || 0,
      icon: FileCheck
    }
  ];

  if (isLoading) {
    return (
      <>
        <WorkspaceBreadcrumb />
        <WorkspaceLayout
        title={t('workspace.partner.title')}
        description={t('workspace.partner.description')}
        userRole={userProfile?.roles?.[0] || 'partner'}
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
      title={t('workspace.partner.title')}
      description={t('workspace.partner.description')}
      userRole={userProfile?.roles?.[0] || 'partner'}
      stats={stats}
      quickActions={[
        {
          label: t('workspace.partner.actions.browse_opportunities'),
          onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES),
          icon: Search
        }
      ]}
    >
      <div className="space-y-6">
        {/* Navigation */}
        <WorkspaceNavigation items={navigationItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('workspace.partner.available_opportunities')}
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ALL_ROUTES.OPPORTUNITIES)}
                  >
                    {t('workspace.partner.view_all')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.opportunities?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.opportunities.slice(0, 5).map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{opportunity.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.partner.deadline')}: {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(t('common.locale')) : t('common.placeholders.no_data')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success">
                            {opportunity.status?.startsWith('status.') ? t(opportunity.status) : t(`status.${opportunity.status}`) || opportunity.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {t('common.apply')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.partner.no_opportunities')}</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate(ALL_ROUTES.OPPORTUNITIES)}
                    >
                      {t('workspace.partner.actions.browse_opportunities')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Partnerships */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.partner.active_partnerships')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.partnerships?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.partnerships.map((partnership) => (
                      <div key={partnership.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{partnership.challenges?.title_ar}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('common.status_label')}: {partnership.challenges?.status?.startsWith('status.') ? t(partnership.challenges.status) : t(`status.${partnership.challenges?.status}`) || partnership.challenges?.status}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t('common.manage')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Handshake className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.partner.no_partnerships')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workspace.partner.my_applications')}</CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.applications?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{application.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('workspace.partner.applied')}: {new Date(application.created_at || '').toLocaleDateString(t('common.locale'))}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            application.status === 'accepted' ? 'success' :
                            application.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {application.status?.startsWith('status.') ? t(application.status) : t(`status.${application.status}`) || application.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            {t('common.view')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileCheck className="mx-auto h-12 w-12 mb-4" />
                    <p>{t('workspace.partner.no_applications')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.partner.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
      </div>
      
      {/* Partner Workspace Collaboration */}
      <WorkspaceCollaboration
        workspaceType="partner"
        entityId={user?.id}
        showWidget={true}
        showPresence={true}
        showActivity={true}
      />
    </WorkspaceLayout>
    </>
  );
}