import React, { useState } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  HandHeart, 
  Building, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  DollarSign,
  Target,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';

interface PartnerWorkspaceProps {
  partnerId?: string;
}

export const PartnerWorkspace: React.FC<PartnerWorkspaceProps> = ({
  partnerId = 'partner-1'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { t } = useUnifiedTranslation();
  const tw = React.useCallback((key: string, params?: Record<string, any>) => t(`workspace.partner.${key}`, params), [t]);

  // Mock partner data
  const partnerData = {
    name: t('workspace.partner.sample_company'),
    type: t('workspace.partner.company_type'),
    industry: t('workspace.partner.industry'),
    partnershipStart: '2023-01-15',
    totalProjects: 8,
    activeProjects: 3,
    totalInvestment: 5200000,
    partnershipLevel: t('workspace.partner.strategic_level')
  };

  const quickActions = [
    { icon: Plus, label: t('workspace.partner.actions.new_project'), variant: 'default' as const, onClick: () => {} },
    { icon: MessageSquare, label: t('workspace.partner.actions.direct_contact'), variant: 'outline' as const, onClick: () => {} },
    { icon: FileText, label: t('workspace.partner.actions.new_contract'), variant: 'outline' as const, onClick: () => {} },
    { icon: Settings, label: t('workspace.partner.actions.partnership_settings'), variant: 'outline' as const, onClick: () => {} }
  ];

  const stats = [
    { label: t('workspace.partner.stats.partnership_duration'), value: t('workspace.partner.stats.duration_months'), icon: HandHeart, trend: 'neutral' as const },
    { label: t('workspace.partner.stats.active_projects'), value: '3', icon: Target, trend: 'up' as const },
    { label: t('workspace.partner.stats.total_investment'), value: t('workspace.partner.stats.investment_amount'), icon: DollarSign, trend: 'up' as const },
    { label: t('workspace.partner.stats.success_rate'), value: '87%', icon: TrendingUp, trend: 'up' as const }
  ];

  const projects = [
    { 
      id: '1', 
      name: t('workspace.partner.projects.smart_payments'), 
      status: t('workspace.partner.project_status.in_development'), 
      progress: 75, 
      budget: '2.1M', 
      deadline: '2024-03-15',
      team: [t('mock_data.sample_member_1'), t('mock_data.sample_member_2'), t('mock_data.sample_member_3')]
    },
    { 
      id: '2', 
      name: t('workspace.partner.projects.digital_identity'), 
      status: t('workspace.partner.project_status.testing'), 
      progress: 90, 
      budget: '1.8M', 
      deadline: '2024-02-28',
      team: [t('mock_data.sample_member_3'), t('mock_data.sample_member_1'), t('mock_data.sample_member_2')]
    },
    { 
      id: '3', 
      name: t('workspace.partner.projects.banking_app'), 
      status: t('workspace.partner.project_status.planning'), 
      progress: 25, 
      budget: '3.2M', 
      deadline: '2024-06-30',
      team: [t('mock_data.sample_member_1'), t('mock_data.sample_member_4')]
    }
  ];

  const communications = [
    { id: '1', type: t('workspace.partner.communication_types.meeting'), title: t('workspace.partner.communications.project_review'), date: '2024-01-15 10:00', status: t('workspace.partner.status.scheduled') },
    { id: '2', type: t('workspace.partner.communication_types.email'), title: t('workspace.partner.communications.development_update'), date: '2024-01-14 14:30', status: t('workspace.partner.status.sent') },
    { id: '3', type: t('workspace.partner.communication_types.call'), title: t('workspace.partner.communications.budget_discussion'), date: '2024-01-13 16:00', status: t('workspace.partner.status.completed') },
    { id: '4', type: t('workspace.partner.communication_types.report'), title: t('workspace.partner.communications.monthly_report'), date: '2024-01-12 09:00', status: t('workspace.partner.status.review') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t('workspace.partner.project_status.in_development'): return 'bg-yellow-500';
      case t('workspace.partner.project_status.testing'): return 'bg-blue-500';
      case t('workspace.partner.project_status.planning'): return 'bg-gray-500';
      case t('workspace.partner.project_status.completed'): return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <WorkspaceLayout
      title={t('workspace.partner.title')}
      description={t('workspace.partner.description', { companyName: partnerData.name })}
      userRole={t('workspace.partner.role')}
      stats={stats}
      quickActions={quickActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{tw('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="projects">{tw('tabs.projects')}</TabsTrigger>
              <TabsTrigger value="communication">{tw('tabs.communication')}</TabsTrigger>
              <TabsTrigger value="contracts">{tw('tabs.contracts')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {tw('partner_info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">{t('workspace.partner.labels.partner_name')}</div>
                      <div className="font-medium">{partnerData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t('workspace.partner.labels.partnership_type')}</div>
                      <Badge variant="outline">{partnerData.partnershipLevel}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t('workspace.partner.labels.industry')}</div>
                      <div className="font-medium">{partnerData.industry}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{t('workspace.partner.labels.partnership_start')}</div>
                      <div className="font-medium">{new Date(partnerData.partnershipStart).toLocaleDateString(t('common.locale'))}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{t('workspace.partner.labels.partnership_rating')}</span>
                      <span className="text-sm font-medium">{t('workspace.partner.labels.excellent_rating')}</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('workspace.partner.labels.current_projects')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 2).map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{t('workspace.partner.labels.progress')}</span>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{t('workspace.partner.labels.budget')}: {project.budget}</span>
                          <span>{t('workspace.partner.labels.deadline')}: {new Date(project.deadline).toLocaleDateString(t('common.locale'))}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t('workspace.partner.labels.all_projects')}
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('workspace.partner.actions.new_project')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{project.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                              <span className="text-sm">{project.status}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-muted-foreground">{t('workspace.partner.labels.budget')}</div>
                              <div className="font-medium">{project.budget}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">{t('workspace.partner.labels.deadline')}</div>
                              <div className="font-medium">{new Date(project.deadline).toLocaleDateString(t('common.locale'))}</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">{t('workspace.partner.labels.progress')}</span>
                              <span className="text-xs font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs">+{project.team.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {t('workspace.partner.actions.view')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t('workspace.partner.labels.communication_log')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{comm.title}</div>
                            <div className="text-sm text-muted-foreground">{comm.date}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{comm.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('workspace.partner.labels.contracts_agreements')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('workspace.partner.labels.contracts_coming_soon')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('workspace.partner.labels.upcoming_events')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">{t('workspace.partner.events.project_review_meeting')}</div>
                  <div className="text-xs text-muted-foreground">{t('workspace.partner.events.tomorrow_10am')}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">{t('workspace.partner.events.client_presentation')}</div>
                  <div className="text-xs text-muted-foreground">{t('workspace.partner.events.thursday_2pm')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <WorkspaceCollaboration
            workspaceType="partner"
            entityId={partnerId}
            showWidget={true}
            showPresence={true}
            showActivity={true}
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
};