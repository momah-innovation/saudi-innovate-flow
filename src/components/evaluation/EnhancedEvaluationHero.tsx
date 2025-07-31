import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardCheck, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus, 
  Filter,
  Play,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedEvaluationHeroProps {
  totalEvaluations: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  onCreateEvaluation: () => void;
  onShowFilters: () => void;
  canEvaluate?: boolean;
}

export const EnhancedEvaluationHero = ({ 
  totalEvaluations, 
  pendingEvaluations, 
  completedEvaluations,
  averageScore,
  onCreateEvaluation,
  onShowFilters,
  canEvaluate = false
}: EnhancedEvaluationHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: ClipboardCheck, value: totalEvaluations, label: isRTL ? 'تقييم' : 'evaluations', color: 'text-blue-400' },
    { icon: Clock, value: pendingEvaluations, label: isRTL ? 'معلق' : 'pending', color: 'text-orange-400' },
    { icon: CheckCircle, value: completedEvaluations, label: isRTL ? 'مكتمل' : 'completed', color: 'text-green-400' },
    { icon: Star, value: `${averageScore}/10`, label: isRTL ? 'متوسط النقاط' : 'avg score', color: 'text-yellow-400' }
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
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
        <div className="absolute inset-0 bg-[url('/dashboard-images/team-collaboration.jpg')] opacity-10 bg-cover bg-center" />
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
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {isRTL ? 'مركز التقييم المتقدم' : 'Advanced Evaluation Center'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      تقييمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">ذكية</span> وشاملة
                    </>
                  ) : (
                    <>
                      Smart & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Comprehensive</span> Evaluations
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'نظام تقييم متطور لقياس جودة الأفكار والمشاريع بمعايير علمية دقيقة ومؤشرات أداء محددة'
                    : 'Advanced evaluation system to measure the quality of ideas and projects with precise scientific criteria and specific performance indicators'
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
              {canEvaluate && (
                <Button
                  onClick={onCreateEvaluation}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isRTL ? 'تقييم جديد' : 'New Evaluation'}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                {isRTL ? 'دليل التقييم' : 'Evaluation Guide'}
              </Button>
            </div>
          </div>

          {/* Enhanced Evaluation Dashboard */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Evaluation Analytics */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-white/60" />
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500/90 text-white border-0 animate-pulse">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {isRTL ? 'تحليلات مباشرة' : 'Live Analytics'}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/90 text-white border-0">
                      <Users className="w-3 h-3 mr-1" />
                      {isRTL ? 'تقييم جماعي' : 'Collaborative'}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {isRTL ? 'لوحة التقييم التفاعلية' : 'Interactive Evaluation Dashboard'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        {Math.round((completedEvaluations / Math.max(totalEvaluations, 1)) * 100)}%
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'معدل الإنجاز' : 'completion rate'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        {averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'متوسط النقاط' : 'average score'}</div>
                    </div>
                  </div>

                  <Progress 
                    value={(completedEvaluations / Math.max(totalEvaluations, 1)) * 100} 
                    className="h-2 bg-white/20"
                  />

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                  >
                    {isRTL ? 'عرض التقييمات' : 'View Evaluations'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'في الانتظار' : 'Pending Review'}
                  </div>
                  <div className="text-xs text-white/70">
                    {pendingEvaluations} {isRTL ? 'تقييم' : 'evaluations'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'التقارير' : 'Reports'}
                  </div>
                  <div className="text-xs text-white/70">
                    {Math.round(totalEvaluations * 0.8)} {isRTL ? 'تقرير' : 'reports'}
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