import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Calendar, 
  Award,
  Plus,
  Filter,
  Search,
  ChevronRight,
  Trophy,
  Clock,
  Eye
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface EnhancedChallengesHeroProps {
  totalChallenges: number;
  activeChallenges: number;
  participantsCount: number;
  completedChallenges: number;
  onCreateChallenge?: () => void;
  onShowFilters?: () => void;
  canCreateChallenge?: boolean;
  featuredChallenge?: {
    id: string;
    title_ar: string;
    participant_count: number;
    end_date: string;
  };
}

export const EnhancedChallengesHero = ({ 
  totalChallenges, 
  activeChallenges, 
  participantsCount,
  completedChallenges,
  onCreateChallenge,
  onShowFilters,
  canCreateChallenge = false,
  featuredChallenge
}: EnhancedChallengesHeroProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { hasRole } = useAuth();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    {
      label: 'إجمالي التحديات',
      value: totalChallenges,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12%'
    },
    {
      label: 'التحديات النشطة',
      value: activeChallenges,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+8%'
    },
    {
      label: 'إجمالي المشاركين',
      value: participantsCount,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+25%'
    },
    {
      label: 'التحديات المكتملة',
      value: completedChallenges,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      trend: '+15%'
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className={cn(
          "grid gap-8 lg:grid-cols-2 items-center",
          isRTL && "lg:grid-cols-2"
        )}>
          
          {/* Hero Content */}
          <div className={cn("space-y-6", isRTL && "text-right")}>
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Target className="w-3 h-3 mx-1" />
                منصة التحديات الابتكارية
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                استكشف التحديات
                <span className="text-primary block">الابتكارية</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                انضم إلى مجتمع المبدعين وساهم في حل التحديات المؤثرة في قطاعات مختلفة
              </p>
            </div>

            {/* Action Buttons */}
            <div className={cn(
              "flex flex-wrap gap-4",
              isRTL && "flex-row-reverse"
            )}>
              <Button size="lg" className="gap-2" onClick={onShowFilters}>
                <Search className="w-4 h-4" />
                استكشف التحديات
                <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
              </Button>

              {canCreateChallenge && hasRole('admin') && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2" 
                  onClick={onCreateChallenge}
                >
                  <Plus className="w-4 h-4" />
                  إنشاء تحدي جديد
                </Button>
              )}

              <Button variant="ghost" size="lg" className="gap-2">
                <Filter className="w-4 h-4" />
                الفلاتر المتقدمة
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Featured Challenge */}
            {featuredChallenge && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className={cn(
                    "flex items-center justify-between",
                    isRTL && "flex-row-reverse"
                  )}>
                    <CardTitle className="text-sm text-primary">التحدي المميز</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      مميز
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h3 className={cn(
                    "font-semibold text-foreground line-clamp-2",
                    isRTL && "text-right"
                  )}>
                    {featuredChallenge.title_ar}
                  </h3>
                  <div className={cn(
                    "flex items-center gap-4 text-sm text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      <Users className="w-3 h-3" />
                      <span>{featuredChallenge.participant_count} مشارك</span>
                    </div>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      <Clock className="w-3 h-3" />
                      <span>ينتهي قريباً</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = index === currentStat;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "transition-all duration-300 hover:shadow-md border-border/50",
                      isActive && "ring-2 ring-primary/20 shadow-lg"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className={cn(
                        "flex items-center gap-3",
                        isRTL && "flex-row-reverse"
                      )}>
                        <div className={cn(
                          "p-2 rounded-lg",
                          stat.bgColor
                        )}>
                          <Icon className={cn("w-4 h-4", stat.color)} />
                        </div>
                        <div className={cn("flex-1", isRTL && "text-right")}>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value.toLocaleString('ar-SA')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                      
                      {/* Trend Indicator */}
                      <div className={cn(
                        "mt-2 flex items-center gap-1",
                        isRTL && "flex-row-reverse"
                      )}>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">{stat.trend}</span>
                        <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <h4 className={cn(
                  "font-medium mb-3 text-foreground",
                  isRTL && "text-right"
                )}>
                  الإجراءات السريعة
                </h4>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "w-full justify-start gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    عرض التحديات المحفوظة
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "w-full justify-start gap-2",
                      isRTL && "flex-row-reverse justify-end"
                    )}
                  >
                    <Award className="w-4 h-4" />
                    إنجازاتي في التحديات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChallengesHero;