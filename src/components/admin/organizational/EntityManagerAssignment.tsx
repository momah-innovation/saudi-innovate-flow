import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Plus, UserPlus, X, Search } from 'lucide-react';
import type { 
  SystemSector, 
  Entity, 
  Deputy, 
  Department, 
  Domain, 
  SubDomain, 
  Service,
  EntityManagerRole
} from '@/types/organization';

interface EntityManagerAssignmentProps {
  sectors: SystemSector[];
  entities: Entity[];
  deputies: Deputy[];
  departments: Department[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
  onRefresh: () => void;
}

interface Assignment {
  id: string;
  manager_id: string;
  entity_type: string;
  entity_id: string;
  role: EntityManagerRole;
  is_active: boolean;
  assigned_at: string;
  entity_name?: string;
  manager_email?: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name_ar?: string;
  display_name?: string;
}

export function EntityManagerAssignment({ 
  sectors, 
  entities, 
  deputies, 
  departments, 
  domains, 
  subDomains, 
  services, 
  onRefresh 
}: EntityManagerAssignmentProps) {
  const { isRTL, language } = useDirection();
  const { toast } = useToast();
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assignmentForm, setAssignmentForm] = useState({
    manager_id: '',
    entity_type: '',
    entity_id: '',
    role: '' as EntityManagerRole
  });

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('entity_manager_assignments')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      // Enrich with entity names
      const enrichedAssignments = (data || []).map(assignment => ({
        ...assignment,
        entity_name: getEntityName(assignment.entity_type, assignment.entity_id)
      }));
      
