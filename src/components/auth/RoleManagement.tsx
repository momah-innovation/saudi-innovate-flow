// User Role Management System - Phase 2
// Comprehensive role hierarchy and permission management

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { 
  Shield, 
  Users, 
  Settings, 
  Edit, 
  Plus, 
  Search,
  Filter,
  Crown,
  Star,
  UserCheck,
  Building2,
  ChevronDown
} from 'lucide-react';

// Role hierarchy definition (static labels for now)
export const ROLE_HIERARCHY_STATIC = {
  super_admin: {
    level: 10,
    labelKey: 'roles.super_admin.label',
    descriptionKey: 'roles.super_admin.description',
    color: 'destructive',
    icon: Crown
  },
  admin: {
    level: 8,
    labelKey: 'roles.admin.label',
    descriptionKey: 'roles.admin.description',
    color: 'destructive',
    icon: Shield
  },
  org_admin: {
    level: 6,
    labelKey: 'roles.org_admin.label',
    descriptionKey: 'roles.org_admin.description',
    color: 'secondary',
    icon: Building2
  },
  expert: {
    level: 5,
    labelKey: 'roles.expert.label',
    descriptionKey: 'roles.expert.description',
    color: 'default',
    icon: Star
  },
  innovator: {
    level: 3,
    labelKey: 'roles.innovator.label',
    descriptionKey: 'roles.innovator.description',
    color: 'secondary',
    icon: UserCheck
  },
  viewer: {
    level: 1,
    labelKey: 'roles.viewer.label',
    descriptionKey: 'roles.viewer.description',
    color: 'outline',
    icon: Users
  }
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY_STATIC;

// Permission definitions
export const PERMISSIONS = {
  // System Management
  'system.manage': 'إدارة النظام',
  'system.settings': 'إعدادات النظام',
  'system.analytics': 'تحليلات النظام',
  
  // User Management
  'users.create': 'إنشاء مستخدمين',
  'users.edit': 'تعديل المستخدمين',
  'users.delete': 'حذف المستخدمين',
  'users.assign_roles': 'تعيين الأدوار',
  
  // Organization Management
  'org.manage': 'إدارة الجهة',
  'org.settings': 'إعدادات الجهة',
  'org.members': 'أعضاء الجهة',
  
  // Content Management
  'content.create': 'إنشاء المحتوى',
  'content.edit': 'تعديل المحتوى',
  'content.delete': 'حذف المحتوى',
  'content.publish': 'نشر المحتوى',
  
  // Evaluation
  'evaluation.access': 'الوصول للتقييم',
  'evaluation.create': 'إنشاء تقييمات',
  'evaluation.manage': 'إدارة التقييمات',
  
  // Ideas & Innovation
  'ideas.submit': 'تقديم الأفكار',
  'ideas.view': 'عرض الأفكار',
  'ideas.comment': 'التعليق على الأفكار',
  
  // Challenges
  'challenges.create': 'إنشاء التحديات',
  'challenges.manage': 'إدارة التحديات',
  'challenges.participate': 'المشاركة في التحديات'
} as const;

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: Object.keys(PERMISSIONS),
  admin: [
    'system.settings', 'system.analytics',
    'users.create', 'users.edit', 'users.delete', 'users.assign_roles',
    'org.manage', 'org.settings', 'org.members',
    'content.create', 'content.edit', 'content.delete', 'content.publish',
    'evaluation.access', 'evaluation.create', 'evaluation.manage',
    'ideas.submit', 'ideas.view', 'ideas.comment',
    'challenges.create', 'challenges.manage', 'challenges.participate'
  ],
  org_admin: [
    'org.settings', 'org.members',
    'content.create', 'content.edit', 'content.publish',
    'evaluation.access', 'evaluation.create',
    'ideas.submit', 'ideas.view', 'ideas.comment',
    'challenges.create', 'challenges.manage', 'challenges.participate'
  ],
  expert: [
    'evaluation.access', 'evaluation.create', 'evaluation.manage',
    'ideas.submit', 'ideas.view', 'ideas.comment',
    'challenges.participate'
  ],
  innovator: [
    'ideas.submit', 'ideas.view', 'ideas.comment',
    'challenges.participate'
  ],
  viewer: [
    'ideas.view',
    'challenges.participate'
  ]
};

