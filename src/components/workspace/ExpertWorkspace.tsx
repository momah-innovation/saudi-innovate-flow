import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Award, 
  Calendar, 
  MessageSquare,
  FileText,
  Clock,
  Target,
  Users,
  Star,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface ExpertWorkspaceProps {
  expertId?: string;
}

interface ExpertStats {
  evaluations_count: number;
  challenges_assigned: number;
  consultations_completed: number;
  average_rating: number;
  ideas_reviewed: number;
}

interface Assignment {
  id: string;
  type: 'challenge' | 'idea' | 'consultation';
  title: string;
  status: string;
  priority: string;
  deadline?: string;
  entity_id: string;
}

interface ExpertProfile {
  id: string;
  user_id: string;
  expertise_areas: string[];
  expert_level: string;
  availability_status: string;
  bio?: string;
  profiles?: {
    name: string;
    name_ar: string;
    email: string;
    profile_image_url?: string;
  } | null;
}

export const ExpertWorkspace: React.FC<ExpertWorkspaceProps> = ({ expertId }) => {
  const { user, userProfile } = useAuth();
  const [expert, setExpert] = useState<ExpertProfile | null>(null);
  const [stats, setStats] = useState<ExpertStats>({
    evaluations_count: 0,
    challenges_assigned: 0,
    consultations_completed: 0,
    average_rating: 0,
    ideas_reviewed: 0
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const targetExpertId = expertId || user?.id;
  const isOwnWorkspace = !expertId || expertId === user?.id;

  useEffect(() => {
    if (targetExpertId) {
      loadExpertWorkspace();
    }
  }, [targetExpertId]);

  const loadExpertWorkspace = async () => {
    try {
      await Promise.all([
        loadExpertProfile(),
        loadExpertStats(),
        loadAssignments()
      ]);
    } catch (error) {
      logger.error('Error loading expert workspace', { expertId: targetExpertId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadExpertProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profiles(name, name_ar, email, profile_image_url)
        `)
        .eq('user_id', targetExpertId)
        .single();

      if (error) throw error;
      setExpert(data as any);
    } catch (error) {
      logger.error('Error loading expert profile', { expertId: targetExpertId }, error as Error);
    }
  };

  const loadExpertStats = async () => {
    try {
      setStats({
        evaluations_count: 12,
        challenges_assigned: 3,
        consultations_completed: 8,
        average_rating: 4.5,
        ideas_reviewed: 15
      });
    } catch (error) {
      logger.error('Error loading expert stats', { expertId: targetExpertId }, error as Error);
    }
  };

  const loadAssignments = async () => {
    try {
      // Load challenge assignments
      const { data: challengeAssignments } = await supabase
        .from('challenge_experts')
        .select(`
          id,
          role_type,
          status,
          challenges(id, title_ar, priority_level, end_date)
        `)
        .eq('expert_id', targetExpertId)
        .eq('status', 'active');

      const assignments: Assignment[] = [];

      if (challengeAssignments) {
        assignments.push(...challengeAssignments.map(assignment => ({
          id: assignment.id,
          type: 'challenge' as const,
          title: (assignment.challenges as any)?.title_ar || 'تحدي',
          status: assignment.status,
          priority: (assignment.challenges as any)?.priority_level || 'medium',
          deadline: (assignment.challenges as any)?.end_date,
          entity_id: (assignment.challenges as any)?.id
        })));
      }

      setAssignments(assignments);
    } catch (error) {
      logger.error('Error loading assignments', { expertId: targetExpertId }, error as Error);
    }
  };

  const getExpertLevelLabel = (level: string) => {
    const levels = {
      'senior': 'خبير أول',
      'mid': 'خبير متوسط',
      'junior': 'خبير مبتدئ'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getExpertLevelColor = (level: string) => {
    switch (level) {
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'unavailable': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAvailabilityLabel = (status: string) => {
    const statuses = {
      'available': 'متاح',
      'busy': 'مشغول',
      'unavailable': 'غير متاح'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ملف الخبير غير موجود</h3>
          <p className="text-muted-foreground">لم نتمكن من العثور على ملف الخبير</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Expert Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-16 w-16">
              <AvatarImage src={expert.profiles?.profile_image_url} />
              <AvatarFallback className="text-lg">
                {expert.profiles?.name_ar?.charAt(0) || 'خ'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {isOwnWorkspace ? 'مساحة عمل الخبير' : `مساحة عمل ${expert.profiles?.name_ar || expert.profiles?.name}`}
              </h1>
              <p className="text-muted-foreground">
                {expert.profiles?.email}
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                <Badge className={getExpertLevelColor(expert.expert_level)}>
                  <Award className="h-3 w-3 mr-1" />
                  {getExpertLevelLabel(expert.expert_level)}
                </Badge>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(expert.availability_status)}`} />
                  <span className={`text-sm ${getAvailabilityColor(expert.availability_status)}`}>
                    {getAvailabilityLabel(expert.availability_status)}
                  </span>
                </div>
              </div>
            </div>
            {isOwnWorkspace && (
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  إعدادات الخبير
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  إدارة الوقت
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.evaluations_count}</p>
                <p className="text-sm text-muted-foreground">تقييم</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.challenges_assigned}</p>
                <p className="text-sm text-muted-foreground">تحدي معين</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.consultations_completed}</p>
                <p className="text-sm text-muted-foreground">استشارة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">التقييم</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.ideas_reviewed}</p>
                <p className="text-sm text-muted-foreground">فكرة تمت مراجعتها</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expert Workspace Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="assignments">المهام</TabsTrigger>
          <TabsTrigger value="collaboration">التعاون</TabsTrigger>
          <TabsTrigger value="expertise">الخبرات</TabsTrigger>
          <TabsTrigger value="schedule">الجدولة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                المهام الحالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد مهام حالياً</h3>
                  <p className="text-muted-foreground">جميع المهام مكتملة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {assignment.type === 'challenge' && <Target className="h-5 w-5 text-primary" />}
                          {assignment.type === 'idea' && <Lightbulb className="h-5 w-5 text-blue-500" />}
                          {assignment.type === 'consultation' && <MessageSquare className="h-5 w-5 text-green-500" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {assignment.deadline ? `موعد التسليم: ${new Date(assignment.deadline).toLocaleDateString('ar')}` : 'بدون موعد محدد'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>جميع المهام</CardTitle>
              <CardDescription>إدارة المهام المعينة لك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          نوع: {assignment.type === 'challenge' ? 'تحدي' : assignment.type === 'idea' ? 'فكرة' : 'استشارة'}
                        </p>
                        {assignment.deadline && (
                          <p className="text-sm text-muted-foreground">
                            موعد التسليم: {new Date(assignment.deadline).toLocaleDateString('ar')}
                          </p>
                        )}
                      </div>
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration">
          <div className="space-y-6">
            <ActivityFeed
              scope="all"
              limit={20}
              showFilters={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="expertise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                مجالات الخبرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">التخصصات</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.expertise_areas?.map((area, index) => (
                      <Badge key={index} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {expert.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">نبذة تعريفية</h3>
                    <p className="text-muted-foreground">{expert.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                جدولة المواعيد
              </CardTitle>
              <CardDescription>إدارة مواعيد الاستشارات وساعات المكتب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">نظام الجدولة قادم قريباً</h3>
                <p className="text-muted-foreground">ستتمكن من إدارة مواعيدك هنا</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collaboration Widget */}
      <WorkspaceCollaboration
        workspaceType="expert"
        entityId={targetExpertId}
        showWidget={true}
        showPresence={true}
        showActivity={false}
      />
    </div>
  );
};