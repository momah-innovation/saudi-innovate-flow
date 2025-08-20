
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { useUnifiedDashboardData } from '@/hooks/useUnifiedDashboardData';

interface ManagerDashboardProps {
  userProfile: any;
  canManageUsers: boolean;
  canViewSystemStats: boolean;
  canAccessAdminPanel: boolean;
}

export const ManagerDashboard = React.memo(function ManagerDashboard({ 
  userProfile, 
  canManageUsers, 
  canViewSystemStats, 
  canAccessAdminPanel 
}: ManagerDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  
  const { data: unifiedData, isLoading } = useUnifiedDashboardData('manager');

  // Use managerStats instead of adminStats
  const managerStats = React.useMemo(() => {
    const stats = unifiedData?.managerStats || {
      totalUsers: 0,
      activeUsers: 0,
      totalChallenges: 0,
      totalSubmissions: 0,
      systemHealth: 0,
      pendingApprovals: 0,
      systemUptime: 0,
      securityScore: 0
    };

    return [
      {
        title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
        value: `${stats.totalUsers || 0}`,
        subtitle: `${Math.round((stats.activeUsers || 0) / (stats.totalUsers || 1) * 100)}% active`,
        icon: Users,
        color: 'text-primary'
      },
      {
        title: language === 'ar' ? 'التحديات النشطة' : 'Active Challenges',
        value: `${stats.totalChallenges || 0}`,
        subtitle: `${stats.totalChallenges || 0} total challenges`,
        icon: Activity,
        color: 'text-info'
      },
      {
        title: language === 'ar' ? 'المشاركات' : 'Submissions',
        value: `${stats.totalSubmissions || 0}`,
        subtitle: `${stats.totalSubmissions || 0} total submissions`,
        icon: Shield,
        color: 'text-success'
      },
      {
        title: language === 'ar' ? 'وقت التشغيل' : 'System Uptime',
        value: `${stats.systemUptime || 0}%`,
        subtitle: `Security: ${stats.securityScore || 0}%`,
        icon: AlertTriangle,
        color: 'text-warning'
      }
    ];
  }, [unifiedData?.managerStats, language]);

  const managerActions = [
    {
      title: language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users',
      description: language === 'ar' ? 'إدارة المستخدمين والأدوار' : 'Manage users and roles',
      action: () => navigationHandler.navigateTo('/admin/users'),
      show: canManageUsers
    },
    {
      title: language === 'ar' ? 'إحصائيات النظام' : 'System Analytics',
      description: language === 'ar' ? 'عرض إحصائيات النظام المفصلة' : 'View detailed system statistics',
      action: () => navigationHandler.navigateTo('/admin/analytics'),
      show: canViewSystemStats
    },
    {
      title: language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel',
      description: language === 'ar' ? 'الوصول إلى لوحة الإدارة الشاملة' : 'Access comprehensive admin panel',
      action: () => navigationHandler.navigateTo('/admin'),
      show: canAccessAdminPanel
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {language === 'ar' ? 'لوحة المدير' : 'Manager Dashboard'}
            </h2>
          </div>
          <p className="text-white/80">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            {language === 'ar' ? 'لوحة المدير' : 'Manager Dashboard'}
          </h2>
        </div>
        <p className="text-white/80">
          {language === 'ar' 
            ? `أهلاً بك ${userProfile?.display_name || 'المدير'} - إدارة النظام والمستخدمين`
            : `Welcome ${userProfile?.display_name || 'Manager'} - System and user management`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {managerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 transition-colors ${stat.color || 'text-muted-foreground group-hover:text-primary'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {managerActions.filter(action => action.show).map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {action.title}
              </CardTitle>
              <Shield className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                {language === 'ar' ? 'الوصول للواجهة' : 'Access Interface'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default ManagerDashboard;
