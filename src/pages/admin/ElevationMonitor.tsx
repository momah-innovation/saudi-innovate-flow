import React, { useState } from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debugLog } from '@/utils/debugLogger';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Search,
  Download,
  Eye,
  UserCheck
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ElevationMonitor: React.FC = () => {
  const { t, language } = useUnifiedTranslation();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Fetch admin elevation logs
  const { data: elevationLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['admin-elevation-logs', timeFilter, roleFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from('admin_elevation_logs')
          .select('*')
          .order('elevated_at', { ascending: false })
          .limit(100);

        // Apply time filter
        const now = new Date();
        let startDate = new Date();
        switch (timeFilter) {
          case '1h':
            startDate.setHours(now.getHours() - 1);
            break;
          case '24h':
            startDate.setDate(now.getDate() - 1);
            break;
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        }
        
        if (timeFilter !== 'all') {
          query = query.gte('elevated_at', startDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          toast({
            title: "خطأ في تحميل سجلات الرفع",
            description: "فشل في تحميل بيانات سجلات رفع الصلاحيات. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
          });
          throw error;
        }

        return data || [];
      } catch (error) {
        debugLog.error('Error fetching elevation logs', { error });
        return [];
      }
    },
    refetchInterval: 30000, // 30 seconds
    staleTime: 5000
  });

  // Mock data for role patterns and security metrics
  const mockRolePatterns = [
    { role: 'admin', count: 5, trend: '+20%', risk: 'medium' },
    { role: 'super_admin', count: 2, trend: '+100%', risk: 'high' },
    { role: 'user_manager', count: 8, trend: '+14%', risk: 'low' },
    { role: 'moderator', count: 3, trend: '-25%', risk: 'low' }
  ];

  const mockSecurityMetrics = {
    totalElevations: elevationLogs?.length || 0,
    suspiciousPatterns: 2,
    riskScore: 7.5,
    lastIncident: '2024-01-10T15:30:00Z'
  };

  // Filter data based on search
  const filteredLogs = elevationLogs?.filter(log =>
    log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.elevated_by?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get risk badge variant
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'secondary';
    }
  };

  // Get risk text
  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return risk;
    }
  };

  return (
    <AdminPageWrapper
      title={language === 'ar' ? 'مراقب رفع الصلاحيات الإدارية' : 'Admin Privilege Elevation Monitor'}
      description={language === 'ar' ? 'تتبع ومراقبة عمليات رفع الصلاحيات الإدارية والكشف عن الأنماط المشبوهة' : 'Track and monitor admin privilege escalations and detect suspicious patterns'}
    >
      <AdminBreadcrumb />
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في السجلات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">آخر ساعة</SelectItem>
                <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
                <SelectItem value="all">جميع الفترات</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="super_admin">مدير عام</SelectItem>
                <SelectItem value="user_manager">مدير مستخدمين</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تصدير السجلات
            </Button>
          </div>
        </div>

        {/* Security Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الرفعات</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSecurityMetrics.totalElevations}</div>
              <p className="text-xs text-muted-foreground">في الفترة المحددة</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أنماط مشبوهة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{mockSecurityMetrics.suspiciousPatterns}</div>
              <p className="text-xs text-muted-foreground">تحتاج مراجعة</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">درجة المخاطر</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{mockSecurityMetrics.riskScore}/10</div>
              <p className="text-xs text-muted-foreground">مستوى المخاطر الحالي</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">آخر حادثة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {format(new Date(mockSecurityMetrics.lastIncident), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}
              </div>
              <p className="text-xs text-muted-foreground">آخر نشاط مشبوه</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="elevation-logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="elevation-logs">سجلات الرفع</TabsTrigger>
            <TabsTrigger value="role-patterns">أنماط الأدوار</TabsTrigger>
            <TabsTrigger value="security-analysis">التحليل الأمني</TabsTrigger>
          </TabsList>

          {/* Elevation Logs */}
          <TabsContent value="elevation-logs">
            <Card>
              <CardHeader>
                <CardTitle>سجلات رفع الصلاحيات الإدارية</CardTitle>
                <CardDescription>
                  تفاصيل جميع عمليات رفع الصلاحيات الإدارية مع الوقت والمستخدم المسؤول
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingLogs ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>البريد الإلكتروني</TableHead>
                        <TableHead>رفع بواسطة</TableHead>
                        <TableHead>وقت الرفع</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.user_id}</TableCell>
                            <TableCell>{log.email || 'غير محدد'}</TableCell>
                            <TableCell>{log.elevated_by || 'النظام'}</TableCell>
                            <TableCell>
                              {format(new Date(log.elevated_at), 'dd/MM/yyyy HH:mm', { 
                                locale: isRTL ? ar : undefined 
                              })}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                عرض
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            لا توجد سجلات رفع صلاحيات في الفترة المحددة
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Role Patterns */}
          <TabsContent value="role-patterns">
            <Card>
              <CardHeader>
                <CardTitle>أنماط تعيين الأدوار</CardTitle>
                <CardDescription>
                  تحليل أنماط تعيين الأدوار واكتشاف الاتجاهات المشبوهة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الدور</TableHead>
                      <TableHead>عدد التعيينات</TableHead>
                      <TableHead>الاتجاه</TableHead>
                      <TableHead>مستوى المخاطر</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRolePatterns.map((pattern, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">{pattern.role}</Badge>
                        </TableCell>
                        <TableCell>{pattern.count}</TableCell>
                        <TableCell>
                          <span className={pattern.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>
                            {pattern.trend}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(pattern.risk)}>
                            {getRiskText(pattern.risk)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <UserCheck className="w-3 h-3 mr-1" />
                            تحليل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Analysis */}
          <TabsContent value="security-analysis">
            <Card>
              <CardHeader>
                <CardTitle>التحليل الأمني المتقدم</CardTitle>
                <CardDescription>
                  تحليل شامل للأنماط الأمنية والتوصيات لتحسين الأمان
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Risk Assessment */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">تقييم المخاطر</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">85%</div>
                        <p className="text-sm text-muted-foreground">النشاطات الطبيعية</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">12%</div>
                        <p className="text-sm text-muted-foreground">تحتاج مراجعة</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">3%</div>
                        <p className="text-sm text-muted-foreground">مخاطر عالية</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">التوصيات الأمنية</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                        مراجعة عمليات رفع الصلاحيات للمدراء العامين
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-info mt-0.5" />
                        تفعيل المصادقة الثنائية لجميع الحسابات الإدارية
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-success mt-0.5" />
                        تحديد صلاحية زمنية للأدوار المؤقتة
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageWrapper>
  );
};

export default ElevationMonitor;