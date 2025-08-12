import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, UserCheck, Clock } from 'lucide-react';
import UserRoleManager from '@/components/admin/security/UserRoleManager';
import PermissionMatrix from '@/components/admin/security/PermissionMatrix';
import RoleApprovalQueue from '@/components/admin/security/RoleApprovalQueue';

const AccessControlAdvanced: React.FC = () => {
  const { t, language } = useUnifiedTranslation();
  return (
    <AdminPageWrapper
      title={language === 'ar' ? 'مركز التحكم بالصلاحيات المتقدم' : 'Advanced Access Control Center'}
      description={language === 'ar' ? 'إدارة وتتبع صلاحيات المستخدمين وطلبات الموافقة' : 'Manage and track user permissions and approval requests'}
    >
      <AdminBreadcrumb />
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    طلبات قيد الانتظار
                  </p>
                  <p className="text-2xl font-bold">3</p>
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
                    إجمالي الأدوار النشطة
                  </p>
                  <p className="text-2xl font-bold">28</p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    المستخدمون النشطون
                  </p>
                  <p className="text-2xl font-bold">142</p>
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
                    أنواع الصلاحيات
                  </p>
                  <p className="text-2xl font-bold">10</p>
                </div>
                <UserCheck className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Role Manager */}
          <UserRoleManager />
          
          {/* Role Approval Queue */}
          <RoleApprovalQueue />
        </div>

        {/* Permission Matrix */}
        <PermissionMatrix />
      </div>
    </AdminPageWrapper>
  );
};

export default AccessControlAdvanced;