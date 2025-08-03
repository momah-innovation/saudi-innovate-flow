import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChallengeActivityHub as ActivityHubComponent } from '@/components/challenges/ChallengeActivityHub';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  ArrowLeft,
  Users,
  FileText,
  TrendingUp,
  Activity,
  MessageSquare,
  Clock,
  Trophy,
  BarChart3
} from 'lucide-react';

interface PageChallenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  start_date?: string;
  end_date?: string;
  participants?: number;
  estimated_budget?: number;
}

export default function ChallengeActivityHub() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<PageChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  // Check if user has access to admin tools
  useEffect(() => {
    if (!hasRole('admin') && !hasRole('moderator')) {
      toast({
        variant: "destructive",
        title: isRTL ? "غير مصرح" : "Access Denied",
        description: isRTL ? "ليس لديك صلاحية للوصول لهذه الصفحة" : "You don't have permission to access this page"
      });
      navigate('/challenges');
    }
  }, [hasRole, navigate, toast, isRTL]);

  const fetchChallenge = async () => {
    if (!challengeId) return;
    
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (error) throw error;
      setChallenge(data);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تحميل التحدي" : "Failed to load challenge"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!challenge) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{isRTL ? 'التحدي غير موجود' : 'Challenge Not Found'}</h2>
          <Button onClick={() => navigate('/challenges')}>
            {isRTL ? 'العودة للتحديات' : 'Back to Challenges'}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getDaysRemaining = () => {
    if (!challenge.end_date) return null;
    const now = new Date();
    const endDate = new Date(challenge.end_date);
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressPercentage = () => {
    if (!challenge.start_date || !challenge.end_date) return 0;
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/challenges')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isRTL ? 'العودة' : 'Back'}
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{challenge.title_ar}</h1>
              <p className="text-muted-foreground">{isRTL ? 'مركز النشاط والتعاون' : 'Activity & Collaboration Hub'}</p>
            </div>
          </div>
          <Badge className="bg-green-500 text-white">
            {challenge.status}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{challenge.participants || 0}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'مشارك' : 'Participants'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{challenge.estimated_budget?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'ريال' : 'SAR'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{daysRemaining || 0}</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'يوم متبقي' : 'Days Left'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-muted-foreground">{isRTL ? 'مكتمل' : 'Progress'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {challenge.start_date && challenge.end_date && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{isRTL ? 'تقدم التحدي' : 'Challenge Progress'}</h3>
                  <span className="text-2xl font-bold">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{challenge.start_date ? new Date(challenge.start_date).toLocaleDateString() : 'N/A'}</span>
                  <span>{challenge.end_date ? new Date(challenge.end_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Hub Component */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityHubComponent challenge={{
              id: challenge.id,
              title_ar: challenge.title_ar,
              description_ar: challenge.description_ar,
              status: challenge.status,
              end_date: challenge.end_date || new Date().toISOString(),
              participants: challenge.participants || 0
            }} />
          </div>
          
          {/* Admin Controls Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {isRTL ? 'أدوات الإدارة' : 'Admin Controls'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/admin/challenges/edit/${challenge.id}`)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isRTL ? 'تعديل التحدي' : 'Edit Challenge'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/admin/challenges/participants/${challenge.id}`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isRTL ? 'إدارة المشاركين' : 'Manage Participants'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/admin/challenges/analytics/${challenge.id}`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {isRTL ? 'التحليلات' : 'Analytics'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/admin/challenges/submissions/${challenge.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isRTL ? 'المشاريع المقدمة' : 'Submissions'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRTL ? 'إجمالي النشاطات:' : 'Total Activities:'}</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRTL ? 'مشاريع مقدمة:' : 'Submissions:'}</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRTL ? 'رسائل اليوم:' : 'Messages Today:'}</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRTL ? 'معدل المشاركة:' : 'Engagement Rate:'}</span>
                  <span className="font-medium">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}