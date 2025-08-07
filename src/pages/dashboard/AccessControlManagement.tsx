import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { AppShell } from '@/components/layout/AppShell';
import { Pencil, Trash2, Plus, Shield, History, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AccessControl {
  id: string;
  role: AppRole;
  resource_type: string;
  resource_name: string;
  access_level: string;
  conditions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: string;
  action_type: string;
  old_values: any;
  new_values: any;
  changed_by: string;
  change_reason: string;
  created_at: string;
}

export default function AccessControlManagement() {
  // Use database-driven access levels and resource types  
  const { getSettingValue } = useSettingsManager();
  const ACCESS_LEVELS = getSettingValue('access_control_levels', ['none', 'read', 'write', 'admin']) as string[];
  const RESOURCE_TYPES = getSettingValue('access_control_resource_types', ['page', 'feature', 'action']) as string[];

  const ROLES: AppRole[] = [
    'super_admin', 'admin', 'sector_lead', 'department_head', 'domain_expert',
    'evaluator', 'innovator', 'viewer', 'user_manager', 'role_manager',
    'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor',
    'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager',
    'partnership_manager', 'team_lead', 'project_manager', 'research_lead',
    'innovation_manager', 'external_expert', 'mentor', 'judge', 'facilitator'
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<AccessControl | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [controlToDelete, setControlToDelete] = useState<string | null>(null);
  
  const [newControl, setNewControl] = useState<{
    role: AppRole | '';
    resource_type: string;
    resource_name: string;
    access_level: string;
  }>({
    role: '',
    resource_type: 'page',
    resource_name: '',
    access_level: 'read'
  });

  const queryClient = useQueryClient();

  // Fetch access controls
  const { data: accessControls, isLoading } = useQuery({
    queryKey: ['access-controls', searchTerm, selectedRole],
    queryFn: async () => {
      let query = supabase
        .from('role_access_controls')
        .select('*')
        .order('role', { ascending: true })
        .order('resource_type', { ascending: true });

      if (searchTerm) {
        query = query.or(`resource_name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`);
      }
      
      if (selectedRole) {
        query = query.eq('role', selectedRole as AppRole);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AccessControl[];
    }
  });

  // Fetch audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['access-control-audit'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('access_control_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as AuditLog[];
    }
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: async (control: {
      role: AppRole;
      resource_type: string;
      resource_name: string;
      access_level: string;
    }) => {
      if (editingControl) {
        const { error } = await supabase
          .from('role_access_controls')
          .update(control)
          .eq('id', editingControl.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_access_controls')
          .insert(control);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-controls'] });
      queryClient.invalidateQueries({ queryKey: ['access-control-audit'] });
      setIsCreateDialogOpen(false);
      setEditingControl(null);
      setNewControl({ role: '', resource_type: 'page', resource_name: '', access_level: 'read' });
      toast.success(editingControl ? 'تم تحديث صلاحية الوصول' : 'تم إنشاء صلاحية الوصول');
    },
    onError: (error: any) => {
      toast.error('خطأ في حفظ صلاحية الوصول: ' + error.message);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('role_access_controls')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-controls'] });
      queryClient.invalidateQueries({ queryKey: ['access-control-audit'] });
      setDeleteConfirmOpen(false);
      setControlToDelete(null);
      toast.success('تم حذف صلاحية الوصول');
    },
    onError: (error: any) => {
      toast.error('خطأ في حذف صلاحية الوصول: ' + error.message);
    }
  });

  const handleSubmit = () => {
    if (!newControl.role || !newControl.resource_name) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    createMutation.mutate({
      role: newControl.role as AppRole,
      resource_type: newControl.resource_type,
      resource_name: newControl.resource_name,
      access_level: newControl.access_level
    });
  };

  const handleEdit = (control: AccessControl) => {
    setEditingControl(control);
    setNewControl({
      role: control.role,
      resource_type: control.resource_type,
      resource_name: control.resource_name,
      access_level: control.access_level
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setControlToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'write': return 'bg-warning text-warning-foreground';
      case 'read': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">إدارة صلاحيات الوصول</h1>
            <p className="text-muted-foreground mt-2">
              إدارة صلاحيات الوصول للأدوار المختلفة في النظام
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة صلاحية جديدة
          </Button>
        </div>

        <Tabs defaultValue="access-controls" className="w-full">
          <TabsList>
            <TabsTrigger value="access-controls" className="gap-2">
              <Shield className="h-4 w-4" />
              صلاحيات الوصول
            </TabsTrigger>
            <TabsTrigger value="audit-log" className="gap-2">
              <History className="h-4 w-4" />
              سجل التدقيق
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access-controls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">البحث</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="البحث في أسماء الموارد أو الأدوار..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-48">
                    <Label htmlFor="role-filter">تصفية حسب الدور</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole as (value: string) => void}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الأدوار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">جميع الأدوار</SelectItem>
                        {ROLES.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صلاحيات الوصول</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">جاري التحميل...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الدور</TableHead>
                        <TableHead>نوع المورد</TableHead>
                        <TableHead>اسم المورد</TableHead>
                        <TableHead>مستوى الوصول</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessControls?.map((control) => (
                        <TableRow key={control.id}>
                          <TableCell className="font-medium">{control.role}</TableCell>
                          <TableCell>{control.resource_type}</TableCell>
                          <TableCell>{control.resource_name}</TableCell>
                          <TableCell>
                            <Badge className={getAccessLevelColor(control.access_level)}>
                              {control.access_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={control.is_active ? "default" : "secondary"}>
                              {control.is_active ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(control)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(control.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-log">
            <Card>
              <CardHeader>
                <CardTitle>سجل تدقيق صلاحيات الوصول</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نوع الإجراء</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المعرف</TableHead>
                      <TableHead>السبب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant={
                            log.action_type === 'CREATE' ? 'default' :
                            log.action_type === 'UPDATE' ? 'secondary' : 'destructive'
                          }>
                            {log.action_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString('ar-SA')}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.changed_by}
                        </TableCell>
                        <TableCell>{log.change_reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingControl ? 'تعديل صلاحية الوصول' : 'إضافة صلاحية وصول جديدة'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">الدور</Label>
                <Select 
                  value={newControl.role} 
                  onValueChange={(value: AppRole) => setNewControl(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resource_type">نوع المورد</Label>
                <Select 
                  value={newControl.resource_type} 
                  onValueChange={(value) => setNewControl(prev => ({ ...prev, resource_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resource_name">اسم المورد</Label>
                <Input
                  id="resource_name"
                  value={newControl.resource_name}
                  onChange={(e) => setNewControl(prev => ({ ...prev, resource_name: e.target.value }))}
                  placeholder="مثل: /dashboard/users"
                />
              </div>

              <div>
                <Label htmlFor="access_level">مستوى الوصول</Label>
                <Select 
                  value={newControl.access_level} 
                  onValueChange={(value) => setNewControl(prev => ({ ...prev, access_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف هذه الصلاحية؟ هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => controlToDelete && deleteMutation.mutate(controlToDelete)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'جاري الحذف...' : 'حذف'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}