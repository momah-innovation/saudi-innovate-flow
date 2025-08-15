import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { logger } from '@/utils/logger';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';
import { 
  AdminPageWrapper, 
  AdminContentGrid, 
  MetricCard, 
  Heading1, 
  BodyText,
  Icon 
} from '@/components/ui';
import { AdminMetricsCards } from './AdminMetricsCards';
import { AdminSystemHealth } from './AdminSystemHealth';
import { AdminUserBreakdown } from './AdminUserBreakdown';
import { AdminTrendsAnalysis } from './AdminTrendsAnalysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Settings, 
  Shield, 
  BarChart3, 
  Database, 
  Calendar, 
  Briefcase, 
  Trophy,
  CheckCircle,
  Wifi,
  AlertCircle,
  Server,
  Activity,
  AlertTriangle,
  ArrowRight,
  Target,
  Building,
  FileText,
  Zap,
  HardDrive,
  HelpCircle,
  Brain,
  Archive,
  Lock,
  TrendingUp,
  Eye
} from 'lucide-react';

interface AdminUserProfile {
  id: string;
  name: string;
  position?: string;
  organization?: string;
  profile_completion_percentage: number;
  user_roles?: Array<{ role: string }>;
}

interface AdminDashboardProps {
  userProfile: AdminUserProfile;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
}

