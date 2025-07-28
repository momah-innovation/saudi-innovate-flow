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
  Target,
  Filter,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from '@/hooks/useSystemLists';

// System settings hook
const useSystemSettings = () => {
  const [systemSettings, setSystemSettings] = useState({
    maxConcurrentProjects: 5,
    performanceRatingMin: 0,
    performanceRatingMax: 5,
    performanceRatingStep: 0.1,
    teamInsightsDisplayLimit: 10,
    insightTitlePreviewLength: 50
  });
  
  useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'team_max_concurrent_projects_per_member',
            'team_min_performance_rating', 
            'team_max_performance_rating',
            'team_performance_rating_step',
            'team_insights_display_limit',
            'team_insight_title_preview_length'
          ]);
        
        if (data) {
          const settings = { ...systemSettings };
          data.forEach(setting => {
            const value = typeof setting.setting_value === 'string' 
              ? JSON.parse(setting.setting_value) 
              : setting.setting_value;
              
            switch (setting.setting_key) {
              case 'team_max_concurrent_projects_per_member':
                settings.maxConcurrentProjects = parseInt(value) || 5;
                break;
              case 'team_min_performance_rating':
                settings.performanceRatingMin = parseInt(value) || 0;
                break;
              case 'team_max_performance_rating':
                settings.performanceRatingMax = parseInt(value) || 5;
                break;
              case 'team_performance_rating_step':
                settings.performanceRatingStep = parseFloat(value) || 0.1;
                break;
              case 'team_insights_display_limit':
                settings.teamInsightsDisplayLimit = parseInt(value) || 10;
                break;
              case 'team_insight_title_preview_length':
                settings.insightTitlePreviewLength = parseInt(value) || 50;
                break;
            }
          });
          setSystemSettings(settings);
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    };
    
    loadSystemSettings();
  }, []);
  
  return systemSettings;
};

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

