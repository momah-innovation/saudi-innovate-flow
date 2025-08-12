import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AppShell } from '@/components/layout/AppShell';
import { GlobalBreadcrumb } from '@/components/layout/GlobalBreadcrumb';
import { EnhancedChallengeCard } from '@/components/challenges/EnhancedChallengeCard';
import { EnhancedChallengesHero } from '@/components/challenges/EnhancedChallengesHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { TagSelector } from '@/components/ui/tag-selector';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
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
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: 'draft' | 'active' | 'planning' | 'completed' | 'paused';
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  actual_budget?: number;
  sector_name?: string;
  sector_name_ar?: string;
  department_name?: string;
  department_name_ar?: string;
  participant_count?: number;
  submission_count?: number;
  like_count?: number;
  view_count?: number;
  tag_names?: string[];
  tag_names_ar?: string[];
  tag_colors?: string[];
  image_url?: string;
  challenge_owner?: {
    name: string;
    profile_image_url?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export default function Challenges() {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const { user, hasRole } = useAuth();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [likedChallenges, setLikedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      
      // Get user authentication first
      const { data: { user } } = await supabase.auth.getUser();
      
      // Use the challenges table directly (will filter via RLS)
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log('Challenges data fetched:', { count: data?.length, user: user?.id });

      // Transform the data to match our Challenge interface
      const transformedData: Challenge[] = (data || []).map(challenge => ({
        ...challenge,
        status: challenge.status as Challenge['status'],
        priority_level: challenge.priority_level as Challenge['priority_level'],
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

  const handleViewDetails = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  const handleLike = async (challengeId: string) => {
    if (!user) {
      toast({
        title: 'يرجى تسجيل الدخول',
        description: 'يجب تسجيل الدخول للإعجاب بالتحديات',
        variant: 'destructive',
      });
      return;
    }

    try {
      const isLiked = likedChallenges.has(challengeId);
      
      if (isLiked) {
        // Remove like
        await supabase
          .from('challenge_bookmarks')
          .delete()
          .eq('challenge_id', challengeId)
          .eq('user_id', user.id);
        
        setLikedChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(challengeId);
          return newSet;
        });
      } else {
        // Add like
        await supabase
          .from('challenge_bookmarks')
          .insert({
            challenge_id: challengeId,
            user_id: user.id
          });
        
        setLikedChallenges(prev => new Set([...prev, challengeId]));
      }

      toast({
        title: isLiked ? 'تم إلغاء الإعجاب' : 'تم الإعجاب',
        description: isLiked ? 'تم إلغاء إعجابك بالتحدي' : 'تم إضافة إعجابك للتحدي',
      });
      
    } catch (error) {
      logger.error('Failed to toggle like', { component: 'Challenges', action: 'like', challengeId }, error as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث الإعجاب',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const shareData = {
      title: challenge.title_ar,
      text: challenge.description_ar,
      url: `${window.location.origin}/challenges/${challengeId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: 'تم المشاركة بنجاح',
          description: 'تم مشاركة التحدي بنجاح',
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'تم نسخ الرابط',
          description: 'تم نسخ رابط التحدي إلى الحافظة',
        });
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل في نسخ الرابط',
          variant: 'destructive',
        });
      }
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
      <AppShell enableCollaboration={true}>
        <div className="container mx-auto px-4 py-8">
          <GlobalBreadcrumb />
          <div className="mb-8">
            <h1 className={cn("text-3xl font-bold mb-2", isRTL && "text-right")}>التحديات الابتكارية</h1>
            <p className={cn("text-muted-foreground", isRTL && "text-right")}>استكشف التحديات المتاحة وشارك في الابتكار</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell enableCollaboration={true}>
      <div className="space-y-6">
        {/* Hero Section */}
        <EnhancedChallengesHero
          totalChallenges={challenges.length}
          activeChallenges={challenges.filter(c => c.status === 'active').length}
          participantsCount={challenges.reduce((sum, c) => sum + (c.participant_count || 0), 0)}
          completedChallenges={challenges.filter(c => c.status === 'completed').length}
          canCreateChallenge={hasRole('admin')}
          featuredChallenge={challenges.find(c => c.status === 'active') ? {
            id: challenges.find(c => c.status === 'active')!.id,
            title_ar: challenges.find(c => c.status === 'active')!.title_ar,
            participant_count: challenges.find(c => c.status === 'active')!.participant_count || 0,
            end_date: challenges.find(c => c.status === 'active')!.end_date || ''
          } : undefined}
        />
        
        <div className="container mx-auto px-4 py-8">
          <GlobalBreadcrumb />
          
          <div className="space-y-6">
            {/* Header Actions */}
            <div className={cn(
              "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
              isRTL && "md:flex-row-reverse"
            )}>
              <div className={cn(
                "flex flex-1 gap-4",
                isRTL && "flex-row-reverse"
              )}>
                <div className="relative flex-1 max-w-sm">
                  <Search className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                    isRTL ? "right-3" : "left-3"
                  )} />
                  <Input
                    placeholder="البحث في التحديات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
                    dir={isRTL ? 'rtl' : 'ltr'}
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
                <Button className={cn("gap-2", isRTL && "flex-row-reverse")}>
                  <Plus className="w-4 h-4" />
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
                      <EnhancedChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onViewDetails={handleViewDetails}
                        onParticipate={handleParticipate}
                        onLike={handleLike}
                        onShare={handleShare}
                        isLiked={likedChallenges.has(challenge.id)}
                        variant="default"
                        showActions={true}
                        showStats={true}
                        showOwner={true}
                      />
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
      </div>
    </AppShell>
  );
}