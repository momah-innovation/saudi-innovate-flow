import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Lock, Eye, Clock, Activity } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export default function SecurityMonitor() {
  const { t, language } = useUnifiedTranslation();

  const securityMetrics = [
    {
      title: language === 'ar' ? 'تنبيهات أمنية' : 'Security Alerts',
      value: '3',
      description: language === 'ar' ? 'تنبيهات نشطة' : 'Active alerts',
      icon: AlertTriangle,
      status: 'warning'
    },
    {
      title: language === 'ar' ? 'محاولات دخول فاشلة' : 'Failed Login Attempts',
      value: '12',
      description: language === 'ar' ? 'خلال 24 ساعة' : 'Last 24 hours',
      icon: Lock,
      status: 'danger'
    },
    {
      title: language === 'ar' ? 'الجلسات النشطة' : 'Active Sessions',
      value: '156',
      description: language === 'ar' ? 'مستخدمين متصلين' : 'Connected users',
      icon: Activity,
      status: 'success'
    },
    {
      title: language === 'ar' ? 'مراجعة السجلات' : 'Audit Logs',
      value: '2,847',
      description: language === 'ar' ? 'إدخالات اليوم' : 'Today\'s entries',
      icon: Eye,
      status: 'info'
    }
  ];

  const recentSecurityEvents = [
    {
      time: '2 mins ago',
      event: language === 'ar' ? 'محاولة دخول مشبوهة من IP: 192.168.1.100' : 'Suspicious login attempt from IP: 192.168.1.100',
      severity: 'high'
    },
    {
      time: '15 mins ago',
      event: language === 'ar' ? 'تحديث كلمة مرور للمستخدم admin@example.com' : 'Password reset for user admin@example.com',
      severity: 'medium'
    },
    {
      time: '1 hour ago',
      event: language === 'ar' ? 'تسجيل دخول ناجح من جهاز جديد' : 'Successful login from new device',
      severity: 'low'
    }
  ];

  return (
    <AdminLayout
      title={language === 'ar' ? 'مراقب الأمان' : 'Security Monitor'}
      breadcrumbs={[
        { label: language === 'ar' ? 'لوحة الإدارة' : 'Admin', href: '/admin/dashboard' },
        { label: language === 'ar' ? 'مراقب الأمان' : 'Security Monitor' }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'ar' ? 'مراقب الأمان' : 'Security Monitor'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'مراقبة الأحداث الأمنية والتنبيهات'
                : 'Monitor security events and alerts'
              }
            </p>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {securityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'الأحداث الأمنية الأخيرة' : 'Recent Security Events'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'أحدث الأنشطة الأمنية في النظام'
                : 'Latest security activities in the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSecurityEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.severity === 'high' ? 'bg-red-500' :
                      event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm">{event.event}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}