import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Users, 
  Trophy, 
  TrendingUp, 
  Award, 
  Zap, 
  Plus, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface DashboardHeroProps {
  userProfile?: any;
  stats: {
    totalIdeas: number;
    activeChallenges: number;
    totalPoints: number;
    innovationScore: number;
  };
  onNavigate: (path: string) => void;
}

export const EnhancedDashboardHero = ({ 
  userProfile,
  stats,
  onNavigate
}: DashboardHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const dashboardStats = [
    { icon: Lightbulb, value: stats.totalIdeas, label: isRTL ? 'فكرة' : 'ideas', color: 'hero-stats-ideas' },
    { icon: Target, value: stats.activeChallenges, label: isRTL ? 'تحدي نشط' : 'active challenges', color: 'hero-stats-challenges' },
    { icon: Award, value: stats.totalPoints, label: isRTL ? 'نقطة' : 'points', color: 'hero-stats-score' },
    { icon: Trophy, value: `${stats.innovationScore}%`, label: isRTL ? 'نتيجة الابتكار' : 'innovation score', color: 'icon-star' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % dashboardStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dashboardStats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients and enhanced contrast */}
      <div className="absolute inset-0 bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('/dashboard-images/dashboard-hero.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 overlay-primary" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
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
                <div className="p-3 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20">
                  <Sparkles className="w-6 h-6 icon-sparkle" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary-foreground border-primary/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'لوحة تحكم المبتكر' : 'Innovator Dashboard'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                  {isRTL ? (
                    <>
                      مرحباً <span className="gradient-text-warning">{userProfile?.display_name || 'المبتكر'}</span>
                    </>
                  ) : (
                    <>
                      Welcome <span className="gradient-text-warning">{userProfile?.display_name || 'Innovator'}</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-primary-foreground/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'استمر في رحلة الابتكار وشارك في بناء مستقبل أفضل. لديك أفكار جديدة في انتظار التنفيذ'
                    : 'Continue your innovation journey and participate in building a better future. You have new ideas waiting to be implemented'
                  }
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-primary/5 backdrop-blur-sm border-primary/10 transition-all duration-500",
                      isActive && "bg-primary/10 border-primary/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                      <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate('/submit-idea')}
                variant="hero-primary"
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isRTL ? 'إضافة فكرة جديدة' : 'Submit New Idea'}
              </Button>
              
              <Button
                onClick={() => onNavigate('/challenges')}
                variant="hero-secondary"
                size="lg"
              >
                <Target className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفح التحديات' : 'Browse Challenges'}
              </Button>

              <Button
                onClick={() => onNavigate('/events')}
                variant="hero-ghost"
                size="lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {isRTL ? 'الفعاليات' : 'Events'}
              </Button>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="space-y-6">
            <Card className="bg-primary/10 backdrop-blur-xl border-primary/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">
                    {isRTL ? 'مستوى الابتكار' : 'Innovation Level'}
                  </h3>
                  <div className="text-3xl font-bold text-warning mb-4">
                    {stats.innovationScore}%
                  </div>
                  <Progress 
                    value={stats.innovationScore} 
                    className="h-3 bg-primary/20"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/80">{isRTL ? 'أفكار مقدمة' : 'Ideas Submitted'}</span>
                    <span className="text-primary-foreground font-semibold">{stats.totalIdeas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/80">{isRTL ? 'نقاط مكتسبة' : 'Points Earned'}</span>
                    <span className="text-primary-foreground font-semibold">{stats.totalPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-foreground/80">{isRTL ? 'تحديات نشطة' : 'Active Challenges'}</span>
                    <span className="text-primary-foreground font-semibold">{stats.activeChallenges}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onNavigate('/achievements')}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  {isRTL ? 'عرض الإنجازات' : 'View Achievements'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="bg-primary/5 backdrop-blur-sm border-primary/10 hover:bg-primary/10 transition-all cursor-pointer"
                onClick={() => onNavigate('/saved')}
              >
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 icon-star mx-auto mb-2" />
                  <div className="text-sm font-medium text-primary-foreground">
                    {isRTL ? 'المحفوظات' : 'Saved Items'}
                  </div>
                  <div className="text-xs text-primary-foreground/70">
                    {isRTL ? '12 عنصر' : '12 items'}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-primary/5 backdrop-blur-sm border-primary/10 hover:bg-primary/10 transition-all cursor-pointer"
                onClick={() => onNavigate('/evaluations')}
              >
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-innovation mx-auto mb-2" />
                  <div className="text-sm font-medium text-primary-foreground">
                    {isRTL ? 'التقييمات' : 'Evaluations'}
                  </div>
                  <div className="text-xs text-primary-foreground/70">
                    {isRTL ? '3 جديدة' : '3 new'}
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