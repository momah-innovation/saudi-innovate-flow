import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Brain,
  Rocket
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedIdeasHeroProps {
  totalIdeas: number;
  publishedIdeas: number;
  totalViews: number;
  totalLikes?: number;
  onCreateIdea: () => void;
  onShowFilters: () => void;
  canCreateIdea?: boolean;
  featuredIdea?: {
    id: string;
    title_ar: string;
    views: number;
    likes: number;
    innovator: string;
    image?: string;
  };
}

export const EnhancedIdeasHero = ({ 
  totalIdeas, 
  publishedIdeas, 
  totalViews,
  totalLikes = 0,
  onCreateIdea,
  onShowFilters,
  canCreateIdea = true,
  featuredIdea
}: EnhancedIdeasHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Lightbulb, value: totalIdeas, label: isRTL ? 'فكرة' : 'ideas', color: 'text-yellow-400' },
    { icon: Award, value: publishedIdeas, label: isRTL ? 'منشورة' : 'published', color: 'text-green-400' },
    { icon: Users, value: `${Math.floor(totalViews / 1000)}K+`, label: isRTL ? 'مشاهدة' : 'views', color: 'text-blue-400' },
    { icon: TrendingUp, value: `${Math.floor(totalLikes / 100)}K+`, label: isRTL ? 'إعجاب' : 'likes', color: 'text-pink-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('/idea-images/lightbulb-innovation.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-orange-400/5 rounded-full blur-2xl animate-bounce" />
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
                  {isRTL ? 'منصة الأفكار الإبداعية' : 'Creative Ideas Platform'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">الأفكار</span> المبدعة
                    </>
                  ) : (
                    <>
                      Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Creative</span> Ideas
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'انضم إلى مجتمع المبدعين وشارك أفكارك المبتكرة التي تساهم في تحقيق رؤية المملكة 2030'
                    : 'Join the innovators community and share your creative ideas that contribute to achieving Saudi Vision 2030'
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
              {canCreateIdea && (
                <Button
                  onClick={onCreateIdea}
                  size="lg"
                  className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'إضافة فكرة جديدة' : 'Submit New Idea'}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفية متقدمة' : 'Advanced Filters'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                {isRTL ? 'شاهد الفيديو' : 'Watch Demo'}
              </Button>
            </div>
          </div>

          {/* Enhanced Featured Idea */}
          <div className="space-y-6">
            {featuredIdea ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-0">
                  {/* Idea Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {featuredIdea.image ? (
                      <img 
                        src={featuredIdea.image} 
                        alt={featuredIdea.title_ar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                        <Brain className="w-16 h-16 text-white/60" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500/90 text-white border-0 animate-pulse">
                        <Star className="w-3 h-3 mr-1" />
                        {isRTL ? 'فكرة مميزة' : 'Featured'}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500/90 text-white border-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {isRTL ? 'رائجة' : 'Trending'}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {featuredIdea.title_ar}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">
                          {featuredIdea.views}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'مشاهدة' : 'views'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-300">
                          {featuredIdea.likes}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'إعجاب' : 'likes'}</div>
                      </div>
                    </div>

                    <div className="text-center text-white/80">
                      <span className="text-sm">{isRTL ? 'من:' : 'By:'} {featuredIdea.innovator}</span>
                    </div>

                    <Progress 
                      value={(featuredIdea.views / 1000) * 100} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
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
                  <Lightbulb className="w-16 h-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">
                    {isRTL ? 'لا توجد فكرة مميزة حالياً' : 'No Featured Idea'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {isRTL ? 'سيتم عرض الأفكار المميزة هنا' : 'Featured ideas will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Rocket className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'الأفكار الجديدة' : 'New Ideas'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '12 فكرة' : '12 ideas'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'قيد التطوير' : 'In Development'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '8 مشاريع' : '8 projects'}
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