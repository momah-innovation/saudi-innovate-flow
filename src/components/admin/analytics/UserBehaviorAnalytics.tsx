import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Users, 
  Eye, 
  TrendingUp,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { challengeAnalyticsService } from '@/services/analytics/ChallengeAnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { AnalyticsErrorBoundary } from '@/components/analytics/AnalyticsErrorBoundary';

interface UserBehaviorAnalyticsProps {
  className?: string;
}

const UserBehaviorAnalytics: React.FC<UserBehaviorAnalyticsProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [behaviorData, setBehaviorData] = useState<any>(null);
  
  const { user } = useAuth();
  
  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'UserBehaviorAnalytics',
    showToast: true,
    logErrors: true
  });

  const errorHandler = createErrorHandler({
    component: 'UserBehaviorAnalytics',
    showToast: true,
    logError: true
  });
  useEffect(() => {
    loadUserBehaviorData();
  }, [timeRange, user?.id]);

  const loadUserBehaviorData = async () => {
    if (!user?.id) return;
    
    const result = await withLoading(
      'load-user-behavior-data',
      async () => {
        const data = await challengeAnalyticsService.getUserBehaviorAnalytics(user.id, timeRange);
        return data;
      },
      {
        successMessage: 'User behavior data loaded successfully',
        errorMessage: 'Failed to load user behavior data',
        logContext: { operation: 'loadUserBehaviorData', timeRange }
      }
    );

    if (result) {
      setBehaviorData(result);
    }
  };

  const userJourneys = behaviorData?.userJourneys || [];
  const pageAnalytics = behaviorData?.pageAnalytics || [];
  const engagementData = behaviorData?.engagementData || [];

  const filteredPages = pageAnalytics.filter(page =>
    page.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AnalyticsErrorBoundary>
      <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            تحليل سلوك المستخدمين
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
                <SelectItem value="90d">آخر 90 يوم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* User Journey Funnel */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            رحلة المستخدم
          </h3>
          <div className="space-y-3">
            {userJourneys.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{step.step}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{step.users.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">مستخدم</div>
                    </div>
                    {index > 0 && (
                      <Badge variant={step.dropRate > 30 ? 'destructive' : step.dropRate > 20 ? 'default' : 'outline'}>
                        -{step.dropRate}%
                      </Badge>
                    )}
                  </div>
                </div>
                {index < userJourneys.length - 1 && (
                  <div className="w-0.5 h-4 bg-border mx-4 my-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trends Chart */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            اتجاهات التفاعل
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
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
                  dataKey="activeUsers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="المستخدمون النشطون"
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="الجلسات"
                />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="hsl(var(--warning))" 
                  strokeWidth={2}
                  name="مشاهدات الصفحات"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Page Analytics Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              تحليل الصفحات
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الصفحات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الصفحة</TableHead>
                  <TableHead>المشاهدات</TableHead>
                  <TableHead>زوار فريدون</TableHead>
                  <TableHead>متوسط الوقت</TableHead>
                  <TableHead>معدل الارتداد</TableHead>
                  <TableHead>التحويلات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {page.page}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {page.views.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {page.uniqueVisitors.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{page.avgTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={page.bounceRate < 20 ? 'default' : page.bounceRate < 30 ? 'secondary' : 'destructive'}
                      >
                        {page.bounceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">
                        {page.conversions}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      </Card>
    </AnalyticsErrorBoundary>
  );
};

export default UserBehaviorAnalytics;