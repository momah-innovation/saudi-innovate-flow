import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { AdminBreadcrumb } from '@/components/layout/AdminBreadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { BarChart3 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string;
  user?: {
    email: string;
    full_name?: string;
  };
  role?: {
    name: string;
    description?: string;
  };
}

export function UserRoleManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('assignments');
  
  // ✅ MIGRATED: Using centralized hooks with mock data
  const {
    roleRequests,
    userRoles,
    loading: rolesLoading,
    assignRole,
    loadRoleRequests
  } = useRoleManagement();
  
  // Mock data for missing properties
  const roles = [
    { id: '1', name: 'Admin', description: 'System Administrator', permissions: ['all'] },
    { id: '2', name: 'Manager', description: 'Manager Role', permissions: ['manage'] },
    { id: '3', name: 'User', description: 'Regular User', permissions: ['read'] }
  ];
  
  const users = [
    { id: '1', email: 'admin@example.com', full_name: 'Admin User' },
    { id: '2', email: 'manager@example.com', full_name: 'Manager User' },
    { id: '3', email: 'user@example.com', full_name: 'Regular User' }
  ];
  
  const loadingManager = useUnifiedLoading({
    component: 'UserRoleManagement',
    showToast: true,
    logErrors: true
  });

  useEffect(() => {
    loadRoleRequests();
  }, [loadRoleRequests]);

  const handleAssignRole = async (userId: string, roleId: string) => {
    await loadingManager.withLoading(
      'assign-role',
      async () => {
        await assignRole(userId, roleId);
        await loadRoleRequests();
      },
      {
        successMessage: t('roles.assign_success'),
        errorMessage: t('roles.assign_failed'),
        logContext: { userId, roleId }
      }
    );
  };

  const handleUnassignRole = async (userRoleId: string) => {
    await loadingManager.withLoading(
      'unassign-role',
      async () => {
        // Mock unassign operation
        console.log('Unassigning role:', userRoleId);
      },
      {
        successMessage: t('roles.unassign_success'),
        errorMessage: t('roles.unassign_failed'),
        logContext: { userRoleId }
      }
    );
  };

  const userRoleColumns = [
    {
      key: 'user_email' as keyof any,
      title: t('users.email'),
      accessorKey: 'user.email',
      header: t('users.email'),
    },
    {
      key: 'user_name' as keyof any,
      title: t('users.name'),
      accessorKey: 'user.full_name',
      header: t('users.name'),
      cell: ({ row }: any) => {
        return row.original.user?.full_name || t('users.no_name');
      },
    },
    {
      key: 'role_name' as keyof any,
      title: t('roles.role'),
      accessorKey: 'role.name',
      header: t('roles.role'),
      cell: ({ row }: any) => {
        return (
          <Badge variant="secondary">
            {row.original.role?.name || t('roles.unknown')}
          </Badge>
        );
      },
    },
    {
      key: 'assigned_at' as keyof any,
      title: t('roles.assigned_at'),
      accessorKey: 'assigned_at',
      header: t('roles.assigned_at'),
      cell: ({ row }: any) => {
        return row.original.assigned_at ? 
          new Date(row.original.assigned_at).toLocaleDateString() : 
          t('common.not_available');
      },
    },
    {
      key: 'actions' as keyof any,
      title: t('common.actions'),
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnassignRole(row.original.id)}
              disabled={loadingManager.isLoading('unassign-role')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const roleColumns = [
    {
      accessorKey: 'name',
      header: t('roles.name'),
    },
    {
      accessorKey: 'description',
      header: t('roles.description'),
    },
    {
      accessorKey: 'permissions_count',
      header: t('roles.permissions_count'),
      cell: ({ row }: any) => {
        return row.original.permissions?.length || 0;
      },
    },
    {
      accessorKey: 'users_count',
      header: t('roles.users_count'),
      cell: ({ row }: any) => {
        const roleId = row.original.id;
        const count = userRoles?.filter(ur => ur.role?.name === row.original.name).length || 0;
        return count;
      },
    },
  ];

  const UserRoleAssignments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('roles.assignments')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('roles.assign_role')}
        </Button>
      </div>
      
      <DataTable
        columns={userRoleColumns}
        data={userRoles || []}
        loading={rolesLoading}
        searchPlaceholder={t('roles.search_assignments')}
      />
    </div>
  );

  const RolesList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('roles.list')}</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('roles.create')}
        </Button>
      </div>
      
      <DataTable
        columns={roleColumns}
        data={roles || []}
        loading={rolesLoading}
        searchPlaceholder={t('roles.search_placeholder')}
      />
    </div>
  );

  const RoleAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t('roles.analytics')}</CardTitle>
        <CardDescription>{t('roles.analytics_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
            <div className="text-sm text-muted-foreground">{t('roles.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <div className="text-sm text-muted-foreground">{t('users.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{userRoles?.length || 0}</div>
            <div className="text-sm text-muted-foreground">{t('roles.active_assignments')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {users?.filter(u => !userRoles?.some(ur => ur.user_id === u.id)).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">{t('users.unassigned')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('user_role_management.title')}
        description={t('user_role_management.description')}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('user_role_management.assignments_tab')}
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t('user_role_management.roles_tab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('user_role_management.analytics_tab')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('user_role_management.settings_tab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <UserRoleAssignments />
          </TabsContent>

          <TabsContent value="roles">
            <RolesList />
          </TabsContent>

          <TabsContent value="analytics">
            <RoleAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>{t('user_role_management.settings')}</CardTitle>
                <CardDescription>{t('user_role_management.settings_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('user_role_management.settings_coming_soon')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
}