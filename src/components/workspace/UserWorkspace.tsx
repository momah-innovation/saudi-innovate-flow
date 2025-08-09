import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Activity, 
  Target, 
  Calendar, 
  Bookmark,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Clock,
  TrendingUp,
  Lightbulb,
  Trophy,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { UserPresence } from '@/components/collaboration/UserPresence';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface UserWorkspaceProps {
  userId?: string;
}

interface WorkspaceStats {
  ideas_count: number;
  challenges_count: number;
  events_count: number;
  collaborations_count: number;
  achievements_count: number;
}

interface RecentItem {
  id: string;
  title: string;
  type: 'idea' | 'challenge' | 'event' | 'collaboration';
  status: string;
  updated_at: string;
}

export const UserWorkspace: React.FC<UserWorkspaceProps> = ({ userId }) => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<WorkspaceStats>({
    ideas_count: 0,
    challenges_count: 0,
    events_count: 0,
    collaborations_count: 0,
    achievements_count: 0
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const targetUserId = userId || user?.id;
  const isOwnWorkspace = !userId || userId === user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadWorkspaceData();
    }
  }, [targetUserId]);

  const loadWorkspaceData = async () => {
    try {
      await Promise.all([
        loadWorkspaceStats(),
        loadRecentItems()
      ]);
    } catch (error) {
      logger.error('Error loading workspace data', { userId: targetUserId }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkspaceStats = async () => {
    try {
      // Get ideas count
      const { count: ideasCount } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('innovator_id', targetUserId);

      // Get challenges participation count
      const { count: challengesCount } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      // Get events participation count
      const { count: eventsCount } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      // Get achievements count
      const { count: achievementsCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      setStats({
        ideas_count: ideasCount || 0,
        challenges_count: challengesCount || 0,
        events_count: eventsCount || 0,
        collaborations_count: 0, // TODO: Calculate from collaboration data
        achievements_count: achievementsCount || 0
      });
    } catch (error) {
      logger.error('Error loading workspace stats', { userId: targetUserId }, error as Error);
    }
  };

  const loadRecentItems = async () => {
    try {
      // Load recent ideas
      const { data: recentIdeas } = await supabase
        .from('ideas')
        .select('id, title_ar, status, updated_at')
        .eq('innovator_id', targetUserId)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Format recent items
      const items: RecentItem[] = [];
      
      if (recentIdeas) {
        items.push(...recentIdeas.map(idea => ({
          id: idea.id,
          title: idea.title_ar,
          type: 'idea' as const,
          status: idea.status,
          updated_at: idea.updated_at
        })));
      }

      setRecentItems(items);
    } catch (error) {
      logger.error('Error loading recent items', { userId: targetUserId }, error as Error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'approved': 'مقبول',
      'under_review': 'قيد المراجعة',
      'rejected': 'مرفوض',
      'draft': 'مسودة',
      'submitted': 'مقدم'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.profile_image_url} />
              <AvatarFallback className="text-lg">
                {userProfile?.name_ar?.charAt(0) || userProfile?.name?.charAt(0) || 'م'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {isOwnWorkspace ? 'مساحة عملي' : `مساحة عمل ${userProfile?.name_ar || userProfile?.name}`}
              </h1>
              <p className="text-muted-foreground">
                {userProfile?.email}
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                <Badge variant="outline">
                  <User className="h-3 w-3 mr-1" />
                  مبتكر
                </Badge>
                <Badge variant="secondary">
                  <Activity className="h-3 w-3 mr-1" />
                  نشط
                </Badge>
              </div>
            </div>
            {isOwnWorkspace && (
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  الإعدادات
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  التنبيهات
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Lightbulb className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.ideas_count}</p>
                <p className="text-sm text-muted-foreground">الأفكار</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.challenges_count}</p>
                <p className="text-sm text-muted-foreground">التحديات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.events_count}</p>
                <p className="text-sm text-muted-foreground">الفعاليات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.collaborations_count}</p>
                <p className="text-sm text-muted-foreground">التعاونات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.achievements_count}</p>
                <p className="text-sm text-muted-foreground">الإنجازات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspace Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="recent">الأحدث</TabsTrigger>
          <TabsTrigger value="collaboration">التعاون</TabsTrigger>
          <TabsTrigger value="bookmarks">المحفوظات</TabsTrigger>
          <TabsTrigger value="analytics">الإحصائيات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentItems.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد نشاط حديث</h3>
                  <p className="text-muted-foreground">ابدأ بإنشاء فكرة أو الانضمام لتحدي</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {item.type === 'idea' && <Lightbulb className="h-5 w-5 text-primary" />}
                          {item.type === 'challenge' && <Target className="h-5 w-5 text-blue-500" />}
                          {item.type === 'event' && <Calendar className="h-5 w-5 text-green-500" />}
                          {item.type === 'collaboration' && <Users className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.updated_at).toLocaleDateString('ar')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
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

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>العناصر الحديثة</CardTitle>
              <CardDescription>آخر العناصر التي تم العمل عليها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.updated_at).toLocaleDateString('ar')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
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
            {/* Real-time Collaboration */}
            <ActivityFeed
              scope="all"
              limit={20}
              showFilters={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                المحفوظات
              </CardTitle>
              <CardDescription>العناصر التي قمت بحفظها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد محفوظات</h3>
                <p className="text-muted-foreground">احفظ الأفكار والتحديات المهمة لتجدها هنا</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                إحصائيات الأداء
              </CardTitle>
              <CardDescription>تحليل نشاطك وأدائك في المنصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">الإحصائيات قادمة قريباً</h3>
                <p className="text-muted-foreground">ستتمكن من مراجعة إحصائيات أدائك هنا</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collaboration Widget */}
      <WorkspaceCollaboration
        workspaceType="user"
        entityId={targetUserId}
        showWidget={true}
        showPresence={true}
        showActivity={false}
      />
    </div>
  );
};