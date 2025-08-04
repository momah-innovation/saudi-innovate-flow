import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useGlobalRoleTheme } from '@/hooks/useGlobalRoleTheme';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { 
  AdminPageWrapper, 
  AdminContentGrid, 
  MetricCard, 
  Heading1, 
  BodyText,
  Icon 
} from '@/components/ui';
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
  Zap
} from 'lucide-react';

interface AdminDashboardProps {
  userProfile: any;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
}

export function AdminDashboard({ userProfile, canManageUsers, canManageSystem, canViewAnalytics }: AdminDashboardProps) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { getPrimaryRole } = useRoleAccess();
  const systemHealth = useSystemHealth();
  
  // Apply role-based theming
  useGlobalRoleTheme();
  
  // Log current role for debugging
  useEffect(() => {
    const role = getPrimaryRole();
    console.log('Admin Dashboard - Current role:', role);
  }, [getPrimaryRole]);

  const adminActions = [
    // Dashboard Routes (New unified admin interface)
    {
      title: language === 'ar' ? 'إدارة المستخدمين' : 'User Management',
      description: language === 'ar' ? 'إدارة المستخدمين والأدوار والصلاحيات' : 'Manage users, roles and permissions',
      icon: Users,
      action: () => navigate('/admin/users'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'إدارة الأدوار' : 'Role Management',
      description: language === 'ar' ? 'تكوين الأدوار والصلاحيات' : 'Configure roles and permissions',
      icon: Shield,
      action: () => navigate('/admin/organizational-structure'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'التحكم في الوصول' : 'Access Control',
      description: language === 'ar' ? 'إدارة التحكم في الوصول للصفحات والميزات' : 'Manage page and feature access control',
      icon: Shield,
      action: () => navigate('/admin/expert-assignments'),
      show: canManageSystem,
      category: 'security'
    },
    {
      title: language === 'ar' ? 'إدارة التحديات' : 'Challenge Management',
      description: language === 'ar' ? 'إنشاء وإدارة التحديات والمسابقات' : 'Create and manage challenges and competitions',
      icon: BarChart3,
      action: () => navigate('/admin/challenges'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الأفكار' : 'Ideas Management',
      description: language === 'ar' ? 'مراجعة وإدارة الأفكار المقترحة' : 'Review and manage submitted ideas',
      icon: Database,
      action: () => navigate('/ideas'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'التحليلات والتقارير' : 'Analytics & Reports',
      description: language === 'ar' ? 'عرض تقارير النظام والإحصائيات المتقدمة' : 'View system reports and advanced analytics',
      icon: BarChart3,
      action: () => navigate('/admin/evaluations'),
      show: canViewAnalytics,
      category: 'analytics'
    },
    {
      title: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
      description: language === 'ar' ? 'تكوين إعدادات النظام العامة' : 'Configure global system settings',
      icon: Settings,
      action: () => navigate('/admin/system-settings'),
      show: canManageSystem,
      category: 'system'
    },
    {
      title: language === 'ar' ? 'إدارة الفعاليات' : 'Events Management',
      description: language === 'ar' ? 'تنظيم وإدارة الفعاليات والمؤتمرات' : 'Organize and manage events and conferences',
      icon: Users,
      action: () => navigate('/admin/events'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الحملات' : 'Campaigns Management',
      description: language === 'ar' ? 'إنشاء وإدارة حملات الابتكار' : 'Create and manage innovation campaigns',
      icon: Database,
      action: () => navigate('/admin/campaigns'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الشراكات' : 'Partners Management',
      description: language === 'ar' ? 'إدارة الشراكات والتعاون الخارجي' : 'Manage partnerships and external collaborations',
      icon: Users,
      action: () => navigate('/admin/partners'),
      show: true,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'إدارة الفرق' : 'Teams Management',
      description: language === 'ar' ? 'تنظيم فرق العمل والمشاريع' : 'Organize work teams and projects',
      icon: Users,
      action: () => navigate('/innovation-teams'),
      show: true,
      category: 'management'
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 backdrop-blur-sm flex items-center justify-center">
            <Icon icon={Shield} className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Heading1 className="mb-2">
              {language === 'ar' ? 'لوحة التحكم الإدارية' : 'Administrative Dashboard'}
            </Heading1>
            <BodyText className="text-muted-foreground">
              {language === 'ar' 
                ? `أهلاً بك ${userProfile?.display_name || 'Admin'} - إدارة شاملة للنظام`
                : `Welcome ${userProfile?.display_name || 'Admin'} - Comprehensive system management`}
            </BodyText>
          </div>
        </div>

        {/* Platform Widgets - System Status & Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health Widget */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{language === 'ar' ? 'حالة النظام' : 'System Health'}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium">{language === 'ar' ? 'واجهة البرمجة' : 'API Status'}</p>
                <p className="text-xs text-success">{language === 'ar' ? 'متاح' : 'Operational'}</p>
              </div>
              
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <Wifi className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium">{language === 'ar' ? 'الشبكة' : 'Network'}</p>
                <p className="text-xs text-success">{language === 'ar' ? 'مستقر' : 'Stable'}</p>
              </div>
              
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium">{language === 'ar' ? 'التخزين' : 'Storage'}</p>
                <p className="text-xs text-warning">
                  {systemHealth.storage.totalSize > 0 
                    ? `${Math.round((systemHealth.storage.totalSize / (1024 * 1024 * 1024)) * 100) / 100} GB`
                    : '0 GB'}
                </p>
              </div>
              
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium">{language === 'ar' ? 'الأمان' : 'Security'}</p>
                <p className="text-xs text-success">{language === 'ar' ? 'محمي' : 'Protected'}</p>
              </div>
            </div>
          </Card>

          {/* Resource Usage Widget */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{language === 'ar' ? 'استخدام الموارد' : 'Resource Usage'}</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{language === 'ar' ? 'ملفات النظام' : 'System Files'}</span>
                  <span className="text-sm font-medium">{systemHealth.storage.totalFiles}</span>
                </div>
                <Progress value={Math.min((systemHealth.storage.totalFiles / 1000) * 100, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{language === 'ar' ? 'أحداث الأمان' : 'Security Events'}</span>
                  <span className="text-sm font-medium">{systemHealth.security.totalSecurityEvents}</span>
                </div>
                <Progress 
                  value={systemHealth.security.highRiskEvents > 0 
                    ? Math.min((systemHealth.security.highRiskEvents / 10) * 100, 100)
                    : 5
                  } 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{language === 'ar' ? 'مساحة التخزين' : 'Storage Space'}</span>
                  <span className="text-sm font-medium">
                    {systemHealth.formatBytes(systemHealth.storage.totalSize)}
                  </span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{language === 'ar' ? 'الأنشطة المشبوهة' : 'Suspicious Activities'}</span>
                  <span className="text-sm font-medium">{systemHealth.security.suspiciousActivities}</span>
                </div>
                <Progress 
                  value={systemHealth.security.suspiciousActivities > 0 
                    ? Math.min((systemHealth.security.suspiciousActivities / 5) * 100, 100)
                    : 2
                  } 
                  className="h-2" 
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs-based Admin Interface following User Dashboard pattern */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {language === 'ar' ? 'الإدارة' : 'Management'}
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {language === 'ar' ? 'النظام' : 'System'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% {language === 'ar' ? 'هذا الشهر' : 'this month'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +3 {language === 'ar' ? 'جديدة' : 'new'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'ar' ? 'الأفكار المقدمة' : 'Ideas Submitted'}
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,251</div>
                <p className="text-xs text-muted-foreground">
                  +47 {language === 'ar' ? 'هذا الأسبوع' : 'this week'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'ar' ? 'أداء النظام' : 'System Performance'}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.2%</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'وقت التشغيل' : 'uptime'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'الوظائف الأكثر استخداماً' : 'Most frequently used functions'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/admin/users')} className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
                </Button>
                <Button onClick={() => navigate('/admin/challenges')} variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'إدارة التحديات' : 'Manage Challenges'}
                </Button>
                <Button onClick={() => navigate('/admin/evaluations')} variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تقارير النظام' : 'System Reports'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'نشاط النظام' : 'System Activity'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'آخر التحديثات والأنشطة' : 'Latest updates and activities'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{language === 'ar' ? 'مستخدم جديد مسجل' : 'New user registered'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'منذ 5 دقائق' : '5 minutes ago'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="p-2 rounded-lg bg-success/10 text-success">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{language === 'ar' ? 'فكرة جديدة مقدمة' : 'New idea submitted'}</p>
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'منذ 15 دقيقة' : '15 minutes ago'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionsByCategory.management?.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                  <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto">
                    {language === 'ar' ? 'انقر للوصول' : 'Click to access'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionsByCategory.content?.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                  <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto">
                    {language === 'ar' ? 'انقر للوصول' : 'Click to access'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...actionsByCategory.system || [], ...actionsByCategory.security || [], ...actionsByCategory.analytics || []].map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                  <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto">
                    {language === 'ar' ? 'انقر للوصول' : 'Click to access'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminPageWrapper>
  );
}