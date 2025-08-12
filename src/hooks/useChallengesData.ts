import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  image_url?: string;
  vision_2030_goal?: string;
  sensitivity_level: string;
  created_at: string;
  participants: number;
  submissions: number;
  category: string;
  category_en?: string;
  prize: string;
  difficulty: string;
  trending?: boolean;
  deadline: string;
  experts?: Array<{ name: string; profile_image_url: string; }>;
}

export const useChallengesData = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipants: 0,
    totalPrizes: 0,
  });
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  const fetchChallenges = async () => {
    try {
      setLoading(true);

      // Check user authentication
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 Authentication check:', { userId: user?.id, isAuthenticated: !!user });
      
      // Check user roles if authenticated
      let userRoles: string[] = [];
      if (user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('is_active', true);
        userRoles = roles?.map(r => r.role) || [];
        console.log('🔐 User roles loaded:', { userId: user.id, roles: userRoles });
      }

      // Fetch challenges - RLS policies handle access control automatically
      console.log('🔍 Attempting to fetch challenges...');
      
      // For unauthenticated users, try to fetch public challenges first
      let challengesQuery = supabase
        .from('challenges')
        .select(`
          *,
          challenge_participants(count)
        `);

      // For unauthenticated users, only fetch public challenges
      // For authenticated users, get all accessible challenges  
      if (!user) {
        challengesQuery = challengesQuery.in('sensitivity_level', ['normal', 'sensitivity.normal']);
        console.log('👥 Fetching public challenges only (unauthenticated user)');
      } else {
        console.log('🔑 Fetching all accessible challenges (authenticated user)');
      }
      
      const { data: challengesData, error: challengesError } = await challengesQuery
        .order('created_at', { ascending: false });

      console.log('📊 Challenge fetch result:', { 
        dataCount: challengesData?.length, 
        error: challengesError,
        userAuthenticated: !!user,
        firstChallenge: challengesData?.[0] 
      });

      if (challengesError) {
        console.error('❌ Database error fetching challenges:', challengesError);
        
        // If we get an auth error and user is not authenticated, this is expected
        if (!user && challengesError.message?.includes('JWT')) {
          console.log('💡 Auth error for unauthenticated user - this is normal for RLS');
          // For unauthenticated users, return empty array - they need to sign in
          setChallenges([]);
          setStats({
            totalChallenges: 0,
            activeChallenges: 0,
            totalParticipants: 0,
            totalPrizes: 0,
          });
          return;
        }
        
        logger.error('Error fetching challenges', { component: 'useChallengesData', action: 'fetchChallenges' }, challengesError);
        throw challengesError;
      }

      logger.info('Challenges data fetched', { 
        count: challengesData?.length,
        sampleId: challengesData?.[0]?.id 
      });

      // Fetch submissions count for each challenge
      const challengeIds = challengesData?.map(c => c.id) || [];
      const { data: submissionsData } = await supabase
        .from('challenge_submissions')
        .select('challenge_id')
        .in('challenge_id', challengeIds);

      // Transform data
      const transformedChallenges: Challenge[] = (challengesData || []).map((challenge, index) => {
        const participantCount = challenge.challenge_participants?.[0]?.count || 0;
        const submissionCount = submissionsData?.filter(s => s.challenge_id === challenge.id).length || 0;
        
        // Map challenge types to display categories
        const categoryMap: Record<string, { ar: string; en: string }> = {
          'technical': { ar: 'تقني', en: 'Technical' },
          'business': { ar: 'أعمال', en: 'Business' },
          'environmental': { ar: 'بيئي', en: 'Environmental' },
          'health': { ar: 'صحي', en: 'Health' },
          'educational': { ar: 'تعليمي', en: 'Educational' },
        };

        const category = categoryMap[challenge.challenge_type || 'technical'];
        
        // Map priority to difficulty
        const difficultyMap: Record<string, string> = {
          'عالي': 'صعب',
          'متوسط': 'متوسط',
          'منخفض': 'سهل',
        };

        const daysLeft = challenge.end_date 
          ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          : 0;

        return {
          id: challenge.id,
          title_ar: challenge.title_ar,
          title_en: challenge.title_ar, // Using Arabic as fallback
          description_ar: challenge.description_ar,
          description_en: challenge.description_ar, // Using Arabic as fallback
          status: challenge.status?.replace('status.', '') || 'draft', // Remove status prefix
          priority_level: challenge.priority_level,
          challenge_type: challenge.challenge_type,
          start_date: challenge.start_date,
          end_date: challenge.end_date,
          estimated_budget: challenge.estimated_budget,
          image_url: challenge.image_url,
          vision_2030_goal: challenge.vision_2030_goal,
          sensitivity_level: challenge.sensitivity_level?.replace('sensitivity.', '') || 'normal', // Remove sensitivity prefix
          created_at: challenge.created_at,
          participants: participantCount,
          submissions: submissionCount,
          category: category?.ar || 'تقني',
          category_en: category?.en || 'Technical',
          prize: challenge.estimated_budget ? `${(challenge.estimated_budget / 1000).toFixed(0)}K ريال` : 'غير محدد',
          difficulty: difficultyMap[challenge.priority_level] || 'متوسط',
          trending: index < 3 && (challenge.status?.includes('active') || challenge.status === 'active'), // Mark first 3 active as trending
          deadline: challenge.end_date ? `${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'} متبقية` : 'غير محدد',
          experts: [], // Will be populated separately if needed
        };
      });

      console.log('✅ Challenges transformation completed:', { 
        transformedCount: transformedChallenges.length,
        statusSample: transformedChallenges.slice(0, 3).map(c => ({ id: c.id, status: c.status, sensitivity: c.sensitivity_level }))
      });
      
      console.log('🔧 Challenge transformation debug:', {
        originalData: challengesData?.slice(0, 2),
        transformedData: transformedChallenges.slice(0, 2)
      });
      
      setChallenges(transformedChallenges);

      // Calculate stats
      const totalChallenges = transformedChallenges.length;
      const activeChallenges = transformedChallenges.filter(c => c.status === 'active').length;
      const totalParticipants = transformedChallenges.reduce((sum, c) => sum + c.participants, 0);
      const totalPrizes = transformedChallenges.reduce((sum, c) => sum + (c.estimated_budget || 0), 0);

      setStats({
        totalChallenges,
        activeChallenges,
        totalParticipants,
        totalPrizes,
      });

    } catch (error) {
      logger.error('Error fetching challenges', { component: 'useChallengesData', action: 'fetchChallenges' }, error as Error);
      toast({
        title: t('fetch_error', 'خطأ في جلب البيانات'),
        description: t('challenges_fetch_error', 'حدث خطأ أثناء جلب بيانات التحديات'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    stats,
    refetch: fetchChallenges,
  };
};