import { useState, useEffect } from 'react';
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

interface EnhancedChallengesHeroProps {
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

export const EnhancedChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  totalParticipants,
  totalPrizes = 0,
  onCreateChallenge,
  onShowFilters,
  featuredChallenge
}: EnhancedChallengesHeroProps) => {
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
    { icon: Target, value: totalChallenges, label: isRTL ? 'تحدي' : 'challenges', color: 'text-blue-400' },
    { icon: Award, value: activeChallenges, label: isRTL ? 'نشط' : 'active', color: 'text-green-400' },
    { icon: Users, value: `${Math.floor(totalParticipants / 1000)}K+`, label: isRTL ? 'مشارك' : 'participants', color: 'text-purple-400' },
    { icon: Trophy, value: `${Math.floor(totalPrizes / 1000000)}M+`, label: isRTL ? 'ر.س' : 'SAR', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients and enhanced contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40" />
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
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'منصة التحديات المبتكرة' : 'Innovation Challenges Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">التحديات</span> المبتكرة
                    </>
                  ) : (
                    <>
                      Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Innovation</span> Challenges
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
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
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
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
                  variant="hero-primary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'إنشاء تحدي جديد' : 'Create New Challenge'}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="hero-secondary"
                size="lg"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفية متقدمة' : 'Advanced Filters'}
              </Button>

              <Button
                variant="hero-ghost"
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
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
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
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <Target className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500/90 text-white border-0 animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        {featuredChallenge.daysLeft} {isRTL ? 'أيام متبقية' : 'days left'}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500/90 text-white border-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'رائج' : 'Trending'}
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
                          {featuredChallenge.participants}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'مشارك' : 'participants'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-300">
                          {Math.floor(featuredChallenge.prize / 1000)}K
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'ر.س جائزة' : 'SAR prize'}</div>
                      </div>
                    </div>

                    <Progress 
                      value={(featuredChallenge.participants / 1000) * 100} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      {isRTL ? 'اعرض التفاصيل' : 'View Details'}
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
                    {isRTL ? 'لا يوجد تحدي مميز حالياً' : 'No Featured Challenge'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {isRTL ? 'سيتم عرض التحديات المميزة هنا' : 'Featured challenges will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'التحديات القادمة' : 'Upcoming'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '5 تحديات' : '5 challenges'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'المفضلة' : 'Favorites'}
                  </div>
                  <div className="text-xs text-white/70">
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