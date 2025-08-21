import React from 'react';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { EnhancedWorkspaceHero } from '@/components/workspace/EnhancedWorkspaceHero';
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
      variant: 'default' as const,
      colorScheme: 'innovation' as const
    },
    {
      id: 'create-opportunity',
      title: t('workspace.partner.actions.create_opportunity'),
      description: t('workspace.partner.actions.create_opportunity_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES + '?action=create'),
      variant: 'outline' as const,
      disabled: !permissions.canCreateOpportunities,
      colorScheme: 'success' as const
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
          userRole={userProfile?.roles?.[0] || 'partner'}
          userProfile={userProfile}
          title={t('workspace.partner.title')}
          description={t('workspace.partner.description')}
          stats={stats}
          quickActions={[
            {
              label: t('workspace.partner.actions.browse_opportunities'),
              onClick: () => navigate(ALL_ROUTES.OPPORTUNITIES),
              icon: Search
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
            {/* Available Opportunities */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                    {t('workspace.partner.available_opportunities')}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(ALL_ROUTES.OPPORTUNITIES)}
                    className="hover-scale gradient-border"
                  >
                    {t('workspace.partner.view_all')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.opportunities?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.opportunities.slice(0, 5).map((opportunity) => (
                      <div key={opportunity.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{opportunity.title_ar}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.partner.deadline')}: {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString('ar') : t('common.no_deadline')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="gradient-border">
                            {opportunity.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('common.apply')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Briefcase className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.partner.no_opportunities')}</p>
                    <p className="text-sm mb-6">{t('workspace.partner.no_opportunities_desc', 'Browse available partnership opportunities')}</p>
                    <Button 
                      className="hover-scale gradient-border" 
                      onClick={() => navigate(ALL_ROUTES.OPPORTUNITIES)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {t('workspace.partner.actions.browse_opportunities')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Partnerships */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.partner.active_partnerships')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.partnerships?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.partnerships.map((partnership) => (
                      <div key={partnership.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Handshake className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{partnership.challenges?.title_ar}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.partner.status')}: {partnership.challenges?.status}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                          {t('common.manage')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Handshake className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.partner.no_partnerships')}</p>
                    <p className="text-sm mb-6">{t('workspace.partner.no_partnerships_desc', 'No active partnerships at this time')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.partner.my_applications')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.applications?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <FileCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{application.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('workspace.partner.applied')}: {new Date(application.created_at || '').toLocaleDateString('ar')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            application.status === 'accepted' ? 'success' :
                            application.status === 'rejected' ? 'destructive' : 'secondary'
                          } className="gradient-border">
                            {application.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                            {t('common.view')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <FileCheck className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.partner.no_applications')}</p>
                    <p className="text-sm mb-6">{t('workspace.partner.no_applications_desc', 'You have not submitted any applications yet')}</p>
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
      </div>
    </>
  );
}