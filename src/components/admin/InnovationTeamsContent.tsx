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

      // Fetch core innovation team members
      const { data: members, error } = await supabase
        .from('innovation_team_members')
        .select(`
          *,
          profiles!user_id (
            id,
            display_name,
            avatar_url,
            email
          ),
          team_assignments (
            id,
            assignment_type,
            status,
            workload_percentage
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate metrics
      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter(m => m.status === 'active')?.length || 0;
      const totalWorkload = members?.reduce((sum, m) => sum + (m.current_workload || 0), 0) || 0;
      const avgWorkload = totalMembers > 0 ? Math.round(totalWorkload / totalMembers) : 0;
      const totalAssignments = members?.reduce((sum, m) => sum + (m.team_assignments?.length || 0), 0) || 0;

      setCoreTeamData({
        members: members || [],
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

  const renderMemberCard = (member: any) => (
    <Card key={member.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.profiles?.avatar_url} />
              <AvatarFallback>
                {member.profiles?.display_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {member.profiles?.display_name || 'مستخدم'}
                {member.is_lead && <Crown className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
              <CardDescription className="text-sm">
                {member.profiles?.email}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                <Edit className="h-4 w-4 mr-2" />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleRemoveMember(member.id)}
              >
                <UserX className="h-4 w-4 mr-2" />
                {t('remove')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('role')}</span>
          <Badge variant="outline">{member.role}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('specialization')}</span>
          <Badge variant="secondary" className="text-xs">
            {member.specialization}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t('currentWorkload')}</span>
            <span>{member.current_workload || 0}%</span>
          </div>
          <Progress value={member.current_workload || 0} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>{t('activeAssignments')}</span>
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {member.team_assignments?.filter((a: any) => a.status === 'active')?.length || 0}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('status')}</span>
          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
            {member.status === 'active' ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {member.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

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
                member.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
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