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
import { useRTLAware } from '@/hooks/useRTLAware';

// Role hierarchy definition
export const ROLE_HIERARCHY = {
  super_admin: {
    level: 10,
    label: 'مدير النظام الرئيسي',
    description: 'صلاحيات كاملة على النظام',
    color: 'destructive',
    icon: Crown
  },
  admin: {
    level: 8,
    label: 'مدير النظام',
    description: 'إدارة المستخدمين والإعدادات',
    color: 'destructive',
    icon: Shield
  },
  org_admin: {
    level: 6,
    label: 'مدير الجهة',
    description: 'إدارة مستخدمي الجهة',
    color: 'secondary',
    icon: Building2
  },
  expert: {
    level: 5,
    label: 'خبير تقييم',
    description: 'تقييم الأفكار والمشاريع',
    color: 'default',
    icon: Star
  },
  innovator: {
    level: 3,
    label: 'مبتكر',
    description: 'تقديم الأفكار والمشاركة',
    color: 'secondary',
    icon: UserCheck
  },
  viewer: {
    level: 1,
    label: 'مطلع',
    description: 'عرض المحتوى فقط',
    color: 'outline',
    icon: Users
  }
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

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
  const { me } = useRTLAware();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // API call would go here
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      onRoleUpdate?.(userId, newRole);
      
      toast({
        title: "تم تحديث الدور",
        description: `تم تغيير دور المستخدم بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث دور المستخدم",
        variant: "destructive"
      });
    }
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
            هيكل الأدوار والصلاحيات
          </CardTitle>
          <CardDescription>
            نظام إدارة الأدوار المتدرج لضمان الأمان والتحكم المناسب
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
                      مستوى {role.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {role.description}
                  </p>
                  <div className="text-xs">
                    <span className="font-medium">الصلاحيات: </span>
                    <span className="text-muted-foreground">
                      {ROLE_PERMISSIONS[roleKey as UserRole].length} صلاحية
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
            إدارة المستخدمين
          </CardTitle>
          <CardDescription>
            تعيين وإدارة أدوار المستخدمين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className={`h-4 w-4 ${me('2')}`} />
                <SelectValue placeholder="تصفية حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
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
                  <TableHead>المستخدم</TableHead>
                  <TableHead>الدور الحالي</TableHead>
                  <TableHead>الجهة</TableHead>
                  <TableHead>آخر نشاط</TableHead>
                  <TableHead>الإجراءات</TableHead>
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
                              <DialogTitle>تحديث دور المستخدم</DialogTitle>
                              <DialogDescription>
                                اختر الدور الجديد للمستخدم {user.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>الدور الجديد</Label>
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
                                تحديث الدور
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
              لا توجد نتائج مطابقة للبحث
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            مصفوفة الصلاحيات
          </CardTitle>
          <CardDescription>
            عرض تفصيلي للصلاحيات المخصصة لكل دور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-48">الصلاحية</TableHead>
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