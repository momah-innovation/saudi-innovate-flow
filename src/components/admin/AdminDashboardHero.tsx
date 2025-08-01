import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Database,
  Shield,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Settings
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface AdminDashboardHeroProps {
  totalUsers: number;
  activeUsers: number;
  storageUsed: number;
  uptime: number;
  activePolicies: number;
  securityAlerts: number;
  pendingUpdates: number;
  systemHealth: string;
}

export const AdminDashboardHero = ({
  totalUsers,
  activeUsers,
  storageUsed,
  uptime,
  activePolicies,
  securityAlerts,
  pendingUpdates,
  systemHealth
}: AdminDashboardHeroProps) => {
  const { isRTL } = useDirection();

  const metrics = [
    {
      title: isRTL ? 'إجمالي المستخدمين' : 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      trend: isRTL ? '+12% من الشهر الماضي' : '+12% from last month',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: isRTL ? 'المستخدمون النشطون' : 'Active Users',
      value: activeUsers.toLocaleString(),
      icon: TrendingUp,
      trend: isRTL ? `${activeUsers} متصل الآن` : `${activeUsers} online now`,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: isRTL ? 'استخدام التخزين' : 'Storage Used',
      value: `${storageUsed.toFixed(1)} GB`,
      icon: Database,
      trend: isRTL ? '+5% هذا الأسبوع' : '+5% this week',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: isRTL ? 'وقت التشغيل' : 'System Uptime',
      value: `${uptime.toFixed(1)}%`,
      icon: Activity,
      trend: isRTL ? 'متاح 24/7' : '24/7 available',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  const quickStats = [
    {
      label: isRTL ? 'السياسات النشطة' : 'Active Policies',
      value: activePolicies,
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      label: isRTL ? 'تنبيهات الأمان' : 'Security Alerts',
      value: securityAlerts,
      icon: AlertCircle,
      color: securityAlerts > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      label: isRTL ? 'التحديثات المعلقة' : 'Pending Updates',
      value: pendingUpdates,
      icon: Settings,
      color: pendingUpdates > 0 ? 'text-orange-600' : 'text-green-600'
    },
    {
      label: isRTL ? 'حالة النظام' : 'System Health',
      value: systemHealth,
      icon: CheckCircle2,
      color: systemHealth === 'Healthy' ? 'text-green-600' : 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all duration-300 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'حالة مكونات النظام' : 'System Components Status'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {isRTL ? 'قاعدة البيانات: متصلة' : 'Database: Online'}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {isRTL ? 'التخزين: صحي' : 'Storage: Healthy'}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {isRTL ? 'واجهة البرمجة: نشطة' : 'API: Active'}
            </Badge>
            <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {isRTL ? 'الأمان: مراقب' : 'Security: Monitoring'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};