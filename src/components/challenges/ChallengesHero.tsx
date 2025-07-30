import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Trophy, TrendingUp, Award, Zap, Sparkles, Calendar, Clock } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useState, useEffect } from 'react';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string | React.ReactElement;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count}</>;
};

const StatCard = ({ icon: Icon, value, label, trend, trendUp }: StatCardProps) => (
  <Card className="hover-scale animate-fade-in bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardContent className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-white/30 to-white/20 rounded-full shadow-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      <div className="text-white/80 text-sm mb-2">{label}</div>
      {trend && (
        <div className={`flex items-center justify-center gap-1 text-xs ${
          trendUp ? 'text-green-300' : 'text-red-300'
        }`}>
          <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Featured Challenge Card Component
const FeaturedChallenge = ({ isRTL }: { isRTL: boolean }) => (
  <Card className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border-white/30 hover-scale">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
          <Sparkles className="w-3 h-3 mr-1" />
          {isRTL ? 'رائج الآن' : 'Trending Now'}
        </Badge>
        <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
          <Clock className="w-3 h-3 mr-1" />
          {isRTL ? '٣٥ يوم متبقي' : '35 Days Left'}
        </Badge>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {isRTL ? 'تطوير منصة ذكية لإدارة النفايات' : 'Smart Waste Management Platform'}
      </h3>
      <p className="text-white/80 text-sm mb-4">
        {isRTL 
          ? 'حل مبتكر باستخدام الذكاء الاصطناعي وإنترنت الأشياء...'
          : 'Innovative solution using AI and IoT technologies...'
        }
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            127 {isRTL ? 'مشارك' : 'participants'}
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            500K ريال
          </span>
        </div>
        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
          {isRTL ? 'شاهد التفاصيل' : 'View Details'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface ChallengesHeroProps {
  totalChallenges: number;
  activeChallenges: number;
  totalParticipants: number;
  totalPrizes: number;
}

export const ChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  totalParticipants, 
  totalPrizes 
}: ChallengesHeroProps) => {
  const { isRTL } = useDirection();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary-variant">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {isRTL ? 'اكتشف التحديات المبتكرة' : 'Discover Innovation Challenges'}
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            {isRTL 
              ? 'انضم إلى مجتمع المبتكرين وشارك في حل التحديات التي تشكل مستقبل المملكة العربية السعودية ورؤية 2030'
              : 'Join the innovators community and participate in solving challenges that shape the future of Saudi Arabia and Vision 2030'
            }
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
          <StatCard 
            icon={Target}
            value={<AnimatedCounter target={totalChallenges} />}
            label={isRTL ? 'إجمالي التحديات' : 'Total Challenges'}
            trend={isRTL ? '+12% هذا الشهر' : '+12% this month'}
            trendUp={true}
          />
          
          <StatCard 
            icon={Award}
            value={<AnimatedCounter target={activeChallenges} />}
            label={isRTL ? 'تحديات نشطة' : 'Active Challenges'}
            trend={isRTL ? '+5 جديدة' : '+5 new'}
            trendUp={true}
          />
          
          <StatCard 
            icon={Users}
            value={`${Math.floor(totalParticipants / 1000)}K+`}
            label={isRTL ? 'مشارك نشط' : 'Active Participants'}
            trend={isRTL ? '+250 هذا الأسبوع' : '+250 this week'}
            trendUp={true}
          />
          
          <StatCard 
            icon={Trophy}
            value={`${Math.floor(totalPrizes / 1000000)}M ريال`}
            label={isRTL ? 'إجمالي الجوائز' : 'Total Prizes'}
            trend={isRTL ? 'متاح الآن' : 'available now'}
            trendUp={true}
          />
        </div>

        {/* Featured Challenge */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isRTL ? 'التحدي المميز' : 'Featured Challenge'}
            </h2>
            <p className="text-white/70">
              {isRTL ? 'اكتشف أحدث التحديات المثيرة' : 'Discover the latest exciting challenges'}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FeaturedChallenge isRTL={isRTL} />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex gap-4">
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors hover-scale">
              {isRTL ? 'استكشف التحديات' : 'Explore Challenges'}
            </button>
            <button className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30">
              {isRTL ? 'إنشاء تحدي جديد' : 'Create New Challenge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};