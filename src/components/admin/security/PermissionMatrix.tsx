import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Check,
  X
} from 'lucide-react';

interface PermissionMatrixProps {
  className?: string;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ className }) => {
  // Mock permissions matrix data
  const roles = ['super_admin', 'admin', 'user_manager', 'moderator', 'viewer', 'user'];
  const permissions = [
    { name: 'عرض لوحة المدير', key: 'view_admin_dashboard' },
    { name: 'إدارة المستخدمين', key: 'manage_users' },
    { name: 'إدارة الأدوار', key: 'manage_roles' },
    { name: 'عرض السجلات الأمنية', key: 'view_security_logs' },
    { name: 'إدارة التحديات', key: 'manage_challenges' },
    { name: 'إدارة الفعاليات', key: 'manage_events' },
    { name: 'عرض التقارير', key: 'view_reports' },
    { name: 'تصدير البيانات', key: 'export_data' },
    { name: 'إدارة النظام', key: 'system_admin' },
    { name: 'إدارة الشراكات', key: 'manage_partnerships' }
  ];

  // Mock permission matrix (true = has permission, false = no permission)
  const permissionMatrix: Record<string, Record<string, boolean>> = {
    'super_admin': {
      'view_admin_dashboard': true,
      'manage_users': true,
      'manage_roles': true,
      'view_security_logs': true,
      'manage_challenges': true,
      'manage_events': true,
      'view_reports': true,
      'export_data': true,
      'system_admin': true,
      'manage_partnerships': true
    },
    'admin': {
      'view_admin_dashboard': true,
      'manage_users': true,
      'manage_roles': false,
      'view_security_logs': true,
      'manage_challenges': true,
      'manage_events': true,
      'view_reports': true,
      'export_data': true,
      'system_admin': false,
      'manage_partnerships': true
    },
    'user_manager': {
      'view_admin_dashboard': true,
      'manage_users': true,
      'manage_roles': false,
      'view_security_logs': false,
      'manage_challenges': false,
      'manage_events': false,
      'view_reports': true,
      'export_data': false,
      'system_admin': false,
      'manage_partnerships': false
    },
    'moderator': {
      'view_admin_dashboard': true,
      'manage_users': false,
      'manage_roles': false,
      'view_security_logs': false,
      'manage_challenges': true,
      'manage_events': true,
      'view_reports': false,
      'export_data': false,
      'system_admin': false,
      'manage_partnerships': false
    },
    'viewer': {
      'view_admin_dashboard': true,
      'manage_users': false,
      'manage_roles': false,
      'view_security_logs': false,
      'manage_challenges': false,
      'manage_events': false,
      'view_reports': true,
      'export_data': false,
      'system_admin': false,
      'manage_partnerships': false
    },
    'user': {
      'view_admin_dashboard': false,
      'manage_users': false,
      'manage_roles': false,
      'view_security_logs': false,
      'manage_challenges': false,
      'manage_events': false,
      'view_reports': false,
      'export_data': false,
      'system_admin': false,
      'manage_partnerships': false
    }
  };

  // Get permission status
  const hasPermission = (role: string, permission: string): boolean => {
    return permissionMatrix[role]?.[permission] || false;
  };

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'user_manager': return 'secondary';
      case 'moderator': return 'outline';
      case 'viewer': return 'outline';
      case 'user': return 'secondary';
      default: return 'secondary';
    }
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'مدير عام';
      case 'admin': return 'مدير';
      case 'user_manager': return 'مدير مستخدمين';
      case 'moderator': return 'مشرف';
      case 'viewer': return 'مشاهد';
      case 'user': return 'مستخدم';
      default: return role;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                مصفوفة الصلاحيات
              </CardTitle>
              <CardDescription>
                عرض شامل لصلاحيات كل دور ومستوى الوصول للوظائف المختلفة
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة صلاحية
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Roles Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">الأدوار المتاحة</h3>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                  {getRoleDisplayName(role)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Permissions Matrix Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">الصلاحية</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role} className="text-center min-w-28">
                      <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                        {getRoleDisplayName(role)}
                      </Badge>
                    </TableHead>
                  ))}
                  <TableHead className="w-32">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.key}>
                    <TableCell className="font-medium">
                      {permission.name}
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role}-${permission.key}`} className="text-center">
                        {hasPermission(role, permission.key) ? (
                          <Check className="w-4 h-4 text-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Matrix Legend */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">مفتاح الرموز</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>مسموح</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-muted-foreground" />
                <span>غير مسموح</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{permissions.length}</div>
              <p className="text-sm text-muted-foreground">إجمالي الصلاحيات</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-sm text-muted-foreground">إجمالي الأدوار</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {Object.values(permissionMatrix).reduce((total, rolePerms) => 
                  total + Object.values(rolePerms).filter(Boolean).length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">إجمالي الصلاحيات المفعلة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionMatrix;