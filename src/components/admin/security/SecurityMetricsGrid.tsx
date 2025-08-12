import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecurityMetrics } from '@/hooks/admin/useSecurityAuditLog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, TrendingUp, Lock, Eye } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface SecurityMetricsGridProps {
  timeRange?: '1h' | '24h' | '7d' | '30d';
  className?: string;
}

export const SecurityMetricsGrid = ({ timeRange = '24h', className }: SecurityMetricsGridProps) => {
  const { isRTL } = useDirection();
  const { data: metrics, isLoading, error } = useSecurityMetrics(timeRange);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isRTL ? 'فشل في تحميل مقاييس الأمان' : 'Failed to load security metrics'}
        </AlertDescription>
      </Alert>
    );
  }

  const getSecurityScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    if (score >= 50) return 'destructive';
    return 'destructive';
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const timeRangeLabels = {
    '1h': isRTL ? 'آخر ساعة' : 'Last Hour',
    '24h': isRTL ? 'آخر 24 ساعة' : 'Last 24 Hours',
    '7d': isRTL ? 'آخر 7 أيام' : 'Last 7 Days',
    '30d': isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'
  };

  const metricsCards = [
    {
      title: isRTL ? 'النتيجة الأمنية' : 'Security Score',
      value: isLoading ? '...' : `${metrics?.securityScore || 0}%`,
      icon: Shield,
      description: isRTL ? 'التقييم العام للأمان' : 'Overall security assessment',
      variant: metrics ? getSecurityScoreVariant(metrics.securityScore) : 'secondary',
      colorClass: metrics ? getSecurityScoreColor(metrics.securityScore) : 'text-muted-foreground'
    },
    {
      title: isRTL ? 'إجمالي الأحداث' : 'Total Events',
      value: isLoading ? '...' : (metrics?.totalEvents || 0).toLocaleString(),
      icon: Activity,
      description: timeRangeLabels[timeRange],
      variant: 'default' as const,
      colorClass: 'text-blue-600'
    },
    {
      title: isRTL ? 'أحداث حرجة' : 'Critical Events',
      value: isLoading ? '...' : (metrics?.criticalEvents || 0).toLocaleString(),
      icon: AlertTriangle,
      description: isRTL ? 'تتطلب تدخل فوري' : 'Require immediate attention',
      variant: (metrics?.criticalEvents || 0) > 0 ? 'destructive' : 'secondary' as const,
      colorClass: 'text-red-600'
    },
    {
      title: isRTL ? 'أحداث عالية المخاطر' : 'High Risk Events',
      value: isLoading ? '...' : (metrics?.highRiskEvents || 0).toLocaleString(),
      icon: TrendingUp,
      description: isRTL ? 'تحتاج مراجعة' : 'Need review',
      variant: (metrics?.highRiskEvents || 0) > 0 ? 'destructive' : 'secondary' as const,
      colorClass: 'text-orange-600'
    },
    {
      title: isRTL ? 'أنشطة مشبوهة' : 'Suspicious Activities',
      value: isLoading ? '...' : (metrics?.suspiciousActivities || 0).toLocaleString(),
      icon: Eye,
      description: isRTL ? 'أنشطة غير طبيعية' : 'Unusual activities detected',
      variant: (metrics?.suspiciousActivities || 0) > 0 ? 'destructive' : 'secondary' as const,
      colorClass: 'text-purple-600'
    },
    {
      title: isRTL ? 'انتهاكات الحد الأقصى' : 'Rate Limit Violations',
      value: isLoading ? '...' : (metrics?.rateLimitViolations || 0).toLocaleString(),
      icon: Lock,
      description: isRTL ? 'محاولات تجاوز الحدود' : 'API abuse attempts',
      variant: (metrics?.rateLimitViolations || 0) > 0 ? 'destructive' : 'secondary' as const,
      colorClass: 'text-indigo-600'
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {metricsCards.map((metric, index) => {
        const IconComponent = metric.icon;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <IconComponent className={cn("h-4 w-4", metric.colorClass)} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={cn("text-2xl font-bold", metric.colorClass)}>
                    {metric.value}
                  </div>
                  <Badge variant={metric.variant as any} className="text-xs">
                    {metric.title === (isRTL ? 'النتيجة الأمنية' : 'Security Score') ? 
                      (metrics?.securityScore >= 90 ? (isRTL ? 'ممتاز' : 'Excellent') :
                       metrics?.securityScore >= 70 ? (isRTL ? 'جيد' : 'Good') :
                       metrics?.securityScore >= 50 ? (isRTL ? 'متوسط' : 'Fair') :
                       (isRTL ? 'ضعيف' : 'Poor')) :
                      timeRangeLabels[timeRange]
                    }
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};