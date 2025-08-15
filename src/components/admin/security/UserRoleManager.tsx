import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useUserRoles, useRoleManagement } from '@/hooks/admin/useRoleManagement';
import { debugLog } from '@/utils/debugLogger';

interface UserRoleManagerProps {
  className?: string;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ className }) => {
  const { t, language, isRTL } = useUnifiedTranslation();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [editReason, setEditReason] = useState('');

  // Data hooks
  const { data: userRoles, isLoading: loadingRoles } = useUserRoles({
    role: roleFilter === 'all' ? undefined : roleFilter,
    activeOnly: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    autoRefresh: true
  });

  // Mutations
  const { revokeRole, isRevoking } = useRoleManagement();

  // Filter data based on search
  const filteredRoles = userRoles?.filter(role =>
    role.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle role editing
  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  // Handle role revocation
  const handleRevokeRole = async (userId: string, role: string) => {
    try {
      await revokeRole.mutateAsync({
        targetUserId: userId,
        role,
        reason: editReason || 'تم الإلغاء من إدارة الأدوار'
      });
      setIsEditDialogOpen(false);
      setEditReason('');
      setSelectedRole(null);
    } catch (error) {
      debugLog.error('Error revoking role:', { component: 'UserRoleManager' }, error);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (isActive: boolean, expiresAt?: string) => {
    if (!isActive) return 'secondary';
    if (expiresAt && new Date(expiresAt) < new Date()) return 'warning';
    return 'default';
  };

  // Get status text
  const getStatusText = (isActive: boolean, expiresAt?: string) => {
    if (!isActive) return 'غير نشط';
    if (expiresAt && new Date(expiresAt) < new Date()) return 'منتهي الصلاحية';
    return 'نشط';
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                إدارة أدوار المستخدمين
              </CardTitle>
              <CardDescription>
                عرض وإدارة جميع الأدوار المعينة للمستخدمين في النظام
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة دور
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المستخدمين والأدوار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="super_admin">مدير عام</SelectItem>
                <SelectItem value="user_manager">مدير مستخدمين</SelectItem>
                <SelectItem value="moderator">مشرف</SelectItem>
                <SelectItem value="viewer">مشاهد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Roles Table */}
          {loadingRoles ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>معرف المستخدم</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>تاريخ التعيين</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.user_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(role.granted_at), 'dd/MM/yyyy HH:mm', { 
                          locale: language === 'ar' ? ar : undefined 
                        })}
                      </TableCell>
                      <TableCell>
                        {role.expires_at ? 
                          format(new Date(role.expires_at), 'dd/MM/yyyy HH:mm', { 
                            locale: language === 'ar' ? ar : undefined 
                          }) :
                          'غير محدد'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(role.is_active, role.expires_at)}>
                          {getStatusText(role.is_active, role.expires_at)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {role.is_active && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRevokeRole(role.user_id, role.role)}
                              disabled={isRevoking}
                            >
                              <UserX className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      لا توجد أدوار مطابقة للمعايير المحددة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل دور المستخدم</DialogTitle>
            <DialogDescription>
              تعديل أو إلغاء دور المستخدم مع تحديد السبب
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>معرف المستخدم</Label>
                  <Input value={selectedRole.user_id} disabled />
                </div>
                <div>
                  <Label>الدور الحالي</Label>
                  <Input value={selectedRole.role} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-reason">سبب التعديل/الإلغاء</Label>
                <Textarea
                  id="edit-reason"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="أدخل سبب تعديل أو إلغاء الدور"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedRole && handleRevokeRole(selectedRole.user_id, selectedRole.role)}
              disabled={isRevoking || !editReason.trim()}
            >
              {isRevoking ? 'جاري الإلغاء...' : 'إلغاء الدور'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRoleManager;