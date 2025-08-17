import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Target, TrendingUp, Settings, 
  Edit, MoreVertical, UserX, Crown,
  Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { TeamMemberWizard } from './TeamMemberWizard';
import { CoreTeamCard, CoreTeamMemberData, CoreTeamCardAction } from '@/components/ui/core-team-card';
import { CoreTeamDetailDialog } from '@/components/ui/core-team-detail-dialog';

interface TeamMember {
  id: string;
  user_id: string;
  status: 'active' | 'inactive' | 'leave' | 'busy';
  cic_role: string;
  specialization: string | string[];
  bio?: string;
  location?: string;
  current_workload?: number;
  capacity?: number;
  efficiency_rating?: number;
  performance_score?: number;
  availability_status?: 'available' | 'busy' | 'unavailable';
  skills?: string[];
  certifications?: string[];
  experience_years?: number;
  ideas_submitted?: number;
  ideas_approved?: number;
  innovation_score?: number;
  collaboration_score?: number;
  join_date?: string;
  last_active?: string;
  created_at: string;
  updated_at: string;
  max_concurrent_projects?: number;
  performance_rating?: number;
  contact_email?: string;
  department?: string;
  profiles?: {
    id: string;
    name?: string;
    name_ar?: string;
    email?: string;
    profile_image_url?: string;
    department?: string;
    position?: string;
    role?: string;
  };
  team_assignments?: TeamAssignment[];
}

interface TeamAssignment {
  id: string;
  team_member_id: string;
  status: string;
  workload_percentage?: number;
}