      setAssignments(enrichedAssignments);
    } catch (error) {
      logger.error('Failed to fetch assignments', {}, error as Error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name_ar, display_name')
        .limit(100);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      logger.error('Failed to fetch users', {}, error as Error);
    }
  };

  const getEntityName = (entityType: string, entityId: string) => {
    switch (entityType) {
      case 'sector':
        return sectors.find(s => s.id === entityId)?.name || 'Unknown Sector';
      case 'entity':
        return entities.find(e => e.id === entityId)?.name_ar || 'Unknown Entity';
      case 'deputy':
        return deputies.find(d => d.id === entityId)?.name || 'Unknown Deputy';
      case 'department':
        return departments.find(d => d.id === entityId)?.name || 'Unknown Department';
      case 'domain':
        return domains.find(d => d.id === entityId)?.name || 'Unknown Domain';
      case 'sub_domain':
        return subDomains.find(sd => sd.id === entityId)?.name || 'Unknown Sub Domain';
      case 'service':
        return services.find(s => s.id === entityId)?.name || 'Unknown Service';
      default:
        return 'Unknown';
    }
  };

  const getEntitiesForType = (entityType: string) => {
    switch (entityType) {
      case 'sector':
        return sectors.map(s => ({ id: s.id, name: s.name }));
      case 'entity':
        return entities.map(e => ({ id: e.id, name: e.name_ar }));
      case 'deputy':
        return deputies.map(d => ({ id: d.id, name: d.name }));
      case 'department':
        return departments.map(d => ({ id: d.id, name: d.name }));
      case 'domain':
        return domains.map(d => ({ id: d.id, name: d.name }));
      case 'sub_domain':
        return subDomains.map(sd => ({ id: sd.id, name: sd.name }));
      case 'service':
        return services.map(s => ({ id: s.id, name: s.name }));
      default:
        return [];
    }
  };

  const entityTypes = [
    { value: 'entity', label: isRTL ? 'جهة' : 'Entity', role: 'entity_manager' as EntityManagerRole },
    { value: 'deputy', label: isRTL ? 'نائب' : 'Deputy', role: 'deputy_manager' as EntityManagerRole },
    { value: 'department', label: isRTL ? 'إدارة' : 'Department', role: 'department_head' as EntityManagerRole },
    { value: 'domain', label: isRTL ? 'نطاق' : 'Domain', role: 'domain_manager' as EntityManagerRole },
    { value: 'sub_domain', label: isRTL ? 'نطاق فرعي' : 'Sub Domain', role: 'sub_domain_manager' as EntityManagerRole },
    { value: 'service', label: isRTL ? 'خدمة' : 'Service', role: 'service_manager' as EntityManagerRole }
  ];

  const getRoleLabel = (role: EntityManagerRole) => {
    const labels = {
      entity_manager: isRTL ? 'مدير جهة' : 'Entity Manager',
      deputy_manager: isRTL ? 'مدير نائب' : 'Deputy Manager',
      department_head: isRTL ? 'رئيس إدارة' : 'Department Head',
      domain_manager: isRTL ? 'مدير نطاق' : 'Domain Manager',
      sub_domain_manager: isRTL ? 'مدير نطاق فرعي' : 'Sub Domain Manager',
      service_manager: isRTL ? 'مدير خدمة' : 'Service Manager'
    };
    return labels[role] || role;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      sector: isRTL ? 'قطاع' : 'Sector',
      entity: isRTL ? 'جهة' : 'Entity',
      deputy: isRTL ? 'نائب' : 'Deputy',
      department: isRTL ? 'إدارة' : 'Department',
      domain: isRTL ? 'نطاق' : 'Domain',
      sub_domain: isRTL ? 'نطاق فرعي' : 'Sub Domain',
      service: isRTL ? 'خدمة' : 'Service'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleAssign = async () => {
    if (!assignmentForm.manager_id || !assignmentForm.entity_type || !assignmentForm.entity_id) {
      toast({
        title: 'Error',
        description: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedType = entityTypes.find(t => t.value === assignmentForm.entity_type);
      const role = selectedType?.role || assignmentForm.role;

      const { error } = await supabase
        .from('entity_manager_assignments')
        .insert({
          manager_id: assignmentForm.manager_id,
          entity_type: assignmentForm.entity_type,
          entity_id: assignmentForm.entity_id,
          role: role,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: isRTL ? 'تم التكليف' : 'Assigned',
        description: isRTL ? 'تم تكليف المدير بنجاح' : 'Manager assigned successfully'
      });

      setShowAssignDialog(false);
      setAssignmentForm({
        manager_id: '',
        entity_type: '',
        entity_id: '',
        role: '' as EntityManagerRole
      });
      
      fetchAssignments();
      onRefresh();
    } catch (error) {
      logger.error('Failed to assign manager', { assignmentForm }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to assign manager',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('entity_manager_assignments')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الإلغاء' : 'Removed',
        description: isRTL ? 'تم إلغاء التكليف بنجاح' : 'Assignment removed successfully'
      });

      fetchAssignments();
      onRefresh();
    } catch (error) {
      logger.error('Failed to remove assignment', { assignmentId }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to remove assignment',
        variant: 'destructive'
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => 
    assignment.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.manager_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? 'البحث في التكليفات...' : 'Search assignments...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pl-3 rtl:pr-10"
          />
        </div>
        
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              {isRTL ? 'تكليف مدير' : 'Assign Manager'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isRTL ? 'تكليف مدير جديد' : 'Assign New Manager'}
              </DialogTitle>
              <DialogDescription>
                {isRTL ? 'اختر المستخدم والعنصر لتكليف المدير' : 'Select user and entity to assign manager'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>{isRTL ? 'المستخدم' : 'User'}</Label>
                <Select 
                  value={assignmentForm.manager_id} 
                  onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, manager_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر المستخدم' : 'Select user'} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.display_name || user.full_name_ar || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{isRTL ? 'نوع العنصر' : 'Entity Type'}</Label>
                <Select 
                  value={assignmentForm.entity_type} 
                  onValueChange={(value) => setAssignmentForm(prev => ({ 
                    ...prev, 
                    entity_type: value, 
                    entity_id: '' 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر نوع العنصر' : 'Select entity type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {assignmentForm.entity_type && (
                <div>
                  <Label>{isRTL ? 'العنصر' : 'Entity'}</Label>
                  <Select 
                    value={assignmentForm.entity_id} 
                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, entity_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر العنصر' : 'Select entity'} />
                    </SelectTrigger>
                    <SelectContent>
                      {getEntitiesForType(assignmentForm.entity_type).map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleAssign} disabled={loading}>
                  {loading ? (isRTL ? 'جاري التكليف...' : 'Assigning...') : (isRTL ? 'تكليف' : 'Assign')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isRTL ? 'التكليفات الحالية' : 'Current Assignments'}
          </CardTitle>
          <CardDescription>
            {isRTL ? `${filteredAssignments.length} تكليف نشط` : `${filteredAssignments.length} active assignments`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isRTL ? 'المدير' : 'Manager'}</TableHead>
                <TableHead>{isRTL ? 'العنصر' : 'Entity'}</TableHead>
                <TableHead>{isRTL ? 'النوع' : 'Type'}</TableHead>
                <TableHead>{isRTL ? 'الدور' : 'Role'}</TableHead>
                <TableHead>{isRTL ? 'تاريخ التكليف' : 'Assigned Date'}</TableHead>
                <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => {
                const user = users.find(u => u.id === assignment.manager_id);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      {user?.display_name || user?.full_name_ar || user?.email || 'Unknown User'}
                    </TableCell>
                    <TableCell>{assignment.entity_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(assignment.entity_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getRoleLabel(assignment.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assigned_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد تكليفات' : 'No assignments found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}