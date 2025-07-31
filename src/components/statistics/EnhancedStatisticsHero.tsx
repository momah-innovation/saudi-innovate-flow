import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Play,
  Star,
  ArrowRight,
  Sparkles,
  PieChart,
  Activity
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface EnhancedStatisticsHeroProps {
  totalIdeas: number;
  totalChallenges: number;
  totalEvents: number;
  totalUsers: number;
  onShowFilters: () => void;
  onExportData: () => void;
  isAdmin?: boolean;
}

export const EnhancedStatisticsHero = ({ 
  totalIdeas, 
  totalChallenges, 
  totalEvents,
  totalUsers,
  onShowFilters,
  onExportData,
  isAdmin = false
}: EnhancedStatisticsHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Target, value: totalIdeas, label: isRTL ? 'فكرة' : 'ideas', color: 'text-blue-400' },
    { icon: Award, value: totalChallenges, label: isRTL ? 'تحدي' : 'challenges', color: 'text-green-400' },
    { icon: Activity, value: totalEvents, label: isRTL ? 'فعالية' : 'events', color: 'text-purple-400' },
    { icon: Users, value: `${Math.floor(totalUsers / 1000)}K+`, label: isRTL ? 'مستخدم' : 'users', color: 'text-yellow-400' }
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
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('/dashboard-images/analytics-charts.jpg')] opacity-10 bg-cover bg-center" />
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
                  {isRTL ? 'مركز التحليلات المتقدم' : 'Advanced Analytics Center'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      تحليلات <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">الابتكار</span> الذكية
                    </>
                  ) : (
                    <>
                      Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Innovation</span> Analytics
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'اكتشف الرؤى العميقة والبيانات المتقدمة لقياس أداء منصة الابتكار ومتابعة التقدم نحو رؤية 2030'
                    : 'Discover deep insights and advanced data to measure innovation platform performance and track progress towards Vision 2030'
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
                onClick={onExportData}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                {isRTL ? 'تصدير التقارير' : 'Export Reports'}
              </Button>
              
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
                {isRTL ? 'عرض توضيحي' : 'View Demo'}
              </Button>
            </div>
          </div>

          {/* Enhanced Analytics Dashboard Preview */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Dashboard Preview */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src="/dashboard-images/innovation-metrics.jpg" 
                    alt="Analytics Dashboard"
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500/90 text-white border-0 animate-pulse">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {isRTL ? 'مباشر' : 'Live'}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/90 text-white border-0">
                      <PieChart className="w-3 h-3 mr-1" />
                      {isRTL ? 'تفاعلي' : 'Interactive'}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {isRTL ? 'لوحة التحكم التفاعلية' : 'Interactive Dashboard'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        85%
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'معدل النجاح' : 'success rate'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">
                        24/7
                      </div>
                      <div className="text-sm text-white/70">{isRTL ? 'متابعة مستمرة' : 'monitoring'}</div>
                    </div>
                  </div>

                  <Progress 
                    value={85} 
                    className="h-2 bg-white/20"
                  />

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    {isRTL ? 'عرض التحليلات' : 'View Analytics'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Analytics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'نمو المنصة' : 'Platform Growth'}
                  </div>
                  <div className="text-xs text-white/70">
                    +12.5% {isRTL ? 'هذا الشهر' : 'this month'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'معدل التنفيذ' : 'Implementation Rate'}
                  </div>
                  <div className="text-xs text-white/70">
                    78% {isRTL ? 'مكتمل' : 'completed'}
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