interface InnovationTeamsContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function InnovationTeamsContent({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  searchTerm,
  showAddDialog,
  onAddDialogChange
}: InnovationTeamsContentProps) {
  const { t } = useUnifiedTranslation();
  const { user } = useAuth();
  
  const loadingManager = useUnifiedLoading({
    component: 'InnovationTeamsContent',
    showToast: true,
    logErrors: true
  });

  const errorHandler = createErrorHandler({
    component: 'InnovationTeamsContent',
    showToast: true,
    logError: true
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [coreTeamData, setCoreTeamData] = useState<{
    members: TeamMember[];
    metrics: {
      totalMembers: number;
      activeMembers: number;
      avgWorkload: number;
      totalAssignments: number;
    };
  }>({
    members: [],
    metrics: {
      totalMembers: 0,
      activeMembers: 0,
      avgWorkload: 0,
      totalAssignments: 0
    }
  });

  useEffect(() => {
    fetchCoreTeamData();
  }, []);

  const fetchCoreTeamData = async () => {
    await loadingManager.withLoading(
      'fetch-core-team-data',
      async () => {
        // Mock data for now - will be replaced with useTeamManagement hook
        const mockMembers = [
          {
            id: '1',
            user_id: 'user-1',
            status: 'active' as const,
            cic_role: 'مطور أول',
            specialization: ['تطوير التطبيقات', 'الذكاء الاصطناعي'],
            bio: 'خبير في تطوير التطبيقات المبتكرة',
            location: 'الرياض',
            current_workload: 75,
            capacity: 100,
            efficiency_rating: 4.8,
            performance_score: 92,
            availability_status: 'available' as const,
            skills: ['React', 'TypeScript', 'AI'],
            certifications: ['AWS Certified', 'React Professional'],
            experience_years: 8,
            ideas_submitted: 15,
            ideas_approved: 12,
            innovation_score: 85,
            collaboration_score: 90,
            join_date: '2023-01-15',
            last_active: '2024-01-16T10:00:00Z',
            created_at: '2023-01-15T09:00:00Z',
            updated_at: '2024-01-16T10:00:00Z',
            max_concurrent_projects: 3,
            performance_rating: 4.8,
            contact_email: 'ahmed@example.com',
            department: 'قسم التكنولوجيا',
            profiles: {
              id: 'user-1',
              name: 'أحمد محمد',
              name_ar: 'أحمد محمد',
              email: 'ahmed@example.com',
              profile_image_url: '',
              department: 'قسم التكنولوجيا',
              position: 'مطور أول',
              role: 'team_member'
            },
            team_assignments: [
              { id: '1', team_member_id: '1', status: 'active', workload_percentage: 40 },
              { id: '2', team_member_id: '1', status: 'active', workload_percentage: 35 }
            ]
          }
        ];

        setCoreTeamData({
          members: mockMembers,
          metrics: {
            totalMembers: mockMembers.length,
            activeMembers: mockMembers.filter(m => m.status === 'active').length,
            avgWorkload: 75,
            totalAssignments: 2
          }
        });
      },
      {
        successMessage: t('innovation_teams.core_team_loaded_success'),
        errorMessage: t('errors.failed_to_load_core_team_data'),
        logContext: { operation: 'fetchCoreTeamData' }
      }
    );
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    onAddDialogChange(true);
  };

  const handleRemoveMember = async (memberId: string) => {
    await loadingManager.withLoading(
      'remove-team-member',
      async () => {
        // Mock removal - will be replaced with useTeamManagement hook
        throw new Error('Team member removal functionality coming soon');
        
        await fetchCoreTeamData();
      },
      {
        successMessage: t('innovation_teams.member_removed_success'),
        errorMessage: t('innovation_teams.member_removal_failed'),
        logContext: { operation: 'handleRemoveMember', memberId }
      }
    );
  };

  const handleViewMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDetailDialog(true);
  };

  const renderMemberCard = (member: TeamMember) => {
    const cardData: CoreTeamMemberData = {
      id: member.id,
      name: member.profiles?.name,
      name_ar: member.profiles?.name_ar,
      email: member.profiles?.email || member.contact_email,
      profile_image_url: member.profiles?.profile_image_url,
      role: member.profiles?.role,
      cic_role: member.cic_role,
      department: member.profiles?.department || member.department,
      position: member.profiles?.position,
      specialization: member.specialization,
      bio: member.bio,
      location: member.location,
      
      // Performance & Workload
      current_workload: member.current_workload,
      capacity: member.capacity,
      efficiency_rating: member.efficiency_rating,
      performance_score: member.performance_score,
      
      // Status & Availability
      status: member.status,
      availability_status: member.availability_status,
      
      // Assignments & Projects
      activeAssignments: member.team_assignments?.filter((a: TeamAssignment) => a.status === 'active')?.length || 0,
      completedAssignments: member.team_assignments?.filter((a: TeamAssignment) => a.status === 'completed')?.length || 0,
      
      // Skills & Experience
      skills: member.skills,
      certifications: member.certifications,
      experience_years: member.experience_years,
      
      // Innovation Metrics
      ideas_submitted: member.ideas_submitted,
      ideas_approved: member.ideas_approved,
      innovation_score: member.innovation_score,
      collaboration_score: member.collaboration_score,
      
      // Timeline
      join_date: member.join_date,
      last_active: member.last_active,
      created_at: member.created_at,
      updated_at: member.updated_at,
      
      // Required fields for CoreTeamMemberData
      max_concurrent_projects: member.max_concurrent_projects || 3,
      performance_rating: member.performance_rating || 4.0
    };

    const actions: CoreTeamCardAction[] = [
      {
        label: t('edit'),
        icon: <Edit className="h-4 w-4 me-2" />,
        onClick: () => handleEditMember(member)
      },
      {
        label: t('remove'),
        icon: <UserX className="h-4 w-4 me-2" />,
        onClick: () => handleRemoveMember(member.id),
        variant: 'destructive'
      }
    ];

    return (
      <CoreTeamCard
        key={member.id}
        data={cardData}
        actions={actions}
        onClick={() => handleViewMember(member)}
        variant={viewMode === 'list' ? 'compact' : 'default'}
        showMetrics={true}
        showStatus={true}
        showWorkload={true}
        showAssignments={true}
      />
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalMembers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coreTeamData.metrics.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeMembers')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coreTeamData.metrics.activeMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgWorkload')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coreTeamData.metrics.avgWorkload}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalAssignments')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coreTeamData.metrics.totalAssignments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Core Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('coreTeamMembers')}
          </CardTitle>
          <CardDescription>
            {t('manageCoreInnovationTeamMembers')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${
            viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-3' :
            viewMode === 'cards' ? 'grid-cols-1 lg:grid-cols-2' :
            'grid-cols-1'
          }`}>
            {coreTeamData.members
              .filter((member: TeamMember) => 
                !searchTerm || 
                member.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.profiles?.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.cic_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (Array.isArray(member.specialization) ? 
                  member.specialization.some((spec: string) => spec.toLowerCase().includes(searchTerm.toLowerCase())) :
                  member.specialization?.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map(renderMemberCard)}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loadingManager.hasAnyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loadingTeamData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="core-team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('coreTeam')}
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('assignments')}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('performance')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="core-team" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('teamAssignments')}</CardTitle>
              <CardDescription>{t('manageTeamAssignmentsAndWorkload')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('assignmentsFeatureComingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('teamPerformance')}</CardTitle>
              <CardDescription>{t('trackTeamPerformanceAndMetrics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('performanceFeatureComingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Member Wizard */}
      <TeamMemberWizard
        open={showAddDialog}
        onOpenChange={(open) => {
          onAddDialogChange(open);
          if (!open) setEditingMember(null);
        }}
        editingMember={editingMember ? { 
          ...editingMember, 
          specialization: Array.isArray(editingMember.specialization) 
            ? editingMember.specialization 
            : editingMember.specialization ? [editingMember.specialization] : [],
          max_concurrent_projects: editingMember.max_concurrent_projects || 3,
          current_workload: editingMember.current_workload || 0,
          performance_rating: editingMember.performance_rating || 4.0
        } : undefined}
        onSuccess={() => {
          fetchCoreTeamData();
          setEditingMember(null);
        }}
      />

      {/* Core Team Detail Dialog */}
      <CoreTeamDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        data={selectedMember ? {
          id: selectedMember.id,
          name: selectedMember.profiles?.name,
          name_ar: selectedMember.profiles?.name_ar,
          email: selectedMember.profiles?.email || selectedMember.contact_email,
          profile_image_url: selectedMember.profiles?.profile_image_url,
          role: selectedMember.profiles?.role,
          cic_role: selectedMember.cic_role,
          department: selectedMember.profiles?.department || selectedMember.department,
          position: selectedMember.profiles?.position,
          specialization: selectedMember.specialization,
          bio: selectedMember.bio,
          location: selectedMember.location,
          
          // Performance & Workload
          current_workload: selectedMember.current_workload,
          capacity: selectedMember.capacity,
          efficiency_rating: selectedMember.efficiency_rating,
          performance_score: selectedMember.performance_score,
          
          // Status & Availability
          status: selectedMember.status,
          availability_status: selectedMember.availability_status,
          
          // Assignments & Projects
          activeAssignments: selectedMember.team_assignments?.filter((a: TeamAssignment) => a.status === 'active')?.length || 0,
          completedAssignments: selectedMember.team_assignments?.filter((a: TeamAssignment) => a.status === 'completed')?.length || 0,
          
          // Skills & Experience
          skills: selectedMember.skills,
          certifications: selectedMember.certifications,
          experience_years: selectedMember.experience_years,
          
          // Innovation Metrics
          ideas_submitted: selectedMember.ideas_submitted,
          ideas_approved: selectedMember.ideas_approved,
          innovation_score: selectedMember.innovation_score,
          collaboration_score: selectedMember.collaboration_score,
          
          // Timeline
          join_date: selectedMember.join_date,
          last_active: selectedMember.last_active,
          created_at: selectedMember.created_at,
          updated_at: selectedMember.updated_at,
          
          // Required fields for CoreTeamMemberData
          max_concurrent_projects: selectedMember.max_concurrent_projects || 3,
          performance_rating: selectedMember.performance_rating || 4.0
        } : null}
        onEdit={() => {
          setShowDetailDialog(false);
          if (selectedMember) handleEditMember(selectedMember);
        }}
      />
    </div>
  );
}