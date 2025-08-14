import { useState, useEffect } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Users, 
  Trophy, 
  TrendingUp, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Clock,
  Star,
  ArrowRight,
  Play,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { challengesPageConfig } from '@/config/challengesPageConfig';

interface ChallengesHeroProps {
  totalChallenges: number;
  activeChallenges: number;
  totalParticipants: number;
  totalPrizes?: number;
  onCreateChallenge?: () => void; // Make optional since not all users can create
  onShowFilters: () => void;
  featuredChallenge?: {
    id: string;
    title_ar: string;
    participants: number;
    prize: number;
    daysLeft: number;
    image?: string;
  };
}

export const ChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  totalParticipants,
  totalPrizes = 0,
  onCreateChallenge,
  onShowFilters,
  featuredChallenge
}: ChallengesHeroProps) => {
  const { isRTL } = useDirection();
  const { user, hasRole } = useAuth();
  const [currentStat, setCurrentStat] = useState(0);
  
  // Check if user can create challenges
  const canCreateChallenges = user && (
    hasRole('admin') || 
    hasRole('super_admin') || 
    hasRole('sector_lead') || 
    hasRole('challenge_manager')
  );

  const stats = [
    { icon: Target, value: totalChallenges, label: isRTL ? 'تحدي' : 'challenges', color: challengesPageConfig.ui.colors.stats.blue },
    { icon: Award, value: activeChallenges, label: isRTL ? 'نشط' : 'active', color: challengesPageConfig.ui.colors.stats.green },
    { icon: Users, value: `${Math.floor(totalParticipants / 1000)}K+`, label: isRTL ? 'مشارك' : 'participants', color: challengesPageConfig.ui.colors.stats.purple },
    { icon: Trophy, value: `${Math.floor(totalPrizes / 1000000)}M+`, label: isRTL ? 'ر.س' : 'SAR', color: challengesPageConfig.ui.colors.stats.yellow }
  ];

  const { setInterval: scheduleInterval } = useTimerManager();

  useEffect(() => {
    const cleanup = scheduleInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return cleanup;
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients and enhanced contrast */}
      <div className={`absolute inset-0 ${challengesPageConfig.ui.gradients.hero}`}>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className={`absolute inset-0 ${challengesPageConfig.ui.colors.background.overlay}`} />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${challengesPageConfig.ui.colors.background.overlay} rounded-full blur-3xl animate-pulse delay-1000`} />
        <div className={`absolute top-20 left-1/3 w-64 h-64 ${challengesPageConfig.ui.colors.background.overlay} rounded-full blur-2xl animate-bounce`} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Content Section */}
          <div className="space-y-8">
            {/* Header with animation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 ${challengesPageConfig.ui.glassMorphism.medium} rounded-xl border ${challengesPageConfig.ui.glassMorphism.light.split(' ').find(c => c.includes('border'))}`}>
                  <Sparkles className={`w-6 h-6 ${challengesPageConfig.ui.colors.stats.yellow}`} />
                </div>
                <Badge variant="secondary" className={`${challengesPageConfig.ui.glassMorphism.medium} ${challengesPageConfig.ui.colors.text.accent} border ${challengesPageConfig.ui.glassMorphism.light.split(' ').find(c => c.includes('border'))} backdrop-blur-sm`}>
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'منصة التحديات المبتكرة' : 'Innovation Challenges Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${challengesPageConfig.ui.colors.text.accent} leading-tight`}>
                  {isRTL ? (
                    <>
                       اكتشف <span className={`text-transparent bg-clip-text ${challengesPageConfig.ui.gradients.textHighlight}`}>التحديات</span> المبتكرة
                    </>
                  ) : (
                    <>
                      Discover <span className={`text-transparent bg-clip-text ${challengesPageConfig.ui.gradients.textHighlight}`}>Innovation</span> Challenges
                    </>
                  )}
                </h1>
                
                <p className={`text-xl ${challengesPageConfig.ui.colors.text.muted} max-w-2xl leading-relaxed`}>
                  {isRTL 
                    ? 'انضم إلى مجتمع المبدعين وشارك في حل التحديات التي تشكل مستقبل المملكة ورؤية 2030'
                    : 'Join the innovators community and participate in solving challenges that shape the future of Saudi Arabia and Vision 2030'
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
                      `${challengesPageConfig.ui.glassMorphism.light} transition-all duration-500`,
                      isActive && `${challengesPageConfig.ui.glassMorphism.medium} scale-105`
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className={`text-2xl font-bold ${challengesPageConfig.ui.colors.text.accent}`}>{stat.value}</div>
                      <div className={`text-sm ${challengesPageConfig.ui.colors.text.muted}`}>{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {/* Only show Create New Challenge button for authorized roles */}
              {canCreateChallenges && onCreateChallenge && (
                <Button
                  onClick={onCreateChallenge}
                  variant="gradient-primary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'إنشاء تحدي جديد' : 'Create New Challenge'}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="overlay-secondary"
                size="lg"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفية متقدمة' : 'Advanced Filters'}
              </Button>

              <Button
                variant="overlay-ghost"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {isRTL ? 'شاهد الفيديو' : 'Watch Demo'}
              </Button>
            </div>
          </div>

          {/* Enhanced Featured Challenge */}
          <div className="space-y-6">
            {featuredChallenge ? (
              <Card className={`${challengesPageConfig.ui.glassMorphism.heavy} shadow-2xl`}>
                <CardContent className="p-0">
                  {/* Challenge Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {featuredChallenge.image ? (
                      <img 
                        src={featuredChallenge.image} 
                        alt={featuredChallenge.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${challengesPageConfig.ui.gradients.featured} flex items-center justify-center`}>
                        <Target className={`w-16 h-16 ${challengesPageConfig.ui.colors.text.muted}`} />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className={`${challengesPageConfig.ui.gradients.danger} ${challengesPageConfig.ui.colors.text.accent} border-0 animate-pulse`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {featuredChallenge.daysLeft} {isRTL ? 'أيام متبقية' : 'days left'}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className={`${challengesPageConfig.ui.gradients.warning} ${challengesPageConfig.ui.colors.text.accent} border-0`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'رائج' : 'Trending'}
                      </Badge>
                    </div>

                    <div className={`absolute inset-0 ${challengesPageConfig.ui.colors.background.overlay}`} />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className={`text-xl font-bold ${challengesPageConfig.ui.colors.text.accent}`}>
                      {featuredChallenge.title_ar}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${challengesPageConfig.ui.colors.stats.purple}`}>
                          {featuredChallenge.participants}
                        </div>
                        <div className={`text-sm ${challengesPageConfig.ui.colors.text.muted}`}>{isRTL ? 'مشارك' : 'participants'}</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${challengesPageConfig.ui.colors.stats.yellow}`}>
                          {Math.floor(featuredChallenge.prize / 1000)}K
                        </div>
                        <div className={`text-sm ${challengesPageConfig.ui.colors.text.muted}`}>{isRTL ? 'ر.س جائزة' : 'SAR prize'}</div>
                      </div>
                    </div>

                    <Progress 
                      value={(featuredChallenge.participants / 1000) * 100} 
                      className={`h-2 ${challengesPageConfig.ui.glassMorphism.light.split(' ').find(c => c.includes('bg'))}`}
                    />

                    <Button 
                      className={`w-full ${challengesPageConfig.ui.gradients.button} ${challengesPageConfig.ui.gradients.buttonHover} ${challengesPageConfig.ui.colors.text.accent}`}
                    >
                      {isRTL ? 'اعرض التفاصيل' : 'View Details'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={`${challengesPageConfig.ui.glassMorphism.light} border-dashed`}>
                <CardContent className="p-8 text-center">
                  <Target className={`w-16 h-16 mx-auto ${challengesPageConfig.ui.colors.text.muted} mb-4`} />
                  <h3 className={`text-lg font-semibold ${challengesPageConfig.ui.colors.text.secondary} mb-2`}>
                    {isRTL ? 'لا يوجد تحدي مميز حالياً' : 'No Featured Challenge'}
                  </h3>
                  <p className={`${challengesPageConfig.ui.colors.text.muted} text-sm`}>
                    {isRTL ? 'سيتم عرض التحديات المميزة هنا' : 'Featured challenges will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className={`${challengesPageConfig.ui.glassMorphism.light} ${challengesPageConfig.ui.glassMorphism.cardHover} transition-all cursor-pointer`}>
                <CardContent className="p-4 text-center">
                  <Calendar className={`w-8 h-8 ${challengesPageConfig.ui.colors.stats.blue} mx-auto mb-2`} />
                  <div className={`text-sm font-medium ${challengesPageConfig.ui.colors.text.accent}`}>
                    {isRTL ? 'التحديات القادمة' : 'Upcoming'}
                  </div>
                  <div className={`text-xs ${challengesPageConfig.ui.colors.text.muted}`}>
                    {isRTL ? '5 تحديات' : '5 challenges'}
                  </div>
                </CardContent>
              </Card>

              <Card className={`${challengesPageConfig.ui.glassMorphism.light} ${challengesPageConfig.ui.glassMorphism.cardHover} transition-all cursor-pointer`}>
                <CardContent className="p-4 text-center">
                  <Star className={`w-8 h-8 ${challengesPageConfig.ui.colors.stats.yellow} mx-auto mb-2`} />
                  <div className={`text-sm font-medium ${challengesPageConfig.ui.colors.text.accent}`}>
                    {isRTL ? 'المفضلة' : 'Favorites'}
                  </div>
                  <div className={`text-xs ${challengesPageConfig.ui.colors.text.muted}`}>
                    {isRTL ? '12 محفوظة' : '12 saved'}
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