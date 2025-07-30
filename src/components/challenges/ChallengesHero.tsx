import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Trophy, TrendingUp, Award, Zap, Plus, Filter } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface ChallengesHeroProps {
  totalChallenges: number;
  activeChallenges: number;
  totalParticipants: number;
  onCreateChallenge: () => void;
  onShowFilters: () => void;
}

export const ChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  totalParticipants,
  onCreateChallenge,
  onShowFilters
}: ChallengesHeroProps) => {
  const { isRTL } = useDirection();

  return (
    <div className="relative bg-gradient-to-r from-primary/90 via-primary to-primary/80 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {isRTL ? 'منصة التحديات' : 'Challenges Platform'}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isRTL ? 'اكتشف التحديات المبتكرة' : 'Discover Innovation Challenges'}
            </h1>
            
            <p className="text-lg text-white/90 mb-6 max-w-2xl">
              {isRTL 
                ? 'انضم إلى مجتمع المبتكرين وشارك في حل التحديات التي تشكل مستقبل المملكة ورؤية 2030'
                : 'Join the innovators community and participate in solving challenges that shape the future of Saudi Arabia and Vision 2030'
              }
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white/80" />
                <span className="font-semibold">{totalChallenges}</span>
                <span className="text-white/80">{isRTL ? 'تحدي' : 'challenges'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-white/80" />
                <span className="font-semibold">{activeChallenges}</span>
                <span className="text-white/80">{isRTL ? 'نشط' : 'active'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white/80" />
                <span className="font-semibold">{Math.floor(totalParticipants / 1000)}K+</span>
                <span className="text-white/80">{isRTL ? 'مشارك' : 'participants'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onCreateChallenge}
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isRTL ? 'إنشاء تحدي' : 'Create Challenge'}
              </Button>
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                {isRTL ? 'تصفية متقدمة' : 'Advanced Filters'}
              </Button>
            </div>
          </div>

          {/* Featured Challenge Preview - Similar to Events */}
          <div className="lg:w-80">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 mb-3">
                  {isRTL ? 'رائج الآن' : 'Trending Now'}
                </Badge>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isRTL ? 'تطوير منصة ذكية لإدارة النفايات' : 'Smart Waste Management Platform'}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {isRTL 
                    ? 'حل مبتكر باستخدام الذكاء الاصطناعي...'
                    : 'Innovative solution using AI technology...'
                  }
                </p>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{isRTL ? '127 مشارك' : '127 participants'}</span>
                  <span>{isRTL ? '35 يوم متبقي' : '35 days left'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};