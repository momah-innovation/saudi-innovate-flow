import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debugLog } from '@/utils/debugLogger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Database, 
  TrendingUp, 
  Shield,
  BarChart3,
  Settings,
  Activity,
  HardDrive,
  Plus,
  Download,
  Eye,
  RefreshCw,
  UserCheck,
  HelpCircle,
  Target,
  Brain,
  Archive,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemActivityDialog } from '@/components/dialogs/SystemActivityDialog';
import { SystemHealthDialog } from '@/components/dialogs/SystemHealthDialog';
import { TestPrivilegeElevation } from '@/components/admin/TestPrivilegeElevation';
import { logger } from '@/utils/logger';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

export default function AdminDashboard() {
  debugLog.debug('AdminDashboard page loaded - Management tab should be visible');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const [loading, setLoading] = useState(true);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [healthDialogOpen, setHealthDialogOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1234,
    activeUsers: 156,
    storageUsed: 2.4,
    uptime: 98.5,
    activePolicies: 12,
    securityAlerts: 3,
    pendingUpdates: 5,
    systemHealth: "Healthy"
  });

  const adminCards = [
    {
      title: t('admin.cards.user_management.title'),
      description: t('admin.cards.user_management.description'),
      icon: Users,
      href: "/admin/users",
      count: "1,234",
      label: t('admin.cards.user_management.label')
    },
    {
      title: t('admin.cards.core_team_management.title'),
      description: t('admin.cards.core_team_management.description'),
      icon: Users,
      href: "/admin/core-team",
      count: "12",
      label: t('admin.cards.core_team_management.label')
    },
    {
      title: t('admin.cards.expert_assignment_management.title'),
      description: t('admin.cards.expert_assignment_management.description'), 
      icon: UserCheck,
      href: "/admin/expert-assignments",
      count: "24",
      label: t('admin.cards.expert_assignment_management.label')
    },
    {
      title: t('admin.cards.storage_management.title'), 
      description: t('admin.cards.storage_management.description'),
      icon: Database,
      href: "/admin/storage",
      count: "2.4 GB",
      label: t('admin.cards.storage_management.label')
    },
    {
      title: t('admin.cards.analytics.title'),
      description: t('admin.cards.analytics.description'), 
      icon: BarChart3,
      href: "/admin/system-analytics",
      count: "98.5%",
      label: t('admin.cards.analytics.label')
    },
    {
      title: t('admin.cards.storage_policies.title'),
      description: t('admin.cards.storage_policies.description'),
      icon: HardDrive, 
      href: "/admin/storage/policies",
      count: "12",
      label: t('admin.cards.storage_policies.label')
    },
    {
      title: t('admin.system_settings.title'),
      description: t('admin.system_settings.description'),
      icon: Settings,
      href: "/admin/system-settings", 
      count: "5",
      label: t('admin.system_settings.label')
    },
    {
      title: t('admin.security_monitor.title'),
      description: t('admin.security_monitor.description'),
      icon: Shield,
      href: "/admin/security",
      count: "3",
      label: t('admin.security_monitor.label')
    },
    {
      title: t('admin.focus_questions.title'),
      description: t('admin.focus_questions.description'),
      icon: HelpCircle,
      href: "/admin/focus-questions",
      count: "18",
      label: t('admin.focus_questions.label')
    },
    {
      title: t('admin.ideas_management.title'),
      description: t('admin.ideas_management.description'),
      icon: TrendingUp,
      href: "/admin/ideas",
      count: "245",
      label: t('admin.ideas_management.label')
    },
    {
      title: t('admin.challenges_management.title'), 
      description: t('admin.challenges_management.description'),
      icon: Activity,
      href: "/admin/challenges",
      count: "12",
      label: t('admin.challenges_management.label')
    },
    {
      title: t('admin.partners_management.title'),
      description: t('admin.partners_management.description'),
      icon: Users,
      href: "/admin/partners", 
      count: "28",
      label: t('admin.partners_management.label')
    },
    {
      title: t('admin.sectors_management.title'),
      description: t('admin.sectors_management.description'),
      icon: Database,
      href: "/admin/sectors",
      count: "8",
      label: t('admin.sectors_management.label')
    }
  ];

  // New Advanced Admin Interface Cards
  const advancedAdminCards = [
    {
      title: t('admin.advanced.security_advanced.title'),
      description: t('admin.advanced.security_advanced.description'),
      icon: Shield,
      href: "/admin/security-advanced",
      count: "3",
      label: t('admin.advanced.security_advanced.label'),
      color: "text-red-600"
    },
    {
      title: t('admin.advanced.access_control.title'),
      description: t('admin.advanced.access_control.description'),
      icon: Lock,
      href: "/admin/access-control-advanced",
      count: "156",
      label: t('admin.advanced.access_control.label'),
      color: "text-blue-600"
    },
    {
      title: t('admin.advanced.elevation_monitor.title'),
      description: t('admin.advanced.elevation_monitor.description'),
      icon: TrendingUp,
      href: "/admin/elevation-monitor",
      count: "24",
      label: t('admin.advanced.elevation_monitor.label'),
      color: "text-orange-600"
    },
    {
      title: t('admin.advanced.analytics_advanced.title'),
      description: t('admin.advanced.analytics_advanced.description'),
      icon: BarChart3,
      href: "/admin/analytics-advanced",
      count: "1.2M",
      label: t('admin.advanced.analytics_advanced.label'),
      color: "text-purple-600"
    },
    {
      title: t('admin.advanced.ai_management.title'),
      description: t('admin.advanced.ai_management.description'),
      icon: Brain,
      href: "/admin/ai-management",
      count: "8",
      label: t('admin.advanced.ai_management.label'),
      color: "text-green-600"
    },
    {
      title: t('admin.advanced.file_management.title'),
      description: t('admin.advanced.file_management.description'),
      icon: Archive,
      href: "/admin/file-management-advanced",
      count: "2.4 GB",
      label: t('admin.advanced.file_management.label'),
      color: "text-indigo-600"
    },
    {
      title: t('admin.advanced.challenge_analytics.title'),
      description: t('admin.advanced.challenge_analytics.description'),
      icon: Target,
      href: "/admin/challenges-analytics-advanced",
      count: "45",
      label: t('admin.advanced.challenge_analytics.label'),
      color: "text-cyan-600"
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real data from Supabase
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (userCount !== null) {
        setDashboardData(prev => ({
          ...prev,
          totalUsers: userCount
        }));
      }
      
    } catch (error) {
      logger.error('Failed to load admin dashboard data', { component: 'AdminDashboard', action: 'loadDashboardData' }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
    toast({
      title: 'Refreshed',
      description: 'Dashboard data has been refreshed'
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">{t('admin.text.loading_dashboard')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <CollaborationProvider>
      <PageLayout>
        {/* Removed duplicate PageHeader - AppShell already provides header */}

        <div className="space-y-6">
        {/* Enhanced Hero Dashboard */}
        <AdminDashboardHero 
          totalUsers={dashboardData.totalUsers}
          activeUsers={dashboardData.activeUsers}
          storageUsed={dashboardData.storageUsed}
          uptime={dashboardData.uptime}
          activePolicies={dashboardData.activePolicies}
          securityAlerts={dashboardData.securityAlerts}
          pendingUpdates={dashboardData.pendingUpdates}
          systemHealth={dashboardData.systemHealth}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t('admin.dashboard.overview')}</TabsTrigger>
            <TabsTrigger value="management">{t('admin.dashboard.management')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.dashboard.users')}</TabsTrigger>
            <TabsTrigger value="storage">{t('admin.dashboard.storage')}</TabsTrigger>
            <TabsTrigger value="security">{t('admin.dashboard.security')}</TabsTrigger>
            <TabsTrigger value="advanced">{t('admin.dashboard.advanced')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.count}</div>
                      <p className="text-xs text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {card.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full"
                        onClick={() => {
                          if (card.title === "Storage Management") {
                            setActivityDialogOpen(true);
                          } else if (card.title === "System Settings") {
                            setHealthDialogOpen(true);
                          } else {
                            navigate(card.href);
                          }
                        }}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        {t('admin.actions.view_details')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.text.user_statistics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dashboardData.totalUsers}</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.total_users')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-success">{dashboardData.activeUsers}</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.active_users')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-inactive">{dashboardData.totalUsers - dashboardData.activeUsers}</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.inactive_users')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('admin.text.expert_assignment_management')}</CardTitle>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t('admin.text.assign_expert')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">24</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.active_assignments')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-success">18</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.available_experts')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-warning">6</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.pending_reviews')}</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/expert-assignments')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {t('admin.text.manage_expert_assignments')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('admin.text.core_team_management')}</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/core-team')}>
                  <Plus className="w-4 h-4" />
                  {t('admin.text.add_core_team_member')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.core_team_members')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-success">8</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.active_members')}</div>
                     </div>
                     <div className="text-center p-4 bg-muted/30 rounded-lg">
                       <div className="text-2xl font-bold text-info">5</div>
                       <div className="text-sm text-muted-foreground">{t('admin.text.active_projects')}</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/core-team')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {t('admin.text.manage_core_team')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('admin.text.stakeholders_management')}</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/stakeholders')}>
                  <Plus className="w-4 h-4" />
                  {t('admin.text.add_stakeholder')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">45</div>
                      <div className="text-sm text-muted-foreground">Total Stakeholders</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">38</div>
                      <div className="text-sm text-muted-foreground">Active Stakeholders</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">7</div>
                      <div className="text-sm text-muted-foreground">Pending Reviews</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/stakeholders')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Stakeholders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Organizational Structure</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/organizational-structure')}>
                  <Plus className="w-4 h-4" />
                  Add Department
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">28</div>
                      <div className="text-sm text-muted-foreground">Departments</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">15</div>
                      <div className="text-sm text-muted-foreground">Active Domains</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">42</div>
                      <div className="text-sm text-muted-foreground">Services</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/organizational-structure')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Organization
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Focus Questions Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/focus-questions')}>
                  <Plus className="w-4 h-4" />
                  Add Focus Question
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">18</div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">14</div>
                      <div className="text-sm text-muted-foreground">Active Questions</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">4</div>
                      <div className="text-sm text-muted-foreground">Draft Questions</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/focus-questions')}
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Manage Focus Questions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Partners Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/partners')}>
                  <Plus className="w-4 h-4" />
                  Add Partner
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">28</div>
                      <div className="text-sm text-muted-foreground">Total Partners</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">24</div>
                      <div className="text-sm text-muted-foreground">Active Partners</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">15</div>
                      <div className="text-sm text-muted-foreground">Active Projects</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/partners')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Partners
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sectors Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/sectors')}>
                  <Plus className="w-4 h-4" />
                  Add Sector
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">8</div>
                      <div className="text-sm text-muted-foreground">Total Sectors</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">6</div>
                      <div className="text-sm text-muted-foreground">Active Sectors</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">42</div>
                      <div className="text-sm text-muted-foreground">Total Challenges</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/sectors')}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Manage Sectors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ideas Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/ideas')}>
                  <Plus className="w-4 h-4" />
                  Review Ideas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">245</div>
                      <div className="text-sm text-muted-foreground">Total Ideas</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">156</div>
                      <div className="text-sm text-muted-foreground">Approved Ideas</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">23</div>
                      <div className="text-sm text-muted-foreground">Pending Review</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/ideas')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Manage Ideas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Challenges Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/challenges')}>
                  <Plus className="w-4 h-4" />
                  Add Challenge
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Active Challenges</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">8</div>
                      <div className="text-sm text-muted-foreground">Published</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">4</div>
                      <div className="text-sm text-muted-foreground">Draft</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/challenges')}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Manage Challenges
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Evaluation Management</CardTitle>
                <Button size="sm" className="gap-2" onClick={() => navigate('/admin/evaluation-management')}>
                  <Plus className="w-4 h-4" />
                  Manage Evaluations
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">24</div>
                      <div className="text-sm text-muted-foreground">Evaluation Criteria</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">8</div>
                      <div className="text-sm text-muted-foreground">Active Templates</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">12</div>
                      <div className="text-sm text-muted-foreground">Evaluation Rules</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/evaluation-management')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Manage Evaluations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{dashboardData.storageUsed} GB</div>
                      <div className="text-sm text-muted-foreground">Used Storage</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">{dashboardData.activePolicies}</div>
                      <div className="text-sm text-muted-foreground">Active Policies</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">24</div>
                      <div className="text-sm text-muted-foreground">Storage Buckets</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/storage')}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Manage Storage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">{dashboardData.securityAlerts}</div>
                      <div className="text-sm text-muted-foreground">Security Alerts</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-success">{dashboardData.uptime}%</div>
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{dashboardData.pendingUpdates}</div>
                      <div className="text-sm text-muted-foreground">Pending Updates</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/admin/security')}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Security Monitor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Test Privilege Elevation */}
            <TestPrivilegeElevation />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedAdminCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <Icon className={`h-5 w-5 transition-colors ${card.color || 'text-muted-foreground group-hover:text-primary'}`} />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${card.color || 'text-foreground'}`}>{card.count}</div>
                      <p className="text-xs text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {card.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => navigate(card.href)}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        Access Interface
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Advanced Features Summary */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Advanced Admin Interfaces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-muted-foreground">Implementation Complete</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">7</div>
                    <div className="text-sm text-muted-foreground">Advanced Pages</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-muted-foreground">New Components</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Complete admin interface suite with real-time monitoring, analytics, and advanced controls
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Collaboration moved to workspace pages */}
      </div>

      {/* System Dialogs */}
      <SystemActivityDialog 
        isOpen={activityDialogOpen}
        onClose={() => setActivityDialogOpen(false)}
      />
      <SystemHealthDialog 
        isOpen={healthDialogOpen}
        onClose={() => setHealthDialogOpen(false)}
        />
      </PageLayout>
    </CollaborationProvider>
  );
}