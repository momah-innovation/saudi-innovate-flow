import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Clock, Search, UserCheck, MessageSquare, Eye, User, Shield, Calendar, Mail, Building, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getInitials, useSystemSettings } from '@/hooks/useSystemSettings';
import { useSystemLists } from '@/hooks/useSystemLists';
import { ExpertProfileView } from '@/components/experts/ExpertProfileCard';

interface RoleRequest {
  id: string;
  requester_id: string;
  requested_role: string;
  current_roles: string[];
  reason: string;
  justification: string;
  status: string;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_notes?: string;
  requester?: {
    name: string;
    name_ar?: string;
    email: string;
    phone?: string;
    department?: string;
    position?: string;
    bio?: string;
    profile_image_url?: string;
    created_at: string;
  };
  reviewer?: {
    name: string;
  };
}

export default function RoleRequestManagement() {
  const { toast } = useToast();
  const { uiInitialsMaxLength } = useSystemSettings();
  const { roleRequestStatusOptions } = useSystemLists();
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // System settings
  const [justificationPreviewLength, setJustificationPreviewLength] = useState(50);

  useEffect(() => {
    fetchRoleRequests();
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'role_justification_preview_length')
        .maybeSingle();

      if (error) throw error;

      const value = data ? 
        (typeof data.setting_value === 'string' ? parseInt(data.setting_value) : 
         typeof data.setting_value === 'number' ? data.setting_value : 50) : 50;
      setJustificationPreviewLength(value);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      setJustificationPreviewLength(50);
    }
  };

  const fetchRoleRequests = async () => {
    try {
      setLoading(true);

      // Fetch role requests with requester profiles
      const { data: requestsData, error: requestsError } = await supabase
        .from('role_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;

      if (!requestsData || requestsData.length === 0) {
        setRoleRequests([]);
        return;
      }

      // Get requester profiles
      const requesterIds = [...new Set(requestsData.map(req => req.requester_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, name_ar, email, phone, department, position, bio, profile_image_url, created_at')
        .in('id', requesterIds);

      if (profilesError) throw profilesError;

      // Get reviewer profiles for reviewed requests
      const reviewerIds = [...new Set(requestsData.filter(req => req.reviewed_by).map(req => req.reviewed_by))];
      let reviewerProfilesData = [];
      if (reviewerIds.length > 0) {
        const { data: reviewers, error: reviewersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', reviewerIds);
        
        if (!reviewersError) {
          reviewerProfilesData = reviewers || [];
        }
      }

      // Combine data
      const requestsWithProfiles = requestsData.map(request => ({
        ...request,
        requester: profilesData?.find(p => p.id === request.requester_id),
        reviewer: reviewerProfilesData?.find(p => p.id === request.reviewed_by)
      }));

      setRoleRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error fetching role requests:', error);
      toast({
        title: "Error",
        description: "Failed to load role requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = (request: RoleRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleViewDetails = (request: RoleRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };


  const submitReview = async () => {
    if (!selectedRequest) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update the role request status
      const { error: updateError } = await supabase
        .from('role_requests')
        .update({
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          reviewer_notes: reviewNotes || null
        })
        .eq('id', selectedRequest.id);

      if (updateError) throw updateError;

      // If approved, assign the role to the user
      if (reviewAction === 'approve') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: selectedRequest.requester_id,
            role: selectedRequest.requested_role as any,
            is_active: true,
            granted_by: user.id
          });

        if (roleError) throw roleError;
      }

      toast({
        title: "Request Reviewed",
        description: `Role request has been ${reviewAction}d successfully.`,
      });

      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      fetchRoleRequests();
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast({
        title: "Error",
        description: "Failed to review the request.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredRequests = roleRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesRole = roleFilter === 'all' || request.requested_role === roleFilter;
    const matchesSearch = !searchTerm || 
      request.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesRole && matchesSearch;
  });

  const uniqueRoles = [...new Set(roleRequests.map(req => req.requested_role))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading role requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Role Request Management</h2>
        <p className="text-muted-foreground">
          Review and approve role requests from users
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search</Label>
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
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {roleRequestStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requested Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roleRequests.filter(req => req.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roleRequests.filter(req => req.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roleRequests.filter(req => req.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Role Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Current Roles</TableHead>
                <TableHead>Requested Role</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded-md transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.requester?.profile_image_url} alt={request.requester?.name} />
                          <AvatarFallback className="text-xs">
                            {getInitials(request.requester?.name || '', uiInitialsMaxLength)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-primary hover:underline">{request.requester?.name}</div>
                          <div className="text-sm text-muted-foreground">{request.requester?.email}</div>
                          {request.requester?.department && (
                            <div className="text-xs text-muted-foreground">{request.requester.department}</div>
                          )}
                        </div>
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {request.current_roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {request.requested_role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm">{request.reason.replace('_', ' ')}</div>
                      {request.justification && (
                        <div className="text-xs text-muted-foreground truncate">
                          {request.justification.substring(0, justificationPreviewLength)}...
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.requested_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'approve')}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReviewRequest(request, 'reject')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {request.status !== 'pending' && request.reviewer && (
                        <div className="text-xs text-muted-foreground">
                          Reviewed by {request.reviewer.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Role Request
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {selectedRequest.requester?.name} is requesting the {selectedRequest.requested_role.replace('_', ' ')} role.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Justification</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {selectedRequest.justification}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review Notes</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision (optional)..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  variant={reviewAction === 'approve' ? 'default' : 'destructive'}
                >
                  {reviewAction === 'approve' ? 'Approve Request' : 'Reject Request'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Role Request Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of the user profile and role request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* User Profile Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Requester Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedRequest.requester?.profile_image_url} alt={selectedRequest.requester?.name} />
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedRequest.requester?.name || '', uiInitialsMaxLength)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedRequest.requester?.name}</h3>
                        {selectedRequest.requester?.name_ar && (
                          <p className="text-muted-foreground">{selectedRequest.requester.name_ar}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedRequest.requester?.email}</span>
                        </div>
                        {selectedRequest.requester?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedRequest.requester.phone}</span>
                          </div>
                        )}
                        {selectedRequest.requester?.department && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedRequest.requester.department}</span>
                          </div>
                        )}
                        {selectedRequest.requester?.position && (
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedRequest.requester.position}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Member since {new Date(selectedRequest.requester?.created_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>

                      {selectedRequest.requester?.bio && (
                        <div>
                          <h4 className="font-medium mb-1">Bio</h4>
                          <p className="text-sm text-muted-foreground">{selectedRequest.requester.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Roles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Current Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.current_roles && selectedRequest.current_roles.length > 0 ? (
                      selectedRequest.current_roles.map((role) => (
                        <Badge key={role} variant="outline">
                          {role.replace('_', ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No additional roles assigned (default: innovator)</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Role Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Requested Role</Label>
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-sm">
                          {selectedRequest.requested_role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Status</Label>
                      <div className="mt-1">
                        <Badge variant={getStatusColor(selectedRequest.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(selectedRequest.status)}
                          {selectedRequest.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Request Date</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(selectedRequest.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Reason</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedRequest.reason.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="font-medium">Justification</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.justification}</p>
                    </div>
                  </div>

                  {selectedRequest.status !== 'pending' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Review Information</Label>
                          <Badge variant={getStatusColor(selectedRequest.status)}>
                            {selectedRequest.status}
                          </Badge>
                        </div>
                        {selectedRequest.reviewed_at && (
                          <p className="text-sm text-muted-foreground">
                            Reviewed on {new Date(selectedRequest.reviewed_at).toLocaleString()}
                            {selectedRequest.reviewer && ` by ${selectedRequest.reviewer.name}`}
                          </p>
                        )}
                        {selectedRequest.reviewer_notes && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-sm">{selectedRequest.reviewer_notes}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Expert Profile Section - Show if requesting domain_expert role */}
              {selectedRequest.requested_role === 'domain_expert' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expert Profile</CardTitle>
                    <CardDescription>
                      Additional expert information for domain expert role
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExpertProfileView userId={selectedRequest.requester_id} />
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      handleReviewRequest(selectedRequest, 'reject');
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      handleReviewRequest(selectedRequest, 'approve');
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}