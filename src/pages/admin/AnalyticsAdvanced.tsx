import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Activity,
  Eye,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import UserBehaviorAnalytics from '@/components/admin/analytics/UserBehaviorAnalytics';

const AnalyticsAdvanced: React.FC = () => {
  const { t, language } = useUnifiedTranslation();
  // Mock analytics data
  const mockUserBehaviorData = [
    { day: 'الأحد', views: 1200, interactions: 850, users: 320 },
    { day: 'الاثنين', views: 1450, interactions: 920, users: 380 },
    { day: 'الثلاثاء', views: 1680, interactions: 1100, users: 420 },
    { day: 'الأربعاء', views: 1320, interactions: 890, users: 350 },
    { day: 'الخميس', views: 1780, interactions: 1250, users: 480 },
    { day: 'الجمعة', views: 980, interactions: 650, users: 280 },
    { day: 'السبت', views: 1100, interactions: 720, users: 300 }
  ];

  const mockTopPages = [
    { page: '/challenges', views: 15420, bounce_rate: 23.5, avg_time: '4:32' },
    { page: '/dashboard', views: 12350, bounce_rate: 18.2, avg_time: '6:15' },
    { page: '/profile', views: 8740, bounce_rate: 31.8, avg_time: '3:18' },
    { page: '/campaigns', views: 6890, bounce_rate: 28.4, avg_time: '5:42' },
    { page: '/admin', views: 3420, bounce_rate: 12.6, avg_time: '8:25' }
  ];

  const mockRealTimeMetrics = {
    activeUsers: 147,
    pageViews: 1248,
    averageSessionDuration: '4:32',
    bounceRate: 24.8
  };

  return (
    <AdminPageWrapper
      title={language === 'ar' ? 'التحليلات المتقدمة' : 'Advanced Analytics'}
      description={language === 'ar' ? 'مراقبة وتحليل سلوك المستخدمين والأداء' : 'Monitor and analyze user behavior and performance'}
    >
      <AdminBreadcrumb />
      <div className="space-y-6">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    المستخدمون النشطون
                  </p>
                  <p className="text-2xl font-bold">{mockRealTimeMetrics.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    مشاهدات الصفحات
                  </p>
                  <p className="text-2xl font-bold">{mockRealTimeMetrics.pageViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    متوسط الجلسة
                  </p>
                  <p className="text-2xl font-bold">{mockRealTimeMetrics.averageSessionDuration}</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    معدل الارتداد
                  </p>
                  <p className="text-2xl font-bold">{mockRealTimeMetrics.bounceRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Behavior Analytics Component */}
        <UserBehaviorAnalytics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                اتجاهات التفاعل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockUserBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
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
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="المستخدمون النشطون"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interactions" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="التفاعلات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                ملخص أسبوعي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockUserBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
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
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" name="المشاهدات" />
                    <Bar dataKey="interactions" fill="hsl(var(--success))" name="التفاعلات" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Pages Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              الصفحات الأكثر زيارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصفحة</TableHead>
                    <TableHead>المشاهدات</TableHead>
                    <TableHead>معدل الارتداد</TableHead>
                    <TableHead>متوسط الوقت</TableHead>
                    <TableHead>الأداء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopPages.map((page, index) => (
                    <TableRow key={page.page}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {page.page}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {page.views.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={page.bounce_rate < 20 ? 'default' : page.bounce_rate < 30 ? 'secondary' : 'destructive'}
                        >
                          {page.bounce_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{page.avg_time}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={index < 2 ? 'default' : index < 4 ? 'secondary' : 'outline'}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              تقسيم المستخدمين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">حسب النوع</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">مستخدمون جدد</span>
                    <span className="text-sm font-semibold">68%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">مستخدمون عائدون</span>
                    <span className="text-sm font-semibold">32%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">حسب الجهاز</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الهاتف المحمول</span>
                    <span className="text-sm font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">سطح المكتب</span>
                    <span className="text-sm font-semibold">22%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">حسب المنطقة</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">المملكة العربية السعودية</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الإمارات العربية المتحدة</span>
                    <span className="text-sm font-semibold">28%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">أخرى</span>
                    <span className="text-sm font-semibold">27%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-muted-foreground h-2 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
};

export default AnalyticsAdvanced;