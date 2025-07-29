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
import { useTranslation } from '@/hooks/useTranslation';
import { TeamMemberWizard } from './TeamMemberWizard';
import { ProfileCard, ProfileCardAction, ProfileCardMetric } from '@/components/ui/profile-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          console.warn('Error fetching profiles:', profilesError);
          // Continue without profiles if they fail to load
        }

        // Fetch team assignments
        const { data: assignments, error: assignmentsError } = await supabase
          .from('team_assignments')
          .select('*')
          .in('team_member_id', members.map(m => m.id));

        if (assignmentsError) {
          console.warn('Error fetching assignments:', assignmentsError);
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
      console.error('Error fetching core team data:', error);
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
      console.error('Error removing team member:', error);
      toast({
        title: "خطأ",
        description: "فشل في إزالة عضو الفريق.",
        variant: "destructive",
      });
    }
  };

  const renderMemberCard = (member: any) => {
    const primaryMetrics: ProfileCardMetric[] = [
      {
        label: t('role'),
        value: member.cic_role || 'غير محدد',
        type: 'badge',
        variant: 'outline'
      },
      {
        label: t('status'),
        value: member.status === 'active' ? t('active') : t('inactive'),
        type: 'badge-with-icon',
        variant: member.status === 'active' ? 'default' : 'secondary',
        icon: member.status === 'active' ? CheckCircle : AlertTriangle
      }
    ];

    const detailMetrics: ProfileCardMetric[] = [
      {
        label: t('specialization'),
        value: Array.isArray(member.specialization) ? member.specialization.join(', ') : (member.specialization || 'غير محدد'),
        type: 'badge',
        variant: 'secondary'
      },
      {
        label: t('currentWorkload'),
        value: `${member.current_workload || 0}%`,
        type: 'progress',
        progressValue: member.current_workload || 0
      },
      {
        label: t('activeAssignments'),
        value: member.team_assignments?.filter((a: any) => a.status === 'active')?.length || 0,
        icon: Target
      },
      {
        label: t('department'),
        value: member.profiles?.department || member.department || 'غير محدد'
      }
    ];

    const actions: ProfileCardAction[] = [
      {
        label: t('edit'),
        icon: Edit,
        onClick: () => handleEditMember(member)
      },
      {
        label: t('remove'),
        icon: UserX,
        onClick: () => handleRemoveMember(member.id),
        variant: 'destructive'
      }
    ];

    return (
      <ProfileCard
        key={member.id}
        id={member.id}
        name={member.profiles?.name || member.profiles?.name_ar || 'مستخدم غير معروف'}
        subtitle={member.profiles?.email || member.contact_email || 'غير محدد'}
        avatarUrl={member.profiles?.profile_image_url}
        avatarFallback={member.profiles?.name?.charAt(0) || member.profiles?.name_ar?.charAt(0) || 'U'}
        primaryMetrics={primaryMetrics}
        detailMetrics={detailMetrics}
        actions={actions}
        clickable={true}
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
    </div>
  );
}