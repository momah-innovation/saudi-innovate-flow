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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  const { t } = useUnifiedTranslation();

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
              {t('analytics:metrics.current_usage')}
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
        title={t('analytics:page_title')}
        description={t('analytics:description')}
        secondaryActions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('analytics:buttons.refresh')}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {t('analytics:buttons.export')}
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              {t('analytics:buttons.monitoring_settings')}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* System Status Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Server}
              title={t('analytics:metrics.system_uptime')}
              value={mockSystemMetrics.serverStatus.uptime}
              status="good"
              trend="up"
            />
            <MetricCard
              icon={Activity}
              title={t('analytics:metrics.avg_response_time')}
              value={`${mockSystemMetrics.serverStatus.avgResponseTime}${t('analytics:units.ms')}`}
              status="good"
            />
            <MetricCard
              icon={Users}
              title={t('analytics:metrics.active_connections')}
              value={formatNumber(mockSystemMetrics.performance.activeConnections)}
              status="good"
              trend="up"
            />
            <MetricCard
              icon={AlertTriangle}
              title={t('analytics:metrics.error_rate')}
              value={`${mockSystemMetrics.serverStatus.errorRate}%`}
              status="good"
              trend="down"
            />
          </div>

          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="performance">{t('analytics:tabs.performance')}</TabsTrigger>
              <TabsTrigger value="database">{t('analytics:tabs.database')}</TabsTrigger>
              <TabsTrigger value="security">{t('analytics:tabs.security')}</TabsTrigger>
              <TabsTrigger value="logs">{t('analytics:tabs.logs')}</TabsTrigger>
              <TabsTrigger value="monitoring">{t('analytics:tabs.monitoring')}</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PerformanceCard
                  icon={Cpu}
                  title={t('analytics:performance.cpu_usage')}
                  usage={mockSystemMetrics.performance.cpuUsage}
                />
                <PerformanceCard
                  icon={Server}
                  title={t('analytics:performance.memory_usage')}
                  usage={mockSystemMetrics.performance.memoryUsage}
                  total="16"
                  unit={t('analytics:units.gb')}
                />
                <PerformanceCard
                  icon={HardDrive}
                  title={t('analytics:performance.disk_usage')}
                  usage={mockSystemMetrics.performance.diskUsage}
                  total="500"
                  unit={t('analytics:units.gb')}
                />
                <PerformanceCard
                  icon={Network}
                  title={t('analytics:performance.network_traffic')}
                  usage={mockSystemMetrics.performance.networkTraffic}
                  total="1"
                  unit={t('analytics:units.gbps')}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:performance.request_statistics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:metrics.total_requests_today')}</span>
                        <span className="font-bold text-blue-600">
                          {formatNumber(mockSystemMetrics.serverStatus.totalRequests)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:metrics.requests_per_second')}</span>
                        <span className="font-bold text-green-600">127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:metrics.peak_hours')}</span>
                        <span className="font-bold text-purple-600">2:00-4:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:performance.system_health')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:performance.system_services')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('analytics:performance.all_running')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:performance.last_backup')}</span>
                        <span className="font-medium">2024-08-30 02:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:performance.last_system_update')}</span>
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
                  title={t('analytics:metrics.queries_today')}
                  value={formatNumber(mockSystemMetrics.database.totalQueries)}
                  status="good"
                />
                <MetricCard
                  icon={Clock}
                  title={t('analytics:metrics.slow_queries')}
                  value={mockSystemMetrics.database.slowQueries}
                  status="warning"
                />
                <MetricCard
                  icon={Network}
                  title={t('analytics:metrics.connection_pool')}
                  value={`${mockSystemMetrics.database.connectionPool}%`}
                  status="good"
                />
                <MetricCard
                  icon={HardDrive}
                  title={t('analytics:metrics.storage_used')}
                  value={`${mockSystemMetrics.database.storageUsed}${t('analytics:units.gb')}`}
                  subtitle={`${t('analytics:units.of')} ${mockSystemMetrics.database.storageTotal}${t('analytics:units.gb')}`}
                  status="good"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:database.performance')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('analytics:database.avg_query_time')}</span>
                          <span>23{t('analytics:units.ms')}</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('analytics:database.index_usage')}</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('analytics:database.cache_hit_rate')}</span>
                          <span>98.7%</span>
                        </div>
                        <Progress value={98.7} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:database.table_statistics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>users</span>
                        <span className="font-medium">2,847 {t('analytics:database.rows')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>projects</span>
                        <span className="font-medium">1,256 {t('analytics:database.rows')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>challenges</span>
                        <span className="font-medium">89 {t('analytics:database.rows')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>submissions</span>
                        <span className="font-medium">5,432 {t('analytics:database.rows')}</span>
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
                  title={t('analytics:metrics.threats_blocked')}
                  value={mockSystemMetrics.security.threatBlocked}
                  status="good"
                />
                <MetricCard
                  icon={Users}
                  title={t('analytics:metrics.login_attempts')}
                  value={formatNumber(mockSystemMetrics.security.loginAttempts)}
                  status="good"
                />
                <MetricCard
                  icon={AlertTriangle}
                  title={t('analytics:metrics.failed_logins')}
                  value={mockSystemMetrics.security.failedLogins}
                  status="warning"
                />
                <MetricCard
                  icon={Activity}
                  title={t('analytics:metrics.suspicious_activity')}
                  value={mockSystemMetrics.security.suspiciousActivity}
                  status="warning"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:security.report')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:security.last_security_scan')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('analytics:security.clean')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:security.data_encryption')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {t('analytics:security.enabled')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:security.firewall_status')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {t('analytics:security.active')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:performance.last_backup')}</span>
                        <span className="font-medium">2024-08-30 02:00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:security.potential_vulnerabilities')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('analytics:security.pending_security_updates')}</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          2
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('analytics:security.weak_passwords')}</span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          5
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('analytics:security.expired_sessions')}</span>
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
                  {t('analytics:logs.recent_system_logs')}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('analytics:buttons.refresh')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t('analytics:buttons.export_logs')}
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
                    <CardTitle>{t('analytics:monitoring.system_alerts')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>{t('analytics:monitoring.high_memory_usage')}</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          {t('analytics:monitoring.warning')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{t('analytics:monitoring.backup_completed')}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {t('analytics:monitoring.success')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('analytics:monitoring.settings')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:monitoring.performance_monitoring')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {t('analytics:security.enabled')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:monitoring.email_alerts')}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {t('analytics:security.enabled')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('analytics:monitoring.log_retention')}</span>
                        <span className="font-medium">30 {t('analytics:monitoring.days')}</span>
                      </div>
                      <Button className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('analytics:buttons.configure_settings')}
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
