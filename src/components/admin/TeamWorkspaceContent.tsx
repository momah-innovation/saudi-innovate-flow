import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { TeamMember } from '@/types/workspace';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Users, Target, Clock, TrendingUp, CheckCircle, AlertCircle, User, Settings,
  Plus, MessageSquare, Share2, FileText, BarChart3, Activity, Bell, Search,
  UserPlus, FolderPlus, Calendar as CalendarIcon, Zap, Filter, MoreHorizontal,
  Eye, Edit3, Archive, Star, Heart, ThumbsUp, ArrowRight, ExternalLink,
  PieChart, LineChart, MapPin, Mail, Phone, UserX, Award, AlertTriangle, 
  X, Edit, Trash2, MoreVertical, FolderOpen, Download, Share, Briefcase, PlusCircle
} from 'lucide-react';
import { formatDateArabic } from '@/utils/unified-date-handler';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { CreateProjectDialog } from './team-workspace/CreateProjectDialog';
import { InviteMemberDialog } from './team-workspace/InviteMemberDialog';
import { TaskAssignmentDialog } from './team-workspace/TaskAssignmentDialog';
import { TeamChatSheet } from './team-workspace/TeamChatSheet';
import { MeetingSchedulerDialog } from './team-workspace/MeetingSchedulerDialog';

interface TeamMemberData {
  id: string;
  profiles?: {
    id: string;
    name?: string;
    name_ar?: string;
    profile_image_url?: string;
  } | {
    id: string;
    name: string;
    name_ar: string;
    profile_image_url: string;
  }[];
  role?: string;
  specialization?: string | string[];
  current_workload?: number;
  status?: string;
  cic_role?: string;
  contact_email?: string;
  created_at?: string;
  department?: string;
  join_date?: string;
  max_concurrent_projects?: number;
  notes?: string;
  performance_rating?: number;
  updated_at?: string;
  user_id?: string;
}

interface ProjectData {
  id: string;
  ideas?: {
    id: string;
    title_ar?: string;
  };
  status?: string;
  role?: string;
  joined_at?: string;
}

interface ActivityData {
  id: number;
  type: string;
  message: string;
  time: string;
  user: string;
}

interface TeamWorkspaceData {
  assignments: AssignmentData[];
  projects: ProjectData[];
  teamMembers: TeamMemberData[];
  recentActivities: ActivityData[];
  metrics: {
    activeProjects: number;
    completedTasks: number;
    teamCapacity: number;
    avgPerformance: number;
    completionRate: number;
    deadlinesMet: number;
  };
}

