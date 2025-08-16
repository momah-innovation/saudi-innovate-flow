import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Eye, 
  Search, 
  Shield,
  Clock
} from 'lucide-react';
import { useSuspiciousActivities } from '@/hooks/admin/useSuspiciousActivities';
import { dateHandler } from '@/utils/unified-date-handler';

interface SuspiciousActivityTableProps {
  className?: string;
}

const SuspiciousActivityTable: React.FC<SuspiciousActivityTableProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');

  const { data: activities, isLoading } = useSuspiciousActivities({
    severity: severityFilter !== 'all' ? severityFilter as 'low' | 'medium' | 'high' : undefined,
    activityType: activityTypeFilter !== 'all' ? activityTypeFilter : undefined,
    limit: 20
  });

  const filteredActivities = activities?.filter(activity => 
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return severity;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'failed_login': return 'فشل تسجيل الدخول';
      case 'suspicious_access': return 'وصول مشبوه';
      case 'rate_limit_exceeded': return 'تجاوز حد المعدل';
      case 'unauthorized_action': return 'إجراء غير مصرح';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            الأنشطة المشبوهة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          الأنشطة المشبوهة
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الأنشطة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="مستوى الخطورة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستويات</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="low">منخفضة</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="نوع النشاط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="failed_login">فشل تسجيل الدخول</SelectItem>
              <SelectItem value="suspicious_access">وصول مشبوه</SelectItem>
              <SelectItem value="rate_limit_exceeded">تجاوز حد المعدل</SelectItem>
              <SelectItem value="unauthorized_action">إجراء غير مصرح</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                <TableHead>نوع النشاط</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>مستوى الخطورة</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Shield className="w-8 h-8 mx-auto mb-2" />
                    لا توجد أنشطة مشبوهة
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {dateHandler.formatDate(activity.created_at, 'dd/MM HH:mm')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getActivityTypeLabel(activity.activity_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {activity.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(activity.severity)}>
                        {getSeverityLabel(activity.severity)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">غير معروف</span>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        غير متوفر
                      </code>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredActivities.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            عرض {filteredActivities.length} من أصل {activities?.length || 0} نشاط
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspiciousActivityTable;