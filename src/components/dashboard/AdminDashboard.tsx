import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useAppTranslation';
import { 
  AdminPageWrapper, 
  AdminContentGrid, 
  MetricCard, 
  Heading1, 
  BodyText,
  Icon 
} from '@/components/ui';
import { Users, Settings, Shield, BarChart3, Database, Calendar, Briefcase, Trophy } from 'lucide-react';

interface AdminDashboardProps {
  userProfile: any;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
}

export function AdminDashboard({ userProfile, canManageUsers, canManageSystem, canViewAnalytics }: AdminDashboardProps) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

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
      {/* Hero Section using Design System patterns */}
      <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon icon={Shield} className="w-6 h-6" />
          </div>
          <div>
            <Heading1 className="text-primary-foreground mb-2">
              {language === 'ar' ? 'لوحة التحكم الإدارية' : 'Administrative Dashboard'}
            </Heading1>
            <BodyText className="text-primary-foreground/90">
              {language === 'ar' 
                ? `أهلاً بك ${userProfile?.display_name || 'Admin'} - إدارة شاملة للنظام`
                : `Welcome ${userProfile?.display_name || 'Admin'} - Comprehensive system management`}
            </BodyText>
          </div>
        </div>
      </div>

      {/* Admin Actions organized by categories using MetricCard */}
      {Object.entries(actionsByCategory).map(([category, actions]) => (
        <div key={category} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {category === 'management' && <Icon icon={Users} className="w-4 h-4 text-primary" />}
              {category === 'content' && <Icon icon={Database} className="w-4 h-4 text-primary" />}
              {category === 'security' && <Icon icon={Shield} className="w-4 h-4 text-primary" />}
              {category === 'analytics' && <Icon icon={BarChart3} className="w-4 h-4 text-primary" />}
              {category === 'system' && <Icon icon={Settings} className="w-4 h-4 text-primary" />}
            </div>
            <Heading1 className="text-xl">
              {categoryLabels[category]?.[language] || category}
            </Heading1>
          </div>
          
          <AdminContentGrid viewMode="cards">
            {actions.map((action, index) => (
              <MetricCard
                key={index}
                title={action.title}
                value={language === 'ar' ? 'الوصول' : 'Access'}
                subtitle={action.description}
                icon={<Icon icon={action.icon} className="w-5 h-5" variant="primary" />}
                onClick={action.action}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/30"
              />
            ))}
          </AdminContentGrid>
        </div>
      ))}
    </AdminPageWrapper>
  );
}