interface AssignmentData {
  id: string;
  status: string;
  assignment_type?: string;
  role_in_assignment?: string;
  workload_percentage?: number;
}

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
  const { t } = useUnifiedTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { metrics } = useAdminDashboardMetrics();
  
  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'TeamWorkspaceContent',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({ component: 'TeamWorkspaceContent' });
  
  // ✅ MIGRATED: Removed duplicate loading state - using unified loading
  const [selectedMember, setSelectedMember] = useState<TeamMemberData | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [activityFeed, setActivityFeed] = useState<ActivityData[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [teamData, setTeamData] = useState<TeamWorkspaceData>({
    assignments: [],
    projects: [],
    teamMembers: [],
    recentActivities: [],
    metrics: {
      activeProjects: 0,
      completedTasks: 0,
      teamCapacity: 0,
      avgPerformance: 0,
      completionRate: 0,
      deadlinesMet: 0
    }
  });

  useEffect(() => {
    if (user) {
      fetchTeamWorkspaceData();
    }
  }, [user]);

  const fetchTeamWorkspaceData = () => {
    return withLoading('fetch-data', async () => {
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
            name,
            name_ar,
            profile_image_url
          )
        `)
        .eq('status', 'active');

      // Fetch recent activities (mock data for now)
      const recentActivities = [
        { id: 1, type: 'assignment', message: 'تم تكليف أحمد بمشروع جديد', time: '2 دقيقة', user: 'أحمد محمد' },
        { id: 2, type: 'completion', message: 'تم إنجاز مهمة تحليل البيانات', time: '15 دقيقة', user: 'سارة أحمد' },
        { id: 3, type: 'comment', message: 'تعليق جديد على مشروع الابتكار', time: '30 دقيقة', user: 'محمد علي' },
        { id: 4, type: 'meeting', message: 'اجتماع فريق الابتكار غداً', time: '1 ساعة', user: 'النظام' }
      ];

      // Calculate metrics
      const activeProjects = assignments?.filter(a => a.status === 'active')?.length || 0;
      const completedTasks = assignments?.filter(a => a.status === 'completed')?.length || 0;
      const totalTasks = assignments?.length || 1;
      const avgWorkload = assignments?.reduce((sum, a) => sum + (a.workload_percentage || 0), 0) / totalTasks;

      setTeamData({
        assignments: assignments || [],
        projects: collaborations || [],
        teamMembers: (teamMembers || []).map((member: TeamMemberData) => ({
          ...member,
          profiles: Array.isArray(member.profiles) && member.profiles.length > 0 
            ? member.profiles[0] 
            : member.profiles
        })),
        recentActivities,
        metrics: {
          activeProjects,
          completedTasks,
          teamCapacity: Math.round(avgWorkload),
          avgPerformance: 85,
          completionRate: Math.round((completedTasks / totalTasks) * 100),
          deadlinesMet: 92
        }
      });
      
      return true;
    }, {
      errorMessage: "Failed to load team workspace data.",
      logContext: { userId: user?.id, action: 'fetch_workspace_data' }
    });
  };

  const createQuickTask = () => {
    if (!newTaskTitle || !newTaskAssignee) return;
    
    return withLoading('create-task', async () => {
      // This would create a new task/assignment
      setNewTaskTitle('');
      setNewTaskAssignee('');
      setShowQuickActions(false);
      return true;
    }, {
      successMessage: `تم تكليف ${newTaskAssignee} بمهمة: ${newTaskTitle}`,
      errorMessage: t('workspace.task_creation_failed', 'فشل في إنشاء المهمة'),
      logContext: { taskTitle: newTaskTitle, assignee: newTaskAssignee, action: 'create_quick_task' }
    });
  };

  const QuickActionsPanel = () => (
    <Sheet open={showQuickActions} onOpenChange={setShowQuickActions}>
      <SheetContent className="bg-gradient-subtle">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              إجراءات سريعة
            </span>
          </SheetTitle>
          <SheetDescription className="text-lg leading-relaxed">
            قم بإنشاء مهام جديدة وتنظيم العمل بسرعة
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-8 mt-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">إنشاء مهمة جديدة</h3>
            <Input
              placeholder={t('workspace.task_title_placeholder', 'عنوان المهمة')}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="gradient-border"
            />
            <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
              <SelectTrigger className="gradient-border">
                <SelectValue placeholder={t('workspace.assign_member_placeholder', 'تكليف عضو')} />
              </SelectTrigger>
              <SelectContent>
                {teamData.teamMembers.map((member: TeamMemberData) => (
                  <SelectItem key={member.id} value={
                    Array.isArray(member.profiles) ? member.profiles[0]?.name || 'مستخدم' : member.profiles?.name || 'مستخدم'
                  }>
                    {Array.isArray(member.profiles) ? member.profiles[0]?.name || 'مستخدم' : member.profiles?.name || 'مستخدم'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={createQuickTask} className="w-full hover-scale gradient-border">
              <Plus className="h-4 w-4 mr-2" />
              إنشاء المهمة
            </Button>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-3 hover-scale gradient-border" onClick={() => setShowCreateProject(true)}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                <FolderPlus className="h-6 w-6" />
              </div>
              مشروع جديد
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover-scale gradient-border" onClick={() => setShowMeetingScheduler(true)}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                <CalendarIcon className="h-6 w-6" />
              </div>
              جدولة اجتماع
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover-scale gradient-border" onClick={() => setShowTeamChat(true)}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              مناقشة فريق
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover-scale gradient-border">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              تقرير أداء
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const MemberDetailDialog = ({ member }: { member: TeamMemberData }) => (
    <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={
                Array.isArray(member?.profiles) ? member.profiles[0]?.profile_image_url : member?.profiles?.profile_image_url
              } />
              <AvatarFallback>
                {Array.isArray(member?.profiles) ? member.profiles[0]?.name?.charAt(0) || 'U' : member?.profiles?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2>{Array.isArray(member?.profiles) ? member.profiles[0]?.name || 'مستخدم' : member?.profiles?.name || 'مستخدم'}</h2>
              <p className="text-sm text-muted-foreground">{member?.role}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('workspace.active_tasks', 'المهام النشطة')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.challenges?.active || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('workspace.completion_rate', 'معدل الإنجاز')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(metrics?.challenges?.completionRate || 85)}%</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('workspace.specializations_skills', 'التخصصات والمهارات')}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{member?.specialization}</Badge>
              <Badge variant="outline">تحليل البيانات</Badge>
              <Badge variant="outline">إدارة المشاريع</Badge>
              <Badge variant="outline">التصميم</Badge>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('workspace.current_capacity', 'السعة الحالية')}</h3>
            <Progress value={member?.current_workload || 65} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {member?.current_workload || 65}% {t('workspace.of_full_capacity', 'من السعة الكاملة')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              إرسال رسالة
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              تكليف مهمة
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              عرض المهام
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ProjectDetailDialog = ({ project }: { project: ProjectData }) => (
    <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{project?.ideas?.title_ar}</span>
            <Badge variant={project?.status === 'active' ? 'default' : 'secondary'}>
              {project?.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            دور العضو: {project?.role} • انضم في {formatDateArabic(project?.joined_at, 'dd/MM/yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">التقدم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(metrics?.challenges?.completionRate || 65)}%</div>
                <Progress value={metrics?.challenges?.completionRate || 65} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">أعضاء الفريق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round((metrics?.users?.active || 0) / 10)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">الموعد النهائي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">15 فبراير</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-medium mb-3">{t('workspace.recent_activities', 'الأنشطة الحديثة')}</h3>
            <ScrollArea className="h-40">
              <div className="space-y-3">
                {[
                  { action: 'تم رفع ملف جديد', time: '2 ساعة', user: 'أحمد محمد' },
                  { action: 'تم إنجاز مهمة التصميم', time: '4 ساعات', user: 'سارة أحمد' },
                  { action: 'تعليق على المراجعة', time: '6 ساعات', user: 'محمد علي' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex gap-2">
            <Button size="sm">
              <Eye className="h-4 w-4 mr-2" />
              عرض التفاصيل
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              مناقشة الفريق
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              مشاركة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions Floating Button */}
      <Button
        onClick={() => setShowQuickActions(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Enhanced Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeProjects')}</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{teamData.metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +2 من الأسبوع الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completedTasks')}</CardTitle>
            <CheckCircle className="h-4 w-4 icon-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hero-stats-challenges">{teamData.metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">+12% هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('teamCapacity')}</CardTitle>
            <Users className="h-4 w-4 icon-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hero-stats-users">{teamData.metrics.teamCapacity}%</div>
            <Progress value={teamData.metrics.teamCapacity} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgPerformance')}</CardTitle>
            <TrendingUp className="h-4 w-4 icon-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hero-stats-score">{teamData.metrics.avgPerformance}%</div>
            <p className="text-xs text-muted-foreground">+5% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <PieChart className="h-4 w-4 icon-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hero-stats-score">{teamData.metrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">من إجمالي المهام</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الالتزام بالمواعيد</CardTitle>
            <Clock className="h-4 w-4 icon-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{teamData.metrics.deadlinesMet}%</div>
            <p className="text-xs text-muted-foreground">مواعيد محققة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('workspace.latest_activities', 'آخر الأنشطة')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {teamData.recentActivities.map((activity: ActivityData) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'assignment' ? 'activity-assignment' :
                      activity.type === 'completion' ? 'activity-completion' :
                      activity.type === 'comment' ? 'activity-comment' : 'activity-general'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Team Assignments */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('myAssignments')}
              </span>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamData.assignments.slice(0, 5).map((assignment: AssignmentData) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex-1">
                  <h4 className="font-medium">{assignment.assignment_type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {assignment.role_in_assignment} • {assignment.workload_percentage}%
                  </p>
                  <Progress value={assignment.workload_percentage || 0} className="mt-2 h-1" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('teamMembers')}
              </span>
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamData.teamMembers.slice(0, 5).map((member: TeamMemberData) => (
              <div 
                key={member.id} 
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={
                    Array.isArray(member.profiles) ? member.profiles[0]?.profile_image_url : member.profiles?.profile_image_url
                  } />
                  <AvatarFallback>
                    {Array.isArray(member.profiles) ? member.profiles[0]?.name?.charAt(0) || 'U' : member.profiles?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{Array.isArray(member.profiles) ? member.profiles[0]?.name || 'مستخدم' : member.profiles?.name || 'مستخدم'}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <Progress value={member.current_workload || 65} className="mt-1 h-1" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">{member.specialization}</Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <QuickActionsPanel />
      <CreateProjectDialog 
        open={showCreateProject} 
        onOpenChange={setShowCreateProject} 
        teamMembers={teamData.teamMembers.map(member => ({
          id: member.id,
          role: member.role || '',
          specialization: Array.isArray(member.specialization) ? member.specialization[0] : member.specialization || '',
          current_workload: member.current_workload,
          profiles: {
            display_name: Array.isArray(member.profiles) 
              ? member.profiles[0]?.name || 'مستخدم'
              : member.profiles?.name || 'مستخدم',
            profile_image_url: Array.isArray(member.profiles)
              ? member.profiles[0]?.profile_image_url
              : member.profiles?.profile_image_url
          }
        }))} 
      />
      <InviteMemberDialog open={showInviteMember} onOpenChange={setShowInviteMember} />
      <TaskAssignmentDialog 
        open={showTaskAssignment} 
        onOpenChange={setShowTaskAssignment} 
        teamMembers={teamData.teamMembers.map(member => ({
          id: member.id,
          role: member.role || '',
          specialization: Array.isArray(member.specialization) ? member.specialization[0] : member.specialization || '',
          current_workload: member.current_workload,
          profiles: {
            display_name: Array.isArray(member.profiles) 
              ? member.profiles[0]?.name || 'مستخدم'
              : member.profiles?.name || 'مستخدم',
            profile_image_url: Array.isArray(member.profiles)
              ? member.profiles[0]?.profile_image_url
              : member.profiles?.profile_image_url
          }
        }))}
        selectedMember={selectedMember ? {
          id: selectedMember.id,
          role: selectedMember.role || '',
          specialization: Array.isArray(selectedMember.specialization) ? selectedMember.specialization[0] : selectedMember.specialization || '',
          current_workload: selectedMember.current_workload,
          profiles: {
            display_name: Array.isArray(selectedMember.profiles) 
              ? selectedMember.profiles[0]?.name || 'مستخدم'
              : selectedMember.profiles?.name || 'مستخدم',
            profile_image_url: Array.isArray(selectedMember.profiles)
              ? selectedMember.profiles[0]?.profile_image_url
              : selectedMember.profiles?.profile_image_url
          }
        } : undefined}
      />
      <TeamChatSheet 
        open={showTeamChat} 
        onOpenChange={setShowTeamChat} 
        teamMembers={teamData.teamMembers.map(member => ({
          id: member.id,
          role: member.role || '',
          profiles: {
            display_name: Array.isArray(member.profiles) 
              ? member.profiles[0]?.name || 'مستخدم'
              : member.profiles?.name || 'مستخدم',
            profile_image_url: Array.isArray(member.profiles)
              ? member.profiles[0]?.profile_image_url
              : member.profiles?.profile_image_url
          }
        }))}
      />
      <MeetingSchedulerDialog 
        open={showMeetingScheduler} 
        onOpenChange={setShowMeetingScheduler} 
        teamMembers={teamData.teamMembers.map(member => ({
          id: member.id,
          role: member.role || '',
          profiles: {
            display_name: Array.isArray(member.profiles) 
              ? member.profiles[0]?.name || 'مستخدم'
              : member.profiles?.name || 'مستخدم',
            profile_image_url: Array.isArray(member.profiles)
              ? member.profiles[0]?.profile_image_url
              : member.profiles?.profile_image_url
          }
        }))}
      />
      {selectedMember && <MemberDetailDialog member={selectedMember} />}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      {/* Project Filters */}
      <div className="flex items-center gap-4">
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('workspace.filter_by_status', 'تصفية حسب الحالة')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('workspace.all_projects', 'جميع المشاريع')}</SelectItem>
            <SelectItem value="active">{t('status.active', 'نشطة')}</SelectItem>
            <SelectItem value="completed">{t('status.completed', 'مكتملة')}</SelectItem>
            <SelectItem value="paused">{t('status.paused', 'متوقفة')}</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          فلاتر متقدمة
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamData.projects.map((project: ProjectData) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate group-hover:text-primary transition-colors">
                  {project.ideas?.title_ar}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {t('role')}: {project.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDateArabic(project.joined_at, 'dd/MM/yyyy')}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Project Card */}
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-dashed group">
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <FolderPlus className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
            <h3 className="font-medium mb-2">مشروع جديد</h3>
            <p className="text-sm text-muted-foreground text-center">
              ابدأ مشروع تعاوني جديد مع فريقك
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedProject && <ProjectDetailDialog project={selectedProject} />}
    </div>
  );

  const renderTeamDirectory = () => (
    <div className="space-y-6">
      {/* Team Directory Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في أعضاء الفريق..."
              className="pl-10 w-64"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('workspace.filter_by_role_placeholder', 'تصفية حسب الدور')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="lead">قائد فريق</SelectItem>
              <SelectItem value="member">عضو</SelectItem>
              <SelectItem value="expert">خبير</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          دعوة عضو جديد
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">إجمالي الأعضاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.teamMembers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('workspace.active_members', 'الأعضاء النشطون')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {teamData.teamMembers.filter((m: TeamMemberData) => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">متوسط السعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">72%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">معدل الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-innovation">89%</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamData.teamMembers.map((member: TeamMemberData) => (
          <Card 
            key={member.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedMember(member)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={
                      Array.isArray(member.profiles) ? member.profiles[0]?.profile_image_url : member.profiles?.profile_image_url
                    } />
                    <AvatarFallback className="text-lg">
                      {Array.isArray(member.profiles) ? member.profiles[0]?.name?.charAt(0) || 'U' : member.profiles?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {Array.isArray(member.profiles) ? member.profiles[0]?.name || 'مستخدم' : member.profiles?.name || 'مستخدم'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {member.role}
                    <Badge variant="outline" className="text-xs">{member.specialization}</Badge>
                  </CardDescription>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>السعة الحالية</span>
                  <span className={`font-medium ${
                    (member.current_workload || 0) > 80 ? 'workload-critical' :
                    (member.current_workload || 0) > 60 ? 'workload-high' : 'workload-normal'
                  }`}>
                    {member.current_workload || 65}%
                  </span>
                </div>
                <Progress 
                  value={member.current_workload || 65} 
                  className={`h-2 ${
                    (member.current_workload || 0) > 80 ? '[&>div]:workload-critical' :
                    (member.current_workload || 0) > 60 ? '[&>div]:workload-high' : '[&>div]:workload-normal'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>12 مهمة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {['React', 'TypeScript', 'تصميم UI'].slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMember && <MemberDetailDialog member={selectedMember} />}
    </div>
  );

  if (isLoading()) {
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
            {t('nav.dashboard')}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Widget */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {t('teamSchedule')}
                </CardTitle>
                <CardDescription>{t('upcomingEventsAndDeadlines')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini Calendar */}
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(day => (
                      <div key={day} className="p-2 font-medium text-muted-foreground">{day}</div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div key={i} className={`p-2 rounded hover:bg-muted cursor-pointer ${
                        i === 15 ? 'bg-primary text-primary-foreground' :
                        i === 18 || i === 22 ? 'status-info' : ''
                      }`}>
                        {i < 31 ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  الأحداث القادمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'اجتماع فريق التطوير', time: 'اليوم 2:00 م', type: 'meeting' },
                    { title: 'موعد تسليم المشروع', time: 'غداً', type: 'deadline' },
                    { title: 'مراجعة الكود', time: 'الخميس 10:00 ص', type: 'review' },
                    { title: 'عرض تقديمي', time: 'الأحد 3:00 م', type: 'presentation' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                       <div className={`w-3 h-3 rounded-full ${
                        event.type === 'meeting' ? 'event-scheduled' :
                        event.type === 'deadline' ? 'event-cancelled' :
                        event.type === 'review' ? 'event-ongoing' : 'event-completed'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}