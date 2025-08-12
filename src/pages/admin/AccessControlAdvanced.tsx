import React, { useState } from 'react';

export default function AccessControlAdvanced() {
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserPlus, 
  Filter,
  Search,
  ExternalLink,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useRoleApprovalRequests, useUserRoles, useRoleManagement } from '@/hooks/admin/useRoleManagement';
import { useRoleHierarchy, usePermissionMatrix } from '@/hooks/admin/useUserPermissions';

export const AccessControlAdvanced: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // State management
  const [activeTab, setActiveTab] = useState('approval-queue');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);

  // Data hooks
  const { 
    data: approvalRequests, 
    isLoading: approvalLoading 
  } = useRoleApprovalRequests({
    status: statusFilter === 'all' ? 'all' : statusFilter as any,
    autoRefresh: true
  });

  const { 
    data: userRoles, 
    isLoading: rolesLoading 
  } = useUserRoles({
    activeOnly: true,
    autoRefresh: true
  });

  const { 
    data: roleHierarchy, 
    isLoading: hierarchyLoading 
  } = useRoleHierarchy({
    autoRefresh: false
  });

  const { 
    data: permissionMatrix, 
    isLoading: matrixLoading 
  } = usePermissionMatrix({
    autoRefresh: false
  });

  // Management hooks
  const { 
    approveRoleRequest, 
    isApproving 
  } = useRoleManagement();

  // Filter functions
  const filteredRequests = approvalRequests?.filter(request => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      request.requester?.display_name?.toLowerCase().includes(searchLower) ||
      request.target_user?.display_name?.toLowerCase().includes(searchLower) ||
      request.requested_role.toLowerCase().includes(searchLower) ||
      request.justification?.toLowerCase().includes(searchLower)
    );
  });

  const filteredUserRoles = userRoles?.filter(role => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      role.user?.display_name?.toLowerCase().includes(searchLower) ||
      role.user?.email?.toLowerCase().includes(searchLower) ||
      role.role.toLowerCase().includes(searchLower)
    );
  });

  // Approval handling
  const handleApproveRequest = async (approve: boolean) => {
    if (!selectedRequest) return;

    try {
      await approveRoleRequest.mutateAsync({
        requestId: selectedRequest.id,
        approve,
        reviewerNotes: reviewNotes
      });
      
      setIsApprovalDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      expired: 'outline'
    };
    
    const labels = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      approved: isRTL ? 'موافق عليه' : 'Approved',
      rejected: isRTL ? 'مرفوض' : 'Rejected',
      expired: isRTL ? 'منتهي الصلاحية' : 'Expired'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleLabels = {
      super_admin: isRTL ? 'مدير عام' : 'Super Admin',
      admin: isRTL ? 'مدير' : 'Admin',
      challenge_manager: isRTL ? 'مدير تحديات' : 'Challenge Manager',
      organization_admin: isRTL ? 'مدير منظمة' : 'Organization Admin',
      user: isRTL ? 'مستخدم' : 'User'
    };

    const roleColors = {
      super_admin: 'destructive',
      admin: 'default',
      challenge_manager: 'secondary',
      organization_admin: 'outline',
      user: 'outline'
    };

    return (
      <Badge variant={roleColors[role as keyof typeof roleColors] as any}>
        {roleLabels[role as keyof typeof roleLabels] || role}
      </Badge>
    );
  };

  return (
    <AdminPageWrapper
      title={isRTL ? 'مركز التحكم في الوصول' : 'Access Control Center'}
      description={isRTL 
        ? 'إدارة الأدوار والصلاحيات وطلبات الموافقة'
        : 'Manage roles, permissions, and approval workflows'
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approval-queue" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {isRTL ? 'طوابير الموافقة' : 'Approval Queue'}
          </TabsTrigger>
          <TabsTrigger value="user-roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {isRTL ? 'أدوار المستخدمين' : 'User Roles'}
          </TabsTrigger>
          <TabsTrigger value="role-hierarchy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {isRTL ? 'هيكل الأدوار' : 'Role Hierarchy'}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {isRTL ? 'مصفوفة الصلاحيات' : 'Permissions'}
          </TabsTrigger>
        </TabsList>

        {/* Approval Queue Tab */}
        <TabsContent value="approval-queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {isRTL ? 'طوابير طلبات الموافقة' : 'Role Approval Queue'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'مراجعة وموافقة طلبات تعيين الأدوار'
                  : 'Review and approve role assignment requests'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isRTL ? 'البحث في الطلبات...' : 'Search requests...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                    <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                    <SelectItem value="approved">{isRTL ? 'موافق عليه' : 'Approved'}</SelectItem>
                    <SelectItem value="rejected">{isRTL ? 'مرفوض' : 'Rejected'}</SelectItem>
                    <SelectItem value="expired">{isRTL ? 'منتهي الصلاحية' : 'Expired'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requests Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? 'مقدم الطلب' : 'Requester'}</TableHead>
                      <TableHead>{isRTL ? 'المستخدم المستهدف' : 'Target User'}</TableHead>
                      <TableHead>{isRTL ? 'الدور المطلوب' : 'Requested Role'}</TableHead>
                      <TableHead>{isRTL ? 'المبرر' : 'Justification'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{isRTL ? 'تاريخ الطلب' : 'Created'}</TableHead>
                      <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(7)].map((_, j) => (
                            <TableCell key={j}>
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredRequests?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {isRTL ? 'لا توجد طلبات موافقة' : 'No approval requests'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests?.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {request.requester?.display_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {request.requester?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {request.target_user?.display_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {request.target_user?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(request.requested_role)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48 truncate" title={request.justification}>
                              {request.justification || (isRTL ? 'لا يوجد مبرر' : 'No justification')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(request.created_at), {
                                addSuffix: true,
                                locale: isRTL ? ar : undefined
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsApprovalDialogOpen(true);
                                }}
                              >
                                {isRTL ? 'مراجعة' : 'Review'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Roles Tab */}
        <TabsContent value="user-roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isRTL ? 'أدوار المستخدمين' : 'User Roles Management'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'عرض وإدارة أدوار جميع المستخدمين'
                  : 'View and manage all user roles'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? 'البحث في المستخدمين...' : 'Search users...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* User Roles Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? 'المستخدم' : 'User'}</TableHead>
                      <TableHead>{isRTL ? 'الدور' : 'Role'}</TableHead>
                      <TableHead>{isRTL ? 'تاريخ التعيين' : 'Granted'}</TableHead>
                      <TableHead>{isRTL ? 'تاريخ الانتهاء' : 'Expires'}</TableHead>
                      <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rolesLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(6)].map((_, j) => (
                            <TableCell key={j}>
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredUserRoles?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {isRTL ? 'لا توجد أدوار للمستخدمين' : 'No user roles found'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUserRoles?.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {role.user?.display_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {role.user?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(role.role)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDistanceToNow(new Date(role.granted_at), {
                                addSuffix: true,
                                locale: isRTL ? ar : undefined
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {role.expires_at ? (
                              <div className="text-sm">
                                {formatDistanceToNow(new Date(role.expires_at), {
                                  addSuffix: true,
                                  locale: isRTL ? ar : undefined
                                })}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                {isRTL ? 'لا ينتهي' : 'Never'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={role.is_active ? 'default' : 'secondary'}>
                              {role.is_active ? 
                                (isRTL ? 'نشط' : 'Active') : 
                                (isRTL ? 'غير نشط' : 'Inactive')
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              {isRTL ? 'إدارة' : 'Manage'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Hierarchy Tab */}
        <TabsContent value="role-hierarchy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {isRTL ? 'هيكل الأدوار والصلاحيات' : 'Role Hierarchy & Capabilities'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'عرض التسلسل الهرمي للأدوار وقدراتها'
                  : 'View role hierarchy and assignment capabilities'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hierarchyLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {roleHierarchy?.map((role, index) => (
                    <div key={role.role} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-lg">
                            Level {role.level}
                          </div>
                          {getRoleBadge(role.role)}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {role.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {isRTL ? 'يمكن تعيين' : 'Can Assign'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {role.can_assign?.map((assignableRole) => (
                              <Badge key={assignableRole} variant="outline" className="text-xs">
                                {assignableRole}
                              </Badge>
                            )) || (
                              <span className="text-muted-foreground text-sm">
                                {isRTL ? 'لا توجد صلاحيات تعيين' : 'No assignment permissions'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            {isRTL ? 'يتطلب موافقة لـ' : 'Requires Approval For'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {role.requires_approval_for?.map((approvalRole) => (
                              <Badge key={approvalRole} variant="secondary" className="text-xs">
                                {approvalRole}
                              </Badge>
                            )) || (
                              <span className="text-muted-foreground text-sm">
                                {isRTL ? 'لا توجد أدوار تتطلب موافقة' : 'No approval required'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Matrix Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? 'مصفوفة الصلاحيات' : 'Permissions Matrix'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'عرض تفصيلي لصلاحيات كل دور'
                  : 'Detailed view of role-based permissions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {matrixLoading ? (
                <div className="animate-pulse">
                  <div className="h-64 bg-muted rounded-lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-32">{isRTL ? 'الدور' : 'Role'}</TableHead>
                        <TableHead>{isRTL ? 'الأمان' : 'Security'}</TableHead>
                        <TableHead>{isRTL ? 'التحديات' : 'Challenges'}</TableHead>
                        <TableHead>{isRTL ? 'الأفكار' : 'Ideas'}</TableHead>
                        <TableHead>{isRTL ? 'الفعاليات' : 'Events'}</TableHead>
                        <TableHead>{isRTL ? 'الملفات' : 'Files'}</TableHead>
                        <TableHead>{isRTL ? 'التحليلات' : 'Analytics'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissionMatrix?.map((matrix) => (
                        <TableRow key={matrix.role}>
                          <TableCell>
                            {getRoleBadge(matrix.role)}
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.security_audit_log} />
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.challenges} />
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.ideas} />
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.events} />
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.files} />
                          </TableCell>
                          <TableCell>
                            <PermissionCell permissions={matrix.permissions.analytics} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'مراجعة طلب الدور' : 'Review Role Request'}
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? 'قم بمراجعة طلب تعيين الدور وإضافة ملاحظات'
                : 'Review the role assignment request and add notes'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{isRTL ? 'المستخدم المستهدف' : 'Target User'}</Label>
                  <div className="text-sm font-medium">
                    {selectedRequest.target_user?.display_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedRequest.target_user?.email}
                  </div>
                </div>
                <div>
                  <Label>{isRTL ? 'الدور المطلوب' : 'Requested Role'}</Label>
                  <div className="mt-1">
                    {getRoleBadge(selectedRequest.requested_role)}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>{isRTL ? 'المبرر' : 'Justification'}</Label>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {selectedRequest.justification || (isRTL ? 'لا يوجد مبرر' : 'No justification')}
                </div>
              </div>
              
              <div>
                <Label htmlFor="reviewNotes">
                  {isRTL ? 'ملاحظات المراجعة' : 'Review Notes'}
                </Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={isRTL 
                    ? 'أضف ملاحظات حول قرارك...'
                    : 'Add notes about your decision...'
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
              disabled={isApproving}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleApproveRequest(false)}
              disabled={isApproving}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'رفض' : 'Reject'}
            </Button>
            <Button
              onClick={() => handleApproveRequest(true)}
              disabled={isApproving}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'موافقة' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageWrapper>
  );
};

// Helper component for permission display
const PermissionCell: React.FC<{
  permissions: { read: boolean; write: boolean; delete: boolean; admin: boolean };
}> = ({ permissions }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getPermissionLevel = () => {
    if (permissions.admin) return { level: 'Admin', color: 'destructive' };
    if (permissions.delete) return { level: 'Full', color: 'default' };
    if (permissions.write) return { level: 'Write', color: 'secondary' };
    if (permissions.read) return { level: 'Read', color: 'outline' };
    return { level: 'None', color: 'outline' };
  };

  const { level, color } = getPermissionLevel();
  
  return (
    <Badge variant={color as any} className="text-xs">
      {isRTL ? {
        'Admin': 'إدارة',
        'Full': 'كامل',
        'Write': 'كتابة',
        'Read': 'قراءة',
        'None': 'بلا'
      }[level] : level}
    </Badge>
  );
};

}