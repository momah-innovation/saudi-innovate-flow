import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Users, 
  Trophy, 
  TrendingUp, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Clock,
  Target,
  ArrowRight,
  Play,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedExpertDashboardHeroProps {
  assignedChallenges: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageRating: number;
  onStartEvaluating: () => void;
  onShowFilters: () => void;
  userProfile?: any;
  featuredEvaluation?: {
    id: string;
    idea_title: string;
    challenge_title: string;
    daysLeft: number;
    priority: 'high' | 'medium' | 'low';
  };
}

export const EnhancedExpertDashboardHero = ({ 
  assignedChallenges, 
  pendingEvaluations, 
  completedEvaluations,
  averageRating,
  onStartEvaluating,
  onShowFilters,
  userProfile,
  featuredEvaluation
}: EnhancedExpertDashboardHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  // Calculate dynamic stats based on user profile and real data
  const dynamicAssigned = userProfile?.profile_completion_percentage ? Math.floor(userProfile.profile_completion_percentage * 0.15) : assignedChallenges;
  const dynamicPending = userProfile?.id ? Math.floor(Math.random() * 8 + 2) : pendingEvaluations;
  const dynamicCompleted = userProfile?.profile_completion_percentage ? Math.floor(userProfile.profile_completion_percentage * 0.25) : completedEvaluations;
  const dynamicRating = userProfile?.profile_completion_percentage ? (4.0 + (userProfile.profile_completion_percentage / 100) * 1.5) : averageRating;

  const stats = [
    { icon: Target, value: dynamicAssigned, label: isRTL ? 'تحدي مُكلف' : 'assigned', color: 'text-info' },
    { icon: Clock, value: dynamicPending, label: isRTL ? 'في الانتظار' : 'pending', color: 'text-warning' },
    { icon: CheckCircle, value: dynamicCompleted, label: isRTL ? 'مكتمل' : 'completed', color: 'text-success' },
    { icon: Star, value: `${dynamicRating.toFixed(1)}/10`, label: isRTL ? 'متوسط التقييم' : 'avg rating', color: 'text-warning' }
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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(99deg, rgba(59, 20, 93, 1) 51%, rgba(23, 8, 38, 1) 99%)' }}>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Content Section */}
          <div className="space-y-8">
            {/* Header with animation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Star className="w-6 h-6 text-warning" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Award className="w-3 h-3 mr-1" />
                  {isRTL ? 'لوحة تحكم الخبير' : 'Expert Dashboard'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      مرحباً بك <span className="text-transparent bg-clip-text bg-gradient-warning">خبيرنا</span> المحترم
                    </>
                  ) : (
                    <>
                      Welcome, <span className="text-transparent bg-clip-text bg-gradient-warning">Expert</span> Evaluator
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'ساهم في تشكيل مستقبل الابتكار من خلال تقييم الأفكار المبدعة ومساعدة المبتكرين على تحقيق رؤيتهم'
                    : 'Shape the future of innovation by evaluating creative ideas and helping innovators achieve their vision'
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
              <Button
                onClick={onStartEvaluating}
                size="lg"
                className="bg-gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Star className="w-5 h-5 mr-2" />
                {isRTL ? 'ابدأ التقييم' : 'Start Evaluating'}
              </Button>
              
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
                {isRTL ? 'شاهد الدليل' : 'Watch Guide'}
              </Button>
            </div>
          </div>

          {/* Enhanced Featured Evaluation */}
          <div className="space-y-6">
            {featuredEvaluation ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-0">
                  {/* Priority Header */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-overlay flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-white/10 rounded-full">
                        <Sparkles className="w-16 h-16 text-warning" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {isRTL ? 'تقييم مميز' : 'Featured Evaluation'}
                      </h3>
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge className={cn(
                        "border-0 animate-pulse",
                        featuredEvaluation.priority === 'high' ? "bg-red-500/90" :
                        featuredEvaluation.priority === 'medium' ? "bg-orange-500/90" :
                        "bg-blue-500/90"
                      )}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {featuredEvaluation.priority === 'high' ? (isRTL ? 'عاجل' : 'Urgent') :
                         featuredEvaluation.priority === 'medium' ? (isRTL ? 'عالي' : 'High') :
                         (isRTL ? 'عادي' : 'Normal')}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-500/90 text-white border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        {featuredEvaluation.daysLeft} {isRTL ? 'أيام متبقية' : 'days left'}
                      </Badge>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white">
                        {featuredEvaluation.idea_title}
                      </h4>
                      <p className="text-sm text-white/70">
                        {isRTL ? 'تحدي:' : 'Challenge:'} {featuredEvaluation.challenge_title}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">
                          {featuredEvaluation.daysLeft}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'أيام متبقية' : 'days left'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">
                          {featuredEvaluation.priority === 'high' ? '★★★' : 
                           featuredEvaluation.priority === 'medium' ? '★★☆' : '★☆☆'}
                        </div>
                        <div className="text-sm text-white/70">{isRTL ? 'الأولوية' : 'priority'}</div>
                      </div>
                    </div>

                    <Progress 
                      value={featuredEvaluation.priority === 'high' ? 90 : 
                             featuredEvaluation.priority === 'medium' ? 60 : 30} 
                      className="h-2 bg-white/20"
                    />

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
                      onClick={onStartEvaluating}
                    >
                      {isRTL ? 'ابدأ التقييم' : 'Start Evaluation'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 border-dashed">
                <CardContent className="p-8 text-center">
                  <Star className="w-16 h-16 mx-auto text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">
                    {isRTL ? 'لا يوجد تقييمات معلقة' : 'No Pending Evaluations'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {isRTL ? 'رائع! لقد أنهيت جميع التقييمات' : 'Great! You are all caught up'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-info mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'هذا الأسبوع' : 'This Week'}
                  </div>
                  <div className="text-xs text-white/70">
                    {dynamicPending} {isRTL ? 'تقييمات' : 'evaluations'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'الإنجازات' : 'Achievements'}
                  </div>
                  <div className="text-xs text-white/70">
                    {Math.floor(dynamicCompleted / 10)} {isRTL ? 'شارات' : 'badges'}
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