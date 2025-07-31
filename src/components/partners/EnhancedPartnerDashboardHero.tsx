import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Users, 
  Trophy, 
  TrendingUp, 
  Award, 
  Handshake, 
  Plus, 
  Filter,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Calendar,
  Building
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface PartnerDashboardHeroProps {
  userProfile?: any;
  stats: {
    activePartnerships: number;
    supportedProjects: number;
    totalInvestment: number;
    partnershipScore: number;
  };
  onNavigate: (path: string) => void;
  onCreatePartnership?: () => void;
  onShowOpportunities?: () => void;
}

export const EnhancedPartnerDashboardHero = ({ 
  userProfile,
  stats,
  onNavigate,
  onCreatePartnership,
  onShowOpportunities
}: PartnerDashboardHeroProps) => {
  const { isRTL } = useDirection();
  const [currentStat, setCurrentStat] = useState(0);

  const partnerStats = [
    { icon: Handshake, value: stats.activePartnerships, label: isRTL ? 'شراكة نشطة' : 'active partnerships', color: 'text-blue-400' },
    { icon: Target, value: stats.supportedProjects, label: isRTL ? 'مشروع مدعوم' : 'supported projects', color: 'text-green-400' },
    { icon: Award, value: `${Math.floor(stats.totalInvestment / 1000)}K`, label: isRTL ? 'ر.س استثمار' : 'SAR invested', color: 'text-purple-400' },
    { icon: Trophy, value: `${stats.partnershipScore}%`, label: isRTL ? 'نتيجة الشراكة' : 'partnership score', color: 'text-yellow-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % partnerStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partnerStats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
                  {isRTL ? 'لوحة تحكم الشريك' : 'Partner Dashboard'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      أهلاً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">منصة الشراكات</span>
                    </>
                  ) : (
                    <>
                      Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Partnership</span> Hub
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'اكتشف فرص الشراكة الجديدة وادعم المشاريع المبتكرة التي تساهم في تحقيق رؤية 2030'
                    : 'Discover new partnership opportunities and support innovative projects that contribute to Vision 2030'
                  }
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partnerStats.map((stat, index) => {
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
                onClick={onCreatePartnership}
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isRTL ? 'إنشاء شراكة جديدة' : 'Create New Partnership'}
              </Button>
              
              <Button
                onClick={onShowOpportunities}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {isRTL ? 'استكشاف الفرص' : 'Explore Opportunities'}
              </Button>

              <Button
                onClick={() => onNavigate('/challenges')}
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Target className="w-5 h-5 mr-2" />
                {isRTL ? 'تصفح التحديات' : 'Browse Challenges'}
              </Button>
            </div>
          </div>

          {/* Enhanced Partnership Overview */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isRTL ? 'تقييم الشراكة' : 'Partnership Rating'}
                  </h3>
                  <div className="text-3xl font-bold text-yellow-300 mb-4">
                    {stats.partnershipScore}%
                  </div>
                  <Progress 
                    value={stats.partnershipScore} 
                    className="h-3 bg-white/20"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">{isRTL ? 'شراكات نشطة' : 'Active Partnerships'}</span>
                    <span className="text-white font-semibold">{stats.activePartnerships}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">{isRTL ? 'مشاريع مدعومة' : 'Supported Projects'}</span>
                    <span className="text-white font-semibold">{stats.supportedProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">{isRTL ? 'إجمالي الاستثمار' : 'Total Investment'}</span>
                    <span className="text-white font-semibold">{Math.floor(stats.totalInvestment / 1000)}K SAR</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onNavigate('/partner-profile')}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  {isRTL ? 'عرض الملف الشخصي' : 'View Profile'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => onNavigate('/events')}
              >
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'الفعاليات' : 'Events'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '5 فعاليات قادمة' : '5 upcoming'}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => onNavigate('/ideas')}
              >
                <CardContent className="p-4 text-center">
                  <Building className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {isRTL ? 'المشاريع' : 'Projects'}
                  </div>
                  <div className="text-xs text-white/70">
                    {isRTL ? '12 مشروع' : '12 projects'}
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