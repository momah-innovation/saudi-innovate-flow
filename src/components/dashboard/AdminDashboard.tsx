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
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  ArrowRight
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
      action: () => navigate('/dashboard/users'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'إدارة الأدوار' : 'Role Management',
      description: language === 'ar' ? 'تكوين الأدوار والصلاحيات' : 'Configure roles and permissions',
      icon: Shield,
      action: () => navigate('/dashboard/roles'),
      show: canManageUsers,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'التحكم في الوصول' : 'Access Control',
      description: language === 'ar' ? 'إدارة التحكم في الوصول للصفحات والميزات' : 'Manage page and feature access control',
      icon: Shield,
      action: () => navigate('/dashboard/access-control'),
      show: canManageSystem,
      category: 'security'
    },
    {
      title: language === 'ar' ? 'إدارة التحديات' : 'Challenge Management',
      description: language === 'ar' ? 'إنشاء وإدارة التحديات والمسابقات' : 'Create and manage challenges and competitions',
      icon: BarChart3,
      action: () => navigate('/dashboard/challenges'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الأفكار' : 'Ideas Management',
      description: language === 'ar' ? 'مراجعة وإدارة الأفكار المقترحة' : 'Review and manage submitted ideas',
      icon: Database,
      action: () => navigate('/dashboard/ideas'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'التحليلات والتقارير' : 'Analytics & Reports',
      description: language === 'ar' ? 'عرض تقارير النظام والإحصائيات المتقدمة' : 'View system reports and advanced analytics',
      icon: BarChart3,
      action: () => navigate('/dashboard/analytics'),
      show: canViewAnalytics,
      category: 'analytics'
    },
    {
      title: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
      description: language === 'ar' ? 'تكوين إعدادات النظام العامة' : 'Configure global system settings',
      icon: Settings,
      action: () => navigate('/dashboard/system'),
      show: canManageSystem,
      category: 'system'
    },
    {
      title: language === 'ar' ? 'إدارة الفعاليات' : 'Events Management',
      description: language === 'ar' ? 'تنظيم وإدارة الفعاليات والمؤتمرات' : 'Organize and manage events and conferences',
      icon: Users,
      action: () => navigate('/dashboard/events'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الحملات' : 'Campaigns Management',
      description: language === 'ar' ? 'إنشاء وإدارة حملات الابتكار' : 'Create and manage innovation campaigns',
      icon: Database,
      action: () => navigate('/dashboard/campaigns'),
      show: true,
      category: 'content'
    },
    {
      title: language === 'ar' ? 'إدارة الشراكات' : 'Partners Management',
      description: language === 'ar' ? 'إدارة الشراكات والتعاون الخارجي' : 'Manage partnerships and external collaborations',
      icon: Users,
      action: () => navigate('/dashboard/partners'),
      show: true,
      category: 'management'
    },
    {
      title: language === 'ar' ? 'إدارة الفرق' : 'Teams Management',
      description: language === 'ar' ? 'تنظيم فرق العمل والمشاريع' : 'Organize work teams and projects',
      icon: Users,
      action: () => navigate('/dashboard/teams'),
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

      {/* Admin Actions organized by categories using enhanced card design */}
      {Object.entries(actionsByCategory).map(([category, actions]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              {category === 'management' && <Users className="w-5 h-5 text-primary-foreground" />}
              {category === 'content' && <Database className="w-5 h-5 text-primary-foreground" />}
              {category === 'security' && <Shield className="w-5 h-5 text-primary-foreground" />}
              {category === 'analytics' && <BarChart3 className="w-5 h-5 text-primary-foreground" />}
              {category === 'system' && <Settings className="w-5 h-5 text-primary-foreground" />}
            </div>
            <div>
              <Heading1 className="text-xl mb-1">
                {categoryLabels[category]?.[language] || category}
              </Heading1>
              <BodyText className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? `${actions.length} أدوات متاحة`
                  : `${actions.length} tools available`}
              </BodyText>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <Card 
                key={index}
                className="p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50 group"
                onClick={action.action}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                    <action.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    <span>{language === 'ar' ? 'انقر للوصول' : 'Click to access'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </AdminPageWrapper>
  );
}