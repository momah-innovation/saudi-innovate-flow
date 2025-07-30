import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Trophy, TrendingUp, Award, Zap } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ icon: Icon, value, label, trend, trendUp }: StatCardProps) => (
  <Card className="hover-scale animate-fade-in bg-white/10 backdrop-blur-sm border-white/20">
    <CardContent className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-white/20 rounded-full">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <StatCard 
            icon={Target}
            value={totalChallenges.toString()}
            label={isRTL ? 'إجمالي التحديات' : 'Total Challenges'}
            trend={isRTL ? '+12% هذا الشهر' : '+12% this month'}
            trendUp={true}
          />
          
          <StatCard 
            icon={Award}
            value={activeChallenges.toString()}
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