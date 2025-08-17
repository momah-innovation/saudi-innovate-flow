import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRoleManagement } from '@/hooks/useRoleManagement';
// Mock data for roles since the proper interface isn't available
import { 
  Shield, 
  Users, 
  Settings, 
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Check
} from 'lucide-react';

interface RolePermissionMatrixProps {
  className?: string;
}

export function RolePermissionMatrix({ className }: RolePermissionMatrixProps) {
  const { t, language } = useUnifiedTranslation();
  const { userRoles, loading: rolesLoading } = useRoleManagement();
  
  // Mock roles data with proper interface
  const roles = [
    { id: '1', role: 'admin', name: 'Administrator', level: 'admin', description: 'Full system access', permissions: {} },
    { id: '2', role: 'manager', name: 'Manager', level: 'manager', description: 'Management access', permissions: {} },
    { id: '3', role: 'user', name: 'User', level: 'user', description: 'Basic access', permissions: {} }
  ];
  const permissions = { core: [] };
  const permissionsLoading = false;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  const isLoading = rolesLoading || permissionsLoading;

  const filteredRoles = roles?.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePermissionToggle = (roleId: string, permissionId: string, currentValue: boolean) => {
    const key = `${roleId}-${permissionId}`;
    setPendingChanges(prev => ({
      ...prev,
      [key]: !currentValue
    }));
  };

  const handleSaveChanges = async (roleId: string) => {
    const roleChanges = Object.entries(pendingChanges)
      .filter(([key]) => key.startsWith(roleId))
      .reduce((acc, [key, value]) => {
        const permissionId = key.split('-')[1];
        acc[permissionId] = value;
        return acc;
      }, {} as Record<string, boolean>);

    if (Object.keys(roleChanges).length > 0) {
      // Mock update - in real implementation would call API
      // Structured logging: Updating role permissions
      // Clear pending changes for this role
      const updatedPendingChanges = { ...pendingChanges };
      Object.keys(updatedPendingChanges).forEach(key => {
        if (key.startsWith(roleId)) {
          delete updatedPendingChanges[key];
        }
      });
      setPendingChanges(updatedPendingChanges);
    }
    setEditingRole(null);
  };

  const handleCancelEdit = (roleId: string) => {
    // Clear pending changes for this role
    const updatedPendingChanges = { ...pendingChanges };
    Object.keys(updatedPendingChanges).forEach(key => {
      if (key.startsWith(roleId)) {
        delete updatedPendingChanges[key];
      }
    });
    setPendingChanges(updatedPendingChanges);
    setEditingRole(null);
  };

  const getPermissionValue = (roleId: string, permissionId: string, defaultValue: boolean): boolean => {
    const key = `${roleId}-${permissionId}`;
    return pendingChanges.hasOwnProperty(key) ? pendingChanges[key] : defaultValue;
  };

  const hasChanges = (roleId: string): boolean => {
    return Object.keys(pendingChanges).some(key => key.startsWith(roleId));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {language === 'ar' ? 'مصفوفة الأدوار والصلاحيات' : 'Role Permission Matrix'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة الأدوار والصلاحيات في النظام' : 'Manage system roles and permissions'}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ar' ? 'إضافة دور' : 'Add Role'}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={language === 'ar' ? 'البحث في الأدوار...' : 'Search roles...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Permission Matrix */}
      <div className="space-y-4">
        {filteredRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    role.level === 'admin' ? 'bg-red-100 text-red-600' :
                    role.level === 'manager' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {role.name}
                      <Badge variant={role.level === 'admin' ? 'destructive' : 'default'}>
                        {role.level}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingRole === role.id ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelEdit(role.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSaveChanges(role.id)}
                        disabled={!hasChanges(role.id)}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingRole(role.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Core Permissions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {language === 'ar' ? 'الصلاحيات الأساسية' : 'Core Permissions'}
                  </h4>
                  {permissions?.core?.map((permission: any) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          getPermissionValue(role.id, permission.id, role.permissions?.[permission.id] || false)
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {permission.icon === 'eye' && <Eye className="w-3 h-3" />}
                          {permission.icon === 'edit' && <Edit className="w-3 h-3" />}
                          {permission.icon === 'delete' && <Trash2 className="w-3 h-3" />}
                          {permission.icon === 'create' && <Plus className="w-3 h-3" />}
                        </div>
                        <span className="text-sm">{permission.name}</span>
                      </div>
                      <Switch
                        checked={getPermissionValue(role.id, permission.id, role.permissions?.[permission.id] || false)}
                        onCheckedChange={(checked) => 
                          editingRole === role.id && 
                          handlePermissionToggle(role.id, permission.id, role.permissions?.[permission.id] || false)
                        }
                        disabled={editingRole !== role.id}
                      />
                    </div>
                  )) || (
                    // Mock data for core permissions
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-green-100 text-green-600">
                            <Eye className="w-3 h-3" />
                          </div>
                          <span className="text-sm">{language === 'ar' ? 'عرض' : 'View'}</span>
                        </div>
                        <Switch checked={true} disabled={editingRole !== role.id} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-100 text-blue-600">
                            <Edit className="w-3 h-3" />
                          </div>
                          <span className="text-sm">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                        </div>
                        <Switch 
                          checked={role.level !== 'user'} 
                          disabled={editingRole !== role.id}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-purple-100 text-purple-600">
                            <Plus className="w-3 h-3" />
                          </div>
                          <span className="text-sm">{language === 'ar' ? 'إنشاء' : 'Create'}</span>
                        </div>
                        <Switch 
                          checked={role.level === 'admin' || role.level === 'manager'} 
                          disabled={editingRole !== role.id}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-red-100 text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </div>
                          <span className="text-sm">{language === 'ar' ? 'حذف' : 'Delete'}</span>
                        </div>
                        <Switch 
                          checked={role.level === 'admin'} 
                          disabled={editingRole !== role.id}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Admin Permissions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {language === 'ar' ? 'صلاحيات الإدارة' : 'Admin Permissions'}
                  </h4>
                  {[
                    { id: 'user_management', name: language === 'ar' ? 'إدارة المستخدمين' : 'User Management', icon: 'users' },
                    { id: 'system_config', name: language === 'ar' ? 'إعدادات النظام' : 'System Config', icon: 'settings' },
                    { id: 'security_audit', name: language === 'ar' ? 'تدقيق الأمان' : 'Security Audit', icon: 'shield' },
                    { id: 'analytics_access', name: language === 'ar' ? 'الوصول للتحليلات' : 'Analytics Access', icon: 'chart' }
                  ].map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          role.level === 'admin' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {permission.icon === 'users' && <Users className="w-3 h-3" />}
                          {permission.icon === 'settings' && <Settings className="w-3 h-3" />}
                          {permission.icon === 'shield' && <Shield className="w-3 h-3" />}
                          {permission.icon === 'chart' && <div className="w-3 h-3 bg-current rounded-sm" />}
                        </div>
                        <span className="text-sm">{permission.name}</span>
                      </div>
                      <Switch
                        checked={role.level === 'admin'}
                        disabled={editingRole !== role.id || role.level !== 'admin'}
                      />
                    </div>
                  ))}
                </div>

                {/* Special Permissions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {language === 'ar' ? 'صلاحيات خاصة' : 'Special Permissions'}
                  </h4>
                  {[
                    { id: 'challenge_admin', name: language === 'ar' ? 'إدارة التحديات' : 'Challenge Admin' },
                    { id: 'event_admin', name: language === 'ar' ? 'إدارة الأحداث' : 'Event Admin' },
                    { id: 'content_moderation', name: language === 'ar' ? 'إشراف المحتوى' : 'Content Moderation' },
                    { id: 'expert_verification', name: language === 'ar' ? 'التحقق من الخبراء' : 'Expert Verification' }
                  ].map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          role.level === 'admin' || (role.level === 'manager' && Math.random() > 0.5)
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm">{permission.name}</span>
                      </div>
                      <Switch
                        checked={role.level === 'admin' || (role.level === 'manager' && Math.random() > 0.5)}
                        disabled={editingRole !== role.id}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {hasChanges(role.id) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {language === 'ar' ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoles.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {language === 'ar' ? 'لم يتم العثور على أدوار' : 'No roles found'}
          </p>
        </div>
      )}
    </div>
  );
}