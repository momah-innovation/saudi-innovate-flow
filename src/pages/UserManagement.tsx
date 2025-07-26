import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Users, Shield, Plus, Search, Edit, Trash2, UserCheck, UserPlus } from 'lucide-react';
import RoleRequestManagement from '@/components/admin/RoleRequestManagement';
import { UserInvitationDialog } from '@/components/admin/UserInvitationDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from '@/hooks/useSystemLists';

interface Profile {
  id: string;
  email: string;
  name: string;
  name_ar?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  status: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const { userStatusOptions, availableUserRoles } = useSystemLists();
  const [users, setUsers] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  
  // Dialog states
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isManageRolesDialogOpen, setIsManageRolesDialogOpen] = useState(false);
  const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    name_ar: '',
    phone: '',
    department: '',
    position: '',
    bio: '',
    status: ''
  });
  const [selectedRole, setSelectedRole] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Role Assignment Filters
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roleStatusFilter, setRoleStatusFilter] = useState('all');
  const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedRoleAssignment, setSelectedRoleAssignment] = useState<UserRole | null>(null);
  const [assignRoleForm, setAssignRoleForm] = useState({
    userId: '',
    role: '',
    expiresAt: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchUserRoles()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      name_ar: user.name_ar || '',
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || '',
      bio: user.bio || '',
      status: user.status
    });
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "User Updated",
        description: "User profile has been successfully updated.",
      });

      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile.",
        variant: "destructive",
      });
    }
  };

  const handleManageRoles = (user: Profile) => {
    setSelectedUser(user);
    setIsManageRolesDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role: selectedRole as any, // Cast to match the enum type
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Role Assigned",
        description: `Role ${selectedRole} has been assigned to ${selectedUser.name}.`,
      });

      setSelectedRole('');
      fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Role Revoked",
        description: "Role has been successfully revoked.",
      });

      fetchUserRoles();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        title: "Error",
        description: "Failed to revoke role.",
        variant: "destructive",
      });
    }
  };

  const handleEditRoleAssignment = (role: UserRole) => {
    setSelectedRoleAssignment(role);
    setAssignRoleForm({
      userId: role.user_id,
      role: role.role,
      expiresAt: role.expires_at ? new Date(role.expires_at).toISOString().split('T')[0] : ''
    });
    setIsEditRoleDialogOpen(true);
  };

  const handleAssignNewRole = async () => {
    if (!assignRoleForm.userId || !assignRoleForm.role) return;

    try {
      const insertData: any = {
        user_id: assignRoleForm.userId,
        role: assignRoleForm.role,
        is_active: true
      };

      if (assignRoleForm.expiresAt) {
        insertData.expires_at = assignRoleForm.expiresAt;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Role Assigned",
        description: "Role has been successfully assigned.",
      });

      setIsAssignRoleDialogOpen(false);
      setAssignRoleForm({ userId: '', role: '', expiresAt: '' });
      fetchUserRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoleAssignment = async () => {
    if (!selectedRoleAssignment) return;

    try {
      const updateData: any = {
        role: assignRoleForm.role
      };

      if (assignRoleForm.expiresAt) {
        updateData.expires_at = assignRoleForm.expiresAt;
      } else {
        updateData.expires_at = null;
      }

      const { error } = await supabase
        .from('user_roles')
        .update(updateData)
        .eq('id', selectedRoleAssignment.id);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "Role assignment has been successfully updated.",
      });

      setIsEditRoleDialogOpen(false);
      setSelectedRoleAssignment(null);
      fetchUserRoles();
    } catch (error) {
      console.error('Error updating role assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update role assignment.",
        variant: "destructive",
      });
    }
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(role => role.user_id === userId && role.is_active);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(users.map(user => user.department).filter(Boolean))];

  const filteredRoles = userRoles.filter(role => {
    const user = users.find(u => u.id === role.user_id);
    const matchesSearch = !roleSearchTerm || 
      user?.name?.toLowerCase().includes(roleSearchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || role.role === roleFilter;
    const matchesStatus = roleStatusFilter === 'all' || 
      (roleStatusFilter === 'active' ? role.is_active : !role.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setIsInviteUserDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Role Assignments</TabsTrigger>
          <TabsTrigger value="requests">Role Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {userStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <button 
                          onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {user.name}
                        </button>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.position || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getUserRoles(user.id).map((role) => (
                            <Badge key={role.id} variant={getRoleColor(role.role)}>
                              {role.role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageRoles(user)}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {/* Role Assignment Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by user name..."
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Filter by Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {availableUserRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={roleStatusFilter} onValueChange={setRoleStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => setIsAssignRoleDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Role
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Assignments ({filteredRoles.length})</CardTitle>
              <CardDescription>
                Manage user roles and permissions across the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Granted Date</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => {
                    const user = users.find(u => u.id === role.user_id);
                    return (
                      <TableRow key={role.id}>
                        <TableCell>{user?.name || 'Unknown User'}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleColor(role.role)}>
                            {role.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.is_active ? 'default' : 'secondary'}>
                            {role.is_active ? 'Active' : 'Revoked'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(role.granted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {role.expires_at ? new Date(role.expires_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {role.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRoleAssignment(role)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {role.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeRole(role.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Invitations</CardTitle>
              <CardDescription>
                Manage pending and sent user invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Invitation management coming soon</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsInviteUserDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send New Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RoleRequestManagement />
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user information and account details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Arabic)</Label>
                <Input
                  value={editForm.name_ar}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name_ar: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={editForm.position}
                  onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Update User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Roles Dialog */}
      <Dialog open={isManageRolesDialogOpen} onOpenChange={setIsManageRolesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              {selectedUser ? `Assign roles to ${selectedUser.name}` : 'Assign roles to user'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assign New Role</Label>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    {availableUserRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAssignRole} disabled={!selectedRole}>
                  Assign
                </Button>
              </div>
            </div>
            
            {selectedUser && (
              <div className="space-y-2">
                <Label>Current Roles</Label>
                <div className="space-y-2">
                  {getUserRoles(selectedUser.id).map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                      <Badge variant={getRoleColor(role.role)}>
                        {role.role}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {getUserRoles(selectedUser.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No roles assigned</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* User Invitation Dialog */}
      <UserInvitationDialog
        open={isInviteUserDialogOpen}
        onOpenChange={setIsInviteUserDialogOpen}
        onInvitationSent={() => {
          // Refresh data or handle invitation sent
          console.log('Invitation sent successfully');
        }}
      />

      {/* Assign Role Dialog */}
      <Dialog open={isAssignRoleDialogOpen} onOpenChange={setIsAssignRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to a user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={assignRoleForm.userId} onValueChange={(value) => setAssignRoleForm(prev => ({ ...prev, userId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={assignRoleForm.role} onValueChange={(value) => setAssignRoleForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  {availableUserRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="date"
                value={assignRoleForm.expiresAt}
                onChange={(e) => setAssignRoleForm(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAssignRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignNewRole} disabled={!assignRoleForm.userId || !assignRoleForm.role}>
                Assign Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Assignment Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role Assignment</DialogTitle>
            <DialogDescription>
              Modify role assignment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Input 
                value={users.find(u => u.id === assignRoleForm.userId)?.name || 'Unknown User'} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={assignRoleForm.role} onValueChange={(value) => setAssignRoleForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  {availableUserRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={assignRoleForm.expiresAt}
                onChange={(e) => setAssignRoleForm(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRoleAssignment}>
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}