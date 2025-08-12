import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSuspiciousActivityTrends } from '@/hooks/admin/useSuspiciousActivities';

interface ThreatDetectionChartProps {
  className?: string;
}

const ThreatDetectionChart: React.FC<ThreatDetectionChartProps> = ({ className }) => {
  const { data: trends, isLoading } = useSuspiciousActivityTrends('7d');

  // Mock chart data for now
  const chartData = [
    { time: 'اليوم', high: 2, medium: 5, low: 8, total: 15 },
    { time: 'أمس', high: 1, medium: 3, low: 12, total: 16 },
    { time: 'قبل يومين', high: 0, medium: 7, low: 10, total: 17 }
  ];

  const totalThreats = chartData.reduce((sum, item) => sum + item.total, 0);
  const highThreats = chartData.reduce((sum, item) => sum + item.high, 0);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            اكتشاف التهديدات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          اكتشاف التهديدات
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span className="text-sm text-muted-foreground">عالية الخطورة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning"></div>
            <span className="text-sm text-muted-foreground">متوسطة الخطورة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success"></div>
            <span className="text-sm text-muted-foreground">منخفضة الخطورة</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">إجمالي التهديدات: </span>
            <span className="font-semibold">{totalThreats}</span>
          </div>
          <Badge variant={highThreats > 0 ? "destructive" : "outline"} className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {highThreats} تهديد عالي
          </Badge>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                name="عالية الخطورة"
              />
              <Line 
                type="monotone" 
                dataKey="medium" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                name="متوسطة الخطورة"
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="منخفضة الخطورة"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatDetectionChart;