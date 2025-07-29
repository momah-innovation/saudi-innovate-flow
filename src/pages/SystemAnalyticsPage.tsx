import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Server, Activity, AlertTriangle, CheckCircle,
  Database, Network, Cpu, HardDrive,
  Users, Clock, TrendingUp, TrendingDown,
  RefreshCw, Download, Settings
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockSystemMetrics = {
  serverStatus: {
    uptime: '99.97%',
    lastDowntime: '2024-07-15',
    totalRequests: 2847293,
    avgResponseTime: 145,
    errorRate: 0.03
  },
  performance: {
    cpuUsage: 67,
    memoryUsage: 74,
    diskUsage: 45,
    networkTraffic: 89,
    activeConnections: 1247
  },
  database: {
    totalQueries: 45672,
    slowQueries: 23,
    connectionPool: 85,
    storageUsed: 2.4,
    storageTotal: 10.0
  },
  security: {
    threatBlocked: 156,
    loginAttempts: 12847,
    failedLogins: 245,
    suspiciousActivity: 12
  }
};

const mockSystemLogs = [
  {
    id: 1,
    timestamp: '2024-08-30 14:23:45',
    level: 'info',
    service: 'API Gateway',
    message: 'Request processed successfully',
    details: 'GET /api/challenges - 200ms'
  },
  {
    id: 2,
    timestamp: '2024-08-30 14:22:12',
    level: 'warning',
    service: 'Database',
    message: 'Slow query detected',
    details: 'Query took 2.3s - SELECT * FROM projects WHERE...'
  },
  {
    id: 3,
    timestamp: '2024-08-30 14:20:33',
    level: 'error',
    service: 'Authentication',
    message: 'Failed login attempt',
    details: 'IP: 192.168.1.100 - Invalid credentials'
  },
  {
    id: 4,
    timestamp: '2024-08-30 14:18:07',
    level: 'info',
    service: 'File Storage',
    message: 'File uploaded successfully',
    details: 'document.pdf - 2.3MB'
  }
];

