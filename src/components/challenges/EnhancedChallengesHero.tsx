import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Calendar, 
  Award,
  Plus,
  Filter,
  Search,
  ChevronRight,
  Trophy,
  Clock,
  Eye,
  Star,
  ArrowRight,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface EnhancedChallengesHeroProps {
  totalChallenges: number;
  activeChallenges: number;
  participantsCount: number;
  completedChallenges: number;
  onCreateChallenge?: () => void;
  onShowFilters?: () => void;
  canCreateChallenge?: boolean;
  featuredChallenge?: {
    id: string;
    title_ar: string;
    participant_count: number;
    end_date: string;
  };
}

export const EnhancedChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  participantsCount,
  completedChallenges,
  onCreateChallenge,
  onShowFilters,
  canCreateChallenge = false,
  featuredChallenge
}: EnhancedChallengesHeroProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { hasRole } = useAuth();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Target, value: totalChallenges, label: isRTL ? 'تحدي' : 'challenges', color: 'text-blue-400', trend: '+12%' },
    { icon: TrendingUp, value: activeChallenges, label: isRTL ? 'نشط' : 'active', color: 'text-green-400', trend: '+8%' },
    { icon: Users, value: participantsCount, label: isRTL ? 'مشارك' : 'participants', color: 'text-purple-400', trend: '+25%' },
    { icon: Trophy, value: completedChallenges, label: isRTL ? 'مكتمل' : 'completed', color: 'text-yellow-400', trend: '+15%' }
  ];

  const { setInterval: scheduleInterval } = useTimerManager();

  React.useEffect(() => {
    const clearTimer = scheduleInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return clearTimer;
  }, [stats.length, scheduleInterval]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(99deg, rgba(59, 20, 93, 1) 51%, rgba(23, 8, 38, 1) 99%)' }}>
        <div className="absolute inset-0 bg-[url('/challenge-images/innovation.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Enhanced Content Section */}
          <div className="space-y-8">
            {/* Header with animation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Target className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'منصة تحديات الابتكار' : 'Innovation Challenges Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      اشترك في {' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                        التحديات
                      </span>
                      <br />
                      اصنع المستقبل
                    </>
                  ) : (
                    <>
                      Take on {' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                        Challenges
                      </span>
                      <br />
                      Shape the Future
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'انضم إلى المبدعين من جميع أنحاء العالم في حل التحديات الحقيقية والمساهمة في تحقيق رؤية السعودية 2030.'
                    : 'Join innovators worldwide in solving real-world challenges and contributing to Saudi Arabia\'s Vision 2030 transformation.'
                  }
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                      {stat.trend && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-green-400">{stat.trend}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onShowFilters}
                variant="gradient-primary"
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-5 h-5 mr-2" />
                {t('challenges.explore_challenges', 'Explore Challenges')}
              </Button>
              
              {canCreateChallenge && (
                <Button
                  onClick={onCreateChallenge}
                  variant="overlay-secondary"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('challenges.create_challenge', 'Create Challenge')}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="overlay-ghost"
                size="lg"
              >
                <Filter className="w-5 h-5 mr-2" />
                {t('challenges.advanced_filters', 'Advanced Filters')}
              </Button>
            </div>
          </div>

          {/* Enhanced Featured Challenge */}
          <div className="space-y-6">
            {featuredChallenge ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-0">
                  {/* Challenge Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                      <Target className="w-16 h-16 text-white/60" />
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500/90 text-white border-0 animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        {t('challenges.active', 'Active')}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500/90 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        {t('challenges.featured', 'Featured')}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {featuredChallenge.title_ar}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {featuredChallenge.participant_count}
                        </div>
                        <div className="text-sm text-white/70">{t('challenges.participants', 'participants')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">
                          {new Date(featuredChallenge.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-white/70">{t('challenges.end_date', 'end date')}</div>
                      </div>
                    </div>

                    <Progress 
                      value={(featuredChallenge.participant_count / 500) * 100} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full gradient-primary hover:opacity-90 text-white"
                    >
                      {t('challenges.view_details', 'View Details')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed">
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">
                    {t('challenges.no_featured_challenge', 'No Featured Challenge')}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {t('challenges.featured_will_appear', 'Featured challenges will appear here')}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Bookmark className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('challenges.saved_challenges', 'Saved Challenges')}
                  </div>
                  <div className="text-xs text-white/70">
                    {t('challenges.view_saved', 'View Saved')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('challenges.achievements', 'Achievements')}
                  </div>
                  <div className="text-xs text-white/70">
                    {t('challenges.my_achievements', 'My Achievements')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChallengesHero;