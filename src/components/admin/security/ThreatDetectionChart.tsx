import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSuspiciousActivityTrends } from '@/hooks/admin/useSuspiciousActivities';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface ThreatDetectionChartProps {
  className?: string;
}

export const ThreatDetectionChart = ({ className }: ThreatDetectionChartProps) => {
  const { isRTL } = useDirection();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  const { data: trends, isLoading, error } = useSuspiciousActivityTrends(timeRange);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isRTL ? 'فشل في تحميل بيانات اتجاهات التهديدات' : 'Failed to load threat trends data'}
        </AlertDescription>
      </Alert>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316', 
      medium: '#eab308',
      low: '#22c55e'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeRange === '7d') {
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit'
      });
    }
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const chartData = trends?.map((trend: any) => ({
    ...trend,
    timestamp: formatTimestamp(trend.timestamp)
  })) || [];

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {isRTL ? 'اتجاهات التهديدات الأمنية' : 'Security Threat Trends'}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{isRTL ? 'آخر 7 أيام' : 'Last 7 Days'}</SelectItem>
                <SelectItem value="30d">{isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">{isRTL ? 'منطقة' : 'Area'}</SelectItem>
                <SelectItem value="line">{isRTL ? 'خط' : 'Line'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !chartData.length ? (
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            {isRTL ? 'لا توجد بيانات متاحة' : 'No data available'}
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  reversed={isRTL}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {chartType === 'area' ? (
                  <>
                    <Area dataKey="critical" stroke={getSeverityColor('critical')} fill={getSeverityColor('critical')} fillOpacity={0.3} name={isRTL ? 'حرج' : 'Critical'} />
                    <Area dataKey="high" stroke={getSeverityColor('high')} fill={getSeverityColor('high')} fillOpacity={0.3} name={isRTL ? 'عالي' : 'High'} />
                    <Area dataKey="medium" stroke={getSeverityColor('medium')} fill={getSeverityColor('medium')} fillOpacity={0.3} name={isRTL ? 'متوسط' : 'Medium'} />
                    <Area dataKey="low" stroke={getSeverityColor('low')} fill={getSeverityColor('low')} fillOpacity={0.3} name={isRTL ? 'منخفض' : 'Low'} />
                  </>
                ) : (
                  <>
                    <Line dataKey="critical" stroke={getSeverityColor('critical')} strokeWidth={2} name={isRTL ? 'حرج' : 'Critical'} />
                    <Line dataKey="high" stroke={getSeverityColor('high')} strokeWidth={2} name={isRTL ? 'عالي' : 'High'} />
                    <Line dataKey="medium" stroke={getSeverityColor('medium')} strokeWidth={2} name={isRTL ? 'متوسط' : 'Medium'} />
                    <Line dataKey="low" stroke={getSeverityColor('low')} strokeWidth={2} name={isRTL ? 'منخفض' : 'Low'} />
                  </>
                )}
              </ChartComponent>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Summary statistics */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            {[
              { key: 'critical', label: isRTL ? 'حرج' : 'Critical', color: 'text-red-600' },
              { key: 'high', label: isRTL ? 'عالي' : 'High', color: 'text-orange-600' },
              { key: 'medium', label: isRTL ? 'متوسط' : 'Medium', color: 'text-yellow-600' },
              { key: 'low', label: isRTL ? 'منخفض' : 'Low', color: 'text-green-600' }
            ].map(({ key, label, color }) => {
              const total = chartData.reduce((sum, item) => sum + (item[key] || 0), 0);
              return (
                <div key={key} className="text-center">
                  <div className={cn("text-lg font-bold", color)}>
                    {total.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};