const SystemAnalyticsPage = () => {
  const { isRTL } = useDirection();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(num);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Activity className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-600';
    if (usage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, status, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
              </div>
            )}
            <Icon className={`h-8 w-8 ${
              status === 'good' ? 'text-green-500' :
              status === 'warning' ? 'text-yellow-500' :
              status === 'error' ? 'text-red-500' :
              'text-blue-500'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceCard = ({ icon: Icon, title, usage, total, unit }: any) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {isRTL ? 'الاستخدام الحالي' : 'Current Usage'}
            </span>
            <span className={`font-medium ${getUsageColor(usage)}`}>
              {usage}%
            </span>
          </div>
          <Progress value={usage} className="h-2" />
          {total && (
            <div className="text-xs text-muted-foreground">
              {total} {unit}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const LogEntry = ({ log }: { log: any }) => (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <Badge className={getLevelColor(log.level)}>
        {getLevelIcon(log.level)}
        <span className="ml-1 capitalize">{log.level}</span>
      </Badge>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{log.service}</span>
          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
        </div>
        <p className="text-sm">{log.message}</p>
        {log.details && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">{log.details}</p>
        )}
      </div>
    </div>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'تحليلات النظام' : 'System Analytics'}
        description={isRTL ? 'مراقبة أداء النظام والخوادم والأمان' : 'Monitor system performance, servers, and security'}
        secondaryActions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {isRTL ? 'تحديث' : 'Refresh'}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {isRTL ? 'تصدير' : 'Export'}
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              {isRTL ? 'إعدادات المراقبة' : 'Monitoring Settings'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* System Status Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Server}
              title={isRTL ? 'وقت التشغيل' : 'System Uptime'}
              value={mockSystemMetrics.serverStatus.uptime}
              status="good"
              trend="up"
            />
            <MetricCard
              icon={Activity}
              title={isRTL ? 'متوسط الاستجابة' : 'Avg Response Time'}
              value={`${mockSystemMetrics.serverStatus.avgResponseTime}ms`}
              status="good"
            />
            <MetricCard
              icon={Users}
              title={isRTL ? 'الاتصالات النشطة' : 'Active Connections'}
              value={formatNumber(mockSystemMetrics.performance.activeConnections)}
              status="good"
              trend="up"
            />
            <MetricCard
              icon={AlertTriangle}
              title={isRTL ? 'معدل الأخطاء' : 'Error Rate'}
              value={`${mockSystemMetrics.serverStatus.errorRate}%`}
              status="good"
              trend="down"
            />
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="performance">{isRTL ? 'الأداء' : 'Performance'}</TabsTrigger>
              <TabsTrigger value="database">{isRTL ? 'قاعدة البيانات' : 'Database'}</TabsTrigger>
              <TabsTrigger value="security">{isRTL ? 'الأمان' : 'Security'}</TabsTrigger>
              <TabsTrigger value="logs">{isRTL ? 'السجلات' : 'Logs'}</TabsTrigger>
              <TabsTrigger value="monitoring">{isRTL ? 'المراقبة' : 'Monitoring'}</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  icon={Cpu}
                  title={isRTL ? 'المعالج' : 'CPU Usage'}
                  usage={mockSystemMetrics.performance.cpuUsage}
                />
                <PerformanceCard
                  icon={Server}
                  title={isRTL ? 'الذاكرة' : 'Memory Usage'}
                  usage={mockSystemMetrics.performance.memoryUsage}
                  total="16"
                  unit="GB"
                />
                <PerformanceCard
                  icon={HardDrive}
                  title={isRTL ? 'التخزين' : 'Disk Usage'}
                  usage={mockSystemMetrics.performance.diskUsage}
                  total="500"
                  unit="GB"
                />
                <PerformanceCard
                  icon={Network}
                  title={isRTL ? 'الشبكة' : 'Network Traffic'}
                  usage={mockSystemMetrics.performance.networkTraffic}
                  total="1"
                  unit="Gbps"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'إحصائيات الطلبات' : 'Request Statistics'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'إجمالي الطلبات اليوم' : 'Total Requests Today'}</span>
                        <span className="font-bold text-blue-600">
                          {formatNumber(mockSystemMetrics.serverStatus.totalRequests)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'الطلبات في الثانية' : 'Requests per Second'}</span>
                        <span className="font-bold text-green-600">127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'أوقات الذروة' : 'Peak Hours'}</span>
                        <span className="font-bold text-purple-600">2:00-4:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'صحة النظام' : 'System Health'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'خدمات النظام' : 'System Services'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {isRTL ? 'تعمل بشكل طبيعي' : 'All Running'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'آخر نسخ احتياطي' : 'Last Backup'}</span>
                        <span className="font-medium">2024-08-30 02:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'آخر تحديث للنظام' : 'Last System Update'}</span>
                        <span className="font-medium">2024-08-25</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  icon={Database}
                  title={isRTL ? 'استعلامات اليوم' : 'Queries Today'}
                  value={formatNumber(mockSystemMetrics.database.totalQueries)}
                  status="good"
                />
                <MetricCard
                  icon={Clock}
                  title={isRTL ? 'استعلامات بطيئة' : 'Slow Queries'}
                  value={mockSystemMetrics.database.slowQueries}
                  status="warning"
                />
                <MetricCard
                  icon={Network}
                  title={isRTL ? 'تجمع الاتصالات' : 'Connection Pool'}
                  value={`${mockSystemMetrics.database.connectionPool}%`}
                  status="good"
                />
                <MetricCard
                  icon={HardDrive}
                  title={isRTL ? 'مساحة التخزين' : 'Storage Used'}
                  value={`${mockSystemMetrics.database.storageUsed}GB`}
                  subtitle={`${isRTL ? 'من' : 'of'} ${mockSystemMetrics.database.storageTotal}GB`}
                  status="good"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'أداء قاعدة البيانات' : 'Database Performance'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{isRTL ? 'متوسط وقت الاستعلام' : 'Avg Query Time'}</span>
                          <span>23ms</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{isRTL ? 'استخدام الفهارس' : 'Index Usage'}</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{isRTL ? 'معدل إصابة التخزين المؤقت' : 'Cache Hit Rate'}</span>
                          <span>98.7%</span>
                        </div>
                        <Progress value={98.7} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'إحصائيات الجداول' : 'Table Statistics'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>users</span>
                        <span className="font-medium">2,847 {isRTL ? 'سجل' : 'rows'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>projects</span>
                        <span className="font-medium">1,256 {isRTL ? 'سجل' : 'rows'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>challenges</span>
                        <span className="font-medium">89 {isRTL ? 'سجل' : 'rows'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>submissions</span>
                        <span className="font-medium">5,432 {isRTL ? 'سجل' : 'rows'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  icon={AlertTriangle}
                  title={isRTL ? 'التهديدات المحجوبة' : 'Threats Blocked'}
                  value={mockSystemMetrics.security.threatBlocked}
                  status="good"
                />
                <MetricCard
                  icon={Users}
                  title={isRTL ? 'محاولات تسجيل الدخول' : 'Login Attempts'}
                  value={formatNumber(mockSystemMetrics.security.loginAttempts)}
                  status="good"
                />
                <MetricCard
                  icon={AlertTriangle}
                  title={isRTL ? 'تسجيل دخول فاشل' : 'Failed Logins'}
                  value={mockSystemMetrics.security.failedLogins}
                  status="warning"
                />
                <MetricCard
                  icon={Activity}
                  title={isRTL ? 'نشاط مشبوه' : 'Suspicious Activity'}
                  value={mockSystemMetrics.security.suspiciousActivity}
                  status="warning"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'تقرير الأمان' : 'Security Report'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'آخر فحص أمني' : 'Last Security Scan'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {isRTL ? 'نظيف' : 'Clean'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'تشفير البيانات' : 'Data Encryption'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {isRTL ? 'مفعل' : 'Enabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'جدار الحماية' : 'Firewall Status'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {isRTL ? 'نشط' : 'Active'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'آخر نسخة احتياطية' : 'Last Backup'}</span>
                        <span className="font-medium">2024-08-30 02:00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'نقاط الضعف المحتملة' : 'Potential Vulnerabilities'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{isRTL ? 'تحديثات الأمان المعلقة' : 'Pending Security Updates'}</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          2
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{isRTL ? 'كلمات مرور ضعيفة' : 'Weak Passwords'}</span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          5
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{isRTL ? 'جلسات منتهية الصلاحية' : 'Expired Sessions'}</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          12
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {isRTL ? 'سجلات النظام الحديثة' : 'Recent System Logs'}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isRTL ? 'تحديث' : 'Refresh'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {isRTL ? 'تصدير السجلات' : 'Export Logs'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockSystemLogs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'تنبيهات النظام' : 'System Alerts'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>{isRTL ? 'استخدام ذاكرة عالي' : 'High Memory Usage'}</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          {isRTL ? 'تحذير' : 'Warning'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{isRTL ? 'النسخ الاحتياطي مكتمل' : 'Backup Completed'}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {isRTL ? 'تم' : 'Success'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'إعدادات المراقبة' : 'Monitoring Settings'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'مراقبة الأداء' : 'Performance Monitoring'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {isRTL ? 'مفعل' : 'Enabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'تنبيهات البريد الإلكتروني' : 'Email Alerts'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {isRTL ? 'مفعل' : 'Enabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'حفظ السجلات' : 'Log Retention'}</span>
                        <span className="font-medium">30 {isRTL ? 'يوم' : 'days'}</span>
                      </div>
                      <Button className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        {isRTL ? 'تعديل الإعدادات' : 'Configure Settings'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default SystemAnalyticsPage;