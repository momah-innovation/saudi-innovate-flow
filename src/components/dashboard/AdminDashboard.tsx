import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, Shield, BarChart3, Database } from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useNavigate } from 'react-router-dom';

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
    {
      title: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users',
      description: language === 'ar' ? 'إضافة وإدارة المستخدمين والأدوار' : 'Add and manage users and roles',
      icon: Users,
      action: () => navigate('/admin/users'),
      show: canManageUsers
    },
    {
      title: language === 'ar' ? 'إعدادات النظام' : 'System Settings',
      description: language === 'ar' ? 'تكوين إعدادات النظام العامة' : 'Configure global system settings',
      icon: Settings,
      action: () => navigate('/admin/settings'),
      show: canManageSystem
    },
    {
      title: language === 'ar' ? 'التحليلات' : 'Analytics',
      description: language === 'ar' ? 'عرض تقارير النظام والإحصائيات' : 'View system reports and statistics',
      icon: BarChart3,
      action: () => navigate('/admin/analytics'),
      show: canViewAnalytics
    },
    {
      title: language === 'ar' ? 'إدارة المحتوى' : 'Content Management',
      description: language === 'ar' ? 'إدارة المحتوى والموارد' : 'Manage content and resources',
      icon: Database,
      action: () => navigate('/admin/content'),
      show: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            {language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
          </h2>
        </div>
        <p className="text-white/80">
          {language === 'ar' 
            ? `أهلاً بك ${userProfile?.display_name} - لديك صلاحيات إدارية كاملة`
            : `Welcome ${userProfile?.display_name} - You have full administrative access`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminActions.filter(action => action.show).map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <action.icon className="w-5 h-5 text-primary mr-3" />
              <div>
                <CardTitle className="text-base">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              <Button variant="outline" size="sm">
                {language === 'ar' ? 'انتقال' : 'Access'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}