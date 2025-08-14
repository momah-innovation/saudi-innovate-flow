import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useRoleApprovalRequests, useRoleManagement } from '@/hooks/admin/useRoleManagement';
import { debugLog } from '@/utils/debugLogger';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface RoleApprovalQueueProps {
  className?: string;
}

const RoleApprovalQueue: React.FC<RoleApprovalQueueProps> = ({ className }) => {
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  
  const { data: requests, isLoading } = useRoleApprovalRequests({
    status: statusFilter !== 'all' ? statusFilter as 'pending' | 'approved' | 'rejected' : undefined
  });

  const { approveRoleRequest, isApproving } = useRoleManagement();

  const handleApproval = async (requestId: string, approved: boolean) => {
    try {
      await approveRoleRequest.mutateAsync({
        requestId,
        approve: approved,
        reviewerNotes: approved ? 'تمت الموافقة' : 'تم الرفض'
      });
    } catch (error) {
      debugLog.error('Error handling approval:', { component: 'RoleApprovalQueue' }, error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'تمت الموافقة';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'moderator': return 'مشرف';
      case 'user_manager': return 'مدير مستخدمين';
      case 'viewer': return 'مشاهد';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            طلبات الموافقة على الأدوار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = requests?.filter(req => req.status === 'pending').length || 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            طلبات الموافقة على الأدوار
          </div>
          <Badge variant={pendingCount > 0 ? "default" : "outline"}>
            {pendingCount} في الانتظار
          </Badge>
        </CardTitle>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="حالة الطلب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطلبات</SelectItem>
              <SelectItem value="pending">في الانتظار</SelectItem>
              <SelectItem value="approved">تمت الموافقة</SelectItem>
              <SelectItem value="rejected">مرفوض</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>الدور المطلوب</TableHead>
                <TableHead>المبرر</TableHead>
                <TableHead>تاريخ الطلب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!requests || requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    لا توجد طلبات موافقة
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                          <div className="font-medium">مستخدم غير معروف</div>
                          <div className="text-muted-foreground">بريد غير متوفر</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleLabel(request.requested_role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">
                        {request.justification || 'لا يوجد مبرر'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(request.id, true)}
                            disabled={isApproving}
                            className="text-success hover:bg-success/10"
                          >
                            <CheckCircle className="w-3 h-3" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(request.id, false)}
                            disabled={isApproving}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="w-3 h-3" />
                            رفض
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {request.status === 'approved' ? 'تمت الموافقة' : 'تم الرفض'}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {requests && requests.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>عرض {requests.length} طلب</span>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-4 h-4" />
                يتطلب {pendingCount} طلب مراجعة
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleApprovalQueue;