import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityMetricsGrid } from '@/components/admin/security/SecurityMetricsGrid';
import { ThreatDetectionChart } from '@/components/admin/security/ThreatDetectionChart';
import { SuspiciousActivityTable } from '@/components/admin/security/SuspiciousActivityTable';
import { RateLimitMonitor } from '@/components/admin/security/RateLimitMonitor';
import { AdminPageWrapper } from '@/components/ui/lazy-load-wrapper';
import { useDirection } from '@/components/ui/direction-provider';
import { Shield, AlertTriangle, Activity, Lock, RefreshCw, Download, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SecurityAdvanced() {
  const { isRTL } = useDirection();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const timeRangeLabels = {
    '1h': isRTL ? 'آخر ساعة' : 'Last Hour',
    '24h': isRTL ? 'آخر 24 ساعة' : 'Last 24 Hours',
    '7d': isRTL ? 'آخر 7 أيام' : 'Last 7 Days',
    '30d': isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'
  };

  const handleRefreshAll = () => {
    // This would trigger a refresh of all data
    window.location.reload();
  };

  const handleExportSecurityReport = () => {
    // This would generate and download a comprehensive security report
    console.log('Exporting security report...');
  };

  return (
    <AdminPageWrapper>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              {isRTL ? 'لوحة الأمان المتقدمة' : 'Advanced Security Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL 
                ? 'مراقبة شاملة للأمان والتهديدات في الوقت الفعلي' 
                : 'Comprehensive real-time security monitoring and threat detection'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeRangeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleRefreshAll}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {isRTL ? 'تحديث' : 'Refresh'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportSecurityReport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isRTL ? 'تقرير أمني' : 'Security Report'}
            </Button>

            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              {isRTL ? 'الإعدادات' : 'Settings'}
            </Button>
          </div>
        </div>

        {/* Security Metrics Overview */}
        <SecurityMetricsGrid timeRange={timeRange} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={cn("grid w-full grid-cols-4", isRTL && "grid-flow-col-dense")}>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              {isRTL ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="threats" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              {isRTL ? 'التهديدات' : 'Threats'}
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <Shield className="h-4 w-4" />
              {isRTL ? 'الأنشطة المشبوهة' : 'Suspicious Activities'}
            </TabsTrigger>
            <TabsTrigger value="rate-limits" className="gap-2">
              <Lock className="h-4 w-4" />
              {isRTL ? 'حدود المعدل' : 'Rate Limits'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Threat Detection Chart */}
              <ThreatDetectionChart />

              {/* Quick Security Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    {isRTL ? 'تنبيهات أمنية سريعة' : 'Quick Security Alerts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800">
                          {isRTL ? 'محاولات اختراق متعددة' : 'Multiple Breach Attempts'}
                        </div>
                        <div className="text-sm text-red-600">
                          {isRTL ? '5 محاولات في آخر ساعة' : '5 attempts in the last hour'}
                        </div>
                      </div>
                      <div className="text-red-600 font-bold">HIGH</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <div className="font-medium text-orange-800">
                          {isRTL ? 'نشاط غير طبيعي' : 'Unusual Activity Pattern'}
                        </div>
                        <div className="text-sm text-orange-600">
                          {isRTL ? 'تم اكتشاف أنماط وصول غير عادية' : 'Unusual access patterns detected'}
                        </div>
                      </div>
                      <div className="text-orange-600 font-bold">MEDIUM</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <div className="font-medium text-green-800">
                          {isRTL ? 'النظام آمن' : 'System Secure'}
                        </div>
                        <div className="text-sm text-green-600">
                          {isRTL ? 'لا توجد تهديدات نشطة' : 'No active threats detected'}
                        </div>
                      </div>
                      <div className="text-green-600 font-bold">OK</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <ThreatDetectionChart />
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <SuspiciousActivityTable />
          </TabsContent>

          <TabsContent value="rate-limits" className="space-y-6">
            <RateLimitMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageWrapper>
  );
}