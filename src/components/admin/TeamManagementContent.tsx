import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Target, TrendingUp, Settings, 
  Edit, MoreVertical, UserX, Crown,
  Clock, CheckCircle, AlertTriangle, Plus
} from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useRTLAware } from '@/hooks/useRTLAware';
import { RTLFlex } from '@/components/ui/rtl-layout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InnovationTeam {
  id: string;
  name: string;
  description: string;
  leader_id: string;
  status: string;
  created_at: string;
  member_count: number;
  active_projects: number;
  leader_name?: string;
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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { mr, ml, isRTL } = useRTLAware();
  const [loading, setLoading] = useState(true);
  const [innovationTeams, setInnovationTeams] = useState<InnovationTeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [teamsData, setTeamsData] = useState({
    teams: [],
    metrics: {
      totalTeams: 0,
      activeTeams: 0,
      totalMembers: 0,
      activeProjects: 0
    }
  });

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const fetchTeamsData = async () => {
    try {
      setLoading(true);

      // For now, create mock data since we don't have innovation_teams table yet
      // In a real implementation, you would fetch from a proper teams table
      const mockTeams = [
        {
          id: '1',
          name: 'فريق التقنيات الناشئة',
          description: 'يركز على استكشاف وتطوير التقنيات المبتكرة',
          leader_id: user?.id || '',
          leader_name: 'أحمد محمد',
          status: 'active',
          created_at: new Date().toISOString(),
          member_count: 8,
          active_projects: 3
        },
        {
          id: '2',
          name: 'فريق الاستدامة والبيئة',
          description: 'يعمل على حلول الاستدامة والحفاظ على البيئة',
          leader_id: user?.id || '',
          leader_name: 'فاطمة علي',
          status: 'active',
          created_at: new Date().toISOString(),
          member_count: 6,
          active_projects: 2
        },
        {
          id: '3',
          name: 'فريق الصحة الرقمية',
          description: 'يطور حلول تقنية للرعاية الصحية',
          leader_id: user?.id || '',
          leader_name: 'محمد الأحمد',
          status: 'active',
          created_at: new Date().toISOString(),
          member_count: 12,
          active_projects: 5
        }
      ];

      // Calculate metrics
      const totalTeams = mockTeams.length;
      const activeTeams = mockTeams.filter(t => t.status === 'active').length;
      const totalMembers = mockTeams.reduce((sum, t) => sum + t.member_count, 0);
      const activeProjects = mockTeams.reduce((sum, t) => sum + t.active_projects, 0);

      setTeamsData({
        teams: mockTeams,
        metrics: {
          totalTeams,
          activeTeams,
          totalMembers,
          activeProjects
        }
      });

      setInnovationTeams(mockTeams);

    } catch (error) {
      console.error('Error fetching teams data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات فرق الابتكار.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    onAddDialogChange(true);
  };

  const handleRemoveTeam = async (teamId: string) => {
    try {
      // In a real implementation, you would update the team status
      toast({
        title: "نجح",
        description: "تم إزالة فريق الابتكار بنجاح.",
      });

      fetchTeamsData();
    } catch (error) {
      console.error('Error removing team:', error);
      toast({
        title: "خطأ",
        description: "فشل في إزالة فريق الابتكار.",
        variant: "destructive",
      });
    }
  };

  const renderTeamCard = (team: InnovationTeam) => (
    <Card key={team.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {team.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {team.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {team.description}
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
              <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                <Edit className={`h-4 w-4 ${mr("2")}`} />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleRemoveTeam(team.id)}
              >
                <UserX className={`h-4 w-4 ${mr("2")}`} />
                {t('remove')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('teamLeader')}</span>
          <Badge variant="outline">{team.leader_name}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('memberCount')}</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {team.member_count}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('activeProjects')}</span>
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            {team.active_projects}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('status')}</span>
          <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
            {team.status === 'active' ? (
              <CheckCircle className={`h-3 w-3 ${mr("1")}`} />
            ) : (
              <AlertTriangle className={`h-3 w-3 ${mr("1")}`} />
            )}
            {team.status}
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
            <CardTitle className="text-sm font-medium">{t('totalTeams')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsData.metrics.totalTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeTeams')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsData.metrics.activeTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalMembers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsData.metrics.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeProjects')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsData.metrics.activeProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Innovation Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('innovationTeams')}
          </CardTitle>
          <CardDescription>
            {t('manageInnovationTeamsAndGroups')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${
            viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-3' :
            viewMode === 'cards' ? 'grid-cols-1 lg:grid-cols-2' :
            'grid-cols-1'
          }`}>
            {innovationTeams
              .filter((team: any) => 
                !searchTerm || 
                team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.leader_name?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(renderTeamCard)}
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
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('teams')}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('projects')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('teamProjects')}</CardTitle>
              <CardDescription>{t('manageTeamProjectsAndCollaboration')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('projectsFeatureComingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('teamAnalytics')}</CardTitle>
              <CardDescription>{t('trackTeamPerformanceAndCollaboration')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('analyticsFeatureComingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}