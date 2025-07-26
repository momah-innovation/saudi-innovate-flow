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
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Zap,
  BarChart3,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InnovationTeamMember {
  id: string;
  user_id: string;
  cic_role: string;
  specialization: string[];
  current_workload: number;
  max_concurrent_projects: number;
  performance_rating: number;
  created_at: string;
  profiles?: {
    name: string;
    name_ar?: string;
    email: string;
    department?: string;
    position?: string;
  };
}

interface Assignment {
  id: string;
  type: 'campaign' | 'event' | 'project' | 'content' | 'analysis';
  title: string;
  status: string;
  start_date?: string;
  end_date?: string;
  user_id: string;
}

export default function TeamManagement() {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<InnovationTeamMember[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  
  // Dialog states
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<InnovationTeamMember | null>(null);
  
  // Form states
  const [memberForm, setMemberForm] = useState({
    user_id: '',
    cic_role: '',
    specialization: [] as string[],
    max_concurrent_projects: 5,
    performance_rating: 0
  });
  
  // User search state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTeamMembers(),
        fetchProfiles(),
        fetchAssignments()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchTeamMembers = async () => {
    try {
      // First get innovation team members
      const { data: teamData, error: teamError } = await supabase
        .from('innovation_team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamError) throw teamError;

      // Then get profiles for those users
      if (teamData && teamData.length > 0) {
        const userIds = teamData.map(member => member.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, name_ar, email, department, position')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combine the data
        const enrichedTeamMembers = teamData.map(member => ({
          ...member,
          profiles: profilesData?.find(profile => profile.id === member.user_id)
        }));

        setTeamMembers(enrichedTeamMembers as any);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, name_ar, email, department, position, status')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      // Fetch various types of assignments for team members
      const [campaigns, events, implementations, trendReports, insights] = await Promise.all([
        supabase.from('campaigns').select('id, title, status, start_date, end_date, campaign_manager_id').not('campaign_manager_id', 'is', null),
        supabase.from('events').select('id, title, status, event_date, event_manager_id').not('event_manager_id', 'is', null),
        supabase.from('implementation_tracker').select('id, challenge_id, implementation_stage, project_manager_id, implementation_owner_id').not('project_manager_id', 'is', null),
        supabase.from('trend_reports').select('id, title, created_at, created_by').not('created_by', 'is', null),
        supabase.from('insights').select('id, insight_text, created_at, extracted_by').not('extracted_by', 'is', null)
      ]);

      const allAssignments: Assignment[] = [];

      // Process campaigns
      campaigns.data?.forEach(campaign => {
        allAssignments.push({
          id: campaign.id,
          type: 'campaign',
          title: campaign.title,
          status: campaign.status,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          user_id: campaign.campaign_manager_id
        });
      });

      // Process events
      events.data?.forEach(event => {
        allAssignments.push({
          id: event.id,
          type: 'event',
          title: event.title,
          status: event.status,
          start_date: event.event_date,
          user_id: event.event_manager_id
        });
      });

      // Process implementation projects
      implementations.data?.forEach(impl => {
        if (impl.project_manager_id) {
          allAssignments.push({
            id: impl.id,
            type: 'project',
            title: `Project - ${impl.implementation_stage}`,
            status: 'active',
            user_id: impl.project_manager_id
          });
        }
        if (impl.implementation_owner_id && impl.implementation_owner_id !== impl.project_manager_id) {
          allAssignments.push({
            id: impl.id + '_owner',
            type: 'project',
            title: `Project Owner - ${impl.implementation_stage}`,
            status: 'active',
            user_id: impl.implementation_owner_id
          });
        }
      });

      // Process trend reports
      trendReports.data?.forEach(report => {
        allAssignments.push({
          id: report.id,
          type: 'content',
          title: report.title,
          status: 'completed',
          start_date: report.created_at,
          user_id: report.created_by
        });
      });

      // Process insights
      insights.data?.forEach(insight => {
        allAssignments.push({
          id: insight.id,
          type: 'analysis',
          title: insight.insight_text.substring(0, 50) + '...',
          status: 'completed',
          start_date: insight.created_at,
          user_id: insight.extracted_by
        });
      });

      setAssignments(allAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAddMember = async () => {
    if (!memberForm.user_id || !memberForm.cic_role) return;

    try {
      const { error } = await supabase
        .from('innovation_team_members')
        .insert({
          user_id: memberForm.user_id,
          cic_role: memberForm.cic_role,
          specialization: memberForm.specialization,
          max_concurrent_projects: memberForm.max_concurrent_projects,
          performance_rating: memberForm.performance_rating,
          current_workload: 0
        });

      if (error) throw error;

      toast({
        title: "Team Member Added",
        description: "New team member has been successfully added.",
      });

      setIsAddMemberDialogOpen(false);
      resetMemberForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member.",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (member: InnovationTeamMember) => {
    setSelectedMember(member);
    setMemberForm({
      user_id: member.user_id,
      cic_role: member.cic_role,
      specialization: member.specialization || [],
      max_concurrent_projects: member.max_concurrent_projects || 5,
      performance_rating: member.performance_rating || 0
    });
    setIsEditMemberDialogOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('innovation_team_members')
        .update({
          cic_role: memberForm.cic_role,
          specialization: memberForm.specialization,
          max_concurrent_projects: memberForm.max_concurrent_projects,
          performance_rating: memberForm.performance_rating
        })
        .eq('id', selectedMember.id);

      if (error) throw error;

      toast({
        title: "Team Member Updated",
        description: "Team member has been successfully updated.",
      });

      setIsEditMemberDialogOpen(false);
      setSelectedMember(null);
      resetMemberForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('innovation_team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Team Member Removed",
        description: "Team member has been successfully removed.",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member.",
        variant: "destructive",
      });
    }
  };

  const resetMemberForm = () => {
    setMemberForm({
      user_id: '',
      cic_role: '',
      specialization: [],
      max_concurrent_projects: 5,
      performance_rating: 0
    });
    setUserSearchTerm('');
  };

  const getAssignmentsForMember = (userId: string) => {
    return assignments.filter(assignment => assignment.user_id === userId);
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'default';
    return 'secondary';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign': return Calendar;
      case 'event': return Award;
      case 'project': return Target;
      case 'content': return FileText;
      case 'analysis': return BarChart3;
      default: return Zap;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'campaign': return 'default';
      case 'event': return 'secondary';
      case 'project': return 'outline';
      case 'content': return 'default';
      case 'analysis': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cic_role?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.cic_role === roleFilter;
    const matchesSpecialization = specializationFilter === 'all' || 
      member.specialization?.includes(specializationFilter);
    
    return matchesSearch && matchesRole && matchesSpecialization;
  });

  const availableUsers = profiles.filter(profile => 
    !teamMembers.some(member => member.user_id === profile.id)
  );

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const roleOptions = [
    'Innovation Manager',
    'Data Analyst', 
    'Content Creator',
    'Project Manager',
    'Research Analyst',
    'Strategy Consultant',
    'Technology Specialist',
    'Campaign Manager',
    'Event Coordinator'
  ];

  const specializationOptions = [
    'Innovation Strategy & Planning',
    'Project Management & Execution', 
    'Research & Market Analysis',
    'Stakeholder Engagement',
    'Change Management',
    'Performance Measurement & KPIs',
    'Content Creation & Communication',
    'Event Management & Coordination',
    'Partnership Development',
    'Training & Development',
    'Process Optimization',
    'Quality Assurance & Evaluation',
    'Data Analytics & Insights',
    'Campaign Management',
    'Innovation Assessment',
    'Technology Integration',
    'Digital Transformation',
    'Innovation Culture Development'
  ];

  const allSpecializations = [...new Set(teamMembers.flatMap(m => m.specialization || []))];
  const allRoles = [...new Set(teamMembers.map(m => m.cic_role))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Innovation Team Management</h1>
          <p className="text-muted-foreground">
            Manage core innovation team members, roles, and assignments
          </p>
        </div>
        <Button onClick={() => setIsAddMemberDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Search Team Members</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {allRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {allSpecializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({filteredTeamMembers.length})</CardTitle>
              <CardDescription>
                Core innovation team members and their current workload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Workload</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.profiles?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.profiles?.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.cic_role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.specialization?.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={getCapacityColor(member.current_workload, member.max_concurrent_projects)}>
                              {member.current_workload}/{member.max_concurrent_projects}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getAssignmentsForMember(member.user_id).length} assignments
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.performance_rating >= 4 ? 'default' : 'secondary'}>
                          {member.performance_rating}/5
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Assignments</CardTitle>
              <CardDescription>
                Current assignments across campaigns, events, projects, and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => {
                  const memberAssignments = getAssignmentsForMember(member.user_id);
                  if (memberAssignments.length === 0) return null;
                  
                  return (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{member.profiles?.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.cic_role}</p>
                        </div>
                        <Badge variant={getCapacityColor(member.current_workload, member.max_concurrent_projects)}>
                          {memberAssignments.length} assignments
                        </Badge>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {memberAssignments.map((assignment) => {
                          const Icon = getTypeIcon(assignment.type);
                          return (
                            <div key={assignment.id} className="flex items-center gap-2 p-2 border rounded">
                              <Icon className="h-4 w-4" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{assignment.title}</div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getTypeColor(assignment.type)} className="text-xs">
                                    {assignment.type}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {assignment.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">Active team members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
                <p className="text-xs text-muted-foreground">Across all types</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Workload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.length > 0 
                    ? (teamMembers.reduce((sum, m) => sum + m.current_workload, 0) / teamMembers.length).toFixed(1)
                    : '0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">Projects per member</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.length > 0 
                    ? (teamMembers.reduce((sum, m) => sum + m.performance_rating, 0) / teamMembers.length).toFixed(1)
                    : '0'
                  }/5
                </div>
                <p className="text-xs text-muted-foreground">Average rating</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to the innovation team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={memberForm.user_id} onValueChange={(value) => setMemberForm(prev => ({ ...prev, user_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {filteredUsers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No users found</div>
                    ) : (
                      filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email} • {user.department}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={memberForm.cic_role} onValueChange={(value) => setMemberForm(prev => ({ ...prev, cic_role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Specialization Areas</Label>
              <div className="grid gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={memberForm.specialization.includes(spec)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMemberForm(prev => ({
                            ...prev,
                            specialization: [...prev.specialization, spec]
                          }));
                        } else {
                          setMemberForm(prev => ({
                            ...prev,
                            specialization: prev.specialization.filter(s => s !== spec)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
              {memberForm.specialization.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {memberForm.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Max Concurrent Projects</Label>
                <Input
                  type="number"
                  value={memberForm.max_concurrent_projects}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, max_concurrent_projects: parseInt(e.target.value) || 5 }))}
                  min="1"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label>Performance Rating</Label>
                <Input
                  type="number"
                  value={memberForm.performance_rating}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, performance_rating: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} disabled={!memberForm.user_id || !memberForm.cic_role}>
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update team member information and performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={memberForm.cic_role} onValueChange={(value) => setMemberForm(prev => ({ ...prev, cic_role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Specialization Areas</Label>
              <div className="grid gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={memberForm.specialization.includes(spec)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMemberForm(prev => ({
                            ...prev,
                            specialization: [...prev.specialization, spec]
                          }));
                        } else {
                          setMemberForm(prev => ({
                            ...prev,
                            specialization: prev.specialization.filter(s => s !== spec)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
              {memberForm.specialization.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {memberForm.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Max Concurrent Projects</Label>
                <Input
                  type="number"
                  value={memberForm.max_concurrent_projects}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, max_concurrent_projects: parseInt(e.target.value) || 5 }))}
                  min="1"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label>Performance Rating</Label>
                <Input
                  type="number"
                  value={memberForm.performance_rating}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, performance_rating: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>
                Update Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}