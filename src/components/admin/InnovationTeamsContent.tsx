import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { useTranslation } from '@/hooks/useAppTranslation';
import { TeamMemberWizard } from './TeamMemberWizard';
import { CoreTeamCard, CoreTeamMemberData, CoreTeamCardAction } from '@/components/ui/core-team-card';
import { CoreTeamDetailDialog } from '@/components/ui/core-team-detail-dialog';

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [coreTeamData, setCoreTeamData] = useState({
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
    try {
      setLoading(true);

      // Fetch core innovation team members - first get team members
      const { data: members, error: membersError } = await supabase
        .from('innovation_team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      // Then fetch profiles for each member
      let enrichedMembers = [];
      if (members && members.length > 0) {
        const userIds = members.map(member => member.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, name_ar, email, profile_image_url, department, position')
          .in('id', userIds);

        if (profilesError) {
          // Continue without profiles if they fail to load
          // Note: Profile data will be incomplete but core functionality preserved
        }

        // Fetch team assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('team_assignments')
          .select('*')
          .in('team_member_id', members.map(m => m.id));

        if (assignmentsError) {
          // Continue without assignments if they fail to load
        }

        // Enrich members with profile data and assignments
        enrichedMembers = members.map(member => ({
          ...member,
          profiles: profiles?.find(profile => profile.id === member.user_id) || {
            name: 'مستخدم غير معروف',
            email: member.contact_email || 'غير محدد'
          },
          team_assignments: assignments?.filter(a => a.team_member_id === member.id) || []
        }));
      }

      // Calculate metrics
      const totalMembers = enrichedMembers?.length || 0;
      const activeMembers = enrichedMembers?.filter(m => m.status === 'active')?.length || 0;
      const totalWorkload = enrichedMembers?.reduce((sum, m) => sum + (m.current_workload || 0), 0) || 0;
      const avgWorkload = totalMembers > 0 ? Math.round(totalWorkload / totalMembers) : 0;
      const totalAssignments = enrichedMembers?.reduce((sum, m) => sum + (m.team_assignments?.length || 0), 0) || 0;

      setCoreTeamData({
        members: enrichedMembers || [],
        metrics: {
          totalMembers,
          activeMembers,
          avgWorkload,
          totalAssignments
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات فريق الابتكار الأساسي.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    onAddDialogChange(true);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('innovation_team_members')
        .update({ status: 'inactive' })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم إزالة عضو الفريق بنجاح.",
      });

      fetchCoreTeamData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "خطأ",
        description: "فشل في إزالة عضو الفريق.",
        variant: "destructive",
      });
    }
  };

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setShowDetailDialog(true);
  };

  const renderMemberCard = (member: any) => {
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
      activeAssignments: member.team_assignments?.filter((a: any) => a.status === 'active')?.length || 0,
      completedAssignments: member.team_assignments?.filter((a: any) => a.status === 'completed')?.length || 0,
      
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
      
      ...member // Include any additional fields
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
              .filter((member: any) => 
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

  if (loading) {
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
        editingMember={editingMember}
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
          activeAssignments: selectedMember.team_assignments?.filter((a: any) => a.status === 'active')?.length || 0,
          completedAssignments: selectedMember.team_assignments?.filter((a: any) => a.status === 'completed')?.length || 0,
          
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
          
          ...selectedMember
        } : null}
        onEdit={() => {
          setShowDetailDialog(false);
          handleEditMember(selectedMember);
        }}
      />
    </div>
  );
}