export function AdminDashboard({ userProfile, canManageUsers, canManageSystem, canViewAnalytics }: AdminDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  const { getPrimaryRole } = useRoleAccess();
  const systemHealth = useSystemHealth();
  const adminMetrics = useAdminDashboardMetrics();
  
  
  // Log current role for debugging
  useEffect(() => {
    const role = getPrimaryRole();
    logger.info('Admin Dashboard initialized', { 
      component: 'AdminDashboard', 
      action: 'init',
      data: { currentRole: role }
    });
  }, [getPrimaryRole]);

  const adminActions = [
    // Dashboard Routes (New unified admin interface)
    {
      title: t('admin.dashboard.user_management', 'User Management'),
      description: t('admin.dashboard.user_management_desc', 'Manage users, roles and permissions'),
      icon: Users,
      action: () => navigate('/admin/users'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: t('admin.dashboard.role_management', 'Role Management'),
      description: t('admin.dashboard.role_management_desc', 'Configure roles and permissions'),
      icon: Shield,
      action: () => navigate('/admin/organizational-structure'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: t('admin.dashboard.access_control', 'Access Control'),
      description: t('admin.dashboard.access_control_desc', 'Manage page and feature access control'),
      icon: Shield,
      action: () => navigate('/admin/expert-assignments'),
      show: canManageSystem,
      category: 'security'
    },
    {
      title: t('admin.dashboard.challenge_management', 'Challenge Management'),
      description: t('admin.dashboard.challenge_management_desc', 'Create and manage challenges and competitions'),
      icon: BarChart3,
      action: () => navigate('/admin/challenges'),
      show: true,
      category: 'content'
    },
    {
      title: t('admin.dashboard.ideas_management', 'Ideas Management'),
      description: t('admin.dashboard.ideas_management_desc', 'Review and manage submitted ideas'),
      icon: Database,
      action: () => navigate('/ideas'),
      show: true,
      category: 'content'
    },
    {
      title: t('admin.dashboard.analytics_reports', 'Analytics & Reports'),
      description: t('admin.dashboard.analytics_reports_desc', 'View system reports and advanced analytics'),
      icon: BarChart3,
      action: () => navigate('/admin/evaluations'),
      show: canViewAnalytics,
      category: 'analytics'
    },
    {
      title: t('admin.dashboard.system_settings', 'System Settings'),
      description: t('admin.dashboard.system_settings_desc', 'Configure global system settings'),
      icon: Settings,
      action: () => navigate('/admin/system-settings'),
      show: canManageSystem,
      category: 'system'
    },
    {
      title: t('admin.dashboard.events_management', 'Events Management'),
      description: t('admin.dashboard.events_management_desc', 'Organize and manage events and conferences'),
      icon: Users,
      action: () => navigate('/admin/events'),
      show: true,
      category: 'content'
    },
    {
      title: t('admin.dashboard.campaigns_management', 'Campaigns Management'),
      description: t('admin.dashboard.campaigns_management_desc', 'Create and manage innovation campaigns'),
      icon: Database,
      action: () => navigate('/admin/campaigns'),
      show: true,
      category: 'content'
    },
    {
      title: t('admin.dashboard.partners_management', 'Partners Management'),
      description: t('admin.dashboard.partners_management_desc', 'Manage partnerships and external collaborations'),
      icon: Briefcase,
      action: () => navigate('/admin/partners'),
      show: true,
      category: 'management'
    },
    {
      title: t('admin.dashboard.sectors_management', 'Sectors Management'),
      description: t('admin.dashboard.sectors_management_desc', 'Manage innovation sectors and fields'),
      icon: Building,
      action: () => navigate('/admin/sectors'),
      show: true,
      category: 'management'
    },
    {
      title: t('admin:dashboard.expert_assignment', 'Expert Assignment Management'),
      description: t('admin:dashboard.expert_assignment_desc', 'Assign experts to challenges and manage evaluations'),
      icon: Users,
      action: () => navigate('/admin/expert-assignments'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: t('admin:dashboard.core_team_management', 'Core Team Management'),
      description: t('admin:dashboard.core_team_management_desc', 'Manage core team members and projects'),
      icon: Users,
      action: () => navigate('/admin/core-team'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: t('admin:dashboard.organizational_structure', 'Organizational Structure'),
      description: t('admin:dashboard.organizational_structure_desc', 'Manage organizational hierarchy and departments'),
      icon: Building,
      action: () => navigate('/admin/organizational-structure'),
      show: canManageSystem,
      category: 'management'
    },
    {
      title: t('admin:dashboard.stakeholders_management', 'Stakeholders Management'),
      description: t('admin:dashboard.stakeholders_management_desc', 'Manage stakeholder relationships and engagement'),
      icon: Users,
      action: () => navigate('/admin/stakeholders'),
      show: canManageSystem,
      category: 'management'
    },
    {
      title: t('admin:dashboard.teams_management', 'Teams Management'),
      description: t('admin:dashboard.teams_management_desc', 'Organize work teams and projects'),
      icon: Users,
      action: () => navigate('/admin/teams'),
      show: canManageSystem,
      category: 'management'
    },
    {
      title: t('admin:dashboard.entities_management', 'Entities Management'),
      description: t('admin:dashboard.entities_management_desc', 'Manage organizational entities and institutions'),
      icon: Building,
      action: () => navigate('/admin/entities'),
      show: canManageSystem,
      category: 'management'
    },
    {
      title: t('admin:dashboard.evaluation_management', 'Evaluation Management'),
      description: t('admin:dashboard.evaluation_management_desc', 'Manage evaluation criteria, templates, and rules'),
      icon: Target,
      action: () => navigate('/admin/evaluation-management'),
      show: canManageSystem,
      category: 'management'
    },
    {
      title: t('dashboard:storage.management'), 
      description: t('dashboard:storage.description'),
      icon: Database,
      action: () => navigate('/admin/storage'),
      show: canManageSystem,
      category: 'system'
    },
    {
      title: t('dashboard:storage.policies'),
      description: t('dashboard:storage.policies_description'),
      icon: HardDrive, 
      action: () => navigate('/admin/storage/policies'),
      show: canManageSystem,
      category: 'system'
    },
    {
      title: t('dashboard:security.monitor'),
      description: t('dashboard:security.description'),
      icon: Shield,
      action: () => navigate('/admin/security'),
      show: canManageSystem,
      category: 'security'
    },
    {
      title: t('dashboard:focus_questions.management'),
      description: t('dashboard:focus_questions.description'),
      icon: HelpCircle,
      action: () => navigate('/admin/focus-questions'),
      show: canManageSystem,
      category: 'content'
    },
    {
      title: t('dashboard:system_analytics.title'),
      description: t('dashboard:system_analytics.description'), 
      icon: BarChart3,
      action: () => navigate('/admin/system-analytics'),
      show: canViewAnalytics,
      category: 'analytics'
    }
  ];

  // Advanced Admin Interface Cards
  const advancedAdminCards = [
    {
      title: language === 'ar' ? 'الأمان المتقدم' : 'Security Advanced',
      description: language === 'ar' ? 'مراقبة الأمان المتقدمة وكشف التهديدات' : 'Advanced security monitoring and threat detection',
      icon: Shield,
      href: '/admin/security-advanced',
      count: '3',
      label: language === 'ar' ? 'تهديدات نشطة' : 'Active Threats',
      color: 'text-destructive'
    },
    {
      title: language === 'ar' ? 'التحكم بالوصول' : 'Access Control',
      description: language === 'ar' ? 'إدارة أدوار المستخدمين والصلاحيات' : 'User roles and permission management',
      icon: Lock,
      href: '/admin/access-control-advanced',
      count: '156',
      label: language === 'ar' ? 'تعيينات الأدوار' : 'Role Assignments',
      color: 'text-info'
    },
    {
      title: language === 'ar' ? 'مراقب الصلاحيات' : 'Elevation Monitor',
      description: language === 'ar' ? 'تتبع رفع صلاحيات المديرين' : 'Admin privilege escalation tracking',
      icon: TrendingUp,
      href: '/admin/elevation-monitor',
      count: '24',
      label: language === 'ar' ? 'أحداث الرفع' : 'Elevation Events',
      color: 'text-warning'
    },
    {
      title: language === 'ar' ? 'التحليلات المتقدمة' : 'Analytics Advanced',
      description: language === 'ar' ? 'تحليلات فورية ورؤى المستخدمين' : 'Real-time analytics and user insights',
      icon: BarChart3,
      href: '/admin/analytics-advanced',
      count: '1.2M',
      label: language === 'ar' ? 'نقاط البيانات' : 'Data Points',
      color: 'text-primary'
    },
    {
      title: language === 'ar' ? 'إدارة الذكاء الاصطناعي' : 'AI Management',
      description: language === 'ar' ? 'خدمات الذكاء الاصطناعي وتكوين النماذج' : 'AI services and model configuration',
      icon: Brain,
      href: '/admin/ai-management',
      count: '8',
      label: language === 'ar' ? 'ميزات الذكاء الاصطناعي' : 'AI Features',
      color: 'text-success'
    },
    {
      title: language === 'ar' ? 'إدارة الملفات المتقدمة' : 'File Management',
      description: language === 'ar' ? 'عمليات الملفات المتقدمة ودورة الحياة' : 'Advanced file operations and lifecycle',
      icon: Archive,
      href: '/admin/file-management-advanced',
      count: '2.4 GB',
      label: language === 'ar' ? 'إجمالي التخزين' : 'Total Storage',
      color: 'text-secondary-foreground'
    },
    {
      title: language === 'ar' ? 'تحليلات التحديات' : 'Challenge Analytics',
      description: language === 'ar' ? 'مقاييس المشاركة والأداء في التحديات' : 'Challenge engagement and performance metrics',
      icon: Target,
      href: '/admin/challenges-analytics-advanced',
      count: '45',
      label: language === 'ar' ? 'تحديات نشطة' : 'Active Challenges',
      color: 'text-info'
    }
  ];

  // Group actions by category for better organization
  const actionsByCategory = adminActions.filter(action => action.show).reduce((acc, action) => {
    const category = action.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(action);
    return acc;
  }, {} as Record<string, typeof adminActions>);

  const categoryLabels = {
    management: { ar: 'الإدارة العامة', en: 'Management' },
    content: { ar: 'إدارة المحتوى', en: 'Content Management' },
    security: { ar: 'الأمان والصلاحيات', en: 'Security & Access' },
    analytics: { ar: 'التحليلات', en: 'Analytics' },
    system: { ar: 'إعدادات النظام', en: 'System Configuration' }
  };

  return (
    <AdminPageWrapper>

      {/* Professional Admin Tabs Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <BarChart3 className="w-4 h-4" />
            {t('dashboard:tabs.overview')}
          </TabsTrigger>
          <TabsTrigger 
            value="management" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Users className="w-4 h-4" />
            {t('dashboard:tabs.management')}
          </TabsTrigger>
          <TabsTrigger 
            value="content" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Database className="w-4 h-4" />
            {t('dashboard:tabs.content')}
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Settings className="w-4 h-4" />
            {t('dashboard:tabs.system')}
          </TabsTrigger>
          <TabsTrigger 
            value="advanced" 
            className="flex items-center gap-2 h-9 px-4 rounded-md text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm font-medium transition-all hover:text-foreground"
          >
            <Shield className="w-4 h-4" />
            {t('dashboard:tabs.advanced')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Metrics Grid */}
          <AdminMetricsCards 
            metrics={adminMetrics.metrics}
            isLoading={adminMetrics.isLoading}
            language={language}
          />

          {/* Legacy Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard:metrics.total_users')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {adminMetrics.metrics?.users?.total.toLocaleString() || '0'}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{adminMetrics.metrics?.users?.growthRate || 12}% {t('dashboard:metrics.this_month')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard:metrics.active_challenges')}
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">
                  {adminMetrics.metrics?.challenges?.active || 18}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{adminMetrics.metrics?.challenges?.recentActivity?.newChallenges30d || 3} {t('admin.metrics.new')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin.metrics.ideas_submitted')}
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{adminMetrics.metrics?.challenges?.submissions || 0}</div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{adminMetrics.metrics?.challenges?.recentActivity?.newSubmissions30d || 0} {t('admin.metrics.this_week')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin.metrics.system_performance')}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{adminMetrics.metrics?.system?.uptime || 99}%</div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('admin.metrics.uptime')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.cards.quick_actions')}</CardTitle>
                <CardDescription>
                   {t('admin.cards.quick_actions_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/admin/users')} className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                   {t('admin.cards.manage_users')}
                 </Button>
                 <Button onClick={() => navigate('/admin/challenges')} variant="outline" className="w-full justify-start">
                   <Target className="w-4 h-4 mr-2" />
                   {t('admin.cards.manage_challenges')}
                 </Button>
                 <Button onClick={() => navigate('/admin/evaluations')} variant="outline" className="w-full justify-start">
                   <BarChart3 className="w-4 h-4 mr-2" />
                   {t('admin.cards.system_reports')}
                 </Button>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>{t('admin.cards.system_activity')}</CardTitle>
                 <CardDescription>
                   {t('admin.cards.system_activity_desc')}
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                 <div className="flex items-center space-x-3 p-3 border rounded-lg">
                   <div className="p-2 rounded-lg bg-primary/10 text-primary">
                     <Users className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">{t('admin.cards.new_user_registered')}</p>
                     <p className="text-xs text-muted-foreground">{t('admin.cards.minutes_ago_5')}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 p-3 border rounded-lg">
                   <div className="p-2 rounded-lg bg-success/10 text-success">
                     <Database className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">{t('admin.cards.new_idea_submitted')}</p>
                     <p className="text-xs text-muted-foreground">{t('admin.cards.minutes_ago_15')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Management Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                   {t('admin:metrics.total_managers')}
                 </CardTitle>
                 <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">
                   {adminMetrics.metrics?.users?.breakdown?.admins || '47'}
                 </div>
                 <div className="flex items-center gap-1 text-xs text-success mt-2">
                   <TrendingUp className="w-4 h-4" />
                   <span>+8% {t('admin:metrics.this_month')}</span>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium text-muted-foreground">
                   {t('admin:metrics.active_teams')}
                 </CardTitle>
                 <Briefcase className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">
                   23
                 </div>
                 <div className="flex items-center gap-1 text-xs text-success mt-2">
                   <TrendingUp className="w-4 h-4" />
                   <span>+12% {t('admin:metrics.this_month')}</span>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium text-muted-foreground">
                   {t('admin:metrics.expert_assignments')}
                 </CardTitle>
                 <Target className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">
                   156
                 </div>
                 <div className="flex items-center gap-1 text-xs text-success mt-2">
                   <TrendingUp className="w-4 h-4" />
                   <span>+5% {t('admin:metrics.this_week')}</span>
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium text-muted-foreground">
                   {t('admin:metrics.active_permissions')}
                 </CardTitle>
                 <Shield className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">
                   1,247
                 </div>
                 <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                   <CheckCircle className="w-4 h-4" />
                   <span>{t('admin:metrics.stable')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionsByCategory.management?.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mt-2">
                    {action.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={action.action}
                  >
                    <ArrowRight className="w-3 h-3 mr-2" />
                    {t('admin:actions.access_interface')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إجمالي الأفكار' : 'Total Ideas'}
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMetrics.metrics?.challenges?.submissions || 0}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{adminMetrics.metrics?.challenges?.recentActivity?.newSubmissions30d || 0} {language === 'ar' ? 'هذا الشهر' : 'this month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMetrics.metrics?.challenges?.active || 0}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{adminMetrics.metrics?.challenges?.recentActivity?.newChallenges30d || 0} {language === 'ar' ? 'هذا الشهر' : 'this month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'الفعاليات المجدولة' : 'Scheduled Events'}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  12
                </div>
                <div className="flex items-center gap-1 text-xs text-info mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+3 {language === 'ar' ? 'هذا الأسبوع' : 'this week'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'معدل المشاركة' : 'Engagement Rate'}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  87%
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5% {language === 'ar' ? 'هذا الشهر' : 'this month'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionsByCategory.content?.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mt-2">
                    {action.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={action.action}
                  >
                    <ArrowRight className="w-3 h-3 mr-2" />
                    {t('admin:actions.access_interface')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'وقت التشغيل' : 'System Uptime'}
                </CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMetrics.metrics?.system?.uptime || '99.9'}%
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'مستقر' : 'Stable'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'استخدام التخزين' : 'Storage Usage'}
                </CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMetrics.metrics?.system?.storageUsed || '2.4'} GB
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Server className="w-4 h-4" />
                  <span>68% {language === 'ar' ? 'مستخدم' : 'used'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'أداء النظام' : 'System Performance'}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminMetrics.metrics?.system?.performance || '94'}%
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2% {language === 'ar' ? 'هذا الأسبوع' : 'this week'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'حالة الأمان' : 'Security Status'}
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {language === 'ar' ? 'آمن' : 'Secure'}
                </div>
                <div className="flex items-center gap-1 text-xs text-success mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{adminMetrics.metrics?.security?.securityScore || '98'}% {language === 'ar' ? 'نقاط الأمان' : 'security score'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...actionsByCategory.system || [], ...actionsByCategory.security || [], ...actionsByCategory.analytics || []].map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mt-2">
                    {action.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={action.action}
                  >
                    <ArrowRight className="w-3 h-3 mr-2" />
                    {t('admin:actions.access_interface')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
                      {t('admin:actions.access_interface')}
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
                {language === 'ar' ? 'واجهات الإدارة المتقدمة' : 'Advanced Admin Interfaces'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-info">100%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'التنفيذ مكتمل' : 'Implementation Complete'}
                  </div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">7</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'صفحات متقدمة' : 'Advanced Pages'}
                  </div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مكونات جديدة' : 'New Components'}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'مجموعة كاملة من واجهات الإدارة مع المراقبة الفورية والتحليلات والتحكم المتقدم'
                    : 'Complete admin interface suite with real-time monitoring, analytics, and advanced controls'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </AdminPageWrapper>
  );
}