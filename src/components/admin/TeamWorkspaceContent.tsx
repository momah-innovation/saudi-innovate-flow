import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Users, Target, Clock, TrendingUp, 
  CheckCircle, AlertCircle, User, Settings
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TeamWorkspaceContentProps {
  activeView: string;
  onViewChange: (view: string) => void;
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
}

export function TeamWorkspaceContent({ 
  activeView, 
  onViewChange, 
  viewMode, 
  searchTerm 
}: TeamWorkspaceContentProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>({
    assignments: [],
    projects: [],
    teamMembers: [],
    metrics: {
      activeProjects: 0,
      completedTasks: 0,
      teamCapacity: 0,
      avgPerformance: 0
    }
  });

  useEffect(() => {
    if (user) {
      fetchTeamWorkspaceData();
    }
  }, [user]);

  const fetchTeamWorkspaceData = async () => {
    try {
      setLoading(true);

      // Fetch team assignments
      const { data: assignments } = await supabase
        .from('team_assignments')
        .select(`
          *,
          innovation_team_members!inner(
            id,
            user_id,
            role,
            specialization
          )
        `)
        .eq('innovation_team_members.user_id', user?.id);

      // Fetch team collaboration projects
      const { data: collaborations } = await supabase
        .from('idea_collaboration_teams')
        .select(`
          *,
          ideas!inner(
            id,
            title_ar,
            status,
            created_at
          )
        `)
        .eq('member_id', user?.id);

      // Fetch team members from same team
      const { data: teamMembers } = await supabase
        .from('innovation_team_members')
        .select(`
          *,
          profiles!user_id(
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('status', 'active');

      // Calculate metrics
      const activeProjects = assignments?.filter(a => a.status === 'active')?.length || 0;
      const completedTasks = assignments?.filter(a => a.status === 'completed')?.length || 0;
      const avgWorkload = assignments?.reduce((sum, a) => sum + (a.workload_percentage || 0), 0) / (assignments?.length || 1);

      setTeamData({
        assignments: assignments || [],
        projects: collaborations || [],
        teamMembers: teamMembers || [],
        metrics: {
          activeProjects,
          completedTasks,
          teamCapacity: Math.round(avgWorkload),
          avgPerformance: 85 // This would be calculated from actual performance data
        }
      });

    } catch (error) {
      console.error('Error fetching team workspace data:', error);
      toast({
        title: "Error",
        description: "Failed to load team workspace data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeProjects')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">+2 من الأسبوع الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completedTasks')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">+12% هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teamCapacity')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.metrics.teamCapacity}%</div>
            <Progress value={teamData.metrics.teamCapacity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgPerformance')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.metrics.avgPerformance}%</div>
            <p className="text-xs text-muted-foreground">+5% من الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('myAssignments')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamData.assignments.slice(0, 5).map((assignment: any) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{assignment.assignment_type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {assignment.role_in_assignment} • {assignment.workload_percentage}%
                  </p>
                </div>
                <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                  {assignment.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('teamMembers')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamData.teamMembers.slice(0, 5).map((member: any) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback>
                    {member.profiles?.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{member.profiles?.display_name || 'مستخدم'}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Badge variant="outline">{member.specialization}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamData.projects.map((project: any) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{project.ideas?.title_ar}</span>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                {t('role')}: {project.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(project.joined_at).toLocaleDateString('ar-SA')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTeamDirectory = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamData.teamMembers.map((member: any) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback>
                    {member.profiles?.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {member.profiles?.display_name || 'مستخدم'}
                  </CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">{member.specialization}</Badge>
                <div className="flex items-center gap-2 text-sm">
                  <span>السعة الحالية:</span>
                  <Progress value={member.current_workload || 0} className="flex-1" />
                  <span>{member.current_workload || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loadingWorkspace')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={onViewChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('dashboard')}
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('projects')}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('team')}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('schedule')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {renderProjects()}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {renderTeamDirectory()}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('teamSchedule')}</CardTitle>
              <CardDescription>{t('upcomingEventsAndDeadlines')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t('scheduleFeatureComingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}