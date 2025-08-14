import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  UserCheck
} from 'lucide-react';
import { useUserRoles, useRoleManagement } from '@/hooks/admin/useRoleManagement';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

interface BulkRoleManagerProps {
  className?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  currentRole: string;
}


const BulkRoleManager: React.FC<BulkRoleManagerProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: userRoles, isLoading } = useUserRoles({});
  const { assignRole, revokeRole, isAssigning, isRevoking } = useRoleManagement();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with their current roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email, name_ar')
        .limit(50);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('is_active', true);

      const usersData = profiles?.map(profile => ({
        id: profile.id,
        name: profile.name || profile.name_ar || 'Unknown User',
        email: profile.email || 'No email',
        currentRole: roleData?.find(r => r.user_id === profile.id)?.role || 'user'
      })) || [];

      setUsers(usersData);
    } catch (error) {
      debugLog.error('Error loading users:', { component: 'BulkRoleManager' }, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkRoleAssignment = async () => {
    if (!selectedRole || selectedUsers.length === 0) return;

    try {
      for (const userId of selectedUsers) {
        await assignRole.mutateAsync({
          targetUserId: userId,
          role: selectedRole as any,
          justification: 'تعيين جماعي للأدوار'
        });
      }
      setSelectedUsers([]);
      setSelectedRole('');
    } catch (error) {
      debugLog.error('Error in bulk role assignment:', { component: 'BulkRoleManager' }, error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'user_manager': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'moderator': return 'مشرف';
      case 'user_manager': return 'مدير مستخدمين';
      case 'user': return 'مستخدم';
      default: return role;
    }
  };

  if (isLoading || loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            إدارة الأدوار الجماعية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            إدارة الأدوار الجماعية
          </div>
          <Badge variant="outline">
            {selectedUsers.length} محدد
          </Badge>
        </CardTitle>
        
        {/* Bulk Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">مستخدم</SelectItem>
              <SelectItem value="moderator">مشرف</SelectItem>
              <SelectItem value="user_manager">مدير مستخدمين</SelectItem>
              <SelectItem value="admin">مدير</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleBulkRoleAssignment}
            disabled={!selectedRole || selectedUsers.length === 0 || isAssigning}
            className="whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            تعيين الأدوار
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-border"
                  />
                </TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>الدور الحالي</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <Shield className="w-8 h-8 mx-auto mb-2" />
                    لا توجد مستخدمين
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                        className="rounded border-border"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.currentRole)}>
                        {getRoleLabel(user.currentRole)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                تم تحديد {selectedUsers.length} مستخدم للمعالجة الجماعية
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                إلغاء التحديد
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkRoleManager;