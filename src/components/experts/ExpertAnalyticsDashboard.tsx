import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  TrendingUp, Star, Clock, Target, Award, 
  Users, Calendar, BarChart3, Eye, Download
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';
import { cn } from '@/lib/utils';

interface ExpertAnalyticsDashboardProps {
  className?: string;
}

export const ExpertAnalyticsDashboard = ({ className }: ExpertAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();
  const { me } = useRTLAware();
  
  // Mock data for expert analytics
  const evaluationTrends = [
    { month: 'Jan', evaluations: 12, avgScore: 7.8, responseTime: 2.1 },
    { month: 'Feb', evaluations: 15, avgScore: 8.2, responseTime: 1.9 },
    { month: 'Mar', evaluations: 18, avgScore: 8.0, responseTime: 2.3 },
    { month: 'Apr', evaluations: 22, avgScore: 8.5, responseTime: 1.8 },
    { month: 'May', evaluations: 25, avgScore: 8.3, responseTime: 2.0 },
    { month: 'Jun', evaluations: 28, avgScore: 8.7, responseTime: 1.7 }
  ];

  const categoryBreakdown = [
    { name: isRTL ? 'تكنولوجيا' : 'Technology', value: 35, color: 'hsl(var(--chart-1))' },
    { name: isRTL ? 'صحة' : 'Healthcare', value: 25, color: 'hsl(var(--chart-2))' },
    { name: isRTL ? 'تعليم' : 'Education', value: 20, color: 'hsl(var(--chart-3))' },
    { name: isRTL ? 'بيئة' : 'Environment', value: 12, color: 'hsl(var(--chart-4))' },
    { name: isRTL ? 'أخرى' : 'Others', value: 8, color: 'hsl(var(--chart-5))' }
  ];

  const performanceMetrics = [
    { 
      title: isRTL ? 'متوسط وقت الاستجابة' : 'Avg Response Time',
      value: '1.9',
      unit: isRTL ? 'أيام' : 'days',
      change: -12,
      icon: Clock,
      color: 'text-green-500'
    },
    { 
      title: isRTL ? 'معدل جودة التقييم' : 'Evaluation Quality',
      value: '8.4',
      unit: '/10',
      change: 5,
      icon: Star,
      color: 'text-yellow-500'
    },
    { 
      title: isRTL ? 'معدل الإنجاز' : 'Completion Rate',
      value: '94',
      unit: '%',
      change: 8,
      icon: Target,
      color: 'text-blue-500'
    },
    { 
      title: isRTL ? 'تقييم الأقران' : 'Peer Rating',
      value: '4.8',
      unit: '/5',
      change: 3,
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isRTL ? 'لوحة تحليلات الخبير' : 'Expert Analytics Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 'تتبع أداء التقييم والإحصائيات' : 'Track your evaluation performance and statistics'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className={`w-4 h-4 ${me('2')}`} />
            {isRTL ? 'تقرير مفصل' : 'Detailed Report'}
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">
                        {metric.value}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className={cn(
                        `w-4 h-4 ${me('1')}`,
                        metric.change > 0 ? "text-green-500" : "text-red-500"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        metric.change > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-full bg-opacity-10", metric.color)}>
                    <Icon className={cn("w-6 h-6", metric.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evaluation Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {isRTL ? 'اتجاهات التقييم' : 'Evaluation Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evaluations" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="evaluations">
                  {isRTL ? 'التقييمات' : 'Evaluations'}
                </TabsTrigger>
                <TabsTrigger value="scores">
                  {isRTL ? 'النتائج' : 'Scores'}
                </TabsTrigger>
                <TabsTrigger value="response-time">
                  {isRTL ? 'وقت الاستجابة' : 'Response Time'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="evaluations" className="mt-4">
                {/* Chart components temporarily disabled */}
                <div className="h-[200px] flex items-center justify-center bg-muted/10 rounded-lg">
                  <p className="text-muted-foreground">Chart visualization temporarily unavailable</p>
                </div>
              </TabsContent>
              
              <TabsContent value="scores" className="mt-4">
                <div className="h-[200px] flex items-center justify-center">
                  <div className="space-y-3 w-full max-w-xs">
                    {evaluationTrends.slice(-3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <Badge variant="outline">{item.avgScore}/10</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="response-time" className="mt-4">
                <div className="h-[200px] flex items-center justify-center">
                  <div className="space-y-3 w-full max-w-xs">
                    {evaluationTrends.slice(-3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <Badge variant="secondary">{item.responseTime} {isRTL ? 'أيام' : 'days'}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              {isRTL ? 'توزيع التقييمات حسب الفئة' : 'Evaluations by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-[200px] flex items-center justify-center">
                <div className="space-y-3 w-full max-w-sm">
                  {categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category.name}</span>
                          <span>{category.value}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${category.value}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {isRTL ? 'النشاطات الأخيرة' : 'Recent Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: isRTL ? 'تم تقييم فكرة "نظام ذكي لإدارة النفايات"' : 'Evaluated idea "Smart Waste Management System"',
                time: isRTL ? 'منذ ساعتين' : '2 hours ago',
                score: 8.5,
                type: 'evaluation'
              },
              {
                action: isRTL ? 'تم تعيين تحدي جديد في قطاع التكنولوجيا' : 'Assigned new challenge in Technology sector',
                time: isRTL ? 'منذ 5 ساعات' : '5 hours ago',
                type: 'assignment'
              },
              {
                action: isRTL ? 'تم تقييم فكرة "منصة تعليمية تفاعلية"' : 'Evaluated idea "Interactive Learning Platform"',
                time: isRTL ? 'أمس' : 'Yesterday',
                score: 9.2,
                type: 'evaluation'
              },
              {
                action: isRTL ? 'تم تحديث الملف الشخصي للخبير' : 'Updated expert profile',
                time: isRTL ? 'منذ يومين' : '2 days ago',
                type: 'profile'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.score && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      <Star className={`w-3 h-3 ${me('1')}`} />
                      {activity.score}
                    </Badge>
                  )}
                  <Badge variant={
                    activity.type === 'evaluation' ? 'default' :
                    activity.type === 'assignment' ? 'secondary' : 'outline'
                  }>
                    {activity.type === 'evaluation' ? (isRTL ? 'تقييم' : 'Evaluation') :
                     activity.type === 'assignment' ? (isRTL ? 'تكليف' : 'Assignment') :
                     (isRTL ? 'ملف شخصي' : 'Profile')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};