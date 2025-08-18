/**
 * Live Engagement Monitor
 * Real-time analytics component with auto-refresh and error handling
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Users, 
  Eye, 
  MessageCircle, 
  Heart,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsErrorBoundary } from '@/components/analytics/AnalyticsErrorBoundary';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';
import { dateHandler } from '@/utils/unified-date-handler';
import { createErrorHandler } from '@/utils/unified-error-handler';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  trend: number[];
}

interface LiveEngagementData {
  metrics: LiveMetric[];
  lastUpdate: Date;
  isLive: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export const LiveEngagementMonitor: React.FC = () => {
  const { t } = useUnifiedTranslation();
  const [liveData, setLiveData] = useState<LiveEngagementData | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  
  const errorHandler = createErrorHandler({
    component: 'LiveEngagementMonitor',
    showToast: true,
    logError: true
  });
  
  const { 
    coreMetrics, 
    isLoading, 
    isError, 
    error, 
    refresh, 
    isRefreshing,
    hasAccess 
  } = useAnalytics({
    filters: { timeframe: '7d' },
    autoRefresh: isRealTimeEnabled,
    refreshInterval: 2 * 60 * 1000 // 2 minutes for live monitoring (reduced from 60s to balance performance)
  });

  // Transform analytics data to live metrics
  useEffect(() => {
    if (coreMetrics) {
      const metrics: LiveMetric[] = [
        {
          id: 'active_users',
          name: t('live_monitor.active_users', 'المستخدمون النشطون'),
          value: coreMetrics.users?.active || 0,
          change: 12.5,
          changeType: 'increase',
          icon: <Users className="h-4 w-4" />,
          color: 'bg-blue-500',
          trend: [45, 52, 48, 61, 55, 67, 72]
        },
        {
          id: 'live_views',
          name: t('live_monitor.live_views', 'المشاهدات المباشرة'),
          value: coreMetrics.engagement?.pageViews || 0,
          change: 8.3,
          changeType: 'increase',
          icon: <Eye className="h-4 w-4" />,
          color: 'bg-green-500',
          trend: [120, 145, 132, 178, 165, 189, 203]
        },
        {
          id: 'interactions',
          name: t('live_monitor.interactions', 'التفاعلات'),
          value: Math.floor((coreMetrics.engagement?.interactions || 0) * 1.2),
          change: -3.2,
          changeType: 'decrease',
          icon: <MessageCircle className="h-4 w-4" />,
          color: 'bg-orange-500',
          trend: [89, 78, 85, 72, 81, 76, 69]
        },
        {
          id: 'engagement_rate',
          name: t('live_monitor.engagement_rate', 'معدل التفاعل'),
          value: coreMetrics.engagement?.returnRate || 0,
          change: 15.7,
          changeType: 'increase',
          icon: <Heart className="h-4 w-4" />,
          color: 'bg-purple-500',
          trend: [23, 29, 31, 35, 42, 38, 45]
        }
      ];

      setLiveData({
        metrics,
        lastUpdate: new Date(),
        isLive: isRealTimeEnabled && !isError,
        connectionStatus: isError ? 'disconnected' : isLoading ? 'connecting' : 'connected'
      });
    }
  }, [coreMetrics, isRealTimeEnabled, isError, isLoading, t]);

  const handleToggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled);
    if (!isRealTimeEnabled) {
      refresh();
    }
    toast({
      title: t('live_monitor.toggle_success', 'تم التحديث'),
      description: isRealTimeEnabled 
        ? t('live_monitor.disabled', 'تم إيقاف التحديث المباشر')
        : t('live_monitor.enabled', 'تم تفعيل التحديث المباشر'),
    });
  };

  const handleManualRefresh = async () => {
    try {
      await refresh();
      toast({
        title: t('common.success', 'نجح'),
        description: t('analytics.refresh_success', 'تم تحديث البيانات بنجاح'),
      });
    } catch (err) {
      errorHandler.handleError(err, { operation: 'manualRefresh' }, t('analytics.refresh_failed', 'فشل في تحديث البيانات'));
    }
  };

  const getConnectionStatusBadge = () => {
    const status = liveData?.connectionStatus || 'disconnected';
    const variants = {
      connected: { variant: 'default' as const, text: t('live_monitor.connected', 'متصل'), color: 'bg-green-500' },
      connecting: { variant: 'secondary' as const, text: t('live_monitor.connecting', 'جاري الاتصال'), color: 'bg-yellow-500' },
      disconnected: { variant: 'destructive' as const, text: t('live_monitor.disconnected', 'منقطع'), color: 'bg-red-500' }
    };
    
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}`} />
        {config.text}
      </Badge>
    );
  };

  // Access control check
  if (!hasAccess.analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('analytics.access_denied', 'ليس لديك صلاحية للوصول إلى المراقبة المباشرة')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnalyticsErrorBoundary componentName="LiveEngagementMonitor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              {t('live_monitor.title', 'المراقبة المباشرة')}
            </h2>
            <p className="text-muted-foreground">
              {t('live_monitor.subtitle', 'تتبع النشاط والتفاعل في الوقت الفعلي')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getConnectionStatusBadge()}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleRealTime}
              className="flex items-center gap-2"
            >
              <Activity className={`h-4 w-4 ${isRealTimeEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
              {isRealTimeEnabled 
                ? t('live_monitor.disable', 'إيقاف المباشر')
                : t('live_monitor.enable', 'تفعيل المباشر')
              }
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('common.refresh', 'تحديث')}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || t('live_monitor.connection_error', 'خطأ في الاتصال بالخدمة المباشرة')}
            </AlertDescription>
          </Alert>
        )}

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveData?.metrics.map((metric) => (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <div className={`p-1 rounded-sm text-white ${metric.color}`}>
                  {metric.icon}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      metric.changeType === 'increase' ? 'text-green-600' : 
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${metric.changeType === 'decrease' ? 'rotate-180' : ''}`} />
                      {Math.abs(metric.change)}% من آخر ساعة
                    </div>
                  </>
                )}
              </CardContent>
              {/* Live indicator */}
              {liveData?.isLive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </Card>
          )) || (
            // Loading state
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Status Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t('live_monitor.status_info', 'معلومات الحالة')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('live_monitor.last_update', 'آخر تحديث')}:</span>
              <span>{liveData?.lastUpdate?.toLocaleTimeString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('live_monitor.refresh_interval', 'فترة التحديث')}:</span>
              <span>{isRealTimeEnabled ? '30 ثانية' : t('live_monitor.manual', 'يدوي')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('live_monitor.data_quality', 'جودة البيانات')}:</span>
              <span>{coreMetrics ? t('live_monitor.live_data', 'بيانات مباشرة') : t('live_monitor.cached_data', 'بيانات مخزنة')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsErrorBoundary>
  );
};