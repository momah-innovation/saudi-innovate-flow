import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Plus, Search, Users, UserCheck, Target, AlertCircle, CheckCircle2, XCircle, Building, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from '@/hooks/useSystemLists';
import { ExpertProfileDialog } from './ExpertProfileDialog';

interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  expert_level: string;
  availability_status: string;
  profiles?: {
    name: string;
    email: string;
    department?: string;
    position?: string;
    phone?: string;
    bio?: string;
  };
}

interface Challenge {
  id: string;
  title: string;
  status: string;
  priority_level: string;
  estimated_budget: number;
}

interface ChallengeExpert {
  id: string;
  challenge_id: string;
  expert_id: string;
  role_type: string;
  status: string;
  assignment_date: string;
  notes?: string;
  challenges?: Challenge;
  experts?: {
    id: string;
    expertise_areas: string[];
  };
}

export function ExpertAssignmentManagement() {
  const { toast } = useToast();
  const { assignmentStatusOptions, expertRoleTypes } = useSystemLists();
  const [activeTab, setActiveTab] = useState("assignments");
  const [maxWorkload, setMaxWorkload] = useState(5);
  const [profileTextareaRows, setProfileTextareaRows] = useState(4);
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    expertExpertisePreviewLimit: 2
  });
  
  // State management
  const [experts, setExperts] = useState<Expert[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeExperts, setChallengeExperts] = useState<ChallengeExpert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);
  const [isEditAssignmentDialogOpen, setIsEditAssignmentDialogOpen] = useState(false);
  
  // Form states
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [selectedExpert, setSelectedExpert] = useState("");
  const [selectedRole, setSelectedRole] = useState("evaluator");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [editingAssignment, setEditingAssignment] = useState<ChallengeExpert | null>(null);
  
  // Bulk assignment
  const [bulkSelectedChallenges, setBulkSelectedChallenges] = useState<string[]>([]);
  const [bulkSelectedExperts, setBulkSelectedExperts] = useState<string[]>([]);
  
  // Filters
  const [expertFilter, setExpertFilter] = useState("");
  const [challengeFilter, setChallengeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Expert profile dialog
  const [isExpertProfileDialogOpen, setIsExpertProfileDialogOpen] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    loadMaxWorkloadSetting();
  }, []);

  const loadMaxWorkloadSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['team_max_expert_workload', 'expert_profile_textarea_rows', 'expert_expertise_preview_limit']);

      if (error) throw error;
      
      data?.forEach(setting => {
        const value = typeof setting.setting_value === 'string' ? 
          parseInt(setting.setting_value) : 
          typeof setting.setting_value === 'number' ? setting.setting_value : 0;
        
        if (setting.setting_key === 'team_max_expert_workload') {
          setMaxWorkload(value || 5);
        } else if (setting.setting_key === 'expert_profile_textarea_rows') {
          setProfileTextareaRows(value || 4);
        } else if (setting.setting_key === 'expert_expertise_preview_limit') {
          setSystemSettings(prev => ({ ...prev, expertExpertisePreviewLimit: value || 2 }));
        }
      });
    } catch (error) {
      console.error('Error fetching system settings:', error);
      setMaxWorkload(5);
      setProfileTextareaRows(4);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchExperts(),
        fetchChallenges(),
        fetchChallengeExperts()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchExperts = async () => {
    try {
      // Get all experts
      const { data: expertsData, error: expertsError } = await supabase
        .from('experts')
        .select(`
          id,
          user_id,
          expertise_areas,
          experience_years,
          expert_level,
          availability_status
        `)
        .order('id');

      if (expertsError) throw expertsError;

      if (!expertsData || expertsData.length === 0) {
        setExperts([]);
        return;
      }

      // Get profiles for all experts
      const userIds = expertsData.map(expert => expert.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, department, position, phone, bio')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine experts with their profiles
      const expertsWithProfiles = expertsData.map(expert => {
        const profile = (profilesData || []).find(p => p.id === expert.user_id);
        return {
          ...expert,
          profiles: profile ? {
            name: profile.name,
            email: profile.email,
            department: profile.department,
            position: profile.position,
            phone: profile.phone,
            bio: profile.bio
          } : null
        };
      });

      setExperts(expertsWithProfiles);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, status, priority_level, estimated_budget')
        .order('title');

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchChallengeExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_experts')
        .select(`
          id,
          challenge_id,
          expert_id,
          role_type,
          status,
          assignment_date,
          notes,
          challenges:challenge_id (
            id,
            title,
            status,
            priority_level,
            estimated_budget
          ),
          experts:expert_id (
            id,
            expertise_areas
          )
        `)
        .order('assignment_date', { ascending: false });

      if (error) throw error;
      setChallengeExperts(data || []);
    } catch (error) {
      console.error('Error fetching challenge experts:', error);
    }
  };

  const handleAssignExpert = async () => {
    if (!selectedChallenge || !selectedExpert || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please select challenge, expert, and role.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('challenge_experts')
        .insert({
          challenge_id: selectedChallenge,
          expert_id: selectedExpert,
          role_type: selectedRole,
          status: 'active',
          notes: assignmentNotes || null
        });

      if (error) throw error;

      toast({
        title: "Expert Assigned",
        description: "Expert has been successfully assigned to the challenge.",
      });

      setIsAssignDialogOpen(false);
      resetAssignmentForm();
      fetchChallengeExperts();
    } catch (error) {
      console.error('Error assigning expert:', error);
      toast({
        title: "Error",
        description: "Failed to assign expert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAssign = async () => {
    if (bulkSelectedChallenges.length === 0 || bulkSelectedExperts.length === 0) {
      toast({
        title: "Missing Selection",
        description: "Please select at least one challenge and one expert.",
        variant: "destructive",
      });
      return;
    }

    try {
      const assignments = [];
      for (const challengeId of bulkSelectedChallenges) {
        for (const expertId of bulkSelectedExperts) {
          assignments.push({
            challenge_id: challengeId,
            expert_id: expertId,
            role_type: selectedRole,
            status: 'active',
            notes: assignmentNotes || null
          });
        }
      }

      const { error } = await supabase
        .from('challenge_experts')
        .insert(assignments);

      if (error) throw error;

      toast({
        title: "Bulk Assignment Complete",
        description: `Successfully assigned ${bulkSelectedExperts.length} experts to ${bulkSelectedChallenges.length} challenges.`,
      });

      setIsBulkAssignDialogOpen(false);
      resetBulkAssignmentForm();
      fetchChallengeExperts();
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      toast({
        title: "Error",
        description: "Failed to complete bulk assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAssignment = (assignment: ChallengeExpert) => {
    setEditingAssignment(assignment);
    setSelectedRole(assignment.role_type);
    setAssignmentNotes(assignment.notes || "");
    setIsEditAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = async () => {
    if (!editingAssignment) return;

    try {
      const { error } = await supabase
        .from('challenge_experts')
        .update({
          role_type: selectedRole,
          notes: assignmentNotes || null
        })
        .eq('id', editingAssignment.id);

      if (error) throw error;

      toast({
        title: "Assignment Updated",
        description: "Expert assignment has been successfully updated.",
      });

      setIsEditAssignmentDialogOpen(false);
      setEditingAssignment(null);
      resetAssignmentForm();
      fetchChallengeExperts();
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('challenge_experts')
        .update({ status: 'inactive' })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment Removed",
        description: "Expert has been removed from the challenge.",
      });

      fetchChallengeExperts();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAssignmentForm = () => {
    setSelectedChallenge("");
    setSelectedExpert("");
    setSelectedRole("evaluator");
    setAssignmentNotes("");
  };

  const resetBulkAssignmentForm = () => {
    setBulkSelectedChallenges([]);
    setBulkSelectedExperts([]);
    setSelectedRole("evaluator");
    setAssignmentNotes("");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'lead_expert': return 'default';
      case 'evaluator': return 'secondary';
      case 'reviewer': return 'outline';
      case 'subject_matter_expert': return 'default';
      case 'external_consultant': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const getExpertWorkload = (expertId: string) => {
    return challengeExperts.filter(ce => 
      ce.expert_id === expertId && ce.status === 'active'
    ).length;
  };

  const filteredAssignments = challengeExperts.filter(assignment => {
    const expert = assignment.experts;
    const challenge = assignment.challenges;
    
    const matchesExpertFilter = !expertFilter || 
      assignment.expert_id?.toLowerCase().includes(expertFilter.toLowerCase());
    
    const matchesChallengeFilter = !challengeFilter || 
      challenge?.title?.toLowerCase().includes(challengeFilter.toLowerCase());
    
    const matchesRoleFilter = roleFilter === 'all' || assignment.role_type === roleFilter;
    const matchesStatusFilter = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesExpertFilter && matchesChallengeFilter && matchesRoleFilter && matchesStatusFilter;
  });

  const handleViewExpertProfile = (expertId: string) => {
    setSelectedExpertId(expertId);
    setIsExpertProfileDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading expert assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expert Assignment Management</h1>
          <p className="text-muted-foreground">
            Manage expert assignments, roles, and workloads across challenges
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Expert
          </Button>
          <Button variant="outline" onClick={() => setIsBulkAssignDialogOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Bulk Assign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assignments">Expert Assignments</TabsTrigger>
          <TabsTrigger value="workload">Workload Overview</TabsTrigger>
          <TabsTrigger value="availability">Availability Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Search Expert</Label>
                  <Input
                    placeholder="Expert name..."
                    value={expertFilter}
                    onChange={(e) => setExpertFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Search Challenge</Label>
                  <Input
                    placeholder="Challenge title..."
                    value={challengeFilter}
                    onChange={(e) => setChallengeFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {expertRoleTypes.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
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
                      {assignmentStatusOptions.map((status) => (
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

          {/* Assignments List */}
          <div className="grid gap-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-semibold text-lg hover:text-primary"
                          onClick={() => handleViewExpertProfile(assignment.expert_id)}
                        >
                          {(() => {
                            const expert = experts.find(e => e.id === assignment.expert_id);
                            return expert?.profiles?.name || `Expert ${assignment.expert_id}`;
                          })()}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {assignment.challenges?.title}
                      </CardDescription>
                      {/* Expert Details */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        {(() => {
                          const expert = experts.find(e => e.id === assignment.expert_id);
                          return (
                            <>
                              {expert?.profiles?.department && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  <span>{expert.profiles.department}</span>
                                </div>
                              )}
                              {expert?.profiles?.position && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{expert.profiles.position}</span>
                                </div>
                              )}
                              {expert?.expert_level && (
                                <Badge variant="outline" className="text-xs">
                                  {expert.expert_level} level
                                </Badge>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleColor(assignment.role_type)}>
                        {assignment.role_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Assigned: {new Date(assignment.assignment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>Priority: {assignment.challenges?.priority_level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Workload: {getExpertWorkload(assignment.expert_id)} challenges</span>
                      </div>
                    </div>
                    
                    {assignment.notes && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {assignment.notes}
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAssignments.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No expert assignments found matching your filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-4">
          <div className="grid gap-4">
            {experts.map((expert) => {
              const workload = getExpertWorkload(expert.id);
              const workloadPercentage = (workload / maxWorkload) * 100;
              
              return (
                <Card key={expert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{expert.profiles?.name || `Expert ${expert.id}`}</CardTitle>
                        <CardDescription>
                          {expert.expertise_areas?.join(', ')} • {expert.experience_years || 0} years
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{workload}/{maxWorkload}</div>
                        <div className="text-sm text-muted-foreground">Active Challenges</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Workload</span>
                        <span>{workloadPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            workloadPercentage > 80 ? 'bg-destructive' : 
                            workloadPercentage > 60 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {experts.map((expert) => {
              const workload = getExpertWorkload(expert.id);
              const isAvailable = expert.availability_status === 'available';
              const isOverloaded = workload >= maxWorkload;
              
              return (
                <Card key={expert.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{expert.profiles?.name || `Expert ${expert.id}`}</CardTitle>
                        <CardDescription className="text-sm">
                          {expert.expertise_areas?.slice(0, systemSettings.expertExpertisePreviewLimit).join(', ')}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isAvailable && !isOverloaded ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : isOverloaded ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <Badge variant={
                          isAvailable && !isOverloaded ? 'default' : 
                          isOverloaded ? 'destructive' : 'secondary'
                        }>
                          {isAvailable && !isOverloaded ? 'Available' : 
                           isOverloaded ? 'Overloaded' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Load:</span>
                        <span>{workload} challenges</span>
                      </div>
                       <div className="flex justify-between">
                         <span>Capacity:</span>
                         <span>{maxWorkload} max</span>
                       </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span>{expert.experience_years || 0} years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Single Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Expert to Challenge</DialogTitle>
            <DialogDescription>
              Select a challenge and expert to create a new assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Challenge</Label>
              <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select challenge" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Expert</Label>
              <Select value={selectedExpert} onValueChange={setSelectedExpert}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expert" />
                </SelectTrigger>
                <SelectContent>
                  {experts.map((expert) => (
                    <SelectItem key={expert.id} value={expert.id}>
                       <div className="flex items-center gap-2">
                         {expert.profiles?.name || `Expert ${expert.id}`}
                         <span className="text-xs text-muted-foreground">
                           ({getExpertWorkload(expert.id)} challenges)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expertRoleTypes.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Additional notes about this assignment..."
                rows={profileTextareaRows}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignExpert}>
                Assign Expert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Assignment Dialog */}
      <Dialog open={isBulkAssignDialogOpen} onOpenChange={setIsBulkAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Expert Assignment</DialogTitle>
            <DialogDescription>
              Assign multiple experts to multiple challenges at once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Select Challenges</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center space-x-2 p-1">
                      <input
                        type="checkbox"
                        id={`challenge-${challenge.id}`}
                        checked={bulkSelectedChallenges.includes(challenge.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelectedChallenges([...bulkSelectedChallenges, challenge.id]);
                          } else {
                            setBulkSelectedChallenges(bulkSelectedChallenges.filter(id => id !== challenge.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`challenge-${challenge.id}`} className="text-sm flex-1 cursor-pointer">
                        {challenge.title}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bulkSelectedChallenges.length} challenge(s) selected
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Select Experts</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                  {experts.map((expert) => (
                    <div key={expert.id} className="flex items-center space-x-2 p-1">
                      <input
                        type="checkbox"
                        id={`expert-${expert.id}`}
                        checked={bulkSelectedExperts.includes(expert.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelectedExperts([...bulkSelectedExperts, expert.id]);
                          } else {
                            setBulkSelectedExperts(bulkSelectedExperts.filter(id => id !== expert.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`expert-${expert.id}`} className="text-sm flex-1 cursor-pointer">
                        {expert.profiles?.name || `Expert ${expert.id}`} ({getExpertWorkload(expert.id)} challenges)
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bulkSelectedExperts.length} expert(s) selected
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role (Applied to All)</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expertRoleTypes.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Notes applied to all assignments..."
                rows={profileTextareaRows - 1}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBulkAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkAssign}>
                Assign All ({bulkSelectedChallenges.length} × {bulkSelectedExperts.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditAssignmentDialogOpen} onOpenChange={setIsEditAssignmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Expert Assignment</DialogTitle>
            <DialogDescription>
              Update the role and notes for this assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Expert</Label>
              <Input 
                value={`Expert ${editingAssignment?.expert_id}`} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Challenge</Label>
              <Input 
                value={editingAssignment?.challenges?.title || 'Challenge'} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expertRoleTypes.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="Assignment notes..."
                rows={profileTextareaRows}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditAssignmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAssignment}>
                Update Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expert Profile Dialog */}
      <ExpertProfileDialog
        open={isExpertProfileDialogOpen}
        onOpenChange={setIsExpertProfileDialogOpen}
        expertId={selectedExpertId}
      />
    </div>
  );
}