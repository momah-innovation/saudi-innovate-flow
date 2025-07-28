import { useState, useEffect } from 'react';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { ManagementCard } from '@/components/ui/management-card';
import { MetricCard } from '@/components/ui/metric-card';
import { ActionMenu, getViewEditDeleteActions } from '@/components/ui/action-menu';
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
  Eye,
  Clock,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSystemLists } from '@/hooks/useSystemLists';
import { useTranslation } from '@/hooks/useTranslation';

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
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function TeamManagementContent({ 
  activeTab, 
  onTabChange, 
  viewMode,
  searchTerm, 
  showAddDialog, 
  onAddDialogChange 
}: TeamManagementContentProps) {
  const { toast } = useToast();
  const { teamRoleOptions, teamSpecializationOptions } = useSystemLists();
  const systemSettings = useSystemSettings();
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<InnovationTeamMember[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalHours: 0,
    avgPerformance: 0,
    capacityUtilization: 0,
    recentActivities: [] as Array<{
      id: string,
      member_name: string,
      activity_type: string,
      description: string,
      hours_spent: number,
      activity_date: string
    }>,
    performanceMetrics: [] as Array<{
      member_id: string,
      member_name: string,
      total_assignments: number,
      completed_assignments: number,
      avg_quality_rating: number,
      total_hours: number
    }>
  });
  
  // Dialog states
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isMemberDetailDialogOpen, setIsMemberDetailDialogOpen] = useState(false);
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
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');
  
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
      fetchAnalyticsData();
    }
  }, [teamMembers]);

  // Fetch analytics data when active tab changes to analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab]);

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

  const fetchAnalyticsData = async () => {
    try {
      // Fetch analytics data from the new analytics tables
      const [
        teamAssignmentsData,
        teamActivitiesData,
        teamPerformanceData,
        teamCapacityData
      ] = await Promise.all([
        supabase.from('team_assignments').select(`
          id, team_member_id, assignment_type, status, workload_percentage,
          actual_hours, estimated_hours, due_date, completion_date,
          innovation_team_members(id, user_id, profiles(name, name_ar))
        `),
        supabase.from('team_activities').select(`
          id, team_member_id, activity_type, activity_description,
          hours_spent, activity_date, quality_rating,
          innovation_team_members(profiles(name, name_ar))
        `).order('activity_date', { ascending: false }).limit(20),
        supabase.from('team_performance_metrics').select(`
          team_member_id, overall_performance_score, assignments_completed,
          total_hours_worked, average_quality_rating,
          innovation_team_members(profiles(name, name_ar))
        `).order('created_at', { ascending: false }),
        supabase.from('team_capacity_history').select(`
          team_member_id, utilization_percentage, week_start_date,
          innovation_team_members(profiles(name, name_ar))
        `).gte('week_start_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Process and update analytics data
      const totalHours = teamActivitiesData.data?.reduce((sum, activity) => sum + (activity.hours_spent || 0), 0) || 0;
      const avgPerformance = teamPerformanceData.data?.length 
        ? teamPerformanceData.data.reduce((sum, perf) => sum + (perf.overall_performance_score || 0), 0) / teamPerformanceData.data.length
        : 0;
      const avgCapacity = teamCapacityData.data?.length
        ? teamCapacityData.data.reduce((sum, cap) => sum + (cap.utilization_percentage || 0), 0) / teamCapacityData.data.length
        : 0;

      const recentActivities = teamActivitiesData.data?.map(activity => ({
        id: activity.id,
        member_name: (activity.innovation_team_members as any)?.profiles?.name || 'غير محدد',
        activity_type: activity.activity_type,
        description: activity.activity_description,
        hours_spent: activity.hours_spent || 0,
        activity_date: activity.activity_date
      })) || [];

      const performanceMetrics = teamPerformanceData.data?.map(perf => ({
        member_id: perf.team_member_id,
        member_name: (perf.innovation_team_members as any)?.profiles?.name || 'غير محدد',
        total_assignments: perf.assignments_completed || 0,
        completed_assignments: perf.assignments_completed || 0,
        avg_quality_rating: perf.average_quality_rating || 0,
        total_hours: perf.total_hours_worked || 0
      })) || [];

      setAnalyticsData({
        totalHours,
        avgPerformance,
        capacityUtilization: avgCapacity,
        recentActivities,
        performanceMetrics
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
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

  const handleViewAssignment = (assignment: Assignment) => {
    // Navigate to assignment details based on type
    const baseUrl = '/admin';
    switch (assignment.type) {
      case 'campaign':
        window.open(`${baseUrl}/campaigns`, '_blank');
        break;
      case 'event':
        window.open(`${baseUrl}/events`, '_blank');
        break;
      case 'project':
        window.open(`${baseUrl}/implementation`, '_blank');
        break;
      default:
        console.log('View assignment:', assignment);
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    // Navigate to edit assignment based on type
    console.log('Edit assignment:', assignment);
  };

  const handleMemberClick = (member: InnovationTeamMember) => {
    setSelectedMember(member);
    setIsMemberDetailDialogOpen(true);
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

  const filteredAssignments = assignments.filter(assignment => {
    const member = teamMembers.find(m => m.user_id === assignment.user_id);
    const matchesSearch = !assignmentSearchTerm || 
      assignment.title?.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      assignment.type?.toLowerCase().includes(assignmentSearchTerm.toLowerCase()) ||
      member?.profiles?.name?.toLowerCase().includes(assignmentSearchTerm.toLowerCase());
    
    return matchesSearch;
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
          <ViewLayouts viewMode={viewMode}>
            {filteredTeamMembers.map((member) => {
              const memberAssignments = getAssignmentsForMember(member.user_id);
              const capacityPercentage = (member.current_workload / member.max_concurrent_projects) * 100;
              
              const badges = [
                {
                  label: member.cic_role,
                  variant: 'default' as const
                },
                {
                  label: `${member.current_workload}/${member.max_concurrent_projects}`,
                  variant: getCapacityColor(member.current_workload, member.max_concurrent_projects) as any
                }
              ];

              const metadata = [
                {
                  icon: <Users className="w-4 h-4" />,
                  label: t('department'),
                  value: member.profiles?.department || t('notSpecified')
                },
                {
                  icon: <Target className="w-4 h-4" />,
                  label: t('performance'),
                  value: `${member.performance_rating}/5`
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: t('assignments'),
                  value: `${memberAssignments.length} ${t('tasks')}`
                }
              ];

              const actions = [
                {
                  type: 'edit' as const,
                  label: t('edit'),
                  onClick: () => handleEditMember(member)
                },
                {
                  type: 'delete' as const,
                  label: t('delete'),
                  onClick: () => handleRemoveMember(member.id)
                }
              ];

              return (
                <ManagementCard
                  key={member.id}
                  id={member.id}
                  title={member.profiles?.name || t('nameNotSpecified')}
                  subtitle={member.profiles?.email || ''}
                  badges={badges}
                  metadata={metadata}
                  actions={actions}
                  viewMode={viewMode}
                  onClick={() => handleMemberClick(member)}
                />
              );
            })}
          </ViewLayouts>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>مهام الفريق</CardTitle>
                  <CardDescription>جميع المهام المخصصة لأعضاء فريق الابتكار</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث في المهام..."
                      value={assignmentSearchTerm}
                      onChange={(e) => setAssignmentSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
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
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    const member = teamMembers.find(m => m.user_id === assignment.user_id);
                    const TypeIcon = getTypeIcon(assignment.type);
                    
                    return (
                      <TableRow 
                        key={assignment.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewAssignment(assignment)}
                      >
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
                        <TableCell>
                          <ActionMenu
                            actions={getViewEditDeleteActions(
                              () => handleViewAssignment(assignment),
                              () => handleEditAssignment(assignment),
                              () => console.log('Delete assignment:', assignment)
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="إجمالي أعضاء الفريق"
              value={teamMembers.length.toString()}
              icon={<Users className="h-4 w-4" />}
              trend={{
                value: 12,
                label: "من الشهر الماضي",
                direction: "up"
              }}
            />
            
            <MetricCard
              title="ساعات العمل هذا الشهر"
              value={analyticsData.totalHours.toString()}
              subtitle="ساعة"
              icon={<Clock className="h-4 w-4" />}
              trend={{
                value: Math.round(analyticsData.totalHours * 0.15),
                label: "من الشهر الماضي",
                direction: "up"
              }}
            />
            
            <MetricCard
              title="متوسط الأداء الشامل"
              value={analyticsData.avgPerformance > 0 
                ? `${analyticsData.avgPerformance.toFixed(1)}/5`
                : '0/5'
              }
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{
                value: 0.3,
                label: "من الشهر الماضي",
                direction: "up"
              }}
            />

            <MetricCard
              title="معدل استخدام القدرة"
              value={`${analyticsData.capacityUtilization.toFixed(1)}%`}
              subtitle="متوسط الاستخدام"
              icon={<Activity className="h-4 w-4" />}
              trend={{
                value: Math.round(analyticsData.capacityUtilization * 0.1),
                label: "من الشهر الماضي",
                direction: analyticsData.capacityUtilization > 75 ? "up" : "down"
              }}
            />
          </div>

          {/* Detailed Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Team Capacity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  تحليل قدرة الفريق
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => {
                  const capacityPercentage = (member.current_workload / member.max_concurrent_projects) * 100;
                  const memberAssignments = assignments.filter(a => a.user_id === member.user_id);
                  
                  return (
                    <div key={member.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{member.profiles?.name}</span>
                        <span className="text-muted-foreground">
                          {member.current_workload}/{member.max_concurrent_projects} ({Math.round(capacityPercentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            capacityPercentage >= 90 ? 'bg-destructive' : 
                            capacityPercentage >= 75 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {memberAssignments.length} مهمة نشطة
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  توزيع الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = teamMembers.filter(m => Math.floor(m.performance_rating) === rating).length;
                    const percentage = teamMembers.length > 0 ? (count / teamMembers.length) * 100 : 0;
                    
                    return (
                      <div key={rating} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {rating} نجوم
                            {rating >= 4 && <Award className="h-3 w-3 text-yellow-500" />}
                            {rating <= 2 && <AlertTriangle className="h-3 w-3 text-red-500" />}
                          </span>
                          <span className="text-muted-foreground">{count} أعضاء</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Assignment Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  توزيع أنواع المهام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['campaign', 'event', 'project', 'content', 'analysis'].map((type) => {
                    const count = assignments.filter(a => a.type === type).length;
                    const percentage = assignments.length > 0 ? (count / assignments.length) * 100 : 0;
                    const TypeIcon = getTypeIcon(type);
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <TypeIcon className="h-3 w-3" />
                            {type}
                          </span>
                          <span className="text-muted-foreground">{count} مهمة</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Real Data from Analytics Tables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.recentActivities.length > 0 ? (
                    analyticsData.recentActivities.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{activity.description}</p>
                          <p className="text-muted-foreground text-xs">
                            {activity.member_name} • {activity.activity_type}
                          </p>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-medium">{activity.hours_spent} س</span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.activity_date).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">لا توجد أنشطة مسجلة حتى الآن</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        سيتم عرض أنشطة الفريق هنا عند توفرها
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary - New Analytics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  ملخص الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.performanceMetrics.length > 0 ? (
                    analyticsData.performanceMetrics.slice(0, 5).map((metric) => (
                      <div key={metric.member_id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{metric.member_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {metric.completed_assignments} مهمة مكتملة • {metric.total_hours}ساعة
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {metric.avg_quality_rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">/5</span>
                          </div>
                          <div className="w-16 bg-secondary rounded-full h-1 mt-1">
                            <div 
                              className="h-1 rounded-full bg-primary"
                              style={{ width: `${(metric.avg_quality_rating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <BarChart3 className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">لا توجد بيانات أداء متاحة</p>
                    </div>
                  )}
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

      {/* Member Detail Dialog */}
      <Dialog open={isMemberDetailDialogOpen} onOpenChange={setIsMemberDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('teamMemberDetails')}
            </DialogTitle>
            <DialogDescription>
              {selectedMember?.profiles?.name || t('memberProfile')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('basicInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('name')}:</span>
                      <span className="font-medium">{selectedMember.profiles?.name || t('notSpecified')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('email')}:</span>
                      <span className="font-medium">{selectedMember.profiles?.email || t('notSpecified')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('department')}:</span>
                      <span className="font-medium">{selectedMember.profiles?.department || t('notSpecified')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('position')}:</span>
                      <span className="font-medium">{selectedMember.profiles?.position || t('notSpecified')}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('roleInTeam')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('role')}:</span>
                      <Badge variant="default">{selectedMember.cic_role}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('joinDate')}:</span>
                      <span className="font-medium">
                        {new Date(selectedMember.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('memberStatus')}:</span>
                      <Badge variant="secondary">{t('active')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specializations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('specializations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.specialization?.length > 0 ? (
                      selectedMember.specialization.map((spec) => (
                        <Badge key={spec} variant="outline">{spec}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">{t('noDataAvailable')}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance & Capacity */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('performanceRating')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold">
                        {selectedMember.performance_rating.toFixed(1)}/5
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(selectedMember.performance_rating / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('currentWorkload')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('currentLoad')}:</span>
                        <span className="font-medium">
                          {selectedMember.current_workload}/{selectedMember.max_concurrent_projects}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            (selectedMember.current_workload / selectedMember.max_concurrent_projects) * 100 >= 90 
                              ? 'bg-destructive' 
                              : (selectedMember.current_workload / selectedMember.max_concurrent_projects) * 100 >= 75 
                                ? 'bg-yellow-500' 
                                : 'bg-primary'
                          }`}
                          style={{ 
                            width: `${Math.min((selectedMember.current_workload / selectedMember.max_concurrent_projects) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round((selectedMember.current_workload / selectedMember.max_concurrent_projects) * 100)}% {t('capacityUtilization')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Current Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('currentAssignments')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getAssignmentsForMember(selectedMember.user_id).length > 0 ? (
                      getAssignmentsForMember(selectedMember.user_id).map((assignment) => {
                        const TypeIcon = getTypeIcon(assignment.type);
                        return (
                          <div key={assignment.id} className="flex items-center gap-3 p-2 border rounded-md">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{assignment.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.type} • {assignment.status}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {assignment.status}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">{t('noActiveAssignments')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsMemberDetailDialogOpen(false)}>
                  {t('close')}
                </Button>
                <Button onClick={() => {
                  setIsMemberDetailDialogOpen(false);
                  handleEditMember(selectedMember);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('editMember')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}