interface TeamManagementContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function TeamManagementContent({ 
  activeTab, 
  onTabChange, 
  searchTerm, 
  showAddDialog, 
  onAddDialogChange 
}: TeamManagementContentProps) {
  const { toast } = useToast();
  const { teamRoleOptions, teamSpecializationOptions } = useSystemLists();
  const systemSettings = useSystemSettings();
  const [teamMembers, setTeamMembers] = useState<InnovationTeamMember[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
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
  const [roleFilter, setRoleFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  
  // System settings
  const [capacityWarningThreshold, setCapacityWarningThreshold] = useState(90);
  const [performanceRatingMin, setPerformanceRatingMin] = useState(0);
  const [performanceRatingMax, setPerformanceRatingMax] = useState(5);
  const [maxConcurrentProjects, setMaxConcurrentProjects] = useState(20);
  const [insights, setInsights] = useState<any[]>([]);

  // Load system settings
  useEffect(() => {
    const loadSystemSettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'team_capacity_warning_threshold',
            'team_performance_rating_min',
            'team_performance_rating_max',
            'team_max_concurrent_projects'
          ]);
        
        if (data) {
          data.forEach(setting => {
            if (setting.setting_key === 'team_capacity_warning_threshold') {
              setCapacityWarningThreshold(parseInt(String(setting.setting_value)) || 90);
            } else if (setting.setting_key === 'team_performance_rating_min') {
              setPerformanceRatingMin(parseInt(String(setting.setting_value)) || 0);
            } else if (setting.setting_key === 'team_performance_rating_max') {
              setPerformanceRatingMax(parseInt(String(setting.setting_value)) || 5);
            } else if (setting.setting_key === 'team_max_concurrent_projects') {
              setMaxConcurrentProjects(parseInt(String(setting.setting_value)) || 20);
            }
          });
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    };
    
    loadSystemSettings();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh assignments when team members change
  useEffect(() => {
    if (teamMembers.length > 0) {
      fetchAssignments();
    }
  }, [teamMembers]);

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
      const { data: teamData, error: teamError } = await supabase
        .from('innovation_team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamError) throw teamError;

      if (teamData && teamData.length > 0) {
        const userIds = teamData.map(member => member.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, name_ar, email, department, position')
          .in('id', userIds);

        if (profilesError) throw profilesError;

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
      const [campaigns, events, implementations, trendReports, insights] = await Promise.all([
        supabase.from('campaigns').select('id, title_ar, status, start_date, end_date, campaign_manager_id').not('campaign_manager_id', 'is', null),
        supabase.from('events').select('id, title_ar, status, event_date, event_manager_id').not('event_manager_id', 'is', null),
        supabase.from('implementation_tracker').select('id, challenge_id, implementation_stage, project_manager_id, implementation_owner_id').not('project_manager_id', 'is', null),
        supabase.from('trend_reports').select('id, title, created_at, created_by').not('created_by', 'is', null),
        supabase.from('insights').select('id, insight_text_ar, created_at, extracted_by').not('extracted_by', 'is', null)
      ]);

      const allAssignments: Assignment[] = [];

      campaigns.data?.forEach(campaign => {
        allAssignments.push({
          id: campaign.id,
          type: 'campaign',
          title: campaign.title_ar,
          status: campaign.status,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          user_id: campaign.campaign_manager_id
        });
      });

      events.data?.forEach(event => {
        allAssignments.push({
          id: event.id,
          type: 'event',
          title: event.title_ar,
          status: event.status,
          start_date: event.event_date,
          user_id: event.event_manager_id
        });
      });

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

      insights.data?.forEach(insight => {
        allAssignments.push({
          id: insight.id,
          type: 'analysis',
          title: insight.insight_text_ar.substring(0, systemSettings.insightTitlePreviewLength) + '...',
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
        title: "تم إضافة عضو الفريق",
        description: "تم إضافة عضو الفريق الجديد بنجاح.",
      });

      onAddDialogChange(false);
      resetMemberForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة عضو الفريق.",
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
        title: "تم تحديث عضو الفريق",
        description: "تم تحديث عضو الفريق بنجاح.",
      });

      setIsEditMemberDialogOpen(false);
      setSelectedMember(null);
      resetMemberForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث عضو الفريق.",
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
        title: "تم حذف عضو الفريق",
        description: "تم حذف عضو الفريق بنجاح.",
      });

      fetchTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف عضو الفريق.",
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
    if (percentage >= capacityWarningThreshold) return 'destructive';
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

  const roleOptions = teamRoleOptions;
  const specializationOptions = teamSpecializationOptions;

  const allSpecializations = [...new Set([
    ...specializationOptions,
    ...teamMembers.flatMap(m => m.specialization || [])
  ])];
  const allRoles = [...new Set([
    ...roleOptions,
    ...teamMembers.map(m => m.cic_role)
  ])];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل بيانات الفريق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="members">أعضاء الفريق</TabsTrigger>
          <TabsTrigger value="assignments">المهام</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات الفريق</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeamMembers.map((member) => {
              const memberAssignments = getAssignmentsForMember(member.user_id);
              const capacityPercentage = (member.current_workload / member.max_concurrent_projects) * 100;
              
              return (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{member.profiles?.name}</CardTitle>
                        <CardDescription>{member.cic_role}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>سعة العمل</span>
                        <span>{member.current_workload}/{member.max_concurrent_projects}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            capacityPercentage >= capacityWarningThreshold 
                              ? 'bg-red-500' 
                              : capacityPercentage >= 75 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {member.specialization?.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div>الأداء: {member.performance_rating}/5</div>
                      <div>المهام الحالية: {memberAssignments.length}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مهام الفريق</CardTitle>
              <CardDescription>جميع المهام المخصصة لأعضاء فريق الابتكار</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المهمة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المسؤول</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ البداية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => {
                    const member = teamMembers.find(m => m.user_id === assignment.user_id);
                    const TypeIcon = getTypeIcon(assignment.type);
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(assignment.type) as any} className="gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {assignment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{member?.profiles?.name || 'غير محدد'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{assignment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {assignment.start_date ? new Date(assignment.start_date).toLocaleDateString('ar-SA') : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي أعضاء الفريق</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المهام النشطة</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignments.filter(a => a.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">متوسط الأداء</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamMembers.length > 0 
                    ? (teamMembers.reduce((sum, member) => sum + member.performance_rating, 0) / teamMembers.length).toFixed(1)
                    : '0'
                  }/5
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={onAddDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة عضو فريق جديد</DialogTitle>
            <DialogDescription>
              إضافة عضو جديد إلى فريق الابتكار الأساسي
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>البحث عن مستخدم</Label>
              <Input
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
              {userSearchTerm && (
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 cursor-pointer hover:bg-muted ${
                        memberForm.user_id === user.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setMemberForm(prev => ({ ...prev, user_id: user.id }));
                        setUserSearchTerm(user.name);
                      }}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>الدور في فريق الابتكار</Label>
              <Select
                value={memberForm.cic_role}
                onValueChange={(value) => setMemberForm(prev => ({ ...prev, cic_role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>التخصصات</Label>
              <div className="flex flex-wrap gap-2">
                {specializationOptions.map((spec) => (
                  <Badge
                    key={spec}
                    variant={memberForm.specialization.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setMemberForm(prev => ({
                        ...prev,
                        specialization: prev.specialization.includes(spec)
                          ? prev.specialization.filter(s => s !== spec)
                          : [...prev.specialization, spec]
                      }));
                    }}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الحد الأقصى للمشاريع المتزامنة</Label>
                <Input
                  type="number"
                  value={memberForm.max_concurrent_projects}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, max_concurrent_projects: parseInt(e.target.value) || 5 }))}
                  min="1"
                  max={systemSettings.maxConcurrentProjects}
                />
              </div>
              <div className="space-y-2">
                <Label>تقييم الأداء</Label>
                <Input
                  type="number"
                  value={memberForm.performance_rating}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, performance_rating: parseFloat(e.target.value) || 0 }))}
                  min={systemSettings.performanceRatingMin}
                  max={systemSettings.performanceRatingMax}
                  step={systemSettings.performanceRatingStep.toString()}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onAddDialogChange(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddMember}>
                إضافة عضو
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل عضو الفريق</DialogTitle>
            <DialogDescription>
              تعديل معلومات عضو فريق الابتكار
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>الدور في فريق الابتكار</Label>
              <Select
                value={memberForm.cic_role}
                onValueChange={(value) => setMemberForm(prev => ({ ...prev, cic_role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>التخصصات</Label>
              <div className="flex flex-wrap gap-2">
                {specializationOptions.map((spec) => (
                  <Badge
                    key={spec}
                    variant={memberForm.specialization.includes(spec) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setMemberForm(prev => ({
                        ...prev,
                        specialization: prev.specialization.includes(spec)
                          ? prev.specialization.filter(s => s !== spec)
                          : [...prev.specialization, spec]
                      }));
                    }}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الحد الأقصى للمشاريع المتزامنة</Label>
                <Input
                  type="number"
                  value={memberForm.max_concurrent_projects}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, max_concurrent_projects: parseInt(e.target.value) || 5 }))}
                  min="1"
                  max={systemSettings.maxConcurrentProjects}
                />
              </div>
              <div className="space-y-2">
                <Label>تقييم الأداء</Label>
                <Input
                  type="number"
                  value={memberForm.performance_rating}
                  onChange={(e) => setMemberForm(prev => ({ ...prev, performance_rating: parseFloat(e.target.value) || 0 }))}
                  min={systemSettings.performanceRatingMin}
                  max={systemSettings.performanceRatingMax}
                  step={systemSettings.performanceRatingStep.toString()}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateMember}>
                تحديث العضو
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}