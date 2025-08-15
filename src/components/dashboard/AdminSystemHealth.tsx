import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Shield, 
  Server, 
  Database, 
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { AdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';
import { UseSystemHealthReturn } from '@/hooks/useSystemHealth';

interface AdminSystemHealthProps {
  metrics: AdminDashboardMetrics | null;
  systemHealth: UseSystemHealthReturn;
  language: string;
  isLoading: boolean;
}

export function AdminSystemHealth({ metrics, systemHealth, language, isLoading }: AdminSystemHealthProps) {
  const { t } = useUnifiedTranslation();
  const getHealthColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Server;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            {language === 'ar' ? 'نظرة عامة على النظام' : 'System Overview'}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={systemHealth.refresh}
            disabled={systemHealth.isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${systemHealth.isLoading ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Database Health */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                getHealthColor(systemHealth.health?.components?.database?.status || 'healthy')
              }`}>
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-sm">
                {language === 'ar' ? 'قاعدة البيانات' : 'Database'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {systemHealth.health?.components?.database?.responseTime || 0}ms
              </p>
            </div>

            {/* Storage Health */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                getHealthColor(systemHealth.health?.components?.storage?.status || 'healthy')
              }`}>
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-sm">
                {language === 'ar' ? 'التخزين' : 'Storage'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {Math.round(systemHealth.health?.components?.storage?.usage || 0)}% used
              </p>
            </div>

            {/* API Health */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                getHealthColor(systemHealth.health?.components?.api?.status || 'healthy')
              }`}>
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-sm">
                {language === 'ar' ? 'واجهة البرمجة' : 'API'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {systemHealth.health?.components?.api?.responseTime || 0}ms
              </p>
            </div>

            {/* Security */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                getHealthColor(systemHealth.health?.components?.security?.status || 'healthy')
              }`}>
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-sm">
                {language === 'ar' ? 'الأمان' : 'Security'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {systemHealth.health?.components?.security?.riskLevel || 'low'} risk
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {language === 'ar' ? 'أداء النظام' : 'System Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'ar' ? 'وقت التشغيل' : 'Uptime'}</span>
                <span>{Math.round(metrics?.system?.uptime || 99.9)}%</span>
              </div>
              <Progress value={metrics?.system?.uptime || 99.9} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'ar' ? 'الأداء' : 'Performance'}</span>
                <span>{Math.round(metrics?.system?.performance || 95)}%</span>
              </div>
              <Progress value={metrics?.system?.performance || 95} />
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>{language === 'ar' ? 'الأخطاء (24 ساعة)' : 'Errors (24h)'}</span>
                <span className="text-red-600">{metrics?.system?.errors || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {language === 'ar' ? 'مقاييس الأمان' : 'Security Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('dashboard.trends.security_score')}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{metrics?.security?.securityScore || 98}</span>
                <Badge variant={
                  (metrics?.security?.riskLevel === 'high') ? 'destructive' :
                  (metrics?.security?.riskLevel === 'medium') ? 'secondary' : 'default'
                }>
                  {metrics?.security?.riskLevel || 'low'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('dashboard.metrics.incidents')}</span>
                <span>{metrics?.security?.incidents || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('dashboard.trends.failed_logins')}</span>
                <span>{metrics?.security?.failedLogins || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('dashboard.metrics.high_risk_events')}</span>
                <span className="text-orange-600">{metrics?.security?.metrics?.highRiskEvents7d || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              {language === 'ar' ? 'مقاييس التخزين' : 'Storage Metrics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'ar' ? 'استخدام التخزين' : 'Storage Usage'}</span>
                <span>{Math.round((metrics?.system?.storageUsed || 0) / 1024 / 1024)} MB</span>
              </div>
              <Progress value={(metrics?.system?.storageUsed || 0) / 10485760 * 100} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <div className="text-2xl font-bold">{metrics?.system?.storage?.totalFiles || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'إجمالي الملفات' : 'Total Files'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics?.system?.storage?.totalBuckets || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'حاويات التخزين' : 'Storage Buckets'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {language === 'ar' ? 'نشاط النظام' : 'System Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{metrics?.system?.activity?.events24h || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'أحداث (24 ساعة)' : 'Events (24h)'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics?.system?.activity?.activeUsers24h || 0}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مستخدمون نشطون' : 'Active Users'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? 'آخر تحديث:' : 'Last updated:'} {
                  metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : '--'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}