interface RoleManagementProps {
  onRoleUpdate?: (userId: string, newRole: UserRole) => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ onRoleUpdate }) => {
  const { t } = useUnifiedTranslation();
  
  // Initialize unified loading and error handling
  const loadingManager = useUnifiedLoading({ 
    component: 'RoleManagement',
    showToast: true,
    logErrors: true 
  });
  const errorHandler = createErrorHandler({ component: 'RoleManagement' });

  // Dynamic role hierarchy with translations
  const ROLE_HIERARCHY = {
    super_admin: {
      ...ROLE_HIERARCHY_STATIC.super_admin,
      label: t('roles.super_admin.label', 'Super Admin'),
      description: t('roles.super_admin.description', 'Full system privileges'),
    },
    admin: {
      ...ROLE_HIERARCHY_STATIC.admin,
      label: t('roles.admin.label', 'Admin'),
      description: t('roles.admin.description', 'User and settings management'),
    },
    org_admin: {
      ...ROLE_HIERARCHY_STATIC.org_admin,
      label: t('roles.org_admin.label', 'Organization Admin'),
      description: t('roles.org_admin.description', 'Organization user management'),
    },
    expert: {
      ...ROLE_HIERARCHY_STATIC.expert,
      label: t('roles.expert.label', 'Expert'),
      description: t('roles.expert.description', 'Evaluate ideas and projects'),
    },
    innovator: {
      ...ROLE_HIERARCHY_STATIC.innovator,
      label: t('roles.innovator.label', 'Innovator'),
      description: t('roles.innovator.description', 'Submit ideas and participate'),
    },
    viewer: {
      ...ROLE_HIERARCHY_STATIC.viewer,
      label: t('roles.viewer.label', 'Viewer'),
      description: t('roles.viewer.description', 'View content only'),
    }
  };
  const [selectedRole, setSelectedRole] = useState<UserRole>('innovator');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [users, setUsers] = useState([
    // Mock data - replace with actual API call
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'admin' as UserRole,
      organization: 'وزارة التقنية',
      lastActive: '2024-01-15',
      avatar: null
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'fatima@example.com',
      role: 'expert' as UserRole,
      organization: 'وزارة الصحة',
      lastActive: '2024-01-14',
      avatar: null
    }
  ]);

  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const operation = async () => {
      // API call would go here
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      onRoleUpdate?.(userId, newRole);
      return { success: true };
    };

    const result = await loadingManager.withLoading(
      'role_update',
      operation,
      {
        successMessage: t('roles.update.success.description', 'User role has been successfully updated'),
        errorMessage: t('roles.update.error.description', 'An error occurred while updating user role'),
        logContext: { userId, newRole }
      }
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || user.email.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    const IconComponent = ROLE_HIERARCHY[role].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  const hasPermission = (role: UserRole, permission: string): boolean => {
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  return (
    <div className="space-y-6">
      {/* Role Hierarchy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('roles.hierarchy.title', 'Role Hierarchy & Permissions')}
          </CardTitle>
          <CardDescription>
            {t('roles.hierarchy.description', 'Hierarchical role management system for security and proper control')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_HIERARCHY).map(([roleKey, role]) => (
              <Card key={roleKey} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={role.color as any} className="flex items-center gap-1">
                      {getRoleIcon(roleKey as UserRole)}
                      {role.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t('roles.level', 'Level')} {role.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {role.description}
                  </p>
                  <div className="text-xs">
                    <span className="font-medium">{t('roles.permissions.count', 'Permissions')}: </span>
                    <span className="text-muted-foreground">
                      {ROLE_PERMISSIONS[roleKey as UserRole].length} {t('roles.permissions.unit', 'permissions')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('roles.user.management.title', 'User Management')}
          </CardTitle>
          <CardDescription>
            {t('roles.user.management.description', 'Assign and manage user roles in the system')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('roles.search.placeholder', 'Search by name or email...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('roles.filter.placeholder', 'Filter by role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('roles.filter.all', 'All Roles')}</SelectItem>
                {Object.entries(ROLE_HIERARCHY).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('roles.table.user', 'User')}</TableHead>
                  <TableHead>{t('roles.table.current.role', 'Current Role')}</TableHead>
                  <TableHead>{t('roles.table.organization', 'Organization')}</TableHead>
                  <TableHead>{t('roles.table.last.activity', 'Last Activity')}</TableHead>
                  <TableHead>{t('roles.table.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_HIERARCHY[user.role].color as any} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {ROLE_HIERARCHY[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.organization}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                            <DialogTitle>{t('roles.update.dialog.title', 'Update User Role')}</DialogTitle>
                              <DialogDescription>
                                {t('roles.update.dialog.description', 'Select new role for user')} {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>{t('roles.new.role', 'New Role')}</Label>
                                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(ROLE_HIERARCHY).map(([key, role]) => (
                                      <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                          {getRoleIcon(key as UserRole)}
                                          {role.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button 
                                onClick={() => handleRoleChange(user.id, selectedRole)}
                                className="w-full"
                              >
                                {t('roles.update.button', 'Update Role')}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('roles.no.results', 'No matching results found')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('roles.permissions.matrix.title', 'Permissions Matrix')}
          </CardTitle>
          <CardDescription>
            {t('roles.permissions.matrix.description', 'Detailed view of permissions assigned to each role')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">{t('roles.permissions.permission', 'Permission')}</TableHead>
                  {Object.entries(ROLE_HIERARCHY).map(([roleKey, role]) => (
                    <TableHead key={roleKey} className="text-center min-w-24">
                      <div className="flex flex-col items-center gap-1">
                        {getRoleIcon(roleKey as UserRole)}
                        <span className="text-xs">{role.label}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(PERMISSIONS).map(([permissionKey, permissionLabel]) => (
                  <TableRow key={permissionKey}>
                    <TableCell className="font-medium">
                      {permissionLabel}
                    </TableCell>
                    {Object.keys(ROLE_HIERARCHY).map((roleKey) => (
                      <TableCell key={`${roleKey}-${permissionKey}`} className="text-center">
                        <Checkbox
                          checked={hasPermission(roleKey as UserRole, permissionKey)}
                          disabled
                          className="mx-auto"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for checking permissions
export const usePermissions = () => {
  // This would integrate with your auth context
  const checkPermission = (permission: string, userRole?: UserRole): boolean => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole].includes(permission);
  };

  const hasAnyPermission = (permissions: string[], userRole?: UserRole): boolean => {
    if (!userRole) return false;
    return permissions.some(permission => checkPermission(permission, userRole));
  };

  const hasAllPermissions = (permissions: string[], userRole?: UserRole): boolean => {
    if (!userRole) return false;
    return permissions.every(permission => checkPermission(permission, userRole));
  };

  return {
    checkPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};