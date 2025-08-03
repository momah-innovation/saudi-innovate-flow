import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp,
  Trophy,
  Target,
  Users,
  Clock,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { getPriorityMapping, getCategoryMapping } from '@/config/challengesPageConfig';

interface TrendingChallenge {
  id: string;
  title_ar: string;
  challenge_type: string;
  participants: number;
  estimated_budget: number;
  priority_level: string;
  status: string;
  end_date: string;
  image_url?: string;
}

interface ChallengeTrendingWidgetProps {
  onChallengeSelect?: (challengeId: string) => void;
  onChallengeClick?: (challenge: any) => void;
  className?: string;
}

export const ChallengeTrendingWidget = ({ 
  onChallengeSelect, 
  onChallengeClick,
  className = "" 
}: ChallengeTrendingWidgetProps) => {
  const { isRTL } = useDirection();
  const [trendingChallenges, setTrendingChallenges] = useState<TrendingChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingChallenges();
  }, []);

  const loadTrendingChallenges = async () => {
    try {
      setLoading(true);
      
      // Get challenges with high participation and recent activity
      const { data: challenges, error } = await supabase
        .from('challenges')
        .select('*')
        .gte('end_date', new Date().toISOString().split('T')[0])
        .eq('status', 'active')
        .order('estimated_budget', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Get participant counts for each challenge
      const challengesWithCounts = await Promise.all(
        (challenges || []).map(async (challenge) => {
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

      // Sort by participants and budget
      const sorted = challengesWithCounts.sort((a, b) => {
        const scoreA = (a.participants * 10) + (a.estimated_budget || 0) / 1000;
        const scoreB = (b.participants * 10) + (b.estimated_budget || 0) / 1000;
        return scoreB - scoreA;
      });

      setTrendingChallenges(sorted);
      
    } catch (error) {
      console.error('Error loading trending challenges:', error);
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

  const getPriorityColor = (priority: string) => {
    return getPriorityMapping(priority).color;
  };

  const getChallengeTypeIcon = (type: string) => {
    const mapping = getCategoryMapping(type);
    const IconComponent = mapping.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {isRTL ? 'التحديات الرائجة' : 'Trending Challenges'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          {isRTL ? 'التحديات الرائجة' : 'Trending Challenges'}
          <Badge variant="secondary" className="ml-auto">
            {trendingChallenges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingChallenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">
              {isRTL ? 'لا توجد تحديات رائجة حالياً' : 'No trending challenges right now'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingChallenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all cursor-pointer group border border-muted/50 hover:border-primary/20"
                onClick={() => {
                  onChallengeSelect?.(challenge.id);
                  onChallengeClick?.(challenge);
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {challenge.title_ar}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getChallengeTypeIcon(challenge.challenge_type)}
                      <span className="ml-1">{challenge.challenge_type}</span>
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(challenge.priority_level)}`}>
                      {challenge.priority_level}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{challenge.participants}</span>
                      <span className="text-muted-foreground">{isRTL ? 'مشارك' : 'participants'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{formatPrize(challenge.estimated_budget || 0)}</span>
                      <span className="text-muted-foreground">{isRTL ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{getDaysLeft(challenge.end_date)}</span>
                      <span className="text-muted-foreground">{isRTL ? 'يوم' : 'days'}</span>
                    </div>
                  </div>

                  {/* Trending Indicator */}
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-medium">
                        {isRTL ? 'رائج' : 'Trending'}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4 group"
              onClick={() => onChallengeSelect?.('all')}
            >
              <TrendingUp className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
              {isRTL ? 'عرض جميع التحديات' : 'View All Challenges'}
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};