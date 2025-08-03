import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Users, 
  Trophy,
  Target,
  Star,
  ArrowRight,
  Lightbulb,
  Zap,
  BookmarkIcon,
  ChevronRight
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getPriorityMapping, challengesPageConfig } from '@/config/challengesPageConfig';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  challenge_type: string;
  participants: number;
  estimated_budget: number;
  priority_level: string;
  status: string;
  end_date: string;
  image_url?: string;
}

interface ChallengeRecommendationsProps {
  onChallengeSelect: (challenge: Challenge) => void;
  className?: string;
}

export const ChallengeRecommendations = ({ 
  onChallengeSelect, 
  className = "" 
}: ChallengeRecommendationsProps) => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Challenge[]>([]);
  const [personalizedChallenges, setPersonalizedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Get trending challenges
      const { data: trending, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('estimated_budget', { ascending: false })
        .limit(3);

      if (error) throw error;

      // Get participant counts for each challenge
      const trendingWithCounts = await Promise.all(
        (trending || []).map(async (challenge) => {
          const { count } = await supabase
            .from('challenge_participants')
            .select('*', { count: 'exact' })
            .eq('challenge_id', challenge.id);

          return {
            ...challenge,
            participants: count || 0
          };
        })
      );

      setRecommendations(trendingWithCounts);

      // If user is logged in, get personalized recommendations
      if (user) {
        const { data: userChallenges } = await supabase
          .from('challenge_participants')
          .select('challenge_id')
          .eq('user_id', user.id);

        const participatedChallengeIds = userChallenges?.map(c => c.challenge_id) || [];

        // Get challenges user hasn't participated in
        const { data: personalized } = await supabase
          .from('challenges')
          .select('*')
          .eq('status', 'active')
          .not('id', 'in', `(${participatedChallengeIds.join(',') || 'null'})`)
          .limit(2);

        if (personalized) {
          const personalizedWithCounts = await Promise.all(
            personalized.map(async (challenge) => {
              const { count } = await supabase
                .from('challenge_participants')
                .select('*', { count: 'exact' })
                .eq('challenge_id', challenge.id);

              return {
                ...challenge,
                participants: count || 0
              };
            })
          );
          setPersonalizedChallenges(personalizedWithCounts);
        }
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrize = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  const getDaysLeft = (endDate: string) => {
    const deadline = new Date(endDate);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getPriorityIcon = (priority: string) => {
    const mapping = getPriorityMapping(priority);
    const IconComponent = mapping.value === 'عالي' || mapping.value === 'High' ? Zap : 
                        mapping.value === 'متوسط' || mapping.value === 'Medium' ? Target : Star;
    const colorClass = mapping.value === 'عالي' || mapping.value === 'High' ? challengesPageConfig.ui.colors.stats.red :
                      mapping.value === 'متوسط' || mapping.value === 'Medium' ? challengesPageConfig.ui.colors.stats.yellow :
                      challengesPageConfig.ui.colors.stats.green;
    return <IconComponent className={`w-4 h-4 ${colorClass}`} />;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trending Challenges */}
      <Card className={`border-primary/20 ${challengesPageConfig.ui.gradients.warning}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${challengesPageConfig.ui.colors.stats.orange}`}>
            <TrendingUp className={`w-5 h-5 ${challengesPageConfig.ui.colors.stats.orange}`} />
            {isRTL ? 'التحديات الرائجة' : 'Trending Challenges'}
            <Badge variant="secondary" className={`ml-auto ${challengesPageConfig.ui.colors.background.secondary} ${challengesPageConfig.ui.colors.stats.orange}`}>
              {recommendations.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className={`w-12 h-12 mx-auto ${challengesPageConfig.ui.colors.stats.orange} mb-4`} />
              <p className={`${challengesPageConfig.ui.colors.stats.orange} text-sm`}>
                {isRTL ? 'لا توجد تحديات رائجة حالياً' : 'No trending challenges right now'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((challenge) => (
                <div 
                  key={challenge.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${challengesPageConfig.ui.glassMorphism.card} ${challengesPageConfig.ui.effects.interactive} group border border-primary/20`}
                  onClick={() => onChallengeSelect(challenge)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${challengesPageConfig.ui.gradients.warning} flex items-center justify-center text-white text-sm font-bold`}>
                      {getPriorityIcon(challenge.priority_level)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold line-clamp-1 group-hover:${challengesPageConfig.ui.colors.stats.orange} transition-colors`}>
                      {challenge.title_ar}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{challenge.participants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>{formatPrize(challenge.estimated_budget || 0)} {isRTL ? 'ر.س' : 'SAR'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{getDaysLeft(challenge.end_date)} {isRTL ? 'يوم' : 'days'}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 ${challengesPageConfig.ui.colors.stats.orange} group-hover:text-primary transition-colors`} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {user && personalizedChallenges.length > 0 && (
        <Card className={`border-primary/20 ${challengesPageConfig.ui.gradients.featured}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${challengesPageConfig.ui.colors.stats.purple}`}>
              <Sparkles className={`w-5 h-5 ${challengesPageConfig.ui.colors.stats.purple}`} />
              {isRTL ? 'مقترحة لك' : 'Recommended for You'}
              <Badge variant="secondary" className={`ml-auto ${challengesPageConfig.ui.colors.background.secondary} ${challengesPageConfig.ui.colors.stats.purple}`}>
                {personalizedChallenges.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personalizedChallenges.map((challenge) => (
                <div 
                  key={challenge.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${challengesPageConfig.ui.glassMorphism.card} ${challengesPageConfig.ui.effects.interactive} group border border-primary/20`}
                  onClick={() => onChallengeSelect(challenge)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ${challengesPageConfig.ui.gradients.featured} flex items-center justify-center`}>
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold line-clamp-1 group-hover:${challengesPageConfig.ui.colors.stats.purple} transition-colors`}>
                      {challenge.title_ar}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {challenge.description_ar}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {challenge.challenge_type}
                      </Badge>
                      <div className={`text-xs ${challengesPageConfig.ui.colors.stats.purple} font-medium`}>
                        {isRTL ? 'مطابق لاهتماماتك' : 'Matches your interests'}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 ${challengesPageConfig.ui.colors.stats.purple} group-hover:text-primary transition-colors`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className={`border-primary/20 ${challengesPageConfig.ui.gradients.info}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${challengesPageConfig.ui.colors.background.primary} flex items-center justify-center`}>
                <BookmarkIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`text-sm font-medium ${challengesPageConfig.ui.colors.stats.blue}`}>
                  {isRTL ? 'التحديات المحفوظة' : 'Saved Challenges'}
                </div>
                <div className={`text-xs ${challengesPageConfig.ui.colors.stats.blue}`}>
                  {isRTL ? 'اعرض قائمة المفضلة' : 'View your bookmarks'}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className={`${challengesPageConfig.ui.colors.stats.blue} hover:text-primary`}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};