import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TagSelector } from '@/components/ui/tag-selector';
import { 
  Search, 
  Filter, 
  Plus, 
  Target, 
  Calendar, 
  Users, 
  Award,
  Eye,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
// Collaboration imports
import { RealTimeCollaborationWrapper } from '@/components/collaboration/RealTimeCollaborationWrapper';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  sector_name?: string;
  sector_name_ar?: string;
  department_name?: string;
  department_name_ar?: string;
  participant_count?: number;
  submission_count?: number;
  tag_names?: string[];
  tag_names_ar?: string[];
  tag_colors?: string[];
  image_url?: string;
}

export default function Challenges() {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      
      // Use basic challenges query
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Transform the data to match our Challenge interface
      const transformedData: Challenge[] = (data || []).map(challenge => ({
        ...challenge,
        participant_count: 0, // We'll fetch these separately if needed
        submission_count: 0,
        tag_names: [],
        tag_names_ar: [],
        tag_colors: []
      }));

      setChallenges(transformedData);
    } catch (error) {
      logger.error('Failed to fetch challenges', { component: 'Challenges', action: 'fetchChallenges' }, error as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل التحديات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (challengeId: string) => {
    if (!user) {
      toast({
        title: 'يرجى تسجيل الدخول',
        description: 'يجب تسجيل الدخول للمشاركة في التحديات',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          participation_type: 'individual'
        });

      if (error) throw error;

      toast({
        title: 'تم التسجيل بنجاح',
        description: 'تم تسجيلك في التحدي بنجاح',
      });
      
      fetchChallenges(); // Refresh to update participant count
    } catch (error) {
      logger.error('Failed to participate in challenge', { component: 'Challenges', action: 'participate', challengeId }, error as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في التسجيل في التحدي',
        variant: 'destructive',
      });
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description_ar.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    const matchesTags = selectedTags.length === 0 || 
                       (challenge.tag_names && selectedTags.some(tag => challenge.tag_names!.includes(tag)));
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && challenge.status === 'active') ||
                      (activeTab === 'upcoming' && challenge.status === 'planning') ||
                      (activeTab === 'completed' && challenge.status === 'completed');
    
    return matchesSearch && matchesStatus && matchesTags && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'planning': return 'قيد التخطيط';
      case 'completed': return 'مكتمل';
      case 'paused': return 'متوقف';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">التحديات الابتكارية</h1>
            <p className="text-muted-foreground">استكشف التحديات المتاحة وشارك في الابتكار</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <RealTimeCollaborationWrapper
      contextType="global"
      contextId="challenges"
      entityType="challenges"
      entityId="browse"
      showWidget={true}
      widgetPosition="bottom-right"
    >
      <AppShell>
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">التحديات الابتكارية</h1>
          <p className="text-muted-foreground">استكشف التحديات المتاحة وشارك في الابتكار</p>
        </div>
        
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في التحديات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                category="challenge"
                placeholder="تصفية بالعلامات..."
                className="max-w-xs"
              />
            </div>
            
            {hasRole('admin') && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إضافة تحدي جديد
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">جميع التحديات</TabsTrigger>
              <TabsTrigger value="active">النشطة</TabsTrigger>
              <TabsTrigger value="upcoming">القادمة</TabsTrigger>
              <TabsTrigger value="completed">المكتملة</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredChallenges.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد تحديات</h3>
                    <p className="text-muted-foreground text-center">
                      لا توجد تحديات متاحة حاليًا وفقًا للمعايير المحددة
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredChallenges.map((challenge) => (
                    <Card key={challenge.id} className="group hover:shadow-lg transition-all duration-200">
                      {challenge.image_url && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={challenge.image_url}
                            alt={challenge.title_ar}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg line-clamp-2 flex-1">
                            {challenge.title_ar}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(challenge.status)} text-white`}
                          >
                            {getStatusText(challenge.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {challenge.description_ar}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Tags */}
                          {challenge.tag_names_ar && challenge.tag_names_ar.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {challenge.tag_names_ar.slice(0, 3).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  style={{ 
                                    borderColor: challenge.tag_colors?.[index] || '#3B82F6',
                                    color: challenge.tag_colors?.[index] || '#3B82F6'
                                  }}
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {challenge.tag_names_ar.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{challenge.tag_names_ar.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{challenge.participant_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              <span>{challenge.submission_count || 0}</span>
                            </div>
                            {challenge.end_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(challenge.end_date), 'MMM dd')}</span>
                              </div>
                            )}
                          </div>

                          {/* Budget */}
                          {challenge.estimated_budget && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-primary">
                                {challenge.estimated_budget.toLocaleString()} ريال
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              عرض التفاصيل
                            </Button>
                            
                            {challenge.status === 'active' && user && (
                              <Button 
                                size="sm" 
                                onClick={() => handleParticipate(challenge.id)}
                                className="flex-1"
                              >
                                <Target className="w-4 h-4 mr-2" />
                                شارك الآن
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Collaboration Integration */}
        <WorkspaceCollaboration
          workspaceType="user"
          entityId="challenges"
          showWidget={false}
          showPresence={true}
          showActivity={false}
        />
      </div>
    </AppShell>
    </RealTimeCollaborationWrapper>
  );
}