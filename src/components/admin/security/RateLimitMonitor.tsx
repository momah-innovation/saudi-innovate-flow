import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRateLimits, useRateLimitAnalytics } from '@/hooks/admin/useRateLimits';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Lock, AlertTriangle, RefreshCw, Download, TrendingUp } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface RateLimitMonitorProps {
  className?: string;
}

export const RateLimitMonitor = ({ className }: RateLimitMonitorProps) => {
  const { isRTL } = useDirection();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [threshold, setThreshold] = useState(100);

  const { data: violations, isLoading: violationsLoading, error: violationsError, refetch } = useRateLimits({
    timeRange,
    threshold,
    autoRefresh: true,
    limit: 20
  });

  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useRateLimitAnalytics(timeRange);

  const hasError = violationsError || analyticsError;
  const isLoading = violationsLoading || analyticsLoading;

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isRTL ? 'فشل في تحميل بيانات مراقبة الحدود' : 'Failed to load rate limit monitoring data'}
        </AlertDescription>
      </Alert>
    );
  }

  const handleExport = () => {
    if (!violations?.length) return;
    
    const csvContent = [
      ['التاريخ', 'الإجراء', 'عدد الطلبات', 'المستخدم'].join(','),
      ...violations.map(violation => [
        new Date(violation.created_at).toLocaleString(),
        violation.action,
        violation.request_count,
        violation.user_id || 'غير معروف'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rate-limit-violations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{`${isRTL ? 'الساعة' : 'Hour'}: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`${isRTL ? 'الطلبات' : 'Requests'}: ${payload[0]?.value?.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              {isRTL ? 'مراقبة حدود المعدل' : 'Rate Limit Monitor'}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">{isRTL ? 'آخر ساعة' : 'Last Hour'}</SelectItem>
                  <SelectItem value="24h">{isRTL ? 'آخر 24 ساعة' : 'Last 24 Hours'}</SelectItem>
                  <SelectItem value="7d">{isRTL ? 'آخر 7 أيام' : 'Last 7 Days'}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics?.totalRequests?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? 'إجمالي الطلبات' : 'Total Requests'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {analytics?.totalViolations?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? 'الانتهاكات' : 'Violations'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics?.violationsThreshold || 100}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? 'حد الانتهاك' : 'Violation Threshold'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics?.averageRequestsPerViolation || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? 'متوسط الطلبات' : 'Avg per Violation'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hourly Trends Chart */}
      {analytics?.hourlyTrends && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {isRTL ? 'توزيع الطلبات بالساعة' : 'Hourly Request Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.hourlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    reversed={isRTL}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="requests" 
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violations List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {isRTL ? 'انتهاكات حدود المعدل' : 'Rate Limit Violations'}
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!violations?.length}
            >
              <Download className="h-4 w-4" />
              {isRTL ? 'تصدير' : 'Export'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!violations?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              {isRTL ? 'لا توجد انتهاكات في هذه الفترة' : 'No violations found for this period'}
            </div>
          ) : (
            <div className="space-y-3">
              {violations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive">
                        {violation.request_count.toLocaleString()} {isRTL ? 'طلب' : 'requests'}
                      </Badge>
                      <span className="font-medium text-sm">
                        {violation.action}
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(violation.created_at), {
                        addSuffix: true,
                        locale: isRTL ? ar : enUS
                      })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {violation.user_id ? `User: ${violation.user_id.substring(0, 8)}...` : (isRTL ? 'مجهول' : 'Anonymous')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Actions */}
      {analytics?.topActions?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? 'أكثر الإجراءات انتهاكاً' : 'Most Violated Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.topActions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{item.action}</span>
                  <Badge variant="secondary">
                    {String(item.count)} {isRTL ? 'انتهاك' : 'violations'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};