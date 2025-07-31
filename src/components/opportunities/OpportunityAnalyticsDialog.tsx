import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MessageSquare,
  Share2,
  Download,
  Calendar,
  Target,
  Clock,
  Globe,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OpportunityAnalyticsDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalApplications: number;
  totalShares: number;
  conversionRate: number;
  viewsData: Array<{ date: string; views: number; applications: number }>;
  applicationSourceData: Array<{ source: string; count: number; percentage: number }>;
  timelineData: Array<{ date: string; action: string; count: number }>;
  engagementMetrics: {
    avgTimeOnPage: number;
    bounceRate: number;
    returnVisitors: number;
  };
}

export const OpportunityAnalyticsDialog = ({
  opportunityId,
  opportunityTitle,
  open,
  onOpenChange
}: OpportunityAnalyticsDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (open && opportunityId) {
      loadAnalytics();
    }
  }, [open, opportunityId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load analytics data from multiple sources
      const [opportunityData, applicationsData, analyticsData] = await Promise.all([
        supabase
          .from('partnership_opportunities')
          .select('*')
          .eq('id', opportunityId)
          .single(),
        supabase
          .from('opportunity_applications')
          .select('*')
          .eq('opportunity_id', opportunityId),
        supabase
          .from('opportunity_analytics')
          .select('*')
          .eq('opportunity_id', opportunityId)
      ]);

      // Generate mock analytics data for demonstration
      // In a real implementation, this would come from actual analytics tables
      const mockAnalytics: AnalyticsData = {
        totalViews: Math.floor(Math.random() * 1000) + 100,
        totalLikes: Math.floor(Math.random() * 50) + 10,
        totalApplications: applicationsData.data?.length || 0,
        totalShares: Math.floor(Math.random() * 30) + 5,
        conversionRate: applicationsData.data?.length ? 
          ((applicationsData.data.length / (Math.floor(Math.random() * 1000) + 100)) * 100) : 0,
        viewsData: generateMockViewsData(),
        applicationSourceData: generateMockSourceData(),
        timelineData: generateMockTimelineData(),
        engagementMetrics: {
          avgTimeOnPage: Math.floor(Math.random() * 300) + 60, // seconds
          bounceRate: Math.floor(Math.random() * 40) + 20, // percentage
          returnVisitors: Math.floor(Math.random() * 30) + 10 // percentage
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockViewsData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 5,
        applications: Math.floor(Math.random() * 3)
      });
    }
    return data;
  };

  const generateMockSourceData = () => [
    { source: isRTL ? 'البحث المباشر' : 'Direct Search', count: 45, percentage: 35 },
    { source: isRTL ? 'وسائل التواصل' : 'Social Media', count: 32, percentage: 25 },
    { source: isRTL ? 'الإحالات' : 'Referrals', count: 28, percentage: 22 },
    { source: isRTL ? 'البريد الإلكتروني' : 'Email', count: 23, percentage: 18 }
  ];

  const generateMockTimelineData = () => {
    const data = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        action: isRTL ? 'مشاهدات' : 'Views',
        count: Math.floor(Math.random() * 20) + 5
      });
    }
    return data;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!analytics) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? 'لا توجد بيانات إحصائية متاحة' : 'No analytics data available'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {isRTL ? 'إحصائيات الفرصة' : 'Opportunity Analytics'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{opportunityTitle}</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="engagement">{isRTL ? 'التفاعل' : 'Engagement'}</TabsTrigger>
            <TabsTrigger value="applications">{isRTL ? 'الطلبات' : 'Applications'}</TabsTrigger>
            <TabsTrigger value="performance">{isRTL ? 'الأداء' : 'Performance'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي المشاهدات' : 'Total Views'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalApplications}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الطلبات' : 'Total Applications'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.totalLikes}</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'إعجابات' : 'Likes'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-500">-2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Views Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {isRTL ? 'المشاهدات والطلبات عبر الزمن' : 'Views and Applications Over Time'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name={isRTL ? 'المشاهدات' : 'Views'}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name={isRTL ? 'الطلبات' : 'Applications'}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'مقاييس التفاعل' : 'Engagement Metrics'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'متوسط الوقت المقضي' : 'Avg. Time on Page'}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(analytics.engagementMetrics.avgTimeOnPage)}
                      </span>
                    </div>
                    <Progress value={(analytics.engagementMetrics.avgTimeOnPage / 300) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'معدل الارتداد' : 'Bounce Rate'}</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.engagementMetrics.bounceRate}%
                      </span>
                    </div>
                    <Progress value={analytics.engagementMetrics.bounceRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{isRTL ? 'الزوار العائدون' : 'Return Visitors'}</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.engagementMetrics.returnVisitors}%
                      </span>
                    </div>
                    <Progress value={analytics.engagementMetrics.returnVisitors} />
                  </div>
                </CardContent>
              </Card>

              {/* Application Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'مصادر الطلبات' : 'Application Sources'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={analytics.applicationSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.applicationSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تحليل الطلبات' : 'Applications Analysis'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{analytics.totalApplications}</p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الطلبات' : 'Total Applications'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.floor(analytics.totalApplications * 0.7)}
                    </p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'قيد المراجعة' : 'Under Review'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.floor(analytics.totalApplications * 0.3)}
                    </p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مقبولة' : 'Approved'}</p>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="applications" 
                      fill="#82ca9d" 
                      name={isRTL ? 'الطلبات اليومية' : 'Daily Applications'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'تقرير الأداء' : 'Performance Report'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">{isRTL ? 'المقاييس الرئيسية' : 'Key Metrics'}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>{isRTL ? 'نسبة النقر' : 'Click-through Rate'}</span>
                          <span className="font-medium">3.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{isRTL ? 'معدل المشاركة' : 'Engagement Rate'}</span>
                          <span className="font-medium">15.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{isRTL ? 'نقاط الجودة' : 'Quality Score'}</span>
                          <span className="font-medium">8.5/10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">{isRTL ? 'التوصيات' : 'Recommendations'}</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• {isRTL ? 'تحسين العنوان لزيادة النقرات' : 'Optimize title for better click-through rate'}</p>
                        <p>• {isRTL ? 'إضافة المزيد من الصور الجذابة' : 'Add more engaging visuals'}</p>
                        <p>• {isRTL ? 'تبسيط عملية التطبيق' : 'Simplify application process'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};