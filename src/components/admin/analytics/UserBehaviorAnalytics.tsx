import React, { useState } from 'react';
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

interface UserBehaviorAnalyticsProps {
  className?: string;
}

const UserBehaviorAnalytics: React.FC<UserBehaviorAnalyticsProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user journey data
  const mockUserJourneys = [
    { step: 'زيارة الصفحة الرئيسية', users: 1420, dropRate: 0 },
    { step: 'تسجيل الدخول', users: 1156, dropRate: 18.6 },
    { step: 'استعراض التحديات', users: 987, dropRate: 14.6 },
    { step: 'قراءة تفاصيل التحدي', users: 743, dropRate: 24.7 },
    { step: 'بدء المشاركة', users: 421, dropRate: 43.3 },
    { step: 'إرسال الفكرة', users: 284, dropRate: 32.5 }
  ];

  // Mock page analytics
  const mockPageAnalytics = [
    { 
      page: '/challenges', 
      views: 15420, 
      uniqueVisitors: 8932, 
      avgTime: '4:32', 
      bounceRate: 23.5,
      conversions: 147
    },
    { 
      page: '/dashboard', 
      views: 12350, 
      uniqueVisitors: 7234, 
      avgTime: '6:15', 
      bounceRate: 18.2,
      conversions: 89
    },
    { 
      page: '/profile', 
      views: 8740, 
      uniqueVisitors: 6123, 
      avgTime: '3:18', 
      bounceRate: 31.8,
      conversions: 45
    },
    { 
      page: '/campaigns', 
      views: 6890, 
      uniqueVisitors: 4567, 
      avgTime: '5:42', 
      bounceRate: 28.4,
      conversions: 67
    }
  ];

  // Mock user engagement trends
  const mockEngagementData = [
    { date: '1/1', activeUsers: 234, sessions: 456, pageViews: 1234 },
    { date: '1/8', activeUsers: 267, sessions: 523, pageViews: 1456 },
    { date: '1/15', activeUsers: 298, sessions: 598, pageViews: 1678 },
    { date: '1/22', activeUsers: 312, sessions: 634, pageViews: 1789 },
    { date: '1/29', activeUsers: 345, sessions: 689, pageViews: 1923 }
  ];

  const filteredPages = mockPageAnalytics.filter(page =>
    page.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            {mockUserJourneys.map((step, index) => (
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
                {index < mockUserJourneys.length - 1 && (
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
              <LineChart data={mockEngagementData}>
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
  );
};

export default UserBehaviorAnalytics;