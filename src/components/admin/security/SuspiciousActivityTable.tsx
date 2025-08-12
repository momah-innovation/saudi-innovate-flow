import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSuspiciousActivities } from '@/hooks/admin/useSuspiciousActivities';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { AlertTriangle, User, Clock, Filter, Download, RefreshCw } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface SuspiciousActivityTableProps {
  className?: string;
}

export const SuspiciousActivityTable = ({ className }: SuspiciousActivityTableProps) => {
  const { isRTL } = useDirection();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('7d');
  const [severity, setSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  
  const { data: activities, isLoading, error, refetch } = useSuspiciousActivities({
    timeRange,
    severity,
    autoRefresh: true,
    limit: 50
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels = {
      critical: isRTL ? 'حرج' : 'Critical',
      high: isRTL ? 'عالي' : 'High',
      medium: isRTL ? 'متوسط' : 'Medium',
      low: isRTL ? 'منخفض' : 'Low'
    };
    return labels[severity as keyof typeof labels] || severity;
  };

  const getActivityTypeLabel = (type: string) => {
    const labels = {
      'multiple_failed_logins': isRTL ? 'محاولات دخول فاشلة متعددة' : 'Multiple Failed Logins',
      'unusual_access_pattern': isRTL ? 'نمط وصول غير طبيعي' : 'Unusual Access Pattern',
      'suspicious_ip': isRTL ? 'عنوان IP مشبوه' : 'Suspicious IP',
      'rate_limit_exceeded': isRTL ? 'تجاوز الحد الأقصى' : 'Rate Limit Exceeded',
      'privilege_escalation': isRTL ? 'تصعيد الصلاحيات' : 'Privilege Escalation',
      'data_exfiltration': isRTL ? 'تسريب البيانات' : 'Data Exfiltration'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleExport = () => {
    if (!activities?.length) return;
    
    const csvContent = [
      ['التاريخ', 'النوع', 'الخطورة', 'المستخدم', 'الوصف'].join(','),
      ...activities.map(activity => [
        new Date(activity.created_at).toLocaleString(),
        getActivityTypeLabel(activity.activity_type),
        getSeverityLabel(activity.severity),
        activity.profiles?.display_name || 'غير معروف',
        activity.description
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `suspicious-activities-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isRTL ? 'فشل في تحميل الأنشطة المشبوهة' : 'Failed to load suspicious activities'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            {isRTL ? 'الأنشطة المشبوهة' : 'Suspicious Activities'}
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
                <SelectItem value="30d">{isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="critical">{isRTL ? 'حرج' : 'Critical'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!activities?.length}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !activities?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            {isRTL ? 'لا توجد أنشطة مشبوهة في هذه الفترة' : 'No suspicious activities found for this period'}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Badge variant={getSeverityVariant(activity.severity)}>
                    {getSeverityLabel(activity.severity)}
                  </Badge>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">
                      {getActivityTypeLabel(activity.activity_type)}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: isRTL ? ar : enUS
                      })}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {activity.profiles?.display_name || activity.profiles?.email || (isRTL ? 'مستخدم غير معروف' : 'Unknown User')}
                    </div>

                    {activity.request_details && (
                      <Badge variant="outline" className="text-xs">
                        {isRTL ? 'تفاصيل متاحة' : 'Details Available'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};