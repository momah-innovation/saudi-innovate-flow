import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  Calendar,
  Users,
  Target,
  Shield,
  Server
} from 'lucide-react';
import { useMetricsTrends } from '@/hooks/useMetricsTrends';
import { AdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

interface AdminTrendsAnalysisProps {
  metrics: AdminDashboardMetrics | null;
  language: string;
}

export function AdminTrendsAnalysis({ metrics, language }: AdminTrendsAnalysisProps) {
  const { t } = useUnifiedTranslation();
  const { trends, isLoading, refresh } = useMetricsTrends(metrics);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatChange = (changePercent: number) => {
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {language === 'ar' ? 'تحليل الاتجاهات' : 'Trends Analysis'}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">{t('dashboard:trends.users')}</TabsTrigger>
            <TabsTrigger value="challenges">{t('dashboard:trends.challenges')}</TabsTrigger>
            <TabsTrigger value="system">{t('dashboard:trends.system')}</TabsTrigger>
            <TabsTrigger value="security">{t('dashboard:trends.security')}</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                    </span>
                  </div>
                  {getTrendIcon(trends?.users?.total?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.users?.total?.current.toLocaleString() || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.users?.total?.trend || 'stable')}`}>
                  {formatChange(trends?.users?.total?.changePercentage || 0)} vs 30d
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
                  </span>
                  {getTrendIcon(trends?.users?.active?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.users?.active?.current.toLocaleString() || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.users?.active?.trend || 'stable')}`}>
                  {formatChange(trends?.users?.active?.changePercentage || 0)} vs 30d
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'تسجيلات جديدة' : 'New Users'}
                  </span>
                  {getTrendIcon(trends?.users?.growth?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.users?.growth?.current.toLocaleString() || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.users?.growth?.trend || 'stable')}`}>
                  {formatChange(trends?.users?.growth?.changePercentage || 0)} vs 30d
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'إجمالي التحديات' : 'Total'}
                    </span>
                  </div>
                  {getTrendIcon(trends?.challenges?.total?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.challenges?.total?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.challenges?.total?.trend || 'stable')}`}>
                  {formatChange(trends?.challenges?.total?.changePercentage || 0)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'نشطة' : 'Active'}
                  </span>
                  {getTrendIcon(trends?.challenges?.active?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.challenges?.active?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.challenges?.active?.trend || 'stable')}`}>
                  {formatChange(trends?.challenges?.active?.changePercentage || 0)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'المقترحات' : 'Submissions'}
                  </span>
                  {getTrendIcon(trends?.challenges?.submissions?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.challenges?.submissions?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.challenges?.submissions?.trend || 'stable')}`}>
                  {formatChange(trends?.challenges?.submissions?.changePercentage || 0)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'معدل الإكمال' : 'Completion Rate'}
                  </span>
                  {getTrendIcon(trends?.challenges?.completion?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{Math.round(trends?.challenges?.completion?.current || 0)}%</div>
                <div className={`text-sm ${getTrendColor(trends?.challenges?.completion?.trend || 'stable')}`}>
                  {formatChange(trends?.challenges?.completion?.changePercentage || 0)}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'وقت التشغيل' : 'Uptime'}
                    </span>
                  </div>
                  {getTrendIcon(trends?.system?.uptime?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{Math.round(trends?.system?.uptime?.current || 99)}%</div>
                <div className={`text-sm ${getTrendColor(trends?.system?.uptime?.trend || 'stable')}`}>
                  {formatChange(trends?.system?.uptime?.changePercentage || 0)}
                </div>
                <Progress value={trends?.system?.uptime?.current || 99} className="mt-2 h-2" />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'الأداء' : 'Performance'}
                  </span>
                  {getTrendIcon(trends?.system?.performance?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{Math.round(trends?.system?.performance?.current || 95)}%</div>
                <div className={`text-sm ${getTrendColor(trends?.system?.performance?.trend || 'stable')}`}>
                  {formatChange(trends?.system?.performance?.changePercentage || 0)}
                </div>
                <Progress value={trends?.system?.performance?.current || 95} className="mt-2 h-2" />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'التخزين' : 'Storage'}
                  </span>
                  {getTrendIcon(trends?.system?.storage?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.system?.storage?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.system?.storage?.trend || 'stable')}`}>
                  {formatChange(trends?.system?.storage?.changePercentage || 0)}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'نقاط الأمان' : 'Security Score'}
                    </span>
                  </div>
                  {getTrendIcon(trends?.security?.score?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{Math.round(trends?.security?.score?.current || 98)}</div>
                <div className={`text-sm ${getTrendColor(trends?.security?.score?.trend || 'stable')}`}>
                  {formatChange(trends?.security?.score?.changePercentage || 0)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'الحوادث' : 'Incidents'}
                  </span>
                  {getTrendIcon(trends?.security?.incidents?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.security?.incidents?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.security?.incidents?.trend || 'stable')}`}>
                  {formatChange(trends?.security?.incidents?.changePercentage || 0)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'مستوى المخاطر' : 'Risk Level'}
                  </span>
                  {getTrendIcon(trends?.security?.riskLevel?.trend || 'stable')}
                </div>
                <div className="text-2xl font-bold">{trends?.security?.riskLevel?.current || 0}</div>
                <div className={`text-sm ${getTrendColor(trends?.security?.riskLevel?.trend || 'stable')}`}>
                  {formatChange(trends?.security?.riskLevel?.changePercentage || 0)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}