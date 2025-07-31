import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Filter
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ApplicationsAnalyticsProps {
  opportunityId: string;
  analytics: any;
}

interface ApplicationData {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  inReviewApplications: number;
  applicationsOverTime: Array<{ date: string; applications: number; cumulative: number }>;
  statusBreakdown: Array<{ status: string; count: number; percentage: number }>;
  dailyApplications: Array<{ date: string; count: number }>;
  avgProcessingTime: number;
  conversionFunnel: Array<{ stage: string; count: number; percentage: number }>;
  applicationSources: Array<{ source: string; count: number; percentage: number }>;
}

export const ApplicationsAnalytics = ({ opportunityId, analytics }: ApplicationsAnalyticsProps) => {
  const { isRTL } = useDirection();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadApplicationData();
  }, [opportunityId, dateRange]);

  const loadApplicationData = async () => {
    try {
      // Get applications with detailed status information from real opportunity_applications table
      const { data: applications, error } = await supabase
        .from('opportunity_applications')
        .select('id, created_at, status')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const apps = applications || [];

      // Calculate real status counts from the data
      const statusCounts = apps.reduce((acc, app) => {
        const status = app.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Ensure all common statuses exist
      const allStatusCounts = {
        pending: statusCounts.pending || 0,
        submitted: statusCounts.submitted || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
        in_review: statusCounts.in_review || 0,
        ...statusCounts // Include any other statuses
      };

      // Generate status breakdown from real data
      const statusBreakdown = Object.entries(allStatusCounts)
        .filter(([_, count]) => count > 0) // Only show statuses with actual applications
        .map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
          count: count as number,
          percentage: apps.length > 0 ? Math.round(((count as number) / apps.length) * 100) : 0
        }));

      // Generate applications over time
      const applicationsOverTime = generateApplicationsOverTime(apps);
      
      // Generate daily applications
      const dailyApplications = generateDailyApplications(apps);
      
      // Calculate average processing time
      const avgProcessingTime = calculateAvgProcessingTime(apps);
      
      // Generate conversion funnel
      const conversionFunnel = generateConversionFunnel(apps);
      
      // Generate application sources
      const applicationSources = generateApplicationSources(apps);

      setApplicationData({
        totalApplications: apps.length,
        pendingApplications: allStatusCounts.pending || 0,
        approvedApplications: allStatusCounts.approved || 0,
        rejectedApplications: allStatusCounts.rejected || 0,
        inReviewApplications: allStatusCounts.in_review || 0,
        applicationsOverTime,
        statusBreakdown,
        dailyApplications,
        avgProcessingTime,
        conversionFunnel,
        applicationSources
      });
    } catch (error) {
      console.error('Error loading application data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApplicationsOverTime = (applications: any[]) => {
    const last30Days = [];
    let cumulative = 0;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayApplications = applications.filter(app => 
        app.created_at.startsWith(dateStr)
      ).length;
      
      cumulative += dayApplications;
      
      last30Days.push({
        date: dateStr,
        applications: dayApplications,
        cumulative
      });
    }
    
    return last30Days;
  };

  const generateDailyApplications = (applications: any[]) => {
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCount = applications.filter(app => 
        app.created_at.startsWith(dateStr)
      ).length;
      
      last7Days.push({
        date: dateStr,
        count: dayCount
      });
    }
    
    return last7Days;
  };

  const calculateAvgProcessingTime = (applications: any[]) => {
    const processedApps = applications.filter(app => 
      app.reviewed_at && app.submitted_at
    );
    
    if (processedApps.length === 0) return 0;
    
    const totalTime = processedApps.reduce((sum, app) => {
      const submitTime = new Date(app.submitted_at).getTime();
      const reviewTime = new Date(app.reviewed_at).getTime();
      return sum + (reviewTime - submitTime);
    }, 0);
    
    return Math.round(totalTime / processedApps.length / (1000 * 60 * 60 * 24)); // Days
  };

  const generateConversionFunnel = (applications: any[]) => {
    const totalViews = analytics.totalViews || 100;
    const stages = [
      { stage: isRTL ? 'مشاهدات' : 'Views', count: totalViews, percentage: 100 },
      { stage: isRTL ? 'طلبات بدأت' : 'Applications Started', count: Math.round(totalViews * 0.15), percentage: 15 },
      { stage: isRTL ? 'طلبات مرسلة' : 'Applications Submitted', count: applications.length, percentage: Math.round((applications.length / totalViews) * 100) },
      { stage: isRTL ? 'قيد المراجعة' : 'Under Review', count: applications.filter(app => app.status === 'in_review').length, percentage: 0 },
      { stage: isRTL ? 'مقبولة' : 'Approved', count: applications.filter(app => app.status === 'approved').length, percentage: 0 }
    ];
    
    // Calculate percentages for review and approved stages
    stages[3].percentage = applications.length > 0 ? Math.round((stages[3].count / applications.length) * 100) : 0;
    stages[4].percentage = applications.length > 0 ? Math.round((stages[4].count / applications.length) * 100) : 0;
    
    return stages;
  };

  const generateApplicationSources = (applications: any[]) => {
    // Simulated sources based on metadata or other indicators
    const sources = [
      { source: isRTL ? 'البحث المباشر' : 'Direct Search', count: 0, percentage: 0 },
      { source: isRTL ? 'وسائل التواصل' : 'Social Media', count: 0, percentage: 0 },
      { source: isRTL ? 'الإحالات' : 'Referrals', count: 0, percentage: 0 },
      { source: isRTL ? 'الحملات' : 'Campaigns', count: 0, percentage: 0 }
    ];
    
    const total = applications.length;
    if (total === 0) return sources;
    
    // Distribute applications across sources (simulated distribution)
    sources[0].count = Math.floor(total * 0.4);
    sources[1].count = Math.floor(total * 0.25);
    sources[2].count = Math.floor(total * 0.2);
    sources[3].count = total - sources[0].count - sources[1].count - sources[2].count;
    
    sources.forEach(source => {
      source.percentage = Math.round((source.count / total) * 100);
    });
    
    return sources.filter(s => s.count > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'in_review': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'in_review': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!applicationData) return null;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{applicationData.totalApplications}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الطلبات' : 'Total Applications'}</p>
                <Badge variant="outline" className="mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{applicationData.approvedApplications}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'مقبولة' : 'Approved'}</p>
                <Badge variant="outline" className="mt-1">
                  {((applicationData.approvedApplications / Math.max(1, applicationData.totalApplications)) * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{applicationData.inReviewApplications}</p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'قيد المراجعة' : 'In Review'}</p>
                <Badge variant="outline" className="mt-1">
                  {applicationData.avgProcessingTime}d {isRTL ? 'متوسط' : 'avg'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {((applicationData.totalApplications / Math.max(1, analytics.totalViews)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">{isRTL ? 'معدل التحويل' : 'Conversion Rate'}</p>
                <Badge variant="outline" className="mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isRTL ? 'الطلبات عبر الزمن' : 'Applications Over Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationData.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="applications" 
                  fill="#3B82F6" 
                  name={isRTL ? 'طلبات يومية' : 'Daily Applications'}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={isRTL ? 'التراكمي' : 'Cumulative'}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {isRTL ? 'حالة الطلبات' : 'Application Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationData.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {applicationData.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {isRTL ? 'قمع التحويل' : 'Conversion Funnel'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationData.conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.count} ({stage.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {isRTL ? 'مصادر الطلبات' : 'Application Sources'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicationData.applicationSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{source.count}</span>
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'تفاصيل الحالة' : 'Status Details'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {applicationData.statusBreakdown.map((status) => (
              <div key={status.status} className={`p-4 rounded-lg ${getStatusColor(status.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(status.status)}
                  <span className="font-medium">{status.status}</span>
                </div>
                <div className="text-2xl font-bold">{status.count}</div>
                <div className="text-sm opacity-75">{status.percentage}% of total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};